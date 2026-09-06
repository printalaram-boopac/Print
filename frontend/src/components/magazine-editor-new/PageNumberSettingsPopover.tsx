import { useState } from 'react';
import { Hash, ChevronDown } from 'lucide-react';
import type { PageNumberSettings } from '@/lib/magazine-editor-new/types';
import { PAGE_NUMBER_POSITIONS } from '@/lib/magazine-editor-new/pageHelpers';
import { FONTS } from '@/lib/magazine/fonts';
import ColorPicker from './ColorPicker';

interface PageNumberSettingsPopoverProps {
  settings: PageNumberSettings;
  pageCount: number;
  recentColors: string[];
  onChange: (patch: Partial<PageNumberSettings>) => void;
}

/** Automatic page-number settings (Step 7 §30–34) — reuses the Step 4
 * typography data (FONTS) and the shared ColorPicker rather than building a
 * second text/color system. Numbers themselves render as a generated
 * overlay in MagazineCanvas, not as real page elements. */
export default function PageNumberSettingsPopover({ settings, pageCount, recentColors, onChange }: PageNumberSettingsPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E7E7E4] text-[11px] font-medium text-[#1C2024] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5"><Hash className="w-3 h-3 text-[#6F7478]" strokeWidth={1.75} /> Page numbers {settings.enabled ? 'On' : 'Off'}</span>
        <ChevronDown className="w-3 h-3 text-[#6F7478]" strokeWidth={2} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[150]" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-[160] bg-white rounded-xl border border-[#E7E7E4] shadow-lg p-3 w-64 space-y-2.5">
            <label className="flex items-center justify-between text-[12px] text-[#1C2024] cursor-pointer">
              Show page numbers
              <input type="checkbox" checked={settings.enabled} onChange={(e) => onChange({ enabled: e.target.checked })} className="w-3.5 h-3.5 accent-[#B8895A] cursor-pointer" />
            </label>

            {settings.enabled && (
              <>
                <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
                  Start numbering from
                  <select
                    value={settings.startAtPageIndex}
                    onChange={(e) => onChange({ startAtPageIndex: Number(e.target.value) })}
                    className="px-1.5 py-1 rounded-lg border border-[#E7E7E4] text-[11px] text-[#1C2024] cursor-pointer"
                  >
                    {Array.from({ length: pageCount }, (_, i) => (
                      <option key={i} value={i}>Page {i + 1}</option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
                  Starting number
                  <input
                    type="number"
                    value={settings.startNumber}
                    onChange={(e) => onChange({ startNumber: Number(e.target.value) })}
                    className="w-14 px-1.5 py-1 rounded-lg border border-[#E7E7E4] text-[11px] text-[#1C2024] text-right"
                  />
                </label>

                <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
                  Position
                  <select
                    value={settings.position}
                    onChange={(e) => onChange({ position: e.target.value as PageNumberSettings['position'] })}
                    className="px-1.5 py-1 rounded-lg border border-[#E7E7E4] text-[11px] text-[#1C2024] cursor-pointer"
                  >
                    {PAGE_NUMBER_POSITIONS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                  </select>
                </label>

                <label className="flex items-center justify-between text-[12px] text-[#1C2024] cursor-pointer">
                  Hide on cover
                  <input type="checkbox" checked={settings.hideOnCover} onChange={(e) => onChange({ hideOnCover: e.target.checked })} className="w-3.5 h-3.5 accent-[#B8895A] cursor-pointer" />
                </label>
                <label className="flex items-center justify-between text-[12px] text-[#1C2024] cursor-pointer">
                  Hide on back cover
                  <input type="checkbox" checked={settings.hideOnBackCover} onChange={(e) => onChange({ hideOnBackCover: e.target.checked })} className="w-3.5 h-3.5 accent-[#B8895A] cursor-pointer" />
                </label>

                <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
                  Font
                  <select
                    value={settings.fontKey}
                    onChange={(e) => onChange({ fontKey: e.target.value })}
                    className="px-1.5 py-1 rounded-lg border border-[#E7E7E4] text-[11px] text-[#1C2024] cursor-pointer max-w-[110px]"
                  >
                    {FONTS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
                  </select>
                </label>

                <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
                  Size
                  <input type="number" value={settings.fontSize} onChange={(e) => onChange({ fontSize: Number(e.target.value) })} className="w-14 px-1.5 py-1 rounded-lg border border-[#E7E7E4] text-[11px] text-[#1C2024] text-right" />
                </label>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#6F7478]">Colour</span>
                  <ColorPicker value={settings.color} onChange={(c) => onChange({ color: c })} recentColors={recentColors} />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
