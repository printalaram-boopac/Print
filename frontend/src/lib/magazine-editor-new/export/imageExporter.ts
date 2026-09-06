import JSZip from 'jszip';
import type { EditorProject } from '../types';
import { resolvePageRole, computePrintedNumber } from '../pageHelpers';
import { fontFamilyFor } from '../../magazine/fonts';
import { renderPageToCanvas, canvasToBlob, type PageNumberDraw } from './renderPageToCanvas';
import { AssetResolver } from './assetResolver';
import type { ExportOptions, ExportProgress, ImageQualityPreset } from './types';
import { sanitizeFileName, pagedFileName } from './fileNaming';

const DPI_FOR_QUALITY: Record<ImageQualityPreset, number> = { standard: 96, high: 192, print: 300 };

export interface ImageExportResult {
  blob: Blob;
  fileName: string;
}

export async function exportImages(
  project: EditorProject,
  pageIndices: number[],
  options: ExportOptions,
  onProgress?: (p: ExportProgress) => void,
  isCancelled?: () => boolean,
): Promise<ImageExportResult> {
  const assets = new AssetResolver();
  const dpi = DPI_FOR_QUALITY[options.imageQuality];
  const mime = options.fileType === 'jpeg' ? 'image/jpeg' : 'image/png';
  const ext = options.fileType === 'jpeg' ? 'jpg' : 'png';
  const baseName = sanitizeFileName(project.templateName);

  const blobs: { fileName: string; blob: Blob }[] = [];

  for (let i = 0; i < pageIndices.length; i += 1) {
    if (isCancelled?.()) throw new DOMException('Export cancelled.', 'AbortError');
    const pageIndex = pageIndices[i];
    const page = project.pages[pageIndex];
    onProgress?.({ phase: 'rendering', currentPage: i + 1, totalPages: pageIndices.length, message: `Rendering page ${i + 1} of ${pageIndices.length}` });

    const role = resolvePageRole(page, pageIndex, project.pages.length);
    const num = computePrintedNumber(pageIndex, role, project.pageNumbers);
    const pageNumber: PageNumberDraw | null = num === null ? null : {
      label: String(num),
      position: project.pageNumbers.position,
      fontFamily: fontFamilyFor(project.pageNumbers.fontKey),
      fontSizePt: (project.pageNumbers.fontSize / 480) * project.dimensions.widthMm / (25.4 / 72),
      color: project.pageNumbers.color,
    };

    // eslint-disable-next-line no-await-in-loop
    const canvas = await renderPageToCanvas(page, project.dimensions, project.accentGradient, dpi, assets, pageNumber);
    if (mime === 'image/jpeg') {
      // JPEG has no transparency — flatten against opaque white first.
      const flat = document.createElement('canvas');
      flat.width = canvas.width;
      flat.height = canvas.height;
      const fctx = flat.getContext('2d')!;
      fctx.fillStyle = '#FFFFFF';
      fctx.fillRect(0, 0, flat.width, flat.height);
      fctx.drawImage(canvas, 0, 0);
      // eslint-disable-next-line no-await-in-loop
      blobs.push({ fileName: pagedFileName(baseName, i + 1, pageIndices.length, ext), blob: await canvasToBlob(flat, mime, options.jpegQuality) });
    } else {
      // eslint-disable-next-line no-await-in-loop
      blobs.push({ fileName: pagedFileName(baseName, i + 1, pageIndices.length, ext), blob: await canvasToBlob(canvas, mime) });
    }
    canvas.width = 0;
    canvas.height = 0;

    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  assets.clear();

  if (blobs.length === 1) {
    return { blob: blobs[0].blob, fileName: blobs[0].fileName };
  }

  onProgress?.({ phase: 'rendering', currentPage: pageIndices.length, totalPages: pageIndices.length, message: 'Packaging pages into a zip…' });
  const zip = new JSZip();
  blobs.forEach(({ fileName, blob }) => zip.file(fileName, blob));
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { blob: zipBlob, fileName: `${baseName}-pages.zip` };
}
