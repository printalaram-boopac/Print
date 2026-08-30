import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Pure monochrome: no colour at all, contrast doing all the work. */
const p: Palette = {
  bg: '#0A0A0A',
  ink: '#FFFFFF',
  muted: '#9A9A9A',
  deep: '#000000',
  accent: '#FFFFFF',
  onAccent: '#0A0A0A',
  frameFrom: '#2E2E2E',
  frameTo: '#0C0C0C',
  line: '#2A2A2A',
};

const t: Typeset = {
  display: 'Cormorant Garamond',
  displayWeight: 300,
  displayTracking: 0,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 500,
};

const pages: PageDraft[] = [
  L.coverFullBleed({
    p,
    t,
    c: {
      masthead: 'Noir',
      kicker: 'Black and white only',
      headline: 'Grain, contrast, silence',
      sub: 'Twenty-eight photographs printed without a single colour value between them.',
      issue: 'Edition Two',
      footer: 'Noir — printed in duotone black',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Plates',
    entries: [
      { no: 'I', title: 'Interiors', note: 'Rooms photographed without people in them.' },
      { no: 'II', title: 'Water', note: 'Long exposures, coastal, winter.' },
      { no: 'III', title: 'Hands', note: 'Portraits cropped to the gesture.' },
      { no: 'IV', title: 'Night', note: 'Available light, pushed two stops.' },
      { no: 'V', title: 'Notes', note: 'Film stock, developer, printing times.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Plate I',
    title: 'Empty room, morning',
    caption: 'Medium format, ISO 100, developed in D-76 at 1:1 for eleven minutes.',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Interiors',
    intro: 'Five rooms, photographed at the hour each receives its only direct light.',
    captions: ['Stairwell, north light', 'Kitchen, 07:40', 'Corridor', 'Window, half shuttered', 'Doorway'],
  }),
  L.quotePage({
    p,
    t,
    quote: 'Remove the colour and what is left is either composition or nothing at all.',
    name: 'Plate Notes',
    role: 'Edition Two',
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Plate II',
    title: 'Water, four minutes',
    caption: 'Neutral density stack, four-minute exposure, printed on fibre-based paper.',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Technical',
    headline: 'Stock, developer, printing times',
    body: 'Everything in this edition was shot on two film stocks and developed in the same chemistry, so the tonal range stays consistent from plate to plate.\n\nPrints were made at grade two with minimal dodging. Where burning was necessary it is noted against the plate.',
    facts: [
      { label: 'Film stocks used', value: '2' },
      { label: 'Plates in edition', value: '28' },
      { label: 'Print grade', value: 'II' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Noir',
    tagline: 'Twenty-eight plates, no colour, no cropping after the fact.',
    lines: ['Edition of one hundred and fifty', 'Signed copies from the studio', 'plates@noir.example'],
    website: 'noir.example',
  }),
];

export default pages;
