import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'printalarm.magazineEditor.recentTemplateIds';
const MAX_RECENT = 6;

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

/** Recently-applied template ids, persisted locally until a backend exists. */
export function useRecentlyUsedTemplates() {
  const [recentIds, setRecentIds] = useState<string[]>(() => readStored());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentIds));
    } catch {
      // localStorage unavailable (private mode, quota) — recently-used is a
      // convenience feature, fail silently rather than breaking the editor.
    }
  }, [recentIds]);

  const recordUsed = useCallback((templateId: string) => {
    setRecentIds((prev) => [templateId, ...prev.filter((id) => id !== templateId)].slice(0, MAX_RECENT));
  }, []);

  return { recentIds, recordUsed };
}
