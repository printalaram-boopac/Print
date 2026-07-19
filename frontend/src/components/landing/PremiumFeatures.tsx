import { motion } from 'framer-motion';
import { Gem, Layers, Printer, Droplet, Sparkles, Rocket, Flag, type LucideIcon } from 'lucide-react';
import { FEATURES } from '@/data/landing';

const FEATURE_ICONS: Record<string, LucideIcon> = {
  Layers,
  Printer,
  Droplet,
  Sparkles,
  Rocket,
  Flag,
};

export default function PremiumFeatures() {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-badge-underline">
            <Gem className="w-3.5 h-3.5" strokeWidth={2} />
            Premium Quality
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Why Choose <span className="text-gold-gradient">PrintAlarm</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map((feat, i) => {
            const Icon = FEATURE_ICONS[feat.icon];
            return (
              <motion.div
                key={feat.title}
                className="glass-card-gold p-6 md:p-8 rounded-lg text-center space-y-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                <span className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-luxury-gold/10 flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-luxury-gold" strokeWidth={1.75} />
                </span>
                <h3 className="text-sm md:text-base font-semibold text-luxury-accent">{feat.title}</h3>
                <p className="text-xs text-gray-500">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
