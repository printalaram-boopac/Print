import { memo, type CSSProperties } from 'react';
import type { ShapeElement } from '../../types';

interface ShapeElementViewProps {
  element: ShapeElement;
}

/** Renders rectangles, ellipses, rules and triangles as editable shapes. */
function ShapeElementViewBase({ element }: ShapeElementViewProps) {
  const base: CSSProperties = {
    width: '100%',
    height: '100%',
    background: element.fill,
  };

  if (element.strokeWidth > 0 && element.stroke !== 'transparent') {
    base.border = `${element.strokeWidth}px solid ${element.stroke}`;
    base.boxSizing = 'border-box';
  }

  switch (element.shape) {
    case 'ellipse':
      return <div style={{ ...base, borderRadius: '50%' }} />;
    case 'triangle':
      // clip-path keeps the triangle a live shape: fill, stroke colour and
      // geometry all stay editable, unlike a flattened image.
      return <div style={{ ...base, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', border: undefined }} />;
    case 'line':
      return <div style={{ ...base, borderRadius: element.borderRadius, border: undefined }} />;
    case 'rect':
    default:
      return <div style={{ ...base, borderRadius: element.borderRadius }} />;
  }
}

export const ShapeElementView = memo(ShapeElementViewBase);
