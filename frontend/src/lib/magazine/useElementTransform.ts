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
  /**
   * Fires once when a drag/resize/rotate gesture ends. The gesture's pointerup
   * is tracked on `window` (so it still ends correctly if the pointer leaves
   * the element mid-drag), so a consumer's own onPointerUp on the element
   * itself is unreliable for this — use this callback instead, e.g. to
   * commit a history entry only once per gesture rather than on every move.
   */
  onCommit?: () => void;
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
export function useElementTransform<T extends TransformValue>({ containerRef, value, onChange, onCommit }: UseElementTransformArgs<T>) {
  const valueRef = useRef(value);
  valueRef.current = value;
  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;

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
      onCommitRef.current?.();
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

      let nextWidth: number;
      let nextHeight: number;

      if (ev.shiftKey) {
        nextWidth = clamp(startWidth + dxPct, MIN_SIZE_PCT, 100);
        nextHeight = clamp(startHeight + dyPct, MIN_SIZE_PCT, 100);
      } else {
        const scale = Math.max(0.05, 1 + (Math.abs(dxPct) > Math.abs(dyPct) ? dxPct / startWidth : dyPct / startHeight));
        nextWidth = clamp(startWidth * scale, MIN_SIZE_PCT, 100);
        nextHeight = clamp(startHeight * scale, MIN_SIZE_PCT, 100);
      }

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
      onCommitRef.current?.();
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

    const SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315, 360];
    const SNAP_THRESHOLD_DEG = 5;

    const handleMove = (ev: PointerEvent) => {
      let angleDeg = (Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * 180) / Math.PI + 90;
      if (angleDeg < 0) angleDeg += 360;
      const nearest = SNAP_ANGLES.find((snap) => Math.abs(angleDeg - snap) <= SNAP_THRESHOLD_DEG);
      const finalDeg = nearest !== undefined ? (nearest === 360 ? 0 : nearest) : Math.round(angleDeg);
      onChange({ rotationDeg: finalDeg } as Partial<T>);
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      onCommitRef.current?.();
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }, [containerRef, onChange]);

  return { onDragPointerDown, onResizePointerDown, onRotatePointerDown };
}
