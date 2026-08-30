import { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ALL_CATEGORY, MAGAZINE_CATEGORIES, type CategoryFilter } from '../../constants';
import { TEMPLATE_INDEX } from '../../templates/registry';

interface TemplateFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  favouritesOnly: boolean;
  onFavouritesOnlyChange: (value: boolean) => void;
  favouriteCount: number;
  resultCount: number;
}

const chip =
  'shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold';
const chipActive = 'bg-luxury-accent text-white border-luxury-accent shadow-sm';
const chipIdle = 'bg-luxury-accent/5 text-gray-500 border-luxury-accent/15 hover:text-luxury-accent hover:border-luxury-accent/40';

/**
 * Categories that actually have templates, in the canonical order.
 *
 * Derived from the registry rather than hard-coded, so adding or recategorising
 * a template can never leave a filter chip that returns nothing.
 */
function useAvailableCategories() {
  return useMemo(() => {
    const present = new Set(TEMPLATE_INDEX.map((t) => t.category));
    return MAGAZINE_CATEGORIES.filter((category) => present.has(category));
  }, []);
}

/** Search field plus the category and favourites filters for the library. */
export default function TemplateFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  favouritesOnly,
  onFavouritesOnlyChange,
  favouriteCount,
  resultCount,
}: TemplateFiltersProps) {
  const categories = useAvailableCategories();

  return (
    <div className="space-y-5">
      <div className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-gold-200/60 bg-white px-4 py-2.5 shadow-sm transition-colors focus-within:border-luxury-gold">
        <Search className="h-4 w-4 shrink-0 text-luxury-gold" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search magazine templates…"
          aria-label="Search magazine templates"
          className="w-full bg-transparent text-sm text-luxury-accent outline-none placeholder:text-gray-300"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:text-luxury-accent"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onCategoryChange(ALL_CATEGORY);
              onFavouritesOnlyChange(false);
            }}
            className={`${chip} ${category === ALL_CATEGORY && !favouritesOnly ? chipActive : chipIdle}`}
          >
            All
          </button>

          {favouriteCount > 0 && (
            <button
              type="button"
              onClick={() => onFavouritesOnlyChange(!favouritesOnly)}
              className={`${chip} ${favouritesOnly ? chipActive : chipIdle}`}
            >
              Favourites · {favouriteCount}
            </button>
          )}

          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              className={`${chip} ${category === item && !favouritesOnly ? chipActive : chipIdle}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400" aria-live="polite">
        {resultCount} {resultCount === 1 ? 'template' : 'templates'}
      </p>
    </div>
  );
}
