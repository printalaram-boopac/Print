import { useCallback, useEffect, useState } from 'react';
import type { PageBackground } from './types';

const STORAGE_KEY = 'printalarm.magazineEditor.recentBackgrounds';
const MAX_RECENT = 8;

function readStored(): PageBackground[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sameBackground(a: PageBackground, b: PageBackground): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Stores full lightweight background snapshots (not just an id) since a
 * custom solid colour or gradient tweak isn't drawn from a fixed catalog —
 * unlike templates/elements, which only ever need to remember a catalog id. */
export function useRecentlyUsedBackgrounds() {
  const [recent, setRecent] = useState<PageBackground[]>(() => readStored());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    } catch {
      // best-effort convenience feature only
    }
  }, [recent]);

  const recordUsed = useCallback((bg: PageBackground) => {
    if (bg.type === 'none') return;
    setRecent((prev) => [bg, ...prev.filter((b) => !sameBackground(b, bg))].slice(0, MAX_RECENT));
  }, []);

  return { recent, recordUsed };
}
