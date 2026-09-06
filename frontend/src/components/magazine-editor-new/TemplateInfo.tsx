import type { MagazineTemplate } from '@/lib/magazine-editor-new/types';

interface TemplateInfoProps {
  template: MagazineTemplate;
  activePageName: string;
}

export default function TemplateInfo({ template, activePageName }: TemplateInfoProps) {
  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="text-[20px] font-semibold text-[#1C2024]">{template.name}</h2>
        {template.isPremium && (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-[#F5F5F3] text-[#B8895A] border border-[#E7E7E4]">PRO</span>
        )}
        {template.isNew && (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-[#F5F5F3] text-[#3E6B63] border border-[#E7E7E4]">NEW</span>
        )}
      </div>
      <p className="mt-1 text-[13px] text-[#6F7478]">
        {template.category} &bull; {template.pages.length} pages
      </p>
      {template.description && (
        <p className="mt-2 text-[12px] text-[#6F7478] leading-relaxed">{template.description}</p>
      )}

      {template.tags && template.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {template.tags.map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded-full bg-[#F5F5F3] text-[10px] text-[#6F7478]">{t}</span>
          ))}
        </div>
      )}

      {template.palette && template.palette.length > 0 && (
        <div className="mt-2 flex items-center gap-1">
          {template.palette.map((c, i) => (
            <span key={i} className="w-3.5 h-3.5 rounded-full border border-[#E7E7E4]" style={{ background: c }} />
          ))}
        </div>
      )}

      <p className="mt-3 text-[12px] text-[#6F7478]">Viewing: {activePageName}</p>
    </div>
  );
}
