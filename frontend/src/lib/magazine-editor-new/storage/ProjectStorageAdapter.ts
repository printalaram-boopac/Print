import type { EditorProject } from '../types';
import type { ProjectSummary, StoredProject } from './types';

/**
 * Persistence is behind this interface, not called directly from components
 * (Step 11 §48) — `LocalProjectStorageAdapter` is the only implementation
 * today; a future `RemoteProjectStorageAdapter` can implement the exact same
 * contract once real backend endpoints exist, without touching the editor.
 */
export interface ProjectStorageAdapter {
  createProject(document: EditorProject, name?: string): Promise<StoredProject>;
  /** Revision auto-increments on every save (Step 11 §52) — true multi-writer
   * conflict resolution needs a real backend and is out of scope here; the
   * save-token/"ignore stale in-flight save" guard that matters today lives
   * in the React hook that calls this (useAutosave), not in this adapter. */
  saveProject(id: string, document: EditorProject): Promise<StoredProject>;
  loadProject(id: string): Promise<StoredProject | undefined>;
  listProjects(): Promise<ProjectSummary[]>;
  duplicateProject(id: string): Promise<StoredProject>;
  renameProject(id: string, name: string): Promise<StoredProject>;
  deleteProject(id: string, hard?: boolean): Promise<void>;
  saveThumbnail(id: string, thumbnail: string): Promise<void>;
}
