interface TemplateCoverMockupProps {
  gradient: string;
  title: string;
  subtitle?: string;
  kicker?: string;
  compact?: boolean;
}

/** Shared "editorial cover" render used for template thumbnails, previews,
 * page panel thumbnails, and the main canvas cover page — one visual language
 * everywhere a cover mockup shows up, stands in for real cover photography. */
export default function TemplateCoverMockup({ gradient, title, subtitle, kicker, compact }: TemplateCoverMockupProps) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: gradient }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)' }} />
      <div className={`absolute inset-0 flex flex-col items-center text-white text-center px-2 ${compact ? 'top-[18%] justify-start' : 'top-[10%] justify-start'}`}>
        {kicker && <span className={compact ? 'text-[6px] font-semibold tracking-[0.2em]' : 'text-[10px] font-semibold tracking-[0.25em]'}>{kicker}</span>}
        <h3
          className={compact ? 'mt-1 text-[15px] leading-tight italic' : 'mt-3 text-[40px] leading-none italic'}
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          {title}
        </h3>
        {subtitle && <span className={compact ? 'mt-1 text-[6px] font-medium tracking-[0.2em] text-white/85' : 'mt-3 text-[9px] font-medium tracking-[0.3em] text-white/85'}>{subtitle}</span>}
      </div>
    </div>
  );
}
