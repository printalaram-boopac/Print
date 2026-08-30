import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Bright, structured retail catalogue — clean grid, confident orange. */
const p: Palette = {
  bg: '#FFFFFF',
  ink: '#1A1A1A',
  muted: '#6B6B6B',
  deep: '#141414',
  accent: '#E8590C',
  onAccent: '#FFFFFF',
  frameFrom: '#F0EFED',
  frameTo: '#CFCCC7',
  line: '#EAEAEA',
};

const t: Typeset = {
  display: 'Montserrat',
  displayWeight: 800,
  displayTracking: -1.4,
  body: 'Inter',
  kicker: 'Montserrat',
  kickerWeight: 700,
};

const pages: PageDraft[] = [
  L.coverSplit({
    p,
    t,
    c: {
      masthead: 'Catalogue',
      kicker: 'Full range · Prices · Specifications',
      headline: 'Everything we make, with the numbers you need to order it.',
      issue: 'Season 26 · Edition One',
      footer: 'Wholesale and retail pricing enclosed',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'Ranges',
    entries: [
      { no: '01', title: 'Everyday', note: 'Core range, always in stock.' },
      { no: '02', title: 'Workshop', note: 'Heavier gauge, trade specification.' },
      { no: '03', title: 'Limited', note: 'Seasonal colours, single run.' },
      { no: '04', title: 'Accessories', note: 'Parts, spares and refills.' },
    ],
  }),
  L.productShowcase({
    p,
    t,
    title: 'Everyday range',
    intro: 'The core three. Always stocked, always the same specification, replacement parts held for ten years.',
    items: [
      { name: 'Model One — Standard', price: '₹2,400', note: 'Powder-coated steel, 1.2mm gauge. Available in four colours. Ships flat, assembles with one tool.' },
      { name: 'Model Two — Compact', price: '₹1,850', note: 'Same construction, reduced footprint for smaller spaces. Stacks three high in storage.' },
      { name: 'Model Three — Wide', price: '₹3,100', note: 'Extended span with a centre brace. Rated to forty kilograms distributed load.' },
    ],
    footnote: 'Trade pricing available at twelve units and above',
  }),
  L.productShowcase({
    p,
    t,
    title: 'Workshop range',
    intro: 'Trade specification: thicker gauge, welded joints, finished for daily use rather than display.',
    items: [
      { name: 'Bench Unit', price: '₹6,900', note: 'Welded frame, 2mm gauge, hardwood top. Built for continuous workshop use.' },
      { name: 'Tool Wall', price: '₹4,200', note: 'Perforated panel with twelve hooks included. Mounts to masonry or stud.' },
      { name: 'Rolling Cart', price: '₹5,400', note: 'Braked castors, two trays, powder-coated finish. Rated to eighty kilograms.' },
    ],
    footnote: 'Lead time fourteen days on workshop range',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Finishes',
    intro: 'Nine standard finishes. Custom colours available on orders above fifty units.',
    captions: ['Graphite, matte', 'Bone, satin', 'Clay', 'Raw steel, waxed', 'Deep olive'],
  }),
  L.statsPage({
    p,
    t,
    kicker: 'How We Make It',
    title: 'Built to be repaired',
    intro: 'Every product on these pages is designed for disassembly, and every part is held in stock for a decade after the range is discontinued.',
    stats: [
      { value: '10 yr', label: 'Spare parts held after discontinuation' },
      { value: '1 tool', label: 'Required for full assembly' },
      { value: '94%', label: 'Of each unit is separable for recycling' },
      { value: '14 days', label: 'Standard lead time on made-to-order' },
    ],
    source: 'Manufacturing data, current season',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Ordering',
    headline: 'How to place an order',
    body: 'Retail orders can be placed directly through the website or by phone. Trade accounts receive net-thirty terms after the second order and access to volume pricing from twelve units.\n\nAll prices in this catalogue are exclusive of GST and delivery. Freight is quoted at order confirmation and depends on destination pin code.',
    facts: [
      { label: 'Trade minimum', value: '12 units' },
      { label: 'Payment terms', value: 'Net 30' },
      { label: 'Returns window', value: '30 days' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Catalogue',
    tagline: 'Full range, current prices, honest lead times.',
    lines: ['Orders: orders@catalogue.example', 'Trade enquiries: trade@catalogue.example', 'Prices valid for the current season'],
    website: 'catalogue.example',
  }),
];

export default pages;
