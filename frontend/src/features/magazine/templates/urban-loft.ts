import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Industrial charcoal and copper — an urban loft property collection. */
const p: Palette = {
  bg: '#F5F4F2',
  ink: '#1E1C1A',
  muted: '#6B655D',
  deep: '#131110',
  accent: '#B5622E',
  onAccent: '#FFFFFF',
  frameFrom: '#DCD8D2',
  frameTo: '#A9A198',
  line: '#DEDAD3',
};

const t: Typeset = {
  display: 'Bebas Neue',
  displayWeight: 400,
  displayTracking: 0,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverSplit({
    p,
    t,
    c: {
      masthead: 'Foundry',
      kicker: 'Converted industrial living',
      headline: 'Six former factories, now nine homes each — exposed brick, steel and double-height ceilings.',
      issue: 'Loft Collection 2026',
      footer: 'Foundry Residential · RERA registered',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'The Collection',
    entries: [
      { no: '01', title: 'Unit 4B', note: 'Double-height, original crane beam intact.' },
      { no: '02', title: 'Unit 7', note: 'Corner loft with wraparound steel windows.' },
      { no: '03', title: 'The Conversion', note: 'What stayed, what had to go.' },
      { no: '04', title: 'Viewings', note: 'Private appointments, weekdays only.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Unit 4B',
    title: 'The original crane beam, left exactly where it was',
    caption: 'Structural engineers confirmed the beam could stay as a feature rather than be removed.',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Unit 4B',
    headline: 'Double-height living, original ironwork',
    body: 'This unit retains the factory’s original crane beam, now load-tested and left exposed as the loft’s defining feature. The mezzanine bedroom sits beneath it, with steel-framed windows salvaged from the original façade.\n\nHeating and services are entirely new, run below a reinstated timber floor.',
    facts: [
      { label: 'Internal area', value: '186 m²' },
      { label: 'Ceiling height', value: '6.2 m' },
      { label: 'Guide price', value: '₹2.9 Cr' },
    ],
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'The Conversion',
    intro: 'What survived the conversion, and what had to be replaced entirely.',
    captions: ['Original brick, cleaned', 'Steel windows, restored', 'New mezzanine', 'Services, concealed', 'Communal stair'],
  }),
  L.productShowcase({
    p,
    t,
    title: 'Also in this building',
    intro: 'Three further units from the same conversion, available for immediate viewing.',
    items: [
      { name: 'Unit 7 — Corner Loft', price: '₹3.4 Cr', note: 'Wraparound steel windows on two elevations, 210 sq m, private roof access.' },
      { name: 'Unit 2 — Ground Loft', price: '₹2.1 Cr', note: 'Direct courtyard access, 140 sq m, original loading bay door retained.' },
      { name: 'Unit 9 — Penthouse', price: '₹4.6 Cr', note: 'Top floor, 240 sq m, full-height glazing to the original sawtooth roof.' },
    ],
    footnote: 'Guide prices exclusive of stamp duty and registration',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Foundry',
    tagline: 'Industrial buildings, converted with restraint.',
    lines: ['Viewings by appointment, weekdays only', 'sales@foundryresidential.example', '+91 00000 00000'],
    website: 'foundryresidential.example',
  }),
];

export default pages;
