import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Playful coral and cream — an annual illustration showcase. */
const p: Palette = {
  bg: '#FFF6F1',
  ink: '#331F14',
  muted: '#8A6E5C',
  deep: '#241407',
  accent: '#F2603C',
  onAccent: '#FFFFFF',
  frameFrom: '#F7E2D3',
  frameTo: '#EFC0A0',
  line: '#F3E1D3',
};

const t: Typeset = {
  display: 'Poppins',
  displayWeight: 700,
  displayTracking: -0.8,
  body: 'Inter',
  kicker: 'Poppins',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverTypeLed({
    p,
    t,
    c: {
      masthead: 'Ink & Colour',
      kicker: 'The annual',
      headline: 'Twenty-eight illustrators, one theme, zero rules about how to interpret it',
      sub: 'This year’s prompt was “weather.” The results were nothing like each other.',
      issue: 'Annual 2026',
      footer: 'Ink & Colour — an open-call anthology',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'Selected Work',
    entries: [
      { no: '01', title: 'Storm Series', note: 'Six plates, one storyline.' },
      { no: '02', title: 'Sun Studies', note: 'Gouache, working from memory.' },
      { no: '03', title: 'Process Notes', note: 'From sketch to final plate.' },
      { no: '04', title: 'Contributors', note: 'Twenty-eight artists, one theme.' },
    ],
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Storm Series',
    intro: 'Six plates telling one loose story, submitted as a single sequence.',
    captions: ['Plate one', 'Plate two', 'Plate three', 'Plate four', 'Plate five'],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Sun Studies',
    title: 'Gouache, working entirely from memory',
    caption: 'No reference photos used — every study painted from recollection of a single afternoon.',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Process',
    headline: 'From sketch to final plate',
    body: 'Every contributor submitted three stages: the rough thumbnail, the tighter sketch, and the finished plate. Seeing all three side by side was, for many readers, the most instructive part of the annual.\n\nNo two artists worked the same way, which was rather the point of asking.',
    facts: [
      { label: 'Contributors', value: '28' },
      { label: 'Countries represented', value: '11' },
      { label: 'Submission theme', value: 'Weather' },
    ],
  }),
  L.profileGrid({
    p,
    t,
    title: 'Contributors',
    intro: 'A selection of the twenty-eight illustrators featured in this year’s annual.',
    people: [
      { name: 'Noor Faisal', role: 'Storm Series' },
      { name: 'Iida Salo', role: 'Sun Studies' },
      { name: 'Emeka Obi', role: 'Contributor' },
      { name: 'Yuki Hasegawa', role: 'Contributor' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Ink & Colour',
    tagline: 'An open-call illustration annual, published once a year.',
    lines: ['Next call for entries opens January', 'No entry fee, ever', 'submit@inkandcolour.example'],
    website: 'inkandcolour.example',
  }),
];

export default pages;
