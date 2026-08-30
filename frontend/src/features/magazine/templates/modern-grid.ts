import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Swiss grid discipline with a single saturated red — modular and exact. */
const p: Palette = {
  bg: '#FFFFFF',
  ink: '#111111',
  muted: '#666666',
  deep: '#0A0A0A',
  accent: '#E11D48',
  onAccent: '#FFFFFF',
  frameFrom: '#ECECEC',
  frameTo: '#C4C4C4',
  line: '#111111',
};

const t: Typeset = {
  display: 'Archivo Narrow',
  displayWeight: 700,
  displayTracking: -1,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 700,
};

const pages: PageDraft[] = [
  L.coverSplit({
    p,
    t,
    c: {
      masthead: 'Grid',
      kicker: 'Systems · Layout · Method',
      headline: 'Twelve columns, one baseline, and everything that follows from it.',
      issue: 'Issue 12 · Modular',
      footer: 'Grid — a journal of layout',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'The Baseline', note: 'Why the grid starts with the text, not the page.' },
      { no: '02', title: 'Twelve Columns', note: 'What you gain, and what you give up.' },
      { no: '03', title: 'Modular Scale', note: 'Sizing type without guessing.' },
      { no: '04', title: 'Breaking It', note: 'When to leave the grid deliberately.' },
    ],
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Method',
    headline: 'The grid starts with the text, not the page',
    standfirst: 'Set the body size and leading first. Everything else — margins, columns, image heights — resolves from there without a single arbitrary number.',
    columns: [
      'Choose a body size that reads comfortably at arm’s length. Set the leading. That measurement is now the smallest unit in the document, and every vertical dimension becomes a multiple of it.\n\nMargins included.',
      'The result is a page where nothing sits at a value you cannot justify. Images align to the baseline. Captions hang consistently. Headings occupy whole numbers of lines.\n\nIt is more constrained and considerably faster.',
    ],
    caption: 'Set on a 12-column grid, 8pt baseline',
  }),
  L.statsPage({
    p,
    t,
    kicker: 'The System',
    title: 'Four numbers run this page',
    intro: 'Every measurement in this issue derives from the four values below. There are no exceptions and no eyeballed spacing.',
    stats: [
      { value: '12', label: 'Columns across the text block' },
      { value: '8 pt', label: 'Baseline grid increment' },
      { value: '1.5', label: 'Modular scale ratio for headings' },
      { value: '56 pt', label: 'Outer margin, all four sides' },
    ],
    source: 'Specification — Grid Issue 12',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Applied',
    intro: 'The same system applied across print, screen, signage and packaging.',
    captions: ['Editorial spread', 'Screen layout', 'Wayfinding', 'Packaging net', 'Poster series'],
  }),
  L.timelinePage({
    p,
    t,
    kicker: 'Process',
    title: 'Building the system',
    entries: [
      { year: '01', title: 'Set the body', text: 'Body size and leading chosen first, tested in print at final size.' },
      { year: '02', title: 'Derive the grid', text: 'Column count and margins calculated from the text block, not the trim.' },
      { year: '03', title: 'Scale the headings', text: 'A single ratio generates every display size in the document.' },
      { year: '04', title: 'Document it', text: 'One page of rules, so the next person does not re-guess.' },
    ],
  }),
  L.quotePage({
    p,
    t,
    quote: 'A grid does not make design decisions for you. It removes the ones that were never worth making.',
    name: 'Hana Vogel',
    role: 'Editor, Grid',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Grid',
    tagline: 'A journal about layout, set to its own rules.',
    lines: ['Three issues a year', 'Specimen pages available on request', 'editor@grid.example'],
    website: 'grid.example',
  }),
];

export default pages;
