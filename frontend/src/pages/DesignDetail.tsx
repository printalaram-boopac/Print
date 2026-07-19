import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/api';
import { TEMPLATES, COMPARE_AT_PRICE, getUnitPrice } from '@/data/templates';

const QUICK_QUANTITIES = [50, 100, 200];
const STATES = ['Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi', 'Karnataka', 'Uttar Pradesh', 'Madhya Pradesh', 'Other'];

const inputClass = 'w-full bg-luxury-dark border border-gold-200 rounded-lg px-4 py-3.5 text-sm text-luxury-accent placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold transition-colors';

export default function DesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dbUser } = useAuth();

  const template = useMemo(
    () => TEMPLATES.find((t) => t.id === Number(id)),
    [id]
  );

  const [quantity, setQuantity] = useState(50);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);

  // Personalization
  const [coupleName, setCoupleName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [greetingText, setGreetingText] = useState('');

  // Contact
  const [contactInfo, setContactInfo] = useState('');
  const [emailOptIn, setEmailOptIn] = useState(true);

  // Delivery
  const [firstName, setFirstName] = useState(dbUser?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(dbUser?.name?.split(' ').slice(1).join(' ') || '');
  const [address, setAddress] = useState(dbUser?.address || '');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('Gujarat');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState(dbUser?.shippingPhone || dbUser?.phone || '');

  const unitPrice = getUnitPrice(quantity);
  const subtotal = unitPrice * quantity;
  const compareAtTotal = COMPARE_AT_PRICE * quantity;
  const savePercent = Math.round((1 - unitPrice / COMPARE_AT_PRICE) * 100);
  const shippingFee = subtotal >= 999 ? 0 : 50;
  const total = subtotal + shippingFee;

  if (!template) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 text-center">
        <p className="text-gray-400">Design not found.</p>
        <Link to="/templates" className="text-luxury-gold underline text-sm">Browse all designs</Link>
      </div>
    );
  }

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };

  const handleWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !address || !city || !pincode || !phone) return;

    const shippingName = `${firstName} ${lastName}`.trim();
    const shippingAddress = [address, apartment, `${city}, ${stateVal} ${pincode}`]
      .filter(Boolean)
      .join(', ');

    setOrderSaving(true);
    try {
      await createOrder({
        templateId: String(template.id),
        quantity,
        unitPrice,
        shippingAddress,
        phone,
        customerName: shippingName,
        coupleName: coupleName || undefined,
        familyName: familyName || undefined,
        greetingText: greetingText || undefined,
        designTitle: template.title,
        occasion: template.category,
        shippingName,
        city,
        state: stateVal,
        pincode,
      });
    } catch (err) {
      console.error('Failed to save order to database:', err);
    }

    const msg = [
      `*New Order - Printalarm*`,
      ``,
      `*Product:* ${template.title}`,
      `*Quantity:* ${quantity} pcs`,
      `*Order Total:* ₹${total.toFixed(2)}`,
      ``,
      `*Personalization*`,
      `Name: ${coupleName || 'Default'}`,
      `Family/Surname: ${familyName || 'Default'}`,
      `Wish/Message: ${greetingText || 'Default'}`,
      ``,
      `*Customer & Shipping*`,
      `Name: ${shippingName}`,
      `Phone: +91 ${phone}`,
      `Address: ${shippingAddress}`,
      ``,
      `Please confirm my order.`,
      `Thank you!`,
    ].join('\n');

    window.open(`https://wa.me/919904544702?text=${encodeURIComponent(msg)}`, '_blank');
    setOrderSaving(false);
  };

  // ═══════ CHECKOUT VIEW ═══════
  if (isCheckingOut) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Checkout form */}
          <motion.form
            onSubmit={handleWhatsAppOrder}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="space-y-1">
              <h1 className="text-3xl font-display font-bold text-luxury-accent">Checkout</h1>
              <p className="text-sm text-gray-500">Complete your details to place your order.</p>
            </div>

            {/* Personalize */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-display font-semibold text-luxury-accent">Personalize Your Lifafa</h2>
                <p className="text-xs text-gray-500">Tell us exactly how you want it printed.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={coupleName}
                  onChange={(e) => setCoupleName(e.target.value)}
                  placeholder="Name (e.g. Rahul)"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="Family / Surname (e.g. Sharma)"
                  className={inputClass}
                />
              </div>
              <textarea
                rows={3}
                value={greetingText}
                onChange={(e) => setGreetingText(e.target.value)}
                placeholder="Your wish / message to print (e.g. With best compliments & blessings)"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h2 className="text-lg font-display font-semibold text-luxury-accent">Contact</h2>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Email or mobile phone number"
                className={inputClass}
              />
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailOptIn}
                  onChange={(e) => setEmailOptIn(e.target.checked)}
                  className="w-4 h-4 accent-luxury-accent cursor-pointer"
                />
                Email me with news and offers
              </label>
            </div>

            {/* Delivery */}
            <div className="space-y-3">
              <h2 className="text-lg font-display font-semibold text-luxury-accent">Delivery</h2>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 pl-1">Country/Region</label>
                <select disabled value="India" className={`${inputClass} cursor-not-allowed opacity-80`}>
                  <option>India</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className={inputClass}
              />
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="Apartment, suite, etc. (optional)"
                className={inputClass}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className={inputClass}
                />
                <select
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  className={inputClass}
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="PIN code"
                  className={inputClass}
                />
              </div>
              <div className="flex items-stretch border border-gold-200 rounded-lg overflow-hidden bg-luxury-dark focus-within:border-luxury-gold">
                <span className="flex items-center px-4 text-sm text-gray-500 border-r border-gold-200">+91</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="flex-1 px-4 py-3.5 text-sm text-luxury-accent placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={orderSaving}
                className="w-full btn-primary gold-glow cursor-pointer disabled:opacity-50"
              >
                {orderSaving ? 'Saving...' : 'Order on WhatsApp'}
              </button>
              <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" strokeWidth={2} /> You'll be redirected to WhatsApp to confirm your order.
              </p>
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="w-full text-center text-xs text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer"
              >
                ← Back to design details
              </button>
            </div>
          </motion.form>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card-gold rounded-xl p-6 space-y-5 lg:sticky lg:top-28"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gold-200">
                <img src={template.src} alt={template.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-display font-semibold text-luxury-accent truncate">{template.title}</h3>
                <p className="text-xs text-gray-500">{quantity} Pcs · {template.category}</p>
              </div>
              <span className="text-sm font-bold text-luxury-accent">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="border-t border-gold-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal · {quantity} pcs</span>
                <span className="text-luxury-accent font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-medium">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
            </div>

            <div className="border-t border-gold-200 pt-4 flex items-center justify-between">
              <span className="text-lg font-display font-semibold text-luxury-accent">Total</span>
              <span className="text-2xl font-display font-bold text-gold-gradient">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[11px] text-gray-500 -mt-3">Inclusive of all taxes</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══════ PRODUCT VIEW ═══════
  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 space-x-1.5">
          <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/templates" className="hover:text-luxury-gold transition-colors">Designs</Link>
          <span>/</span>
          <span className="text-luxury-accent font-medium">{template.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-gold rounded-xl p-4"
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-luxury-dark">
              <img src={template.src} alt={template.title} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <span className="text-xs text-luxury-gold uppercase tracking-widest font-semibold">
                {template.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-luxury-accent">
                {template.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-0.5 text-luxury-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4" fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="font-medium text-luxury-accent">4.9</span>
                <span>· 5,000+ orders delivered</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-display font-bold text-gold-gradient">₹{unitPrice}</span>
                <span className="text-lg text-gray-400 line-through">₹{COMPARE_AT_PRICE}</span>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Save {savePercent}%</span>
              </div>
              <p className="text-xs text-gray-500">Per envelope · Inclusive of all taxes</p>
            </div>

            {/* Quantity + Subtotal */}
            <div className="glass-card-gold rounded-xl p-6 space-y-4">
              <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Quantity</label>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-luxury-gray rounded-full p-1">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-8 h-8 rounded-full bg-luxury-dark flex items-center justify-center text-luxury-accent hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-14 text-center bg-transparent text-sm font-semibold text-luxury-accent focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-luxury-dark flex items-center justify-center text-luxury-accent hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>

                {QUICK_QUANTITIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${quantity === q
                        ? 'bg-luxury-accent text-white'
                        : 'bg-luxury-gray text-luxury-accent hover:bg-gold-100'
                      }`}
                  >
                    {q} pcs
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">₹{unitPrice} per envelope at this quantity</p>

              <div className="border-t border-gold-200 pt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-display font-bold text-luxury-accent">₹{subtotal.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-gray-400 line-through">₹{compareAtTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full btn-primary gold-glow cursor-pointer"
            >
              Buy Now
            </button>

            <button
              onClick={() => navigate('/templates')}
              className="text-xs text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer"
            >
              ← Back to all designs
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
