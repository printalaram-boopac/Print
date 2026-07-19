import { asset } from '@/lib/asset';

// ─── Design showcase data ───
export const DESIGNS = [
  { id: 1, src: asset('card-1.jpeg'), title: 'Royal Swaminarayan Plum', category: 'Sacred Tradition', tag: '🔥 Trending' },
  { id: 2, src: asset('card-2.jpeg'), title: 'Peacock Garden Blue', category: 'Wedding', tag: '✨ New' },
  { id: 3, src: asset('card-3.jpeg'), title: 'Moonlit Shiva Blessing', category: 'Sacred Tradition', tag: '🔥 Trending' },
  { id: 4, src: asset('card-4.jpeg'), title: 'Golden Peacock Palace', category: 'Wedding', tag: '💎 Premium' },
  { id: 5, src: asset('card-5.jpeg'), title: 'Ganesha Crimson Blessing', category: 'Sacred Tradition', tag: '✨ New' },
  { id: 6, src: asset('card-6.jpeg'), title: 'Emerald Garden Bloom', category: 'Wedding', tag: '⭐ Best Seller' },
];

// ─── Promo ticker ───
export const TICKER_ITEMS = [
  { text: 'FREE DIGITAL PROOF ON WHATSAPP', icon: '💬' },
  { text: 'PAN-INDIA DELIVERY IN 4 DAYS', icon: '✦' },
  { text: '15,000+ HAPPY COUPLES', icon: '💕' },
  { text: 'CUSTOM DESIGNS', icon: '✦' },
];

// ─── Trust stats ───
export const STATS = [
  { value: '5000+', label: 'Orders Delivered', icon: '📦' },
  { value: '4.9', label: 'Customer Rating', icon: '⭐' },
  { value: '100+', label: 'Premium Designs', icon: '🎨' },
  { value: 'PAN India', label: 'Fast Delivery', icon: '🚀' },
];

// ─── Process steps ───
export const PROCESS_STEPS = [
  { step: 1, title: 'Choose Design', desc: 'Pick from 100+ luxury templates or start fresh', icon: 'Palette' },
  { step: 2, title: 'Upload Photo', desc: 'Add your couple photo or family picture', icon: 'Camera' },
  { step: 3, title: 'Approve Design', desc: 'Preview your personalized cover in real-time', icon: 'CheckCircle2' },
  { step: 4, title: 'Printing', desc: 'Premium 210 GSM HD printing with waterproof ink', icon: 'Printer' },
  { step: 5, title: 'Dispatch', desc: 'Carefully packed and shipped within 2-4 days', icon: 'Package' },
  { step: 6, title: 'Delivered', desc: 'At your doorstep before the big celebration', icon: 'PartyPopper' },
];

// ─── Premium features ───
export const FEATURES = [
  { title: 'Premium 210 GSM', desc: 'Thick, luxurious card stock', icon: 'Layers' },
  { title: 'HD Printing', desc: 'Crystal clear photo quality', icon: 'Printer' },
  { title: 'Waterproof Ink', desc: 'Smudge-proof & long lasting', icon: 'Droplet' },
  { title: 'Luxury Finish', desc: 'Gold foil & matte lamination', icon: 'Sparkles' },
  { title: 'Fast Dispatch', desc: '2-4 days express shipping', icon: 'Rocket' },
  { title: 'Made in India', desc: 'Proudly crafted with love', icon: 'Flag' },
];

// ─── Reviews ───
export const REVIEWS = [
  {
    name: 'Neha Patel',
    location: 'Ahmedabad',
    rating: 5,
    text: 'Everyone loved our Shagun covers! The print quality was amazing and they arrived in just 3 days.',
    occasion: 'Wedding',
    image: asset('card-1.jpeg'),
  },
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'Beautiful designs! The personalized photo covers were the highlight of our reception.',
    occasion: 'Wedding',
    image: asset('card-3.jpeg'),
  },
  {
    name: 'Ravi Mehta',
    location: 'Jaipur',
    rating: 5,
    text: 'Ordered 200 covers for my daughter\'s wedding. Premium quality and delivered on time!',
    occasion: 'Wedding',
    image: asset('card-6.jpeg'),
  },
];

// ─── FAQ ───
export const FAQS = [
  { q: 'Can I use my own photo?', a: 'Absolutely! You can upload any high-resolution photo of the couple, family, or any image you prefer. We recommend at least 1080px width for best print quality.' },
  { q: 'Can I change the text on covers?', a: 'Yes! You can customize family names, blessing text, couple names, and more. Choose from multiple premium fonts.' },
  { q: 'What is the minimum order quantity?', a: 'You can order as few as 25 covers. For bulk orders of 100+, you get 10 free covers and additional discounts.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery is available for 24-48 hour dispatch at a small additional charge.' },
  { q: 'Is express delivery available?', a: 'Yes! Select "Express Delivery" at checkout. We dispatch within 24 hours and it reaches you in 1-2 days depending on location.' },
  { q: 'What paper quality do you use?', a: 'We use premium 210 GSM art card with HD printing, waterproof ink, and optional gold foil stamping and matte lamination.' },
  { q: 'What are the cover sizes available?', a: 'Standard Shagun cover size is 7.5" x 3.5" (fits all Indian currency notes). Custom sizes available on request.' },
  { q: 'Can I order through WhatsApp?', a: 'Yes! Simply message us on WhatsApp with your requirements. Our design team will create a custom preview for you within hours.' },
];

// ─── Offers ───
// export const OFFERS = [
//   { title: 'Buy 100, Get 10 Free', desc: 'Bulk wedding order special', icon: '🎁' },
//   { title: 'Free Design Service', desc: 'Custom design at no extra cost', icon: '🎨' },
//   { title: 'Free Shipping', desc: 'On orders above ₹999', icon: '🚚' },
//   { title: 'Express Available', desc: '24hr dispatch for urgent orders', icon: '⚡' },
// ];

// ─── Occasion categories ───
export const OCCASIONS = [
  'Wedding', 'Birthday', 'Baby Shower', 'Naming Ceremony',
  'Housewarming', 'Corporate Gift', 'Raksha Bandhan', 'Diwali Shagun',
];
