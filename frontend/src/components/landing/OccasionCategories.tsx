import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PartyPopper } from 'lucide-react';
import { OCCASIONS } from '@/data/landing';

export default function OccasionCategories() {
  return (
    <section className="py-16 md:py-20 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-badge-underline"><PartyPopper className="w-3.5 h-3.5" strokeWidth={2} /> Every Occasion</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Covers for Every <span className="text-gold-gradient">Celebration</span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {OCCASIONS.map((occ: string, i: number) => (
            <motion.div
              key={occ}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/templates?occasion=${occ.toLowerCase().replace(/\s/g, '-')}`}
                className="inline-block px-5 py-2.5 border border-gold-300 text-sm text-luxury-accent font-semibold hover:text-luxury-gold hover:border-luxury-gold hover:bg-gold-50/50 transition-all duration-300 rounded-full cursor-pointer"
              >
                {occ}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
