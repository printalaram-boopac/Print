import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wand2, RotateCw, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { asset } from '@/lib/asset';
import { logUserEvent } from '@/lib/analytics';

const BLESSING_OPTIONS = [
  'શુભ લગ્ન',
  'With Best Compliments',
  'Blessings from Family',
  'Heartiest Congratulations',
  'सप्रेम सस्नेह भेट',
];

const FOIL_STYLES = [
  { id: 'gold', name: 'Royal Gold', color: '#D4AF37', textClass: 'text-[#E5CD86]' },
  { id: 'rose', name: 'Rose Gold', color: '#B76E79', textClass: 'text-[#F2B5B0]' },
  { id: 'silver', name: 'Platinum Silver', color: '#C0C0C0', textClass: 'text-[#E0E0E0]' },
];

export default function LiveMiniCustomizer() {
  const navigate = useNavigate();
  const [coupleName, setCoupleName] = useState('Vihaan & Kiara');
  const [familyName, setFamilyName] = useState('Patel Family');
  const [greeting, setGreeting] = useState('શુભ લગ્ન');
  const [selectedFoil, setSelectedFoil] = useState(FOIL_STYLES[0]);
  const [flipped, setFlipped] = useState(false);

  // 3D Tilt Physics
  const ref = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);

  const springX = useSpring(mvX, { stiffness: 180, damping: 18 });
  const springY = useSpring(mvY, { stiffness: 180, damping: 18 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [16, -16]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-16, 16]);

  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255, 235, 175, 0.45) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 65%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  const handleLaunchStudio = () => {
    logUserEvent('LAUNCH_STUDIO_FROM_MINI_CUSTOMIZER', { coupleName, familyName });
    navigate('/designer');
  };

  return (
    <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2] relative overflow-hidden border-t border-[#EADCC9]/60">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-80 h-80 bg-[#2D1527]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full border border-[#C89B3C]/40 bg-white/70 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2D1527] shadow-xs">
            <Wand2 className="w-3.5 h-3.5 text-[#C89B3C]" /> Interactive 3D Demo
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-[#2D1527] leading-tight">
            See Your Name in <span className="italic font-normal text-[#C89B3C]">Real 3D Gold Foil</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Type below to see the 3D card update instantly. Move your cursor to watch the metallic foil reflect light!
          </p>
        </div>

        {/* 2-Column Playground: Left Controls, Right 3D View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#EADCC9] shadow-xl space-y-6">
            {/* Input 1: Couple / Recipient Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D1527] uppercase tracking-wider block">
                Couple or Recipient Name
              </label>
              <input
                type="text"
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
                placeholder="e.g. Vihaan & Kiara"
                maxLength={40}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E4D5C5] focus:outline-none focus:ring-2 focus:ring-[#C89B3C] text-sm text-gray-800 bg-[#FCFAF7]"
              />
            </div>

            {/* Input 2: Family / Gifter Blessing */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D1527] uppercase tracking-wider block">
                Blessings from Family
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g. Patel Family"
                maxLength={40}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E4D5C5] focus:outline-none focus:ring-2 focus:ring-[#C89B3C] text-sm text-gray-800 bg-[#FCFAF7]"
              />
            </div>

            {/* Blessing Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D1527] uppercase tracking-wider block">
                Auspicious Greeting
              </label>
              <div className="flex flex-wrap gap-2">
                {BLESSING_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGreeting(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      greeting === opt
                        ? 'bg-[#2D1527] text-white border-[#2D1527] shadow-sm'
                        : 'bg-[#FCFAF7] text-gray-700 border-[#E4D5C5] hover:border-[#C89B3C]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Foil Color Options */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D1527] uppercase tracking-wider block">
                Metallic Foil Color
              </label>
              <div className="flex items-center gap-3">
                {FOIL_STYLES.map((foil) => (
                  <button
                    key={foil.id}
                    type="button"
                    onClick={() => setSelectedFoil(foil)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedFoil.id === foil.id
                        ? 'border-[#2D1527] bg-[#FAF7F2] ring-2 ring-[#C89B3C]/50'
                        : 'border-[#E4D5C5] bg-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-xs"
                      style={{ backgroundColor: foil.color }}
                    />
                    <span>{foil.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Features summary */}
            <div className="pt-2 border-t border-[#EADCC9] grid grid-cols-2 gap-2 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>Heavy 210 GSM Art Card</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>Waterproof HD Ink</span>
              </span>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLaunchStudio}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2D1527] hover:bg-[#431F3B] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                Customize in Full 3D Studio <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
            </div>
          </div>

          {/* 3D Live Perspective Canvas */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full max-w-[340px] mb-3 text-xs">
              <span className="font-semibold text-gray-500">Move mouse to tilt & reflect</span>
              <button
                type="button"
                onClick={() => setFlipped(!flipped)}
                className="text-[11px] font-bold text-[#C89B3C] hover:text-[#2D1527] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                {flipped ? 'View Front Side' : 'Flip to Back Flap (3D)'}
              </button>
            </div>

            {/* The 3D Interactive Envelope Card */}
            <div
              ref={ref}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] flex items-center justify-center select-none"
              style={{ perspective: 1200 }}
            >
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-full h-full"
              >
                <motion.div
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative w-full h-full"
                >
                  {/* ────── FRONT SIDE ────── */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden bg-[#24131E] border-2 border-[#D4AF37] shadow-[0_24px_64px_rgba(45,21,39,0.25)] p-6 flex flex-col justify-between"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    {/* Background Template Graphic */}
                    <div className="absolute inset-0 opacity-25 mix-blend-luminosity pointer-events-none">
                      <img
                        src={asset('card-6.jpeg')}
                        alt="Background Template"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Gold filigree top header */}
                    <div className="relative z-10 text-center space-y-1 pt-2">
                      <span className={`text-sm font-bold tracking-widest block font-display ${selectedFoil.textClass}`}>
                        ✦ {greeting} ✦
                      </span>
                      <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
                    </div>

                    {/* Middle Personalization: Couple Names */}
                    <div className="relative z-10 text-center space-y-2 my-auto py-6">
                      <span className="text-[10px] tracking-[0.25em] text-[#E5CD86] uppercase font-bold block">
                        Together with their families
                      </span>
                      <h3 className={`text-2xl sm:text-3xl font-display font-bold leading-tight ${selectedFoil.textClass} drop-shadow-sm`}>
                        {coupleName || 'Your Names Here'}
                      </h3>
                      <div className="w-12 h-[1px] bg-[#D4AF37]/60 mx-auto" />
                    </div>

                    {/* Bottom Family Blessing */}
                    <div className="relative z-10 text-center space-y-1 pb-2 border-t border-[#D4AF37]/20 pt-3">
                      <span className="text-[9px] uppercase tracking-widest text-gray-300 block">
                        Best Compliments From
                      </span>
                      <p className={`text-sm font-display font-semibold ${selectedFoil.textClass}`}>
                        {familyName || 'Your Family Name'}
                      </p>
                    </div>

                    {/* 3D Gold Sheen Glare */}
                    <motion.div
                      style={{ background: glare }}
                      className="absolute inset-0 pointer-events-none rounded-3xl z-20"
                    />
                  </div>

                  {/* ────── BACK SIDE (ENVELOPE FLAP) ────── */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden bg-[#1E0D19] border-2 border-[#D4AF37] shadow-2xl p-6 flex flex-col items-center justify-between text-white"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Flap shape */}
                    <div className="w-full text-center space-y-3 pt-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E5CD86] to-[#99772B] mx-auto flex items-center justify-center text-[#2D1527] font-bold text-xl shadow-lg border-2 border-white/40">
                        ✦
                      </div>
                      <span className="text-xs uppercase font-bold tracking-widest text-[#E5CD86] block">
                        Wax Seal Presentation
                      </span>
                      <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
                        Pre-gummed self-adhesive seal, printed with high-definition waterproof ink on heavy 210 GSM card.
                      </p>
                    </div>

                    <div className="w-full text-center pb-2 border-t border-[#D4AF37]/30 pt-3">
                      <span className="text-[10px] text-[#E5CD86] font-semibold tracking-wider uppercase block">
                        PrintAlarm Hand-Crafted
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
