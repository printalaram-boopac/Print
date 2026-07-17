import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DESIGNS } from '@/data/landing';

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
          <span className="section-badge">🔥 Updated Every Week</span>
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
              {/* Tag */}
              <div className="absolute top-3 left-3 z-10">
                <span className="offer-badge rounded-sm text-[10px]">{design.tag}</span>
              </div>

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
                    to={`/designer?template=${design.id}`}
                    className="px-4 py-2 bg-luxury-gold text-luxury-accent text-[10px] font-bold tracking-wider hover:bg-gold-400 transition-colors"
                  >
                    CUSTOMIZE
                  </Link>
                  <a
                    href={`https://wa.me/919904544702?text=Hi!%20I%20want%20to%20order%20${encodeURIComponent(design.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white text-[10px] font-bold tracking-wider hover:bg-green-500 transition-colors"
                  >
                    WHATSAPP
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
          <Link to="/templates" className="btn-magnetic btn-outline">
            Explore All 100+ Designs →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
