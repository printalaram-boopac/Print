import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Shuffle, Type, Lock } from 'lucide-react';
import { logUserEvent } from '@/lib/analytics';

const FEATURES = [
  { icon: Layers, label: 'One-sheet, 8 pages' },
  { icon: Shuffle, label: 'Drag to reorder' },
  { icon: Type, label: 'Cover typography' },
  { icon: Lock, label: 'Private & offline' },
];

export default function PhotoZinePromo() {
  return (
    <section className="py-16 md:py-20 px-4">
      <motion.div
        className="max-w-6xl mx-auto glass-card-gold rounded-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center overflow-hidden relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="space-y-5">
          <h2 className="text-2xl md:text-4xl font-display font-bold leading-tight">
            Turn Your Photos Into a <span className="text-gold-gradient">Fold-and-Cut Zine</span>
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-md">
            Upload 8 photos, arrange them, and download a print-ready A4 sheet that folds into a
            pocket-size 8-page zine — free, private, and made entirely in your browser.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-xs text-gray-400">
                <f.icon className="w-4 h-4 text-luxury-gold flex-shrink-0" strokeWidth={2} />
                {f.label}
              </div>
            ))}
          </div>
          <Link
            to="/photo-zine-maker"
            onClick={() => logUserEvent('CLICK_HOME_PHOTO_ZINE_PROMO')}
            className="btn-primary gold-glow cursor-pointer inline-flex items-center gap-2"
          >
            Try Photo Zine Studio <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="relative flex items-center justify-center">
          <img
            src="/zine-assembly/step-4-finished.png"
            alt="Finished 8-page photo zines, folded from a single printed A4 sheet"
            className="rotate-[-3deg] rounded-xl shadow-2xl border border-gold-200/30 max-w-xs w-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
