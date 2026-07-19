import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function PolicyLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs md:text-sm tracking-[0.2em] text-luxury-gold font-semibold uppercase">
              Our Policies
            </p>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-luxury-accent">{title}</h1>
          </motion.div>

          <motion.div
            className="glass-card-gold policy-content p-6 md:p-10 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
}
