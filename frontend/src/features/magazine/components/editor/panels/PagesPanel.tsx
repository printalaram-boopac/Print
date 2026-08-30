import { ChevronDown, ChevronUp, Copy, FilePlus2, Trash2 } from 'lucide-react';
import type { MagazineDocument } from '../../../types';
import { PageThumbnail } from '../../shared/PageThumbnail';
import { PanelButton, PanelSection } from '../controls';

interface PagesPanelProps {
  document: MagazineDocument;
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onAddPage: () => void;
  onDuplicatePage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
  onRenamePage: (pageId: string, name: string) => void;
  onMovePage: (from: number, to: number) => void;
}

/** Full page manager: order, rename, duplicate and delete pages. */
export default function PagesPanel({
  document,
  activePageId,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onRenamePage,
  onMovePage,
}: PagesPanelProps) {
  const total = document.pages.length;

  return (
    <div className="space-y-6 p-4">
      <PanelSection title={`Pages · ${total}`}>
        <PanelButton onClick={onAddPage} icon={<FilePlus2 className="h-3.5 w-3.5" />}>
          Add blank page
        </PanelButton>
      </PanelSection>

      <div className="space-y-2">
        {document.pages.map((page, index) => {
          const isActive = page.id === activePageId;
          return (
            <div
              key={page.id}
              className={`rounded-xl border p-2.5 transition-all ${
                isActive ? 'border-luxury-gold bg-amber-50/50 shadow-sm' : 'border-gold-200/50 bg-white'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => onSelectPage(page.id)}
                  className="shrink-0 overflow-hidden rounded border border-gold-200/60"
                  title={`Go to ${page.name}`}
                >
                  <PageThumbnail
                    page={page}
                    docWidth={document.width}
                    docHeight={document.height}
                    width={46}
                  />
                </button>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-luxury-gold">{index + 1}</span>
                    <input
                      value={page.name}
                      onChange={(e) => onRenamePage(page.id, e.target.value)}
                      onFocus={() => onSelectPage(page.id)}
                      className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-1 py-0.5 text-xs font-medium text-luxury-accent outline-none hover:border-gold-200/60 focus:border-luxury-gold"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onMovePage(index, index - 1)}
                      disabled={index === 0}
                      title="Move up"
                      className="flex h-6 w-6 items-center justify-center rounded border border-gold-200/50 text-luxury-accent transition-colors hover:border-luxury-gold disabled:opacity-30"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMovePage(index, index + 1)}
                      disabled={index === total - 1}
                      title="Move down"
                      className="flex h-6 w-6 items-center justify-center rounded border border-gold-200/50 text-luxury-accent transition-colors hover:border-luxury-gold disabled:opacity-30"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicatePage(page.id)}
                      title="Duplicate page"
                      className="flex h-6 w-6 items-center justify-center rounded border border-gold-200/50 text-luxury-accent transition-colors hover:border-luxury-gold"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeletePage(page.id)}
                      disabled={total <= 1}
                      title={total <= 1 ? 'A magazine needs at least one page' : 'Delete page'}
                      className="flex h-6 w-6 items-center justify-center rounded border border-red-200 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-30"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
