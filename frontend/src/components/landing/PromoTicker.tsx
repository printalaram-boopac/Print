import { TICKER_ITEMS } from '@/data/landing';

function TickerContent() {
  return (
    <>
      {TICKER_ITEMS.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-2 px-6 text-[11px] md:text-xs font-bold uppercase tracking-widest text-[#F6E8B1]"
        >
          <span className="text-luxury-gold">{item.icon}</span>
          {item.text}
        </span>
      ))}
    </>
  );
}

export default function PromoTicker() {
  return (
    <div className="promo-ticker py-3">
      <div className="promo-ticker-track">
        <TickerContent />
        <TickerContent />
      </div>
    </div>
  );
}
