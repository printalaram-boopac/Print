import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Heart, Star, RotateCw } from 'lucide-react';
import { asset } from '@/lib/asset';

interface Product3DModel {
  id: string;
  name: string;
  typeBadge: string;
  tagline: string;
  price: string;
  frontImage: string;
  backImage: string;
  rotateDeg: number;
  specs: string[];
  ctaLink: string;
}

const PRODUCTS_3D: Product3DModel[] = [
  {
    id: 'invitation',
    name: 'Royal Wedding Suite',
    typeBadge: 'Invitation Suite',
    tagline: 'Hand-foiled gold crest with custom calligraphy',
    price: 'Starting at ₹49',
    frontImage: asset('card-4.jpeg'),
    backImage: asset('card-10.jpeg'),
    rotateDeg: -6,
    specs: ['Gold Foil Finish', 'Matching Envelope', 'Digital Proof'],
    ctaLink: '/templates?category=wedding',
  },
  {
    id: 'magazine',
    name: '8-Page Story Magazine',
    typeBadge: 'Editorial Keepsake',
    tagline: 'Your love story told across 8 magazine spreads',
    price: 'Starting at ₹199',
    frontImage: asset('003.jpg'),
    backImage: asset('card-22.jpeg'),
    rotateDeg: 4,
    specs: ['Canva-Style Editor', 'High-Res PDF Export', 'Private & Offline'],
    ctaLink: '/magazine-maker',
  },
  {
    id: 'shagun',
    name: 'Emerald Swaminarayan Lifafa',
    typeBadge: 'Shagun Money Cover',
    tagline: 'Traditional sacred blessings with personalized couple photo',
    price: 'Starting at ₹10 / pc',
    frontImage: asset('card-6.jpeg'),
    backImage: asset('card-1.jpeg'),
    rotateDeg: -4,
    specs: ['210 GSM Art Card', 'Waterproof Ink', 'Fits Currency Notes'],
    ctaLink: '/designer',
  },
  {
    id: 'photobook',
    name: 'Pocket Memory Zine',
    typeBadge: 'Photo Keepsake',
    tagline: 'Fold a single printed A4 sheet into an 8-page pocket booklet',
    price: 'Instant Free Download',
    frontImage: asset('002.jpg'),
    backImage: asset('004.jpg'),
    rotateDeg: 5,
    specs: ['1-Sheet A4 Origami', 'Instant Print-Ready', 'Free DIY'],
    ctaLink: '/photo-zine-maker',
  },
  {
    id: 'giftbox',
    name: 'Luxury Presentation Hamper',
    typeBadge: 'Gift Packaging',
    tagline: 'Artisanal gift box with satin ribbon & custom monogram',
    price: 'Starting at ₹149',
    frontImage: asset('card-28.jpg'),
    backImage: asset('card-30.jpg'),
    rotateDeg: -3,
    specs: ['Rigid Board Box', 'Gold Foil Emboss', 'Protective Cushion'],
    ctaLink: '/templates',
  },
];

export default function Hero3DStage() {
  const [selectedProduct, setSelectedProduct] = useState<Product3DModel>(PRODUCTS_3D[0]);
  const [flipped, setFlipped] = useState(false);

  // Mouse physics tracking
  const ref = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);

  const springX = useSpring(mvX, { stiffness: 180, damping: 18 });
  const springY = useSpring(mvY, { stiffness: 180, damping: 18 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);

  // Sheen overlay following cursor
  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255, 235, 175, 0.4) 0%, rgba(255, 255, 255, 0.1) 35%, transparent 65%)`
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

  const handleSelectProduct = (prod: Product3DModel) => {
    setFlipped(false);
    setSelectedProduct(prod);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* 3D Product Interactive Tabs Switcher */}
      <div className="flex flex-wrap justify-center gap-1.5 p-1.5 bg-white/80 backdrop-blur-md rounded-full border border-[#EDE2D5] shadow-sm max-w-full overflow-x-auto no-scrollbar">
        {PRODUCTS_3D.map((prod) => (
          <button
            key={prod.id}
            type="button"
            onClick={() => handleSelectProduct(prod)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedProduct.id === prod.id
                ? 'bg-[#2D1527] text-white shadow-md'
                : 'text-[#2D1527] hover:bg-[#F7F2EA]'
            }`}
          >
            {prod.typeBadge}
          </button>
        ))}
      </div>

      {/* Main 3D Perspective Stage */}
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[460px] aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center select-none"
        style={{ perspective: 1200 }}
      >
        {/* Secondary Background 3D Cards providing natural layered depth */}
        <motion.div
          className="absolute -left-3 -top-2 w-[160px] sm:w-[190px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-[#EADCC9] opacity-70"
          animate={{
            rotate: selectedProduct.rotateDeg - 8,
            y: [0, -6, 0],
          }}
          transition={{
            y: { repeat: Infinity, duration: 5, ease: 'easeInOut' },
            rotate: { duration: 0.5 },
          }}
          style={{ transform: 'translateZ(-40px)' }}
        >
          <img
            src={asset('card-1.jpeg')}
            alt="Background Card"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          className="absolute -right-3 -bottom-2 w-[170px] sm:w-[200px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-[#EADCC9] opacity-75"
          animate={{
            rotate: selectedProduct.rotateDeg + 10,
            y: [0, 6, 0],
          }}
          transition={{
            y: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
            rotate: { duration: 0.5 },
          }}
          style={{ transform: 'translateZ(-30px)' }}
        >
          <img
            src={asset('003.jpg')}
            alt="Magazine Preview"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Primary Central 3D Interactive Card */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-[240px] sm:w-[290px] aspect-[3/4] z-20"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProduct.id}
              initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: flipped ? 180 : 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: -30 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-full h-full"
            >
              {/* ────── FRONT FACE ────── */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden bg-white border-2 border-[#C89B3C] shadow-2xl p-2.5 flex flex-col justify-between"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                <div className="relative w-full h-[78%] rounded-xl overflow-hidden bg-[#FAF7F2] shadow-inner">
                  <img
                    src={selectedProduct.frontImage}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold text-[#E5CD86] uppercase tracking-wider">
                    {selectedProduct.typeBadge}
                  </div>
                </div>

                <div className="pt-1.5 flex items-center justify-between text-left">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold font-display text-[#2D1527] leading-tight line-clamp-1">
                      {selectedProduct.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-[#C89B3C] block">
                      {selectedProduct.price}
                    </span>
                  </div>

                  {/* 3D Flip Trigger */}
                  <button
                    type="button"
                    onClick={() => setFlipped(!flipped)}
                    title="Flip card in 3D"
                    className="p-1.5 rounded-full bg-[#F7F2EA] hover:bg-[#2D1527] text-[#2D1527] hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Glare Sheen */}
                <motion.div
                  style={{ background: glare }}
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                />
              </div>

              {/* ────── REVERSE BACK FACE ────── */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden bg-[#2D1527] text-white border-2 border-[#C89B3C] shadow-2xl p-4 flex flex-col justify-between"
                style={{
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold text-[#E5CD86] tracking-widest">
                      Custom Specs
                    </span>
                    <button
                      type="button"
                      onClick={() => setFlipped(!flipped)}
                      className="text-[10px] text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3" /> Flip Back
                    </button>
                  </div>
                  <h4 className="text-sm font-display font-bold text-white">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {selectedProduct.tagline}
                  </p>
                  <ul className="space-y-1.5 pt-2">
                    {selectedProduct.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs text-[#E5CD86]">
                        <Sparkles className="w-3 h-3 flex-shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={selectedProduct.ctaLink}
                  className="w-full py-2 px-3 rounded-xl bg-[#C89B3C] hover:bg-[#B3872E] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  Personalize This <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Floating 3D Badge: "10,000+ Happy Customers" */}
        <motion.div
          className="absolute -right-2 top-1/4 rounded-2xl bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-2xl border border-[#EDE2D5] flex items-center gap-2.5 z-30 pointer-events-none"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(50px)' }}
        >
          <div className="w-7 h-7 rounded-full bg-[#FCF4E4] flex items-center justify-center text-[#C89B3C]">
            <Heart className="w-3.5 h-3.5 fill-[#C89B3C]" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-[#2D1527] block leading-tight">10,000+</span>
            <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Happy Customers</span>
          </div>
        </motion.div>

        {/* Floating 3D Badge: "★ 4.9 Rating" */}
        <motion.div
          className="absolute -left-2 bottom-4 rounded-2xl bg-white/95 backdrop-blur-md px-3 py-2 shadow-xl border border-[#EDE2D5] flex items-center gap-2 z-30 pointer-events-none"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}
          style={{ transform: 'translateZ(45px)' }}
        >
          <div className="flex text-[#E5A93C]">
            <Star className="w-3.5 h-3.5 fill-[#E5A93C]" />
          </div>
          <span className="text-xs font-bold text-[#2D1527]">4.9 / 5.0</span>
          <span className="text-[9px] text-gray-500 uppercase font-semibold">Quality</span>
        </motion.div>
      </div>

      {/* Active Product Quick Info & Link */}
      <div className="flex items-center justify-between w-full max-w-[420px] px-2 text-xs">
        <span className="text-gray-500 font-medium">
          Showing: <strong className="text-[#2D1527]">{selectedProduct.name}</strong>
        </span>
        <Link
          to={selectedProduct.ctaLink}
          className="text-[#C89B3C] font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          Customize in 3D <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
