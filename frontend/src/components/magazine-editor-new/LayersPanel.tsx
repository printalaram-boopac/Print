import { Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown, Image as ImageIcon, Type, Shapes, Minus as LineIcon, Sparkles, PaintBucket } from 'lucide-react';
import type { PageBackground, TemplateElement } from '@/lib/magazine-editor-new/types';
import { elementDisplayName } from '@/lib/magazine-editor-new/elementDisplayName';
import PageBackgroundLayer from './PageBackgroundLayer';

const KIND_ICONS: Record<TemplateElement['kind'], typeof ImageIcon> = {
  image: ImageIcon, text: Type, shape: Shapes, line: LineIcon, icon: Sparkles,
};

interface LayersPanelProps {
  elements: TemplateElement[];
  selectedIds: string[];
  onSelect: (id: string, e: React.MouseEvent) => void;
  onToggleVisible: (id: string) => void;
  onToggleLock: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  background?: PageBackground;
  isCoverLike?: boolean;
  gradient?: string;
  onEditBackground?: () => void;
}

export default function LayersPanel({
  elements, selectedIds, onSelect, onToggleVisible, onToggleLock, onMove,
  background, isCoverLike, gradient, onEditBackground,
}: LayersPanelProps) {
  const sorted = [...elements].sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)); // top layer first

  const backgroundRow = onEditBackground && (
    <button
      type="button"
      onClick={onEditBackground}
      title="Background is fixed — edit it from the Background tool"
      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#F5F5F3]/60 border-t border-[#E7E7E4] mt-1 pt-2.5"
    >
      <PaintBucket className="w-3.5 h-3.5 text-[#6F7478] flex-shrink-0" strokeWidth={1.75} />
      <span className="flex-1 text-left text-[12px] text-[#6F7478]">Background</span>
      <div className="relative w-4 h-4 rounded overflow-hidden border border-[#E7E7E4] flex-shrink-0">
        <PageBackgroundLayer background={background} isCoverLike={!!isCoverLike} fallbackGradient={gradient ?? ''} />
      </div>
      <Lock className="w-3 h-3 text-[#D6D6D2] flex-shrink-0" strokeWidth={1.75} />
    </button>
  );

  if (sorted.length === 0) {
    return (
      <div className="px-2 py-2">
        <p className="text-[12px] text-[#6F7478] text-center py-8 px-3">No layers on this page yet.</p>
        {backgroundRow}
      </div>
    );
  }

  return (
    <div className="px-2 py-2 space-y-0.5">
      {sorted.map((el, i) => {
        const Icon = KIND_ICONS[el.kind];
        const selected = selectedIds.includes(el.id);
        return (
          <div
            key={el.id}
            onClick={(e) => onSelect(el.id, e)}
            className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${selected ? 'bg-[#F5F5F3]' : 'hover:bg-[#F5F5F3]/60'}`}
          >
            <Icon className="w-3.5 h-3.5 text-[#6F7478] flex-shrink-0" strokeWidth={1.75} />
            <span className={`flex-1 text-[12px] truncate ${selected ? 'text-[#1C2024] font-medium' : 'text-[#6F7478]'}`}>
              {elementDisplayName(el)}
            </span>
            <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
              <button type="button" aria-label="Move layer up" onClick={(e) => { e.stopPropagation(); onMove(el.id, 'up'); }} disabled={i === 0} className="w-5 h-5 flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] disabled:opacity-20 cursor-pointer">
                <ChevronUp className="w-3 h-3" strokeWidth={2} />
              </button>
              <button type="button" aria-label="Move layer down" onClick={(e) => { e.stopPropagation(); onMove(el.id, 'down'); }} disabled={i === sorted.length - 1} className="w-5 h-5 flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] disabled:opacity-20 cursor-pointer">
                <ChevronDown className="w-3 h-3" strokeWidth={2} />
              </button>
            </div>
            <button type="button" aria-label={el.locked ? 'Unlock layer' : 'Lock layer'} onClick={(e) => { e.stopPropagation(); onToggleLock(el.id); }} className="w-5 h-5 flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] cursor-pointer flex-shrink-0">
              {el.locked ? <Lock className="w-3 h-3" strokeWidth={1.75} /> : <Unlock className="w-3 h-3 opacity-0 group-hover:opacity-100" strokeWidth={1.75} />}
            </button>
            <button type="button" aria-label={el.visible === false ? 'Show layer' : 'Hide layer'} onClick={(e) => { e.stopPropagation(); onToggleVisible(el.id); }} className="w-5 h-5 flex items-center justify-center text-[#6F7478] hover:text-[#1C2024] cursor-pointer flex-shrink-0">
              {el.visible === false ? <EyeOff className="w-3 h-3" strokeWidth={1.75} /> : <Eye className="w-3 h-3" strokeWidth={1.75} />}
            </button>
          </div>
        );
      })}
      {backgroundRow}
    </div>
  );
}
