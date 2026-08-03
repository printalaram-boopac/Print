import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Inbox, Layers, Crown } from 'lucide-react';
import { asset } from '@/lib/asset';
import { logUserEvent } from '@/lib/analytics';

const CATEGORY_CARDS = [
  {
    id: 'money-covers',
    title: 'Shagun Money Covers',
    subtitle: 'Standard 6.5" x 3.5" Envelopes',
    badge: 'Standard Size',
    icon: Inbox,
    image: asset('IMG_8490.PNG'),
    link: '/shagun-money-covers',
    priceText: 'From ₹10/piece',
    gradient: 'linear-gradient(150deg, #4a2338 0%, #2a1420 100%)',
    accent: '#e8b84b',
    accentSoft: 'rgba(232, 184, 75, 0.15)',
  },
  {
    id: 'pocket-money-covers',
    title: 'Pocket Money Covers',
    subtitle: 'Sleek 4" x 3" Pocket Lifafas',
    badge: 'Compact Size',
    icon: Layers,
    image: asset('card-19.jpeg'),
    link: '/pocket-money-covers',
    priceText: 'From ₹10/piece',
    gradient: 'linear-gradient(150deg, #0f3d38 0%, #0a2622 100%)',
    accent: '#5fd9c4',
    accentSoft: 'rgba(95, 217, 196, 0.15)',
  },
  {
    id: 'acrylic-money-covers',
    title: 'Acrylic Money Covers',
    subtitle: 'Luxury Keepsake Acrylic Frames',
    badge: 'Premium Frame',
    icon: Crown,
    image: asset('IMG_8514.PNG'),
    link: '/acrylic-money-covers',
    priceText: 'From ₹160/piece',
    gradient: 'linear-gradient(150deg, #1c2333 0%, #10141f 100%)',
    accent: '#c9d4e8',
    accentSoft: 'rgba(201, 212, 232, 0.15)',
  },
];

export default function CategoryCardsSection() {
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs md:text-sm tracking-[0.2em] text-luxury-gold font-semibold uppercase">
            — Explore Collections —
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Choose Your <span className="text-gold-gradient">Shagun Style</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Handcrafted traditional money covers, compact pocket lifafas, and premium acrylic keepsake frames.
          </p>
        </motion.div>

        {/* 3 Category Cards: Compact by default (2nd image), expands on hover to reveal image (1st image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          {CATEGORY_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-3xl overflow-hidden border shadow-2xl transition-all duration-500 ease-out cursor-pointer h-[170px] hover:h-[410px] hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-12px_var(--card-accent-shadow)]"
                style={{ background: card.gradient, borderColor: `${card.accent}33`, ['--card-accent-shadow' as string]: `${card.accent}40` }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${card.accent}b3`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${card.accent}33`)}
              >
                <Link
                  to={card.link}
                  onClick={() => logUserEvent('CLICK_CATEGORY_CARD', { category: card.id, title: card.title })}
                  className="block w-full h-full flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Top Image Area: Hidden (h-0, opacity-0) by default -> Expands (h-[240px], opacity-100) on Hover */}
                  <div className="relative w-full h-0 opacity-0 group-hover:h-[240px] group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden bg-[#181410]">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Top-Left Pill Badge */}
                    <div
                      className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border text-xs font-semibold shadow-lg"
                      style={{ borderColor: `${card.accent}66`, color: card.accent }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: card.accent }} />
                      <span>{card.badge}</span>
                    </div>
                  </div>

                  {/* Bottom Details Box (2nd Image style by default, remains at bottom when card expands on hover) */}
                  <div
                    className="p-5 md:p-6 border-t transition-colors space-y-1.5 flex-grow flex flex-col justify-center"
                    style={{ background: card.gradient, borderColor: `${card.accent}1a` }}
                  >
                    <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: card.accent }}>
                      {card.priceText}
                    </p>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {card.subtitle}
                    </p>
                    <div
                      className="mt-2 inline-flex w-fit items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all group-hover:gap-2.5"
                      style={{ color: '#181410', background: card.accent }}
                    >
                      <span>Browse Collection</span>
                      <ArrowRight className="w-4 h-4 animate-cta-nudge" />
                    </div>
                  </div>

                  {/* Floating corner click affordance */}
                  <div
                    className="absolute bottom-5 right-5 w-11 h-11 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 z-20"
                    style={{ background: card.accent }}
                  >
                    <ArrowRight className="w-5 h-5" style={{ color: '#181410' }} strokeWidth={2.5} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
