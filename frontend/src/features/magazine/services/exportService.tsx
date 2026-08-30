import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { jsPDF } from 'jspdf';
import { getFontEmbedCSS, toJpeg, toPng } from 'html-to-image';
import PageRenderer from '../components/shared/PageRenderer';
import { findPageSize } from '../constants';
import { fontsReady } from '../fonts';
import type { MagazineDocument } from '../types';

/**
 * Export pipeline.
 *
 * Pages are re-rendered off-screen from the document data at full document
 * scale, then captured. Nothing from the editor — selection outlines, handles,
 * empty-frame labels, toolbars — exists in that render, so no interface chrome
 * can ever leak into a file. Keeping this in one module also means swapping in
 * server-side rendering later touches only this file.
 */

export class ExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExportError';
  }
}

/** 2x gives ~192 DPI on A4 — sharp in print without an unusable file size. */
const PIXEL_RATIO = 2;
const JPEG_QUALITY = 0.94;

/** Upper bound per page so a stuck capture surfaces as an error, not a spinner. */
const PAGE_CAPTURE_TIMEOUT_MS = 45000;

export type ExportProgress = (done: number, total: number) => void;

/**
 * Waits for the browser to settle, with a timer as a guaranteed backstop.
 *
 * `requestAnimationFrame` is paused in tabs that are not compositing (a
 * backgrounded tab, for instance). Racing it against a timeout means an export
 * still finishes if the user switches away mid-run instead of hanging forever.
 */
function settle(timeoutMs = 60): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    requestAnimationFrame(() => requestAnimationFrame(finish));
  });
}

/** Fails loudly instead of spinning forever if a capture never resolves. */
function withTimeout<T>(promise: Promise<T>, ms: number, what: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new ExportError(`${what} took too long. Try exporting fewer pages, or removing very large photos.`)),
      ms,
    );
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        window.clearTimeout(timer);
        reject(err);
      },
    );
  });
}

/** Typeface + weight combinations the document actually references. */
function usedFontVariants(document_: MagazineDocument): Map<string, Set<number>> {
  // Inter/400 is always included: it styles empty-frame labels and is the
  // fallback for any element whose family failed to load.
  const used = new Map<string, Set<number>>([['inter', new Set([400])]]);
  for (const page of document_.pages) {
    for (const element of page.elements) {
      if (element.type !== 'text') continue;
      const key = element.fontFamily.toLowerCase();
      const weights = used.get(key) ?? new Set<number>();
      weights.add(element.fontWeight);
      used.set(key, weights);
    }
  }
  return used;
}

/**
 * Chrome normalises `unicode-range` and strips leading zeros, so the Latin
 * subset appears as `U+0-FF` rather than `U+0000-00FF`. Blocks without a range
 * cover everything and are always kept.
 */
function isLatinSubset(range: string): boolean {
  return range === '' || /U\+0{1,4}-0{0,2}FF/i.test(range);
}

/**
 * Reduces embedded font CSS to just what this document needs.
 *
 * `getFontEmbedCSS` inlines every webfont on the page as base64 — the editorial
 * font set comes to well over ten megabytes across ~330 `@font-face` blocks,
 * because Google serves each family once per weight per unicode subset.
 * Embedding all of that into every page capture makes rasterisation crawl and
 * bloats the PDF. A magazine uses a handful of faces, so keeping only the
 * referenced families and weights in the Latin subset cuts the payload by well
 * over an order of magnitude.
 */
function filterFontFaces(css: string, document_: MagazineDocument): string {
  const used = usedFontVariants(document_);
  const seen = new Set<string>();

  return css
    .split('@font-face')
    .slice(1)
    .map((block) => {
      const family = block.match(/font-family:\s*["']?([^;"']+)["']?\s*;/i)?.[1]?.trim().toLowerCase();
      if (!family) return '';

      const weights = used.get(family);
      if (!weights) return '';

      const range = block.match(/unicode-range:\s*([^;]+);/i)?.[1]?.trim() ?? '';
      if (!isLatinSubset(range)) return '';

      const weightText = block.match(/font-weight:\s*([^;]+);/i)?.[1]?.trim();
      const weight = weightText ? Number(weightText) : NaN;
      // Variable fonts report a range (e.g. "100 900") — keep those outright.
      if (Number.isFinite(weight) && !weights.has(weight)) return '';

      const style = block.match(/font-style:\s*([^;]+);/i)?.[1]?.trim() ?? 'normal';
      const key = `${family}|${weightText ?? 'any'}|${style}|${range}`;
      if (seen.has(key)) return '';
      seen.add(key);

      return `@font-face${block}`;
    })
    .join('');
}

/** Font CSS for one export run: computed once, reused for every page. */
async function buildFontEmbedCss(node: HTMLElement, document_: MagazineDocument): Promise<string> {
  try {
    const all = await withTimeout(getFontEmbedCSS(node), 20000, 'Preparing fonts');
    return filterFontFaces(all, document_);
  } catch {
    // Without embedded fonts the capture falls back to system faces rather than
    // failing the whole export.
    return '';
  }
}

/** Waits for every <img> inside the off-screen render to finish decoding. */
async function imagesSettled(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  );
}

/**
 * Renders the requested pages off-screen, hands their DOM nodes to `use`, then
 * tears the render down — even if `use` throws.
 */
async function withRenderedPages<T>(
  document_: MagazineDocument,
  pageIndexes: number[],
  use: (nodes: HTMLDivElement[], fontEmbedCSS: string) => Promise<T>,
): Promise<T> {
  const host = document.createElement('div');
  host.setAttribute('data-magazine-export', 'true');
  host.style.cssText = [
    'position: fixed',
    'left: -20000px',
    'top: 0',
    'z-index: -1',
    'pointer-events: none',
    'background: #ffffff',
  ].join(';');
  document.body.appendChild(host);

  const root = createRoot(host);
  const nodes: HTMLDivElement[] = [];

  try {
    // flushSync commits the off-screen pages synchronously, so the capture below
    // never races React's scheduler.
    flushSync(() => {
      root.render(
      <>
        {pageIndexes.map((index, slot) => (
          <div
            key={document_.pages[index].id}
            ref={(node) => {
              if (node) nodes[slot] = node;
            }}
            style={{ width: document_.width, height: document_.height }}
          >
            <PageRenderer
              page={document_.pages[index]}
              width={document_.width}
              height={document_.height}
              scale={1}
              showPlaceholderLabels={false}
            />
          </div>
        ))}
      </>,
      );
    });

    await settle();
    await fontsReady();
    await imagesSettled(host);
    await settle();

    if (nodes.filter(Boolean).length !== pageIndexes.length) {
      throw new ExportError('The pages could not be prepared for export. Please try again.');
    }

    const fontEmbedCSS = await buildFontEmbedCss(host, document_);
    return await use(nodes, fontEmbedCSS);
  } finally {
    root.unmount();
    host.remove();
  }
}

function triggerDownload(dataUrl: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function magazineFileName(document_: MagazineDocument, extension: string, pageNumber?: number): string {
  const base =
    document_.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'magazine';
  return pageNumber ? `${base}-page-${pageNumber}.${extension}` : `${base}.${extension}`;
}

/**
 * Exports every page into a single PDF at the document's true paper size, in
 * page order, with typography and image quality preserved.
 */
export async function exportMagazinePdf(
  document_: MagazineDocument,
  onProgress?: ExportProgress,
): Promise<void> {
  if (document_.pages.length === 0) {
    throw new ExportError('This magazine has no pages to export.');
  }

  const size = findPageSize(document_.width, document_.height);
  const orientation = size.mm.width > size.mm.height ? 'landscape' : 'portrait';
  const indexes = document_.pages.map((_, i) => i);

  await withRenderedPages(document_, indexes, async (nodes, fontEmbedCSS) => {
    const pdf = new jsPDF({
      unit: 'mm',
      format: [size.mm.width, size.mm.height],
      orientation,
      compress: true,
    });

    for (let i = 0; i < nodes.length; i += 1) {
      const dataUrl = await withTimeout(
        toJpeg(nodes[i], {
          pixelRatio: PIXEL_RATIO,
          quality: JPEG_QUALITY,
          backgroundColor: '#ffffff',
          width: document_.width,
          height: document_.height,
          fontEmbedCSS,
        }),
        PAGE_CAPTURE_TIMEOUT_MS,
        `Page ${i + 1}`,
      );

      if (i > 0) pdf.addPage([size.mm.width, size.mm.height], orientation);
      pdf.addImage(dataUrl, 'JPEG', 0, 0, size.mm.width, size.mm.height, undefined, 'FAST');
      onProgress?.(i + 1, nodes.length);
    }

    pdf.save(magazineFileName(document_, 'pdf'));
  });
}

/** Exports a single page as a PNG image at export resolution. */
export async function exportPagePng(document_: MagazineDocument, pageIndex: number): Promise<void> {
  const page = document_.pages[pageIndex];
  if (!page) throw new ExportError('That page no longer exists.');

  await withRenderedPages(document_, [pageIndex], async ([node], fontEmbedCSS) => {
    const dataUrl = await withTimeout(
      toPng(node, {
        pixelRatio: PIXEL_RATIO,
        backgroundColor: '#ffffff',
        width: document_.width,
        height: document_.height,
        fontEmbedCSS,
      }),
      PAGE_CAPTURE_TIMEOUT_MS,
      `Page ${pageIndex + 1}`,
    );
    triggerDownload(dataUrl, magazineFileName(document_, 'png', pageIndex + 1));
  });
}

/** Exports every page as an individual JPG, one download per page. */
export async function exportAllPagesJpg(
  document_: MagazineDocument,
  onProgress?: ExportProgress,
): Promise<void> {
  const indexes = document_.pages.map((_, i) => i);

  await withRenderedPages(document_, indexes, async (nodes, fontEmbedCSS) => {
    for (let i = 0; i < nodes.length; i += 1) {
      const dataUrl = await withTimeout(
        toJpeg(nodes[i], {
          pixelRatio: PIXEL_RATIO,
          quality: JPEG_QUALITY,
          backgroundColor: '#ffffff',
          width: document_.width,
          height: document_.height,
          fontEmbedCSS,
        }),
        PAGE_CAPTURE_TIMEOUT_MS,
        `Page ${i + 1}`,
      );
      triggerDownload(dataUrl, magazineFileName(document_, 'jpg', i + 1));
      onProgress?.(i + 1, nodes.length);
      // Browsers drop rapid successive downloads; give each one a tick.
      await settle(150);
    }
  });
}
