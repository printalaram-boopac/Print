export default function Designer() {
  return null;
}

/* ─── Designer page temporarily disabled ───

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/api';
import { asset } from '@/lib/asset';

const TEMPLATES = [
  { id: 1, src: asset('card-1.jpeg'), title: 'Royal Peacock Green', category: 'Wedding', price: 15 },
  { id: 2, src: asset('card-2.jpeg'), title: 'Lotus Pink Elegance', category: 'Wedding', price: 15 },
  { id: 3, src: asset('card-3.jpeg'), title: 'Rajasthani Palace Rose', category: 'Wedding', price: 18 },
  { id: 4, src: asset('card-4.jpeg'), title: 'Royal Swan Gold', category: 'Wedding', price: 18 },
  { id: 5, src: asset('card-5.jpeg'), title: 'Golden Floral Crest', category: 'Wedding', price: 15 },
  { id: 6, src: asset('card-6.jpeg'), title: 'Emerald Palace Arch', category: 'Wedding', price: 15 },
  { id: 7, src: asset('card-7.jpeg'), title: 'Royal Elephant Ivory', category: 'Wedding', price: 18 },
  { id: 8, src: asset('card-8.jpeg'), title: 'Maharani Velvet Plum', category: 'Wedding', price: 18 },
  { id: 9, src: asset('card-9.jpeg'), title: 'Shubh Vivah Vermillion', category: 'Wedding', price: 15 },
  { id: 10, src: asset('card-10.jpeg'), title: 'Golden Pichwai Art', category: 'Wedding', price: 15 },
  { id: 11, src: asset('card-11.jpeg'), title: 'Marigold Mandap Yellow', category: 'Wedding', price: 15 },
  { id: 12, src: asset('card-12.jpeg'), title: 'Darbar Ivory Gold', category: 'Wedding', price: 18 },
  { id: 13, src: asset('card-13.jpeg'), title: 'Heritage Paisley Red', category: 'Wedding', price: 15 },
  { id: 14, src: asset('card-14.jpeg'), title: 'Regal Shehnai Motif', category: 'Wedding', price: 15 },
  { id: 15, src: asset('card-15.jpeg'), title: 'Mughal Jaali Mint', category: 'Wedding', price: 15 },
  { id: 16, src: asset('card-16.jpeg'), title: 'Royal Kalash Crimson', category: 'Wedding', price: 15 },
  { id: 17, src: asset('card-17.jpeg'), title: 'Vibrant Bandhani Pink', category: 'Wedding', price: 15 },
  { id: 18, src: asset('card-18.jpeg'), title: 'Golden Swastik Blessings', category: 'Wedding', price: 15 },
  { id: 19, src: asset('card-19.jpeg'), title: 'Monarch Peacock Blue', category: 'Wedding', price: 18 },
  { id: 20, src: asset('card-20.jpeg'), title: 'Divine Ganesha Gold', category: 'Wedding', price: 18 },
  { id: 21, src: asset('card-21.jpeg'), title: 'Classic Zardozi Border', category: 'Wedding', price: 15 },
  { id: 22, src: asset('card-22.jpeg'), title: 'Golden Mandap Arch', category: 'Wedding', price: 15 },
];

const THEMES = ['Gold Luxury', 'Royal Blue', 'Rose Pink', 'Classic White', 'Emerald Green'];
const OCCASIONS = ['Wedding'];

const GREETING_OPTIONS = [
  'શુભ લગ્ન',
  'લગ્ન મહોત્સવ',
  'સાદર નિમંત્રણ',
  'Invited with Love',
  'With Best Compliments',
  'Heartiest Congratulations',
  'Custom...'
];

const STEPS = [
  { id: 1, label: 'Choose Design', icon: '🎨' },
  { id: 2, label: 'Customize', icon: '✏️' },
  { id: 3, label: 'Preview & Order', icon: '🛒' },
];

export default function Designer() {
  const [params] = useSearchParams();
  const { addItem } = useCart();
  const { dbUser } = useAuth();

  // Wizard state
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(
    params.get('template') ? Number(params.get('template')) : null
  );
  const theme = THEMES[0];
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [coupleName, setCoupleName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [selectedGreeting, setSelectedGreeting] = useState(GREETING_OPTIONS[0]);
  const [customGreeting, setCustomGreeting] = useState('');

  const greetingText = useMemo(() => {
    return selectedGreeting === 'Custom...' ? customGreeting : selectedGreeting;
  }, [selectedGreeting, customGreeting]);

  const [quantity, setQuantity] = useState(50);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingName, setShippingName] = useState(dbUser?.shippingName || dbUser?.name || '');
  const [shippingPhone, setShippingPhone] = useState(dbUser?.shippingPhone || dbUser?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(dbUser?.address || '');
  const [orderSaving, setOrderSaving] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const template = useMemo(
    () => TEMPLATES.find((t) => t.id === selectedTemplate) || null,
    [selectedTemplate]
  );

  const unitPrice = useMemo(() => {
    // Apply standard pricing rules: 50 -> 13, 100 -> 12, 200 -> 13
    if (quantity <= 50) return 13;
    if (quantity <= 100) return 12;
    return 13;
  }, [quantity]);

  const totalPrice = unitPrice * quantity;

  // Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!template) return;
    addItem({
      templateId: template.id,
      title: template.title,
      image: template.src,
      theme,
      occasion,
      coupleName,
      familyName,
      greetingText: greetingText || 'Default',
      quantity,
      unitPrice,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  // Save order to Supabase AND send WhatsApp
  const handleWhatsAppOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!shippingName || !shippingPhone || !shippingAddress) {
      setIsCheckingOut(true);
      return;
    }

    setOrderSaving(true);

    try {
      // Save to Supabase
      await createOrder({
        templateId: template?.id ? String(template.id) : undefined,
        quantity,
        unitPrice,
        shippingAddress,
        phone: shippingPhone,
        customerName: shippingName,
        coupleName: coupleName || undefined,
        familyName: familyName || undefined,
        greetingText: greetingText || undefined,
        theme,
        occasion,
        designTitle: template?.title || 'Custom Lifafa',
        shippingName,
      });

      setOrderSuccess(true);
    } catch (err) {
      console.error('Failed to save order to database:', err);
      // Continue with WhatsApp even if DB save fails
    }

    // Send WhatsApp message
    const totalWithShipping = totalPrice + (totalPrice >= 999 ? 0 : 50);
    const msg = [
      `New Order - Printalaram`,
      ``,
      `Product: ${template?.title || 'Custom Lifafa'}`,
      `Quantity: ${quantity} pcs`,
      `Order Total: ₹${totalWithShipping.toLocaleString('en-IN')}.00`,
      ``,
      `Personalization`,
      `Name: ${coupleName || 'Default'}`,
      `Family/Surname: ${familyName || 'Default'}`,
      `Wish/Message: ${greetingText || 'Default'}`,
      `Theme: ${theme}`,
      `Occasion: ${occasion}`,
      ``,
      `Customer & Shipping`,
      `Name: ${shippingName}`,
      `Phone: ${shippingPhone}`,
      `Address: ${shippingAddress}`,
      ``,
      `Please confirm my order.`,
      ``,
      `Razorpay Payment Link: https://rzp.io/l/printalarm`
    ].join('\n');

    window.open(`https://wa.me/919904544702?text=${encodeURIComponent(msg)}`, '_blank');
    setOrderSaving(false);
    setIsCheckingOut(false);

    // Show success briefly then reset
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ─── Step Indicator ─── *-/}
        <div className="flex items-center justify-center gap-2 md:gap-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => {
                  if (s.id === 1 || (s.id === 2 && selectedTemplate) || (s.id === 3 && selectedTemplate)) {
                    setStep(s.id);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${step === s.id
                  ? 'bg-luxury-gold text-luxury-accent'
                  : step > s.id
                    ? 'bg-gold-100 text-luxury-gold border border-gold-300'
                    : 'bg-luxury-gray text-gray-500 border border-gold-200'
                  }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-8 md:w-12 h-0.5 ${step > s.id ? 'bg-luxury-gold' : 'bg-gold-200'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ═══════ STEP 1: Choose Design ═══════ *-/}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-display font-bold">
                  Choose Your <span className="text-gold-gradient">Design</span>
                </h1>
                <p className="text-gray-400 text-sm">Select a template to personalize</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {TEMPLATES.map((t) => (
                  <motion.div
                    key={t.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedTemplate(t.id);
                      setStep(2);
                    }}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedTemplate === t.id
                      ? 'border-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                      : 'border-transparent hover:border-gold-900'
                      }`}
                  >
                    <div className="aspect-square overflow-hidden bg-luxury-dark">
                      <img src={t.src} alt={t.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 bg-luxury-dark/80 border-t border-gold-200">
                      <h3 className="text-xs font-semibold text-luxury-accent truncate">{t.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-500">{t.category}</span>
                        <span className="text-[11px] font-bold text-luxury-gold">from ₹12/pc</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 2: Customize ═══════ *-/}
          {step === 2 && template && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Live Preview *-/}
              <div className="space-y-4">
                <h2 className="text-sm text-luxury-gold uppercase tracking-widest font-semibold">Live Preview</h2>
                <div className="relative rounded-lg overflow-hidden border border-gold-300 bg-luxury-dark">
                  <div className="aspect-square">
                    <img src={template.src} alt={template.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 text-center">Preview is approximate — our designers will finalize your cover</p>
              </div>

              {/* Customization Form *-/}
              <div className="space-y-5">
                <h2 className="text-sm text-luxury-gold uppercase tracking-widest font-semibold">Customize Your Cover</h2>

                {/* Occasion *-/}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Occasion</label>
                  <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ}
                        onClick={() => setOccasion(occ)}
                        className={`px-3 py-1.5 text-[11px] font-medium border rounded-sm cursor-pointer transition-all ${occasion === occ
                          ? 'border-luxury-gold bg-gold-100 text-luxury-accent'
                          : 'border-gold-300 text-gray-500 hover:border-luxury-gold'
                          }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                {/* [Theme - Disabled and Hidden for now]
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Color Theme</label>
                  <div className="flex flex-wrap gap-2">
                    {THEMES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`px-3 py-1.5 text-[11px] font-medium border rounded-sm cursor-pointer transition-all ${theme === t
                          ? 'border-luxury-gold bg-gold-100 text-luxury-accent'
                          : 'border-gold-300 text-gray-500 hover:border-luxury-gold'
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                [end-comment]}

                {/* Couple Name *-/}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Couple / Person Name</label>
                  <input
                    type="text"
                    value={coupleName}
                    onChange={(e) => setCoupleName(e.target.value)}
                    placeholder="e.g. Raj & Simran"
                    className="w-full px-4 py-3 bg-luxury-gray border border-gold-300 text-luxury-accent text-sm rounded-sm focus:border-luxury-gold focus:outline-none transition-colors placeholder:text-gray-500"
                  />
                </div>

                {/* Family Name *-/}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Family Name</label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="e.g. Sharma Family"
                    className="w-full px-4 py-3 bg-luxury-gray border border-gold-300 text-luxury-accent text-sm rounded-sm focus:border-luxury-gold focus:outline-none transition-colors placeholder:text-gray-500"
                  />
                </div>

                {/* Greeting Text *-/}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Greeting / Blessing Text</label>
                  <select
                    value={selectedGreeting}
                    onChange={(e) => setSelectedGreeting(e.target.value)}
                    className="w-full px-4 py-3 bg-luxury-gray border border-gold-300 text-luxury-accent text-sm rounded-sm focus:border-luxury-gold focus:outline-none transition-colors"
                  >
                    {GREETING_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-luxury-dark text-luxury-accent">
                        {opt}
                      </option>
                    ))}
                  </select>
                  
                  {selectedGreeting === 'Custom...' && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2"
                    >
                      <input
                        type="text"
                        required
                        value={customGreeting}
                        onChange={(e) => setCustomGreeting(e.target.value)}
                        placeholder="Write your custom blessing text..."
                        className="w-full px-4 py-3 bg-luxury-gray border border-gold-300 text-luxury-accent text-sm rounded-sm focus:border-luxury-gold focus:outline-none transition-colors placeholder:text-gray-500"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Photo Upload *-/}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">Upload Photo (optional)</label>
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-luxury-gray border border-dashed border-gold-300 text-gray-500 text-sm cursor-pointer hover:border-luxury-gold hover:text-luxury-gold transition-all rounded-sm">
                    📸 {uploadedPhoto ? 'Photo uploaded ✓' : 'Click to upload'}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                {/* Quantity *-/}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium">
                    Quantity <span className="text-gray-500">(min 50)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {[50, 100, 200].map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuantity(q)}
                        className={`px-3 py-2 text-xs font-bold border rounded-sm cursor-pointer transition-all ${quantity === q
                          ? 'border-luxury-gold bg-luxury-gold text-luxury-accent'
                          : 'border-gold-300 text-gray-500 hover:border-luxury-gold'
                          }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Next *-/}
                <button
                  onClick={() => setStep(3)}
                  className="btn-primary w-full gold-glow cursor-pointer"
                >
                  Preview & Confirm →
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 3: Preview & Order ═══════ *-/}
          {step === 3 && template && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-display font-bold">
                  Order <span className="text-gold-gradient">Summary</span>
                </h1>
              </div>

              {/* Order Success Banner *-/}
              {orderSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-300 text-green-800 text-sm font-medium px-4 py-3 rounded-lg text-center"
                >
                  ✅ Order saved successfully! Check your dashboard for tracking.
                </motion.div>
              )}

              <div className="glass-card-gold rounded-xl p-6 md:p-8 space-y-6">
                <div className="flex gap-6">
                  {/* Image *-/}
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 border border-gold-300">
                    <img src={template.src} alt={template.title} className="w-full h-full object-cover" />
                  </div>
                  {/* Details *-/}
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-display font-semibold text-luxury-accent">{template.title}</h3>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>Occasion: <span className="text-luxury-accent font-medium">{occasion}</span></p>
                      <p>Theme: <span className="text-luxury-accent font-medium">{theme}</span></p>
                      {coupleName && <p>Couple: <span className="text-luxury-accent font-medium">{coupleName}</span></p>}
                      {familyName && <p>Family: <span className="text-luxury-accent font-medium">{familyName}</span></p>}
                      <p>Text: <span className="text-luxury-accent font-medium">{greetingText}</span></p>
                      <p>Photo: <span className="text-luxury-accent font-medium">{uploadedPhoto ? 'Uploaded ✓' : 'None'}</span></p>
                    </div>
                  </div>
                </div>

                {!isCheckingOut ? (
                  <>
                    {/* Price breakdown *-/}
                    <div className="border-t border-gold-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">₹{unitPrice} × {quantity} covers</span>
                        <span className="text-luxury-accent font-medium">₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shipping</span>
                        <span className="text-green-600">{totalPrice >= 999 ? 'FREE' : '₹50'}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-gold-200 pt-3">
                        <span className="text-luxury-accent">Total</span>
                        <span className="text-gold-gradient">
                          ₹{(totalPrice + (totalPrice >= 999 ? 0 : 50)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons *-/}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={handleAddToCart}
                        disabled={addedToCart}
                        className={`flex-1 py-3 px-6 text-sm font-bold tracking-wider rounded-sm cursor-pointer transition-all ${addedToCart
                          ? 'bg-green-600 text-white animate-pulse'
                          : 'border border-luxury-accent text-luxury-accent hover:bg-luxury-accent hover:text-white'
                          }`}
                      >
                        {addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                      </button>
                      <button
                        onClick={() => setIsCheckingOut(true)}
                        className="flex-1 btn-primary cursor-pointer"
                      >
                        🟢 Order on WhatsApp
                      </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={(e) => handleWhatsAppOrder(e)} className="border-t border-gold-200 pt-4 space-y-4 text-left">
                    <h3 className="text-sm font-semibold text-luxury-gold uppercase tracking-wider">Shipping Details</h3>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Full Name</label>
                      <input
                        type="text"
                        required
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        placeholder="e.g. brijesh vasoya"
                        className="w-full bg-luxury-dark border border-gold-300 p-2.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        placeholder="e.g. +919904544702"
                        className="w-full bg-luxury-dark border border-gold-300 p-2.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Shipping Address</label>
                      <textarea
                        required
                        rows={3}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="e.g. 70,maple villa ,kathor ,kamrej, surat, Gujarat, 394150"
                        className="w-full bg-luxury-dark border border-gold-300 p-2.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCheckingOut(false)}
                        className="flex-1 py-3 px-6 text-xs font-semibold text-gray-500 bg-luxury-gray border border-gold-300 hover:text-luxury-accent hover:bg-gold-50 transition-colors cursor-pointer rounded-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={orderSaving}
                        className="flex-1 py-3 px-6 text-xs font-bold bg-luxury-gold text-luxury-accent gold-glow cursor-pointer rounded-sm uppercase disabled:opacity-50"
                      >
                        {orderSaving ? 'Saving...' : 'Confirm Order'}
                      </button>
                    </div>
                  </form>
                )}

                <button onClick={() => setStep(2)} className="text-xs text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer block mt-2">
                  ← Back to customization
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

*/