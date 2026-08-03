import { useMemo, useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, Lock, ChevronLeft, ChevronRight, Gift, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/api';
import { DEFAULT_COMPARE_AT_PRICE, getUnitPrice, findTemplateByIdOrSlug, getTemplateSlug } from '@/data/templates';
import { logUserEvent } from '@/lib/analytics';
import FreeAcrylicOfferPopup from '@/components/FreeAcrylicOfferPopup';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';

const QUICK_QUANTITIES = [50, 100, 200];
const STATES = ['Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi', 'Karnataka', 'Uttar Pradesh', 'Madhya Pradesh', 'Other'];

const inputClass = 'w-full bg-luxury-dark border border-gold-200 rounded-lg px-4 py-3.5 text-sm text-luxury-accent placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold transition-colors';

export default function DesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dbUser } = useAuth();

  const template = useMemo(
    () => (id ? findTemplateByIdOrSlug(id) : undefined),
    [id]
  );

  const [quantity, setQuantity] = useState(100);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [activeImage, setActiveImage] = useState(template?.src || '');

  // Free Acrylic Money Cover offer state
  const [showFreeAcrylicPopup, setShowFreeAcrylicPopup] = useState(false);
  const [freeAcrylicAccepted, setFreeAcrylicAccepted] = useState(false);
  const [popupShown, setPopupShown] = useState(false);

  useEffect(() => {
    if (template) {
      setQuantity(template.coverType === 'acrylic_money_cover' ? 1 : 100);
      setActiveImage(template.src);

      // Preload all slide images for instant zero-latency switching
      if (template.images && template.images.length > 0) {
        template.images.forEach((imgUrl) => {
          const img = new Image();
          img.src = imgUrl;
        });
      }
    }
  }, [template]);

  const handlePrevImage = () => {
    if (!template?.images || template.images.length === 0) return;
    const currentIndex = template.images.indexOf(activeImage);
    const prevIndex = (currentIndex - 1 + template.images.length) % template.images.length;
    setActiveImage(template.images[prevIndex]);
  };

  const handleNextImage = () => {
    if (!template?.images || template.images.length === 0) return;
    const currentIndex = template.images.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % template.images.length;
    setActiveImage(template.images[nextIndex]);
  };

  // Personalization
  const [coupleName, setCoupleName] = useState('');
  const [familyName, setFamilyName] = useState('');

  // Track page view event
  useEffect(() => {
    if (template) {
      logUserEvent('VIEW_DESIGN_DETAIL', {
        templateId: template.id,
        templateTitle: template.title,
        category: template.category,
      });
    }
  }, [template]);
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

  const isAcrylic = template?.coverType === 'acrylic_money_cover';

  // Determine if this product qualifies for the free acrylic offer
  const qualifiesForFreeAcrylic =
    !isAcrylic && (template?.coverType === 'money_cover' || template?.coverType === 'pocket_money_cover') && quantity >= 100;

  // Reset free acrylic acceptance when quantity drops below 100
  useEffect(() => {
    if (!qualifiesForFreeAcrylic) {
      setFreeAcrylicAccepted(false);
      setPopupShown(false);
    }
  }, [qualifiesForFreeAcrylic]);

  let subtotal = 0;
  let unitPrice = 0;
  let compareAtUnitPrice = DEFAULT_COMPARE_AT_PRICE;
  let compareAtTotal = 0;
  let savePercent = 0;
  let displayMainPrice = 0;
  let displayCompareAt = 0;
  let priceSubtitle = '';

  if (isAcrylic) {
    if (quantity === 1) {
      subtotal = 200;
      compareAtTotal = 250;
      displayMainPrice = 200;
      displayCompareAt = 250;
      priceSubtitle = 'For 1 frame · Inclusive of all taxes';
    } else if (quantity === 2) {
      subtotal = 349;
      compareAtTotal = 500;
      displayMainPrice = 349;
      displayCompareAt = 500;
      priceSubtitle = 'Set of 2 frames (₹175/pc) · Inclusive of all taxes';
    } else if (quantity === 5) {
      subtotal = 799;
      compareAtTotal = 1250;
      displayMainPrice = 799;
      displayCompareAt = 1250;
      priceSubtitle = 'Set of 5 frames (₹160/pc) · Inclusive of all taxes';
    } else {
      subtotal = Math.round(quantity * (799 / 5));
      compareAtTotal = quantity * 250;
      displayMainPrice = subtotal;
      displayCompareAt = compareAtTotal;
      priceSubtitle = `Total for ${quantity} frames (₹${Math.round(subtotal / quantity)}/pc) · Inclusive of all taxes`;
    }
    unitPrice = Math.round((subtotal / quantity) * 100) / 100;
    savePercent = Math.round((1 - subtotal / compareAtTotal) * 100);
  } else {
    unitPrice = getUnitPrice(quantity);
    subtotal = unitPrice * quantity;
    compareAtUnitPrice = Math.max(25, Math.round((template?.price || 15) * 1.5));
    compareAtTotal = compareAtUnitPrice * quantity;
    displayMainPrice = unitPrice;
    displayCompareAt = compareAtUnitPrice;
    savePercent = Math.round((1 - unitPrice / compareAtUnitPrice) * 100);
    priceSubtitle = `Per envelope (Total: ₹${subtotal} for ${quantity} pcs) · Inclusive of all taxes`;
  }

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

  const designPath = `/design/${getTemplateSlug(template)}`;
  const seoTitle = `${template.title} — Personalized Shagun Cover | ${BRAND_NAME}`;
  const seoDescription = `${template.title} personalized Shagun cover — ${template.category.toLowerCase()} design, made to order with your names & message. Starting at ₹${template.price}/pc, pan-India delivery in 3-5 days.`;
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: template.title,
    image: new URL(template.src, 'https://printalarm.in').href,
    description: seoDescription,
    category: template.category,
    offers: {
      '@type': 'Offer',
      url: `${'https://printalarm.in'}${designPath}`,
      priceCurrency: 'INR',
      price: template.price,
      availability: 'https://schema.org/InStock',
    },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://printalarm.in/' },
      { '@type': 'ListItem', position: 2, name: 'Designs', item: 'https://printalarm.in/templates' },
      { '@type': 'ListItem', position: 3, name: template.title, item: `https://printalarm.in${designPath}` },
    ],
  };

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

    logUserEvent('CLICK_WHATSAPP_ORDER', {
      templateId: template.id,
      templateTitle: template.title,
      quantity,
      total,
      hasCoupleName: !!coupleName,
      hasFamilyName: !!familyName,
      hasGreetingText: !!greetingText,
    });

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

    const freeGiftLines = freeAcrylicAccepted
      ? [
          ``,
          `🎁 *FREE Gift Included*`,
          `Premium Acrylic Money Frame (Worth ₹200) — FREE`,
        ]
      : [];

    const msg = [
      `*New Order - Printalarm*`,
      ``,
      `*Product:* ${template.title}`,
      `*Quantity:* ${quantity} pcs`,
      `*Order Total:* ₹${total.toFixed(2)}`,
      ...freeGiftLines,
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
        <Seo title={seoTitle} description={seoDescription} path={designPath} image={template.src} />
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
                  onBlur={() => logUserEvent('FORM_BLUR_COUPLE_NAME', { length: coupleName.length })}
                  placeholder="Name (e.g. Rahul)"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  onBlur={() => logUserEvent('FORM_BLUR_FAMILY_NAME', { length: familyName.length })}
                  placeholder="Family / Surname (e.g. Sharma)"
                  className={inputClass}
                />
              </div>
              <textarea
                rows={3}
                value={greetingText}
                onChange={(e) => setGreetingText(e.target.value)}
                onBlur={() => logUserEvent('FORM_BLUR_GREETING_TEXT', { length: greetingText.length })}
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
                onBlur={() => logUserEvent('FORM_BLUR_CONTACT_INFO', { length: contactInfo.length })}
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
                  onBlur={() => logUserEvent('FORM_BLUR_FIRST_NAME', { length: firstName.length })}
                  placeholder="First name"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => logUserEvent('FORM_BLUR_LAST_NAME', { length: lastName.length })}
                  placeholder="Last name"
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => logUserEvent('FORM_BLUR_ADDRESS', { length: address.length })}
                placeholder="Address"
                className={inputClass}
              />
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                onBlur={() => logUserEvent('FORM_BLUR_APARTMENT', { length: apartment.length })}
                placeholder="Apartment, suite, etc. (optional)"
                className={inputClass}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={() => logUserEvent('FORM_BLUR_CITY', { value: city })}
                  placeholder="City"
                  className={inputClass}
                />
                <select
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  onBlur={() => logUserEvent('FORM_BLUR_STATE', { value: stateVal })}
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
                  onBlur={() => logUserEvent('FORM_BLUR_PINCODE', { length: pincode.length })}
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
                  onBlur={() => logUserEvent('FORM_BLUR_PHONE', { length: phone.length })}
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

            {/* Free Acrylic Gift Line Item */}
            {freeAcrylicAccepted && (
              <div className="flex items-center gap-4 pt-2 border-t border-gold-200/40">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-green-300 bg-green-50 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-display font-semibold text-luxury-accent">🎁 Acrylic Money Frame</h3>
                  <p className="text-[10px] text-green-600 font-bold">FREE GIFT</p>
                </div>
                <span className="text-xs font-bold text-green-600">FREE</span>
              </div>
            )}

            <div className="border-t border-gold-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal · {quantity} pcs</span>
                <span className="text-luxury-accent font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {freeAcrylicAccepted && (
                <div className="flex justify-between">
                  <span className="text-gray-500">🎁 Acrylic Money Frame</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              )}
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
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={designPath}
        image={template.src}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />
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
            className="glass-card-gold rounded-xl p-4 flex flex-col gap-4"
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-luxury-dark relative group">
              <img src={activeImage} alt={template.title} decoding="async" fetchPriority="high" className="w-full h-full object-cover transition-opacity duration-300" />
              
              {template.images && template.images.length > 1 && (
                <>
                  {/* Previous Slide Button */}
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer border border-gold-200/30 shadow-lg"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 text-luxury-gold" />
                  </button>

                  {/* Next Slide Button */}
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer border border-gold-200/30 shadow-lg"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 text-luxury-gold" />
                  </button>

                  {/* Slide Counter Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-luxury-gold px-3 py-1 rounded-full text-xs font-semibold border border-gold-200/30 shadow-md">
                    {(template.images.indexOf(activeImage) >= 0 ? template.images.indexOf(activeImage) : 0) + 1} / {template.images.length}
                  </div>
                </>
              )}
            </div>

            {template.images && template.images.length > 1 && (
              <div className="flex gap-2.5 justify-center">
                {template.images.map((imgUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      activeImage === imgUrl ? 'border-luxury-gold scale-105 shadow-md shadow-amber-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${template.title} view ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
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
                <span className="text-4xl font-display font-bold text-gold-gradient">₹{displayMainPrice}</span>
                {displayCompareAt > displayMainPrice && (
                  <span className="text-lg text-gray-400 line-through">₹{displayCompareAt}</span>
                )}
                {savePercent > 0 && (
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Save {savePercent}%</span>
                )}
              </div>
              <p className="text-xs text-gray-500">{priceSubtitle}</p>
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

                {isAcrylic ? (
                  [1, 2, 5].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        logUserEvent('CLICK_QUICK_QUANTITY', { templateId: template.id, quantity: q });
                        setQuantity(q);
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${quantity === q
                          ? 'bg-luxury-accent text-white'
                          : 'bg-luxury-gray text-luxury-accent hover:bg-gold-100'
                        }`}
                    >
                      {q} {q === 1 ? 'pc' : 'pcs'}
                    </button>
                  ))
                ) : (
                  QUICK_QUANTITIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        logUserEvent('CLICK_QUICK_QUANTITY', { templateId: template.id, quantity: q });
                        setQuantity(q);
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${quantity === q
                          ? 'bg-luxury-accent text-white'
                          : 'bg-luxury-gray text-luxury-accent hover:bg-gold-100'
                        }`}
                    >
                      {q} pcs
                    </button>
                  ))
                )}
              </div>
              <p className="text-xs text-gray-500">₹{unitPrice} per {isAcrylic ? 'frame' : 'envelope'} at this quantity</p>

              {/* Free Acrylic Teaser Badge */}
              {qualifiesForFreeAcrylic && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="free-gift-badge relative flex items-center gap-3 p-3.5 pr-16 rounded-xl border border-luxury-gold/50 mt-2 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #1a1410, #3D1E30 60%, #2a1420)' }}
                >
                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-sweep" />
                  </div>

                  <div className="relative w-9 h-9 rounded-full bg-luxury-gold/15 border border-luxury-gold/50 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4.5 h-4.5 text-luxury-gold" strokeWidth={2} />
                    <Sparkles className="w-3 h-3 text-gold-200 absolute -top-1 -right-1 animate-sparkle-twinkle" strokeWidth={2.5} />
                  </div>
                  <div className="relative flex-1 min-w-0">
                    <p className="text-xs font-bold text-gold-shimmer">FREE Acrylic Frame Included</p>
                    <p className="text-[10px] text-gold-200/80 mt-0.5">Automatically added free on orders of 100+ covers</p>
                  </div>

                  {/* Ribbon corner tag */}
                  <div className="free-gift-ribbon absolute top-2 -right-8 w-28 text-center rotate-45">
                    <span className="block bg-luxury-gold text-luxury-accent text-[9px] font-extrabold uppercase tracking-wider py-0.5 shadow-md">
                      Worth ₹200
                    </span>
                  </div>
                </motion.div>
              )}

              <div className="border-t border-gold-200 pt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-display font-bold text-luxury-accent">₹{subtotal.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-gray-400 line-through">₹{compareAtTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logUserEvent('CLICK_BUY_NOW', {
                  templateId: template.id,
                  templateTitle: template.title,
                  quantity,
                  total,
                });
                // Show free acrylic popup if eligible and not yet shown
                if (qualifiesForFreeAcrylic && !popupShown) {
                  setShowFreeAcrylicPopup(true);
                  setPopupShown(true);
                } else {
                  setIsCheckingOut(true);
                }
              }}
              className="w-full btn-primary gold-glow cursor-pointer"
            >
              Buy Now
            </button>

            {/* Free Acrylic Offer Popup */}
            <FreeAcrylicOfferPopup
              isOpen={showFreeAcrylicPopup}
              quantity={quantity}
              onAccept={() => {
                setFreeAcrylicAccepted(true);
                setShowFreeAcrylicPopup(false);
                logUserEvent('FREE_ACRYLIC_ACCEPTED', { templateId: template.id, quantity });
                setIsCheckingOut(true);
              }}
              onDecline={() => {
                setFreeAcrylicAccepted(false);
                setShowFreeAcrylicPopup(false);
                logUserEvent('FREE_ACRYLIC_DECLINED', { templateId: template.id, quantity });
                setIsCheckingOut(true);
              }}
            />

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
