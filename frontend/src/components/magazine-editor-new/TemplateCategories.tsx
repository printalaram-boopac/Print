import { TEMPLATE_CATEGORIES } from '@/lib/magazine-editor-new/templateData';
import type { TemplateCategory } from '@/lib/magazine-editor-new/types';

const ALL = 'All' as const;

interface TemplateCategoriesProps {
  value: TemplateCategory | typeof ALL;
  onChange: (value: TemplateCategory | typeof ALL) => void;
}

export default function TemplateCategories({ value, onChange }: TemplateCategoriesProps) {
  const options: (TemplateCategory | typeof ALL)[] = [ALL, ...TEMPLATE_CATEGORIES];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
            value === opt ? 'bg-[#20272C] text-white' : 'bg-[#F5F5F3] text-[#6F7478] hover:text-[#1C2024]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
