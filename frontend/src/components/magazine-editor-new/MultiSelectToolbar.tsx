import {
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  AlignStartHorizontal, AlignCenterHorizontal, AlignEndHorizontal,
  AlignHorizontalDistributeCenter, AlignVerticalDistributeCenter,
  Group, Ungroup, Copy, Trash2,
} from 'lucide-react';

function Divider() {
  return <div className="w-px h-6 bg-[#E7E7E4] mx-1 flex-shrink-0" />;
}

function IconButton({ icon: Icon, label, onClick, disabled }: { icon: typeof Group; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex-shrink-0"
    >
      <Icon className="w-4 h-4" strokeWidth={1.75} />
    </button>
  );
}

type Align = 'left' | 'centerX' | 'right' | 'top' | 'centerY' | 'bottom';

interface MultiSelectToolbarProps {
  count: number;
  isGroup: boolean;
  onAlign: (align: Align) => void;
  onDistribute: (axis: 'horizontal' | 'vertical') => void;
  onGroup: () => void;
  onUngroup: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function MultiSelectToolbar({ count, isGroup, onAlign, onDistribute, onGroup, onUngroup, onDuplicate, onDelete }: MultiSelectToolbarProps) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto">
      <span className="text-[12px] text-[#6F7478] flex-shrink-0">{count} selected</span>
      <Divider />
      <IconButton icon={AlignStartVertical} label="Align left" onClick={() => onAlign('left')} />
      <IconButton icon={AlignCenterVertical} label="Align horizontal center" onClick={() => onAlign('centerX')} />
      <IconButton icon={AlignEndVertical} label="Align right" onClick={() => onAlign('right')} />
      <IconButton icon={AlignStartHorizontal} label="Align top" onClick={() => onAlign('top')} />
      <IconButton icon={AlignCenterHorizontal} label="Align vertical center" onClick={() => onAlign('centerY')} />
      <IconButton icon={AlignEndHorizontal} label="Align bottom" onClick={() => onAlign('bottom')} />
      <Divider />
      <IconButton icon={AlignHorizontalDistributeCenter} label="Distribute horizontally" onClick={() => onDistribute('horizontal')} disabled={count < 3} />
      <IconButton icon={AlignVerticalDistributeCenter} label="Distribute vertically" onClick={() => onDistribute('vertical')} disabled={count < 3} />
      <Divider />
      {isGroup ? (
        <IconButton icon={Ungroup} label="Ungroup" onClick={onUngroup} />
      ) : (
        <IconButton icon={Group} label="Group" onClick={onGroup} />
      )}
      <IconButton icon={Copy} label="Duplicate" onClick={onDuplicate} />
      <IconButton icon={Trash2} label="Delete" onClick={onDelete} />
    </div>
  );
}
