import type { PageNumberPosition, PageNumberSettings, PageRole, TemplatePage } from './types';

export const DEFAULT_PAGE_NUMBER_SETTINGS: PageNumberSettings = {
  enabled: false,
  startAtPageIndex: 1, // skip the cover by default
  startNumber: 1,
  position: 'bottom-center',
  hideOnCover: true,
  hideOnBackCover: false,
  fontKey: 'condensed',
  fontSize: 10,
  color: '#1C2024',
};

/** Role is derived from position by default so it survives reordering
 * automatically; an explicit `page.role` (set via Page Settings) overrides
 * that inference and sticks even if the page later moves. */
export function inferPageRole(index: number, total: number): PageRole {
  if (index === 0) return 'cover';
  if (total > 1 && index === total - 1) return 'back-cover';
  return 'inside';
}

export function resolvePageRole(page: TemplatePage, index: number, total: number): PageRole {
  return page.role ?? inferPageRole(index, total);
}

export function pageRoleLabel(role: PageRole): string {
  if (role === 'cover') return 'Cover';
  if (role === 'back-cover') return 'Back Cover';
  return 'Inside';
}

export interface Spread {
  left: number;
  right: number | null;
}

/** Page 1 (cover) alone, then 2+3, 4+5, 6+7… with a trailing odd page alone —
 * standard magazine facing-page behavior (Step 7 §38). */
export function computeSpreads(pageCount: number): Spread[] {
  if (pageCount === 0) return [];
  const spreads: Spread[] = [{ left: 0, right: null }];
  let i = 1;
  while (i < pageCount) {
    if (i + 1 < pageCount) {
      spreads.push({ left: i, right: i + 1 });
      i += 2;
    } else {
      spreads.push({ left: i, right: null });
      i += 1;
    }
  }
  return spreads;
}

export function spreadIndexForPage(spreads: Spread[], pageIndex: number): number {
  return spreads.findIndex((s) => s.left === pageIndex || s.right === pageIndex);
}

export function computePrintedNumber(orderIndex: number, role: PageRole, settings: PageNumberSettings): number | null {
  if (!settings.enabled) return null;
  if (role === 'cover' && settings.hideOnCover) return null;
  if (role === 'back-cover' && settings.hideOnBackCover) return null;
  if (orderIndex < settings.startAtPageIndex) return null;
  return settings.startNumber + (orderIndex - settings.startAtPageIndex);
}

export const PAGE_NUMBER_POSITIONS: { key: PageNumberPosition; label: string }[] = [
  { key: 'top-left', label: 'Top left' },
  { key: 'top-center', label: 'Top center' },
  { key: 'top-right', label: 'Top right' },
  { key: 'bottom-left', label: 'Bottom left' },
  { key: 'bottom-center', label: 'Bottom center' },
  { key: 'bottom-right', label: 'Bottom right' },
];

/** Deep-clones a page for duplicate/copy-paste: new page id, new element
 * ids, and a remapped (but internally consistent) groupId for any grouped
 * elements — image/asset URL strings are reused as-is (Step 7 §56: don't
 * duplicate uploaded files, only page/element metadata). */
export function clonePage(page: TemplatePage, nextId: (prefix: string) => string): TemplatePage {
  const groupIdMap = new Map<string, string>();
  const elements = page.elements.map((el) => {
    let groupId = el.groupId;
    if (groupId) {
      if (!groupIdMap.has(groupId)) groupIdMap.set(groupId, nextId('group'));
      groupId = groupIdMap.get(groupId);
    }
    return { ...el, id: nextId(el.kind), groupId };
  });
  return { ...page, id: nextId('page'), elements };
}
