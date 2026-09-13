import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calculator, Gift, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { logUserEvent } from '@/lib/analytics';
import ThreeDCardTilt from '@/components/3d/ThreeDCardTilt';

export default function PricingCalculator() {
  const [quantity, setQuantity] = useState(100);

  const getUnitPrice = (qty: number) => {
    if (qty >= 100) return 10;
    if (qty > 50) return 12;
    return 13;
  };

  const unitPrice = getUnitPrice(quantity);
  const totalPrice = quantity * unitPrice;
  const freeCovers = quantity >= 100 ? 10 : 0;
  const totalCoversReceived = quantity + freeCovers;
  const savings = quantity >= 100 ? (13 - unitPrice) * quantity + (freeCovers * 10) : 0;

  const quickQuantities = [25, 50, 100, 150, 200, 500];

  const handleWhatsAppOrder = () => {
    logUserEvent('CLICK_PRICING_CALCULATOR_WHATSAPP', { quantity, totalPrice });
    const message = `Hello PrintAlarm! I would like to order ${quantity} personalized Shagun Covers (Tier: ₹${unitPrice}/pc, Total: ₹${totalPrice}). Please share design options and digital proof details.`;
    window.open(`https://wa.me/919904544702?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="py-20 md:py-28 px-4 bg-[#F8F4EE] border-t border-[#EADCC9]/60">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full border border-[#C89B3C]/40 bg-white/70 text-[11px] font-bold tracking-widest text-[#2D1527] uppercase shadow-xs">
            <Calculator className="w-3.5 h-3.5 text-[#C89B3C]" /> Transparent Pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-[#2D1527] leading-tight">
            Fair, Transparent <span className="italic font-normal text-[#C89B3C]">Bulk Pricing</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            No surprise plate fees. Premium 210 GSM art card with waterproof ink and free WhatsApp proof on every order.
          </p>
        </div>

        {/* Pricing Cards & Interactive Estimator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3 Volume Tier Cards */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tier 1 */}
              <div className={`p-4 rounded-2xl border transition-all text-center ${quantity <= 50 ? 'border-[#C89B3C] bg-white shadow-md ring-2 ring-[#C89B3C]/40' : 'border-[#EADCC9] bg-white/70'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Intimate</span>
                <h4 className="text-xl font-display font-bold text-[#2D1527] mt-1">₹13 <span className="text-xs font-sans font-normal text-gray-500">/ pc</span></h4>
                <p className="text-[11px] font-semibold text-[#C89B3C] mt-0.5">Up to 50 pcs</p>
                <p className="text-[10px] text-gray-500 mt-2">Perfect for family celebrations</p>
              </div>

              {/* Tier 2 */}
              <div className={`p-4 rounded-2xl border transition-all text-center ${quantity > 50 && quantity < 100 ? 'border-[#C89B3C] bg-white shadow-md ring-2 ring-[#C89B3C]/40' : 'border-[#EADCC9] bg-white/70'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Standard</span>
                <h4 className="text-xl font-display font-bold text-[#2D1527] mt-1">₹12 <span className="text-xs font-sans font-normal text-gray-500">/ pc</span></h4>
                <p className="text-[11px] font-semibold text-[#C89B3C] mt-0.5">51 - 100 pcs</p>
                <p className="text-[10px] text-gray-500 mt-2">Popular for engagements & parties</p>
              </div>

              {/* Tier 3: Best Value */}
              <div className={`p-4 rounded-2xl border transition-all text-center relative ${quantity >= 100 ? 'border-[#C89B3C] bg-[#2D1527] text-white shadow-xl ring-2 ring-[#C89B3C]' : 'border-[#EADCC9] bg-white/80'}`}>
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#C89B3C] text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                  Best Value
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${quantity >= 100 ? 'text-[#E5CD86]' : 'text-gray-500'}`}>Wedding Bulk</span>
                <h4 className={`text-xl font-display font-bold mt-1 ${quantity >= 100 ? 'text-white' : 'text-[#2D1527]'}`}>₹10 <span className={`text-xs font-sans font-normal ${quantity >= 100 ? 'text-[#E5CD86]' : 'text-gray-500'}`}>/ pc</span></h4>
                <p className={`text-[11px] font-semibold mt-0.5 ${quantity >= 100 ? 'text-[#E5CD86]' : 'text-[#C89B3C]'}`}>100+ pcs</p>
                <p className={`text-[10px] mt-2 ${quantity >= 100 ? 'text-gold-100/80' : 'text-gray-500'}`}>+10 FREE Covers Bonus</p>
              </div>
            </div>

            {/* Inclusions Box */}
            <div className="rounded-2xl p-5 bg-white border border-[#EADCC9] shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D1527]">
                Every Order Includes:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C89B3C] flex-shrink-0" />
                  <span>Free WhatsApp Digital Proof</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C89B3C] flex-shrink-0" />
                  <span>Heavy 210 GSM Art Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C89B3C] flex-shrink-0" />
                  <span>Custom Names & Family Blessing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C89B3C] flex-shrink-0" />
                  <span>Waterproof Smudge-Proof Ink</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Estimator Card */}
          <div className="lg:col-span-6">
            <ThreeDCardTilt maxTilt={10} depth={20}>
              <motion.div
                className="rounded-3xl p-6 sm:p-8 bg-white border border-[#EADCC9] shadow-2xl space-y-6"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-[#2D1527]">
                      Instant Price Estimator
                    </h3>
                    <p className="text-xs text-gray-500">Slide or click to select quantity</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-bold font-display text-[#2D1527]">
                      {quantity}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">pieces</span>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="25"
                    max="500"
                    step="5"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full accent-[#C89B3C] cursor-pointer h-2 bg-[#F0ECE2] rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                    <span>25 pcs</span>
                    <span>100 pcs (10 Free)</span>
                    <span>250 pcs</span>
                    <span>500 pcs</span>
                  </div>
                </div>

                {/* Quick Select Buttons */}
                <div className="flex flex-wrap gap-2">
                  {quickQuantities.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuantity(q)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        quantity === q
                          ? 'bg-[#2D1527] text-white border-[#2D1527] shadow-sm'
                          : 'bg-[#FAF7F2] text-gray-700 border-[#EADCC9] hover:border-[#C89B3C]'
                      }`}
                    >
                      {q} pcs
                    </button>
                  ))}
                </div>

                {/* Breakdown Calculation */}
                <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EADCC9] space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Unit Rate:</span>
                    <span className="font-semibold text-[#2D1527]">₹{unitPrice} per cover</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Covers you receive:</span>
                    <span className="font-semibold text-[#2D1527]">
                      {totalCoversReceived} covers {freeCovers > 0 && <span className="text-emerald-700 font-bold">({freeCovers} FREE)</span>}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span className="flex items-center gap-1"><Gift className="w-3.5 h-3.5" /> Bulk Savings:</span>
                      <span>₹{savings} Saved</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#EADCC9] flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#2D1527]">Estimated Total:</span>
                    <span className="text-2xl font-bold font-display text-[#C89B3C]">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    to="/templates"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#2D1527] hover:bg-[#431F3B] text-white font-semibold text-xs sm:text-sm text-center transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Choose a Template <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="py-3 px-4 rounded-xl border border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-semibold text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    Order via WhatsApp
                  </button>
                </div>
              </motion.div>
            </ThreeDCardTilt>
          </div>
        </div>
      </div>
    </section>
  );
}
