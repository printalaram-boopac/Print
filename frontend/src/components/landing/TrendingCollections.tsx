import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { asset } from '@/lib/asset';
import { logUserEvent } from '@/lib/analytics';

const TRENDING_ITEMS = [
  {
    id: 'royal-wedding-invite',
    title: 'Royal Wedding Invite',
    price: '₹79',
    rating: '4.8',
    badge: 'BEST SELLER',
    image: asset('card-4.jpeg'),
    link: '/templates?category=wedding',
  },
  {
    id: 'floral-magazine',
    title: 'Floral Magazine',
    price: '₹249',
    rating: '4.9',
    image: asset('003.jpg'),
    link: '/magazine-maker',
  },
  {
    id: 'traditional-shagun-lifafa',
    title: 'Traditional Shagun Lifafa',
    price: '₹39',
    rating: '4.8',
    image: asset('card-1.jpeg'),
    link: '/templates',
  },
  {
    id: 'couple-photo-book',
    title: 'Couple Photo Book',
    price: '₹349',
    rating: '4.9',
    image: asset('002.jpg'),
    link: '/photo-zine-maker',
  },
  {
    id: 'thank-you-card',
    title: 'Thank You Card',
    price: '₹29',
    rating: '4.8',
    image: asset('card-2.jpeg'),
    link: '/templates',
  },
  {
    id: 'baby-shower-invite',
    title: 'Baby Shower Invite',
    price: '₹69',
    rating: '4.7',
    image: asset('card-5.jpeg'),
    link: '/templates',
  },
];

export default function TrendingCollections() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 md:py-28 px-4 bg-[#FCFAF7]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EADCC9]/60 pb-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6D7E]">
              TRENDING DESIGNS
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2D1527]">
              Trending Collections
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              Explore our best-selling and trending personalized designs
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Arrows */}
            <div className="flex items-center gap-1.5 mr-2">
              <button
                type="button"
                onClick={scrollLeft}
                aria-label="Previous designs"
                className="w-8 h-8 rounded-full border border-[#D5C2B1] bg-white flex items-center justify-center text-[#2D1527] hover:bg-[#2D1527] hover:text-white transition-colors cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                aria-label="Next designs"
                className="w-8 h-8 rounded-full border border-[#D5C2B1] bg-white flex items-center justify-center text-[#2D1527] hover:bg-[#2D1527] hover:text-white transition-colors cursor-pointer shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              to="/templates"
              onClick={() => logUserEvent('CLICK_VIEW_ALL_DESIGNS')}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-[#D5C2B1] bg-white text-xs font-semibold text-[#2D1527] hover:border-[#2D1527] hover:bg-[#2D1527] hover:text-white transition-all shadow-sm cursor-pointer"
            >
              View All Designs
            </Link>
          </div>
        </div>

        {/* 6 Products Grid */}
        <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth">
          {TRENDING_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
            >
              <Link
                to={item.link}
                onClick={() => logUserEvent('CLICK_TRENDING_ITEM', { item: item.id })}
                className="group flex flex-col justify-between p-3.5 rounded-2xl bg-white border border-[#EFE8DF] hover:border-[#C89B3C] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer relative"
              >
                {/* Best Seller Badge */}
                {item.badge && (
                  <span className="absolute top-3 left-3 z-10 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C89B3C] text-white shadow-sm">
                    {item.badge}
                  </span>
                )}

                {/* Image */}
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#FBF9F6] p-2 flex items-center justify-center mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-[#2D1527] group-hover:text-[#C89B3C] transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                    <span className="font-bold text-[#2D1527]">{item.price}</span>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                      <Star className="w-3 h-3 text-[#E5A93C] fill-[#E5A93C]" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
