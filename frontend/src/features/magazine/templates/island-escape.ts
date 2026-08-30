import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Sea glass teal and sand — a slower, coastal travel guide. */
const p: Palette = {
  bg: '#F5FAF9',
  ink: '#123A3A',
  muted: '#5C7F7C',
  deep: '#0B2626',
  accent: '#0F8A82',
  onAccent: '#FFFFFF',
  frameFrom: '#D6ECE8',
  frameTo: '#9FCFC7',
  line: '#DCEEEA',
};

const t: Typeset = {
  display: 'DM Serif Display',
  displayWeight: 400,
  displayTracking: -0.6,
  body: 'Jost',
  kicker: 'Jost',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverFullBleed({
    p,
    t,
    c: {
      masthead: 'Tideline',
      kicker: 'Slow islands, off season',
      headline: 'Where to go when the ferry runs twice a week',
      sub: 'Four islands, visited in the quiet months, when the only queue is for the bakery.',
      issue: 'Winter Coastal Edition',
      footer: 'Tideline — travel, unhurried',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'This Issue',
    entries: [
      { no: '01', title: 'The Ferry Timetable', note: 'Why twice a week is a feature.' },
      { no: '02', title: 'Empty Beaches', note: 'Four coves nobody photographs in summer.' },
      { no: '03', title: 'The Harbour Kitchen', note: 'One boat, one catch, one menu a day.' },
      { no: '04', title: 'Where to Stay', note: 'Rooms above the shops, and why that is better.' },
    ],
  }),
  L.introLetter({
    p,
    t,
    kicker: 'From the Editor',
    title: 'The best time to visit is when nobody recommends it',
    dropCap: 'O',
    paragraphs: [
      'Off season gets a bad reputation it does not deserve. Half the shops close, yes. The half that stays open belongs to people who actually live there, which changes every conversation you have.',
      'We went in February, when the ferry runs twice a week and the harbour kitchen only opens if the boat comes in. Some days it did not. We ate very well on the days it did.',
      'This issue is for people who would rather find one open door than walk past twenty closed ones for the view.',
    ],
    signature: 'Editor, Tideline',
    quote: '“The island in winter is the island, without the performance of summer.”',
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Empty Beaches',
    title: 'The cove past the lighthouse',
    caption: 'A forty-minute walk from the last bus stop. We saw two other people all afternoon.',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'The Harbour Kitchen',
    intro: 'One boat, one catch, one menu written on a chalkboard each morning it comes in.',
    captions: ['The boat, returning', 'Today’s catch', 'The kitchen, no menu printed', 'Lunch, outdoors', 'The chalkboard, erased'],
  }),
  L.quotePage({
    p,
    t,
    quote: 'We do not open every day. We open when there is something worth cooking.',
    name: 'Harbour Kitchen',
    role: 'Family-run, three generations',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Tideline',
    tagline: 'Coastal travel for the quiet months.',
    lines: ['Published each winter', 'Ferry timetables verified monthly', 'post@tideline.example'],
    website: 'tideline.example',
  }),
];

export default pages;
