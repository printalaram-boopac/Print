import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Soft blush and plum — a warm, contemporary lifestyle title. */
const p: Palette = {
  bg: '#FDF6F6',
  ink: '#33202B',
  muted: '#8A6C79',
  deep: '#2A1721',
  accent: '#C2185B',
  onAccent: '#FFF6F8',
  frameFrom: '#F0DCE1',
  frameTo: '#CFA9B6',
  line: '#EDDDE2',
};

const t: Typeset = {
  display: 'Playfair Display',
  displayWeight: 700,
  displayTracking: -1.2,
  body: 'Poppins',
  kicker: 'Poppins',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverSplit({
    p,
    t,
    c: {
      masthead: 'Everyday',
      kicker: 'Home · People · Small pleasures',
      headline: 'The weekend issue: slower mornings, shorter to-do lists, better coffee.',
      issue: 'April — The Weekend Issue',
      footer: 'Everyday — Issue 31',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'This Month',
    entries: [
      { no: '01', title: 'Slow Mornings', note: 'Five people on their first hour awake.' },
      { no: '02', title: 'One Room', note: 'A rental transformed for very little.' },
      { no: '03', title: 'The Long Lunch', note: 'A menu you can leave unattended.' },
      { no: '04', title: 'Small Pleasures', note: 'Twelve things worth the money.' },
    ],
  }),
  L.introLetter({
    p,
    t,
    kicker: 'Letter',
    title: 'In praise of the unremarkable weekend',
    dropCap: 'S',
    paragraphs: [
      'Somewhere along the way the weekend became a project. Two days to optimise, document and, ideally, post about. This issue is a small argument against that.',
      'We asked five people to describe their first hour awake on a Saturday. Nobody mentioned a routine, a stack or a protocol. They mentioned toast, a specific chair, and the radio being on but not listened to.',
      'It made for the least aspirational feature we have ever run, and the one most people wrote in about.',
    ],
    signature: 'The Editors',
    quote: '“A good weekend leaves almost nothing to report.”',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'At Home',
    headline: 'One rented room, changed for the price of a dinner out',
    standfirst: 'No drilling, no landlord conversations, no new furniture. Just paint samples, a rug and a rethink of where the lamp goes.',
    columns: [
      'The room had one window, a radiator in the worst possible place and a colour best described as landlord magnolia. Three things changed it, and only one cost real money.\n\nThe rug came first, and did most of the work.',
      'Moving the lamp to the corner turned the only comfortable chair into a place people actually sit. Two paint samples on the wall behind the bed did the rest.\n\nTotal spend: less than a good dinner for two.',
    ],
    caption: 'Photography — at home, Saturday',
  }),
  L.productShowcase({
    p,
    t,
    title: 'Small pleasures',
    intro: 'Three things we bought this month and would buy again without hesitating.',
    items: [
      { name: 'Enamel Coffee Pot', price: '₹1,850', note: 'Holds three cups, pours without dribbling, and looks better after a year than it did new.' },
      { name: 'Linen Table Runner', price: '₹1,200', note: 'Washes soft, creases honestly, and makes a weekday dinner feel deliberate.' },
      { name: 'Reading Lamp', price: '₹3,400', note: 'Warm bulb, heavy base, and an arm that stays exactly where you put it.' },
    ],
    footnote: 'Nothing on this page is sponsored or gifted',
  }),
  L.quotePage({
    p,
    t,
    quote: 'I stopped trying to make Saturday count for something, and it started counting for a lot.',
    name: 'Meera Iyer',
    role: 'Reader, Bengaluru',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'The Long Lunch',
    intro: 'One table, four dishes and a timeline that survives guests arriving late.',
    captions: ['The table, before', 'Bread and butter', 'Salad, dressed late', 'Something slow-cooked', 'Afternoon, later'],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Everyday',
    tagline: 'A monthly about ordinary life, taken seriously.',
    lines: ['Subscribe for twelve issues a year', 'Letters welcome: post@everyday.example', 'Printed in India'],
    website: 'everyday.example',
  }),
];

export default pages;
