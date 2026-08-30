import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Heart, Layers, PencilLine } from 'lucide-react';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import MagazineViewer from '@/features/magazine/components/preview/MagazineViewer';
import { useMagazineFonts } from '@/features/magazine/fonts';
import { useFavouriteTemplates } from '@/features/magazine/hooks/useFavouriteTemplates';
import { findTemplateMeta, loadTemplate } from '@/features/magazine/templates';
import type { MagazineTemplate } from '@/features/magazine/types';

/** Full preview of one template, with a call to action into the editor. */
export default function MagazineTemplatePreview() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  useMagazineFonts();

  const meta = findTemplateMeta(slug);
  const [template, setTemplate] = useState<MagazineTemplate | null>(null);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const { isFavourite, toggle } = useFavouriteTemplates();

  useEffect(() => {
    let cancelled = false;
    setTemplate(null);
    setIndex(0);
    setFailed(false);

    loadTemplate(slug)
      .then((result) => {
        if (cancelled) return;
        if (result) setTemplate(result);
        else setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!meta) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-28 text-center">
        <AlertTriangle className="h-10 w-10 text-luxury-gold" />
        <h1 className="font-display text-2xl font-bold text-luxury-accent">Template not found</h1>
        <p className="max-w-sm text-sm text-gray-400">
          This template may have been renamed. Browse the library to find a similar design.
        </p>
        <Link to="/magazine" className="btn-primary btn-magnetic">
          Back to templates
        </Link>
      </div>
    );
  }

  const favourite = isFavourite(meta.slug);

  return (
    <div className="min-h-screen px-4 pb-20 pt-24 md:pt-28">
      <Seo
        title={`${meta.name} Magazine Template — ${BRAND_NAME}`}
        description={`${meta.description} ${meta.pageCount} editable pages. Customise the text, photos and colours online, then export a print-ready PDF.`}
        path={`/magazine/t/${meta.slug}`}
      />

      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          to="/magazine"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 transition-colors hover:text-luxury-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All templates
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="space-y-3">
            <p className="section-badge-plain">{meta.category}</p>
            <h1 className="font-display text-3xl font-bold text-luxury-accent md:text-4xl">{meta.name}</h1>
            <p className="max-w-xl text-sm text-gray-400">{meta.description}</p>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              <Layers className="h-3.5 w-3.5 text-luxury-gold" /> {meta.pageCount} editable pages
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggle(meta.slug)}
              aria-pressed={favourite}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-200/60 bg-white text-luxury-accent shadow-sm transition-all hover:border-luxury-gold"
              title={favourite ? 'Remove from favourites' : 'Save to favourites'}
            >
              <Heart className={`h-4 w-4 ${favourite ? 'fill-luxury-gold text-luxury-gold' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => navigate(`/magazine/editor/new?template=${meta.slug}`)}
              className="btn-primary btn-magnetic"
            >
              <PencilLine className="h-4 w-4" /> Use this template
            </button>
          </div>
        </motion.div>

        {failed && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold-200/60 bg-white p-10 text-center shadow-sm">
            <AlertTriangle className="h-8 w-8 text-luxury-gold" />
            <h2 className="font-display text-lg font-semibold text-luxury-accent">This preview could not load</h2>
            <p className="max-w-sm text-sm text-gray-400">
              The design data for this template is unavailable right now. You can still open it in the editor.
            </p>
          </div>
        )}

        {!template && !failed && (
          <div
            className="mx-auto w-full max-w-md animate-pulse rounded-lg border border-gold-200/40 bg-white"
            style={{ aspectRatio: '794 / 1123' }}
          />
        )}

        {template && (
          <MagazineViewer
            pages={template.pages}
            docWidth={template.width}
            docHeight={template.height}
            index={index}
            onIndexChange={setIndex}
          />
        )}

        <div className="gold-divider" />

        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-xl font-semibold text-luxury-accent">
            Make it yours in a few minutes
          </h2>
          <p className="max-w-lg text-sm text-gray-400">
            Opening the editor creates your own editable copy — replace the photos, rewrite the headlines,
            change colours and add or remove pages. Nothing here is baked into an image.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/magazine/editor/new?template=${meta.slug}`)}
            className="btn-outline btn-magnetic"
          >
            <PencilLine className="h-4 w-4" /> Open in editor
          </button>
        </div>
      </div>
    </div>
  );
}
