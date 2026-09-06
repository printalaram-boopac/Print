import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MagazineTemplate } from '@/lib/magazine-editor-new/types';
import PreviewCanvas from './PreviewCanvas';
import PreviewThumbnails from './PreviewThumbnails';
import TemplateInfo from './TemplateInfo';

interface TemplatePreviewModalProps {
  template: MagazineTemplate;
  onClose: () => void;
  onUseTemplate: (template: MagazineTemplate) => void;
}

export default function TemplatePreviewModal({ template, onClose, onUseTemplate }: TemplatePreviewModalProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const page = template.pages[pageIndex];

  const goPrev = () => setPageIndex((i) => Math.max(0, i - 1));
  const goNext = () => setPageIndex((i) => Math.min(template.pages.length - 1, i + 1));

  return (
    <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-6" data-lenis-prevent onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E7E7E4] flex-shrink-0">
          <span className="text-[13px] font-semibold text-[#1C2024]">Template Preview</span>
          <button type="button" onClick={onClose} aria-label="Close preview" className="text-[#6F7478] hover:text-[#1C2024] cursor-pointer">
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 min-h-0 flex overflow-hidden">
          <div className="flex-1 flex items-center justify-center bg-[#F5F5F3] p-8 relative">
            <button
              type="button"
              onClick={goPrev}
              disabled={pageIndex === 0}
              aria-label="Previous page"
              className="absolute left-4 w-9 h-9 rounded-full bg-white border border-[#E7E7E4] shadow-sm flex items-center justify-center text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-[#F5F5F3] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            </button>

            <div style={{ width: 340, aspectRatio: '210 / 297' }}>
              <PreviewCanvas page={page} gradient={template.accentGradient} dimensions={template.dimensions} />
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={pageIndex === template.pages.length - 1}
              aria-label="Next page"
              className="absolute right-4 w-9 h-9 rounded-full bg-white border border-[#E7E7E4] shadow-sm flex items-center justify-center text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-[#F5F5F3] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          <div className="w-[260px] flex-shrink-0 border-l border-[#E7E7E4] flex flex-col p-4 gap-4 overflow-y-auto">
            <TemplateInfo template={template} activePageName={page.name} />
            <PreviewThumbnails pages={template.pages} gradient={template.accentGradient} dimensions={template.dimensions} activeIndex={pageIndex} onSelect={setPageIndex} />
            <button
              type="button"
              onClick={() => onUseTemplate(template)}
              className="mt-auto w-full py-2.5 rounded-lg text-[13px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] transition-colors cursor-pointer"
            >
              Use this template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
