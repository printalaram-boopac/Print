import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Bright lab-white with a violet signal accent — a fast-moving tech briefing. */
const p: Palette = {
  bg: '#FAFAFC',
  ink: '#16161F',
  muted: '#5C5C6E',
  deep: '#0A0A12',
  accent: '#7C3AED',
  onAccent: '#FFFFFF',
  frameFrom: '#E7E1FB',
  frameTo: '#BDA9F4',
  line: '#E6E5EE',
};

const t: Typeset = {
  display: 'Syne',
  displayWeight: 800,
  displayTracking: -1.8,
  body: 'Inter',
  kicker: 'Space Grotesk',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverTypeLed({
    p,
    t,
    c: {
      masthead: 'Compute',
      kicker: 'Weekly briefing',
      headline: 'The model nobody benchmarked correctly',
      sub: 'Why last week’s leaderboard result did not hold up, and what three labs are quietly changing because of it.',
      issue: 'Week 33',
      footer: 'Compute — read by people who ship',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'This Week',
    entries: [
      { no: '01', title: 'The Benchmark Problem', note: 'A leaderboard result that did not replicate.' },
      { no: '02', title: 'Inference Costs', note: 'Why the price per token keeps splitting.' },
      { no: '03', title: 'Three Labs, Quietly', note: 'Changes nobody announced with a blog post.' },
      { no: '04', title: 'What to Read', note: 'Four papers worth your weekend.' },
    ],
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Cover Story',
    headline: 'A leaderboard result that did not survive contact with production',
    standfirst: 'The benchmark was real. The conditions that produced it were not the conditions anyone actually runs in.',
    columns: [
      'The eval suite tested single-turn responses on a fixed prompt template. Production traffic is multi-turn, adversarially varied, and rarely matches the template within the first exchange.\n\nThree teams reproduced the gap independently within a week.',
      'None of this makes the model bad. It makes the leaderboard a worse proxy than the industry has been treating it as, and at least two labs have quietly stopped citing it in their own materials.\n\nThat is the actual story.',
    ],
    caption: 'Reporting — Compute research desk',
  }),
  L.statsPage({
    p,
    t,
    kicker: 'Inference',
    title: 'The price per token, splitting',
    intro: 'Cost data gathered from public pricing pages across the six most-cited providers, tracked weekly since launch.',
    stats: [
      { value: '6x', label: 'Spread between cheapest and priciest comparable model' },
      { value: '38%', label: 'Drop in cost for mid-tier models this quarter' },
      { value: '4', label: 'Providers now offering usage-based caching' },
      { value: '2', label: 'Labs that quietly dropped list price without an announcement' },
    ],
    source: 'Source — public pricing pages, this week',
  }),
  L.quotePage({
    p,
    t,
    quote: 'The benchmark told us what the model could do once. It never told us what it would do a thousand times.',
    name: 'Research note',
    role: 'Compute, week 33',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Compute',
    tagline: 'A weekly briefing for people who ship, not just watch.',
    lines: ['No sponsored placements', 'Tips: desk@compute.example', 'Published every Friday'],
    website: 'compute.example',
  }),
];

export default pages;
