import type { EditorProject, TemplateDimensions, TemplatePage } from '../types';

/** Bump when EditorProject's shape changes in a way old saved projects can't
 * already satisfy — migrateProject() below is where old data gets upgraded,
 * so the editor never has to assume every saved project matches today's
 * code (Step 11 §13–14). */
export const SCHEMA_VERSION = 1;

export type ProjectStatus = 'active' | 'trashed';

export interface ProjectMeta {
  id: string;
  name: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  ownerId?: string; // unset until auth exists — ready for it, not required by it
  schemaVersion: number;
  revision: number;
  status: ProjectStatus;
  templateId?: string | null;
  pageCount: number;
}

/** What actually lives in the `projects` IndexedDB store — project metadata
 * plus the full serializable document. `document` already carries every
 * page/element/background/pageNumber field from Steps 1–10 (EditorProject),
 * so there is no second, separately-maintained save format. */
export interface StoredProject extends ProjectMeta {
  document: EditorProject;
  /** Small data-URL cover preview, cached so My Designs never re-renders a
   * full project just to show a thumbnail (Step 11 §33–34). */
  thumbnail?: string | null;
}

/** Lightweight enough for a My Designs grid (Step 11 §34) — only the cover
 * page (for a real MiniPageThumbnail, not a cached raster) travels with the
 * summary, never the full page list/document. */
export interface ProjectSummary extends ProjectMeta {
  thumbnail?: string | null;
  coverPage: TemplatePage;
  dimensions: TemplateDimensions;
  accentGradient: string;
}

export interface RecoverySnapshot {
  projectId: string;
  projectName: string;
  schemaVersion: number;
  savedAt: string;
  document: EditorProject;
}

export interface StoredAsset {
  id: string;
  type: 'image';
  name: string;
  mimeType: string;
  width: number;
  height: number;
  size: number;
  blob: Blob;
  storageType: 'local';
  createdAt: string;
}
