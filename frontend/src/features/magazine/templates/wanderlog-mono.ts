import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Pure black, white and grey — a minimalist monochrome travel journal. */
const p: Palette = {
  bg: '#FFFFFF',
  ink: '#111111',
  muted: '#5E5E5E',
  deep: '#000000',
  accent: '#111111',
  onAccent: '#FFFFFF',
  frameFrom: '#E4E4E4',
  frameTo: '#9C9C9C',
  line: '#DDDDDD',
};

const t: Typeset = {
  display: 'DM Serif Display',
  displayWeight: 400,
  displayTracking: -0.6,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverMinimal({
    p,
    t,
    c: {
      masthead: 'Wanderlog',
      kicker: 'Issue Nº 04',
      headline: 'Black and white notes from four weeks on the road, no colour to distract from the shape of things.',
      issue: 'The Monochrome Journeys',
      footer: 'Wanderlog — travel, stripped back',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'Letter from the Road', note: 'Why we left the colour film at home.' },
      { no: '02', title: 'Behind the Scenes', note: 'Four weeks, one camera bag.' },
      { no: '03', title: 'The Long Train', note: 'Thirty-one hours, one window seat.' },
      { no: '04', title: 'Five Places, No Filter', note: 'A short list, honestly ranked.' },
      { no: '05', title: 'Contributors', note: 'Who shot what, and where.' },
    ],
  }),
  L.introLetter({
    p,
    t,
    kicker: 'Letter from the Road',
    title: 'Why we left the colour film at home',
    dropCap: 'W',
    paragraphs: [
      'Black and white was not a style decision at first. It was a supply problem — the one roll of colour film we packed ran out on day three, and the only shop in town only stocked monochrome.',
      'By day five we had stopped missing it. Colour, it turns out, does a lot of narrative work for a photograph. Without it, you notice shape, gesture and light instead — which is most of what a place is actually made of.',
      'So this issue stayed black and white on purpose, four weeks after the accident that started it.',
    ],
    signature: 'Editor, on the road',
    quote: '“Take away the colour and you are left with the composition, honestly.”',
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Behind the Scenes',
    title: 'One camera bag, four weeks',
    caption: 'Everything carried for the trip fit in a single bag. Nothing else made the cut.',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'The Long Train',
    headline: 'Thirty-one hours, one window seat',
    standfirst: 'The scenery outside barely changed for the first six hours. It was the best part of the journey.',
    columns: [
      'There is a particular kind of patience a long train teaches that no other form of travel does. You cannot rush it, cannot reroute it, cannot really do much except watch the land change in slow, deliberate stages.\n\nBy hour ten, that stopped feeling like a delay.',
      'Meals came from a trolley at irregular intervals. Conversation happened in the dining car, in three languages none of us fully shared. Sleep happened sitting upright, more or less.\n\nWe arrived thirty-one hours later, and reluctant to get off.',
    ],
    caption: 'Photographed from the window seat, most of the way',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Five Places, No Filter',
    intro: 'A short, honestly ranked list — the five stops from this trip we would return to first.',
    captions: ['The harbour town', 'The mountain pass', 'The old quarter', 'The coastal ruin', 'The last stop'],
  }),
  L.quotePage({
    p,
    t,
    quote: 'A place photographed without colour still tells you exactly how it felt to stand there.',
    name: 'Field Notes',
    role: 'Somewhere past the border',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Wanderlog',
    tagline: 'Travel writing and photography, stripped to black and white.',
    lines: ['Printed twice a year, monochrome only', 'Contributor notes at the website', 'post@wanderlog.example'],
    website: 'wanderlog.example',
  }),
];

export default pages;
