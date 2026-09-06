import type { TemplatePage } from '../types';
import {
  buildBackCover, buildContents, buildCover, buildFeature, buildGallery, buildQuote,
  type PackContext,
} from './layoutGenerators';
import { CANVA_PAGE_LAYOUT_ENTRIES } from './luxuryFashionCanvaPack';

/**
 * The smaller "Page Layouts" library (Step 9 §36) — single pages a user can
 * insert into an in-progress magazine via Step 7's "Add From Template",
 * distinct from the full multi-page packs in packRecipes.ts. Built from the
 * exact same layout engine, with one neutral, versatile palette/type pairing
 * so a dropped-in page reads as "premium blank canvas" rather than pulling
 * in some other pack's colour story.
 */
const NEUTRAL_CTX: PackContext = {
  name: 'Layout',
  category: 'Minimal',
  palette: { primary: '#20272C', secondary: '#D6D6D2', accent: '#B8895A', light: '#F5F5F3', dark: '#14171A' },
  fonts: { display: 'serif', heading: 'condensed', body: 'condensed', caption: 'condensed' },
  imageSeed: 'pa-layout',
};

export interface PageLayoutEntry {
  id: string;
  name: string;
  description: string;
  build: () => TemplatePage;
}

export const PAGE_LAYOUTS: PageLayoutEntry[] = [
  ...CANVA_PAGE_LAYOUT_ENTRIES,
  {
    id: 'layout-cover', name: 'Cover', description: 'Full-bleed hero cover with title and issue line.',
    build: () => buildCover(NEUTRAL_CTX, 0, { kicker: 'A PRINTALARM MAGAZINE', title: 'Untitled', subtitle: 'SUBTITLE HERE', issueLine: 'ISSUE 01' }),
  },
  {
    id: 'layout-contents', name: 'Contents', description: 'Numbered section list with two supporting photos.',
    build: () => buildContents(NEUTRAL_CTX, 0, { heading: 'Contents', sections: [{ num: '01', title: 'Section One' }, { num: '02', title: 'Section Two' }, { num: '03', title: 'Section Three' }, { num: '04', title: 'Section Four' }] }),
  },
  {
    id: 'layout-feature', name: 'Feature', description: 'Large photo with a narrow editorial text column.',
    build: () => buildFeature(NEUTRAL_CTX, 0, { heading: 'Feature Heading', body: 'Short editorial body copy goes here — replace with your own story.', pullQuote: '' }, 'Feature'),
  },
  {
    id: 'layout-gallery', name: 'Gallery', description: 'Four-photo editorial grid with captions.',
    build: () => buildGallery(NEUTRAL_CTX, { heading: 'Gallery', captions: ['Caption one', 'Caption two'] }),
  },
  {
    id: 'layout-quote', name: 'Quote', description: 'Large pull-quote page with a small supporting photo.',
    build: () => buildQuote(NEUTRAL_CTX, { quote: 'Replace this with a memorable quote.', attribution: '— Attribution' }),
  },
  {
    id: 'layout-interview', name: 'Interview', description: 'Two-column Q&A-style layout with a pull quote.',
    build: () => {
      const p = buildFeature(NEUTRAL_CTX, 1, { heading: 'The Interview', body: '“Q: Tell us how it started.\n\nA: It began with a simple idea…”', pullQuote: '“A quotable answer goes here.”' }, 'Interview');
      return { ...p, name: 'Interview' };
    },
  },
  {
    id: 'layout-timeline', name: 'Timeline', description: 'Sequential numbered timeline with a supporting image.',
    build: () => {
      const p = buildContents(NEUTRAL_CTX, 2, { heading: 'Timeline', sections: [{ num: '01', title: 'The Beginning' }, { num: '02', title: 'Along the Way' }, { num: '03', title: 'Today' }] });
      return { ...p, name: 'Timeline', kind: 'toc' };
    },
  },
  {
    id: 'layout-contact', name: 'Contact', description: 'Minimal closing page with logo, URL and photo.',
    build: () => {
      const p = buildBackCover(NEUTRAL_CTX, { closingLine: 'Get in touch', url: 'YOURDOMAIN.COM' });
      return { ...p, name: 'Contact', kind: 'back-cover' };
    },
  },
];
