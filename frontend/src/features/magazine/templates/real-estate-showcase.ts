import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Cool stone with navy authority — a property portfolio brochure. */
const p: Palette = {
  bg: '#F7F8F9',
  ink: '#15202B',
  muted: '#63707C',
  deep: '#0C161F',
  accent: '#1F3A5F',
  onAccent: '#FFFFFF',
  frameFrom: '#DEE4E9',
  frameTo: '#B0BCC7',
  line: '#E2E6EA',
};

const t: Typeset = {
  display: 'Marcellus',
  displayWeight: 400,
  displayTracking: -0.4,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverFramed({
    p,
    t,
    c: {
      masthead: 'Meridian',
      kicker: 'Private Collection',
      headline: 'Eight residences, released this season',
      sub: 'Full specifications, floor areas and viewing arrangements for each property in the collection.',
      issue: 'Portfolio 2026',
      footer: 'Meridian Property · RERA registered',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Portfolio',
    entries: [
      { no: '01', title: 'The Terrace House', note: 'Four bedrooms, south-facing garden.' },
      { no: '02', title: 'Riverside Apartment', note: 'Third floor, river frontage, parking.' },
      { no: '03', title: 'The Courtyard Villa', note: 'Single storey, private courtyard.' },
      { no: '04', title: 'City Penthouse', note: 'Top floor, two terraces.' },
      { no: '05', title: 'Viewings', note: 'How to arrange a private appointment.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Property 01',
    title: 'The Terrace House',
    caption: 'Four bedrooms across three floors, with a south-facing garden and off-street parking for two cars.',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Property 01',
    headline: 'The Terrace House',
    body: 'A restored period terrace arranged over three floors, retaining original joinery and fireplaces while adding a full-width rear extension and a rebuilt kitchen.\n\nThe garden faces south and holds light until early evening. Planning consent for a garden studio is in place and transfers with the sale.',
    facts: [
      { label: 'Internal area', value: '2,140 sq ft' },
      { label: 'Bedrooms · Bathrooms', value: '4 · 3' },
      { label: 'Guide price', value: '₹4.6 Cr' },
    ],
  }),
  L.productShowcase({
    p,
    t,
    title: 'Also available',
    intro: 'Three further residences from the current collection, available for viewing by appointment.',
    items: [
      { name: 'Riverside Apartment', price: '₹3.2 Cr', note: 'Third floor, 1,480 sq ft, river frontage, secure parking and a private balcony.' },
      { name: 'Courtyard Villa', price: '₹5.4 Cr', note: 'Single storey, 2,600 sq ft, walled courtyard, staff quarters and a covered carport.' },
      { name: 'City Penthouse', price: '₹6.8 Cr', note: 'Top floor, 2,050 sq ft, two terraces, lift access and twenty-four hour concierge.' },
    ],
    footnote: 'Guide prices exclusive of stamp duty and registration',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Interiors',
    intro: 'Selected rooms photographed in natural light, unstaged and unfurnished where noted.',
    captions: ['Reception room', 'Kitchen, rear extension', 'Principal bedroom', 'Garden, looking back', 'Original staircase'],
  }),
  L.statsPage({
    p,
    t,
    kicker: 'The Market',
    title: 'This season in numbers',
    intro: 'Figures cover the prime segment across our four operating districts for the twelve months to March.',
    stats: [
      { value: '8', label: 'Residences in the current collection' },
      { value: '41 days', label: 'Average time from listing to offer accepted' },
      { value: '97%', label: 'Average of guide price achieved' },
      { value: '2,340', label: 'Average internal area, square feet' },
    ],
    source: 'Source — Meridian transaction records',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Meridian',
    tagline: 'Private property, handled privately.',
    lines: ['Viewings strictly by appointment', 'sales@meridian.example', '+91 00000 00000'],
    website: 'meridian.example',
  }),
];

export default pages;
