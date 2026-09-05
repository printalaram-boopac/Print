import type { MagazinePage, MagazineProject, NarrativeBeat, PageType, PhotoElement, TextElement, TextRole } from './types';
import { defaultCaptionFor, defaultQuoteFor, defaultTitleFor, chapterLabelFor } from './textTemplates';

export const PAGE_COUNT = 8;

interface PhotoSlotDef {
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
  isFullBleed: boolean;
}

export interface PageTemplateDef {
  pageType: PageType;
  narrativeBeat: NarrativeBeat;
  photoSlots: PhotoSlotDef[];
  textRoles: TextRole[];
}

// Rule-of-thirds sweet-spot intersections — used instead of dead-centering
// non-full-bleed photos (Design Bible §1/§6).
const THIRDS = {
  topLeft: { xPct: 33, yPct: 33 },
  topRight: { xPct: 66, yPct: 33 },
  bottomLeft: { xPct: 33, yPct: 66 },
  bottomRight: { xPct: 66, yPct: 66 },
};

const FULL_BLEED: PhotoSlotDef = { xPct: 50, yPct: 50, widthPct: 100, heightPct: 100, isFullBleed: true };

export const PAGE_TEMPLATES: PageTemplateDef[] = [
  // 0: Cover — invitation. One full-bleed hero, title + subtitle only, no chapter label.
  {
    pageType: 'cover',
    narrativeBeat: 'invitation',
    photoSlots: [FULL_BLEED],
    textRoles: ['title', 'caption'],
  },
  // 1: Connection — two photos at thirds points, one clearly larger (dominant focal point).
  {
    pageType: 'connection',
    narrativeBeat: 'connection',
    photoSlots: [
      { ...THIRDS.topLeft, widthPct: 58, heightPct: 46, isFullBleed: false },
      { ...THIRDS.bottomRight, widthPct: 38, heightPct: 32, isFullBleed: false },
    ],
    textRoles: ['chapterLabel', 'quote'],
  },
  // 2: Connection — gallery/collage, one dominant + three small supporting, minimal captions.
  {
    pageType: 'connection',
    narrativeBeat: 'connection',
    photoSlots: [
      { xPct: 40, yPct: 40, widthPct: 55, heightPct: 45, isFullBleed: false },
      { xPct: 80, yPct: 22, widthPct: 28, heightPct: 24, isFullBleed: false },
      { xPct: 80, yPct: 55, widthPct: 28, heightPct: 24, isFullBleed: false },
      { xPct: 40, yPct: 80, widthPct: 55, heightPct: 24, isFullBleed: false },
    ],
    textRoles: ['chapterLabel', 'caption'],
  },
  // 3: Celebration — peak, dominant photo at a thirds point + one supporting photo.
  {
    pageType: 'celebration',
    narrativeBeat: 'peak',
    photoSlots: [
      { ...THIRDS.topRight, widthPct: 60, heightPct: 50, isFullBleed: false },
      { ...THIRDS.bottomLeft, widthPct: 36, heightPct: 30, isFullBleed: false },
    ],
    textRoles: ['chapterLabel', 'title'],
  },
  // 4: Celebration — peak, gallery layout, one anchor + three small.
  {
    pageType: 'celebration',
    narrativeBeat: 'peak',
    photoSlots: [
      { xPct: 60, yPct: 35, widthPct: 55, heightPct: 42, isFullBleed: false },
      { xPct: 22, yPct: 22, widthPct: 26, heightPct: 22, isFullBleed: false },
      { xPct: 22, yPct: 55, widthPct: 26, heightPct: 22, isFullBleed: false },
      { xPct: 60, yPct: 80, widthPct: 55, heightPct: 24, isFullBleed: false },
    ],
    textRoles: ['chapterLabel', 'caption'],
  },
  // 5: Letter — reflection, text-dominant (F-pattern), up to 2 small photo insets.
  {
    pageType: 'letter',
    narrativeBeat: 'reflection',
    photoSlots: [
      { xPct: 78, yPct: 24, widthPct: 32, heightPct: 26, isFullBleed: false },
      { xPct: 78, yPct: 68, widthPct: 32, heightPct: 26, isFullBleed: false },
    ],
    textRoles: ['chapterLabel', 'title', 'quote'],
  },
  // 6: Milestone — 3 sequential images, short labels, top-to-bottom progression.
  {
    pageType: 'milestone',
    narrativeBeat: 'milestone',
    photoSlots: [
      { xPct: 50, yPct: 20, widthPct: 70, heightPct: 24, isFullBleed: false },
      { xPct: 50, yPct: 50, widthPct: 70, heightPct: 24, isFullBleed: false },
      { xPct: 50, yPct: 80, widthPct: 70, heightPct: 24, isFullBleed: false },
    ],
    textRoles: ['chapterLabel', 'caption'],
  },
  // 7: Closing — one full-bleed emotional photo, title + short quote, symmetric/calm.
  {
    pageType: 'closing',
    narrativeBeat: 'closing',
    photoSlots: [FULL_BLEED],
    textRoles: ['title', 'quote'],
  },
];

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

// Default font-size-as-%-of-page-height per role, baked in as literal starting
// values (users can freely resize afterward). chapterLabel is a small, quiet
// kicker/eyebrow line (H2-style: uppercase + tracked + semibold, not bigger —
// real magazine kickers stay small and never compete with the headline); quote
// is ~2.2x that; title (H1) is ~2x quote for a proper masthead-scale headline.
const BASE_LABEL_FONT_PCT = 1.4;
const QUOTE_FONT_PCT = BASE_LABEL_FONT_PCT * 2.2;
const TITLE_FONT_PCT = QUOTE_FONT_PCT * 2;
const CAPTION_FONT_PCT = BASE_LABEL_FONT_PCT * 1.3;

const DEFAULT_FONT_SIZE_PCT: Record<TextRole, number> = {
  chapterLabel: BASE_LABEL_FONT_PCT,
  quote: QUOTE_FONT_PCT,
  title: TITLE_FONT_PCT,
  caption: CAPTION_FONT_PCT,
};

function buildPhoto(slot: PhotoSlotDef): PhotoElement {
  return {
    kind: 'photo',
    id: nextId('photo'),
    imgSrc: null,
    img: null,
    xPct: slot.xPct,
    yPct: slot.yPct,
    widthPct: slot.widthPct,
    heightPct: slot.heightPct,
    rounded: slot.isFullBleed ? 0 : 4,
    isFullBleed: slot.isFullBleed,
    rotationDeg: 0,
  };
}

function buildText(role: TextRole, template: PageTemplateDef, index: number, relationshipTerm: string, recipientName: string): TextElement {
  const isTextDominant = template.pageType === 'letter';
  const positions: Record<TextRole, { xPct: number; yPct: number; align: TextElement['align'] }> = {
    chapterLabel: { xPct: 8, yPct: 8, align: 'left' },
    title: isTextDominant ? { xPct: 10, yPct: 20, align: 'left' } : { xPct: 50, yPct: 12, align: 'center' },
    quote: isTextDominant ? { xPct: 10, yPct: 32, align: 'left' } : { xPct: 50, yPct: 88, align: 'center' },
    caption: { xPct: 50, yPct: 92, align: 'center' },
  };
  const pos = positions[role];
  let text = '';
  if (role === 'title') text = defaultTitleFor(template.pageType, relationshipTerm, recipientName);
  else if (role === 'quote') text = defaultQuoteFor(template.narrativeBeat, relationshipTerm);
  else if (role === 'caption') text = defaultCaptionFor(template.narrativeBeat, relationshipTerm);
  else if (role === 'chapterLabel') text = chapterLabelFor(index);

  return {
    kind: 'text',
    id: nextId('text'),
    role,
    text,
    xPct: pos.xPct,
    yPct: pos.yPct,
    align: pos.align,
    color: template.pageType === 'letter' ? '#2A2320' : '#FFFFFF',
    // Font pairing: serif masthead for titles, a clean condensed sans for the
    // quiet kicker + captions, a readable serif for the letter page's long-form
    // body (cursive doesn't hold up over a paragraph), cursive reserved for
    // short, warm pull-quotes elsewhere.
    font: role === 'title'
      ? 'serif'
      : role === 'chapterLabel' || role === 'caption'
        ? 'condensed'
        : role === 'quote' && template.pageType === 'letter'
          ? 'vintage'
          : 'hand',
    fontSizePct: DEFAULT_FONT_SIZE_PCT[role],
    rotationDeg: 0,
  };
}

// Used by the editor's "+ Add Photo" / "+ Add Text" actions.
export function newPhotoElement(): PhotoElement {
  return buildPhoto({ xPct: 50, yPct: 50, widthPct: 30, heightPct: 30, isFullBleed: false });
}

export function newTextElement(color: string): TextElement {
  return {
    kind: 'text',
    id: nextId('text'),
    role: 'caption',
    text: 'New text',
    xPct: 50,
    yPct: 50,
    align: 'center',
    color,
    font: 'hand',
    fontSizePct: QUOTE_FONT_PCT,
    rotationDeg: 0,
  };
}

export function newMagazineProject(recipientName: string, relationshipTerm: string, occasion: string, themeColor: string): MagazineProject {
  const pages: MagazinePage[] = PAGE_TEMPLATES.map((template, index) => ({
    index,
    pageType: template.pageType,
    narrativeBeat: template.narrativeBeat,
    photos: template.photoSlots.map(buildPhoto),
    // Cover/closing pages never carry a chapter-label sticker per Design Bible §10.
    texts: template.textRoles
      .filter((role) => !(role === 'chapterLabel' && (template.pageType === 'cover' || template.pageType === 'closing')))
      .map((role) => buildText(role, template, index, relationshipTerm, recipientName)),
    bgColor: themeColor,
  }));
  return { recipientName, relationshipTerm, occasion, themeColor, pages };
}

// Re-applies the relationship-aware default text (title/quote/caption/chapterLabel)
// to every page, using the project's current recipient/relationship fields.
// Overwrites text only — photos and any custom positioning are left untouched.
export function refreshSuggestedText(project: MagazineProject): MagazineProject {
  return {
    ...project,
    pages: project.pages.map((page) => ({
      ...page,
      texts: page.texts.map((t) => {
        let text = t.text;
        if (t.role === 'title') text = defaultTitleFor(page.pageType, project.relationshipTerm, project.recipientName);
        else if (t.role === 'quote') text = defaultQuoteFor(page.narrativeBeat, project.relationshipTerm);
        else if (t.role === 'caption') text = defaultCaptionFor(page.narrativeBeat, project.relationshipTerm);
        else if (t.role === 'chapterLabel') text = chapterLabelFor(page.index);
        return { ...t, text };
      }),
    })),
  };
}

export const PAGE_TYPE_LABELS: Record<PageType, string> = {
  cover: 'Cover',
  connection: 'Connection',
  celebration: 'Celebration',
  letter: 'Letter',
  milestone: 'Milestone',
  closing: 'Closing',
};
