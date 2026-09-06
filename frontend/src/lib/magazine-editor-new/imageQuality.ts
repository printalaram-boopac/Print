import type { ImageQuality } from './types';

const MM_PER_INCH = 25.4;

/**
 * Effective print DPI = source pixels ÷ the physical size the image will
 * actually render at, not just file resolution — a 4000px photo stretched
 * across a full A4 page is very different from the same photo at 10% width.
 */
export function calculateEffectiveDpi(
  sourceWidthPx: number,
  renderedWidthPct: number,
  pageWidthMm: number,
): number {
  const renderedWidthMm = (renderedWidthPct / 100) * pageWidthMm;
  if (renderedWidthMm <= 0) return Infinity;
  const renderedWidthInches = renderedWidthMm / MM_PER_INCH;
  return sourceWidthPx / renderedWidthInches;
}

export function qualityFromDpi(dpi: number): ImageQuality {
  if (dpi >= 300) return 'good';
  if (dpi >= 150) return 'acceptable';
  return 'low';
}

export const QUALITY_LABEL: Record<ImageQuality, string> = {
  good: 'Good — 300 DPI or above',
  acceptable: 'Acceptable — 150–299 DPI',
  low: 'Low-resolution image',
};
