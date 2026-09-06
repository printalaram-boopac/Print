import { useState } from 'react';
import { Eye } from 'lucide-react';
import type { ViewSettings } from './MagazineCanvas';

interface ViewMenuProps {
  view: ViewSettings;
  onChange: (patch: Partial<ViewSettings>) => void;
}

const OPTIONS: { key: keyof ViewSettings; label: string }[] = [
  { key: 'showMargins', label: 'Show margins' },
  { key: 'showBleed', label: 'Show bleed' },
  { key: 'showSafeArea', label: 'Show safe area' },
  { key: 'showGrid', label: 'Show grid' },
];

export default function ViewMenu({ view, onChange }: ViewMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute bottom-5 left-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#E7E7E4] shadow-sm text-[12px] font-medium text-[#1C2024] hover:bg-[#F5F5F3] cursor-pointer"
      >
        <Eye className="w-3.5 h-3.5" strokeWidth={1.75} /> View
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[150]" onClick={() => setOpen(false)} />
          <div className="absolute bottom-11 left-0 z-[160] bg-white rounded-xl border border-[#E7E7E4] shadow-lg p-2 w-44">
            {OPTIONS.map((opt) => (
              <label key={opt.key} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F3] cursor-pointer text-[12px] text-[#1C2024]">
                <input
                  type="checkbox"
                  checked={view[opt.key]}
                  onChange={(e) => onChange({ [opt.key]: e.target.checked })}
                  className="w-3.5 h-3.5 accent-[#B8895A] cursor-pointer"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
