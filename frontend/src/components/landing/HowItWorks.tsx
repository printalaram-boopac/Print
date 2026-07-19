import { motion } from 'framer-motion';
import { Palette, Camera, CheckCircle2, Printer, Package, PartyPopper, ClipboardList, type LucideIcon } from 'lucide-react';
import { PROCESS_STEPS } from '@/data/landing';

const STEP_ICONS: Record<string, LucideIcon> = {
  Palette,
  Camera,
  CheckCircle2,
  Printer,
  Package,
  PartyPopper,
};

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 px-4 bg-luxury-dark/50">
      <div className="max-w-3xl mx-auto space-y-16">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-badge-underline"><ClipboardList className="w-3.5 h-3.5" strokeWidth={2} /> Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            How It <span className="text-gold-gradient">Works</span>
          </h2>
          <p className="text-gray-500">From design to doorstep in 6 easy steps</p>
        </motion.div>

        {/* Timeline wrapper */}
        <div className="relative border-l-2 border-gold-200 ml-4 md:ml-8 pl-8 md:pl-12 space-y-12">
          {PROCESS_STEPS.map((step, i) => {
            const Icon = STEP_ICONS[step.icon];
            return (
            <motion.div
              key={step.step}
              className="relative flex flex-col md:flex-row gap-4 md:gap-8 items-start"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Step indicator dot anchored on the left border line */}
              <div className="absolute -left-[45px] md:-left-[61px] top-0.5 w-7 h-7 md:w-8 md:h-8 rounded-full bg-luxury-black border-2 border-luxury-gold flex items-center justify-center text-[10px] md:text-xs font-bold text-luxury-gold z-10 shadow-sm">
                {step.step}
              </div>

              {/* Icon & Title Group */}
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-lg bg-luxury-gray border border-gold-200 flex items-center justify-center shadow-sm">
                  <Icon className="w-6 h-6 text-luxury-gold" strokeWidth={1.75} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-luxury-gold uppercase tracking-widest block">Step 0{step.step}</span>
                  <h3 className="text-base font-display font-bold text-luxury-accent">{step.title}</h3>
                </div>
              </div>

              {/* Description */}
              <div className="md:pt-3 md:flex-1">
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
