import type { TemplateDimensions, TemplatePage } from '@/lib/magazine-editor-new/types';
import MiniPageThumbnail from './MiniPageThumbnail';

interface PreviewCanvasProps {
  page: TemplatePage;
  gradient: string;
  dimensions: TemplateDimensions;
}

/** Renders one template page at preview size using the exact same renderer
 * the Pages panel thumbnails use (MiniPageThumbnail) — the preview modal
 * always shows the real page data, never a simplified schematic mockup
 * (Step 9 §10, §43). */
export default function PreviewCanvas({ page, gradient, dimensions }: PreviewCanvasProps) {
  const isCoverLike = page.kind === 'cover' || page.kind === 'back-cover';
  return (
    <div className="w-full h-full rounded-sm overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)]">
      <MiniPageThumbnail page={page} dimensions={dimensions} gradient={gradient} isCoverLike={isCoverLike} />
    </div>
  );
}
