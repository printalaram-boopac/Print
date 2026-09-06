import { Search, X } from 'lucide-react';

interface TemplateSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TemplateSearch({ value, onChange, placeholder = "Search magazine templates..." }: TemplateSearchProps) {
  return (
    <div className="relative">
      <Search className="w-4 h-4 text-[#6F7478] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#F5F5F3] border border-[#E7E7E4] rounded-lg pl-9 pr-8 py-2 text-[13px] text-[#1C2024] placeholder:text-[#6F7478] focus:outline-none focus:border-[#8B3DFF] focus:ring-1 focus:ring-[#8B3DFF]"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6F7478] hover:text-[#1C2024] cursor-pointer"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
