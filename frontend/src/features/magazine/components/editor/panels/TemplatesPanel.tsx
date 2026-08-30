import { useState } from 'react';
import { AlertTriangle, LayoutTemplate, Loader2, Plus } from 'lucide-react';
import type { MagazinePage, MagazineTemplate } from '../../../types';
import { useTemplateCollection } from '../../../hooks/useTemplateCollection';
import { TEMPLATE_INDEX } from '../../../templates';
import { PageThumbnail } from '../../shared/PageThumbnail';
import { PanelSection } from '../controls';

interface TemplatesPanelProps {
  docWidth: number;
  docHeight: number;
  /** Adds one page layout from a template after the current page. */
  onAddPageFrom: (page: MagazinePage) => void;
  /** Replaces the whole document with a fresh copy of a template. */
  onApplyTemplate: (template: MagazineTemplate) => void;
}

/**
 * Browse the library from inside the editor: swap the whole magazine for
 * another template, or borrow a single page layout from any of them.
 */
export default function TemplatesPanel({
  docWidth,
  docHeight,
  onAddPageFrom,
  onApplyTemplate,
}: TemplatesPanelProps) {
  const { bySlug, loading, error } = useTemplateCollection();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="space-y-6 p-4">
      <PanelSection title="Templates">
        <p className="rounded-lg bg-luxury-gray/70 p-2.5 text-[10px] leading-relaxed text-gray-500">
          Tap a template to see its pages. Add a single page layout, or replace your whole magazine.
        </p>
      </PanelSection>

      {error && (
        <p className="flex items-start gap-1.5 text-[11px] text-red-600">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}

      <div className="space-y-2">
        {TEMPLATE_INDEX.map((meta) => {
          const template = bySlug[meta.slug];
          const isOpen = openSlug === meta.slug;

          return (
            <div key={meta.slug} className="overflow-hidden rounded-xl border border-gold-200/50 bg-white">
              <button
                type="button"
                onClick={() => setOpenSlug(isOpen ? null : meta.slug)}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-amber-50/50"
              >
                <span className="h-6 w-6 shrink-0 rounded" style={{ background: meta.accent }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-luxury-accent">{meta.name}</span>
                  <span className="block text-[10px] text-gray-400">
                    {meta.category} · {meta.pageCount} pages
                  </span>
                </span>
                {loading && !template ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-300" />
                ) : (
                  <LayoutTemplate className="h-3.5 w-3.5 text-gray-300" />
                )}
              </button>

              {isOpen && template && (
                <div className="space-y-2.5 border-t border-gold-200/40 p-3">
                  <div className="grid grid-cols-4 gap-2">
                    {template.pages.map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => onAddPageFrom(page)}
                        title={`Add “${page.name}” after the current page`}
                        className="group relative overflow-hidden rounded border border-gold-200/60 transition-all hover:border-luxury-gold"
                      >
                        <PageThumbnail page={page} docWidth={docWidth} docHeight={docHeight} width={54} />
                        <span className="absolute inset-0 flex items-center justify-center bg-luxury-accent/70 opacity-0 transition-opacity group-hover:opacity-100">
                          <Plus className="h-3.5 w-3.5 text-white" />
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onApplyTemplate(template)}
                    className="w-full rounded-lg border border-gold-200/50 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-luxury-accent transition-colors hover:border-luxury-gold hover:bg-amber-50/60"
                  >
                    Replace my magazine with this
                  </button>
                </div>
              )}

              {isOpen && !template && !loading && (
                <p className="border-t border-gold-200/40 p-3 text-[10px] text-gray-400">
                  This template’s pages are unavailable right now.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
