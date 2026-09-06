/**
 * The single source of truth for "how big is this text, relative to the
 * page" — a headline is always `28/480` of the page width, whether that's
 * rendered as a 480px-wide editor canvas, a 40px thumbnail, or a 210mm PDF
 * page (Step 10 §16, Step 12 §8/§81: output must be identical regardless of
 * zoom or physical size). Every renderer (EditableElement, MiniPageThumbnail,
 * the PDF/canvas exporters) derives its font size from this same ratio.
 */
export const TEXT_REFERENCE_WIDTH_PX = 480;

export const ROLE_FONT_PX: Record<string, number> = {
  headline: 28, kicker: 10, subheading: 9, caption: 10, body: 10,
};

export function fontSizeForWidth(role: string | undefined, widthPx: number): number {
  const base = ROLE_FONT_PX[role ?? 'body'] ?? ROLE_FONT_PX.body;
  return base * (widthPx / TEXT_REFERENCE_WIDTH_PX);
}
