import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CloudOff,
  Download,
  Eye,
  FileDown,
  Image as ImageIcon,
  Loader2,
  Minus,
  Plus,
  Redo2,
  Save,
  TriangleAlert,
  Undo2,
} from 'lucide-react';
import type { SaveState, StorageDriver } from '../../types';
import { MAX_ZOOM, MIN_ZOOM, ZOOM_LEVELS } from '../../constants';

interface EditorToolbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  /** Effective canvas scale, 1 = actual size. */
  zoom: number;
  /** True while the canvas is auto-fitting to the viewport. */
  isFit: boolean;
  onZoomChange: (zoom: number) => void;
  onZoomFit: () => void;
  onPreview: () => void;
  onSave: () => void;
  onExportPdf: () => void;
  onExportPng: () => void;
  onExportAllJpg: () => void;
  saveState: SaveState;
  saveDriver: StorageDriver;
  exporting: boolean;
  exportProgress: { done: number; total: number } | null;
}

const iconButton =
  'flex h-9 w-9 items-center justify-center rounded-lg border border-gold-200/50 bg-white text-luxury-accent transition-all hover:border-luxury-gold hover:text-luxury-gold disabled:cursor-not-allowed disabled:opacity-35';

function SaveIndicator({ state, driver }: { state: SaveState; driver: StorageDriver }) {
  if (state === 'saving') {
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
      </span>
    );
  }
  if (state === 'saved') {
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-green-600">
        <Check className="h-3.5 w-3.5" />
        {driver === 'remote' ? 'Saved to your account' : 'Saved on this device'}
      </span>
    );
  }
  if (state === 'error') {
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-red-600">
        <TriangleAlert className="h-3.5 w-3.5" /> Save failed
      </span>
    );
  }
  if (state === 'dirty') {
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
        <CloudOff className="h-3.5 w-3.5" /> Unsaved changes
      </span>
    );
  }
  return null;
}

/** Top bar: document title, history, zoom, preview, save and export. */
export default function EditorToolbar({
  title,
  onTitleChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  isFit,
  onZoomChange,
  onZoomFit,
  onPreview,
  onSave,
  onExportPdf,
  onExportPng,
  onExportAllJpg,
  saveState,
  saveDriver,
  exporting,
  exportProgress,
}: EditorToolbarProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exportOpen) return;
    const onDown = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [exportOpen]);

  const stepZoom = (direction: 1 | -1) => {
    const next = direction === 1 ? zoom * 1.2 : zoom / 1.2;
    onZoomChange(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next)));
  };

  return (
    <header className="z-30 flex flex-wrap items-center gap-2 border-b border-gold-200/50 bg-white px-3 py-2.5 shadow-sm md:gap-3 md:px-4">
      <Link
        to="/magazine"
        title="Back to templates"
        className={iconButton}
        aria-label="Back to magazine templates"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        aria-label="Magazine title"
        className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 font-display text-sm font-semibold text-luxury-accent outline-none transition-colors hover:border-gold-200/60 focus:border-luxury-gold md:max-w-xs md:text-base"
      />

      <div className="hidden md:block">
        <SaveIndicator state={saveState} driver={saveDriver} />
      </div>

      <div className="ml-auto flex items-center gap-1.5 md:gap-2">
        <button type="button" onClick={onUndo} disabled={!canUndo} className={iconButton} title="Undo (Ctrl+Z)">
          <Undo2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={onRedo} disabled={!canRedo} className={iconButton} title="Redo (Ctrl+Shift+Z)">
          <Redo2 className="h-4 w-4" />
        </button>

        <div className="hidden items-center gap-1 rounded-lg border border-gold-200/50 bg-white px-1 py-1 sm:flex">
          <button
            type="button"
            onClick={() => stepZoom(-1)}
            className="flex h-7 w-7 items-center justify-center rounded text-luxury-accent hover:bg-luxury-gray"
            title="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <select
            value={
              isFit
                ? 'fit'
                : ZOOM_LEVELS.includes(zoom as (typeof ZOOM_LEVELS)[number])
                  ? String(zoom)
                  : 'custom'
            }
            onChange={(e) => {
              if (e.target.value === 'fit') onZoomFit();
              else if (e.target.value !== 'custom') onZoomChange(Number(e.target.value));
            }}
            className="w-[74px] cursor-pointer bg-transparent text-center text-[11px] font-semibold text-luxury-accent outline-none"
            aria-label="Zoom level"
          >
            <option value="fit">Fit</option>
            {ZOOM_LEVELS.map((level) => (
              <option key={level} value={level}>
                {Math.round(level * 100)}%
              </option>
            ))}
            <option value="custom">{Math.round(zoom * 100)}%</option>
          </select>
          <button
            type="button"
            onClick={() => stepZoom(1)}
            className="flex h-7 w-7 items-center justify-center rounded text-luxury-accent hover:bg-luxury-gray"
            title="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onPreview}
          className="flex items-center gap-1.5 rounded-lg border border-gold-200/50 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-luxury-accent transition-all hover:border-luxury-gold"
          title="Preview magazine"
        >
          <Eye className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saveState === 'saving'}
          className="flex items-center gap-1.5 rounded-lg border border-gold-200/50 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-luxury-accent transition-all hover:border-luxury-gold disabled:opacity-50"
          title="Save now (Ctrl+S)"
        >
          <Save className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Save</span>
        </button>

        <div className="relative" ref={exportRef}>
          <button
            type="button"
            onClick={() => setExportOpen((v) => !v)}
            disabled={exporting}
            className="flex items-center gap-1.5 rounded-lg bg-luxury-accent px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:bg-luxury-gold disabled:opacity-60"
            aria-expanded={exportOpen}
          >
            {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">
              {exporting && exportProgress
                ? `${exportProgress.done}/${exportProgress.total}`
                : exporting
                  ? 'Exporting'
                  : 'Export'}
            </span>
            <ChevronDown className={`h-3 w-3 transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
          </button>

          {exportOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-gold-200/60 bg-white py-1.5 shadow-xl">
              {[
                { label: 'Download PDF', hint: 'All pages, print ready', icon: FileDown, run: onExportPdf },
                { label: 'Current page as PNG', hint: 'High resolution image', icon: ImageIcon, run: onExportPng },
                { label: 'All pages as JPG', hint: 'One file per page', icon: ImageIcon, run: onExportAllJpg },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setExportOpen(false);
                    item.run();
                  }}
                  className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-amber-50/70"
                >
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-luxury-gold" />
                  <span className="flex flex-col">
                    <span className="text-xs font-semibold text-luxury-accent">{item.label}</span>
                    <span className="text-[10px] text-gray-400">{item.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:hidden">
        <SaveIndicator state={saveState} driver={saveDriver} />
      </div>
    </header>
  );
}
