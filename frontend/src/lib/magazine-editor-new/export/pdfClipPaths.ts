import type { jsPDF } from 'jspdf';
import { SHAPE_POLYGONS } from '../shapeStyle';
import type { FrameShape, ShapeType } from '../types';

const KAPPA = 0.5522847498;

function rotate(x: number, y: number, cx: number, cy: number, deg: number): [number, number] {
  if (!deg) return [x, y];
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];
}

function ellipsePath(doc: jsPDF, cx: number, cy: number, rx: number, ry: number, rotationDeg: number) {
  const pt = (x: number, y: number) => rotate(x, y, cx, cy, rotationDeg);
  const [rx0, ry0] = pt(cx + rx, cy);
  doc.moveTo(rx0, ry0);
  let p = pt(cx + rx, cy - ry * KAPPA); const p2 = pt(cx + rx * KAPPA, cy - ry); const p3 = pt(cx, cy - ry);
  doc.curveTo(p[0], p[1], p2[0], p2[1], p3[0], p3[1]);
  p = pt(cx - rx * KAPPA, cy - ry); const q2 = pt(cx - rx, cy - ry * KAPPA); const q3 = pt(cx - rx, cy);
  doc.curveTo(p[0], p[1], q2[0], q2[1], q3[0], q3[1]);
  p = pt(cx - rx, cy + ry * KAPPA); const r2 = pt(cx - rx * KAPPA, cy + ry); const r3 = pt(cx, cy + ry);
  doc.curveTo(p[0], p[1], r2[0], r2[1], r3[0], r3[1]);
  p = pt(cx + rx * KAPPA, cy + ry); const s2 = pt(cx + rx, cy + ry * KAPPA); const s3 = pt(cx + rx, cy);
  doc.curveTo(p[0], p[1], s2[0], s2[1], s3[0], s3[1]);
}

function roundedRectPath(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, rotationDeg: number, cx: number, cy: number) {
  const rr = Math.min(r, w / 2, h / 2);
  const pt = (px: number, py: number) => rotate(px, py, cx, cy, rotationDeg);
  const c = (k: [number, number]) => pt(k[0], k[1]);
  let a = c([x + rr, y]);
  doc.moveTo(a[0], a[1]);
  a = c([x + w - rr, y]); doc.lineTo(a[0], a[1]);
  let c1 = c([x + w, y]); let c2 = c([x + w, y + rr]); a = c([x + w, y + rr]);
  doc.curveTo(c1[0], c1[1], c2[0], c2[1], a[0], a[1]);
  a = c([x + w, y + h - rr]); doc.lineTo(a[0], a[1]);
  c1 = c([x + w, y + h]); c2 = c([x + w - rr, y + h]); a = c([x + w - rr, y + h]);
  doc.curveTo(c1[0], c1[1], c2[0], c2[1], a[0], a[1]);
  a = c([x + rr, y + h]); doc.lineTo(a[0], a[1]);
  c1 = c([x, y + h]); c2 = c([x, y + h - rr]); a = c([x, y + h - rr]);
  doc.curveTo(c1[0], c1[1], c2[0], c2[1], a[0], a[1]);
  a = c([x, y + rr]); doc.lineTo(a[0], a[1]);
  c1 = c([x, y]); c2 = c([x + rr, y]); a = c([x + rr, y]);
  doc.curveTo(c1[0], c1[1], c2[0], c2[1], a[0], a[1]);
}

function polygonPath(doc: jsPDF, points: [number, number][], x: number, y: number, w: number, h: number, rotationDeg: number, cx: number, cy: number) {
  points.forEach(([px, py], i) => {
    const [ax, ay] = rotate(x + (px / 100) * w, y + (py / 100) * h, cx, cy, rotationDeg);
    if (i === 0) doc.moveTo(ax, ay); else doc.lineTo(ax, ay);
  });
}

/**
 * Builds a real vector clip path for a frame/shape mask (Step 12 §34) —
 * caller wraps this in `doc.saveGraphicsState()` … `doc.clip(); doc.discardPath();`
 * … draw … `doc.restoreGraphicsState()`. Point-based rotation (not a CTM)
 * keeps this simple and consistent with the rest of the exporter.
 */
export function buildClipPath(
  doc: jsPDF,
  kind: ShapeType | FrameShape | undefined,
  xMm: number, yMm: number, wMm: number, hMm: number,
  borderRadiusPct: number | undefined,
  rotationDeg: number,
): void {
  const cx = xMm + wMm / 2;
  const cy = yMm + hMm / 2;

  if (kind === 'circle' || kind === 'oval' || kind === 'ellipse' || kind === 'blob') {
    ellipsePath(doc, cx, cy, wMm / 2, hMm / 2, rotationDeg);
    return;
  }
  if (kind === 'pill') {
    roundedRectPath(doc, xMm, yMm, wMm, hMm, Math.min(wMm, hMm) / 2, rotationDeg, cx, cy);
    return;
  }
  if (kind === 'rounded' || kind === 'rounded-rectangle') {
    roundedRectPath(doc, xMm, yMm, wMm, hMm, ((borderRadiusPct ?? 12) / 100) * Math.min(wMm, hMm), rotationDeg, cx, cy);
    return;
  }
  if (kind === 'arch') {
    // Approximated as a generously top-rounded rectangle — a true half-ellipse
    // arch is a small additional refinement left for a future pass.
    roundedRectPath(doc, xMm, yMm, wMm, hMm, Math.min(wMm / 2, hMm), rotationDeg, cx, cy);
    return;
  }
  const poly = kind && (SHAPE_POLYGONS as Record<string, [number, number][]>)[kind];
  if (poly) {
    polygonPath(doc, poly, xMm, yMm, wMm, hMm, rotationDeg, cx, cy);
    return;
  }
  // rectangle / square / polaroid / default
  const pts: [number, number][] = [[0, 0], [100, 0], [100, 100], [0, 100]];
  polygonPath(doc, pts, xMm, yMm, wMm, hMm, rotationDeg, cx, cy);
}
