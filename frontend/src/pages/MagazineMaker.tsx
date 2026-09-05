import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import {
  Download, X, RefreshCw, Upload, Printer,
  ChevronRight, Layers, Type, Lock, HelpCircle, Sparkles, Wand2,
} from 'lucide-react';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import { logUserEvent } from '@/lib/analytics';
import type { MagazineProject, PhotoElement, TextElement } from '@/lib/magazine/types';
import { newMagazineProject, refreshSuggestedText, newPhotoElement, newTextElement, PAGE_TYPE_LABELS } from '@/lib/magazine/pageTemplates';
import { drawPageToCanvas } from '@/lib/magazine/renderPage';
import { handleDownloadMagazine } from '@/lib/magazine/exportPdf';
import PageCanvasEditor from '@/components/magazine/PageCanvasEditor';

const HOW_IT_WORKS_STEPS = [
  { icon: Wand2, title: '1. Tell Us About Them', body: 'Enter a name, relationship, and occasion — every page of text is written around it.' },
  { icon: Upload, title: '2. Upload Your Photos', body: 'Add photos to each of the 8 pages. Every page follows a designed layout, so you never start from a blank canvas.' },
  { icon: Printer, title: '3. Download & Print', body: 'Export a high-resolution, print-ready A4 PDF — 8 pages, ready to print at home or at any print shop.' },
];

const FEATURES = [
  { icon: Layers, title: 'A Real Narrative Arc', body: 'Cover, connection, celebration, a reflective letter, a milestone page, and a closing — not just 8 random photo slots.' },
  { icon: Type, title: 'Editorial Layouts', body: 'Every page follows rule-of-thirds photo placement and a proper type hierarchy, the same principles real magazines use.' },
  { icon: Wand2, title: 'Relationship-Aware Text', body: 'Titles and quotes are written around who this is for — "Mameri", "Dad", a best friend’s name — not generic filler.' },
  { icon: Lock, title: 'Private & Offline', body: 'Every photo is processed in your browser. Nothing is uploaded — the PDF is generated entirely on your device.' },
];

const MAGAZINE_FAQS = [
  { q: 'Is the Magazine Maker free to use?', a: 'Yes — it is completely free, with no watermark, no account, and no limit on how many magazines you create.' },
  { q: 'Do my photos leave my device?', a: 'No. Every photo is drawn and composed locally in your browser, and the exported PDF is generated on your device — nothing is uploaded to Printalarm or anywhere else.' },
  { q: 'What paper size does the magazine use?', a: 'The export is an 8-page A4 portrait (210 × 297 mm) PDF, one page per sheet.' },
  { q: 'Can I reorder the pages?', a: 'The 8 pages follow a designed narrative arc — cover, connection, celebration, letter, milestone, and closing — so page order is fixed to keep that story intact.' },
  { q: 'Can I edit the text on each page?', a: 'Yes — every title, quote, and caption is pre-filled based on the relationship you enter, and every word is fully editable.' },
  { q: 'How is this different from Photo Zine Studio?', a: 'Photo Zine Studio is a single-sheet, fold-and-cut mini booklet. Magazine Maker is a full 8-page, magazine-style keepsake designed as separate print pages, not a folded sheet.' },
];

const THEME_SWATCHES = ['#FFFFFF', '#141210', '#F5D8E4', '#C7D9EE', '#D4AF37'];
const OCCASION_PRESETS = ['Wedding Anniversary', 'Engagement', 'Wedding', 'Friendship', 'Family', 'Just Because'];

export default function MagazineMaker() {
  const [recipientName, setRecipientName] = useState('');
  const [relationshipTerm, setRelationshipTerm] = useState('');
  const [occasion, setOccasion] = useState('');
  const [themeColor, setThemeColor] = useState('#FFFFFF');

  const [project, setProject] = useState<MagazineProject | null>(null);
  const [activePageIndex, setActivePageIndex] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const lenis = useLenis();

  useEffect(() => {
    if (activePageIndex === null) {
      lenis?.start();
    } else {
      lenis?.stop();
    }
    return () => lenis?.start();
  }, [activePageIndex, lenis]);

  useEffect(() => {
    if (!project) return;
    project.pages.forEach((page) => {
      const canvas = canvasRefs.current[page.index];
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      drawPageToCanvas(ctx, canvas.width, canvas.height, page);
    });
  }, [project]);

  const handleCreate = () => {
    const next = newMagazineProject(recipientName.trim(), relationshipTerm.trim(), occasion.trim(), themeColor);
    setProject(next);
    logUserEvent('MAGAZINE_CREATED', { hasRecipientName: !!recipientName.trim(), hasRelationship: !!relationshipTerm.trim() });
  };

  const handleRegenerate = () => {
    if (project && !window.confirm('This will replace your details and start a new magazine with fresh photos. Continue?')) return;
    handleCreate();
  };

  const handleRefreshText = () => {
    if (!project) return;
    setProject((prev) => (prev ? refreshSuggestedText({ ...prev, recipientName: recipientName.trim(), relationshipTerm: relationshipTerm.trim(), occasion: occasion.trim() }) : prev));
    logUserEvent('MAGAZINE_REFRESH_TEXT');
  };

  const handleThemeColor = (color: string) => {
    setThemeColor(color);
    setProject((prev) => (prev ? { ...prev, themeColor: color, pages: prev.pages.map((p) => ({ ...p, bgColor: color })) } : prev));
  };

  const updatePhoto = (pageIndex: number, photoId: string, patch: Partial<PhotoElement>) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: prev.pages.map((p) => (p.index !== pageIndex ? p : { ...p, photos: p.photos.map((ph) => (ph.id === photoId ? { ...ph, ...patch } : ph)) })),
      };
    });
  };

  const updateText = (pageIndex: number, textId: string, patch: Partial<TextElement>) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pages: prev.pages.map((p) => (p.index !== pageIndex ? p : { ...p, texts: p.texts.map((t) => (t.id === textId ? { ...t, ...patch } : t)) })),
      };
    });
  };

  const handlePhotoFile = (pageIndex: number, photoId: string, file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      updatePhoto(pageIndex, photoId, { imgSrc: url, img });
      logUserEvent('MAGAZINE_PAGE_IMAGE_UPLOADED', { pageIndex });
    };
    img.src = url;
  };

  const addPhoto = (pageIndex: number) => {
    setProject((prev) => (prev ? { ...prev, pages: prev.pages.map((p) => (p.index === pageIndex ? { ...p, photos: [...p.photos, newPhotoElement()] } : p)) } : prev));
  };

  const addText = (pageIndex: number) => {
    setProject((prev) => {
      if (!prev) return prev;
      const textColor = prev.themeColor.toUpperCase() === '#FFFFFF' ? '#2A2320' : '#FFFFFF';
      return { ...prev, pages: prev.pages.map((p) => (p.index === pageIndex ? { ...p, texts: [...p.texts, newTextElement(textColor)] } : p)) };
    });
  };

  const removePhoto = (pageIndex: number, photoId: string) => {
    setProject((prev) => (prev ? { ...prev, pages: prev.pages.map((p) => (p.index !== pageIndex ? p : { ...p, photos: p.photos.filter((ph) => ph.id !== photoId) })) } : prev));
  };

  const removeText = (pageIndex: number, textId: string) => {
    setProject((prev) => (prev ? { ...prev, pages: prev.pages.map((p) => (p.index !== pageIndex ? p : { ...p, texts: p.texts.filter((t) => t.id !== textId) })) } : prev));
  };

  const handleDownload = async () => {
    if (!project) return;
    setExporting(true);
    logUserEvent('CLICK_DOWNLOAD_MAGAZINE_PDF');
    try {
      await handleDownloadMagazine(project);
    } finally {
      setExporting(false);
    }
  };

  const activePage = activePageIndex !== null && project ? project.pages.find((p) => p.index === activePageIndex) || null : null;
  const totalPages = project?.pages.length ?? 0;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-luxury-black text-luxury-accent">
      <Seo
        title={`Magazine Maker — Free 8-Page Personalized Magazine | ${BRAND_NAME}`}
        description="Turn your photos into a personalized 8-page magazine-style PDF, complete with a real narrative arc, editorial layouts, and relationship-aware text. Free, private, and entirely in your browser."
        path="/magazine-maker"
      />

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-display font-bold">
            Magazine <span className="text-gold-gradient">Maker</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Turn your favourite photos into a personalized 8-page magazine — a real cover, a
            reflective letter, a milestone spread, and a closing page. Free, private, in your browser.
          </p>
        </div>

        {/* About this magazine */}
        <div className="glass-card-gold rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-display font-semibold">About this magazine</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="space-y-1 block">
              <span className="text-xs text-gray-400">Recipient Name</span>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Priya"
                className="w-full bg-luxury-dark border border-gold-200/40 rounded-lg px-3 py-2 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold"
              />
            </label>
            <label className="space-y-1 block">
              <span className="text-xs text-gray-400">Relationship</span>
              <input
                type="text"
                value={relationshipTerm}
                onChange={(e) => setRelationshipTerm(e.target.value)}
                placeholder="e.g. Mameri, Dad, my best friend"
                className="w-full bg-luxury-dark border border-gold-200/40 rounded-lg px-3 py-2 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold"
              />
            </label>
            <label className="space-y-1 block">
              <span className="text-xs text-gray-400">Occasion</span>
              <input
                type="text"
                list="occasion-presets"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g. Wedding Anniversary"
                className="w-full bg-luxury-dark border border-gold-200/40 rounded-lg px-3 py-2 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold"
              />
              <datalist id="occasion-presets">
                {OCCASION_PRESETS.map((o) => (
                  <option key={o} value={o} />
                ))}
              </datalist>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Theme Color</span>
              {THEME_SWATCHES.map((c) => (
                <button
                  key={c}
                  onClick={() => handleThemeColor(c)}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                    themeColor === c ? 'border-luxury-gold scale-110' : 'border-gold-200/30'
                  }`}
                  style={{ background: c }}
                  aria-label={`Theme ${c}`}
                />
              ))}
            </div>

            {!project ? (
              <button onClick={handleCreate} className="btn-primary gold-glow cursor-pointer flex items-center gap-2">
                <Wand2 className="w-4 h-4" strokeWidth={2} /> Create My Magazine
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRefreshText}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gold-200/40 text-sm font-semibold text-luxury-accent hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" strokeWidth={2} /> Refresh Suggested Text
                </button>
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gold-200/40 text-sm font-semibold text-luxury-accent hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" strokeWidth={2} /> Start New Magazine
                </button>
              </div>
            )}
          </div>
        </div>

        {project && (
          <>
            {/* Grid */}
            <div className="space-y-3">
              <h2 className="text-lg font-display font-semibold">Your 8 Pages</h2>
              <p className="text-xs text-gray-500">
                Click a page to upload photos and edit its text. Page order follows a designed
                story arc, so it can't be reordered.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {project.pages.map((page) => (
                  <div
                    key={page.index}
                    onClick={() => setActivePageIndex(page.index)}
                    className={`relative overflow-hidden border-2 cursor-pointer transition-all ${
                      activePageIndex === page.index ? 'border-luxury-gold shadow-lg shadow-amber-500/20' : 'border-gold-200/30 hover:border-gold-200/60'
                    }`}
                    style={{ aspectRatio: '0.707' }}
                  >
                    <span className="absolute top-2 left-2 z-10 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full">
                      {page.index + 1}. {PAGE_TYPE_LABELS[page.pageType]}
                    </span>
                    <canvas
                      ref={(el) => { canvasRefs.current[page.index] = el; }}
                      width={440}
                      height={622}
                      className="w-full h-full block"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                disabled={exporting}
                className="btn-primary gold-glow cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                {exporting ? 'Preparing…' : 'Download Magazine (PDF)'}
              </button>
            </div>
          </>
        )}

        <div className="gold-divider" />

        {/* How it works */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              A Real <span className="text-gold-gradient">Story</span>, Not Just Photos
            </h2>
            <p className="text-sm text-gray-400">
              Eight pages, one narrative arc — invitation, connection, celebration, reflection,
              milestone, and closing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.title} className="glass-card-gold rounded-xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-luxury-gold" strokeWidth={2} />
                </div>
                <h3 className="text-sm font-display font-semibold text-luxury-accent">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="gold-divider" />

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 glass-card-gold rounded-xl p-5">
              <div className="w-10 h-10 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-luxury-gold" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-display font-semibold text-luxury-accent">{f.title}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="gold-divider" />

        {/* FAQ */}
        <div className="max-w-2xl mx-auto w-full space-y-6">
          <div className="text-center space-y-2">
            <span className="section-badge-underline"><HelpCircle className="w-3.5 h-3.5" strokeWidth={2} /> Common Questions</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Frequently Asked <span className="text-gold-gradient">Questions</span>
            </h2>
          </div>
          <div className="glass-panel rounded-xl p-6 md:p-8">
            {MAGAZINE_FAQS.map((faq) => (
              <MagazineFaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        <div className="gold-divider" />

        {/* Cross-sell */}
        <div className="glass-card-gold rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="text-xs text-luxury-gold uppercase tracking-widest font-semibold mb-1 flex items-center gap-1.5 justify-center md:justify-start">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2} /> Pair it with your order
            </p>
            <h3 className="text-lg font-display font-bold text-luxury-accent">
              Printed your magazine? Personalize a Shagun cover to match.
            </h3>
          </div>
          <Link
            to="/templates"
            className="btn-primary gold-glow cursor-pointer flex items-center gap-2 flex-shrink-0"
          >
            Browse Designs <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Edit — full page */}
      {activePage && activePageIndex !== null && (
        <div className="fixed inset-0 z-[200] bg-luxury-black flex flex-col">
          <div className="flex items-center justify-between px-6 py-3 border-b border-gold-200/20 flex-shrink-0">
            <h3 className="text-xl font-display font-bold text-luxury-accent">
              Page {activePageIndex + 1} — {PAGE_TYPE_LABELS[activePage.pageType]}
            </h3>
            <button onClick={() => setActivePageIndex(null)} className="text-gray-400 hover:text-luxury-gold cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </div>

          <PageCanvasEditor
            page={activePage}
            pageNumber={activePageIndex + 1}
            totalPages={totalPages}
            onPrevPage={() => setActivePageIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
            onNextPage={() => setActivePageIndex((i) => (i !== null && i < totalPages - 1 ? i + 1 : i))}
            onUpdatePhoto={(photoId, patch) => updatePhoto(activePage.index, photoId, patch)}
            onUpdateText={(textId, patch) => updateText(activePage.index, textId, patch)}
            onAddPhoto={() => addPhoto(activePage.index)}
            onAddText={() => addText(activePage.index)}
            onRemovePhoto={(photoId) => removePhoto(activePage.index, photoId)}
            onRemoveText={(textId) => removeText(activePage.index, textId)}
            onReplacePhotoFile={(photoId, file) => handlePhotoFile(activePage.index, photoId, file)}
          />
        </div>
      )}
    </div>
  );
}

function MagazineFaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between text-left gap-4 group cursor-pointer"
      >
        <span className="text-sm md:text-base font-medium text-luxury-accent group-hover:text-luxury-gold transition-colors">
          {q}
        </span>
        <span
          className="text-luxury-gold flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </span>
      </button>
      <div className={`faq-answer ${open ? 'open' : ''}`}>
        <p className="text-sm text-gray-400 pb-5 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}
