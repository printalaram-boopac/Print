import { useEffect } from 'react';

/**
 * Typefaces available to magazine designs.
 *
 * `index.html` already ships the site's own webfonts (Inter, Playfair Display,
 * Archivo Black, Barlow Condensed, Bitter, Caveat, Courier Prime, Cutive, Jost,
 * Oswald, Special Elite). The editorial faces below marked `lazy` are *not*
 * loaded site-wide — `useMagazineFonts()` injects them only on magazine routes
 * so the rest of the site keeps its current payload.
 */
export interface FontDefinition {
  family: string;
  /** Grouping shown in the font dropdown. */
  group: 'Display' | 'Serif' | 'Sans' | 'Condensed' | 'Mono' | 'Hand';
  weights: number[];
  /** True when the family is not already loaded by index.html. */
  lazy: boolean;
  /** Google Fonts `family=` spec for the lazily loaded faces. */
  spec?: string;
  fallback: string;
}

export const FONT_LIBRARY: FontDefinition[] = [
  // ── Already loaded site-wide ──
  { family: 'Playfair Display', group: 'Serif', weights: [400, 600, 700], lazy: false, fallback: 'serif' },
  { family: 'Inter', group: 'Sans', weights: [300, 400, 500, 600, 700], lazy: false, fallback: 'sans-serif' },
  { family: 'Archivo Black', group: 'Display', weights: [400], lazy: false, fallback: 'sans-serif' },
  { family: 'Barlow Condensed', group: 'Condensed', weights: [400, 600], lazy: false, fallback: 'sans-serif' },
  { family: 'Oswald', group: 'Condensed', weights: [400, 600], lazy: false, fallback: 'sans-serif' },
  { family: 'Jost', group: 'Sans', weights: [400, 600], lazy: false, fallback: 'sans-serif' },
  { family: 'Bitter', group: 'Serif', weights: [400, 700], lazy: false, fallback: 'serif' },
  { family: 'Cutive', group: 'Serif', weights: [400], lazy: false, fallback: 'serif' },
  { family: 'Courier Prime', group: 'Mono', weights: [400], lazy: false, fallback: 'monospace' },
  { family: 'Special Elite', group: 'Display', weights: [400], lazy: false, fallback: 'cursive' },
  { family: 'Caveat', group: 'Hand', weights: [500, 600], lazy: false, fallback: 'cursive' },

  // ── Magazine-only editorial faces ──
  { family: 'Cormorant Garamond', group: 'Serif', weights: [300, 400, 600, 700], lazy: true, spec: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400', fallback: 'serif' },
  { family: 'DM Serif Display', group: 'Serif', weights: [400], lazy: true, spec: 'DM+Serif+Display:ital,wght@0,400;1,400', fallback: 'serif' },
  { family: 'Libre Baskerville', group: 'Serif', weights: [400, 700], lazy: true, spec: 'Libre+Baskerville:ital,wght@0,400;0,700;1,400', fallback: 'serif' },
  { family: 'Lora', group: 'Serif', weights: [400, 500, 600, 700], lazy: true, spec: 'Lora:ital,wght@0,400;0,500;0,600;0,700;1,400', fallback: 'serif' },
  { family: 'Bebas Neue', group: 'Display', weights: [400], lazy: true, spec: 'Bebas+Neue', fallback: 'sans-serif' },
  { family: 'Anton', group: 'Display', weights: [400], lazy: true, spec: 'Anton', fallback: 'sans-serif' },
  { family: 'Syne', group: 'Display', weights: [400, 600, 700, 800], lazy: true, spec: 'Syne:wght@400;600;700;800', fallback: 'sans-serif' },
  { family: 'Space Grotesk', group: 'Sans', weights: [300, 400, 500, 700], lazy: true, spec: 'Space+Grotesk:wght@300;400;500;700', fallback: 'sans-serif' },
  { family: 'Montserrat', group: 'Sans', weights: [300, 400, 500, 600, 700, 800], lazy: true, spec: 'Montserrat:wght@300;400;500;600;700;800', fallback: 'sans-serif' },
  { family: 'Poppins', group: 'Sans', weights: [300, 400, 500, 600, 700], lazy: true, spec: 'Poppins:wght@300;400;500;600;700', fallback: 'sans-serif' },
  { family: 'Archivo Narrow', group: 'Condensed', weights: [400, 600, 700], lazy: true, spec: 'Archivo+Narrow:wght@400;600;700', fallback: 'sans-serif' },
  { family: 'Marcellus', group: 'Display', weights: [400], lazy: true, spec: 'Marcellus', fallback: 'serif' },
];

const FONT_MAP = new Map(FONT_LIBRARY.map((f) => [f.family, f]));

/** CSS `font-family` value for a stored family name, with a sane fallback. */
export function fontStack(family: string): string {
  const def = FONT_MAP.get(family);
  return def ? `'${def.family}', ${def.fallback}` : `'${family}', sans-serif`;
}

/** Weights the family actually ships, so the weight picker never lies. */
export function availableWeights(family: string): number[] {
  return FONT_MAP.get(family)?.weights ?? [400, 700];
}

/** Nearest shipped weight — used when switching families keeps a weight valid. */
export function nearestWeight(family: string, weight: number): number {
  const weights = availableWeights(family);
  return weights.reduce((best, w) => (Math.abs(w - weight) < Math.abs(best - weight) ? w : best), weights[0]);
}

const LINK_ID = 'magazine-editorial-fonts';

function buildHref(): string {
  const specs = FONT_LIBRARY.filter((f) => f.lazy && f.spec).map((f) => `family=${f.spec}`);
  return `https://fonts.googleapis.com/css2?${specs.join('&')}&display=swap`;
}

/**
 * Injects the magazine-only font stylesheet once. Kept in the document after
 * unmount so navigating between library → preview → editor never re-flashes
 * unstyled text.
 */
export function loadMagazineFonts(): void {
  if (typeof document === 'undefined' || document.getElementById(LINK_ID)) return;
  const link = document.createElement('link');
  link.id = LINK_ID;
  link.rel = 'stylesheet';
  link.href = buildHref();
  document.head.appendChild(link);
}

/** Hook form of {@link loadMagazineFonts} for magazine screens. */
export function useMagazineFonts(): void {
  useEffect(() => {
    loadMagazineFonts();
  }, []);
}

/** Resolves once webfonts are ready — the exporter waits on this. */
export function fontsReady(): Promise<void> {
  const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (!fontSet) return Promise.resolve();
  return fontSet.ready.then(() => undefined);
}

/** Families grouped for the editor's font dropdown. */
export function groupedFonts(): { group: FontDefinition['group']; fonts: FontDefinition[] }[] {
  const groups: FontDefinition['group'][] = ['Display', 'Serif', 'Sans', 'Condensed', 'Mono', 'Hand'];
  return groups
    .map((group) => ({ group, fonts: FONT_LIBRARY.filter((f) => f.group === group) }))
    .filter((g) => g.fonts.length > 0);
}
