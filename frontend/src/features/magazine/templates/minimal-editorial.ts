import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Warm off-white paper, brass accent, high-contrast serif display. */
const p: Palette = {
  bg: '#FBFAF7',
  ink: '#15120F',
  muted: '#78716A',
  deep: '#15120F',
  accent: '#B08D57',
  onAccent: '#FFFFFF',
  frameFrom: '#EAE4DA',
  frameTo: '#CBC2B5',
  line: '#E3DDD4',
};

const t: Typeset = {
  display: 'Cormorant Garamond',
  displayWeight: 600,
  displayTracking: -0.5,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverMinimal({
    p,
    t,
    c: {
      masthead: 'Quiet Matter',
      kicker: 'Issue Nº 12',
      headline: 'A slower look at the objects, rooms and rituals we live with every day.',
      issue: 'Spring / Summer',
      footer: 'quietmatter.studio',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'The Long Table', note: 'Why the kitchen became the room we design around.' },
      { no: '02', title: 'Light Studies', note: 'Six windows, photographed across one afternoon.' },
      { no: '03', title: 'Made to Last', note: 'A workshop that still repairs what it sells.' },
      { no: '04', title: 'Paper & Ink', note: 'Small press printing in an all-digital decade.' },
      { no: '05', title: 'Field Notes', note: 'Reading, listening and looking this season.' },
    ],
  }),
  L.introLetter({
    p,
    t,
    kicker: 'Editor’s Letter',
    title: 'On keeping less, and keeping it longer',
    dropCap: 'W',
    paragraphs: [
      'We started this issue with a simple question: what do we actually reach for? Not the things we photograph, but the ones with worn handles and faded corners.',
      'The answers were unglamorous and oddly moving. A chipped bowl. A coat rehemmed twice. A lamp carried through four apartments. None of it was bought as an investment, and all of it outlasted the things that were.',
      'So this issue is about staying power — in materials, in makers, and in the habits that quietly shape a room. It is a little slower than usual, and we think that suits it.',
    ],
    signature: 'Editor in Chief',
    quote: '“The best objects are the ones you stop noticing, then can’t replace.”',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Feature',
    headline: 'The long table, and the room built around it',
    standfirst: 'Once a place to eat, the kitchen table now holds homework, invoices and everything in between. Three households on designing for real life.',
    columns: [
      'The table arrived before the chairs, and before the walls were even painted. It set the length of the room, the height of the shelves and, eventually, the rhythm of the mornings that happen around it.\n\nIt is four metres of untreated oak, and it was never meant to stay pristine. Water rings appeared in the first week. The family stopped flinching by the second.',
      'What follows is not a lesson in restraint but in tolerance — for marks, for wear, for the fact that a surface used daily will look used daily.\n\nOil it twice a year, sand it every few, and it improves. That is a rare quality in furniture, and rarer still in anything else we buy for a home.',
    ],
    caption: 'Photography — Studio North',
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Light Studies',
    title: 'Six windows, one afternoon',
    caption: 'Shot between two and six o’clock, without additional lighting or reflectors.',
  }),
  L.quotePage({
    p,
    t,
    quote: 'We stopped asking whether it was new, and started asking whether it would still be here in twenty years.',
    name: 'Hanne Aas',
    role: 'Furniture maker, Bergen',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Objects',
    intro: 'Nine pieces chosen for how they age rather than how they photograph.',
    captions: ['Oak and linen, workshop floor', 'Hand-thrown stoneware', 'Brass, unlacquered', 'Paper samples', 'Wool in progress'],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Quiet Matter',
    tagline: 'A quarterly about the things we keep.',
    lines: ['Printed in small runs on uncoated stock', 'Subscriptions open twice a year', 'hello@quietmatter.studio'],
    website: 'quietmatter.studio',
  }),
];

export default pages;
