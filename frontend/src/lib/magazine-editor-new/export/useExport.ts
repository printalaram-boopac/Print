import { useRef, useState } from 'react';
import type { EditorProject } from '../types';
import { parsePageRange } from './pageRange';
import { exportPdf } from './pdfExporter';
import { exportImages } from './imageExporter';
import { downloadBlob } from './downloadBlob';
import type { ExportOptions, ExportProgress } from './types';

const IDLE: ExportProgress = { phase: 'idle', currentPage: 0, totalPages: 0, message: '' };

function resolvePageIndices(project: EditorProject, currentPageIndex: number, selectedPageIds: string[], options: ExportOptions): number[] | { error: string } {
  if (options.pageSelection === 'all') return project.pages.map((_, i) => i);
  if (options.pageSelection === 'current') return [currentPageIndex];
  if (options.pageSelection === 'selected') {
    const idx = project.pages.map((p, i) => (selectedPageIds.includes(p.id) ? i : -1)).filter((i) => i >= 0);
    return idx.length > 0 ? idx : { error: 'No pages are selected.' };
  }
  const rangeResult = parsePageRange(options.customRange, project.pages.length);
  return 'pages' in rangeResult ? rangeResult.pages : rangeResult;
}

/**
 * Orchestrates one export run (Step 12). `project` is captured by value at
 * the moment export starts — since every edit in this editor already
 * produces new objects rather than mutating in place, that's automatically
 * an immutable snapshot (§86): edits made while an export is rendering can
 * never change pages already being drawn.
 */
export function useExport(project: EditorProject, currentPageIndex: number, selectedPageIds: string[]) {
  const [progress, setProgress] = useState<ExportProgress>(IDLE);
  const cancelledRef = useRef(false);
  const lastOptionsRef = useRef<ExportOptions | null>(null);

  const run = async (options: ExportOptions) => {
    lastOptionsRef.current = options;
    cancelledRef.current = false;
    const snapshot = project;

    const pagesResult = resolvePageIndices(snapshot, currentPageIndex, selectedPageIds, options);
    if ('error' in pagesResult) {
      setProgress({ phase: 'error', currentPage: 0, totalPages: 0, message: '', errorMessage: pagesResult.error });
      return;
    }

    setProgress({ phase: 'rendering', currentPage: 0, totalPages: pagesResult.length, message: 'Preparing your magazine…' });
    try {
      const result = options.fileType === 'pdf-print' || options.fileType === 'pdf-standard'
        ? await exportPdf(snapshot, pagesResult, options, setProgress, () => cancelledRef.current)
        : await exportImages(snapshot, pagesResult, options, setProgress, () => cancelledRef.current);

      downloadBlob(result.blob, result.fileName);
      setProgress({ phase: 'done', currentPage: pagesResult.length, totalPages: pagesResult.length, message: 'Download ready' });
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setProgress({ phase: 'cancelled', currentPage: 0, totalPages: 0, message: 'Export cancelled' });
      } else {
        setProgress({ phase: 'error', currentPage: 0, totalPages: 0, message: '', errorMessage: e instanceof Error ? e.message : "We couldn't generate the file." });
      }
    }
  };

  const cancel = () => { cancelledRef.current = true; };
  const retry = () => { if (lastOptionsRef.current) run(lastOptionsRef.current); };
  const reset = () => setProgress(IDLE);

  return { progress, run, cancel, retry, reset };
}
