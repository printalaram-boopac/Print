import type { SIZES } from './constants';

export type SizeKey = (typeof SIZES)[number]['key'];

// Instagram-Story-style draggable, resizable text stickers and photos —
// freely positioned per page via xPct/yPct (percentage of the page tile, so
// it works at any preview size and maps directly onto the fixed-size canvas
// used for export).
export type ColorMode = 'solid' | 'gradient';

export interface StickerItem {
  id: string;
  content: string;
  xPct: number; // center, 0-100
  yPct: number; // center, 0-100
  fontSizePx: number; // continuous — against the 800px-wide reference canvas
  font: string;
  colorMode: ColorMode;
  color: string; // hex — used when colorMode === 'solid'
  gradientFrom: string; // hex — used when colorMode === 'gradient'
  gradientTo: string; // hex — used when colorMode === 'gradient'
}

export interface PhotoItem {
  id: string;
  src: string; // data URL
  xPct: number; // center, 0-100
  yPct: number; // center, 0-100
  widthPct: number; // of page width, 0-100
  heightPct: number; // of page height, 0-100
}

export interface ZinePage {
  background: string | null; // AI-generated background, if any
  photos: PhotoItem[]; // user's uploaded photo(s) — freely positioned & resized, no upper limit
  stickers: StickerItem[]; // freely-positioned, resizable text stickers for this page
  layout: string | null; // key of a PHOTO_LAYOUTS preset, or null for fully freeform placement
}

// A pointer-drag/resize target — kept in a ref (not state) so pointermove
// doesn't churn re-renders and so start values are read once, not on every
// render (which would drift as the item's own position/size changes mid-drag).
export interface DragState {
  kind: 'photo' | 'sticker';
  pageIndex: number;
  id: string;
  mode: 'move' | 'resize';
  startClientX: number;
  startClientY: number;
  startXPct: number;
  startYPct: number;
  startWidthPct?: number;
  startHeightPct?: number;
  startFontSizePx?: number;
}
