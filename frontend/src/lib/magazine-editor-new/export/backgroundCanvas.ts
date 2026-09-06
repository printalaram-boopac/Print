import type { PageBackground } from '../types';
import { textureFor } from '../pageBackground';
import { computeFillCrop } from './geometry';
import type { AssetResolver } from './assetResolver';

/**
 * Draws a page background onto any 2D canvas context at a given pixel rect
 * — solid/gradient/image(+overlay)/texture, mirroring PageBackgroundLayer.tsx
 * exactly (Step 12 §19, §36, §37). Shared by the PNG/JPEG page renderer
 * directly, and by the PDF renderer via an offscreen canvas that gets
 * embedded as an image (gradients/textures aren't vector in PDF here —
 * see fontMapping.ts's docblock for the equivalent font trade-off).
 */
export async function paintBackgroundToCanvas(
  ctx: CanvasRenderingContext2D,
  background: PageBackground | undefined,
  x: number, y: number, w: number, h: number,
  isCoverLike: boolean,
  fallbackGradient: string,
  assets: AssetResolver,
): Promise<void> {
  const type = background?.type ?? 'none';

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  if (type === 'solid' && background?.color) {
    ctx.fillStyle = background.color;
    ctx.fillRect(x, y, w, h);
  } else if (type === 'gradient' && background?.gradient) {
    const { angle, stops, kind } = background.gradient;
    let grad: CanvasGradient;
    if (kind === 'radial') {
      grad = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h) / 2);
    } else {
      const rad = ((angle - 90) * Math.PI) / 180;
      const dx = Math.cos(rad) * w / 2;
      const dy = Math.sin(rad) * h / 2;
      grad = ctx.createLinearGradient(x + w / 2 - dx, y + h / 2 - dy, x + w / 2 + dx, y + h / 2 + dy);
    }
    [...stops].sort((a, b) => a.position - b.position).forEach((s) => grad.addColorStop(Math.min(1, Math.max(0, s.position / 100)), s.color));
    ctx.globalAlpha = (background.gradient.opacity ?? 100) / 100;
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
  } else if (type === 'texture' && background?.texture) {
    ctx.fillStyle = background.texture.baseColor ?? '#FFFFFF';
    ctx.fillRect(x, y, w, h);
    const def = textureFor(background.texture.textureId);
    if (def) {
      const img = await assets.load(def.src);
      if (img) {
        const pattern = ctx.createPattern(img, 'repeat');
        if (pattern) {
          const scale = background.texture.scale ?? 1;
          const size = def.tileSizePx * scale;
          const m = new DOMMatrix().scale(size / img.width, size / img.height);
          pattern.setTransform(m);
          ctx.globalAlpha = (background.texture.opacity ?? 100) / 100;
          ctx.fillStyle = pattern;
          ctx.fillRect(x, y, w, h);
          ctx.globalAlpha = 1;
        }
      }
    }
  } else if (type === 'image' && background?.image) {
    const img = await assets.load(background.image.src);
    if (img) {
      ctx.globalAlpha = (background.image.opacity ?? 100) / 100;
      if (background.image.fit === 'fit') {
        const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
      } else {
        const crop = computeFillCrop(img.naturalWidth, img.naturalHeight, w, h, background.image.xPct, background.image.yPct, background.image.zoom);
        if (crop.sw && crop.sh) ctx.drawImage(img, crop.sx!, crop.sy!, crop.sw, crop.sh, x, y, w, h);
      }
      ctx.globalAlpha = 1;
      if (background.image.blur) {
        // Blur is applied at draw time via filter where supported; canvas filter
        // must be set before drawImage, so re-draw once more with filter applied.
        ctx.save();
        ctx.filter = `blur(${(background.image.blur / 100) * w}px)`;
        ctx.globalAlpha = (background.image.opacity ?? 100) / 100;
        if (background.image.fit !== 'fit') {
          const crop = computeFillCrop(img.naturalWidth, img.naturalHeight, w, h, background.image.xPct, background.image.yPct, background.image.zoom);
          if (crop.sw && crop.sh) ctx.drawImage(img, crop.sx!, crop.sy!, crop.sw, crop.sh, x, y, w, h);
        }
        ctx.restore();
      }
      if (background.image.overlayColor && (background.image.overlayOpacity ?? 0) > 0) {
        ctx.globalAlpha = (background.image.overlayOpacity ?? 0) / 100;
        ctx.fillStyle = background.image.overlayColor;
        ctx.fillRect(x, y, w, h);
        ctx.globalAlpha = 1;
      }
    } else {
      ctx.fillStyle = '#EDEDEA';
      ctx.fillRect(x, y, w, h);
    }
  } else {
    // 'none' — cover/back-cover pages fall back to the template's accent
    // gradient exactly like the editor does; everything else is plain white.
    if (isCoverLike) {
      const rad = (155 - 90) * (Math.PI / 180);
      const dx = Math.cos(rad) * w / 2;
      const dy = Math.sin(rad) * h / 2;
      const grad = ctx.createLinearGradient(x + w / 2 - dx, y + h / 2 - dy, x + w / 2 + dx, y + h / 2 + dy);
      const matches = fallbackGradient.match(/#[0-9a-fA-F]{3,8}/g) ?? ['#F5F5F3', '#D6D6D2'];
      matches.forEach((c, i) => grad.addColorStop(i / Math.max(1, matches.length - 1), c));
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x, y, w, h);
    }
  }

  ctx.restore();
}
