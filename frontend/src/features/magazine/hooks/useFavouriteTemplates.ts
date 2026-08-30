import { useCallback, useEffect, useState } from 'react';

const KEY = 'printalarm.magazines.favourites';

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

/** Template favourites, kept on the device — no account needed to use them. */
export function useFavouriteTemplates() {
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    setFavourites(read());
  }, []);

  const toggle = useCallback((slug: string) => {
    setFavourites((current) => {
      const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // A full or blocked storage bucket should not break the interaction.
      }
      return next;
    });
  }, []);

  const isFavourite = useCallback((slug: string) => favourites.includes(slug), [favourites]);

  return { favourites, toggle, isFavourite };
}
