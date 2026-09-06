import { useState } from 'react';
import { MoreHorizontal, Pencil, Copy, Trash2 } from 'lucide-react';
import type { ProjectSummary } from '@/lib/magazine-editor-new/storage/types';
import MiniPageThumbnail from './MiniPageThumbnail';

function formatEditedDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return 'Edited today';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Edited yesterday';
  return `Edited ${date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })}`;
}

interface ProjectCardProps {
  project: ProjectSummary;
  onOpen: () => void;
  onRename: (name: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function ProjectCard({ project, onOpen, onRename, onDuplicate, onDelete }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(project.name);
  const isCoverLike = project.coverPage.kind === 'cover' || project.coverPage.kind === 'back-cover';

  const commitRename = () => {
    setRenaming(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== project.name) onRename(trimmed);
    else setDraft(project.name);
  };

  return (
    <div className="group">
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.name}`}
        onClick={onOpen}
        onKeyDown={(e) => { if (e.key === 'Enter') onOpen(); }}
        className="relative rounded-xl overflow-hidden border border-[#E7E7E4] shadow-sm group-hover:shadow-md transition-shadow cursor-pointer bg-white"
        style={{ aspectRatio: `${project.dimensions.widthMm} / ${project.dimensions.heightMm}` }}
      >
        <MiniPageThumbnail page={project.coverPage} dimensions={project.dimensions} gradient={project.accentGradient} isCoverLike={isCoverLike} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors" />
      </div>

      <div className="mt-2 flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          {renaming ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setDraft(project.name); setRenaming(false); } }}
              className="w-full px-1.5 py-0.5 rounded border border-[#B8895A] text-[13px] text-[#1C2024] focus:outline-none"
            />
          ) : (
            <p className="text-[13px] font-medium text-[#1C2024] truncate">{project.name}</p>
          )}
          <p className="text-[11px] text-[#6F7478]">{project.pageCount} page{project.pageCount === 1 ? '' : 's'} • {formatEditedDate(project.updatedAt)}</p>
        </div>

        <div className="relative flex-shrink-0">
          <button
            type="button"
            aria-label="Project actions"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" strokeWidth={1.75} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-[150]" onClick={() => setMenuOpen(false)} />
              <div className="absolute top-8 right-0 z-[160] bg-white rounded-xl border border-[#E7E7E4] shadow-lg py-1.5 w-40">
                <button type="button" onClick={() => { setRenaming(true); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-[#1C2024] hover:bg-[#F5F5F3] cursor-pointer">
                  <Pencil className="w-3.5 h-3.5 text-[#6F7478]" strokeWidth={1.75} /> Rename
                </button>
                <button type="button" onClick={() => { onDuplicate(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-[#1C2024] hover:bg-[#F5F5F3] cursor-pointer">
                  <Copy className="w-3.5 h-3.5 text-[#6F7478]" strokeWidth={1.75} /> Duplicate
                </button>
                <div className="my-1 border-t border-[#E7E7E4]" />
                <button type="button" onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
