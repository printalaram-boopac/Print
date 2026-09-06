import type { EditorProject } from '../types';
import { computePrintReport, type PrintReport } from '../printPreview';

/**
 * Export preflight reuses Step 10's Print Preview issue logic exactly
 * (Step 12 §67) rather than a second validation system — scoped to just the
 * pages actually being exported, so reviewing issues only shows what's
 * relevant to this export.
 */
export function computeExportPreflight(project: EditorProject, pageIndices: number[]): PrintReport {
  return computePrintReport(project, pageIndices);
}
