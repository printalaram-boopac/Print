import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { asset } from '@/lib/asset';
import { logUserEvent } from '@/lib/analytics';

export default function GuidesPreview() {
  return (
    <section className="py-20 md:py-28 px-4 bg-[#FAF7F2] relative overflow-hidden">
      {/* Decorative Floral Background Watermark */}
      <div className="absolute right-0 bottom-0 w-80 h-80 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#2D1527]">
          <path d="M100 20C60 20 20 60 20 100C20 140 60 180 100 180C140 180 180 140 180 100C180 60 140 20 100 20Z" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="25" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Side: Fan of 3 Editorial Book / Magazine Covers */}
        <div className="lg:col-span-6 flex justify-center items-center">
          <motion.div
            className="relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Left Cover: Photo Book Guide (Tilted -12deg) */}
            <div
              className="absolute left-4 w-[160px] sm:w-[190px] aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-xl border border-[#EADCC9] transition-transform duration-500 hover:-translate-y-2 hover:rotate-[-8deg] cursor-pointer"
              style={{ transform: 'rotate(-12deg)', zIndex: 10 }}
            >
              <img
                src={asset('004.jpg')}
                alt="Photo Book & Memory Album Guide"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute bottom-2 left-2 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-white">
                Photo Book Guide
              </span>
            </div>

            {/* Center Cover: Wedding Invitation Guide (Featured, Straight) */}
            <div
              className="absolute w-[180px] sm:w-[210px] aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-2xl border-2 border-[#E5CD86] transition-transform duration-500 hover:-translate-y-3 cursor-pointer"
              style={{ zIndex: 20 }}
            >
              <div className="w-full h-full relative bg-[#FDFBF7] p-3 flex flex-col justify-between text-center">
                <div className="space-y-1 pt-2">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#C89B3C] font-bold block">
                    THE ULTIMATE GUIDE
                  </span>
                  <h4 className="text-xs sm:text-sm font-display font-bold text-[#2D1527] leading-tight">
                    Wedding Invitations & Keepsakes
                  </h4>
                </div>
                <div className="rounded-lg overflow-hidden my-2 flex-1">
                  <img
                    src={asset('card-4.jpeg')}
                    alt="Wedding Guide"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <span className="text-[8px] text-gray-400 font-semibold">PrintAlarm Editorial</span>
              </div>
            </div>

            {/* Right Cover: Magazine Keepsake Guide (Tilted +12deg) */}
            <div
              className="absolute right-4 w-[160px] sm:w-[190px] aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-xl border border-[#EADCC9] transition-transform duration-500 hover:-translate-y-2 hover:rotate-[8deg] cursor-pointer"
              style={{ transform: 'rotate(12deg)', zIndex: 10 }}
            >
              <img
                src={asset('003.jpg')}
                alt="Magazine Keepsake Guide"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute bottom-2 left-2 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-white">
                Magazine Guide
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Copy & CTA */}
        <motion.div
          className="lg:col-span-6 space-y-5 text-left"
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6D7E]">
            TIPS & GUIDES
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-[#2D1527] leading-tight">
            Guides to Make Every <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#C89B3C]">Moment Special</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-lg leading-relaxed">
            Explore ideas, trends & expert tips to create the perfect personalized keepsakes, Shagun amount etiquette, and design inspirations.
          </p>

          <div className="pt-2">
            <Link
              to="/blog"
              onClick={() => logUserEvent('CLICK_EXPLORE_GUIDES')}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#2D1527] hover:bg-[#431F3B] text-white text-xs sm:text-sm font-semibold transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              Explore Guides
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
