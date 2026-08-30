import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Soft ivory and dusted rose — a wedding photography story album. */
const p: Palette = {
  bg: '#FCF8F6',
  ink: '#3A2A2E',
  muted: '#8C7378',
  deep: '#241A1D',
  accent: '#B76E79',
  onAccent: '#FFFFFF',
  frameFrom: '#F1E2E4',
  frameTo: '#D9B8BE',
  line: '#EFE1E3',
};

const t: Typeset = {
  display: 'Cormorant Garamond',
  displayWeight: 600,
  displayTracking: 0,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 500,
};

const pages: PageDraft[] = [
  L.coverFramed({
    p,
    t,
    c: {
      masthead: 'Anaya & Rohan',
      kicker: 'A wedding story',
      headline: 'Two families, one weekend, and the quiet moments between the big ones',
      sub: 'Photographed across three days, from the mehendi morning to the last dance.',
      issue: 'December — Udaipur',
      footer: 'Photographed by Studio Anthea',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'The Weekend',
    entries: [
      { no: '01', title: 'Mehendi Morning', note: 'Marigolds, music, and a lot of laughter.' },
      { no: '02', title: 'The Ceremony', note: 'As the sun went down over the lake.' },
      { no: '03', title: 'In Between', note: 'The moments nobody staged.' },
      { no: '04', title: 'The Reception', note: 'Until the last song played.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'The Ceremony',
    title: 'As the sun went down over the lake',
    caption: 'Photographed at golden hour, exactly as planned — the one thing that went entirely to schedule.',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'In Between',
    intro: 'The moments between the posed photographs — usually the ones everyone remembers longest.',
    captions: ['Getting ready', 'A quiet minute', 'The first look', 'Grandparents', 'Walking in'],
  }),
  L.quotePage({
    p,
    t,
    quote: 'The best photograph of the day was not the one we planned for.',
    name: 'Studio Anthea',
    role: 'Wedding photography',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'The Reception',
    headline: 'Until the last song played',
    standfirst: 'Three hundred guests, one dance floor, and a band that refused to stop at midnight.',
    columns: [
      'The formal photographs were finished by nine. Everything after that was unplanned — the uncles who took over the dance floor, the speech that ran twenty minutes over, the cake that arrived an hour late and was somehow still the best part.',
      'By the time the band packed up it was nearly two in the morning. Nobody was checking the time by then, which is usually how you know a wedding actually worked.',
    ],
    caption: 'Photographed until the very last guest left',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Studio Anthea',
    tagline: 'Wedding photography, told as a story.',
    lines: ['Full gallery delivered within six weeks', 'Prints and albums available', 'hello@studioanthea.example'],
    website: 'studioanthea.example',
  }),
];

export default pages;
