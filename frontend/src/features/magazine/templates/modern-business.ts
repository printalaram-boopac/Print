import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Confident blue, clean grid, geometric sans — a modern business review. */
const p: Palette = {
  bg: '#FFFFFF',
  ink: '#101828',
  muted: '#5A6473',
  deep: '#0B1F3A',
  accent: '#1B4965',
  onAccent: '#FFFFFF',
  frameFrom: '#D7E3EC',
  frameTo: '#AFC4D4',
  line: '#E4E8ED',
};

const t: Typeset = {
  display: 'Space Grotesk',
  displayWeight: 700,
  displayTracking: -1.2,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverSplit({
    p,
    t,
    c: {
      masthead: 'Forward',
      kicker: 'Growth · Strategy · Operations',
      headline: 'How eleven mid-market teams rebuilt their operating model in a single year.',
      issue: 'Q3 Business Review',
      footer: 'Forward Review — Issue 14',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Inside',
    entries: [
      { no: '01', title: 'The Operating Model', note: 'What changed, and what it cost to change it.' },
      { no: '02', title: 'Pricing Reset', note: 'Three companies that raised prices and kept customers.' },
      { no: '03', title: 'Hiring Slowly', note: 'Headcount discipline as a growth strategy.' },
      { no: '04', title: 'By The Numbers', note: 'Benchmarks from 240 mid-market operators.' },
      { no: '05', title: 'The Long View', note: 'What the next four quarters demand.' },
    ],
  }),
  L.statsPage({
    p,
    t,
    kicker: 'Benchmark Report',
    title: 'The year in four numbers',
    intro: 'Collected from 240 operators across services, software and light manufacturing between January and September.',
    stats: [
      { value: '38%', label: 'Reported margin improvement after pricing reset' },
      { value: '2.4x', label: 'Revenue per employee at disciplined hirers' },
      { value: '11 wks', label: 'Median time to close a process redesign' },
      { value: '64%', label: 'Now review unit economics monthly' },
    ],
    source: 'Source — Forward Operator Survey',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Cover Story',
    headline: 'The quiet work of rebuilding how a company runs',
    standfirst: 'No rebrand, no restructure announcement. Just eleven teams that changed the way decisions get made — and measured what happened next.',
    columns: [
      'The pattern was consistent. Each team started by writing down how a decision actually travelled: who raised it, who blocked it, how long it waited. The document was uncomfortable and, in every case, longer than expected.\n\nOnly then did anything change.',
      'Six months in, the visible artefacts were unremarkable — a shorter weekly meeting, a single owner per metric, a written pricing rule. The results were not.\n\nMargin moved before headcount did, which is the opposite of how most of these programmes are sold.',
    ],
    caption: 'Reporting — Forward Research Desk',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Case Study',
    headline: 'A pricing reset that customers barely noticed',
    body: 'The company had not changed list price in four years. It raised effective price by 14% over two quarters using packaging, not percentages — moving three high-cost features into a higher tier and grandfathering the twelve accounts most likely to churn.\n\nRetention held. The finance team now runs the same review every October.',
    facts: [
      { label: 'Effective price change', value: '+14%' },
      { label: 'Logo retention, 12 months', value: '96%' },
      { label: 'Accounts grandfathered', value: '12' },
    ],
  }),
  L.timelinePage({
    p,
    t,
    kicker: 'How It Happened',
    title: 'Twelve months, four decisions',
    entries: [
      { year: 'Q1', title: 'Map the decisions', text: 'Documented how twenty recurring decisions actually moved through the company.' },
      { year: 'Q2', title: 'Single owners', text: 'Every core metric assigned one accountable owner, published internally.' },
      { year: 'Q3', title: 'Pricing rule', text: 'Discount authority written down and capped by deal size.' },
      { year: 'Q4', title: 'Review cadence', text: 'Monthly unit-economics review replaced the quarterly deck.' },
    ],
  }),
  L.quotePage({
    p,
    t,
    quote: 'We did not need a new strategy. We needed to stop re-deciding the same six things every month.',
    name: 'Priya Raghavan',
    role: 'Chief Operating Officer',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Forward',
    tagline: 'A quarterly review for operators.',
    lines: ['Subscriber edition — not for redistribution', 'Research enquiries: desk@forward.example', 'Published four times a year'],
    website: 'forward.example',
  }),
];

export default pages;
