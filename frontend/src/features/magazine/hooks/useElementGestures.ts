import { useCallback, useRef, useState } from 'react';
import { MIN_ELEMENT_SIZE, PAGE_MARGIN, SNAP_THRESHOLD } from '../constants';
import type { Guide, MagazineElement } from '../types';
import type { ElementPatch } from './useMagazineEditor';

/** Resize handle positions, expressed as unit direction signs. */
export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const HANDLE_SIGNS: Record<ResizeHandle, { hx: -1 | 0 | 1; hy: -1 | 0 | 1 }> = {
  nw: { hx: -1, hy: -1 },
  n: { hx: 0, hy: -1 },
  ne: { hx: 1, hy: -1 },
  e: { hx: 1, hy: 0 },
  se: { hx: 1, hy: 1 },
  s: { hx: 0, hy: 1 },
  sw: { hx: -1, hy: 1 },
  w: { hx: -1, hy: 0 },
};

/** Rotation snap step (degrees) while Shift is held. */
const ROTATE_SNAP = 15;

interface GestureOptions {
  docWidth: number;
  docHeight: number;
  /** Current canvas scale — read through a ref so listeners never go stale. */
  scale: number;
  /** Called once per gesture, before the first change, for a single undo step. */
  onBegin: () => void;
  onUpdate: (elementId: string, patch: ElementPatch, history: 'skip') => void;
}

interface GestureApi {
  startMove: (event: React.PointerEvent, element: MagazineElement) => void;
  startResize: (event: React.PointerEvent, element: MagazineElement, handle: ResizeHandle) => void;
  startRotate: (event: React.PointerEvent, element: MagazineElement) => void;
  /** Alignment guides to draw while dragging. */
  guides: Guide[];
  /** True while a gesture is in progress — used to suppress hover styling. */
  active: boolean;
}

function rotatePoint(x: number, y: number, radians: number): { x: number; y: number } {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
}

/**
 * Canvas interaction: dragging, resizing (rotation-aware) and rotating.
 *
 * All arithmetic happens in document units — pointer deltas are divided by the
 * canvas scale — so an element lands in exactly the same place whether the user
 * is zoomed to 25% or 200%.
 */
export function useElementGestures({
  docWidth,
  docHeight,
  scale,
  onBegin,
  onUpdate,
}: GestureOptions): GestureApi {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [active, setActive] = useState(false);

  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  /** Wires up window listeners for the life of one gesture. */
  const runGesture = useCallback(
    (
      event: React.PointerEvent,
      onMove: (dx: number, dy: number, ev: PointerEvent) => void,
    ) => {
      event.preventDefault();
      event.stopPropagation();
      onBegin();
      setActive(true);

      const startX = event.clientX;
      const startY = event.clientY;

      const handleMove = (ev: PointerEvent) => {
        const s = scaleRef.current || 1;
        onMove((ev.clientX - startX) / s, (ev.clientY - startY) / s, ev);
      };

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleUp);
        setGuides([]);
        setActive(false);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);
    },
    [onBegin],
  );

  const startMove = useCallback(
    (event: React.PointerEvent, element: MagazineElement) => {
      const origin = { x: element.x, y: element.y };
      const snapX = [0, PAGE_MARGIN, docWidth / 2, docWidth - PAGE_MARGIN, docWidth];
      const snapY = [0, PAGE_MARGIN, docHeight / 2, docHeight - PAGE_MARGIN, docHeight];

      runGesture(event, (dx, dy) => {
        let x = origin.x + dx;
        let y = origin.y + dy;
        const nextGuides: Guide[] = [];

        // Snapping is only offered for unrotated boxes, where the visual edges
        // match the stored geometry.
        if (element.rotation === 0) {
          const edgesX = [x, x + element.width / 2, x + element.width];
          for (let i = 0; i < edgesX.length; i += 1) {
            const target = snapX.find((t) => Math.abs(edgesX[i] - t) <= SNAP_THRESHOLD);
            if (target !== undefined) {
              x += target - edgesX[i];
              nextGuides.push({ axis: 'x', at: target });
              break;
            }
          }
          const edgesY = [y, y + element.height / 2, y + element.height];
          for (let i = 0; i < edgesY.length; i += 1) {
            const target = snapY.find((t) => Math.abs(edgesY[i] - t) <= SNAP_THRESHOLD);
            if (target !== undefined) {
              y += target - edgesY[i];
              nextGuides.push({ axis: 'y', at: target });
              break;
            }
          }
        }

        // The centre must stay on the page so nothing can be dragged into the void.
        x = Math.min(Math.max(x, -element.width / 2), docWidth - element.width / 2);
        y = Math.min(Math.max(y, -element.height / 2), docHeight - element.height / 2);

        setGuides(nextGuides);
        onUpdate(element.id, { x: Math.round(x), y: Math.round(y) }, 'skip');
      });
    },
    [docHeight, docWidth, onUpdate, runGesture],
  );

  const startResize = useCallback(
    (event: React.PointerEvent, element: MagazineElement, handle: ResizeHandle) => {
      const { hx, hy } = HANDLE_SIGNS[handle];
      const radians = (element.rotation * Math.PI) / 180;
      const start = {
        x: element.x,
        y: element.y,
        w: element.width,
        h: element.height,
        cx: element.x + element.width / 2,
        cy: element.y + element.height / 2,
      };

      runGesture(event, (dx, dy) => {
        // Take the pointer delta into the element's own axes so resizing a
        // rotated box follows its edges rather than the screen.
        const local = rotatePoint(dx, dy, -radians);

        const width = Math.max(MIN_ELEMENT_SIZE, start.w + hx * local.x);
        const height = Math.max(MIN_ELEMENT_SIZE, start.h + hy * local.y);
        const dW = width - start.w;
        const dH = height - start.h;

        // Keep the opposite corner pinned: shift the centre by half the growth,
        // rotated back into document space.
        const shift = rotatePoint((hx * dW) / 2, (hy * dH) / 2, radians);
        const cx = start.cx + shift.x;
        const cy = start.cy + shift.y;

        onUpdate(
          element.id,
          {
            x: Math.round(cx - width / 2),
            y: Math.round(cy - height / 2),
            width: Math.round(width),
            height: Math.round(height),
          },
          'skip',
        );
      });
    },
    [onUpdate, runGesture],
  );

  const startRotate = useCallback(
    (event: React.PointerEvent, element: MagazineElement) => {
      // Angles are measured from the element centre in screen space, so the
      // handle tracks the pointer exactly.
      const surface = (event.currentTarget as HTMLElement).closest<HTMLElement>('[data-page-surface]');
      const rect = surface?.getBoundingClientRect();
      const s = scaleRef.current || 1;
      const centreX = (rect?.left ?? 0) + (element.x + element.width / 2) * s;
      const centreY = (rect?.top ?? 0) + (element.y + element.height / 2) * s;
      const startAngle = Math.atan2(event.clientY - centreY, event.clientX - centreX);
      const startRotation = element.rotation;

      runGesture(event, (_dx, _dy, ev) => {
        const angle = Math.atan2(ev.clientY - centreY, ev.clientX - centreX);
        let degrees = startRotation + ((angle - startAngle) * 180) / Math.PI;
        if (ev.shiftKey) degrees = Math.round(degrees / ROTATE_SNAP) * ROTATE_SNAP;
        // Normalise to 0–359 so the properties panel never shows -412°.
        degrees = ((Math.round(degrees) % 360) + 360) % 360;
        onUpdate(element.id, { rotation: degrees }, 'skip');
      });
    },
    [onUpdate, runGesture],
  );

  return { startMove, startResize, startRotate, guides, active };
}
