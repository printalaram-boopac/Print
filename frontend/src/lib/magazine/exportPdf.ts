import { jsPDF } from 'jspdf';
import type { MagazineProject } from './types';
import { composeMagazine } from './renderPage';

export async function handleDownloadMagazine(project: MagazineProject): Promise<void> {
  const canvases = await composeMagazine(project, 200);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  canvases.forEach((canvas, i) => {
    if (i > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
  });
  pdf.save('printalarm-magazine.pdf');
}
