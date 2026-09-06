import { jsPDF, GState } from 'jspdf';
import type { PageBackground, TemplateDimensions, TemplateElement, TemplatePage } from '../types';
import { pdfFontFamilyFor, pdfFontStyleFor, pdfFontSizePt } from './fontMapping';
import { buildClipPath } from './pdfClipPaths';
import { computeFillCrop, computeFitCrop, mmToPx } from './geometry';
import { paintBackgroundToCanvas } from './backgroundCanvas';
import { iconFor } from '../iconMap';
import type { AssetResolver } from './assetResolver';

const MM_PER_PT = 25.4 / 72;
const RASTER_DPI = 300;

export interface PdfPageNumber {
  label: string;
  position: string;
  fontFamily: string;
  fontSizePt: number;
  color: string;
}

export interface RenderPageToPdfOptions {
  doc: jsPDF;
  page: TemplatePage;
  dimensions: TemplateDimensions;
  gradient: string;
  originXMm: number; // bleed inset (0 if bleed excluded)
  originYMm: number;
  pageWidthMm: number; // full PDF page width (trim + 2×bleed if included)
  pageHeightMm: number;
  isCoverLike: boolean;
  assets: AssetResolver;
  pageNumber: PdfPageNumber | null;
  onIssue?: (message: string) => void;
}

function mm(pct: number, sizeMm: number): number {
  return (pct / 100) * sizeMm;
}

async function rasterDataUrl(paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void | Promise<void>, wMm: number, hMm: number): Promise<{ url: string; wPx: number; hPx: number }> {
  const wPx = Math.max(1, mmToPx(wMm, RASTER_DPI));
  const hPx = Math.max(1, mmToPx(hMm, RASTER_DPI));
  const canvas = document.createElement('canvas');
  canvas.width = wPx;
  canvas.height = hPx;
  const ctx = canvas.getContext('2d')!;
  await paint(ctx, wPx, hPx);
  return { url: canvas.toDataURL('image/png'), wPx, hPx };
}

async function drawBackground(doc: jsPDF, background: PageBackground | undefined, pageWidthMm: number, pageHeightMm: number, isCoverLike: boolean, gradient: string, assets: AssetResolver) {
  const type = background?.type ?? 'none';
  if (type === 'solid' && background?.color) {
    doc.setFillColor(background.color);
    doc.rect(0, 0, pageWidthMm, pageHeightMm, 'F');
    return;
  }
  if (type === 'none' && !isCoverLike) {
    doc.setFillColor('#FFFFFF');
    doc.rect(0, 0, pageWidthMm, pageHeightMm, 'F');
    return;
  }
  // Gradient / image / texture / cover fallback gradient — rasterized at print DPI (Step 12 §37).
  const { url } = await rasterDataUrl((ctx, w, h) => paintBackgroundToCanvas(ctx, background, 0, 0, w, h, isCoverLike, gradient, assets), pageWidthMm, pageHeightMm);
  doc.addImage(url, 'PNG', 0, 0, pageWidthMm, pageHeightMm);
}

async function drawImageElement(doc: jsPDF, el: TemplateElement, xMm: number, yMm: number, wMm: number, hMm: number, assets: AssetResolver, onIssue?: (m: string) => void) {
  doc.saveGraphicsState();
  buildClipPath(doc, el.frameShape ?? 'rect', xMm, yMm, wMm, hMm, el.borderRadius, el.rotationDeg ?? 0);
  doc.clip();
  doc.discardPath();

  const opacity = (el.opacity ?? 100) / 100;
  if (opacity < 1) doc.setGState(new GState({ opacity }));

  if (!el.imgSrc) {
    doc.setFillColor('#EDEDEA');
    doc.rect(xMm, yMm, wMm, hMm, 'F');
    doc.restoreGraphicsState();
    return;
  }
  const img = await assets.load(el.imgSrc);
  if (!img) {
    doc.setFillColor('#EDEDEA');
    doc.rect(xMm, yMm, wMm, hMm, 'F');
    doc.restoreGraphicsState();
    onIssue?.('An image could not be loaded and was replaced with a placeholder.');
    return;
  }

  // Draw via an offscreen canvas so flips/crop match the editor exactly,
  // then place the single resulting bitmap — still only rasterizing the
  // photo itself, not the page's vector text/shapes around it.
  const { url } = await rasterDataUrl((ctx, w, h) => {
    ctx.save();
    const flipX = el.flipX ? -1 : 1;
    const flipY = el.flipY ? -1 : 1;
    if (flipX === -1 || flipY === -1) {
      ctx.translate(w / 2, h / 2);
      ctx.scale(flipX, flipY);
      ctx.translate(-w / 2, -h / 2);
    }
    if ((el.fit ?? 'fill') === 'fit') {
      const crop = computeFitCrop(img.naturalWidth, img.naturalHeight, w, h);
      ctx.drawImage(img, (crop.destXPct ?? 0) * w, (crop.destYPct ?? 0) * h, (crop.destWPct ?? 1) * w, (crop.destHPct ?? 1) * h);
    } else {
      const crop = computeFillCrop(img.naturalWidth, img.naturalHeight, w, h, el.cropXPct, el.cropYPct, el.cropZoom);
      if (crop.sw && crop.sh) ctx.drawImage(img, crop.sx!, crop.sy!, crop.sw, crop.sh, 0, 0, w, h);
    }
    ctx.restore();
  }, wMm, hMm);
  doc.addImage(url, 'PNG', xMm, yMm, wMm, hMm);
  doc.restoreGraphicsState();

  if ((el.borderWidth ?? 0) > 0) {
    doc.saveGraphicsState();
    doc.setDrawColor(el.borderColor ?? '#1C2024');
    doc.setLineWidth(el.borderWidth! * 0.35);
    buildClipPath(doc, el.frameShape ?? 'rect', xMm, yMm, wMm, hMm, el.borderRadius, el.rotationDeg ?? 0);
    doc.stroke();
    doc.restoreGraphicsState();
  }
}

async function drawShapeElement(doc: jsPDF, el: TemplateElement, xMm: number, yMm: number, wMm: number, hMm: number, assets: AssetResolver) {
  const opacity = (el.opacity ?? 100) / 100;
  const isGradientOrPattern = el.fill === 'dots' || el.fill === 'barcode';

  doc.saveGraphicsState();
  if (opacity < 1) doc.setGState(new GState({ opacity }));

  if (el.fill && el.fill !== 'none' && !isGradientOrPattern) {
    doc.setFillColor(el.fill);
    buildClipPath(doc, el.shapeType, xMm, yMm, wMm, hMm, el.borderRadius, el.rotationDeg ?? 0);
    doc.fill();
  } else if (isGradientOrPattern) {
    const { url } = await rasterDataUrl(async (ctx, w, h) => {
      ctx.fillStyle = el.fill === 'dots' ? 'radial-gradient(#1C2024 1px, transparent 1.5px)' : '#B8895A';
      ctx.fillRect(0, 0, w, h);
    }, wMm, hMm);
    doc.saveGraphicsState();
    buildClipPath(doc, el.shapeType, xMm, yMm, wMm, hMm, el.borderRadius, el.rotationDeg ?? 0);
    doc.clip();
    doc.discardPath();
    doc.addImage(url, 'PNG', xMm, yMm, wMm, hMm);
    doc.restoreGraphicsState();
  }

  if ((el.borderWidth ?? 0) > 0) {
    doc.setDrawColor(el.borderColor ?? '#1C2024');
    doc.setLineWidth(el.borderWidth! * 0.28);
    if (el.borderStyle === 'dashed') doc.setLineDashPattern([el.borderWidth! * 0.8, el.borderWidth! * 0.5], 0);
    else if (el.borderStyle === 'dotted') doc.setLineDashPattern([el.borderWidth! * 0.28, el.borderWidth! * 0.4], 0);
    buildClipPath(doc, el.shapeType, xMm, yMm, wMm, hMm, el.borderRadius, el.rotationDeg ?? 0);
    doc.stroke();
  }
  doc.restoreGraphicsState();
  void assets;
}

function drawLineElement(doc: jsPDF, el: TemplateElement, xMm: number, yMm: number, wMm: number, hMm: number) {
  doc.saveGraphicsState();
  const opacity = (el.opacity ?? 100) / 100;
  if (opacity < 1) doc.setGState(new GState({ opacity }));
  const lineWidthMm = Math.max(0.15, (el.strokeWidth ?? 2) * 0.2);
  doc.setDrawColor(el.borderColor ?? '#1C2024');
  doc.setLineWidth(lineWidthMm);
  if (el.lineStyle === 'dashed') doc.setLineDashPattern([lineWidthMm * 3, lineWidthMm * 2], 0);
  else if (el.lineStyle === 'dotted') doc.setLineDashPattern([lineWidthMm, lineWidthMm * 1.5], 0);
  else doc.setLineDashPattern([], 0);
  doc.line(xMm, yMm + hMm / 2, xMm + wMm, yMm + hMm / 2);
  doc.restoreGraphicsState();
}

async function drawIconElement(doc: jsPDF, el: TemplateElement, xMm: number, yMm: number, wMm: number, hMm: number, assets: AssetResolver) {
  const Icon = iconFor(el.iconName);
  const [{ renderToStaticMarkup }, React] = await Promise.all([import('react-dom/server'), import('react')]);
  const svgMarkup = renderToStaticMarkup(React.createElement(Icon, { color: el.iconColor ?? '#1C2024', strokeWidth: 1.5, width: 256, height: 256 }));
  const svgUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgMarkup)))}`;
  const img = await assets.load(svgUrl);
  if (!img) return;
  const { url } = await rasterDataUrl((ctx, w, h) => ctx.drawImage(img, 0, 0, w, h), wMm, hMm);
  const opacity = (el.opacity ?? 100) / 100;
  doc.saveGraphicsState();
  if (opacity < 1) doc.setGState(new GState({ opacity }));
  doc.addImage(url, 'PNG', xMm, yMm, wMm, hMm);
  doc.restoreGraphicsState();
}

function drawTextElement(doc: jsPDF, el: TemplateElement, xMm: number, yMm: number, wMm: number, hMm: number, trimWidthMm: number, isCoverLike: boolean) {
  if (!el.content) return;
  const opacity = (el.opacity ?? 100) / 100;
  doc.saveGraphicsState();
  if (opacity < 1) doc.setGState(new GState({ opacity }));

  const family = el.fontKey ? pdfFontFamilyFor(el.fontKey) : pdfFontFamilyFor(el.role === 'headline' ? 'serif' : 'condensed');
  const style = pdfFontStyleFor(el.role);
  doc.setFont(family, style);
  const sizePt = pdfFontSizePt(el.role, trimWidthMm);
  doc.setFontSize(sizePt);
  doc.setTextColor(el.color ?? (el.badgeColor ? '#FFFFFF' : (isCoverLike ? '#FFFFFF' : '#1C2024')));

  if (el.badgeColor) {
    doc.saveGraphicsState();
    doc.setFillColor(el.badgeColor);
    buildClipPath(doc, 'rounded-rectangle', xMm, yMm, wMm, hMm, el.borderRadius ?? 40, el.rotationDeg ?? 0);
    doc.fill();
    doc.restoreGraphicsState();
  }

  const lineHeightMm = sizePt * MM_PER_PT * (el.role === 'headline' ? 1.05 : 1.3);
  const maxWidthMm = wMm * 0.96;
  const lines = doc.splitTextToSize(el.content, maxWidthMm) as string[];
  const totalHeightMm = lines.length * lineHeightMm;
  const startY = yMm + hMm / 2 - totalHeightMm / 2 + lineHeightMm * 0.8;
  const cx = xMm + wMm / 2;
  const rotationDeg = el.rotationDeg ?? 0;

  lines.forEach((line, i) => {
    doc.text(line, cx, startY + i * lineHeightMm, { align: 'center', angle: rotationDeg ? -rotationDeg : undefined });
  });
  doc.restoreGraphicsState();
}

/** Renders one document page's content into a jsPDF instance at the given
 * mm origin (Step 12 §9, §75) — vector text/shapes/lines, vector-clipped
 * images, and raster only for gradients/textures/icons/photos themselves. */
export async function renderPageToPdf(opts: RenderPageToPdfOptions): Promise<void> {
  const { doc, page, dimensions, gradient, originXMm, originYMm, pageWidthMm, pageHeightMm, isCoverLike, assets, pageNumber, onIssue } = opts;

  await drawBackground(doc, page.background, pageWidthMm, pageHeightMm, isCoverLike, gradient, assets);

  const sorted = [...page.elements].filter((el) => el.visible !== false).sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  for (const el of sorted) {
    const xMm = originXMm + mm(el.xPct - el.widthPct / 2, dimensions.widthMm);
    const yMm = originYMm + mm(el.yPct - el.heightPct / 2, dimensions.heightMm);
    const wMm = mm(el.widthPct, dimensions.widthMm);
    const hMm = mm(el.heightPct, dimensions.heightMm);

    // eslint-disable-next-line no-await-in-loop
    if (el.kind === 'image') await drawImageElement(doc, el, xMm, yMm, wMm, hMm, assets, onIssue);
    else if (el.kind === 'shape') await drawShapeElement(doc, el, xMm, yMm, wMm, hMm, assets);
    else if (el.kind === 'line') drawLineElement(doc, el, xMm, yMm, wMm, hMm);
    else if (el.kind === 'icon') await drawIconElement(doc, el, xMm, yMm, wMm, hMm, assets);
    else if (el.kind === 'text') drawTextElement(doc, el, xMm, yMm, wMm, hMm, dimensions.widthMm, isCoverLike);
  }

  if (pageNumber) {
    doc.saveGraphicsState();
    doc.setFont(pdfFontFamilyFor(undefined), 'normal');
    doc.setFontSize(pageNumber.fontSizePt);
    doc.setTextColor(pageNumber.color);
    const marginMm = dimensions.widthMm * 0.04;
    let x = originXMm + dimensions.widthMm / 2;
    let align: 'left' | 'center' | 'right' = 'center';
    if (pageNumber.position.includes('left')) { x = originXMm + marginMm; align = 'left'; }
    else if (pageNumber.position.includes('right')) { x = originXMm + dimensions.widthMm - marginMm; align = 'right'; }
    const y = pageNumber.position.includes('top') ? originYMm + marginMm + pageNumber.fontSizePt * MM_PER_PT : originYMm + dimensions.heightMm - marginMm;
    doc.text(pageNumber.label, x, y, { align });
    doc.restoreGraphicsState();
  }
}
