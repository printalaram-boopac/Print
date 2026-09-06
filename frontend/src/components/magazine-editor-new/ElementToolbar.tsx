import { useRef } from 'react';
import {
  RefreshCw, Crop, FlipHorizontal, FlipVertical, Copy, Trash2, Lock, Unlock,
  BringToFront, SendToBack, ChevronUp, ChevronDown, AlertTriangle,
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, Minus, Plus,
} from 'lucide-react';
import type { TemplateElement, ImageFit, ImageQuality, LineStyle } from '@/lib/magazine-editor-new/types';
import { QUALITY_LABEL } from '@/lib/magazine-editor-new/imageQuality';
import { iconFor } from '@/lib/magazine-editor-new/iconMap';
import { FONTS } from '@/lib/magazine/fonts';
import ColorPicker from './ColorPicker';

function Divider() {
  return <div className="w-px h-6 bg-[#E7E7E4] mx-1 flex-shrink-0" />;
}

function IconButton({ icon: Icon, label, onClick, active }: { icon: typeof Crop; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
        active ? 'bg-[#F5F5F3] text-[#1C2024]' : 'text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024]'
      }`}
    >
      <Icon className="w-4 h-4" strokeWidth={1.75} />
    </button>
  );
}

const ROUNDED_PRESETS = [0, 4, 8, 16, 24];
const LINE_STYLES: LineStyle[] = ['solid', 'dashed', 'dotted'];

interface ElementToolbarProps {
  element: TemplateElement;
  quality: ImageQuality | null;
  recentColors: string[];
  onPatch: (patch: Partial<TemplateElement>) => void;
  onReplace: (file: File) => void;
  onCrop: () => void;
  onLayer: (direction: 'forward' | 'backward' | 'front' | 'back') => void;
  onToggleLock: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function ElementToolbar({
  element: el, quality, recentColors, onPatch, onReplace, onCrop, onLayer, onToggleLock, onDuplicate, onDelete,
}: ElementToolbarProps) {
  const replaceInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto">
      {el.kind === 'image' && (
        <>
          <button
            type="button"
            onClick={() => replaceInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E7E4] text-[13px] text-[#1C2024] hover:bg-[#F5F5F3] transition-colors cursor-pointer flex-shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} /> Replace
          </button>
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onReplace(f); e.target.value = ''; }}
          />
          <IconButton icon={Crop} label="Crop" onClick={onCrop} />
          <Divider />
          <div className="flex items-center gap-0.5 bg-[#F5F5F3] rounded-lg p-0.5 flex-shrink-0">
            {(['fill', 'fit'] as ImageFit[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onPatch({ fit: f })}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize cursor-pointer transition-colors ${(el.fit ?? 'fill') === f ? 'bg-white text-[#1C2024] shadow-sm' : 'text-[#6F7478]'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <Divider />
          <IconButton icon={FlipHorizontal} label="Flip horizontal" onClick={() => onPatch({ flipX: !el.flipX })} active={el.flipX} />
          <IconButton icon={FlipVertical} label="Flip vertical" onClick={() => onPatch({ flipY: !el.flipY })} active={el.flipY} />
          <Divider />
          <div className="flex items-center gap-1 flex-shrink-0">
            {ROUNDED_PRESETS.map((r) => (
              <button key={r} type="button" onClick={() => onPatch({ borderRadius: r })} className={`w-7 h-7 rounded-lg text-[10px] font-medium cursor-pointer transition-colors ${(el.borderRadius ?? 0) === r ? 'bg-[#F5F5F3] text-[#1C2024]' : 'text-[#6F7478] hover:bg-[#F5F5F3]'}`}>
                {r}
              </button>
            ))}
          </div>
        </>
      )}

      {el.kind === 'shape' && (
        <>
          <ColorPicker label="Fill" value={el.fill ?? '#B8895A'} onChange={(fill) => onPatch({ fill })} allowNone recentColors={recentColors} />
          <Divider />
          <div className="flex items-center gap-1 flex-shrink-0">
            {ROUNDED_PRESETS.map((r) => (
              <button key={r} type="button" onClick={() => onPatch({ borderRadius: r })} className={`w-7 h-7 rounded-lg text-[10px] font-medium cursor-pointer transition-colors ${(el.borderRadius ?? 0) === r ? 'bg-[#F5F5F3] text-[#1C2024]' : 'text-[#6F7478] hover:bg-[#F5F5F3]'}`}>
                {r}
              </button>
            ))}
          </div>
        </>
      )}

      {(el.kind === 'shape' || el.kind === 'line') && (
        <>
          <Divider />
          <ColorPicker label="Border" value={el.borderColor ?? '#1C2024'} onChange={(borderColor) => onPatch({ borderColor })} recentColors={recentColors} />
          <label className="flex items-center gap-1.5 text-[11px] text-[#6F7478] flex-shrink-0">
            Width
            <input type="range" min={0} max={8} value={el.kind === 'line' ? (el.strokeWidth ?? 2) : (el.borderWidth ?? 0)} onChange={(e) => onPatch(el.kind === 'line' ? { strokeWidth: Number(e.target.value) } : { borderWidth: Number(e.target.value) })} className="w-12 accent-[#B8895A]" />
          </label>
          <div className="flex items-center gap-0.5 bg-[#F5F5F3] rounded-lg p-0.5 flex-shrink-0">
            {LINE_STYLES.map((s) => (
              <button key={s} type="button" onClick={() => onPatch(el.kind === 'line' ? { lineStyle: s } : { borderStyle: s })} className={`px-2 py-1 rounded-md text-[10px] font-medium capitalize cursor-pointer transition-colors ${(el.kind === 'line' ? el.lineStyle : el.borderStyle) === s ? 'bg-white text-[#1C2024] shadow-sm' : 'text-[#6F7478]'}`}>
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {el.kind === 'line' && (
        <>
          <Divider />
          <IconButton icon={ChevronUp} label="Toggle start arrow" onClick={() => onPatch({ arrowStart: !el.arrowStart })} active={el.arrowStart} />
          <IconButton icon={ChevronDown} label="Toggle end arrow" onClick={() => onPatch({ arrowEnd: !el.arrowEnd })} active={el.arrowEnd} />
        </>
      )}

      {el.kind === 'icon' && (() => {
        const Icon = iconFor(el.iconName);
        return (
          <>
            <span className="flex items-center gap-1.5 text-[11px] text-[#6F7478] flex-shrink-0"><Icon className="w-4 h-4" strokeWidth={1.75} /> {el.iconName}</span>
            <Divider />
            <ColorPicker label="Color" value={el.iconColor ?? '#1C2024'} onChange={(iconColor) => onPatch({ iconColor })} recentColors={recentColors} />
            <Divider />
            <IconButton icon={FlipHorizontal} label="Flip horizontal" onClick={() => onPatch({ flipX: !el.flipX })} active={el.flipX} />
            <IconButton icon={FlipVertical} label="Flip vertical" onClick={() => onPatch({ flipY: !el.flipY })} active={el.flipY} />
          </>
        );
      })()}

      {el.kind === 'text' && (
        <>
          {/* Font Family */}
          <select
            value={el.fontKey ?? (el.role === 'headline' ? 'serif' : 'condensed')}
            onChange={(e) => onPatch({ fontKey: e.target.value })}
            className="h-8 px-2.5 rounded-lg border border-[#E7E7E4] text-[12px] font-medium text-[#1C2024] bg-white cursor-pointer focus:outline-none focus:border-[#8B3DFF] max-w-[130px] flex-shrink-0"
            title="Font Family"
          >
            {FONTS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>

          {/* Font Size +/- controls */}
          <div className="flex items-center gap-0.5 border border-[#E7E7E4] rounded-lg h-8 px-1 bg-white flex-shrink-0">
            <button
              type="button"
              aria-label="Decrease font size"
              title="Decrease font size"
              onClick={() => {
                const current = el.fontSize ?? (el.role === 'headline' ? 36 : el.role === 'subheading' ? 20 : 14);
                onPatch({ fontSize: Math.max(8, current - 2) });
              }}
              className="w-6 h-6 flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] hover:bg-[#F5F5F3] rounded cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <input
              type="number"
              min={8}
              max={160}
              value={el.fontSize ?? (el.role === 'headline' ? 36 : el.role === 'subheading' ? 20 : 14)}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > 0) onPatch({ fontSize: val });
              }}
              className="text-[12px] font-semibold text-[#1C2024] w-9 text-center focus:outline-none bg-transparent"
              title="Font size (px)"
            />
            <button
              type="button"
              aria-label="Increase font size"
              title="Increase font size"
              onClick={() => {
                const current = el.fontSize ?? (el.role === 'headline' ? 36 : el.role === 'subheading' ? 20 : 14);
                onPatch({ fontSize: Math.min(160, current + 2) });
              }}
              className="w-6 h-6 flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] hover:bg-[#F5F5F3] rounded cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>

          <Divider />

          {/* Text Color Picker - directly sets el.color */}
          <ColorPicker
            label="Color"
            value={el.color ?? (el.badgeColor ? '#FFFFFF' : '#1C2024')}
            onChange={(color) => onPatch({ color })}
            recentColors={recentColors}
            allowGradients={false}
          />

          {el.badgeColor !== undefined && (
            <>
              <Divider />
              <ColorPicker
                label="Badge"
                value={el.badgeColor}
                onChange={(badgeColor) => onPatch({ badgeColor })}
                recentColors={recentColors}
                allowNone
              />
            </>
          )}

          <Divider />

          {/* Formatting buttons */}
          <div className="flex items-center gap-0.5 bg-[#F5F5F3] p-0.5 rounded-lg flex-shrink-0">
            <button
              type="button"
              aria-label="Bold"
              title="Bold"
              onClick={() => {
                const isBold = el.fontWeight === 'bold' || el.fontWeight === 700 || (el.role === 'headline' && el.fontWeight !== 'normal');
                onPatch({ fontWeight: isBold ? 'normal' : 'bold' });
              }}
              className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                el.fontWeight === 'bold' || el.fontWeight === 700 || (el.role === 'headline' && el.fontWeight !== 'normal')
                  ? 'bg-white text-[#8B3DFF] shadow-xs'
                  : 'text-[#6F7478] hover:text-[#1C2024]'
              }`}
            >
              <Bold className="w-3.5 h-3.5" strokeWidth={2.2} />
            </button>

            <button
              type="button"
              aria-label="Italic"
              title="Italic"
              onClick={() => {
                const isItalic = el.fontStyle === 'italic' || (el.role === 'headline' && el.fontStyle !== 'normal');
                onPatch({ fontStyle: isItalic ? 'normal' : 'italic' });
              }}
              className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                el.fontStyle === 'italic' || (el.role === 'headline' && el.fontStyle !== 'normal')
                  ? 'bg-white text-[#8B3DFF] shadow-xs'
                  : 'text-[#6F7478] hover:text-[#1C2024]'
              }`}
            >
              <Italic className="w-3.5 h-3.5" strokeWidth={2.2} />
            </button>

            <button
              type="button"
              aria-label="Align left"
              title="Align left"
              onClick={() => onPatch({ textAlign: 'left' })}
              className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                el.textAlign === 'left' ? 'bg-white text-[#8B3DFF] shadow-xs' : 'text-[#6F7478] hover:text-[#1C2024]'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label="Align center"
              title="Align center"
              onClick={() => onPatch({ textAlign: 'center' })}
              className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                !el.textAlign || el.textAlign === 'center' ? 'bg-white text-[#8B3DFF] shadow-xs' : 'text-[#6F7478] hover:text-[#1C2024]'
              }`}
            >
              <AlignCenter className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label="Align right"
              title="Align right"
              onClick={() => onPatch({ textAlign: 'right' })}
              className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                el.textAlign === 'right' ? 'bg-white text-[#8B3DFF] shadow-xs' : 'text-[#6F7478] hover:text-[#1C2024]'
              }`}
            >
              <AlignRight className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label="Uppercase"
              title="Uppercase"
              onClick={() => onPatch({ textTransform: el.textTransform === 'uppercase' ? 'none' : 'uppercase' })}
              className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold cursor-pointer transition-colors ${
                el.textTransform === 'uppercase' ? 'bg-white text-[#8B3DFF] shadow-xs' : 'text-[#6F7478] hover:text-[#1C2024]'
              }`}
            >
              aA
            </button>
          </div>

          <Divider />

          {/* Quick text content edit input */}
          <input
            type="text"
            value={el.content ?? ''}
            onChange={(e) => onPatch({ content: e.target.value })}
            placeholder="Text content"
            className="px-3 py-1.5 rounded-lg border border-[#E7E7E4] text-[13px] text-[#1C2024] focus:outline-none focus:border-[#8B3DFF] w-36 flex-shrink-0"
            title="Edit text content"
          />
        </>
      )}

      <Divider />

      <label className="flex items-center gap-1.5 text-[11px] text-[#6F7478] flex-shrink-0">
        Opacity
        <input type="range" min={0} max={100} value={el.opacity ?? 100} onChange={(e) => onPatch({ opacity: Number(e.target.value) })} className="w-16 accent-[#B8895A]" />
      </label>

      <Divider />

      <IconButton icon={ChevronUp} label="Bring forward" onClick={() => onLayer('forward')} />
      <IconButton icon={ChevronDown} label="Send backward" onClick={() => onLayer('backward')} />
      <IconButton icon={BringToFront} label="Bring to front" onClick={() => onLayer('front')} />
      <IconButton icon={SendToBack} label="Send to back" onClick={() => onLayer('back')} />

      <Divider />

      <IconButton icon={el.locked ? Lock : Unlock} label={el.locked ? 'Unlock' : 'Lock'} onClick={onToggleLock} active={el.locked} />
      <IconButton icon={Copy} label="Duplicate" onClick={onDuplicate} />
      <IconButton icon={Trash2} label="Delete" onClick={onDelete} />

      {quality === 'low' && (
        <>
          <Divider />
          <span title={QUALITY_LABEL.low} className="flex items-center gap-1 text-[11px] text-[#B8895A] flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.75} /> Low-resolution image
          </span>
        </>
      )}
    </div>
  );
}
