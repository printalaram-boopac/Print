import type { BackgroundGradient, PageBackground } from './types';

export const DEFAULT_BACKGROUND: PageBackground = { type: 'none' };

export const BACKGROUND_COLORS: { name: string; color: string }[] = [
  { name: 'White', color: '#FFFFFF' },
  { name: 'Off-white', color: '#F7F5F1' },
  { name: 'Warm Beige', color: '#E9DFC9' },
  { name: 'Soft Grey', color: '#D9D9D6' },
  { name: 'Charcoal', color: '#33383D' },
  { name: 'Black', color: '#14171A' },
  { name: 'Muted Rose', color: '#D9B8B0' },
  { name: 'Sage', color: '#A9B79A' },
  { name: 'Navy', color: '#2B3A4A' },
];

export const BACKGROUND_GRADIENTS: { id: string; name: string; gradient: BackgroundGradient }[] = [
  { id: 'white-beige', name: 'White → Warm Beige', gradient: { kind: 'linear', angle: 165, stops: [{ color: '#FFFFFF', position: 0 }, { color: '#E9DFC9', position: 100 }] } },
  { id: 'grey-white', name: 'Soft Grey → White', gradient: { kind: 'linear', angle: 165, stops: [{ color: '#D9D9D6', position: 0 }, { color: '#FFFFFF', position: 100 }] } },
  { id: 'charcoal-black', name: 'Charcoal → Black', gradient: { kind: 'linear', angle: 165, stops: [{ color: '#33383D', position: 0 }, { color: '#14171A', position: 100 }] } },
  { id: 'rose-cream', name: 'Muted Rose → Cream', gradient: { kind: 'linear', angle: 165, stops: [{ color: '#D9B8B0', position: 0 }, { color: '#F7F1E6', position: 100 }] } },
  { id: 'sage-offwhite', name: 'Sage → Off-white', gradient: { kind: 'linear', angle: 165, stops: [{ color: '#A9B79A', position: 0 }, { color: '#F7F5F1', position: 100 }] } },
  { id: 'navy-charcoal', name: 'Navy → Charcoal', gradient: { kind: 'linear', angle: 165, stops: [{ color: '#2B3A4A', position: 0 }, { color: '#33383D', position: 100 }] } },
];

export function gradientCss(gradient: BackgroundGradient): string {
  const stops = gradient.stops
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');
  return gradient.kind === 'radial' ? `radial-gradient(circle, ${stops})` : `linear-gradient(${gradient.angle}deg, ${stops})`;
}

/** Vector (SVG) textures — scale to any print size without pixelating, and
 * stay lightweight since they're generated, not photographed (Step 8 §56). */
function noiseSvg(opts: { baseFrequency: number; octaves: number }): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${opts.baseFrequency}' numOctaves='${opts.octaves}' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
}
function stripesSvg(gap: number, strokeWidth: number, angle: number): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${gap}' height='${gap}'><g transform='rotate(${angle} ${gap / 2} ${gap / 2})'><line x1='0' y1='${gap / 2}' x2='${gap}' y2='${gap / 2}' stroke='%23000000' stroke-width='${strokeWidth}'/></g></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
}
function dotsSvg(gap: number, radius: number): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${gap}' height='${gap}'><circle cx='${gap / 2}' cy='${gap / 2}' r='${radius}' fill='%23000000'/></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
}

export interface TextureDef {
  id: string;
  name: string;
  category: 'Textures' | 'Patterns';
  src: string;
  tileSizePx: number;
}

export const BACKGROUND_TEXTURES: TextureDef[] = [
  { id: 'fine-paper', name: 'Fine Paper', category: 'Textures', src: noiseSvg({ baseFrequency: 0.9, octaves: 2 }), tileSizePx: 200 },
  { id: 'grain', name: 'Grain', category: 'Textures', src: noiseSvg({ baseFrequency: 0.65, octaves: 3 }), tileSizePx: 200 },
  { id: 'soft-noise', name: 'Soft Noise', category: 'Textures', src: noiseSvg({ baseFrequency: 1.4, octaves: 2 }), tileSizePx: 200 },
  { id: 'recycled-paper', name: 'Recycled Paper', category: 'Textures', src: noiseSvg({ baseFrequency: 0.35, octaves: 4 }), tileSizePx: 200 },
  { id: 'linen', name: 'Linen', category: 'Textures', src: stripesSvg(6, 0.6, 45), tileSizePx: 6 },
  { id: 'light-canvas', name: 'Light Canvas', category: 'Textures', src: stripesSvg(10, 0.8, 90), tileSizePx: 10 },
  { id: 'subtle-fibres', name: 'Subtle Fibres', category: 'Textures', src: noiseSvg({ baseFrequency: 0.05, octaves: 2 }), tileSizePx: 200 },
  { id: 'dots', name: 'Dots', category: 'Patterns', src: dotsSvg(14, 1), tileSizePx: 14 },
  { id: 'thin-stripes', name: 'Thin Stripes', category: 'Patterns', src: stripesSvg(10, 0.5, 0), tileSizePx: 10 },
  { id: 'fine-lines', name: 'Fine Lines', category: 'Patterns', src: stripesSvg(16, 0.4, 90), tileSizePx: 16 },
];

export function textureFor(id: string | undefined): TextureDef | undefined {
  return BACKGROUND_TEXTURES.find((t) => t.id === id);
}

/** The CSS `background` value for the solid/gradient/none base layer — image
 * and texture render as separate layered elements (see PageBackgroundLayer)
 * since they need independent opacity/blur/overlay control. */
export function resolveBaseCss(bg: PageBackground | undefined, isCoverLike: boolean, fallbackGradient: string): string {
  const type = bg?.type ?? 'none';
  if (type === 'solid') return bg?.color ?? '#FFFFFF';
  if (type === 'gradient' && bg?.gradient) return gradientCss(bg.gradient);
  if (type === 'texture') return bg?.texture?.baseColor ?? '#FFFFFF';
  return isCoverLike ? fallbackGradient : '#FFFFFF';
}
