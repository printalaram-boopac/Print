import { toPng } from 'html-to-image';

// Print/export resolution multiplier — the on-screen page tile can be a few
// hundred pixels wide; this upscales the captured image so the exported PDF
// isn't blurry.
const EXPORT_PIXEL_RATIO = 3;

// Elements marked data-pdf-hide="true" (remove/resize handles, "add photo"
// icons) are interaction-only chrome and are excluded from the captured image.
function shouldIncludeInCapture(el: HTMLElement) {
  return el.dataset?.pdfHide !== 'true';
}

// Captures each page's actual rendered DOM (decorative design + the user's
// photos) straight into the PDF, so the export always matches the live
// on-screen preview exactly — no separate canvas-drawing logic to keep in sync.
export async function generateMagazinePdf(pageNodes: Array<HTMLElement | null>): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  const PAGE_W = 420;
  const PAGE_H = 560;

  await (document as any).fonts?.ready;

  for (const node of pageNodes) {
    if (!node) continue;
    const pdfPage = pdfDoc.addPage([PAGE_W, PAGE_H]);

    try {
      const dataUrl = await toPng(node, {
        pixelRatio: EXPORT_PIXEL_RATIO,
        cacheBust: true,
        filter: (el) => !(el instanceof HTMLElement) || shouldIncludeInCapture(el),
      });
      const imgBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
      const img = await pdfDoc.embedPng(imgBytes);

      const imgRatio = img.width / img.height;
      const pageRatio = PAGE_W / PAGE_H;
      const drawWidth = imgRatio > pageRatio ? PAGE_H * imgRatio : PAGE_W;
      const drawHeight = imgRatio > pageRatio ? PAGE_H : PAGE_W / imgRatio;

      pdfPage.drawImage(img, {
        x: (PAGE_W - drawWidth) / 2,
        y: (PAGE_H - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight,
      });
    } catch (err) {
      console.error('Failed to capture page for export:', err);
      // Leave the page blank rather than failing the whole PDF.
    }
  }

  return pdfDoc.save();
}

export const buildPdfFileName = () => 'mini-magazine.pdf';

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
