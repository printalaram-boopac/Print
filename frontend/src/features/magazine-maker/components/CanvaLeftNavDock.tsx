import { useState } from 'react';
import {
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  Layers,
  Shapes,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Upload,
} from 'lucide-react';
import { MagazineConfig, PageLayoutType } from '../types';
import { LAYOUT_PRESETS } from '../templates';

interface CanvaLeftNavDockProps {
  config: MagazineConfig;
  activePageIndex: number;
  setActivePageIndex: (index: number) => void;
  onOpenTemplates: () => void;
  onCreateNewBlank: () => void;
  onAddTextOverlay: (type: 'title' | 'subtitle' | 'body' | 'quote') => void;
  onBulkPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddPage: (layout?: PageLayoutType) => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onReorderPage: (fromIndex: number, toIndex: number) => void;
  onUpdatePageLayout: (pageIndex: number, layout: PageLayoutType) => void;
}

export function CanvaLeftNavDock({
  config,
  activePageIndex,
  setActivePageIndex,
  onOpenTemplates,
  onCreateNewBlank,
  onAddTextOverlay,
  onBulkPhotoUpload,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onReorderPage,
  onUpdatePageLayout,
}: CanvaLeftNavDockProps) {
  const [activeDockTab, setActiveDockTab] = useState<'templates' | 'text' | 'elements' | 'uploads' | 'pages' | null>(
    'text'
  );

  return (
    <div className="flex h-full bg-white border-r border-luxury-gold/30 text-luxury-accent select-none">
      {/* Icon Rail */}
      <div className="w-16 bg-luxury-black border-r border-luxury-gold/20 flex flex-col items-center py-4 gap-4 z-20">
        <button
          type="button"
          onClick={onOpenTemplates}
          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
            activeDockTab === 'templates'
              ? 'bg-luxury-accent text-white shadow-md'
              : 'text-gray-600 hover:text-luxury-accent hover:bg-luxury-gray'
          }`}
          title="Browse Magazine Templates"
        >
          <LayoutTemplate className="w-5 h-5 text-luxury-gold" />
          <span>Templates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDockTab(activeDockTab === 'text' ? null : 'text')}
          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
            activeDockTab === 'text'
              ? 'bg-luxury-accent text-white shadow-md'
              : 'text-gray-600 hover:text-luxury-accent hover:bg-luxury-gray'
          }`}
          title="Add Text Overlays"
        >
          <Type className="w-5 h-5 text-luxury-gold" />
          <span>Text</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDockTab(activeDockTab === 'elements' ? null : 'elements')}
          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
            activeDockTab === 'elements'
              ? 'bg-luxury-accent text-white shadow-md'
              : 'text-gray-600 hover:text-luxury-accent hover:bg-luxury-gray'
          }`}
          title="Page Layouts & Elements"
        >
          <Shapes className="w-5 h-5 text-luxury-gold" />
          <span>Layouts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDockTab(activeDockTab === 'uploads' ? null : 'uploads')}
          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
            activeDockTab === 'uploads'
              ? 'bg-luxury-accent text-white shadow-md'
              : 'text-gray-600 hover:text-luxury-accent hover:bg-luxury-gray'
          }`}
          title="Upload Photos"
        >
          <ImageIcon className="w-5 h-5 text-luxury-gold" />
          <span>Uploads</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDockTab(activeDockTab === 'pages' ? null : 'pages')}
          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
            activeDockTab === 'pages'
              ? 'bg-luxury-accent text-white shadow-md'
              : 'text-gray-600 hover:text-luxury-accent hover:bg-luxury-gray'
          }`}
          title="Manage Pages"
        >
          <Layers className="w-5 h-5 text-luxury-gold" />
          <span>Pages ({config.pages.length})</span>
        </button>

        <div className="w-8 h-px bg-luxury-gold/20 my-1" />

        <button
          type="button"
          onClick={onCreateNewBlank}
          className="p-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold text-luxury-gold hover:bg-luxury-gold/10 transition-all cursor-pointer border border-luxury-gold/30"
          title="Create New Blank Magazine"
        >
          <Plus className="w-5 h-5" />
          <span>New Zine</span>
        </button>
      </div>

      {/* Expanded Flyout Drawer Panel */}
      {activeDockTab && (
        <div className="w-72 bg-white p-4 border-r border-luxury-gold/30 overflow-y-auto space-y-5 animate-fade-in text-luxury-accent">
          {/* TAB: TEXT */}
          {activeDockTab === 'text' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-luxury-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-luxury-gold" /> Add Text Block
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveDockTab(null)}
                  className="text-xs text-gray-400 hover:text-luxury-accent"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onAddTextOverlay('title')}
                  className="w-full p-3 rounded-xl bg-luxury-black/60 hover:bg-luxury-gray text-left border border-luxury-gold/20 transition-all cursor-pointer group"
                >
                  <span className="block font-display font-bold text-lg text-luxury-accent group-hover:text-luxury-gold">
                    Add Heading
                  </span>
                  <span className="text-[10px] text-gray-500">Large display cover title</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAddTextOverlay('subtitle')}
                  className="w-full p-2.5 rounded-xl bg-luxury-black/60 hover:bg-luxury-gray text-left border border-luxury-gold/20 transition-all cursor-pointer group"
                >
                  <span className="block font-sans font-bold text-sm text-luxury-gold group-hover:text-luxury-accent">
                    Add Subheading
                  </span>
                  <span className="text-[10px] text-gray-500">Issue subtitle or section header</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAddTextOverlay('quote')}
                  className="w-full p-2.5 rounded-xl bg-luxury-black/60 hover:bg-luxury-gray text-left border border-luxury-gold/20 transition-all cursor-pointer group"
                >
                  <span className="block font-display italic text-xs text-luxury-accent group-hover:text-luxury-gold">
                    “Add Editorial Quote”
                  </span>
                  <span className="text-[10px] text-gray-500">Styled quote box for article spread</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAddTextOverlay('body')}
                  className="w-full p-2.5 rounded-xl bg-luxury-black/60 hover:bg-luxury-gray text-left border border-luxury-gold/20 transition-all cursor-pointer group"
                >
                  <span className="block font-sans text-xs text-gray-700 group-hover:text-luxury-accent">
                    Add Body Text Paragraph
                  </span>
                  <span className="text-[10px] text-gray-500">Standard story copy</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: LAYOUTS / ELEMENTS */}
          {activeDockTab === 'elements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-luxury-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Shapes className="w-4 h-4 text-luxury-gold" /> Page Layout Presets
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveDockTab(null)}
                  className="text-xs text-gray-400 hover:text-luxury-accent"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-600">
                Change layout structure for <strong>Page {activePageIndex + 1}</strong>:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {LAYOUT_PRESETS.map((preset) => {
                  const isCurrent = config.pages[activePageIndex]?.layout === preset.type;
                  return (
                    <button
                      key={preset.type}
                      type="button"
                      onClick={() => onUpdatePageLayout(activePageIndex, preset.type)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-luxury-black border-luxury-gold text-luxury-accent font-bold ring-1 ring-luxury-gold'
                          : 'bg-white border-luxury-gold/20 hover:border-luxury-gold text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-luxury-gold">{preset.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-luxury-gray text-gray-600">
                          {preset.defaultSlotCount} Slot{preset.defaultSlotCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">{preset.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: UPLOADS */}
          {activeDockTab === 'uploads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-luxury-accent uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-luxury-gold" /> Photo Gallery & Uploads
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveDockTab(null)}
                  className="text-xs text-gray-400 hover:text-luxury-accent"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-luxury-gold/40 bg-luxury-black/60 text-center space-y-3">
                <Upload className="w-8 h-8 text-luxury-gold mx-auto" />
                <div>
                  <h5 className="font-bold text-xs text-luxury-accent">Upload High-Res Photos</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Select multiple JPG/PNG photos to fill empty page slots
                  </p>
                </div>

                <label className="inline-block px-4 py-2 rounded-lg bg-luxury-gold hover:bg-gold-300 text-luxury-accent font-bold text-xs cursor-pointer shadow-md transition-colors">
                  Browse Device Files
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onBulkPhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB: PAGES MANAGER */}
          {activeDockTab === 'pages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-luxury-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-luxury-gold" /> Magazine Pages ({config.pages.length})
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveDockTab(null)}
                  className="text-xs text-gray-400 hover:text-luxury-accent"
                >
                  ✕
                </button>
              </div>

              <button
                type="button"
                onClick={() => onAddPage()}
                className="w-full py-2.5 rounded-xl bg-luxury-accent text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-800 shadow-md transition-colors"
              >
                <Plus className="w-4 h-4 text-luxury-gold" /> Add New A4 Page
              </button>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {config.pages.map((page, idx) => (
                  <div
                    key={page.id}
                    onClick={() => setActivePageIndex(idx)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      activePageIndex === idx
                        ? 'bg-luxury-black border-luxury-gold ring-1 ring-luxury-gold text-luxury-accent'
                        : 'bg-white border-luxury-gold/25 text-gray-600 hover:border-luxury-gold'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-luxury-black text-luxury-gold font-bold text-xs flex items-center justify-center border border-luxury-gold/30">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="block font-bold text-xs text-luxury-accent">{page.title}</span>
                        <span className="text-[10px] text-gray-500 uppercase">{page.layout}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReorderPage(idx, idx - 1);
                          }}
                          className="p-1 text-gray-500 hover:text-luxury-accent"
                          title="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {idx < config.pages.length - 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReorderPage(idx, idx + 1);
                          }}
                          className="p-1 text-gray-500 hover:text-luxury-accent"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicatePage(idx);
                        }}
                        className="p-1 text-gray-500 hover:text-luxury-gold"
                        title="Duplicate Page"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {config.pages.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePage(idx);
                          }}
                          className="p-1 text-gray-500 hover:text-rose-500"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
