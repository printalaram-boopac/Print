
// Exact Canva Elements icon: Triangle on top, Square on bottom-left, Circle on bottom-right (from user uploaded image)
export function CanvaElementsIcon({ className = "w-5 h-5", strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {/* Top Triangle with rounded apex and corners */}
      <path
        d="M12 3.4L6.9 11.2C6.5 11.8 6.9 12.6 7.7 12.6H16.3C17.1 12.6 17.5 11.8 17.1 11.2L12 3.4Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Bottom-Left Square with rounded corners */}
      <rect
        x="4.2"
        y="14.8"
        width="6.8"
        height="6.8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* Bottom-Right Circle */}
      <circle
        cx="16.5"
        cy="18.2"
        r="3.4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

// Exact Canva Text icon: Bold capital 'T'
export function CanvaTextIcon({ className = "w-5 h-5", strokeWidth = 2.2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4.5 6.5h15M12 6.5v12.5m-3.5 0h7"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Canva Design / Templates icon: Card spreads layout
export function CanvaDesignIcon({ className = "w-5 h-5", strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3.5" y="3.5" width="7" height="17" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="13.5" y="3.5" width="7" height="7.5" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="13.5" y="13" width="7" height="7.5" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

// Canva Brand Hub icon
export function CanvaBrandIcon({ className = "w-5 h-5", strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 6.5h16a1.5 1.5 0 011.5 1.5v10a1.5 1.5 0 01-1.5 1.5H4a1.5 1.5 0 01-1.5-1.5V8a1.5 1.5 0 011.5-1.5z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <circle cx="9" cy="13" r="2.2" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M14 11.5h4M14 14.5h3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// Canva Uploads icon
export function CanvaUploadsIcon({ className = "w-5 h-5", strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4.5 16.5v1.5a2 2 0 002 2h11a2 2 0 002-2v-1.5M12 4.5v10.5m0-10.5l-3.8 3.8M12 4.5l3.8 3.8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Canva Draw icon
export function CanvaDrawIcon({ className = "w-5 h-5", strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M18.2 3.8a2.1 2.1 0 013 3L7.8 20.2 3.5 21.5l1.3-4.3L18.2 3.8z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Canva Projects icon
export function CanvaProjectsIcon({ className = "w-5 h-5", strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3.5 6.5v12a1.5 1.5 0 001.5 1.5h14a1.5 1.5 0 001.5-1.5V9a1.5 1.5 0 00-1.5-1.5h-6.5l-2-2H5a1.5 1.5 0 00-1.5 1.5z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

// Canva Background (BG) icon: canvas swatch with texture
export function CanvaBackgroundIcon({ className = "w-5 h-5", strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M3.5 14.5L14.5 3.5M9.5 20.5L20.5 9.5M3.5 8.5L8.5 3.5M15.5 20.5L20.5 15.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// Canva Apps icon: 4-square grid
export function CanvaAppsIcon({ className = "w-5 h-5", strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="14" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

export const TOOLS = [
  { key: 'templates', label: 'Design', icon: CanvaDesignIcon },
  { key: 'elements', label: 'Elements', icon: CanvaElementsIcon },
  { key: 'text', label: 'Text', icon: CanvaTextIcon },
  { key: 'uploads', label: 'Uploads', icon: CanvaUploadsIcon },
  { key: 'draw', label: 'Draw', icon: CanvaDrawIcon },
  { key: 'pages', label: 'Projects', icon: CanvaProjectsIcon },
  { key: 'background', label: 'BG', icon: CanvaBackgroundIcon },
] as const;

export type ToolKey = (typeof TOOLS)[number]['key'];

interface LeftToolBarProps {
  active: ToolKey | null;
  onChange: (tool: ToolKey | null) => void;
}

export default function LeftToolBar({ active, onChange }: LeftToolBarProps) {
  const handleClick = (key: ToolKey) => {
    if (active === key) {
      onChange(null);
    } else {
      onChange(key);
    }
  };

  return (
    <>
      {/* Desktop/Tablet vertical sidebar - exact Canva dock */}
      <aside className="hidden md:flex w-[72px] lg:w-[76px] flex-shrink-0 bg-white border-r border-[#E7E7E4] flex-col items-center py-2.5 justify-between z-20 select-none">
        <div className="flex flex-col items-center gap-1 w-full px-1">
          {TOOLS.map((tool) => {
            const isActive = active === tool.key;
            return (
              <button
                key={tool.key}
                type="button"
                onClick={() => handleClick(tool.key)}
                className="w-full flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer group relative focus:outline-none"
                title={tool.label}
              >

                {/* Canva Icon Container with rounded soft-purple active box */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#EDE4FF] text-[#8B3DFF] shadow-xs scale-105'
                    : 'text-[#0E1318] group-hover:bg-[#F2F3F5] group-hover:text-black'
                }`}>
                  <tool.icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
                </div>

                {/* Canva Typographic Label */}
                <span className={`text-[11px] font-medium mt-1 leading-tight tracking-tight ${
                  isActive ? 'text-[#8B3DFF] font-semibold' : 'text-[#0E1318] group-hover:text-black'
                }`}>
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E7E7E4] flex items-center justify-around py-1.5 px-1 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] overflow-x-auto">
        {TOOLS.map((tool) => {
          const isActive = active === tool.key;
          return (
            <button
              key={tool.key}
              type="button"
              onClick={() => handleClick(tool.key)}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-lg transition-colors cursor-pointer ${
                isActive ? 'text-[#8B3DFF] bg-[#EDE4FF] font-bold' : 'text-[#0E1318]'
              }`}
            >
              <tool.icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[10px] font-medium leading-none">{tool.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
