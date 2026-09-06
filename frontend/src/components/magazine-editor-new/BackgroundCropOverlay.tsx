import { useRef } from 'react';
import { Minus, Plus, Check, X } from 'lucide-react';
import type { BackgroundImageData } from '@/lib/magazine-editor-new/types';

interface BackgroundCropOverlayProps {
  image: BackgroundImageData;
  onChange: (patch: Partial<BackgroundImageData>) => void;
  onDone: () => void;
  onCancel: () => void;
}

/** Reposition/zoom for a background image — same pan+zoom-as-background-
 * position/size interaction as the Step 3 image CropOverlay, just covering
 * the full page instead of one frame (Step 8 §11–13). */
export default function BackgroundCropOverlay({ image, onChange, onDone, onCancel }: BackgroundCropOverlayProps) {
  const dragRef = useRef<{ startX: number; startY: number; startX0: number; startY0: number } | null>(null);
  const zoom = image.zoom ?? 1;

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    dragRef.current = { startX: e.clientX, startY: e.clientY, startX0: image.xPct ?? 50, startY0: image.yPct ?? 50 };
    const move = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = ((ev.clientX - dragRef.current.startX) / 300) * 100;
      const dy = ((ev.clientY - dragRef.current.startY) / 300) * 100;
      onChange({
        xPct: Math.max(0, Math.min(100, dragRef.current.startX0 - dx)),
        yPct: Math.max(0, Math.min(100, dragRef.current.startY0 - dy)),
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
      <div className="absolute inset-0">
        <div
          onPointerDown={onPointerDown}
          className="w-full h-full overflow-hidden cursor-move ring-2 ring-white ring-inset"
          style={{
            backgroundImage: `url("${image.src}")`,
            backgroundSize: `${100 * zoom}%`,
            backgroundPosition: `${image.xPct ?? 50}% ${image.yPct ?? 50}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1 bg-white rounded-full shadow-sm px-1.5 py-1.5">
            <button type="button" aria-label="Zoom out" onClick={() => onChange({ zoom: Math.max(1, zoom - 0.1) })} className="w-6 h-6 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer">
              <Minus className="w-3 h-3" strokeWidth={2} />
            </button>
            <span className="text-[11px] text-[#1C2024] w-9 text-center select-none">{Math.round(zoom * 100)}%</span>
            <button type="button" aria-label="Zoom in" onClick={() => onChange({ zoom: Math.min(3, zoom + 0.1) })} className="w-6 h-6 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer">
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
