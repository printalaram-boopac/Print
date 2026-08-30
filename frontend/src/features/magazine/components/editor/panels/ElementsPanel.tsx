import { Image as ImageIcon } from 'lucide-react';
import { SHAPE_PRESETS, type ShapePreset } from '../../../constants';
import type { ShapeInput } from '../../../services/templateService';
import { PanelSection } from '../controls';

interface ElementsPanelProps {
  onAddShape: (input: ShapeInput) => void;
  onAddImageFrame: () => void;
}

function shapeInput(preset: ShapePreset): ShapeInput {
  return {
    shape: preset.shape,
    width: preset.width,
    height: preset.height,
    fill: preset.outline ? 'transparent' : '#3D1E30',
    stroke: preset.outline ? '#C5A059' : 'transparent',
    strokeWidth: preset.strokeWidth ?? 0,
    borderRadius: preset.radius ?? 0,
  };
}

/** Miniature of a shape preset, drawn with the same rules as the canvas. */
function ShapeGlyph({ preset }: { preset: ShapePreset }) {
  const base = 'bg-luxury-accent';
  if (preset.shape === 'ellipse') {
    return <span className={`${base} h-7 w-7 rounded-full`} />;
  }
  if (preset.shape === 'triangle') {
    return (
      <span
        className={base}
        style={{ width: 28, height: 24, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
      />
    );
  }
  if (preset.shape === 'line') {
    return <span className={base} style={{ width: 34, height: preset.height > 4 ? 6 : 2 }} />;
  }
  if (preset.outline) {
    return <span className="h-7 w-9 rounded border-2 border-luxury-gold" />;
  }
  return <span className={base} style={{ width: 34, height: 26, borderRadius: preset.radius ? 8 : 0 }} />;
}

/** Shapes, rules and photo frames to drop onto the page. */
export default function ElementsPanel({ onAddShape, onAddImageFrame }: ElementsPanelProps) {
  return (
    <div className="space-y-6 p-4">
      <PanelSection title="Shapes">
        <div className="grid grid-cols-3 gap-2">
          {SHAPE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              title={preset.label}
              onClick={() => onAddShape(shapeInput(preset))}
              className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-gold-200/50 bg-white transition-all hover:border-luxury-gold hover:bg-amber-50/50"
            >
              <ShapeGlyph preset={preset} />
              <span className="px-1 text-center text-[8px] font-semibold uppercase tracking-wider text-gray-400">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Photo frame">
        <button
          type="button"
          onClick={onAddImageFrame}
          className="flex w-full items-center gap-3 rounded-lg border border-dashed border-gold-300 bg-amber-50/40 px-3 py-3 text-left transition-colors hover:border-luxury-gold hover:bg-amber-50"
        >
          <ImageIcon className="h-5 w-5 shrink-0 text-luxury-gold" />
          <span className="flex flex-col">
            <span className="text-xs font-semibold text-luxury-accent">Add an empty frame</span>
            <span className="text-[10px] text-gray-400">Drop a photo in later — the slot stays editable</span>
          </span>
        </button>
      </PanelSection>
    </div>
  );
}
