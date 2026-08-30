import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Near-black stage with champagne gold — glossy fashion book. */
const p: Palette = {
  bg: '#0B0B0C',
  ink: '#F4F1EC',
  muted: '#9A948C',
  deep: '#000000',
  accent: '#C9A24B',
  onAccent: '#FFFFFF',
  frameFrom: '#31302E',
  frameTo: '#0F0F10',
  line: '#2A2A2C',
};

const t: Typeset = {
  display: 'DM Serif Display',
  displayWeight: 400,
  displayTracking: -1.5,
  body: 'Jost',
  kicker: 'Barlow Condensed',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverFullBleed({
    p,
    t,
    c: {
      masthead: 'Maison',
      kicker: 'The Couture Issue',
      headline: 'Slow tailoring, sharp silhouettes',
      sub: 'Eighteen looks photographed in an empty atelier at first light.',
      issue: 'Volume 09 — Autumn Collections',
      footer: 'Maison — Paris · Milan · Mumbai',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'In this issue',
    entries: [
      { no: '01', title: 'Atelier Light', note: 'The collection, unstyled.' },
      { no: '02', title: 'Gold Thread', note: 'Embroidery houses of the old quarter.' },
      { no: '03', title: 'The Fitting', note: 'Twelve hours before the show.' },
      { no: '04', title: 'Archive', note: 'Nine seasons, one silhouette.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Look 04',
    title: 'Silk, cut on the bias',
    caption: 'Hand-finished hem, 14 metres of duchesse satin. Photographed at the atelier.',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'The Collection',
    headline: 'Thirty-two hands, one jacket',
    standfirst: 'Inside a house where a single shoulder can take a day, and nothing leaves the room until it hangs correctly.',
    columns: [
      'The pattern is drafted flat, then draped, then drafted again. Between those steps sit the corrections nobody sees: a seam eased by two millimetres, a canvas lightened, a sleeve rotated forward to follow the body at rest.\n\nIt is unhurried work, and deliberately so.',
      'By the final fitting the garment has been taken apart three times. The client sees the result once and rarely asks what it took.\n\nThat discretion is part of the product. So is the fact that, twenty years on, the house will still take it in.',
    ],
    caption: 'Photography — Atelier Series',
  }),
  L.quotePage({
    p,
    t,
    quote: 'Elegance is what remains when you remove everything you added to impress.',
    name: 'Lena Marchetti',
    role: 'Creative Director',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'The Lookbook',
    intro: 'Selected pieces from the autumn presentation, shot without accessories.',
    captions: ['Look 01 — wool crepe', 'Look 07 — silk twill', 'Look 11 — velvet', 'Detail — hand embroidery', 'Detail — covered buttons'],
  }),
  L.profileGrid({
    p,
    t,
    title: 'The House',
    intro: 'The people who keep a collection moving from sketch to rail.',
    people: [
      { name: 'Lena Marchetti', role: 'Creative Director' },
      { name: 'Aarav Shah', role: 'Head of Atelier' },
      { name: 'Noor El-Amin', role: 'Première Main' },
      { name: 'Théo Blanc', role: 'Embroidery' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Maison',
    tagline: 'Couture, made to be kept.',
    lines: ['By appointment only', '12 Rue des Archives, Paris', 'atelier@maison.example'],
    website: 'maison.example',
  }),
];

export default pages;
