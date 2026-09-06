import { useState, useMemo } from 'react';
import { Plus, Search, Sparkles, X } from 'lucide-react';
import {
  CANVA_OFFICIAL_TEXT_COMBOS,
  type CanvaOfficialTextCombo,
} from '@/lib/magazine-editor-new/canvaOfficialTextCombos';
import type { TemplateElement } from '@/lib/magazine-editor-new/types';

interface TextPanelProps {
  onAddText?: (role: 'headline' | 'subheading' | 'body' | 'kicker', text: string) => void;
  onAddMultipleElements?: (elements: TemplateElement[]) => void;
}

export default function TextPanel({
  onAddText,
  onAddMultipleElements,
}: TextPanelProps) {
  const [search, setSearch] = useState('');

  const filteredCombos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CANVA_OFFICIAL_TEXT_COMBOS;
    return CANVA_OFFICIAL_TEXT_COMBOS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.primaryText.toLowerCase().includes(q) ||
        (item.subText && item.subText.toLowerCase().includes(q)),
    );
  }, [search]);

  const handleSelectOfficialCombo = (combo: CanvaOfficialTextCombo) => {
    const elements: TemplateElement[] = [
      {
        id: '',
        kind: 'text',
        xPct: 50,
        yPct: combo.subText ? 45 : 50,
        widthPct: 75,
        heightPct: 14,
        content: combo.primaryText,
        role: 'headline',
        fontKey: (combo.fontKey as any) || 'serif',
        fontSize: combo.fontSize || 36,
        color: combo.color || '#1C2024',
        textAlign: 'center',
        letterSpacing: combo.letterSpacing || '0em',
        textTransform: (combo.textTransform as any) || 'none',
        rotationDeg: 0,
        opacity: 100,
        zIndex: 1,
        locked: false,
      },
    ];

    if (combo.subText) {
      elements.push({
        id: '',
        kind: 'text',
        xPct: 50,
        yPct: 55,
        widthPct: 65,
        heightPct: 8,
        content: combo.subText,
        role: 'subheading',
        fontKey: 'sans',
        fontSize: 14,
        color: combo.color || '#1C2024',
        textAlign: 'center',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        rotationDeg: 0,
        opacity: 100,
        zIndex: 2,
        locked: false,
      });
    }

    if (onAddMultipleElements) {
      onAddMultipleElements(elements);
    } else if (onAddText) {
      onAddText('headline', combo.primaryText);
    }
  };

  return (
    <aside className="w-full h-full flex-1 bg-white flex flex-col min-h-0 select-none overflow-x-hidden">
      {/* Header with Search and Add a text box button */}
      <div className="p-4 border-b border-[#E7E7E4] space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#0E1318]">Text</h2>
            <p className="text-[12px] text-[#6F7478] mt-0.5">
              Click to add text directly to your design
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-[#8B3DFF]" />
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center bg-white border border-[#E7E7E4] focus-within:border-[#8B3DFF] focus-within:ring-2 focus-within:ring-[#8B3DFF]/20 rounded-xl px-3 py-2 transition-all shadow-2xs">
          <Search className="w-4 h-4 text-[#6F7478] mr-2 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fonts and text combinations..."
            className="w-full bg-transparent text-[13px] text-[#1C2024] placeholder:text-[#8D9296] focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-[#6F7478] hover:text-[#1C2024] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Primary + Add a text box Button */}
        <button
          type="button"
          onClick={() => onAddText?.('body', 'Your text here')}
          className="w-full py-2.5 px-4 rounded-xl bg-[#8B3DFF] hover:bg-[#7D2AE8] active:bg-[#6D1FD8] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Add a text box</span>
        </button>
      </div>

      {/* Main Content Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
        {/* 1. Default Text Styles (Canva Style) */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F7478]">
            Default text styles
          </span>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onAddText?.('headline', 'Add a heading')}
              className="w-full p-3.5 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all text-left group cursor-pointer bg-white hover:shadow-xs"
            >
              <div className="text-xl font-bold text-[#0E1318] group-hover:text-[#8B3DFF] transition-colors font-sans">
                Add a heading
              </div>
            </button>

            <button
              type="button"
              onClick={() => onAddText?.('subheading', 'Add a subheading')}
              className="w-full p-3 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all text-left group cursor-pointer bg-white hover:shadow-xs"
            >
              <div className="text-[15px] font-semibold text-[#0E1318] group-hover:text-[#8B3DFF] transition-colors font-sans">
                Add a subheading
              </div>
            </button>

            <button
              type="button"
              onClick={() => onAddText?.('body', 'Add a little bit of body text')}
              className="w-full p-2.5 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all text-left group cursor-pointer bg-white hover:shadow-xs"
            >
              <div className="text-xs text-[#5E6573] group-hover:text-[#0E1318] transition-colors">
                Add a little bit of body text
              </div>
            </button>
          </div>
        </div>

        {/* 3. Dynamic Text (Page Numbers) */}
        {!search && (
          <div className="space-y-2 pt-1">
            <h5 className="text-[13px] font-bold text-[#1C2024]">Dynamic text</h5>
            <button
              type="button"
              onClick={() => onAddText?.('body', '1')}
              className="w-full p-2 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all flex items-center gap-3 group cursor-pointer text-left bg-white"
            >
              <div className="w-16 h-16 rounded-lg bg-[#F5F5F3] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#E7E7E4]">
                <img
                  src="https://static.canva.com/web/images/ccab74f416b7b44da49560c24527ea5a.png"
                  alt="Page numbers"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#1C2024] group-hover:text-[#8B3DFF] transition-colors">
                  Page numbers
                </p>
                <p className="text-[11px] text-[#6F7478] truncate">
                  Insert page numbering
                </p>
              </div>
            </button>
          </div>
        )}

        {/* 4. Font combinations (90 Canva official combinations) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h5 className="text-[13px] font-bold text-[#1C2024]">
              Font combinations
            </h5>
            <span className="text-[11px] text-[#6F7478] font-medium">
              {filteredCombos.length} styles
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {filteredCombos.map((combo) => (
              <button
                key={combo.id}
                type="button"
                onClick={() => handleSelectOfficialCombo(combo)}
                className="group relative flex flex-col items-center justify-center rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden bg-white p-2.5 min-h-[110px] text-center"
                title={combo.label}
              >
                <img
                  src={combo.img}
                  alt={combo.label}
                  className="w-full h-auto max-h-[90px] object-contain transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to styled text if image fails to load
                    (e.target as HTMLElement).style.display = 'none';
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent && !parent.querySelector('.fallback-text')) {
                      const div = document.createElement('div');
                      div.className = 'fallback-text font-bold text-xs text-[#1C2024] line-clamp-2';
                      div.innerText = combo.primaryText;
                      parent.appendChild(div);
                    }
                  }}
                />
              </button>
            ))}
          </div>

          {filteredCombos.length === 0 && (
            <div className="text-center py-8 text-[#6F7478] text-xs">
              No font combinations matching "{search}"
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
