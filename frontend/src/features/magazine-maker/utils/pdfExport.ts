import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

/**
 * Converts HTML element page nodes into a multi-page A4 printable PDF document using jsPDF.
 * @param pageElements Array of HTMLDivElements representing each A4 magazine page
 * @param documentTitle File name prefix for saving the PDF
 */
export async function generateA4MagazinePDF(
  pageElements: (HTMLDivElement | null)[],
  documentTitle = 'My-Photo-Magazine'
): Promise<void> {
  const validElements = pageElements.filter((el): el is HTMLDivElement => el !== null);

  if (validElements.length === 0) {
    throw new Error('No page elements found to generate PDF.');
  }

  // Create jsPDF instance configured for standard A4 page size (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const a4WidthMm = 210;
  const a4HeightMm = 297;

  for (let i = 0; i < validElements.length; i++) {
    const el = validElements[i];

    // Capture the DOM node as a high resolution PNG image
    const dataUrl = await toPng(el, {
      pixelRatio: 2, // High DPI for clear print graphics
      cacheBust: true,
      quality: 0.98,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    });

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // Render image to fit exact A4 paper dimensions
    pdf.addImage(dataUrl, 'PNG', 0, 0, a4WidthMm, a4HeightMm, undefined, 'FAST');
  }

  const fileName = `${documentTitle.toLowerCase().replace(/\s+/g, '-')}-a4-magazine.pdf`;
  pdf.save(fileName);
}
