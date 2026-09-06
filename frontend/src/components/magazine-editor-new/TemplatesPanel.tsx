import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTemplateLibrary } from '@/lib/magazine-editor-new/useTemplateLibrary';
import { PAGE_LAYOUTS } from '@/lib/magazine-editor-new/templates/pageLayouts';
import type { MagazineTemplate, TemplateCategory, TemplateDimensions, TemplatePage } from '@/lib/magazine-editor-new/types';
import TemplateSearch from './TemplateSearch';
import TemplateCategories from './TemplateCategories';
import TemplateCard from './TemplateCard';
import TemplateCardSkeleton from './TemplateCardSkeleton';
import BlankMagazineCard from './BlankMagazineCard';
import MiniPageThumbnail from './MiniPageThumbnail';

const PAGE_SIZE = 12;
const LAYOUT_DIMENSIONS: TemplateDimensions = { widthMm: 210, heightMm: 297, orientation: 'portrait' };

interface TemplatesPanelProps {
  recentTemplates?: MagazineTemplate[];
  onPreview: (template: MagazineTemplate) => void;
  onRequestApply: (template: MagazineTemplate) => void;
  onCreateBlank: (dimensions: TemplateDimensions) => void;
  onInsertPageLayout: (page: TemplatePage) => void;
}

export default function TemplatesPanel({ onPreview, onRequestApply, onCreateBlank, onInsertPageLayout }: TemplatesPanelProps) {
  const { templates, isLoading, error, retry } = useTemplateLibrary();
  const [tab, setTab] = useState<'magazines' | 'layouts'>('magazines');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<TemplateCategory | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (!templates) return [];
    const query = search.trim().toLowerCase();
    const matched = templates.filter((t) => {
      const matchesCategory = category === 'All' || t.category === category;
      const matchesSearch = !query
        || t.name.toLowerCase().includes(query)
        || t.category.toLowerCase().includes(query)
        || (t.description ?? '').toLowerCase().includes(query)
        || (t.tags ?? []).some((tag) => tag.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
    return [...matched].sort((a, b) => Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false));
  }, [templates, search, category]);

  const featured = useMemo(() => (templates ?? []).filter((t) => t.isFeatured).slice(0, 6), [templates]);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const showFeatured = tab === 'magazines' && !search && category === 'All' && featured.length > 0;

  return (
    <aside className="w-full h-full flex-1 bg-white flex flex-col min-h-0 overflow-x-hidden">
      <div className="p-4 space-y-3 border-b border-[#E7E7E4]">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-[#1C2024]">Templates</h2>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F5F5F3]">
          {(['magazines', 'layouts'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-md text-[12px] font-semibold cursor-pointer transition-colors ${tab === t ? 'bg-white shadow-sm text-[#1C2024]' : 'text-[#6F7478]'}`}
            >
              {t === 'magazines' ? 'Full Magazines' : 'Page Layouts'}
            </button>
          ))}
        </div>

        {tab === 'magazines' && (
          <>
            <TemplateSearch value={search} onChange={(v) => { setSearch(v); setVisibleCount(PAGE_SIZE); }} />
            <TemplateCategories value={category} onChange={(v) => { setCategory(v); setVisibleCount(PAGE_SIZE); }} />
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        {tab === 'layouts' ? (
          <div className="grid grid-cols-2 gap-3">
            {PAGE_LAYOUTS.map((layout) => (
              <div key={layout.id} className="group">
                <button
                  type="button"
                  title={layout.description}
                  onClick={() => onInsertPageLayout(layout.build())}
                  className="relative w-full rounded-lg overflow-hidden border border-[#E7E7E4] shadow-sm group-hover:shadow-md group-hover:border-[#B8895A] transition-all cursor-pointer"
                  style={{ aspectRatio: '210 / 297' }}
                >
                  <MiniPageThumbnail page={layout.build()} dimensions={LAYOUT_DIMENSIONS} gradient="" isCoverLike={layout.id === 'layout-cover'} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/90 text-[#1C2024]">Insert page</span>
                  </div>
                </button>
                <p className="mt-1.5 text-[12px] font-medium text-[#1C2024] truncate">{layout.name}</p>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center text-center gap-3 py-10">
            <p className="text-[13px] text-[#6F7478]">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E7E7E4] text-[12px] font-medium text-[#1C2024] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} /> Try again
            </button>
          </div>
        ) : (
          <>
            {showFeatured && (
              <div className="mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6F7478]">Featured</span>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {featured.map((t) => (
                    <TemplateCard key={t.id} template={t} onPreview={onPreview} onUse={onRequestApply} />
                  ))}
                </div>
                <div className="mt-4 border-t border-[#E7E7E4]" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {category === 'All' && !search && <BlankMagazineCard onCreate={onCreateBlank} />}
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <TemplateCardSkeleton key={i} />)
                : visible.map((t) => (
                    <TemplateCard key={t.id} template={t} onPreview={onPreview} onUse={onRequestApply} />
                  ))}
            </div>

            {!isLoading && visible.length === 0 && (
              <p className="text-[13px] text-[#6F7478] text-center py-10">No templates match your search.</p>
            )}

            {!isLoading && hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-4 py-2 rounded-full border border-[#E7E7E4] text-[12px] font-semibold text-[#1C2024] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
