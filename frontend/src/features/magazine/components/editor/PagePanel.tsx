import { useState } from 'react';
import { Copy, GripVertical, Plus, Trash2 } from 'lucide-react';
import type { MagazineDocument } from '../../types';
import { useIsMobile } from '../../hooks/useIsMobile';
import { PageThumbnail } from '../shared/PageThumbnail';

interface PagePanelProps {
  document: MagazineDocument;
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onAddPage: () => void;
  onDuplicatePage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
  onMovePage: (from: number, to: number) => void;
}

const THUMB_WIDTH = 58;
const THUMB_WIDTH_MOBILE = 40;

/**
 * The page strip along the bottom of the editor: select, add, duplicate,
 * delete and drag to reorder pages.
 */
export default function PagePanel({
  document,
  activePageId,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onMovePage,
}: PagePanelProps) {
  const isMobile = useIsMobile();
  const thumbWidth = isMobile ? THUMB_WIDTH_MOBILE : THUMB_WIDTH;
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const finishDrag = () => {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      onMovePage(dragIndex, overIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="flex items-stretch gap-2 border-t border-gold-200/50 bg-white px-2 py-2 md:gap-3 md:px-3 md:py-3">
      <div className="flex flex-1 items-stretch gap-2 overflow-x-auto pb-1">
        {document.pages.map((page, index) => {
          const isActive = page.id === activePageId;
          const isDropTarget = overIndex === index && dragIndex !== null && dragIndex !== index;

          return (
            <div
              key={page.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIndex(index);
              }}
              onDragEnd={finishDrag}
              onDrop={(e) => {
                e.preventDefault();
                finishDrag();
              }}
              className={`group relative shrink-0 rounded-lg p-1 transition-all ${
                isDropTarget ? 'bg-luxury-gold/15 ring-2 ring-luxury-gold' : ''
              } ${dragIndex === index ? 'opacity-40' : ''}`}
            >
              <button
                type="button"
                onClick={() => onSelectPage(page.id)}
                title={page.name}
                className={`block overflow-hidden rounded-md border-2 bg-white transition-all ${
                  isActive
                    ? 'border-luxury-gold shadow-md'
                    : 'border-gold-200/60 opacity-80 hover:opacity-100 hover:border-gold-300'
                }`}
              >
                <PageThumbnail
                  page={page}
                  docWidth={document.width}
                  docHeight={document.height}
                  width={thumbWidth}
                />
              </button>

              <span
                className={`mt-1 block text-center text-[9px] font-bold ${
                  isActive ? 'text-luxury-gold' : 'text-gray-300'
                }`}
              >
                {index + 1}
              </span>

              {/* Per-page actions, revealed on hover / always on touch */}
              <div className="absolute -top-1 right-0 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 max-md:opacity-100">
                <button
                  type="button"
                  onClick={() => onDuplicatePage(page.id)}
                  title="Duplicate page"
                  className="flex h-5 w-5 items-center justify-center rounded bg-white text-luxury-accent shadow ring-1 ring-gold-200/70 hover:text-luxury-gold"
                >
                  <Copy className="h-2.5 w-2.5" />
                </button>
                {document.pages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDeletePage(page.id)}
                    title="Delete page"
                    className="flex h-5 w-5 items-center justify-center rounded bg-white text-red-500 shadow ring-1 ring-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>

              <GripVertical className="pointer-events-none absolute bottom-4 left-0 h-3 w-3 text-luxury-accent/25 opacity-0 group-hover:opacity-100" />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAddPage}
        className="flex w-[58px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gold-300 bg-amber-50/40 text-luxury-accent transition-colors hover:border-luxury-gold hover:bg-amber-50 md:w-[74px]"
      >
        <Plus className="h-4 w-4" />
        <span className="text-[9px] font-bold uppercase tracking-wider">Add page</span>
      </button>
    </div>
  );
}
