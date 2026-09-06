import { useMemo, useState, useRef } from 'react';
import { ImagePlus, RotateCw } from 'lucide-react';
import type { TemplateElement } from '@/lib/magazine-editor-new/types';
import { useElementTransform } from '@/lib/magazine/useElementTransform';
import { getShapeMaskStyle, getFrameMaskStyle, SHAPE_POLYGONS } from '@/lib/magazine-editor-new/shapeStyle';
import { iconFor } from '@/lib/magazine-editor-new/iconMap';
import { fontFamilyFor } from '@/lib/magazine/fonts';

interface EditableElementProps {
  element: TemplateElement;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selected: boolean;
  showHandles: boolean;
  onSelect: (e: React.PointerEvent) => void;
  onChange: (patch: Partial<TemplateElement>) => void;
  onCommit: () => void;
  isCoverLike: boolean;
  scale?: number;
}

/**
 * Renders + makes interactive ONE element of any kind (image/shape/line/icon/
 * text) — a single shared drag/resize/rotate implementation (useElementTransform)
 * for every type, per Step 5's "don't create separate movement code per type"
 * requirement. Only the inner content differs by `el.kind`.
 */
export default function EditableElement({ element: el, containerRef, selected, showHandles, onSelect, onChange, onCommit, isCoverLike, scale = 1 }: EditableElementProps) {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transformValue = useMemo(
    () => ({ xPct: el.xPct, yPct: el.yPct, widthPct: el.widthPct, heightPct: el.heightPct, rotationDeg: el.rotationDeg ?? 0 }),
    [el.xPct, el.yPct, el.widthPct, el.heightPct, el.rotationDeg],
  );

  const { onDragPointerDown, onResizePointerDown, onRotatePointerDown } = useElementTransform({
    containerRef,
    value: transformValue,
    onChange,
    onCommit,
  });

  const left = el.xPct - el.widthPct / 2;
  const top = el.yPct - el.heightPct / 2;
  const opacity = (el.opacity ?? 100) / 100;
  const flipScaleX = el.flipX ? -1 : 1;
  const flipScaleY = el.flipY ? -1 : 1;

  if (el.visible === false) return null;

  return (
    <div
      role="button"
      aria-label={`${el.kind[0].toUpperCase()}${el.kind.slice(1)} element`}
      onPointerDown={(e) => {
        if (isInlineEditing) return;
        e.stopPropagation();
        onSelect(e);
        if (!el.locked) onDragPointerDown(e);
      }}
      onDoubleClick={(e) => {
        if (el.kind === 'text') {
          e.stopPropagation();
          setIsInlineEditing(true);
        }
      }}
      className={`absolute touch-none select-none ${el.locked ? '' : 'cursor-move'} ${selected ? 'ring-2 ring-[#8B3DFF] shadow-sm' : ''}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${el.widthPct}%`,
        height: `${el.heightPct}%`,
        transform: `rotate(${el.rotationDeg ?? 0}deg)`,
        zIndex: selected ? 100 : el.zIndex ?? 0,
        opacity,
      }}
    >
      {el.kind === 'image' && (
        <div className="w-full h-full overflow-hidden" style={{ border: (el.borderWidth ?? 0) > 0 ? `${el.borderWidth}px solid ${el.borderColor ?? '#1C2024'}` : undefined, ...getFrameMaskStyle(el.frameShape, el.borderRadius) }}>
          {el.imgSrc ? (
            (el.fit ?? 'fill') === 'fill' ? (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${el.imgSrc})`,
                  backgroundSize: `${100 * (el.cropZoom ?? 1)}%`,
                  backgroundPosition: `${el.cropXPct ?? 50}% ${el.cropYPct ?? 50}%`,
                  backgroundRepeat: 'no-repeat',
                  transform: `scale(${flipScaleX}, ${flipScaleY})`,
                }}
              />
            ) : (
              <img src={el.imgSrc} alt="" draggable={false} className="w-full h-full pointer-events-none" style={{ objectFit: 'contain', transform: `scale(${flipScaleX}, ${flipScaleY})` }} />
            )
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center cursor-pointer group select-none shadow-xs"
              title="Click or drop photo here"
            >
              {/* Canva iconic scenic sky + clouds + green hills */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#8ed1f2] via-[#b3e5fc] to-[#dff3fd] pointer-events-none" />
              
              {/* Fluffy clouds */}
              <div className="absolute top-[12%] right-[15%] w-[24%] h-[12%] bg-white/80 rounded-full blur-[0.5px] pointer-events-none" />
              <div className="absolute top-[16%] right-[22%] w-[18%] h-[10%] bg-white/70 rounded-full blur-[0.5px] pointer-events-none" />
              <div className="absolute top-[20%] left-[18%] w-[20%] h-[10%] bg-white/75 rounded-full blur-[0.5px] pointer-events-none" />
              
              {/* Rolling green hills */}
              <div className="absolute -bottom-[20%] -left-[20%] w-[90%] h-[65%] bg-[#81c784] rounded-full pointer-events-none transform -rotate-6 shadow-xs" />
              <div className="absolute -bottom-[25%] -right-[20%] w-[95%] h-[70%] bg-[#66bb6a] rounded-full pointer-events-none transform rotate-3 shadow-xs" />
              <div className="absolute -bottom-[35%] left-[25%] w-[80%] h-[60%] bg-[#4caf50] rounded-full pointer-events-none transform rotate-12" />

              {/* Upload Badge / Prompt Overlay */}
              <div className="relative z-10 flex flex-col items-center justify-center p-2 rounded-xl bg-white/85 backdrop-blur-xs border border-white/60 shadow-sm group-hover:scale-105 group-hover:bg-white/95 transition-all max-w-[85%]">
                <ImagePlus className="w-5 h-5 text-[#8B3DFF] group-hover:text-[#7D2AE8] transition-colors" strokeWidth={1.8} />
                <span className="text-[10px] text-[#1C2024] font-semibold text-center mt-0.5 leading-tight">Add photo</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const url = URL.createObjectURL(f);
                    onChange({ imgSrc: url });
                    onCommit();
                  }
                  e.target.value = '';
                }}
              />
            </div>
          )}
        </div>
      )}

      {el.kind === 'shape' && el.shapeType === 'sticky-note' && (
        <div
          className="w-full h-full relative p-3 rounded-xs shadow-md transition-shadow select-none flex flex-col overflow-hidden"
          style={{
            backgroundColor: el.fill === 'none' ? '#FEF08A' : (el.fill ?? '#FEF08A'),
            color: el.color ?? '#1C2024',
            fontFamily: el.fontKey ? fontFamilyFor(el.fontKey) : fontFamilyFor('hand'),
          }}
        >
          <div
            className="absolute bottom-0 right-0 w-0 h-0 pointer-events-none"
            style={{
              borderStyle: 'solid',
              borderWidth: '0 0 16px 16px',
              borderColor: `transparent transparent #D1D5DB rgba(0,0,0,0.15)`,
              boxShadow: '-1px -1px 3px rgba(0,0,0,0.1)',
            }}
          />
          <div className="flex-1 text-sm font-medium whitespace-pre-line leading-snug">
            {el.content || 'Write a note...'}
          </div>
        </div>
      )}

      {el.kind === 'shape' && el.shapeType === 'table' && (() => {
        let cells: string[][] = [
          ['Header 1', 'Header 2', 'Header 3'],
          ['Item A', '10', '$25.00'],
          ['Item B', '20', '$50.00'],
        ];
        try {
          if (el.content) {
            const parsed = JSON.parse(el.content);
            if (Array.isArray(parsed) && parsed.length > 0) cells = parsed;
          }
        } catch {}
        return (
          <div className="w-full h-full bg-white border border-[#E7E7E4] rounded-lg shadow-xs overflow-hidden flex flex-col text-[11px] select-none">
            <table className="w-full h-full border-collapse">
              <tbody>
                {cells.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx === 0 ? 'bg-[#F9FAFB] font-semibold text-[#111827]' : 'border-t border-[#E7E7E4]'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-1.5 border-r border-[#E7E7E4] last:border-r-0 text-center truncate">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}

      {el.kind === 'shape' && el.shapeType === 'heart' && (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible pointer-events-none"
          preserveAspectRatio="none"
        >
          <path
            d="M 50 96 C 32 78, 3 56, 3 35 C 3 16, 14 4, 27 4 C 39 4, 47 9, 50 16 C 53 9, 61 4, 73 4 C 86 4, 97 16, 97 35 C 97 56, 68 78, 50 96 Z"
            fill={el.fill === 'none' ? 'transparent' : (el.fill ?? '#EF4444')}
            stroke={(el.borderWidth ?? 0) > 0 ? (el.borderColor ?? '#1C2024') : 'none'}
            strokeWidth={el.borderWidth ?? 0}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={
              el.borderStyle === 'dashed' ? '8 4'
              : el.borderStyle === 'dotted' ? '3 3'
              : undefined
            }
          />
        </svg>
      )}

      {el.kind === 'shape' && el.shapeType !== 'sticky-note' && el.shapeType !== 'table' && el.shapeType !== 'heart' && (
        <div className="w-full h-full relative">
          <div
            className="w-full h-full"
            style={{
              background: el.fill === 'none' ? 'transparent'
                : el.fill === 'dots' ? 'radial-gradient(#1C2024 1px, transparent 1.5px) 0 0 / 8px 8px'
                : el.fill === 'barcode' ? 'repeating-linear-gradient(90deg, #1C2024 0 2px, transparent 2px 5px)'
                : (el.fill ?? '#B8895A'),
              border: (el.shapeType === 'rectangle' || el.shapeType === 'square' || el.shapeType === 'rounded-rectangle' || el.shapeType === 'circle' || el.shapeType === 'pill' || el.shapeType === 'arch') && (el.borderWidth ?? 0) > 0
                ? `${el.borderWidth}px ${el.borderStyle ?? 'solid'} ${el.borderColor ?? '#1C2024'}`
                : undefined,
              ...getShapeMaskStyle(el.shapeType, el.borderRadius),
            }}
          />
          {(el.borderWidth ?? 0) > 0 && el.shapeType && SHAPE_POLYGONS[el.shapeType] && (
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
              preserveAspectRatio="none"
            >
              <polygon
                points={SHAPE_POLYGONS[el.shapeType]!.map(([x, y]) => `${x},${y}`).join(' ')}
                fill="none"
                stroke={el.borderColor ?? '#1C2024'}
                strokeWidth={el.borderWidth}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={
                  el.borderStyle === 'dashed' ? '8 4'
                  : el.borderStyle === 'dotted' ? '3 3'
                  : undefined
                }
              />
            </svg>
          )}
        </div>
      )}

      {el.kind === 'line' && (
        el.svgPath ? (
          <svg className="w-full h-full overflow-visible pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d={el.svgPath}
              fill="none"
              stroke={el.borderColor ?? el.color ?? '#EF4444'}
              strokeWidth={el.strokeWidth ?? 3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <div className="w-full h-full relative flex items-center">
            <div
              className="w-full"
              style={{ borderTopWidth: Math.max(1, el.strokeWidth ?? 2), borderTopStyle: el.lineStyle ?? 'solid', borderTopColor: el.borderColor ?? '#1C2024' }}
            />
            {el.arrowStart && (
              <div className="absolute left-0 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: `8px solid ${el.borderColor ?? '#1C2024'}` }} />
            )}
            {el.arrowEnd && (
              <div className="absolute right-0 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `8px solid ${el.borderColor ?? '#1C2024'}` }} />
            )}
          </div>
        )
      )}

      {el.kind === 'icon' && (() => {
        const Icon = iconFor(el.iconName);
        return <Icon className="w-full h-full" style={{ color: el.iconColor ?? '#1C2024', transform: `scale(${flipScaleX}, ${flipScaleY})` }} strokeWidth={1.5} />;
      })()}

      {el.kind === 'text' && (() => {
        const effectiveColor = el.color ?? (el.badgeColor ? '#FFFFFF' : (isCoverLike ? '#FFFFFF' : '#1C2024'));
        const effectiveFamily = el.fontKey ? fontFamilyFor(el.fontKey) : (el.role === 'headline' ? fontFamilyFor('serif') : fontFamilyFor('condensed'));
        const effectiveStyle = el.fontStyle ?? (el.role === 'headline' ? 'italic' : 'normal');
        const effectiveWeight = el.fontWeight ?? (el.role === 'headline' ? 700 : (el.role === 'kicker' || el.role === 'caption' ? 600 : 400));

        const baseFontSize = el.fontSize ?? (el.role === 'headline' ? 28 : el.role === 'subheading' ? 16 : el.role === 'kicker' ? 10 : 12);
        const effectiveFontSize = Math.max(7, Math.round(baseFontSize * scale));

        return isInlineEditing ? (
          <textarea
            autoFocus
            value={el.content ?? ''}
            onChange={(e) => onChange({ content: e.target.value })}
            onBlur={() => {
              setIsInlineEditing(false);
              onCommit();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || (e.key === 'Enter' && !e.shiftKey)) {
                e.preventDefault();
                setIsInlineEditing(false);
                onCommit();
              }
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full h-full bg-white/95 backdrop-blur-xs resize-none border-2 border-[#8B3DFF] rounded outline-none p-1 text-sm font-medium focus:ring-2 focus:ring-[#8B3DFF]/30 shadow-lg"
            style={{
              fontFamily: effectiveFamily,
              color: effectiveColor,
              textAlign: el.textAlign ?? 'center',
              fontSize: `${effectiveFontSize}px`,
              lineHeight: el.lineHeight ?? 1.2,
              letterSpacing: el.letterSpacing,
              fontWeight: effectiveWeight,
              fontStyle: effectiveStyle,
              textTransform: el.textTransform,
            }}
          />
        ) : (
          <div
            className="w-full h-full flex px-1"
            style={{
              alignItems: el.textAlign === 'left' ? 'flex-start' : el.textAlign === 'right' ? 'flex-end' : 'center',
              justifyContent: el.textAlign === 'left' ? 'flex-start' : el.textAlign === 'right' ? 'flex-end' : 'center',
              textAlign: el.textAlign ?? 'center',
              background: el.badgeColor,
              color: effectiveColor,
              borderRadius: el.badgeColor ? `${el.borderRadius ?? 20}px` : undefined,
              fontFamily: effectiveFamily,
            }}
          >
            {el.fontSize ? (
              <span
                style={{
                  fontSize: `${effectiveFontSize}px`,
                  fontFamily: effectiveFamily,
                  fontWeight: effectiveWeight,
                  fontStyle: effectiveStyle,
                  letterSpacing: el.letterSpacing,
                  lineHeight: el.lineHeight ?? 1.25,
                  textTransform: el.textTransform,
                  textAlign: el.textAlign ?? 'center',
                  color: effectiveColor,
                  whiteSpace: 'pre-line',
                }}
              >
                {el.content}
              </span>
            ) : (
              <>
                {el.role === 'kicker' && (
                  <span
                    className="tracking-[0.25em]"
                    style={{ fontSize: `${effectiveFontSize}px`, fontWeight: effectiveWeight, fontStyle: effectiveStyle, color: effectiveColor, textTransform: el.textTransform }}
                  >
                    {el.content}
                  </span>
                )}
                {el.role === 'headline' && (
                  <h3
                    className="leading-none"
                    style={{
                      fontSize: `${effectiveFontSize}px`,
                      fontFamily: effectiveFamily,
                      fontStyle: effectiveStyle,
                      fontWeight: effectiveWeight,
                      color: effectiveColor,
                      textTransform: el.textTransform,
                    }}
                  >
                    {el.content}
                  </h3>
                )}
                {el.role === 'subheading' && (
                  <span
                    className="tracking-[0.3em]"
                    style={{ fontSize: `${effectiveFontSize}px`, fontWeight: effectiveWeight, fontStyle: effectiveStyle, color: effectiveColor, textTransform: el.textTransform }}
                  >
                    {el.content}
                  </span>
                )}
                {(el.role === 'caption' || el.role === 'body' || !el.role) && (
                  <span
                    className="tracking-widest whitespace-pre-line"
                    style={{ fontSize: `${effectiveFontSize}px`, fontWeight: effectiveWeight, fontStyle: effectiveStyle, color: effectiveColor, textTransform: el.textTransform }}
                  >
                    {el.content}
                  </span>
                )}
              </>
            )}
          </div>
        );
      })()}

      {selected && showHandles && !el.locked && (
        <>
          <div
            role="button"
            aria-label="Resize element"
            onPointerDown={(e) => { e.stopPropagation(); onResizePointerDown(e); }}
            className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-[#8B3DFF] border-2 border-white cursor-se-resize touch-none flex items-center justify-center shadow-md hover:scale-110 active:scale-125 transition-transform"
          />
          <div
            role="button"
            aria-label="Rotate element"
            onPointerDown={(e) => { e.stopPropagation(); onRotatePointerDown(e); }}
            className="absolute -top-7 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#8B3DFF] border-2 border-white cursor-grab flex items-center justify-center touch-none shadow-md hover:scale-110 active:scale-125 transition-transform"
          >
            <RotateCw className="w-3 h-3 text-white" strokeWidth={2.5} />
          </div>
        </>
      )}
    </div>
  );
}
