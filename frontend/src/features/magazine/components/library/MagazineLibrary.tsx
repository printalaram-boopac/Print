import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FolderOpen, RotateCcw, SearchX } from 'lucide-react';
import { ALL_CATEGORY, type CategoryFilter } from '../../constants';
import { useFavouriteTemplates } from '../../hooks/useFavouriteTemplates';
import { useTemplateCollection } from '../../hooks/useTemplateCollection';
import { TEMPLATE_INDEX } from '../../templates';
import type { MagazineTemplateMeta } from '../../types';
import { TemplateCard } from './TemplateCard';
import TemplateFilters from './TemplateFilters';

function matchesQuery(meta: MagazineTemplateMeta, query: string): boolean {
  if (!query) return true;
  const haystack = [meta.name, meta.category, meta.description, ...meta.keywords].join(' ').toLowerCase();
  // Every word must appear somewhere, so "dark fashion" narrows rather than widens.
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

/**
 * The template library: instant search, working category filters and a
 * responsive gallery whose covers are rendered from the template data itself.
 */
export default function MagazineLibrary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>(ALL_CATEGORY);
  const [favouritesOnly, setFavouritesOnly] = useState(false);

  // Typing stays responsive while the grid re-filters behind it.
  const deferredQuery = useDeferredValue(query);
  const { bySlug, loading, error, retry } = useTemplateCollection();
  const { favourites, toggle, isFavourite } = useFavouriteTemplates();

  const results = useMemo(
    () =>
      TEMPLATE_INDEX.filter((meta) => {
        if (favouritesOnly && !favourites.includes(meta.slug)) return false;
        if (!favouritesOnly && category !== ALL_CATEGORY && meta.category !== category) return false;
        return matchesQuery(meta, deferredQuery);
      }),
    [category, deferredQuery, favourites, favouritesOnly],
  );

  const clearFilters = () => {
    setQuery('');
    setCategory(ALL_CATEGORY);
    setFavouritesOnly(false);
  };

  return (
    <div className="space-y-10">
      <TemplateFilters
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        favouritesOnly={favouritesOnly}
        onFavouritesOnlyChange={setFavouritesOnly}
        favouriteCount={favourites.length}
        resultCount={results.length}
      />

      {error && (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-gold-200/60 bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="h-8 w-8 text-luxury-gold" />
          <div className="space-y-1">
            <h3 className="font-display text-lg font-semibold text-luxury-accent">Templates could not load</h3>
            <p className="text-sm text-gray-400">{error} Check your connection and try again.</p>
          </div>
          <button type="button" onClick={retry} className="btn-primary btn-magnetic">
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
        </div>
      )}

      {!error && results.length === 0 && (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-gold-200/60 bg-white p-10 text-center shadow-sm">
          {favouritesOnly ? (
            <FolderOpen className="h-8 w-8 text-luxury-gold" />
          ) : (
            <SearchX className="h-8 w-8 text-luxury-gold" />
          )}
          <div className="space-y-1">
            <h3 className="font-display text-lg font-semibold text-luxury-accent">
              {favouritesOnly ? 'No favourites yet' : 'No templates match that search'}
            </h3>
            <p className="text-sm text-gray-400">
              {favouritesOnly
                ? 'Tap the heart on any template to keep it here for later.'
                : 'Try a different word, or browse a category instead.'}
            </p>
          </div>
          <button type="button" onClick={clearFilters} className="btn-outline btn-magnetic">
            Show all templates
          </button>
        </div>
      )}

      {!error && results.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {results.map((meta, index) => (
            <TemplateCard
              key={meta.slug}
              meta={meta}
              template={bySlug[meta.slug]}
              index={index}
              isFavourite={isFavourite(meta.slug)}
              onToggleFavourite={toggle}
            />
          ))}
        </div>
      )}

      {loading && !error && (
        <p className="text-center text-xs uppercase tracking-widest text-gray-300">Loading template designs…</p>
      )}

      <div className="gold-divider" />

      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-gray-400">Already started a magazine?</p>
        <Link to="/my-magazines" className="btn-outline btn-magnetic">
          <FolderOpen className="h-4 w-4" /> Open my magazines
        </Link>
      </div>
    </div>
  );
}
