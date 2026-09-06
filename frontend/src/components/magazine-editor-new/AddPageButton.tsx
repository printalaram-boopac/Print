import { useState } from 'react';
import { Plus, ChevronDown, FileText, Copy, LayoutTemplate } from 'lucide-react';

interface AddPageButtonProps {
  onAddBlank: () => void;
  onDuplicateCurrent: () => void;
  onAddFromTemplate: () => void;
}

/** Primary "+ Add Page" action with a small dropdown for the other creation
 * modes (Step 7 §4) — a split button rather than three separate buttons, to
 * keep the panel header clean. */
export default function AddPageButton({ onAddBlank, onDuplicateCurrent, onAddFromTemplate }: AddPageButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex-1">
      <div className="flex rounded-lg border border-dashed border-[#E7E7E4] hover:border-[#B8895A] transition-colors overflow-hidden">
        <button
          type="button"
          onClick={onAddBlank}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium text-[#6F7478] hover:text-[#1C2024] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} /> Add Page
        </button>
        <button
          type="button"
          aria-label="More add-page options"
          onClick={() => setOpen((v) => !v)}
          className="px-2 border-l border-dashed border-[#E7E7E4] text-[#6F7478] hover:text-[#1C2024] cursor-pointer"
        >
          <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-[150]" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 z-[160] bg-white rounded-xl border border-[#E7E7E4] shadow-lg py-1.5">
            <button type="button" onClick={() => { onAddBlank(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-[#1C2024] hover:bg-[#F5F5F3] cursor-pointer">
              <FileText className="w-3.5 h-3.5 text-[#6F7478]" strokeWidth={1.75} /> Blank Page
            </button>
            <button type="button" onClick={() => { onDuplicateCurrent(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-[#1C2024] hover:bg-[#F5F5F3] cursor-pointer">
              <Copy className="w-3.5 h-3.5 text-[#6F7478]" strokeWidth={1.75} /> Duplicate Current Page
            </button>
            <button type="button" onClick={() => { onAddFromTemplate(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-[#1C2024] hover:bg-[#F5F5F3] cursor-pointer">
              <LayoutTemplate className="w-3.5 h-3.5 text-[#6F7478]" strokeWidth={1.75} /> Add From Template
            </button>
          </div>
        </>
      )}
    </div>
  );
}
