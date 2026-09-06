/**
 * Loads an image for export use, decoded and CORS-safe so it never taints a
 * canvas (Step 12 §77–78). Caches per export run so the same asset used on
 * multiple pages/elements is only fetched once. Missing/failed assets
 * resolve to `null` instead of throwing, so one bad image never fails the
 * whole export (§66, §72) — the caller records it as a preflight/export issue.
 */
export class AssetResolver {
  private cache = new Map<string, Promise<HTMLImageElement | null>>();

  async load(src: string | null | undefined): Promise<HTMLImageElement | null> {
    if (!src) return null;
    const cached = this.cache.get(src);
    if (cached) return cached;

    const promise = new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      if (!src.startsWith('blob:') && !src.startsWith('data:')) img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
    this.cache.set(src, promise);
    return promise;
  }

  clear(): void {
    this.cache.clear();
  }
}
