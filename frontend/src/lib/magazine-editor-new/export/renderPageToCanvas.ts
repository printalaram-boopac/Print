import type { TemplateDimensions, TemplatePage } from '../types';
import { paintBackgroundToCanvas } from './backgroundCanvas';
import { renderElementToCanvas } from './elementCanvas';
import { mmToPx } from './geometry';
import type { AssetResolver } from './assetResolver';

export interface PageNumberDraw {
  label: string;
  position: string;
  fontFamily: string;
  fontSizePt: number;
  color: string;
}

/**
 * Renders one full page to a canvas at a given DPI — used for PNG/JPEG
 * export (Step 12 §50–54). Deterministic: driven entirely by the document's
 * mm dimensions and percentage-based element geometry, never by the
 * editor's on-screen zoom or window size (§8, §81).
 */
export async function renderPageToCanvas(
  page: TemplatePage,
  dimensions: TemplateDimensions,
  gradient: string,
  dpi: number,
  assets: AssetResolver,
  pageNumber: PageNumberDraw | null,
): Promise<HTMLCanvasElement> {
  const widthPx = mmToPx(dimensions.widthMm, dpi);
  const heightPx = mmToPx(dimensions.heightMm, dpi);
  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d')!;
  const isCoverLike = page.kind === 'cover' || page.kind === 'back-cover';

  await paintBackgroundToCanvas(ctx, page.background, 0, 0, widthPx, heightPx, isCoverLike, gradient, assets);

  const sorted = [...page.elements].filter((el) => el.visible !== false).sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  for (const el of sorted) {
    const boxX = ((el.xPct - el.widthPct / 2) / 100) * widthPx;
    const boxY = ((el.yPct - el.heightPct / 2) / 100) * heightPx;
    const boxW = (el.widthPct / 100) * widthPx;
    const boxH = (el.heightPct / 100) * heightPx;
    // eslint-disable-next-line no-await-in-loop
    await renderElementToCanvas(ctx, el, boxX, boxY, boxW, boxH, isCoverLike, assets, widthPx);
  }

  if (pageNumber) {
    const fontPx = pageNumber.fontSizePt * (dpi / 72);
    ctx.font = `${fontPx}px ${pageNumber.fontFamily}`;
    ctx.fillStyle = pageNumber.color;
    const marginPx = mmToPx(dimensions.widthMm * 0.04, dpi);
    let x = widthPx / 2;
    ctx.textAlign = 'center';
    if (pageNumber.position.includes('left')) { x = marginPx; ctx.textAlign = 'left'; }
    else if (pageNumber.position.includes('right')) { x = widthPx - marginPx; ctx.textAlign = 'right'; }
    const y = pageNumber.position.includes('top') ? marginPx + fontPx : heightPx - marginPx;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(pageNumber.label, x, y);
  }

  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode image.'))), mime, quality);
  });
}
