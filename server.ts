import express from 'express';
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { sanitizeLook } from './src/utils/lookStorage';
import { buildStylistContext, STYLIST_SYSTEM_PROMPT } from './src/utils/stylistContext';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const MAX_QUERY = 500;

app.set('trust proxy', true);
app.use(express.json({ limit: '16kb' }));

// ───────────── Gemini API Key Pool & Auto-Rotation ─────────────
function parseGeminiKeys(): string[] {
  const rawList = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
  return rawList
    .split(/[\n,;]+/)
    .map(k => k.trim().replace(/^["']|["']$/g, ''))
    .filter(k => k && k !== 'MY_GEMINI_API_KEY' && k !== 'MY_GEMINI_API_KEYS');
}

const keyPool = parseGeminiKeys();
interface KeyClient {
  key: string;
  client: GoogleGenAI;
  label: string;
}

const aiClients: KeyClient[] = [];
for (let i = 0; i < keyPool.length; i++) {
  const k = keyPool[i];
  try {
    const masked = k.length > 10 ? `${k.slice(0, 6)}...${k.slice(-4)}` : '***';
    aiClients.push({
      key: k,
      client: new GoogleGenAI({ apiKey: k }),
      label: `Account #${i + 1} (${masked})`
    });
  } catch (err) {
    console.error(`[Key Pool] Lỗi khởi tạo client #${i + 1}:`, err);
  }
}

let currentClientIndex = 0;

/** Round-robin key execution with automatic failover across keys on 429/quota limits */
async function generateContentWithRotation(prompt: string, systemInstruction: string) {
  if (aiClients.length === 0) {
    throw new Error('NO_API_KEYS');
  }

  const maxAttempts = aiClients.length;
  let lastError: any = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const idx = (currentClientIndex + attempt) % aiClients.length;
    const target = aiClients[idx];

    try {
      const response = await target.client.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.6,
          maxOutputTokens: 700
        }
      });

      // Advance round-robin pointer for next incoming request
      currentClientIndex = (idx + 1) % aiClients.length;
      return { response, usedAccount: target.label };
    } catch (err: any) {
      lastError = err;
      const isQuotaOrRateLimit =
        err?.status === 429 ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('quota') ||
        err?.message?.includes('rate limit');

      console.warn(`[Key Rotation] ${target.label} gặp lỗi (${isQuotaOrRateLimit ? 'Hết Quota/Rate Limit' : 'Lỗi gọi API'}). Đang tự động chuyển sang tài khoản kế tiếp...`);
    }
  }

  throw lastError;
}

// ───────────── Simple in-memory rate limit (per IP) ─────────────
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 15; // Increased per-IP limit since pool has multiple keys
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > MAX_PER_WINDOW;
}

// ───────────── Public URL (for QR codes / share links) ─────────────
function lanAddress(): string | null {
  for (const list of Object.values(os.networkInterfaces())) {
    for (const i of list || []) {
      if (i.family === 'IPv4' && !i.internal && !i.address.startsWith('169.254.')) return i.address;
    }
  }
  return null;
}

function publicBaseUrl(): { url: string; source: 'env' | 'lan' | 'none' } {
  const env = process.env.APP_URL?.trim();
  if (env && env !== 'MY_APP_URL' && /^https?:\/\//.test(env)) return { url: env.replace(/\/+$/, ''), source: 'env' };
  const lan = lanAddress();
  if (lan) return { url: `http://${lan}:${PORT}`, source: 'lan' };
  return { url: '', source: 'none' };
}

app.get('/api/public-url', (_req, res) => {
  res.json(publicBaseUrl());
});

// ───────────── AI Stylist (grounded on app data with key rotation) ─────────────
app.post('/api/ai-stylist', async (req, res) => {
  if (aiClients.length === 0) {
    return res.status(503).json({ error: 'Gemini API not configured. Falling back to local styling logic.' });
  }
  if (rateLimited(req.ip || 'unknown')) {
    return res.status(429).json({ error: 'Bạn hỏi hơi nhanh, vui lòng thử lại sau ít phút.' });
  }

  const config = sanitizeLook(req.body?.config);
  if (!config) return res.status(400).json({ error: 'Invalid outfit config' });
  const query = String(req.body?.query || 'Hãy nhận xét và thẩm định outfit này')
    .replace(/[\u0000-\u001f]/g, ' ')
    .slice(0, MAX_QUERY);

  try {
    const context = buildStylistContext(config);
    const prompt = `${context}\n\n<cau_hoi_nguoi_dung>\n${query}\n</cau_hoi_nguoi_dung>`;

    const { response, usedAccount } = await generateContentWithRotation(prompt, STYLIST_SYSTEM_PROMPT);

    const reply = response.text?.trim() || 'Outfit phối đồ của bạn rất ấn tượng và đậm chất di sản đương đại!';
    return res.json({ reply, model: GEMINI_MODEL, account: usedAccount });
  } catch (error: unknown) {
    console.error('Error in /api/ai-stylist after trying key pool:', error);
    return res.status(500).json({ error: 'Failed to generate styling advice' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    ai: aiClients.length > 0,
    totalKeys: aiClients.length,
    model: GEMINI_MODEL,
    publicUrl: publicBaseUrl(),
    time: new Date().toISOString()
  });
});

// ───────────── Frontend ─────────────
async function startServer() {
  if (IS_PROD) {
    app.use(express.static(path.resolve(__dirname, 'dist'), { maxAge: '7d', index: false }));
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    const pub = publicBaseUrl();
    console.log(`Server listening on http://localhost:${PORT} (${IS_PROD ? 'production' : 'dev'})`);
    if (pub.url) console.log(`Share links / QR codes will use: ${pub.url} [${pub.source}]`);
    console.log(`Gemini: ${aiClients.length > 0 ? `enabled (${aiClients.length} accounts in rotation pool, model: ${GEMINI_MODEL})` : 'disabled – offline stylist fallback'}`);
  });
}

startServer();
