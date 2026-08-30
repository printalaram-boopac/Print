import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Reports when a node is (or comes) near the viewport, then stops watching.
 *
 * Used to defer rendering template cover previews — a full page render per card
 * is real work, and there is no reason to do twenty of them for cards nobody
 * has scrolled to yet.
 *
 * This measures rectangles on a throttled scroll listener rather than using
 * `IntersectionObserver`: an observer reports nothing at all in a tab that is
 * not compositing frames (background tabs, some embedded webviews), which would
 * leave the gallery showing empty placeholders forever. Rect measurement always
 * resolves, and the listener detaches as soon as the node is in view.
 */
export function useInView<T extends HTMLElement>(margin = 300): {
  ref: (node: T | null) => void;
  inView: boolean;
} {
  const [inView, setInView] = useState(false);
  const nodeRef = useRef<T | null>(null);

  const ref = useCallback((node: T | null) => {
    nodeRef.current = node;
  }, []);

  useEffect(() => {
    if (inView) return;

    let frame = 0;

    const check = () => {
      const node = nodeRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < viewportHeight + margin && rect.bottom > -margin) setInView(true);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(check);
    };

    // Measure once after layout settles, then follow the user.
    const initial = window.setTimeout(check, 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.clearTimeout(initial);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [inView, margin]);

  return { ref, inView };
}
