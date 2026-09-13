import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Priya Sharma',
    category: 'Wedding Invitation',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    quote: 'The quality and design exceeded our expectations!',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    category: 'Photo Book',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    quote: 'Beautiful print quality and fast delivery.',
    rating: 5,
  },
  {
    name: 'Anjali Desai',
    category: 'Shagun Lifafa',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    quote: 'Elegant designs and premium finish.',
    rating: 5,
  },
  {
    name: 'Karan Patel',
    category: 'Magazine',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    quote: 'Truly professional and creative work!',
    rating: 5,
  },
];

export default function ReviewsGrid() {
  return (
    <section className="py-20 md:py-28 px-4 bg-[#F7F2EA] border-t border-[#EADCC9]/50 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6D7E]">
            LOVED BY THOUSANDS
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#2D1527]">
            Real stories from real customers
          </h2>
        </div>

        {/* Carousel Container with Arrows */}
        <div className="relative">
          {/* Left Arrow Button */}
          <button
            type="button"
            aria-label="Previous review"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#D5C2B1] shadow-md items-center justify-center text-[#2D1527] hover:bg-[#2D1527] hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            aria-label="Next review"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#D5C2B1] shadow-md items-center justify-center text-[#2D1527] hover:bg-[#2D1527] hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((rev, idx) => (
              <motion.div
                key={rev.name}
                className="rounded-2xl p-6 bg-white border border-[#EDE2D5] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <div>
                  {/* User Profile */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#E5CD86] shadow-sm flex-shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#2D1527]">
                        {rev.name}
                      </h4>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {rev.category}
                      </span>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs md:text-sm text-gray-700 italic leading-relaxed mb-4">
                    "{rev.quote}"
                  </p>
                </div>

                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#E5A93C] pt-2 border-t border-gray-100">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#E5A93C]" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
