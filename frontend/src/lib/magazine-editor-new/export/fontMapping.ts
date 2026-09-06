import type { TemplateElement } from '../types';
import { ROLE_FONT_PX, TEXT_REFERENCE_WIDTH_PX } from '../textMetrics';

const MM_PER_PT = 25.4 / 72;

/** Same width-relative font ratio as every other renderer (textMetrics.ts),
 * turned into a physical PDF point size for the document's actual trim
 * width — proportional to the page, never to editor zoom (Step 12 §8/§81). */
export function pdfFontSizePt(role: TemplateElement['role'], trimWidthMm: number): number {
  const px = ROLE_FONT_PX[role ?? 'body'] ?? ROLE_FONT_PX.body;
  const mm = (px / TEXT_REFERENCE_WIDTH_PX) * trimWidthMm;
  return mm / MM_PER_PT;
}

export type PdfFontFamily = 'times' | 'helvetica' | 'courier';
export type PdfFontStyle = 'normal' | 'bold' | 'italic' | 'bolditalic';

/**
 * PDF text is real vector text, not a screenshot (Step 12 §9–10) — but
 * embedding the editor's actual Google Fonts (Playfair Display, Caveat,
 * Archivo Black…) would mean fetching + converting each webfont to a format
 * jsPDF can embed, which this step doesn't implement. Every custom font key
 * instead maps to the closest of the 3 standard PDF fonts (Times/Helvetica/
 * Courier — built into every PDF reader, so this never depends on the
 * viewer's installed fonts either). This is the single biggest fidelity
 * trade-off in the exporter: crisp, real, selectable vector text, but not a
 * pixel-perfect typeface match to the on-screen custom font.
 */
const FAMILY_MAP: Record<string, PdfFontFamily> = {
  serif: 'times',
  vintage: 'times',
  typewriter: 'courier',
  pixel: 'courier',
  display: 'helvetica',
  condensed: 'helvetica',
  hand: 'helvetica',
  marker: 'helvetica',
};

export function pdfFontFamilyFor(fontKey: string | undefined): PdfFontFamily {
  return (fontKey && FAMILY_MAP[fontKey]) || 'helvetica';
}

export function pdfFontStyleFor(role: TemplateElement['role']): PdfFontStyle {
  if (role === 'headline') return 'italic';
  if (role === 'kicker' || role === 'subheading' || role === 'body' || role === 'caption' || !role) return 'bold';
  return 'normal';
}
