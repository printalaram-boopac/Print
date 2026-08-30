import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Charcoal and amber personal portfolio — work first, credentials after. */
const p: Palette = {
  bg: '#FAF9F7',
  ink: '#1C1B19',
  muted: '#6E6A64',
  deep: '#121110',
  accent: '#D97706',
  onAccent: '#FFFFFF',
  frameFrom: '#E9E5DF',
  frameTo: '#C3BCB2',
  line: '#E5E1DA',
};

const t: Typeset = {
  display: 'Syne',
  displayWeight: 700,
  displayTracking: -1.6,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverMinimal({
    p,
    t,
    c: {
      masthead: 'Selected Work',
      kicker: 'Portfolio 2026',
      headline: 'Product design, brand systems and the occasional physical object. Nine projects from the last three years.',
      issue: 'Aarti Raval',
      footer: 'aartiraval.example',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Projects',
    entries: [
      { no: '01', title: 'Ledger', note: 'Accounting tool rebuilt around one screen.' },
      { no: '02', title: 'Fold', note: 'Packaging system for a small-batch roaster.' },
      { no: '03', title: 'Halo', note: 'Design system adopted by four product teams.' },
      { no: '04', title: 'Signal House', note: 'Identity and signage for a music venue.' },
      { no: '05', title: 'About', note: 'Background, tools and availability.' },
    ],
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Project 01',
    headline: 'Ledger — rebuilt around a single screen',
    standfirst: 'A bookkeeping tool where the core job happened across seven screens. We shipped a version where it happens on one.',
    columns: [
      'The research finding was uncomfortable: nobody used the dashboard. Every session started in the transactions list and ended there, with six detours in between to reconcile a single line.\n\nSo the list became the product.',
      'Reconciliation, categorising and receipt matching all moved inline. The dashboard survives as a weekly email nobody has to open.\n\nSupport tickets about reconciliation fell by two thirds in the quarter after launch.',
    ],
    caption: 'Role — product design, research, prototyping',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Fold',
    intro: 'Packaging system for a small-batch coffee roaster — one die line, four ranges, no printed variants.',
    captions: ['The single die line', 'Range colours', 'Label detail', 'On shelf', 'Shipper carton'],
  }),
  L.statsPage({
    p,
    t,
    kicker: 'Project 03',
    title: 'Halo — a design system four teams actually use',
    intro: 'Adoption was the whole brief. The system shipped with a migration codemod, office hours and a deprecation policy in writing.',
    stats: [
      { value: '4', label: 'Product teams migrated in six months' },
      { value: '118', label: 'Components consolidated down to 41' },
      { value: '63%', label: 'Reduction in UI bug reports' },
      { value: '0', label: 'Forks created after launch' },
    ],
    source: 'Figures supplied by the client',
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Project 04',
    title: 'Signal House',
    caption: 'Identity, wayfinding and exterior signage for a 400-capacity music venue. Photographed on opening week.',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'About',
    headline: 'Designer, based in Ahmedabad',
    body: 'Eleven years across product and brand, the last four independent. I work directly with founders and product leads, usually as the only designer, and I write as much as I draw.\n\nI take three engagements a year and prefer projects where research and shipping are the same job. Currently booking from the next quarter.',
    facts: [
      { label: 'Years designing', value: '11' },
      { label: 'Engagements a year', value: '3' },
      { label: 'Based in', value: 'Ahmedabad' },
    ],
  }),
  L.quotePage({
    p,
    t,
    quote: 'The best portfolio page is the one where the work needs no explanation underneath it.',
    name: 'Aarti Raval',
    role: 'Product & brand designer',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Aarti Raval',
    tagline: 'Available for product and brand work.',
    lines: ['hello@aartiraval.example', 'Full case studies on request', 'Booking from next quarter'],
    website: 'aartiraval.example',
  }),
];

export default pages;
