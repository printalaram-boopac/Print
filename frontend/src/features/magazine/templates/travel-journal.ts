import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Sun-bleached paper, terracotta accent, relaxed serif — a travel journal. */
const p: Palette = {
  bg: '#FDF8F1',
  ink: '#2A1D14',
  muted: '#7C6552',
  deep: '#231710',
  accent: '#C2571E',
  onAccent: '#FFF7EE',
  frameFrom: '#EBDCC7',
  frameTo: '#C6A681',
  line: '#E7DACA',
};

const t: Typeset = {
  display: 'Playfair Display',
  displayWeight: 700,
  displayTracking: -1,
  body: 'Lora',
  kicker: 'Barlow Condensed',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverFullBleed({
    p,
    t,
    c: {
      masthead: 'Far Roads',
      kicker: 'Twelve days, one coastline',
      headline: 'Driving the long way round',
      sub: 'From the salt flats to the fishing villages, with no reservations booked.',
      issue: 'Issue 07 — The Coast Road',
      footer: 'Far Roads — a travel journal',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'The Route',
    entries: [
      { no: '01', title: 'Day One', note: 'Leaving before the traffic wakes up.' },
      { no: '02', title: 'The Salt Flats', note: 'Two hours of white nothing.' },
      { no: '03', title: 'Fishing Village', note: 'Where breakfast is whatever came in.' },
      { no: '04', title: 'The Pass', note: 'Nine hairpins and a flat tyre.' },
    ],
  }),
  L.introLetter({
    p,
    t,
    kicker: 'From The Road',
    title: 'We booked nothing, and it worked',
    dropCap: 'T',
    paragraphs: [
      'The plan was a line on a map and a return flight twelve days later. Everything between those two points was left deliberately undecided, which is either liberating or reckless depending on who you ask.',
      'It turned out to be mostly liberating. We slept in three places we would never have found online, ate one genuinely terrible lunch, and spent an afternoon waiting for a mechanic in a town that does not appear in any guide.',
      'That afternoon is the part everyone asks about. The itinerary would have skipped it entirely.',
    ],
    signature: 'Words & photographs',
    quote: '“The best days were the ones we had no plan for.”',
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Day Four',
    title: 'The salt flats at noon',
    caption: 'No filter, no shade, and thirty-eight degrees. The horizon disappears about an hour before you do.',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'The Long Way',
    headline: 'Nine hairpins, one flat tyre, and a village that fed us',
    standfirst: 'The mountain pass was supposed to take ninety minutes. It took most of a day, and became the reason we will go back.',
    columns: [
      'The tyre went on the sixth bend, in the least helpful place available: uphill, on gravel, with no phone signal in either direction. We had a spare and no jack, which is a combination that teaches patience quickly.\n\nA truck stopped within twenty minutes.',
      'By the time we reached the village the light had gone. Someone opened a kitchen that had already closed, and refused payment twice before accepting it.\n\nWe have eaten better food since. We have not eaten a better meal.',
    ],
    caption: 'Photographed on the coast road, October',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Twelve Days',
    intro: 'A rough edit from the road — early mornings, long drives and one very slow puncture.',
    captions: ['Harbour at 6am', 'The pass, looking back', 'Market, day nine', 'Salt and shadow', 'Last night, north beach'],
  }),
  L.quotePage({
    p,
    t,
    quote: 'You cannot photograph a place properly until you have been slightly lost in it.',
    name: 'Field Note, Day Six',
    role: 'Somewhere past the pass',
  }),
  L.timelinePage({
    p,
    t,
    kicker: 'Logbook',
    title: 'How the days went',
    entries: [
      { year: 'D1', title: 'South, then east', text: 'Four hundred kilometres before lunch, mostly to get the motorway over with.' },
      { year: 'D4', title: 'The flats', text: 'Arrived too early, stayed too long, drank all the water.' },
      { year: 'D7', title: 'The pass', text: 'Flat tyre, kind strangers, late dinner, best night of the trip.' },
      { year: 'D12', title: 'Coast, north', text: 'Rain for the first time. Nobody minded.' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Far Roads',
    tagline: 'Slow travel, honestly documented.',
    lines: ['Printed twice a year on recycled stock', 'Route notes and maps at the website', 'post@farroads.example'],
    website: 'farroads.example',
  }),
];

export default pages;
