import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Gift } from 'lucide-react';
import { logUserEvent } from '@/lib/analytics';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.warn('Please enter a valid email address.');
      return;
    }
    logUserEvent('SUBMIT_NEWSLETTER_DISCOUNT', { email });
    toast.success('Thank you! Your 10% discount code has been sent to your email.');
    setEmail('');
  };

  return (
    <section className="py-10 md:py-14 px-4 bg-[#FCFAF7]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="rounded-3xl bg-[#2D1527] text-white p-8 md:p-12 relative overflow-hidden shadow-2xl border border-gold-400/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Text & Info */}
            <div className="lg:col-span-5 space-y-2 text-left">
              <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white leading-tight">
                GET 10 % OFF <span className="text-[#E5CD86] font-normal italic">ON YOUR FIRST ORDER!</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-300/80 max-w-md">
                Join our community and get exclusive designs, offers & inspiration.
              </p>
            </div>

            {/* Middle: Email Form */}
            <div className="lg:col-span-4">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-full bg-white text-gray-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C] placeholder:text-gray-400 shadow-inner"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#C89B3C] hover:bg-[#b58b32] text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer flex-shrink-0"
                >
                  Get My Discount
                </button>
              </form>
            </div>

            {/* Right: 3D Gift Box Graphic with Golden Confetti */}
            <div className="lg:col-span-3 flex justify-center lg:justify-end">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                {/* 3D Box Illustration */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#4A263C] to-[#1E0D1B] border-2 border-[#E5CD86] shadow-2xl rotate-12 relative flex items-center justify-center group hover:rotate-6 transition-transform duration-500">
                  {/* Ribbon */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3.5 bg-gradient-to-r from-[#E5CD86] via-[#FDF3D0] to-[#C89B3C] shadow-sm" />
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3.5 bg-gradient-to-b from-[#E5CD86] via-[#FDF3D0] to-[#C89B3C] shadow-sm" />
                  <div className="absolute -top-3 -right-1 w-8 h-8 rounded-full bg-[#C89B3C] border-2 border-white flex items-center justify-center text-white shadow-lg">
                    <Gift className="w-4 h-4" />
                  </div>
                </div>

                {/* Confetti sparkle particles */}
                <div className="absolute -top-2 left-2 text-[#E5CD86] text-xs">✦</div>
                <div className="absolute bottom-1 right-2 text-[#E5CD86] text-base">✦</div>
                <div className="absolute -bottom-2 left-6 text-[#E5CD86] text-sm">✦</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
