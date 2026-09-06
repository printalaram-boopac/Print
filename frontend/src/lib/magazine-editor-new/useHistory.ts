import { useCallback, useRef, useState } from 'react';

const MAX_HISTORY = 50;

/**
 * Generic undo/redo stack for a snapshot-based state (the whole EditorProject,
 * here). `commit` pushes a new snapshot; `set` replaces the live value without
 * touching history (used while a drag/resize is in progress — history is only
 * committed once the interaction ends, per the "don't spam history" rule).
 *
 * All past/future mutation happens outside of React's setState updater
 * functions (via `currentRef`, not the functional `setValue(prev => ...)`
 * form) — React 18 StrictMode double-invokes updater functions in dev to
 * catch impure ones, and an updater that shifts/pops a ref as a side effect
 * gets silently run twice, corrupting the stack. Keeping every mutation in
 * a plain click-triggered function (never inside setValue itself) avoids that.
 */
export function useHistory<T>(initial: T) {
  const [value, setValue] = useState(initial);
  const currentRef = useRef(initial);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const sync = () => {
    setCanUndo(past.current.length > 0);
    setCanRedo(future.current.length > 0);
  };

  const apply = (next: T) => {
    currentRef.current = next;
    setValue(next);
  };

  /** Update the live value without recording a history entry (in-progress drag/resize). */
  const set = useCallback((next: T) => {
    apply(next);
  }, []);

  /** Update the live value and record the *previous* value as an undo point. */
  const commit = useCallback((next: T) => {
    past.current = [...past.current, currentRef.current].slice(-MAX_HISTORY);
    future.current = [];
    sync();
    apply(next);
  }, []);

  /**
   * Same as `commit`, but takes the "before" snapshot explicitly rather than
   * the live value — needed after a drag/resize/rotate/crop gesture, where
   * `set()` has already overwritten the live value many times before the
   * gesture ends, so the true pre-gesture state must be captured by the
   * caller up front (see MagazineEditorNew's preDragSnapshotRef).
   */
  const commitWithSnapshot = useCallback((prevSnapshot: T, next: T) => {
    past.current = [...past.current, prevSnapshot].slice(-MAX_HISTORY);
    future.current = [];
    sync();
    apply(next);
  }, []);

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (prev === undefined) return;
    future.current = [currentRef.current, ...future.current];
    sync();
    apply(prev);
  }, []);

  const redo = useCallback(() => {
    const next = future.current.shift();
    if (next === undefined) return;
    past.current = [...past.current, currentRef.current];
    sync();
    apply(next);
  }, []);

  return { value, set, commit, commitWithSnapshot, undo, redo, canUndo, canRedo };
}
