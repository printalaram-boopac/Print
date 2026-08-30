import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Warm charcoal with a single gold rule — a portrait photographer's portfolio. */
const p: Palette = {
  bg: '#F7F5F2',
  ink: '#1B1917',
  muted: '#6B655C',
  deep: '#0C0B09',
  accent: '#B08D3E',
  onAccent: '#FFFFFF',
  frameFrom: '#E2DED5',
  frameTo: '#B4ABA0',
  line: '#E4E0D8',
};

const t: Typeset = {
  display: 'Playfair Display',
  displayWeight: 600,
  displayTracking: -0.6,
  body: 'Inter',
  kicker: 'Inter',
  kickerWeight: 600,
};

const pages: PageDraft[] = [
  L.coverFullBleed({
    p,
    t,
    c: {
      masthead: 'Priya Kapoor',
      kicker: 'Portrait photography',
      headline: 'People, photographed as themselves',
      sub: 'A decade of portraiture for editorial, corporate and personal commissions.',
      issue: 'Portfolio · Selected Work',
      footer: 'Available for commission — Mumbai and worldwide',
    },
  }),
  L.contentsList({
    p,
    t,
    title: 'Selected Work',
    entries: [
      { no: '01', title: 'Editorial Portraits', note: 'For press and magazine commissions.' },
      { no: '02', title: 'Executive Headshots', note: 'For leadership teams and founders.' },
      { no: '03', title: 'Personal Sessions', note: 'Family and milestone portraiture.' },
      { no: '04', title: 'About', note: 'Approach, availability and rates.' },
    ],
  }),
  L.imageLedFull({
    p,
    t,
    overline: 'Editorial',
    title: 'Natural light, minimal direction',
    caption: 'Photographed for a national business publication, on location at the subject’s own studio.',
  }),
  L.galleryMosaic({
    p,
    t,
    title: 'Executive Headshots',
    intro: 'Leadership portraits for five companies, shot in a single day per client.',
    captions: ['Founder, seated', 'Leadership team', 'Environmental portrait', 'Studio backdrop', 'Candid, in office'],
  }),
  L.quotePage({
    p,
    t,
    quote: 'A good portrait is not flattering. It is honest, and then it happens to be flattering.',
    name: 'Priya Kapoor',
    role: 'Portrait photographer',
  }),
  L.sidebarFeature({
    p,
    t,
    kicker: 'About',
    headline: 'Portrait photographer, based in Mumbai',
    body: 'Ten years photographing people for editorial, corporate and personal commissions. Sessions are unhurried by design — most bookings run two to three hours, even for a single final image.\n\nAvailable for travel commissions worldwide. Prints available in limited editions.',
    facts: [
      { label: 'Years in practice', value: '10' },
      { label: 'Typical session length', value: '2–3 hrs' },
      { label: 'Booking lead time', value: '3 weeks' },
    ],
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Priya Kapoor',
    tagline: 'Portrait commissions, editorial and personal.',
    lines: ['studio@priyakapoor.example', 'Full portfolio and rates on request', 'Based in Mumbai, travels worldwide'],
    website: 'priyakapoor.example',
  }),
];

export default pages;
