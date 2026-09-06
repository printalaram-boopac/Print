import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, Maximize, Minimize,
  LayoutGrid, RectangleHorizontal, PanelBottomClose, PanelBottomOpen, Printer, AlertTriangle,
} from 'lucide-react';
import type { EditorProject } from '@/lib/magazine-editor-new/types';
import { computeSpreads, resolvePageRole, spreadIndexForPage, computePrintedNumber } from '@/lib/magazine-editor-new/pageHelpers';
import { computePrintReport, type PrintIssue } from '@/lib/magazine-editor-new/printPreview';
import { fontFamilyFor } from '@/lib/magazine/fonts';
import MiniPageThumbnail from './MiniPageThumbnail';
import PrintPreviewPanel from './PrintPreviewPanel';

const MM_PER_PX_AT_96DPI = 25.4 / 96;
const ZOOM_MIN = 25;
const ZOOM_MAX = 300;

interface PreviewModeProps {
  project: EditorProject;
  initialPageId: string;
  onClose: () => void;
  onFixIssue: (pageId: string, elementId?: string) => void;
  onOpenExport: () => void;
}

/**
 * Full-screen, read-only Preview Mode (Step 10) — renders the exact same
 * `project` the editor holds via MiniPageThumbnail (no separate preview
 * document, per §16), with no selection/handles/rulers/guides. Print
 * Preview is a mode within this same view, not a separate route, so
 * switching between them never loses navigation state.
 */
export default function PreviewMode({ project, initialPageId, onClose, onFixIssue, onOpenExport }: PreviewModeProps) {
  const initialIndex = Math.max(0, project.pages.findIndex((p) => p.id === initialPageId));
  const [viewMode, setViewMode] = useState<'single' | 'spread'>('single');
  const [pageIndex, setPageIndex] = useState(initialIndex);
  const [fit, setFit] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [thumbnailsVisible, setThumbnailsVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [printOpen, setPrintOpen] = useState(false);
  const [printBleed, setPrintBleed] = useState(false);
  const [printSafeArea, setPrintSafeArea] = useState(false);
  const [printTrim, setPrintTrim] = useState(true);
  const [printPageNumbers, setPrintPageNumbers] = useState(project.pageNumbers.enabled);
  const [renderError, setRenderError] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 800, height: 600 });
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const spreads = useMemo(() => computeSpreads(project.pages.length), [project.pages.length]);
  const spreadIndex = spreadIndexForPage(spreads, pageIndex);
  const currentSpread = spreads[spreadIndex] ?? spreads[0];
  const report = useMemo(() => computePrintReport(project), [project]);

  useEffect(() => setAnimKey((k) => k + 1), [pageIndex]);
  useEffect(() => setRenderError(false), [pageIndex]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setViewportSize({ width: rect.width, height: rect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pageNumberFor = (index: number) => {
    if (!printPageNumbers) return null;
    const page = project.pages[index];
    const role = resolvePageRole(page, index, project.pages.length);
    const num = computePrintedNumber(index, role, project.pageNumbers);
    if (num === null) return null;
    return { label: String(num), position: project.pageNumbers.position, fontFamily: fontFamilyFor(project.pageNumbers.fontKey), fontSize: project.pageNumbers.fontSize, color: project.pageNumbers.color };
  };

  // --- Navigation ---
  const goToIndex = (i: number) => setPageIndex(Math.max(0, Math.min(project.pages.length - 1, i)));
  const goNext = () => {
    if (viewMode === 'spread') {
      const next = spreads[spreadIndex + 1];
      if (next) goToIndex(next.left);
    } else goToIndex(pageIndex + 1);
  };
  const goPrev = () => {
    if (viewMode === 'spread') {
      const prev = spreads[spreadIndex - 1];
      if (prev) goToIndex(prev.left);
    } else goToIndex(pageIndex - 1);
  };

  // --- Fullscreen ---
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else rootRef.current?.requestFullscreen?.();
  };
  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Auto-hide chrome after inactivity in fullscreen; any mouse move reveals it again.
  useEffect(() => {
    if (!fullscreen) { setControlsVisible(true); return; }
    const onMove = () => {
      setControlsVisible(true);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
      hideControlsTimer.current = setTimeout(() => setControlsVisible(false), 2500);
    };
    onMove();
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, [fullscreen]);

  // --- Keyboard shortcuts (Step 10 §57) ---
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) document.exitFullscreen?.();
        else onClose();
        return;
      }
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === '+' || e.key === '=') { setFit(false); setZoom((z) => Math.min(ZOOM_MAX, z + 10)); }
      else if (e.key === '-') { setFit(false); setZoom((z) => Math.max(ZOOM_MIN, z - 10)); }
      else if (e.key === '0') setFit(true);
      else if (e.key.toLowerCase() === 'f') toggleFullscreen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, pageIndex, spreadIndex]);

  const pagesToShowCount = viewMode === 'spread' && currentSpread.right !== null ? 2 : 1;
  const naturalWidthPx = project.dimensions.widthMm / MM_PER_PX_AT_96DPI;
  const naturalHeightPx = project.dimensions.heightMm / MM_PER_PX_AT_96DPI;
  const GAP_PX = 16;
  const PADDING_PX = 64;

  let renderWidthPx: number;
  if (fit) {
    const availW = Math.max(50, viewportSize.width - PADDING_PX - (pagesToShowCount === 2 ? GAP_PX : 0));
    const availH = Math.max(50, viewportSize.height - PADDING_PX);
    const perPageAvailW = availW / pagesToShowCount;
    const scale = Math.min(perPageAvailW / naturalWidthPx, availH / naturalHeightPx, 3);
    renderWidthPx = naturalWidthPx * Math.max(scale, 0.05);
  } else {
    renderWidthPx = naturalWidthPx * (zoom / 100);
  }
  const pageStyle = { width: renderWidthPx, aspectRatio: `${project.dimensions.widthMm} / ${project.dimensions.heightMm}`, flexShrink: 0 };
  const displayedZoomPct = Math.round((renderWidthPx / naturalWidthPx) * 100);

  const jumpToIssue = (issue: PrintIssue) => {
    goToIndex(issue.pageIndex);
  };

  const indicator = viewMode === 'spread' && currentSpread.right !== null
    ? `${currentSpread.left + 1}–${currentSpread.right + 1} / ${project.pages.length}`
    : `${pageIndex + 1} / ${project.pages.length}`;

  const pagesToShow = viewMode === 'spread' ? [currentSpread.left, currentSpread.right] : [pageIndex];

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[500] flex flex-col bg-[#ECEBE8]"
      data-lenis-prevent
      role="dialog"
      aria-label="Magazine preview"
    >
      {controlsVisible && (
        <header className="flex-shrink-0 h-14 bg-white border-b border-[#E7E7E4] flex items-center justify-between px-4">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={onClose} aria-label="Back to editor" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#1C2024] hover:bg-[#F5F5F3] cursor-pointer">
              <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> Back to editor
            </button>
            <span className="text-[13px] font-semibold text-[#1C2024] truncate">{project.templateName}</span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[12px] text-[#6F7478] tabular-nums">{indicator}</span>

            <div className="flex items-center gap-0.5 p-1 rounded-lg bg-[#F5F5F3]">
              <button type="button" onClick={() => setViewMode('single')} aria-label="Single page view" title="Single Page" className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer ${viewMode === 'single' ? 'bg-white shadow-sm text-[#1C2024]' : 'text-[#6F7478]'}`}>
                <RectangleHorizontal className="w-3.5 h-3.5 rotate-90" strokeWidth={1.75} />
              </button>
              <button type="button" onClick={() => setViewMode('spread')} aria-label="Spread view" title="Spread" className={`w-7 h-7 rounded-md flex items-center justify-center cursor-pointer ${viewMode === 'spread' ? 'bg-white shadow-sm text-[#1C2024]' : 'text-[#6F7478]'}`}>
                <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button type="button" onClick={() => { setFit(false); setZoom((z) => Math.max(ZOOM_MIN, z - 10)); }} aria-label="Zoom out" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer">
                <Minus className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
              <button type="button" onClick={() => setFit(true)} title={viewMode === 'spread' ? 'Fit Spread' : 'Fit Page'} className="text-[12px] text-[#1C2024] w-14 text-center cursor-pointer hover:underline">
                {fit ? `Fit ${displayedZoomPct}%` : `${zoom}%`}
              </button>
              <button type="button" onClick={() => { setFit(false); setZoom((z) => Math.min(ZOOM_MAX, z + 10)); }} aria-label="Zoom in" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer">
                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setThumbnailsVisible((v) => !v)}
              aria-label={thumbnailsVisible ? 'Hide thumbnails' : 'Show thumbnails'}
              title={thumbnailsVisible ? 'Hide thumbnails' : 'Show thumbnails'}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer"
            >
              {thumbnailsVisible ? <PanelBottomClose className="w-3.5 h-3.5" strokeWidth={1.75} /> : <PanelBottomOpen className="w-3.5 h-3.5" strokeWidth={1.75} />}
            </button>

            <button
              type="button"
              onClick={() => setPrintOpen((v) => !v)}
              aria-pressed={printOpen}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer ${printOpen ? 'bg-[#20272C] text-white' : 'text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3]'}`}
            >
              <Printer className="w-3.5 h-3.5" strokeWidth={1.75} /> Print Preview
            </button>

            <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] cursor-pointer">
              {fullscreen ? <Minimize className="w-3.5 h-3.5" strokeWidth={1.75} /> : <Maximize className="w-3.5 h-3.5" strokeWidth={1.75} />}
            </button>
          </div>
        </header>
      )}

      <div className="flex-1 min-h-0 flex overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div ref={viewportRef} className="flex-1 min-h-0 flex items-center justify-center gap-4 p-8 overflow-auto relative">
            {controlsVisible && (
              <button type="button" onClick={goPrev} disabled={pageIndex === 0} aria-label="Previous page" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#E7E7E4] shadow-sm flex items-center justify-center text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-[#F5F5F3] cursor-pointer z-10">
                <ChevronLeft className="w-4 h-4" strokeWidth={2} />
              </button>
            )}

            {renderError ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <AlertTriangle className="w-6 h-6 text-[#6F7478]" strokeWidth={1.75} />
                <p className="text-[13px] text-[#6F7478]">Couldn't preview this page.</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setRenderError(false)} className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-white cursor-pointer">Retry</button>
                  <button type="button" onClick={goNext} className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-white cursor-pointer">Next page</button>
                </div>
              </div>
            ) : (
              <div
                key={reducedMotion ? undefined : animKey}
                className={reducedMotion ? undefined : 'motion-safe:animate-[previewFade_0.22s_ease]'}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, height: '100%', width: '100%' }}
              >
                {pagesToShow.map((idx) => {
                  if (idx === null) return null;
                  const p = project.pages[idx];
                  if (!p) return null;
                  return (
                    <div
                      key={p.id}
                      className="rounded-sm shadow-[0_25px_70px_-20px_rgba(0,0,0,0.4)] bg-white relative"
                      style={pageStyle}
                    >
                      <MiniPageThumbnail
                        page={p}
                        dimensions={project.dimensions}
                        gradient={project.accentGradient}
                        isCoverLike={p.kind === 'cover' || p.kind === 'back-cover'}
                        showBleed={printOpen && printBleed}
                        showTrimBoundary={printOpen && printTrim}
                        showSafeArea={printOpen && printSafeArea}
                        extendBleed={printOpen && printBleed}
                      />
                      {(() => {
                        const pn = pageNumberFor(idx);
                        if (!pn) return null;
                        const posStyle: React.CSSProperties = pn.position.includes('top') ? { top: '4%' } : { bottom: '4%' };
                        if (pn.position.includes('left')) posStyle.left = '6%';
                        else if (pn.position.includes('right')) posStyle.right = '6%';
                        else { posStyle.left = '50%'; posStyle.transform = 'translateX(-50%)'; }
                        return <div className="absolute pointer-events-none select-none" style={{ ...posStyle, fontFamily: pn.fontFamily, fontSize: pn.fontSize, color: pn.color }}>{pn.label}</div>;
                      })()}
                    </div>
                  );
                })}
              </div>
            )}

            {controlsVisible && (
              <button type="button" onClick={goNext} disabled={pageIndex === project.pages.length - 1} aria-label="Next page" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#E7E7E4] shadow-sm flex items-center justify-center text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-[#F5F5F3] cursor-pointer z-10">
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </button>
            )}
          </div>

          {thumbnailsVisible && controlsVisible && (
            <div className="flex-shrink-0 border-t border-[#E7E7E4] bg-white px-4 py-2.5 overflow-x-auto">
              <div className="flex items-center gap-2 w-max">
                {project.pages.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => goToIndex(i)}
                    aria-label={`Go to page ${i + 1}, ${p.name}`}
                    aria-current={pagesToShow.includes(i)}
                    className={`flex-shrink-0 w-11 rounded border-2 overflow-hidden cursor-pointer transition-colors ${pagesToShow.includes(i) ? 'border-[#20272C]' : 'border-transparent hover:border-[#E7E7E4]'}`}
                    style={{ aspectRatio: `${project.dimensions.widthMm} / ${project.dimensions.heightMm}` }}
                  >
                    <MiniPageThumbnail page={p} dimensions={project.dimensions} gradient={project.accentGradient} isCoverLike={p.kind === 'cover' || p.kind === 'back-cover'} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {printOpen && (
          <PrintPreviewPanel
            report={report}
            dimensions={project.dimensions}
            pageCount={project.pages.length}
            onJumpToIssue={jumpToIssue}
            onFixIssue={(issue) => onFixIssue(issue.pageId, issue.elementId)}
            showBleed={printBleed}
            onToggleBleed={() => setPrintBleed((v) => !v)}
            showSafeArea={printSafeArea}
            onToggleSafeArea={() => setPrintSafeArea((v) => !v)}
            showTrimBoundary={printTrim}
            onToggleTrimBoundary={() => setPrintTrim((v) => !v)}
            showPageNumbers={printPageNumbers}
            onTogglePageNumbers={() => setPrintPageNumbers((v) => !v)}
            onDownloadPdf={onOpenExport}
          />
        )}
      </div>
      <style>{'@keyframes previewFade { from { opacity: 0.4; transform: translateX(4px); } to { opacity: 1; transform: translateX(0); } }'}</style>
    </div>
  );
}
