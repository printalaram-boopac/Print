import { Truck, ShieldCheck, Palette, Headphones } from 'lucide-react';

const TRUST_POINTS = [
  {
    icon: Truck,
    title: 'Free Shipping',
    subtitle: 'On all orders over ₹599',
  },
  {
    icon: ShieldCheck,
    title: '100% Secure Payment',
    subtitle: 'Safe & trusted checkout',
  },
  {
    icon: Palette,
    title: 'Easy Customization',
    subtitle: 'Design in just a few clicks',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    subtitle: "We're here to help",
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-[#2D1527] text-white py-5 px-4 border-y border-gold-400/20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-center">
        {TRUST_POINTS.map((item, i) => (
          <div key={i} className="flex items-center gap-3.5 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-gold-300">
              <item.icon className="w-5 h-5 text-[#E5CD86]" strokeWidth={1.75} />
            </div>
            <div className="text-left">
              <h4 className="text-xs md:text-sm font-semibold tracking-wide text-white leading-snug">
                {item.title}
              </h4>
              <p className="text-[11px] text-gray-300/80 leading-tight mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
