import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS, HERITAGE_COLORS } from '../data/heritageData';
import { sanitizeLook } from './lookStorage';

export interface SavedLook {
  id: string;
  name: string;
  config: OutfitConfig;
  createdAt: string;
}

const KEY = 'vietphuc-remix:saved-looks';
export const MAX_SAVED = 12;

export function sameLook(a: OutfitConfig, b: OutfitConfig): boolean {
  return (
    a.garmentId === b.garmentId &&
    a.colorId === b.colorId &&
    a.patternId === b.patternId &&
    a.bottomId === b.bottomId &&
    a.headwearId === b.headwearId &&
    a.footwearId === b.footwearId &&
    a.targetEvent === b.targetEvent &&
    a.modelGender === b.modelGender &&
    a.backdrop === b.backdrop &&
    [...a.accessories].sort().join() === [...b.accessories].sort().join()
  );
}

export function defaultLookName(c: OutfitConfig): string {
  const g = GARMENTS.find(x => x.id === c.garmentId)?.name.split(' (')[0] ?? 'Look';
  const color = HERITAGE_COLORS.find(x => x.id === c.colorId)?.name.split(' (')[0] ?? '';
  return `${g} · ${color}`.trim();
}

export function loadSavedLooks(): SavedLook[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw
      .map((r): SavedLook | null => {
        const config = sanitizeLook(r?.config);
        if (!config || typeof r.id !== 'string') return null;
        return {
          id: r.id,
          name: typeof r.name === 'string' && r.name.trim() ? r.name.slice(0, 60) : defaultLookName(config),
          config,
          createdAt: typeof r.createdAt === 'string' ? r.createdAt : new Date().toISOString()
        };
      })
      .filter((x): x is SavedLook => x !== null)
      .slice(0, MAX_SAVED);
  } catch {
    return [];
  }
}

export function persistSavedLooks(list: SavedLook[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_SAVED)));
  } catch {
    /* quota / private mode */
  }
}

export function newSavedLook(config: OutfitConfig, name?: string): SavedLook {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    name: (name?.trim() || defaultLookName(config)).slice(0, 60),
    config: { ...config, accessories: [...config.accessories] },
    createdAt: new Date().toISOString()
  };
}
