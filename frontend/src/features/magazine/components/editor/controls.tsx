import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { COLOR_SWATCHES } from '../../constants';
import { fontStack, groupedFonts } from '../../fonts';

/**
 * Small form controls shared by the editor panels.
 *
 * They intentionally use the site's own tokens — ivory surfaces, plum ink, gold
 * accents, pill radii — so the editor reads as part of the website rather than
 * a bolted-on tool.
 */

export function PanelSection({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{children}</span>;
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-1 rounded-lg border border-gold-200/50 bg-white px-2.5 py-1.5 focus-within:border-luxury-gold">
        <input
          type="number"
          value={Number.isFinite(value) ? Math.round(value * 100) / 100 : 0}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isFinite(next)) onChange(next);
          }}
          className="w-full bg-transparent text-xs font-medium text-luxury-accent outline-none"
        />
        {suffix && <span className="text-[10px] text-gray-300">{suffix}</span>}
      </div>
    </label>
  );
}

export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  onCommitStart,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Fired on pointer-down so a whole drag becomes one undo step. */
  onCommitStart?: () => void;
  format?: (value: number) => string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <FieldLabel>{label}</FieldLabel>
        <span className="text-[10px] font-semibold text-luxury-accent">
          {format ? format(value) : Math.round(value * 100) / 100}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onPointerDown={onCommitStart}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-luxury-gray accent-luxury-gold"
      />
    </label>
  );
}

export function ColorField({
  label,
  value,
  onChange,
  allowTransparent = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  allowTransparent?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const isTransparent = value === 'transparent';

  return (
    <div className="relative flex flex-col gap-1.5" ref={ref}>
      <FieldLabel>{label}</FieldLabel>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-gold-200/50 bg-white px-2 py-1.5 text-left transition-colors hover:border-luxury-gold"
      >
        <span
          className="h-5 w-5 shrink-0 rounded border border-black/10"
          style={
            isTransparent
              ? {
                  backgroundImage:
                    'linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%),linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%)',
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 4px 4px',
                }
              : { background: value }
          }
        />
        <span className="flex-1 truncate text-[11px] font-medium uppercase text-luxury-accent">
          {isTransparent ? 'None' : value}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-gold-200/60 bg-white p-3 shadow-xl">
          <div className="grid grid-cols-6 gap-1.5">
            {allowTransparent && (
              <button
                type="button"
                onClick={() => onChange('transparent')}
                title="No fill"
                className={`h-6 w-6 rounded border ${isTransparent ? 'border-luxury-gold ring-2 ring-luxury-gold/40' : 'border-black/10'}`}
                style={{
                  backgroundImage:
                    'linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%),linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%)',
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 4px 4px',
                }}
              />
            )}
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => onChange(swatch)}
                title={swatch}
                className={`flex h-6 w-6 items-center justify-center rounded border transition-transform hover:scale-110 ${
                  value.toLowerCase() === swatch.toLowerCase()
                    ? 'border-luxury-gold ring-2 ring-luxury-gold/40'
                    : 'border-black/10'
                }`}
                style={{ background: swatch }}
              >
                {value.toLowerCase() === swatch.toLowerCase() && (
                  <Check className="h-3 w-3" style={{ color: '#fff', mixBlendMode: 'difference' }} />
                )}
              </button>
            ))}
          </div>

          <label className="mt-3 flex items-center gap-2 border-t border-gold-200/40 pt-3">
            <input
              type="color"
              value={isTransparent ? '#ffffff' : value}
              onChange={(e) => onChange(e.target.value)}
              className="h-7 w-9 cursor-pointer rounded border border-gold-200/50 bg-white"
              aria-label={`${label} custom colour`}
            />
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Custom</span>
          </label>
        </div>
      )}
    </div>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer rounded-lg border border-gold-200/50 bg-white px-2.5 py-1.5 text-xs font-medium text-luxury-accent outline-none focus:border-luxury-gold"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FontPicker({ value, onChange }: { value: string; onChange: (family: string) => void }) {
  const groups = groupedFonts();
  return (
    <label className="flex flex-col gap-1.5">
      <FieldLabel>Font</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontFamily: fontStack(value) }}
        className="cursor-pointer rounded-lg border border-gold-200/50 bg-white px-2.5 py-2 text-sm text-luxury-accent outline-none focus:border-luxury-gold"
      >
        {groups.map((group) => (
          <optgroup key={group.group} label={group.group}>
            {group.fonts.map((font) => (
              <option key={font.family} value={font.family} style={{ fontFamily: fontStack(font.family) }}>
                {font.family}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: T;
  options: { value: T; label: ReactNode; title?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="flex items-center gap-1 rounded-lg border border-gold-200/50 bg-white p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            title={option.title}
            onClick={() => onChange(option.value)}
            className={`flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors ${
              value === option.value
                ? 'bg-luxury-accent text-white'
                : 'text-gray-400 hover:bg-luxury-gray hover:text-luxury-accent'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PanelButton({
  onClick,
  children,
  icon,
  tone = 'default',
}: {
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  tone?: 'default' | 'danger';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
        tone === 'danger'
          ? 'border-red-200 bg-red-50/60 text-red-600 hover:bg-red-100'
          : 'border-gold-200/50 bg-white text-luxury-accent hover:border-luxury-gold hover:bg-amber-50/60'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
