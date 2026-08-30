import { UPLOAD_JPEG_QUALITY, UPLOAD_MAX_EDGE } from '../constants';

/**
 * Photo intake for the editor.
 *
 * Browser files are downscaled before they ever enter a document: originals
 * from a modern phone are 4–8 MB each, which would blow past the browser
 * storage budget within a couple of pages and slow every render. The result is
 * a data URL, so a design stays self-contained and exports without CORS
 * problems.
 */

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadError';
  }
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

export const UPLOAD_ACCEPT_ATTRIBUTE = ACCEPTED.join(',');

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new UploadError('That file could not be read. Try a different image.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new UploadError('That image could not be decoded. Try a JPG or PNG.'));
    image.src = src;
  });
}

export interface ProcessedImage {
  src: string;
  width: number;
  height: number;
}

/** Validates, downscales and encodes a picked file for use in a document. */
export async function processImageFile(file: File): Promise<ProcessedImage> {
  if (!ACCEPTED.includes(file.type)) {
    throw new UploadError('Please choose a JPG, PNG, WebP or AVIF image.');
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new UploadError('That image is over 25 MB. Please choose a smaller file.');
  }

  const original = await readAsDataUrl(file);
  const image = await loadImage(original);

  const longestEdge = Math.max(image.naturalWidth, image.naturalHeight);
  const ratio = longestEdge > UPLOAD_MAX_EDGE ? UPLOAD_MAX_EDGE / longestEdge : 1;
  const width = Math.max(1, Math.round(image.naturalWidth * ratio));
  const height = Math.max(1, Math.round(image.naturalHeight * ratio));

  // Already small enough and in a format we can keep verbatim.
  if (ratio === 1 && file.size < 900 * 1024) {
    return { src: original, width, height };
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new UploadError('This browser could not process the image.');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, width, height);

  // PNG sources keep transparency; everything else re-encodes as JPEG.
  const keepAlpha = file.type === 'image/png';
  const src = keepAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', UPLOAD_JPEG_QUALITY);

  return { src, width, height };
}

/** Processes a picked file list, reporting per-file failures to the caller. */
export async function processImageFiles(
  files: FileList | File[],
  onError?: (message: string) => void,
): Promise<ProcessedImage[]> {
  const results: ProcessedImage[] = [];
  for (const file of Array.from(files)) {
    try {
      results.push(await processImageFile(file));
    } catch (err) {
      onError?.(err instanceof UploadError ? err.message : `Could not add ${file.name}.`);
    }
  }
  return results;
}
