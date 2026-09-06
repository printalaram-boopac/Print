import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Sparkles, Wand2,
  MoreHorizontal, Minus, Plus, Lock, Unlock, Copy, Trash2, ChevronDown,
} from 'lucide-react';
import ElementToolbar from './ElementToolbar';
import MultiSelectToolbar from './MultiSelectToolbar';
import PositionPanel from './PositionPanel';
import type { TemplateElement, ImageQuality, TemplateDimensions } from '@/lib/magazine-editor-new/types';

function Divider() {
  return <div className="w-px h-6 bg-[#E7E7E4] mx-1" />;
}

function IconButton({ icon: Icon, label, onClick, active }: { icon: typeof Bold; label: string; onClick?: () => void; active?: boolean }) {
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
      ) : (
      /* Default formatting row — shown when nothing is selected. Full rich-text
         editing (fonts, size, etc.) is Step 4 scope, not built yet; this row
         is inert placeholder UI carried over from Step 1. */
      <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto">
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E7E4] text-[13px] text-[#1C2024] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
        >
          Playfair Display <ChevronDown className="w-3.5 h-3.5 text-[#6F7478]" strokeWidth={1.75} />
        </button>

        <div className="flex items-center gap-0.5 ml-1 border border-[#E7E7E4] rounded-lg">
          <button type="button" aria-label="Decrease font size" className="w-7 h-8 flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] cursor-pointer">
            <Minus className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
          <span className="text-[13px] text-[#1C2024] px-1 w-6 text-center select-none">32</span>
          <button type="button" aria-label="Increase font size" className="w-7 h-8 flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] cursor-pointer">
            <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>

        <Divider />

        <IconButton icon={Bold} label="Bold" />
        <IconButton icon={Italic} label="Italic" />
        <IconButton icon={Underline} label="Underline" />

        <Divider />

        <IconButton icon={AlignLeft} label="Align left" />
        <IconButton icon={AlignCenter} label="Align center" />
        <IconButton icon={AlignRight} label="Align right" />

        <Divider />

        <IconButton icon={List} label="List" />
        <IconButton icon={Sparkles} label="Effects" />
        <IconButton icon={Wand2} label="Animate" />

        <Divider />

        <IconButton icon={MoreHorizontal} label="More options" />
      </div>
      )}

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
