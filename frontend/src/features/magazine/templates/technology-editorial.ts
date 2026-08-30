import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Ink-dark stage with electric accent — a technology long-read. */
const p: Palette = {
  bg: '#0E1117',
  ink: '#E9EDF5',
  muted: '#8C97A8',
  deep: '#05070B',
  accent: '#3B82F6',
  onAccent: '#FFFFFF',
  frameFrom: '#1E2634',
  frameTo: '#0B0F16',
  line: '#212936',
};

const t: Typeset = {
  display: 'Space Grotesk',
  displayWeight: 700,
  displayTracking: -1.6,
  body: 'Inter',
  kicker: 'Space Grotesk',
  kickerWeight: 500,
};

const pages: PageDraft[] = [
  L.coverTypeLed({
    p,
    t,
    c: {
      masthead: 'Signal',
      kicker: 'Long reads',
      headline: 'The infrastructure nobody budgeted for',
      sub: 'Four engineering teams on the systems they inherited, the ones they replaced, and the ones they are still apologising for.',
      issue: 'Issue 23 — Systems',
      footer: 'Signal — independent technology writing',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'The Migration', note: 'Eighteen months, two rollbacks, one very long weekend.' },
      { no: '02', title: 'Cost of Latency', note: 'What forty milliseconds actually bought.' },
      { no: '03', title: 'On Call', note: 'Rotations that work, and why most do not.' },
      { no: '04', title: 'Deprecation', note: 'Killing an API with three thousand consumers.' },
      { no: '05', title: 'Benchmarks', note: 'Numbers from 180 engineering teams.' },
    ],
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Cover Story',
    headline: 'Eighteen months to move one database',
    standfirst: 'It was scoped at a quarter. Here is where the time actually went, told by the four engineers who lived it.',
    columns: [
      'The estimate was not wrong about the migration. It was wrong about everything attached to it: the reporting jobs nobody owned, the two services reading from a replica directly, the column that six years of code assumed was never null.\n\nAll of it surfaced in week three.',
      'The team shipped a dual-write path, ran both stores for four months, and reconciled nightly. Twice they rolled back within an hour of cutover.\n\nThe third attempt worked, at 04:00 on a Sunday, and nobody outside the team noticed. That was the goal.',
    ],
    caption: 'Reporting — Signal engineering desk',
  }),
  L.statsPage({
    p,
    t,
    kicker: 'Benchmarks',
    title: 'What 180 teams told us',
    intro: 'Self-reported figures from engineering leads at companies between 20 and 2,000 people, collected over six weeks.',
    stats: [
      { value: '3.1x', label: 'Median overrun on migration estimates' },
      { value: '47%', label: 'Have no owner listed for at least one production service' },
      { value: '12 min', label: 'Median time to first human response on page' },
      { value: '2.4', label: 'Average rollbacks per major cutover' },
    ],
    source: 'Source — Signal Engineering Survey',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Deep Dive',
    headline: 'How to deprecate an API with three thousand consumers',
    body: 'The team published a sunset date eleven months out, instrumented every endpoint by consumer, and then did the unglamorous work: contacting the top two hundred callers individually.\n\nBy the shutdown date, traffic had fallen by 98.6%. The remaining calls came from four internal cron jobs and one integration that had been abandoned for two years.',
    facts: [
      { label: 'Notice period', value: '11 months' },
      { label: 'Traffic reduction at cutoff', value: '98.6%' },
      { label: 'Consumers contacted directly', value: '200' },
    ],
  }),
  L.quotePage({
    p,
    t,
    quote: 'Every system you inherit was a reasonable decision under constraints you cannot see any more.',
    name: 'Dana Okoro',
    role: 'Principal Engineer',
  }),
  L.timelinePage({
    p,
    t,
    kicker: 'Post-mortem',
    title: 'The migration, week by week',
    entries: [
      { year: 'W3', title: 'Unknowns surface', text: 'Two services found reading the replica directly; neither had an owner.' },
      { year: 'W9', title: 'Dual write', text: 'Both stores live, nightly reconciliation catching drift within tolerance.' },
      { year: 'W31', title: 'Rollback, twice', text: 'Cutover reverted within the hour on two consecutive attempts.' },
      { year: 'W74', title: 'Done quietly', text: 'Third cutover held. No external incident raised.' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Signal',
    tagline: 'Independent writing about how software actually gets built.',
    lines: ['Reader-funded, no sponsored posts', 'Pitches: desk@signal.example', 'Published monthly'],
    website: 'signal.example',
  }),
];

export default pages;
