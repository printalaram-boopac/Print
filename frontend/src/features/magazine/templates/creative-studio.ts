import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Playful violet on warm off-white — a studio capabilities magazine. */
const p: Palette = {
  bg: '#F8F5FF',
  ink: '#1B1235',
  muted: '#6A5F8C',
  deep: '#120B24',
  accent: '#6D28D9',
  onAccent: '#FFFFFF',
  frameFrom: '#E4DCFB',
  frameTo: '#B9A8EE',
  line: '#E7E1F7',
};

const t: Typeset = {
  display: 'Syne',
  displayWeight: 800,
  displayTracking: -2,
  body: 'Space Grotesk',
  kicker: 'Space Grotesk',
  kickerWeight: 500,
};

const pages: PageDraft[] = [
  L.coverTypeLed({
    p,
    t,
    c: {
      masthead: 'Studio',
      kicker: 'Selected work 2026',
      headline: 'Brand, product and everything in between',
      sub: 'Nine projects, the thinking behind them, and what they cost. We have included the timelines too.',
      issue: 'Capabilities · Volume Four',
      footer: 'Studio — independent design practice',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'Selected work',
    entries: [
      { no: '01', title: 'Identity', note: 'A rebrand delivered in seven weeks.' },
      { no: '02', title: 'Product', note: 'Design system for a fintech app.' },
      { no: '03', title: 'Print', note: 'An annual report worth reading.' },
      { no: '04', title: 'Motion', note: 'Title sequence for a documentary.' },
    ],
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Case Study 01',
    headline: 'A rebrand in seven weeks, without a workshop',
    standfirst: 'No off-site, no sticky notes, no brand personality wheel. Four conversations, three routes and a decision made by the people who would live with it.',
    columns: [
      'The client had done the discovery already — twice, with two other agencies, and had the decks to prove it. What they lacked was a decision.\n\nSo we skipped straight to routes: three of them, deliberately far apart, presented flat with no narrative padding.',
      'They picked one in the second meeting. The remaining five weeks went into the unglamorous half: type licensing, a usable component library, and a forty-page guide that a junior marketer can actually follow.\n\nThat half is why it stuck.',
    ],
    caption: 'Identity, packaging and guidelines',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Work',
    intro: 'A rough cut across identity, product, print and motion from the past eighteen months.',
    captions: ['Identity — packaging', 'Product — design system', 'Print — annual report', 'Motion — title frame', 'Signage'],
  }),
  L.statsPage({
    p,
    t,
    kicker: 'How We Work',
    title: 'Small team, short timelines',
    intro: 'We take four projects at a time and put senior people on all of them. These are the numbers behind that decision.',
    stats: [
      { value: '4', label: 'Concurrent projects, maximum' },
      { value: '7 wks', label: 'Median identity project duration' },
      { value: '100%', label: 'Of work done in-house, no subcontracting' },
      { value: '9', label: 'Projects completed last year' },
    ],
    source: 'Studio project records',
  }),
  L.profileGrid({
    p,
    t,
    title: 'The Studio',
    intro: 'Four people. Everyone you meet in the pitch is on the project.',
    people: [
      { name: 'Kabir Nanda', role: 'Founder · Identity' },
      { name: 'Elle Fournier', role: 'Product Design' },
      { name: 'Tomás Rivera', role: 'Motion' },
      { name: 'Sana Qureshi', role: 'Strategy · Copy' },
    ],
  }),
  L.quotePage({
    p,
    t,
    quote: 'Most brand problems are decision problems wearing a design costume.',
    name: 'Kabir Nanda',
    role: 'Founder',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Engagements',
    headline: 'What working with us looks like',
    body: 'Projects start with a fixed scope and a fixed fee. We do not bill hourly, and we do not run open-ended retainers unless there is a genuine ongoing need.\n\nEvery engagement includes a handover session and source files. You own everything we make for you, including the working files.',
    facts: [
      { label: 'Typical project fee', value: 'From ₹6L' },
      { label: 'Booking lead time', value: '4–6 weeks' },
      { label: 'Files handed over', value: 'All source' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Studio',
    tagline: 'Independent design practice. Four people, senior work.',
    lines: ['New projects: hello@studio.example', 'Currently booking eight weeks out', 'Full portfolio on request'],
    website: 'studio.example',
  }),
];

export default pages;
