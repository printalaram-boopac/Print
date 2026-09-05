import type { MagazinePage, MagazineProject } from './types';
import { fontFamilyFor } from './fonts';

// Print safe-area inset — a visual guide only in the editor (Design Bible §7);
// not enforced here so the exported PDF exactly matches what the free-form
// editor shows (no silent snap-back on export).
export const SAFE_AREA_PCT = 0.035;

function drawRotated(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  rotationDeg: number,
  draw: () => void,
) {
  if (!rotationDeg) {
    draw();
    return;
  }
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);
  draw();
  ctx.restore();
}

export function drawPageToCanvas(ctx: CanvasRenderingContext2D, w: number, h: number, page: MagazinePage) {
  ctx.fillStyle = page.bgColor;
  ctx.fillRect(0, 0, w, h);

  page.photos.forEach((photo) => {
    let iw = (photo.widthPct / 100) * w;
    let ih = (photo.heightPct / 100) * h;
    let ix = (photo.xPct / 100) * w - iw / 2;
    let iy = (photo.yPct / 100) * h - ih / 2;

    if (photo.isFullBleed) {
      ix = 0;
      iy = 0;
      iw = w;
      ih = h;
    }

    const centerX = ix + iw / 2;
    const centerY = iy + ih / 2;
    const radius = photo.isFullBleed ? 0 : Math.max(0, (photo.rounded / 100) * Math.min(iw, ih));

    drawRotated(ctx, centerX, centerY, photo.isFullBleed ? 0 : photo.rotationDeg, () => {
      ctx.save();
      ctx.beginPath();
      // @ts-ignore - roundRect is available in all evergreen browsers
      ctx.roundRect(ix, iy, iw, ih, radius);
      ctx.clip();

      if (photo.img) {
        const ir = photo.img.width / photo.img.height;
        const cr = iw / ih;
        let sw: number, sh: number, sx: number, sy: number;
        if (ir > cr) {
          sh = photo.img.height;
          sw = sh * cr;
          sx = (photo.img.width - sw) / 2;
          sy = 0;
        } else {
          sw = photo.img.width;
          sh = sw / cr;
          sx = 0;
          sy = (photo.img.height - sh) / 2;
        }
        ctx.drawImage(photo.img, sx, sy, sw, sh, ix, iy, iw, ih);
      } else {
        ctx.fillStyle = '#F3EAE1';
        ctx.fillRect(ix, iy, iw, ih);
      }
      ctx.restore();

      if (!photo.img) {
        ctx.save();
        ctx.lineWidth = Math.max(1, Math.min(iw, ih) * 0.006);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath();
        // @ts-ignore
        ctx.roundRect(ix, iy, iw, ih, radius);
        ctx.stroke();
        ctx.restore();
      }
    });
  });

  page.texts.forEach((t) => {
    if (!t.text.trim()) return;
    const px = (t.fontSizePct / 100) * h;
    const tx = (t.xPct / 100) * w;
    const ty = (t.yPct / 100) * h;

    // H1 (title) / H2 (chapterLabel, the kicker line) type treatment: title is
    // bold with slightly tight tracking for a masthead feel; chapterLabel is
    // semibold, uppercase, and letter-spaced like a real magazine eyebrow line.
    const fontWeight = t.role === 'title' ? '700' : t.role === 'chapterLabel' ? '600' : '400';
    const letterSpacingPx = t.role === 'title' ? -px * 0.01 : t.role === 'chapterLabel' ? px * 0.12 : 0;
    const displayText = t.role === 'chapterLabel' ? t.text.toUpperCase() : t.text;

    drawRotated(ctx, tx, ty, t.rotationDeg, () => {
      ctx.save();
      ctx.font = `${fontWeight} ${px}px ${fontFamilyFor(t.font)}`;
      // @ts-ignore - letterSpacing is supported in all evergreen browsers
      ctx.letterSpacing = `${letterSpacingPx}px`;
      ctx.fillStyle = t.color;
      ctx.textAlign = t.align;
      ctx.textBaseline = 'top';

      if (t.role === 'quote' && t.text.length > 80) {
        // Long-form letter body: wrap within a sensible width around the anchor.
        const maxWidth = w * 0.8;
        wrapText(ctx, displayText, tx, ty, maxWidth, px * 1.4);
      } else {
        ctx.fillText(displayText, tx, ty);
      }
      ctx.restore();
    });
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}

export async function composeMagazine(project: MagazineProject, dpi = 150): Promise<HTMLCanvasElement[]> {
  const W = Math.round(8.27 * dpi);
  const H = Math.round(11.69 * dpi);
  return project.pages.map((page) => {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    drawPageToCanvas(ctx, W, H, page);
    return canvas;
  });
}
