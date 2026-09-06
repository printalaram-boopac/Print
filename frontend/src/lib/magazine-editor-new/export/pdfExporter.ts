import { jsPDF } from 'jspdf';
import type { EditorProject } from '../types';
import { resolvePageRole, computePrintedNumber } from '../pageHelpers';
import { BLEED_MM } from '../printGuides';
import { fontFamilyFor } from '../../magazine/fonts';
import { renderPageToPdf, type PdfPageNumber } from './renderPageToPdf';
import { AssetResolver } from './assetResolver';
import type { ExportOptions, ExportProgress } from './types';
import { sanitizeFileName } from './fileNaming';

function drawCropMarks(doc: jsPDF, pageWidthMm: number, pageHeightMm: number, bleedMm: number) {
  const markLen = 4;
  const gap = 2;
  doc.saveGraphicsState();
  doc.setDrawColor('#000000');
  doc.setLineWidth(0.15);
  doc.setLineDashPattern([], 0);
  const trimX0 = bleedMm, trimY0 = bleedMm;
  const trimX1 = pageWidthMm - bleedMm, trimY1 = pageHeightMm - bleedMm;

  // Top-left
  doc.line(trimX0 - gap - markLen, trimY0, trimX0 - gap, trimY0);
  doc.line(trimX0, trimY0 - gap - markLen, trimX0, trimY0 - gap);
  // Top-right
  doc.line(trimX1 + gap, trimY0, trimX1 + gap + markLen, trimY0);
  doc.line(trimX1, trimY0 - gap - markLen, trimX1, trimY0 - gap);
  // Bottom-left
  doc.line(trimX0 - gap - markLen, trimY1, trimX0 - gap, trimY1);
  doc.line(trimX0, trimY1 + gap, trimX0, trimY1 + gap + markLen);
  // Bottom-right
  doc.line(trimX1 + gap, trimY1, trimX1 + gap + markLen, trimY1);
  doc.line(trimX1, trimY1 + gap, trimX1, trimY1 + gap + markLen);
  doc.restoreGraphicsState();
}

export interface PdfExportResult {
  blob: Blob;
  fileName: string;
}

export async function exportPdf(
  project: EditorProject,
  pageIndices: number[],
  options: ExportOptions,
  onProgress?: (p: ExportProgress) => void,
  isCancelled?: () => boolean,
): Promise<PdfExportResult> {
  const assets = new AssetResolver();
  const includeBleed = options.fileType === 'pdf-print' && options.includeBleed;
  const bleedMm = includeBleed ? BLEED_MM : 0;
  const pageWidthMm = project.dimensions.widthMm + bleedMm * 2;
  const pageHeightMm = project.dimensions.heightMm + bleedMm * 2;

  const doc = new jsPDF({
    orientation: pageWidthMm > pageHeightMm ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [pageWidthMm, pageHeightMm],
    compress: options.fileType === 'pdf-standard',
  });

  doc.setProperties({
    title: project.templateName || 'Untitled Magazine',
    creator: 'PrintAlarm Magazine Maker',
    // @ts-expect-error jsPDF's DocumentProperties type omits producer, but the underlying API accepts it.
    producer: 'PrintAlarm',
  });

  for (let i = 0; i < pageIndices.length; i += 1) {
    if (isCancelled?.()) throw new DOMException('Export cancelled.', 'AbortError');
    const pageIndex = pageIndices[i];
    const page = project.pages[pageIndex];
    onProgress?.({ phase: 'rendering', currentPage: i + 1, totalPages: pageIndices.length, message: `Rendering page ${i + 1} of ${pageIndices.length}` });

    if (i > 0) doc.addPage([pageWidthMm, pageHeightMm], pageWidthMm > pageHeightMm ? 'landscape' : 'portrait');

    const role = resolvePageRole(page, pageIndex, project.pages.length);
    const num = computePrintedNumber(pageIndex, role, project.pageNumbers);
    const pageNumber: PdfPageNumber | null = num === null ? null : {
      label: String(num),
      position: project.pageNumbers.position,
      fontFamily: fontFamilyFor(project.pageNumbers.fontKey),
      fontSizePt: (project.pageNumbers.fontSize / 480) * project.dimensions.widthMm / (25.4 / 72),
      color: project.pageNumbers.color,
    };

    // eslint-disable-next-line no-await-in-loop
    await renderPageToPdf({
      doc, page, dimensions: project.dimensions, gradient: project.accentGradient,
      originXMm: bleedMm, originYMm: bleedMm, pageWidthMm, pageHeightMm,
      isCoverLike: page.kind === 'cover' || page.kind === 'back-cover',
      assets, pageNumber,
    });

    if (options.cropMarks && bleedMm > 0) drawCropMarks(doc, pageWidthMm, pageHeightMm, bleedMm);

    // Yield to the browser between pages so typing/UI never freezes (§62–63).
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  assets.clear();
  const blob = doc.output('blob');
  const fileName = `${sanitizeFileName(project.templateName)}.pdf`;
  return { blob, fileName };
}
