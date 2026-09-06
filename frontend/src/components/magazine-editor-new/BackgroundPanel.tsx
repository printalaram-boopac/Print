import { useRef, useState } from 'react';
import { RotateCcw, Move, Upload, AlertTriangle } from 'lucide-react';
import type { PageBackground, TemplateDimensions, TemplatePage } from '@/lib/magazine-editor-new/types';
import {
  BACKGROUND_COLORS, BACKGROUND_GRADIENTS, BACKGROUND_TEXTURES, gradientCss,
} from '@/lib/magazine-editor-new/pageBackground';
import { PHOTO_LIBRARY } from '@/lib/magazine-editor-new/photoLibrary';
import { calculateEffectiveDpi, qualityFromDpi, QUALITY_LABEL } from '@/lib/magazine-editor-new/imageQuality';
import PageBackgroundLayer from './PageBackgroundLayer';
import ColorPicker from './ColorPicker';

interface BackgroundPanelProps {
  page: TemplatePage;
  gradient: string;
  dimensions: TemplateDimensions;
  pageCount: number;
  selectedPageCount: number;
  documentColors: string[];
  recentColors: string[];
  recentBackgrounds: PageBackground[];
  onApply: (bg: PageBackground) => void;
  onApplyToAll: (bg: PageBackground) => void;
  onApplyToSelected: (bg: PageBackground) => void;
  onReset: () => void;
  onEnterReposition: () => void;
  onUploadImage: (file: File) => void;
  onSetAsDefault: () => void;
}

function typeLabel(bg: PageBackground): string {
  switch (bg.type) {
    case 'solid': return 'Solid';
    case 'gradient': return 'Gradient';
    case 'image': return 'Image';
    case 'texture': return 'Texture';
    default: return 'None / White';
  }
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#6F7478] mt-5 mb-2 first:mt-0">{children}</h3>;
}

function Swatch({ style, selected, onClick, title }: { style: React.CSSProperties; selected: boolean; onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`aspect-square rounded-lg border-2 cursor-pointer transition-colors ${selected ? 'border-[#B8895A]' : 'border-[#E7E7E4] hover:border-[#D6D6D2]'}`}
      style={style}
    />
  );
}

export default function BackgroundPanel({
  page, gradient, dimensions, pageCount, selectedPageCount, documentColors, recentColors, recentBackgrounds,
  onApply, onApplyToAll, onApplyToSelected, onReset, onEnterReposition, onUploadImage, onSetAsDefault,
}: BackgroundPanelProps) {
  const bg = page.background ?? { type: 'none' as const };
  const isCoverLike = page.kind === 'cover' || page.kind === 'back-cover';
  const [confirmAll, setConfirmAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setSolid = (color: string) => onApply({ type: 'solid', color });
  const setGradient = (patch: Partial<typeof BACKGROUND_GRADIENTS[number]['gradient']>) => {
    const current = bg.type === 'gradient' && bg.gradient ? bg.gradient : BACKGROUND_GRADIENTS[0].gradient;
    onApply({ type: 'gradient', gradient: { ...current, ...patch } });
  };
  const setTexture = (textureId: string) => onApply({
    type: 'texture',
    texture: { textureId, opacity: bg.texture?.opacity ?? 100, scale: bg.texture?.scale ?? 1, baseColor: bg.texture?.baseColor ?? '#FFFFFF' },
  });
  const setImagePatch = (patch: Partial<NonNullable<PageBackground['image']>>) => {
    if (bg.type !== 'image' || !bg.image) return;
    onApply({ type: 'image', image: { ...bg.image, ...patch } });
  };

  const quality = bg.type === 'image' && bg.image?.sourceWidth
    ? qualityFromDpi(calculateEffectiveDpi(bg.image.sourceWidth, 100, dimensions.widthMm))
    : null;

  return (
    <aside className="w-full h-full flex-1 bg-white flex flex-col min-h-0 overflow-x-hidden">
      <div className="p-4 border-b border-[#E7E7E4] flex-shrink-0">
        <h2 className="text-[14px] font-semibold text-[#1C2024]">Background</h2>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-6" data-lenis-prevent>
        <SectionHeading>Current background</SectionHeading>
        <div className="flex items-center gap-2.5 p-2 rounded-xl border border-[#E7E7E4]">
          <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-[#E7E7E4] flex-shrink-0">
            <PageBackgroundLayer background={bg} isCoverLike={isCoverLike} fallbackGradient={gradient} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-[#1C2024]">{typeLabel(bg)}</p>
            <p className="text-[10px] text-[#6F7478]">Applies to this page only</p>
          </div>
          <button type="button" onClick={onReset} aria-label="Reset background" title="Reset background" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer flex-shrink-0">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
        <button type="button" onClick={onSetAsDefault} className="mt-1.5 text-[10px] text-[#6F7478] hover:text-[#1C2024] cursor-pointer underline underline-offset-2">
          Use as default for new pages
        </button>

        {bg.type === 'image' && bg.image && quality && quality !== 'good' && (
          <div className="mt-2 flex items-start gap-1.5 px-2.5 py-2 rounded-lg bg-[#F5F5F3]">
            <AlertTriangle className="w-3.5 h-3.5 text-[#B8895A] flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="text-[11px] font-medium text-[#1C2024]">{quality === 'low' ? 'Low-resolution background' : 'Acceptable resolution'}</p>
              <p className="text-[10px] text-[#6F7478]">{quality === 'low' ? 'This image may appear blurry when printed.' : QUALITY_LABEL[quality]}</p>
            </div>
          </div>
        )}

        {bg.type === 'image' && bg.image && (
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-[#E7E7E4] text-[11px] font-medium text-[#1C2024] hover:bg-[#F5F5F3] cursor-pointer">
                <Upload className="w-3 h-3" strokeWidth={1.75} /> Replace
              </button>
              <button type="button" onClick={onEnterReposition} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-[#E7E7E4] text-[11px] font-medium text-[#1C2024] hover:bg-[#F5F5F3] cursor-pointer">
                <Move className="w-3 h-3" strokeWidth={1.75} /> Reposition
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUploadImage(f); e.target.value = ''; }} />

            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F5F5F3]">
              {(['fill', 'fit'] as const).map((f) => (
                <button key={f} type="button" onClick={() => setImagePatch({ fit: f })} className={`flex-1 py-1 rounded-md text-[11px] font-medium capitalize cursor-pointer ${bg.image!.fit === f ? 'bg-white shadow-sm text-[#1C2024]' : 'text-[#6F7478]'}`}>{f}</button>
              ))}
            </div>

            <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
              Opacity
              <input type="range" min={0} max={100} value={bg.image.opacity} onChange={(e) => setImagePatch({ opacity: Number(e.target.value) })} className="w-32 accent-[#B8895A] cursor-pointer" />
            </label>
            <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
              Blur
              <input type="range" min={0} max={20} value={bg.image.blur} onChange={(e) => setImagePatch({ blur: Number(e.target.value) })} className="w-32 accent-[#B8895A] cursor-pointer" />
            </label>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#6F7478]">Overlay</span>
              <ColorPicker value={bg.image.overlayColor ?? 'none'} onChange={(c) => setImagePatch({ overlayColor: c === 'none' ? undefined : c, overlayOpacity: c === 'none' ? 0 : (bg.image!.overlayOpacity || 40) })} recentColors={recentColors} allowNone />
            </div>
            {bg.image.overlayColor && (
              <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
                Overlay opacity
                <input type="range" min={0} max={100} value={bg.image.overlayOpacity} onChange={(e) => setImagePatch({ overlayOpacity: Number(e.target.value) })} className="w-32 accent-[#B8895A] cursor-pointer" />
              </label>
            )}
          </div>
        )}

        {bg.type === 'texture' && bg.texture && (
          <div className="mt-3 space-y-2.5">
            <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
              Opacity
              <input type="range" min={0} max={100} value={bg.texture.opacity} onChange={(e) => onApply({ type: 'texture', texture: { ...bg.texture!, opacity: Number(e.target.value) } })} className="w-32 accent-[#B8895A] cursor-pointer" />
            </label>
            <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
              Scale
              <input type="range" min={0.5} max={3} step={0.1} value={bg.texture.scale} onChange={(e) => onApply({ type: 'texture', texture: { ...bg.texture!, scale: Number(e.target.value) } })} className="w-32 accent-[#B8895A] cursor-pointer" />
            </label>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#6F7478]">Base colour</span>
              <ColorPicker value={bg.texture.baseColor ?? '#FFFFFF'} onChange={(c) => onApply({ type: 'texture', texture: { ...bg.texture!, baseColor: c } })} recentColors={recentColors} />
            </div>
          </div>
        )}

        {bg.type === 'gradient' && bg.gradient && (
          <div className="mt-3 space-y-2.5 p-2.5 rounded-xl border border-[#E7E7E4]">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F5F5F3]">
              {(['linear', 'radial'] as const).map((k) => (
                <button key={k} type="button" onClick={() => setGradient({ kind: k })} className={`flex-1 py-1 rounded-md text-[11px] font-medium capitalize cursor-pointer ${bg.gradient!.kind === k ? 'bg-white shadow-sm text-[#1C2024]' : 'text-[#6F7478]'}`}>{k}</button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#6F7478]">Start</span>
              <ColorPicker value={bg.gradient.stops[0]?.color ?? '#FFFFFF'} onChange={(c) => setGradient({ stops: [{ ...bg.gradient!.stops[0], color: c }, ...bg.gradient!.stops.slice(1)] })} recentColors={recentColors} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#6F7478]">End</span>
              <ColorPicker value={bg.gradient.stops[bg.gradient.stops.length - 1]?.color ?? '#000000'} onChange={(c) => setGradient({ stops: [...bg.gradient!.stops.slice(0, -1), { ...bg.gradient!.stops[bg.gradient!.stops.length - 1], color: c }] })} recentColors={recentColors} />
            </div>
            {bg.gradient.kind === 'linear' && (
              <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
                Angle
                <span className="flex items-center gap-1">
                  <input type="number" value={bg.gradient.angle} onChange={(e) => setGradient({ angle: Number(e.target.value) })} className="w-12 px-1.5 py-1 rounded border border-[#E7E7E4] text-[11px] text-right" />
                  {[0, 45, 90, 180].map((deg) => (
                    <button key={deg} type="button" onClick={() => setGradient({ angle: deg })} className="px-1 py-1 rounded text-[10px] text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer">{deg}°</button>
                  ))}
                </span>
              </label>
            )}
            <label className="flex items-center justify-between text-[11px] text-[#6F7478]">
              Opacity
              <input type="range" min={0} max={100} value={bg.gradient.opacity ?? 100} onChange={(e) => setGradient({ opacity: Number(e.target.value) })} className="w-32 accent-[#B8895A] cursor-pointer" />
            </label>
          </div>
        )}

        <SectionHeading>Colours</SectionHeading>
        <div className="grid grid-cols-6 gap-1.5">
          {BACKGROUND_COLORS.map((c) => (
            <Swatch key={c.color} title={c.name} style={{ background: c.color }} selected={bg.type === 'solid' && bg.color === c.color} onClick={() => setSolid(c.color)} />
          ))}
        </div>
        {documentColors.length > 0 && (
          <>
            <p className="text-[10px] text-[#6F7478] mt-2.5 mb-1">Document colours</p>
            <div className="grid grid-cols-6 gap-1.5">
              {documentColors.slice(0, 12).map((c) => (
                <Swatch key={c} title={c} style={{ background: c }} selected={bg.type === 'solid' && bg.color === c} onClick={() => setSolid(c)} />
              ))}
            </div>
          </>
        )}
        <div className="mt-2.5">
          <ColorPicker value={bg.type === 'solid' ? (bg.color ?? '#FFFFFF') : '#FFFFFF'} onChange={setSolid} recentColors={recentColors} label="Custom" />
        </div>

        <SectionHeading>Gradients</SectionHeading>
        <div className="grid grid-cols-3 gap-1.5">
          {BACKGROUND_GRADIENTS.map((g) => (
            <Swatch key={g.id} title={g.name} style={{ background: gradientCss(g.gradient) }} selected={bg.type === 'gradient' && bg.gradient?.stops[0]?.color === g.gradient.stops[0].color && bg.gradient?.stops[1]?.color === g.gradient.stops[1].color} onClick={() => onApply({ type: 'gradient', gradient: g.gradient })} />
          ))}
        </div>

        <SectionHeading>Photos</SectionHeading>
        <div className="grid grid-cols-3 gap-1.5">
          {PHOTO_LIBRARY.slice(0, 12).map((p) => (
            <button
              key={p.id}
              type="button"
              title={p.category}
              onClick={() => onApply({ type: 'image', image: { src: p.url, originalSrc: p.url, sourceWidth: p.width, sourceHeight: p.height, fit: 'fill', xPct: 50, yPct: 50, zoom: 1, opacity: 100, blur: 0, overlayOpacity: 0 } })}
              className="aspect-square rounded-lg overflow-hidden border-2 border-[#E7E7E4] hover:border-[#B8895A] cursor-pointer bg-cover bg-center"
              style={{ backgroundImage: `url(${p.url})` }}
            />
          ))}
        </div>

        <SectionHeading>Textures</SectionHeading>
        <div className="grid grid-cols-3 gap-1.5">
          {BACKGROUND_TEXTURES.map((t) => (
            <Swatch
              key={t.id}
              title={t.name}
              selected={bg.type === 'texture' && bg.texture?.textureId === t.id}
              onClick={() => setTexture(t.id)}
              style={{ backgroundColor: '#FFFFFF', backgroundImage: `url("${t.src}")`, backgroundSize: `${t.tileSizePx}px ${t.tileSizePx}px` }}
            />
          ))}
        </div>

        {recentBackgrounds.length > 0 && (
          <>
            <SectionHeading>Recently used</SectionHeading>
            <div className="grid grid-cols-6 gap-1.5">
              {recentBackgrounds.map((rb, i) => (
                <button key={i} type="button" onClick={() => onApply(rb)} className="aspect-square rounded-lg border-2 border-[#E7E7E4] hover:border-[#B8895A] cursor-pointer overflow-hidden relative">
                  <PageBackgroundLayer background={rb} isCoverLike={false} fallbackGradient={gradient} />
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-5 pt-4 border-t border-[#E7E7E4] space-y-2">
          <button type="button" onClick={() => setConfirmAll(true)} className="w-full px-3 py-2 rounded-lg text-[12px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer">
            Apply to all pages
          </button>
          {selectedPageCount > 1 && (
            <button type="button" onClick={() => onApplyToSelected(bg)} className="w-full px-3 py-2 rounded-lg text-[12px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer">
              Apply to {selectedPageCount} selected pages
            </button>
          )}
        </div>
      </div>

      {confirmAll && (
        <div className="fixed inset-0 z-[400] bg-black/60 flex items-center justify-center p-6" data-lenis-prevent onClick={() => setConfirmAll(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold text-[#1C2024]">Apply background to all pages?</h3>
            <p className="mt-2 text-[13px] text-[#6F7478] leading-relaxed">Apply this background to all {pageCount} pages?</p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setConfirmAll(false)} className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer">Cancel</button>
              <button type="button" onClick={() => { onApplyToAll(bg); setConfirmAll(false); }} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] cursor-pointer">Apply to all</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
