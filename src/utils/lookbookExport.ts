import QRCode from 'qrcode';
import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS } from '../data/heritageData';
import { LookMetrics, computeLookMetrics, overallScore } from './lookMetrics';

export type ExportFormat = 'story' | 'post';

export const FORMAT_SIZE: Record<ExportFormat, { w: number; h: number; label: string }> = {
  story: { w: 1080, h: 1920, label: 'Story 9:16' },
  post: { w: 1080, h: 1350, label: 'Post 4:5' }
};

const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Plus Jakarta Sans", system-ui, sans-serif';
const INK = '#1C1917';
const MUTED = '#57534E';
const ACCENT = '#78350F';
const PAPER = '#FAF7F2';
const LINE = '#D6CEBE';

const AUTH_LABEL = { documented: 'CÓ TƯ LIỆU', reconstructed: 'PHỎNG DỰNG', modern: 'CÁCH TÂN CẬN ĐẠI' } as const;

// ───────────────────────── helpers ─────────────────────────

// Google Fonts split Vietnamese glyphs into a separate unicode-range subset; it is only
// fetched when text in that range is requested, so pass a Vietnamese sample explicitly.
const VI_SAMPLE = 'ĂăÂâĐđÊêÔôƠơƯư ẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹ';

export async function ensureFonts(): Promise<void> {
  if (!document.fonts?.load) return;
  const fonts = [`700 64px ${SERIF}`, `italic 400 32px ${SERIF}`, `400 28px ${SANS}`, `600 28px ${SANS}`, `700 28px ${SANS}`];
  await Promise.allSettled(fonts.flatMap(f => [document.fonts.load(f, 'Aa'), document.fonts.load(f, VI_SAMPLE)]));
}

/** Canvas shapes combining marks better when text is NFC-composed. */
const nfc = (s: string) => s.normalize('NFC');

/** Rasterize a rendered <svg> (always full-body viewBox) into an image. */
export function svgToImage(svg: SVGSVGElement): Promise<HTMLImageElement> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('viewBox', '0 0 600 800');
  clone.setAttribute('width', '1200');
  clone.setAttribute('height', '1600');
  clone.removeAttribute('class');
  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = e => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Word-wrap with max lines + ellipsis. Returns y after last line. */
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
  maxLines = 99
): number {
  const words = nfc(text).split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  const out = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    let last = out[maxLines - 1];
    while (ctx.measureText(last + '…').width > maxW && last.length) last = last.slice(0, -1);
    out[maxLines - 1] = last.trimEnd() + '…';
  }
  out.forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  return y + out.length * lineH;
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number, font: (s: number) => string, start: number, min: number) {
  let s = start;
  ctx.font = font(s);
  while (ctx.measureText(text).width > maxW && s > min) {
    s -= 2;
    ctx.font = font(s);
  }
  return s;
}

function drawQR(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number) {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size;
  const quiet = 2;
  const cell = size / (n + quiet * 2);
  ctx.fillStyle = '#FFFFFF';
  rr(ctx, x - 8, y - 8, size + 16, size + 16, 14);
  ctx.fill();
  ctx.fillStyle = INK;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.modules.get(r, c)) {
        ctx.fillRect(Math.floor(x + (c + quiet) * cell), Math.floor(y + (r + quiet) * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }
  }
}

function pill(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, h: number, bg: string, fg: string, fontPx: number) {
  ctx.font = `700 ${fontPx}px ${SANS}`;
  const w = ctx.measureText(text).width + h * 0.9;
  ctx.fillStyle = bg;
  rr(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + h * 0.45, y + h / 2 + 1);
  ctx.textBaseline = 'alphabetic';
  return w;
}

function scoreColor(v: number) {
  return v >= 90 ? ['#D1FAE5', '#065F46'] : v >= 70 ? ['#FEF3C7', '#92400E'] : ['#FEE2E2', '#991B1B'];
}

function paperBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  // dotted texture
  ctx.fillStyle = 'rgba(120,53,15,0.05)';
  for (let y = 12; y < h; y += 28) for (let x = 12; x < w; x += 28) ctx.fillRect(x, y, 2, 2);
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, w - 56, h - 56);
}

function header(ctx: CanvasRenderingContext2D, w: number, y: number, sub: string) {
  ctx.textAlign = 'center';
  ctx.fillStyle = INK;
  ctx.font = `700 60px ${SERIF}`;
  ctx.fillText('VIỆT PHỤC REMIX', w / 2, y);
  ctx.fillStyle = ACCENT;
  ctx.font = `600 22px ${SANS}`;
  ctx.fillText(sub, w / 2, y + 40);
  ctx.textAlign = 'left';
}

// ───────────────────────── single lookbook card ─────────────────────────

export interface CardOptions {
  format: ExportFormat;
  config: OutfitConfig;
  mannequin: HTMLImageElement;
  shareUrl: string;
  title?: string;
}

export async function renderLookbookCard(opts: CardOptions): Promise<HTMLCanvasElement> {
  await ensureFonts();
  const { w, h } = FORMAT_SIZE[opts.format];
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const m = computeLookMetrics(opts.config);
  const g = GARMENTS.find(x => x.id === opts.config.garmentId)!;
  const title = nfc(opts.title?.trim() || g.name);

  paperBackground(ctx, w, h);

  if (opts.format === 'story') {
    header(ctx, w, 120, 'LOOKBOOK DI SẢN · GEN Z EDITION');
    // mannequin — sized so title + specs + scores end above the QR footer band (~y=1560)
    const mw = 640, mh = mw * (4 / 3), mx = (w - mw) / 2, my = 190;
    ctx.save();
    rr(ctx, mx, my, mw, mh, 36);
    ctx.clip();
    ctx.drawImage(opts.mannequin, mx, my, mw, mh);
    ctx.restore();
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    rr(ctx, mx, my, mw, mh, 36);
    ctx.stroke();

    let y = my + mh + 82;
    ctx.textAlign = 'center';
    ctx.fillStyle = INK;
    fitText(ctx, title, w - 160, s => `700 ${s}px ${SERIF}`, 68, 40);
    ctx.fillText(title, w / 2, y);
    y += 46;
    ctx.fillStyle = MUTED;
    const sub = nfc(`${g.dynasty} · ${AUTH_LABEL[g.authenticity]}`);
    fitText(ctx, sub, w - 180, s => `italic 400 ${s}px ${SERIF}`, 30, 20);
    ctx.fillText(sub, w / 2, y);
    ctx.textAlign = 'left';

    y += 58;
    drawSpecs(ctx, m, 110, y, w - 220, 28, 42);
    y += 42 * 5 - 6;
    drawScores(ctx, m, 110, y, 50, 23);

    drawFooter(ctx, w, h, opts.shareUrl, g.culturalSignificance, 230);
  } else {
    header(ctx, w, 110, 'LOOKBOOK DI SẢN · GEN Z EDITION');
    const mw = 470, mh = mw * (4 / 3), mx = 70, my = 190;
    ctx.save();
    rr(ctx, mx, my, mw, mh, 28);
    ctx.clip();
    ctx.drawImage(opts.mannequin, mx, my, mw, mh);
    ctx.restore();
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    rr(ctx, mx, my, mw, mh, 28);
    ctx.stroke();

    const cx = mx + mw + 50, cw = w - cx - 70;
    let y = my + 50;
    ctx.fillStyle = INK;
    const size = fitText(ctx, title, cw, s => `700 ${s}px ${SERIF}`, 54, 34);
    y = wrap(ctx, title, cx, y, cw, size * 1.05, 2);
    ctx.font = `italic 400 26px ${SERIF}`;
    ctx.fillStyle = MUTED;
    y = wrap(ctx, g.dynasty, cx, y + 4, cw, 30, 2);
    y += 6;
    pill(ctx, AUTH_LABEL[g.authenticity], cx, y, 36, '#E7E5E4', '#44403C', 16);
    y += 70;
    drawSpecs(ctx, m, cx, y, cw, 22, 34, true);
    y += 34 * 6 + 10;
    drawScores(ctx, m, cx, y, 42, 19, cw);

    drawFooter(ctx, w, h, opts.shareUrl, g.culturalSignificance, 190);
  }
  return canvas;
}

function drawSpecs(ctx: CanvasRenderingContext2D, m: LookMetrics, x: number, y: number, maxW: number, fs: number, lh: number, compact = false) {
  const rows: [string, string][] = [
    ['Màu', `${m.labels.color} · hành ${m.labels.element}`],
    ['Hạ y', m.labels.bottom],
    ['Khăn/nón', m.labels.headwear],
    ['Giày', m.labels.footwear],
    ['Phụ kiện', m.labels.accessories]
  ];
  if (compact) rows.push(['Dịp', m.labels.event]);
  const labelW = fs * 5.2;
  rows.forEach(([k, v], i) => {
    const yy = y + i * lh;
    ctx.font = `700 ${fs * 0.8}px ${SANS}`;
    ctx.fillStyle = ACCENT;
    ctx.fillText(k.toUpperCase(), x, yy);
    ctx.font = `400 ${fs}px ${SANS}`;
    ctx.fillStyle = INK;
    if (i === 0) {
      ctx.fillStyle = m.labels.colorHex;
      ctx.beginPath();
      ctx.arc(x + labelW + fs * 0.45, yy - fs * 0.35, fs * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = INK;
      wrap(ctx, v, x + labelW + fs * 1.3, yy, maxW - labelW - fs * 1.3, lh, 1);
    } else {
      wrap(ctx, v, x + labelW, yy, maxW - labelW, lh, 1);
    }
  });
}

function drawScores(ctx: CanvasRenderingContext2D, m: LookMetrics, x: number, y: number, h: number, fs: number, maxW = 9999) {
  const items: [string, number][] = [
    ['Văn hóa', m.cultural],
    ['Màu sắc', m.harmony],
    ['Hợp dịp', m.eventFit]
  ];
  let cx = x;
  let cy = y;
  for (const [k, v] of items) {
    const [bg, fg] = scoreColor(v);
    ctx.font = `700 ${fs}px ${SANS}`;
    const wEst = ctx.measureText(`${k} ${v}`).width + h * 0.9;
    if (cx + wEst > x + maxW) {
      cx = x;
      cy += h + 12;
    }
    cx += pill(ctx, `${k} ${v}`, cx, cy, h, bg, fg, fs) + 14;
  }
}

function drawFooter(ctx: CanvasRenderingContext2D, w: number, h: number, url: string, note: string, qrSize: number) {
  const pad = 70;
  const bandH = qrSize + 70;
  const by = h - pad - bandH + 10;
  ctx.fillStyle = '#F2EBDD';
  rr(ctx, pad - 10, by, w - (pad - 10) * 2, bandH, 24);
  ctx.fill();

  const qx = w - pad - qrSize - 10, qy = by + 35;
  drawQR(ctx, url, qx, qy, qrSize);

  const tx = pad + 20, tw = qx - tx - 40;
  let y = by + 70;
  ctx.fillStyle = INK;
  ctx.font = `700 ${Math.round(qrSize * 0.14)}px ${SANS}`;
  ctx.fillText('Quét mã để mặc thử look này', tx, y);
  y += qrSize * 0.18;
  ctx.fillStyle = MUTED;
  ctx.font = `italic 400 ${Math.round(qrSize * 0.13)}px ${SERIF}`;
  wrap(ctx, `“${note}”`, tx, y, tw, qrSize * 0.155, 3);
  ctx.fillStyle = ACCENT;
  ctx.font = `600 ${Math.round(qrSize * 0.1)}px ${SANS}`;
  ctx.fillText('#VietPhucRemix · Tôn vinh di sản, tự hào bản sắc', tx, by + bandH - 30);
}

// ───────────────────────── comparison sheet ─────────────────────────

export interface CompareEntry {
  name: string;
  config: OutfitConfig;
  mannequin: HTMLImageElement;
}

export async function renderComparisonSheet(entries: CompareEntry[]): Promise<HTMLCanvasElement> {
  await ensureFonts();
  const w = 1080, h = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  paperBackground(ctx, w, h);
  header(ctx, w, 100, 'SO SÁNH PHƯƠNG ÁN PHỐI ĐỒ');

  const n = entries.length;
  const gap = 28, pad = 64;
  const colW = (w - pad * 2 - gap * (n - 1)) / n;
  const metrics = entries.map(e => computeLookMetrics(e.config));
  const totals = metrics.map(overallScore);
  const best = totals.indexOf(Math.max(...totals));

  entries.forEach((e, i) => {
    const x = pad + i * (colW + gap);
    const m = metrics[i];
    const y0 = 170;
    const mh = colW * (4 / 3);
    ctx.save();
    rr(ctx, x, y0, colW, mh, 22);
    ctx.clip();
    ctx.drawImage(e.mannequin, x, y0, colW, mh);
    ctx.restore();
    ctx.lineWidth = i === best ? 5 : 2;
    ctx.strokeStyle = i === best ? ACCENT : LINE;
    rr(ctx, x, y0, colW, mh, 22);
    ctx.stroke();
    if (i === best) pill(ctx, '★ NỔI BẬT', x + 14, y0 + 14, 34, ACCENT, '#FFFFFF', 15);

    let y = y0 + mh + 46;
    ctx.fillStyle = INK;
    const fs = fitText(ctx, e.name, colW, s => `700 ${s}px ${SERIF}`, 36, 22);
    y = wrap(ctx, e.name, x, y, colW, fs * 1.1, 2);
    ctx.font = `400 18px ${SANS}`;
    ctx.fillStyle = MUTED;
    y = wrap(ctx, `${m.labels.color} · ${m.labels.bottom}`, x, y + 2, colW, 24, 2);
    y = wrap(ctx, `${m.labels.footwear}`, x, y, colW, 24, 1);

    y += 20;
    const rows: [string, number][] = [
      ['Tổng', totals[i]],
      ['Văn hóa', m.cultural],
      ['Màu sắc', m.harmony],
      ['Hợp dịp', m.eventFit],
      ['Trang trọng', m.formality],
      ['Truyền thống', m.traditional]
    ];
    rows.forEach(([k, v], r) => {
      const yy = y + r * 40;
      ctx.font = `600 17px ${SANS}`;
      ctx.fillStyle = MUTED;
      ctx.fillText(k, x, yy + 18);
      const bw = colW * 0.38, bx = x + colW - bw;
      ctx.fillStyle = '#E7E5E4';
      rr(ctx, bx, yy + 4, bw, 16, 8);
      ctx.fill();
      ctx.fillStyle = r === 0 ? ACCENT : scoreColor(v)[1];
      rr(ctx, bx, yy + 4, Math.max(16, (bw * v) / 100), 16, 8);
      ctx.fill();
      ctx.font = `700 18px ${SANS}`;
      ctx.fillStyle = INK;
      ctx.textAlign = 'right';
      ctx.fillText(String(v), bx - 10, yy + 18);
      ctx.textAlign = 'left';
    });
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = ACCENT;
  ctx.font = `600 20px ${SANS}`;
  ctx.fillText('#VietPhucRemix · Tôn vinh di sản, tự hào bản sắc', w / 2, h - 60);
  ctx.textAlign = 'left';
  return canvas;
}

// ───────────────────────── output ─────────────────────────

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Web Share API with image file (mobile). Returns false if unsupported → caller should download. */
export async function shareImage(blob: Blob, filename: string, text: string, url: string): Promise<boolean> {
  const file = new File([blob], filename, { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (!nav.share || !nav.canShare?.({ files: [file] })) return false;
  try {
    await nav.share({ files: [file], title: 'Việt Phục Remix', text: `${text}\n${url}` });
    return true;
  } catch (e) {
    // user cancelled → treat as handled
    return (e as Error).name === 'AbortError';
  }
}

const GARMENT_TAG: Record<OutfitConfig['garmentId'], string> = {
  'ao-tac': '#AoTac',
  'ao-ngu-than': '#AoNguThan',
  'ao-tu-than': '#AoTuThan',
  'ao-nhat-binh': '#AoNhatBinh',
  'ao-giao-linh': '#AoGiaoLinh',
  'ao-dai-tan-thoi': '#AoDaiLemur'
};

export function buildCaption(config: OutfitConfig, title?: string): string {
  const m = computeLookMetrics(config);
  const g = GARMENTS.find(x => x.id === config.garmentId)!;
  const name = title?.trim() || g.name;
  return [
    `✨ ${name}`,
    `${m.labels.color} · ${m.labels.bottom} · ${m.labels.footwear}`,
    `📍 Dịp: ${m.labels.event}`,
    `📜 ${g.shortDesc}`,
    `🛡️ Điểm tôn trọng văn hóa: ${m.cultural}/100`,
    '',
    `#VietPhucRemix #VietPhuc #CoPhucViet ${GARMENT_TAG[config.garmentId]} #GenZ`
  ].join('\n');
}

export function slug(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}
