/**
 * Reproduces the exact CSS `background-size`/`background-position` math the
 * editor uses for image "Fill" (Step 3/8), so the export crop matches the
 * on-screen crop pixel-for-pixel instead of an approximation (Step 12 §33).
 */
export interface CropResult {
  mode: 'fill' | 'fit';
  // 'fill': source rectangle (px, in the natural image) to draw across the whole box.
  sx?: number; sy?: number; sw?: number; sh?: number;
  // 'fit': destination rectangle as a fraction (0-1) of the box — letterboxed, full source used.
  destXPct?: number; destYPct?: number; destWPct?: number; destHPct?: number;
}

export function computeFillCrop(
  naturalWidth: number, naturalHeight: number,
  boxWidth: number, boxHeight: number,
  cropXPct = 50, cropYPct = 50, zoom = 1,
): CropResult {
  if (!naturalWidth || !naturalHeight) return { mode: 'fill', sx: 0, sy: 0, sw: naturalWidth, sh: naturalHeight };
  const displayedWidth = boxWidth * zoom;
  const displayedHeight = displayedWidth * (naturalHeight / naturalWidth);
  const left = (boxWidth - displayedWidth) * (cropXPct / 100);
  const top = (boxHeight - displayedHeight) * (cropYPct / 100);

  const sx = Math.max(0, Math.min(naturalWidth, (-left / displayedWidth) * naturalWidth));
  const sy = Math.max(0, Math.min(naturalHeight, (-top / displayedHeight) * naturalHeight));
  const sw = Math.max(1, Math.min(naturalWidth - sx, (boxWidth / displayedWidth) * naturalWidth));
  const sh = Math.max(1, Math.min(naturalHeight - sy, (boxHeight / displayedHeight) * naturalHeight));
  return { mode: 'fill', sx, sy, sw, sh };
}

export function computeFitCrop(naturalWidth: number, naturalHeight: number, boxWidth: number, boxHeight: number): CropResult {
  if (!naturalWidth || !naturalHeight) return { mode: 'fit', destXPct: 0, destYPct: 0, destWPct: 1, destHPct: 1 };
  const scale = Math.min(boxWidth / naturalWidth, boxHeight / naturalHeight);
  const displayW = naturalWidth * scale;
  const displayH = naturalHeight * scale;
  return {
    mode: 'fit',
    destXPct: (boxWidth - displayW) / 2 / boxWidth,
    destYPct: (boxHeight - displayH) / 2 / boxHeight,
    destWPct: displayW / boxWidth,
    destHPct: displayH / boxHeight,
  };
}

export const MM_PER_INCH = 25.4;

export function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm / MM_PER_INCH) * dpi);
}
