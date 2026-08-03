import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Layers, Inbox, Crown } from 'lucide-react';
import CustomDesignModal from '@/components/CustomDesignModal';
import TemplateCard from '@/components/TemplateCard';
import Seo from '@/components/Seo';
import { TEMPLATES } from '@/data/templates';
import { BRAND_NAME } from '@/lib/brand';

export default function Templates() {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [location]);

  const moneyCovers = TEMPLATES.filter((t) => t.coverType === 'money_cover');
  const pocketMoneyCovers = TEMPLATES.filter((t) => t.coverType === 'pocket_money_cover');
  const acrylicMoneyCovers = TEMPLATES.filter((t) => t.coverType === 'acrylic_money_cover');

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <Seo
        title={`All Shagun Cover Designs | 100+ Personalized Wedding Money Envelopes — ${BRAND_NAME}`}
        description="Browse 100+ personalized Shagun cover designs — money covers, pocket covers & acrylic money frames. Custom names, photos & gold-foil printing, delivered pan-India."
        path="/templates"
      />
      <div className="max-w-6xl mx-auto space-y-16">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs md:text-sm tracking-[0.2em] text-luxury-gold font-semibold uppercase">
            — Our Collection —
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold">
            All <span className="text-gold-gradient">Shagun Designs</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Every design hand-crafted, premium-grade, and fully personalizable.
          </p>
        </motion.div>

        {/* ─── SECTION 1: Money Covers ─── */}
        <div id="money-covers" className="space-y-6 pt-4">
          <motion.div 
            className="flex items-center gap-3 border-b border-gold-200/50 pb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Inbox className="w-5 h-5 text-luxury-gold" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-luxury-accent">
              Shagun Money Covers <span className="text-xs text-gray-500 font-sans font-normal ml-2">(Standard 6.5" x 3.5")</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {moneyCovers.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="gold-divider" />

        {/* ─── SECTION 2: Pocket Money Covers ─── */}
        <div id="pocket-money-covers" className="space-y-6 pt-4">
          <motion.div 
            className="flex items-center gap-3 border-b border-gold-200/50 pb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Layers className="w-5 h-5 text-luxury-gold" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-luxury-accent">
              Pocket Money Covers <span className="text-xs text-gray-500 font-sans font-normal ml-2">(Sleek 4" x 3")</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {pocketMoneyCovers.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="gold-divider" />

        {/* ─── SECTION 3: Acrylic Money Covers ─── */}
        <div id="acrylic-money-covers" className="space-y-6 pt-4">
          <motion.div 
            className="flex items-center gap-3 border-b border-gold-200/50 pb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Crown className="w-5 h-5 text-luxury-gold" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-luxury-accent">
              Acrylic Money Frames <span className="text-xs text-gray-500 font-sans font-normal ml-2">(Tiered pricing available)</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {acrylicMoneyCovers.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        </div>
      </div>

      <CustomDesignModal isOpen={isCustomOpen} onClose={() => setIsCustomOpen(false)} />
    </div>
  );
}
