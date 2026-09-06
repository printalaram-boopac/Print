import type { TemplateElement } from '../types';
import { SHAPE_POLYGONS } from '../shapeStyle';
import { iconFor } from '../iconMap';
import { fontFamilyFor } from '../../magazine/fonts';
import { computeFillCrop, computeFitCrop } from './geometry';
import { fontSizeForWidth } from '../textMetrics';
import type { AssetResolver } from './assetResolver';

function applyShapeClipPath(ctx: CanvasRenderingContext2D, shapeType: TemplateElement['shapeType'], x: number, y: number, w: number, h: number, borderRadiusPct: number | undefined) {
  ctx.beginPath();
  switch (shapeType) {
    case 'circle':
    case 'ellipse':
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      break;
    case 'pill': {
      const r = Math.min(w, h) / 2;
      roundedRectPath(ctx, x, y, w, h, r);
      break;
    }
    case 'rounded-rectangle': {
      const r = ((borderRadiusPct ?? 12) / 100) * Math.min(w, h);
      roundedRectPath(ctx, x, y, w, h, r);
      break;
    }
    case 'arch': {
      const r = Math.min(w / 2, h);
      ctx.moveTo(x, y + h);
      ctx.lineTo(x, y + r);
      ctx.arc(x + w / 2, y + r, w / 2, Math.PI, 0);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      break;
    }
    case 'blob':
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      break;
    case 'rectangle':
    case 'square':
      ctx.rect(x, y, w, h);
      break;
    default: {
      const pts = shapeType && SHAPE_POLYGONS[shapeType];
      if (pts) {
        pts.forEach(([px, py], i) => {
          const ax = x + (px / 100) * w;
          const ay = y + (py / 100) * h;
          if (i === 0) ctx.moveTo(ax, ay); else ctx.lineTo(ax, ay);
        });
        ctx.closePath();
      } else {
        ctx.rect(x, y, w, h);
      }
    }
  }
}

function measureSpaced(ctx: CanvasRenderingContext2D, text: string, spacing: number): number {
  let width = 0;
  for (const ch of text) width += ctx.measureText(ch).width + spacing;
  return width - spacing;
}

function drawSpacedText(ctx: CanvasRenderingContext2D, text: string, centerX: number, y: number, spacing: number) {
  const total = measureSpaced(ctx, text, spacing);
  let x = centerX - total / 2;
  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  for (const ch of text) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + spacing;
  }
  ctx.textAlign = prevAlign;
}

function wrapLine(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, spacing: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (current && measureSpaced(ctx, test, spacing) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

async function drawImageInto(ctx: CanvasRenderingContext2D, el: TemplateElement, x: number, y: number, w: number, h: number, assets: AssetResolver) {
  if (!el.imgSrc) {
    ctx.fillStyle = '#EDEDEA';
    ctx.fillRect(x, y, w, h);
    return;
  }
  const img = await assets.load(el.imgSrc);
  if (!img) {
    ctx.fillStyle = '#EDEDEA';
    ctx.fillRect(x, y, w, h);
    return;
  }
  ctx.save();
  const flipX = el.flipX ? -1 : 1;
  const flipY = el.flipY ? -1 : 1;
  if (flipX === -1 || flipY === -1) {
    ctx.translate(x + w / 2, y + h / 2);
    ctx.scale(flipX, flipY);
    ctx.translate(-(x + w / 2), -(y + h / 2));
  }
  if ((el.fit ?? 'fill') === 'fit') {
    const crop = computeFitCrop(img.naturalWidth, img.naturalHeight, w, h);
    ctx.drawImage(img, x + (crop.destXPct ?? 0) * w, y + (crop.destYPct ?? 0) * h, (crop.destWPct ?? 1) * w, (crop.destHPct ?? 1) * h);
  } else {
    const crop = computeFillCrop(img.naturalWidth, img.naturalHeight, w, h, el.cropXPct, el.cropYPct, el.cropZoom);
    if (crop.sw && crop.sh) ctx.drawImage(img, crop.sx!, crop.sy!, crop.sw, crop.sh, x, y, w, h);
  }
  ctx.restore();
}

/** Draws one element onto any 2D canvas context, mirroring EditableElement's
 * visual logic (Step 12 §75) — used for the PNG/JPEG full-page renderer,
 * and reused inside the PDF renderer for the pieces that must be
 * rasterized (icons, gradients) rather than drawn as native PDF vectors. */
export async function renderElementToCanvas(
  ctx: CanvasRenderingContext2D,
  el: TemplateElement,
  boxX: number, boxY: number, boxW: number, boxH: number,
  isCoverLike: boolean,
  assets: AssetResolver,
  pageWidthPx: number,
): Promise<void> {
  if (el.visible === false) return;
  ctx.save();
  ctx.globalAlpha = (el.opacity ?? 100) / 100;
  if (el.rotationDeg) {
    ctx.translate(boxX + boxW / 2, boxY + boxH / 2);
    ctx.rotate((el.rotationDeg * Math.PI) / 180);
    ctx.translate(-(boxX + boxW / 2), -(boxY + boxH / 2));
  }

  if (el.kind === 'image') {
    ctx.save();
    applyShapeClipPath(ctx, (el.frameShape === 'circle' || el.frameShape === 'oval') ? 'circle' : el.frameShape === 'rounded' ? 'rounded-rectangle' : el.frameShape === 'arch' ? 'arch' : 'rectangle', boxX, boxY, boxW, boxH, el.borderRadius);
    ctx.clip();
    await drawImageInto(ctx, el, boxX, boxY, boxW, boxH, assets);
    ctx.restore();
    if ((el.borderWidth ?? 0) > 0) {
      ctx.strokeStyle = el.borderColor ?? '#1C2024';
      ctx.lineWidth = el.borderWidth!;
      applyShapeClipPath(ctx, el.frameShape === 'circle' ? 'circle' : 'rectangle', boxX, boxY, boxW, boxH, el.borderRadius);
      ctx.stroke();
    }
  } else if (el.kind === 'shape') {
    applyShapeClipPath(ctx, el.shapeType, boxX, boxY, boxW, boxH, el.borderRadius);
    if (el.fill && el.fill !== 'none') {
      ctx.fillStyle = el.fill;
      ctx.fill();
    }
    if ((el.borderWidth ?? 0) > 0) {
      ctx.strokeStyle = el.borderColor ?? '#1C2024';
      ctx.lineWidth = el.borderWidth!;
      if (el.borderStyle === 'dashed') ctx.setLineDash([el.borderWidth! * 2, el.borderWidth!]);
      else if (el.borderStyle === 'dotted') ctx.setLineDash([el.borderWidth!, el.borderWidth!]);
      ctx.stroke();
    }
  } else if (el.kind === 'line') {
    ctx.strokeStyle = el.borderColor ?? '#1C2024';
    ctx.lineWidth = Math.max(1, el.strokeWidth ?? 2);
    if (el.lineStyle === 'dashed') ctx.setLineDash([ctx.lineWidth * 3, ctx.lineWidth * 2]);
    else if (el.lineStyle === 'dotted') ctx.setLineDash([ctx.lineWidth, ctx.lineWidth * 1.5]);
    ctx.beginPath();
    ctx.moveTo(boxX, boxY + boxH / 2);
    ctx.lineTo(boxX + boxW, boxY + boxH / 2);
    ctx.stroke();
  } else if (el.kind === 'icon') {
    const Icon = iconFor(el.iconName);
    const mod = await import('react-dom/server');
    const { renderToStaticMarkup } = mod;
    const React = await import('react');
    const svgMarkup = renderToStaticMarkup(
      React.createElement(Icon, { color: el.iconColor ?? '#1C2024', strokeWidth: 1.5, width: 256, height: 256 }),
    );
    const svgUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgMarkup)))}`;
    const img = await assets.load(svgUrl);
    if (img) ctx.drawImage(img, boxX, boxY, boxW, boxH);
  } else if (el.kind === 'text' && el.content) {
    const fontPx = fontSizeForWidth(el.role, pageWidthPx);
    const isHeadline = el.role === 'headline';
    const italic = isHeadline ? 'italic ' : '';
    const weight = el.role === 'kicker' || el.role === 'subheading' || el.role === 'body' || el.role === 'caption' || !el.role ? '600 ' : '';
    const family = el.fontKey ? fontFamilyFor(el.fontKey) : (isHeadline ? fontFamilyFor('serif') : fontFamilyFor('condensed'));
    ctx.font = `${italic}${weight}${fontPx}px ${family}`;
    ctx.fillStyle = el.color ?? (el.badgeColor ? '#FFFFFF' : (isCoverLike ? '#FFFFFF' : '#1C2024'));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (el.role !== 'headline') {
      const spacing = fontPx * 0.08;
      const chars = el.role === 'body' ? el.content.split('\n') : [el.content];
      const lines = chars.flatMap((line) => wrapLine(ctx, line, boxW, spacing));
      const lineHeight = fontPx * 1.3;
      const startY = boxY + boxH / 2 - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, i) => drawSpacedText(ctx, line, boxX + boxW / 2, startY + i * lineHeight, spacing));
    } else {
      const lines = wrapLine(ctx, el.content, boxW, 0);
      const lineHeight = fontPx * 1.05;
      const startY = boxY + boxH / 2 - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, i) => ctx.fillText(line, boxX + boxW / 2, startY + i * lineHeight));
    }
  }

  ctx.restore();
}
