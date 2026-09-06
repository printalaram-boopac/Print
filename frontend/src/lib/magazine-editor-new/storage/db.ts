const DB_NAME = 'printalarm-magazine-maker';
const DB_VERSION = 1;

export const STORES = {
  projects: 'projects',
  assets: 'assets',
  recovery: 'recovery',
} as const;

let dbPromise: Promise<IDBDatabase> | null = null;

/** One shared IndexedDB connection for the whole editor — projects, asset
 * blobs, and recovery snapshots each get their own object store so a large
 * project document never needs to embed binary image data (Step 11 §16, §75). */
export function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORES.projects)) db.createObjectStore(STORES.projects, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORES.assets)) db.createObjectStore(STORES.assets, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORES.recovery)) db.createObjectStore(STORES.recovery, { keyPath: 'projectId' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Failed to open local storage.'));
  });
  return dbPromise;
}

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'));
  });
}

export async function dbGet<T>(store: string, key: IDBValidKey): Promise<T | undefined> {
  const db = await openDb();
  return promisify(db.transaction(store, 'readonly').objectStore(store).get(key));
}

export async function dbGetAll<T>(store: string): Promise<T[]> {
  const db = await openDb();
  return promisify(db.transaction(store, 'readonly').objectStore(store).getAll());
}

export async function dbPut<T>(store: string, value: T): Promise<void> {
  const db = await openDb();
  await promisify(db.transaction(store, 'readwrite').objectStore(store).put(value));
}

export async function dbDelete(store: string, key: IDBValidKey): Promise<void> {
  const db = await openDb();
  await promisify(db.transaction(store, 'readwrite').objectStore(store).delete(key));
}
