import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Crisp white with electric indigo — a startup metrics digest. */
const p: Palette = {
  bg: '#FFFFFF',
  ink: '#121225',
  muted: '#5F5F78',
  deep: '#0A0A18',
  accent: '#4338CA',
  onAccent: '#FFFFFF',
  frameFrom: '#E2E1F5',
  frameTo: '#B8B6E6',
  line: '#E7E7F0',
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
  L.coverTypeLed({
    p,
    t,
    c: {
      masthead: 'Runway',
      kicker: 'Founder briefing',
      headline: 'What eighteen months of runway actually bought three startups',
      sub: 'A close read of the burn, the pivots and the one metric each team wishes they had tracked sooner.',
      issue: 'Issue 04 — Runway & Burn',
      footer: 'Runway — for operators, not spectators',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Inside',
    entries: [
      { no: '01', title: 'The Pivot', note: 'Why one team killed its own product at month nine.' },
      { no: '02', title: 'Burn Discipline', note: 'Three founders on saying no to headcount.' },
      { no: '03', title: 'Metrics That Mattered', note: 'The number each team wishes they tracked from day one.' },
      { no: '04', title: 'Fundraising Notes', note: 'What actually moved investors, in their own words.' },
    ],
  }),
  L.statsPage({
    p,
    t,
    kicker: 'The Numbers',
    title: 'Eighteen months, three companies',
    intro: 'Anonymised figures shared directly by the founders for this issue, covering the period since their seed round.',
    stats: [
      { value: '14 mo', label: 'Median runway remaining at time of interview' },
      { value: '2.1x', label: 'Revenue growth after the pivot' },
      { value: '6', label: 'Headcount added in eighteen months, combined' },
      { value: '31%', label: 'Of burn spent on one mis-scoped hire' },
    ],
    source: 'Founder interviews, this issue',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Case Study',
    headline: 'Killing the product that raised the round',
    standfirst: 'The pitch deck sold investors on one product. Nine months later, the team shipped something else entirely — and grew faster because of it.',
    columns: [
      'The original product had users, but not urgency. Retention was fine; expansion revenue was flat. The team spent six weeks doing customer interviews they should have run before the raise.\n\nWhat they found reshaped the roadmap completely.',
      'The pivot was not dramatic on a slide — same customer, adjacent problem. But it meant rewriting the onboarding, the pricing, and the pitch to their own board.\n\nGrowth followed within the quarter.',
    ],
    caption: 'Interview conducted for this issue',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Discipline',
    headline: 'Saying no to the hire everyone wanted',
    body: 'Every board member suggested a VP of Sales by month six. The founder waited eleven months, and closed the first six enterprise deals herself.\n\nThe delayed hire meant the eventual job spec was written from real experience, not a template — and the first candidate accepted stayed two years.',
    facts: [
      { label: 'Months without a sales hire', value: '11' },
      { label: 'Deals closed founder-led', value: '6' },
      { label: 'Sales hire retention', value: '2 yrs+' },
    ],
  }),
  L.quotePage({
    p,
    t,
    quote: 'We had a good deck. We did not have a good answer for why now. That took nine more months to find.',
    name: 'Founder, Company B',
    role: 'Speaking on background',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Runway',
    tagline: 'Operator notes for people actually building.',
    lines: ['No sponsored content, ever', 'Founder submissions: desk@runway.example', 'Published every six weeks'],
    website: 'runway.example',
  }),
];

export default pages;
