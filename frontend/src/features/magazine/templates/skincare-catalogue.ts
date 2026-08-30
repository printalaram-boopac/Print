import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Clinical white with a soft botanical green — a skincare product catalogue. */
const p: Palette = {
  bg: '#FBFDFB',
  ink: '#1D2A22',
  muted: '#5C6B60',
  deep: '#101B14',
  accent: '#3F7D5C',
  onAccent: '#FFFFFF',
  frameFrom: '#DFEFE5',
  frameTo: '#AFD3BE',
  line: '#E3EFE8',
};

const t: Typeset = {
  display: 'Marcellus',
  displayWeight: 400,
  displayTracking: 0,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverMinimal({
    p,
    t,
    c: {
      masthead: 'Botaniq',
      kicker: 'Ingredient-led skincare',
      headline: 'Seven formulas, every ingredient listed at the percentage we actually use.',
      issue: 'Full Range Catalogue',
      footer: 'Botaniq — dermatologist reviewed',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'The Range',
    entries: [
      { no: '01', title: 'Cleanse', note: 'Two formulas, for two skin types.' },
      { no: '02', title: 'Treat', note: 'Actives, at stated concentration.' },
      { no: '03', title: 'Hydrate', note: 'Barrier-first moisturisers.' },
      { no: '04', title: 'Protect', note: 'Broad-spectrum, reef-safe filters.' },
    ],
  }),
  L.productShowcase({
    p,
    t,
    title: 'Treat',
    intro: 'Active formulas listed with their exact percentage, not just the ingredient name.',
    items: [
      { name: 'Niacinamide 10%', price: '₹1,190', note: 'With zinc PCA. Formulated for oil balance, patch-tested at full strength.' },
      { name: 'Vitamin C 15%', price: '₹1,450', note: 'Stabilised L-ascorbic acid, packaged airless to preserve potency.' },
      { name: 'Retinal 0.1%', price: '₹1,690', note: 'Encapsulated for slow release, introduced gradually over four weeks.' },
    ],
    footnote: 'All actives independently lab-tested each batch',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Formulation',
    headline: 'Why we publish the exact percentage',
    body: 'Most skincare marketing names an ingredient without stating how much of it is actually in the bottle. We publish the percentage on every active formula, and the full batch testing certificate is available on request.\n\nEvery formula is reviewed by an independent dermatologist before it ships, not after a complaint.',
    facts: [
      { label: 'Formulas in range', value: '7' },
      { label: 'Independent lab tests', value: 'Per batch' },
      { label: 'Fragrance added', value: 'None' },
    ],
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'The Full Range',
    intro: 'Seven formulas across four steps — cleanse, treat, hydrate, protect.',
    captions: ['Gentle Cleanser', 'Niacinamide Serum', 'Barrier Cream', 'Mineral SPF', 'Overnight Treatment'],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Botaniq',
    tagline: 'Every ingredient, every percentage, stated plainly.',
    lines: ['Dermatologist reviewed, every formula', 'Batch certificates on request', 'hello@botaniq.example'],
    website: 'botaniq.example',
  }),
];

export default pages;
