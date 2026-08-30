import { memo } from 'react';
import type { MagazinePage } from '../../types';
import { useCanvasScale } from '../../hooks/useCanvasScale';
import PageRenderer from './PageRenderer';

interface AutoFitPageProps {
  page: MagazinePage;
  docWidth: number;
  docHeight: number;
  showPlaceholderLabels?: boolean;
  className?: string;
}

/**
 * Renders a page scaled to exactly fill its parent box.
 *
 * Card grids, previews and thumbnails size themselves with CSS; this measures
 * the resulting box and derives the display scale, so a page is never cropped
 * or letterboxed and the stored coordinates stay untouched.
 */
function AutoFitPageBase({ page, docWidth, docHeight, showPlaceholderLabels = false, className }: AutoFitPageProps) {
  const { containerRef, scale, ready } = useCanvasScale<HTMLDivElement>({
    docWidth,
    docHeight,
    padding: 0,
  });

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {ready && (
        <PageRenderer
          page={page}
          width={docWidth}
          height={docHeight}
          scale={scale}
          showPlaceholderLabels={showPlaceholderLabels}
        />
      )}
    </div>
  );
}

export const AutoFitPage = memo(AutoFitPageBase);
