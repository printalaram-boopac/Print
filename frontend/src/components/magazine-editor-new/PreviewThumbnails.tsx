import type { TemplateDimensions, TemplatePage } from '@/lib/magazine-editor-new/types';
import MiniPageThumbnail from './MiniPageThumbnail';

interface PreviewThumbnailsProps {
  pages: TemplatePage[];
  gradient: string;
  dimensions: TemplateDimensions;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function PreviewThumbnails({ pages, gradient, dimensions, activeIndex, onSelect }: PreviewThumbnailsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1">
      {pages.map((page, i) => (
        <button
          key={page.id}
          type="button"
          onClick={() => onSelect(i)}
          className={`flex-shrink-0 w-12 rounded border-2 transition-colors cursor-pointer overflow-hidden ${
            activeIndex === i ? 'border-[#20272C]' : 'border-transparent'
          }`}
          style={{ aspectRatio: '210 / 297' }}
          aria-label={`Page ${i + 1} — ${page.name}`}
        >
          <MiniPageThumbnail page={page} dimensions={dimensions} gradient={gradient} isCoverLike={page.kind === 'cover' || page.kind === 'back-cover'} />
        </button>
      ))}
    </div>
  );
}
