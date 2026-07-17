import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CustomDesignModal from '@/components/CustomDesignModal';

const ALL_TEMPLATES = [
  { id: 1, src: '/card-1.jpeg', title: 'Royal Peacock Green', category: 'Wedding', price: 15 },
  { id: 2, src: '/card-2.jpeg', title: 'Lotus Pink Elegance', category: 'Wedding', price: 15 },
  { id: 3, src: '/card-3.jpeg', title: 'Rajasthani Palace Rose', category: 'Wedding', price: 18 },
  { id: 4, src: '/card-4.jpeg', title: 'Royal Swan Gold', category: 'Wedding', price: 18 },
  { id: 5, src: '/card-5.jpeg', title: 'Golden Floral Crest', category: 'Wedding', price: 15 },
  { id: 6, src: '/card-6.jpeg', title: 'Emerald Palace Arch', category: 'Wedding', price: 15 },
  { id: 7, src: '/card-7.jpeg', title: 'Royal Elephant Ivory', category: 'Wedding', price: 18 },
  { id: 8, src: '/card-8.jpeg', title: 'Maharani Velvet Plum', category: 'Wedding', price: 18 },
  { id: 9, src: '/card-9.jpeg', title: 'Shubh Vivah Vermillion', category: 'Wedding', price: 15 },
  { id: 10, src: '/card-10.jpeg', title: 'Golden Pichwai Art', category: 'Wedding', price: 15 },
  { id: 11, src: '/card-11.jpeg', title: 'Marigold Mandap Yellow', category: 'Wedding', price: 15 },
  { id: 12, src: '/card-12.jpeg', title: 'Darbar Ivory Gold', category: 'Wedding', price: 18 },
  { id: 13, src: '/card-13.jpeg', title: 'Heritage Paisley Red', category: 'Wedding', price: 15 },
  { id: 14, src: '/card-14.jpeg', title: 'Regal Shehnai Motif', category: 'Wedding', price: 15 },
  { id: 15, src: '/card-15.jpeg', title: 'Mughal Jaali Mint', category: 'Wedding', price: 15 },
  { id: 16, src: '/card-16.jpeg', title: 'Royal Kalash Crimson', category: 'Wedding', price: 15 },
  { id: 17, src: '/card-17.jpeg', title: 'Vibrant Bandhani Pink', category: 'Wedding', price: 15 },
  { id: 18, src: '/card-18.jpeg', title: 'Golden Swastik Blessings', category: 'Wedding', price: 15 },
  { id: 19, src: '/card-19.jpeg', title: 'Monarch Peacock Blue', category: 'Wedding', price: 18 },
  { id: 20, src: '/card-20.jpeg', title: 'Divine Ganesha Gold', category: 'Wedding', price: 18 },
  { id: 21, src: '/card-21.jpeg', title: 'Classic Zardozi Border', category: 'Wedding', price: 15 },
  { id: 22, src: '/card-22.jpeg', title: 'Golden Mandap Arch', category: 'Wedding', price: 15 },
];

export default function Templates() {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const filtered = ALL_TEMPLATES;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="section-badge">🎨 Premium Collection</span>
          <h1 className="text-3xl md:text-5xl font-display font-bold">
            All <span className="text-gold-gradient">Designs</span>
          </h1>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="design-card rounded-lg"
            >
              <div className="aspect-square overflow-hidden bg-luxury-dark">
                <img src={t.src} alt={t.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="design-card-overlay">
                <p className="text-[10px] text-luxury-gold uppercase tracking-widest mb-1">{t.category}</p>
                <h3 className="text-sm font-display font-semibold text-white">{t.title}</h3>
                <p className="text-xs text-gray-200 mt-1">From ₹12/piece</p>
                <Link
                  to={`/designer?template=${t.id}`}
                  className="inline-block mt-3 px-5 py-2 bg-luxury-gold text-luxury-accent text-[10px] font-bold tracking-wider hover:bg-gold-400 transition-colors"
                >
                  CUSTOMIZE NOW
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Design Request Section */}
        <motion.div
          className="glass-card-gold p-6 md:p-8 rounded-xl text-center space-y-4 max-w-2xl mx-auto mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-lg md:text-xl font-display font-semibold text-luxury-accent">Looking for something completely unique?</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Work with our master wedding cover artists to design custom bespoke Shagun Lifafas matching your invite templates, color themes, or specific imagery.
          </p>
          <button
            onClick={() => setIsCustomOpen(true)}
            className="px-6 py-3 bg-luxury-accent text-white font-bold tracking-wider text-xs uppercase gold-glow hover:bg-luxury-accent/90 transition-colors cursor-pointer rounded-full"
          >
            ✨ I want to customize a Shagun Lifafa
          </button>
        </motion.div>
      </div>

      <CustomDesignModal isOpen={isCustomOpen} onClose={() => setIsCustomOpen(false)} />
    </div>
  );
}
