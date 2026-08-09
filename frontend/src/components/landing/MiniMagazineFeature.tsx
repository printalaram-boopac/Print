import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Images, Sparkles, Magnet, Layers, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import { asset } from '@/lib/asset';
import { logUserEvent } from '@/lib/analytics';

export default function MiniMagazineFeature() {
  return (
    <section className="py-20 md:py-28 px-4 relative overflow-hidden bg-gradient-to-b from-transparent via-luxury-gold/5 to-transparent">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luxury-gold/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="glass-card-gold rounded-3xl p-8 md:p-12 lg:p-16 border border-luxury-gold/30 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-accent font-semibold text-xs tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                <span>New Studio Feature</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-display font-bold text-luxury-accent leading-tight">
                Design Your Own <span className="text-gold-gradient">A4 Mini Magazine</span> & Photo Zine
              </h2>

              <p className="text-gray-600 md:text-lg leading-relaxed font-sans">
                Turn your wedding memories, event highlights, and photo collections into professionally styled print-ready A4 magazines with our interactive canvas studio.
              </p>

              {/* Highlight Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-luxury-gold/20">
                  <div className="p-2 rounded-lg bg-luxury-gold/20 text-luxury-gold shrink-0">
                    <Magnet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-luxury-accent">Magnetic Snapping</h4>
                    <p className="text-xs text-gray-500">Auto align photos and text overlays with precision guidelines.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-luxury-gold/20">
                  <div className="p-2 rounded-lg bg-luxury-gold/20 text-luxury-gold shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-luxury-accent">Visual Layer Stack</h4>
                    <p className="text-xs text-gray-500">Reorder element depth, bring forward, or send backward effortlessly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-luxury-gold/20">
                  <div className="p-2 rounded-lg bg-luxury-gold/20 text-luxury-gold shrink-0">
                    <Images className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-luxury-accent">Layout Presets</h4>
                    <p className="text-xs text-gray-500">Choose from Single, Grid, Split, and Collage page layouts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-luxury-gold/20">
                  <div className="p-2 rounded-lg bg-luxury-gold/20 text-luxury-gold shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-luxury-accent">High-Res Export</h4>
                    <p className="text-xs text-gray-500">Export crystal-clear print-ready PDF files formatted for A4 paper.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to="/photo-zine-maker"
                  onClick={() => logUserEvent('CLICK_MINI_MAGAZINE_FEATURE_PRIMARY')}
                  className="px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold text-white shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #C5A059, #75591C)' }}
                >
                  <Images className="w-4 h-4" /> Open Mini Magazine Studio <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Free to design & preview</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-luxury-gold/40 shadow-2xl bg-luxury-black/5 group">
                <img
                  src={asset('IMG_8490.PNG')}
                  alt="Mini Magazine Studio Preview"
                  className="w-full h-[380px] md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-accent/80 via-transparent to-transparent" />

                {/* Badge Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-luxury-gold/30 shadow-lg text-luxury-accent space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-luxury-gold">
                    <span>A4 Photo Zine Studio</span>
                    <span className="px-2 py-0.5 rounded bg-luxury-gold/20 text-[10px]">Print Ready</span>
                  </div>
                  <p className="text-xs text-gray-600 font-sans">
                    Custom typography, drag-and-drop slots, photo filters, and multi-page zines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
