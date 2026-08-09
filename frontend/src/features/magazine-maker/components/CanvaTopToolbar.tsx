import {
  Type,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Trash2,
  Quote,
  Palette,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Layers,
  LayoutTemplate,
  ChevronsUp,
  ChevronsDown,
} from 'lucide-react';
import { TextOverlay, PhotoSlot } from '../types';

export interface SelectedTextInfo {
  id: string; // 'config.title' | 'config.subtitle' | 'page.title' | 'page.subtitle' | 'page.editorialText' | slot.id | overlay.id
  type: 'config_title' | 'config_subtitle' | 'page_title' | 'page_subtitle' | 'editorial' | 'slot_caption' | 'overlay' | 'slot';
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'bold' | '900';
  fontStyle?: 'normal' | 'italic';
  slot?: PhotoSlot;
  overlay?: TextOverlay;
}

interface CanvaTopToolbarProps {
  selection: SelectedTextInfo | null;
  onUpdateSelection: (updated: Partial<SelectedTextInfo>) => void;
  onAddTextOverlay: (type: 'title' | 'subtitle' | 'body' | 'quote') => void;
  onDeleteOverlay?: (overlayId: string) => void;
  onUpdateSlotFilter?: (slotId: string, filter: PhotoSlot['filter']) => void;
  onUpdateSlotCaption?: (slotId: string, caption: string) => void;
  onClearSelection: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onToggleLayers?: () => void;
  showLayersPanel?: boolean;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onOpenCanvaTemplates?: () => void;
}

const FONT_FAMILIES = [
  { name: 'Playfair Display (Serif)', value: "'Playfair Display', serif" },
  { name: 'Plus Jakarta Sans (Modern)', value: "'Plus Jakarta Sans', sans-serif" },
  { name: 'Cinzel (Luxury)', value: "'Cinzel', serif" },
  { name: 'Cormorant (Classic Editorial)', value: "'Cormorant Garamond', serif" },
  { name: 'Dancing Script (Calligraphy)', value: "'Dancing Script', cursive" },
  { name: 'Space Grotesk (Tech Minimal)', value: "'Space Grotesk', sans-serif" },
  { name: 'Courier Prime (Monospace)', value: "'Courier Prime', monospace" },
];

const PRESET_COLORS = [
  { name: 'Luxury Gold', value: '#D4AF37' },
  { name: 'Charcoal Dark', value: '#111827' },
  { name: 'Deep Burgundy', value: '#3D1E30' },
  { name: 'Classic White', value: '#FFFFFF' },
  { name: 'Cream Ivory', value: '#FDFBF7' },
  { name: 'Navy Blue', value: '#1E3A8A' },
  { name: 'Crimson Red', value: '#991B1B' },
  { name: 'Emerald Green', value: '#065F46' },
];

export function CanvaTopToolbar({
  selection,
  onUpdateSelection,
  onAddTextOverlay,
  onDeleteOverlay,
  onUpdateSlotFilter,
  onUpdateSlotCaption,
  onClearSelection,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onToggleLayers,
  showLayersPanel = false,
  onBringToFront,
  onSendToBack,
  onOpenCanvaTemplates,
}: CanvaTopToolbarProps) {
  const isTextSelected =
    selection &&
    selection.type !== 'slot';

  const isSlotSelected = selection && selection.type === 'slot' && selection.slot;

  return (
    <div className="w-full bg-white border border-luxury-gold/30 rounded-xl p-2 sm:p-3 shadow-md backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
      {/* Quick Insert Buttons & History Controls (Canva Style) */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Undo & Redo Stack Buttons */}
        <div className="flex items-center gap-1 bg-luxury-black border border-luxury-gold/30 rounded p-0.5 mr-1">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-luxury-gold/20 text-luxury-accent cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5 text-luxury-gold" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-luxury-gold/20 text-luxury-accent cursor-pointer"
            title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5 text-luxury-gold" />
          </button>
        </div>

        {/* Layer Stack Panel Toggle Button */}
        {onToggleLayers && (
          <button
            type="button"
            onClick={onToggleLayers}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer mr-1 ${
              showLayersPanel
                ? 'bg-luxury-gold text-luxury-accent shadow-xs'
                : 'bg-luxury-black hover:bg-luxury-gold/20 text-luxury-accent border border-luxury-gold/30'
            }`}
            title="Toggle Layers Stack Sidebar"
          >
            <Layers className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="hidden sm:inline">Layers</span>
          </button>
        )}

        {/* Canva Templates Modal Button */}
        {onOpenCanvaTemplates && (
          <button
            type="button"
            onClick={onOpenCanvaTemplates}
            className="px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer mr-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-xs"
            title="Browse Canva Magazine Presets & Embed Live Designs"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Canva Templates</span>
          </button>
        )}

        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider mr-1 hidden sm:inline">
          Insert:
        </span>
        <button
          type="button"
          onClick={() => onAddTextOverlay('title')}
          className="px-2.5 py-1 rounded bg-luxury-black hover:bg-luxury-gold/20 text-luxury-accent border border-luxury-gold/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          title="Add Big Heading Text"
        >
          <Heading1 className="w-3.5 h-3.5 text-luxury-gold" />
          <span>Heading</span>
        </button>

        <button
          type="button"
          onClick={() => onAddTextOverlay('subtitle')}
          className="px-2.5 py-1 rounded bg-luxury-black hover:bg-luxury-gold/20 text-luxury-accent border border-luxury-gold/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          title="Add Subheading Text"
        >
          <Heading2 className="w-3.5 h-3.5 text-luxury-gold" />
          <span>Subheading</span>
        </button>

        <button
          type="button"
          onClick={() => onAddTextOverlay('body')}
          className="px-2.5 py-1 rounded bg-luxury-black hover:bg-luxury-gold/20 text-luxury-accent border border-luxury-gold/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          title="Add Paragraph Body Text"
        >
          <Type className="w-3.5 h-3.5 text-luxury-gold" />
          <span className="hidden md:inline">Body Text</span>
        </button>

        <button
          type="button"
          onClick={() => onAddTextOverlay('quote')}
          className="px-2.5 py-1 rounded bg-luxury-black hover:bg-luxury-gold/20 text-luxury-accent border border-luxury-gold/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          title="Add Editorial Quote Box"
        >
          <Quote className="w-3.5 h-3.5 text-luxury-gold" />
          <span className="hidden md:inline">Quote Box</span>
        </button>
      </div>

      {/* Text Context Controls */}
      {isTextSelected && (
        <div className="flex items-center gap-2 flex-wrap border-l border-luxury-gold/20 pl-3">
          {/* Font Family Selector */}
          <div className="flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
            <select
              value={selection.fontFamily || "'Playfair Display', serif"}
              onChange={(e) => onUpdateSelection({ fontFamily: e.target.value })}
              className="bg-luxury-black border border-luxury-gold/30 rounded px-2 py-1 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold max-w-[150px] truncate font-medium cursor-pointer"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Increment / Decrement */}
          <div className="flex items-center gap-1 bg-luxury-black border border-luxury-gold/30 rounded p-0.5">
            <button
              type="button"
              onClick={() => {
                const current = selection.fontSize || 18;
                onUpdateSelection({ fontSize: Math.max(10, current - 2) });
              }}
              className="px-1.5 py-0.5 hover:bg-luxury-gold/20 rounded font-bold text-luxury-accent"
              title="Decrease Font Size"
            >
              -
            </button>
            <span className="text-[11px] font-mono font-bold text-luxury-gold px-1 min-w-[28px] text-center">
              {selection.fontSize || 18}px
            </span>
            <button
              type="button"
              onClick={() => {
                const current = selection.fontSize || 18;
                onUpdateSelection({ fontSize: Math.min(96, current + 2) });
              }}
              className="px-1.5 py-0.5 hover:bg-luxury-gold/20 rounded font-bold text-luxury-accent"
              title="Increase Font Size"
            >
              +
            </button>
          </div>

          {/* Bold & Italic */}
          <div className="flex items-center gap-1 bg-luxury-black border border-luxury-gold/30 rounded p-0.5">
            <button
              type="button"
              onClick={() =>
                onUpdateSelection({
                  fontWeight: selection.fontWeight === 'bold' ? 'normal' : 'bold',
                })
              }
              className={`p-1 rounded transition-colors ${
                selection.fontWeight === 'bold'
                  ? 'bg-luxury-gold text-luxury-accent font-black'
                  : 'text-gray-600 hover:text-luxury-accent'
              }`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                onUpdateSelection({
                  fontStyle: selection.fontStyle === 'italic' ? 'normal' : 'italic',
                })
              }
              className={`p-1 rounded transition-colors ${
                selection.fontStyle === 'italic'
                  ? 'bg-luxury-gold text-luxury-accent font-black'
                  : 'text-gray-600 hover:text-luxury-accent'
              }`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 bg-luxury-black border border-luxury-gold/30 rounded p-0.5">
            <button
              type="button"
              onClick={() => onUpdateSelection({ align: 'left' })}
              className={`p-1 rounded transition-colors ${
                selection.align === 'left' ? 'bg-luxury-gold text-luxury-accent' : 'text-gray-600'
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateSelection({ align: 'center' })}
              className={`p-1 rounded transition-colors ${
                selection.align === 'center' ? 'bg-luxury-gold text-luxury-accent' : 'text-gray-600'
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateSelection({ align: 'right' })}
              className={`p-1 rounded transition-colors ${
                selection.align === 'right' ? 'bg-luxury-gold text-luxury-accent' : 'text-gray-600'
              }`}
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Palette Swatches */}
          <div className="flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
            <div className="flex items-center gap-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => onUpdateSelection({ color: c.value })}
                  style={{ backgroundColor: c.value }}
                  className={`w-4 h-4 rounded-full border transition-transform cursor-pointer hover:scale-110 ${
                    selection.color === c.value
                      ? 'border-luxury-gold ring-2 ring-luxury-gold/50 scale-110'
                      : 'border-gray-300'
                  }`}
                  title={c.name}
                />
              ))}
              <input
                type="color"
                value={selection.color || '#111827'}
                onChange={(e) => onUpdateSelection({ color: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                title="Custom Color"
              />
            </div>
          </div>

          {/* Stacking Order / Layers Quick Actions */}
          {(onBringToFront || onSendToBack) && (
            <div className="flex items-center gap-1 bg-luxury-black border border-luxury-gold/30 rounded p-0.5 ml-auto">
              {onBringToFront && (
                <button
                  type="button"
                  onClick={onBringToFront}
                  className="p-1 rounded text-luxury-gold hover:text-gold-300 transition-colors cursor-pointer"
                  title="Bring Selected Element to Front"
                >
                  <ChevronsUp className="w-3.5 h-3.5" />
                </button>
              )}
              {onSendToBack && (
                <button
                  type="button"
                  onClick={onSendToBack}
                  className="p-1 rounded text-luxury-gold hover:text-gold-300 transition-colors cursor-pointer"
                  title="Send Selected Element to Back"
                >
                  <ChevronsDown className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Delete overlay button if custom overlay */}
          {selection.type === 'overlay' && selection.overlay && (
            <button
              type="button"
              onClick={() => onDeleteOverlay?.(selection.overlay!.id)}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
              title="Delete Text Element"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Photo Slot Context Controls */}
      {isSlotSelected && selection.slot && (
        <div className="flex items-center gap-3 flex-wrap border-l border-luxury-gold/20 pl-3">
          <div className="flex items-center gap-1.5 text-luxury-gold font-bold">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photo Slot Filter:</span>
          </div>

          {/* Filter preset selector */}
          <select
            value={selection.slot.filter || 'normal'}
            onChange={(e) =>
              onUpdateSlotFilter?.(selection.slot!.id, e.target.value as PhotoSlot['filter'])
            }
            className="bg-luxury-black border border-luxury-gold/30 rounded px-2 py-1 text-xs text-luxury-accent font-medium focus:outline-none focus:border-luxury-gold cursor-pointer"
          >
            <option value="normal">Normal Original</option>
            <option value="bw">Black & White</option>
            <option value="sepia">Vintage Sepia</option>
            <option value="vintage">Warm Retro</option>
            <option value="vivid">Vivid Color Boost</option>
          </select>

          {/* Slot Caption Input */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
            <span className="text-[10px] font-mono text-gray-500">Caption:</span>
            <input
              type="text"
              value={selection.slot.caption || ''}
              onChange={(e) => onUpdateSlotCaption?.(selection.slot!.id, e.target.value)}
              placeholder="Add photo caption..."
              className="flex-1 bg-luxury-black border border-luxury-gold/30 rounded px-2 py-1 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold"
            />
          </div>
        </div>
      )}

      {/* Deselect / Done Button */}
      {selection && (
        <button
          type="button"
          onClick={onClearSelection}
          className="px-2 py-1 text-[11px] font-mono font-bold text-gray-500 hover:text-luxury-accent rounded hover:bg-gray-100 transition-colors ml-auto cursor-pointer"
        >
          Deselect
        </button>
      )}
    </div>
  );
}
