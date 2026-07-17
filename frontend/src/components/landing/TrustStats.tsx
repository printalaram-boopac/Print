import { motion } from 'framer-motion';
import { STATS } from '@/data/landing';

export default function TrustStats() {
  return (
    <section className="relative py-6 border-y border-gold-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center space-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <span className="text-2xl">{stat.icon}</span>
              <h3 className="text-2xl md:text-3xl font-bold text-luxury-gold stat-number">{stat.value}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
