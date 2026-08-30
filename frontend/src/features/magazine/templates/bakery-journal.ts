import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Buttery cream and cocoa — a bakery and pastry journal. */
const p: Palette = {
  bg: '#FFF8EF',
  ink: '#3B2A1E',
  muted: '#8A7360',
  deep: '#2A1B10',
  accent: '#B5651D',
  onAccent: '#FFF8EF',
  frameFrom: '#F0E1CB',
  frameTo: '#D4B689',
  line: '#EFE2CC',
};

const t: Typeset = {
  display: 'Libre Baskerville',
  displayWeight: 700,
  displayTracking: -0.4,
  body: 'Lora',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverSplit({
    p,
    t,
    c: {
      masthead: 'Crumb',
      kicker: 'Bread, pastry & the ovens behind them',
      headline: 'Twelve loaves, one starter, and the bakers who feed it every morning at 4am.',
      issue: 'Winter Baking Issue',
      footer: 'Crumb — Issue 09',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'On the Counter',
    entries: [
      { no: '01', title: 'The Starter', note: 'Nine years old and still hungry.' },
      { no: '02', title: 'Laminated', note: 'The three-day croissant, explained.' },
      { no: '03', title: 'The 4am Shift', note: 'A morning at the ovens, start to finish.' },
      { no: '04', title: 'Seasonal Fruit', note: 'What goes in the tart this month.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'The Loaf',
    title: 'Country sourdough, scored by hand',
    caption: 'Baked from a starter kept alive for nine years, fed twice daily without exception.',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Technique',
    headline: 'The three-day croissant, and why it takes that long',
    standfirst: 'Butter, folded six times, rested between each. Rushing any step and the layers collapse into bread.',
    columns: [
      'Day one is the dough, mixed and rested overnight in the cold. Day two is lamination — butter locked in, folded and chilled, folded again, three times over, each fold demanding patience the dough will not forgive skipping.\n\nDay three is shaping and the long final proof.',
      'The reward is layers you can count with a thumbnail, and a crumb that shatters rather than tears.\n\nWe timed it once: forty-one hours from mixing to the oven. None of it can be rushed without it showing.',
    ],
    caption: 'Photographed across three mornings',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'The 4am Shift',
    intro: 'A single morning at the ovens, from the first mix to the first customer.',
    captions: ['4:02am, first mix', 'Shaping', 'Into the oven', 'Cooling racks', 'Doors open, 7am'],
  }),
  L.quotePage({
    p,
    t,
    quote: 'A starter is not an ingredient. It is a colleague you have to show up for.',
    name: 'Marco Belline',
    role: 'Head baker',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Crumb',
    tagline: 'Bread and pastry, taken seriously.',
    lines: ['Bakery opens 7am, closes when sold out', 'Recipes shared, techniques earned', 'flour@crumb.example'],
    website: 'crumb.example',
  }),
];

export default pages;
