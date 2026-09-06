import { useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import type { BackgroundImageData, TemplateElement, TemplatePage, TemplateDimensions } from '@/lib/magazine-editor-new/types';
import { mmInsetToPct, MARGIN_MM, BLEED_MM, SAFE_AREA_MM } from '@/lib/magazine-editor-new/printGuides';
import EditableElement from './EditableElement';
import CropOverlay from './CropOverlay';
import PageBackgroundLayer from './PageBackgroundLayer';
import BackgroundCropOverlay from './BackgroundCropOverlay';

export interface ViewSettings {
  showMargins: boolean;
  showBleed: boolean;
  showSafeArea: boolean;
  showGrid: boolean;
}

export interface PageNumberOverlay {
  label: string;
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  fontFamily: string;
  fontSize: number;
  color: string;
}

interface MagazineCanvasProps {
  page: TemplatePage;
  dimensions: TemplateDimensions;
  gradient: string;
  selectedIds: string[];
  onSelectElement: (id: string, e: React.PointerEvent) => void;
  onDeselect: () => void;
  onChangeElement: (id: string, patch: Partial<TemplateElement>) => void;
  onCommitElement: () => void;
  cropElementId: string | null;
  onCropChange: (patch: Partial<TemplateElement>) => void;
  onCropDone: () => void;
  onCropCancel: () => void;
  view: ViewSettings;
  width?: number;
  locked?: boolean;
  interactive?: boolean;
  pageNumber?: PageNumberOverlay | null;
  backgroundCropActive?: boolean;
  onBackgroundCropChange?: (patch: Partial<BackgroundImageData>) => void;
  onBackgroundCropDone?: () => void;
  onBackgroundCropCancel?: () => void;
  drawingMode?: 'select' | 'pen' | 'signature' | null;
  drawStrokeColor?: string;
  drawStrokeWidth?: number;
  drawIsHighlighter?: boolean;
  onFinishDrawStroke?: (element: TemplateElement) => void;
}

const POSITION_STYLE: Record<PageNumberOverlay['position'], React.CSSProperties> = {
  'top-left': { top: '4%', left: '6%' },
  'top-center': { top: '4%', left: '50%', transform: 'translateX(-50%)' },
  'top-right': { top: '4%', right: '6%' },
  'bottom-left': { bottom: '4%', left: '6%' },
  'bottom-center': { bottom: '4%', left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { bottom: '4%', right: '6%' },
};

export default function MagazineCanvas({
  page, dimensions, gradient, selectedIds, onSelectElement, onDeselect, onChangeElement, onCommitElement,
  cropElementId, onCropChange, onCropDone, onCropCancel, view, width = 480, locked, interactive = true, pageNumber,
  backgroundCropActive, onBackgroundCropChange, onBackgroundCropDone, onBackgroundCropCancel,
  drawingMode, drawStrokeColor = '#EF4444', drawStrokeWidth = 3, drawIsHighlighter = false, onFinishDrawStroke,
}: MagazineCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cropElement = cropElementId ? page.elements.find((e) => e.id === cropElementId) ?? null : null;
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const isDrawingActive = (drawingMode === 'pen' || drawingMode === 'signature') && !locked && interactive;

  const isCoverLike = page.kind === 'cover' || page.kind === 'back-cover';
  const margin = mmInsetToPct(MARGIN_MM, dimensions);
  const bleed = mmInsetToPct(BLEED_MM, dimensions);
  const safeArea = mmInsetToPct(MARGIN_MM + SAFE_AREA_MM, dimensions);
  const gridSizePct = mmInsetToPct(10, dimensions);

  return (
    <div
      ref={containerRef}
      onPointerDown={interactive ? onDeselect : undefined}
      className={`relative flex-shrink-0 rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] overflow-visible select-none ${!interactive ? 'opacity-90' : ''}`}
      style={{ width, maxWidth: '100%', aspectRatio: `${dimensions.widthMm} / ${dimensions.heightMm}` }}
    >
      <PageBackgroundLayer background={page.background} isCoverLike={isCoverLike} fallbackGradient={gradient} bleedInset={bleed} />

      {isCoverLike && (
        <div className="absolute inset-0 pointer-events-none rounded-sm overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)' }} />
      )}

      {view.showBleed && (
        <div className="absolute pointer-events-none border border-red-400/50" style={{ inset: `-${bleed.yPct}% -${bleed.xPct}%` }} />
      )}
      {view.showGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: 'linear-gradient(#D6D6D2 1px, transparent 1px), linear-gradient(90deg, #D6D6D2 1px, transparent 1px)', backgroundSize: `${gridSizePct.xPct}% ${gridSizePct.yPct}%` }}
        />
      )}
      {view.showMargins && (
        <div className="absolute pointer-events-none border border-dashed border-[#B8895A]/60" style={{ inset: `${margin.yPct}% ${margin.xPct}%` }} />
      )}
      {view.showSafeArea && (
        <div className="absolute pointer-events-none border border-dotted border-[#20272C]/50" style={{ inset: `${safeArea.yPct}% ${safeArea.xPct}%` }} />
      )}

      {[...page.elements]
        .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
        .map((el) => (
          <EditableElement
            key={el.id}
            element={el}
            containerRef={containerRef}
            selected={selectedIds.includes(el.id)}
            showHandles={selectedIds.length === 1 && selectedIds[0] === el.id}
            onSelect={(e) => onSelectElement(el.id, e)}
            onChange={(patch) => onChangeElement(el.id, patch)}
            onCommit={onCommitElement}
            isCoverLike={isCoverLike}
          />
        ))}

      {cropElement && (
        <CropOverlay element={cropElement} onChange={onCropChange} onDone={onCropDone} onCancel={onCropCancel} />
      )}

      {backgroundCropActive && page.background?.image && onBackgroundCropChange && onBackgroundCropDone && onBackgroundCropCancel && (
        <BackgroundCropOverlay
          image={page.background.image}
          onChange={onBackgroundCropChange}
          onDone={onBackgroundCropDone}
          onCancel={onBackgroundCropCancel}
        />
      )}

      {pageNumber && (
        <div
          className="absolute pointer-events-none select-none"
          style={{ ...POSITION_STYLE[pageNumber.position], fontFamily: pageNumber.fontFamily, fontSize: pageNumber.fontSize, color: pageNumber.color }}
        >
          {pageNumber.label}
        </div>
      )}

      {/* Interactive Freehand Drawing Surface */}
      {isDrawingActive && (
        <div
          className="absolute inset-0 z-30 cursor-crosshair touch-none select-none"
          onPointerDown={(e) => {
            e.stopPropagation();
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            setCurrentPoints([pt]);
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (currentPoints.length === 0 || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            setCurrentPoints((prev) => [...prev, pt]);
          }}
          onPointerUp={() => {
            if (currentPoints.length >= 2 && containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              const cW = rect.width;
              const cH = rect.height;
              const xs = currentPoints.map((p) => p.x);
              const ys = currentPoints.map((p) => p.y);
              const minX = Math.min(...xs);
              const maxX = Math.max(...xs);
              const minY = Math.min(...ys);
              const maxY = Math.max(...ys);
              const boxW = Math.max(16, maxX - minX);
              const boxH = Math.max(16, maxY - minY);
              const midX = (minX + maxX) / 2;
              const midY = (minY + maxY) / 2;

              const xPct = Math.max(0, Math.min(100, (midX / cW) * 100));
              const yPct = Math.max(0, Math.min(100, (midY / cH) * 100));
              const widthPct = Math.max(3, Math.min(100, (boxW / cW) * 100));
              const heightPct = Math.max(3, Math.min(100, (boxH / cH) * 100));

              const strokeSvgPath = currentPoints
                .map((p, idx) => {
                  const nx = Math.max(0, Math.min(100, ((p.x - minX) / boxW) * 100)).toFixed(1);
                  const ny = Math.max(0, Math.min(100, ((p.y - minY) / boxH) * 100)).toFixed(1);
                  return idx === 0 ? `M ${nx} ${ny}` : `L ${nx} ${ny}`;
                })
                .join(' ');

              onFinishDrawStroke?.({
                id: `draw-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                kind: 'line',
                xPct,
                yPct,
                widthPct,
                heightPct,
                borderColor: drawStrokeColor,
                strokeWidth: drawStrokeWidth,
                opacity: drawIsHighlighter ? 50 : 100,
                svgPath: strokeSvgPath,
                rotationDeg: 0,
                locked: false,
              });
            }
            setCurrentPoints([]);
          }}
          onPointerCancel={() => setCurrentPoints([])}
        >
          {/* Live drawing stroke SVG preview */}
          {currentPoints.length > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <path
                d={currentPoints.map((p, idx) => (idx === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)).join(' ')}
                fill="none"
                stroke={drawStrokeColor}
                strokeWidth={drawStrokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={drawIsHighlighter ? 0.5 : 1}
              />
            </svg>
          )}
        </div>
      )}

      {locked && (
        <div className="absolute inset-0 pointer-events-none rounded-sm ring-2 ring-[#B8895A]/40 flex items-start justify-end p-2">
          <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          </div>
        </div>
      )}
    </div>
  );
}
