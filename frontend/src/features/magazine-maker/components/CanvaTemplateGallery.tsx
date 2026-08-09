import { useState } from 'react';
import { Search, Sparkles, Plus, Eye, ArrowRight, Layers } from 'lucide-react';
import { MagazineConfig, PageLayoutType } from '../types';
import { createDefaultPage } from '../templates';

export interface MagazineTemplateItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Magazines' | 'Documents' | 'Magazine Covers' | 'Posters' | 'Instagram Posts' | 'More Templates';
  pageCount: number;
  badge?: string;
  coverImage: string;
  themeColor: string;
  fontFamily: string;
  layouts: PageLayoutType[];
  description: string;
}

export const CANVA_CATALOG: MagazineTemplateItem[] = [
  // CATEGORY: Magazines
  {
    id: 'icona-fashion',
    title: 'ICONA Luxury Editorial',
    subtitle: 'VOL. 18 • THE AUTUMN FASHION & BEAUTY ISSUE',
    category: 'Magazines',
    pageCount: 20,
    badge: 'Popular',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    themeColor: '#C5A059',
    fontFamily: "'Playfair Display', serif",
    layouts: ['cover', 'editorial_spread', 'quad_grid', 'bento_showcase', 'editorial_spread', 'full_bleed', 'back_cover'],
    description: 'High-contrast fashion cover with portrait grids, editorial quotes, and luxury layout spreads.',
  },
  {
    id: 'business-leadership',
    title: 'BUSINESS & LEADERSHIP',
    subtitle: 'MASTERING THE ART OF ADAPTABILITY',
    category: 'Magazines',
    pageCount: 12,
    badge: 'Trending',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    themeColor: '#2563EB',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    layouts: ['cover', 'editorial_spread', 'bento_showcase', 'quad_grid', 'back_cover'],
    description: 'Sleek corporate magazine with financial stats boxes, executive interviews, and minimal typography.',
  },
  {
    id: 'global-navi',
    title: 'GLOBAL NAVI Travel',
    subtitle: 'WAKING UP IN KASHMIR VALLEY • SUMMER EDITION',
    category: 'Magazines',
    pageCount: 16,
    badge: 'Featured',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    themeColor: '#059669',
    fontFamily: "'Playfair Display', serif",
    layouts: ['cover', 'full_bleed', 'quad_grid', 'bento_showcase', 'back_cover'],
    description: 'Full-bleed nature photography, stamp captions, wide panoramic frames, and travel itineraries.',
  },
  {
    id: 'katharine-minimal',
    title: 'Katharine Minimalist Zine',
    subtitle: 'EXPRESSING IDENTITY THROUGH PERSONAL STYLE',
    category: 'Magazines',
    pageCount: 10,
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    themeColor: '#111827',
    fontFamily: "'Playfair Display', serif",
    layouts: ['cover', 'editorial_spread', 'full_bleed', 'back_cover'],
    description: 'Ultra-clean black & white portraiture, generous white space, and editorial column layouts.',
  },

  // CATEGORY: Documents
  {
    id: 'runway-trends',
    title: 'Translating Runway Trends',
    subtitle: 'THE ART OF SILKS AND PRINTS • 2026',
    category: 'Documents',
    pageCount: 8,
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    themeColor: '#DB2777',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    layouts: ['cover', 'quad_grid', 'editorial_spread', 'back_cover'],
    description: 'Multi-photo moodboard grids, fabric textures, and styled fashion notes.',
  },
  {
    id: 'art-of-dressing',
    title: 'The Art of Dressing',
    subtitle: 'STREETWEAR & TAILORED ELEGANCE',
    category: 'Documents',
    pageCount: 12,
    coverImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    themeColor: '#D97706',
    fontFamily: "'Playfair Display', serif",
    layouts: ['cover', 'bento_showcase', 'full_bleed', 'back_cover'],
    description: 'Asymmetrical bento boxes, grid layouts, and minimalist sans-serif headlines.',
  },

  // CATEGORY: Magazine Covers
  {
    id: 'birthday-edition',
    title: 'BIRTHDAY CELEBRATION ISSUE',
    subtitle: 'SPECIAL 21ST EDITION • SWEET MEMORIES',
    category: 'Magazine Covers',
    pageCount: 6,
    badge: 'Party',
    coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    themeColor: '#E11D48',
    fontFamily: "'Playfair Display', serif",
    layouts: ['cover', 'quad_grid', 'back_cover'],
    description: 'Fun confetti accents, birthday party collage frames, and anniversary timeline pages.',
  },
  {
    id: 'bridal-moments',
    title: 'BRIDAL & WEDDING MOMENTS',
    subtitle: 'A STORY OF EVERLASTING LOVE',
    category: 'Magazine Covers',
    pageCount: 12,
    badge: 'Romance',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    themeColor: '#7C3AED',
    fontFamily: "'Playfair Display', serif",
    layouts: ['cover', 'editorial_spread', 'quad_grid', 'full_bleed', 'back_cover'],
    description: 'Soft pastel palette, serif gold typography, multi-photo grids, and ceremony timeline.',
  },

  // CATEGORY: Instagram Posts
  {
    id: 'numera-elevations',
    title: 'Numera Studio Elevations',
    subtitle: 'CREATIVE DIRECTION & BRANDING',
    category: 'Instagram Posts',
    pageCount: 8,
    coverImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80',
    themeColor: '#0D9488',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    layouts: ['cover', 'bento_showcase', 'back_cover'],
    description: 'Square and vertical social carousel layouts with high-impact headline cards.',
  },

  // CATEGORY: More Templates
  {
    id: 'explore-zine',
    title: 'EXPLORE Travel & Escape',
    subtitle: 'COASTAL HAVENS & SUNSET TRAILS',
    category: 'More Templates',
    pageCount: 14,
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
    themeColor: '#0284C7',
    fontFamily: "'Playfair Display', serif",
    layouts: ['cover', 'full_bleed', 'quad_grid', 'editorial_spread', 'back_cover'],
    description: 'Serene landscape photography framing, travel logs, and quote spreads.',
  },
];

interface CanvaTemplateGalleryProps {
  onSelectTemplate: (config: MagazineConfig) => void;
  onCreateNewBlank: () => void;
  currentTemplateId?: string;
}

export function CanvaTemplateGallery({
  onSelectTemplate,
  onCreateNewBlank,
  currentTemplateId,
}: CanvaTemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<MagazineTemplateItem | null>(null);

  const categories = ['All', 'Magazines', 'Documents', 'Magazine Covers', 'Instagram Posts', 'More Templates'];

  const filteredCatalog = CANVA_CATALOG.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApply = (item: MagazineTemplateItem) => {
    const pages = item.layouts.map((layout, idx) => createDefaultPage(idx + 1, layout));
    const config: MagazineConfig = {
      title: item.title,
      subtitle: item.subtitle,
      issueNumber: 'VOL. 01 • CANVA EDITION',
      dateString: '2026 EDITION',
      editorName: 'PRINTALARM STUDIO',
      themeColor: item.themeColor,
      fontFamily: item.fontFamily,
      pages,
    };
    onSelectTemplate(config);
    setPreviewTemplate(null);
  };

  return (
    <div className="bg-luxury-black min-h-screen text-luxury-accent p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-luxury-gold/30 pb-6">
        <div>
          <div className="flex items-center gap-2 text-luxury-gold text-xs font-mono uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Canva Magazine Studio Library</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-luxury-accent">
            Magazine <span className="text-luxury-gold">Templates</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1 max-w-xl">
            Choose a multi-page magazine layout or create a new blank zine from scratch.
          </p>
        </div>

        {/* Action Buttons: Create New Blank */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCreateNewBlank}
            className="px-5 py-3 rounded-xl bg-luxury-gold hover:bg-gold-300 text-luxury-accent font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Blank Magazine
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search magazine templates (e.g. Vogue, Travel, Wedding, Business, Mini-Zine)..."
              className="w-full bg-white border border-luxury-gold/30 rounded-xl pl-10 pr-4 py-3 text-xs text-luxury-accent placeholder-gray-400 focus:outline-none focus:border-luxury-gold shadow-xs transition-colors"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-luxury-accent text-white shadow-md'
                    : 'bg-white hover:bg-luxury-gray text-gray-700 border border-luxury-gold/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-gray-600 font-mono border-b border-luxury-gold/20 pb-2">
          <span>Showing {filteredCatalog.length} magazine templates</span>
          <span className="text-luxury-gold font-bold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Multi-page A4 spreads
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Blank Card */}
          <div
            onClick={onCreateNewBlank}
            className="group p-6 rounded-2xl bg-white/80 border-2 border-dashed border-luxury-gold/40 hover:border-luxury-gold transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[380px] space-y-4 hover:bg-white shadow-xs hover:shadow-md"
          >
            <div className="p-4 rounded-full bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base text-luxury-accent group-hover:text-luxury-gold transition-colors">
                Create New Mini-Magazine
              </h3>
              <p className="text-xs text-gray-600 mt-1 max-w-xs">
                Start with a blank canvas and add customized photo slots, headers, and text blocks.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-luxury-black text-luxury-gold font-bold text-xs group-hover:bg-luxury-gold group-hover:text-luxury-accent transition-colors border border-luxury-gold/30">
              Start Blank Zine →
            </span>
          </div>

          {/* Template Catalog Items */}
          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl bg-white border transition-all flex flex-col justify-between group relative overflow-hidden ${
                currentTemplateId === item.id
                  ? 'border-luxury-gold ring-2 ring-luxury-gold shadow-md'
                  : 'border-luxury-gold/25 hover:border-luxury-gold/60 hover:shadow-xl'
              }`}
            >
              <div className="space-y-3">
                {/* Cover Image Frame */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-luxury-gray border border-luxury-gold/20">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {item.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-luxury-gold text-luxury-accent font-extrabold text-[10px] uppercase shadow-md">
                      {item.badge}
                    </span>
                  )}

                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white font-mono text-[10px]">
                    {item.pageCount} Pages
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-wider block font-bold">
                      {item.category}
                    </span>
                    <h3 className="font-display font-bold text-base text-white leading-tight mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-3 border-t border-luxury-gold/20 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(item)}
                  className="px-3 py-2 rounded-lg bg-luxury-black hover:bg-luxury-gray text-luxury-accent font-bold text-xs border border-luxury-gold/30 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>

                <button
                  type="button"
                  onClick={() => handleApply(item)}
                  className="flex-1 py-2 px-3 rounded-lg bg-luxury-accent hover:bg-gray-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Customize in Editor</span>
                  <ArrowRight className="w-3.5 h-3.5 text-luxury-gold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal for a selected Template */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-luxury-gold/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 text-luxury-accent shadow-2xl">
            <div className="flex items-center justify-between border-b border-luxury-gold/20 pb-4">
              <div>
                <span className="text-xs font-mono text-luxury-gold font-bold">{previewTemplate.category}</span>
                <h3 className="font-display font-bold text-xl text-luxury-accent">{previewTemplate.title}</h3>
                <p className="text-xs text-gray-600">{previewTemplate.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-2 rounded-lg bg-luxury-black text-gray-500 hover:text-luxury-accent border border-luxury-gold/30 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-xl overflow-hidden border border-luxury-gold/30 shadow-sm">
                <img
                  src={previewTemplate.coverImage}
                  alt={previewTemplate.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-luxury-gold">Included Spreads ({previewTemplate.pageCount} Pages):</h4>
                  <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                    <li>Front Cover with Headline Overlay</li>
                    <li>Table of Contents & Editorial Note</li>
                    <li>Photo Story Grid Spreads</li>
                    <li>Bento Feature Gallery</li>
                    <li>Full Bleed Photo Spreads</li>
                    <li>Back Cover & Summary Footer</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-luxury-black border border-luxury-gold/20 text-xs text-gray-600">
                  <p>✨ Fully customizable in our Canva-style PhotoZine Studio!</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApply(previewTemplate)}
                    className="w-full py-2.5 rounded-xl bg-luxury-accent hover:bg-gray-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    Open in Mini-Magazine Editor →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
