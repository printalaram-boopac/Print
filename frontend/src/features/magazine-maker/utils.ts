import { PAGE_COUNT, getPhotoLayout, type LayoutSlot } from './constants';
import type { PhotoItem, ZinePage } from './types';

export function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export const EMPTY_PAGES: ZinePage[] = Array.from({ length: PAGE_COUNT }, () => ({ background: null, photos: [], stickers: [], layout: null }));

// Re-positions every photo into a fixed list of slots, in order. If there are
// more photos than slots, extra photos cycle back through the slots (they'll
// overlap, but stay draggable so the user can nudge them apart).
export function applySlots(photos: PhotoItem[], slots: LayoutSlot[]): PhotoItem[] {
  if (slots.length === 0 || photos.length === 0) return photos;
  return photos.map((p, i) => {
    const slot = slots[i % slots.length];
    return { ...p, xPct: slot.xPct, yPct: slot.yPct, widthPct: slot.widthPct, heightPct: slot.heightPct };
  });
}

// Same idea, but looks the slot list up from a named PHOTO_LAYOUTS preset.
export function applyPhotoLayout(photos: PhotoItem[], layoutKey: string | null): PhotoItem[] {
  const layout = getPhotoLayout(layoutKey);
  if (!layout) return photos;
  return applySlots(photos, layout.slots);
}

export function pageHasContent(page: ZinePage): boolean {
  return !!page.background || page.photos.length > 0 || page.stickers.length > 0;
}

export function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}
