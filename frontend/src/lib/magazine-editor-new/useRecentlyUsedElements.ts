import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'printalarm.magazineEditor.recentElementIds';
const MAX_RECENT = 8;

function readStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

/** Recently-used *library catalog* ids (not on-canvas element ids) — mirrors
 * useRecentlyUsedTemplates. Stores ids only, never duplicates element data. */
export function useRecentlyUsedElements() {
  const [recentIds, setRecentIds] = useState<string[]>(() => readStored());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentIds));
    } catch {
      // best-effort convenience feature only
    }
  }, [recentIds]);

  const recordUsed = useCallback((libraryItemId: string) => {
    setRecentIds((prev) => [libraryItemId, ...prev.filter((id) => id !== libraryItemId)].slice(0, MAX_RECENT));
  }, []);

  return { recentIds, recordUsed };
}
