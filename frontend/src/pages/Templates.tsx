import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PencilLine } from 'lucide-react';
import CustomDesignModal from '@/components/CustomDesignModal';
import { TEMPLATES } from '@/data/templates';

export default function Templates() {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const filtered = TEMPLATES;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs md:text-sm tracking-[0.2em] text-luxury-gold font-semibold uppercase">
            — Our Collection —
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold">
            All <span className="text-gold-gradient">Shagun Lifafa</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Every design hand-crafted and personalizable.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="design-card rounded-lg"
            >
              <Link to={`/design/${t.id}`} className="block cursor-pointer">
                <div className="aspect-square overflow-hidden bg-luxury-dark">
                  <img src={t.src} alt={t.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="design-card-overlay">
                  <p className="text-[10px] text-luxury-gold uppercase tracking-widest mb-1">{t.category}</p>
                  <h3 className="text-sm font-display font-semibold text-white">{t.title}</h3>
                  <p className="text-xs text-gray-200 mt-1">From ₹12/piece</p>
                  <span className="chip-glass chip-glass-gold mt-3">
                    <PencilLine className="w-3 h-3" strokeWidth={2} /> Customize Now
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Custom Design Request Section — Hidden for now */}
        {/* <motion.div
          className="glass-card-gold p-6 md:p-8 rounded-xl text-center space-y-4 max-w-2xl mx-auto mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-lg md:text-xl font-display font-semibold text-luxury-accent">Looking for something completely unique?</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Work with our master wedding cover artists to design custom bespoke Shagun Lifafas matching your invite templates, color themes, or specific imagery.
          </p>
          <button
            onClick={() => setIsCustomOpen(true)}
            className="px-6 py-3 bg-luxury-accent text-white font-bold tracking-wider text-xs uppercase gold-glow hover:bg-luxury-accent/90 transition-colors cursor-pointer rounded-full"
          >
            ✨ I want to customize a Shagun Lifafa
          </button>
        </motion.div> */}
      </div>

      <CustomDesignModal isOpen={isCustomOpen} onClose={() => setIsCustomOpen(false)} />
    </div>
  );
}
