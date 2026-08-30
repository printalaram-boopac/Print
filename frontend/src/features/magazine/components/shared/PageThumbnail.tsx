import { memo } from 'react';
import type { MagazinePage } from '../../types';
import PageRenderer from './PageRenderer';

interface PageThumbnailProps {
  page: MagazinePage;
  docWidth: number;
  docHeight: number;
  /** Rendered width in CSS pixels; height follows the document aspect ratio. */
  width: number;
  className?: string;
}

/**
 * A page rendered small. Memoised on the page object so scrolling a long page
 * strip or a 20-card library grid does not re-render untouched thumbnails.
 */
function PageThumbnailBase({ page, docWidth, docHeight, width, className }: PageThumbnailProps) {
  return (
    <PageRenderer
      page={page}
      width={docWidth}
      height={docHeight}
      scale={width / docWidth}
      showPlaceholderLabels={false}
      className={className}
    />
  );
}

export const PageThumbnail = memo(PageThumbnailBase);
