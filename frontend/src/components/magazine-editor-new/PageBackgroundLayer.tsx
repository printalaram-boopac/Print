import type { PageBackground } from '@/lib/magazine-editor-new/types';
import { resolveBaseCss, textureFor } from '@/lib/magazine-editor-new/pageBackground';

interface PageBackgroundLayerProps {
  background: PageBackground | undefined;
  isCoverLike: boolean;
  fallbackGradient: string;
  /** When provided, the background is inset by this much (as % of the page's
   * own box) so it visually extends through the print bleed region instead
   * of stopping at the trim edge (Step 8 §37–39). Thumbnails omit this. */
  bleedInset?: { xPct: number; yPct: number };
}

/**
 * The page background, rendered as its own fixed, non-interactive layer
 * behind every normal element — never a draggable/selectable object (Step 8
 * §29, §34–36). Shared between the real canvas and page thumbnails so both
 * stay visually identical.
 */
export default function PageBackgroundLayer({ background, isCoverLike, fallbackGradient, bleedInset }: PageBackgroundLayerProps) {
  const type = background?.type ?? 'none';
  const inset = bleedInset ? `-${bleedInset.yPct}% -${bleedInset.xPct}%` : 0;

  return (
    <div className="absolute pointer-events-none overflow-hidden" style={{ inset, background: resolveBaseCss(background, isCoverLike, fallbackGradient) }}>
      {type === 'image' && background?.image && (
        <>
          <div
            className="absolute inset-0"
            style={{
              opacity: (background.image.opacity ?? 100) / 100,
              filter: background.image.blur ? `blur(${background.image.blur}px)` : undefined,
              backgroundImage: `url("${background.image.src}")`,
              backgroundRepeat: 'no-repeat',
              ...(background.image.fit === 'fit'
                ? { backgroundSize: 'contain', backgroundPosition: 'center' }
                : { backgroundSize: `${100 * (background.image.zoom ?? 1)}%`, backgroundPosition: `${background.image.xPct ?? 50}% ${background.image.yPct ?? 50}%` }),
            }}
          />
          {background.image.overlayColor && (background.image.overlayOpacity ?? 0) > 0 && (
            <div className="absolute inset-0" style={{ background: background.image.overlayColor, opacity: (background.image.overlayOpacity ?? 0) / 100 }} />
          )}
        </>
      )}

      {type === 'texture' && background?.texture && (() => {
        const def = textureFor(background.texture.textureId);
        if (!def) return null;
        const size = def.tileSizePx * (background.texture.scale ?? 1);
        return (
          <div
            className="absolute inset-0"
            style={{
              opacity: (background.texture.opacity ?? 100) / 100,
              backgroundImage: `url("${def.src}")`,
              backgroundSize: `${size}px ${size}px`,
              backgroundRepeat: 'repeat',
            }}
          />
        );
      })()}
    </div>
  );
}
