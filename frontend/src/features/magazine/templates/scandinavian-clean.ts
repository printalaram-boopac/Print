import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Pale, calm and generous: cool grey-blue on almost-white. */
const p: Palette = {
  bg: '#FAFBFB',
  ink: '#22282B',
  muted: '#7B858A',
  deep: '#1A1F22',
  accent: '#8FA9B5',
  onAccent: '#12181B',
  frameFrom: '#E8ECEE',
  frameTo: '#C4CDD2',
  line: '#E8EBEC',
};

const t: Typeset = {
  display: 'Jost',
  displayWeight: 400,
  displayTracking: -0.8,
  body: 'Inter',
  kicker: 'Jost',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverMinimal({
    p,
    t,
    c: {
      masthead: 'Rolig',
      kicker: 'Volume Six',
      headline: 'Interiors, materials and the case for owning fewer, better things.',
      issue: 'Winter Light',
      footer: 'Rolig — published quarterly',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'Winter Light', note: 'Designing for four hours of daylight.' },
      { no: '02', title: 'Bare Wood', note: 'Finishes that age instead of wearing out.' },
      { no: '03', title: 'The Small Kitchen', note: 'Nine square metres, fully used.' },
      { no: '04', title: 'Wool', note: 'One material, six applications.' },
    ],
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Interiors',
    headline: 'Designing for four hours of daylight',
    standfirst: 'When the sun clears the rooftops at ten and leaves by two, every surface in the room has to earn its reflectance.',
    columns: [
      'The instinct is to add lamps. The better move is to look at what the light lands on first: the floor, the wall opposite the window, and the ceiling directly above the glass.\n\nLighten those three and the room gains an hour.',
      'Everything else can be dark. In fact it should be — contrast is what makes a low-light room feel intentional rather than dim.\n\nThe rooms on these pages all follow that logic, and none of them use more than three light sources.',
    ],
    caption: 'Photographed in January, natural light only',
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Materials',
    title: 'Bare wood, oiled twice a year',
    caption: 'Untreated pine, oiled rather than lacquered, photographed after four years of daily use.',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Details',
    intro: 'Surfaces, joints and edges — the parts of a room you touch rather than look at.',
    captions: ['Oiled pine, four years on', 'Linen, unbleached', 'Ceramic, matte glaze', 'Wool, undyed', 'Brass, patinated'],
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'The Small Kitchen',
    headline: 'Nine square metres, fully used',
    body: 'There is no island, no breakfast bar and no second sink. What there is: a single run of worktop long enough to prepare a meal without moving, and storage sized to what the household actually owns.\n\nThe cabinets were built to fit, which cost more than flat-pack and less than the extension that was originally proposed.',
    facts: [
      { label: 'Floor area', value: '9.2 m²' },
      { label: 'Worktop run', value: '3.4 m' },
      { label: 'Cabinet depth', value: '580 mm' },
    ],
  }),
  L.quotePage({
    p,
    t,
    quote: 'A calm room is not an empty one. It is a room where nothing is competing for your attention.',
    name: 'Ingrid Halvorsen',
    role: 'Interior architect',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Rolig',
    tagline: 'Quiet interiors, honest materials.',
    lines: ['Four issues a year', 'Printed on uncoated paper', 'post@rolig.example'],
    website: 'rolig.example',
  }),
];

export default pages;
