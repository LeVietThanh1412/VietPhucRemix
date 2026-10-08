import express from 'express';
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createKeyRotation, createRateLimiter, parseGeminiKeys } from './src/server/aiRuntime';
import { sanitizeLook } from './src/utils/lookStorage';
import { buildStylistContext, STYLIST_SYSTEM_PROMPT } from './src/utils/stylistContext';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) throw new Error('PORT must be an integer between 1 and 65535');
const IS_PROD = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const MAX_QUERY = 500;

// Only trust forwarded IPs when the deployment explicitly specifies its proxy hops.
const proxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
app.set('trust proxy', Number.isInteger(proxyHops) && proxyHops > 0 ? proxyHops : false);
app.use(express.json({ limit: '16kb' }));
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON payload' });
  if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'Payload too large' });
  if (err?.status >= 400 && err?.status < 500) return res.status(err.status).json({ error: 'Invalid request body' });
  next(err);
});

// ───────────── Gemini API Key Pool & Auto-Rotation ─────────────
const keyPool = parseGeminiKeys(process.env.GEMINI_API_KEYS, process.env.GEMINI_API_KEY);
interface KeyClient {
  client: GoogleGenAI;
}

const aiClients: KeyClient[] = [];
for (let i = 0; i < keyPool.length; i++) {
  const k = keyPool[i];
  try {
    aiClients.push({
      client: new GoogleGenAI({ apiKey: k })
    });
  } catch (err) {
    console.error(`[Key Pool] Lỗi khởi tạo client #${i + 1}:`, err);
  }
}

const rotate = createKeyRotation(aiClients);
const rateLimited = createRateLimiter();

async function generateContentWithRotation(prompt: string, systemInstruction: string, signal: AbortSignal) {
  return rotate(target => target.client.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      abortSignal: signal,
      httpOptions: { timeout: 20_000 },
      systemInstruction,
      temperature: 0.6,
      maxOutputTokens: 700
    }
  }), signal);
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
  try {
    const url = new URL(env || '');
    if (['http:', 'https:'].includes(url.protocol) && !url.username && !url.password) {
      url.search = '';
      url.hash = '';
      return { url: url.toString().replace(/\/+$/, ''), source: 'env' };
    }
  } catch { /* invalid APP_URL → use LAN fallback */ }
  const lan = lanAddress();
  if (lan) return { url: `http://${lan}:${PORT}`, source: 'lan' };
  return { url: '', source: 'none' };
}

app.get('/api/public-url', (_req, res) => {
  res.json(publicBaseUrl());
});

// ───────────── AI Stylist (grounded on app data with key rotation) ─────────────
app.post('/api/ai-stylist', async (req, res) => {
  if (req.body?.query !== undefined && typeof req.body.query !== 'string') return res.status(400).json({ error: 'Query must be a string' });
  const config = sanitizeLook(req.body?.config);
  if (!config) return res.status(400).json({ error: 'Invalid outfit config' });
  if (aiClients.length === 0) {
    return res.status(503).json({ error: 'Gemini API not configured. Falling back to local styling logic.' });
  }
  if (rateLimited(req.ip || 'unknown')) {
    return res.status(429).json({ error: 'Bạn hỏi hơi nhanh, vui lòng thử lại sau ít phút.' });
  }

  const query = String(req.body?.query || 'Hãy nhận xét và thẩm định outfit này')
    .replace(/[\u0000-\u001f]/g, ' ')
    .slice(0, MAX_QUERY);

  const disconnected = new AbortController();
  const onClose = () => { if (!res.writableEnded) disconnected.abort(); };
  res.on('close', onClose);
  const signal = AbortSignal.any([disconnected.signal, AbortSignal.timeout(20_000)]);
  try {
    const context = buildStylistContext(config);
    const prompt = `${context}\n\n<cau_hoi_nguoi_dung>\n${query}\n</cau_hoi_nguoi_dung>`;

    const response = await generateContentWithRotation(prompt, STYLIST_SYSTEM_PROMPT, signal);

    const reply = response.text?.trim();
    if (!reply) return res.status(502).json({ error: 'AI returned an empty response' });
    return res.json({ reply, model: GEMINI_MODEL });
  } catch (error: unknown) {
    if (disconnected.signal.aborted) return;
    if (signal.aborted) return res.status(504).json({ error: 'Styling advice timed out' });
    console.error('Error in /api/ai-stylist:', (error as Error)?.name);
    return res.status(502).json({ error: 'Failed to generate styling advice' });
  } finally {
    res.off('close', onClose);
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

app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found' }));

// ───────────── Frontend ─────────────
async function startServer() {
  if (IS_PROD) {
    app.use(express.static(path.resolve(__dirname, 'dist'), { maxAge: '7d', index: false, setHeaders: (res, file) => {
      if (file.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    } }));
    app.use('/assets', (_req, res) => res.status(404).end());
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
