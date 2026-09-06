import type { PageBackground, PageKind, TemplateCategory, TemplateElement, TemplatePage, TemplateTypography } from '../types';

/**
 * The Step 9 "layout engine": a small set of reusable, parameterized page
 * builders (one per editorial role — cover, contents, intro, feature,
 * spread, gallery, quote, back cover). A magazine pack is a *recipe*
 * (palette + typography + copy + which layout variant to use per role) fed
 * through these builders — not 24 hand-duplicated element arrays. Real
 * visual diversity between packs comes from: distinct palettes, distinct
 * font pairings, distinct copy, and — concentrated on the two pages that
 * define a magazine's "voice" — 3 structurally different cover and feature
 * variants, rather than spreading thin, cosmetic variation across every page.
 */

export interface PackPalette {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  dark: string;
}

export interface PackFonts {
  display: string;
  heading: string;
  body: string;
  caption: string;
}

export interface PackContext {
  name: string;
  category: TemplateCategory;
  palette: PackPalette;
  fonts: PackFonts;
  imageSeed: string;
}

let idCounter = 0;
function eid(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function photoUrl(seed: string, w = 900, h = 1200): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function text(
  role: TemplateElement['role'],
  content: string,
  xPct: number, yPct: number, widthPct: number, heightPct: number,
  fontKey: string,
  extra: Partial<TemplateElement> = {},
): TemplateElement {
  return { id: eid('el'), kind: 'text', role, content, xPct, yPct, widthPct, heightPct, fontKey, ...extra };
}

function image(
  xPct: number, yPct: number, widthPct: number, heightPct: number,
  src: string | null, extra: Partial<TemplateElement> = {},
): TemplateElement {
  return {
    id: eid('el'), kind: 'image', xPct, yPct, widthPct, heightPct,
    imgSrc: src, originalSrc: src, sourceWidth: src ? 1200 : undefined, sourceHeight: src ? 1600 : undefined,
    fit: 'fill', cropXPct: 50, cropYPct: 50, cropZoom: 1, opacity: 100,
    ...extra,
  };
}

function line(xPct: number, yPct: number, widthPct: number, color: string, extra: Partial<TemplateElement> = {}): TemplateElement {
  return { id: eid('el'), kind: 'line', xPct, yPct, widthPct, heightPct: 0.4, lineStyle: 'solid', strokeWidth: 1, borderColor: color, ...extra };
}

function shape(
  shapeType: TemplateElement['shapeType'], xPct: number, yPct: number, widthPct: number, heightPct: number,
  fill: string, extra: Partial<TemplateElement> = {},
): TemplateElement {
  return { id: eid('el'), kind: 'shape', shapeType, xPct, yPct, widthPct, heightPct, fill, ...extra };
}

function page(kind: PageKind, name: string, elements: TemplateElement[], background?: PageBackground): TemplatePage {
  return { id: eid('page'), kind, name, elements, background };
}

function gradientBg(from: string, to: string, angle = 165): PageBackground {
  return { type: 'gradient', gradient: { kind: 'linear', angle, stops: [{ color: from, position: 0 }, { color: to, position: 100 }] } };
}

function imageBg(src: string, sourceWidth = 1600, sourceHeight = 2133, extra: Partial<NonNullable<PageBackground['image']>> = {}): PageBackground {
  return {
    type: 'image',
    image: { src, originalSrc: src, sourceWidth, sourceHeight, fit: 'fill', xPct: 50, yPct: 50, zoom: 1, opacity: 100, blur: 0, overlayOpacity: 0, ...extra },
  };
}

// ---------------------------------------------------------------------------
// Cover — 3 structurally distinct variants
// ---------------------------------------------------------------------------

export interface CoverCopy {
  kicker: string;
  title: string;
  subtitle: string;
  issueLine: string;
}

export function buildCover(ctx: PackContext, variant: 0 | 1 | 2, copy: CoverCopy): TemplatePage {
  const { palette, fonts, imageSeed } = ctx;
  const heroSrc = photoUrl(`${imageSeed}-cover`, 1000, 1400);

  if (variant === 0) {
    // Classic editorial: centered stack, full-bleed photo, dark vignette (existing cover styling).
    return page('cover', 'Cover', [
      text('kicker', copy.kicker, 50, 8, 80, 5, fonts.caption),
      text('headline', copy.title, 50, 30, 90, 18, fonts.display),
      text('subheading', copy.subtitle, 50, 42, 80, 5, fonts.heading),
      text('caption', copy.issueLine, 50, 92, 60, 4, fonts.caption),
    ], imageBg(heroSrc, 1000, 1400));
  }

  if (variant === 1) {
    // Bold asymmetric: huge type anchored bottom-left, minimal center, no vignette needed.
    return page('cover', 'Cover', [
      image(50, 42, 100, 84, heroSrc, { zIndex: 0 }),
      shape('rectangle', 50, 84, 100, 32, palette.dark, { opacity: 55, zIndex: 1 }),
      text('kicker', copy.kicker, 24, 70, 44, 4, fonts.caption, { zIndex: 2 }),
      text('headline', copy.title, 30, 86, 56, 16, fonts.display, { zIndex: 2 }),
      text('subheading', copy.subtitle, 30, 95, 50, 4, fonts.heading, { zIndex: 2 }),
      text('caption', copy.issueLine, 88, 6, 20, 4, fonts.caption, { zIndex: 2 }),
    ]);
  }

  // variant 2 — minimal/portfolio: small title top-left, huge whitespace, image inset.
  return page('cover', 'Cover', [
    text('caption', copy.kicker, 22, 8, 40, 4, fonts.caption),
    text('headline', copy.title, 22, 16, 56, 10, fonts.display, { role: 'headline' }),
    image(50, 58, 66, 66, heroSrc),
    text('subheading', copy.subtitle, 22, 92, 50, 4, fonts.heading),
    text('caption', copy.issueLine, 78, 92, 20, 4, fonts.caption),
  ], { type: 'solid', color: palette.light });
}

// ---------------------------------------------------------------------------
// Contents
// ---------------------------------------------------------------------------

export interface ContentsCopy {
  heading: string;
  sections: { num: string; title: string }[];
}

export function buildContents(ctx: PackContext, variant: 0 | 1 | 2, copy: ContentsCopy): TemplatePage {
  const { palette, fonts, imageSeed } = ctx;
  const sectionLines = copy.sections.map((s) => `${s.num}   ${s.title}`).join('\n');

  const elements: TemplateElement[] = [
    text('headline', copy.heading, 12, 12, 55, 10, fonts.heading, { xPct: 30, widthPct: 55 }),
    text('body', sectionLines, 30, 55, 55, 45, fonts.body, { role: 'body' }),
    line(30, 24, 55, palette.accent),
  ];

  if (variant !== 2) {
    elements.push(image(78, 30, 36, 30, photoUrl(`${imageSeed}-toc-1`, 700, 700)));
    elements.push(image(78, 68, 36, 34, photoUrl(`${imageSeed}-toc-2`, 700, 800)));
  } else {
    elements.push(image(78, 50, 36, 66, photoUrl(`${imageSeed}-toc-1`, 700, 1200)));
  }

  return page('toc', 'Contents', elements);
}

// ---------------------------------------------------------------------------
// Editorial intro
// ---------------------------------------------------------------------------

export interface IntroCopy {
  heading: string;
  body: string;
}

export function buildIntro(ctx: PackContext, copy: IntroCopy): TemplatePage {
  const { fonts, imageSeed } = ctx;
  return page('editorial-intro', "Editor's Note", [
    text('headline', copy.heading, 28, 18, 46, 16, fonts.display),
    text('body', copy.body, 28, 45, 46, 30, fonts.body, { role: 'body' }),
    image(74, 55, 42, 74, photoUrl(`${imageSeed}-intro`, 900, 1400)),
  ]);
}

// ---------------------------------------------------------------------------
// Feature story — 3 structurally distinct variants
// ---------------------------------------------------------------------------

export interface FeatureCopy {
  heading: string;
  body: string;
  pullQuote: string;
}

export function buildFeature(ctx: PackContext, variant: 0 | 1 | 2, copy: FeatureCopy, pageName = 'Feature'): TemplatePage {
  const { fonts, imageSeed } = ctx;
  const src = photoUrl(`${imageSeed}-${pageName.toLowerCase().replace(/\s+/g, '-')}`, 1000, 1300);

  if (variant === 0) {
    // Large photo right, narrow text column left.
    return page('feature-story', pageName, [
      text('headline', copy.heading, 20, 16, 34, 18, fonts.display),
      text('body', copy.body, 20, 55, 34, 34, fonts.body, { role: 'body' }),
      image(70, 50, 54, 84, src),
    ]);
  }

  if (variant === 1) {
    // Two-column editorial text with a pull quote, image as a supporting strip.
    return page('feature-story', pageName, [
      text('headline', copy.heading, 50, 12, 80, 12, fonts.display),
      text('body', copy.body, 26, 45, 40, 40, fonts.body, { role: 'body' }),
      text('caption', copy.pullQuote, 74, 45, 40, 30, fonts.heading, { role: 'caption' }),
      image(50, 88, 100, 20, src),
    ]);
  }

  // variant 2 — section marker + full-bleed image with caption strip.
  return page('feature-story', pageName, [
    image(50, 46, 100, 78, src),
    text('kicker', copy.pullQuote, 50, 90, 70, 4, fonts.caption),
    text('headline', copy.heading, 50, 8, 80, 10, fonts.display),
  ]);
}

// ---------------------------------------------------------------------------
// Photo spread — full-bleed or grid
// ---------------------------------------------------------------------------

export interface SpreadCopy {
  caption: string;
}

export function buildPhotoSpread(ctx: PackContext, variant: 0 | 1 | 2, copy: SpreadCopy): TemplatePage {
  const { fonts, imageSeed } = ctx;
  const src = photoUrl(`${imageSeed}-spread`, 1600, 1600);

  if (variant === 1) {
    // Asymmetric 3-photo composition.
    return page('full-photo', 'Photo Spread', [
      image(32, 35, 56, 62, photoUrl(`${imageSeed}-spread-a`, 900, 1200)),
      image(76, 20, 40, 32, photoUrl(`${imageSeed}-spread-b`, 700, 700)),
      image(76, 62, 40, 48, photoUrl(`${imageSeed}-spread-c`, 700, 900)),
      text('caption', copy.caption, 32, 72, 56, 4, fonts.caption),
    ]);
  }

  // variant 0/2 — full-bleed hero with a small location/caption label near the safe area.
  return page('full-photo', 'Photo Spread', [
    text('caption', copy.caption, 50, 92, 70, 4, fonts.caption),
  ], imageBg(src, 1600, 1600));
}

// ---------------------------------------------------------------------------
// Gallery / photo grid
// ---------------------------------------------------------------------------

export interface GalleryCopy {
  heading: string;
  captions: string[];
}

export function buildGallery(ctx: PackContext, copy: GalleryCopy): TemplatePage {
  const { fonts, imageSeed } = ctx;
  const slots = [
    { x: 27, y: 24, w: 46, h: 34 },
    { x: 73, y: 24, w: 46, h: 34 },
    { x: 27, y: 62, w: 46, h: 36 },
    { x: 73, y: 62, w: 46, h: 36 },
  ];
  const elements: TemplateElement[] = [text('kicker', copy.heading, 50, 8, 70, 5, fonts.caption)];
  slots.forEach((s, i) => elements.push(image(s.x, s.y, s.w, s.h, photoUrl(`${imageSeed}-gallery-${i}`, 700, 800))));
  copy.captions.slice(0, 2).forEach((c, i) => elements.push(text('caption', c, i === 0 ? 27 : 73, 43, 46, 3, fonts.caption)));
  return page('photo-grid', 'Gallery', elements);
}

// ---------------------------------------------------------------------------
// Quote / highlight
// ---------------------------------------------------------------------------

export interface QuoteCopy {
  quote: string;
  attribution: string;
}

export function buildQuote(ctx: PackContext, copy: QuoteCopy): TemplatePage {
  const { palette, fonts, imageSeed } = ctx;
  return page('editorial-intro', 'Quote', [
    text('headline', `"${copy.quote}"`, 50, 42, 70, 30, fonts.display, { role: 'headline' }),
    text('caption', copy.attribution, 50, 68, 50, 4, fonts.caption),
    line(50, 20, 16, palette.accent),
    image(50, 88, 24, 18, photoUrl(`${imageSeed}-quote`, 400, 400), { frameShape: 'circle' }),
  ], { type: 'solid', color: palette.light });
}

// ---------------------------------------------------------------------------
// Back cover
// ---------------------------------------------------------------------------

export interface BackCoverCopy {
  closingLine: string;
  url: string;
}

export function buildBackCover(ctx: PackContext, copy: BackCoverCopy): TemplatePage {
  const { palette, fonts, imageSeed } = ctx;
  return page('back-cover', 'Back Cover', [
    image(50, 40, 60, 56, photoUrl(`${imageSeed}-back`, 800, 900), { opacity: 90 }),
    text('subheading', copy.closingLine, 50, 80, 70, 6, fonts.heading),
    text('caption', copy.url, 50, 92, 60, 4, fonts.caption),
  ], gradientBg(palette.dark, palette.primary));
}

export const DEFAULT_TYPOGRAPHY_TO_FONTS = (t: TemplateTypography): PackFonts => ({
  display: t.display, heading: t.heading, body: t.body, caption: t.caption,
});
