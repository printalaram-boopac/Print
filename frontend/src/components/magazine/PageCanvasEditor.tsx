import { useEffect, useRef, useState } from 'react';
import {
  Plus, Trash2, RefreshCw, RotateCw, AlignLeft, AlignCenter, AlignRight, ImagePlus,
  MousePointerClick, ChevronLeft, ChevronRight, ZoomIn, X,
} from 'lucide-react';
import type { MagazinePage, PhotoElement, TextElement } from '@/lib/magazine/types';
import { useElementTransform } from '@/lib/magazine/useElementTransform';
import { FONTS, fontFamilyFor } from '@/lib/magazine/fonts';
import { SAFE_AREA_PCT } from '@/lib/magazine/renderPage';

const TEXT_COLORS = ['#FFFFFF', '#000000', '#2A2320', '#D4AF37', '#C7D9EE'];
const BASE_CANVAS_WIDTH = 520;
const MIN_ZOOM = 50;
const MAX_ZOOM = 150;

interface PageCanvasEditorProps {
  page: MagazinePage;
  pageNumber: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onUpdatePhoto: (photoId: string, patch: Partial<PhotoElement>) => void;
  onUpdateText: (textId: string, patch: Partial<TextElement>) => void;
  onAddPhoto: () => void;
  onAddText: () => void;
  onRemovePhoto: (photoId: string) => void;
  onRemoveText: (textId: string) => void;
  onReplacePhotoFile: (photoId: string, file: File | undefined) => void;
}

type Selection = { kind: 'photo' | 'text'; id: string } | null;

export default function PageCanvasEditor({
  page, pageNumber, totalPages, onPrevPage, onNextPage,
  onUpdatePhoto, onUpdateText, onAddPhoto, onAddText, onRemovePhoto, onRemoveText, onReplacePhotoFile,
}: PageCanvasEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Selection>(null);
  const [zoom, setZoom] = useState(70);
  const [pendingUpload, setPendingUpload] = useState(false);
  const prevPhotoCount = useRef(page.photos.length);
  const prevTextCount = useRef(page.texts.length);

  useEffect(() => {
    setSelected(null);
    prevPhotoCount.current = page.photos.length;
    prevTextCount.current = page.texts.length;
  }, [page.index]);

  // Auto-select a newly added element — otherwise it can land exactly on top of
  // an existing element's default center position and look like nothing happened.
  useEffect(() => {
    if (page.photos.length > prevPhotoCount.current) {
      setSelected({ kind: 'photo', id: page.photos[page.photos.length - 1].id });
    }
    prevPhotoCount.current = page.photos.length;
  }, [page.photos.length]);

  useEffect(() => {
    if (page.texts.length > prevTextCount.current) {
      setSelected({ kind: 'text', id: page.texts[page.texts.length - 1].id });
    }
    prevTextCount.current = page.texts.length;
  }, [page.texts.length]);

  const selectedPhoto = selected?.kind === 'photo' ? page.photos.find((p) => p.id === selected.id) || null : null;
  const selectedText = selected?.kind === 'text' ? page.texts.find((t) => t.id === selected.id) || null : null;

  // Clicking an empty photo placeholder selects it (mounting its Upload button
  // + file input in the sidebar) and immediately opens the file picker, once
  // that input has actually mounted.
  useEffect(() => {
    if (pendingUpload && selectedPhoto) {
      fileInputRef.current?.click();
      setPendingUpload(false);
    }
  }, [pendingUpload, selectedPhoto]);

  return (
    <div className="flex flex-col md:flex-row h-full min-h-0">
      {/* Left sidebar — tools */}
      <aside data-lenis-prevent className="w-full md:w-72 flex-shrink-0 overflow-y-auto border-b md:border-b-0 md:border-r border-gold-200/20 p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onAddPhoto}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-200/40 text-[11px] font-semibold text-luxury-accent hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" strokeWidth={2} /> Add Photo
          </button>
          <button
            onClick={onAddText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-200/40 text-[11px] font-semibold text-luxury-accent hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" strokeWidth={2} /> Add Text
          </button>
        </div>

        <div className="border-t border-gold-200/20 pt-4">
          {selectedPhoto && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-luxury-gold uppercase tracking-wider">Photo</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-200/40 text-[11px] font-semibold text-luxury-accent hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" strokeWidth={2} /> {selectedPhoto.imgSrc ? 'Replace' : 'Upload'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onReplacePhotoFile(selectedPhoto.id, e.target.files?.[0])}
              />
              {!selectedPhoto.isFullBleed && (
                <label className="flex items-center justify-between gap-2 text-xs text-gray-400">
                  Rounded
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={selectedPhoto.rounded}
                    onChange={(e) => onUpdatePhoto(selectedPhoto.id, { rounded: Number(e.target.value) })}
                    className="w-28 accent-luxury-gold"
                  />
                </label>
              )}
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPhoto.isFullBleed}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onUpdatePhoto(selectedPhoto.id, { isFullBleed: true, xPct: 50, yPct: 50, widthPct: 100, heightPct: 100, rotationDeg: 0 });
                    } else {
                      onUpdatePhoto(selectedPhoto.id, { isFullBleed: false });
                    }
                  }}
                  className="w-4 h-4 accent-luxury-gold cursor-pointer"
                />
                Full Bleed
              </label>
              <button
                onClick={() => { onRemovePhoto(selectedPhoto.id); setSelected(null); }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-red-600 text-[11px] font-semibold hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" strokeWidth={2} /> Delete
              </button>
            </div>
          )}

          {selectedText && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-luxury-gold uppercase tracking-wider">Text</span>
              <select
                value={selectedText.font}
                onChange={(e) => onUpdateText(selectedText.id, { font: e.target.value })}
                className="w-full bg-luxury-dark border border-gold-200/40 rounded-lg px-2 py-1.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold"
              >
                {FONTS.map((f) => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
              </select>
              <label className="flex items-center justify-between gap-2 text-xs text-gray-400">
                Size
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={Math.round(selectedText.fontSizePct)}
                  onChange={(e) => onUpdateText(selectedText.id, { fontSizePct: Number(e.target.value) })}
                  className="w-28 accent-luxury-gold"
                />
              </label>
              <div className="flex items-center gap-1">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => onUpdateText(selectedText.id, { color: c })}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer ${selectedText.color === c ? 'border-luxury-gold' : 'border-gold-200/30'}`}
                    style={{ background: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                {([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]] as const).map(([val, Icon]) => (
                  <button
                    key={val}
                    onClick={() => onUpdateText(selectedText.id, { align: val })}
                    className={`p-1.5 rounded-lg cursor-pointer ${selectedText.align === val ? 'bg-luxury-gold text-white' : 'bg-luxury-dark text-gray-400 border border-gold-200/30'}`}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                ))}
              </div>
              <button
                onClick={() => { onRemoveText(selectedText.id); setSelected(null); }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-red-600 text-[11px] font-semibold hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" strokeWidth={2} /> Delete
              </button>
            </div>
          )}

          {!selectedPhoto && !selectedText && (
            <div className="flex flex-col items-center text-center gap-2 py-6 text-gray-500">
              <MousePointerClick className="w-5 h-5" strokeWidth={1.5} />
              <p className="text-xs">Select a photo or text element to edit it.</p>
            </div>
          )}
        </div>

        {/* Text content list — easier for longer passages than editing in-place */}
        <div className="border-t border-gold-200/20 pt-4 space-y-3">
          <span className="text-xs font-bold text-luxury-gold uppercase tracking-wider">Text Content</span>
          {page.texts.map((t) => (
            <div key={t.id} onClick={() => setSelected({ kind: 'text', id: t.id })} className="space-y-1 cursor-text">
              <span className="text-[11px] uppercase tracking-wide text-gray-400">
                {t.role === 'chapterLabel' ? 'Chapter Label' : t.role}
              </span>
              {t.role === 'quote' && page.pageType === 'letter' ? (
                <textarea
                  value={t.text}
                  onChange={(e) => onUpdateText(t.id, { text: e.target.value })}
                  onFocus={() => setSelected({ kind: 'text', id: t.id })}
                  rows={5}
                  className="w-full bg-luxury-dark border border-gold-200/40 rounded-lg px-3 py-2 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold"
                />
              ) : (
                <input
                  type="text"
                  value={t.text}
                  onChange={(e) => onUpdateText(t.id, { text: e.target.value })}
                  onFocus={() => setSelected({ kind: 'text', id: t.id })}
                  className="w-full bg-luxury-dark border border-gold-200/40 rounded-lg px-3 py-2 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold"
                />
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Center — canvas + bottom bar */}
      <main className="flex-1 flex flex-col min-h-0">
        <div data-lenis-prevent className="flex-1 flex items-center justify-center overflow-auto p-4">
          <div
            ref={containerRef}
            onPointerDown={() => setSelected(null)}
            className="relative overflow-hidden rounded-xl border border-gold-200/30 select-none flex-shrink-0"
            style={{ aspectRatio: '210 / 297', width: `${BASE_CANVAS_WIDTH * (zoom / 100)}px`, maxWidth: '100%', backgroundColor: page.bgColor, containerType: 'size' }}
          >
            <div className="absolute pointer-events-none border border-dashed border-white/25" style={{ inset: `${SAFE_AREA_PCT * 100}%` }} />

            {page.photos.map((photo) => (
              <PhotoElementView
                key={photo.id}
                photo={photo}
                containerRef={containerRef}
                selected={selected?.kind === 'photo' && selected.id === photo.id}
                onSelect={() => setSelected({ kind: 'photo', id: photo.id })}
                onDelete={() => { onRemovePhoto(photo.id); setSelected(null); }}
                onRequestUpload={() => setPendingUpload(true)}
                onChange={(patch) => onUpdatePhoto(photo.id, patch)}
              />
            ))}
            {page.texts.map((t) => (
              <TextElementView
                key={t.id}
                text={t}
                containerRef={containerRef}
                selected={selected?.kind === 'text' && selected.id === t.id}
                onSelect={() => setSelected({ kind: 'text', id: t.id })}
                onDelete={() => { onRemoveText(t.id); setSelected(null); }}
                onChange={(patch) => onUpdateText(t.id, patch)}
              />
            ))}
          </div>
        </div>

        {/* Bottom bar — zoom + page navigator */}
        <div className="flex items-center justify-between gap-3 px-4 py-2 border-t border-gold-200/20 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-3.5 h-3.5" strokeWidth={2} />
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={10}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-24 accent-luxury-gold"
            />
            <span className="w-10 text-right">{zoom}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevPage}
              disabled={pageNumber <= 1}
              className="p-1.5 rounded-full border border-gold-200/40 text-luxury-accent disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-luxury-gold hover:enabled:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <span>Page {pageNumber} of {totalPages}</span>
            <button
              onClick={onNextPage}
              disabled={pageNumber >= totalPages}
              className="p-1.5 rounded-full border border-gold-200/40 text-luxury-accent disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-luxury-gold hover:enabled:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function PhotoElementView({
  photo, containerRef, selected, onSelect, onDelete, onRequestUpload, onChange,
}: {
  photo: PhotoElement;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRequestUpload: () => void;
  onChange: (patch: Partial<PhotoElement>) => void;
}) {
  const { onDragPointerDown, onResizePointerDown, onRotatePointerDown } = useElementTransform({
    containerRef,
    value: photo,
    onChange,
  });

  const left = photo.isFullBleed ? 0 : photo.xPct - photo.widthPct / 2;
  const top = photo.isFullBleed ? 0 : photo.yPct - photo.heightPct / 2;
  const width = photo.isFullBleed ? 100 : photo.widthPct;
  const height = photo.isFullBleed ? 100 : photo.heightPct;

  return (
    <div
      role="button"
      aria-label={`Photo element${photo.isFullBleed ? ' (hero)' : ''}`}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
        if (!photo.isFullBleed) onDragPointerDown(e);
      }}
      onClick={(e) => {
        if (!photo.imgSrc) {
          e.stopPropagation();
          onRequestUpload();
        }
      }}
      className={`absolute ${photo.isFullBleed ? '' : 'cursor-move'} ${selected ? 'ring-2 ring-luxury-gold' : ''}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: photo.isFullBleed ? undefined : `rotate(${photo.rotationDeg}deg)`,
        zIndex: selected ? 50 : undefined,
      }}
    >
      <div className="w-full h-full overflow-hidden" style={{ borderRadius: photo.isFullBleed ? 0 : `${photo.rounded}%` }}>
        {photo.imgSrc ? (
          <img src={photo.imgSrc} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F3EAE1] border-2 border-dashed border-[#C9A876] box-border">
            <ImagePlus className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {selected && !photo.isFullBleed && (
        <>
          <div
            role="button"
            aria-label="Resize photo"
            onPointerDown={(e) => { e.stopPropagation(); onResizePointerDown(e); }}
            onClick={(e) => e.stopPropagation()}
            className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-luxury-gold border-2 border-white cursor-se-resize"
          />
          <div
            role="button"
            aria-label="Rotate photo"
            onPointerDown={(e) => { e.stopPropagation(); onRotatePointerDown(e); }}
            onClick={(e) => e.stopPropagation()}
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-luxury-gold border-2 border-white cursor-grab flex items-center justify-center"
          >
            <RotateCw className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
          </div>
          <button
            type="button"
            aria-label="Delete photo"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-white border border-gold-200/60 shadow-sm cursor-pointer flex items-center justify-center hover:bg-red-50"
          >
            <X className="w-3 h-3 text-red-500" strokeWidth={2.5} />
          </button>
        </>
      )}
    </div>
  );
}

function TextElementView({
  text, containerRef, selected, onSelect, onDelete, onChange,
}: {
  text: TextElement;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onChange: (patch: Partial<TextElement>) => void;
}) {
  const { onDragPointerDown, onRotatePointerDown } = useElementTransform({
    containerRef,
    value: text,
    onChange,
  });

  const alignOffset = text.align === 'center' ? '-50%' : text.align === 'right' ? '-100%' : '0';

  return (
    <div
      role="button"
      aria-label={`Text element (${text.role})`}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
        onDragPointerDown(e);
      }}
      className={`absolute cursor-move whitespace-pre-wrap ${selected ? 'ring-2 ring-luxury-gold' : ''}`}
      style={{
        left: `${text.xPct}%`,
        top: `${text.yPct}%`,
        transformOrigin: '0 0',
        transform: `rotate(${text.rotationDeg}deg) translate(${alignOffset}, 0)`,
        fontFamily: fontFamilyFor(text.font),
        fontSize: `${text.fontSizePct}cqh`,
        fontWeight: text.role === 'title' ? 700 : text.role === 'chapterLabel' ? 600 : 400,
        letterSpacing: text.role === 'title' ? '-0.01em' : text.role === 'chapterLabel' ? '0.12em' : undefined,
        textTransform: text.role === 'chapterLabel' ? 'uppercase' : undefined,
        color: text.color,
        textAlign: text.align,
        maxWidth: text.role === 'quote' ? '80%' : '90%',
        zIndex: selected ? 50 : undefined,
      }}
    >
      {text.text || '(empty)'}
      {selected && (
        <>
          <div
            onPointerDown={(e) => { e.stopPropagation(); onRotatePointerDown(e); }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-luxury-gold border-2 border-white cursor-grab flex items-center justify-center"
          >
            <RotateCw className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
          </div>
          <button
            type="button"
            aria-label="Delete text"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-white border border-gold-200/60 shadow-sm cursor-pointer flex items-center justify-center hover:bg-red-50"
          >
            <X className="w-3 h-3 text-red-500" strokeWidth={2.5} />
          </button>
        </>
      )}
    </div>
  );
}
