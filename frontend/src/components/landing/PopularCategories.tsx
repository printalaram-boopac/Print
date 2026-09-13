import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { asset } from '@/lib/asset';
import { logUserEvent } from '@/lib/analytics';
import ThreeDCardTilt from '@/components/3d/ThreeDCardTilt';

const CATEGORIES = [
  {
    id: 'wedding-invitations',
    title: 'Wedding Invitations',
    startingPrice: 'Starting at ₹49',
    image: asset('card-4.jpeg'),
    link: '/templates?category=wedding',
  },
  {
    id: 'magazines',
    title: 'Magazines',
    startingPrice: 'Starting at ₹199',
    image: asset('card-22.jpeg'),
    link: '/magazine-maker',
  },
  {
    id: 'photo-books',
    title: 'Photo Books',
    startingPrice: 'Starting at ₹299',
    image: asset('002.jpg'),
    link: '/photo-zine-maker',
  },
  {
    id: 'shagun-lifafa',
    title: 'Shagun Lifafa',
    startingPrice: 'Starting at ₹29',
    image: asset('card-1.jpeg'),
    link: '/templates',
  },
  {
    id: 'gift-boxes',
    title: 'Gift Boxes',
    startingPrice: 'Starting at ₹149',
    image: asset('card-28.jpg'),
    link: '/templates',
  },
  {
    id: 'thank-you-cards',
    title: 'Thank You Cards',
    startingPrice: 'Starting at ₹29',
    image: asset('card-2.jpeg'),
    link: '/templates',
  },
];

export default function PopularCategories() {
  return (
    <section className="py-16 md:py-24 px-4 bg-[#FCFAF7]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EADCC9]/60 pb-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6D7E]">
              SHOP BY CATEGORY
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2D1527]">
              Popular Categories
            </h2>
          </div>
          <Link
            to="/templates"
            onClick={() => logUserEvent('CLICK_VIEW_ALL_PRODUCTS')}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-[#D5C2B1] bg-white text-xs font-semibold text-[#2D1527] hover:border-[#2D1527] hover:bg-[#2D1527] hover:text-white transition-all shadow-sm cursor-pointer self-start sm:self-auto"
          >
            View All Products
          </Link>
        </div>

        {/* Categories Grid with 3D Physics Tilt on hover */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
            >
              <ThreeDCardTilt maxTilt={14} depth={25} className="h-full">
                <Link
                  to={cat.link}
                  onClick={() => logUserEvent('CLICK_CATEGORY_CARD', { category: cat.id })}
                  className="group flex flex-col items-center text-center p-4 rounded-2xl bg-[#F8F4EE] border border-[#EDE2D5] hover:border-[#C89B3C] shadow-sm hover:shadow-xl transition-all duration-300 h-full cursor-pointer relative overflow-hidden"
                >
                  {/* Product Mockup Image with 3D Elevation */}
                  <div
                    className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white/70 mb-4 p-2 flex items-center justify-center"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xs md:text-sm font-semibold text-[#2D1527] group-hover:text-[#C89B3C] transition-colors line-clamp-1"
                    style={{ transform: 'translateZ(15px)' }}
                  >
                    {cat.title}
                  </h3>

                  {/* Price */}
                  <div
                    className="mt-1 flex items-center gap-0.5 text-[11px] text-gray-500 font-medium"
                    style={{ transform: 'translateZ(10px)' }}
                  >
                    <span>{cat.startingPrice}</span>
                    <ChevronRight className="w-3 h-3 text-[#C89B3C] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </ThreeDCardTilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
