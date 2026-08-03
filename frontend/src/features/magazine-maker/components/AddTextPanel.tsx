import { Type } from 'lucide-react';
import { FONTS, GRADIENT_PRESETS, SIZES } from '../constants';
import { ToggleButton } from './ToggleButton';
import type { ColorMode, SizeKey, ZinePage } from '../types';

interface AddTextPanelProps {
  pages: ZinePage[];
  stickerTargetPage: number;
  setStickerTargetPage: (i: number) => void;
  newText: string;
  setNewText: (v: string) => void;
  addTextSticker: () => void;
  font: string;
  setFont: (v: string) => void;
  size: SizeKey;
  setSize: (v: SizeKey) => void;
  colorMode: ColorMode;
  setColorMode: (v: ColorMode) => void;
  textColor: string;
  setTextColor: (v: string) => void;
  gradientFrom: string;
  setGradientFrom: (v: string) => void;
  gradientTo: string;
  setGradientTo: (v: string) => void;
}

export function AddTextPanel({
  pages,
  stickerTargetPage,
  setStickerTargetPage,
  newText,
  setNewText,
  addTextSticker,
  font,
  setFont,
  size,
  setSize,
  colorMode,
  setColorMode,
  textColor,
  setTextColor,
  gradientFrom,
  setGradientFrom,
  gradientTo,
  setGradientTo,
}: AddTextPanelProps) {
  return (
    <div className="rounded-xl border border-luxury-gold/40 p-4 space-y-3" style={{ background: 'linear-gradient(135deg, #1a1410, #3D1E30 70%)' }}>
      <div className="flex items-center gap-2">
        <Type className="w-4 h-4 text-luxury-gold" strokeWidth={2} />
        <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold">Add Text</h3>
      </div>
      <p className="text-[11px] text-gray-400">Add any text to any page, then drag it anywhere — just like Instagram Stories.</p>

      {/* Target page selector */}
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">On page</p>
        <div className="flex flex-wrap gap-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStickerTargetPage(i)}
              className={`w-7 h-7 rounded-md border text-[11px] font-bold transition-colors cursor-pointer ${
                stickerTargetPage === i
                  ? 'bg-luxury-gold border-luxury-gold text-luxury-accent'
                  : 'bg-luxury-dark border-gold-200/40 text-gray-400 hover:border-luxury-gold/60'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTextSticker()}
          placeholder="Type any text..."
          className="flex-1 bg-luxury-dark border border-gold-200/40 rounded-lg px-3 py-2.5 text-xs text-luxury-accent placeholder:text-gray-500 focus:outline-none focus:border-luxury-gold transition-colors"
        />
        <button
          type="button"
          onClick={addTextSticker}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-luxury-gold text-luxury-accent text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Type className="w-3.5 h-3.5" strokeWidth={2} /> Add Text
        </button>
      </div>

      {/* Font */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Font</p>
        <div className="flex flex-wrap gap-2">
          {FONTS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setFont(f.label)}
              style={{ fontFamily: f.family }}
              className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                font === f.label ? 'bg-luxury-gold border-luxury-gold text-luxury-accent font-bold' : 'bg-luxury-dark border-gold-200/40 text-gray-300 hover:border-luxury-gold/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Size</p>
        <div className="flex gap-1.5">
          {SIZES.map((s) => (
            <ToggleButton key={s.key} active={size === s.key} onClick={() => setSize(s.key)} label={`Size ${s.key}`}>
              <span className="text-xs font-bold">{s.key}</span>
            </ToggleButton>
          ))}
        </div>
      </div>

      {/* Color: solid / gradient / custom */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Color</p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setColorMode('solid')}
            aria-pressed={colorMode === 'solid'}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
              colorMode === 'solid' ? 'bg-luxury-gold border-luxury-gold text-luxury-accent' : 'bg-luxury-dark border-gold-200/40 text-gray-400 hover:border-luxury-gold/60'
            }`}
          >
            Solid
          </button>
          <button
            type="button"
            onClick={() => setColorMode('gradient')}
            aria-pressed={colorMode === 'gradient'}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
              colorMode === 'gradient' ? 'bg-luxury-gold border-luxury-gold text-luxury-accent' : 'bg-luxury-dark border-gold-200/40 text-gray-400 hover:border-luxury-gold/60'
            }`}
          >
            Gradient
          </button>
        </div>

        {colorMode === 'solid' ? (
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-9 h-9 rounded-lg border border-gold-200/40 cursor-pointer p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[6px] [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-[6px] [&::-moz-color-swatch]:border-none"
              aria-label="Custom text color"
            />
            {['#ffffff', '#000000', '#D4AF37', '#FF5A5F', '#22C55E', '#3B82F6'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setTextColor(c)}
                className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform ${textColor === c ? 'border-luxury-gold scale-110' : 'border-gold-200/40'}`}
                style={{ backgroundColor: c }}
                aria-label={`Set color ${c}`}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {GRADIENT_PRESETS.map((g) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => {
                    setGradientFrom(g.from);
                    setGradientTo(g.to);
                  }}
                  className={`w-8 h-8 rounded-lg border-2 cursor-pointer transition-transform ${
                    gradientFrom === g.from && gradientTo === g.to ? 'border-luxury-gold scale-110' : 'border-gold-200/40'
                  }`}
                  style={{ backgroundImage: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                  aria-label={g.label}
                  title={g.label}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={gradientFrom}
                onChange={(e) => setGradientFrom(e.target.value)}
                className="w-9 h-9 rounded-lg border border-gold-200/40 cursor-pointer p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[6px] [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-[6px] [&::-moz-color-swatch]:border-none"
                aria-label="Gradient start color"
              />
              <span className="text-gray-500 text-xs">to</span>
              <input
                type="color"
                value={gradientTo}
                onChange={(e) => setGradientTo(e.target.value)}
                className="w-9 h-9 rounded-lg border border-gold-200/40 cursor-pointer p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[6px] [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-[6px] [&::-moz-color-swatch]:border-none"
                aria-label="Gradient end color"
              />
            </div>
          </div>
        )}

        {/* Live preview */}
        <div
          className="text-xl font-bold px-1"
          style={
            colorMode === 'gradient'
              ? {
                  backgroundImage: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }
              : { color: textColor }
          }
        >
          Aa Preview
        </div>
      </div>
    </div>
  );
}
