import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCanvasScaleOptions {
  docWidth: number;
  docHeight: number;
  /** Space reserved around the page inside the viewport, in CSS pixels. */
  padding?: number;
  /** Multiplied on top of the fit scale — the editor's zoom control. */
  zoom?: number;
  /** When false the page fits by width only, so tall pages scroll. */
  fitHeight?: boolean;
}

interface UseCanvasScaleResult<T extends HTMLElement> {
  containerRef: (node: T | null) => void;
  /** Scale that fits the page in the measured container, times `zoom`. */
  scale: number;
  /** Fit scale without zoom — used to label "Fit" in the zoom menu. */
  fitScale: number;
  ready: boolean;
}

/**
 * Measures the available viewport and derives a display scale for a page.
 *
 * Stored element coordinates are never modified; only this scale changes, which
 * is what lets one document render correctly on a phone, a desktop canvas and
 * an export surface.
 */
export function useCanvasScale<T extends HTMLElement>({
  docWidth,
  docHeight,
  padding = 48,
  zoom = 1,
  fitHeight = true,
}: UseCanvasScaleOptions): UseCanvasScaleResult<T> {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const containerRef = useCallback((node: T | null) => {
    observerRef.current?.disconnect();
    if (!node) return;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  const availableW = Math.max((size?.w ?? 0) - padding, 1);
  const availableH = Math.max((size?.h ?? 0) - padding, 1);
  const fitScale = size
    ? fitHeight
      ? Math.min(availableW / docWidth, availableH / docHeight)
      : availableW / docWidth
    : 0.5;

  return {
    containerRef,
    scale: fitScale * zoom,
    fitScale,
    ready: size !== null,
  };
}
