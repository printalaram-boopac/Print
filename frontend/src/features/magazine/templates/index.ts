import type { MagazineTemplate, MagazineTemplateMeta } from '../types';
import { template } from './builders';
import { TEMPLATE_INDEX } from './registry';

/**
 * Template registry.
 *
 * `TEMPLATE_INDEX` (re-exported from `./registry`) is static and tiny, so the
 * library route can render its search, filters and card skeletons immediately.
 * The page data for all templates lives in `./collection`, reached through a
 * single dynamic import the first time a caller actually needs pages.
 */
export { TEMPLATE_INDEX };

const META_BY_SLUG = new Map(TEMPLATE_INDEX.map((m) => [m.slug, m]));

export function findTemplateMeta(slug: string): MagazineTemplateMeta | undefined {
  return META_BY_SLUG.get(slug);
}

/** Cached dynamic import so the collection is fetched and parsed at most once. */
let collectionPromise: Promise<Record<string, MagazineTemplate>> | null = null;

function loadCollection(): Promise<Record<string, MagazineTemplate>> {
  if (!collectionPromise) {
    collectionPromise = import('./collection')
      .then(({ TEMPLATE_PAGES }) => {
        const built: Record<string, MagazineTemplate> = {};
        for (const meta of TEMPLATE_INDEX) {
          const pages = TEMPLATE_PAGES[meta.slug];
          if (!pages) continue;
          built[meta.slug] = template(meta, pages);
        }
        return built;
      })
      .catch((err) => {
        // Let the next attempt retry instead of caching a rejected promise.
        collectionPromise = null;
        throw err;
      });
  }
  return collectionPromise;
}

/** Every template, fully built. Resolves from cache after the first call. */
export async function loadAllTemplates(): Promise<MagazineTemplate[]> {
  const built = await loadCollection();
  return TEMPLATE_INDEX.map((meta) => built[meta.slug]).filter(Boolean);
}

/** A single template by slug, or `null` when the slug is unknown. */
export async function loadTemplate(slug: string): Promise<MagazineTemplate | null> {
  const built = await loadCollection();
  return built[slug] ?? null;
}
