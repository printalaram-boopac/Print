import { X } from 'lucide-react';
import { PAGE_LAYOUTS } from '@/lib/magazine-editor-new/templates/pageLayouts';
import type { TemplatePage } from '@/lib/magazine-editor-new/types';
import MiniPageThumbnail from './MiniPageThumbnail';

const DIMENSIONS = { widthMm: 210, heightMm: 297, orientation: 'portrait' as const };

interface PageLayoutPickerModalProps {
  onClose: () => void;
  onChoose: (layout: TemplatePage) => void;
}

/** Step 9 §36 — a small library of single-page layouts (distinct from the
 * full multi-page magazine packs), built from the exact same layout engine
 * so previews here are the real page, not a schematic mockup. */
export default function PageLayoutPickerModal({ onClose, onChoose }: PageLayoutPickerModalProps) {
  return (
    <div className="fixed inset-0 z-[400] bg-black/60 flex items-center justify-center p-6" data-lenis-prevent onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#1C2024]">Add page from layout</h3>
          <button type="button" aria-label="Close" onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer">
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {PAGE_LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              type="button"
              title={layout.description}
              onClick={() => onChoose(layout.build())}
              className="group flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <div className="w-full rounded-md border-2 border-[#E7E7E4] group-hover:border-[#B8895A] overflow-hidden transition-colors" style={{ aspectRatio: '210 / 297' }}>
                <MiniPageThumbnail page={layout.build()} dimensions={DIMENSIONS} gradient="" isCoverLike={layout.id === 'layout-cover'} />
              </div>
              <span className="text-[11px] text-[#6F7478] group-hover:text-[#1C2024]">{layout.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
