import { useState } from 'react';
import { X, Lock, Unlock, Copy, Trash2, PaintBucket } from 'lucide-react';
import type { PageRole, TemplateDimensions, TemplatePage } from '@/lib/magazine-editor-new/types';
import { pageRoleLabel } from '@/lib/magazine-editor-new/pageHelpers';
import PageBackgroundLayer from './PageBackgroundLayer';

interface PageSettingsModalProps {
  page: TemplatePage;
  resolvedRole: PageRole;
  dimensions: TemplateDimensions;
  gradient: string;
  onClose: () => void;
  onRename: (name: string) => void;
  onSetRole: (role: PageRole | undefined) => void;
  onEditBackground: () => void;
  onToggleLock: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const ROLE_OPTIONS: { value: PageRole | 'auto'; label: string }[] = [
  { value: 'auto', label: 'Auto (by position)' },
  { value: 'cover', label: 'Cover' },
  { value: 'inside', label: 'Inside' },
  { value: 'back-cover', label: 'Back Cover' },
];

/** Small per-page settings surface (Step 7 §17) — deliberately not a giant
 * modal: name, role, background, lock, duplicate, delete, plus a read-only
 * reminder of the document size (which is a whole-document setting, see
 * DocumentSizeControls, not something a single page can diverge from yet). */
export default function PageSettingsModal({
  page, resolvedRole, dimensions, gradient, onClose,
  onRename, onSetRole, onEditBackground, onToggleLock, onDuplicate, onDelete,
}: PageSettingsModalProps) {
  const isCoverLike = page.kind === 'cover' || page.kind === 'back-cover';
  const [name, setName] = useState(page.name);

  return (
    <div className="fixed inset-0 z-[400] bg-black/60 flex items-center justify-center p-6" data-lenis-prevent onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#1C2024]">Page Settings</h3>
          <button type="button" aria-label="Close" onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer">
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-[11px] text-[#6F7478]">
            Page name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => onRename(name.trim() || page.name)}
              className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-[#E7E7E4] text-[13px] text-[#1C2024] focus:outline-none focus:border-[#B8895A]"
            />
          </label>

          <label className="block text-[11px] text-[#6F7478]">
            Role
            <select
              value={page.role ?? 'auto'}
              onChange={(e) => onSetRole(e.target.value === 'auto' ? undefined : (e.target.value as PageRole))}
              className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-[#E7E7E4] text-[13px] text-[#1C2024] cursor-pointer"
            >
              {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}{r.value === 'auto' ? ` — currently ${pageRoleLabel(resolvedRole)}` : ''}</option>)}
            </select>
          </label>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#6F7478]">Background</span>
            <button
              type="button"
              onClick={() => { onEditBackground(); onClose(); }}
              className="flex items-center gap-2 px-2 py-1 rounded-lg border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer"
            >
              <div className="relative w-8 h-8 rounded overflow-hidden border border-[#E7E7E4] flex-shrink-0">
                <PageBackgroundLayer background={page.background} isCoverLike={isCoverLike} fallbackGradient={gradient} />
              </div>
              <span className="text-[11px] text-[#1C2024] flex items-center gap-1"><PaintBucket className="w-3 h-3 text-[#6F7478]" strokeWidth={1.75} /> Edit</span>
            </button>
          </div>

          <p className="text-[11px] text-[#6F7478]">
            Document size: {Math.round(dimensions.widthMm)}×{Math.round(dimensions.heightMm)}mm — change from the size control above the page list.
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button type="button" onClick={onToggleLock} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer">
            {page.locked ? <Unlock className="w-3.5 h-3.5" strokeWidth={1.75} /> : <Lock className="w-3.5 h-3.5" strokeWidth={1.75} />} {page.locked ? 'Unlock' : 'Lock'}
          </button>
          <button type="button" onClick={onDuplicate} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer">
            <Copy className="w-3.5 h-3.5" strokeWidth={1.75} /> Duplicate
          </button>
          <button type="button" onClick={onDelete} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium text-red-600 border border-[#E7E7E4] hover:bg-red-50 cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
