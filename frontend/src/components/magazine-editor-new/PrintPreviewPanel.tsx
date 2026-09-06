import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, AlertTriangle, Download } from 'lucide-react';
import type { TemplateDimensions } from '@/lib/magazine-editor-new/types';
import type { PrintIssue, PrintReport } from '@/lib/magazine-editor-new/printPreview';
import { BLEED_MM } from '@/lib/magazine-editor-new/printGuides';

interface PrintPreviewPanelProps {
  report: PrintReport;
  dimensions: TemplateDimensions;
  pageCount: number;
  onJumpToIssue: (issue: PrintIssue) => void;
  onFixIssue: (issue: PrintIssue) => void;
  showBleed: boolean;
  onToggleBleed: () => void;
  showSafeArea: boolean;
  onToggleSafeArea: () => void;
  showTrimBoundary: boolean;
  onToggleTrimBoundary: () => void;
  showPageNumbers: boolean;
  onTogglePageNumbers: () => void;
  onDownloadPdf: () => void;
}

/** Step 10 §28–40 — print-readiness review. Reads the same live document
 * (see printPreview.ts) rather than a separately maintained export preview. */
export default function PrintPreviewPanel({
  report, dimensions, pageCount, onJumpToIssue, onFixIssue,
  showBleed, onToggleBleed, showSafeArea, onToggleSafeArea, showTrimBoundary, onToggleTrimBoundary,
  showPageNumbers, onTogglePageNumbers, onDownloadPdf,
}: PrintPreviewPanelProps) {
  const [issuesOpen, setIssuesOpen] = useState(true);

  return (
    <aside className="w-72 flex-shrink-0 bg-white border-l border-[#2A2A28] flex flex-col min-h-0 text-[#1C2024]">
      <div className="p-4 border-b border-[#E7E7E4]">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold">Print Preview</h2>
          <button type="button" onClick={onDownloadPdf} className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] cursor-pointer">
            <Download className="w-3 h-3" strokeWidth={2} /> Download PDF
          </button>
        </div>
        <p className="mt-1 text-[11px] text-[#6F7478]">
          {dimensions.orientation === 'landscape' ? 'Landscape' : dimensions.orientation === 'square' ? 'Square' : 'Portrait'} • {Math.round(dimensions.widthMm)} × {Math.round(dimensions.heightMm)} mm
        </p>
        <p className="text-[11px] text-[#6F7478]">{BLEED_MM} mm bleed • {pageCount} pages</p>
      </div>

      <div className="p-4 border-b border-[#E7E7E4] space-y-2">
        <label className="flex items-center justify-between text-[12px] cursor-pointer">
          Show trim boundary
          <input type="checkbox" checked={showTrimBoundary} onChange={onToggleTrimBoundary} className="w-3.5 h-3.5 accent-[#B8895A] cursor-pointer" />
        </label>
        <label className="flex items-center justify-between text-[12px] cursor-pointer">
          Show bleed
          <input type="checkbox" checked={showBleed} onChange={onToggleBleed} className="w-3.5 h-3.5 accent-[#B8895A] cursor-pointer" />
        </label>
        <label className="flex items-center justify-between text-[12px] cursor-pointer">
          Show safe area
          <input type="checkbox" checked={showSafeArea} onChange={onToggleSafeArea} className="w-3.5 h-3.5 accent-[#B8895A] cursor-pointer" />
        </label>
        <label className="flex items-center justify-between text-[12px] cursor-pointer">
          Page numbers
          <input type="checkbox" checked={showPageNumbers} onChange={onTogglePageNumbers} className="w-3.5 h-3.5 accent-[#B8895A] cursor-pointer" />
        </label>
      </div>

      <div className="p-4 border-b border-[#E7E7E4]">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6F7478]">Print Quality</span>
        <ul className="mt-1.5 space-y-0.5 text-[12px] text-[#1C2024]">
          <li>{report.quality.good} images good</li>
          {report.quality.acceptable > 0 && <li>{report.quality.acceptable} acceptable</li>}
          {report.quality.low > 0 && <li>{report.quality.low} low-resolution</li>}
        </ul>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {report.issues.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-2 py-8">
            <CheckCircle2 className="w-6 h-6 text-[#3E6B63]" strokeWidth={1.75} />
            <p className="text-[13px] font-medium text-[#1C2024]">Ready for print</p>
          </div>
        ) : (
          <>
            <button type="button" onClick={() => setIssuesOpen((v) => !v)} className="w-full flex items-center justify-between cursor-pointer">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6F7478]">Issues ({report.issues.length})</span>
              {issuesOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#6F7478]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#6F7478]" />}
            </button>
            {issuesOpen && (
              <ul className="mt-2 space-y-1.5">
                {report.issues.map((issue) => (
                  <li key={issue.id} className="group flex items-start gap-1.5 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F3]">
                    <button
                      type="button"
                      onClick={() => onJumpToIssue(issue)}
                      className="flex-1 flex items-start gap-1.5 text-left cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-[#B8895A] flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                      <span className="text-[12px] text-[#1C2024]">{issue.message}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onFixIssue(issue)}
                      className="hidden group-hover:block flex-shrink-0 text-[11px] font-medium text-[#B8895A] hover:underline cursor-pointer"
                    >
                      Fix
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
