import React from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { MAX_SAVED, SAVED_LOOKS_KEY, SavedLook, loadSavedLooks, mutateSavedLooks, newSavedLook, sameLook } from '../utils/savedLooks';

export type SaveResult = 'saved' | 'duplicate' | 'full' | 'error';
export const STORAGE_ERROR = 'Không lưu được Tủ đồ. Hãy kiểm tra quyền lưu trữ hoặc dung lượng trình duyệt rồi thử lại.';

export function useSavedLooks() {
  const [looks, setLooks] = React.useState<SavedLook[]>(loadSavedLooks);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SAVED_LOOKS_KEY || e.key === null) setLooks(loadSavedLooks());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = React.useCallback(async <T,>(mutation: (current: SavedLook[]) => { looks: SavedLook[]; result: T }): Promise<T | 'error'> => {
    try {
      const next = await mutateSavedLooks(mutation);
      setLooks(next.looks);
      setError(null);
      return next.result;
    } catch {
      setError(STORAGE_ERROR);
      return 'error';
    }
  }, []);

  const save = React.useCallback((config: OutfitConfig, name?: string): Promise<SaveResult> => {
    const snapshot = newSavedLook(config, name);
    return update<SaveResult>(current => {
      if (current.some(l => sameLook(l.config, snapshot.config))) return { looks: current, result: 'duplicate' };
      if (current.length >= MAX_SAVED) return { looks: current, result: 'full' };
      return { looks: [snapshot, ...current], result: 'saved' };
    });
  }, [update]);

  const remove = React.useCallback((id: string) => update(current => ({ looks: current.filter(l => l.id !== id), result: undefined })), [update]);
  const rename = React.useCallback((id: string, name: string) => update(current => ({
    looks: current.map(l => l.id === id ? { ...l, name: name.trim().slice(0, 60) || l.name } : l), result: undefined
  })), [update]);
  const isSaved = React.useCallback((config: OutfitConfig) => looks.some(l => sameLook(l.config, config)), [looks]);
  return { looks, save, remove, rename, isSaved, error, max: MAX_SAVED };
}
