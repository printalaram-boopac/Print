import type {
  ImageElement,
  MagazineElement,
  MagazinePage,
  MagazineTemplate,
  MagazineTemplateMeta,
  PageBackground,
  ShapeElement,
  TextElement,
} from '../types';
import { DEFAULT_PAGE_SIZE } from '../constants';

/**
 * Authoring helpers for template data.
 *
 * Templates are written as plain data — no JSX — so the same definition feeds
 * the library thumbnail, the reader preview, the editor canvas and the export.
 * `id` and `zIndex` are assigned by {@link page} from array order, which keeps
 * the definitions short and makes paint order obvious when reading a file.
 */

/** An element without the fields `page()` fills in. */
export type ElementDraft = Omit<MagazineElement, 'id' | 'zIndex'>;
export interface PageDraft {
  name: string;
  background: PageBackground;
  elements: ElementDraft[];
}

/* ─────────────────── Backgrounds ─────────────────── */

export const bg = (color: string): PageBackground => ({ type: 'color', color });

export const bgGradient = (from: string, to: string, angle = 160): PageBackground => ({
  type: 'gradient',
  from,
  to,
  angle,
});

/* ─────────────────── Text ─────────────────── */

export interface TextOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  font?: string;
  size?: number;
  weight?: number;
  color?: string;
  align?: TextElement['textAlign'];
  /** Line height multiplier. */
  lh?: number;
  /** Letter spacing in document units. */
  ls?: number;
  upper?: boolean;
  italic?: boolean;
  rot?: number;
  opacity?: number;
}

export function txt(o: TextOptions): Omit<TextElement, 'id' | 'zIndex'> {
  return {
    type: 'text',
    x: o.x,
    y: o.y,
    width: o.w,
    height: o.h,
    rotation: o.rot ?? 0,
    opacity: o.opacity ?? 1,
    content: o.text,
    fontFamily: o.font ?? 'Inter',
    fontSize: o.size ?? 16,
    fontWeight: o.weight ?? 400,
    fontStyle: o.italic ? 'italic' : 'normal',
    color: o.color ?? '#1A1410',
    textAlign: o.align ?? 'left',
    lineHeight: o.lh ?? 1.45,
    letterSpacing: o.ls ?? 0,
    textTransform: o.upper ? 'uppercase' : 'none',
  };
}

/* ─────────────────── Images ─────────────────── */

export interface ImageOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Placeholder gradient shown until the user drops in a photo. */
  from: string;
  to: string;
  angle?: number;
  radius?: number;
  label?: string;
  fit?: ImageElement['fit'];
  rot?: number;
  opacity?: number;
  tint?: string;
  tintOpacity?: number;
  src?: string | null;
}

export function img(o: ImageOptions): Omit<ImageElement, 'id' | 'zIndex'> {
  return {
    type: 'image',
    x: o.x,
    y: o.y,
    width: o.w,
    height: o.h,
    rotation: o.rot ?? 0,
    opacity: o.opacity ?? 1,
    src: o.src ?? null,
    fit: o.fit ?? 'cover',
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
    borderRadius: o.radius ?? 0,
    placeholder: { from: o.from, to: o.to, angle: o.angle ?? 135 },
    label: o.label,
    tint: o.tint,
    tintOpacity: o.tintOpacity,
  };
}

/* ─────────────────── Shapes ─────────────────── */

export interface ShapeOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  stroke?: string;
  /** Stroke width. */
  sw?: number;
  radius?: number;
  rot?: number;
  opacity?: number;
}

function shape(kind: ShapeElement['shape'], o: ShapeOptions): Omit<ShapeElement, 'id' | 'zIndex'> {
  return {
    type: 'shape',
    shape: kind,
    x: o.x,
    y: o.y,
    width: o.w,
    height: o.h,
    rotation: o.rot ?? 0,
    opacity: o.opacity ?? 1,
    fill: o.fill ?? 'transparent',
    stroke: o.stroke ?? 'transparent',
    strokeWidth: o.sw ?? 0,
    borderRadius: o.radius ?? 0,
  };
}

export const box = (o: ShapeOptions) => shape('rect', o);
export const ellipse = (o: ShapeOptions) => shape('ellipse', o);
export const triangle = (o: ShapeOptions) => shape('triangle', o);

/** Horizontal or vertical hairline / heavy rule. */
export const rule = (o: { x: number; y: number; w: number; h?: number; color: string; opacity?: number }) =>
  shape('line', { x: o.x, y: o.y, w: o.w, h: o.h ?? 1, fill: o.color, opacity: o.opacity });

/* ─────────────────── Page + template assembly ─────────────────── */

export function page(name: string, background: PageBackground, elements: ElementDraft[]): PageDraft {
  return { name, background, elements };
}

/** Stamps deterministic ids and array-order zIndex onto a page draft. */
function materialise(draft: PageDraft, pageIndex: number): MagazinePage {
  const pageId = `p${pageIndex + 1}`;
  return {
    id: pageId,
    name: draft.name,
    background: draft.background,
    elements: draft.elements.map((el, i) => ({
      ...el,
      id: `${pageId}-e${i + 1}`,
      zIndex: i + 1,
    })) as MagazineElement[],
  };
}

export type TemplateMetaInput = Omit<MagazineTemplateMeta, 'pageCount'>;

export function template(meta: TemplateMetaInput, pages: PageDraft[]): MagazineTemplate {
  return {
    ...meta,
    pageCount: pages.length,
    width: DEFAULT_PAGE_SIZE.width,
    height: DEFAULT_PAGE_SIZE.height,
    pages: pages.map(materialise),
  };
}

/* ─────────────────── Shared design vocabulary ─────────────────── */

/** Colour roles a layout needs; every template supplies its own. */
export interface Palette {
  /** Page background. */
  bg: string;
  /** Primary type colour — must contrast `bg`. */
  ink: string;
  /** Secondary type colour. */
  muted: string;
  /**
   * Darkest surface colour: photo tints, caption bands, the back-cover
   * gradient. Kept separate from `ink` so dark templates can use light type
   * without inverting their overlays.
   */
  deep: string;
  /** Brand/feature colour for blocks and rules. */
  accent: string;
  /** Type colour that sits on top of `accent` and `deep`. */
  onAccent: string;
  /** Image placeholder gradient. */
  frameFrom: string;
  frameTo: string;
  /** Hairline colour. */
  line: string;
}

/** Type roles a layout needs. */
export interface Typeset {
  display: string;
  displayWeight: number;
  /** Tracking for the display face, usually negative for large sizes. */
  displayTracking: number;
  body: string;
  kicker: string;
  kickerWeight: number;
}
