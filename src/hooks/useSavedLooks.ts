import React from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { MAX_SAVED, SavedLook, loadSavedLooks, newSavedLook, persistSavedLooks, sameLook } from '../utils/savedLooks';

export type SaveResult = 'saved' | 'duplicate' | 'full';

export function useSavedLooks() {
  const [looks, setLooks] = React.useState<SavedLook[]>(loadSavedLooks);

  React.useEffect(() => {
    persistSavedLooks(looks);
  }, [looks]);

  // Sync across tabs
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'vietphuc-remix:saved-looks') setLooks(loadSavedLooks());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const save = React.useCallback(
    (config: OutfitConfig, name?: string): SaveResult => {
      if (looks.some(l => sameLook(l.config, config))) return 'duplicate';
      if (looks.length >= MAX_SAVED) return 'full';
      setLooks(prev => [newSavedLook(config, name), ...prev]);
      return 'saved';
    },
    [looks]
  );

  const remove = React.useCallback((id: string) => setLooks(prev => prev.filter(l => l.id !== id)), []);

  const rename = React.useCallback(
    (id: string, name: string) =>
      setLooks(prev => prev.map(l => (l.id === id ? { ...l, name: name.trim().slice(0, 60) || l.name } : l))),
    []
  );

  const isSaved = React.useCallback((config: OutfitConfig) => looks.some(l => sameLook(l.config, config)), [looks]);

  return { looks, save, remove, rename, isSaved, max: MAX_SAVED };
}
