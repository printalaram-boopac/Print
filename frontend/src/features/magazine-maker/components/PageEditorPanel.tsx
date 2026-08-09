import { useRef } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Download,
  Printer,
  Layers,
  Settings2,
  Check,
  ZoomIn,
  ZoomOut,
  Sliders,
  Type,
  Move,
} from 'lucide-react';
import { MagazineConfig, MagazinePage, PageLayoutType } from '../types';
import { LAYOUT_PRESETS } from '../templates';
import { SelectedTextInfo } from './CanvaTopToolbar';

interface PageEditorPanelProps {
  config: MagazineConfig;
  activePageIndex: number;
  setActivePageIndex: (index: number) => void;
  onUpdateConfig: (updated: Partial<MagazineConfig>) => void;
  onUpdatePage: (pageIndex: number, updated: Partial<MagazinePage>) => void;
  onSlotZoomChanged?: (slotId: string, zoom: number) => void;
  onAddPage: (layoutType?: PageLayoutType) => void;
  onDeletePage: (pageIndex: number) => void;
  onBulkPhotoUpload: (files: FileList) => void;
  onGeneratePdf: () => void;
  isExportingPdf: boolean;
  onAddTextOverlay?: (type: 'title' | 'subtitle' | 'body' | 'quote') => void;
  onDeleteOverlay?: (overlayId: string) => void;
  selectedTextInfo?: SelectedTextInfo | null;
  onSelectTextInfo?: (info: SelectedTextInfo | null) => void;
}

const FONT_OPTIONS = [
  { label: 'Serif (Playfair Display)', value: "'Playfair Display', serif" },
  { label: 'Sans-Serif (Plus Jakarta)', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Monospace (Courier Prime)', value: "'Courier Prime', monospace" },
  { label: 'Cursive (Great Vibes)', value: "'Great Vibes', cursive" },
  { label: 'Display (Cinzel)', value: "'Cinzel', serif" },
  { label: 'Modern (Montserrat)', value: "'Montserrat', sans-serif" },
];

export function PageEditorPanel({
  config,
  activePageIndex,
  setActivePageIndex,
  onUpdateConfig,
  onUpdatePage,
  onSlotZoomChanged,
  onAddPage,
  onDeletePage,
  onBulkPhotoUpload,
  onGeneratePdf,
  isExportingPdf,
  onAddTextOverlay,
  onDeleteOverlay,
  selectedTextInfo,
  onSelectTextInfo,
}: PageEditorPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activePage = config.pages[activePageIndex] || config.pages[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-luxury-accent font-sans">
      {/* Magazine Details Settings Box */}
      <div className="p-5 rounded-xl border border-luxury-gold/30 bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-luxury-gold/20 pb-3">
          <div className="flex items-center gap-2 text-luxury-gold">
            <Settings2 className="w-4 h-4" />
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-luxury-accent">
              Magazine Branding
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold font-mono font-bold">
            A4 PRINT READY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-gray-600 mb-1">
              MAGAZINE TITLE
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => onUpdateConfig({ title: e.target.value })}
              className="w-full bg-luxury-black border border-luxury-gold/30 rounded px-3 py-1.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold font-medium"
              placeholder="e.g. SUMMER MEMORIES"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-gray-600 mb-1">
              SUBTITLE / TAGLINE
            </label>
            <input
              type="text"
              value={config.subtitle}
              onChange={(e) => onUpdateConfig({ subtitle: e.target.value })}
              className="w-full bg-luxury-black border border-luxury-gold/30 rounded px-3 py-1.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold font-medium"
              placeholder="e.g. VOL. 01 • PHOTO COLLECTION"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-gray-600 mb-1">
              ISSUE / DATE
            </label>
            <input
              type="text"
              value={config.dateString}
              onChange={(e) => onUpdateConfig({ dateString: e.target.value })}
              className="w-full bg-luxury-black border border-luxury-gold/30 rounded px-3 py-1.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold font-medium"
              placeholder="e.g. AUGUST 2026"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-gray-600 mb-1">
              EDITOR / AUTHOR
            </label>
            <input
              type="text"
              value={config.editorName}
              onChange={(e) => onUpdateConfig({ editorName: e.target.value })}
              className="w-full bg-luxury-black border border-luxury-gold/30 rounded px-3 py-1.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold font-medium"
              placeholder="e.g. CREATOR STUDIO"
            />
          </div>
        </div>
      </div>

      {/* Page Manager & Layout Selection */}
      <div className="p-5 rounded-xl border border-luxury-gold/30 bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-luxury-gold/20 pb-3">
          <div className="flex items-center gap-2 text-luxury-gold">
            <Layers className="w-4 h-4" />
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-luxury-accent">
              Page Navigator ({config.pages.length} Pages)
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onAddPage()}
            className="px-3 py-1.5 rounded bg-luxury-gold text-luxury-accent hover:bg-gold-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Page
          </button>
        </div>

        {/* Page Thumbnail Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {config.pages.map((page, idx) => {
            const isActive = activePageIndex === idx;
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => setActivePageIndex(idx)}
                className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-luxury-gold text-luxury-accent border-luxury-gold shadow-xs'
                    : 'bg-luxury-black text-gray-700 border-luxury-gold/20 hover:border-luxury-gold'
                }`}
              >
                <span>PG {page.pageNumber}</span>
                <span className="text-[10px] opacity-75 capitalize">({page.layout.replace('_', ' ')})</span>
              </button>
            );
          })}
        </div>

        {/* Active Page Configuration */}
        {activePage && (
          <div className="p-4 rounded-lg bg-luxury-black border border-luxury-gold/20 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase font-bold text-luxury-gold">
                Editing Page {activePage.pageNumber} Layout
              </h4>
              {config.pages.length > 1 && (
                <button
                  type="button"
                  onClick={() => onDeletePage(activePageIndex)}
                  className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Page
                </button>
              )}
            </div>

            {/* Layout Preset Choice */}
            <div>
              <label className="block text-[11px] font-mono text-gray-600 mb-2">
                A4 PAGE LAYOUT TEMPLATE
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LAYOUT_PRESETS.map((preset) => {
                  const isSelected = activePage.layout === preset.type;
                  return (
                    <button
                      key={preset.type}
                      type="button"
                      onClick={() => onUpdatePage(activePageIndex, { layout: preset.type })}
                      className={`p-2.5 rounded text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-luxury-gold/15 border-luxury-gold text-luxury-accent shadow-xs'
                          : 'bg-white border-gray-200 text-gray-600 hover:text-luxury-accent hover:border-luxury-gold/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold font-mono">
                        <span className="truncate">{preset.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-luxury-gold shrink-0" />}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-tight">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Page Quote / Editorial Text */}
            <div>
              <label className="block text-[11px] font-mono text-gray-600 mb-1">
                EDITORIAL NOTE / PAGE QUOTE
              </label>
              <textarea
                value={activePage.editorialText || ''}
                onChange={(e) => onUpdatePage(activePageIndex, { editorialText: e.target.value })}
                rows={2}
                className="w-full bg-white border border-luxury-gold/30 rounded p-2 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold resize-none"
                placeholder="Enter quote or story note for this page..."
              />
            </div>

            {/* Text Overlays & Typography Module */}
            <div className="pt-3 border-t border-luxury-gold/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-luxury-gold">
                  <Type className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono uppercase font-bold text-luxury-accent">
                    Text Overlays & Elements ({activePage.textOverlays?.length || 0})
                  </span>
                </div>
              </div>

              {/* Quick Add Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => onAddTextOverlay?.('title')}
                  className="px-2 py-1.5 rounded bg-white hover:bg-luxury-gold/20 border border-luxury-gold/30 text-[11px] font-bold text-luxury-accent flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3 text-luxury-gold" /> Heading
                </button>
                <button
                  type="button"
                  onClick={() => onAddTextOverlay?.('subtitle')}
                  className="px-2 py-1.5 rounded bg-white hover:bg-luxury-gold/20 border border-luxury-gold/30 text-[11px] font-bold text-luxury-accent flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3 text-luxury-gold" /> Subtitle
                </button>
                <button
                  type="button"
                  onClick={() => onAddTextOverlay?.('body')}
                  className="px-2 py-1.5 rounded bg-white hover:bg-luxury-gold/20 border border-luxury-gold/30 text-[11px] font-bold text-luxury-accent flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3 text-luxury-gold" /> Body Text
                </button>
                <button
                  type="button"
                  onClick={() => onAddTextOverlay?.('quote')}
                  className="px-2 py-1.5 rounded bg-white hover:bg-luxury-gold/20 border border-luxury-gold/30 text-[11px] font-bold text-luxury-accent flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3 text-luxury-gold" /> Quote
                </button>
              </div>

              {/* Text Overlay List & Controls */}
              {activePage.textOverlays && activePage.textOverlays.length > 0 && (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  {activePage.textOverlays.map((ov, oIdx) => {
                    const isSelected = selectedTextInfo?.id === ov.id;
                    return (
                      <div
                        key={ov.id}
                        className={`p-3 rounded-lg border text-xs space-y-2 shadow-xs transition-all ${
                          isSelected
                            ? 'bg-luxury-gold/10 border-luxury-gold'
                            : 'bg-white border-luxury-gold/20'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono">
                          <button
                            type="button"
                            onClick={() =>
                              onSelectTextInfo?.({
                                id: ov.id,
                                type: 'overlay',
                                text: ov.text,
                                fontSize: ov.fontSize,
                                fontFamily: ov.fontFamily,
                                color: ov.color,
                                align: ov.align,
                                fontWeight: ov.fontWeight,
                                fontStyle: ov.fontStyle,
                                overlay: ov,
                              })
                            }
                            className="font-bold text-luxury-accent flex items-center gap-1.5 hover:underline text-left truncate cursor-pointer"
                          >
                            <span className="w-4 h-4 rounded-full bg-luxury-gold/20 text-luxury-gold text-[10px] flex items-center justify-center font-bold shrink-0">
                              T{oIdx + 1}
                            </span>
                            <span className="truncate max-w-[150px]">"{ov.text}"</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteOverlay?.(ov.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer shrink-0"
                            title="Delete Overlay"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Text Value */}
                        <div>
                          <input
                            type="text"
                            value={ov.text}
                            onChange={(e) => {
                              const updatedOverlays = activePage.textOverlays.map((item) =>
                                item.id === ov.id ? { ...item, text: e.target.value } : item
                              );
                              onUpdatePage(activePageIndex, { textOverlays: updatedOverlays });
                            }}
                            className="w-full bg-luxury-black border border-luxury-gold/30 rounded px-2 py-1 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold"
                            placeholder="Text content..."
                          />
                        </div>

                        {/* Font Family & Size & Color */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <select
                              value={ov.fontFamily || "'Playfair Display', serif"}
                              onChange={(e) => {
                                const updatedOverlays = activePage.textOverlays.map((item) =>
                                  item.id === ov.id ? { ...item, fontFamily: e.target.value } : item
                                );
                                onUpdatePage(activePageIndex, { textOverlays: updatedOverlays });
                              }}
                              className="w-full bg-luxury-black border border-luxury-gold/30 rounded px-1.5 py-1 text-[11px] text-luxury-accent focus:outline-none"
                            >
                              {FONT_OPTIONS.map((f) => (
                                <option key={f.value} value={f.value}>
                                  {f.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-1">
                            <input
                              type="color"
                              value={ov.color || '#111827'}
                              onChange={(e) => {
                                const updatedOverlays = activePage.textOverlays.map((item) =>
                                  item.id === ov.id ? { ...item, color: e.target.value } : item
                                );
                                onUpdatePage(activePageIndex, { textOverlays: updatedOverlays });
                              }}
                              className="w-6 h-6 rounded border border-luxury-gold/30 cursor-pointer p-0 shrink-0"
                              title="Text Color"
                            />
                            <input
                              type="number"
                              min="8"
                              max="72"
                              value={ov.fontSize || 16}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 16;
                                const updatedOverlays = activePage.textOverlays.map((item) =>
                                  item.id === ov.id ? { ...item, fontSize: val } : item
                                );
                                onUpdatePage(activePageIndex, { textOverlays: updatedOverlays });
                              }}
                              className="w-full bg-luxury-black border border-luxury-gold/30 rounded px-1 py-1 text-[11px] text-center font-mono text-luxury-accent focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Position Sliders (X & Y %) */}
                        <div className="space-y-1 pt-1 border-t border-luxury-gold/10 text-[10px] font-mono">
                          <div className="flex items-center justify-between text-gray-500">
                            <span className="flex items-center gap-1">
                              <Move className="w-3 h-3 text-luxury-gold" /> Horizontal Position
                            </span>
                            <span>{Math.round(ov.xPct)}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="95"
                            value={ov.xPct}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              const updatedOverlays = activePage.textOverlays.map((item) =>
                                item.id === ov.id ? { ...item, xPct: val } : item
                              );
                              onUpdatePage(activePageIndex, { textOverlays: updatedOverlays });
                            }}
                            className="w-full accent-luxury-gold cursor-pointer h-1 bg-gray-200 rounded"
                          />

                          <div className="flex items-center justify-between text-gray-500 pt-0.5">
                            <span className="flex items-center gap-1">
                              <Move className="w-3 h-3 text-luxury-gold" /> Vertical Position
                            </span>
                            <span>{Math.round(ov.yPct)}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="95"
                            value={ov.yPct}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              const updatedOverlays = activePage.textOverlays.map((item) =>
                                item.id === ov.id ? { ...item, yPct: val } : item
                              );
                              onUpdatePage(activePageIndex, { textOverlays: updatedOverlays });
                            }}
                            className="w-full accent-luxury-gold cursor-pointer h-1 bg-gray-200 rounded"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Photo Crop & Scale Controls for Active Page */}
            {activePage.slots.some((s) => Boolean(s.src)) && (
              <div className="pt-3 border-t border-luxury-gold/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-luxury-gold">
                    <Sliders className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono uppercase font-bold text-luxury-accent">
                      Photo Scale & Crop
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">
                    100% – 300% Zoom
                  </span>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                  {activePage.slots.map((slot, sIdx) => {
                    if (!slot.src) return null;
                    const zoomVal = slot.zoom || 1.0;
                    return (
                      <div
                        key={slot.id}
                        className="p-3 rounded-lg bg-white border border-luxury-gold/20 space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-luxury-accent font-bold flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-luxury-gold/20 text-luxury-gold text-[10px] flex items-center justify-center font-bold">
                              {sIdx + 1}
                            </span>
                            Photo Slot #{sIdx + 1}
                          </span>
                          <span className="text-luxury-gold font-bold font-mono">
                            {Math.round(zoomVal * 100)}% Scale
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <ZoomOut className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <input
                            type="range"
                            min="1.0"
                            max="3.0"
                            step="0.05"
                            value={zoomVal}
                            onChange={(e) =>
                              onSlotZoomChanged?.(slot.id, parseFloat(e.target.value))
                            }
                            className="flex-1 accent-luxury-gold cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                          />
                          <ZoomIn className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        </div>

                        {/* Quick preset buttons */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[9px] text-gray-500 font-mono mr-1">
                            PRESETS:
                          </span>
                          {[1.0, 1.25, 1.5, 2.0, 2.5].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => onSlotZoomChanged?.(slot.id, preset)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                                Math.abs(zoomVal - preset) < 0.02
                                  ? 'bg-luxury-gold text-luxury-accent font-bold'
                                  : 'bg-luxury-black text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {Math.round(preset * 100)}%
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bulk Photo Upload Box */}
      <div className="p-5 rounded-xl border border-luxury-gold/30 bg-white shadow-xs space-y-3 text-center">
        <h3 className="text-sm font-display font-bold uppercase text-luxury-accent flex items-center justify-center gap-2">
          <Upload className="w-4 h-4 text-luxury-gold" /> Bulk Photo Auto-Fill
        </h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Upload multiple photos from your device at once. They will automatically fill all open photo slots across your magazine pages.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onBulkPhotoUpload(e.target.files);
            }
          }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-lg bg-luxury-gold hover:bg-gold-300 text-luxury-accent font-bold text-xs tracking-wider uppercase transition-transform hover:scale-102 shadow-xs cursor-pointer inline-flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Select & Upload Photos
        </button>
      </div>

      {/* Action Buttons: Download A4 PDF & Direct Print */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onGeneratePdf}
          disabled={isExportingPdf}
          className="flex-1 py-3.5 px-4 rounded-xl bg-luxury-gold hover:bg-gold-300 text-luxury-accent font-display font-bold text-sm uppercase tracking-wider shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          {isExportingPdf ? 'Exporting A4 PDF...' : 'Download A4 Magazine PDF'}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="py-3.5 px-5 rounded-xl border border-luxury-gold/50 bg-white hover:bg-luxury-gold/10 text-luxury-accent font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4 text-luxury-gold" /> Print A4
        </button>
      </div>
    </div>
  );
}
