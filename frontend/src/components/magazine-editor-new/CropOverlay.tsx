import { useRef } from 'react';
import { Minus, Plus, Check, X } from 'lucide-react';
import type { TemplateElement } from '@/lib/magazine-editor-new/types';

interface CropOverlayProps {
  element: TemplateElement;
  onChange: (patch: Partial<TemplateElement>) => void;
  onDone: () => void;
  onCancel: () => void;
}

/** Pan (drag) + zoom crop, expressed as background-position/background-size —
 * matches the 'fill' render path exactly, so what you see here is what the
 * canvas shows once you hit Done. */
export default function CropOverlay({ element: el, onChange, onDone, onCancel }: CropOverlayProps) {
  const dragRef = useRef<{ startX: number; startY: number; startCropX: number; startCropY: number } | null>(null);

  const left = el.xPct - el.widthPct / 2;
  const top = el.yPct - el.heightPct / 2;
  const zoom = el.cropZoom ?? 1;

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    dragRef.current = { startX: e.clientX, startY: e.clientY, startCropX: el.cropXPct ?? 50, startCropY: el.cropYPct ?? 50 };
    const move = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = ((ev.clientX - dragRef.current.startX) / 300) * 100;
      const dy = ((ev.clientY - dragRef.current.startY) / 300) * 100;
      onChange({
        cropXPct: Math.max(0, Math.min(100, dragRef.current.startCropX - dx)),
        cropYPct: Math.max(0, Math.min(100, dragRef.current.startCropY - dy)),
      });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40" data-lenis-prevent>
      <div className="absolute" style={{ left: `${left}%`, top: `${top}%`, width: `${el.widthPct}%`, height: `${el.heightPct}%` }}>
        <div
          onPointerDown={onPointerDown}
          className="w-full h-full overflow-hidden cursor-move ring-2 ring-white"
          style={{
            backgroundImage: `url(${el.imgSrc})`,
            backgroundSize: `${100 * zoom}%`,
            backgroundPosition: `${el.cropXPct ?? 50}% ${el.cropYPct ?? 50}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1 bg-white rounded-full shadow-sm px-1.5 py-1.5">
            <button type="button" aria-label="Zoom out" onClick={() => onChange({ cropZoom: Math.max(1, zoom - 0.1) })} className="w-6 h-6 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer">
              <Minus className="w-3 h-3" strokeWidth={2} />
            </button>
            <span className="text-[11px] text-[#1C2024] w-9 text-center select-none">{Math.round(zoom * 100)}%</span>
            <button type="button" aria-label="Zoom in" onClick={() => onChange({ cropZoom: Math.min(3, zoom + 0.1) })} className="w-6 h-6 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer">
              <Plus className="w-3 h-3" strokeWidth={2} />
            </button>
          </div>
          <button type="button" onClick={onCancel} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-[12px] font-medium text-[#1C2024] shadow-sm hover:bg-[#F5F5F3] cursor-pointer">
            <X className="w-3.5 h-3.5" strokeWidth={2} /> Cancel
          </button>
          <button type="button" onClick={onDone} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#20272C] text-[12px] font-medium text-white shadow-sm hover:bg-[#2B333A] cursor-pointer">
            <Check className="w-3.5 h-3.5" strokeWidth={2} /> Done
          </button>
        </div>
      </div>
    </div>
  );
}
