import React, { useState, useRef } from 'react';
import { Upload, Trash2, ZoomIn, ZoomOut, Move, Magnet } from 'lucide-react';
import { MagazinePage, MagazineConfig, PhotoSlot } from '../types';
import { SelectedTextInfo } from './CanvaTopToolbar';

interface SnapGuide {
  positionPct: number;
  label: string;
  type: 'center' | 'margin' | 'element' | 'thirds';
}

interface A4MagazineCanvasProps {
  page: MagazinePage;
  config: MagazineConfig;
  pageRef?: (node: HTMLDivElement | null) => void;
  onSlotPhotoChanged: (slotId: string, imageSrc: string | null) => void;
  onSlotZoomChanged?: (slotId: string, zoom: number) => void;
  onUpdateConfig?: (updated: Partial<MagazineConfig>) => void;
  onUpdatePage?: (updatedPage: Partial<MagazinePage>) => void;
  selectedTextInfo?: SelectedTextInfo | null;
  onSelectTextInfo?: (info: SelectedTextInfo | null) => void;
  isPrintMode?: boolean;
}

export function A4MagazineCanvas({
  page,
  config,
  pageRef,
  onSlotPhotoChanged,
  onSlotZoomChanged,
  onUpdateConfig,
  onUpdatePage,
  selectedTextInfo,
  onSelectTextInfo,
  isPrintMode = false,
}: A4MagazineCanvasProps) {
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [dragOverSlotId, setDragOverSlotId] = useState<string | null>(null);
  const [draggingOverlayId, setDraggingOverlayId] = useState<string | null>(null);

  // Magnetic Alignment Snapping State
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [activeVGuide, setActiveVGuide] = useState<SnapGuide | null>(null);
  const [activeHGuide, setActiveHGuide] = useState<SnapGuide | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleFileDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSlotId(null);

    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onSlotPhotoChanged(slotId, event.target.result as string);
      }
    };
    reader.readAsDataURL(files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, slotId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onSlotPhotoChanged(slotId, event.target.result as string);
      }
    };
    reader.readAsDataURL(files[0]);
  };

  const getFilterClass = (filter?: PhotoSlot['filter']) => {
    switch (filter) {
      case 'bw':
        return 'grayscale contrast-125';
      case 'sepia':
        return 'sepia contrast-110 brightness-95';
      case 'vintage':
        return 'sepia-50 contrast-125 brightness-105 saturate-125';
      case 'vivid':
        return 'saturate-200 contrast-110';
      default:
        return '';
    }
  };

  // Dragging custom text overlays
  const handleStartDragOverlay = (e: React.MouseEvent, overlayId: string) => {
    if (isPrintMode) return;
    e.stopPropagation();
    setDraggingOverlayId(overlayId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingOverlayId || !containerRef.current || isPrintMode) return;
    const rect = containerRef.current.getBoundingClientRect();
    let xPct = Math.min(92, Math.max(8, Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(1))));
    let yPct = Math.min(92, Math.max(8, Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(1))));

    if (snapEnabled) {
      const SNAP_THRESHOLD = 2.0; // % snap distance

      // Candidate Vertical (X) Targets
      const vTargets: SnapGuide[] = [
        { positionPct: 50, label: 'Center Vertical (50%)', type: 'center' },
        { positionPct: 12, label: 'Left Margin (12%)', type: 'margin' },
        { positionPct: 88, label: 'Right Margin (88%)', type: 'margin' },
        { positionPct: 33.3, label: '1/3 Grid Line', type: 'thirds' },
        { positionPct: 66.7, label: '2/3 Grid Line', type: 'thirds' },
      ];

      // Add X positions of other non-hidden overlays
      page.textOverlays.forEach((ov) => {
        if (ov.id !== draggingOverlayId && !ov.hidden) {
          const shortText = ov.text.length > 10 ? `${ov.text.slice(0, 10)}...` : ov.text;
          vTargets.push({
            positionPct: ov.xPct,
            label: `Aligned X with "${shortText || 'Element'}"`,
            type: 'element',
          });
        }
      });

      // Candidate Horizontal (Y) Targets
      const hTargets: SnapGuide[] = [
        { positionPct: 50, label: 'Center Horizontal (50%)', type: 'center' },
        { positionPct: 12, label: 'Top Margin (12%)', type: 'margin' },
        { positionPct: 88, label: 'Bottom Margin (88%)', type: 'margin' },
        { positionPct: 33.3, label: '1/3 Grid Line', type: 'thirds' },
        { positionPct: 66.7, label: '2/3 Grid Line', type: 'thirds' },
      ];

      // Add Y positions of other non-hidden overlays
      page.textOverlays.forEach((ov) => {
        if (ov.id !== draggingOverlayId && !ov.hidden) {
          const shortText = ov.text.length > 10 ? `${ov.text.slice(0, 10)}...` : ov.text;
          hTargets.push({
            positionPct: ov.yPct,
            label: `Aligned Y with "${shortText || 'Element'}"`,
            type: 'element',
          });
        }
      });

      // Find closest vertical match
      let closestV: SnapGuide | null = null;
      let minVDist = SNAP_THRESHOLD;
      vTargets.forEach((tg) => {
        const dist = Math.abs(xPct - tg.positionPct);
        if (dist < minVDist) {
          minVDist = dist;
          closestV = tg;
        }
      });

      if (closestV) {
        xPct = (closestV as SnapGuide).positionPct;
        setActiveVGuide(closestV);
      } else {
        setActiveVGuide(null);
      }

      // Find closest horizontal match
      let closestH: SnapGuide | null = null;
      let minHDist = SNAP_THRESHOLD;
      hTargets.forEach((tg) => {
        const dist = Math.abs(yPct - tg.positionPct);
        if (dist < minHDist) {
          minHDist = dist;
          closestH = tg;
        }
      });

      if (closestH) {
        yPct = (closestH as SnapGuide).positionPct;
        setActiveHGuide(closestH);
      } else {
        setActiveHGuide(null);
      }
    } else {
      setActiveVGuide(null);
      setActiveHGuide(null);
    }

    const updatedOverlays = page.textOverlays.map((ov) =>
      ov.id === draggingOverlayId ? { ...ov, xPct, yPct } : ov
    );
    onUpdatePage?.({ textOverlays: updatedOverlays });
  };

  const handleMouseUp = () => {
    if (draggingOverlayId) {
      setDraggingOverlayId(null);
      setActiveVGuide(null);
      setActiveHGuide(null);
    }
  };

  const handleSelectSlot = (slot: PhotoSlot) => {
    setActiveSlotId(slot.id);
    onSelectTextInfo?.({
      id: slot.id,
      type: 'slot',
      slot,
    });
  };

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        if (pageRef) pageRef(el);
      }}
      id={`a4-page-${page.pageNumber}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => onSelectTextInfo?.(null)}
      className="relative w-full aspect-[210/297] bg-white text-gray-900 shadow-2xl rounded-sm overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-10 border border-gray-200 font-sans select-none"
      style={{
        fontFamily: config.fontFamily || "'Playfair Display', serif",
      }}
    >
      {/* Canvas Header Line */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-gray-900 uppercase tracking-widest text-[10px] sm:text-xs font-bold text-gray-800">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 bg-gray-900 text-white rounded text-[9px] font-mono">
            A4 PRINT
          </span>
          <span
            contentEditable={!isPrintMode}
            suppressContentEditableWarning
            onClick={(e) => {
              e.stopPropagation();
              onSelectTextInfo?.({
                id: 'config.title',
                type: 'config_title',
                text: config.title,
                fontSize: 12,
                fontFamily: config.fontFamily,
                color: '#111827',
              });
            }}
            onBlur={(e) =>
              onUpdateConfig?.({ title: e.currentTarget.textContent || '' })
            }
            className={`font-serif tracking-wider truncate max-w-[180px] sm:max-w-[240px] px-1 rounded hover:bg-gray-100 ${
              selectedTextInfo?.id === 'config.title'
                ? 'ring-2 ring-luxury-gold bg-luxury-gold/10'
                : ''
            }`}
          >
            {config.title || 'THE PHOTO MAGAZINE'}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[9px] text-gray-600">
          {!isPrintMode && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSnapEnabled(!snapEnabled);
              }}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-sans font-medium transition-colors cursor-pointer ${
                snapEnabled
                  ? 'bg-luxury-gold/20 text-luxury-accent border-luxury-gold'
                  : 'bg-gray-100 text-gray-400 border-gray-300'
              }`}
              title={snapEnabled ? 'Magnetic Snapping Active' : 'Enable Magnetic Alignment Snapping'}
            >
              <Magnet className={`w-3 h-3 ${snapEnabled ? 'text-luxury-gold' : 'text-gray-400'}`} />
              <span className="hidden xs:inline">{snapEnabled ? 'Snap On' : 'Snap Off'}</span>
            </button>
          )}
          <span
            contentEditable={!isPrintMode}
            suppressContentEditableWarning
            onClick={(e) => {
              e.stopPropagation();
              onSelectTextInfo?.({
                id: 'config.dateString',
                type: 'config_subtitle',
                text: config.dateString,
                fontSize: 10,
                color: '#4B5563',
              });
            }}
            onBlur={(e) =>
              onUpdateConfig?.({ dateString: e.currentTarget.textContent || '' })
            }
            className="hover:bg-gray-100 px-1 rounded"
          >
            {config.dateString || 'ISSUE 01'}
          </span>
          <span className="font-bold text-gray-900">PAGE {page.pageNumber}</span>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 my-4 flex flex-col gap-4 overflow-hidden relative">
        {/* Cover Page Layout */}
        {page.layout === 'cover' && (
          <div className="h-full flex flex-col justify-between space-y-4">
            {/* Title / Header Banner */}
            <div className="text-center space-y-2 pt-2">
              <span
                contentEditable={!isPrintMode}
                suppressContentEditableWarning
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTextInfo?.({
                    id: 'config.subtitle',
                    type: 'config_subtitle',
                    text: config.subtitle,
                    fontSize: 11,
                    color: '#B45309',
                  });
                }}
                onBlur={(e) =>
                  onUpdateConfig?.({ subtitle: e.currentTarget.textContent || '' })
                }
                className="text-[10px] sm:text-xs tracking-[0.3em] font-sans uppercase text-amber-700 font-bold block hover:bg-amber-50 px-2 py-0.5 rounded cursor-text"
              >
                {config.subtitle || 'EXCLUSIVE PHOTO COLLECTION'}
              </span>

              <h1
                contentEditable={!isPrintMode}
                suppressContentEditableWarning
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTextInfo?.({
                    id: 'config.title',
                    type: 'config_title',
                    text: config.title,
                    fontSize: 36,
                    color: '#111827',
                  });
                }}
                onBlur={(e) =>
                  onUpdateConfig?.({ title: e.currentTarget.textContent || '' })
                }
                className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-gray-900 uppercase leading-none hover:bg-gray-50 p-1 rounded cursor-text"
              >
                {config.title || 'MINI MAGAZINE'}
              </h1>

              <p
                contentEditable={!isPrintMode}
                suppressContentEditableWarning
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTextInfo?.({
                    id: 'page.editorialText',
                    type: 'editorial',
                    text: page.editorialText,
                    fontSize: 13,
                    color: '#4B5563',
                  });
                }}
                onBlur={(e) =>
                  onUpdatePage?.({ editorialText: e.currentTarget.textContent || '' })
                }
                className="text-xs sm:text-sm font-serif italic text-gray-600 max-w-md mx-auto hover:bg-gray-50 p-1 rounded cursor-text"
              >
                {page.editorialText || 'A curated showcase of timeless memories and moments.'}
              </p>
            </div>

            {/* Main Cover Slot */}
            {page.slots[0] && (
              <RenderSlot
                slot={page.slots[0]}
                isOver={dragOverSlotId === page.slots[0].id}
                isActive={activeSlotId === page.slots[0].id}
                onSelect={() => handleSelectSlot(page.slots[0])}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverSlotId(page.slots[0].id);
                }}
                onDragLeave={() => setDragOverSlotId(null)}
                onDrop={(e) => handleFileDrop(e, page.slots[0].id)}
                onFileInput={(e) => handleFileInput(e, page.slots[0].id)}
                onRemove={() => onSlotPhotoChanged(page.slots[0].id, null)}
                onZoomChange={(zoom) => onSlotZoomChanged?.(page.slots[0].id, zoom)}
                filterClass={getFilterClass(page.slots[0].filter)}
                isPrintMode={isPrintMode}
                className="flex-1 min-h-[260px] rounded border border-gray-300 overflow-hidden shadow-inner"
              />
            )}

            {/* Cover Footer Metadata */}
            <div className="flex items-center justify-between text-[10px] font-mono border-t border-gray-300 pt-3 text-gray-700">
              <div>EDITION: {config.issueNumber || 'LIMITED PRINT'}</div>
              <div>CURATED BY: {config.editorName || 'CREATOR'}</div>
            </div>
          </div>
        )}

        {/* Editorial Lead Spread */}
        {page.layout === 'editorial_spread' && (
          <div className="h-full grid grid-cols-12 gap-4">
            <div className="col-span-7 flex flex-col gap-2 h-full">
              {page.slots[0] && (
                <RenderSlot
                  slot={page.slots[0]}
                  isOver={dragOverSlotId === page.slots[0].id}
                  isActive={activeSlotId === page.slots[0].id}
                  onSelect={() => handleSelectSlot(page.slots[0])}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlotId(page.slots[0].id);
                  }}
                  onDragLeave={() => setDragOverSlotId(null)}
                  onDrop={(e) => handleFileDrop(e, page.slots[0].id)}
                  onFileInput={(e) => handleFileInput(e, page.slots[0].id)}
                  onRemove={() => onSlotPhotoChanged(page.slots[0].id, null)}
                  onZoomChange={(zoom) => onSlotZoomChanged?.(page.slots[0].id, zoom)}
                  filterClass={getFilterClass(page.slots[0].filter)}
                  isPrintMode={isPrintMode}
                  className="h-full rounded border border-gray-300 overflow-hidden"
                />
              )}
            </div>
            <div className="col-span-5 flex flex-col justify-between gap-3 h-full">
              {page.slots[1] && (
                <RenderSlot
                  slot={page.slots[1]}
                  isOver={dragOverSlotId === page.slots[1].id}
                  isActive={activeSlotId === page.slots[1].id}
                  onSelect={() => handleSelectSlot(page.slots[1])}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlotId(page.slots[1].id);
                  }}
                  onDragLeave={() => setDragOverSlotId(null)}
                  onDrop={(e) => handleFileDrop(e, page.slots[1].id)}
                  onFileInput={(e) => handleFileInput(e, page.slots[1].id)}
                  onRemove={() => onSlotPhotoChanged(page.slots[1].id, null)}
                  onZoomChange={(zoom) => onSlotZoomChanged?.(page.slots[1].id, zoom)}
                  filterClass={getFilterClass(page.slots[1].filter)}
                  isPrintMode={isPrintMode}
                  className="h-1/2 rounded border border-gray-300 overflow-hidden"
                />
              )}
              <div className="h-1/2 p-4 bg-gray-50 border border-gray-200 rounded flex flex-col justify-center text-center">
                <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 mb-1">
                  EDITORIAL NOTE
                </span>
                <p
                  contentEditable={!isPrintMode}
                  suppressContentEditableWarning
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTextInfo?.({
                      id: 'page.editorialText',
                      type: 'editorial',
                      text: page.editorialText,
                      fontSize: 13,
                      color: '#1F2937',
                    });
                  }}
                  onBlur={(e) =>
                    onUpdatePage?.({ editorialText: e.currentTarget.textContent || '' })
                  }
                  className="text-xs sm:text-sm font-serif italic text-gray-800 leading-relaxed hover:bg-gray-100 p-1 rounded cursor-text"
                >
                  {page.editorialText ||
                    '“Every photograph holds a story, every page turns into a timeless keepsake.”'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4-Photo Story Grid */}
        {page.layout === 'quad_grid' && (
          <div className="h-full grid grid-cols-2 grid-rows-2 gap-3">
            {page.slots.map((slot) => (
              <RenderSlot
                key={slot.id}
                slot={slot}
                isOver={dragOverSlotId === slot.id}
                isActive={activeSlotId === slot.id}
                onSelect={() => handleSelectSlot(slot)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverSlotId(slot.id);
                }}
                onDragLeave={() => setDragOverSlotId(null)}
                onDrop={(e) => handleFileDrop(e, slot.id)}
                onFileInput={(e) => handleFileInput(e, slot.id)}
                onRemove={() => onSlotPhotoChanged(slot.id, null)}
                onZoomChange={(zoom) => onSlotZoomChanged?.(slot.id, zoom)}
                filterClass={getFilterClass(slot.filter)}
                isPrintMode={isPrintMode}
                className="rounded border border-gray-300 overflow-hidden"
              />
            ))}
          </div>
        )}

        {/* Modern Bento Gallery */}
        {page.layout === 'bento_showcase' && (
          <div className="h-full flex flex-col gap-3">
            <div className="h-1/2">
              {page.slots[0] && (
                <RenderSlot
                  slot={page.slots[0]}
                  isOver={dragOverSlotId === page.slots[0].id}
                  isActive={activeSlotId === page.slots[0].id}
                  onSelect={() => handleSelectSlot(page.slots[0])}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlotId(page.slots[0].id);
                  }}
                  onDragLeave={() => setDragOverSlotId(null)}
                  onDrop={(e) => handleFileDrop(e, page.slots[0].id)}
                  onFileInput={(e) => handleFileInput(e, page.slots[0].id)}
                  onRemove={() => onSlotPhotoChanged(page.slots[0].id, null)}
                  onZoomChange={(zoom) => onSlotZoomChanged?.(page.slots[0].id, zoom)}
                  filterClass={getFilterClass(page.slots[0].filter)}
                  isPrintMode={isPrintMode}
                  className="h-full rounded border border-gray-300 overflow-hidden"
                />
              )}
            </div>
            <div className="h-1/2 grid grid-cols-2 gap-3">
              {page.slots[1] && (
                <RenderSlot
                  slot={page.slots[1]}
                  isOver={dragOverSlotId === page.slots[1].id}
                  isActive={activeSlotId === page.slots[1].id}
                  onSelect={() => handleSelectSlot(page.slots[1])}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlotId(page.slots[1].id);
                  }}
                  onDragLeave={() => setDragOverSlotId(null)}
                  onDrop={(e) => handleFileDrop(e, page.slots[1].id)}
                  onFileInput={(e) => handleFileInput(e, page.slots[1].id)}
                  onRemove={() => onSlotPhotoChanged(page.slots[1].id, null)}
                  onZoomChange={(zoom) => onSlotZoomChanged?.(page.slots[1].id, zoom)}
                  filterClass={getFilterClass(page.slots[1].filter)}
                  isPrintMode={isPrintMode}
                  className="h-full rounded border border-gray-300 overflow-hidden"
                />
              )}
              {page.slots[2] && (
                <RenderSlot
                  slot={page.slots[2]}
                  isOver={dragOverSlotId === page.slots[2].id}
                  isActive={activeSlotId === page.slots[2].id}
                  onSelect={() => handleSelectSlot(page.slots[2])}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlotId(page.slots[2].id);
                  }}
                  onDragLeave={() => setDragOverSlotId(null)}
                  onDrop={(e) => handleFileDrop(e, page.slots[2].id)}
                  onFileInput={(e) => handleFileInput(e, page.slots[2].id)}
                  onRemove={() => onSlotPhotoChanged(page.slots[2].id, null)}
                  onZoomChange={(zoom) => onSlotZoomChanged?.(page.slots[2].id, zoom)}
                  filterClass={getFilterClass(page.slots[2].filter)}
                  isPrintMode={isPrintMode}
                  className="h-full rounded border border-gray-300 overflow-hidden"
                />
              )}
            </div>
          </div>
        )}

        {/* Full Bleed Poster Page */}
        {page.layout === 'full_bleed' && page.slots[0] && (
          <div className="h-full rounded border border-gray-300 overflow-hidden">
            <RenderSlot
              slot={page.slots[0]}
              isOver={dragOverSlotId === page.slots[0].id}
              isActive={activeSlotId === page.slots[0].id}
              onSelect={() => handleSelectSlot(page.slots[0])}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverSlotId(page.slots[0].id);
              }}
              onDragLeave={() => setDragOverSlotId(null)}
              onDrop={(e) => handleFileDrop(e, page.slots[0].id)}
              onFileInput={(e) => handleFileInput(e, page.slots[0].id)}
              onRemove={() => onSlotPhotoChanged(page.slots[0].id, null)}
              onZoomChange={(zoom) => onSlotZoomChanged?.(page.slots[0].id, zoom)}
              filterClass={getFilterClass(page.slots[0].filter)}
              isPrintMode={isPrintMode}
              className="h-full w-full"
            />
          </div>
        )}

        {/* Back Cover Page */}
        {page.layout === 'back_cover' && (
          <div className="h-full flex flex-col justify-between space-y-3">
            <div className="text-center py-2 border-b border-gray-200">
              <h2
                contentEditable={!isPrintMode}
                suppressContentEditableWarning
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTextInfo?.({
                    id: 'page.title',
                    type: 'page_title',
                    text: page.title,
                    fontSize: 20,
                    color: '#111827',
                  });
                }}
                onBlur={(e) =>
                  onUpdatePage?.({ title: e.currentTarget.textContent || '' })
                }
                className="text-xl font-serif font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-100 p-1 rounded cursor-text"
              >
                {page.title || 'THANK YOU'}
              </h2>
              <p
                contentEditable={!isPrintMode}
                suppressContentEditableWarning
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTextInfo?.({
                    id: 'page.editorialText',
                    type: 'editorial',
                    text: page.editorialText,
                    fontSize: 12,
                    color: '#4B5563',
                  });
                }}
                onBlur={(e) =>
                  onUpdatePage?.({ editorialText: e.currentTarget.textContent || '' })
                }
                className="text-xs font-serif text-gray-600 hover:bg-gray-100 p-1 rounded cursor-text"
              >
                {page.editorialText || 'Created with love and saved for a lifetime.'}
              </p>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-2 my-2">
              {page.slots.map((slot) => (
                <RenderSlot
                  key={slot.id}
                  slot={slot}
                  isOver={dragOverSlotId === slot.id}
                  isActive={activeSlotId === slot.id}
                  onSelect={() => handleSelectSlot(slot)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlotId(slot.id);
                  }}
                  onDragLeave={() => setDragOverSlotId(null)}
                  onDrop={(e) => handleFileDrop(e, slot.id)}
                  onFileInput={(e) => handleFileInput(e, slot.id)}
                  onRemove={() => onSlotPhotoChanged(slot.id, null)}
                  onZoomChange={(zoom) => onSlotZoomChanged?.(slot.id, zoom)}
                  filterClass={getFilterClass(slot.filter)}
                  isPrintMode={isPrintMode}
                  className="rounded border border-gray-300 overflow-hidden"
                />
              ))}
            </div>

            {/* Barcode & Print Info Box */}
            <div className="p-3 bg-gray-100 rounded border border-gray-300 flex items-center justify-between font-mono text-[9px] text-gray-700">
              <div>
                <p className="font-bold">A4 PRINT EDITION</p>
                <p>Designed on Mini Magazine Studio</p>
              </div>
              <div className="text-right">
                <p className="tracking-widest font-bold">||| | |||| | || |||</p>
                <p>{config.issueNumber || 'PRINT-2026'}</p>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM CANVA TEXT OVERLAYS LAYER */}
        {page.textOverlays.map((overlay) => {
          const isSelected = selectedTextInfo?.id === overlay.id;

          return (
            <div
              key={overlay.id}
              style={{
                position: 'absolute',
                left: `${overlay.xPct}%`,
                top: `${overlay.yPct}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${overlay.fontSize}px`,
                fontFamily: overlay.fontFamily || 'inherit',
                color: overlay.color || '#111827',
                textAlign: overlay.align || 'left',
                fontWeight: overlay.fontWeight || 'normal',
                fontStyle: overlay.fontStyle || 'normal',
                zIndex: 30,
              }}
              className={`group/ov flex items-center gap-1.5 p-1 rounded cursor-grab active:cursor-grabbing transition-all select-none border ${
                isSelected
                  ? 'ring-2 ring-luxury-gold bg-luxury-gold/15 border-luxury-gold shadow-lg'
                  : 'hover:border-luxury-gold/40 hover:bg-black/5 border-transparent'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectTextInfo?.({
                  id: overlay.id,
                  type: 'overlay',
                  text: overlay.text,
                  fontSize: overlay.fontSize,
                  fontFamily: overlay.fontFamily,
                  color: overlay.color,
                  align: overlay.align,
                  fontWeight: overlay.fontWeight,
                  fontStyle: overlay.fontStyle,
                  overlay,
                });
              }}
              onMouseDown={(e) => handleStartDragOverlay(e, overlay.id)}
            >
              {!isPrintMode && (
                <div className="opacity-0 group-hover/ov:opacity-100 transition-opacity flex items-center">
                  <Move className="w-3 h-3 text-luxury-gold shrink-0 cursor-grab" />
                </div>
              )}

              <span
                contentEditable={!isPrintMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newText = e.currentTarget.textContent || '';
                  const updatedOverlays = page.textOverlays.map((ov) =>
                    ov.id === overlay.id ? { ...ov, text: newText } : ov
                  );
                  onUpdatePage?.({ textOverlays: updatedOverlays });
                }}
                className="outline-none"
              >
                {overlay.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Magnetic Snapping Guidelines Overlay */}
      {snapEnabled && activeVGuide && (
        <div
          className="absolute inset-y-0 pointer-events-none z-50 border-l-2 border-dashed border-cyan-500 shadow-xs"
          style={{ left: `${activeVGuide.positionPct}%` }}
        >
          <div className="absolute top-2 -translate-x-1/2 bg-cyan-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap">
            {activeVGuide.label}
          </div>
        </div>
      )}

      {snapEnabled && activeHGuide && (
        <div
          className="absolute inset-x-0 pointer-events-none z-50 border-t-2 border-dashed border-cyan-500 shadow-xs"
          style={{ top: `${activeHGuide.positionPct}%` }}
        >
          <div className="absolute left-2 -translate-y-1/2 bg-cyan-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap">
            {activeHGuide.label}
          </div>
        </div>
      )}

      {/* A4 Print Footer Indicator */}
      <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[9px] font-mono text-gray-500">
        <span>A4 DIMENSIONS (210mm x 297mm)</span>
        <span>PAGE {page.pageNumber}</span>
      </div>
    </div>
  );
}

interface RenderSlotProps {
  slot: PhotoSlot;
  isOver: boolean;
  isActive: boolean;
  onSelect: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onZoomChange?: (zoom: number) => void;
  filterClass: string;
  isPrintMode?: boolean;
  className?: string;
}

function RenderSlot({
  slot,
  isOver,
  isActive,
  onSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInput,
  onRemove,
  onZoomChange,
  filterClass,
  isPrintMode,
  className = '',
}: RenderSlotProps) {
  const currentZoom = slot.zoom || 1.0;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = Math.min(3.0, Number((currentZoom + 0.1).toFixed(2)));
    onZoomChange?.(next);
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = Math.max(1.0, Number((currentZoom - 0.1).toFixed(2)));
    onZoomChange?.(next);
  };

  return (
    <div
      onClick={onSelect}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative group bg-gray-50 flex items-center justify-center transition-all ${className} ${
        isOver
          ? 'ring-4 ring-luxury-gold bg-luxury-gold/10'
          : isActive
          ? 'ring-2 ring-luxury-accent'
          : 'hover:border-luxury-gold/50'
      }`}
    >
      {slot.src ? (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <img
            src={slot.src}
            alt={slot.caption || 'Slot photo'}
            className={`w-full h-full object-cover transition-transform duration-200 ease-out ${filterClass}`}
            style={{
              transform: `scale(${currentZoom})`,
            }}
          />

          {!isPrintMode && (
            <div className="absolute top-2 inset-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-1 bg-[#3D1E30]/90 text-white p-1.5 rounded-lg backdrop-blur-md z-10 shadow-lg">
              {/* Zoom controls */}
              <div
                className="flex items-center gap-1 flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={currentZoom <= 1.0}
                  className="p-1 hover:bg-white/20 rounded disabled:opacity-30 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>

                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.05"
                  value={currentZoom}
                  onChange={(e) => onZoomChange?.(parseFloat(e.target.value))}
                  className="w-16 sm:w-20 accent-luxury-gold cursor-pointer h-1"
                  title="Crop / Scale Photo"
                />

                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={currentZoom >= 3.0}
                  className="p-1 hover:bg-white/20 rounded disabled:opacity-30 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>

                <span className="text-[9px] font-mono text-luxury-gold font-bold ml-1 min-w-[32px]">
                  {Math.round(currentZoom * 100)}%
                </span>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-1 text-red-400 hover:text-red-200 hover:bg-white/10 rounded transition-colors"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {slot.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-[10px] font-sans truncate text-center">
              {slot.caption}
            </div>
          )}
        </div>
      ) : (
        <label className="w-full h-full flex flex-col items-center justify-center p-3 cursor-pointer text-center text-gray-400 hover:text-luxury-accent transition-colors">
          <input type="file" accept="image/*" className="hidden" onChange={onFileInput} />
          <Upload className="w-5 h-5 mb-1 text-gray-400 group-hover:text-luxury-gold transition-colors" />
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
            {isOver ? 'Drop Photo' : 'Upload Photo'}
          </span>
          <span className="text-[9px] text-gray-400">or drag & drop</span>
        </label>
      )}
    </div>
  );
}
