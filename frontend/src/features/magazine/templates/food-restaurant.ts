import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Warm cream and deep olive — a restaurant and produce magazine. */
const p: Palette = {
  bg: '#FBF7EF',
  ink: '#1F2419',
  muted: '#6E7360',
  deep: '#161A11',
  accent: '#4F6B2A',
  onAccent: '#FCFBF5',
  frameFrom: '#E4E6D6',
  frameTo: '#B9BE9F',
  line: '#E5E4D7',
};

const t: Typeset = {
  display: 'Libre Baskerville',
  displayWeight: 700,
  displayTracking: -0.8,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverSplit({
    p,
    t,
    c: {
      masthead: 'Harvest',
      kicker: 'Seasonal cooking · Growers · Kitchens',
      headline: 'Twelve dishes built from whatever the market had on Tuesday.',
      issue: 'The Autumn Table',
      footer: 'Harvest — Issue 06',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'On The Menu',
    entries: [
      { no: '01', title: 'Market Tuesday', note: 'One basket, twelve dishes, no shopping list.' },
      { no: '02', title: 'The Growers', note: 'Four farms within sixty kilometres.' },
      { no: '03', title: 'Open Kitchen', note: 'A service, from prep to last order.' },
      { no: '04', title: 'Preserving', note: 'What to put away before the frost.' },
      { no: '05', title: 'The Wine List', note: 'Six bottles that go with everything here.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'The Dish',
    title: 'Roast squash, brown butter, sage',
    caption: 'Squash from Hollow Farm, picked the same morning. Butter browned until it smells of hazelnut, no further.',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Market Tuesday',
    headline: 'Cooking without a shopping list',
    standfirst: 'The kitchen writes its menu after the market, not before. It makes ordering harder and the food considerably better.',
    columns: [
      'The rule is simple: buy what looks best, then work out what to do with it. In practice this means the menu is written at eleven and printed at four, and that the chef spends the morning negotiating rather than planning.\n\nIt also means nothing arrives out of season.',
      'The trade-off is waste, or rather the avoidance of it. There is no walk-in full of hedged bets, no pre-portioned insurance policy.\n\nWhat is bought gets cooked, and what is cooked gets sold. On the rare night it does not, the staff eat well.',
    ],
    caption: 'Photography — kitchen pass, 17:40',
  }),
  L.productShowcase({
    p,
    t,
    title: 'From the pantry',
    intro: 'Three preserves made in the quiet weeks, sold at the counter while they last.',
    items: [
      { name: 'Preserved Lemons', price: '₹420 / jar', note: 'Salt-cured for six weeks with bay and black pepper. Use the rind, keep the brine.' },
      { name: 'Tomato Conserva', price: '₹380 / jar', note: 'Slow-reduced late-season tomatoes, nothing added but salt and a little oil.' },
      { name: 'Wild Plum Vinegar', price: '₹560 / bottle', note: 'Fermented from windfall plums, aged eight months in stainless.' },
    ],
    footnote: 'Counter sales only — we do not ship preserves',
  }),
  L.profileGrid({
    p,
    t,
    title: 'The Growers',
    intro: 'Four farms that supply most of what appears on these pages.',
    people: [
      { name: 'Hollow Farm', role: 'Squash · Alliums' },
      { name: 'Rye & Field', role: 'Grains · Flour' },
      { name: 'Chalk Valley', role: 'Salad · Herbs' },
      { name: 'Two Oaks Dairy', role: 'Butter · Cream' },
    ],
  }),
  L.quotePage({
    p,
    t,
    quote: 'If the vegetable is good enough, most of the cooking is deciding when to stop.',
    name: 'Ravi Menon',
    role: 'Head Chef',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Harvest',
    tagline: 'Seasonal food, written down as it happens.',
    lines: ['Kitchen open Wednesday to Sunday', 'Bookings by phone only', 'table@harvest.example'],
    website: 'harvest.example',
  }),
];

export default pages;
