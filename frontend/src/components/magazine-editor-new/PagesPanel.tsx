import { useEffect, useRef, useState } from 'react';
import { Copy, Trash2, X } from 'lucide-react';
import type { PageNumberSettings, TemplateDimensions, TemplatePage } from '@/lib/magazine-editor-new/types';
import { resolvePageRole } from '@/lib/magazine-editor-new/pageHelpers';
import LayersPanel from './LayersPanel';
import PageThumbnailRow from './PageThumbnailRow';
import AddPageButton from './AddPageButton';
import DocumentSizeControls from './DocumentSizeControls';
import PageNumberSettingsPopover from './PageNumberSettingsPopover';
import PageLayoutPickerModal from './PageLayoutPickerModal';

interface PagesPanelProps {
  pages: TemplatePage[];
  dimensions: TemplateDimensions;
  gradient: string;
  selectedPageIds: string[];
  onSelectPage: (id: string, e: { shiftKey?: boolean; metaKey?: boolean; ctrlKey?: boolean }) => void;

  selectedElementIds: string[];
  onSelectElement: (id: string, e: React.MouseEvent) => void;
  onToggleVisibleElement: (id: string) => void;
  onToggleLockElement: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;

  canPastePage: boolean;
  hasContent: boolean;
  pageNumbers: PageNumberSettings;
  onChangePageNumberSettings: (patch: Partial<PageNumberSettings>) => void;
  recentColors: string[];

  onAddBlankPage: () => void;
  onDuplicateCurrentPage: () => void;
  onAddFromLayout: (layout: TemplatePage) => void;
  onRenamePage: (id: string, name: string) => void;
  onDuplicatePage: (id: string) => void;
  onDeletePage: (id: string) => void;
  onMovePage: (id: string, direction: 'up' | 'down') => void;
  onAddPageBefore: (id: string) => void;
  onAddPageAfter: (id: string) => void;
  onCopyPage: (id: string) => void;
  onPastePageAfter: (id: string) => void;
  onReorderPages: (draggedId: string, targetId: string, edge: 'before' | 'after') => void;
  onDeleteSelectedPages: () => void;
  onDuplicateSelectedPages: () => void;
  onOpenPageSettings: (id: string) => void;
  onChangeDimensions: (next: TemplateDimensions) => void;
  onEditBackground: () => void;

  currentPage: TemplatePage;
  onClose?: () => void;
}

export default function PagesPanel({
  pages, dimensions, gradient, selectedPageIds, onSelectPage,
  selectedElementIds, onSelectElement, onToggleVisibleElement, onToggleLockElement, onMoveLayer,
  canPastePage, hasContent, pageNumbers, onChangePageNumberSettings, recentColors,
  onAddBlankPage, onDuplicateCurrentPage, onAddFromLayout, onRenamePage,
  onDuplicatePage, onDeletePage, onMovePage, onAddPageBefore, onAddPageAfter,
  onCopyPage, onPastePageAfter, onReorderPages, onDeleteSelectedPages, onDuplicateSelectedPages,
  onOpenPageSettings, onChangeDimensions, onEditBackground, currentPage, onClose,
}: PagesPanelProps) {
  const [tab, setTab] = useState<'pages' | 'layers'>('pages');
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [drag, setDrag] = useState<{ id: string; overId: string | null; edge: 'before' | 'after' | null }>({ id: '', overId: null, edge: null });
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    selectedRowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedPageIds]);

  return (
    <aside className="w-full sm:w-[260px] flex-shrink-0 bg-white border-l border-[#E7E7E4] flex flex-col min-h-0 h-full overflow-x-hidden">
      <div className="p-3 border-b border-[#E7E7E4] flex items-center gap-1">
        {(['pages', 'layers'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold capitalize cursor-pointer transition-colors ${tab === t ? 'bg-[#F5F5F3] text-[#1C2024]' : 'text-[#6F7478] hover:text-[#1C2024]'}`}
          >
            {t}
          </button>
        ))}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close pages panel"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] transition-colors cursor-pointer ml-1"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {tab === 'pages' ? (
        <>
          <div className="px-3 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-semibold text-[#1C2024]">Pages</h2>
              <span className="text-[11px] text-[#6F7478]">{pages.length} page{pages.length === 1 ? '' : 's'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AddPageButton
                onAddBlank={onAddBlankPage}
                onDuplicateCurrent={onDuplicateCurrentPage}
                onAddFromTemplate={() => setLayoutPickerOpen(true)}
              />
            </div>
            <DocumentSizeControls dimensions={dimensions} hasContent={hasContent} onChangeDimensions={onChangeDimensions} />
            <PageNumberSettingsPopover settings={pageNumbers} pageCount={pages.length} recentColors={recentColors} onChange={onChangePageNumberSettings} />

            {selectedPageIds.length > 1 && (
              <div className="flex items-center justify-between bg-[#F5F5F3] rounded-lg px-2 py-1.5">
                <span className="text-[11px] text-[#6F7478]">{selectedPageIds.length} pages selected</span>
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Duplicate selected pages" onClick={onDuplicateSelectedPages} className="w-6 h-6 rounded flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] cursor-pointer">
                    <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <button type="button" aria-label="Delete selected pages" onClick={onDeleteSelectedPages} className="w-6 h-6 rounded flex items-center justify-center text-red-600 hover:bg-red-50 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-3" data-lenis-prevent>
            {pages.map((page, i) => {
              const isSelected = selectedPageIds.includes(page.id);
              const dropIndicator = drag.overId === page.id ? drag.edge : null;
              return (
                <div key={page.id} ref={isSelected ? selectedRowRef : undefined}>
                  <PageThumbnailRow
                    page={page}
                    index={i}
                    role={resolvePageRole(page, i, pages.length)}
                    dimensions={dimensions}
                    gradient={gradient}
                    selected={isSelected}
                    canPaste={canPastePage}
                    canMoveUp={i > 0}
                    canMoveDown={i < pages.length - 1}
                    dropIndicator={dropIndicator}
                    onSelect={(e) => onSelectPage(page.id, e)}
                    onRename={(name) => onRenamePage(page.id, name)}
                    onDuplicate={() => onDuplicatePage(page.id)}
                    onDelete={() => onDeletePage(page.id)}
                    onMoveUp={() => onMovePage(page.id, 'up')}
                    onMoveDown={() => onMovePage(page.id, 'down')}
                    onAddBefore={() => onAddPageBefore(page.id)}
                    onAddAfter={() => onAddPageAfter(page.id)}
                    onCopy={() => onCopyPage(page.id)}
                    onPaste={() => onPastePageAfter(page.id)}
                    onOpenSettings={() => onOpenPageSettings(page.id)}
                    onDragStart={() => setDrag({ id: page.id, overId: null, edge: null })}
                    onDragOverRow={(edge) => setDrag((d) => (d.id === page.id ? d : { ...d, overId: page.id, edge }))}
                    onDrop={() => {
                      if (drag.id && drag.id !== page.id && drag.edge) onReorderPages(drag.id, page.id, drag.edge);
                      setDrag({ id: '', overId: null, edge: null });
                    }}
                    onDragEnd={() => setDrag({ id: '', overId: null, edge: null })}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto overflow-x-hidden" data-lenis-prevent>
          {currentPage.locked && (
            <p className="px-3 pt-2 text-[11px] text-[#B8895A] flex items-center gap-1">This page is locked</p>
          )}
          <LayersPanel
            elements={currentPage.elements}
            selectedIds={selectedElementIds}
            onSelect={onSelectElement}
            onToggleVisible={onToggleVisibleElement}
            onToggleLock={onToggleLockElement}
            onMove={onMoveLayer}
            background={currentPage.background}
            isCoverLike={currentPage.kind === 'cover' || currentPage.kind === 'back-cover'}
            gradient={gradient}
            onEditBackground={onEditBackground}
          />
        </div>
      )}

      {layoutPickerOpen && (
        <PageLayoutPickerModal
          onClose={() => setLayoutPickerOpen(false)}
          onChoose={(layout) => { onAddFromLayout(layout); setLayoutPickerOpen(false); }}
        />
      )}
    </aside>
  );
}
