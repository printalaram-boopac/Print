import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Newsprint grey with a red masthead rule — dense, ruled, journalistic. */
const p: Palette = {
  bg: '#F6F5F2',
  ink: '#141414',
  muted: '#5C5C5C',
  deep: '#0D0D0D',
  accent: '#B91C1C',
  onAccent: '#FFFFFF',
  frameFrom: '#DDDCD8',
  frameTo: '#ADACA7',
  line: '#D9D8D4',
};

const t: Typeset = {
  display: 'Bitter',
  displayWeight: 700,
  displayTracking: -0.8,
  body: 'Inter',
  kicker: 'Archivo Narrow',
  kickerWeight: 700,
};

const pages: PageDraft[] = [
  L.coverTypeLed({
    p,
    t,
    c: {
      masthead: 'The Record',
      kicker: 'Weekend Edition',
      headline: 'Water, and who gets to decide',
      sub: 'A six-month investigation into how three districts allocate a shrinking supply — and the meetings where those decisions are actually made.',
      issue: 'Saturday · Number 4,118',
      footer: 'The Record — independent since 1994',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Inside',
    entries: [
      { no: '01', title: 'The Investigation', note: 'Six months, three districts, 400 documents.' },
      { no: '02', title: 'The Meetings', note: 'Who attends, and who is never invited.' },
      { no: '03', title: 'Data', note: 'Allocation against demand, mapped.' },
      { no: '04', title: 'Response', note: 'What the authority told us.' },
      { no: '05', title: 'Comment', note: 'Three views from the affected wards.' },
    ],
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Investigation',
    headline: 'Six months, three districts, four hundred documents',
    standfirst: 'Allocation decisions affecting two million people are recorded in minutes that are public, unindexed and almost never read. We read them.',
    columns: [
      'The documents were not hidden. They were published as scanned images, without text search, in batches that did not follow a naming convention. Retrieving a year took four days.\n\nReading them took considerably longer.',
      'What emerged was not a scandal so much as a pattern: allocation followed historic entitlement, and historic entitlement followed infrastructure built four decades ago.\n\nNobody had revisited the baseline. Nobody was required to.',
    ],
    caption: 'Reporting — The Record investigations desk',
  }),
  L.statsPage({
    p,
    t,
    kicker: 'The Data',
    title: 'Allocation against demand',
    intro: 'Compiled from published minutes and supply records for the three districts covered by this investigation, 2019 to 2025.',
    stats: [
      { value: '400+', label: 'Documents reviewed for this report' },
      { value: '2.1 M', label: 'People covered by the allocation decisions' },
      { value: '43 yrs', label: 'Since the baseline entitlement was last revised' },
      { value: '0', label: 'Public consultations held in the period' },
    ],
    source: 'Source — district minutes, 2019–2025',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Response',
    headline: 'What the authority told us',
    body: 'We put fourteen questions to the water authority and received a written response eleven days later. It confirmed the baseline figures, disputed our characterisation of the consultation record, and declined to comment on individual allocations.\n\nThe full text is reproduced on our website alongside the underlying documents, which we have indexed and made searchable.',
    facts: [
      { label: 'Questions submitted', value: '14' },
      { label: 'Answered directly', value: '9' },
      { label: 'Days to respond', value: '11' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Ward Nine',
    title: 'The tank that fills on alternate days',
    caption: 'Residents have shared a single supply point since 2011. The allocation on paper has not changed since.',
  }),
  L.quotePage({
    p,
    t,
    quote: 'Nobody decided this. That is precisely the problem — it was inherited, and then defended.',
    name: 'Anjali Verma',
    role: 'Former district engineer',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'The Record',
    tagline: 'Independent reporting, reader funded since 1994.',
    lines: ['Corrections: corrections@record.example', 'Documents from this investigation are public', 'Subscriptions support the investigations desk'],
    website: 'record.example',
  }),
];

export default pages;
