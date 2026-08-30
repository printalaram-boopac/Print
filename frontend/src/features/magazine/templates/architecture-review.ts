import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Concrete greys, thin rules, technical sans — an architecture review. */
const p: Palette = {
  bg: '#F4F4F2',
  ink: '#1C1C1B',
  muted: '#6F6F6C',
  deep: '#111110',
  accent: '#7A5C3E',
  onAccent: '#FAF9F7',
  frameFrom: '#DEDEDA',
  frameTo: '#ADADA7',
  line: '#DCDCD8',
};

const t: Typeset = {
  display: 'Syne',
  displayWeight: 700,
  displayTracking: -1.4,
  body: 'Space Grotesk',
  kicker: 'Space Grotesk',
  kickerWeight: 500,
};

const pages: PageDraft[] = [
  L.coverMinimal({
    p,
    t,
    c: {
      masthead: 'Section',
      kicker: 'Volume 21',
      headline: 'Six buildings that solved a difficult site — and the drawings that got them there.',
      issue: 'Architecture Review',
      footer: 'Section — published in Mumbai',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Projects',
    entries: [
      { no: '01', title: 'House on a Slope', note: 'Nine metres of fall across twenty of plot.' },
      { no: '02', title: 'Civic Library', note: 'Concrete, daylight and a very tight budget.' },
      { no: '03', title: 'Courtyard Infill', note: 'Building between two protected façades.' },
      { no: '04', title: 'Water Pavilion', note: 'A structure designed to flood twice a year.' },
      { no: '05', title: 'Studio Retrofit', note: 'Reusing a frame nobody wanted.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Project 01',
    title: 'House on a slope',
    caption: 'Photographed from the lower terrace. The retaining wall does structural and spatial work in equal measure.',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Project 01',
    headline: 'Nine metres of fall, and a plan that uses all of it',
    standfirst: 'A site most buyers walked away from produced the most economical structure on this year’s shortlist.',
    columns: [
      'The slope was the brief. Rather than cut a platform and pay for retaining, the plan steps four times across the fall, each level a half-flight from the last and each with its own ground contact.\n\nThe result needs almost no excavation.',
      'Structurally it is unremarkable: load-bearing masonry, timber floors, a concrete stair core doing the lateral work. The intelligence is in the section, not the specification.\n\nThat is usually where it is.',
    ],
    caption: 'Drawings courtesy of the practice',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Technical',
    headline: 'Built with what the site already had',
    body: 'Stone from the excavation was reused in the retaining walls; spoil was regraded on site rather than removed. The frame is locally milled timber at standard sections, which kept both cost and lead time down.\n\nThe practice estimates a 22% saving against a conventional cut-and-fill approach on the same plot.',
    facts: [
      { label: 'Site area', value: '620 m²' },
      { label: 'Internal floor area', value: '244 m²' },
      { label: 'Construction period', value: '14 months' },
    ],
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Details',
    intro: 'Junctions, thresholds and the places where the drawing had to be redrawn on site.',
    captions: ['Stair core, cast in situ', 'Timber to masonry junction', 'Terrace threshold', 'Roof edge', 'Retaining wall, reused stone'],
  }),
  L.quotePage({
    p,
    t,
    quote: 'A difficult site is a brief in disguise. The flat ones are much harder to design for.',
    name: 'Ishaan Deshpande',
    role: 'Principal, Studio Section',
  }),
  L.timelinePage({
    p,
    t,
    kicker: 'Process',
    title: 'From survey to handover',
    entries: [
      { year: '01', title: 'Survey', text: 'Full topographic survey before any plan was drawn — the section came first.' },
      { year: '02', title: 'Stepped plan', text: 'Four levels tested against excavation volume and retaining cost.' },
      { year: '03', title: 'On site', text: 'Spoil regraded, stone sorted and reused in retaining walls.' },
      { year: '04', title: 'Handover', text: 'Fourteen months, within five per cent of the tendered figure.' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Section',
    tagline: 'Drawings, buildings and the distance between them.',
    lines: ['Published three times a year', 'Submissions: editor@section.example', 'Back issues available'],
    website: 'section.example',
  }),
];

export default pages;
