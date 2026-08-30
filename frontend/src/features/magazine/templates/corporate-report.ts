import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Formal annual report: deep green, ruled grid, restrained serif. */
const p: Palette = {
  bg: '#FCFCFA',
  ink: '#12211C',
  muted: '#5D6B65',
  deep: '#0C1A15',
  accent: '#0F3D3E',
  onAccent: '#FFFFFF',
  frameFrom: '#D5E0DA',
  frameTo: '#A9BCB3',
  line: '#E1E6E2',
};

const t: Typeset = {
  display: 'Lora',
  displayWeight: 600,
  displayTracking: -0.4,
  body: 'Inter',
  kicker: 'Archivo Narrow',
  kickerWeight: 700,
};

const pages: PageDraft[] = [
  L.coverFramed({
    p,
    t,
    c: {
      masthead: 'Annual Report',
      kicker: 'Northgate Group',
      headline: 'Steady hands, longer horizons',
      sub: 'A review of performance, governance and the commitments we carry into next year.',
      issue: 'Financial Year 2025–26',
      footer: 'Registered in India · CIN L00000MH1998PLC000000',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'Chair’s Statement', note: 'The year in context.' },
      { no: '02', title: 'Performance', note: 'Revenue, margin and cash generation.' },
      { no: '03', title: 'Operations', note: 'Three divisions, reviewed.' },
      { no: '04', title: 'People', note: 'Leadership and workforce.' },
      { no: '05', title: 'Governance', note: 'Board composition and committees.' },
      { no: '06', title: 'Outlook', note: 'Priorities for the coming year.' },
    ],
  }),
  L.introLetter({
    p,
    t,
    kicker: 'Chair’s Statement',
    title: 'A year of consolidation',
    dropCap: 'T',
    paragraphs: [
      'This has been a year of consolidation rather than expansion. We closed two underperforming lines, reinvested in the three that carry our margin, and finished with a stronger balance sheet than we started.',
      'Revenue grew modestly. More importantly, the quality of that revenue improved: longer contracts, better payment terms and a customer concentration ratio that finally moved in the right direction.',
      'The board thanks our colleagues for absorbing a demanding programme of change with patience, and our shareholders for judging us over a period longer than a single quarter.',
    ],
    signature: 'Chair of the Board',
    quote: '“We would rather grow slowly than explain quickly.”',
  }),
  L.statsPage({
    p,
    t,
    kicker: 'Performance',
    title: 'Results at a glance',
    intro: 'Figures are audited and stated on a continuing-operations basis. Comparatives have been restated where divisions were reclassified.',
    stats: [
      { value: '₹482 Cr', label: 'Revenue from continuing operations' },
      { value: '18.4%', label: 'Operating margin, up 220 basis points' },
      { value: '₹96 Cr', label: 'Free cash flow generated' },
      { value: '0.42x', label: 'Net debt to EBITDA at year end' },
    ],
    source: 'Audited financial statements, FY 2025–26',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Operations',
    headline: 'Three divisions, reviewed line by line',
    body: 'Each division was assessed against return on capital rather than revenue growth. Two met the threshold comfortably, one required a restructuring provision recognised in the second half.\n\nThe review process is now annual and forms part of the capital allocation framework approved by the board in March.',
    facts: [
      { label: 'Divisions reviewed', value: '3' },
      { label: 'Return on capital employed', value: '16.1%' },
      { label: 'Capital expenditure', value: '₹54 Cr' },
    ],
  }),
  L.profileGrid({
    p,
    t,
    title: 'Board of Directors',
    intro: 'Composition as at the end of the financial year, including two independent appointments made in August.',
    people: [
      { name: 'S. Krishnamurthy', role: 'Chair' },
      { name: 'Ananya Bose', role: 'Managing Director' },
      { name: 'Rafiq Merchant', role: 'Independent Director' },
      { name: 'Claire Dumont', role: 'Chair, Audit Committee' },
    ],
  }),
  L.timelinePage({
    p,
    t,
    kicker: 'The Year',
    title: 'Key events, in order',
    entries: [
      { year: 'Apr', title: 'Capital framework approved', text: 'Board adopted a formal allocation policy with hurdle rates by division.' },
      { year: 'Aug', title: 'Two board appointments', text: 'Independent directors added to strengthen audit and risk oversight.' },
      { year: 'Nov', title: 'Division restructuring', text: 'Provision recognised; operations consolidated into two sites.' },
      { year: 'Feb', title: 'Refinancing completed', text: 'Facilities extended to 2031 at improved covenants.' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Northgate',
    tagline: 'Building for the decade, not the quarter.',
    lines: ['Registered office: Mumbai, Maharashtra', 'Investor relations: ir@northgate.example', 'This report contains forward-looking statements'],
    website: 'northgate.example',
  }),
];

export default pages;
