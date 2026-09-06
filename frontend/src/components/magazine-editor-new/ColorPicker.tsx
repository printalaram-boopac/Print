import { useState } from 'react';

const DOCUMENT_COLORS = [
  '#7D2AE8', // Canva Purple
  '#00C4CC', // Turquoise
  '#FF5263', // Coral
  '#FF9600', // Orange
  '#FFD13B', // Yellow
  '#00C853', // Emerald
  '#008BE3', // Sky Blue
  '#1C2024', // Obsidian
  '#FFFFFF', // Pure White
];

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #7D2AE8, #00C4CC)', // Purple to Cyan
  'linear-gradient(135deg, #FF5263, #FF9600)', // Sunset Glow
  'linear-gradient(135deg, #8B3DFF, #FF5263)', // Neon Fuchsia
  'linear-gradient(135deg, #008BE3, #00C4CC)', // Ocean Breeze
  'linear-gradient(135deg, #00C853, #008BE3)', // Fresh Spring
  'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728)', // Luxury Gold
  'linear-gradient(135deg, #1C2024, #7D2AE8)', // Cyber Dark
];

interface ColorPickerProps {
  value: string; // 'none' is a valid value where allowNone is true
  onChange: (value: string) => void;
  recentColors?: string[];
  allowNone?: boolean;
  label?: string;
  allowGradients?: boolean;
}

export default function ColorPicker({ value, onChange, recentColors = [], allowNone, label, allowGradients = true }: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [mode, setMode] = useState<'solid' | 'gradient'>('solid');
  const swatches = [...DOCUMENT_COLORS, ...recentColors.filter((c) => !DOCUMENT_COLORS.includes(c) && !c.includes('gradient'))].slice(0, 9);

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0 relative">
      {label && <span className="text-[11px] font-semibold text-[#5E6573] mr-0.5">{label}</span>}
      
      {allowNone && (
        <button
          type="button"
          onClick={() => onChange('none')}
          aria-label="No fill"
          title="No fill"
          className={`w-5 h-5 rounded-full border-2 cursor-pointer bg-[repeating-linear-gradient(45deg,#fff,#fff_2px,#f00_2px,#f00_3px)] transition-all ${value === 'none' ? 'ring-2 ring-[#8B3DFF] border-white scale-110 shadow-xs' : 'border-[#E7E7E4] hover:scale-105'}`}
        />
      )}

      {/* Mode Switcher if gradients allowed */}
      {allowGradients && (
        <div className="flex items-center gap-0.5 bg-[#F5F5F3] p-0.5 rounded-full mr-1">
          <button
            type="button"
            onClick={() => setMode('solid')}
            className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold transition-all cursor-pointer ${mode === 'solid' ? 'bg-white text-[#8B3DFF] shadow-xs' : 'text-[#6F7478]'}`}
          >
            Solid
          </button>
          <button
            type="button"
            onClick={() => setMode('gradient')}
            className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold transition-all cursor-pointer ${mode === 'gradient' ? 'bg-white text-[#8B3DFF] shadow-xs' : 'text-[#6F7478]'}`}
          >
            Gradient
          </button>
        </div>
      )}

      {/* Solid Color Swatches */}
      {mode === 'solid' && (
        <div className="flex items-center gap-1">
          {swatches.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              aria-label={`Color ${c}`}
              title={c}
              className={`w-5 h-5 rounded-full border border-black/10 cursor-pointer transition-all transform hover:scale-110 ${value === c ? 'ring-2 ring-[#8B3DFF] ring-offset-1 scale-110 shadow-xs' : ''}`}
              style={{ background: c }}
            />
          ))}
          <button
            type="button"
            onClick={() => setShowCustom((v) => !v)}
            aria-label="Custom color"
            title="Custom hex color"
            className="w-5 h-5 rounded-full border border-black/10 cursor-pointer flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}
          />
          {showCustom && (
            <input
              type="color"
              value={/^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#7D2AE8'}
              onChange={(e) => onChange(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border-0 p-0 ml-1"
            />
          )}
        </div>
      )}

      {/* Gradient Swatches */}
      {mode === 'gradient' && (
        <div className="flex items-center gap-1">
          {GRADIENT_PRESETS.map((g, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(g)}
              aria-label={`Gradient ${idx + 1}`}
              title={`Gradient ${idx + 1}`}
              className={`w-5 h-5 rounded-full border border-black/10 cursor-pointer transition-all transform hover:scale-110 ${value === g ? 'ring-2 ring-[#8B3DFF] ring-offset-1 scale-110 shadow-xs' : ''}`}
              style={{ background: g }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
