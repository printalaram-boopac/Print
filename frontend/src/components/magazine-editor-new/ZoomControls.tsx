import { Minus, Plus, Maximize2, Undo2, Redo2 } from 'lucide-react';

interface ZoomControlsProps {
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export default function ZoomControls({
  zoom = 100,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: ZoomControlsProps) {
  return (
    <div className="hidden sm:flex absolute bottom-5 right-5 items-center gap-1 bg-white border border-[#E7E7E4] rounded-full shadow-md px-1.5 py-1 z-10 select-none">
      {onUndo && onRedo && (
        <>
          <button
            type="button"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
            onClick={onUndo}
            disabled={!canUndo}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
            onClick={onRedo}
            disabled={!canRedo}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Redo2 className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
          <div className="w-px h-4 bg-[#E7E7E4] mx-0.5" />
        </>
      )}
      <button
        type="button"
        aria-label="Zoom out"
        onClick={onZoomOut}
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] transition-colors cursor-pointer"
      >
        <Minus className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
      <span className="text-[11px] font-semibold text-[#1C2024] w-10 text-center select-none">{Math.round(zoom)}%</span>
      <button
        type="button"
        aria-label="Zoom in"
        onClick={onZoomIn}
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
      <div className="w-px h-4 bg-[#E7E7E4] mx-0.5" />
      <button
        type="button"
        aria-label="Reset zoom"
        onClick={onResetZoom}
        title="Reset zoom"
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] transition-colors cursor-pointer"
      >
        <Maximize2 className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}
