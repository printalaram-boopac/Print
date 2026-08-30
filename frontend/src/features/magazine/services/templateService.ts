import { DEFAULT_PAGE_SIZE, DEFAULT_PLACEHOLDER, PAGE_MARGIN } from '../constants';
import type {
  ImageElement,
  MagazineDocument,
  MagazineElement,
  MagazinePage,
  MagazineTemplate,
  ShapeElement,
  ShapeKind,
  TextElement,
} from '../types';
import { MAGAZINE_SCHEMA_VERSION } from '../types';

/**
 * Document construction: turning templates into editable designs, and creating
 * the pages and elements the editor sidebar inserts.
 */

/** Collision-resistant id without pulling in a uuid dependency. */
export function newId(prefix = 'el'): string {
  const random = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${Date.now().toString(36)}_${random}`;
}

function cloneElement(element: MagazineElement): MagazineElement {
  return { ...element, id: newId(element.type) };
}

/** Deep copy of a page with fresh ids, so pages can be duplicated safely. */
export function clonePage(page: MagazinePage, name?: string): MagazinePage {
  return {
    id: newId('page'),
    name: name ?? page.name,
    background: { ...page.background },
    elements: page.elements.map(cloneElement),
  };
}

/**
 * Creates a working document from a template. Every id is regenerated so the
 * user's design is fully independent of the template it came from — editing one
 * can never affect the library.
 */
export function createDocumentFromTemplate(tpl: MagazineTemplate, title?: string): MagazineDocument {
  const now = new Date().toISOString();
  return {
    id: newId('mag'),
    title: title ?? `${tpl.name} — Untitled`,
    templateId: tpl.id,
    width: tpl.width,
    height: tpl.height,
    pages: tpl.pages.map((page) => clonePage(page)),
    createdAt: now,
    updatedAt: now,
    schemaVersion: MAGAZINE_SCHEMA_VERSION,
  };
}

/** A copy of an existing design, ready to be saved as a separate magazine. */
export function duplicateDocument(document: MagazineDocument): MagazineDocument {
  const now = new Date().toISOString();
  return {
    ...document,
    id: newId('mag'),
    title: `${document.title} (copy)`,
    pages: document.pages.map((page) => clonePage(page)),
    createdAt: now,
    updatedAt: now,
  };
}

export function createBlankPage(name = 'New page', background = '#FFFFFF'): MagazinePage {
  return {
    id: newId('page'),
    name,
    background: { type: 'color', color: background },
    elements: [],
  };
}

export function createBlankDocument(title = 'Untitled magazine'): MagazineDocument {
  const now = new Date().toISOString();
  return {
    id: newId('mag'),
    title,
    templateId: null,
    width: DEFAULT_PAGE_SIZE.width,
    height: DEFAULT_PAGE_SIZE.height,
    pages: [createBlankPage('Page 1')],
    createdAt: now,
    updatedAt: now,
    schemaVersion: MAGAZINE_SCHEMA_VERSION,
  };
}

/* ─────────────────── Element factories ─────────────────── */

/** Next paint order above everything currently on the page. */
export function topZIndex(page: MagazinePage): number {
  return page.elements.reduce((max, el) => Math.max(max, el.zIndex), 0) + 1;
}

interface Placement {
  x: number;
  y: number;
  zIndex: number;
}

/** Places new elements near the top-left of the safe area, nudged per item. */
export function nextPlacement(page: MagazinePage): Placement {
  const offset = (page.elements.length % 6) * 24;
  return {
    x: PAGE_MARGIN + offset,
    y: PAGE_MARGIN + offset,
    zIndex: topZIndex(page),
  };
}

export interface TextPresetInput {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
  textTransform: 'none' | 'uppercase';
  width?: number;
  color?: string;
}

export function createTextElement(page: MagazinePage, preset: TextPresetInput): TextElement {
  const { x, y, zIndex } = nextPlacement(page);
  const width = preset.width ?? Math.min(560, DEFAULT_PAGE_SIZE.width - PAGE_MARGIN * 2);
  return {
    id: newId('text'),
    type: 'text',
    x,
    y,
    width,
    height: Math.round(preset.fontSize * preset.lineHeight * 1.4),
    rotation: 0,
    zIndex,
    opacity: 1,
    content: preset.content,
    fontFamily: preset.fontFamily,
    fontSize: preset.fontSize,
    fontWeight: preset.fontWeight,
    fontStyle: 'normal',
    color: preset.color ?? '#141414',
    textAlign: 'left',
    lineHeight: preset.lineHeight,
    letterSpacing: preset.letterSpacing,
    textTransform: preset.textTransform,
  };
}

export function createImageElement(page: MagazinePage, src: string | null, label = 'Image'): ImageElement {
  const { x, y, zIndex } = nextPlacement(page);
  return {
    id: newId('image'),
    type: 'image',
    x,
    y,
    width: 320,
    height: 240,
    rotation: 0,
    zIndex,
    opacity: 1,
    src,
    fit: 'cover',
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
    borderRadius: 0,
    placeholder: DEFAULT_PLACEHOLDER,
    label,
  };
}

export interface ShapeInput {
  shape: ShapeKind;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
}

export function createShapeElement(page: MagazinePage, input: ShapeInput): ShapeElement {
  const { x, y, zIndex } = nextPlacement(page);
  return {
    id: newId('shape'),
    type: 'shape',
    x,
    y,
    width: input.width,
    height: input.height,
    rotation: 0,
    zIndex,
    opacity: 1,
    shape: input.shape,
    fill: input.fill ?? '#3D1E30',
    stroke: input.stroke ?? 'transparent',
    strokeWidth: input.strokeWidth ?? 0,
    borderRadius: input.borderRadius ?? 0,
  };
}

/* ─────────────────── Migration ─────────────────── */

/**
 * Normalises a document loaded from storage. Older saves are brought up to the
 * current shape here rather than at every read site.
 */
export function migrateDocument(raw: MagazineDocument): MagazineDocument {
  return {
    ...raw,
    schemaVersion: MAGAZINE_SCHEMA_VERSION,
    width: raw.width || DEFAULT_PAGE_SIZE.width,
    height: raw.height || DEFAULT_PAGE_SIZE.height,
    pages: (raw.pages ?? []).map((page) => ({
      ...page,
      elements: (page.elements ?? []).map((el) => ({
        ...el,
        rotation: el.rotation ?? 0,
        opacity: el.opacity ?? 1,
      })) as MagazineElement[],
    })),
  };
}
