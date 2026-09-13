import { motion } from 'framer-motion';
import { FileText, SlidersHorizontal, PackageCheck } from 'lucide-react';
import { asset } from '@/lib/asset';

const STEPS = [
  {
    step: 1,
    title: 'Choose Product',
    desc: 'Pick from invitations, magazines, photo books, or Shagun lifafas.',
    icon: FileText,
  },
  {
    step: 2,
    title: 'Personalize Online',
    desc: 'Add your photos, heartfelt text & custom story in real-time.',
    icon: SlidersHorizontal,
  },
  {
    step: 3,
    title: 'Delivered to Doorstep',
    desc: 'We print on luxury materials & deliver safely pan-India.',
    icon: PackageCheck,
  },
];

export default function HowItWorksSteps() {
  return (
    <section className="py-20 md:py-28 px-4 bg-[#F7F2EA] relative overflow-hidden border-t border-[#EADCC9]/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Side: Headline & Steps Timeline */}
        <div className="lg:col-span-8 space-y-10">
          <motion.div
            className="space-y-2 text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6D7E]">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[#2D1527] leading-tight">
              Create Something <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#C89B3C]">Amazing</span> in 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md">
              Whether ordering 1 keepsake magazine or 500 wedding invitations, our seamless process makes creating effortless.
            </p>
          </motion.div>

          {/* 3 Step Nodes Connected by Dotted Line */}
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 pt-4">
            {/* Horizontal connecting line (hidden on mobile) */}
            <div className="hidden sm:block absolute top-[28px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-[#C89B3C]/50 z-0" />

            {STEPS.map((s, idx) => (
              <motion.div
                key={s.step}
                className="relative z-10 flex flex-col items-center sm:items-center text-center space-y-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
              >
                {/* Number Badge with Outer Halo */}
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-[#C89B3C] shadow-md flex items-center justify-center text-[#C89B3C]">
                    <s.icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C89B3C] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {s.step}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-display font-bold text-[#2D1527]">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed max-w-[210px]">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Packaging & Finished Keepsakes Visual */}
        <div className="lg:col-span-4 flex justify-center items-center">
          <motion.div
            className="relative w-full max-w-sm rounded-3xl p-4 bg-white/80 border border-[#E8DCB8]/70 shadow-xl overflow-hidden group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F0ECE2] flex items-center justify-center p-2 relative">
              <img
                src={asset('card-28.jpg')}
                alt="PrintAlarm Premium Delivery Packaging"
                className="w-full h-full object-cover rounded-xl shadow-inner group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5CD86] block">
                  Delivered With Care
                </span>
                <p className="text-xs font-semibold drop-shadow-sm">
                  Personalized keepsakes packed in luxury presentation boxes
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
