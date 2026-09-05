import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Wand2, Type, Lock } from 'lucide-react';
import { logUserEvent } from '@/lib/analytics';

const FEATURES = [
  { icon: BookOpen, label: 'A real narrative arc' },
  { icon: Type, label: 'Editorial layouts' },
  { icon: Wand2, label: 'Relationship-aware text' },
  { icon: Lock, label: 'Private & offline' },
];

export default function MagazineMakerPromo() {
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
            Turn Your Photos Into a <span className="text-gold-gradient">Personalized Magazine</span>
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-md">
            Cover, connection, celebration, a reflective letter, a milestone, and a closing —
            an 8-page magazine-style keepsake with a real story, not just photo slots. Free,
            private, and made entirely in your browser.
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
            to="/magazine-maker"
            onClick={() => logUserEvent('CLICK_HOME_MAGAZINE_MAKER_PROMO')}
            className="btn-primary gold-glow cursor-pointer inline-flex items-center gap-2"
          >
            Try Magazine Maker <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="relative flex items-center justify-center h-64 md:h-80">
          <div
            className="absolute rounded-lg border border-gold-200/30 shadow-xl"
            style={{ aspectRatio: '210 / 297', width: '55%', background: '#C7D9EE', transform: 'rotate(6deg) translateX(20px)' }}
          />
          <div
            className="absolute rounded-lg border border-gold-200/40 shadow-2xl flex flex-col items-center justify-center gap-2 p-4"
            style={{ aspectRatio: '210 / 297', width: '55%', background: '#141210', transform: 'rotate(-4deg) translateX(-16px)' }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-semibold">Issue 01</span>
            <span className="font-display text-xl md:text-2xl font-bold text-white text-center leading-tight">For My Love</span>
            <span className="text-[9px] text-gray-400 text-center">A story, told in eight pages</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
