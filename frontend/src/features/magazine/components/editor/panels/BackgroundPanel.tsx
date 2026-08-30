import { ImagePlus, Trash2 } from 'lucide-react';
import type { PageBackground } from '../../../types';
import { COLOR_SWATCHES } from '../../../constants';
import type { HistoryMode } from '../../../hooks/useMagazineEditor';
import { ColorField, PanelButton, PanelSection, SegmentedControl, SliderField } from '../controls';

interface BackgroundPanelProps {
  background: PageBackground;
  onChange: (background: PageBackground, history?: HistoryMode) => void;
  onBeginGesture: () => void;
  /** Opens the file picker for a background photo. Hidden when not provided. */
  onPickImage?: () => void;
}

/**
 * Page background editing.
 *
 * Backgrounds live on the page, not in the element list, so switching between a
 * colour, a gradient and a photo never touches the artwork on top of it.
 */
export default function BackgroundPanel({
  background,
  onChange,
  onBeginGesture,
  onPickImage,
}: BackgroundPanelProps) {
  const colour = background.type === 'color' ? background.color : background.type === 'image' ? background.color : '#FFFFFF';

  return (
    <PanelSection title="Background">
      <div className="space-y-3">
        <SegmentedControl<PageBackground['type']>
          value={background.type}
          options={[
            { value: 'color', label: 'Colour' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'image', label: 'Photo' },
          ]}
          onChange={(type) => {
            if (type === background.type) return;
            if (type === 'color') onChange({ type: 'color', color: colour });
            if (type === 'gradient') {
              onChange({
                type: 'gradient',
                from: background.type === 'gradient' ? background.from : colour,
                to: background.type === 'gradient' ? background.to : '#FFFFFF',
                angle: background.type === 'gradient' ? background.angle : 160,
              });
            }
            if (type === 'image') {
              onChange({
                type: 'image',
                src: background.type === 'image' ? background.src : '',
                color: colour,
              });
            }
          }}
        />

        {background.type === 'color' && (
          <>
            <div className="grid grid-cols-6 gap-1.5">
              {COLOR_SWATCHES.slice(0, 18).map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  title={swatch}
                  onClick={() => onChange({ type: 'color', color: swatch })}
                  className={`h-7 rounded border transition-transform hover:scale-110 ${
                    background.color.toLowerCase() === swatch.toLowerCase()
                      ? 'border-luxury-gold ring-2 ring-luxury-gold/40'
                      : 'border-black/10'
                  }`}
                  style={{ background: swatch }}
                />
              ))}
            </div>
            <ColorField
              label="Page colour"
              value={background.color}
              onChange={(color) => onChange({ type: 'color', color })}
            />
          </>
        )}

        {background.type === 'gradient' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <ColorField
                label="From"
                value={background.from}
                onChange={(from) => onChange({ ...background, from })}
              />
              <ColorField label="To" value={background.to} onChange={(to) => onChange({ ...background, to })} />
            </div>
            <SliderField
              label="Angle"
              value={background.angle}
              min={0}
              max={360}
              onCommitStart={onBeginGesture}
              onChange={(angle) => onChange({ ...background, angle }, 'skip')}
              format={(v) => `${Math.round(v)}°`}
            />
          </>
        )}

        {background.type === 'image' && (
          <>
            {background.src ? (
              <div className="space-y-2">
                <div
                  className="h-20 w-full rounded-lg border border-gold-200/50 bg-cover bg-center"
                  style={{ backgroundImage: `url(${background.src})` }}
                />
                <PanelButton
                  onClick={() => onChange({ type: 'color', color: background.color })}
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                >
                  Remove photo
                </PanelButton>
              </div>
            ) : (
              <p className="rounded-lg bg-luxury-gray/70 p-2.5 text-[10px] leading-relaxed text-gray-500">
                Choose a photo to fill the whole page. Everything already on the page stays where it is.
              </p>
            )}

            {onPickImage && (
              <PanelButton onClick={onPickImage} icon={<ImagePlus className="h-3.5 w-3.5" />}>
                {background.src ? 'Change photo' : 'Upload photo'}
              </PanelButton>
            )}
          </>
        )}
      </div>
    </PanelSection>
  );
}
