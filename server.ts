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
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const MAX_QUERY = 500;

app.set('trust proxy', true);
app.use(express.json({ limit: '16kb' }));

// ───────────── Gemini client ─────────────
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// ───────────── Simple in-memory rate limit (per IP) ─────────────
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
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

// ───────────── AI Stylist (grounded on app data) ─────────────
app.post('/api/ai-stylist', async (req, res) => {
  if (!ai) {
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
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `${context}\n\n<cau_hoi_nguoi_dung>\n${query}\n</cau_hoi_nguoi_dung>`,
      config: {
        systemInstruction: STYLIST_SYSTEM_PROMPT,
        temperature: 0.6,
        maxOutputTokens: 700
      }
    });

    const reply = response.text?.trim() || 'Outfit phối đồ của bạn rất ấn tượng và đậm chất di sản đương đại!';
    return res.json({ reply, model: GEMINI_MODEL });
  } catch (error: unknown) {
    console.error('Error in /api/ai-stylist:', error);
    return res.status(500).json({ error: 'Failed to generate styling advice' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ai: Boolean(ai), model: GEMINI_MODEL, publicUrl: publicBaseUrl(), time: new Date().toISOString() });
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
    console.log(`Gemini: ${ai ? `enabled (${GEMINI_MODEL})` : 'disabled – offline stylist fallback'}`);
  });
}

startServer();
