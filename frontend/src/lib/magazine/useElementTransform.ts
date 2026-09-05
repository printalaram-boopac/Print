import { useCallback, useRef, type RefObject } from 'react';

export interface TransformValue {
  xPct: number;
  yPct: number;
  widthPct?: number;
  heightPct?: number;
  rotationDeg: number;
}

interface UseElementTransformArgs<T extends TransformValue> {
  containerRef: RefObject<HTMLElement | null>;
  value: T;
  onChange: (patch: Partial<T>) => void;
}

const MIN_SIZE_PCT = 5;

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Pointer-driven drag/resize/rotate for one Canva-style element. Percentages are
 * computed against the container's own bounding box so it works at any zoom/size.
 * Resize is anchored at the (fixed) top-left corner; rotate reads the angle from
 * the element's center (xPct/yPct) to the pointer.
 */
export function useElementTransform<T extends TransformValue>({ containerRef, value, onChange }: UseElementTransformArgs<T>) {
  const valueRef = useRef(value);
  valueRef.current = value;

  const onDragPointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const start = valueRef.current;

    const handleMove = (ev: PointerEvent) => {
      const dxPct = ((ev.clientX - startX) / rect.width) * 100;
      const dyPct = ((ev.clientY - startY) / rect.height) * 100;
      onChange({ xPct: clamp(start.xPct + dxPct, 0, 100), yPct: clamp(start.yPct + dyPct, 0, 100) } as Partial<T>);
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }, [containerRef, onChange]);

  const onResizePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const start = valueRef.current;
    const startWidth = start.widthPct ?? 20;
    const startHeight = start.heightPct ?? 20;
    const topLeftX = start.xPct - startWidth / 2;
    const topLeftY = start.yPct - startHeight / 2;

    const handleMove = (ev: PointerEvent) => {
      const dxPct = ((ev.clientX - startX) / rect.width) * 100;
      const dyPct = ((ev.clientY - startY) / rect.height) * 100;
      const nextWidth = clamp(startWidth + dxPct, MIN_SIZE_PCT, 100);
      const nextHeight = clamp(startHeight + dyPct, MIN_SIZE_PCT, 100);
      onChange({
        widthPct: nextWidth,
        heightPct: nextHeight,
        xPct: clamp(topLeftX + nextWidth / 2, 0, 100),
        yPct: clamp(topLeftY + nextHeight / 2, 0, 100),
      } as Partial<T>);
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }, [containerRef, onChange]);

  const onRotatePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const start = valueRef.current;
    const centerX = rect.left + (start.xPct / 100) * rect.width;
    const centerY = rect.top + (start.yPct / 100) * rect.height;

    const handleMove = (ev: PointerEvent) => {
      const angleDeg = (Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * 180) / Math.PI + 90;
      onChange({ rotationDeg: Math.round(angleDeg) } as Partial<T>);
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }, [containerRef, onChange]);

  return { onDragPointerDown, onResizePointerDown, onRotatePointerDown };
}
