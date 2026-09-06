import { useState } from 'react';
import { Maximize, ChevronDown, Check } from 'lucide-react';
import { DOCUMENT_SIZE_PRESETS, type TemplateDimensions } from '@/lib/magazine-editor-new/types';

type Unit = 'mm' | 'cm' | 'in';
const UNIT_TO_MM: Record<Unit, number> = { mm: 1, cm: 10, in: 25.4 };
const MAX_MM = 2000;

function sizeLabel(dims: TemplateDimensions): string {
  const preset = DOCUMENT_SIZE_PRESETS.find((p) => Math.round(p.widthMm) === Math.round(dims.widthMm) && Math.round(p.heightMm) === Math.round(dims.heightMm));
  if (preset) return preset.label;
  const swapped = DOCUMENT_SIZE_PRESETS.find((p) => Math.round(p.widthMm) === Math.round(dims.heightMm) && Math.round(p.heightMm) === Math.round(dims.widthMm));
  if (swapped) return `${swapped.label} (Landscape)`;
  return `Custom · ${Math.round(dims.widthMm)}×${Math.round(dims.heightMm)}mm`;
}

interface DocumentSizeControlsProps {
  dimensions: TemplateDimensions;
  hasContent: boolean;
  onChangeDimensions: (next: TemplateDimensions) => void;
}

/** Document size + orientation control (Step 7 §18–23) — real print
 * dimensions in mm internally; the Custom Size form accepts mm/cm/in and
 * converts on submit. Since element positions are already %-of-page (Step 6),
 * changing dimensions here naturally preserves relative layout for free —
 * no separate "proportional repositioning" math is needed (§21). */
export default function DocumentSizeControls({ dimensions, hasContent, onChangeDimensions }: DocumentSizeControlsProps) {
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [pending, setPending] = useState<TemplateDimensions | null>(null);
  const [width, setWidth] = useState(String(Math.round(dimensions.widthMm)));
  const [height, setHeight] = useState(String(Math.round(dimensions.heightMm)));
  const [unit, setUnit] = useState<Unit>('mm');
  const [customError, setCustomError] = useState<string | null>(null);

  const isLandscape = dimensions.orientation !== 'square' && dimensions.widthMm > dimensions.heightMm;

  const requestChange = (next: TemplateDimensions) => {
    setOpen(false);
    setCustomOpen(false);
    if (hasContent) setPending(next);
    else onChangeDimensions(next);
  };

  const applyPreset = (preset: (typeof DOCUMENT_SIZE_PRESETS)[number]) => {
    const landscape = isLandscape && preset.orientation !== 'square';
    requestChange({
      widthMm: landscape ? preset.heightMm : preset.widthMm,
      heightMm: landscape ? preset.widthMm : preset.heightMm,
      orientation: preset.orientation,
    });
  };

  const toggleOrientation = (landscape: boolean) => {
    if (dimensions.orientation === 'square') return;
    const w = Math.max(dimensions.widthMm, dimensions.heightMm);
    const h = Math.min(dimensions.widthMm, dimensions.heightMm);
    requestChange({ widthMm: landscape ? w : h, heightMm: landscape ? h : w, orientation: dimensions.orientation });
  };

  const submitCustom = () => {
    const w = Number(width) * UNIT_TO_MM[unit];
    const h = Number(height) * UNIT_TO_MM[unit];
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      setCustomError('Enter a width and height greater than zero.');
      return;
    }
    if (w > MAX_MM || h > MAX_MM) {
      setCustomError(`Maximum size is ${MAX_MM}mm per side.`);
      return;
    }
    setCustomError(null);
    requestChange({ widthMm: w, heightMm: h, orientation: w === h ? 'square' : w > h ? 'landscape' : 'portrait' });
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E7E7E4] text-[11px] font-medium text-[#1C2024] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5 truncate"><Maximize className="w-3 h-3 text-[#6F7478] flex-shrink-0" strokeWidth={1.75} /> {sizeLabel(dimensions)}</span>
          <ChevronDown className="w-3 h-3 text-[#6F7478] flex-shrink-0" strokeWidth={2} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-[150]" onClick={() => setOpen(false)} />
            <div className="absolute top-full left-0 mt-1 z-[160] bg-white rounded-xl border border-[#E7E7E4] shadow-lg p-2 w-56">
              {dimensions.orientation !== 'square' && (
                <div className="flex items-center gap-1 p-1 mb-1.5 rounded-lg bg-[#F5F5F3]">
                  <button type="button" onClick={() => toggleOrientation(false)} className={`flex-1 py-1 rounded-md text-[11px] font-medium cursor-pointer ${!isLandscape ? 'bg-white shadow-sm text-[#1C2024]' : 'text-[#6F7478]'}`}>Portrait</button>
                  <button type="button" onClick={() => toggleOrientation(true)} className={`flex-1 py-1 rounded-md text-[11px] font-medium cursor-pointer ${isLandscape ? 'bg-white shadow-sm text-[#1C2024]' : 'text-[#6F7478]'}`}>Landscape</button>
                </div>
              )}
              {DOCUMENT_SIZE_PRESETS.map((p) => {
                const dimsSorted = [dimensions.widthMm, dimensions.heightMm].sort((a, b) => a - b);
                const presetSorted = [p.widthMm, p.heightMm].sort((a, b) => a - b);
                const active = Math.round(dimsSorted[0]) === Math.round(presetSorted[0]) && Math.round(dimsSorted[1]) === Math.round(presetSorted[1]);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[12px] text-[#1C2024] hover:bg-[#F5F5F3] cursor-pointer"
                  >
                    <span>{p.label} <span className="text-[#6F7478]">· {p.widthMm}×{p.heightMm}mm</span></span>
                    {active && <Check className="w-3 h-3 text-[#B8895A]" strokeWidth={2.5} />}
                  </button>
                );
              })}
              <button type="button" onClick={() => { setOpen(false); setCustomOpen(true); }} className="w-full text-left px-2 py-1.5 rounded-lg text-[12px] text-[#1C2024] hover:bg-[#F5F5F3] cursor-pointer">
                Custom Size…
              </button>
            </div>
          </>
        )}
      </div>

      {customOpen && (
        <div className="fixed inset-0 z-[400] bg-black/60 flex items-center justify-center p-6" data-lenis-prevent onClick={() => setCustomOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[15px] font-semibold text-[#1C2024]">Custom Size</h3>
            <div className="mt-3 flex items-end gap-2">
              <label className="flex-1 text-[11px] text-[#6F7478]">
                Width
                <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="mt-1 w-full px-2 py-1.5 rounded-lg border border-[#E7E7E4] text-[13px] text-[#1C2024] focus:outline-none focus:border-[#B8895A]" />
              </label>
              <label className="flex-1 text-[11px] text-[#6F7478]">
                Height
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="mt-1 w-full px-2 py-1.5 rounded-lg border border-[#E7E7E4] text-[13px] text-[#1C2024] focus:outline-none focus:border-[#B8895A]" />
              </label>
              <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className="px-1.5 py-1.5 rounded-lg border border-[#E7E7E4] text-[12px] text-[#1C2024] cursor-pointer">
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </div>
            {customError && <p className="mt-2 text-[11px] text-red-600">{customError}</p>}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setCustomOpen(false)} className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer">Cancel</button>
              <button type="button" onClick={submitCustom} className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] cursor-pointer">Apply</button>
            </div>
          </div>
        </div>
      )}

      {pending && (
        <div className="fixed inset-0 z-[400] bg-black/60 flex items-center justify-center p-6" data-lenis-prevent onClick={() => setPending(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold text-[#1C2024]">Resize magazine?</h3>
            <p className="mt-2 text-[13px] text-[#6F7478] leading-relaxed">
              Changing the page size may affect your existing layout. Elements keep their relative position and proportions.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setPending(null)} className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer">Cancel</button>
              <button
                type="button"
                onClick={() => { onChangeDimensions(pending); setPending(null); }}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] cursor-pointer"
              >
                Resize and keep content
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
