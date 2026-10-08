import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS } from '../data/heritageData';
import { LAYER_KEYS, sanitizeLook } from './lookStorage';
import { effectiveColor, normalizeHex } from './outfitColor';

export interface SavedLook {
  id: string;
  name: string;
  config: OutfitConfig;
  createdAt: string;
}

export const SAVED_LOOKS_KEY = 'vietphuc-remix:saved-looks';
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
    normalizeHex(a.customColorHex) === normalizeHex(b.customColorHex) &&
    LAYER_KEYS.every(k => (a.layerVisibility?.[k] !== false) === (b.layerVisibility?.[k] !== false)) &&
    [...a.accessories].sort().join() === [...b.accessories].sort().join()
  );
}

export function defaultLookName(c: OutfitConfig): string {
  const g = GARMENTS.find(x => x.id === c.garmentId)?.name.split(' (')[0] ?? 'Look';
  const color = effectiveColor(c).name.split(' (')[0];
  return `${g} · ${color}`.trim();
}

function readSavedLooks(): SavedLook[] {
  const stored = localStorage.getItem(SAVED_LOOKS_KEY);
  let raw: unknown;
  try { raw = JSON.parse(stored || '[]'); } catch { return []; }
  if (!Array.isArray(raw)) return [];
  const ids = new Set<string>();
  return raw
    .map((r): SavedLook | null => {
      const config = sanitizeLook(r?.config);
      if (!config || typeof r.id !== 'string' || !r.id.trim() || ids.has(r.id)) return null;
      ids.add(r.id);
      return {
        id: r.id,
        name: typeof r.name === 'string' && r.name.trim() ? r.name.trim().slice(0, 60) : defaultLookName(config),
        config,
        createdAt: typeof r.createdAt === 'string' ? r.createdAt : new Date().toISOString()
      };
    })
    .filter((x): x is SavedLook => x !== null)
    .slice(0, MAX_SAVED);
}

export function loadSavedLooks(): SavedLook[] {
  try {
    return readSavedLooks();
  } catch {
    return [];
  }
}

export function persistSavedLooks(list: SavedLook[]): void {
  localStorage.setItem(SAVED_LOOKS_KEY, JSON.stringify(list.slice(0, MAX_SAVED)));
}

let lockDatabase: Promise<IDBDatabase> | undefined;
function openLockDatabase(): Promise<IDBDatabase> {
  return lockDatabase ??= new Promise((resolve, reject) => {
    const request = indexedDB.open('vietphuc-remix:storage-lock', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('writes');
    request.onerror = () => { lockDatabase = undefined; reject(request.error); };
    request.onblocked = () => { lockDatabase = undefined; reject(new Error('Storage lock blocked')); };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => { db.close(); lockDatabase = undefined; };
      resolve(db);
    };
  });
}

// Read inside the lock: a tab's React state can lag behind another tab's write.
// On HTTP LAN origins Web Locks are unavailable, so use an IndexedDB write
// transaction as a cross-tab mutex. The localStorage read/write stays synchronous
// inside its request handler, before the transaction can release the lock.
export async function mutateSavedLooks<T>(mutation: (current: SavedLook[]) => { looks: SavedLook[]; result: T }): Promise<{ looks: SavedLook[]; result: T }> {
  const run = () => {
    const current = readSavedLooks();
    const next = mutation(current);
    if (next.looks !== current) persistSavedLooks(next.looks);
    return next;
  };
  if (typeof navigator !== 'undefined' && navigator.locks) {
    return navigator.locks.request(SAVED_LOOKS_KEY, async () => run());
  }
  if (typeof indexedDB !== 'undefined') {
    let db: IDBDatabase;
    try { db = await openLockDatabase(); }
    catch { return run(); } // Some privacy modes permit localStorage but disable IndexedDB.
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('writes', 'readwrite');
      let next: ReturnType<typeof run>;
      let failure: unknown;
      transaction.objectStore('writes').get(SAVED_LOOKS_KEY).onsuccess = () => {
        try { next = run(); }
        catch (error) { failure = error; transaction.abort(); }
      };
      transaction.oncomplete = () => resolve(next);
      transaction.onabort = () => reject(failure ?? transaction.error ?? new Error('Storage write aborted'));
      transaction.onerror = () => reject(transaction.error);
    });
  }
  return run();
}

export function newSavedLook(config: OutfitConfig, name?: string): SavedLook {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    name: (name?.trim() || defaultLookName(config)).slice(0, 60),
    config: { ...config, accessories: [...config.accessories], layerVisibility: config.layerVisibility ? { ...config.layerVisibility } : undefined },
    createdAt: new Date().toISOString()
  };
}
