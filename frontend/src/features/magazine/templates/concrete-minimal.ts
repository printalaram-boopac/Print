import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Cool grey concrete with a single steel-blue line — brutalist and quiet. */
const p: Palette = {
  bg: '#EFEFED',
  ink: '#1A1A1A',
  muted: '#666460',
  deep: '#0D0D0C',
  accent: '#4A5A6A',
  onAccent: '#FFFFFF',
  frameFrom: '#D6D5D0',
  frameTo: '#A6A49C',
  line: '#D0CFCA',
};

const t: Typeset = {
  display: 'Archivo Narrow',
  displayWeight: 400,
  displayTracking: -0.6,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverMinimal({
    p,
    t,
    c: {
      masthead: 'Mass',
      kicker: 'Volume 03',
      headline: 'Three houses that use concrete as a material for light, not just structure.',
      issue: 'Brutalism, Revisited',
      footer: 'Mass — a small journal about weight',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'House on the Ridge', note: 'One material, poured in place.' },
      { no: '02', title: 'The Slot', note: 'A four-metre gap does all the work.' },
      { no: '03', title: 'Weight & Light', note: 'How mass shapes a room’s mood.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'House on the Ridge',
    title: 'Poured in place, finished by the formwork',
    caption: 'No render, no paint. The timber formwork grain is the only decoration this house has.',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'Project 02',
    headline: 'A four-metre slot does all the work',
    body: 'The house is two solid volumes separated by a single gap, four metres wide, running its full length. Every room on the north side gets direct light through it, without a single window on that face.\n\nIt is the entire design idea, executed once, correctly.',
    facts: [
      { label: 'Slot width', value: '4.0 m' },
      { label: 'Concrete finish', value: 'Board-formed' },
      { label: 'North-facing windows', value: '0' },
    ],
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Weight & Light',
    intro: 'How mass changes the way a room feels across a single day.',
    captions: ['Morning, slot light', 'Midday, deep shadow', 'The formwork grain', 'Stair, cast in place', 'Evening'],
  }),
  L.quotePage({
    p,
    t,
    quote: 'Concrete is not cold. It is just honest about how much light it will let through.',
    name: 'Studio Mass',
    role: 'Architecture practice',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Mass',
    tagline: 'A small journal about weight, light and concrete.',
    lines: ['Two issues a year', 'Printed on uncoated stock', 'editor@massjournal.example'],
    website: 'massjournal.example',
  }),
];

export default pages;
