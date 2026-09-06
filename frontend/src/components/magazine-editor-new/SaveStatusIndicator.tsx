import { useState } from 'react';
import { Cloud, CloudOff, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import type { SaveStatus } from '@/lib/magazine-editor-new/storage/useAutosave';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSavedAt: string | null;
  error: string | null;
  onRetry: () => void;
}

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

/** Honest, non-intrusive save status (Step 11 §4, §82) — never claims
 * "cloud" while only local persistence exists. */
export default function SaveStatusIndicator({ status, lastSavedAt, error, onRetry }: SaveStatusIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const content = (() => {
    switch (status) {
      case 'saving': return { icon: <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />, label: 'Saving…' };
      case 'unsaved': return { icon: <Cloud className="w-4 h-4" strokeWidth={1.75} />, label: 'Unsaved changes' };
      case 'offline': return { icon: <CloudOff className="w-4 h-4" strokeWidth={1.75} />, label: 'Offline — saved locally' };
      case 'error': return { icon: <AlertTriangle className="w-4 h-4 text-red-600" strokeWidth={1.75} />, label: 'Save failed' };
      case 'saved': return { icon: <Cloud className="w-4 h-4" strokeWidth={1.75} />, label: 'Saved' };
      default: return { icon: <Cloud className="w-4 h-4" strokeWidth={1.75} />, label: 'Saved' };
    }
  })();

  return (
    <div
      className="relative flex items-center gap-1.5 text-[12px] text-[#6F7478]"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {content.icon}
      <span>{content.label}</span>
      {status === 'error' && (
        <button type="button" onClick={onRetry} className="flex items-center gap-1 text-[12px] font-medium text-[#B8895A] hover:underline cursor-pointer">
          <RefreshCw className="w-3 h-3" strokeWidth={2} /> Retry
        </button>
      )}
      {showTooltip && lastSavedAt && status !== 'error' && (
        <div className="absolute top-full right-0 mt-1.5 px-2 py-1 rounded-md bg-[#20272C] text-white text-[11px] whitespace-nowrap shadow-lg z-10">
          Saved {timeAgo(lastSavedAt)}
        </div>
      )}
      {showTooltip && status === 'error' && error && (
        <div className="absolute top-full right-0 mt-1.5 px-2 py-1 rounded-md bg-[#20272C] text-white text-[11px] whitespace-nowrap shadow-lg z-10 max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}
