import { motion } from 'framer-motion';
import { FEATURES } from '@/data/landing';

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
          <span className="section-badge">💎 Premium Quality</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Why Choose <span className="text-gold-gradient">PrintAlarm</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="glass-card-gold p-6 md:p-8 rounded-lg text-center space-y-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
            >
              <span className="text-3xl md:text-4xl block">{feat.icon}</span>
              <h3 className="text-sm md:text-base font-semibold text-luxury-accent">{feat.title}</h3>
              <p className="text-xs text-gray-500">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
