import type { TemplateDimensions } from './types';

export const MARGIN_MM = 10;
export const BLEED_MM = 3;
export const SAFE_AREA_MM = 5; // inset from the margin, for headlines/page numbers

export interface GuideInsetsPct {
  xPct: number; // inset from left/right, as % of page width
  yPct: number; // inset from top/bottom, as % of page height
}

export function mmInsetToPct(mm: number, dims: TemplateDimensions): GuideInsetsPct {
  return {
    xPct: (mm / dims.widthMm) * 100,
    yPct: (mm / dims.heightMm) * 100,
  };
}
