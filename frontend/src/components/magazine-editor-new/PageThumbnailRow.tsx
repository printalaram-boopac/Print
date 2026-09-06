import { useRef, useState } from 'react';
import {
  GripVertical, MoreHorizontal, Copy, Trash2, Pencil, ChevronUp, ChevronDown,
  Plus, ClipboardPaste, Settings2, Lock,
} from 'lucide-react';
import type { PageRole, TemplateDimensions, TemplatePage } from '@/lib/magazine-editor-new/types';
import { pageRoleLabel } from '@/lib/magazine-editor-new/pageHelpers';
import MiniPageThumbnail from './MiniPageThumbnail';

interface PageThumbnailRowProps {
  page: TemplatePage;
  index: number;
  role: PageRole;
  dimensions: TemplateDimensions;
  gradient: string;
  selected: boolean;
  canPaste: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  dropIndicator: 'before' | 'after' | null;
  onSelect: (e: React.MouseEvent) => void;
  onRename: (name: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBefore: () => void;
  onAddAfter: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onOpenSettings: () => void;
  onDragStart: () => void;
  onDragOverRow: (edge: 'before' | 'after') => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

export default function PageThumbnailRow({
  page, index, role, dimensions, gradient, selected, canPaste, canMoveUp, canMoveDown, dropIndicator,
  onSelect, onRename, onDuplicate, onDelete, onMoveUp, onMoveDown, onAddBefore, onAddAfter, onCopy, onPaste,
  onOpenSettings, onDragStart, onDragOverRow, onDrop, onDragEnd,
}: PageThumbnailRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(page.name);
  const rowRef = useRef<HTMLDivElement>(null);
  const isCoverLike = page.kind === 'cover' || page.kind === 'back-cover';

  const commitRename = () => {
    setRenaming(false);
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== page.name) onRename(trimmed);
    else setNameDraft(page.name);
  };

  return (
    <div
      ref={rowRef}
      className="relative"
      onDragOver={(e) => {
        e.preventDefault();
        const rect = rowRef.current?.getBoundingClientRect();
        if (!rect) return;
        onDragOverRow(e.clientY - rect.top < rect.height / 2 ? 'before' : 'after');
      }}
      onDrop={(e) => { e.preventDefault(); onDrop(); }}
    >
      {dropIndicator === 'before' && <div className="absolute -top-1.5 left-0 right-0 h-0.5 rounded-full bg-[#B8895A]" />}

      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(e as unknown as React.MouseEvent); } }}
        aria-current={selected}
        aria-label={`Page ${index + 1}, ${page.name}${selected ? ', selected' : ''}`}
        className="group w-full flex items-start gap-1.5 text-left cursor-pointer"
      >
        <div
          draggable
          onDragStart={(e) => { e.stopPropagation(); onDragStart(); }}
          onDragEnd={onDragEnd}
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder"
          className="mt-1 text-[#D6D6D2] group-hover:text-[#6F7478] cursor-grab active:cursor-grabbing flex-shrink-0"
        >
          <GripVertical className="w-3.5 h-3.5" strokeWidth={1.75} />
        </div>

        <span className="text-[11px] text-[#6F7478] w-4 flex-shrink-0 mt-1.5">{index + 1}</span>

        <div className="flex-1 min-w-0">
          <div className={`rounded-md overflow-hidden border-2 transition-colors relative ${selected ? 'border-[#20272C]' : 'border-transparent group-hover:border-[#E7E7E4]'}`}>
            <div className="w-full border border-[#E7E7E4]" style={{ aspectRatio: `${dimensions.widthMm} / ${dimensions.heightMm}` }}>
              <MiniPageThumbnail page={page} dimensions={dimensions} gradient={gradient} isCoverLike={isCoverLike} />
            </div>
            {page.locked && (
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/50 flex items-center justify-center">
                <Lock className="w-2.5 h-2.5 text-white" strokeWidth={2} />
              </div>
            )}
            <div className="absolute top-1 left-1 hidden group-hover:flex items-center gap-0.5">
              <button
                type="button"
                aria-label="Duplicate page"
                onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                className="w-5 h-5 rounded bg-white/90 flex items-center justify-center text-[#1C2024] hover:bg-white cursor-pointer shadow-sm"
              >
                <Copy className="w-3 h-3" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label="More page actions"
                onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
                className="w-5 h-5 rounded bg-white/90 flex items-center justify-center text-[#1C2024] hover:bg-white cursor-pointer shadow-sm"
              >
                <MoreHorizontal className="w-3 h-3" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1 min-w-0">
            {renaming ? (
              <input
                autoFocus
                value={nameDraft}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setRenaming(false); setNameDraft(page.name); } }}
                className="w-full px-1 py-0.5 text-[10px] rounded border border-[#B8895A] text-[#1C2024] focus:outline-none"
              />
            ) : (
              <span
                onDoubleClick={(e) => { e.stopPropagation(); setRenaming(true); }}
                className="text-[10px] text-[#6F7478] truncate"
                title="Double-click to rename"
              >
                {page.name}
              </span>
            )}
            {(role === 'cover' || role === 'back-cover') && (
              <span className="flex-shrink-0 text-[8px] font-semibold tracking-wide uppercase text-[#B8895A] bg-[#B8895A]/10 rounded px-1 py-0.5">
                {pageRoleLabel(role)}
              </span>
            )}
          </div>
        </div>
      </div>

      {dropIndicator === 'after' && <div className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-[#B8895A]" />}

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-[150]" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-8 left-6 z-[160] bg-white rounded-xl border border-[#E7E7E4] shadow-lg py-1.5 w-48">
            <MenuItem icon={Pencil} label="Rename" onClick={() => { setRenaming(true); setMenuOpen(false); }} />
            <MenuItem icon={Copy} label="Duplicate page" onClick={() => { onDuplicate(); setMenuOpen(false); }} />
            <MenuItem icon={ChevronUp} label="Move up" disabled={!canMoveUp} onClick={() => { onMoveUp(); setMenuOpen(false); }} />
            <MenuItem icon={ChevronDown} label="Move down" disabled={!canMoveDown} onClick={() => { onMoveDown(); setMenuOpen(false); }} />
            <MenuItem icon={Plus} label="Add page before" onClick={() => { onAddBefore(); setMenuOpen(false); }} />
            <MenuItem icon={Plus} label="Add page after" onClick={() => { onAddAfter(); setMenuOpen(false); }} />
            <MenuItem icon={Copy} label="Copy page" onClick={() => { onCopy(); setMenuOpen(false); }} />
            <MenuItem icon={ClipboardPaste} label="Paste page" disabled={!canPaste} onClick={() => { onPaste(); setMenuOpen(false); }} />
            <MenuItem icon={Settings2} label="Page settings" onClick={() => { onOpenSettings(); setMenuOpen(false); }} />
            <div className="my-1 border-t border-[#E7E7E4]" />
            <MenuItem icon={Trash2} label="Delete page" danger onClick={() => { onDelete(); setMenuOpen(false); }} />
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, disabled, danger }: { icon: typeof Copy; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-[#F5F5F3] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${danger ? 'text-red-600' : 'text-[#1C2024]'}`}
    >
      <Icon className="w-3.5 h-3.5 text-[#6F7478]" strokeWidth={1.75} /> {label}
    </button>
  );
}
