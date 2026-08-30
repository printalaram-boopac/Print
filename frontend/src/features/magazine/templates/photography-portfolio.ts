import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Gallery white with a single hot accent — images first, type out of the way. */
const p: Palette = {
  bg: '#FFFFFF',
  ink: '#0A0A0A',
  muted: '#767676',
  deep: '#000000',
  accent: '#E4572E',
  onAccent: '#FFFFFF',
  frameFrom: '#E6E6E6',
  frameTo: '#BFBFBF',
  line: '#EDEDED',
};

const t: Typeset = {
  display: 'Archivo Narrow',
  displayWeight: 700,
  displayTracking: -0.6,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverTypeLed({
    p,
    t,
    c: {
      masthead: 'Frame',
      kicker: 'Portfolio 2026',
      headline: 'Documentary work, 2019 — 2026',
      sub: 'Reportage, portraits and long-form personal projects. Selected images from seven years of assignments.',
      issue: 'Selected Works',
      footer: 'Available for commission worldwide',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'Series',
    entries: [
      { no: '01', title: 'Night Shift', note: 'Hospital corridors, 2021.' },
      { no: '02', title: 'Salt', note: 'Coastal industry, ongoing.' },
      { no: '03', title: 'Portraits', note: 'Commissioned editorial work.' },
      { no: '04', title: 'After Rain', note: 'Personal project, monsoon.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Night Shift · 01',
    title: 'Corridor, 04:12',
    caption: 'From a six-week series photographed on the night rotation of a district hospital.',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Night Shift',
    intro: 'Available light only, 35mm. Printed here at roughly a third of exhibition size.',
    captions: ['Handover, 23:50', 'Waiting, ward four', 'Break room', 'Ambulance bay', 'First light'],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Salt · 03',
    title: 'The pans at low season',
    caption: 'Ongoing series documenting coastal salt production and the families working it.',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Portraits',
    intro: 'Commissioned work for editorial and cultural clients, shot on location.',
    captions: ['Studio, natural light', 'On set', 'Backstage', 'At home', 'Workshop'],
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'About',
    headline: 'Documentary photographer, based in Mumbai',
    body: 'Seven years of reportage and portrait assignments for editorial, cultural and commercial clients. Long-form personal projects run alongside commissioned work and usually take two to three years.\n\nAvailable for assignment worldwide. Prints from all series are available in editions of twenty-five.',
    facts: [
      { label: 'Series completed', value: '11' },
      { label: 'Exhibitions', value: '06' },
      { label: 'Print edition size', value: '25' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Frame',
    tagline: 'Commissions, prints and archive enquiries.',
    lines: ['studio@frame.example', 'Prints in editions of twenty-five', 'Full archive available on request'],
    website: 'frame.example',
  }),
];

export default pages;
