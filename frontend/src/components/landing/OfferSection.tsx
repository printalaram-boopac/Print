import { motion } from 'framer-motion';
import { Gift, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logUserEvent } from '@/lib/analytics';
import { asset } from '@/lib/asset';

export default function OfferSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-luxury-black/30 relative overflow-hidden">
      {/* Aurora backdrop effect for luxury branding */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-luxury-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-luxury-accent/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="glass-card-gold rounded-2xl overflow-hidden shadow-xl border border-luxury-gold/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left side: Image */}
            <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-[450px] overflow-hidden group">
              <img
                src={asset('IMG_8514.PNG')}
                alt="Premium Acrylic Money Cover Box"
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-accent/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Badge overlay on image */}
              <div className="absolute top-6 left-6 z-10">
                <span className="offer-badge rounded-md text-[11px] font-semibold bg-luxury-accent text-white uppercase tracking-wider px-3.5 py-1.5 shadow-md flex items-center gap-1.5 border border-luxury-gold/30">
                  <Gift className="w-3.5 h-3.5" /> FREE GIFT
                </span>
              </div>
            </div>

            {/* Right side: Details */}
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 space-y-6 flex flex-col justify-center bg-white/40">
              <div className="space-y-3">
                <span className="section-badge-plain text-luxury-gold tracking-widest text-[11px] font-bold">
                  LIMITED TIME BULK OFFER
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-luxury-accent leading-tight">
                  Free Acrylic <span className="text-gold-gradient block sm:inline">Money Cover</span>
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Elevate your wedding gifting. Place an order of <strong className="text-luxury-accent font-bold">100 or more Shagun envelopes (covers)</strong> and receive a complimentary premium Acrylic Money Cover box to store and present them elegantly.
                </p>
              </div>

              {/* Bullet points */}
              <div className="space-y-3 pt-2">
                {[
                  'Handcrafted from high-gloss 4mm crystal-clear acrylic',
                  'Custom gold metallic motifs & engraving option',
                  'Perfect heirloom storage case for wedding cash blessings',
                  'Worth ₹799 — absolutely free on bulk orders of 100+ covers'
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-luxury-gold mt-1 shrink-0" strokeWidth={2.5} />
                    <span className="text-xs md:text-sm text-gray-600 font-medium">{point}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/templates"
                  onClick={() => logUserEvent('CLICK_OFFER_EXPLORE_DESIGNS')}
                  className="btn-magnetic btn-primary text-center px-8 py-3.5 text-xs uppercase tracking-widest font-bold inline-flex items-center gap-2 rounded-full cursor-pointer"
                >
                  Explore Designs <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/919904544702?text=Hi!%20I'm%20interested%20in%20the%20100+%20shagun%20covers%20offer%20to%20get%20the%20free%20Acrylic%20Money%20Cover."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => logUserEvent('CLICK_OFFER_WHATSAPP')}
                  className="btn-magnetic btn-outline text-center px-8 py-3.5 text-xs uppercase tracking-widest font-bold inline-flex items-center gap-2 rounded-full border border-luxury-gold/50 cursor-pointer"
                >
                  Claim via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
