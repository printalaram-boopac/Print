import { memo } from 'react';
import type { ImageElement } from '../../types';

interface ImageElementViewProps {
  element: ImageElement;
  /** Hides the "add photo" affordance in previews and exports. */
  showPlaceholderLabel?: boolean;
}

/**
 * Renders an image frame. An empty frame paints its placeholder gradient so a
 * template still reads as a designed layout before any photo is dropped in —
 * the slot itself always stays a real, replaceable image element.
 */
function ImageElementViewBase({ element, showPlaceholderLabel = true }: ImageElementViewProps) {
  const { placeholder } = element;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: element.borderRadius,
        position: 'relative',
        background: element.src
          ? 'transparent'
          : `linear-gradient(${placeholder.angle ?? 135}deg, ${placeholder.from}, ${placeholder.to})`,
      }}
    >
      {element.src ? (
        <img
          src={element.src}
          alt={element.label || ''}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: element.fit,
            // Pan/zoom happen inside the frame so the frame geometry — and
            // therefore the page layout — never changes when cropping.
            transform: `translate(${element.offsetX}%, ${element.offsetY}%) scale(${element.zoom})`,
            transformOrigin: 'center',
            display: 'block',
            userSelect: 'none',
          }}
        />
      ) : (
        showPlaceholderLabel &&
        element.label && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'rgba(0,0,0,0.42)',
              mixBlendMode: 'multiply',
            }}
          >
            {element.label}
          </div>
        )
      )}

      {element.tint && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: element.tint,
            opacity: element.tintOpacity ?? 0.25,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

export const ImageElementView = memo(ImageElementViewBase);
