import { useCallback, useEffect, useState } from 'react';
import { TEMPLATES } from './templateData';
import type { MagazineTemplate } from './types';

/**
 * Stands in for a real template-catalog API call. Wrapped in the same
 * loading/error/retry shape a real fetch would use, so swapping in a network
 * call later doesn't require touching any consumer of this hook.
 */
function fetchTemplateCatalog(): Promise<MagazineTemplate[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(TEMPLATES), 350);
  });
}

export function useTemplateLibrary() {
  const [templates, setTemplates] = useState<MagazineTemplate[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchTemplateCatalog()
      .then((data) => {
        if (!cancelled) setTemplates(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load templates.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { templates, isLoading, error, retry };
}
