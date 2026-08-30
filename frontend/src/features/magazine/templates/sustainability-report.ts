import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Forest green and warm white — a corporate sustainability report. */
const p: Palette = {
  bg: '#F7FAF6',
  ink: '#132018',
  muted: '#5A6B5E',
  deep: '#0C140F',
  accent: '#2F6B45',
  onAccent: '#FFFFFF',
  frameFrom: '#DCEBE0',
  frameTo: '#A9CBB4',
  line: '#DEE9E1',
};

const t: Typeset = {
  display: 'Lora',
  displayWeight: 700,
  displayTracking: -0.4,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverSplit({
    p,
    t,
    c: {
      masthead: 'Horizon Group',
      kicker: 'Sustainability Report',
      headline: 'Emissions, water use and supply chain progress, verified independently',
      issue: 'Reporting Year 2025',
      footer: 'Third-party assured by an independent auditor',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'CEO Statement', note: 'Progress and where we fell short.' },
      { no: '02', title: 'Emissions', note: 'Scope 1, 2 and 3, verified.' },
      { no: '03', title: 'Water & Waste', note: 'Usage against our 2030 targets.' },
      { no: '04', title: 'Supply Chain', note: 'Supplier audits this year.' },
      { no: '05', title: 'Assurance', note: 'Independent verification statement.' },
    ],
  }),
  L.introLetter({
    p,
    t,
    kicker: 'CEO Statement',
    title: 'Progress, and where we fell short',
    dropCap: 'T',
    paragraphs: [
      'This report includes a target we missed. Our Scope 2 reduction goal for the year was 18%; we achieved 12%, primarily due to a delayed grid connection at our largest facility.',
      'We have chosen to report this plainly rather than adjust the framing, because a sustainability report that only reports success is not reporting much of anything.',
      'The pages that follow include our full emissions data, independently assured, alongside the corrective plan for the shortfall.',
    ],
    signature: 'Chief Executive Officer',
    quote: '“A target you always hit was probably not ambitious enough to begin with.”',
  }),
  L.statsPage({
    p,
    t,
    kicker: 'Emissions',
    title: 'Scope 1, 2 and 3 — verified',
    intro: 'All figures independently assured by a third-party auditor against the GHG Protocol. Full methodology in the appendix.',
    stats: [
      { value: '-12%', label: 'Scope 2 reduction against last year (target: -18%)' },
      { value: '-24%', label: 'Scope 1 reduction, ahead of target' },
      { value: '61%', label: 'Of Scope 3 emissions now mapped to supplier level' },
      { value: '340 GWh', label: 'Renewable electricity procured this year' },
    ],
    source: 'Independently assured — see appendix for methodology',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Supply Chain',
    headline: 'Ninety-four supplier audits, six suspensions',
    body: 'Every tier-one supplier is audited annually against our code of conduct. This year, six suppliers were suspended pending corrective action; two have since been reinstated after verified remediation.\n\nAudit findings, anonymised, are published in full in the appendix rather than summarised as a single compliance percentage.',
    facts: [
      { label: 'Supplier audits completed', value: '94' },
      { label: 'Suspensions issued', value: '6' },
      { label: 'Reinstated after remediation', value: '2' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Horizon Group',
    tagline: 'Reporting progress honestly, including the shortfalls.',
    lines: ['Full methodology available at horizongroup.example/report', 'Assurance statement in the appendix', 'sustainability@horizongroup.example'],
    website: 'horizongroup.example',
  }),
];

export default pages;
