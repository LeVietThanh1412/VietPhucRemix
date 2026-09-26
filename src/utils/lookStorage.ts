import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS, HERITAGE_COLORS, PATTERNS, BOTTOMS, HEADWEAR, FOOTWEAR, ACCESSORIES, EVENTS } from '../data/heritageData';

const STORAGE_KEY = 'vietphuc-remix:current-look';
const URL_PARAM = 'look';

export const DEFAULT_LOOK: OutfitConfig = {
  garmentId: 'ao-ngu-than',
  colorId: 'lam-cham',
  patternId: 'van-may',
  bottomId: 'quan-lua-trang',
  headwearId: 'khan-van',
  footwearId: 'sneaker-trang',
  accessories: ['kinh-mat-y2k', 'tui-tote-cham'],
  targetEvent: 'ca-phe-dao-pho',
  modelGender: 'unisex',
  backdrop: 'pho-co'
};

const has = (list: { id: string }[], id: unknown) => typeof id === 'string' && list.some(i => i.id === id);

/** Validate untrusted input (URL / localStorage) against known catalog ids. */
function sanitize(raw: unknown): OutfitConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (!has(GARMENTS, r.garmentId)) return null;
  return {
    garmentId: r.garmentId as OutfitConfig['garmentId'],
    colorId: has(HERITAGE_COLORS, r.colorId) ? (r.colorId as OutfitConfig['colorId']) : DEFAULT_LOOK.colorId,
    patternId: has(PATTERNS, r.patternId) ? (r.patternId as OutfitConfig['patternId']) : DEFAULT_LOOK.patternId,
    bottomId: has(BOTTOMS, r.bottomId) ? (r.bottomId as OutfitConfig['bottomId']) : DEFAULT_LOOK.bottomId,
    headwearId: has(HEADWEAR, r.headwearId) ? (r.headwearId as OutfitConfig['headwearId']) : DEFAULT_LOOK.headwearId,
    footwearId: has(FOOTWEAR, r.footwearId) ? (r.footwearId as OutfitConfig['footwearId']) : DEFAULT_LOOK.footwearId,
    accessories: Array.isArray(r.accessories)
      ? (r.accessories.filter(a => has(ACCESSORIES, a)).slice(0, 3) as OutfitConfig['accessories'])
      : [],
    targetEvent: has(EVENTS, r.targetEvent) ? (r.targetEvent as OutfitConfig['targetEvent']) : DEFAULT_LOOK.targetEvent,
    modelGender: ['female', 'male', 'unisex'].includes(r.modelGender as string)
      ? (r.modelGender as OutfitConfig['modelGender'])
      : DEFAULT_LOOK.modelGender,
    backdrop: ['hoang-thanh', 'pho-co', 'studio-zen', 'hieu-anh'].includes(r.backdrop as string)
      ? (r.backdrop as OutfitConfig['backdrop'])
      : DEFAULT_LOOK.backdrop
  };
}

function toBase64Url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach(b => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}

const GENDERS = ['female', 'male', 'unisex'] as const;
const BACKDROPS = ['hoang-thanh', 'pho-co', 'studio-zen', 'hieu-anh'] as const;

/**
 * Compact token "1" + one base36 char per field (catalog index), accessories concatenated.
 * e.g. "1-1266222-47-3-2-1" → ~20 chars, keeps QR codes small.
 * Append-only catalogs: never reorder existing items or old links break.
 */
export function encodeLook(c: OutfitConfig): string {
  const idx = (list: { id: string }[], id: string) => Math.max(0, list.findIndex(i => i.id === id)).toString(36);
  return [
    '1',
    idx(GARMENTS, c.garmentId) +
      idx(HERITAGE_COLORS, c.colorId) +
      idx(PATTERNS, c.patternId) +
      idx(BOTTOMS, c.bottomId) +
      idx(HEADWEAR, c.headwearId) +
      idx(FOOTWEAR, c.footwearId),
    c.accessories.map(a => idx(ACCESSORIES, a)).join('') || '_',
    idx(EVENTS, c.targetEvent),
    Math.max(0, GENDERS.indexOf(c.modelGender)).toString(36),
    Math.max(0, BACKDROPS.indexOf(c.backdrop)).toString(36)
  ].join('-');
}

function decodeCompact(token: string): OutfitConfig | null {
  const parts = token.split('-');
  if (parts.length !== 6 || parts[0] !== '1' || parts[1].length !== 6) return null;
  const at = <T extends { id: string }>(list: T[], ch: string) => list[parseInt(ch, 36)]?.id;
  const core = parts[1];
  return sanitize({
    garmentId: at(GARMENTS, core[0]),
    colorId: at(HERITAGE_COLORS, core[1]),
    patternId: at(PATTERNS, core[2]),
    bottomId: at(BOTTOMS, core[3]),
    headwearId: at(HEADWEAR, core[4]),
    footwearId: at(FOOTWEAR, core[5]),
    accessories: parts[2] === '_' ? [] : [...parts[2]].map(ch => at(ACCESSORIES, ch)),
    targetEvent: at(EVENTS, parts[3]),
    modelGender: GENDERS[parseInt(parts[4], 36)],
    backdrop: BACKDROPS[parseInt(parts[5], 36)]
  });
}

export function decodeLook(token: string): OutfitConfig | null {
  try {
    if (token.startsWith('1-')) return decodeCompact(token);
    // Legacy: base64url JSON
    return sanitize(JSON.parse(fromBase64Url(token)));
  } catch {
    return null;
  }
}

/** Legacy encoder kept for tests/backward-compat. */
export function encodeLookLegacy(config: OutfitConfig): string {
  return toBase64Url(JSON.stringify(config));
}

export function buildShareUrl(config: OutfitConfig): string {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set(URL_PARAM, encodeLook(config));
  return url.toString();
}

export { sanitize as sanitizeLook };

/** Priority: shared URL > last saved look > default. */
export function loadInitialLook(): OutfitConfig {
  try {
    const token = new URLSearchParams(window.location.search).get(URL_PARAM);
    if (token) {
      const fromUrl = decodeLook(token);
      if (fromUrl) return fromUrl;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const fromStore = sanitize(JSON.parse(stored));
      if (fromStore) return fromStore;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_LOOK;
}

export function saveLook(config: OutfitConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    /* quota / private mode */
  }
}
