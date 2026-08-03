import { useEffect } from 'react';

const SITE_URL = 'https://printalarm.in';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** JSON-LD objects to inject for this page (e.g. Product, BreadcrumbList). */
  jsonLd?: object[];
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Sets per-page title/meta/canonical tags and injects page-scoped JSON-LD, cleaning up on route change. */
export default function Seo({ title, description, path, image, jsonLd }: SeoProps) {
  // jsonLd is typically a fresh array/object literal every render — key on its
  // serialized content instead of identity so the effect doesn't thrash.
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const ogImage = image ? new URL(image, SITE_URL).href : DEFAULT_IMAGE;

    document.title = title;

    upsertMeta('name', 'description', description);
    upsertCanonical(url);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    const scripts: HTMLScriptElement[] = [];
    (jsonLd || []).forEach((data) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      script.dataset.pageSeo = 'true';
      document.head.appendChild(script);
      scripts.push(script);
    });

    return () => {
      scripts.forEach((s) => s.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, jsonLdKey]);

  return null;
}
