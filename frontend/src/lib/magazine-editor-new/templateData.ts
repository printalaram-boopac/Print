import type { EditorProject, TemplateCategory, TemplatePage } from './types';
import { DEFAULT_PAGE_NUMBER_SETTINGS } from './pageHelpers';
import { DEFAULT_BACKGROUND } from './pageBackground';
import { MAGAZINE_PACKS } from './templates/packRecipes';
import { buildLuxuryFashionTemplate } from './templates/luxuryFashionCanvaPack';

const CATEGORY_GRADIENTS: Record<TemplateCategory, string> = {
  Minimal: 'linear-gradient(155deg, #F5F5F3, #D6D6D2)',
  Lifestyle: 'linear-gradient(155deg, #E8B978, #7A4A6B)',
  Travel: 'linear-gradient(155deg, #B7CFC9, #3E6B63)',
  Fashion: 'linear-gradient(155deg, #2C2C2E, #545458)',
  Wedding: 'linear-gradient(155deg, #E8C3C3, #A85C5C)',
  Food: 'linear-gradient(155deg, #E9D6A8, #B8895A)',
  Family: 'linear-gradient(155deg, #CBD9E8, #5B7C9D)',
  Business: 'linear-gradient(155deg, #20272C, #454F56)',
  Portfolio: 'linear-gradient(155deg, #D9C7E8, #6E4E8C)',
  Birthday: 'linear-gradient(155deg, #E8B978, #D97B3F)',
  Baby: 'linear-gradient(155deg, #F7F5F1, #CBD9E8)',
  Memories: 'linear-gradient(155deg, #E9D6A8, #A85C5C)',
  Photography: 'linear-gradient(155deg, #D6D6D2, #14171A)',
};

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/** The premium multi-page magazine pack library (Step 9) — real, distinct,
 * editorial packs assembled by the layout engine in templates/, not a single
 * generic 8-page skeleton reused with a new name per category (that was the
 * old Step 2 placeholder approach; see templates/packRecipes.ts). Exported
 * as `TEMPLATES` to keep every existing consumer (useTemplateLibrary,
 * TemplateCard, the preview modal, etc.) unchanged. */
export const TEMPLATES = [buildLuxuryFashionTemplate(), ...MAGAZINE_PACKS];

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'Travel', 'Wedding', 'Fashion', 'Lifestyle', 'Family', 'Birthday',
  'Baby', 'Food', 'Business', 'Portfolio', 'Memories', 'Photography',
];

export function gradientForCategory(category: TemplateCategory): string {
  return CATEGORY_GRADIENTS[category];
}

export function buildBlankPages(): TemplatePage[] {
  return [{ id: nextId('page'), kind: 'cover', name: 'Cover', elements: [] }];
}

const DEFAULT_GRADIENT = 'linear-gradient(165deg, #E8B978 0%, #C97D4F 35%, #7A4A6B 70%, #2E2340 100%)';

/** What the editor opens with before the user has applied anything — the
 * original Step 1 "Moments" cover mockup, kept as the untouched default. */
export function buildDefaultProject(): EditorProject {
  return {
    templateId: null,
    templateName: 'Moments',
    accentGradient: DEFAULT_GRADIENT,
    dimensions: { widthMm: 210, heightMm: 297, orientation: 'portrait' },
    pages: [
      {
        id: nextId('page'),
        kind: 'cover',
        name: 'Cover',
        elements: [
          { id: nextId('el'), kind: 'text', role: 'kicker', content: 'A PRINTALARM MAGAZINE', xPct: 50, yPct: 10, widthPct: 80, heightPct: 5 },
          { id: nextId('el'), kind: 'text', role: 'headline', content: 'Moments', xPct: 50, yPct: 28, widthPct: 90, heightPct: 16 },
          { id: nextId('el'), kind: 'text', role: 'subheading', content: 'PEOPLE • PLACES • STORIES', xPct: 50, yPct: 40, widthPct: 80, heightPct: 5 },
        ],
      },
    ],
    pageNumbers: { ...DEFAULT_PAGE_NUMBER_SETTINGS },
    defaultBackground: { ...DEFAULT_BACKGROUND },
  };
}
