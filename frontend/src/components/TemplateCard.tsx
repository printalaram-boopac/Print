import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PencilLine, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { Template, getTemplateSlug } from '@/data/templates';
import { logUserEvent } from '@/lib/analytics';

interface TemplateCardProps {
  template: Template;
  index?: number;
  showWhatsApp?: boolean;
}

export default function TemplateCard({ template, index = 0, showWhatsApp = false }: TemplateCardProps) {
  const imageList = template.images && template.images.length > 0 ? template.images : [template.src];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  const priceText =
    template.coverType === 'acrylic_money_cover'
      ? 'From ₹200'
      : 'From ₹12/pc';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gold-200/40 shadow-sm hover:shadow-xl hover:border-gold-300 transition-all duration-300"
    >
      <Link
        to={`/design/${getTemplateSlug(template)}`}
        onClick={() =>
          logUserEvent('CLICK_TEMPLATE_CARD', {
            templateId: template.id,
            templateTitle: template.title,
            coverType: template.coverType,
          })
        }
        className="flex flex-col h-full cursor-pointer"
      >
        {/* Image Container with Slider */}
        <div className="relative aspect-square w-full overflow-hidden bg-luxury-dark select-none">
          <img
            src={imageList[currentIndex]}
            alt={`${template.title} view ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          {/* Badge for Multi-image */}
          {imageList.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/65 backdrop-blur-md text-luxury-gold text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold-200/30 z-10 shadow-sm">
              {currentIndex + 1}/{imageList.length}
            </div>
          )}

          {/* Slider Controls */}
          {imageList.length > 1 && (
            <>
              {/* Prev Arrow */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/65 text-white flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-black/90 hover:scale-110 z-20 border border-gold-200/30 shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-luxury-gold" />
              </button>

              {/* Next Arrow */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/65 text-white flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-black/90 hover:scale-110 z-20 border border-gold-200/30 shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-luxury-gold" />
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
                {imageList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleDotClick(e, idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-4 bg-luxury-gold' : 'w-1.5 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Container */}
        <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 bg-white">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs text-luxury-gold font-semibold uppercase tracking-wider truncate">
              {template.category}
            </p>
            <h3 className="text-xs sm:text-sm font-display font-semibold text-luxury-accent leading-snug line-clamp-2 min-h-[2.25rem] group-hover:text-luxury-gold transition-colors">
              {template.title}
            </h3>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-luxury-accent">
                {priceText}
              </span>
            </div>

            <div className="flex items-center gap-1.5 w-full">
              {showWhatsApp && (
                <a
                  href={`https://wa.me/919904544702?text=Hi!%20I%20want%20to%20order%20${encodeURIComponent(template.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 sm:p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-colors flex-shrink-0 flex items-center justify-center border border-green-200/60"
                  title="Order on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
              )}
              <span className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-luxury-accent bg-amber-50 group-hover:bg-luxury-gold group-hover:text-white rounded-lg transition-all border border-amber-200/60 shadow-2xs text-center truncate">
                <PencilLine className="w-3 h-3 flex-shrink-0" /> Customize
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
