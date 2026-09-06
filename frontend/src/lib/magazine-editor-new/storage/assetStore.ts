import { dbDelete, dbGet, dbPut, STORES } from './db';
import type { StoredAsset } from './types';

/**
 * Uploaded images are persisted here immediately on upload (Step 11 §17,
 * §21) — independent of project autosave, so a refresh before the next
 * project save can never lose the file itself. Canvas elements only ever
 * store an `assetId` reference (Step 11 §20), never duplicate image bytes.
 */
export async function saveAssetBlob(id: string, file: Blob, meta: { name: string; width: number; height: number }): Promise<void> {
  const asset: StoredAsset = {
    id, type: 'image', name: meta.name, mimeType: file.type || 'image/jpeg',
    width: meta.width, height: meta.height, size: file.size, blob: file,
    storageType: 'local', createdAt: new Date().toISOString(),
  };
  await dbPut(STORES.assets, asset);
}

export async function getAssetBlob(id: string): Promise<StoredAsset | undefined> {
  return dbGet<StoredAsset>(STORES.assets, id);
}

export async function deleteAssetBlob(id: string): Promise<void> {
  await dbDelete(STORES.assets, id);
}

/** Rebuilds a fresh, valid object URL from a persisted blob — object URLs
 * themselves are never saved as permanent sources, since they die on reload
 * (Step 11 §18). Returns null if the asset is missing (e.g. it was never
 * persisted, or local storage was cleared) so callers can show a neutral
 * placeholder instead of a broken image. */
export async function resolveAssetObjectUrl(id: string): Promise<string | null> {
  const asset = await getAssetBlob(id);
  if (!asset) return null;
  return URL.createObjectURL(asset.blob);
}
