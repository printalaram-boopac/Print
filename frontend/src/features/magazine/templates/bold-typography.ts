import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Type as the image: acid yellow, heavy black display, minimal photography. */
const p: Palette = {
  bg: '#F2F2EF',
  ink: '#000000',
  muted: '#4D4D4D',
  deep: '#000000',
  accent: '#D9F000',
  onAccent: '#000000',
  frameFrom: '#D8D8D2',
  frameTo: '#9C9C96',
  line: '#111111',
};

const t: Typeset = {
  display: 'Anton',
  displayWeight: 400,
  displayTracking: -1.5,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 700,
};

const pages: PageDraft[] = [
  L.coverTypeLed({
    p,
    t,
    c: {
      masthead: 'Loud',
      kicker: 'Type issue',
      headline: 'Set it big or do not set it at all',
      sub: 'Forty pages on display typography, the people who draw it, and the billboards that ruined it for everyone.',
      issue: 'No. 05',
      footer: 'Loud — a magazine about letters',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'Big Type', note: 'When scale is the whole idea.' },
      { no: '02', title: 'Drawn by Hand', note: 'Three lettering artists at work.' },
      { no: '03', title: 'Street Level', note: 'Signage that survived the decade.' },
      { no: '04', title: 'Specimens', note: 'Nine faces, set at full size.' },
    ],
  }),
  L.quotePage({
    p,
    t,
    quote: 'Type is not decoration. It is the sound of the sentence, made visible.',
    name: 'Marta Nowak',
    role: 'Type designer',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Feature',
    headline: 'Scale is an argument, not a style',
    standfirst: 'Setting something at 300 point does not make it important. It makes it loud. Knowing the difference is most of the job.',
    columns: [
      'Every designer learns the trick early: make it bigger and it feels more confident. The trick works exactly once per page, and most layouts spend it in the wrong place.\n\nThe restraint is in what stays small.',
      'The best display work on these pages is surrounded by things that refused to compete — captions at nine point, rules at a hairline, whitespace nobody tried to fill.\n\nLoud only reads as loud next to quiet.',
    ],
    caption: 'Specimens set in Anton and Inter',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Specimens',
    intro: 'Nine display faces photographed as printed proofs rather than screenshots.',
    captions: ['Proof, 300pt', 'Wood type, letterpress', 'Hand-drawn sign', 'Stencil, spray', 'Neon, off'],
  }),
  L.profileGrid({
    p,
    t,
    title: 'Drawn by hand',
    intro: 'Three lettering artists and one type designer, photographed in their studios.',
    people: [
      { name: 'Marta Nowak', role: 'Type design · Warsaw' },
      { name: 'Devon Clarke', role: 'Sign painting · Leeds' },
      { name: 'Riya Kapoor', role: 'Lettering · Mumbai' },
      { name: 'Owen Baptiste', role: 'Letterpress · Port of Spain' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Street Level',
    title: 'Signage that outlived the shop',
    caption: 'Photographed across four cities. Most of these fascias have outlasted at least two businesses.',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Loud',
    tagline: 'A magazine about letters, set as large as the page allows.',
    lines: ['Printed letterpress on the cover', 'Two issues a year, no more', 'set@loud.example'],
    website: 'loud.example',
  }),
];

export default pages;
