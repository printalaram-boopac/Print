import {
  Lock, Unlock, Copy, Trash2,
} from 'lucide-react';
import ElementToolbar from './ElementToolbar';
import MultiSelectToolbar from './MultiSelectToolbar';
import PositionPanel from './PositionPanel';
import type { TemplateElement, ImageQuality, TemplateDimensions } from '@/lib/magazine-editor-new/types';

function IconButton({ icon: Icon, label, onClick, active }: { icon: typeof Lock; label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${active ? 'text-[#8B3DFF] bg-[#EDE4FF]' : 'text-[#5E6573] hover:bg-[#F2F3F5] hover:text-[#0E1318]'}`}
    >
      <Icon className="w-4 h-4" strokeWidth={1.75} />
    </button>
  );
}

type Align = 'left' | 'centerX' | 'right' | 'top' | 'centerY' | 'bottom';

interface EditorToolbarProps {
  pageNumber: number;
  pageName: string;
  pageRoleLabel: string | null;
  pageLocked: boolean;
  onTogglePageLock: () => void;
  onDuplicatePage: () => void;
  onDeletePage: () => void;
  selectedElement: TemplateElement | null;
  selectedCount: number;
  isGroupSelected: boolean;
  imageQuality: ImageQuality | null;
  recentColors: string[];
  dimensions: TemplateDimensions;
  onPatchElement: (patch: Partial<TemplateElement>) => void;
  onReplaceImage: (file: File) => void;
  onCropImage: () => void;
  onLayerElement: (direction: 'forward' | 'backward' | 'front' | 'back') => void;
  onToggleLockElement: () => void;
  onDuplicateElement: () => void;
  onDeleteElement: () => void;
  onAlign: (align: Align) => void;
  onDistribute: (axis: 'horizontal' | 'vertical') => void;
  onGroup: () => void;
  onUngroup: () => void;
}

export default function EditorToolbar({
  pageNumber, pageName, pageRoleLabel, pageLocked, onTogglePageLock, onDuplicatePage, onDeletePage,
  selectedElement, selectedCount, isGroupSelected, imageQuality, recentColors, dimensions,
  onPatchElement, onReplaceImage, onCropImage, onLayerElement, onToggleLockElement, onDuplicateElement, onDeleteElement,
  onAlign, onDistribute, onGroup, onUngroup,
}: EditorToolbarProps) {
  return (
    <div className="flex-shrink-0 bg-white border-b border-[#E7E7E4]">
      {selectedCount > 1 ? (
        <MultiSelectToolbar
          count={selectedCount}
          isGroup={isGroupSelected}
          onAlign={onAlign}
          onDistribute={onDistribute}
          onGroup={onGroup}
          onUngroup={onUngroup}
          onDuplicate={onDuplicateElement}
          onDelete={onDeleteElement}
        />
      ) : selectedElement ? (
        <ElementToolbar
          element={selectedElement}
          quality={imageQuality}
          recentColors={recentColors}
          onPatch={onPatchElement}
          onReplace={onReplaceImage}
          onCrop={onCropImage}
          onLayer={onLayerElement}
          onToggleLock={onToggleLockElement}
          onDuplicate={onDuplicateElement}
          onDelete={onDeleteElement}
        />
      ) : null}

      {selectedCount === 1 && selectedElement && (
        <PositionPanel element={selectedElement} dimensions={dimensions} onPatch={onPatchElement} />
      )}

      {/* Page label row */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#E7E7E4]">
        <span className="text-[13px] font-semibold text-[#1C2024] flex items-center gap-1.5">
          Page {pageNumber} <span className="text-[#6F7478] font-normal">· {pageName}</span>
          {pageRoleLabel && (
            <span className="text-[8px] font-semibold tracking-wide uppercase text-[#B8895A] bg-[#B8895A]/10 rounded px-1 py-0.5">{pageRoleLabel}</span>
          )}
        </span>
        <div className="flex items-center gap-1">
          <IconButton icon={pageLocked ? Unlock : Lock} label={pageLocked ? 'Unlock page' : 'Lock page'} active={pageLocked} onClick={onTogglePageLock} />
          <IconButton icon={Copy} label="Duplicate page" onClick={onDuplicatePage} />
          <IconButton icon={Trash2} label="Delete page" onClick={onDeletePage} />
        </div>
      </div>
    </div>
  );
}
