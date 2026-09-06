import { useState, useMemo } from 'react';
import { Plus, Search, Sparkles } from 'lucide-react';
import {
  CANVA_FONT_COMBINATIONS,
  type CanvaFontCombination,
} from '@/lib/magazine-editor-new/canvaFontCombinations';
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

  const filteredCombinations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CANVA_FONT_COMBINATIONS;
    return CANVA_FONT_COMBINATIONS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.preview.headline.text.toLowerCase().includes(q) ||
        (item.preview.subheading &&
          item.preview.subheading.text.toLowerCase().includes(q)),
    );
  }, [search]);

  const handleSelectCombination = (combo: CanvaFontCombination) => {
    const elements = combo.createElements();
    if (onAddMultipleElements) {
      onAddMultipleElements(elements);
    } else if (onAddText && elements.length > 0) {
      onAddText((elements[0].role as any) || 'headline', elements[0].content || 'Text');
    }
  };

  return (
    <aside className="w-full h-full flex-1 bg-white flex flex-col min-h-0 select-none overflow-x-hidden">
      {/* Header with Search */}
      <div className="p-4 border-b border-[#E7E7E4] space-y-3">
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
        <div className="relative flex items-center bg-white border-2 border-[#E7E7E4] focus-within:border-[#8B3DFF] focus-within:ring-2 focus-within:ring-[#8B3DFF]/20 rounded-2xl px-3 py-2 transition-all shadow-xs">
          <Search className="w-4 h-4 text-[#6F7478] mr-2 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 100+ font combinations & styles"
            className="w-full bg-transparent text-[13px] text-[#1C2024] placeholder:text-[#8D9296] focus:outline-none"
          />
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

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
        {/* 1. Default Text Styles */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F7478]">
            Default text styles
          </span>

          <button
            type="button"
            onClick={() => onAddText?.('headline', 'Add a heading')}
            className="w-full p-3.5 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all text-left group cursor-pointer bg-white hover:shadow-xs"
          >
            <div className="text-xl font-bold text-[#0E1318] group-hover:text-[#8B3DFF] transition-colors font-serif">
              Add a heading
            </div>
          </button>

          <button
            type="button"
            onClick={() => onAddText?.('subheading', 'Add a subheading')}
            className="w-full p-3 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all text-left group cursor-pointer bg-white hover:shadow-xs"
          >
            <div className="text-sm font-semibold text-[#0E1318] group-hover:text-[#8B3DFF] transition-colors">
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

        {/* 2. Canva Font Combinations */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[13.5px] font-bold text-[#1C2024]">
              Font combinations
            </span>
            <span className="text-[11.5px] text-[#6F7478] font-medium">
              {filteredCombinations.length} styles
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredCombinations.map((combo) => (
              <button
                key={combo.id}
                type="button"
                onClick={() => handleSelectCombination(combo)}
                className="group flex flex-col justify-center items-center rounded-2xl p-4 border border-[#E7E7E4] hover:border-[#8B3DFF] hover:shadow-md transition-all duration-200 cursor-pointer min-h-[110px] text-center hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: combo.preview.bg }}
                title={`Add ${combo.title} to canvas`}
              >
                <div
                  style={{
                    fontFamily: combo.preview.headline.fontFamily,
                    color: combo.preview.headline.color,
                    fontSize: `${combo.preview.headline.fontSize}px`,
                    fontWeight: combo.preview.headline.fontWeight,
                    fontStyle: combo.preview.headline.fontStyle,
                    letterSpacing: combo.preview.headline.letterSpacing,
                    textTransform: combo.preview.headline.textTransform,
                    textShadow: combo.preview.headline.textShadow,
                    lineHeight: 1.15,
                  }}
                  className="transition-transform duration-200 group-hover:scale-105"
                >
                  {combo.preview.headline.text}
                </div>

                {combo.preview.subheading && (
                  <div
                    style={{
                      fontFamily: combo.preview.subheading.fontFamily,
                      color: combo.preview.subheading.color,
                      fontSize: `${combo.preview.subheading.fontSize}px`,
                      fontWeight: combo.preview.subheading.fontWeight,
                      letterSpacing: combo.preview.subheading.letterSpacing,
                      textTransform: combo.preview.subheading.textTransform,
                      lineHeight: 1.2,
                    }}
                    className="mt-1"
                  >
                    {combo.preview.subheading.text}
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredCombinations.length === 0 && (
            <div className="text-center py-8 text-[#6F7478] text-xs">
              No font combinations matching "{search}"
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
