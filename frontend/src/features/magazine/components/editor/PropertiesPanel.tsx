import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  CaseSensitive,
  ChevronsDown,
  ChevronsUp,
  Copy,
  Crop,
  Italic,
  Lock,
  Replace,
  Trash2,
  Unlock,
} from 'lucide-react';
import type { MagazineElement, MagazinePage, TextAlign } from '../../types';
import { availableWeights, nearestWeight } from '../../fonts';
import type { ElementPatch, HistoryMode, LayerMove } from '../../hooks/useMagazineEditor';
import {
  ColorField,
  FontPicker,
  NumberField,
  PanelButton,
  PanelSection,
  SegmentedControl,
  SelectField,
  SliderField,
} from './controls';
import BackgroundPanel from './panels/BackgroundPanel';

interface PropertiesPanelProps {
  page: MagazinePage;
  element: MagazineElement | undefined;
  onUpdate: (elementId: string, patch: ElementPatch, history?: HistoryMode) => void;
  onBeginGesture: () => void;
  onDelete: (elementId: string) => void;
  onDuplicate: (elementId: string) => void;
  onMoveLayer: (elementId: string, move: LayerMove) => void;
  onReplaceImage: (elementId: string) => void;
  onBackgroundChange: (background: MagazinePage['background'], history?: HistoryMode) => void;
  onRenamePage: (name: string) => void;
}

const ALIGN_OPTIONS: { value: TextAlign; label: JSX.Element; title: string }[] = [
  { value: 'left', label: <AlignLeft className="h-3.5 w-3.5" />, title: 'Align left' },
  { value: 'center', label: <AlignCenter className="h-3.5 w-3.5" />, title: 'Align centre' },
  { value: 'right', label: <AlignRight className="h-3.5 w-3.5" />, title: 'Align right' },
  { value: 'justify', label: <AlignJustify className="h-3.5 w-3.5" />, title: 'Justify' },
];

/**
 * The contextual panel: page settings when nothing is selected, and full
 * property controls for the selected text box, photo frame or shape.
 */
export default function PropertiesPanel({
  page,
  element,
  onUpdate,
  onBeginGesture,
  onDelete,
  onDuplicate,
  onMoveLayer,
  onReplaceImage,
  onBackgroundChange,
  onRenamePage,
}: PropertiesPanelProps) {
  if (!element) {
    return (
      <div className="space-y-6 p-4">
        <PanelSection title="Page">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Page name</span>
            <input
              value={page.name}
              onChange={(e) => onRenamePage(e.target.value)}
              className="rounded-lg border border-gold-200/50 bg-white px-2.5 py-1.5 text-xs font-medium text-luxury-accent outline-none focus:border-luxury-gold"
            />
          </label>
        </PanelSection>

        <BackgroundPanel background={page.background} onChange={onBackgroundChange} onBeginGesture={onBeginGesture} />

        <p className="rounded-lg bg-luxury-gray/70 p-3 text-[11px] leading-relaxed text-gray-500">
          Select any element on the page to edit it. Double-click text to rewrite it. Arrow keys nudge,
          Delete removes, Ctrl+D duplicates.
        </p>
      </div>
    );
  }

  const patch = (next: ElementPatch, history?: HistoryMode) => onUpdate(element.id, next, history);
  const slide = (key: string) => ({ coalesce: `${element.id}:${key}` }) as HistoryMode;

  return (
    <div className="space-y-6 p-4">
      {/* ── Type-specific controls ── */}
      {element.type === 'text' && (
        <PanelSection title="Text">
          <div className="space-y-3">
            <FontPicker
              value={element.fontFamily}
              onChange={(family) =>
                patch({ fontFamily: family, fontWeight: nearestWeight(family, element.fontWeight) })
              }
            />

            <div className="grid grid-cols-2 gap-2">
              <NumberField
                label="Size"
                value={element.fontSize}
                min={6}
                max={400}
                onChange={(v) => patch({ fontSize: v }, slide('fontSize'))}
              />
              <SelectField
                label="Weight"
                value={String(element.fontWeight)}
                options={availableWeights(element.fontFamily).map((w) => ({ value: String(w), label: String(w) }))}
                onChange={(v) => patch({ fontWeight: Number(v) })}
              />
            </div>

            <ColorField label="Colour" value={element.color} onChange={(color) => patch({ color })} />

            <SegmentedControl<TextAlign>
              label="Alignment"
              value={element.textAlign}
              options={ALIGN_OPTIONS}
              onChange={(textAlign) => patch({ textAlign })}
            />

            <div className="grid grid-cols-2 gap-2">
              <NumberField
                label="Line height"
                value={element.lineHeight}
                min={0.7}
                max={3}
                step={0.05}
                onChange={(v) => patch({ lineHeight: v }, slide('lineHeight'))}
              />
              <NumberField
                label="Tracking"
                value={element.letterSpacing}
                min={-10}
                max={40}
                step={0.5}
                onChange={(v) => patch({ letterSpacing: v }, slide('letterSpacing'))}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  patch({ textTransform: element.textTransform === 'uppercase' ? 'none' : 'uppercase' })
                }
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  element.textTransform === 'uppercase'
                    ? 'border-luxury-accent bg-luxury-accent text-white'
                    : 'border-gold-200/50 bg-white text-luxury-accent hover:border-luxury-gold'
                }`}
              >
                <CaseSensitive className="h-3.5 w-3.5" /> Caps
              </button>
              <button
                type="button"
                onClick={() => patch({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  element.fontStyle === 'italic'
                    ? 'border-luxury-accent bg-luxury-accent text-white'
                    : 'border-gold-200/50 bg-white text-luxury-accent hover:border-luxury-gold'
                }`}
              >
                <Italic className="h-3.5 w-3.5" /> Italic
              </button>
            </div>
          </div>
        </PanelSection>
      )}

      {element.type === 'image' && (
        <PanelSection title="Photo">
          <div className="space-y-3">
            <PanelButton onClick={() => onReplaceImage(element.id)} icon={<Replace className="h-3.5 w-3.5" />}>
              {element.src ? 'Replace photo' : 'Add photo'}
            </PanelButton>

            {element.src && (
              <PanelButton onClick={() => patch({ src: null })} icon={<Trash2 className="h-3.5 w-3.5" />}>
                Remove photo
              </PanelButton>
            )}

            <SegmentedControl<'cover' | 'contain'>
              label="Framing"
              value={element.fit}
              options={[
                { value: 'cover', label: 'Fill' },
                { value: 'contain', label: 'Fit' },
              ]}
              onChange={(fit) => patch({ fit })}
            />

            <SliderField
              label="Crop / zoom"
              value={element.zoom}
              min={1}
              max={3}
              step={0.02}
              onCommitStart={onBeginGesture}
              onChange={(zoom) => patch({ zoom }, 'skip')}
              format={(v) => `${Math.round(v * 100)}%`}
            />

            <div className="grid grid-cols-2 gap-2">
              <SliderField
                label="Pan X"
                value={element.offsetX}
                min={-50}
                max={50}
                onCommitStart={onBeginGesture}
                onChange={(offsetX) => patch({ offsetX }, 'skip')}
                format={(v) => `${Math.round(v)}%`}
              />
              <SliderField
                label="Pan Y"
                value={element.offsetY}
                min={-50}
                max={50}
                onCommitStart={onBeginGesture}
                onChange={(offsetY) => patch({ offsetY }, 'skip')}
                format={(v) => `${Math.round(v)}%`}
              />
            </div>

            <SliderField
              label="Corner radius"
              value={element.borderRadius}
              min={0}
              max={200}
              onCommitStart={onBeginGesture}
              onChange={(borderRadius) => patch({ borderRadius }, 'skip')}
            />

            <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-gray-400">
              <Crop className="mt-0.5 h-3 w-3 shrink-0" />
              Zoom and pan crop inside the frame — the layout never moves.
            </p>
          </div>
        </PanelSection>
      )}

      {element.type === 'shape' && (
        <PanelSection title="Shape">
          <div className="space-y-3">
            <ColorField label="Fill" value={element.fill} onChange={(fill) => patch({ fill })} allowTransparent />
            <ColorField
              label="Border"
              value={element.stroke}
              onChange={(stroke) => patch({ stroke })}
              allowTransparent
            />
            <SliderField
              label="Border width"
              value={element.strokeWidth}
              min={0}
              max={24}
              onCommitStart={onBeginGesture}
              onChange={(strokeWidth) => patch({ strokeWidth }, 'skip')}
            />
            {element.shape !== 'triangle' && (
              <SliderField
                label="Corner radius"
                value={element.borderRadius}
                min={0}
                max={200}
                onCommitStart={onBeginGesture}
                onChange={(borderRadius) => patch({ borderRadius }, 'skip')}
              />
            )}
          </div>
        </PanelSection>
      )}

      {/* ── Shared: geometry ── */}
      <PanelSection title="Position & size">
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="X" value={element.x} onChange={(x) => patch({ x }, slide('x'))} />
          <NumberField label="Y" value={element.y} onChange={(y) => patch({ y }, slide('y'))} />
          <NumberField
            label="Width"
            value={element.width}
            min={8}
            onChange={(width) => patch({ width }, slide('width'))}
          />
          <NumberField
            label="Height"
            value={element.height}
            min={8}
            onChange={(height) => patch({ height }, slide('height'))}
          />
        </div>
        <SliderField
          label="Rotation"
          value={element.rotation}
          min={0}
          max={359}
          onCommitStart={onBeginGesture}
          onChange={(rotation) => patch({ rotation }, 'skip')}
          format={(v) => `${Math.round(v)}°`}
        />
        <SliderField
          label="Opacity"
          value={element.opacity}
          min={0.05}
          max={1}
          step={0.01}
          onCommitStart={onBeginGesture}
          onChange={(opacity) => patch({ opacity }, 'skip')}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      </PanelSection>

      {/* ── Shared: layers & actions ── */}
      <PanelSection title="Arrange">
        <div className="grid grid-cols-4 gap-1.5">
          {(
            [
              { move: 'front', icon: ChevronsUp, title: 'Bring to front' },
              { move: 'forward', icon: ArrowUp, title: 'Bring forward' },
              { move: 'backward', icon: ArrowDown, title: 'Send backward' },
              { move: 'back', icon: ChevronsDown, title: 'Send to back' },
            ] as { move: LayerMove; icon: typeof ArrowUp; title: string }[]
          ).map((item) => (
            <button
              key={item.move}
              type="button"
              title={item.title}
              onClick={() => onMoveLayer(element.id, item.move)}
              className="flex h-9 items-center justify-center rounded-lg border border-gold-200/50 bg-white text-luxury-accent transition-colors hover:border-luxury-gold hover:text-luxury-gold"
            >
              <item.icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <PanelButton onClick={() => onDuplicate(element.id)} icon={<Copy className="h-3.5 w-3.5" />}>
            Copy
          </PanelButton>
          <PanelButton
            onClick={() => patch({ locked: !element.locked })}
            icon={element.locked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          >
            {element.locked ? 'Unlock' : 'Lock'}
          </PanelButton>
        </div>

        <PanelButton onClick={() => onDelete(element.id)} icon={<Trash2 className="h-3.5 w-3.5" />} tone="danger">
          Delete element
        </PanelButton>
      </PanelSection>
    </div>
  );
}
