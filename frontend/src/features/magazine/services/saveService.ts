import { apiFetch, BACKEND_ENABLED } from '@/lib/api';
import type { MagazineDocument, SavedMagazine, SavedMagazineMeta, StorageDriver } from '../types';
import { createLocalStore, createRemoteStore, StorageQuotaError, type MagazineStore } from './magazineStore';
import { duplicateDocument } from './templateService';

/**
 * Save/load orchestration.
 *
 * Signed-in users go to the API so their magazines follow them between
 * devices. If the API is unreachable — or nobody is signed in — the same
 * documents are written to this browser instead, and the caller is told which
 * happened so the UI can say so honestly.
 */

export interface SaveContext {
  /** Signed-in user id, or `null` for a guest working locally. */
  userId: string | null;
}

export interface SaveOutcome {
  saved: SavedMagazine;
  driver: StorageDriver;
  /** True when a remote save was attempted, failed, and landed locally. */
  fellBackToLocal: boolean;
}

/**
 * Set once per session after the first API failure so the editor stops
 * retrying a backend that is not there and autosave stays fast.
 */
let remoteUnavailable = false;

export function isRemoteAvailable(context: SaveContext): boolean {
  return BACKEND_ENABLED && !remoteUnavailable && Boolean(context.userId);
}

function localStore(context: SaveContext): MagazineStore {
  return createLocalStore(context.userId ?? 'guest');
}

function remoteStore(): MagazineStore {
  return createRemoteStore(apiFetch);
}

/** Quota failures must reach the user, so they are never swallowed as fallback. */
function markRemoteDown(err: unknown): void {
  if (err instanceof StorageQuotaError) return;
  remoteUnavailable = true;
}

export async function saveMagazine(document: MagazineDocument, context: SaveContext): Promise<SaveOutcome> {
  const stamped: MagazineDocument = { ...document, updatedAt: new Date().toISOString() };

  if (isRemoteAvailable(context)) {
    try {
      const saved = await remoteStore().put(stamped);
      // Mirror remotely-saved work locally so a later offline session can still
      // open it read-write.
      await localStore(context).put(stamped).catch(() => undefined);
      return { saved, driver: 'remote', fellBackToLocal: false };
    } catch (err) {
      markRemoteDown(err);
      const saved = await localStore(context).put(stamped);
      return { saved, driver: 'local', fellBackToLocal: true };
    }
  }

  const saved = await localStore(context).put(stamped);
  return { saved, driver: 'local', fellBackToLocal: false };
}

export async function loadMagazine(id: string, context: SaveContext): Promise<SavedMagazine | null> {
  if (isRemoteAvailable(context)) {
    try {
      const remote = await remoteStore().get(id);
      if (remote) return remote;
    } catch (err) {
      markRemoteDown(err);
    }
  }
  return localStore(context).get(id);
}

export async function listUserMagazines(context: SaveContext): Promise<SavedMagazineMeta[]> {
  const local = await localStore(context).list();

  if (!isRemoteAvailable(context)) return local;

  try {
    const remote = await remoteStore().list();
    // Remote wins on id collisions — it is the copy other devices will see.
    const merged = new Map<string, SavedMagazineMeta>();
    for (const entry of local) merged.set(entry.id, entry);
    for (const entry of remote) merged.set(entry.id, entry);
    return [...merged.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch (err) {
    markRemoteDown(err);
    return local;
  }
}

export async function deleteMagazine(id: string, context: SaveContext): Promise<void> {
  if (isRemoteAvailable(context)) {
    try {
      await remoteStore().remove(id);
    } catch (err) {
      markRemoteDown(err);
    }
  }
  await localStore(context).remove(id);
}

export async function duplicateMagazine(id: string, context: SaveContext): Promise<SaveOutcome | null> {
  const existing = await loadMagazine(id, context);
  if (!existing) return null;
  return saveMagazine(duplicateDocument(existing.document), context);
}

export async function renameMagazine(
  id: string,
  title: string,
  context: SaveContext,
): Promise<SaveOutcome | null> {
  const existing = await loadMagazine(id, context);
  if (!existing) return null;
  return saveMagazine({ ...existing.document, title }, context);
}

export { StorageQuotaError };
