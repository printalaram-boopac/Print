import type { MagazineTemplate } from '@/lib/magazine-editor-new/types';
import MiniPageThumbnail from './MiniPageThumbnail';

interface TemplateCardProps {
  template: MagazineTemplate;
  onPreview: (template: MagazineTemplate) => void;
  onUse: (template: MagazineTemplate) => void;
}

export default function TemplateCard({ template, onPreview, onUse }: TemplateCardProps) {
  const cover = template.pages[0];

  return (
    <div className="group">
      <div
        role="button"
        tabIndex={0}
        aria-label={`Preview ${template.name}`}
        className="relative rounded-lg overflow-hidden border border-[#E7E7E4] shadow-sm group-hover:shadow-md transition-shadow cursor-pointer"
        style={{ aspectRatio: '210 / 297' }}
        onClick={() => onPreview(template)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPreview(template); } }}
      >
        <MiniPageThumbnail page={cover} dimensions={template.dimensions} gradient={template.accentGradient} isCoverLike />

        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {template.isPremium && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider bg-white/90 text-[#B8895A]">PRO</span>
          )}
          {template.isNew && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider bg-white/90 text-[#3E6B63]">NEW</span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <span className="text-white text-[12px] font-semibold">{template.name}</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPreview(template); }}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/90 text-[#1C2024] hover:bg-white transition-colors cursor-pointer"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onUse(template); }}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#20272C] text-white hover:bg-[#2B333A] transition-colors cursor-pointer"
            >
              Use template
            </button>
          </div>
        </div>
      </div>
      <p className="mt-1.5 text-[12px] font-medium text-[#1C2024] truncate">{template.name}</p>
    </div>
  );
}
