export type TemplateCategory =
  | 'Minimal' | 'Lifestyle' | 'Travel' | 'Fashion' | 'Wedding'
  | 'Food' | 'Family' | 'Business' | 'Portfolio'
  | 'Birthday' | 'Baby' | 'Memories' | 'Photography';

export type PageKind =
  | 'cover' | 'toc' | 'editorial-intro' | 'full-photo' | 'text-image'
  | 'photo-grid' | 'feature-story' | 'back-cover' | 'blank';

export type TemplateElementKind = 'text' | 'image' | 'shape' | 'line' | 'icon';

export type ShapeType =
  | 'rectangle' | 'rounded-rectangle' | 'square' | 'circle' | 'ellipse' | 'triangle' | 'triangle-down'
  | 'diamond' | 'pentagon' | 'polygon' | 'hexagon' | 'octagon' | 'chamfered-rectangle'
  | 'star' | 'star-4' | 'star-6' | 'star-8' | 'star-10' | 'star-12' | 'burst-16' | 'burst-24' | 'burst-32'
  | 'arrow-right' | 'arrow-left' | 'arrow-up' | 'arrow-down' | 'arrow-bidirectional-h' | 'arrow-bidirectional-v'
  | 'arrow-pentagon' | 'chevron-arrow' | 'pointed-hexagon' | 'banner'
  | 'pill' | 'callout' | 'speech-bubble' | 'heart' | 'cross' | 'cloud' | 'shield' | 'bookmark'
  | 'blob' | 'arch' | 'badge' | 'trapezoid' | 'parallelogram' | 'tag' | 'flower'
  | 'sticky-note' | 'table';

export type FrameShape = 'rect' | 'rounded' | 'circle' | 'arch' | 'oval' | 'polaroid' | 'heart' | 'star' | 'diamond' | 'badge';

export type LineStyle = 'solid' | 'dashed' | 'dotted';

/** A single design element on a template page. Deliberately minimal for
 * Step 2 — enough structure to render a representative mockup and to give
 * later editing steps something concrete to attach editing logic to. */
export type ImageFit = 'fill' | 'fit';

export interface TemplateElement {
  id: string;
  kind: TemplateElementKind;
  role?: 'kicker' | 'headline' | 'subheading' | 'caption' | 'body';
  content?: string;
  /** Optional explicit font (a key from lib/magazine/fonts.ts) — lets a
   * template pack's own typography system (Step 9) actually render, instead
   * of every headline/body falling back to the same two hardcoded fonts. */
  fontKey?: string;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;

  // --- Image-specific runtime fields (Step 3), all optional/defaulted so
  // existing text/shape elements and catalog template seeds are unaffected. ---
  /** Current rendered image (object URL for an upload, or a library URL). Null = empty frame/placeholder. */
  imgSrc?: string | null;
  /** The untouched source the image was added from — crop/fit/etc never mutate this. */
  originalSrc?: string | null;
  /** Present only for user uploads — the stable id of the persisted blob in
   * the asset store (Step 11 §20). `imgSrc` is a per-session object URL and
   * is rehydrated from this id on project load, never saved as-is. */
  assetId?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  rotationDeg?: number;
  opacity?: number; // 0-100
  flipX?: boolean;
  flipY?: boolean;
  borderRadius?: number; // 0-20, % of min(w,h) — same convention as the working editor
  borderWidth?: number; // px
  borderColor?: string;
  /** Pan/zoom of the source image within its frame — background-position/size percentages. */
  cropXPct?: number;
  cropYPct?: number;
  cropZoom?: number; // 1 = no zoom
  fit?: ImageFit;
  zIndex?: number;
  locked?: boolean;
  /** Hidden layers stay in the document but don't render on canvas (Step 6). */
  visible?: boolean;
  /** Elements sharing a groupId move/select together as one unit (Step 6) —
   * a lightweight group model: no separate composite element, just a shared
   * tag, reusing the same multi-select/multi-move machinery. */
  groupId?: string;
  /** User-assigned layer name (Layers panel); falls back to an auto name. */
  layerName?: string;
  /** Frame shape for image-kind elements added from the Frames section —
   * masks the photo with real clipping (clip-path), not just a border overlay. */
  frameShape?: FrameShape;

  // --- Shape-specific fields (Step 5) ---
  shapeType?: ShapeType;
  fill?: string; // 'none' = no fill

  // --- Line-specific fields (Step 5) ---
  lineStyle?: LineStyle;
  strokeWidth?: number; // px
  arrowStart?: boolean;
  arrowEnd?: boolean;
  svgPath?: string;

  // --- Icon-specific fields (Step 5) ---
  iconName?: string;
  iconColor?: string;

  // --- Shared border style (shapes reuse borderColor/borderWidth above) ---
  borderStyle?: LineStyle;

  /** Optional pill/badge background for text elements (Magazine section presets). */
  badgeColor?: string;

  // --- Typography styling fields (supports exact Canva element styles) ---
  fontSize?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontWeight?: number | string;
  fontStyle?: 'normal' | 'italic';
  letterSpacing?: string;
  lineHeight?: number | string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export type PageRole = 'cover' | 'inside' | 'back-cover';

export type BackgroundType = 'none' | 'solid' | 'gradient' | 'image' | 'texture';

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface BackgroundGradient {
  kind: 'linear' | 'radial';
  angle: number; // degrees, linear only
  stops: GradientStop[];
  opacity?: number; // 0-100, default 100
}

export interface BackgroundImageData {
  src: string;
  originalSrc?: string;
  assetId?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  fit: ImageFit;
  xPct: number;
  yPct: number;
  zoom: number; // 1 = no zoom
  opacity: number; // 0-100
  blur: number; // 0-20 px
  overlayColor?: string;
  overlayOpacity: number; // 0-100
}

export interface BackgroundTextureData {
  textureId: string;
  opacity: number; // 0-100
  scale: number; // 1 = native tile size
  baseColor?: string;
}

/** A page's background is a real, structured page property — not a shape
 * element — so it can never be dragged, selected, or reordered like normal
 * content (Step 8 §29, §34–36). Exactly one of color/gradient/image/texture
 * is meaningful at a time, matching `type`. */
export interface PageBackground {
  type: BackgroundType;
  color?: string;
  gradient?: BackgroundGradient;
  image?: BackgroundImageData;
  texture?: BackgroundTextureData;
}

export interface TemplatePage {
  id: string;
  kind: PageKind;
  name: string;
  elements: TemplateElement[];
  /** Explicit override for Cover/Inside/Back Cover — undefined means "infer
   * from position" (see pageHelpers.resolvePageRole), so role stays sensible
   * after reordering unless the user has deliberately pinned it. */
  role?: PageRole;
  locked?: boolean;
  background?: PageBackground;
}

export interface TemplateAsset {
  /** Small, fast-loading preview used in grids/lists. */
  thumbnailUrl: string | null;
  /** Full-resolution source used when actually previewing/applying. */
  originalUrl: string | null;
  /** Print-ready asset reference — resolved lazily, not on the grid. */
  printUrl: string | null;
  widthPx: number;
  heightPx: number;
}

export interface TemplateDimensions {
  widthMm: number;
  heightMm: number;
  orientation: 'portrait' | 'landscape' | 'square';
}

export interface TemplateTypography {
  display: string; // font key, used for cover titles
  heading: string; // section/feature headings
  body: string; // body copy
  caption: string; // kickers, captions, small labels
}

export interface MagazineTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  /** CSS gradient used to render the thumbnail/cover mockup — stands in for
   * a real photographed cover asset until real imagery is wired up. */
  accentGradient: string;
  asset: TemplateAsset;
  dimensions: TemplateDimensions;
  pages: TemplatePage[];
  isPremium: boolean;

  /** Step 9 — premium multi-page pack metadata. All optional so the type
   * still fits a bare single-cover template if one is ever needed again. */
  description?: string;
  tags?: string[];
  palette?: string[]; // hex colours, this pack's defined palette (Step 9 §29)
  typography?: TemplateTypography;
  isFeatured?: boolean;
  isNew?: boolean;
  version?: string;
  createdAt?: string; // ISO date, used for "Newest" sort
  useCount?: number; // used for "Most used" sort
  /** Only set on packs that ship an opinionated numbering scheme (Step 9 §58);
   * applying the template merges this in instead of the project's own setting. */
  pageNumbers?: PageNumberSettings;
}

/** The magazine currently open in the editor — what the canvas and Pages
 * panel actually render. Distinct from MagazineTemplate (the catalog entry
 * it may have been created from). */
export type PageNumberPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface PageNumberSettings {
  enabled: boolean;
  /** 0-based order index of the first page to receive a printed number. */
  startAtPageIndex: number;
  startNumber: number;
  position: PageNumberPosition;
  hideOnCover: boolean;
  hideOnBackCover: boolean;
  fontKey: string;
  fontSize: number;
  color: string;
}

export interface EditorProject {
  templateId: string | null;
  templateName: string;
  accentGradient: string;
  dimensions: TemplateDimensions;
  pages: TemplatePage[];
  pageNumbers: PageNumberSettings;
  /** Used only for brand-new blank pages (Step 8 §26) — changing this never
   * retroactively touches existing pages unless the user explicitly applies
   * it via "Apply to all pages" / "Apply to selected pages". */
  defaultBackground: PageBackground;
}

export interface UploadedPhoto {
  id: string;
  name: string;
  objectUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  warning?: string;
}

export type PhotoCategory =
  | 'Featured' | 'Travel' | 'Lifestyle' | 'Wedding' | 'Fashion' | 'Food' | 'Business' | 'Nature' | 'People';

export interface LibraryPhoto {
  id: string;
  category: PhotoCategory;
  url: string;
  width: number;
  height: number;
}

export type ImageQuality = 'good' | 'acceptable' | 'low';

export type ElementCategory =
  | 'Shapes'
  | 'Lines'
  | 'Frames'
  | 'Grids'
  | 'Icons'
  | 'Decorative'
  | 'Magazine'
  | 'Gradients'
  | 'Stickers'
  | 'Canva Luxury'
  | 'Magic Recommendations'
  | 'Featured'
  | 'Animations'
  | 'Social Media'
  | 'Handdrawn'
  | 'Collections'
  | 'Team Badges'
  | 'Bold Foliage'
  | 'Zodiac Symbols'
  | 'Simple Drawn Objects'
  | 'Camping Rustic'
  | 'Sketchy Flowers'
  | 'Handdrawn Animals'
  | 'Handdrawn Love';

/** A catalog entry in the Elements panel — distinct from TemplateElement,
 * which is the live, on-canvas instance created from it. */
export interface ElementLibraryItem {
  id: string;
  name: string;
  category: ElementCategory;
  type: TemplateElementKind;
  tags: string[];
  isPremium: boolean;
  /** Produces a fresh on-canvas element (or, for "Grids", several at once). */
  create: () => TemplateElement[];
}

export const BLANK_SIZE_PRESETS = [
  { id: 'a4-portrait', label: 'A4 Portrait', widthMm: 210, heightMm: 297, orientation: 'portrait' as const },
  { id: 'a5-portrait', label: 'A5 Portrait', widthMm: 148, heightMm: 210, orientation: 'portrait' as const },
  { id: 'us-letter', label: 'US Letter', widthMm: 215.9, heightMm: 279.4, orientation: 'portrait' as const },
  { id: 'square', label: 'Square', widthMm: 210, heightMm: 210, orientation: 'square' as const },
  { id: 'custom', label: 'Custom Size', widthMm: 210, heightMm: 297, orientation: 'portrait' as const },
];

/** Document sizes available to an already-open project (Step 7 §18) —
 * distinct from BLANK_SIZE_PRESETS only in that "Custom Size" here opens a
 * dialog rather than being a preset itself. */
export const DOCUMENT_SIZE_PRESETS = BLANK_SIZE_PRESETS.filter((p) => p.id !== 'custom');
