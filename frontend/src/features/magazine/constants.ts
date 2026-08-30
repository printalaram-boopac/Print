import type { MagazineCategory, PlaceholderFill } from './types';

/* ─────────────────── Document geometry ─────────────────── */

export interface PageSizePreset {
  id: string;
  label: string;
  /** Document units — A4 at 96 DPI, so 1 unit ≈ 1 CSS px at 100% zoom. */
  width: number;
  height: number;
  /** Physical size used by the PDF exporter. */
  mm: { width: number; height: number };
}

export const PAGE_SIZES: PageSizePreset[] = [
  { id: 'a4-portrait', label: 'A4 Portrait', width: 794, height: 1123, mm: { width: 210, height: 297 } },
  { id: 'a5-portrait', label: 'A5 Portrait', width: 559, height: 794, mm: { width: 148, height: 210 } },
  { id: 'letter-portrait', label: 'US Letter', width: 816, height: 1056, mm: { width: 215.9, height: 279.4 } },
  { id: 'square', label: 'Square', width: 850, height: 850, mm: { width: 225, height: 225 } },
];

export const DEFAULT_PAGE_SIZE = PAGE_SIZES[0];

/** Safe inner margin used by the template layouts. */
export const PAGE_MARGIN = 56;

/** Matches the closest known preset so the exporter can pick a paper size. */
export function findPageSize(width: number, height: number): PageSizePreset {
  return (
    PAGE_SIZES.find((p) => p.width === width && p.height === height) || {
      ...DEFAULT_PAGE_SIZE,
      id: 'custom',
      label: 'Custom',
      width,
      height,
      // Convert document units (96 DPI) to millimetres.
      mm: { width: (width / 96) * 25.4, height: (height / 96) * 25.4 },
    }
  );
}

/* ─────────────────── Library taxonomy ─────────────────── */

export const MAGAZINE_CATEGORIES: MagazineCategory[] = [
  'Business',
  'Fashion',
  'Lifestyle',
  'Travel',
  'Food',
  'Photography',
  'Architecture',
  'Corporate',
  'Product Catalogue',
  'Editorial',
  'Minimal',
  'Creative',
  'News',
  'Education',
  'Portfolio',
  'Real Estate',
  'Technology',
];

export const ALL_CATEGORY = 'All' as const;
export type CategoryFilter = typeof ALL_CATEGORY | MagazineCategory;

/* ─────────────────── Editor behaviour ─────────────────── */

export const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2] as const;
export const MIN_ZOOM = 0.15;
export const MAX_ZOOM = 3;

/** Distance (document units) within which an element snaps to a guide. */
export const SNAP_THRESHOLD = 7;

/** Smallest element the resize handles will produce. */
export const MIN_ELEMENT_SIZE = 16;

/** Arrow-key nudge distances. */
export const NUDGE_STEP = 1;
export const NUDGE_STEP_LARGE = 10;

/** Undo stack depth — deep enough for a long session, bounded for memory. */
export const HISTORY_LIMIT = 60;

/** Autosave idle delay after the last meaningful edit. */
export const AUTOSAVE_DEBOUNCE_MS = 1600;

/** Longest edge kept when an uploaded photo is downscaled before storage. */
export const UPLOAD_MAX_EDGE = 1600;
export const UPLOAD_JPEG_QUALITY = 0.82;

/* ─────────────────── Colour ─────────────────── */

/**
 * Swatches offered by the colour pickers. The first row is the site palette so
 * designs can stay on-brand; the rest are neutral editorial tones.
 */
export const COLOR_SWATCHES: string[] = [
  '#3D1E30', '#C5A059', '#FAF7F0', '#FFFFFF', '#000000',
  '#1A1410', '#2C2C2C', '#555555', '#8C6D7E', '#C2B0BC',
  '#F2EDE4', '#E8DACB', '#D4B563', '#75591C', '#42300C',
  '#0F3D3E', '#1B4965', '#2A6F97', '#A4C3B2', '#CCE3DE',
  '#7F1D1D', '#B91C1C', '#EA580C', '#F59E0B', '#FDE68A',
  '#4C1D95', '#6D28D9', '#DB2777', '#F472B6', '#FBCFE8',
];

export const DEFAULT_PLACEHOLDER: PlaceholderFill = {
  from: '#E8DACB',
  to: '#C2B0BC',
  angle: 135,
};

/* ─────────────────── Shape presets ─────────────────── */

export interface ShapePreset {
  id: string;
  label: string;
  shape: 'rect' | 'ellipse' | 'line' | 'triangle';
  width: number;
  height: number;
  radius?: number;
  strokeWidth?: number;
  outline?: boolean;
}

export const SHAPE_PRESETS: ShapePreset[] = [
  { id: 'rect', label: 'Rectangle', shape: 'rect', width: 260, height: 180 },
  { id: 'rounded', label: 'Rounded block', shape: 'rect', width: 260, height: 180, radius: 24 },
  { id: 'square', label: 'Colour block', shape: 'rect', width: 200, height: 200 },
  { id: 'circle', label: 'Circle', shape: 'ellipse', width: 200, height: 200 },
  { id: 'ellipse', label: 'Ellipse', shape: 'ellipse', width: 280, height: 180 },
  { id: 'triangle', label: 'Triangle', shape: 'triangle', width: 200, height: 180 },
  { id: 'outline', label: 'Outline frame', shape: 'rect', width: 260, height: 200, outline: true, strokeWidth: 3 },
  { id: 'divider', label: 'Divider', shape: 'line', width: 320, height: 3 },
  { id: 'rule', label: 'Heavy rule', shape: 'line', width: 240, height: 10 },
];

/* ─────────────────── Text presets ─────────────────── */

export interface TextPreset {
  id: string;
  label: string;
  sample: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
  textTransform: 'none' | 'uppercase';
}

export const TEXT_PRESETS: TextPreset[] = [
  { id: 'masthead', label: 'Masthead', sample: 'MASTHEAD', fontFamily: 'Archivo Black', fontSize: 96, fontWeight: 400, letterSpacing: -3, lineHeight: 0.9, textTransform: 'uppercase' },
  { id: 'headline', label: 'Headline', sample: 'A bold headline', fontFamily: 'Playfair Display', fontSize: 54, fontWeight: 700, letterSpacing: -1, lineHeight: 1.05, textTransform: 'none' },
  { id: 'subhead', label: 'Subheading', sample: 'Supporting subheading', fontFamily: 'Jost', fontSize: 26, fontWeight: 400, letterSpacing: 0, lineHeight: 1.3, textTransform: 'none' },
  { id: 'kicker', label: 'Kicker', sample: 'SECTION LABEL', fontFamily: 'Barlow Condensed', fontSize: 15, fontWeight: 600, letterSpacing: 3.5, lineHeight: 1.2, textTransform: 'uppercase' },
  { id: 'body', label: 'Body copy', sample: 'Body paragraph text for the article.', fontFamily: 'Inter', fontSize: 15, fontWeight: 400, letterSpacing: 0, lineHeight: 1.7, textTransform: 'none' },
  { id: 'quote', label: 'Pull quote', sample: '“A memorable pull quote.”', fontFamily: 'Cormorant Garamond', fontSize: 40, fontWeight: 400, letterSpacing: 0, lineHeight: 1.3, textTransform: 'none' },
  { id: 'caption', label: 'Caption', sample: 'Photo caption', fontFamily: 'Inter', fontSize: 11, fontWeight: 500, letterSpacing: 1.2, lineHeight: 1.4, textTransform: 'uppercase' },
  { id: 'number', label: 'Page number', sample: '04', fontFamily: 'Oswald', fontSize: 34, fontWeight: 400, letterSpacing: 0, lineHeight: 1, textTransform: 'none' },
];
