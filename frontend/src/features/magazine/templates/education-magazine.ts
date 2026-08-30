import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Friendly teal and warm paper — a school or campus magazine. */
const p: Palette = {
  bg: '#F7FBFB',
  ink: '#12303A',
  muted: '#5B7883',
  deep: '#0B2229',
  accent: '#0E7490',
  onAccent: '#FFFFFF',
  frameFrom: '#D6E9EC',
  frameTo: '#A5C7CE',
  line: '#DDEAED',
};

const t: Typeset = {
  display: 'Lora',
  displayWeight: 700,
  displayTracking: -0.6,
  body: 'Inter',
  kicker: 'Jost',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverFramed({
    p,
    t,
    c: {
      masthead: 'The Quad',
      kicker: 'Campus Magazine',
      headline: 'A year of firsts',
      sub: 'Results, projects, sport and the students who made the year what it was.',
      issue: 'Academic Year 2025–26',
      footer: 'Published for students, staff and families',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'Principal’s Note', note: 'Looking back on a full year.' },
      { no: '02', title: 'The Results', note: 'Outcomes across all streams.' },
      { no: '03', title: 'Projects', note: 'Four student projects worth a page each.' },
      { no: '04', title: 'Sport', note: 'A season in fixtures and finals.' },
      { no: '05', title: 'Staff', note: 'Arrivals, departures and long service.' },
      { no: '06', title: 'Next Year', note: 'What changes in September.' },
    ],
  }),
  L.introLetter({
    p,
    t,
    kicker: 'Principal’s Note',
    title: 'What a full year looks like',
    dropCap: 'I',
    paragraphs: [
      'It has been the first year since 2019 that ran from start to finish without interruption, and you can feel that in these pages: full fixture lists, a proper exhibition, and a valedictory that filled the hall.',
      'The results speak for themselves and are printed in full on the following pages. What they do not show is the work done by students who arrived two years behind and closed most of that gap.',
      'To the families who supported that work, and to the staff who stayed late for two years running: thank you. This magazine is largely about you.',
    ],
    signature: 'Principal',
    quote: '“Progress is easiest to see in the students who had furthest to travel.”',
  }),
  L.statsPage({
    p,
    t,
    kicker: 'The Results',
    title: 'The year in numbers',
    intro: 'Outcomes across all streams, with comparatives against the previous academic year where available.',
    stats: [
      { value: '96%', label: 'Overall pass rate across all streams' },
      { value: '41', label: 'Students placed in first-choice programmes' },
      { value: '18', label: 'Inter-school competitions entered' },
      { value: '1,240', label: 'Volunteer hours logged by students' },
    ],
    source: 'Source — school records, June',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'The Year',
    intro: 'Photographs from exhibitions, fixtures, field trips and the last day of term.',
    captions: ['Science exhibition', 'Athletics final', 'Field trip, coastal survey', 'Music evening', 'Last day of term'],
  }),
  L.profileGrid({
    p,
    t,
    title: 'Student Projects',
    intro: 'Four projects selected by the faculty for their originality and follow-through.',
    people: [
      { name: 'Water Quality Survey', role: 'Grade 11 · Environmental Science' },
      { name: 'Oral History Archive', role: 'Grade 12 · History' },
      { name: 'Assistive Grip Design', role: 'Grade 10 · Design & Tech' },
      { name: 'Campus Bird Census', role: 'Grade 9 · Biology' },
    ],
  }),
  L.timelinePage({
    p,
    t,
    kicker: 'The Calendar',
    title: 'A year, term by term',
    entries: [
      { year: 'T1', title: 'Settling in', text: 'New timetable, two new streams and the largest intake in six years.' },
      { year: 'T2', title: 'Exhibitions', text: 'Science and arts exhibitions ran on consecutive weekends for the first time.' },
      { year: 'T3', title: 'Examinations', text: 'Full examination series completed on schedule across all grades.' },
      { year: 'T4', title: 'Valedictory', text: 'Graduating cohort of 118, with families filling the main hall.' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'The Quad',
    tagline: 'One year, one school, printed once.',
    lines: ['Additional copies available from the office', 'Photographs by the student media team', 'office@thequad.example'],
    website: 'thequad.example',
  }),
];

export default pages;
