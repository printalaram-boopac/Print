import { useCallback, useEffect, useState } from 'react';
import type { MagazineTemplate } from '../types';
import { loadAllTemplates } from '../templates';

interface TemplateCollectionState {
  /** Built templates keyed by slug; empty until the collection resolves. */
  bySlug: Record<string, MagazineTemplate>;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Loads template page data on demand.
 *
 * The library renders its header, search, filters and card skeletons from the
 * static index first; this hook then pulls the (much larger) page data in one
 * dynamic import so the route is interactive immediately.
 */
export function useTemplateCollection(): TemplateCollectionState {
  const [bySlug, setBySlug] = useState<Record<string, MagazineTemplate>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    loadAllTemplates()
      .then((templates) => {
        if (cancelled) return;
        const map: Record<string, MagazineTemplate> = {};
        for (const tpl of templates) map[tpl.slug] = tpl;
        setBySlug(map);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('The template designs could not be loaded.');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { bySlug, loading, error, retry };
}
