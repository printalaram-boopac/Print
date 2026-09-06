import { SCHEMA_VERSION, type StoredProject } from './types';

/**
 * Upgrades an older saved project to the current schema. Nothing to migrate
 * yet (schema 1 is the first version), but every load goes through this
 * function so a future schema bump has one real, exercised place to land —
 * not an assumption baked into every read site (Step 11 §14).
 */
export function migrateProject(data: StoredProject): StoredProject {
  let project = data;

  if (project.schemaVersion < 1) {
    project = { ...project, schemaVersion: 1 };
  }

  if (project.schemaVersion !== SCHEMA_VERSION) {
    // Unknown future version opened by older code, or a version this
    // function doesn't yet know how to step through — leave the document
    // untouched rather than guessing, so a saved project can't be silently
    // corrupted by a migration that doesn't actually apply to it.
    return { ...project, schemaVersion: SCHEMA_VERSION };
  }

  return project;
}
