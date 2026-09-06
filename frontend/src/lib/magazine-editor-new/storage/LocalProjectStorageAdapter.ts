import type { EditorProject, TemplatePage } from '../types';
import { clonePage } from '../pageHelpers';
import { dbDelete, dbGet, dbGetAll, dbPut, STORES } from './db';
import { migrateProject } from './migrate';
import { SCHEMA_VERSION, type ProjectSummary, type StoredProject } from './types';
import type { ProjectStorageAdapter } from './ProjectStorageAdapter';

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

function toSummary(p: StoredProject): ProjectSummary {
  const { document, ...meta } = p;
  return {
    ...meta,
    coverPage: document.pages[0],
    dimensions: document.dimensions,
    accentGradient: document.accentGradient,
  };
}

/**
 * IndexedDB-backed implementation of ProjectStorageAdapter (Step 11 §49) —
 * the only storage adapter that exists today; a cloud adapter would satisfy
 * the same interface once real endpoints exist (§50).
 */
export class LocalProjectStorageAdapter implements ProjectStorageAdapter {
  async createProject(document: EditorProject, name = 'Untitled Magazine'): Promise<StoredProject> {
    const now = new Date().toISOString();
    const project: StoredProject = {
      id: nextId('proj'),
      name,
      createdAt: now,
      updatedAt: now,
      schemaVersion: SCHEMA_VERSION,
      revision: 1,
      status: 'active',
      templateId: document.templateId,
      pageCount: document.pages.length,
      document,
      thumbnail: null,
    };
    await dbPut(STORES.projects, project);
    return project;
  }

  async saveProject(id: string, document: EditorProject): Promise<StoredProject> {
    const existing = await dbGet<StoredProject>(STORES.projects, id);
    if (!existing) throw new Error('Project not found.');
    const next: StoredProject = {
      ...existing,
      document,
      templateId: document.templateId,
      pageCount: document.pages.length,
      updatedAt: new Date().toISOString(),
      revision: existing.revision + 1,
    };
    await dbPut(STORES.projects, next);
    return next;
  }

  async loadProject(id: string): Promise<StoredProject | undefined> {
    const raw = await dbGet<StoredProject>(STORES.projects, id);
    if (!raw) return undefined;
    return migrateProject(raw);
  }

  async listProjects(): Promise<ProjectSummary[]> {
    const all = await dbGetAll<StoredProject>(STORES.projects);
    return all.filter((p) => p.status !== 'trashed').map(toSummary).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async duplicateProject(id: string): Promise<StoredProject> {
    const source = await this.loadProject(id);
    if (!source) throw new Error('Project not found.');
    const pages: TemplatePage[] = source.document.pages.map((p) => clonePage(p, nextId));
    const now = new Date().toISOString();
    const copy: StoredProject = {
      ...source,
      id: nextId('proj'),
      name: `${source.name} Copy`,
      createdAt: now,
      updatedAt: now,
      revision: 1,
      document: { ...source.document, pages },
    };
    await dbPut(STORES.projects, copy);
    return copy;
  }

  async renameProject(id: string, name: string): Promise<StoredProject> {
    const existing = await dbGet<StoredProject>(STORES.projects, id);
    if (!existing) throw new Error('Project not found.');
    const next: StoredProject = { ...existing, name, updatedAt: new Date().toISOString() };
    await dbPut(STORES.projects, next);
    return next;
  }

  async deleteProject(id: string, hard = false): Promise<void> {
    if (hard) {
      await dbDelete(STORES.projects, id);
      return;
    }
    const existing = await dbGet<StoredProject>(STORES.projects, id);
    if (!existing) return;
    await dbPut(STORES.projects, { ...existing, status: 'trashed', updatedAt: new Date().toISOString() });
  }

  async saveThumbnail(id: string, thumbnail: string): Promise<void> {
    const existing = await dbGet<StoredProject>(STORES.projects, id);
    if (!existing) return;
    await dbPut(STORES.projects, { ...existing, thumbnail });
  }
}

export const projectStorage: ProjectStorageAdapter = new LocalProjectStorageAdapter();
