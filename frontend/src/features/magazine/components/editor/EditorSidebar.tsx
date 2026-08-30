import { type ReactNode } from 'react';
import { Image, LayoutTemplate, Palette, Shapes, Type, X } from 'lucide-react';
import { Files } from 'lucide-react';

export type EditorTool = 'templates' | 'pages' | 'text' | 'photos' | 'elements' | 'background';

const TOOLS: { id: EditorTool; label: string; icon: typeof Type }[] = [
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'pages', label: 'Pages', icon: Files },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'photos', label: 'Photos', icon: Image },
  { id: 'elements', label: 'Elements', icon: Shapes },
  { id: 'background', label: 'Background', icon: Palette },
];

interface EditorSidebarProps {
  activeTool: EditorTool | null;
  onToolChange: (tool: EditorTool | null) => void;
  /** The panel body for the active tool. */
  children: ReactNode;
}

/**
 * Tool rail and panel host.
 *
 * On desktop this is a fixed left rail with a panel beside it. On small screens
 * the rail moves to the bottom and the panel opens as a sheet, so the canvas
 * keeps as much room as possible instead of a shrunken desktop layout.
 */
export default function EditorSidebar({ activeTool, onToolChange, children }: EditorSidebarProps) {
  const activeLabel = TOOLS.find((t) => t.id === activeTool)?.label;

  return (
    <>
      {/* Rail */}
      <nav
        aria-label="Editor tools"
        className="order-3 flex shrink-0 items-center justify-around border-t border-gold-200/50 bg-white px-1 py-1.5 md:order-none md:w-[76px] md:flex-col md:justify-start md:gap-1 md:border-r md:border-t-0 md:py-3"
      >
        {TOOLS.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onToolChange(isActive ? null : tool.id)}
              aria-pressed={isActive}
              className={`flex w-full flex-col items-center gap-1 rounded-lg px-1 py-2 transition-colors ${
                isActive
                  ? 'bg-luxury-accent text-white'
                  : 'text-gray-400 hover:bg-luxury-gray hover:text-luxury-accent'
              }`}
            >
              <tool.icon className="h-4 w-4" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{tool.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Panel */}
      {activeTool && (
        <aside
          aria-label={`${activeLabel} panel`}
          className="order-2 max-h-[42vh] shrink-0 overflow-y-auto border-t border-gold-200/50 bg-luxury-black md:order-none md:max-h-none md:w-[286px] md:border-r md:border-t-0"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gold-200/50 bg-white px-4 py-2.5">
            <h2 className="font-display text-sm font-semibold text-luxury-accent">{activeLabel}</h2>
            <button
              type="button"
              onClick={() => onToolChange(null)}
              aria-label={`Close ${activeLabel} panel`}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-luxury-gray hover:text-luxury-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {children}
        </aside>
      )}
    </>
  );
}
