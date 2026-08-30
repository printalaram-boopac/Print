/**
 * Magazine document model.
 *
 * Every geometric value below is expressed in *document units* (see
 * `PAGE_SIZES` in `./constants`), never in browser pixels. The canvas, page
 * thumbnails, the reader preview and the PDF/PNG export all render the same
 * numbers at different scales, which is what keeps a design identical across
 * edit → preview → save → reload → export.
 */

export type ElementType = 'text' | 'image' | 'shape';

/** Geometry + stacking shared by every element kind. */
export interface ElementBase {
  id: string;
  /** Left offset from the page origin, in document units. */
  x: number;
  /** Top offset from the page origin, in document units. */
  y: number;
  width: number;
  height: number;
  /** Clockwise rotation in degrees. */
  rotation: number;
  /** Paint order within the page — higher sits on top. */
  zIndex: number;
  /** 0 → 1. */
  opacity: number;
  /** Locked elements are rendered but ignore canvas interaction. */
  locked?: boolean;
}

export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export interface TextElement extends ElementBase {
  type: 'text';
  content: string;
  /** A `family` value from `FONT_LIBRARY`. */
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  color: string;
  textAlign: TextAlign;
  /** Unitless multiplier, e.g. 1.2. */
  lineHeight: number;
  /** Document units, may be negative for tight display type. */
  letterSpacing: number;
  textTransform: TextTransform;
}

/** Two-stop gradient painted inside an image frame that has no photo yet. */
export interface PlaceholderFill {
  from: string;
  to: string;
  /** Degrees, CSS `linear-gradient` convention. */
  angle?: number;
}

export interface ImageElement extends ElementBase {
  type: 'image';
  /** `null` renders the placeholder fill — the frame stays a real image slot. */
  src: string | null;
  fit: 'cover' | 'contain';
  /** Pan inside the frame, in percent of the frame box (-100 → 100). */
  offsetX: number;
  offsetY: number;
  /** 1 → 3, multiplies the fitted size for crop-in. */
  zoom: number;
  borderRadius: number;
  placeholder: PlaceholderFill;
  /** Shown inside empty frames so templates read as designed layouts. */
  label?: string;
  /** Flat colour laid over the photo, e.g. for duotone cover treatments. */
  tint?: string;
  tintOpacity?: number;
}

export type ShapeKind = 'rect' | 'ellipse' | 'line' | 'triangle';

export interface ShapeElement extends ElementBase {
  type: 'shape';
  shape: ShapeKind;
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius: number;
}

export type MagazineElement = TextElement | ImageElement | ShapeElement;

export type PageBackground =
  | { type: 'color'; color: string }
  | { type: 'gradient'; from: string; to: string; angle: number }
  | { type: 'image'; src: string; color: string };

export interface MagazinePage {
  id: string;
  name: string;
  background: PageBackground;
  elements: MagazineElement[];
}

/** A user's magazine — the unit that gets saved, reopened and exported. */
export interface MagazineDocument {
  id: string;
  title: string;
  /** Template this design was created from, kept for provenance. */
  templateId: string | null;
  /** Fixed document coordinate space shared by every page. */
  width: number;
  height: number;
  pages: MagazinePage[];
  createdAt: string;
  updatedAt: string;
  /** Bumped when the persisted shape changes so old saves can be migrated. */
  schemaVersion: number;
}

export const MAGAZINE_SCHEMA_VERSION = 1;

/* ─────────────────── Templates ─────────────────── */

export type MagazineCategory =
  | 'Business'
  | 'Fashion'
  | 'Lifestyle'
  | 'Travel'
  | 'Food'
  | 'Photography'
  | 'Architecture'
  | 'Corporate'
  | 'Product Catalogue'
  | 'Editorial'
  | 'Minimal'
  | 'Creative'
  | 'News'
  | 'Education'
  | 'Portfolio'
  | 'Real Estate'
  | 'Technology';

export type TemplateBadge = 'new' | 'popular';

/** Lightweight record used by the library grid — no page data attached. */
export interface MagazineTemplateMeta {
  id: string;
  name: string;
  slug: string;
  category: MagazineCategory;
  description: string;
  pageCount: number;
  /** Dominant colour, used for card accents and skeleton tinting. */
  accent: string;
  badge?: TemplateBadge;
  keywords: string[];
}

export interface MagazineTemplate extends MagazineTemplateMeta {
  width: number;
  height: number;
  pages: MagazinePage[];
}

/* ─────────────────── Persistence ─────────────────── */

/** Where a saved magazine currently lives. */
export type StorageDriver = 'local' | 'remote';

export interface SavedMagazineMeta {
  id: string;
  title: string;
  templateId: string | null;
  pageCount: number;
  createdAt: string;
  updatedAt: string;
  driver: StorageDriver;
}

export interface SavedMagazine extends SavedMagazineMeta {
  document: MagazineDocument;
}

/* ─────────────────── Editor ─────────────────── */

export type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export interface Guide {
  axis: 'x' | 'y';
  /** Position in document units. */
  at: number;
}
