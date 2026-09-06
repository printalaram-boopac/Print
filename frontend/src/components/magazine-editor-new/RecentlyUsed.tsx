import type { MagazineTemplate } from '@/lib/magazine-editor-new/types';
import TemplateCoverMockup from './TemplateCoverMockup';

interface RecentlyUsedProps {
  templates: MagazineTemplate[];
  onSelect: (template: MagazineTemplate) => void;
}

export default function RecentlyUsed({ templates, onSelect }: RecentlyUsedProps) {
  if (templates.length === 0) return null;

  return (
    <div className="px-4 pt-3">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6F7478]">Recently used</span>
      <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t)}
            className="flex-shrink-0 w-14 rounded-md overflow-hidden border border-[#E7E7E4] hover:border-[#B8895A] transition-colors cursor-pointer"
            style={{ aspectRatio: '210 / 297' }}
            aria-label={`Preview ${t.name}`}
          >
            <TemplateCoverMockup gradient={t.accentGradient} title={t.name} compact />
          </button>
        ))}
      </div>
    </div>
  );
}
