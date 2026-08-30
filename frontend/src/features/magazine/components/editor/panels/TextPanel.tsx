import { Type } from 'lucide-react';
import { TEXT_PRESETS } from '../../../constants';
import { fontStack } from '../../../fonts';
import type { TextPresetInput } from '../../../services/templateService';
import { PanelSection } from '../controls';

interface TextPanelProps {
  onAddText: (preset: TextPresetInput) => void;
}

/** Ready-made type styles — mastheads, headlines, body copy, captions. */
export default function TextPanel({ onAddText }: TextPanelProps) {
  return (
    <div className="space-y-6 p-4">
      <PanelSection title="Add text">
        <div className="space-y-2">
          {TEXT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() =>
                onAddText({
                  content: preset.sample,
                  fontFamily: preset.fontFamily,
                  fontSize: preset.fontSize,
                  fontWeight: preset.fontWeight,
                  letterSpacing: preset.letterSpacing,
                  lineHeight: preset.lineHeight,
                  textTransform: preset.textTransform,
                })
              }
              className="flex w-full flex-col gap-1 rounded-lg border border-gold-200/50 bg-white px-3 py-2.5 text-left transition-all hover:border-luxury-gold hover:bg-amber-50/50"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-300">
                {preset.label}
              </span>
              <span
                className="truncate text-luxury-accent"
                style={{
                  fontFamily: fontStack(preset.fontFamily),
                  fontWeight: preset.fontWeight,
                  fontSize: Math.min(preset.fontSize / 2.2, 22),
                  letterSpacing: Math.min(preset.letterSpacing, 2),
                  textTransform: preset.textTransform,
                  lineHeight: 1.25,
                }}
              >
                {preset.sample}
              </span>
            </button>
          ))}
        </div>
      </PanelSection>

      <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-gray-400">
        <Type className="mt-0.5 h-3 w-3 shrink-0" />
        Double-click any text on the page to rewrite it. Every text box keeps its font, size and colour
        controls after saving.
      </p>
    </div>
  );
}
