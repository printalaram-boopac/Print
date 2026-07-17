import { useState } from 'react';
import { motion } from 'framer-motion';
import { FAQS } from '@/data/landing';

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between text-left gap-4 group cursor-pointer"
      >
        <span className="text-sm md:text-base font-medium text-luxury-accent group-hover:text-luxury-gold transition-colors">
          {q}
        </span>
        <span
          className="text-luxury-gold text-lg flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </span>
      </button>
      <div className={`faq-answer ${open ? 'open' : ''}`}>
        <p className="text-sm text-gray-400 pb-5 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-luxury-dark/50">
      <div className="max-w-3xl mx-auto space-y-10">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-badge">❓ Common Questions</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Frequently Asked <span className="text-gold-gradient">Questions</span>
          </h2>
        </motion.div>

        <motion.div
          className="glass-panel rounded-xl p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
