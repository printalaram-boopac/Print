const LAST_PROJECT_KEY = 'printalarm.magazineEditor.lastProjectId';
const UI_STATE_PREFIX = 'printalarm.magazineEditor.uiState.';

/** Small, non-document editor preferences (Step 11 §11, §67) — deliberately
 * kept out of the project document/IndexedDB store, since none of this is
 * meaningful design data: which page was selected, current zoom, view mode. */
export interface ProjectUiState {
  selectedPageId?: string;
  zoom?: number;
  viewMode?: 'single' | 'spread';
}

export function getLastOpenedProjectId(): string | null {
  try {
    return localStorage.getItem(LAST_PROJECT_KEY);
  } catch {
    return null;
  }
}

export function setLastOpenedProjectId(id: string): void {
  try {
    localStorage.setItem(LAST_PROJECT_KEY, id);
  } catch {
    // best-effort convenience only
  }
}

export function getProjectUiState(projectId: string): ProjectUiState {
  try {
    const raw = localStorage.getItem(UI_STATE_PREFIX + projectId);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setProjectUiState(projectId: string, patch: Partial<ProjectUiState>): void {
  try {
    const current = getProjectUiState(projectId);
    localStorage.setItem(UI_STATE_PREFIX + projectId, JSON.stringify({ ...current, ...patch }));
  } catch {
    // best-effort convenience only
  }
}
