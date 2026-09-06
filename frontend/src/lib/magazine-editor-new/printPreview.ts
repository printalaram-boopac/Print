import type { EditorProject, ImageQuality, TemplateElement } from './types';
import { calculateEffectiveDpi, qualityFromDpi } from './imageQuality';
import { mmInsetToPct, MARGIN_MM, SAFE_AREA_MM } from './printGuides';
import { FONTS } from '../magazine/fonts';

export interface PrintIssue {
  id: string;
  pageId: string;
  pageIndex: number;
  elementId?: string;
  kind: 'low-res' | 'text-overflow' | 'missing-font' | 'safe-area';
  message: string;
}

export interface QualitySummary {
  good: number;
  acceptable: number;
  low: number;
}

export interface PrintReport {
  issues: PrintIssue[];
  quality: QualitySummary;
}

const MM_PER_PX_AT_96DPI = 25.4 / 96;

/** Rough capacity estimate (characters that fit) — a lightweight heuristic,
 * not real text layout measurement, since the editor doesn't run its own
 * text-metrics engine. Good enough to flag genuinely cramped copy without
 * needing to mount every page's real DOM to measure overflow. */
function estimatesOverflow(el: TemplateElement, pageWidthMm: number, pageHeightMm: number, fontPx: number): boolean {
  if (!el.content || (el.role !== 'body' && el.role !== 'caption')) return false;
  const boxWidthPx = (el.widthPct / 100) * (pageWidthMm / MM_PER_PX_AT_96DPI);
  const boxHeightPx = (el.heightPct / 100) * (pageHeightMm / MM_PER_PX_AT_96DPI);
  const charsPerLine = Math.max(1, boxWidthPx / (fontPx * 0.55));
  const lines = Math.max(1, boxHeightPx / (fontPx * 1.35));
  const capacity = charsPerLine * lines;
  return el.content.length > capacity * 1.15;
}

function checkImage(
  el: { imgSrc?: string | null; sourceWidth?: number; widthPct: number },
  pageWidthMm: number,
): ImageQuality | null {
  if (!el.imgSrc || !el.sourceWidth) return null;
  return qualityFromDpi(calculateEffectiveDpi(el.sourceWidth, el.widthPct, pageWidthMm));
}

/** Scans the live project — the same document the editor renders, never a
 * separately-maintained copy — for print-readiness issues (Step 10 §33–39). */
export function computePrintReport(project: EditorProject, onlyPageIndices?: number[]): PrintReport {
  const issues: PrintIssue[] = [];
  const quality: QualitySummary = { good: 0, acceptable: 0, low: 0 };
  const { widthMm, heightMm } = project.dimensions;
  const safeInset = mmInsetToPct(MARGIN_MM + SAFE_AREA_MM, project.dimensions);
  let issueId = 0;
  const pageFilter = onlyPageIndices ? new Set(onlyPageIndices) : null;

  project.pages.forEach((page, pageIndex) => {
    if (pageFilter && !pageFilter.has(pageIndex)) return;
    const bgImage = page.background?.type === 'image' ? page.background.image : undefined;
    if (bgImage?.sourceWidth) {
      const q = checkImage({ imgSrc: bgImage.src, sourceWidth: bgImage.sourceWidth, widthPct: 100 }, widthMm);
      if (q) {
        quality[q] += 1;
        if (q === 'low') {
          issueId += 1;
          issues.push({ id: `iss-${issueId}`, pageId: page.id, pageIndex, kind: 'low-res', message: `Page ${pageIndex + 1} — Low-resolution background image` });
        }
      }
    }

    page.elements.forEach((el) => {
      if (el.kind === 'image') {
        const q = checkImage(el, widthMm);
        if (q) {
          quality[q] += 1;
          if (q === 'low') {
            issueId += 1;
            issues.push({ id: `iss-${issueId}`, pageId: page.id, elementId: el.id, pageIndex, kind: 'low-res', message: `Page ${pageIndex + 1} — Low-resolution image` });
          }
        }
      }

      if (el.kind === 'text') {
        if (el.fontKey && !FONTS.some((f) => f.key === el.fontKey)) {
          issueId += 1;
          issues.push({ id: `iss-${issueId}`, pageId: page.id, elementId: el.id, pageIndex, kind: 'missing-font', message: `Page ${pageIndex + 1} — Font unavailable, using fallback` });
        }

        const pageWidthPxRef = widthMm / MM_PER_PX_AT_96DPI;
        const fontPx = (el.role === 'headline' ? 28 : el.role === 'kicker' ? 10 : el.role === 'subheading' ? 9 : 10) * (pageWidthPxRef / 480);
        if (estimatesOverflow(el, widthMm, heightMm, fontPx)) {
          issueId += 1;
          issues.push({ id: `iss-${issueId}`, pageId: page.id, elementId: el.id, pageIndex, kind: 'text-overflow', message: `Page ${pageIndex + 1} — Text overflow` });
        }

        if (el.role === 'headline' || el.role === 'kicker' || el.role === 'subheading') {
          const left = el.xPct - el.widthPct / 2;
          const top = el.yPct - el.heightPct / 2;
          const right = el.xPct + el.widthPct / 2;
          const bottom = el.yPct + el.heightPct / 2;
          const tooClose = left < safeInset.xPct || top < safeInset.yPct || right > 100 - safeInset.xPct || bottom > 100 - safeInset.yPct;
          if (tooClose) {
            issueId += 1;
            issues.push({ id: `iss-${issueId}`, pageId: page.id, elementId: el.id, pageIndex, kind: 'safe-area', message: `Page ${pageIndex + 1} — Text is close to the trim edge` });
          }
        }
      }
    });
  });

  return { issues, quality };
}
