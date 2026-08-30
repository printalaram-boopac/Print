import { useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MagazinePage } from '../../types';
import { AutoFitPage } from '../shared/AutoFitPage';
import { PageThumbnail } from '../shared/PageThumbnail';

/** Minimum horizontal travel that counts as a page swipe, in CSS pixels. */
const SWIPE_THRESHOLD = 48;

interface MagazineViewerProps {
  pages: MagazinePage[];
  docWidth: number;
  docHeight: number;
  index: number;
  onIndexChange: (index: number) => void;
  /** Height of the page stage. Defaults to a comfortable desktop reading size. */
  stageClassName?: string;
  /** Hide the thumbnail rail when space is tight. */
  showThumbnails?: boolean;
  /** Bind arrow keys at the window level — off inside the editor overlay. */
  captureKeys?: boolean;
}

/**
 * Reads a magazine at its true aspect ratio.
 *
 * Shared by the template preview route, the editor's preview mode and the saved
 * magazine list, so a design is always read the same way.
 */
export default function MagazineViewer({
  pages,
  docWidth,
  docHeight,
  index,
  onIndexChange,
  stageClassName = 'h-[58vh] min-h-[320px] md:h-[72vh]',
  showThumbnails = true,
  captureKeys = true,
}: MagazineViewerProps) {
  const total = pages.length;
  const swipeStart = useRef<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      if (total === 0) return;
      onIndexChange(Math.min(Math.max(next, 0), total - 1));
    },
    [onIndexChange, total],
  );

  useEffect(() => {
    if (!captureKeys) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'Home') go(0);
      if (e.key === 'End') go(total - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [captureKeys, go, index, total]);

  // Keep the active thumbnail visible when paging with keys or arrows.
  useEffect(() => {
    const rail = railRef.current;
    const active = rail?.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [index]);

  const page = pages[index];
  if (!page) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous page"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-200/60 bg-white text-luxury-accent shadow-sm transition-all hover:border-luxury-gold hover:text-luxury-gold disabled:cursor-not-allowed disabled:opacity-30 md:h-12 md:w-12"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          className={`relative flex-1 ${stageClassName}`}
          onPointerDown={(e) => {
            swipeStart.current = e.clientX;
          }}
          onPointerUp={(e) => {
            const start = swipeStart.current;
            swipeStart.current = null;
            if (start === null) return;
            const delta = e.clientX - start;
            if (Math.abs(delta) < SWIPE_THRESHOLD) return;
            go(delta < 0 ? index + 1 : index - 1);
          }}
          onPointerCancel={() => {
            swipeStart.current = null;
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="h-full shadow-[0_24px_64px_rgba(61,30,48,0.16)]"
              style={{ aspectRatio: `${docWidth} / ${docHeight}`, maxWidth: '100%' }}
            >
              <AutoFitPage page={page} docWidth={docWidth} docHeight={docHeight} />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index >= total - 1}
          aria-label="Next page"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-200/60 bg-white text-luxury-accent shadow-sm transition-all hover:border-luxury-gold hover:text-luxury-gold disabled:cursor-not-allowed disabled:opacity-30 md:h-12 md:w-12"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        {page.name} · Page {index + 1} of {total}
      </p>

      {showThumbnails && total > 1 && (
        <div
          ref={railRef}
          className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin]"
          role="tablist"
          aria-label="Magazine pages"
        >
          {pages.map((thumb, i) => (
            <button
              key={thumb.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              data-active={i === index}
              onClick={() => go(i)}
              title={thumb.name}
              className={`shrink-0 overflow-hidden rounded-md border-2 bg-white transition-all ${
                i === index
                  ? 'border-luxury-gold shadow-md'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-gold-200'
              }`}
            >
              <PageThumbnail page={thumb} docWidth={docWidth} docHeight={docHeight} width={62} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
