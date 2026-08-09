import {
  Layers,
  Eye,
  EyeOff,
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  ChevronsDown,
  Trash2,
  Image as ImageIcon,
  Type,
  Quote,
  Heading1,
  X,
  Sparkles,
} from 'lucide-react';
import { MagazinePage, PhotoSlot, TextOverlay } from '../types';
import { SelectedTextInfo } from './CanvaTopToolbar';

export interface LayerItem {
  id: string;
  type: 'text_overlay' | 'photo_slot';
  label: string;
  previewSrc?: string | null;
  zIndex: number;
  hidden: boolean;
  rawSlot?: PhotoSlot;
  rawOverlay?: TextOverlay;
}

interface LayerSidebarProps {
  page: MagazinePage;
  pageIndex: number;
  selectedTextInfo?: SelectedTextInfo | null;
  onSelectTextInfo?: (info: SelectedTextInfo | null) => void;
  onUpdatePage: (pageIndex: number, updated: Partial<MagazinePage>) => void;
  onClose?: () => void;
}

export function LayerSidebar({
  page,
  pageIndex,
  selectedTextInfo,
  onSelectTextInfo,
  onUpdatePage,
  onClose,
}: LayerSidebarProps) {
  // Construct list of all layerable items
  const layers: LayerItem[] = [
    // Photo Slots
    ...page.slots.map((slot, idx) => ({
      id: slot.id,
      type: 'photo_slot' as const,
      label: slot.caption ? `Slot ${idx + 1}: ${slot.caption}` : `Photo Slot ${idx + 1}`,
      previewSrc: slot.src,
      zIndex: slot.zIndex !== undefined ? slot.zIndex : 10 + idx,
      hidden: Boolean(slot.hidden),
      rawSlot: slot,
    })),
    // Text Overlays
    ...page.textOverlays.map((ov, idx) => {
      let iconType = 'text';
      if (ov.fontSize >= 24) iconType = 'heading';
      else if (ov.fontStyle === 'italic') iconType = 'quote';

      return {
        id: ov.id,
        type: 'text_overlay' as const,
        label: ov.text ? `"${ov.text}"` : 'Text Overlay',
        previewSrc: null,
        zIndex: ov.zIndex !== undefined ? ov.zIndex : 30 + idx,
        hidden: Boolean(ov.hidden),
        rawOverlay: ov,
        iconType,
      };
    }),
  ];

  // Sort layers descending by zIndex (Top layer at the top of the list)
  layers.sort((a, b) => b.zIndex - a.zIndex);

  const maxZ = Math.max(...layers.map((l) => l.zIndex), 30);
  const minZ = Math.min(...layers.map((l) => l.zIndex), 1);

  // Helper to reorder/update zIndex
  const setLayerZIndex = (layer: LayerItem, newZ: number) => {
    if (layer.type === 'text_overlay' && layer.rawOverlay) {
      const updatedOverlays = page.textOverlays.map((ov) =>
        ov.id === layer.id ? { ...ov, zIndex: newZ } : ov
      );
      onUpdatePage(pageIndex, { textOverlays: updatedOverlays });
    } else if (layer.type === 'photo_slot' && layer.rawSlot) {
      const updatedSlots = page.slots.map((s) =>
        s.id === layer.id ? { ...s, zIndex: newZ } : s
      );
      onUpdatePage(pageIndex, { slots: updatedSlots });
    }
  };

  const handleBringToFront = (layer: LayerItem) => {
    setLayerZIndex(layer, maxZ + 5);
  };

  const handleSendToBack = (layer: LayerItem) => {
    setLayerZIndex(layer, Math.max(1, minZ - 5));
  };

  const handleMoveUp = (layer: LayerItem) => {
    // Find item directly above in zIndex order
    const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);
    const currIdx = sorted.findIndex((l) => l.id === layer.id);
    if (currIdx < sorted.length - 1) {
      const targetAbove = sorted[currIdx + 1];
      const tempZ = targetAbove.zIndex;
      setLayerZIndex(layer, tempZ + 1);
    } else {
      setLayerZIndex(layer, layer.zIndex + 2);
    }
  };

  const handleMoveDown = (layer: LayerItem) => {
    const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);
    const currIdx = sorted.findIndex((l) => l.id === layer.id);
    if (currIdx > 0) {
      const targetBelow = sorted[currIdx - 1];
      const tempZ = targetBelow.zIndex;
      setLayerZIndex(layer, Math.max(1, tempZ - 1));
    } else {
      setLayerZIndex(layer, Math.max(1, layer.zIndex - 2));
    }
  };

  const handleToggleHide = (layer: LayerItem) => {
    if (layer.type === 'text_overlay' && layer.rawOverlay) {
      const updatedOverlays = page.textOverlays.map((ov) =>
        ov.id === layer.id ? { ...ov, hidden: !ov.hidden } : ov
      );
      onUpdatePage(pageIndex, { textOverlays: updatedOverlays });
    } else if (layer.type === 'photo_slot' && layer.rawSlot) {
      const updatedSlots = page.slots.map((s) =>
        s.id === layer.id ? { ...s, hidden: !s.hidden } : s
      );
      onUpdatePage(pageIndex, { slots: updatedSlots });
    }
  };

  const handleDeleteLayer = (layer: LayerItem) => {
    if (layer.type === 'text_overlay') {
      const updatedOverlays = page.textOverlays.filter((ov) => ov.id !== layer.id);
      onUpdatePage(pageIndex, { textOverlays: updatedOverlays });
      if (selectedTextInfo?.id === layer.id) {
        onSelectTextInfo?.(null);
      }
    } else if (layer.type === 'photo_slot' && layer.rawSlot) {
      // Clear image from slot
      const updatedSlots = page.slots.map((s) =>
        s.id === layer.id ? { ...s, src: null } : s
      );
      onUpdatePage(pageIndex, { slots: updatedSlots });
    }
  };

  const handleSelectLayer = (layer: LayerItem) => {
    if (layer.type === 'text_overlay' && layer.rawOverlay) {
      onSelectTextInfo?.({
        id: layer.id,
        type: 'overlay',
        text: layer.rawOverlay.text,
        fontSize: layer.rawOverlay.fontSize,
        fontFamily: layer.rawOverlay.fontFamily,
        color: layer.rawOverlay.color,
        align: layer.rawOverlay.align,
        fontWeight: layer.rawOverlay.fontWeight,
        fontStyle: layer.rawOverlay.fontStyle,
        overlay: layer.rawOverlay,
      });
    } else if (layer.type === 'photo_slot' && layer.rawSlot) {
      onSelectTextInfo?.({
        id: layer.id,
        type: 'slot',
        slot: layer.rawSlot,
      });
    }
  };

  return (
    <div className="w-full bg-white border border-luxury-gold/30 rounded-xl p-4 shadow-xl text-xs font-sans space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-luxury-gold/20">
        <div className="flex items-center gap-2 text-luxury-accent font-bold">
          <Layers className="w-4 h-4 text-luxury-gold" />
          <span className="font-display tracking-wider uppercase">Page {pageIndex + 1} Layers</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold font-mono font-bold">
            {layers.length} Elements
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-luxury-accent rounded transition-colors cursor-pointer"
            title="Close Layer Panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Helper text */}
      <div className="text-[11px] text-gray-500 bg-luxury-gold/5 p-2 rounded-lg border border-luxury-gold/20 flex items-start gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
        <span>
          Top items sit in front. Use arrows to change stacking order or bring text & photos forward/back.
        </span>
      </div>

      {/* Layer List */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
        {layers.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No layer elements on this page.</p>
        ) : (
          layers.map((layer, index) => {
            const isSelected = selectedTextInfo?.id === layer.id;

            return (
              <div
                key={layer.id}
                onClick={() => handleSelectLayer(layer)}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-luxury-gold/15 border-luxury-gold ring-1 ring-luxury-gold shadow-xs'
                    : 'bg-white hover:bg-gray-50 border-luxury-gold/20'
                } ${layer.hidden ? 'opacity-50' : ''}`}
              >
                {/* Icon & Label */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-[10px] font-mono font-bold text-gray-400 w-4 text-center shrink-0">
                    #{layers.length - index}
                  </span>

                  {/* Thumbnail / Type Icon */}
                  <div className="w-7 h-7 rounded border border-luxury-gold/30 bg-luxury-black/5 flex items-center justify-center shrink-0 overflow-hidden">
                    {layer.previewSrc ? (
                      <img src={layer.previewSrc} alt="" className="w-full h-full object-cover" />
                    ) : layer.type === 'photo_slot' ? (
                      <ImageIcon className="w-3.5 h-3.5 text-luxury-gold" />
                    ) : layer.label.toLowerCase().includes('heading') ? (
                      <Heading1 className="w-3.5 h-3.5 text-luxury-accent" />
                    ) : layer.label.toLowerCase().includes('quote') ? (
                      <Quote className="w-3.5 h-3.5 text-luxury-accent" />
                    ) : (
                      <Type className="w-3.5 h-3.5 text-luxury-accent" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-luxury-accent truncate text-[11px]">
                      {layer.label}
                    </p>
                    <p className="text-[9px] font-mono text-gray-500">
                      z-index: {layer.zIndex} • {layer.type === 'photo_slot' ? 'Slot' : 'Overlay'}
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Hide / Unhide */}
                  <button
                    type="button"
                    onClick={() => handleToggleHide(layer)}
                    className="p-1 text-gray-500 hover:text-luxury-gold rounded hover:bg-gray-100 cursor-pointer"
                    title={layer.hidden ? 'Show Layer' : 'Hide Layer'}
                  >
                    {layer.hidden ? (
                      <EyeOff className="w-3.5 h-3.5 text-red-400" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Move Up */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(layer)}
                    disabled={index === 0}
                    className="p-1 text-gray-600 hover:text-luxury-accent disabled:opacity-20 rounded hover:bg-gray-100 cursor-pointer"
                    title="Move Up (Bring Forward)"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    onClick={() => handleMoveDown(layer)}
                    disabled={index === layers.length - 1}
                    className="p-1 text-gray-600 hover:text-luxury-accent disabled:opacity-20 rounded hover:bg-gray-100 cursor-pointer"
                    title="Move Down (Send Backward)"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Bring to Front */}
                  <button
                    type="button"
                    onClick={() => handleBringToFront(layer)}
                    disabled={index === 0}
                    className="p-1 text-luxury-gold hover:text-gold-300 disabled:opacity-20 rounded hover:bg-gray-100 cursor-pointer"
                    title="Bring to Front"
                  >
                    <ChevronsUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Send to Back */}
                  <button
                    type="button"
                    onClick={() => handleSendToBack(layer)}
                    disabled={index === layers.length - 1}
                    className="p-1 text-luxury-gold hover:text-gold-300 disabled:opacity-20 rounded hover:bg-gray-100 cursor-pointer"
                    title="Send to Back"
                  >
                    <ChevronsDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete / Clear */}
                  <button
                    type="button"
                    onClick={() => handleDeleteLayer(layer)}
                    className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                    title="Remove element"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
