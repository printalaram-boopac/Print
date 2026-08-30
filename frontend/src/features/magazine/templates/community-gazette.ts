import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Warm newsprint with a civic blue rule — a local community gazette. */
const p: Palette = {
  bg: '#F8F6F1',
  ink: '#201C16',
  muted: '#63594B',
  deep: '#141109',
  accent: '#1D4E89',
  onAccent: '#FFFFFF',
  frameFrom: '#E6E0D2',
  frameTo: '#B9AF97',
  line: '#E2DCCE',
};

const t: Typeset = {
  display: 'Bitter',
  displayWeight: 700,
  displayTracking: -0.4,
  body: 'Inter',
  kicker: 'Archivo Narrow',
  kickerWeight: 700,
};

const pages: PageDraft[] = [
  L.coverTypeLed({
    p,
    t,
    c: {
      masthead: 'The Ward Nine Gazette',
      kicker: 'Serving the neighbourhood since 2011',
      headline: 'The park is finally getting its new benches — but not for another eight months',
      sub: 'A look at the council schedule, the residents’ committee, and the petition that made it happen.',
      issue: 'Monthly · Free',
      footer: 'The Ward Nine Gazette — printed and delivered locally',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'This Month',
    entries: [
      { no: '01', title: 'The Park Benches', note: 'What the petition actually changed.' },
      { no: '02', title: 'School Fete', note: 'Photos from Saturday.' },
      { no: '03', title: 'Notices', note: 'Bin collection changes, road closures.' },
      { no: '04', title: 'Letters', note: 'What residents wrote in about.' },
    ],
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Local News',
    headline: 'The park benches, and the petition that moved them up the list',
    standfirst: 'Two hundred and forty signatures later, the council schedule finally has a date on it.',
    columns: [
      'The benches were approved three years ago and then quietly slipped down the maintenance schedule twice. It took a resident-led petition, forty minutes at a council meeting, and a fairly persistent series of emails to move them back up.\n\nWork is now scheduled to begin in the spring.',
      'The residents’ committee has asked that the new benches face the play area rather than the road, a small change that took longer to agree than the funding itself.\n\nWe will report on progress as the date approaches.',
    ],
    caption: 'Reporting — Gazette community desk',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'School Fete',
    intro: 'Photographs from Saturday’s fete, which raised a record amount for the library fund.',
    captions: ['The cake stall', 'Tug of war', 'Raffle draw', 'Face painting', 'Closing announcement'],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Notices',
    title: 'Bin collection changes from next month',
    caption: 'Full schedule available at the community noticeboard and on the council website.',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'The Ward Nine Gazette',
    tagline: 'Local news, delivered to every house on the ward.',
    lines: ['Printed monthly, delivered free', 'Letters: editor@wardninegazette.example', 'Advertising rates on request'],
    website: 'wardninegazette.example',
  }),
];

export default pages;
