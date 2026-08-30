import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, Layers, PencilLine } from 'lucide-react';
import type { MagazineTemplate, MagazineTemplateMeta } from '../../types';
import { useInView } from '../../hooks/useInView';
import { AutoFitPage } from '../shared/AutoFitPage';

interface TemplateCardProps {
  meta: MagazineTemplateMeta;
  /** Page data; absent until the collection has loaded. */
  template?: MagazineTemplate;
  index: number;
  isFavourite: boolean;
  onToggleFavourite: (slug: string) => void;
}

const BADGE_LABEL: Record<string, string> = { new: 'New', popular: 'Popular' };

function TemplateCardBase({ meta, template, index, isFavourite, onToggleFavourite }: TemplateCardProps) {
  const navigate = useNavigate();
  const { ref, inView } = useInView<HTMLDivElement>();
  const cover = template?.pages[0];
  const showCover = Boolean(cover) && inView;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.35 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gold-200/40 bg-white shadow-sm transition-all duration-300 hover:border-gold-300 hover:shadow-xl"
    >
      {/* Cover preview */}
      <Link
        to={`/magazine/t/${meta.slug}`}
        className="relative block overflow-hidden bg-luxury-gray"
        style={{ aspectRatio: '794 / 1123' }}
        aria-label={`Preview ${meta.name}`}
      >
        <div ref={ref} className="absolute inset-0">
          {showCover && cover && template ? (
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
              <AutoFitPage page={cover} docWidth={template.width} docHeight={template.height} />
            </div>
          ) : (
            <div
              className="absolute inset-0 animate-pulse"
              style={{ background: `linear-gradient(150deg, ${meta.accent}22, ${meta.accent}0a)` }}
            />
          )}
        </div>

        {/* Hover actions — always visible on touch devices */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-luxury-accent/85 via-luxury-accent/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100">
          <div className="pointer-events-auto flex w-full gap-2">
            <span className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-luxury-accent shadow-sm">
              <Eye className="h-3.5 w-3.5" /> Preview
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/magazine/editor/new?template=${meta.slug}`);
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-luxury-gold px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-luxury-accent"
            >
              <PencilLine className="h-3.5 w-3.5" /> Use
            </button>
          </div>
        </div>

        {meta.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-luxury-accent px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-sm">
            {BADGE_LABEL[meta.badge]}
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => onToggleFavourite(meta.slug)}
        aria-pressed={isFavourite}
        aria-label={isFavourite ? `Remove ${meta.name} from favourites` : `Add ${meta.name} to favourites`}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${isFavourite ? 'fill-luxury-gold text-luxury-gold' : 'text-luxury-accent/50'}`}
        />
      </button>

      {/* Meta */}
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-luxury-gold sm:text-[11px]">
          {meta.category}
        </p>
        <h3 className="font-display text-sm font-semibold leading-snug text-luxury-accent transition-colors group-hover:text-luxury-gold sm:text-base">
          {meta.name}
        </h3>
        <p className="mt-auto flex items-center gap-1.5 pt-2 text-[11px] font-medium text-gray-400">
          <Layers className="h-3 w-3" /> {meta.pageCount} pages
        </p>
      </div>
    </motion.div>
  );
}

export const TemplateCard = memo(TemplateCardBase);
