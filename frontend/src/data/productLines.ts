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
];

export function getProductLineBySlug(slug: string): ProductLine | undefined {
  return PRODUCT_LINES.find((p) => p.slug === slug);
}
