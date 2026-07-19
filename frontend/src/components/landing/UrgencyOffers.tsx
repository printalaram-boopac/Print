import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Timer } from 'lucide-react';

function useCountdown() {
  const [time, setTime] = useState({ hours: 18, minutes: 0, seconds: 0 });

  useEffect(() => {
    const endTime = Date.now() + 18 * 60 * 60 * 1000;
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      setTime({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function UrgencyOffers() {
  const { hours, minutes, seconds } = useCountdown();

  return (
    <>
      {/* ─── Urgency Banner ─── */}
      <section className="py-16 md:py-20 px-4 bg-luxury-dark/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-card-gold rounded-xl p-8 md:p-12 text-center space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Timer className="w-8 h-8 mx-auto text-luxury-gold" strokeWidth={1.75} />
            <h2 className="text-2xl md:text-4xl font-display font-bold leading-tight">
              Wedding Next Week? <span className="text-gold-gradient block sm:inline">Get Priority Printing</span>
            </h2>
            <p className="text-gray-500 text-sm">Need before Sunday's wedding? Order within the countdown for fast dispatch</p>

            {/* Countdown */}
            <div className="flex justify-center gap-3 md:gap-4 pt-2">
              <div className="countdown-box rounded-lg">
                <div className="countdown-number">{String(hours).padStart(2, '0')}</div>
                <div className="countdown-label">Hours</div>
              </div>
              <div className="countdown-box rounded-lg">
                <div className="countdown-number">{String(minutes).padStart(2, '0')}</div>
                <div className="countdown-label">Minutes</div>
              </div>
              <div className="countdown-box rounded-lg">
                <div className="countdown-number">{String(seconds).padStart(2, '0')}</div>
                <div className="countdown-label">Seconds</div>
              </div>
            </div>

            <Link to="/designer" className="btn-glass btn-glass-gold">
              <Zap className="w-3.5 h-3.5" strokeWidth={2} /> Order Express Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Offers Grid ─── */}
      {/* <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge-underline"><Gift className="w-3.5 h-3.5" strokeWidth={2} /> Limited Offers</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Special <span className="text-gold-gradient">Deals</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {OFFERS.map((offer, i) => (
              <motion.div
                key={offer.title}
                className="glass-card p-5 rounded-lg text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-2xl block">{offer.icon}</span>
                <h3 className="text-sm font-bold text-luxury-gold">{offer.title}</h3>
                <p className="text-xs text-gray-500">{offer.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
    </>
  );
}
