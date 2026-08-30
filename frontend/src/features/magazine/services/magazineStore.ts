import type { MagazineDocument, SavedMagazine, SavedMagazineMeta, StorageDriver } from '../types';
import { MAGAZINE_SCHEMA_VERSION } from '../types';

/**
 * Storage abstraction for saved magazines.
 *
 * The editor only ever talks to this interface, so swapping the browser driver
 * for the API driver (or adding a third) needs no editor changes.
 */
export interface MagazineStore {
  readonly driver: StorageDriver;
  list(): Promise<SavedMagazineMeta[]>;
  get(id: string): Promise<SavedMagazine | null>;
  put(document: MagazineDocument): Promise<SavedMagazine>;
  remove(id: string): Promise<void>;
}

/** Thrown when the browser refuses to store any more data. */
export class StorageQuotaError extends Error {
  constructor() {
    super('This device is out of storage for saved magazines. Remove some photos or delete an old design, then try again.');
    this.name = 'StorageQuotaError';
  }
}

function toMeta(document: MagazineDocument, driver: StorageDriver): SavedMagazineMeta {
  return {
    id: document.id,
    title: document.title,
    templateId: document.templateId,
    pageCount: document.pages.length,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    driver,
  };
}

/* ─────────────────── Browser driver ─────────────────── */

const NS = 'printalarm.magazines';

const indexKey = (scope: string) => `${NS}.${scope}.index`;
const docKey = (scope: string, id: string) => `${NS}.${scope}.doc.${id}`;

function readIndex(scope: string): SavedMagazineMeta[] {
  try {
    const raw = localStorage.getItem(indexKey(scope));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as SavedMagazineMeta[]) : [];
  } catch {
    return [];
  }
}

function writeIndex(scope: string, entries: SavedMagazineMeta[]): void {
  localStorage.setItem(indexKey(scope), JSON.stringify(entries));
}

function isQuotaError(err: unknown): boolean {
  return (
    err instanceof DOMException &&
    (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
}

/**
 * Keeps designs in `localStorage`, namespaced per signed-in user (or `guest`)
 * so two accounts on one device never see each other's work.
 */
export function createLocalStore(scope: string): MagazineStore {
  return {
    driver: 'local',

    async list() {
      return readIndex(scope).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },

    async get(id) {
      try {
        const raw = localStorage.getItem(docKey(scope, id));
        if (!raw) return null;
        const document = JSON.parse(raw) as MagazineDocument;
        return { ...toMeta(document, 'local'), document };
      } catch {
        return null;
      }
    },

    async put(document) {
      try {
        localStorage.setItem(docKey(scope, document.id), JSON.stringify(document));
      } catch (err) {
        if (isQuotaError(err)) throw new StorageQuotaError();
        throw err;
      }
      const meta = toMeta(document, 'local');
      const entries = readIndex(scope).filter((e) => e.id !== document.id);
      entries.unshift(meta);
      try {
        writeIndex(scope, entries);
      } catch (err) {
        if (isQuotaError(err)) throw new StorageQuotaError();
        throw err;
      }
      return { ...meta, document };
    },

    async remove(id) {
      localStorage.removeItem(docKey(scope, id));
      writeIndex(
        scope,
        readIndex(scope).filter((e) => e.id !== id),
      );
    },
  };
}

/* ─────────────────── API driver ─────────────────── */

interface RemoteRow {
  id: string;
  title: string;
  templateId: string | null;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
  documentJson?: string;
}

function rowToMeta(row: RemoteRow): SavedMagazineMeta {
  return {
    id: row.id,
    title: row.title,
    templateId: row.templateId ?? null,
    pageCount: row.pageCount ?? 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    driver: 'remote',
  };
}

/**
 * Persists designs through the project's Express API so they follow the user
 * across devices. `request` is injected to reuse the app's authenticated
 * fetch wrapper without this module importing app-level concerns.
 */
export function createRemoteStore(
  request: (endpoint: string, options?: RequestInit) => Promise<any>,
): MagazineStore {
  return {
    driver: 'remote',

    async list() {
      const res = await request('/api/magazines');
      const rows: RemoteRow[] = res?.magazines ?? [];
      return rows.map(rowToMeta);
    },

    async get(id) {
      const res = await request(`/api/magazines/${id}`);
      const row: RemoteRow | undefined = res?.magazine;
      if (!row?.documentJson) return null;
      const document = JSON.parse(row.documentJson) as MagazineDocument;
      return { ...rowToMeta({ ...row, pageCount: document.pages.length }), document };
    },

    async put(document) {
      const body = JSON.stringify({
        id: document.id,
        title: document.title,
        templateId: document.templateId,
        pageCount: document.pages.length,
        schemaVersion: MAGAZINE_SCHEMA_VERSION,
        documentJson: JSON.stringify(document),
      });
      const res = await request('/api/magazines', { method: 'PUT', body });
      const row: RemoteRow = res?.magazine ?? {
        id: document.id,
        title: document.title,
        templateId: document.templateId,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      };
      return { ...rowToMeta({ ...row, pageCount: document.pages.length }), document };
    },

    async remove(id) {
      await request(`/api/magazines/${id}`, { method: 'DELETE' });
    },
  };
}
