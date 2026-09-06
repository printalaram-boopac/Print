import type { EditorProject } from '../types';
import { dbDelete, dbGet, dbPut, STORES } from './db';
import { SCHEMA_VERSION, type RecoverySnapshot } from './types';

/**
 * Recovery snapshots are separate from confirmed saves (Step 11 §25–28) —
 * written more frequently, and never silently overwrite the last confirmed
 * `StoredProject.document` themselves. They only ever get promoted into the
 * real project record when the user explicitly chooses "Restore".
 */
export async function writeRecoverySnapshot(projectId: string, projectName: string, document: EditorProject): Promise<void> {
  const snapshot: RecoverySnapshot = { projectId, projectName, schemaVersion: SCHEMA_VERSION, savedAt: new Date().toISOString(), document };
  await dbPut(STORES.recovery, snapshot);
}

export async function readRecoverySnapshot(projectId: string): Promise<RecoverySnapshot | undefined> {
  return dbGet<RecoverySnapshot>(STORES.recovery, projectId);
}

export async function clearRecoverySnapshot(projectId: string): Promise<void> {
  await dbDelete(STORES.recovery, projectId);
}
