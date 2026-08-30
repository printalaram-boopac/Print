import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Sun-washed linen and salt-faded blue — resort and coastal fashion. */
const p: Palette = {
  bg: '#F8F6F0',
  ink: '#20303A',
  muted: '#6E7D84',
  deep: '#132029',
  accent: '#3F7C8A',
  onAccent: '#FFFFFF',
  frameFrom: '#E4E9E4',
  frameTo: '#B9C7C4',
  line: '#E6E4DA',
};

const t: Typeset = {
  display: 'DM Serif Display',
  displayWeight: 400,
  displayTracking: -0.4,
  body: 'Jost',
  kicker: 'Barlow Condensed',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverFullBleed({
    p,
    t,
    c: {
      masthead: 'Salt Air',
      kicker: 'Resort collection',
      headline: 'Linen, cotton and the colour of a faded beach towel',
      sub: 'Shot on location, without a single studio light in the entire collection.',
      issue: 'Summer Resort 2026',
      footer: 'Salt Air — coastal fashion',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'The Collection',
    entries: [
      { no: '01', title: 'Linen Everything', note: 'Nine pieces, one fabric.' },
      { no: '02', title: 'Faded on Purpose', note: 'A dye process that mimics a decade of sun.' },
      { no: '03', title: 'On Location', note: 'Shot at the harbour, unstyled.' },
      { no: '04', title: 'The Fit Guide', note: 'Sizing for a collection meant to be loose.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'On Location',
    title: 'Shot at the harbour, six in the morning',
    caption: 'No retouching beyond colour correction. The wrinkles in the linen are the point.',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Process',
    headline: 'A dye that fades like ten summers, on purpose',
    standfirst: 'The collection is pre-faded using a controlled wash process that mimics years of salt and sun exposure.',
    columns: [
      'Most resort collections chase a crisp, just-unpacked look. This one does the opposite: every piece is washed and sun-treated before it ever reaches a customer, so it arrives already looking lived-in.\n\nThe process took eleven attempts to get right.',
      'Too little fading and the pieces look unfinished. Too much and the fabric weakens. The final wash cycle sits at a precise point between the two, tested against fabric strength as much as appearance.',
    ],
    caption: 'Photographed at the dye workshop',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'The Range',
    intro: 'Nine pieces, one fabric, five fade levels across the collection.',
    captions: ['Linen shirt, level 2', 'Wide trouser, level 3', 'Wrap dress, level 1', 'Beach shirt, level 4', 'Detail, stitching'],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Salt Air',
    tagline: 'Resort fashion, made to look ten summers old.',
    lines: ['Shipping worldwide', 'Care instructions inside every piece', 'hello@saltair.example'],
    website: 'saltair.example',
  }),
];

export default pages;
