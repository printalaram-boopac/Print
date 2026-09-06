import type { TemplateElement } from './types';

export function elementDisplayName(el: TemplateElement): string {
  if (el.layerName) return el.layerName;
  switch (el.kind) {
    case 'text':
      return el.content ? (el.content.length > 20 ? `${el.content.slice(0, 20)}…` : el.content) : 'Text';
    case 'image':
      return el.frameShape ? `${el.frameShape[0].toUpperCase()}${el.frameShape.slice(1)} Frame` : (el.imgSrc ? 'Photo' : 'Empty Frame');
    case 'shape':
      return el.shapeType ? `${el.shapeType[0].toUpperCase()}${el.shapeType.slice(1).replace('-', ' ')}` : 'Shape';
    case 'line':
      return 'Line';
    case 'icon':
      return el.iconName ? el.iconName.replace(/([A-Z])/g, ' $1').trim() : 'Icon';
    default:
      return 'Element';
  }
}
