import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Traditional maroon and cream — a university alumni review. */
const p: Palette = {
  bg: '#FBF8F4',
  ink: '#2B1218',
  muted: '#71585C',
  deep: '#1C0A0D',
  accent: '#7A1F2B',
  onAccent: '#FFFFFF',
  frameFrom: '#EEDEDF',
  frameTo: '#C9A8AC',
  line: '#E9DEDA',
};

const t: Typeset = {
  display: 'Bitter',
  displayWeight: 700,
  displayTracking: -0.3,
  body: 'Lora',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverFramed({
    p,
    t,
    c: {
      masthead: 'The Review',
      kicker: 'Alumni Association',
      headline: 'Forty years on, the class of 1986 returns to campus',
      sub: 'Reunion photographs, career updates, and a look back at the building that no longer exists.',
      issue: 'Autumn Edition',
      footer: 'Published for alumni and friends of the university',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Contents',
    entries: [
      { no: '01', title: 'The Reunion', note: 'Forty years on, back on campus.' },
      { no: '02', title: 'Where They Are Now', note: 'Six graduates, six paths.' },
      { no: '03', title: 'The Old Library', note: 'A building that no longer stands.' },
      { no: '04', title: 'Giving Back', note: 'The scholarship fund, this year.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'The Reunion',
    title: 'Forty years on, the same steps',
    caption: 'The class of 1986, photographed on the same library steps as their original graduation photo.',
  }),
  L.profileGrid({
    p,
    t,
    title: 'Where They Are Now',
    intro: 'Six graduates from across four decades share what came after commencement.',
    people: [
      { name: 'Dr. Amara Osei', role: 'Class of 1986 · Medicine' },
      { name: 'Rajiv Malhotra', role: 'Class of 1994 · Engineering' },
      { name: 'Beatriz Nunes', role: 'Class of 2003 · Law' },
      { name: 'Sam Whitfield', role: 'Class of 2012 · Education' },
    ],
  }),
  L.introLetter({
    p,
    t,
    kicker: 'From the Association',
    title: 'A building that no longer stands',
    dropCap: 'T',
    paragraphs: [
      'The old library was demolished in 2009 to make way for the science block, and for many alumni it remains the building they picture when they picture the campus at all.',
      'This issue collects photographs and memories submitted by graduates who studied within its reading room, queued for its card catalogue, and in at least one case, proposed marriage on its front steps.',
      'The new building is, by every practical measure, an improvement. It is also, several of you have written to tell us, not quite the same.',
    ],
    signature: 'Alumni Association',
    quote: '“Some buildings hold more memory than function. The old library held both.”',
  }),
  L.statsPage({
    p,
    t,
    kicker: 'Giving Back',
    title: 'The scholarship fund, this year',
    intro: 'Contributions from alumni across the past twelve months, supporting first-generation students.',
    stats: [
      { value: '₹1.4 Cr', label: 'Raised for the scholarship fund this year' },
      { value: '38', label: 'Students supported this academic year' },
      { value: '412', label: 'Alumni donors, across forty graduating classes' },
      { value: '96%', label: 'Of recipients complete their degree' },
    ],
    source: 'Alumni Association annual report',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'The Review',
    tagline: 'Published for alumni and friends of the university.',
    lines: ['Update your details: alumni@university.example', 'Reunions organised by decade', 'Scholarship fund contributions welcome'],
    website: 'alumni.university.example',
  }),
];

export default pages;
