import { useRef } from 'react';
import { clamp } from './utils';
import type { DragState, PhotoItem, StickerItem, ZinePage } from './types';

// Shared drag/resize plumbing for both photos and text stickers. `mode`
// decides what a move updates: xPct/yPct for 'move', widthPct/heightPct (photos)
// or fontSizePx (stickers) for 'resize'.
export function useDragAndResize(pages: ZinePage[], setPages: React.Dispatch<React.SetStateAction<ZinePage[]>>) {
  const pageTileRefs = useRef<Array<HTMLElement | null>>([]);
  const dragStateRef = useRef<DragState | null>(null);

  const beginDrag = (e: React.PointerEvent, kind: 'photo' | 'sticker', pageIndex: number, id: string, mode: 'move' | 'resize') => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const item = kind === 'photo' ? pages[pageIndex].photos.find((p) => p.id === id) : pages[pageIndex].stickers.find((s) => s.id === id);
    if (!item) return;
    dragStateRef.current = {
      kind,
      pageIndex,
      id,
      mode,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startXPct: item.xPct,
      startYPct: item.yPct,
      startWidthPct: kind === 'photo' ? (item as PhotoItem).widthPct : undefined,
      startHeightPct: kind === 'photo' ? (item as PhotoItem).heightPct : undefined,
      startFontSizePx: kind === 'sticker' ? (item as StickerItem).fontSizePx : undefined,
    };
  };

  const handleDragMove = (e: React.PointerEvent, pageIndex: number) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pageIndex !== pageIndex) return;
    e.stopPropagation();
    const tile = pageTileRefs.current[pageIndex];
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    const dxPct = ((e.clientX - drag.startClientX) / rect.width) * 100;
    const dyPct = ((e.clientY - drag.startClientY) / rect.height) * 100;

    setPages((prev) => {
      const next = [...prev];
      const page = next[pageIndex];
      if (drag.kind === 'photo') {
        next[pageIndex] = {
          ...page,
          photos: page.photos.map((p) => {
            if (p.id !== drag.id) return p;
            if (drag.mode === 'move') {
              return { ...p, xPct: clamp(drag.startXPct + dxPct, 0, 100), yPct: clamp(drag.startYPct + dyPct, 0, 100) };
            }
            return {
              ...p,
              widthPct: clamp((drag.startWidthPct ?? 40) + dxPct, 10, 95),
              heightPct: clamp((drag.startHeightPct ?? 30) + dyPct, 8, 95),
            };
          }),
        };
      } else {
        next[pageIndex] = {
          ...page,
          stickers: page.stickers.map((s) => {
            if (s.id !== drag.id) return s;
            if (drag.mode === 'move') {
              return { ...s, xPct: clamp(drag.startXPct + dxPct, 0, 100), yPct: clamp(drag.startYPct + dyPct, 0, 100) };
            }
            return { ...s, fontSizePx: clamp((drag.startFontSizePx ?? 28) + dxPct * 8, 12, 140) };
          }),
        };
      }
      return next;
    });
  };

  const handleDragEnd = (e: React.PointerEvent) => {
    e.stopPropagation();
    dragStateRef.current = null;
  };

  return { pageTileRefs, beginDrag, handleDragMove, handleDragEnd };
}
