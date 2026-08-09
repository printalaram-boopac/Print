import { useState } from 'react';
import { X, ExternalLink, Sparkles, LayoutTemplate, Link as LinkIcon, Check, Copy } from 'lucide-react';
import { MagazineConfig, PageLayoutType } from '../types';
import { createDefaultPage } from '../templates';

interface CanvaTemplateTheme {
  id: string;
  name: string;
  category: string;
  description: string;
  bgGradient: string;
  badge: string;
  title: string;
  subtitle: string;
  layouts: PageLayoutType[];
  previewUrl: string;
}

const CANVA_THEMES: CanvaTemplateTheme[] = [
  {
    id: 'vogue-luxury',
    name: 'Vogue Luxury Editorial',
    category: 'Fashion & High Culture',
    description: 'High-contrast black & gold typography with full-bleed covers and quote spreads.',
    bgGradient: 'from-amber-900/20 via-black to-zinc-900',
    badge: 'Popular',
    title: 'LUXURY ESSENCE',
    subtitle: 'THE AUTUMN FASHION & JEWELRY ISSUE',
    layouts: ['cover', 'editorial_spread', 'full_bleed', 'back_cover'],
    previewUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'wedding-journal',
    name: 'Romance Wedding Zine',
    category: 'Weddings & Celebrations',
    description: 'Soft pastel palette, serif typography, multi-photo grids, and story timelines.',
    bgGradient: 'from-rose-900/20 via-zinc-900 to-black',
    badge: 'Trending',
    title: 'OUR FOREVER STORY',
    subtitle: 'A CELEBRATION OF LOVE • 2026',
    layouts: ['cover', 'quad_grid', 'editorial_spread', 'back_cover'],
    previewUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'bento-portfolio',
    name: 'Modern Photo Portfolio',
    category: 'Photography & Art',
    description: 'Asymmetrical bento boxes, grid layouts, and minimalist sans-serif headlines.',
    bgGradient: 'from-emerald-900/20 via-black to-zinc-900',
    badge: 'Creative',
    title: 'PORTFOLIO VOL. IV',
    subtitle: 'RAW SHOTS & UNFILTERED PERSPECTIVES',
    layouts: ['cover', 'bento_showcase', 'quad_grid', 'back_cover'],
    previewUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'vintage-travel',
    name: 'Wanderlust Travel Journal',
    category: 'Travel & Lifestyle',
    description: 'Retro sepia tones, stamp captions, wide panoramic frames, and travel notes.',
    bgGradient: 'from-yellow-900/20 via-black to-zinc-900',
    badge: 'Classic',
    title: 'WANDERLUST ZINE',
    subtitle: 'JOURNEYS THROUGH MEDITERRANEAN COASTS',
    layouts: ['cover', 'full_bleed', 'bento_showcase', 'back_cover'],
    previewUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
  },
];

interface CanvaTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTheme: (config: MagazineConfig) => void;
}

export function CanvaTemplateModal({ isOpen, onClose, onApplyTheme }: CanvaTemplateModalProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'embed' | 'instructions'>('presets');
  const [canvaEmbedUrl, setCanvaEmbedUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [appliedThemeId, setAppliedThemeId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (theme: CanvaTemplateTheme) => {
    const pages = theme.layouts.map((layout, idx) => createDefaultPage(idx + 1, layout));
    const newConfig: MagazineConfig = {
      title: theme.title,
      subtitle: theme.subtitle,
      issueNumber: 'ISSUE 01 • CANVA SPECIAL',
      dateString: 'FALL/WINTER 2026',
      editorName: 'PRINTALARM STUDIO',
      themeColor: '#C5A059',
      fontFamily: "'Playfair Display', serif",
      pages,
    };

    onApplyTheme(newConfig);
    setAppliedThemeId(theme.id);
    setTimeout(() => {
      setAppliedThemeId(null);
      onClose();
    }, 800);
  };

  const getCleanEmbedUrl = (rawUrl: string) => {
    if (!rawUrl.trim()) return '';
    // If user pasted iframe html or full URL, extract src or format view?embed
    if (rawUrl.includes('<iframe')) {
      const match = rawUrl.match(/src="([^"]+)"/);
      if (match && match[1]) return match[1];
    }
    if (rawUrl.includes('canva.com/design/') && !rawUrl.includes('view?embed')) {
      return rawUrl.split('?')[0] + '/view?embed';
    }
    return rawUrl;
  };

  const cleanEmbed = getCleanEmbedUrl(canvaEmbedUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-luxury-gold/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-luxury-accent">
        {/* Modal Header */}
        <div className="p-5 border-b border-luxury-gold/20 flex items-center justify-between bg-luxury-black">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-luxury-accent">
                Canva Template Integration Studio
              </h3>
              <p className="text-xs text-gray-600 font-sans">
                Choose Canva-styled magazine presets or embed external Canva design frames.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-luxury-accent hover:bg-luxury-gray transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-luxury-gold/20 bg-luxury-black px-5 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'presets'
                ? 'border-luxury-gold text-luxury-gold font-extrabold'
                : 'border-transparent text-gray-600 hover:text-luxury-accent'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Canva Magazine Presets
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('embed')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'embed'
                ? 'border-luxury-gold text-luxury-gold font-extrabold'
                : 'border-transparent text-gray-600 hover:text-luxury-accent'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            Live Canva Design Embed
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'instructions'
                ? 'border-luxury-gold text-luxury-gold font-extrabold'
                : 'border-transparent text-gray-600 hover:text-luxury-accent'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            How to Sync Canva to Site
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-luxury-accent">
                  Ready-to-Use Canva Magazine Themes
                </h4>
                <span className="text-xs text-luxury-gold bg-luxury-gold/10 px-2.5 py-1 rounded-full border border-luxury-gold/30 font-bold">
                  1-Click Instant Load
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CANVA_THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    className="p-4 rounded-xl bg-luxury-black/60 border border-luxury-gold/20 hover:border-luxury-gold transition-all flex flex-col justify-between group relative overflow-hidden shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="relative h-36 rounded-lg overflow-hidden border border-luxury-gold/20">
                        <img
                          src={theme.previewUrl}
                          alt={theme.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-luxury-gold text-luxury-accent font-bold text-[10px] uppercase shadow-sm">
                          {theme.badge}
                        </span>
                        <span className="absolute bottom-2 left-2 text-xs font-bold text-white font-display">
                          {theme.category}
                        </span>
                      </div>

                      <div>
                        <h5 className="font-bold text-base text-luxury-accent">{theme.name}</h5>
                        <p className="text-xs text-gray-600 leading-relaxed mt-1">
                          {theme.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-luxury-gold/20 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-gray-500">
                        {theme.layouts.length} A4 Pages Included
                      </span>

                      <button
                        type="button"
                        onClick={() => handleApplyPreset(theme)}
                        disabled={appliedThemeId === theme.id}
                        className="px-3.5 py-1.5 rounded-lg bg-luxury-gold hover:bg-gold-300 text-luxury-accent font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        {appliedThemeId === theme.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Applied!
                          </>
                        ) : (
                          'Load Theme'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE CANVA EMBED */}
          {activeTab === 'embed' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-luxury-black border border-luxury-gold/20 space-y-3">
                <label className="block text-xs font-bold text-luxury-accent uppercase tracking-wider">
                  Paste Canva Embed URL or Smart Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={canvaEmbedUrl}
                    onChange={(e) => setCanvaEmbedUrl(e.target.value)}
                    placeholder="e.g. https://www.canva.com/design/DAG.../view?embed or <iframe ...>"
                    className="flex-1 bg-white border border-luxury-gold/30 rounded-lg px-3 py-2 text-xs text-luxury-accent placeholder-gray-400 focus:outline-none focus:border-luxury-gold"
                  />
                  {canvaEmbedUrl && (
                    <button
                      type="button"
                      onClick={() => setCanvaEmbedUrl('')}
                      className="px-3 py-2 rounded-lg bg-luxury-gray text-xs text-gray-700 hover:bg-gray-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Tip: In Canva, click <strong>Share</strong> &gt; <strong>More</strong> &gt;{' '}
                  <strong>Embed</strong> to copy your live interactive embed link.
                </p>
              </div>

              {/* Live Preview Frame */}
              {cleanEmbed ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-luxury-gold">
                    <span>Live Interactive Canva Frame</span>
                    <a
                      href={canvaEmbedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline text-luxury-accent"
                    >
                      Open in Canva <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative w-full h-[380px] rounded-xl overflow-hidden border border-luxury-gold/40 bg-black">
                    <iframe
                      src={cleanEmbed}
                      title="Embedded Canva Design"
                      className="w-full h-full border-0"
                      allow="fullscreen"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-xl border-2 border-dashed border-luxury-gold/30 text-center space-y-3 bg-luxury-black/30">
                  <LayoutTemplate className="w-10 h-10 text-luxury-gold mx-auto" />
                  <h5 className="font-bold text-sm text-luxury-accent">No Canva Frame Loaded</h5>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Paste a valid Canva embed link above to preview your Canva design side-by-side with our A4 PhotoZine Studio.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INSTRUCTIONS */}
          {activeTab === 'instructions' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-luxury-black border border-luxury-gold/20 space-y-4">
                <h4 className="font-bold text-sm text-luxury-gold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> How to set up Canva templates on your site:
                </h4>

                <ol className="space-y-3 text-xs text-gray-600 list-decimal list-inside leading-relaxed">
                  <li>
                    <strong>Export Canva Pages as High-Res PNG / PDF:</strong> In Canva, design your A4 magazine pages and click <strong>Share &gt; Download &gt; PNG / PDF Print</strong>.
                  </li>
                  <li>
                    <strong>Upload to PhotoZine Studio:</strong> Drag and drop your exported Canva images directly into our A4 photo slots or full-bleed page templates.
                  </li>
                  <li>
                    <strong>Overlay Live Text & Print-Ready PDF:</strong> Add customizable gold text titles, issue captions, and generate print-ready vector PDFs directly in our studio.
                  </li>
                  <li>
                    <strong>Embed Canva Interactive View:</strong> Use the <em>Live Canva Design Embed</em> tab to show real-time flipbook previews to your users.
                  </li>
                </ol>
              </div>

              {/* Sample Canva HTML Embed Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-luxury-accent">
                  <span>Sample Site Embed Code Snippet</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `<iframe src="https://www.canva.com/design/YOUR_DESIGN_ID/view?embed" width="100%" height="600" allow="fullscreen"></iframe>`
                      );
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="flex items-center gap-1 text-luxury-gold hover:underline cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <pre className="p-3 rounded-lg bg-luxury-accent text-luxury-gold text-[11px] font-mono overflow-x-auto border border-luxury-gold/30">
                  {`<iframe
  src="https://www.canva.com/design/YOUR_DESIGN_ID/view?embed"
  width="100%"
  height="600"
  allow="fullscreen"
></iframe>`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-luxury-gold/20 bg-luxury-black flex items-center justify-between text-xs text-gray-600">
          <span>PrintAlarm PhotoZine & Canva Integration Suite</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-luxury-accent hover:bg-gray-800 text-white font-bold transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
