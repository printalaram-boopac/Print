import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Upload } from 'lucide-react';
import { asset } from '@/lib/asset';
import { logUserEvent } from '@/lib/analytics';
import RobotMascot from '@/components/RobotMascot';

const PREVIEW_IMAGES = [
  asset('1.png'),
  asset('2.png'),
  asset('3.png'),
  asset('4.png'),
  asset('5.png'),
  asset('6.png'),
];

export default function MiniMagazinePromo() {
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card-gold rounded-3xl p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center overflow-hidden relative">
          {/* Text side */}
          <motion.div
            className="space-y-5 order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge-underline">
              <RobotMascot className="w-4 h-4" /> New — AI-Powered Mini Magazine
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-luxury-accent">
              Turn Your Photos into a <span className="text-gold-gradient">Mini Magazine</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Upload up to 8 of your favorite photos, generate an AI cover design in one click, add a title and message, and we'll help you print your very own personalized mini photo magazine — a fun, giftable keepsake.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-luxury-gold flex-shrink-0" strokeWidth={2} /> Upload up to 8 photos
              </li>
              <li className="flex items-center gap-2">
                <RobotMascot className="w-4 h-4 text-luxury-gold flex-shrink-0" /> Generate an AI cover design in one click
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-luxury-gold flex-shrink-0" strokeWidth={2} /> Add a custom cover title & message
              </li>
            </ul>
            <Link to="/photo-zine-maker" onClick={() => logUserEvent('CLICK_MINI_MAGAZINE_PROMO')} className="btn-primary gold-glow inline-flex w-fit items-center gap-2">
              Create Your Mini Magazine <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </motion.div>

          {/* Preview collage */}
          <motion.div
            className="order-1 lg:order-2 relative grid grid-cols-3 gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            {PREVIEW_IMAGES.map((src, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-lg overflow-hidden border border-gold-200/40 shadow-md"
                style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (2 + i)}deg)` }}
              >
                <img src={src} alt={`Mini magazine preview page ${i + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
            ))}

            {/* AI robot mascot badge */}
            <motion.div
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6 z-20"
              initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            >
              <div
                className="ai-mascot-float flex flex-col items-center justify-center gap-0.5 w-20 h-20 md:w-24 md:h-24 rounded-full shadow-xl border-2 border-luxury-gold"
                style={{ background: 'linear-gradient(150deg, #1a1410, #3D1E30)' }}
              >
                <RobotMascot className="w-9 h-9 md:w-10 md:h-10 text-luxury-gold" />
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-luxury-gold">AI</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
