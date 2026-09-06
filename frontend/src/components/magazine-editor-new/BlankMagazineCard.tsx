import { useState } from 'react';
import { Plus } from 'lucide-react';
import { BLANK_SIZE_PRESETS } from '@/lib/magazine-editor-new/types';
import type { TemplateDimensions } from '@/lib/magazine-editor-new/types';

interface BlankMagazineCardProps {
  onCreate: (dimensions: TemplateDimensions) => void;
}

export default function BlankMagazineCard({ onCreate }: BlankMagazineCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#E7E7E4] hover:border-[#B8895A] text-[#6F7478] hover:text-[#1C2024] transition-colors cursor-pointer"
        style={{ aspectRatio: '210 / 297' }}
      >
        <Plus className="w-6 h-6" strokeWidth={1.5} />
        <span className="text-[12px] font-medium">Blank Magazine</span>
      </button>

      {open && (
        <div className="absolute z-20 top-2 left-2 right-2 bg-white border border-[#E7E7E4] rounded-lg shadow-lg p-2 space-y-1">
          {BLANK_SIZE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                onCreate({ widthMm: preset.widthMm, heightMm: preset.heightMm, orientation: preset.orientation });
                setOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-md text-[12px] text-[#1C2024] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
