import React from 'react';
import {
  Plus,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
  LayoutTemplate,
} from 'lucide-react';
import { MagazineConfig, PageLayoutType } from '../types';
import { LAYOUT_PRESETS } from '../templates';

interface CanvaPageStripProps {
  config: MagazineConfig;
  activePageIndex: number;
  setActivePageIndex: (index: number) => void;
  onAddPage: (layoutType?: PageLayoutType) => void;
  onDuplicatePage: (pageIndex: number) => void;
  onDeletePage: (pageIndex: number) => void;
  onReorderPage: (fromIndex: number, toIndex: number) => void;
}

export function CanvaPageStrip({
  config,
  activePageIndex,
  setActivePageIndex,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onReorderPage,
}: CanvaPageStripProps) {
  const [showPresetMenu, setShowPresetMenu] = React.useState(false);

  return (
    <div className="w-full bg-white border border-luxury-gold/30 rounded-xl p-3 shadow-md backdrop-blur-md space-y-2 font-sans">
      <div className="flex items-center justify-between border-b border-luxury-gold/20 pb-2">
        <div className="flex items-center gap-2 text-luxury-accent">
          <Layers className="w-4 h-4 text-luxury-gold" />
          <span className="text-xs font-display font-bold uppercase tracking-wider">
            Magazine Pages Filmstrip ({config.pages.length} Pages)
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPresetMenu(!showPresetMenu)}
            className="px-3 py-1.5 rounded-lg bg-luxury-gold hover:bg-gold-300 text-luxury-accent font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Page</span>
          </button>

          {/* Page Layout Selector Dropdown */}
          {showPresetMenu && (
            <div className="absolute right-0 bottom-10 z-50 w-64 bg-white border border-luxury-gold/40 rounded-xl p-2 shadow-2xl space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono font-bold text-gray-500 uppercase border-b border-gray-100 flex items-center gap-1">
                <LayoutTemplate className="w-3 h-3 text-luxury-gold" />
                Select Page Layout
              </div>
              {LAYOUT_PRESETS.map((preset) => (
                <button
                  key={preset.type}
                  type="button"
                  onClick={() => {
                    onAddPage(preset.type);
                    setShowPresetMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-luxury-black text-xs font-sans transition-colors cursor-pointer group"
                >
                  <div className="font-bold text-luxury-accent group-hover:text-luxury-gold">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-gray-500 line-clamp-1">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Page Strip Thumbnails */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
        {config.pages.map((page, idx) => {
          const isActive = idx === activePageIndex;
          const photoCount = page.slots.filter((s) => Boolean(s.src)).length;

          return (
            <div
              key={page.id}
              className={`relative group shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all cursor-pointer border ${
                isActive
                  ? 'bg-luxury-gold/15 border-luxury-gold shadow-md scale-102'
                  : 'bg-luxury-black border-luxury-gold/20 hover:border-luxury-gold/50'
              }`}
              onClick={() => setActivePageIndex(idx)}
            >
              {/* Mini A4 Page Box */}
              <div
                className={`w-20 sm:w-24 aspect-[210/297] bg-white rounded border flex flex-col justify-between p-1.5 overflow-hidden shadow-xs relative ${
                  isActive ? 'ring-2 ring-luxury-gold' : ''
                }`}
              >
                {/* Mini Header */}
                <div className="text-[6px] font-serif font-bold text-gray-800 uppercase tracking-tighter truncate border-b border-gray-200 pb-0.5">
                  {page.title || 'PAGE'}
                </div>

                {/* Mini Slot Layout Mockup */}
                <div className="flex-1 my-1 grid gap-0.5 grid-cols-2 h-full">
                  {page.slots.map((s, sIdx) => (
                    <div
                      key={s.id || sIdx}
                      className={`rounded-[1px] overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center ${
                        page.slots.length === 1 ? 'col-span-2 row-span-2' : ''
                      }`}
                    >
                      {s.src ? (
                        <img
                          src={s.src}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Mini Footer */}
                <div className="text-[6px] font-mono font-bold text-luxury-gold text-right border-t border-gray-200 pt-0.5">
                  PG {page.pageNumber}
                </div>
              </div>

              {/* Page Number & Photos indicator */}
              <div className="text-[10px] font-mono font-bold text-luxury-accent flex items-center justify-between w-full px-1">
                <span>PG {page.pageNumber}</span>
                <span className="text-[9px] text-gray-500 font-normal">
                  {photoCount}/{page.slots.length} 📸
                </span>
              </div>

              {/* Action Overlay Toolbar on Hover */}
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-black/80 text-white p-1 rounded-lg backdrop-blur-sm z-20 shadow-md">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderPage(idx, idx - 1);
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="Move Left"
                  >
                    <ChevronLeft className="w-3 h-3 text-luxury-gold" />
                  </button>
                )}

                {idx < config.pages.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderPage(idx, idx + 1);
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="Move Right"
                  >
                    <ChevronRight className="w-3 h-3 text-luxury-gold" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicatePage(idx);
                  }}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Duplicate Page"
                >
                  <Copy className="w-3 h-3 text-amber-300" />
                </button>

                {config.pages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(idx);
                    }}
                    className="p-1 hover:bg-white/20 text-red-400 hover:text-red-200 rounded transition-colors"
                    title="Delete Page"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
