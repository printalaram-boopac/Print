import { useEffect, useRef, useState } from 'react';
import type { TemplateElement, TemplateDimensions, TemplatePage } from '@/lib/magazine-editor-new/types';
import { getShapeMaskStyle, getFrameMaskStyle } from '@/lib/magazine-editor-new/shapeStyle';
import { iconFor } from '@/lib/magazine-editor-new/iconMap';
import { fontFamilyFor } from '@/lib/magazine/fonts';
import { mmInsetToPct, MARGIN_MM, BLEED_MM, SAFE_AREA_MM } from '@/lib/magazine-editor-new/printGuides';
import { TEXT_REFERENCE_WIDTH_PX, ROLE_FONT_PX } from '@/lib/magazine-editor-new/textMetrics';
import PageBackgroundLayer from './PageBackgroundLayer';

interface MiniPageThumbnailProps {
  page: TemplatePage;
  dimensions: TemplateDimensions;
  gradient: string;
  isCoverLike: boolean;
  /** Print-Preview-only guide overlays (Step 10 §30–32) — never passed by
   * ordinary thumbnails, so normal previews never show editor-only guides. */
  showBleed?: boolean;
  showTrimBoundary?: boolean;
  showSafeArea?: boolean;
  extendBleed?: boolean;
}

// EditableElement's real per-role font sizes at its own 480px-wide reference
// canvas (see textMetrics.ts) — every other rendering of a page (thumbnail,
// template preview, full Preview Mode, PDF/image export) derives its font
// size from this SAME ratio, so text is never re-tuned per call site.
const REFERENCE_WIDTH_PX = TEXT_REFERENCE_WIDTH_PX;

/**
 * A lightweight, non-interactive static render of a page's REAL elements —
 * no drag/resize/rotate handlers, no crop overlay, just plain absolutely-
 * positioned divs — used for Pages-panel thumbnails, template previews, AND
 * full-screen Preview Mode alike (one render path, per Step 10 §16). Font
 * size is derived from the container's own measured width via a
 * ResizeObserver, so the exact same component looks right whether it's
 * rendered at 40px or 900px wide.
 */
export default function MiniPageThumbnail({
  page, dimensions, gradient, isCoverLike, showBleed, showTrimBoundary, showSafeArea, extendBleed,
}: MiniPageThumbnailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [widthPx, setWidthPx] = useState(200);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidthPx(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = widthPx / REFERENCE_WIDTH_PX;
  const bleed = mmInsetToPct(BLEED_MM, dimensions);
  const margin = mmInsetToPct(MARGIN_MM, dimensions);
  const safeArea = mmInsetToPct(MARGIN_MM + SAFE_AREA_MM, dimensions);

  return (
    <div
      ref={ref}
      className="relative w-full h-full overflow-hidden"
      style={{ aspectRatio: `${dimensions.widthMm} / ${dimensions.heightMm}` }}
    >
      <PageBackgroundLayer
        background={page.background}
        isCoverLike={isCoverLike}
        fallbackGradient={gradient}
        bleedInset={extendBleed ? bleed : undefined}
      />

      {[...page.elements]
        .filter((el) => el.visible !== false)
        .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
        .map((el) => (
          <MiniElement key={el.id} el={el} isCoverLike={isCoverLike} scale={scale} />
        ))}

      {showBleed && (
        <div className="absolute pointer-events-none border border-red-400/60" style={{ inset: `-${bleed.yPct}% -${bleed.xPct}%` }} />
      )}
      {showTrimBoundary && (
        <div className="absolute inset-0 pointer-events-none border border-[#1C2024]/70" />
      )}
      {showSafeArea && (
        <div className="absolute pointer-events-none border border-dotted border-[#20272C]/60" style={{ inset: `${safeArea.yPct}% ${safeArea.xPct}%` }} />
      )}
      {showSafeArea && (
        <div className="absolute pointer-events-none border border-dashed border-[#B8895A]/50" style={{ inset: `${margin.yPct}% ${margin.xPct}%` }} />
      )}
    </div>
  );
}

function MiniElement({ el, isCoverLike, scale }: { el: TemplateElement; isCoverLike: boolean; scale: number }) {
  const left = el.xPct - el.widthPct / 2;
  const top = el.yPct - el.heightPct / 2;
  const opacity = (el.opacity ?? 100) / 100;

  return (
    <div
      className="absolute"
      style={{
        left: `${left}%`, top: `${top}%`, width: `${el.widthPct}%`, height: `${el.heightPct}%`,
        transform: `rotate(${el.rotationDeg ?? 0}deg)`, opacity,
      }}
    >
      {el.kind === 'image' && (
        <div className="w-full h-full overflow-hidden bg-[#EDEDEA]" style={getFrameMaskStyle(el.frameShape, el.borderRadius)}>
          {el.imgSrc && (
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${el.imgSrc})`,
                backgroundSize: `${100 * (el.cropZoom ?? 1)}%`,
                backgroundPosition: `${el.cropXPct ?? 50}% ${el.cropYPct ?? 50}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </div>
      )}

      {el.kind === 'shape' && (
        <div
          className="w-full h-full"
          style={{
            background: el.fill === 'none' ? 'transparent'
              : el.fill === 'dots' ? 'radial-gradient(#1C2024 1px, transparent 1.5px) 0 0 / 8px 8px'
              : el.fill === 'barcode' ? 'repeating-linear-gradient(90deg, #1C2024 0 2px, transparent 2px 5px)'
              : (el.fill ?? '#B8895A'),
            border: (el.borderWidth ?? 0) > 0 ? `${(el.borderWidth ?? 1) * scale}px ${el.borderStyle ?? 'solid'} ${el.borderColor ?? '#1C2024'}` : undefined,
            ...getShapeMaskStyle(el.shapeType, el.borderRadius),
          }}
        />
      )}

      {el.kind === 'line' && (
        <div className="w-full h-full flex items-center">
          <div className="w-full" style={{ borderTopWidth: Math.max(0.5, (el.strokeWidth ?? 2) * scale), borderTopStyle: el.lineStyle ?? 'solid', borderTopColor: el.borderColor ?? '#1C2024' }} />
        </div>
      )}

      {el.kind === 'icon' && (() => {
        const Icon = iconFor(el.iconName);
        return <Icon className="w-full h-full" style={{ color: el.iconColor ?? '#1C2024' }} strokeWidth={1.5} />;
      })()}

      {el.kind === 'text' && (
        <div
          className="w-full h-full flex overflow-hidden leading-tight px-0.5"
          style={{
            alignItems: el.textAlign === 'left' ? 'flex-start' : el.textAlign === 'right' ? 'flex-end' : 'center',
            justifyContent: el.textAlign === 'left' ? 'flex-start' : el.textAlign === 'right' ? 'flex-end' : 'center',
            textAlign: el.textAlign ?? 'center',
            background: el.badgeColor,
            color: el.color ?? (el.badgeColor ? '#FFFFFF' : (isCoverLike ? '#FFFFFF' : '#1C2024')),
            borderRadius: el.badgeColor ? `${(el.borderRadius ?? 20) * scale}px` : undefined,
            fontFamily: el.fontKey ? fontFamilyFor(el.fontKey) : (el.role === 'headline' ? fontFamilyFor('serif') : fontFamilyFor('condensed')),
            fontSize: el.fontSize ? Math.max(6, el.fontSize * scale) : (ROLE_FONT_PX[el.role ?? 'body'] ?? ROLE_FONT_PX.body) * scale,
            fontStyle: el.fontStyle ?? (el.role === 'headline' ? 'italic' : undefined),
            fontWeight: el.fontWeight ?? (el.role === 'kicker' || el.role === 'caption' || el.role === 'body' ? 600 : undefined),
            letterSpacing: el.letterSpacing ?? (el.role !== 'headline' ? '0.08em' : undefined),
            lineHeight: el.lineHeight ?? 1.25,
            textTransform: el.textTransform,
            whiteSpace: 'pre-line',
          }}
        >
          {el.content}
        </div>
      )}
    </div>
  );
}
