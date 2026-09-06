import { useCallback, useEffect, useRef, useState } from 'react';
import type { EditorProject } from '../types';
import { projectStorage } from './LocalProjectStorageAdapter';
import { clearRecoverySnapshot, writeRecoverySnapshot } from './recovery';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved' | 'error' | 'offline';

interface UseAutosaveOptions {
  projectId: string;
  projectName: string;
  project: EditorProject;
  /** false while the project is still loading — don't autosave a document
   * that hasn't finished being read/migrated/rehydrated yet. */
  enabled: boolean;
}

interface UseAutosaveResult {
  status: SaveStatus;
  lastSavedAt: string | null;
  error: string | null;
  saveNow: () => void;
}

const DEBOUNCE_MS = 1500;

/**
 * Debounced autosave keyed off the *committed* project value (Step 11 §5) —
 * MagazineEditorNew only ever changes `project` on a real commit (drag-end,
 * text-change pause, page op, background change, template apply), never on
 * a live/in-progress gesture, so this hook never needs its own "is this a
 * meaningful change" filter — that filtering already happened upstream.
 *
 * A monotonically increasing token guards against an older, slow save
 * completing after a newer one and clobbering fresher status (§53–58).
 */
export function useAutosave({ projectId, projectName, project, enabled }: UseAutosaveOptions): UseAutosaveResult {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const latestToken = useRef(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRun = useRef(true);
  const projectRef = useRef(project);
  projectRef.current = project;

  const performSave = useCallback(async () => {
    const token = (latestToken.current += 1);
    setStatus('saving');
    try {
      const saved = await projectStorage.saveProject(projectId, projectRef.current);
      if (token !== latestToken.current) return; // a newer save already superseded this one
      setStatus(typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'saved');
      setLastSavedAt(saved.updatedAt);
      setError(null);
      clearRecoverySnapshot(projectId).catch(() => {});
    } catch (e) {
      if (token !== latestToken.current) return;
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Save failed.');
    }
  }, [projectId]);

  const saveNow = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    performSave();
  }, [performSave]);

  // Debounced autosave on every committed project change.
  useEffect(() => {
    if (!enabled) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return; // the just-loaded document is already saved — don't re-save it immediately
    }
    setStatus('unsaved');
    writeRecoverySnapshot(projectId, projectName, project).catch(() => {});
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(performSave, DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, enabled]);

  // Ctrl/Cmd+S — manual save, and stop the browser's own Save Page dialog.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveNow();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveNow]);

  // Only warn on unload when there's something genuinely unsaved (§29).
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (status === 'unsaved' || status === 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [status]);

  // Best-effort offline awareness — local persistence keeps working either way.
  useEffect(() => {
    const goOnline = () => setStatus((s) => (s === 'offline' ? 'unsaved' : s));
    const goOffline = () => setStatus('offline');
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return { status, lastSavedAt, error, saveNow };
}
