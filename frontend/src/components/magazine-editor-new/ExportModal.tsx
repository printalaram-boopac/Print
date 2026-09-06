import { useMemo, useState } from 'react';
import { X, Download, AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import type { EditorProject } from '@/lib/magazine-editor-new/types';
import { DEFAULT_EXPORT_OPTIONS, type ExportFileType, type ExportOptions, type ImageQualityPreset, type PageSelection } from '@/lib/magazine-editor-new/export/types';
import { parsePageRange } from '@/lib/magazine-editor-new/export/pageRange';
import { computeExportPreflight } from '@/lib/magazine-editor-new/export/preflight';
import { useExport } from '@/lib/magazine-editor-new/export/useExport';
import { BLEED_MM } from '@/lib/magazine-editor-new/printGuides';

interface ExportModalProps {
  project: EditorProject;
  currentPageIndex: number;
  selectedPageIds: string[];
  initialFileType?: ExportFileType;
  onClose: () => void;
  onReviewIssues: () => void;
}

const FILE_TYPES: { value: ExportFileType; label: string; hint: string }[] = [
  { value: 'pdf-print', label: 'PDF Print', hint: 'Highest quality, for professional printing' },
  { value: 'pdf-standard', label: 'PDF Standard', hint: 'Smaller file, for email/digital sharing' },
  { value: 'png', label: 'PNG', hint: 'Individual high-quality page images' },
  { value: 'jpeg', label: 'JPEG', hint: 'Individual compressed page images' },
];

export default function ExportModal({ project, currentPageIndex, selectedPageIds, initialFileType, onClose, onReviewIssues }: ExportModalProps) {
  const [options, setOptions] = useState<ExportOptions>({
    ...DEFAULT_EXPORT_OPTIONS,
    fileType: initialFileType ?? DEFAULT_EXPORT_OPTIONS.fileType,
    pageSelection: selectedPageIds.length > 1 ? 'selected' : 'all',
  });
  const { progress, run, cancel, retry, reset } = useExport(project, currentPageIndex, selectedPageIds);

  const rangeResult = options.pageSelection === 'custom' ? parsePageRange(options.customRange, project.pages.length) : null;
  const pageIndices = useMemo(() => {
    if (options.pageSelection === 'all') return project.pages.map((_, i) => i);
    if (options.pageSelection === 'current') return [currentPageIndex];
    if (options.pageSelection === 'selected') return project.pages.map((p, i) => (selectedPageIds.includes(p.id) ? i : -1)).filter((i) => i >= 0);
    return rangeResult && 'pages' in rangeResult ? rangeResult.pages : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.pageSelection, options.customRange, project.pages.length, currentPageIndex, selectedPageIds]);

  const isPdfPrint = options.fileType === 'pdf-print';
  const isImage = options.fileType === 'png' || options.fileType === 'jpeg';

  const preflight = useMemo(
    () => (isPdfPrint && pageIndices.length > 0 ? computeExportPreflight(project, pageIndices) : null),
    [isPdfPrint, project, pageIndices],
  );

  const rangeError = rangeResult && 'error' in rangeResult ? rangeResult.error : null;
  const canDownload = pageIndices.length > 0 && !rangeError;
  const isBusy = progress.phase === 'rendering';
  const isDone = progress.phase === 'done';
  const isError = progress.phase === 'error';
  const isCancelled = progress.phase === 'cancelled';

  return (
    <div className="fixed inset-0 z-[550] bg-black/60 flex items-center justify-center p-6" data-lenis-prevent onClick={isBusy ? undefined : onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E7E4] flex-shrink-0">
          <h2 className="text-[15px] font-semibold text-[#1C2024]">Download</h2>
          <button type="button" onClick={onClose} disabled={isBusy} aria-label="Close" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] disabled:opacity-30 cursor-pointer">
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {isBusy || isDone || isError || isCancelled ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            {isBusy && (
              <>
                <Loader2 className="w-7 h-7 text-[#B8895A] animate-spin" strokeWidth={1.75} />
                <div>
                  <p className="text-[13px] font-medium text-[#1C2024]">{progress.message}</p>
                  {progress.totalPages > 0 && (
                    <p className="mt-1 text-[12px] text-[#6F7478]">{Math.round((progress.currentPage / progress.totalPages) * 100)}%</p>
                  )}
                </div>
                <button type="button" onClick={cancel} className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer">Cancel</button>
              </>
            )}
            {isDone && (
              <>
                <CheckCircle2 className="w-7 h-7 text-[#3E6B63]" strokeWidth={1.75} />
                <p className="text-[13px] font-medium text-[#1C2024]">Download ready</p>
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] cursor-pointer">Done</button>
              </>
            )}
            {isCancelled && (
              <>
                <XCircle className="w-7 h-7 text-[#6F7478]" strokeWidth={1.75} />
                <p className="text-[13px] font-medium text-[#1C2024]">Export cancelled</p>
                <button type="button" onClick={reset} className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer">Back</button>
              </>
            )}
            {isError && (
              <>
                <AlertTriangle className="w-7 h-7 text-red-600" strokeWidth={1.75} />
                <div>
                  <p className="text-[13px] font-medium text-[#1C2024]">Export failed</p>
                  <p className="mt-1 text-[12px] text-[#6F7478]">{progress.errorMessage || "We couldn't generate the file."}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={reset} className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer">Cancel</button>
                  <button type="button" onClick={retry} className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] cursor-pointer">Try again</button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#6F7478] mb-2">File type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {FILE_TYPES.map((ft) => (
                    <button
                      key={ft.value}
                      type="button"
                      onClick={() => setOptions((o) => ({ ...o, fileType: ft.value }))}
                      className={`text-left px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${options.fileType === ft.value ? 'border-[#B8895A] bg-[#B8895A]/5' : 'border-[#E7E7E4] hover:bg-[#F5F5F3]'}`}
                    >
                      <p className="text-[12px] font-semibold text-[#1C2024]">{ft.label}</p>
                      <p className="text-[10px] text-[#6F7478] mt-0.5 leading-snug">{ft.hint}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#6F7478] mb-2">Pages</h3>
                <div className="flex flex-col gap-1.5">
                  {(['all', 'current', ...(selectedPageIds.length > 1 ? ['selected'] as const : []), 'custom'] as PageSelection[]).map((sel) => (
                    <label key={sel} className="flex items-center gap-2 text-[12px] text-[#1C2024] cursor-pointer">
                      <input type="radio" name="pageSelection" checked={options.pageSelection === sel} onChange={() => setOptions((o) => ({ ...o, pageSelection: sel }))} className="accent-[#B8895A] cursor-pointer" />
                      {sel === 'all' && `All pages (${project.pages.length})`}
                      {sel === 'current' && `Current page (${currentPageIndex + 1})`}
                      {sel === 'selected' && `Selected pages (${selectedPageIds.length})`}
                      {sel === 'custom' && 'Custom range'}
                    </label>
                  ))}
                  {options.pageSelection === 'custom' && (
                    <div className="ml-5 mt-1">
                      <input
                        type="text"
                        value={options.customRange}
                        onChange={(e) => setOptions((o) => ({ ...o, customRange: e.target.value }))}
                        placeholder="e.g. 1, 3, 5-8"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7E7E4] text-[12px] text-[#1C2024] focus:outline-none focus:border-[#B8895A]"
                      />
                      {rangeError && <p className="mt-1 text-[11px] text-red-600">{rangeError}</p>}
                    </div>
                  )}
                </div>
              </section>

              {isImage && (
                <section>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#6F7478] mb-2">Quality</h3>
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F5F5F3]">
                    {(['standard', 'high', 'print'] as ImageQualityPreset[]).map((q) => (
                      <button key={q} type="button" onClick={() => setOptions((o) => ({ ...o, imageQuality: q }))} className={`flex-1 py-1.5 rounded-md text-[11px] font-medium capitalize cursor-pointer ${options.imageQuality === q ? 'bg-white shadow-sm text-[#1C2024]' : 'text-[#6F7478]'}`}>{q}</button>
                    ))}
                  </div>
                  {options.fileType === 'jpeg' && (
                    <label className="mt-2.5 flex items-center justify-between text-[11px] text-[#6F7478]">
                      JPEG quality
                      <input type="range" min={0.5} max={1} step={0.05} value={options.jpegQuality} onChange={(e) => setOptions((o) => ({ ...o, jpegQuality: Number(e.target.value) }))} className="w-32 accent-[#B8895A] cursor-pointer" />
                    </label>
                  )}
                </section>
              )}

              {isPdfPrint && (
                <section>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#6F7478] mb-2">Print settings</h3>
                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between text-[12px] text-[#1C2024] cursor-pointer">
                      Include bleed ({BLEED_MM}mm)
                      <input type="checkbox" checked={options.includeBleed} onChange={(e) => setOptions((o) => ({ ...o, includeBleed: e.target.checked }))} className="w-3.5 h-3.5 accent-[#B8895A] cursor-pointer" />
                    </label>
                    <label className="flex items-center justify-between text-[12px] text-[#1C2024] cursor-pointer">
                      Crop marks
                      <input type="checkbox" checked={options.cropMarks} onChange={(e) => setOptions((o) => ({ ...o, cropMarks: e.target.checked }))} className="w-3.5 h-3.5 accent-[#B8895A] cursor-pointer" />
                    </label>
                  </div>
                </section>
              )}

              {preflight && (
                preflight.issues.length === 0 ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5F3]">
                    <CheckCircle2 className="w-4 h-4 text-[#3E6B63] flex-shrink-0" strokeWidth={1.75} />
                    <span className="text-[12px] text-[#1C2024]">Ready to export</span>
                  </div>
                ) : (
                  <div className="px-3 py-2.5 rounded-lg bg-[#FFF8E6] border border-[#F0DFB0]">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#B8895A] flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                      <div className="flex-1">
                        <p className="text-[12px] text-[#1C2024] font-medium leading-snug">
                          {preflight.issues.length} issue{preflight.issues.length === 1 ? '' : 's'} found — quality may be reduced.
                        </p>
                        <button
                          type="button"
                          onClick={onReviewIssues}
                          className="mt-1 text-[11px] font-semibold text-[#B8895A] hover:underline cursor-pointer"
                        >
                          Review issues
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="px-5 py-4 border-t border-[#E7E7E4] flex-shrink-0">
              <button
                type="button"
                onClick={() => run(options)}
                disabled={!canDownload}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" strokeWidth={1.75} /> Download
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
