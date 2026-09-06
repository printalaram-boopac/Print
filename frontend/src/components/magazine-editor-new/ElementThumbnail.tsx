import { ImagePlus } from 'lucide-react';
import type { ElementLibraryItem } from '@/lib/magazine-editor-new/types';
import { getShapeMaskStyle, getFrameMaskStyle } from '@/lib/magazine-editor-new/shapeStyle';
import { iconFor } from '@/lib/magazine-editor-new/iconMap';

const INK = '#1C2024';

export default function ElementThumbnail({ item }: { item: ElementLibraryItem }) {
  if (item.category === 'Grids') {
    const elements = item.create();
    return (
      <div className="w-full h-full p-1 bg-[#F8F9FA] rounded-md">
        <div className="relative w-full h-full bg-white rounded border border-[#E0E2E7] overflow-hidden">
          {elements.map((el) => {
            const left = `${Math.max(0, el.xPct - el.widthPct / 2)}%`;
            const top = `${Math.max(0, el.yPct - el.heightPct / 2)}%`;
            const width = `${Math.min(100, el.widthPct)}%`;
            const height = `${Math.min(100, el.heightPct)}%`;

            return (
              <div
                key={el.id}
                className="absolute overflow-hidden border-[0.5px] border-white/80"
                style={{
                  left,
                  top,
                  width,
                  height,
                  borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined,
                }}
              >
                {/* Canva scenic grid cell: sky, cloud, hills */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#8ed1f2] to-[#b3e5fc]" />
                <div className="absolute -bottom-1 -left-1 w-6 h-4 bg-[#81c784] rounded-full" />
                <div className="absolute -bottom-1 -right-1 w-6 h-5 bg-[#66bb6a] rounded-full" />
                <div className="absolute top-0.5 right-0.5 w-2 h-1 bg-white/70 rounded-full" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (item.type === 'shape') {
    const preview = item.create()[0];
    const fillValue = preview.fill === 'none' ? 'transparent'
      : preview.fill === 'dots' ? 'radial-gradient(#8B3DFF 1.5px, transparent 1.5px) 0 0 / 6px 6px'
      : preview.fill === 'barcode' ? 'repeating-linear-gradient(90deg, #1C2024 0 2px, transparent 2px 4px)'
      : (preview.fill ?? '#8B3DFF');

    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA] rounded-md p-1.5">
        <div
          className="w-full h-full shadow-xs"
          style={{
            background: fillValue,
            border: preview.fill === 'none' ? `2px solid ${preview.borderColor ?? '#1C2024'}` : undefined,
            ...getShapeMaskStyle(preview.shapeType, preview.borderRadius),
          }}
        />
      </div>
    );
  }

  if (item.type === 'line') {
    const preview = item.create()[0];
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA] rounded-md px-2">
        <div
          className="w-full"
          style={{
            borderTopWidth: Math.max(1.5, preview.strokeWidth ?? 2),
            borderTopStyle: preview.lineStyle ?? 'solid',
            borderTopColor: preview.borderColor ?? '#1C2024',
          }}
        />
      </div>
    );
  }

  if (item.type === 'icon') {
    const preview = item.create()[0];
    const Icon = iconFor(preview.iconName);
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA] rounded-md">
        <Icon className="w-5 h-5" style={{ color: preview.iconColor ?? '#1C2024' }} strokeWidth={1.75} />
      </div>
    );
  }

  if (item.type === 'image') {
    const preview = item.create()[0];
    if (preview.imgSrc) {
      const isGraphic = preview.fit === 'fit' || !item.tags.includes('photo');
      return (
        <div className="w-full h-full bg-[#F8F9FA] rounded-md overflow-hidden relative flex items-center justify-center p-1.5">
          <img
            src={preview.imgSrc}
            alt={item.name}
            className={`w-full h-full ${isGraphic ? 'object-contain' : 'object-cover'}`}
          />
        </div>
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA] rounded-md p-1.5 overflow-hidden">
        <div
          className="w-full h-full overflow-hidden relative shadow-xs flex items-center justify-center"
          style={getFrameMaskStyle(preview.frameShape, preview.borderRadius)}
        >
          {/* Canva classic frame graphic: blue sky + green hill + cloud */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#8ed1f2] to-[#b3e5fc]" />
          <div className="absolute -bottom-2 -left-2 w-8 h-6 bg-[#81c784] rounded-full" />
          <div className="absolute -bottom-3 -right-2 w-8 h-7 bg-[#66bb6a] rounded-full" />
          <div className="absolute top-1 right-1.5 w-3 h-1.5 bg-white/80 rounded-full" />
          <ImagePlus className="w-3.5 h-3.5 text-white/95 relative z-10 drop-shadow-sm" strokeWidth={2} />
        </div>
      </div>
    );
  }

  // text presets (Decorative/Magazine/Canva Luxury)
  const preview = item.create()[0];
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA] rounded-md p-1 overflow-hidden">
      <span
        className="text-[9.5px] font-bold text-center leading-tight px-1.5 py-0.5 rounded-full truncate shadow-xs max-w-full"
        style={{
          background: preview.badgeColor ?? 'transparent',
          color: preview.badgeColor ? '#FFFFFF' : (preview.color ?? INK),
          fontFamily: preview.fontKey === 'serif' ? 'Playfair Display, serif' : undefined,
        }}
      >
        {preview.content}
      </span>
    </div>
  );
}
