import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Wand2 } from 'lucide-react';
import { asset } from '@/lib/asset';
import { logUserEvent } from '@/lib/analytics';

function GoldParticles() {
  return (
    <div className="hero-particles">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            background: '#C5A059'
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    };
    el.addEventListener('mousemove', handleMouse);
    return () => el.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-luxury-black">
      {/* Subtle Aurora Glows in Luxury Maroon & Gold */}
      <div className="aurora-bg">
        <div className="aurora-blob" style={{ width: 500, height: 500, top: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(197,160,89,0.08), transparent)' }} />
        <div className="aurora-blob" style={{ width: 500, height: 500, bottom: '5%', right: '-5%', background: 'radial-gradient(circle, rgba(61,30,48,0.05), transparent)', animationDelay: '4s' }} />
      </div>

      <GoldParticles />

      <div className="max-w-6xl mx-auto px-4 md:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Text & Content */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-gold-200 bg-white/70 text-[10px] font-bold uppercase tracking-widest text-luxury-accent rounded-full shadow-sm">
              ✦ Hand-Crafted in India
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight text-luxury-accent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              Shagun Lifafa,<br />
              <span className="text-gold-gradient italic font-normal">Personalised.</span>
            </motion.h1>

            <motion.p
              className="text-[#6E5764] text-sm md:text-base font-light max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Personalize luxurious wedding money covers with your name, family blessing, and a cherished photo. Printed on premium paper within 72 hours, delivered with love.
            </motion.p>

            <motion.p
              className="text-sm md:text-base font-semibold text-luxury-accent max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              Printalarm ships personalized Shagun covers pan-India within 3-5 business days, with 24-48 hour express delivery available.
            </motion.p>
          </div>

          <motion.div
            className="flex flex-wrap gap-4 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <Link to="/templates" onClick={() => logUserEvent('CLICK_HERO_EXPLORE')} className="btn-glass btn-glass-maroon">
              Explore Collection <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
            <Link to="/templates" onClick={() => logUserEvent('CLICK_HERO_CUSTOMIZE')} className="btn-glass btn-glass-gold">
              <Wand2 className="w-3.5 h-3.5" strokeWidth={2} /> Customize Now
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="flex gap-8 md:gap-12 pt-8 md:pt-10 border-t border-gold-200/50 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-display font-semibold text-luxury-accent">15k+</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Happy Couples</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-display font-semibold text-luxury-accent flex items-center gap-1">
                4.9<span className="text-luxury-gold text-lg">★</span>
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Avg Rating</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-display font-semibold text-luxury-accent">72h</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Dispatch</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Overlapping Images Collage */}
        <div className="lg:col-span-5 relative flex justify-center items-center py-10 lg:py-0 overflow-hidden sm:overflow-visible">
          <motion.div
            className="relative w-full max-w-[400px] aspect-[4/5] flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Top-Right Tilted Card */}
            <motion.div
              className="absolute -top-4 -right-4 w-[160px] aspect-[4/3] bg-white p-2 rounded-xl shadow-xl border border-gold-100 z-20 cursor-pointer overflow-hidden"
              style={{ rotate: '8deg' }}
              whileHover={{ scale: 1.05, zIndex: 30, rotate: '12deg' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <img
                src={asset('card-4.jpeg')}
                alt="Personalized White Gold Shagun Cover"
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>

            {/* Main Central Card */}
            <motion.div
              className="w-full aspect-[4/5] bg-white p-4 rounded-2xl shadow-2xl border border-gold-100 z-10 overflow-hidden"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={asset('card-6.jpeg')}
                alt="Royal Swaminarayan Shagun Cover"
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>

            {/* Bottom-Left Tilted Card */}
            <motion.div
              className="absolute -bottom-6 -left-6 w-[160px] aspect-[3/4] bg-white p-2 rounded-xl shadow-xl border border-gold-100 z-20 cursor-pointer overflow-hidden"
              style={{ rotate: '-8deg' }}
              whileHover={{ scale: 1.05, zIndex: 30, rotate: '-12deg' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <img
                src={asset('card-2.jpeg')}
                alt="Lotus Floral Shagun Cover with Photo"
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
