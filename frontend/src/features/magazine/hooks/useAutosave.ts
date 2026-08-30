import { useCallback, useEffect, useRef, useState } from 'react';
import { AUTOSAVE_DEBOUNCE_MS } from '../constants';
import type { MagazineDocument, SaveState } from '../types';

interface UseAutosaveOptions {
  document: MagazineDocument;
  /** Off until the document is fully loaded, so a load never triggers a save. */
  enabled: boolean;
  save: (document: MagazineDocument) => Promise<void>;
  onError?: (error: unknown) => void;
}

interface UseAutosaveResult {
  state: SaveState;
  lastSavedAt: Date | null;
  /** Saves immediately, cancelling any pending debounce. */
  saveNow: () => Promise<void>;
  /** True when edits exist that have not reached storage yet. */
  dirty: boolean;
}

/**
 * Debounced autosave.
 *
 * Saves settle after the user stops editing rather than firing on every
 * keystroke or drag frame, and an in-flight save defers the next one instead of
 * racing it — so a long editing session produces a handful of writes, not
 * hundreds.
 */
export function useAutosave({ document, enabled, save, onError }: UseAutosaveOptions): UseAutosaveResult {
  const [state, setState] = useState<SaveState>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const timerRef = useRef<number | null>(null);
  const savingRef = useRef(false);
  const latestRef = useRef(document);
  const savedSnapshotRef = useRef<MagazineDocument | null>(null);
  const pendingRef = useRef(false);

  latestRef.current = document;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const run = useCallback(async () => {
    if (savingRef.current) {
      // A save is already in flight; mark that another is needed afterwards.
      pendingRef.current = true;
      return;
    }
    const snapshot = latestRef.current;
    savingRef.current = true;
    setState('saving');
    try {
      await save(snapshot);
      savedSnapshotRef.current = snapshot;
      setLastSavedAt(new Date());
      setState(latestRef.current === snapshot ? 'saved' : 'dirty');
    } catch (err) {
      setState('error');
      onError?.(err);
    } finally {
      savingRef.current = false;
      if (pendingRef.current) {
        pendingRef.current = false;
        // Re-run for the edits that arrived mid-save.
        void run();
      }
    }
  }, [onError, save]);

  useEffect(() => {
    if (!enabled) return;
    if (savedSnapshotRef.current === document) return;

    // First document seen while enabled is the loaded state, not an edit.
    if (savedSnapshotRef.current === null) {
      savedSnapshotRef.current = document;
      return;
    }

    setState('dirty');
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      void run();
    }, AUTOSAVE_DEBOUNCE_MS);

    return clearTimer;
  }, [clearTimer, document, enabled, run]);

  useEffect(() => clearTimer, [clearTimer]);

  const saveNow = useCallback(async () => {
    clearTimer();
    await run();
  }, [clearTimer, run]);

  return {
    state,
    lastSavedAt,
    saveNow,
    dirty: savedSnapshotRef.current !== document,
  };
}
