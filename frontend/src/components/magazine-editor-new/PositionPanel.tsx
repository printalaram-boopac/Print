import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import type { TemplateElement, TemplateDimensions } from '@/lib/magazine-editor-new/types';

interface PositionPanelProps {
  element: TemplateElement;
  dimensions: TemplateDimensions;
  onPatch: (patch: Partial<TemplateElement>) => void;
}

function pctToMm(pct: number, dimMm: number): number {
  return Math.round((pct / 100) * dimMm * 10) / 10;
}
function mmToPct(mm: number, dimMm: number): number {
  return (mm / dimMm) * 100;
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-1 text-[11px] text-[#6F7478] flex-shrink-0">
      {label}
      <input
        type="number"
        value={value}
        step={0.1}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-14 px-1.5 py-1 rounded border border-[#E7E7E4] text-[12px] text-[#1C2024] focus:outline-none focus:border-[#B8895A]"
      />
      <span className="text-[10px]">mm</span>
    </label>
  );
}

/** Precise numeric X/Y/W/H/Rotation in document units (mm) — independent of
 * screen zoom, since it reads/writes the same xPct/yPct/widthPct/heightPct
 * the canvas already uses (Step 6 §57/58: one document coordinate system). */
export default function PositionPanel({ element: el, dimensions, onPatch }: PositionPanelProps) {
  const [lockAspect, setLockAspect] = useState(true);

  const leftMm = pctToMm(el.xPct - el.widthPct / 2, dimensions.widthMm);
  const topMm = pctToMm(el.yPct - el.heightPct / 2, dimensions.heightMm);
  const widthMm = pctToMm(el.widthPct, dimensions.widthMm);
  const heightMm = pctToMm(el.heightPct, dimensions.heightMm);
  const ratio = el.heightPct / el.widthPct;

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-t border-[#E7E7E4] overflow-x-auto">
      <NumberField label="X" value={leftMm} onChange={(mm) => onPatch({ xPct: mmToPct(mm, dimensions.widthMm) + el.widthPct / 2 })} />
      <NumberField label="Y" value={topMm} onChange={(mm) => onPatch({ yPct: mmToPct(mm, dimensions.heightMm) + el.heightPct / 2 })} />
      <NumberField
        label="W"
        value={widthMm}
        onChange={(mm) => {
          const widthPct = mmToPct(mm, dimensions.widthMm);
          onPatch(lockAspect ? { widthPct, heightPct: widthPct * ratio } : { widthPct });
        }}
      />
      <button
        type="button"
        aria-label={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
        onClick={() => setLockAspect((v) => !v)}
        className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer flex-shrink-0 ${lockAspect ? 'text-[#B8895A]' : 'text-[#6F7478]'}`}
      >
        {lockAspect ? <Lock className="w-3 h-3" strokeWidth={2} /> : <Unlock className="w-3 h-3" strokeWidth={2} />}
      </button>
      <NumberField
        label="H"
        value={heightMm}
        onChange={(mm) => {
          const heightPct = mmToPct(mm, dimensions.heightMm);
          onPatch(lockAspect ? { heightPct, widthPct: heightPct / ratio } : { heightPct });
        }}
      />
      <label className="flex items-center gap-1 text-[11px] text-[#6F7478] flex-shrink-0">
        Rotation
        <input
          type="number"
          value={Math.round(el.rotationDeg ?? 0)}
          onChange={(e) => onPatch({ rotationDeg: Number(e.target.value) })}
          className="w-12 px-1.5 py-1 rounded border border-[#E7E7E4] text-[12px] text-[#1C2024] focus:outline-none focus:border-[#B8895A]"
        />
        <span className="text-[10px]">°</span>
      </label>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {[0, 90, 180, 270].map((deg) => (
          <button key={deg} type="button" onClick={() => onPatch({ rotationDeg: deg })} className="px-1.5 py-1 rounded text-[10px] text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] cursor-pointer">
            {deg}°
          </button>
        ))}
      </div>
    </div>
  );
}
