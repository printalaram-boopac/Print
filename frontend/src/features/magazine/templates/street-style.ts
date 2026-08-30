import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Raw concrete grey with a hot pink jolt — street fashion, unpolished on purpose. */
const p: Palette = {
  bg: '#EDEBE8',
  ink: '#161616',
  muted: '#5A5652',
  deep: '#0A0A0A',
  accent: '#FF2D6B',
  onAccent: '#FFFFFF',
  frameFrom: '#D8D5D0',
  frameTo: '#9C978F',
  line: '#D2CFC9',
};

const t: Typeset = {
  display: 'Anton',
  displayWeight: 400,
  displayTracking: -1,
  body: 'Space Grotesk',
  kicker: 'Space Grotesk',
  kickerWeight: 700,
};

const pages: PageDraft[] = [
  L.coverSplit({
    p,
    t,
    c: {
      masthead: 'Concrete',
      kicker: 'Street style · No studio, no rules',
      headline: 'Shot on the block, not the runway. Twelve looks from the city that made them.',
      issue: 'Issue 08 — Sidewalk Season',
      footer: 'Concrete Zine — self-published',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'This Drop',
    entries: [
      { no: '01', title: 'Corner Shots', note: 'Unposed, unpaid, unbothered.' },
      { no: '02', title: 'The Reissue', note: 'A 2003 jacket, back in rotation.' },
      { no: '03', title: 'Skate Crew', note: 'Six kids, one camera, one afternoon.' },
      { no: '04', title: 'Thrift Run', note: 'Best finds under 500 rupees.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Corner Shots',
    title: 'Nobody asked, everybody posed',
    caption: 'Photographed outside the metro station, 6pm, no direction given.',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'The Reissue',
    headline: 'A jacket from 2003 is back, and nobody planned it',
    standfirst: 'It resurfaced on three different people in the same week. We asked why.',
    columns: [
      'None of them bought it new. One found it at a family cleanout, one at a stall, one just never stopped wearing it.\n\nThat is the whole trend cycle now — not a runway, a wardrobe nobody threw out.',
      'The brand stopped making the exact cut years ago. Resale prices tripled the moment someone tagged it.\n\nWe are not telling you where to find one. That would ruin it.',
    ],
    caption: 'Photographed on the street, not in a studio',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Skate Crew',
    intro: 'Six kids, one camera, one Sunday afternoon at the old car park.',
    captions: ['Warm-up', 'The fall', 'Still going', 'Home run', 'Last light'],
  }),
  L.quotePage({
    p,
    t,
    quote: 'We are not styling anyone. We are just paying attention.',
    name: 'Zine Crew',
    role: 'Concrete, issue 08',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Concrete',
    tagline: 'Street style, printed cheap, sold out fast.',
    lines: ['Photocopied and stapled, on purpose', 'Submissions: dm us, we mean it', 'Next drop unannounced'],
    website: 'concretezine.example',
  }),
];

export default pages;
