import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Sparkles } from 'lucide-react';
import { asset } from '@/lib/asset';

interface FreeAcrylicOfferPopupProps {
  isOpen: boolean;
  quantity: number;
  onAccept: () => void;
  onDecline: () => void;
}

export default function FreeAcrylicOfferPopup({
  isOpen,
  quantity,
  onAccept,
  onDecline,
}: FreeAcrylicOfferPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDecline}
          />

          {/* Floating Sparkle Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-luxury-gold"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  fontSize: `${10 + Math.random() * 14}px`,
                }}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  y: [20, -30, -60],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeOut',
                }}
              >
                ✦
              </motion.div>
            ))}
          </div>

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Close Button */}
            <button
              onClick={onDecline}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-black/40 transition-all cursor-pointer"
              aria-label="Close offer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Gold Gradient Header Banner */}
            <div
              className="relative px-6 pt-6 pb-4 text-center"
              style={{
                background: 'linear-gradient(135deg, #3D1E30 0%, #5A2D45 40%, #3D1E30 100%)',
              }}
            >
              {/* Animated Gift Icon */}
              <motion.div
                className="mx-auto mb-3 w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #C5A059, #F6E8B1, #C5A059)',
                }}
                animate={{ rotate: [0, -8, 8, -5, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut',
                }}
              >
                <Gift className="w-7 h-7 text-[#3D1E30]" strokeWidth={2} />
              </motion.div>

              <motion.h2
                className="text-2xl font-display font-bold text-white mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                🎁 FREE Gift Unlocked!
              </motion.h2>
              <motion.p
                className="text-sm text-gold-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Your {quantity} pcs order qualifies for a special gift
              </motion.p>
            </div>

            {/* Body */}
            <div
              className="px-6 py-5 space-y-5"
              style={{
                background: 'linear-gradient(180deg, #FAF7F0 0%, #FFFFFF 100%)',
              }}
            >
              {/* Product Showcase */}
              <motion.div
                className="flex items-center gap-4 p-4 rounded-xl border border-gold-200/40"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,247,240,0.95))',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-luxury-gold/30 shadow-md">
                  <img
                    src={asset('acrylic_money_cover.png')}
                    alt="Free Acrylic Money Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">
                      Premium Gift
                    </span>
                  </div>
                  <h3 className="text-sm font-display font-bold text-luxury-accent leading-tight">
                    Acrylic Money Frame
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Worth{' '}
                    <span className="line-through text-gray-400">₹200</span>{' '}
                    <span className="font-bold text-green-600">FREE</span>
                  </p>
                </div>
              </motion.div>

              {/* Offer Description */}
              <motion.p
                className="text-center text-sm text-gray-600 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                Get a <strong className="text-luxury-accent">Premium Acrylic Money Frame</strong> absolutely
                FREE with your order of{' '}
                <strong className="text-luxury-accent">{quantity} covers</strong>! 🎉
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="space-y-2.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <button
                  onClick={onAccept}
                  className="w-full py-3.5 rounded-full font-semibold text-sm tracking-wide text-white transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    background: 'linear-gradient(135deg, #2E7D32, #43A047)',
                    boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
                  }}
                >
                  Yes, Add My Free Gift! 🎁
                </button>
                <button
                  onClick={onDecline}
                  className="w-full py-3 rounded-full font-medium text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  No thanks, continue without gift
                </button>
              </motion.div>

              {/* Trust Badge */}
              <motion.p
                className="text-center text-[10px] text-gray-400 uppercase tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
              >
                ✦ Limited time offer · While stocks last ✦
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
