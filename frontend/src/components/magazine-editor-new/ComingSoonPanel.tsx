interface ComingSoonPanelProps {
  label: string;
  onAddText?: (role: 'headline' | 'subheading' | 'body' | 'kicker', text: string) => void;
}

export default function ComingSoonPanel({ label, onAddText }: ComingSoonPanelProps) {
  if (label === 'Text' && onAddText) {
    return (
      <aside className="w-full h-full flex-1 bg-white flex flex-col min-h-0 select-none overflow-x-hidden">
        <div className="p-4 border-b border-[#E7E7E4]">
          <h2 className="text-[15px] font-bold text-[#0E1318]">Text</h2>
          <p className="text-[12px] text-[#5E6573] mt-0.5">Click to add text directly to your design</p>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
          {/* Primary Add Text Box Button */}
          <button
            type="button"
            onClick={() => onAddText('body', 'Your text here')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#8B3DFF] hover:bg-[#7D2AE8] text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>+ Add a text box</span>
          </button>

          {/* Default Text Styles */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E6573]">Default text styles</span>
            
            <button
              type="button"
              onClick={() => onAddText('headline', 'Add a heading')}
              className="w-full p-3 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all text-left group cursor-pointer"
            >
              <div className="text-xl font-bold text-[#0E1318] group-hover:text-[#8B3DFF] transition-colors font-serif">
                Add a heading
              </div>
            </button>

            <button
              type="button"
              onClick={() => onAddText('subheading', 'Add a subheading')}
              className="w-full p-3 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all text-left group cursor-pointer"
            >
              <div className="text-sm font-semibold text-[#0E1318] group-hover:text-[#8B3DFF] transition-colors">
                Add a subheading
              </div>
            </button>

            <button
              type="button"
              onClick={() => onAddText('body', 'Add a little bit of body text')}
              className="w-full p-3 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all text-left group cursor-pointer"
            >
              <div className="text-xs text-[#5E6573] group-hover:text-[#0E1318] transition-colors">
                Add a little bit of body text
              </div>
            </button>
          </div>

          {/* Editorial Presets */}
          <div className="space-y-2 pt-3 border-t border-[#E7E7E4]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E6573]">Editorial Presets</span>

            <button
              type="button"
              onClick={() => onAddText('headline', 'MASTHEAD TITLE')}
              className="w-full p-3 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all text-center group cursor-pointer"
            >
              <span className="text-base font-black tracking-widest text-[#0E1318] group-hover:text-[#8B3DFF]">
                MASTHEAD TITLE
              </span>
            </button>

            <button
              type="button"
              onClick={() => onAddText('body', '"Elegance is the only beauty that never fades."')}
              className="w-full p-3 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all text-center group cursor-pointer italic"
            >
              <span className="text-xs text-[#5E6573] group-hover:text-[#0E1318]">
                “Elegance is the only beauty that never fades.”
              </span>
            </button>

            <button
              type="button"
              onClick={() => onAddText('kicker', 'ISSUE NO. 12 • SPECIAL EDITION')}
              className="w-full p-2.5 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] transition-all text-center group cursor-pointer"
            >
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#5E6573] group-hover:text-[#8B3DFF]">
                ISSUE NO. 12 • SPECIAL EDITION
              </span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full h-full flex-1 bg-white flex flex-col items-center justify-center gap-2 text-center px-8 overflow-x-hidden">
      <p className="text-[14px] font-semibold text-[#1C2024]">{label}</p>
      <p className="text-[12px] text-[#6F7478]">This tool is coming in an upcoming update.</p>
    </aside>
  );
}
