import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Deep espresso and gold leaf — a premium product lookbook. */
const p: Palette = {
  bg: '#171310',
  ink: '#F1E9DE',
  muted: '#A29383',
  deep: '#0C0907',
  accent: '#C5A059',
  onAccent: '#171310',
  frameFrom: '#3A312A',
  frameTo: '#15110E',
  line: '#302823',
};

const t: Typeset = {
  display: 'Marcellus',
  displayWeight: 400,
  displayTracking: -0.2,
  body: 'Jost',
  kicker: 'Jost',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverFramed({
    p,
    t,
    c: {
      masthead: 'Aurum',
      kicker: 'The Gold Collection',
      headline: 'Nine pieces, made by hand in limited number',
      sub: 'Each item is finished individually and carries the mark of the artisan who completed it.',
      issue: 'Collection MMXXVI',
      footer: 'Aurum — atelier since 1974',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'The Collection',
    entries: [
      { no: 'I', title: 'The Signature', note: 'The piece the house is known for.' },
      { no: 'II', title: 'Limited Series', note: 'Nine numbered examples only.' },
      { no: 'III', title: 'Materials', note: 'Where everything comes from.' },
      { no: 'IV', title: 'The Atelier', note: 'Four hands, one bench.' },
      { no: 'V', title: 'Ownership', note: 'Care, service and provenance.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'The Signature',
    title: 'Finished by hand, numbered by hand',
    caption: 'Each piece takes between fourteen and twenty hours at the bench, depending on the finish selected.',
  }),
  L.productShowcase({
    p,
    t,
    title: 'The Gold Collection',
    intro: 'Three pieces from the current collection. Each is made to order and delivered in eight to ten weeks.',
    items: [
      { name: 'Signature Cuff', price: '₹1,84,000', note: 'Hand-formed, brushed and lacquered. Numbered inside the band with the maker’s mark.' },
      { name: 'Meridian Chain', price: '₹2,42,000', note: 'Individually soldered links, polished to a mirror finish, with a concealed clasp.' },
      { name: 'Atelier Ring', price: '₹96,000', note: 'Cast in a single piece then finished by hand. Available in three widths.' },
    ],
    footnote: 'Made to order — eight to ten weeks from confirmation',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Materials',
    headline: 'Where everything comes from',
    body: 'All metal is refined from recycled stock and certified at the point of purchase. Stones are sourced from two suppliers the house has worked with since the nineteen-eighties, both of whom provide origin documentation with every parcel.\n\nProvenance papers accompany each finished piece and are reissued free of charge if lost.',
    facts: [
      { label: 'Recycled metal content', value: '100%' },
      { label: 'Suppliers, stones', value: '2' },
      { label: 'Hours at the bench', value: '14–20' },
    ],
  }),
  L.profileGrid({
    p,
    t,
    title: 'The Atelier',
    intro: 'Four makers share one bench. Every piece is completed by a single pair of hands.',
    people: [
      { name: 'Giulia Ferretti', role: 'Master Goldsmith' },
      { name: 'Hemant Rao', role: 'Setting' },
      { name: 'Yusuf Demir', role: 'Finishing' },
      { name: 'Clara Nyman', role: 'Engraving' },
    ],
  }),
  L.quotePage({
    p,
    t,
    quote: 'We make nine of something, and then we stop. That is the whole business model.',
    name: 'Giulia Ferretti',
    role: 'Master Goldsmith',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Aurum',
    tagline: 'Made by hand, in limited number, since 1974.',
    lines: ['Private appointments at the atelier', 'Lifetime service on every piece', 'atelier@aurum.example'],
    website: 'aurum.example',
  }),
];

export default pages;
