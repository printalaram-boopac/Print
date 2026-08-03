import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TEMPLATES } from '@/data/templates';
import TemplateCard from '@/components/TemplateCard';
import { logUserEvent } from '@/lib/analytics';

// Show first 6 non-acrylic templates as trending designs
const TRENDING = TEMPLATES.filter((t) => t.coverType !== 'acrylic_money_cover').slice(0, 6);

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
          {TRENDING.map((design, i) => (
            <TemplateCard key={design.id} template={design} index={i} showWhatsApp />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/templates" onClick={() => logUserEvent('CLICK_TRENDING_EXPLORE_ALL')} className="btn-glass btn-glass-gold">
            Explore All 100+ Designs <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

