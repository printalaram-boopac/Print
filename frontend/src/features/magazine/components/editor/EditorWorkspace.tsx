import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { MagazineDocument, MagazinePage, MagazineTemplate, StorageDriver } from '../../types';
import { NUDGE_STEP, NUDGE_STEP_LARGE } from '../../constants';
import { useAutosave } from '../../hooks/useAutosave';
import { useCanvasScale } from '../../hooks/useCanvasScale';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useMagazineEditor, type HistoryMode } from '../../hooks/useMagazineEditor';
import { saveMagazine, StorageQuotaError } from '../../services/saveService';
import {
  createDocumentFromTemplate,
  createImageElement,
  createShapeElement,
  createTextElement,
  type ShapeInput,
  type TextPresetInput,
} from '../../services/templateService';
import { exportAllPagesJpg, exportMagazinePdf, exportPagePng } from '../../services/exportService';
import { processImageFile, UPLOAD_ACCEPT_ATTRIBUTE, UploadError } from '../../services/uploadService';
import MagazineViewer from '../preview/MagazineViewer';
import Canvas from './Canvas';
import EditorSidebar, { type EditorTool } from './EditorSidebar';
import EditorToolbar from './EditorToolbar';
import PagePanel from './PagePanel';
import PropertiesPanel from './PropertiesPanel';
import BackgroundPanel from './panels/BackgroundPanel';
import ElementsPanel from './panels/ElementsPanel';
import ImagesPanel from './panels/ImagesPanel';
import PagesPanel from './panels/PagesPanel';
import TemplatesPanel from './panels/TemplatesPanel';
import TextPanel from './panels/TextPanel';

/** Where a picked file should end up. */
type PickTarget = { kind: 'new-frame' } | { kind: 'element'; elementId: string } | { kind: 'background' };

interface EditorWorkspaceProps {
  initialDocument: MagazineDocument;
  /** True when this design has never been saved, so the URL still says "new". */
  isNew: boolean;
}

/**
 * The editor itself: toolbar, tool panels, canvas, page strip and properties.
 *
 * Mounted only once its document is resolved, so editor state is never
 * initialised from a placeholder.
 */
export default function EditorWorkspace({ initialDocument, isNew }: EditorWorkspaceProps) {
  const editor = useMagazineEditor(initialDocument);
  const navigate = useNavigate();
  const { firebaseUser, dbUser } = useAuth();

  const isMobile = useIsMobile();
  // On a phone the sheets and the canvas compete for the same vertical space, so
  // the editor opens with the canvas at full height and no panel showing.
  const [activeTool, setActiveTool] = useState<EditorTool | null>(() =>
    window.matchMedia('(max-width: 767px)').matches ? null : 'templates',
  );
  const [zoom, setZoom] = useState<number | 'fit'>('fit');
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [uploads, setUploads] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ done: number; total: number } | null>(null);
  const [saveDriver, setSaveDriver] = useState<StorageDriver>('local');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickTargetRef = useRef<PickTarget>({ kind: 'new-frame' });
  const urlSyncedRef = useRef(!isNew);

  const saveContext = useMemo(
    () => ({ userId: dbUser?.id || firebaseUser?.uid || null }),
    [dbUser?.id, firebaseUser?.uid],
  );

  const { document: doc, activePage, selectedElement } = editor;

  /* ─────────────── Canvas scale ─────────────── */

  const { containerRef, scale: fitScale, ready } = useCanvasScale<HTMLDivElement>({
    docWidth: doc.width,
    docHeight: doc.height,
    padding: 72,
  });
  const scale = zoom === 'fit' ? fitScale : zoom;

  /* ─────────────── Saving ─────────────── */

  const persist = useCallback(
    async (snapshot: MagazineDocument) => {
      const outcome = await saveMagazine(snapshot, saveContext);
      setSaveDriver(outcome.driver);
      if (outcome.fellBackToLocal) {
        toast.info('Saved on this device — we could not reach your account.', { toastId: 'magazine-local-save' });
      }
      // Once a brand-new design has an entry in storage, put its real id in the
      // URL so a refresh (or the browser back button) reopens the same design.
      if (!urlSyncedRef.current) {
        urlSyncedRef.current = true;
        navigate(`/magazine/editor/${snapshot.id}`, { replace: true });
      }
    },
    [navigate, saveContext],
  );

  const autosave = useAutosave({
    document: doc,
    enabled: true,
    save: persist,
    onError: (err) => {
      if (err instanceof StorageQuotaError) toast.error(err.message, { toastId: 'magazine-quota' });
      else toast.error('Could not save your magazine. Your work is still open here.', { toastId: 'magazine-save-error' });
    },
  });

  // Name the browser tab after the magazine, so several open designs stay
  // tellable apart. The site title is restored on the way out.
  useEffect(() => {
    const previous = document.title;
    document.title = `${doc.title || 'Untitled magazine'} — Magazine Editor`;
    return () => {
      document.title = previous;
    };
  }, [doc.title]);

  // Autosave covers ordinary editing; this catches a close mid-debounce.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (autosave.state === 'dirty' || autosave.state === 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [autosave.state]);

  /* ─────────────── Files ─────────────── */

  const openFilePicker = useCallback((target: PickTarget) => {
    pickTargetRef.current = target;
    fileInputRef.current?.click();
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const target = pickTargetRef.current;

      try {
        if (target.kind === 'background') {
          const processed = await processImageFile(files[0]);
          if (!activePage) return;
          const fallback =
            activePage.background.type === 'color' ? activePage.background.color : '#FFFFFF';
          editor.setPageBackground(activePage.id, { type: 'image', src: processed.src, color: fallback });
          setUploads((prev) => [processed.src, ...prev].slice(0, 24));
          return;
        }

        if (target.kind === 'element') {
          const processed = await processImageFile(files[0]);
          editor.updateElement(target.elementId, { src: processed.src, offsetX: 0, offsetY: 0, zoom: 1 });
          setUploads((prev) => [processed.src, ...prev].slice(0, 24));
          return;
        }

        // Multiple files land as multiple frames, so a photo dump is one action.
        for (const file of Array.from(files)) {
          const processed = await processImageFile(file);
          setUploads((prev) => [processed.src, ...prev].slice(0, 24));
          if (activePage) editor.addElement(createImageElement(activePage, processed.src, 'Photo'));
        }
      } catch (err) {
        toast.error(err instanceof UploadError ? err.message : 'That image could not be added.');
      }
    },
    [activePage, editor],
  );

  /* ─────────────── Element insertion ─────────────── */

  const addText = useCallback(
    (preset: TextPresetInput) => {
      if (!activePage) return;
      editor.addElement(createTextElement(activePage, preset));
    },
    [activePage, editor],
  );

  const addShape = useCallback(
    (input: ShapeInput) => {
      if (!activePage) return;
      editor.addElement(createShapeElement(activePage, input));
    },
    [activePage, editor],
  );

  const addImageFrame = useCallback(() => {
    if (!activePage) return;
    editor.addElement(createImageElement(activePage, null, 'Your photo'));
  }, [activePage, editor]);

  const useUploadedImage = useCallback(
    (src: string) => {
      if (selectedElement?.type === 'image') {
        editor.updateElement(selectedElement.id, { src, offsetX: 0, offsetY: 0, zoom: 1 });
        return;
      }
      if (activePage) editor.addElement(createImageElement(activePage, src, 'Photo'));
    },
    [activePage, editor, selectedElement],
  );

  const applyTemplate = useCallback(
    (template: MagazineTemplate) => {
      const replacement = createDocumentFromTemplate(template, doc.title);
      // Keep the current identity so this stays the same saved magazine.
      editor.loadDocument({
        ...replacement,
        id: doc.id,
        createdAt: doc.createdAt,
        title: doc.title,
      });
      toast.success(`${template.name} applied.`);
    },
    [doc.createdAt, doc.id, doc.title, editor],
  );

  const addPageFromTemplate = useCallback(
    (page: MagazinePage) => {
      editor.addPageFrom(page);
      toast.success('Page added.');
    },
    [editor],
  );

  /* ─────────────── Export ─────────────── */

  const runExport = useCallback(
    async (label: string, task: (onProgress: (done: number, total: number) => void) => Promise<void>) => {
      setExporting(true);
      setExportProgress(null);
      try {
        // Flush pending edits first so the file matches what is saved.
        await autosave.saveNow();
        await task((done, total) => setExportProgress({ done, total }));
        toast.success(`${label} ready.`);
      } catch {
        toast.error(`${label} failed. Please try again.`);
      } finally {
        setExporting(false);
        setExportProgress(null);
      }
    },
    [autosave],
  );

  const exportPdf = useCallback(
    () => runExport('PDF', (onProgress) => exportMagazinePdf(doc, onProgress)),
    [doc, runExport],
  );
  const exportPng = useCallback(
    () => runExport('Page image', () => exportPagePng(doc, Math.max(editor.activePageIndex, 0))),
    [doc, editor.activePageIndex, runExport],
  );
  const exportJpgs = useCallback(
    () => runExport('Page images', (onProgress) => exportAllPagesJpg(doc, onProgress)),
    [doc, runExport],
  );

  /* ─────────────── Keyboard ─────────────── */

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT';

      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void autosave.saveNow();
        return;
      }

      if (typing) return;

      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) editor.redo();
        else editor.undo();
        return;
      }
      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        editor.redo();
        return;
      }

      if (e.key === 'Escape') {
        if (previewOpen) setPreviewOpen(false);
        else if (editingTextId) setEditingTextId(null);
        else editor.selectElement(null);
        return;
      }

      const selectedId = editor.selectedElementId;
      if (!selectedId) return;

      if (mod && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        editor.duplicateElement(selectedId);
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        editor.deleteElement(selectedId);
        return;
      }

      const step = e.shiftKey ? NUDGE_STEP_LARGE : NUDGE_STEP;
      const nudge: Record<string, { x?: number; y?: number }> = {
        ArrowLeft: { x: -step },
        ArrowRight: { x: step },
        ArrowUp: { y: -step },
        ArrowDown: { y: step },
      };
      const delta = nudge[e.key];
      if (delta && selectedElement) {
        e.preventDefault();
        editor.updateElement(
          selectedId,
          {
            x: selectedElement.x + (delta.x ?? 0),
            y: selectedElement.y + (delta.y ?? 0),
          },
          { coalesce: `nudge:${selectedId}` } as HistoryMode,
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [autosave, editingTextId, editor, previewOpen, selectedElement]);

  /* ─────────────── Panels ─────────────── */

  const panel = () => {
    if (!activePage) return null;
    switch (activeTool) {
      case 'templates':
        return (
          <TemplatesPanel
            docWidth={doc.width}
            docHeight={doc.height}
            onAddPageFrom={addPageFromTemplate}
            onApplyTemplate={applyTemplate}
          />
        );
      case 'pages':
        return (
          <PagesPanel
            document={doc}
            activePageId={editor.activePageId}
            onSelectPage={editor.selectPage}
            onAddPage={() => editor.addPage()}
            onDuplicatePage={editor.duplicatePage}
            onDeletePage={editor.deletePage}
            onRenamePage={editor.renamePage}
            onMovePage={editor.movePage}
          />
        );
      case 'text':
        return <TextPanel onAddText={addText} />;
      case 'photos':
        return (
          <ImagesPanel
            uploads={uploads}
            onPickFiles={() => openFilePicker({ kind: 'new-frame' })}
            onUseImage={useUploadedImage}
            hasSelectedFrame={selectedElement?.type === 'image'}
          />
        );
      case 'elements':
        return <ElementsPanel onAddShape={addShape} onAddImageFrame={addImageFrame} />;
      case 'background':
        return (
          <div className="p-4">
            <BackgroundPanel
              background={activePage.background}
              onChange={(background, history) => editor.setPageBackground(activePage.id, background, history)}
              onBeginGesture={editor.beginGesture}
              onPickImage={() => openFilePicker({ kind: 'background' })}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-luxury-black">
      <EditorToolbar
        title={doc.title}
        onTitleChange={editor.setTitle}
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        onUndo={editor.undo}
        onRedo={editor.redo}
        zoom={scale}
        isFit={zoom === 'fit'}
        onZoomChange={setZoom}
        onZoomFit={() => setZoom('fit')}
        onPreview={() => {
          setPreviewIndex(Math.max(editor.activePageIndex, 0));
          setPreviewOpen(true);
        }}
        onSave={() => void autosave.saveNow()}
        onExportPdf={exportPdf}
        onExportPng={exportPng}
        onExportAllJpg={exportJpgs}
        saveState={autosave.state}
        saveDriver={saveDriver}
        exporting={exporting}
        exportProgress={exportProgress}
      />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <EditorSidebar activeTool={activeTool} onToolChange={setActiveTool}>
          {panel()}
        </EditorSidebar>

        {/* Canvas column */}
        <div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col md:order-none">
          <div
            ref={containerRef}
            className="flex min-h-[34vh] flex-1 items-center justify-center overflow-auto p-3 md:min-h-0 md:p-4"
          >
            {ready && activePage && (
              <Canvas
                page={activePage}
                docWidth={doc.width}
                docHeight={doc.height}
                scale={scale}
                selectedElementId={editor.selectedElementId}
                editingTextId={editingTextId}
                onSelect={(id) => {
                  editor.selectElement(id);
                  if (id !== editingTextId) setEditingTextId(null);
                }}
                onStartTextEdit={setEditingTextId}
                onTextCommit={(id, content) => {
                  editor.updateElement(id, { content });
                  setEditingTextId(null);
                }}
                onTextCancel={() => setEditingTextId(null)}
                onBeginGesture={editor.beginGesture}
                onUpdateElement={editor.updateElement}
              />
            )}
          </div>

          <PagePanel
            document={doc}
            activePageId={editor.activePageId}
            onSelectPage={editor.selectPage}
            onAddPage={() => editor.addPage()}
            onDuplicatePage={editor.duplicatePage}
            onDeletePage={editor.deletePage}
            onMovePage={editor.movePage}
          />
        </div>

        {/* Contextual properties. On a phone this sheet only appears when there is
            a selection to edit, and yields to any tool panel the user opens, so
            the canvas keeps the screen the rest of the time. */}
        {activePage && !(isMobile && (activeTool || !selectedElement)) && (
          <aside className="order-2 max-h-[34vh] shrink-0 overflow-y-auto border-t border-gold-200/50 bg-luxury-black md:order-none md:max-h-none md:w-[300px] md:border-l md:border-t-0">
            <PropertiesPanel
              page={activePage}
              element={selectedElement}
              onUpdate={editor.updateElement}
              onBeginGesture={editor.beginGesture}
              onDelete={editor.deleteElement}
              onDuplicate={editor.duplicateElement}
              onMoveLayer={editor.moveLayer}
              onReplaceImage={(elementId) => openFilePicker({ kind: 'element', elementId })}
              onBackgroundChange={(background, history) =>
                editor.setPageBackground(activePage.id, background, history)
              }
              onRenamePage={(name) => editor.renamePage(activePage.id, name)}
            />
          </aside>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={UPLOAD_ACCEPT_ATTRIBUTE}
        multiple
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          // Reset so picking the same file twice still fires a change event.
          e.target.value = '';
        }}
      />

      {previewOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-luxury-black/98 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-gold-200/40 px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold">Preview</p>
              <h2 className="font-display text-base font-semibold text-luxury-accent">{doc.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-200/60 bg-white text-luxury-accent transition-colors hover:border-luxury-gold"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
            <div className="mx-auto max-w-4xl">
              <MagazineViewer
                pages={doc.pages}
                docWidth={doc.width}
                docHeight={doc.height}
                index={Math.min(previewIndex, doc.pages.length - 1)}
                onIndexChange={setPreviewIndex}
                stageClassName="h-[62vh] min-h-[300px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
