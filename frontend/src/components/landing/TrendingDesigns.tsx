import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PencilLine, ArrowRight } from 'lucide-react';
import { DESIGNS } from '@/data/landing';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function TrendingDesigns() {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Trending <span className="text-gold-gradient">Designs</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Handcrafted luxury Shagun covers loved by thousands of happy customers across India
          </p>
        </motion.div>

        {/* 3x2 Grid — Square aspect ratio */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {DESIGNS.map((design, i) => (
            <motion.div
              key={design.id}
              className="design-card rounded-lg group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
            >
              {/* Tag — hidden for now
              <div className="absolute top-3 left-3 z-10">
                <span className="offer-badge rounded-sm text-[10px]">{design.tag}</span>
              </div>
              */}

              {/* Square Image Container */}
              <div className="aspect-square overflow-hidden bg-luxury-dark">
                <img
                  src={design.src}
                  alt={design.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Hover overlay */}
              <div className="design-card-overlay">
                <p className="text-[10px] text-luxury-gold uppercase tracking-widest mb-1">{design.category}</p>
                <h3 className="text-sm md:text-lg font-display font-semibold text-white">{design.title}</h3>
                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/design/${design.id}`}
                    className="chip-glass chip-glass-gold"
                  >
                    <PencilLine className="w-3 h-3" strokeWidth={2} /> Customize
                  </Link>
                  <a
                    href={`https://wa.me/919904544702?text=Hi!%20I%20want%20to%20order%20${encodeURIComponent(design.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip-glass chip-glass-green"
                  >
                    <WhatsAppIcon className="w-3 h-3" /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/templates" className="btn-glass btn-glass-gold">
            Explore All 100+ Designs <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
