import { useMemo, useState, useRef } from 'react';
import {
  Plus,
  Mic,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import {
  ELEMENT_LIBRARY,
  ELEMENT_CATEGORIES,
} from '@/lib/magazine-editor-new/elementsLibrary';
import {
  MAGIC_RECOMMENDATION_ITEMS,
  FEATURED_ITEMS,
  GRADIENT_ITEMS,
  type CanvaCollectionMeta,
} from '@/lib/magazine-editor-new/canvaCollectionsLibrary';
import type { ElementLibraryItem } from '@/lib/magazine-editor-new/types';
import ElementThumbnail from './ElementThumbnail';

interface ElementsPanelProps {
  recentItemIds?: string[];
  onAddElement: (item: ElementLibraryItem) => void;
}

function ElementTile({
  item,
  onAdd,
}: {
  item: ElementLibraryItem;
  onAdd: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="group relative rounded-xl overflow-hidden border border-[#E7E7E4] hover:border-[#8B3DFF] hover:shadow-md transition-all duration-200 cursor-pointer bg-white hover:scale-[1.03] active:scale-[0.98]"
      style={{ aspectRatio: '1 / 1' }}
      title={item.name}
    >
      <ElementThumbnail item={item} />
    </button>
  );
}


// Canva horizontal scroll row with right floating scroll arrow button (exactly 3 items per line)
function CanvaCarouselRow({
  title,
  onSeeAll,
  children,
}: {
  title: string;
  onSeeAll?: () => void;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/row w-full overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px] font-bold text-[#1C2024]">{title}</span>
        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-[12px] font-semibold text-[#8B3DFF] hover:underline cursor-pointer"
          >
            See all
          </button>
        )}
      </div>
      <div className="relative w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/95 rounded-full shadow-md border border-[#E7E7E4] flex items-center justify-center text-[#1C2024] hover:bg-white hover:scale-110 transition-all z-10 cursor-pointer"
          title="Scroll next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ElementsPanel({
  onAddElement,
}: ElementsPanelProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCollection, setActiveCollection] = useState<CanvaCollectionMeta | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = ELEMENT_LIBRARY;
    if (selectedCategory !== 'All') {
      list = list.filter((i) => i.category === selectedCategory);
    }
    if (query) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.tags.some((t) => t.toLowerCase().includes(query)),
      );
    }
    return list;
  }, [search, selectedCategory]);

  const isFiltering = search.trim().length > 0 || selectedCategory !== 'All';

  return (
    <aside className="w-full h-full flex-1 bg-white flex flex-col min-h-0 select-none overflow-x-hidden">
      {/* Exact Canva Elements Search Header */}
      <div className="p-4 space-y-3 border-b border-[#E7E7E4]">
        {/* Search Bar with + and mic */}
        <div className="relative flex items-center bg-white border-2 border-[#E7E7E4] focus-within:border-[#8B3DFF] focus-within:ring-2 focus-within:ring-[#8B3DFF]/20 rounded-2xl px-3 py-2 transition-all shadow-xs">
          <Plus className="w-5 h-5 text-[#6F7478] mr-2 flex-shrink-0" strokeWidth={2} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (activeCollection) setActiveCollection(null);
            }}
            placeholder="Describe your ideal element"
            className="w-full bg-transparent text-[13.5px] text-[#1C2024] placeholder:text-[#8D9296] focus:outline-none"
          />
          <button
            type="button"
            title="Voice Search"
            className="text-[#6F7478] hover:text-[#1C2024] ml-2 p-0.5 rounded-full hover:bg-[#F2F3F5] transition-colors"
          >
            <Mic className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* Action Buttons: [Generate v] and [Search] */}
        <div className="flex items-center gap-2">
          <div className="flex items-center flex-1 bg-[#F5F5F3] hover:bg-[#EBEDF0] border border-[#E7E7E4] rounded-xl overflow-hidden transition-colors">
            <button
              type="button"
              onClick={() => {
                if (!search) setSearch('sparkle');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-[13px] font-semibold text-[#1C2024]"
            >
              <Sparkles className="w-4 h-4 text-[#8B3DFF]" strokeWidth={2} />
              <span>Generate</span>
            </button>
            <div className="w-[1px] h-5 bg-[#D8DADC]" />
            <button
              type="button"
              title="More options"
              className="px-2 py-2 text-[#6F7478] hover:text-[#1C2024]"
            >
              <ChevronDown className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {}}
            className="px-6 py-2 bg-[#8B3DFF] hover:bg-[#7D2AE8] active:bg-[#6D1FD8] text-white text-[13px] font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* Category Pills (Canva Style) */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs font-medium"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setActiveCollection(null);
            }}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === 'All' && !activeCollection
                ? 'bg-[#8B3DFF] text-white shadow-sm font-semibold'
                : 'bg-[#F2F3F5] text-[#3B3F45] hover:bg-[#E8EAED]'
            }`}
          >
            All
          </button>
          {ELEMENT_CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedCategory(key);
                setActiveCollection(null);
              }}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === key && !activeCollection
                  ? 'bg-[#8B3DFF] text-white shadow-sm font-semibold'
                  : 'bg-[#F2F3F5] text-[#3B3F45] hover:bg-[#E8EAED]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
        {activeCollection ? (
          /* Active Collection Detail View */
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E7E7E4]">
              <button
                type="button"
                onClick={() => setActiveCollection(null)}
                className="p-1.5 rounded-lg hover:bg-[#F2F3F5] text-[#1C2024] transition-colors"
                title="Back to elements"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-[14.5px] font-bold text-[#1C2024]">
                  {activeCollection.title}
                </h3>
                <p className="text-[12px] text-[#6F7478]">
                  {activeCollection.itemCount} graphics
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {activeCollection.items.map((item) => (
                <ElementTile
                  key={item.id}
                  item={item}
                  onAdd={() => onAddElement(item)}
                />
              ))}
            </div>
          </div>
        ) : isFiltering ? (
          /* Search or Category Filtered Grid */
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearch('');
                  }}
                  className="p-1 rounded-md hover:bg-[#F2F3F5] text-[#1C2024] mr-1"
                  title="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-[13px] font-bold text-[#1C2024]">
                  {selectedCategory === 'All' ? 'Results' : selectedCategory} ({filtered.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearch('');
                }}
                className="text-[11.5px] font-semibold text-[#8B3DFF] hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {filtered.map((item) => (
                <ElementTile
                  key={item.id}
                  item={item}
                  onAdd={() => onAddElement(item)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[13px] font-medium text-[#1C2024]">No elements found</p>
                <p className="text-[12px] text-[#6F7478] mt-1">
                  Try searching for flowers, animals, badges, or shapes
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Canva Default Sections: Exactly 3 Lines with 3 Items Per Line */
          <>
            {/* Line 1: Magic Recommendations */}
            <CanvaCarouselRow
              title="Magic recommendations"
              onSeeAll={() => setSelectedCategory('Magic Recommendations')}
            >
              {MAGIC_RECOMMENDATION_ITEMS.map((item) => (
                <div key={item.id} className="w-[calc((100%-20px)/3)] aspect-square flex-shrink-0">
                  <ElementTile item={item} onAdd={() => onAddElement(item)} />
                </div>
              ))}
            </CanvaCarouselRow>

            {/* Line 2: Featured */}
            <CanvaCarouselRow
              title="Featured"
              onSeeAll={() => setSelectedCategory('Featured')}
            >
              {FEATURED_ITEMS.map((item) => (
                <div key={item.id} className="w-[calc((100%-20px)/3)] aspect-square flex-shrink-0">
                  <ElementTile item={item} onAdd={() => onAddElement(item)} />
                </div>
              ))}
            </CanvaCarouselRow>

            {/* Line 3: Gradient */}
            <CanvaCarouselRow
              title="Gradient"
              onSeeAll={() => setSelectedCategory('Gradients')}
            >
              {GRADIENT_ITEMS.map((item) => (
                <div key={item.id} className="w-[calc((100%-20px)/3)] aspect-square flex-shrink-0">
                  <ElementTile item={item} onAdd={() => onAddElement(item)} />
                </div>
              ))}
            </CanvaCarouselRow>
          </>
        )}
      </div>
    </aside>
  );
}
