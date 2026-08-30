import type { PageDraft, Palette, Typeset } from './builders';
import * as L from './layouts';

/** Warm sage and clay — a wellness and slow-living lifestyle title. */
const p: Palette = {
  bg: '#F6F5EE',
  ink: '#2B3327',
  muted: '#6E7563',
  deep: '#1C2119',
  accent: '#7C8B5E',
  onAccent: '#F6F5EE',
  frameFrom: '#E5E4D3',
  frameTo: '#BFC2A0',
  line: '#E4E3D6',
};

const t: Typeset = {
  display: 'Lora',
  displayWeight: 600,
  displayTracking: -0.2,
  body: 'Jost',
  kicker: 'Jost',
  kickerWeight: 500,
};

const pages: PageDraft[] = [
  L.coverMinimal({
    p,
    t,
    c: {
      masthead: 'Unhurried',
      kicker: 'A quarterly on slower living',
      headline: 'What changed when three people stopped optimising their mornings',
      issue: 'The Rest Issue',
      footer: 'Unhurried — Issue 05',
    },
  }),
  L.contentsGrid({
    p,
    t,
    title: 'Inside',
    entries: [
      { no: '01', title: 'The Unoptimised Morning', note: 'No routine, no tracker, no alarm.' },
      { no: '02', title: 'One Meal, Slowly', note: 'Cooking as the whole activity, not a task.' },
      { no: '03', title: 'Digital Rest', note: 'A week with a phone that only calls.' },
      { no: '04', title: 'The Long Walk', note: 'Nowhere to be, on purpose.' },
    ],
  }),
  L.introLetter({
    p,
    t,
    kicker: 'Editor’s Note',
    title: 'Rest is not a reward you earn',
    dropCap: 'W',
    paragraphs: [
      'We spent a decade treating rest as something to be scheduled between achievements — a reward, conditional and quantified. This issue is a small argument against that entire framing.',
      'Three contributors agreed to remove one optimisation from their week: a morning routine, a meal-tracking app, a productivity system they had followed for years. None of them replaced it with anything.',
      'What they noticed was not more energy or better focus. It was simply more time that belonged to nobody’s metric but their own.',
    ],
    signature: 'Editor, Unhurried',
    quote: '“Rest stopped being something I scheduled, and started being something I noticed.”',
  }),
  L.featureTwoColumn({
    p,
    t,
    kicker: 'Feature',
    headline: 'A week with a phone that only calls',
    standfirst: 'No apps, no browser, no notifications. Just a number people could reach, for seven days.',
    columns: [
      'The first two days were uncomfortable in a way that surprised her — not boredom, but a low static anxiety she had not noticed the phone was masking.\n\nBy day four the anxiety had mostly resolved into something closer to attention.',
      'She read three books that week, which she had not managed in the previous six months combined. Nothing about her schedule changed. The hours were simply no longer being spent elsewhere.',
    ],
    caption: 'A first-person account, lightly edited',
  }),
  L.quotePage({
    p,
    t,
    quote: 'I did not become more productive. I became more present, which turned out to be what I actually wanted.',
    name: 'Contributor',
    role: 'Digital Rest, page 14',
  }),
  L.backCover({
    p,
    t,
    wordmark: 'Unhurried',
    tagline: 'A quarterly about slowing down, on purpose.',
    lines: ['Four issues a year, no more', 'Printed on uncoated paper', 'post@unhurried.example'],
    website: 'unhurried.example',
  }),
];

export default pages;
