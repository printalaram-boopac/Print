import { useEffect, useState } from 'react';

/** Matches Tailwind's `md` breakpoint, so JS and CSS agree on "small screen". */
const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Tracks whether the viewport is phone-sized.
 *
 * The editor needs this in JavaScript, not just CSS: on a small screen only one
 * bottom sheet may be open at a time, which is a state decision rather than a
 * styling one.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    setIsMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
