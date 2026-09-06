import type { UploadedPhoto } from './types';
import { saveAssetBlob } from './storage/assetStore';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25MB — generous for print-quality sources
const MIN_USEFUL_DIMENSION = 400; // px — below this, warn but still allow

export interface FileProcessResult {
  photo: UploadedPhoto | null;
  error: string | null;
}

function readImageDimensions(objectUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('corrupted'));
    img.src = objectUrl;
  });
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `upload-${Date.now()}-${idCounter}`;
}

export async function processUploadFile(file: File): Promise<FileProcessResult> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { photo: null, error: `"${file.name}" isn't a supported format. Use JPG, PNG, or WEBP.` };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { photo: null, error: `"${file.name}" is too large (max 25MB).` };
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const { width, height } = await readImageDimensions(objectUrl);
    const warning = width < MIN_USEFUL_DIMENSION || height < MIN_USEFUL_DIMENSION
      ? 'This image is too small for high-quality printing.'
      : undefined;
    const id = nextId();
    // Persist the actual file independently of project autosave (Step 11
    // §21) — a refresh before the next project save must not lose it.
    saveAssetBlob(id, file, { name: file.name, width, height }).catch(() => {
      // Best-effort: the image still works for this session via objectUrl;
      // it just won't survive a refresh if this failed (e.g. quota).
    });
    return {
      photo: { id, name: file.name, objectUrl, width, height, sizeBytes: file.size, warning },
      error: null,
    };
  } catch {
    URL.revokeObjectURL(objectUrl);
    return { photo: null, error: `"${file.name}" couldn't be read — the file may be corrupted.` };
  }
}
