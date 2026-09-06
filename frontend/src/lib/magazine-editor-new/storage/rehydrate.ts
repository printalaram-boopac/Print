import type { EditorProject } from '../types';
import { resolveAssetObjectUrl } from './assetStore';

/**
 * Object URLs die on reload, so any element/background that references an
 * uploaded asset gets a *fresh* object URL rebuilt from the persisted blob
 * before the project is handed to the editor (Step 11 §18). Elements whose
 * asset is missing (cleared local storage, etc.) fall back to `null` —
 * rendered as an empty frame/placeholder rather than a broken image
 * (§72), and the rest of the project still opens normally.
 *
 * Returns the rehydrated document plus every object URL created, so the
 * caller can revoke them when the project is closed/switched.
 */
export async function rehydrateProjectAssets(document: EditorProject): Promise<{ document: EditorProject; createdUrls: string[] }> {
  const cache = new Map<string, string | null>();
  const createdUrls: string[] = [];

  async function resolve(assetId: string): Promise<string | null> {
    if (cache.has(assetId)) return cache.get(assetId)!;
    const url = await resolveAssetObjectUrl(assetId);
    cache.set(assetId, url);
    if (url) createdUrls.push(url);
    return url;
  }

  const pages = await Promise.all(document.pages.map(async (page) => {
    let background = page.background;
    if (background?.type === 'image' && background.image?.assetId) {
      const url = await resolve(background.image.assetId);
      background = { ...background, image: { ...background.image, src: url ?? '', originalSrc: url ?? background.image.originalSrc } };
    }

    const elements = await Promise.all(page.elements.map(async (el) => {
      if (el.kind !== 'image' || !el.assetId) return el;
      const url = await resolve(el.assetId);
      return { ...el, imgSrc: url, originalSrc: url ?? el.originalSrc };
    }));

    return { ...page, background, elements };
  }));

  return { document: { ...document, pages }, createdUrls };
}
