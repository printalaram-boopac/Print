import { useCallback, useMemo, useReducer } from 'react';
import { HISTORY_LIMIT } from '../constants';
import type {
  ImageElement,
  MagazineDocument,
  MagazineElement,
  MagazinePage,
  PageBackground,
  ShapeElement,
  TextElement,
} from '../types';
import { clonePage, newId } from '../services/templateService';

/**
 * Editor state: the document, the current selection and undo history.
 *
 * History records *meaningful* actions only. A drag or a slider produces one
 * entry for the whole gesture (via `beginGesture`) rather than one per frame,
 * and repeated tweaks to the same property inside a short window coalesce, so
 * undo steps back through edits a person would recognise.
 */

/** Shared-key intersection: every element kind can be patched through this. */
export type ElementPatch = Partial<Omit<TextElement, 'type' | 'id'>> &
  Partial<Omit<ImageElement, 'type' | 'id'>> &
  Partial<Omit<ShapeElement, 'type' | 'id'>>;

/** How a mutation should affect the undo stack. */
export type HistoryMode =
  | 'push'
  | 'skip'
  /** Merge with the previous entry when it shares this key and is recent. */
  | { coalesce: string };

const COALESCE_WINDOW_MS = 900;

export type LayerMove = 'front' | 'back' | 'forward' | 'backward';

interface EditorState {
  document: MagazineDocument;
  activePageId: string;
  selectedElementId: string | null;
  past: MagazineDocument[];
  future: MagazineDocument[];
  lastCommit: { key: string; at: number } | null;
}

type Action =
  | { type: 'replace'; document: MagazineDocument }
  | { type: 'mutate'; next: MagazineDocument; history: HistoryMode }
  | { type: 'selectPage'; pageId: string }
  | { type: 'selectElement'; elementId: string | null }
  | { type: 'snapshot' }
  | { type: 'undo' }
  | { type: 'redo' };

function commit(state: EditorState, next: MagazineDocument, history: HistoryMode): EditorState {
  if (next === state.document) return state;

  if (history === 'skip') {
    return { ...state, document: next };
  }

  if (typeof history === 'object') {
    const now = Date.now();
    const mergeable =
      state.lastCommit?.key === history.coalesce && now - state.lastCommit.at < COALESCE_WINDOW_MS;
    if (mergeable) {
      return { ...state, document: next, future: [], lastCommit: { key: history.coalesce, at: now } };
    }
    return {
      ...state,
      document: next,
      past: [...state.past, state.document].slice(-HISTORY_LIMIT),
      future: [],
      lastCommit: { key: history.coalesce, at: now },
    };
  }

  return {
    ...state,
    document: next,
    past: [...state.past, state.document].slice(-HISTORY_LIMIT),
    future: [],
    lastCommit: null,
  };
}

/** Keeps the selection pointing at something that still exists. */
function reconcileSelection(state: EditorState): EditorState {
  const pageExists = state.document.pages.some((p) => p.id === state.activePageId);
  const activePageId = pageExists ? state.activePageId : (state.document.pages[0]?.id ?? '');
  const page = state.document.pages.find((p) => p.id === activePageId);
  const selectionExists = page?.elements.some((el) => el.id === state.selectedElementId) ?? false;
  return {
    ...state,
    activePageId,
    selectedElementId: selectionExists ? state.selectedElementId : null,
  };
}

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case 'replace':
      return {
        document: action.document,
        activePageId: action.document.pages[0]?.id ?? '',
        selectedElementId: null,
        past: [],
        future: [],
        lastCommit: null,
      };

    case 'mutate':
      return reconcileSelection(commit(state, action.next, action.history));

    case 'selectPage':
      return { ...state, activePageId: action.pageId, selectedElementId: null };

    case 'selectElement':
      return { ...state, selectedElementId: action.elementId };

    case 'snapshot':
      return {
        ...state,
        past: [...state.past, state.document].slice(-HISTORY_LIMIT),
        future: [],
        lastCommit: null,
      };

    case 'undo': {
      const previous = state.past[state.past.length - 1];
      if (!previous) return state;
      return reconcileSelection({
        ...state,
        document: previous,
        past: state.past.slice(0, -1),
        future: [state.document, ...state.future].slice(0, HISTORY_LIMIT),
        lastCommit: null,
      });
    }

    case 'redo': {
      const next = state.future[0];
      if (!next) return state;
      return reconcileSelection({
        ...state,
        document: next,
        past: [...state.past, state.document].slice(-HISTORY_LIMIT),
        future: state.future.slice(1),
        lastCommit: null,
      });
    }

    default:
      return state;
  }
}

function init(document: MagazineDocument): EditorState {
  return {
    document,
    activePageId: document.pages[0]?.id ?? '',
    selectedElementId: null,
    past: [],
    future: [],
    lastCommit: null,
  };
}

/** Re-stacks zIndex values to 1..n so ordering stays stable and gap-free. */
function normaliseLayers(elements: MagazineElement[]): MagazineElement[] {
  return [...elements]
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((el, i) => (el.zIndex === i + 1 ? el : { ...el, zIndex: i + 1 }));
}

export interface MagazineEditorApi {
  document: MagazineDocument;
  activePage: MagazinePage | undefined;
  activePageIndex: number;
  activePageId: string;
  selectedElement: MagazineElement | undefined;
  selectedElementId: string | null;
  canUndo: boolean;
  canRedo: boolean;

  loadDocument: (document: MagazineDocument) => void;
  setTitle: (title: string) => void;

  selectPage: (pageId: string) => void;
  selectElement: (elementId: string | null) => void;

  /** Snapshot before a continuous gesture so undo restores its start state. */
  beginGesture: () => void;
  undo: () => void;
  redo: () => void;

  addPage: (afterPageId?: string) => void;
  addPageFrom: (page: MagazinePage, afterPageId?: string) => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  movePage: (from: number, to: number) => void;
  renamePage: (pageId: string, name: string) => void;
  setPageBackground: (pageId: string, background: PageBackground, history?: HistoryMode) => void;
  replacePages: (pages: MagazinePage[]) => void;

  addElement: (element: MagazineElement) => void;
  updateElement: (elementId: string, patch: ElementPatch, history?: HistoryMode) => void;
  deleteElement: (elementId: string) => void;
  duplicateElement: (elementId: string) => void;
  moveLayer: (elementId: string, move: LayerMove) => void;
}

export function useMagazineEditor(initialDocument: MagazineDocument): MagazineEditorApi {
  const [state, dispatch] = useReducer(reducer, initialDocument, init);
  const { document: doc, activePageId, selectedElementId } = state;

  const activePageIndex = useMemo(
    () => doc.pages.findIndex((p) => p.id === activePageId),
    [doc.pages, activePageId],
  );
  const activePage = activePageIndex >= 0 ? doc.pages[activePageIndex] : undefined;
  const selectedElement = useMemo(
    () => activePage?.elements.find((el) => el.id === selectedElementId),
    [activePage, selectedElementId],
  );

  /** Applies a page-level transform to the document. */
  const mutatePages = useCallback(
    (transform: (pages: MagazinePage[]) => MagazinePage[], history: HistoryMode = 'push') => {
      dispatch({
        type: 'mutate',
        next: { ...doc, pages: transform(doc.pages) },
        history,
      });
    },
    [doc],
  );

  /** Applies a transform to one page's elements. */
  const mutateElements = useCallback(
    (
      pageId: string,
      transform: (elements: MagazineElement[]) => MagazineElement[],
      history: HistoryMode = 'push',
    ) => {
      mutatePages(
        (pages) => pages.map((page) => (page.id === pageId ? { ...page, elements: transform(page.elements) } : page)),
        history,
      );
    },
    [mutatePages],
  );

  const loadDocument = useCallback((document: MagazineDocument) => {
    dispatch({ type: 'replace', document });
  }, []);

  const setTitle = useCallback(
    (title: string) => {
      dispatch({ type: 'mutate', next: { ...doc, title }, history: { coalesce: 'title' } });
    },
    [doc],
  );

  const selectPage = useCallback((pageId: string) => dispatch({ type: 'selectPage', pageId }), []);
  const selectElement = useCallback(
    (elementId: string | null) => dispatch({ type: 'selectElement', elementId }),
    [],
  );
  const beginGesture = useCallback(() => dispatch({ type: 'snapshot' }), []);
  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const redo = useCallback(() => dispatch({ type: 'redo' }), []);

  const insertPage = useCallback(
    (page: MagazinePage, afterPageId?: string) => {
      const anchor = afterPageId ?? activePageId;
      mutatePages((pages) => {
        const at = pages.findIndex((p) => p.id === anchor);
        const index = at >= 0 ? at + 1 : pages.length;
        return [...pages.slice(0, index), page, ...pages.slice(index)];
      });
      dispatch({ type: 'selectPage', pageId: page.id });
    },
    [activePageId, mutatePages],
  );

  const addPage = useCallback(
    (afterPageId?: string) => {
      // New pages inherit the current page's background so a spread stays coherent.
      const background = activePage?.background ?? { type: 'color' as const, color: '#FFFFFF' };
      insertPage(
        {
          id: newId('page'),
          name: `Page ${doc.pages.length + 1}`,
          background: { ...background },
          elements: [],
        },
        afterPageId,
      );
    },
    [activePage, doc.pages.length, insertPage],
  );

  const addPageFrom = useCallback(
    (page: MagazinePage, afterPageId?: string) => insertPage(clonePage(page), afterPageId),
    [insertPage],
  );

  const deletePage = useCallback(
    (pageId: string) => {
      if (doc.pages.length <= 1) return;
      mutatePages((pages) => pages.filter((p) => p.id !== pageId));
    },
    [doc.pages.length, mutatePages],
  );

  const duplicatePage = useCallback(
    (pageId: string) => {
      const source = doc.pages.find((p) => p.id === pageId);
      if (!source) return;
      insertPage(clonePage(source, `${source.name} copy`), pageId);
    },
    [doc.pages, insertPage],
  );

  const movePage = useCallback(
    (from: number, to: number) => {
      if (from === to || from < 0 || to < 0 || from >= doc.pages.length || to >= doc.pages.length) return;
      mutatePages((pages) => {
        const next = [...pages];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      });
    },
    [doc.pages.length, mutatePages],
  );

  const renamePage = useCallback(
    (pageId: string, name: string) => {
      mutatePages(
        (pages) => pages.map((p) => (p.id === pageId ? { ...p, name } : p)),
        { coalesce: `rename:${pageId}` },
      );
    },
    [mutatePages],
  );

  const setPageBackground = useCallback(
    (pageId: string, background: PageBackground, history: HistoryMode = 'push') => {
      mutatePages((pages) => pages.map((p) => (p.id === pageId ? { ...p, background } : p)), history);
    },
    [mutatePages],
  );

  const replacePages = useCallback(
    (pages: MagazinePage[]) => {
      dispatch({ type: 'mutate', next: { ...doc, pages }, history: 'push' });
    },
    [doc],
  );

  const addElement = useCallback(
    (element: MagazineElement) => {
      if (!activePage) return;
      mutateElements(activePage.id, (elements) => [...elements, element]);
      dispatch({ type: 'selectElement', elementId: element.id });
    },
    [activePage, mutateElements],
  );

  const updateElement = useCallback(
    (elementId: string, patch: ElementPatch, history: HistoryMode = 'push') => {
      if (!activePage) return;
      mutateElements(
        activePage.id,
        (elements) =>
          elements.map((el) => (el.id === elementId ? ({ ...el, ...patch } as MagazineElement) : el)),
        history,
      );
    },
    [activePage, mutateElements],
  );

  const deleteElement = useCallback(
    (elementId: string) => {
      if (!activePage) return;
      mutateElements(activePage.id, (elements) => normaliseLayers(elements.filter((el) => el.id !== elementId)));
    },
    [activePage, mutateElements],
  );

  const duplicateElement = useCallback(
    (elementId: string) => {
      if (!activePage) return;
      const source = activePage.elements.find((el) => el.id === elementId);
      if (!source) return;
      const copy: MagazineElement = {
        ...source,
        id: newId(source.type),
        x: source.x + 24,
        y: source.y + 24,
        zIndex: activePage.elements.reduce((max, el) => Math.max(max, el.zIndex), 0) + 1,
      };
      mutateElements(activePage.id, (elements) => [...elements, copy]);
      dispatch({ type: 'selectElement', elementId: copy.id });
    },
    [activePage, mutateElements],
  );

  const moveLayer = useCallback(
    (elementId: string, move: LayerMove) => {
      if (!activePage) return;
      mutateElements(activePage.id, (elements) => {
        const ordered = normaliseLayers(elements);
        const index = ordered.findIndex((el) => el.id === elementId);
        if (index < 0) return elements;

        const target =
          move === 'front'
            ? ordered.length - 1
            : move === 'back'
              ? 0
              : move === 'forward'
                ? Math.min(index + 1, ordered.length - 1)
                : Math.max(index - 1, 0);
        if (target === index) return elements;

        const next = [...ordered];
        const [moved] = next.splice(index, 1);
        next.splice(target, 0, moved);
        return normaliseLayers(next.map((el, i) => ({ ...el, zIndex: i + 1 })));
      });
    },
    [activePage, mutateElements],
  );

  return {
    document: doc,
    activePage,
    activePageIndex,
    activePageId,
    selectedElement,
    selectedElementId,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    loadDocument,
    setTitle,
    selectPage,
    selectElement,
    beginGesture,
    undo,
    redo,
    addPage,
    addPageFrom,
    deletePage,
    duplicatePage,
    movePage,
    renamePage,
    setPageBackground,
    replacePages,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    moveLayer,
  };
}
