import { Link } from 'react-router-dom';
import { Undo2, Redo2, Eye, Download, FolderHeart } from 'lucide-react';
import { asset } from '@/lib/asset';
import type { SaveStatus } from '@/lib/magazine-editor-new/storage/useAutosave';
import SaveStatusIndicator from './SaveStatusIndicator';
import ProjectNameEditor from './ProjectNameEditor';

interface TopNavbarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onPreview: () => void;
  onDownload: () => void;
  projectName: string;
  onRenameProject: (name: string) => void;
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
  saveError: string | null;
  onRetrySave: () => void;
}

export default function TopNavbar({
  onUndo, onRedo, canUndo, canRedo, onPreview, onDownload,
  projectName, onRenameProject, saveStatus, lastSavedAt, saveError, onRetrySave,
}: TopNavbarProps) {
  return (
    <header className="h-14 sm:h-[68px] flex-shrink-0 bg-white border-b border-[#E7E7E4] flex items-center justify-between px-2.5 sm:px-5 gap-2">
      {/* Left: brand + project name */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0" title="Home">
          <img src={asset('logo.png')} alt="PrintAlarm" className="w-7 h-7 sm:w-8 sm:h-8 rounded-md object-cover" />
        </Link>
        <div className="min-w-0 max-w-[140px] xs:max-w-[180px] sm:max-w-[260px]">
          <ProjectNameEditor name={projectName} onRename={onRenameProject} />
        </div>
      </div>

      {/* Right: status + actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <div className="hidden sm:block">
          <SaveStatusIndicator status={saveStatus} lastSavedAt={lastSavedAt} error={saveError} onRetry={onRetrySave} />
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 sm:border-l sm:border-[#E7E7E4] sm:pl-3">
          <button
            type="button"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
            onClick={onUndo}
            disabled={!canUndo}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
            onClick={onRedo}
            disabled={!canRedo}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
          </button>
        </div>

        <button
          type="button"
          title="Resize & Switch"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#7D2AE8] bg-[#EDE4FF] hover:bg-[#E3D4FF] transition-all cursor-pointer"
        >
          <span>Resize</span>
        </button>

        <Link
          to="/magazine-maker/my-designs"
          title="My Designs"
          className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[12px] sm:text-[13px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
        >
          <FolderHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B3DFF]" strokeWidth={1.75} />
          <span className="hidden md:inline">Designs</span>
        </Link>

        <button
          type="button"
          onClick={onPreview}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[12px] sm:text-[13px] font-semibold text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          type="button"
          onClick={onDownload}
          className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[12px] sm:text-[13px] font-bold text-white bg-[#8B3DFF] hover:bg-[#7D2AE8] shadow-sm transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
          <span className="hidden sm:inline">Share</span>
          <span className="sm:hidden">Share</span>
        </button>
      </div>
    </header>
  );
}
