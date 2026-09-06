import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import TemplateSearch from './TemplateSearch';
import { PHOTO_CATEGORIES, PHOTO_LIBRARY } from '@/lib/magazine-editor-new/photoLibrary';
import type { LibraryPhoto, PhotoCategory } from '@/lib/magazine-editor-new/types';

interface PhotosPanelProps {
  onAddPhoto: (url: string, width: number, height: number) => void;
}

export default function PhotosPanel({ onAddPhoto }: PhotosPanelProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PhotoCategory | 'All'>('Featured');

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return PHOTO_LIBRARY.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesSearch = !query || p.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <aside className="w-[340px] flex-shrink-0 bg-white border-r border-[#E7E7E4] flex flex-col min-h-0">
      <div className="p-4 space-y-3 border-b border-[#E7E7E4]">
        <h2 className="text-[15px] font-semibold text-[#1C2024]">Photos</h2>
        <TemplateSearch value={search} onChange={setSearch} />
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
          {(['All', ...PHOTO_CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                category === cat ? 'bg-[#20272C] text-white' : 'bg-[#F5F5F3] text-[#6F7478] hover:text-[#1C2024]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {visible.map((photo: LibraryPhoto) => (
            <div key={photo.id} className="group relative rounded-lg overflow-hidden border border-[#E7E7E4] cursor-pointer" style={{ aspectRatio: '3 / 4' }}>
              <img src={photo.url} alt="" loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onAddPhoto(photo.url, photo.width, photo.height)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 text-[#1C2024] text-[11px] font-semibold hover:bg-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" strokeWidth={2} /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
