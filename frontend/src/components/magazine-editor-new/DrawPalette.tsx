import { useState, useRef } from 'react';
import {
  X, Undo2, Redo2,
  ChevronUp, ChevronDown,
  Minus, ArrowRight, ArrowLeftRight,
} from 'lucide-react';
import type { ShapeType } from '@/lib/magazine-editor-new/types';
import { SHAPE_POLYGONS } from '@/lib/magazine-editor-new/shapeStyle';

const CANVA_SHAPES: { type: ShapeType; label: string }[] = [
  { type: 'square', label: 'Square' },
  { type: 'rounded-rectangle', label: 'Rounded Square' },
  { type: 'circle', label: 'Circle' },
  { type: 'triangle', label: 'Triangle Up' },
  { type: 'triangle-down', label: 'Triangle Down' },
  { type: 'diamond', label: 'Diamond' },
  { type: 'pentagon', label: 'Pentagon' },
  { type: 'hexagon', label: 'Hexagon' },
  { type: 'octagon', label: 'Octagon' },
  { type: 'chamfered-rectangle', label: 'Chamfered Rectangle' },
  { type: 'star-4', label: '4-Point Star' },
  { type: 'star', label: '5-Point Star' },
  { type: 'star-6', label: '6-Point Star' },
  { type: 'star-8', label: '8-Point Star' },
  { type: 'star-10', label: '10-Point Star' },
  { type: 'star-12', label: '12-Point Burst' },
  { type: 'burst-16', label: '16-Point Burst' },
  { type: 'burst-24', label: '24-Point Burst' },
  { type: 'burst-32', label: '32-Point Burst' },
  { type: 'arrow-right', label: 'Arrow Right' },
  { type: 'arrow-left', label: 'Arrow Left' },
  { type: 'arrow-up', label: 'Arrow Up' },
  { type: 'arrow-down', label: 'Arrow Down' },
  { type: 'arrow-bidirectional-h', label: 'Horizontal Arrow' },
  { type: 'arrow-bidirectional-v', label: 'Vertical Arrow' },
  { type: 'arrow-pentagon', label: 'Pentagon Arrow' },
  { type: 'chevron-arrow', label: 'Chevron' },
  { type: 'banner', label: 'Ribbon Banner' },
  { type: 'pointed-hexagon', label: 'Pointed Hexagon' },
  { type: 'pill', label: 'Pill' },
  { type: 'callout', label: 'Callout Bubble' },
  { type: 'speech-bubble', label: 'Speech Bubble' },
  { type: 'heart', label: 'Heart' },
  { type: 'cross', label: 'Cross Plus' },
  { type: 'cloud', label: 'Cloud' },
  { type: 'shield', label: 'Shield' },
  { type: 'bookmark', label: 'Bookmark' },
  { type: 'trapezoid', label: 'Trapezoid' },
  { type: 'parallelogram', label: 'Parallelogram' },
  { type: 'arch', label: 'Arch' },
];

function ShapeIcon({ type }: { type: ShapeType }) {
  if (type === 'circle' || type === 'ellipse') {
    return (
      <svg viewBox="0 0 100 100" className="w-6 h-6 transition-transform group-hover:scale-110">
        <circle cx="50" cy="50" r="42" fill="currentColor" />
      </svg>
    );
  }
  if (type === 'square' || type === 'rectangle') {
    return (
      <svg viewBox="0 0 100 100" className="w-6 h-6 transition-transform group-hover:scale-110">
        <rect x="12" y="12" width="76" height="76" fill="currentColor" />
      </svg>
    );
  }
  if (type === 'rounded-rectangle') {
    return (
      <svg viewBox="0 0 100 100" className="w-6 h-6 transition-transform group-hover:scale-110">
        <rect x="12" y="12" width="76" height="76" rx="18" fill="currentColor" />
      </svg>
    );
  }
  if (type === 'pill') {
    return (
      <svg viewBox="0 0 100 100" className="w-6 h-6 transition-transform group-hover:scale-110">
        <rect x="8" y="24" width="84" height="52" rx="26" fill="currentColor" />
      </svg>
    );
  }
  if (type === 'arch') {
    return (
      <svg viewBox="0 0 100 100" className="w-6 h-6 transition-transform group-hover:scale-110">
        <path d="M 16 86 L 16 48 A 34 34 0 0 1 84 48 L 84 86 Z" fill="currentColor" />
      </svg>
    );
  }
  if (type === 'heart') {
    return (
      <svg viewBox="0 0 100 100" className="w-6 h-6 transition-transform group-hover:scale-110">
        <path d="M 50 96 C 32 78, 3 56, 3 35 C 3 16, 14 4, 27 4 C 39 4, 47 9, 50 16 C 53 9, 61 4, 73 4 C 86 4, 97 16, 97 35 C 97 56, 68 78, 50 96 Z" fill="currentColor" />
      </svg>
    );
  }
  const poly = SHAPE_POLYGONS[type];
  if (poly && poly.length > 0) {
    const pointsStr = poly.map(([x, y]) => `${x},${y}`).join(' ');
    return (
      <svg viewBox="0 0 100 100" className="w-6 h-6 transition-transform group-hover:scale-110">
        <polygon points={pointsStr} fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className="w-6 h-6 transition-transform group-hover:scale-110">
      <rect x="12" y="12" width="76" height="76" fill="currentColor" />
    </svg>
  );
}

export type DrawToolType =
  | 'select'
  | 'pen'
  | 'shapes'
  | 'line'
  | 'sticky'
  | 'text'
  | 'signature'
  | 'table';

interface DrawPaletteProps {
  activeTool: DrawToolType;
  onChangeTool: (tool: DrawToolType) => void;
  onClose: () => void;
  // Drawing stroke settings
  strokeColor: string;
  onChangeStrokeColor: (color: string) => void;
  strokeWidth: number;
  onChangeStrokeWidth: (width: number) => void;
  isHighlighter: boolean;
  onToggleHighlighter: (val: boolean) => void;
  // Quick insert helpers
  onAddShape: (shape: ShapeType) => void;
  onAddLine: (variant: 'solid' | 'arrow' | 'double-arrow' | 'dashed') => void;
  onAddStickyNote: (color: string) => void;
  onAddText: () => void;
  onAddTable: () => void;
  // Undo & Redo
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const PEN_COLORS = [
  '#EF4444', // Red (classic pen)
  '#1C2024', // Black / Obsidian
  '#2563EB', // Royal Blue
  '#10B981', // Emerald
  '#8B3DFF', // Canva Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#FFFFFF', // White
];

const STICKY_COLORS = [
  { name: 'Yellow', bg: '#FEF08A' },
  { name: 'Peach', bg: '#FED7AA' },
  { name: 'Pink', bg: '#FBCFE8' },
  { name: 'Mint', bg: '#BBF7D0' },
  { name: 'Blue', bg: '#BAE6FD' },
  { name: 'Lavender', bg: '#E9D5FF' },
];

export default function DrawPalette({
  activeTool,
  onChangeTool,
  onClose,
  strokeColor,
  onChangeStrokeColor,
  strokeWidth,
  onChangeStrokeWidth,
  isHighlighter,
  onToggleHighlighter,
  onAddShape,
  onAddLine,
  onAddStickyNote,
  onAddText,
  onAddTable,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: DrawPaletteProps) {
  const [flyout, setFlyout] = useState<'shapes' | 'lines' | 'sticky' | 'pen' | null>(null);
  const shapesScrollRef = useRef<HTMLDivElement>(null);

  const handleToolClick = (tool: DrawToolType) => {
    if (tool === 'select') {
      onChangeTool('select');
      setFlyout(null);
    } else if (tool === 'pen' || tool === 'signature') {
      onChangeTool(tool);
      setFlyout(flyout === 'pen' ? null : 'pen');
    } else if (tool === 'shapes') {
      setFlyout(flyout === 'shapes' ? null : 'shapes');
    } else if (tool === 'line') {
      setFlyout(flyout === 'lines' ? null : 'lines');
    } else if (tool === 'sticky') {
      setFlyout(flyout === 'sticky' ? null : 'sticky');
    } else if (tool === 'text') {
      onAddText();
      setFlyout(null);
    } else if (tool === 'table') {
      onAddTable();
      setFlyout(null);
    }
  };

  return (
    <div className="flex items-start gap-2 z-40 select-none animate-in fade-in slide-in-from-left-2 duration-150">
      {/* Main Vertical Palette Pill (Matches Canva screenshot) */}
      <div className="flex flex-col items-center">
        {/* Close Button at top */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close drawing tools"
          title="Close tools"
          className="w-8 h-8 mb-2 rounded-full bg-white shadow-md border border-[#E7E7E4] hover:bg-[#F5F5F3] flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] cursor-pointer transition-transform hover:scale-105"
        >
          <X className="w-4 h-4" strokeWidth={2.2} />
        </button>

        {/* Floating Vertical Pill */}
        <div className="w-[58px] bg-white border border-[#E7E7E4] rounded-full shadow-2xl py-3 px-1.5 flex flex-col items-center gap-1.5 backdrop-blur-md">
          {/* 1. Selection Cursor */}
          <button
            type="button"
            onClick={() => handleToolClick('select')}
            title="Selection tool"
            aria-label="Selection tool"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'select'
                ? 'bg-[#EDE4FF] text-[#7D2AE8] shadow-xs ring-2 ring-[#7D2AE8]/30'
                : 'text-[#4A5056] hover:bg-[#F5F5F3] hover:text-[#1C2024]'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path
                d="M4.5 3.5L10.5 20.5L13.8 13.8L20.5 10.5L4.5 3.5Z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinejoin="round"
                fill={activeTool === 'select' ? '#7D2AE8' : 'none'}
              />
            </svg>
          </button>

          {/* 2. Pen / Marker (Red pen drawing line) */}
          <button
            type="button"
            onClick={() => handleToolClick('pen')}
            title="Draw with Pen / Marker"
            aria-label="Pen drawing tool"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'pen'
                ? 'bg-[#FEE2E2] text-[#EF4444] shadow-xs ring-2 ring-[#EF4444]/30 scale-105'
                : 'hover:bg-[#F5F5F3]'
            }`}
          >
            <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
              {/* Angled Red Pen Body */}
              <path
                d="M18.5 4.5L23.5 9.5L10.5 22.5L5.5 22.5L5.5 17.5L18.5 4.5Z"
                fill="#EF4444"
                stroke="#DC2626"
                strokeWidth={1.2}
              />
              <path d="M16 7L21 12" stroke="#FFFFFF" strokeWidth={1.2} />
              <path d="M5.5 22.5L3.5 24.5" stroke="#991B1B" strokeWidth={1.5} strokeLinecap="round" />
              {/* Drawn red stroke underneath */}
              <path
                d="M4 25.5C8 23.5 12 26 16 24.5C18 23.8 20 25 23 24.5"
                stroke="#EF4444"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* 3. Shapes (Circle + Square overlapping) */}
          <button
            type="button"
            onClick={() => handleToolClick('shapes')}
            title="Add shapes"
            aria-label="Add shapes"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              flyout === 'shapes' ? 'bg-[#F0FDF4] text-[#10B981]' : 'text-[#4A5056] hover:bg-[#F5F5F3]'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <circle cx="9" cy="9" r="6" fill="#64748B" />
              <rect x="8" y="8" width="12" height="12" rx="2.5" fill="#1E293B" />
            </svg>
          </button>

          {/* 4. Line / Connector (Diagonal blue line) */}
          <button
            type="button"
            onClick={() => handleToolClick('line')}
            title="Add lines & connectors"
            aria-label="Add lines"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              flyout === 'lines' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#4A5056] hover:bg-[#F5F5F3]'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <line x1="4" y1="20" x2="20" y2="4" stroke="#0284C7" strokeWidth={3} strokeLinecap="round" />
            </svg>
          </button>

          {/* 5. Sticky Note (Yellow square with folded corner) */}
          <button
            type="button"
            onClick={() => handleToolClick('sticky')}
            title="Add sticky note"
            aria-label="Add sticky note"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              flyout === 'sticky' ? 'bg-[#FEF9C3] shadow-xs' : 'hover:bg-[#F5F5F3]'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path
                d="M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V15L15 20H6C4.89543 20 4 19.1046 4 18V4Z"
                fill="#EAB308"
              />
              <path
                d="M15 15H19L15 19V15Z"
                fill="#CA8A04"
              />
            </svg>
          </button>

          {/* 6. Text (Purple 'T') */}
          <button
            type="button"
            onClick={() => handleToolClick('text')}
            title="Add text"
            aria-label="Add text"
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#8B3DFF] hover:bg-[#EDE4FF] transition-all cursor-pointer"
          >
            <span className="font-serif font-black text-lg leading-none">T</span>
          </button>

          {/* 7. Signature / Scribble (Cursive wave line) */}
          <button
            type="button"
            onClick={() => handleToolClick('signature')}
            title="Draw Signature / Freehand scribble"
            aria-label="Signature tool"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'signature'
                ? 'bg-[#F3F4F6] text-[#111827] ring-2 ring-[#111827]/30 shadow-xs'
                : 'text-[#111827] hover:bg-[#F5F5F3]'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path
                d="M3 17C6 11 8 5 9 12C10 19 12 18 14 13C16 8 18 18 21 16"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 8. Table / Grid (Blue table grid) */}
          <button
            type="button"
            onClick={() => handleToolClick('table')}
            title="Add Table"
            aria-label="Add table"
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#2563EB] hover:bg-[#EFF6FF] transition-all cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="#2563EB" strokeWidth={2} />
              <line x1="3" y1="9" x2="21" y2="9" stroke="#2563EB" strokeWidth={1.5} />
              <line x1="3" y1="15" x2="21" y2="15" stroke="#2563EB" strokeWidth={1.5} />
              <line x1="9" y1="3" x2="9" y2="21" stroke="#2563EB" strokeWidth={1.5} />
              <line x1="15" y1="3" x2="15" y2="21" stroke="#2563EB" strokeWidth={1.5} />
            </svg>
          </button>

          <div className="w-6 h-px bg-[#E7E7E4] my-1" />

          {/* Undo & Redo buttons directly on floating tool */}
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Undo2 className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Redo2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Sub-flyout panels anchored to the right of the vertical pill */}
      {flyout === 'pen' && (
        <div className="bg-white border border-[#E7E7E4] rounded-2xl shadow-xl p-3 w-56 space-y-3 animate-in fade-in slide-in-from-left-2 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#0E1318]">
              {activeTool === 'signature' ? 'Signature Ink' : 'Pen & Marker'}
            </span>
            <span className="text-[10px] text-[#6F7478] bg-[#F5F5F3] px-2 py-0.5 rounded-full font-medium">
              Draw on Canvas
            </span>
          </div>

          {/* Color palette */}
          <div>
            <div className="text-[10px] font-semibold text-[#6F7478] mb-1.5 uppercase tracking-wider">Color</div>
            <div className="grid grid-cols-4 gap-1.5">
              {PEN_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChangeStrokeColor(c)}
                  className={`w-7 h-7 rounded-full border border-black/10 transition-all cursor-pointer ${
                    strokeColor === c ? 'ring-2 ring-[#8B3DFF] scale-110 shadow-xs' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Thickness presets */}
          <div>
            <div className="text-[10px] font-semibold text-[#6F7478] mb-1.5 uppercase tracking-wider">Thickness</div>
            <div className="flex items-center gap-1.5 bg-[#F5F5F3] p-1 rounded-xl">
              {[
                { label: 'Fine', w: 2 },
                { label: 'Medium', w: 4 },
                { label: 'Bold', w: 8 },
                { label: 'Marker', w: 16 },
              ].map((p) => (
                <button
                  key={p.w}
                  type="button"
                  onClick={() => {
                    onChangeStrokeWidth(p.w);
                    onToggleHighlighter(p.w >= 14);
                  }}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    strokeWidth === p.w
                      ? 'bg-white text-[#8B3DFF] shadow-xs'
                      : 'text-[#6F7478] hover:text-[#1C2024]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Highlighter / Semi-transparent mode */}
          <button
            type="button"
            onClick={() => onToggleHighlighter(!isHighlighter)}
            className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              isHighlighter ? 'bg-[#EDE4FF] text-[#8B3DFF]' : 'bg-[#F5F5F3] text-[#6F7478] hover:text-[#1C2024]'
            }`}
          >
            <span>Highlighter Mode</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isHighlighter ? 'bg-[#8B3DFF] text-white font-bold' : 'bg-[#E7E7E4] text-[#6F7478]'}`}>
              {isHighlighter ? 'ON' : 'OFF'}
            </span>
          </button>

          <div className="text-[11px] text-[#6F7478] bg-[#F9F7FF] p-2 rounded-xl text-center">
            Click and drag on the canvas to draw!
          </div>
        </div>
      )}

      {flyout === 'shapes' && (
        <div className="bg-white border border-[#E7E7E4] rounded-2xl shadow-xl p-2.5 w-64 space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-150 flex flex-col">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] font-bold text-[#0E1318]">Shapes</span>
            <span className="text-[10px] text-[#6F7478] bg-[#F5F5F3] px-2 py-0.5 rounded-full font-medium">
              {CANVA_SHAPES.length} shapes
            </span>
          </div>

          {/* Up scroll button */}
          <button
            type="button"
            onClick={() => shapesScrollRef.current?.scrollBy({ top: -120, behavior: 'smooth' })}
            title="Scroll Up"
            aria-label="Scroll shapes up"
            className="w-full py-1 flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] hover:bg-[#F5F5F3] rounded-lg transition-colors cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Scrollable shapes grid */}
          <div
            ref={shapesScrollRef}
            className="max-h-[340px] overflow-y-auto overflow-x-hidden p-1 grid grid-cols-4 gap-2 scroll-smooth"
            style={{ scrollbarWidth: 'thin' }}
          >
            {CANVA_SHAPES.map((s) => (
              <button
                key={s.type}
                type="button"
                onClick={() => {
                  onAddShape(s.type);
                  setFlyout(null);
                }}
                title={s.label}
                aria-label={s.label}
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#E7E7E4]/70 hover:border-[#8B3DFF] hover:bg-[#F5F5F3] text-[#2C3136] hover:text-[#8B3DFF] transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
              >
                <ShapeIcon type={s.type} />
              </button>
            ))}
          </div>

          {/* Down scroll button */}
          <button
            type="button"
            onClick={() => shapesScrollRef.current?.scrollBy({ top: 120, behavior: 'smooth' })}
            title="Scroll Down"
            aria-label="Scroll shapes down"
            className="w-full py-1 flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] hover:bg-[#F5F5F3] rounded-lg transition-colors cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {flyout === 'lines' && (
        <div className="bg-white border border-[#E7E7E4] rounded-2xl shadow-xl p-3 w-52 space-y-2 animate-in fade-in slide-in-from-left-2 duration-150">
          <div className="text-[12px] font-bold text-[#0E1318] mb-1">Add Line & Connector</div>
          <div className="space-y-1.5">
            {[
              { variant: 'solid' as const, label: 'Straight Line', icon: Minus },
              { variant: 'arrow' as const, label: 'Arrow', icon: ArrowRight },
              { variant: 'double-arrow' as const, label: 'Double Arrow', icon: ArrowLeftRight },
              { variant: 'dashed' as const, label: 'Dashed Line', icon: Minus },
            ].map((l) => {
              const Icon = l.icon;
              return (
                <button
                  key={l.variant}
                  type="button"
                  onClick={() => {
                    onAddLine(l.variant);
                    setFlyout(null);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl border border-[#E7E7E4] hover:border-[#8B3DFF] hover:bg-[#F9F7FF] text-[#1C2024] hover:text-[#8B3DFF] text-left transition-all cursor-pointer"
                >
                  <Icon className="w-4 h-4" strokeWidth={2} />
                  <span className="text-[11px] font-medium">{l.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {flyout === 'sticky' && (
        <div className="bg-white border border-[#E7E7E4] rounded-2xl shadow-xl p-3 w-56 space-y-2 animate-in fade-in slide-in-from-left-2 duration-150">
          <div className="text-[12px] font-bold text-[#0E1318] mb-1">Add Sticky Note</div>
          <div className="grid grid-cols-3 gap-2">
            {STICKY_COLORS.map((st) => (
              <button
                key={st.bg}
                type="button"
                onClick={() => {
                  onAddStickyNote(st.bg);
                  setFlyout(null);
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-black/10 shadow-xs hover:scale-105 transition-all cursor-pointer"
                style={{ backgroundColor: st.bg }}
              >
                <div className="w-6 h-6 border-b-2 border-r-2 border-black/10 rounded-xs mb-1" />
                <span className="text-[10px] font-bold text-[#1C2024]">{st.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
