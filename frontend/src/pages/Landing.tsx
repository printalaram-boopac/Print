import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Upload,
  Sparkles,
  Eye,
  Package
} from 'lucide-react';
import { logUserEvent } from '@/lib/analytics';

const PRODUCTS = [
  {
    id: 'frames',
    title: 'Photo Frames',
    tagline: 'Give your favourite photo a place to stay.',
    img: '/homepage/product-frame.jpg',
    to: '/designer',
    btnText: 'Create a Frame →',
    btnClass: 'bg-[#BD9154] hover:bg-[#A67E43]',
  },
  {
    id: 'magazines',
    title: 'Personalised Magazine',
    tagline: 'Your photos. Your stories. Your magazine.',
    img: '/homepage/product-magazine.jpg',
    to: '/magazine-maker',
    btnText: 'Create Magazine →',
    btnClass: 'bg-[#571126] hover:bg-[#38101D]',
  },
  {
    id: 'zines',
    title: 'Photo Zine',
    tagline: '8 photos. One little story to keep.',
    img: '/homepage/product-zine.jpg',
    to: '/photo-zine-maker',
    btnText: 'Create a Zine →',
    btnClass: 'bg-[#571126] hover:bg-[#38101D]',
  },
  {
    id: 'cards',
    title: 'Cards & Lifafas',
    tagline: 'Made personal for every celebration.',
    img: '/homepage/product-card.jpg',
    to: '/templates',
    btnText: 'Personalise Yours →',
    btnClass: 'bg-[#BD9154] hover:bg-[#A67E43]',
  },
];

const STEPS = [
  { num: '01', title: 'Choose', desc: "Pick what you'd like to create.", icon: Heart },
  { num: '02', title: 'Upload', desc: 'Add the photos that matter to you.', icon: Upload },
  { num: '03', title: 'Personalise', desc: 'Choose your design, words and details.', icon: Sparkles },
  { num: '04', title: 'Preview', desc: 'See your creation before you order.', icon: Eye },
  { num: '05', title: 'Receive', desc: 'We print it and deliver it to you.', icon: Package },
];

const TRENDING_ITEMS = [
  { id: 1, title: 'Photo Frame', category: 'frames', img: '/homepage/quad-frame.jpg', to: '/designer' },
  { id: 2, title: 'Wedding Magazine', category: 'magazines', img: '/homepage/quad-magazine.jpg', to: '/magazine-maker' },
  { id: 3, title: 'Travel Zine', category: 'zines', img: '/homepage/quad-zine.jpg', to: '/photo-zine-maker' },
  { id: 4, title: 'Shagun Lifafa', category: 'cards', img: '/homepage/quad-card.jpg', to: '/templates' },
  { id: 5, title: 'Family Frame', category: 'frames', img: '/homepage/feature-frame.jpg', to: '/designer' },
  { id: 6, title: 'Invitation Card', category: 'cards', img: '/homepage/feature-card.jpg', to: '/templates' },
];

const REAL_CREATION_ITEMS = [
  { id: 1, img: '/homepage/quad-frame.jpg', alt: 'Black wood frame portrait' },
  { id: 2, img: '/homepage/quad-zine.jpg', alt: 'Travel photo zine open' },
  { id: 3, img: '/homepage/quad-magazine.jpg', alt: 'Together wedding magazine' },
  { id: 4, img: '/homepage/product-card.jpg', alt: 'Floral wedding envelope' },
  { id: 5, img: '/homepage/feature-frame.jpg', alt: 'Family framed photograph' },
  { id: 6, img: '/homepage/feature-card.jpg', alt: 'Custom Shagun Lifafa' },
];

const FAQ_ITEMS = [
  {
    q: 'What can I personalise?',
    a: 'You can personalise frames, magazines, photo zines, cards and lifafas with your own photos, names, and customized words.',
  },
  {
    q: 'Do I need design experience?',
    a: 'No! Simply pick what you like, upload your photos, arrange them with our easy visual tools, and preview live.',
  },
  {
    q: 'Can I preview my design before ordering?',
    a: 'Yes, our interactive studios let you inspect covers, page layouts, and 3D previews in real time.',
  },
  {
    q: 'Can I use photos from my phone?',
    a: 'Yes, you can upload photos directly from your smartphone or computer in seconds.',
  },
  {
    q: 'Do you deliver across India?',
    a: 'Yes, we offer insured, fast pan-India courier delivery with express rush options available.',
  },
];

export default function Landing() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [customName, setCustomName] = useState('Aarav & Diya');
  const [activeSwatch, setActiveSwatch] = useState('wood');

  const filteredTrending = activeFilter === 'all'
    ? TRENDING_ITEMS
    : TRENDING_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <div className="bg-[#FAF7F2] text-[#35151C] font-sans overflow-hidden">
      {/* ────────────────── 1. HERO SECTION WITH ELEGANT ENTRANCE & FLOAT ────────────────── */}
      <section className="bg-gradient-to-r from-[#FFF9F2] via-[#F8EDE2] to-[#EFE0CF] overflow-hidden border-b border-[#E7D9CE]">
        <div className="w-[92%] max-w-[1180px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[46%_54%] min-h-[385px] lg:min-h-[420px] items-center">
            {/* Left Copy with Staggered Entrance */}
            <motion.div
              className="py-10 lg:py-14 lg:pr-8 z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.p
                className="uppercase tracking-[0.18em] text-[0.74rem] font-bold text-[#9A6545] mb-1.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                PERSONALISED, BY YOU.
              </motion.p>

              <motion.h1
                className="font-display text-[2.65rem] sm:text-[3.4rem] lg:text-[4.2rem] font-bold text-[#35151C] leading-[0.98] tracking-[-0.03em] my-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Turn Your Photos<br />
                Into Something<br />
                Worth Keeping.
              </motion.h1>

              <motion.p
                className="text-[#5E4B4C] text-[0.95rem] sm:text-[1.02rem] max-w-[530px] mb-6 leading-normal font-normal"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Create personalised frames, magazines, photo zines and cards from the moments you love.
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center gap-3.5 pt-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  to="/templates"
                  onClick={() => logUserEvent('CLICK_HERO_START_CREATING')}
                  className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 bg-[#571126] text-white font-bold text-[0.85rem] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#571126]/25 transition-all shadow-xs cursor-pointer group"
                >
                  Start Creating <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <a
                  href="#products"
                  className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 bg-[#FFFAF4] text-[#571126] font-bold text-[0.85rem] border border-[#571126] hover:-translate-y-0.5 hover:bg-[#F8EFE4] transition-all shadow-xs cursor-pointer group"
                >
                  Explore Products <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </motion.div>

              {/* Exact glyph trust items with gentle hover highlight */}
              <motion.div
                className="flex flex-wrap items-center gap-7 mt-6 text-[0.78rem] font-semibold text-[#35151C]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <span className="flex items-center gap-1.5 hover:text-[#BD8D4B] transition-colors cursor-default">
                  <span className="text-base">▣</span> Easy to personalise
                </span>
                <span className="flex items-center gap-1.5 hover:text-[#BD8D4B] transition-colors cursor-default">
                  <span className="text-base">♡</span> Preview before ordering
                </span>
                <span className="flex items-center gap-1.5 hover:text-[#BD8D4B] transition-colors cursor-default">
                  <span className="text-base">▰</span> Made with care
                </span>
              </motion.div>
            </motion.div>

            {/* Right Hero Art - Seamless with subtle hover depth animation */}
            <motion.div
              className="relative h-[320px] sm:h-[385px] lg:h-[420px] w-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.img
                src="/homepage/hero-collection.jpg"
                alt="A collection of personalised frames, magazines, photo zines and cards"
                className="w-full h-full object-cover object-[center_right] transition-transform duration-700 hover:scale-103"
              />
              {/* Soft gradient edge blending with the cream background */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, #F8EDE2 0%, rgba(248, 237, 226, 0) 28%)',
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────── 2. WHAT WILL YOU CREATE? (HOVER CARDS WITH 3D LIFT) ────────────────── */}
      <section id="products" className="py-16 md:py-20 bg-[#FFFDF9] text-center">
        <div className="w-[92%] max-w-[1180px] mx-auto">
          <motion.p
            className="uppercase tracking-[0.18em] text-[0.74rem] font-bold text-[#9A6545] mb-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            MAKE IT YOURS
          </motion.p>
          <motion.h2
            className="font-display text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] font-bold text-[#35151C] leading-[1.03] my-1"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            What Will You Create?
          </motion.h2>
          <motion.p
            className="text-[#6C5B59] text-[0.95rem] max-w-xl mx-auto mb-9"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            From one favourite photo to a whole story, choose how you'd like to keep your memories.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
            {PRODUCTS.map((prod, idx) => (
              <motion.article
                key={prod.id}
                className="bg-[#F6EADC] rounded-[10px] overflow-hidden text-center shadow-[inset_0_1px_0_#fff] transition-all duration-300 flex flex-col group border border-[#E7D9CE]/60 cursor-pointer"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 18px 32px -8px rgba(56, 16, 29, 0.16)' }}
              >
                <div className="h-[210px] overflow-hidden bg-[#EEDFD5]">
                  <img
                    src={prod.img}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="p-[18px_14px_22px] flex flex-col flex-grow items-center">
                  <h3 className="font-display text-[1.25rem] font-bold text-[#35151C] mb-1 group-hover:text-[#BD8D4B] transition-colors">
                    {prod.title}
                  </h3>
                  <p className="text-[0.83rem] text-[#55494A] min-h-[40px] mb-4 leading-normal">
                    {prod.tagline}
                  </p>
                  <Link
                    to={prod.to}
                    onClick={() => logUserEvent(`CLICK_PRODUCT_${prod.id.toUpperCase()}`)}
                    className={`mt-auto w-full py-[0.65rem] px-[1.1rem] rounded-full text-[0.85rem] font-bold text-white transition-all shadow-xs ${prod.btnClass}`}
                  >
                    {prod.btnText}
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── 3. MADE BY YOU. MADE EASY. (ANIMATED STEPS & LAPTOP FLOAT) ────────────────── */}
      <section id="how" className="py-16 md:py-20 bg-[#FFFAF4] border-y border-[#E7D9CE]">
        <div className="w-[92%] max-w-[1180px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-11 items-center">
            <div>
              <p className="uppercase tracking-[0.18em] text-[0.74rem] font-bold text-[#9A6545] mb-1.5">
                FROM PHOTO TO KEEPSAKE
              </p>
              <h2 className="font-display text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] font-bold text-[#35151C] leading-[1.03] my-1">
                Made By You. Made Easy.
              </h2>
              <p className="text-[#6C5B59] text-[0.95rem]">
                Creating something personal shouldn't feel complicated.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-7">
                {STEPS.map((s, idx) => (
                  <motion.div
                    key={s.num}
                    className={`text-center px-2 py-1 transition-all ${
                      idx < 4 ? 'sm:border-r border-[#E7D9CE]' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="w-[50px] h-[50px] rounded-full bg-[#F5E9DD] text-[#BD8D4B] flex items-center justify-center mx-auto mb-2.5 text-lg font-bold shadow-xs cursor-pointer"
                      whileHover={{ scale: 1.15, backgroundColor: '#FAF7F2' }}
                      transition={{ type: 'spring', stiffness: 350 }}
                    >
                      <s.icon className="w-5 h-5 text-[#BD8D4B]" />
                    </motion.div>
                    <b className="block text-[0.78rem] font-bold text-[#35151C]">{s.num} {s.title}</b>
                    <span className="block text-[0.7rem] text-[#6C5B59] mt-1 leading-tight">
                      {s.desc}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Laptop Mockup with gentle floating idle animation */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="rounded-[12px] overflow-hidden shadow-2xl border border-[#E7D9CE] bg-white group">
                <img
                  src="/homepage/steps-editor.jpg"
                  alt="PrintAlarm online personalisation editor on laptop"
                  className="w-full h-[260px] sm:h-[280px] object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────── 4. DETAILED PRODUCT SHOWCASES WITH HOVER & LIVE CONTROLS ────────────────── */}
      <section id="create" className="pt-4 pb-16 md:pb-20 bg-[#FAF7F2]">
        <div className="w-[92%] max-w-[1180px] mx-auto space-y-5">
          {/* Feature 1: Personalised Magazines */}
          <motion.article
            id="magazines"
            className="min-h-[325px] rounded-[12px] overflow-hidden bg-[#F3DFD0] grid grid-cols-1 md:grid-cols-[40%_60%] items-center shadow-xs border border-[#E7D9CE] group"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-8 sm:p-11 space-y-3">
              <p className="uppercase tracking-[0.18em] text-[0.74rem] font-bold text-[#9A6545]">
                PERSONALISED MAGAZINES
              </p>
              <h2 className="font-display text-[2rem] sm:text-[2.6rem] font-bold text-[#35151C] leading-[1.02]">
                Your Memories.<br />Your Magazine.
              </h2>
              <p className="text-[#5E4F4B] text-[0.92rem] leading-normal">
                Turn your favourite photos and stories into a magazine that's completely yours. Create the cover, arrange your photos, add your words and make every page personal.
              </p>
              <div className="pt-2">
                <Link
                  to="/magazine-maker"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#571126] text-white font-bold text-[0.85rem] hover:bg-[#38101D] hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs hover:shadow-md"
                >
                  Create Your Magazine →
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-[0.75rem] text-[#6C5B59] font-semibold">
                <span>• Choose a design</span>
                <span>• Add your photos</span>
                <span>• Tell your story</span>
              </div>
            </div>
            <div className="h-full min-h-[325px] overflow-hidden">
              <img
                src="/homepage/feature-magazine.jpg"
                alt="Personalised wedding magazine and open photo spread"
                className="w-full h-full object-cover min-h-[325px] group-hover:scale-103 transition-transform duration-600"
              />
            </div>
          </motion.article>

          {/* Feature 2: Photo Zines (Reverse) */}
          <motion.article
            id="zines"
            className="min-h-[325px] rounded-[12px] overflow-hidden bg-[#F3DFD0] grid grid-cols-1 md:grid-cols-[60%_40%] items-center shadow-xs border border-[#E7D9CE] group"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-full min-h-[325px] order-2 md:order-1 overflow-hidden">
              <img
                src="/homepage/feature-zine.jpg"
                alt="A small travel photo zine held open"
                className="w-full h-full object-cover min-h-[325px] group-hover:scale-103 transition-transform duration-600"
              />
            </div>
            <div className="p-8 sm:p-11 space-y-3 order-1 md:order-2">
              <p className="uppercase tracking-[0.18em] text-[0.74rem] font-bold text-[#9A6545]">
                SMALL BOOK. BIG MEMORIES.
              </p>
              <h2 className="font-display text-[2rem] sm:text-[2.6rem] font-bold text-[#35151C] leading-[1.02]">
                8 Photos. One Little Story.
              </h2>
              <p className="text-[#5E4F4B] text-[0.92rem] leading-normal">
                Choose eight favourite photos and turn them into a pocket-sized photo zine made to keep, share or gift.
              </p>
              <div className="pt-2">
                <Link
                  to="/photo-zine-maker"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#571126] text-white font-bold text-[0.85rem] hover:bg-[#38101D] hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs hover:shadow-md"
                >
                  Create Your Photo Zine →
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-[0.75rem] text-[#6C5B59] font-semibold">
                <span>• 8 photos</span>
                <span>• Easy to make</span>
                <span>• Made for giving</span>
              </div>
            </div>
          </motion.article>

          {/* Feature 3 & 4: Side by Side (Frames & Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Frames with Live Frame Swatch Interaction */}
            <motion.article
              id="frames"
              className="min-h-[280px] rounded-[12px] overflow-hidden bg-[#F5E6D7] grid grid-cols-1 sm:grid-cols-[55%_45%] items-center shadow-xs border border-[#E7D9CE] group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-7 space-y-2.5">
                <p className="uppercase tracking-[0.18em] text-[0.7rem] font-bold text-[#9A6545]">
                  YOUR FAVOURITE MOMENTS, FRAMED
                </p>
                <h2 className="font-display text-[1.85rem] font-bold text-[#35151C] leading-[1.05]">
                  Give Your Favourite Photo a Place to Stay.
                </h2>
                <p className="text-[#5E4F4B] text-[0.86rem] leading-normal">
                  Turn the photos you love into personalised frames for your desk, walls and favourite spaces.
                </p>
                <div className="pt-1">
                  <Link
                    to="/designer"
                    className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 bg-[#571126] text-white font-bold text-[0.82rem] hover:bg-[#38101D] hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
                  >
                    Create Your Frame →
                  </Link>
                </div>

                {/* 3 Animated Swatches */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSwatch('black')}
                    className="flex flex-col items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                  >
                    <div className={`w-[22px] h-[22px] rounded-full bg-[#1A1A1A] border-2 transition-all ${activeSwatch === 'black' ? 'border-[#571126] scale-110 shadow-sm' : 'border-transparent'}`} />
                    <span className={`text-[0.65rem] font-medium transition-colors ${activeSwatch === 'black' ? 'text-[#35151C] font-bold' : 'text-[#6C5B59]'}`}>Black</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSwatch('wood')}
                    className="flex flex-col items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                  >
                    <div className={`w-[22px] h-[22px] rounded-full bg-[#B88746] border-2 transition-all ${activeSwatch === 'wood' ? 'border-[#571126] scale-110 shadow-sm' : 'border-transparent'}`} />
                    <span className={`text-[0.65rem] font-medium transition-colors ${activeSwatch === 'wood' ? 'text-[#35151C] font-bold' : 'text-[#6C5B59]'}`}>Natural Wood</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSwatch('gold')}
                    className="flex flex-col items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                  >
                    <div className={`w-[22px] h-[22px] rounded-full bg-[#D4AF37] border-2 transition-all ${activeSwatch === 'gold' ? 'border-[#571126] scale-110 shadow-sm' : 'border-transparent'}`} />
                    <span className={`text-[0.65rem] font-medium transition-colors ${activeSwatch === 'gold' ? 'text-[#35151C] font-bold' : 'text-[#6C5B59]'}`}>Gold</span>
                  </button>
                </div>
              </div>
              <div className="h-full min-h-[280px] overflow-hidden">
                <img
                  src="/homepage/feature-frame.jpg"
                  alt="Family photograph in a wooden frame"
                  className="w-full h-full object-cover min-h-[280px] group-hover:scale-104 transition-transform duration-500"
                />
              </div>
            </motion.article>

            {/* Cards with Live Typing Animation Overlay */}
            <motion.article
              id="cards"
              className="min-h-[280px] rounded-[12px] overflow-hidden bg-[#F5E6D7] grid grid-cols-1 sm:grid-cols-[55%_45%] items-center shadow-xs border border-[#E7D9CE] group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="p-7 space-y-2.5">
                <p className="uppercase tracking-[0.18em] text-[0.7rem] font-bold text-[#9A6545]">
                  MADE FOR CELEBRATIONS
                </p>
                <h2 className="font-display text-[1.85rem] font-bold text-[#35151C] leading-[1.05]">
                  A Little More Personal.
                </h2>
                <p className="text-[#5E4F4B] text-[0.86rem] leading-normal">
                  Create personalised cards and Shagun Lifafas for weddings, celebrations, blessings and thoughtful gifting.
                </p>

                {/* Input with real-time feedback */}
                <div className="pt-1">
                  <label className="block text-[0.68rem] uppercase font-bold text-[#9A6545] tracking-[0.08em] mb-1">
                    Enter your name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Aarav & Diya"
                    className="w-full max-w-[210px] px-3 py-1.5 rounded-[8px] bg-white border border-[#E7D9CE] text-[0.82rem] font-semibold text-[#35151C] outline-none focus:border-[#BD8D4B] transition-colors shadow-2xs"
                  />
                </div>

                <div className="pt-1">
                  <Link
                    to={`/templates?name=${encodeURIComponent(customName)}`}
                    className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 bg-[#571126] text-white font-bold text-[0.82rem] hover:bg-[#38101D] hover:-translate-y-0.5 transition-all cursor-pointer shadow-xs"
                  >
                    Personalise Yours →
                  </Link>
                </div>
              </div>
              <div className="h-full min-h-[280px] relative overflow-hidden flex items-center justify-center">
                <img
                  src="/homepage/feature-card.jpg"
                  alt="Personalised floral envelope"
                  className="w-full h-full object-cover min-h-[280px] group-hover:scale-104 transition-transform duration-500"
                />
                {customName && (
                  <motion.div
                    key={customName}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none p-4"
                  >
                    <span className="font-display text-sm md:text-base font-bold text-[#7D5A1E] drop-shadow-xs bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-md border border-[#BD8D4B]/35 rotate-[-4deg] shadow-xs">
                      {customName}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ────────────────── 5. TRENDING CREATIONS WITH ANIMATED FILTERING ────────────────── */}
      <section id="inspiration" className="pt-10 pb-16 bg-[#FFFDF9] border-t border-[#E7D9CE]">
        <div className="w-[92%] max-w-[1180px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
            <div>
              <p className="uppercase tracking-[0.18em] text-[0.74rem] font-bold text-[#9A6545] mb-1">
                MADE TO INSPIRE
              </p>
              <h2 className="font-display text-[2rem] sm:text-[2.6rem] font-bold text-[#35151C] leading-tight">
                Trending Creations
              </h2>
              <p className="text-[#6C5B59] text-[0.86rem] mt-0.5">
                See what people are creating with their favourite moments.
              </p>
            </div>

            {/* Filter Pills with smooth selection state */}
            <div className="flex flex-wrap gap-2">
              {['all', 'frames', 'magazines', 'zines', 'cards'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setActiveFilter(k)}
                  className={`px-4 py-1.5 rounded-full text-[0.76rem] font-bold capitalize transition-all cursor-pointer relative ${
                    activeFilter === k
                      ? 'bg-[#571126] text-white shadow-xs'
                      : 'bg-white border border-[#CAB9B1] text-[#35151C] hover:border-[#571126]'
                  }`}
                >
                  {k === 'zines' ? 'Photo Zines' : k}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-5"
            layout
          >
            <AnimatePresence>
              {filteredTrending.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={item.to}
                    className="text-center group cursor-pointer block"
                  >
                    <div className="h-[120px] rounded-[10px] overflow-hidden border border-[#E7D9CE] shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-400 ease-out"
                      />
                    </div>
                    <span className="block text-[0.74rem] font-semibold text-[#55494A] mt-2 group-hover:text-[#571126] transition-colors">
                      {item.title}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ────────────────── 6. MAROON VALUE BANNER WITH FLOATING MEMORY STACK ────────────────── */}
      <section className="py-12 bg-gradient-to-r from-[#310B18] via-[#4D1122] to-[#6B172D] text-white overflow-hidden">
        <div className="w-[92%] max-w-[1180px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_0.8fr] gap-8 items-center">
            {/* Left Image Stack with Gentle Opposing Float */}
            <div className="relative h-[180px] w-[240px] mx-auto lg:mx-0">
              <motion.img
                src="/homepage/quad-frame.jpg"
                alt="Framed memory"
                className="absolute top-2.5 left-2.5 w-[150px] h-[115px] rounded-[10px] border-2 border-white/25 shadow-2xl rotate-[-6deg] object-cover"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.img
                src="/homepage/feature-frame.jpg"
                alt="Family moments"
                className="absolute bottom-2.5 right-2.5 w-[150px] h-[115px] rounded-[10px] border-2 border-white/30 shadow-2xl rotate-[5deg] object-cover"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
            </div>

            {/* Center Heading & CTA */}
            <div className="text-center lg:text-left space-y-3">
              <p className="uppercase tracking-[0.18em] text-[0.74rem] font-bold text-[#E1B993]">
                Your photos already
              </p>
              <h2 className="font-display text-[2rem] sm:text-[2.4rem] font-bold text-white leading-tight">
                Mean Something.
              </h2>
              <p className="text-[#E9CFD6] text-[0.9rem] max-w-md leading-relaxed">
                We simply help you turn them into something you can hold, gift and keep.
              </p>
              <div className="pt-1">
                <Link
                  to="/templates"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3 bg-[#FFFAF4] text-[#571126] font-bold text-[0.85rem] hover:bg-[#F3E7D8] hover:-translate-y-0.5 transition-all cursor-pointer shadow-md"
                >
                  Start Creating →
                </Link>
              </div>
            </div>

            {/* Right 3 Benefits with Micro-hover */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="flex items-center gap-3 justify-center sm:justify-start hover:translate-x-1 transition-transform cursor-default">
                <span className="text-[1.6rem] text-[#D9B071]">♡</span>
                <div>
                  <b className="block text-[0.82rem] font-bold text-white">Made Personal</b>
                  <small className="block text-[0.72rem] text-[#E9CFD6]">Your story, your way.</small>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start hover:translate-x-1 transition-transform cursor-default">
                <span className="text-[1.6rem] text-[#D9B071]">🎁</span>
                <div>
                  <b className="block text-[0.82rem] font-bold text-white">Easy to Create</b>
                  <small className="block text-[0.72rem] text-[#E9CFD6]">No design experience needed.</small>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start hover:translate-x-1 transition-transform cursor-default">
                <span className="text-[1.6rem] text-[#D9B071]">⭐</span>
                <div>
                  <b className="block text-[0.82rem] font-bold text-white">Made to Keep</b>
                  <small className="block text-[0.72rem] text-[#E9CFD6]">Thoughtfully printed for memories that last.</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 7. REAL LIFE & FAQ ────────────────── */}
      <section className="pt-8 pb-16 bg-[#FAF7F2]">
        <div className="w-[92%] max-w-[1180px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[2rem] sm:text-[2.4rem] font-bold text-[#35151C]">
              Created by You. Loved in Real Life.
            </h2>
            <Link
              to="/templates"
              className="text-[0.76rem] font-bold text-[#571126] hover:underline px-4 py-1.5 rounded-full border border-[#CAB9B1] bg-white hover:-translate-y-0.5 transition-all"
            >
              View More →
            </Link>
          </div>

          {/* 6 Real Life Photos Row with Hover Lift */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {REAL_CREATION_ITEMS.map((item) => (
              <div
                key={item.id}
                className="h-[120px] rounded-[10px] overflow-hidden border border-[#E7D9CE] shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white group cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-400"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
            {/* Guides */}
            <div>
              <p className="uppercase tracking-[0.18em] text-[0.74rem] font-bold text-[#9A6545] mb-1">
                IDEAS & INSPIRATION
              </p>
              <h2 className="font-display text-[2rem] font-bold text-[#35151C] mb-3">
                Make More With Your Memories.
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <article className="bg-white border border-[#E7D9CE] rounded-[12px] p-4 min-h-[125px] flex flex-col justify-between hover:border-[#BD8D4B] hover:shadow-md transition-all">
                  <b className="text-[0.82rem] text-[#35151C] leading-[1.35]">
                    How to Create Your Own Personalised Magazine
                  </b>
                  <Link
                    to="/magazine-maker"
                    className="text-[0.74rem] font-bold text-[#571126] hover:underline mt-4"
                  >
                    Read Guide →
                  </Link>
                </article>

                <article className="bg-white border border-[#E7D9CE] rounded-[12px] p-4 min-h-[125px] flex flex-col justify-between hover:border-[#BD8D4B] hover:shadow-md transition-all">
                  <b className="text-[0.82rem] text-[#35151C] leading-[1.35]">
                    8 Photos That Make a Perfect Photo Zine
                  </b>
                  <Link
                    to="/photo-zine-maker"
                    className="text-[0.74rem] font-bold text-[#571126] hover:underline mt-4"
                  >
                    Read Guide →
                  </Link>
                </article>

                <article className="bg-white border border-[#E7D9CE] rounded-[12px] p-4 min-h-[125px] flex flex-col justify-between hover:border-[#BD8D4B] hover:shadow-md transition-all">
                  <b className="text-[0.82rem] text-[#35151C] leading-[1.35]">
                    How to Choose the Right Frame for Your Photo
                  </b>
                  <Link
                    to="/how-to-choose-a-shagun-cover"
                    className="text-[0.74rem] font-bold text-[#571126] hover:underline mt-4"
                  >
                    Read Guide →
                  </Link>
                </article>
              </div>
            </div>

            {/* FAQ Accordion with Smooth Animated Collapse */}
            <div>
              <h2 className="font-display text-[2rem] font-bold text-[#35151C] mb-4">
                Frequently Asked Questions
              </h2>

              <div className="space-y-1">
                {FAQ_ITEMS.map((item, idx) => (
                  <div
                    key={item.q}
                    className="border-b border-[#E7D9CE] py-3"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left text-[0.85rem] font-semibold text-[#35151C] hover:text-[#571126] cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <motion.span
                        animate={{ rotate: openFaq === idx ? 180 : 0 }}
                        className="font-bold text-[1.1rem] text-[#571126]"
                      >
                        {openFaq === idx ? '−' : '+'}
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === idx && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="text-[0.8rem] text-[#6C5B59] mt-2 leading-relaxed">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── 8. FINAL CALL TO ACTION ────────────────── */}
      <section className="py-[38px] bg-[#F5E7D8] border-t border-[#E7D9CE]">
        <div className="w-[92%] max-w-[1180px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div>
              <p className="uppercase tracking-[0.18em] text-[0.7rem] font-bold text-[#9A6545] mb-1">
                YOUR PHOTOS ARE READY.
              </p>
              <h2 className="font-display text-[1.8rem] font-bold text-[#35151C]">
                What Will You Make With Them?
              </h2>
              <p className="text-[0.82rem] text-[#6C5B59] mt-1 font-medium">
                Frames &nbsp;·&nbsp; Magazines &nbsp;·&nbsp; Photo Zines &nbsp;·&nbsp; Cards & Lifafas
              </p>
            </div>
            <Link
              to="/templates"
              onClick={() => logUserEvent('CLICK_FINAL_CTA_START_CREATING')}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 bg-[#571126] text-white font-bold text-[0.85rem] hover:bg-[#38101D] transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-xl cursor-pointer"
            >
              Start Creating →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
