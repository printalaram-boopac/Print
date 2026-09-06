import {
  Undo2, Redo2, Scissors, Copy, ClipboardPaste, CopyPlus, Group, Ungroup,
  ChevronUp, ChevronDown, Lock, EyeOff, Trash2,
} from 'lucide-react';

interface ContextMenuAction {
  label: string;
  icon: typeof Copy;
  onClick: () => void;
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  hasSelection: boolean;
  canPaste: boolean;
  isMultiSelect: boolean;
  isGroup: boolean;
  onClose: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLayer: (direction: 'forward' | 'backward') => void;
  onLock: () => void;
  onHide: () => void;
  onDelete: () => void;
}

export default function ContextMenu({
  x, y, hasSelection, canPaste, isMultiSelect, isGroup, onClose,
  onUndo, onRedo, canUndo, canRedo,
  onCut, onCopy, onPaste, onDuplicate, onGroup, onUngroup, onLayer, onLock, onHide, onDelete,
}: ContextMenuProps) {
  const actions: ContextMenuAction[] = [
    ...(onUndo ? [{ label: 'Undo', icon: Undo2, onClick: onUndo, disabled: !canUndo }] : []),
    ...(onRedo ? [{ label: 'Redo', icon: Redo2, onClick: onRedo, disabled: !canRedo }] : []),
    { label: 'Cut', icon: Scissors, onClick: onCut, disabled: !hasSelection },
    { label: 'Copy', icon: Copy, onClick: onCopy, disabled: !hasSelection },
    { label: 'Paste', icon: ClipboardPaste, onClick: onPaste, disabled: !canPaste },
    { label: 'Duplicate', icon: CopyPlus, onClick: onDuplicate, disabled: !hasSelection },
    ...(isGroup
      ? [{ label: 'Ungroup', icon: Ungroup, onClick: onUngroup }]
      : isMultiSelect ? [{ label: 'Group', icon: Group, onClick: onGroup }] : []),
    { label: 'Bring forward', icon: ChevronUp, onClick: () => onLayer('forward'), disabled: !hasSelection },
    { label: 'Send backward', icon: ChevronDown, onClick: () => onLayer('backward'), disabled: !hasSelection },
    { label: 'Lock', icon: Lock, onClick: onLock, disabled: !hasSelection },
    { label: 'Hide', icon: EyeOff, onClick: onHide, disabled: !hasSelection },
    { label: 'Delete', icon: Trash2, onClick: onDelete, disabled: !hasSelection },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[250]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div
        className="fixed z-[260] bg-white rounded-xl border border-[#E7E7E4] shadow-lg py-1.5 w-44"
        style={{ left: x, top: y }}
      >
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            disabled={a.disabled}
            onClick={() => { a.onClick(); onClose(); }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-[#1C2024] hover:bg-[#F5F5F3] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <a.icon className="w-3.5 h-3.5 text-[#6F7478]" strokeWidth={1.75} /> {a.label}
          </button>
        ))}
      </div>
    </>
  );
}
