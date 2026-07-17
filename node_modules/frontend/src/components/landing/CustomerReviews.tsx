import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { REVIEWS } from '@/data/landing';

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-sm">★</span>
      ))}
    </div>
  );
}

// Extended reviews with more data for the 3D slider
const ALL_REVIEWS = [
  ...REVIEWS,
  {
    name: 'Aman Gupta',
    location: 'Delhi',
    rating: 5,
    text: 'Ordered 500 covers for a corporate Wedding event. Superb quality, everyone was impressed!',
    occasion: 'Wedding',
    image: '/card-5.jpeg',
  },
  {
    name: 'Meera Joshi',
    location: 'Pune',
    rating: 5,
    text: 'The lotus design was absolutely gorgeous. Perfect for our traditional Gujarati wedding.',
    occasion: 'Wedding',
    image: '/card-2.jpeg',
  },
];

export default function CustomerReviews() {
  const [active, setActive] = useState(0);
  const total = ALL_REVIEWS.length;

  const next = useCallback(() => setActive((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setActive((p) => (p - 1 + total) % total), [total]);

  // Auto-play
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  // Position helper: returns offset from active
  const getOffset = (index: number) => {
    let diff = index - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section className="py-20 md:py-28 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-badge">💬 Real Customers</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Loved by <span className="text-gold-gradient">Thousands</span>
          </h2>
        </motion.div>

        {/* ─── 3D Carousel ─── */}
        <div className="relative h-[420px] md:h-[460px] flex items-center justify-center perspective-container">
          {ALL_REVIEWS.map((review, i) => {
            const offset = getOffset(i);
            const isActive = offset === 0;
            const absOffset = Math.abs(offset);

            // Only render the visible cards (active ± 2)
            if (absOffset > 2) return null;

            return (
              <motion.div
                key={`${review.name}-${i}`}
                className="absolute w-[300px] md:w-[360px] cursor-pointer"
                animate={{
                  x: offset * 280,
                  z: -absOffset * 120,
                  scale: isActive ? 1 : 0.85 - absOffset * 0.05,
                  opacity: isActive ? 1 : 0.5 - absOffset * 0.15,
                  rotateY: offset * -8,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                onClick={() => setActive(i)}
                style={{
                  zIndex: 10 - absOffset,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className={`review-card rounded-xl overflow-hidden transition-all duration-500 ${
                    isActive ? 'border-luxury-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.08)]' : ''
                  }`}
                >
                  {/* Review photo */}
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={review.image}
                      alt={`Review by ${review.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Occasion badge on image */}
                    <div className="absolute top-3 right-3">
                      <span className="offer-badge rounded-sm text-[9px]">{review.occasion}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3 bg-luxury-dark/80">
                    <StarRating count={review.rating} />
                    <p className="text-sm text-gray-600 leading-relaxed italic line-clamp-3">
                      "{review.text}"
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <p className="text-sm font-semibold text-luxury-accent">— {review.name}</p>
                        <p className="text-[11px] text-gray-500">{review.location}</p>
                      </div>
                      <p className="text-[10px] text-green-600 font-medium">✓ Delivered in 3 days</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Slider Controls ─── */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-gold-300 text-luxury-gold flex items-center justify-center hover:bg-gold-50 transition-all cursor-pointer"
            aria-label="Previous review"
          >
            ←
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {ALL_REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === active ? 'w-6 bg-luxury-gold' : 'w-2 bg-gold-200'
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-gold-300 text-luxury-gold flex items-center justify-center hover:bg-gold-50 transition-all cursor-pointer"
            aria-label="Next review"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
