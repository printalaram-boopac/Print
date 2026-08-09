import { PageLayoutType, MagazinePage } from './types';

export interface LayoutPresetDefinition {
  type: PageLayoutType;
  name: string;
  description: string;
  defaultSlotCount: number;
}

export const LAYOUT_PRESETS: LayoutPresetDefinition[] = [
  {
    type: 'cover',
    name: 'Magazine Cover (A4)',
    description: 'High-impact front cover page with main hero photo and custom issue title',
    defaultSlotCount: 1,
  },
  {
    type: 'editorial_spread',
    name: 'Editorial Lead Spread',
    description: 'Main feature photo with secondary portrait slot and editorial quote box',
    defaultSlotCount: 2,
  },
  {
    type: 'quad_grid',
    name: '4-Photo Story Grid',
    description: 'Balanced 2x2 grid page ideal for chronological photo stories',
    defaultSlotCount: 4,
  },
  {
    type: 'bento_showcase',
    name: 'Modern Bento Gallery',
    description: 'Asymmetrical wide banner slot with dual stacked supporting shots',
    defaultSlotCount: 3,
  },
  {
    type: 'full_bleed',
    name: 'Full Bleed Poster Page',
    description: 'Full A4 single photo page with minimal overlay caption for hero moments',
    defaultSlotCount: 1,
  },
  {
    type: 'back_cover',
    name: 'Back Cover & Summary',
    description: 'Closing page featuring collage grid, thank you note, and barcode footer',
    defaultSlotCount: 3,
  },
];

export function createDefaultPage(pageNumber: number, layout: PageLayoutType = 'editorial_spread'): MagazinePage {
  const id = `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (layout === 'cover') {
    return {
      id,
      title: 'FRONT COVER',
      pageNumber,
      layout: 'cover',
      subtitle: 'VOL. 01 • EXCLUSIVE EDITION',
      editorialText: 'A curated collection of cherished memories and timeless snapshots.',
      slots: [
        { id: `${id}-slot-1`, src: null, caption: 'Cover Highlight Photo', zoom: 1, filter: 'normal' },
      ],
      textOverlays: [],
    };
  }

  if (layout === 'quad_grid') {
    return {
      id,
      title: 'STORY GRID',
      pageNumber,
      layout: 'quad_grid',
      subtitle: 'MEMORIES & MOMENTS',
      slots: [
        { id: `${id}-slot-1`, src: null, caption: 'Moment 01', zoom: 1, filter: 'normal' },
        { id: `${id}-slot-2`, src: null, caption: 'Moment 02', zoom: 1, filter: 'normal' },
        { id: `${id}-slot-3`, src: null, caption: 'Moment 03', zoom: 1, filter: 'normal' },
        { id: `${id}-slot-4`, src: null, caption: 'Moment 04', zoom: 1, filter: 'normal' },
      ],
      textOverlays: [],
    };
  }

  if (layout === 'bento_showcase') {
    return {
      id,
      title: 'FEATURE BENTO',
      pageNumber,
      layout: 'bento_showcase',
      subtitle: 'HIGHLIGHT SPREAD',
      editorialText: '“Every photograph holds a story, turning everyday smiles into lifelong keepsakes.”',
      slots: [
        { id: `${id}-slot-1`, src: null, caption: 'Panoramic Shot', zoom: 1, filter: 'normal' },
        { id: `${id}-slot-2`, src: null, caption: 'Portrait Focus', zoom: 1, filter: 'normal' },
        { id: `${id}-slot-3`, src: null, caption: 'Detail View', zoom: 1, filter: 'normal' },
      ],
      textOverlays: [],
    };
  }

  if (layout === 'full_bleed') {
    return {
      id,
      title: 'FULL BLEED PHOTO',
      pageNumber,
      layout: 'full_bleed',
      subtitle: 'A MOMENT IN TIME',
      slots: [
        { id: `${id}-slot-1`, src: null, caption: 'Full Page Masterpiece', zoom: 1, filter: 'normal' },
      ],
      textOverlays: [],
    };
  }

  if (layout === 'back_cover') {
    return {
      id,
      title: 'BACK COVER',
      pageNumber,
      layout: 'back_cover',
      subtitle: 'THANK YOU FOR READING',
      editorialText: 'Created with love. Printed on premium matte photo zine stock.',
      slots: [
        { id: `${id}-slot-1`, src: null, caption: 'Memory A', zoom: 1, filter: 'normal' },
        { id: `${id}-slot-2`, src: null, caption: 'Memory B', zoom: 1, filter: 'normal' },
        { id: `${id}-slot-3`, src: null, caption: 'Memory C', zoom: 1, filter: 'normal' },
      ],
      textOverlays: [],
    };
  }

  // Default: editorial_spread
  return {
    id,
    title: 'EDITORIAL FEATURE',
    pageNumber,
    layout: 'editorial_spread',
    subtitle: 'CHAPTER FEATURE',
    editorialText: 'Captured with passion and preserved in elegant print form.',
    slots: [
      { id: `${id}-slot-1`, src: null, caption: 'Main Feature Shot', zoom: 1, filter: 'normal' },
      { id: `${id}-slot-2`, src: null, caption: 'Supporting Snapshot', zoom: 1, filter: 'normal' },
    ],
    textOverlays: [],
  };
}

export const INITIAL_MAGAZINE_PAGES: MagazinePage[] = [
  createDefaultPage(1, 'cover'),
  createDefaultPage(2, 'editorial_spread'),
  createDefaultPage(3, 'quad_grid'),
  createDefaultPage(4, 'bento_showcase'),
  createDefaultPage(5, 'full_bleed'),
  createDefaultPage(6, 'back_cover'),
];
