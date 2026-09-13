import { ShieldCheck, Palette, Truck, HeartHandshake } from 'lucide-react';

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: 'Premium Quality',
    desc: 'Only the best materials',
  },
  {
    icon: Palette,
    title: 'Custom Designs',
    desc: 'Make it uniquely yours',
  },
  {
    icon: Truck,
    title: 'Fast & Reliable',
    desc: 'On-time delivery always',
  },
  {
    icon: HeartHandshake,
    title: 'Satisfaction Guaranteed',
    desc: 'We care about you',
  },
];

export default function GuaranteesBar() {
  return (
    <section className="py-8 px-4 bg-white border-y border-[#EADCC9]/50">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-center">
        {GUARANTEES.map((item, i) => (
          <div key={i} className="flex items-center gap-3.5 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#F8F4EE] border border-[#EDE2D5] flex items-center justify-center flex-shrink-0 text-[#2D1527]">
              <item.icon className="w-5 h-5 text-[#2D1527]" strokeWidth={1.75} />
            </div>
            <div className="text-left">
              <h4 className="text-xs md:text-sm font-bold text-[#2D1527] leading-snug">
                {item.title}
              </h4>
              <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
