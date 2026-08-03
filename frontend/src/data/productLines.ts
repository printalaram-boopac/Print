import type { Template } from '@/data/templates';
import { BRAND_NAME } from '@/lib/brand';

export interface PricingTier {
  qty: string;
  unitPrice: string;
  total?: string;
  note?: string;
}

export interface ProductLineFaq {
  q: string;
  a: string;
}

export interface ProductLine {
  slug: string;
  coverType: Template['coverType'];
  navLabel: string;
  h1: string;
  tagline: string;
  quotableFact: string;
  seoTitle: string;
  seoDescription: string;
  sizeSpec: string;
  description: string;
  bestFor: string;
  pricingTiers: PricingTier[];
  faqs: ProductLineFaq[];
}

export const PRODUCT_LINES: ProductLine[] = [
  {
    slug: 'shagun-money-covers',
    coverType: 'money_cover',
    navLabel: 'Shagun Money Covers',
    h1: 'Personalized Shagun Money Covers',
    tagline: 'Standard wedding envelopes, custom-printed with your names & blessing',
    quotableFact: 'Printalarm’s Shagun money covers are 6.5" x 3.5" wedding envelopes, personalized with your names and blessing, starting at ₹10/pc for orders of 100+.',
    seoTitle: `Shagun Money Covers Online | Personalized Wedding Envelopes — ${BRAND_NAME}`,
    seoDescription: 'Order personalized Shagun money covers online — standard 6.5" x 3.5" wedding envelopes, custom names & photos, gold-foil printing, pan-India delivery in 3-5 days.',
    sizeSpec: '6.5" x 3.5" — fits all Indian currency notes',
    description: 'Our classic Shagun money cover is the traditional choice for weddings, housewarmings, and festive gifting. Each envelope is printed on premium 210 GSM art card with HD, waterproof ink, and personalized with the couple or family name, a custom blessing, and your choice of design.',
    bestFor: 'Weddings, Griha Pravesh, Swaminarayan & Sacred Tradition ceremonies, and festive cash gifting',
    pricingTiers: [
      { qty: 'Up to 50 pcs', unitPrice: '₹13/pc', total: '₹650 for 50 pcs' },
      { qty: '51-100 pcs', unitPrice: '₹12/pc', total: '₹1,200 for 100 pcs' },
      { qty: '100+ pcs', unitPrice: '₹10/pc', note: 'Best value for bulk wedding orders — 10 free covers on 100+' },
    ],
    faqs: [
      { q: 'What size is a standard Shagun money cover?', a: 'The standard Shagun money cover is 6.5" x 3.5", sized to fit all Indian currency notes.' },
      { q: 'What is the minimum order for Shagun money covers?', a: 'You can order as few as 25 covers. Orders of 100+ pieces get 10 free covers and drop to ₹10/pc.' },
      { q: 'Can I personalize the Shagun money cover?', a: 'Yes — every cover can be personalized with the couple or family name, a custom blessing message, and your choice of design or uploaded photo.' },
    ],
  },
  {
    slug: 'pocket-money-covers',
    coverType: 'pocket_money_cover',
    navLabel: 'Pocket Money Covers',
    h1: 'Pocket Money Covers — Compact Personalized Lifafas',
    tagline: 'Sleek, compact covers for smaller cash gifts and quick blessings',
    quotableFact: 'Printalarm’s pocket money covers are compact 4" x 3" Shagun lifafas, personalized with your names and blessing, starting at ₹10/pc for orders of 100+.',
    seoTitle: `Pocket Money Covers Online | Compact Personalized Shagun Lifafas — ${BRAND_NAME}`,
    seoDescription: 'Order personalized pocket money covers online — compact 4" x 3" Shagun lifafas, custom names & designs, gold-foil printing, pan-India delivery in 3-5 days.',
    sizeSpec: '4" x 3" — compact pocket lifafa',
    description: 'The pocket money cover is a sleeker, smaller alternative to the standard Shagun envelope — ideal when you want a personalized, premium finish without the larger footprint. Same 210 GSM art card, HD printing, and personalization options as our standard covers, in a compact size.',
    bestFor: 'Smaller cash gifts, everyday blessings, and gifting where a compact size is preferred',
    pricingTiers: [
      { qty: 'Up to 50 pcs', unitPrice: '₹13/pc', total: '₹650 for 50 pcs' },
      { qty: '51-100 pcs', unitPrice: '₹12/pc', total: '₹1,200 for 100 pcs' },
      { qty: '100+ pcs', unitPrice: '₹10/pc', note: 'Best value for bulk orders — 10 free covers on 100+' },
    ],
    faqs: [
      { q: 'What size is a pocket money cover?', a: 'The pocket money cover is a compact 4" x 3" Shagun lifafa — smaller than the standard 6.5" x 3.5" cover.' },
      { q: 'Is the pocket money cover cheaper than the standard cover?', a: 'Pricing is the same as the standard Shagun money cover — ₹13/pc up to 50 pcs, ₹12/pc for 51-100 pcs, and ₹10/pc for 100+ pcs.' },
      { q: 'When should I choose a pocket cover over a standard cover?', a: 'Choose a pocket cover for smaller cash gifts or everyday blessings where a more compact size is preferred.' },
    ],
  },
  {
    slug: 'acrylic-money-covers',
    coverType: 'acrylic_money_cover',
    navLabel: 'Acrylic Money Covers',
    h1: 'Premium Acrylic Money Frames',
    tagline: 'A luxury keepsake gift — cash presented in a custom acrylic frame',
    quotableFact: 'Printalarm’s acrylic money frames present cash as a keepsake gift, starting at ₹160/pc for a set of 5 frames.',
    seoTitle: `Acrylic Money Frames Online | Premium Personalized Shagun Gift — ${BRAND_NAME}`,
    seoDescription: 'Order premium acrylic money frames online — a luxury keepsake alternative to paper Shagun covers, personalized with names & photos, pan-India delivery in 3-5 days.',
    sizeSpec: 'Premium acrylic frame, standard currency-note size',
    description: 'For a gift that lasts beyond the celebration, our acrylic money frame presents cash in a clear, durable acrylic keepsake — personalized with names, a photo, or a custom design. A standout alternative to a paper envelope for milestone weddings, Rakshabandhan, and festive occasions.',
    bestFor: 'Milestone weddings, Rakshabandhan, and gifts meant to be kept as a keepsake',
    pricingTiers: [
      { qty: '1 frame', unitPrice: '₹200/pc', total: '₹200' },
      { qty: '2 frames', unitPrice: '₹175/pc', total: '₹349 for 2' },
      { qty: '5 frames', unitPrice: '₹160/pc', total: '₹799 for 5', note: 'Best value per frame' },
    ],
    faqs: [
      { q: 'What is an acrylic money frame?', a: 'It is a clear, durable acrylic frame that presents cash as a keepsake gift, personalized with names, a photo, or a custom design — a lasting alternative to a paper envelope.' },
      { q: 'How much does an acrylic money frame cost?', a: 'A single frame starts at ₹200. A set of 2 is ₹349 (₹175/pc), and a set of 5 is ₹799 (₹160/pc) — the best per-frame value.' },
      { q: 'What occasions suit an acrylic money frame?', a: 'Milestone weddings, Rakshabandhan, and any gift where you want the presentation itself to be kept as a keepsake.' },
    ],
  },
];

export function getProductLineBySlug(slug: string): ProductLine | undefined {
  return PRODUCT_LINES.find((p) => p.slug === slug);
}
