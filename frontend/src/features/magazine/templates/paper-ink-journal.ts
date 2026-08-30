import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Uncoated paper white and printer's black — a minimal print-craft journal. */
const p: Palette = {
  bg: '#FAF9F6',
  ink: '#161513',
  muted: '#6F6C64',
  deep: '#0A0A08',
  accent: '#8A1F11',
  onAccent: '#FAF9F6',
  frameFrom: '#E7E5DE',
  frameTo: '#C1BDB0',
  line: '#E4E2DA',
};

const t: Typeset = {
  display: 'Cutive',
  displayWeight: 400,
  displayTracking: 0,
  body: 'Bitter',
  kicker: 'Courier Prime',
  kickerWeight: 400,
};

const pages: PageDraft[] = [
  L.coverMinimal({
    p,
    t,
    c: {
      masthead: 'Impression',
      kicker: 'A journal about print',
      headline: 'On the letterpress that refuses to become obsolete',
      issue: 'Issue 11 — Ink & Pressure',
      footer: 'Impression — set and printed by hand',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'The Press', note: 'A machine older than the shop it sits in.' },
      { no: '02', title: 'Type Cases', note: 'Sorting metal type by hand.' },
      { no: '03', title: 'On Paper', note: 'Why the stock matters as much as the ink.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'The Press',
    title: 'Cast iron, built in 1923, still in daily use',
    caption: 'Maintained by the same family for three generations, with parts machined by hand when they fail.',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'The Craft',
    headline: 'A machine older than the shop it sits in',
    standfirst: 'The press has outlived four owners, two relocations and one flood. It still runs a job most days.',
    columns: [
      'Setting type by hand takes roughly forty times longer than typing the same page. Nobody in the shop describes this as a drawback.\n\nThe impression left in the paper — a slight, deliberate dent from the metal type — is the entire point of the exercise.',
      'Digital printing can simulate the look. It cannot simulate the decision-making that happens when every letter costs you a physical action to place.\n\nThat friction is, the printers here will tell you, where the good decisions get made.',
    ],
    caption: 'Photographed in the print shop, working light only',
  }),
  L.quotePage({
    p,
    t,
    quote: 'The impression in the paper is not a defect to hide. It is the proof someone actually did the work.',
    name: 'Master Printer',
    role: 'Third generation',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Impression',
    tagline: 'Set, inked and printed entirely by hand.',
    lines: ['Two issues a year, small runs only', 'Workshop visits by appointment', 'press@impressionjournal.example'],
    website: 'impressionjournal.example',
  }),
];

export default pages;
