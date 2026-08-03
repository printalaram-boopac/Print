import { useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { FONTS } from '../constants';
import type { StoryTemplate } from '../storyTemplates';
import type { ChapterCopy } from '../storyTemplates';
import type { ZinePage } from '../types';

// Converts a "logical px against an 800px-wide reference" size (the same
// convention the freeform text stickers already use) into a container-query
// width unit, so decorative text scales correctly whether the tile renders
// tiny in the page grid or large in a captured/printed page.
const cqw = (logicalPx: number) => `${(logicalPx / 800) * 100}cqw`;

interface StoryPageTileProps {
  template: StoryTemplate;
  page: ZinePage;
  index: number;
  relationshipName: string;
  chapterCopy?: ChapterCopy;
  captureRef: (el: HTMLDivElement | null) => void;
  fileInputRef: (el: HTMLInputElement | null) => void;
  setPasteTargetPage: (i: number) => void;
  handleFileSelect: (index: number, fileList: FileList | File[] | null) => void;
  handlePageDragOver: (e: React.DragEvent, index: number) => void;
  setDragOverPage: (updater: (prev: number | null) => number | null) => void;
  handlePageDrop: (e: React.DragEvent, index: number) => void;
  dragOverPage: number | null;
  beginDrag: (e: React.PointerEvent, kind: 'photo' | 'sticker', pageIndex: number, id: string, mode: 'move' | 'resize') => void;
  handleDragMove: (e: React.PointerEvent, pageIndex: number) => void;
  handleDragEnd: (e: React.PointerEvent) => void;
  removePhoto: (pageIndex: number, photoId: string) => void;
  removeSticker: (pageIndex: number, stickerId: string) => void;
}

export function StoryPageTile({
  template,
  page,
  index: i,
  relationshipName,
  chapterCopy,
  captureRef,
  fileInputRef,
  setPasteTargetPage,
  handleFileSelect,
  handlePageDragOver,
  setDragOverPage,
  handlePageDrop,
  dragOverPage,
  beginDrag,
  handleDragMove,
  handleDragEnd,
  removePhoto,
  removeSticker,
}: StoryPageTileProps) {
  const inputElRef = useRef<HTMLInputElement | null>(null);
  const name = relationshipName.trim();
  const year = new Date().getFullYear();

  return (
    <div className="space-y-1.5">
      <input
        ref={(el) => {
          inputElRef.current = el;
          fileInputRef(el);
        }}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          handleFileSelect(i, e.target.files);
          e.target.value = '';
        }}
      />
      <div
        ref={captureRef}
        onDragOver={(e) => handlePageDragOver(e, i)}
        onDragLeave={() => setDragOverPage((prev) => (prev === i ? null : prev))}
        onDrop={(e) => handlePageDrop(e, i)}
        className={`relative w-full aspect-[3/4] rounded-lg border overflow-hidden bg-white group transition-colors ${
          dragOverPage === i ? 'border-luxury-gold ring-2 ring-luxury-gold/40' : 'border-gold-200/60'
        }`}
        style={{ containerType: 'inline-size' } as React.CSSProperties}
      >
        {/* Decorative, template-specific copy */}
        {template.kind === 'cover-thankyou' && (
          <>
            <div className="absolute top-[4%] inset-x-0 text-center px-[6%]">
              <p style={{ fontSize: cqw(11) }} className="tracking-[0.3em] text-luxury-gold font-bold uppercase">The Best Memories</p>
              <h1 style={{ fontSize: cqw(34) }} className="font-display font-bold text-luxury-accent mt-1">
                THANK YOU<span className="text-luxury-gold">♥</span>
              </h1>
              <p style={{ fontSize: cqw(10) }} className="text-gray-500 uppercase tracking-wide mt-1 leading-snug">
                For being such an important part of my life and my memories.
              </p>
            </div>
            <div className="absolute bottom-[3%] inset-x-0 text-center px-[6%] space-y-0.5">
              <p style={{ fontSize: cqw(11) }} className="italic text-luxury-accent">&ldquo;Families are connected by love, not distance.&rdquo;</p>
              <p style={{ fontSize: cqw(9) }} className="text-gray-400 uppercase tracking-widest">Created Especially For You</p>
            </div>
          </>
        )}

        {template.kind === 'cover-title' && (
          <div className="absolute top-[4%] inset-x-0 text-center px-[6%]">
            <p style={{ fontSize: cqw(10) }} className="tracking-[0.3em] text-luxury-gold font-semibold uppercase">Especially Made For</p>
            <h1 style={{ fontSize: cqw(30) }} className="font-display font-bold mt-1 leading-tight">
              <span className="text-luxury-accent">FOR MY </span>
              <span className="text-luxury-gold">{(name || 'YOU').toUpperCase()}♥</span>
            </h1>
            <p style={{ fontSize: cqw(10) }} className="text-gray-500 uppercase tracking-wide mt-1 leading-snug">
              A collection of memories, laughter &amp; unforgettable moments.
            </p>
            <p style={{ fontSize: cqw(9) }} className="text-gray-400 mt-2">{year}</p>
          </div>
        )}

        {template.kind === 'chapter' && (
          <div className="absolute inset-0 px-[6%] py-[5%] pointer-events-none">
            <p style={{ fontSize: cqw(9) }} className="tracking-[0.2em] text-luxury-gold font-bold uppercase">{template.chapterNumber}</p>
            <h2 style={{ fontSize: cqw(24) }} className="font-display font-bold text-luxury-accent leading-tight mt-1 max-w-[52%]">
              {(chapterCopy?.title || '').split('{name}').map((part, idx, arr) => (
                <span key={idx}>
                  {part}
                  {idx < arr.length - 1 && <span className="text-luxury-gold">{name || 'Friend'}</span>}
                </span>
              ))}
              {chapterCopy?.title.includes('{name}') && '...'}
            </h2>
            {chapterCopy?.subtitle && (
              <p style={{ fontSize: cqw(9) }} className="text-gray-500 uppercase tracking-wide mt-1 max-w-[48%] leading-snug">{chapterCopy.subtitle}</p>
            )}
            <p style={{ fontSize: cqw(10) }} className="italic text-luxury-accent mt-2 max-w-[45%] leading-snug">&ldquo;{chapterCopy?.quote}&rdquo;</p>
          </div>
        )}

        {/* Photo slots */}
        {template.slots.map((slot, slotIndex) => {
          const photo = page.photos[slotIndex];
          return (
            <div
              key={slot.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${slot.xPct}%`,
                top: `${slot.yPct}%`,
                width: `${slot.widthPct}%`,
                height: `${slot.heightPct}%`,
                transform: `translate(-50%, -50%) rotate(${slot.rotateDeg || 0}deg)`,
              }}
            >
              {photo ? (
                <div
                  onPointerDown={(e) => beginDrag(e, 'photo', i, photo.id, 'move')}
                  onPointerMove={(e) => handleDragMove(e, i)}
                  onPointerUp={handleDragEnd}
                  className="relative w-full h-full cursor-move"
                  style={{ touchAction: 'none' }}
                >
                  <img src={photo.src} alt="" className="w-full h-full object-cover rounded-[2px] border-2 border-luxury-gold shadow-md pointer-events-none" draggable={false} />
                  <span
                    role="button"
                    tabIndex={0}
                    data-pdf-hide="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(i, photo.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove photo"
                  >
                    <X className="w-2.5 h-2.5" />
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    data-pdf-hide="true"
                    onPointerDown={(e) => beginDrag(e, 'photo', i, photo.id, 'resize')}
                    className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full bg-luxury-gold border border-white opacity-0 group-hover:opacity-100 transition-opacity cursor-nwse-resize"
                    style={{ touchAction: 'none' }}
                    aria-label="Resize photo"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  data-pdf-hide="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPasteTargetPage(i);
                    inputElRef.current?.click();
                  }}
                  className="w-full h-full rounded-[2px] border-2 border-dashed border-gold-200 hover:border-luxury-gold flex items-center justify-center bg-luxury-dark/[0.02] cursor-pointer transition-colors"
                  aria-label={`Add photo${slot.label ? ` for ${slot.label}` : ''}`}
                >
                  <Plus className="text-gray-300" style={{ width: cqw(16), height: cqw(16) }} strokeWidth={2} />
                </button>
              )}
              {slot.label && (
                <p style={{ fontSize: cqw(9) }} className="absolute -bottom-[14%] inset-x-0 text-center text-luxury-gold italic font-medium">
                  {slot.icon && <slot.icon className="inline w-3 h-3 mr-1 -mt-0.5" strokeWidth={2} />}
                  {slot.label}
                </p>
              )}
            </div>
          );
        })}

        {/* Extra freely-placed text, added via "Add Text" — on top of the fixed design */}
        {page.stickers.map((s) => (
          <div
            key={s.id}
            onPointerDown={(e) => beginDrag(e, 'sticker', i, s.id, 'move')}
            onPointerMove={(e) => handleDragMove(e, i)}
            onPointerUp={handleDragEnd}
            className="absolute -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap cursor-move z-30 font-bold"
            style={{
              left: `${s.xPct}%`,
              top: `${s.yPct}%`,
              fontSize: cqw(s.fontSizePx),
              touchAction: 'none',
              fontFamily: FONTS.find((f) => f.label === s.font)?.family,
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              ...(s.colorMode === 'gradient'
                ? {
                    backgroundImage: `linear-gradient(90deg, ${s.gradientFrom}, ${s.gradientTo})`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }
                : { color: s.color }),
            }}
          >
            {s.content}
            <span
              role="button"
              tabIndex={0}
              data-pdf-hide="true"
              onClick={(e) => {
                e.stopPropagation();
                removeSticker(i, s.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove sticker"
            >
              <X className="w-2.5 h-2.5" />
            </span>
            <span
              role="button"
              tabIndex={0}
              data-pdf-hide="true"
              onPointerDown={(e) => beginDrag(e, 'sticker', i, s.id, 'resize')}
              className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-luxury-gold border border-white opacity-0 group-hover:opacity-100 transition-opacity cursor-nwse-resize"
              style={{ touchAction: 'none' }}
              aria-label="Resize text"
            />
          </div>
        ))}
      </div>
      <p className="text-[10px] text-center text-gray-500 font-medium">
        Page {i + 1}
      </p>
    </div>
  );
}
