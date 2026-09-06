import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import { TEMPLATES, buildBlankPages } from '@/lib/magazine-editor-new/templateData';
import { useAutosave } from '@/lib/magazine-editor-new/storage/useAutosave';
import { setLastOpenedProjectId, setProjectUiState, getProjectUiState } from '@/lib/magazine-editor-new/storage/preferences';
import type { StoredProject } from '@/lib/magazine-editor-new/storage/types';
import { useRecentlyUsedTemplates } from '@/lib/magazine-editor-new/useRecentlyUsedTemplates';
import { useRecentlyUsedElements } from '@/lib/magazine-editor-new/useRecentlyUsedElements';
import { useRecentlyUsedBackgrounds } from '@/lib/magazine-editor-new/useRecentlyUsedBackgrounds';
import { useHistory } from '@/lib/magazine-editor-new/useHistory';
import { processUploadFile } from '@/lib/magazine-editor-new/uploadUtils';
import { calculateEffectiveDpi, qualityFromDpi } from '@/lib/magazine-editor-new/imageQuality';
import {
  clonePage, computePrintedNumber, computeSpreads, pageRoleLabel, resolvePageRole, spreadIndexForPage,
} from '@/lib/magazine-editor-new/pageHelpers';
import { DEFAULT_BACKGROUND } from '@/lib/magazine-editor-new/pageBackground';
import { fontFamilyFor } from '@/lib/magazine/fonts';
import type {
  BackgroundImageData, EditorProject, MagazineTemplate, PageBackground, PageNumberSettings, PageRole,
  TemplateDimensions, TemplateElement, TemplatePage, UploadedPhoto, ElementLibraryItem, ShapeType,
} from '@/lib/magazine-editor-new/types';
import TopNavbar from '@/components/magazine-editor-new/TopNavbar';
import LeftToolBar, { TOOLS, type ToolKey } from '@/components/magazine-editor-new/LeftToolBar';
import TemplatesPanel from '@/components/magazine-editor-new/TemplatesPanel';
import UploadsPanel from '@/components/magazine-editor-new/UploadsPanel';
import ElementsPanel from '@/components/magazine-editor-new/ElementsPanel';
import TextPanel from '@/components/magazine-editor-new/TextPanel';
import DrawPalette, { type DrawToolType } from '@/components/magazine-editor-new/DrawPalette';
import ComingSoonPanel from '@/components/magazine-editor-new/ComingSoonPanel';
import EditorToolbar from '@/components/magazine-editor-new/EditorToolbar';
import MagazineCanvas, { type PageNumberOverlay, type ViewSettings } from '@/components/magazine-editor-new/MagazineCanvas';
import CanvasErrorBoundary from '@/components/magazine-editor-new/CanvasErrorBoundary';
import PagesPanel from '@/components/magazine-editor-new/PagesPanel';
import ZoomControls from '@/components/magazine-editor-new/ZoomControls';
import ViewMenu from '@/components/magazine-editor-new/ViewMenu';
import ContextMenu from '@/components/magazine-editor-new/ContextMenu';
import PageSettingsModal from '@/components/magazine-editor-new/PageSettingsModal';
import BackgroundPanel from '@/components/magazine-editor-new/BackgroundPanel';
import PreviewMode from '@/components/magazine-editor-new/PreviewMode';
import ExportModal from '@/components/magazine-editor-new/ExportModal';
import type { ExportFileType } from '@/lib/magazine-editor-new/export/types';
import TemplatePreviewModal from '@/components/magazine-editor-new/TemplatePreviewModal';
import ConfirmReplaceDialog from '@/components/magazine-editor-new/ConfirmReplaceDialog';

type PendingAction =
  | { type: 'template'; template: MagazineTemplate }
  | { type: 'blank'; dimensions: TemplateDimensions };

let localIdCounter = 0;
function nextId(prefix: string): string {
  localIdCounter += 1;
  return `${prefix}-${Date.now()}-${localIdCounter}`;
}

const MAX_RECENT_COLORS = 6;
const DEFAULT_VIEW: ViewSettings = { showMargins: false, showBleed: false, showSafeArea: false, showGrid: false };

type Align = 'left' | 'centerX' | 'right' | 'top' | 'centerY' | 'bottom';

/**
 * Step 6 — shared multi-select/group/align/distribute/layers/position-panel/
 * context-menu system. Step 7 adds full page management on top: add/
 * duplicate/delete/reorder/rename pages, page roles, locking, document size,
 * automatic page numbering and a Single/Spread view mode — all layered onto
 * the same element-editing machinery from Steps 1–6 without touching it.
 */
interface MagazineEditorInnerProps {
  storedProject: StoredProject;
  initialDocument: EditorProject;
  onProjectRenamed: (name: string) => void;
}

export default function MagazineEditorInner({ storedProject, initialDocument, onProjectRenamed }: MagazineEditorInnerProps) {
  const uiState = useMemo(() => getProjectUiState(storedProject.id), [storedProject.id]);
  const [activeTool, setActiveTool] = useState<ToolKey | null>(() => (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'templates' : null));
  const [pagesOpen, setPagesOpen] = useState<boolean>(() => (typeof window !== 'undefined' && window.innerWidth >= 1280));
  const [zoom, setZoom] = useState<number>(100);

  const handleToolChange = (tool: ToolKey | null) => {
    if (tool === 'pages') {
      setPagesOpen((prev) => !prev);
      setActiveTool(null);
    } else {
      setActiveTool(tool);
      if (tool && typeof window !== 'undefined' && window.innerWidth < 1280) {
        setPagesOpen(false);
      }
    }
  };
  const {
    value: project, set: setProjectLive, commit: commitProject, commitWithSnapshot,
    undo, redo, canUndo, canRedo,
  } = useHistory<EditorProject>(initialDocument);
  const preDragSnapshotRef = useRef<EditorProject | null>(null);
  const [isDefaultProject, setIsDefaultProject] = useState(!storedProject.templateId && storedProject.pageCount <= 1);
  const [projectName, setProjectName] = useState(storedProject.name);

  const autosave = useAutosave({ projectId: storedProject.id, projectName, project, enabled: true });

  useEffect(() => {
    setLastOpenedProjectId(storedProject.id);
  }, [storedProject.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTool]);

  // Pages are identified by stable id everywhere (Step 7 §10) — index is only
  // ever derived on demand from the current project.pages array, never cached
  // across a structural change (add/delete/reorder), so reordering can never
  // leave a stale reference behind.
  const [selectedPageId, setSelectedPageId] = useState(uiState.selectedPageId && initialDocument.pages.some((p) => p.id === uiState.selectedPageId) ? uiState.selectedPageId : initialDocument.pages[0].id);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([selectedPageId]);
  const [viewMode, setViewMode] = useState<'single' | 'spread'>(uiState.viewMode ?? 'single');
  const [pageSettingsId, setPageSettingsId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportInitialFileType, setExportInitialFileType] = useState<ExportFileType | undefined>(undefined);
  const pageClipboardRef = useRef<TemplatePage | null>(null);
  const [hasPageClipboard, setHasPageClipboard] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [cropElementId, setCropElementId] = useState<string | null>(null);
  const [cropSnapshot, setCropSnapshot] = useState<TemplateElement | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<MagazineTemplate | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [uploads, setUploads] = useState<UploadedPhoto[]>([]);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [view, setView] = useState<ViewSettings>(DEFAULT_VIEW);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const clipboardRef = useRef<TemplateElement[] | null>(null);

  // Drawing tool states (Canva Draw & Whiteboard palette)
  const [activeDrawTool, setActiveDrawTool] = useState<DrawToolType>('pen');
  const [drawStrokeColor, setDrawStrokeColor] = useState('#EF4444');
  const [drawStrokeWidth, setDrawStrokeWidth] = useState(4);
  const [drawIsHighlighter, setDrawIsHighlighter] = useState(false);

  // A separate "committed only" snapshot of the pages array, used purely for
  // the Pages panel thumbnails — updated on every commit but NOT on the
  // live (uncommitted) state a drag/resize produces every pointer move, so
  // thumbnails don't re-render on every frame of a drag (Step 7 §12).
  const [committedPages, setCommittedPages] = useState(project.pages);
  useEffect(() => {
    if (preDragSnapshotRef.current === null) setCommittedPages(project.pages);
  }, [project]);

  const { recentIds, recordUsed } = useRecentlyUsedTemplates();
  const recentTemplates = useMemo(
    () => recentIds.map((id) => TEMPLATES.find((t) => t.id === id)).filter((t): t is MagazineTemplate => !!t),
    [recentIds],
  );
  const { recentIds: recentElementIds, recordUsed: recordElementUsed } = useRecentlyUsedElements();
  const { recent: recentBackgrounds, recordUsed: recordBackgroundUsed } = useRecentlyUsedBackgrounds();
  const [bgCropActive, setBgCropActive] = useState(false);
  const bgDragSnapshotRef = preDragSnapshotRef;

  const documentColors = useMemo(() => {
    const colors = new Set<string>();
    project.pages.forEach((p) => {
      if (p.background?.type === 'solid' && p.background.color) colors.add(p.background.color);
      p.elements.forEach((el) => {
        if (el.fill && el.fill !== 'none') colors.add(el.fill);
        if (el.borderColor) colors.add(el.borderColor);
        if (el.iconColor) colors.add(el.iconColor);
        if (el.badgeColor) colors.add(el.badgeColor);
      });
    });
    return Array.from(colors);
  }, [project.pages]);

  const findPageIndex = useCallback((id: string) => project.pages.findIndex((p) => p.id === id), [project.pages]);
  const selectedPageIndex = Math.max(0, findPageIndex(selectedPageId));
  const currentPage = project.pages[selectedPageIndex] ?? project.pages[0];
  const pageLocked = !!currentPage.locked;

  // Deselect whatever was selected when the ACTIVE page changes — an element
  // from a different page shouldn't stay "selected" once it's not on screen.
  useEffect(() => {
    setSelectedIds([]);
    setCropElementId(null);
    setBgCropActive(false);
  }, [selectedPageId]);

  // Editor-only preferences (Step 11 §11, §67) — never mixed into the saved
  // document itself, so they don't trigger autosave or dirty the project.
  useEffect(() => {
    setProjectUiState(storedProject.id, { selectedPageId, viewMode });
  }, [storedProject.id, selectedPageId, viewMode]);

  const selectedElements = useMemo(
    () => currentPage.elements.filter((e) => selectedIds.includes(e.id)),
    [currentPage, selectedIds],
  );
  const primaryElement = selectedElements.length === 1 ? selectedElements[0] : null;

  const isGroupSelected = useMemo(() => {
    if (selectedElements.length < 2) return false;
    const groupId = selectedElements[0].groupId;
    if (!groupId) return false;
    const allWithGroup = currentPage.elements.filter((e) => e.groupId === groupId);
    return selectedElements.every((e) => e.groupId === groupId) && allWithGroup.length === selectedElements.length;
  }, [selectedElements, currentPage]);

  const imageQuality = useMemo(() => {
    if (!primaryElement || primaryElement.kind !== 'image' || !primaryElement.sourceWidth) return null;
    const dpi = calculateEffectiveDpi(primaryElement.sourceWidth, primaryElement.widthPct, project.dimensions.widthMm);
    return qualityFromDpi(dpi);
  }, [primaryElement, project.dimensions.widthMm]);

  const trackColor = (color: string) => {
    if (color === 'none') return;
    setRecentColors((prev) => [color, ...prev.filter((c) => c !== color)].slice(0, MAX_RECENT_COLORS));
  };

  // --- Template / blank project application (Step 2, unchanged) ---

  const applyTemplate = (template: MagazineTemplate) => {
    commitProject({
      ...project,
      templateId: template.id,
      templateName: template.name,
      accentGradient: template.accentGradient,
      dimensions: template.dimensions,
      pages: template.pages,
      pageNumbers: template.pageNumbers ?? project.pageNumbers,
    });
    setSelectedPageId(template.pages[0].id);
    setSelectedPageIds([template.pages[0].id]);
    setIsDefaultProject(false);
    recordUsed(template.id);
    setPreviewTemplate(null);
    setPendingAction(null);
  };

  const applyBlank = (dimensions: TemplateDimensions) => {
    const pages = buildBlankPages();
    commitProject({
      ...project,
      templateId: null,
      templateName: 'Blank Magazine',
      accentGradient: 'linear-gradient(155deg, #F5F5F3, #D6D6D2)',
      dimensions,
      pages,
    });
    setSelectedPageId(pages[0].id);
    setSelectedPageIds([pages[0].id]);
    setIsDefaultProject(false);
    setPendingAction(null);
  };

  const requestApplyTemplate = (template: MagazineTemplate) => {
    if (isDefaultProject) applyTemplate(template);
    else setPendingAction({ type: 'template', template });
  };

  const requestCreateBlank = (dimensions: TemplateDimensions) => {
    if (isDefaultProject) applyBlank(dimensions);
    else setPendingAction({ type: 'blank', dimensions });
  };

  const confirmPendingAction = () => {
    if (!pendingAction) return;
    if (pendingAction.type === 'template') applyTemplate(pendingAction.template);
    else applyBlank(pendingAction.dimensions);
  };

  // --- Element mutation helpers (shared by every element kind) ---

  const setPageElements = useCallback((pageIndex: number, elements: TemplateElement[], commit: boolean) => {
    const nextPages = project.pages.map((p, i) => (i === pageIndex ? { ...p, elements } : p));
    const next = { ...project, pages: nextPages };
    if (commit) commitProject(next);
    else setProjectLive(next);
  }, [project, commitProject, setProjectLive]);

  /** Selecting an element selects its whole group instead, if it belongs to one. */
  const handleSelectElement = (id: string, e: { shiftKey?: boolean; metaKey?: boolean; ctrlKey?: boolean }) => {
    if (pageLocked) return;
    const el = currentPage.elements.find((x) => x.id === id);
    const groupSiblings = el?.groupId ? currentPage.elements.filter((x) => x.groupId === el.groupId).map((x) => x.id) : [id];
    const additive = e.shiftKey || e.metaKey || e.ctrlKey;
    setSelectedIds((prev) => {
      if (!additive) return groupSiblings;
      const already = groupSiblings.every((gid) => prev.includes(gid));
      return already ? prev.filter((pid) => !groupSiblings.includes(pid)) : [...prev, ...groupSiblings.filter((gid) => !prev.includes(gid))];
    });
  };

  const updateElementLive = useCallback((id: string, patch: Partial<TemplateElement>) => {
    if (currentPage.locked) return;
    if (preDragSnapshotRef.current === null) preDragSnapshotRef.current = project;
    const dragged = currentPage.elements.find((e) => e.id === id);
    const isPureMove = dragged && patch.xPct !== undefined && patch.yPct !== undefined && patch.widthPct === undefined && patch.rotationDeg === undefined;
    const groupIds = dragged?.groupId ? currentPage.elements.filter((e) => e.groupId === dragged.groupId).map((e) => e.id) : [];
    const moveTogetherIds = new Set(selectedIds.includes(id) && selectedIds.length > 1 ? selectedIds : groupIds);

    if (isPureMove && dragged && moveTogetherIds.size > 1) {
      const dx = patch.xPct! - dragged.xPct;
      const dy = patch.yPct! - dragged.yPct;
      const elements = currentPage.elements.map((e) => (
        moveTogetherIds.has(e.id) && !e.locked
          ? { ...e, xPct: Math.max(0, Math.min(100, e.xPct + dx)), yPct: Math.max(0, Math.min(100, e.yPct + dy)) }
          : e
      ));
      setPageElements(selectedPageIndex, elements, false);
      return;
    }

    const elements = currentPage.elements.map((e) => (e.id === id ? { ...e, ...patch } : e));
    setPageElements(selectedPageIndex, elements, false);
  }, [project, currentPage, selectedPageIndex, selectedIds, setPageElements]);

  const updateElementCommit = useCallback((id: string, patch: Partial<TemplateElement>) => {
    if (currentPage.locked) return;
    const elements = currentPage.elements.map((e) => (e.id === id ? { ...e, ...patch } : e));
    setPageElements(selectedPageIndex, elements, true);
    setIsDefaultProject(false);
  }, [currentPage, selectedPageIndex, setPageElements]);

  const commitCurrentLiveState = useCallback(() => {
    if (preDragSnapshotRef.current === null) return;
    commitWithSnapshot(preDragSnapshotRef.current, project);
    preDragSnapshotRef.current = null;
  }, [commitWithSnapshot, project]);

  const maxZIndex = (elements: TemplateElement[]) => elements.reduce((m, e) => Math.max(m, e.zIndex ?? 0), 0);

  const patchSelected = (patch: Partial<TemplateElement>) => {
    if (!primaryElement || pageLocked) return;
    if (patch.fill) trackColor(patch.fill);
    if (patch.borderColor) trackColor(patch.borderColor);
    if (patch.iconColor) trackColor(patch.iconColor);
    if (patch.badgeColor) trackColor(patch.badgeColor);
    if (patch.color) trackColor(patch.color);
    updateElementCommit(primaryElement.id, patch);
  };

  const addOrFillPhoto = (url: string, sourceWidth: number, sourceHeight: number, assetId?: string) => {
    if (pageLocked) return;
    const targetId = primaryElement && primaryElement.kind === 'image' ? primaryElement.id : null;

    if (targetId) {
      updateElementCommit(targetId, {
        imgSrc: url, originalSrc: url, assetId, sourceWidth, sourceHeight,
        cropXPct: 50, cropYPct: 50, cropZoom: 1,
      });
      return;
    }

    const aspect = sourceHeight / sourceWidth;
    const widthPct = 50;
    const heightPct = Math.min(80, widthPct * aspect * (project.dimensions.widthMm / project.dimensions.heightMm));
    const newEl: TemplateElement = {
      id: nextId('img'), kind: 'image', xPct: 50, yPct: 50, widthPct, heightPct,
      imgSrc: url, originalSrc: url, assetId, sourceWidth, sourceHeight,
      rotationDeg: 0, opacity: 100, flipX: false, flipY: false,
      borderRadius: 0, borderWidth: 0, borderColor: '#1C2024',
      cropXPct: 50, cropYPct: 50, cropZoom: 1, fit: 'fill',
      zIndex: maxZIndex(currentPage.elements) + 1, locked: false,
    };
    setPageElements(selectedPageIndex, [...currentPage.elements, newEl], true);
    setSelectedIds([newEl.id]);
    setIsDefaultProject(false);
  };

  const addLibraryElement = (item: ElementLibraryItem) => {
    if (pageLocked) return;
    const created = item.create().map((el, i) => ({ ...el, zIndex: maxZIndex(currentPage.elements) + 1 + i }));
    setPageElements(selectedPageIndex, [...currentPage.elements, ...created], true);
    setSelectedIds([created[0].id]);
    setIsDefaultProject(false);
    recordElementUsed(item.id);
  };

  const handleAddTextElement = (role: 'headline' | 'subheading' | 'body' | 'kicker', text: string) => {
    if (pageLocked) return;
    const isHeadline = role === 'headline';
    const isSub = role === 'subheading';
    const newEl: TemplateElement = {
      id: nextId('txt'),
      kind: 'text',
      xPct: 50,
      yPct: 50,
      widthPct: isHeadline ? 70 : (isSub ? 50 : 60),
      heightPct: isHeadline ? 14 : 8,
      content: text,
      role,
      fontKey: isHeadline ? 'serif' : (isSub ? 'condensed' : 'display'),
      fontSize: isHeadline ? 36 : (isSub ? 20 : 14),
      color: '#1C2024',
      textAlign: 'center',
      rotationDeg: 0,
      opacity: 100,
      zIndex: maxZIndex(currentPage.elements) + 1,
      locked: false,
    };
    setPageElements(selectedPageIndex, [...currentPage.elements, newEl], true);
    setSelectedIds([newEl.id]);
    setIsDefaultProject(false);
  };

  const handleAddMultipleElements = (elements: TemplateElement[]) => {
    if (pageLocked || elements.length === 0) return;
    const baseZ = maxZIndex(currentPage.elements);
    const created = elements.map((el, i) => ({
      ...el,
      id: nextId(el.kind || 'txt'),
      zIndex: baseZ + 1 + i,
      locked: false,
    }));
    setPageElements(selectedPageIndex, [...currentPage.elements, ...created], true);
    setSelectedIds(created.map((c) => c.id));
    setIsDefaultProject(false);
  };

  const handleAddDrawnElement = (el: TemplateElement) => {
    if (pageLocked) return;
    setPageElements(selectedPageIndex, [...currentPage.elements, el], true);
    setSelectedIds([el.id]);
    setIsDefaultProject(false);
  };

  const handleAddShapeFromDraw = (shape: ShapeType) => {
    if (pageLocked) return;
    const pageRatio = (project.dimensions.widthMm || 210) / (project.dimensions.heightMm || 297);
    const shapeAspect = shape === 'heart' ? 1.14
      : (shape === 'rectangle' || shape === 'pointed-hexagon') ? 1.4
      : (shape === 'pill' || shape === 'banner' || shape === 'callout' || shape === 'speech-bubble') ? 1.5
      : (shape === 'arch' || shape === 'bookmark') ? 0.8
      : 1.0;
    const widthPct = 24;
    const heightPct = Math.round((widthPct * pageRatio / shapeAspect) * 10) / 10;

    const newEl: TemplateElement = {
      id: nextId('shape'),
      kind: 'shape',
      shapeType: shape,
      xPct: 50,
      yPct: 50,
      widthPct,
      heightPct,
      fill: drawStrokeColor ?? '#EF4444',
      borderWidth: 0,
      rotationDeg: 0,
      opacity: 100,
      zIndex: maxZIndex(currentPage.elements) + 1,
      locked: false,
    };
    handleAddDrawnElement(newEl);
  };

  const handleAddLineFromDraw = (variant: 'solid' | 'arrow' | 'double-arrow' | 'dashed') => {
    if (pageLocked) return;
    const newEl: TemplateElement = {
      id: nextId('line'),
      kind: 'line',
      xPct: 50,
      yPct: 50,
      widthPct: 30,
      heightPct: 3,
      borderColor: drawStrokeColor ?? '#2563EB',
      strokeWidth: 3,
      lineStyle: variant === 'dashed' ? 'dashed' : 'solid',
      arrowStart: variant === 'double-arrow',
      arrowEnd: variant === 'arrow' || variant === 'double-arrow',
      rotationDeg: 0,
      opacity: 100,
      zIndex: maxZIndex(currentPage.elements) + 1,
      locked: false,
    };
    handleAddDrawnElement(newEl);
  };

  const handleAddStickyNoteFromDraw = (color: string) => {
    if (pageLocked) return;
    const newEl: TemplateElement = {
      id: nextId('sticky'),
      kind: 'shape',
      shapeType: 'sticky-note',
      xPct: 50,
      yPct: 50,
      widthPct: 25,
      heightPct: 25,
      fill: color,
      color: '#1C2024',
      content: 'Write a note...',
      fontKey: 'hand',
      rotationDeg: -2,
      opacity: 100,
      zIndex: maxZIndex(currentPage.elements) + 1,
      locked: false,
    };
    handleAddDrawnElement(newEl);
  };

  const handleAddTextFromDraw = () => {
    handleAddTextElement('headline', 'Add a heading');
  };

  const handleAddTableFromDraw = () => {
    if (pageLocked) return;
    const newEl: TemplateElement = {
      id: nextId('table'),
      kind: 'shape',
      shapeType: 'table',
      xPct: 50,
      yPct: 50,
      widthPct: 55,
      heightPct: 25,
      fill: 'none',
      color: '#1C2024',
      content: JSON.stringify([
        ['Feature', 'Basic', 'Pro'],
        ['Custom Pages', '10 Pages', 'Unlimited'],
        ['High-Res Export', 'Included', 'Included'],
      ]),
      rotationDeg: 0,
      opacity: 100,
      zIndex: maxZIndex(currentPage.elements) + 1,
      locked: false,
    };
    handleAddDrawnElement(newEl);
  };

  const handleAddUploads = (photos: UploadedPhoto[]) => setUploads((prev) => [...photos, ...prev]);
  const handleRemoveUpload = (id: string) => setUploads((prev) => prev.filter((u) => u.id !== id));

  const deleteElements = (ids: string[]) => {
    if (ids.length === 0 || pageLocked) return;
    setPageElements(selectedPageIndex, currentPage.elements.filter((e) => !ids.includes(e.id)), true);
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    setIsDefaultProject(false);
  };

  const duplicateElements = (ids: string[]) => {
    if (pageLocked) return;
    const sources = currentPage.elements.filter((e) => ids.includes(e.id));
    if (sources.length === 0) return;
    const idMap = new Map<string, string>();
    const copies = sources.map((s) => {
      const newId = nextId(s.kind);
      idMap.set(s.id, newId);
      return { ...s, id: newId, xPct: Math.min(95, s.xPct + 4), yPct: Math.min(95, s.yPct + 4), zIndex: maxZIndex(currentPage.elements) + 1 };
    });
    setPageElements(selectedPageIndex, [...currentPage.elements, ...copies], true);
    setSelectedIds(copies.map((c) => c.id));
    setIsDefaultProject(false);
  };

  const changeLayer = (direction: 'forward' | 'backward' | 'front' | 'back') => {
    if (!primaryElement || pageLocked) return;
    const sorted = [...currentPage.elements].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
    const idx = sorted.findIndex((e) => e.id === primaryElement.id);
    if (idx === -1) return;
    const reordered = [...sorted];
    const [item] = reordered.splice(idx, 1);
    if (direction === 'front') reordered.push(item);
    else if (direction === 'back') reordered.unshift(item);
    else if (direction === 'forward') reordered.splice(Math.min(reordered.length, idx + 1), 0, item);
    else reordered.splice(Math.max(0, idx - 1), 0, item);
    const withZ = reordered.map((e, i) => ({ ...e, zIndex: i }));
    setPageElements(selectedPageIndex, withZ, true);
    setIsDefaultProject(false);
  };

  const moveLayerFromPanel = (id: string, direction: 'up' | 'down') => {
    const sorted = [...currentPage.elements].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
    const idx = sorted.findIndex((e) => e.id === id);
    if (idx === -1) return;
    const swapWith = direction === 'up' ? idx + 1 : idx - 1;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    [sorted[idx], sorted[swapWith]] = [sorted[swapWith], sorted[idx]];
    const withZ = sorted.map((e, i) => ({ ...e, zIndex: i }));
    setPageElements(selectedPageIndex, withZ, true);
    setIsDefaultProject(false);
  };

  const toggleLockSelected = () => {
    if (selectedElements.length === 0 || pageLocked) return;
    const shouldLock = !selectedElements[0].locked;
    const elements = currentPage.elements.map((e) => (selectedIds.includes(e.id) ? { ...e, locked: shouldLock } : e));
    setPageElements(selectedPageIndex, elements, true);
    setIsDefaultProject(false);
  };

  const toggleVisible = (id: string) => {
    const el = currentPage.elements.find((e) => e.id === id);
    if (!el) return;
    updateElementCommit(id, { visible: el.visible === false ? true : false });
  };
  const toggleLock = (id: string) => {
    const el = currentPage.elements.find((e) => e.id === id);
    if (!el) return;
    updateElementCommit(id, { locked: !el.locked });
  };

  const nudgeSelected = (dx: number, dy: number) => {
    if (selectedElements.length === 0 || pageLocked) return;
    const elements = currentPage.elements.map((e) => (
      selectedIds.includes(e.id) && !e.locked
        ? { ...e, xPct: Math.max(0, Math.min(100, e.xPct + dx)), yPct: Math.max(0, Math.min(100, e.yPct + dy)) }
        : e
    ));
    setPageElements(selectedPageIndex, elements, true);
    setIsDefaultProject(false);
  };

  const replaceSelectedImageFile = async (file: File) => {
    if (!primaryElement || pageLocked) return;
    const { photo, error } = await processUploadFile(file);
    if (error || !photo) return;
    setUploads((prev) => [photo, ...prev]);
    updateElementCommit(primaryElement.id, {
      imgSrc: photo.objectUrl, originalSrc: photo.objectUrl, assetId: photo.id,
      sourceWidth: photo.width, sourceHeight: photo.height,
      cropXPct: 50, cropYPct: 50, cropZoom: 1,
    });
  };

  // --- Align / Distribute (multi-select) ---

  const bboxOf = (els: TemplateElement[]) => ({
    left: Math.min(...els.map((e) => e.xPct - e.widthPct / 2)),
    right: Math.max(...els.map((e) => e.xPct + e.widthPct / 2)),
    top: Math.min(...els.map((e) => e.yPct - e.heightPct / 2)),
    bottom: Math.max(...els.map((e) => e.yPct + e.heightPct / 2)),
  });

  const alignSelected = (align: Align) => {
    if (selectedElements.length < 2 || pageLocked) return;
    const box = bboxOf(selectedElements);
    const elements = currentPage.elements.map((e) => {
      if (!selectedIds.includes(e.id) || e.locked) return e;
      switch (align) {
        case 'left': return { ...e, xPct: box.left + e.widthPct / 2 };
        case 'right': return { ...e, xPct: box.right - e.widthPct / 2 };
        case 'centerX': return { ...e, xPct: (box.left + box.right) / 2 };
        case 'top': return { ...e, yPct: box.top + e.heightPct / 2 };
        case 'bottom': return { ...e, yPct: box.bottom - e.heightPct / 2 };
        case 'centerY': return { ...e, yPct: (box.top + box.bottom) / 2 };
        default: return e;
      }
    });
    setPageElements(selectedPageIndex, elements, true);
    setIsDefaultProject(false);
  };

  const distributeSelected = (axis: 'horizontal' | 'vertical') => {
    if (selectedElements.length < 3 || pageLocked) return;
    const sortKey = axis === 'horizontal' ? (e: TemplateElement) => e.xPct - e.widthPct / 2 : (e: TemplateElement) => e.yPct - e.heightPct / 2;
    const sizeKey = axis === 'horizontal' ? (e: TemplateElement) => e.widthPct : (e: TemplateElement) => e.heightPct;
    const sorted = [...selectedElements].sort((a, b) => sortKey(a) - sortKey(b));
    const first = sorted[0], last = sorted[sorted.length - 1];
    const span = (sortKey(last) + sizeKey(last)) - sortKey(first);
    const totalSize = sorted.reduce((sum, e) => sum + sizeKey(e), 0);
    const gap = (span - totalSize) / (sorted.length - 1);
    let cursor = sortKey(first);
    const updates = new Map<string, number>();
    sorted.forEach((e) => {
      const center = cursor + sizeKey(e) / 2;
      updates.set(e.id, center);
      cursor += sizeKey(e) + gap;
    });
    const elements = currentPage.elements.map((e) => {
      if (!updates.has(e.id) || e.locked) return e;
      const center = updates.get(e.id)!;
      return axis === 'horizontal' ? { ...e, xPct: center } : { ...e, yPct: center };
    });
    setPageElements(selectedPageIndex, elements, true);
    setIsDefaultProject(false);
  };

  // --- Group / Ungroup (shared-groupId model — see Step 6) ---

  const groupSelected = () => {
    if (selectedElements.length < 2 || pageLocked) return;
    const groupId = nextId('group');
    const elements = currentPage.elements.map((e) => (selectedIds.includes(e.id) ? { ...e, groupId } : e));
    setPageElements(selectedPageIndex, elements, true);
    setIsDefaultProject(false);
  };

  const ungroupSelected = () => {
    if (!isGroupSelected || pageLocked) return;
    const elements = currentPage.elements.map((e) => (selectedIds.includes(e.id) ? { ...e, groupId: undefined } : e));
    setPageElements(selectedPageIndex, elements, true);
    setIsDefaultProject(false);
  };

  // --- Crop mode ---

  const enterCrop = () => {
    if (!primaryElement || primaryElement.kind !== 'image' || pageLocked) return;
    setCropSnapshot(primaryElement);
    setCropElementId(primaryElement.id);
  };
  const cropChange = (patch: Partial<TemplateElement>) => {
    if (!cropElementId) return;
    updateElementLive(cropElementId, patch);
  };
  const cropDone = () => {
    if (cropElementId) commitCurrentLiveState();
    setCropElementId(null);
    setCropSnapshot(null);
  };
  const cropCancel = () => {
    if (cropElementId && cropSnapshot) updateElementLive(cropElementId, cropSnapshot);
    setCropElementId(null);
    setCropSnapshot(null);
  };

  // --- Page management (Step 7) ---

  const patchPage = (id: string, patch: Partial<TemplatePage>) => {
    const nextPages = project.pages.map((p) => (p.id === id ? { ...p, ...patch } : p));
    commitProject({ ...project, pages: nextPages });
  };

  const selectPageOnly = (id: string) => {
    setSelectedPageId(id);
    setSelectedPageIds([id]);
  };

  const insertPageAfter = (page: TemplatePage, afterId: string) => {
    const idx = findPageIndex(afterId);
    const nextPages = [...project.pages.slice(0, idx + 1), page, ...project.pages.slice(idx + 1)];
    commitProject({ ...project, pages: nextPages });
    selectPageOnly(page.id);
  };

  const insertPageBefore = (page: TemplatePage, beforeId: string) => {
    const idx = findPageIndex(beforeId);
    const nextPages = [...project.pages.slice(0, idx), page, ...project.pages.slice(idx)];
    commitProject({ ...project, pages: nextPages });
    selectPageOnly(page.id);
  };

  const makeBlankPage = (): TemplatePage => ({ id: nextId('page'), kind: 'blank', name: 'New Page', elements: [], background: project.defaultBackground });

  const handleAddBlankPage = () => insertPageAfter(makeBlankPage(), selectedPageId);
  const handleAddPageAfter = (id: string) => insertPageAfter(makeBlankPage(), id);
  const handleAddPageBefore = (id: string) => insertPageBefore(makeBlankPage(), id);
  const handleAddFromLayout = (layout: TemplatePage) => insertPageAfter(clonePage(layout, nextId), selectedPageId);

  const handleDuplicatePage = (id: string) => {
    const idx = findPageIndex(id);
    if (idx === -1) return;
    insertPageAfter(clonePage(project.pages[idx], nextId), id);
  };
  const handleDuplicateCurrentPage = () => handleDuplicatePage(selectedPageId);

  const handleCopyPage = (id: string) => {
    const idx = findPageIndex(id);
    if (idx === -1) return;
    pageClipboardRef.current = project.pages[idx];
    setHasPageClipboard(true);
  };
  const handlePastePageAfter = (id: string) => {
    if (!pageClipboardRef.current) return;
    insertPageAfter(clonePage(pageClipboardRef.current, nextId), id);
  };

  const handleDeletePage = (id: string) => {
    if (project.pages.length <= 1) {
      // Never end with zero pages — reset the sole remaining page to blank
      // instead of disabling Delete (Step 7 §6).
      const page = project.pages[0];
      commitProject({ ...project, pages: [{ ...page, elements: [], locked: false }] });
      selectPageOnly(page.id);
      return;
    }
    const idx = findPageIndex(id);
    const nextPages = project.pages.filter((p) => p.id !== id);
    commitProject({ ...project, pages: nextPages });
    const newIdx = Math.min(idx, nextPages.length - 1);
    selectPageOnly(nextPages[newIdx].id);
  };

  const handleDeleteSelectedPages = () => {
    if (selectedPageIds.length < 2) { handleDeletePage(selectedPageIds[0] ?? selectedPageId); return; }
    const survivors = project.pages.filter((p) => !selectedPageIds.includes(p.id));
    const nextPages = survivors.length > 0 ? survivors : [{ ...project.pages[0], elements: [], locked: false }];
    commitProject({ ...project, pages: nextPages });
    selectPageOnly(nextPages[0].id);
  };

  const handleDuplicateSelectedPages = () => {
    if (selectedPageIds.length < 2) { handleDuplicatePage(selectedPageIds[0] ?? selectedPageId); return; }
    const orderedSelected = project.pages.filter((p) => selectedPageIds.includes(p.id));
    const lastSelectedIndex = Math.max(...selectedPageIds.map((id) => findPageIndex(id)).filter((i) => i !== -1));
    const copies = orderedSelected.map((p) => clonePage(p, nextId));
    const nextPages = [...project.pages.slice(0, lastSelectedIndex + 1), ...copies, ...project.pages.slice(lastSelectedIndex + 1)];
    commitProject({ ...project, pages: nextPages });
    setSelectedPageIds(copies.map((c) => c.id));
    setSelectedPageId(copies[0].id);
  };

  const handleMovePage = (id: string, direction: 'up' | 'down') => {
    const idx = findPageIndex(id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= project.pages.length) return;
    const nextPages = [...project.pages];
    [nextPages[idx], nextPages[swapIdx]] = [nextPages[swapIdx], nextPages[idx]];
    commitProject({ ...project, pages: nextPages });
  };

  const handleReorderPages = (draggedId: string, targetId: string, edge: 'before' | 'after') => {
    if (draggedId === targetId) return;
    const pages = [...project.pages];
    const fromIdx = pages.findIndex((p) => p.id === draggedId);
    if (fromIdx === -1) return;
    const [moved] = pages.splice(fromIdx, 1);
    let targetIdx = pages.findIndex((p) => p.id === targetId);
    if (targetIdx === -1) return;
    if (edge === 'after') targetIdx += 1;
    pages.splice(targetIdx, 0, moved);
    commitProject({ ...project, pages });
  };

  const handleSelectPage = (id: string, e: { shiftKey?: boolean; metaKey?: boolean; ctrlKey?: boolean }) => {
    const additive = e.shiftKey || e.metaKey || e.ctrlKey;
    if (!additive) { selectPageOnly(id); return; }
    setSelectedPageIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((pid) => pid !== id);
        return next.length ? next : prev;
      }
      return [...prev, id];
    });
    setSelectedPageId(id);
  };

  const handleRenamePage = (id: string, name: string) => patchPage(id, { name });
  const handleSetPageRole = (id: string, role: PageRole | undefined) => patchPage(id, { role });
  const handleSetPageBackground = (id: string, background: PageBackground) => {
    patchPage(id, { background });
    recordBackgroundUsed(background);
  };
  const handleToggleLockPage = (id: string) => {
    const page = project.pages.find((p) => p.id === id);
    if (page) patchPage(id, { locked: !page.locked });
  };

  const handleChangeDimensions = (next: TemplateDimensions) => {
    commitProject({ ...project, dimensions: next });
  };

  const handleChangePageNumberSettings = (patch: Partial<PageNumberSettings>) => {
    commitProject({ ...project, pageNumbers: { ...project.pageNumbers, ...patch } });
  };

  // --- Backgrounds (Step 8) — a real page property, never a draggable
  // element; "apply to all/selected" is always a single history commit. ---

  const handleApplyBackgroundToAll = (background: PageBackground) => {
    commitProject({ ...project, pages: project.pages.map((p) => ({ ...p, background })) });
    recordBackgroundUsed(background);
  };

  const handleApplyBackgroundToSelected = (background: PageBackground) => {
    commitProject({ ...project, pages: project.pages.map((p) => (selectedPageIds.includes(p.id) ? { ...p, background } : p)) });
    recordBackgroundUsed(background);
  };

  const handleResetBackground = (id: string) => patchPage(id, { background: project.defaultBackground });
  const handleSetDefaultBackground = (background: PageBackground) => commitProject({ ...project, defaultBackground: background });

  const handleUploadBackgroundImage = async (file: File) => {
    const { photo, error } = await processUploadFile(file);
    if (error || !photo) return;
    setUploads((prev) => [photo, ...prev]);
    const image: BackgroundImageData = {
      src: photo.objectUrl, originalSrc: photo.objectUrl, assetId: photo.id, sourceWidth: photo.width, sourceHeight: photo.height,
      fit: 'fill', xPct: 50, yPct: 50, zoom: 1, opacity: 100, blur: 0, overlayOpacity: 0,
    };
    handleSetPageBackground(currentPage.id, { type: 'image', image });
  };

  /** Reposition/zoom for a background image reuses the same live-then-commit
   * gesture pattern as element dragging (one undo step per gesture, not one
   * per pointer-move frame) — sharing preDragSnapshotRef is intentional: both
   * are "a gesture is in progress" the thumbnail-sync effect should ignore. */
  const backgroundCropChange = (patch: Partial<BackgroundImageData>) => {
    if (!currentPage.background?.image) return;
    if (bgDragSnapshotRef.current === null) bgDragSnapshotRef.current = project;
    const nextPages = project.pages.map((p, i) => (
      i === selectedPageIndex ? { ...p, background: { ...p.background!, image: { ...p.background!.image!, ...patch } } } : p
    ));
    setProjectLive({ ...project, pages: nextPages });
  };
  const backgroundCropDone = () => {
    if (bgDragSnapshotRef.current) {
      commitWithSnapshot(bgDragSnapshotRef.current, project);
      bgDragSnapshotRef.current = null;
    }
    setBgCropActive(false);
  };
  const backgroundCropCancel = () => {
    if (bgDragSnapshotRef.current) {
      setProjectLive(bgDragSnapshotRef.current);
      bgDragSnapshotRef.current = null;
    }
    setBgCropActive(false);
  };

  const hasContent = project.pages.some((p) => p.elements.length > 0);

  const pageNumberFor = useCallback((page: TemplatePage, index: number): PageNumberOverlay | null => {
    const role = resolvePageRole(page, index, project.pages.length);
    const num = computePrintedNumber(index, role, project.pageNumbers);
    if (num === null) return null;
    return {
      label: String(num),
      position: project.pageNumbers.position,
      fontFamily: fontFamilyFor(project.pageNumbers.fontKey),
      fontSize: project.pageNumbers.fontSize,
      color: project.pageNumbers.color,
    };
  }, [project.pages.length, project.pageNumbers]);

  const spreads = useMemo(() => computeSpreads(project.pages.length), [project.pages.length]);
  const currentSpread = spreads[spreadIndexForPage(spreads, selectedPageIndex)] ?? spreads[0];

  // --- Keyboard shortcuts ---

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isTyping) return;

      const meta = e.metaKey || e.ctrlKey;
      if (e.key === 'Escape') {
        if (cropElementId) cropCancel();
        else setSelectedIds([]);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length > 0) {
        e.preventDefault();
        deleteElements(selectedIds);
      } else if (meta && e.key === 'Enter') {
        e.preventDefault();
        handleAddBlankPage();
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        const idx = Math.max(0, selectedPageIndex - 1);
        selectPageOnly(project.pages[idx].id);
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        const idx = Math.min(project.pages.length - 1, selectedPageIndex + 1);
        selectPageOnly(project.pages[idx].id);
      } else if (e.key === 'Home') {
        e.preventDefault();
        selectPageOnly(project.pages[0].id);
      } else if (e.key === 'End') {
        e.preventDefault();
        selectPageOnly(project.pages[project.pages.length - 1].id);
      } else if (meta && e.key.toLowerCase() === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (meta && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if (meta && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (meta && e.key.toLowerCase() === 'g' && e.shiftKey) {
        e.preventDefault();
        ungroupSelected();
      } else if (meta && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        groupSelected();
      } else if (meta && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedIds(currentPage.elements.map((el) => el.id));
      } else if (meta && e.key.toLowerCase() === 'd' && selectedIds.length > 0) {
        e.preventDefault();
        duplicateElements(selectedIds);
      } else if (meta && e.key.toLowerCase() === 'c' && selectedElements.length > 0) {
        e.preventDefault();
        clipboardRef.current = selectedElements;
      } else if (meta && e.key.toLowerCase() === 'x' && selectedElements.length > 0) {
        e.preventDefault();
        clipboardRef.current = selectedElements;
        deleteElements(selectedIds);
      } else if (meta && e.key.toLowerCase() === 'v' && clipboardRef.current) {
        e.preventDefault();
        const copies = clipboardRef.current.map((src) => ({ ...src, id: nextId(src.kind), xPct: Math.min(95, src.xPct + 4), yPct: Math.min(95, src.yPct + 4), zIndex: maxZIndex(currentPage.elements) + 1 }));
        setPageElements(selectedPageIndex, [...currentPage.elements, ...copies], true);
        setSelectedIds(copies.map((c) => c.id));
        setIsDefaultProject(false);
      } else if (selectedIds.length > 0 && e.key.startsWith('Arrow')) {
        e.preventDefault();
        const step = e.shiftKey ? 2 : 0.3;
        if (e.key === 'ArrowLeft') nudgeSelected(-step, 0);
        else if (e.key === 'ArrowRight') nudgeSelected(step, 0);
        else if (e.key === 'ArrowUp') nudgeSelected(0, -step);
        else if (e.key === 'ArrowDown') nudgeSelected(0, step);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, selectedElements, currentPage, project, cropElementId, selectedPageIndex]);

  const activeToolLabel = TOOLS.find((t) => t.key === activeTool)?.label ?? '';
  const pageSettingsPage = pageSettingsId ? project.pages.find((p) => p.id === pageSettingsId) ?? null : null;

  const baseCanvasWidth = useMemo(() => {
    if (typeof window === 'undefined') return 480;
    if (window.innerWidth < 480) return Math.min(330, window.innerWidth - 32);
    if (window.innerWidth < 768) return Math.min(420, window.innerWidth - 64);
    return 480;
  }, []);
  const canvasWidth = Math.round(baseCanvasWidth * (zoom / 100));

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-[#F5F5F3] text-[#1C2024] overflow-hidden select-none" data-lenis-prevent>
      <Seo
        title={`Magazine Maker | ${BRAND_NAME}`}
        description="Create a personalized keepsake magazine with rich editorial layouts and high-resolution PDF print exports."
        path="/magazine-maker"
      />

      <TopNavbar
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onPreview={() => setPreviewOpen(true)}
        onDownload={() => { setExportInitialFileType(undefined); setExportOpen(true); }}
        projectName={projectName}
        onRenameProject={(name) => { setProjectName(name); onProjectRenamed(name); }}
        saveStatus={autosave.status}
        lastSavedAt={autosave.lastSavedAt}
        saveError={autosave.error}
        onRetrySave={autosave.saveNow}
        dimensions={project.dimensions}
        hasContent={hasContent}
        onChangeDimensions={handleChangeDimensions}
      />

      <div className="flex-1 flex min-h-0 min-w-0 relative overflow-hidden">
        <LeftToolBar active={activeTool} onChange={handleToolChange} />

        {/* Floating Draw / Tools Palette (Canva Whiteboard / Draw toolbar) */}
        {activeTool === 'draw' && (
          <div className="absolute top-4 left-16 sm:left-20 z-40">
            <DrawPalette
              activeTool={activeDrawTool}
              onChangeTool={setActiveDrawTool}
              onClose={() => setActiveTool(null)}
              strokeColor={drawStrokeColor}
              onChangeStrokeColor={setDrawStrokeColor}
              strokeWidth={drawStrokeWidth}
              onChangeStrokeWidth={setDrawStrokeWidth}
              isHighlighter={drawIsHighlighter}
              onToggleHighlighter={setDrawIsHighlighter}
              onAddShape={handleAddShapeFromDraw}
              onAddLine={handleAddLineFromDraw}
              onAddStickyNote={handleAddStickyNoteFromDraw}
              onAddText={handleAddTextFromDraw}
              onAddTable={handleAddTableFromDraw}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </div>
        )}

        {/* Tool panel: slide-over drawer on mobile/tablet, docked sidebar on desktop */}
        {activeTool && activeTool !== 'pages' && activeTool !== 'draw' && (
          <div className="fixed md:static inset-y-0 left-0 z-30 md:z-auto flex flex-col max-w-full flex-shrink-0">
            {/* Mobile / tablet backdrop */}
            <div
              className="md:hidden fixed inset-0 bg-black/40 z-[-1]"
              onClick={() => setActiveTool(null)}
            />
            <div className="w-full sm:w-[370px] lg:w-[380px] h-full flex flex-col bg-white border-r border-[#E7E7E4] shadow-2xl md:shadow-none overflow-hidden relative select-none">
              <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#E7E7E4] bg-[#F5F5F3]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1C2024]">{activeToolLabel}</span>
                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  aria-label="Close panel"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6F7478] hover:bg-white hover:text-[#1C2024] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {activeTool === 'templates' && (
                  <TemplatesPanel
                    recentTemplates={recentTemplates}
                    onPreview={setPreviewTemplate}
                    onRequestApply={(tmpl) => { requestApplyTemplate(tmpl); if (typeof window !== 'undefined' && window.innerWidth < 768) setActiveTool(null); }}
                    onCreateBlank={requestCreateBlank}
                    onInsertPageLayout={(layout) => { handleAddFromLayout(layout); if (typeof window !== 'undefined' && window.innerWidth < 768) setActiveTool(null); }}
                  />
                )}
                {activeTool === 'uploads' && (
                  <UploadsPanel
                    uploads={uploads}
                    onAddUploads={handleAddUploads}
                    onRemoveUpload={handleRemoveUpload}
                    onUsePhoto={(url, w, h, id) => {
                      addOrFillPhoto(url, w, h, id);
                      if (typeof window !== 'undefined' && window.innerWidth < 768) setActiveTool(null);
                    }}
                  />
                )}
                {activeTool === 'elements' && (
                  <ElementsPanel recentItemIds={recentElementIds} onAddElement={(item) => { addLibraryElement(item); if (typeof window !== 'undefined' && window.innerWidth < 768) setActiveTool(null); }} />
                )}
                {activeTool === 'background' && (
                  <BackgroundPanel
                    page={currentPage}
                    gradient={project.accentGradient}
                    dimensions={project.dimensions}
                    pageCount={project.pages.length}
                    selectedPageCount={selectedPageIds.length}
                    documentColors={documentColors}
                    recentColors={recentColors}
                    recentBackgrounds={recentBackgrounds}
                    onApply={(bg) => handleSetPageBackground(currentPage.id, bg)}
                    onApplyToAll={handleApplyBackgroundToAll}
                    onApplyToSelected={handleApplyBackgroundToSelected}
                    onReset={() => handleResetBackground(currentPage.id)}
                    onEnterReposition={() => setBgCropActive(true)}
                    onUploadImage={handleUploadBackgroundImage}
                    onSetAsDefault={() => handleSetDefaultBackground(currentPage.background ?? DEFAULT_BACKGROUND)}
                  />
                )}
                {activeTool === 'text' && (
                  <TextPanel
                    onAddText={handleAddTextElement}
                    onAddMultipleElements={handleAddMultipleElements}
                  />
                )}
                {activeTool !== 'templates' && activeTool !== 'uploads' && activeTool !== 'elements' && activeTool !== 'background' && activeTool !== 'text' && (
                  <ComingSoonPanel label={activeToolLabel} />
                )}
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative">
          <EditorToolbar
            pageNumber={selectedPageIndex + 1}
            pageName={currentPage.name}
            pageRoleLabel={(() => {
              const role = resolvePageRole(currentPage, selectedPageIndex, project.pages.length);
              return role === 'inside' ? null : pageRoleLabel(role);
            })()}
            pageLocked={pageLocked}
            onTogglePageLock={() => handleToggleLockPage(currentPage.id)}
            onDuplicatePage={() => handleDuplicatePage(currentPage.id)}
            onDeletePage={() => handleDeletePage(currentPage.id)}
            selectedElement={primaryElement}
            selectedCount={selectedIds.length}
            isGroupSelected={isGroupSelected}
            imageQuality={imageQuality}
            recentColors={recentColors}
            dimensions={project.dimensions}
            onPatchElement={patchSelected}
            onReplaceImage={replaceSelectedImageFile}
            onCropImage={enterCrop}
            onLayerElement={changeLayer}
            onToggleLockElement={toggleLockSelected}
            onDuplicateElement={() => duplicateElements(selectedIds)}
            onDeleteElement={() => deleteElements(selectedIds)}
            onAlign={alignSelected}
            onDistribute={distributeSelected}
            onGroup={groupSelected}
            onUngroup={ungroupSelected}
          />

          <div
            className="relative flex-1 overflow-auto flex items-center justify-center p-3 sm:p-6 md:p-10"
            onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY }); }}
          >
            {viewMode === 'single' ? (
              <CanvasErrorBoundary resetKey={currentPage.id}>
                <MagazineCanvas
                  page={currentPage}
                  dimensions={project.dimensions}
                  gradient={project.accentGradient}
                  selectedIds={selectedIds}
                  onSelectElement={handleSelectElement}
                  onDeselect={() => setSelectedIds([])}
                  onChangeElement={updateElementLive}
                  onCommitElement={commitCurrentLiveState}
                  cropElementId={cropElementId}
                  onCropChange={cropChange}
                  onCropDone={cropDone}
                  onCropCancel={cropCancel}
                  view={view}
                  width={canvasWidth}
                  locked={pageLocked}
                  pageNumber={pageNumberFor(currentPage, selectedPageIndex)}
                  backgroundCropActive={bgCropActive}
                  onBackgroundCropChange={backgroundCropChange}
                  onBackgroundCropDone={backgroundCropDone}
                  onBackgroundCropCancel={backgroundCropCancel}
                  drawingMode={activeTool === 'draw' ? (activeDrawTool === 'pen' || activeDrawTool === 'signature' ? activeDrawTool : null) : null}
                  drawStrokeColor={drawStrokeColor}
                  drawStrokeWidth={drawStrokeWidth}
                  drawIsHighlighter={drawIsHighlighter}
                  onFinishDrawStroke={handleAddDrawnElement}
                />
              </CanvasErrorBoundary>
            ) : (
              <div className="flex items-end gap-3 max-w-full overflow-x-auto p-2">
                {[currentSpread.left, currentSpread.right].map((pageIdx) => {
                  if (pageIdx === null) return null;
                  const pg = project.pages[pageIdx];
                  if (!pg) return null;
                  const isActive = pageIdx === selectedPageIndex;
                  return (
                    <div
                      key={pg.id}
                      onPointerDownCapture={(e) => {
                        if (!isActive) { e.stopPropagation(); selectPageOnly(pg.id); }
                      }}
                      className="relative flex-shrink-0"
                    >
                      <CanvasErrorBoundary resetKey={pg.id}>
                        <MagazineCanvas
                          page={pg}
                          dimensions={project.dimensions}
                          gradient={project.accentGradient}
                          selectedIds={isActive ? selectedIds : []}
                          onSelectElement={isActive ? handleSelectElement : () => {}}
                          onDeselect={isActive ? () => setSelectedIds([]) : () => {}}
                          onChangeElement={isActive ? updateElementLive : () => {}}
                          onCommitElement={isActive ? commitCurrentLiveState : () => {}}
                          cropElementId={isActive ? cropElementId : null}
                          onCropChange={isActive ? cropChange : () => {}}
                          onCropDone={isActive ? cropDone : () => {}}
                          onCropCancel={isActive ? cropCancel : () => {}}
                          view={view}
                          width={Math.round(canvasWidth * 0.72)}
                          locked={pg.locked}
                          interactive={isActive}
                          pageNumber={pageNumberFor(pg, pageIdx)}
                          backgroundCropActive={isActive && bgCropActive}
                          onBackgroundCropChange={isActive ? backgroundCropChange : undefined}
                          onBackgroundCropDone={isActive ? backgroundCropDone : undefined}
                          onBackgroundCropCancel={isActive ? backgroundCropCancel : undefined}
                          drawingMode={isActive && activeTool === 'draw' ? (activeDrawTool === 'pen' || activeDrawTool === 'signature' ? activeDrawTool : null) : null}
                          drawStrokeColor={drawStrokeColor}
                          drawStrokeWidth={drawStrokeWidth}
                          drawIsHighlighter={drawIsHighlighter}
                          onFinishDrawStroke={handleAddDrawnElement}
                        />
                      </CanvasErrorBoundary>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dedicated bottom footer toolbar matching Canva layout */}
          <footer className="h-10 sm:h-11 bg-white border-t border-[#E7E7E4] flex items-center justify-between px-3 sm:px-4 z-20 flex-shrink-0 select-none">
            {/* Left controls: View menu and Single/Spread toggle */}
            <div className="flex items-center gap-2">
              <ViewMenu view={view} onChange={(patch) => setView((v) => ({ ...v, ...patch }))} />
              <div className="hidden sm:flex items-center gap-0.5 bg-[#F5F5F3] border border-[#E7E7E4] rounded-full p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('single')}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${viewMode === 'single' ? 'bg-white shadow-xs text-[#1C2024]' : 'text-[#6F7478] hover:text-[#1C2024]'}`}
                >
                  Single
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('spread')}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${viewMode === 'spread' ? 'bg-white shadow-xs text-[#1C2024]' : 'text-[#6F7478] hover:text-[#1C2024]'}`}
                >
                  Spread
                </button>
              </div>
            </div>

            {/* Center controls: Page navigation & open Pages drawer */}
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs">
              <button
                type="button"
                aria-label="Previous page"
                disabled={selectedPageIndex <= 0}
                onClick={() => selectPageOnly(project.pages[selectedPageIndex - 1].id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPagesOpen((v) => !v)}
                className="px-2 py-1 font-medium text-[#1C2024] hover:text-[#B8895A] transition-colors cursor-pointer whitespace-nowrap"
              >
                Page {selectedPageIndex + 1} of {project.pages.length}
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={selectedPageIndex >= project.pages.length - 1}
                onClick={() => selectPageOnly(project.pages[selectedPageIndex + 1].id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-[#E7E7E4] mx-1" />
              <button
                type="button"
                onClick={() => setPagesOpen((v) => !v)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${pagesOpen ? 'bg-[#B8895A]/10 text-[#B8895A]' : 'text-[#6F7478] hover:bg-[#F5F5F3] hover:text-[#1C2024]'}`}
              >
                Pages
              </button>
            </div>

            {/* Right controls: Undo, Redo, Zoom controls */}
            <div className="flex items-center">
              <ZoomControls
                zoom={zoom}
                onZoomIn={() => setZoom((z) => Math.min(200, z + 15))}
                onZoomOut={() => setZoom((z) => Math.max(40, z - 15))}
                onResetZoom={() => setZoom(100)}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </div>
          </footer>
        </main>

        {/* Pages panel: slide-over drawer on < xl, docked sidebar on xl+ */}
        {pagesOpen && (
          <div className="fixed xl:static inset-y-0 right-0 z-30 xl:z-auto flex flex-col h-full">
            <div
              className="xl:hidden fixed inset-0 bg-black/40 z-[-1]"
              onClick={() => setPagesOpen(false)}
            />
            <div className="w-full sm:w-[260px] h-full shadow-2xl xl:shadow-none bg-white">
              <PagesPanel
                pages={committedPages}
                dimensions={project.dimensions}
                gradient={project.accentGradient}
                selectedPageIds={selectedPageIds}
                onSelectPage={handleSelectPage}
                selectedElementIds={selectedIds}
                onSelectElement={(id, e) => handleSelectElement(id, e)}
                onToggleVisibleElement={toggleVisible}
                onToggleLockElement={toggleLock}
                onMoveLayer={moveLayerFromPanel}
                canPastePage={hasPageClipboard}
                hasContent={hasContent}
                pageNumbers={project.pageNumbers}
                onChangePageNumberSettings={handleChangePageNumberSettings}
                recentColors={recentColors}
                onAddBlankPage={handleAddBlankPage}
                onDuplicateCurrentPage={handleDuplicateCurrentPage}
                onAddFromLayout={handleAddFromLayout}
                onRenamePage={handleRenamePage}
                onDuplicatePage={handleDuplicatePage}
                onDeletePage={handleDeletePage}
                onMovePage={handleMovePage}
                onAddPageBefore={handleAddPageBefore}
                onAddPageAfter={handleAddPageAfter}
                onCopyPage={handleCopyPage}
                onPastePageAfter={handlePastePageAfter}
                onReorderPages={handleReorderPages}
                onDeleteSelectedPages={handleDeleteSelectedPages}
                onDuplicateSelectedPages={handleDuplicateSelectedPages}
                onOpenPageSettings={setPageSettingsId}
                onChangeDimensions={handleChangeDimensions}
                onEditBackground={() => setActiveTool('background')}
                currentPage={currentPage}
                onClose={() => setPagesOpen(false)}
              />
            </div>
          </div>
        )}
      </div>

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={requestApplyTemplate}
        />
      )}

      {pendingAction && (
        <ConfirmReplaceDialog onCancel={() => setPendingAction(null)} onConfirm={confirmPendingAction} />
      )}

      {pageSettingsPage && (
        <PageSettingsModal
          page={pageSettingsPage}
          resolvedRole={resolvePageRole(pageSettingsPage, findPageIndex(pageSettingsPage.id), project.pages.length)}
          dimensions={project.dimensions}
          gradient={project.accentGradient}
          onClose={() => setPageSettingsId(null)}
          onRename={(name) => handleRenamePage(pageSettingsPage.id, name)}
          onSetRole={(role) => handleSetPageRole(pageSettingsPage.id, role)}
          onEditBackground={() => setActiveTool('background')}
          onToggleLock={() => handleToggleLockPage(pageSettingsPage.id)}
          onDuplicate={() => { handleDuplicatePage(pageSettingsPage.id); setPageSettingsId(null); }}
          onDelete={() => { handleDeletePage(pageSettingsPage.id); setPageSettingsId(null); }}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          hasSelection={selectedIds.length > 0}
          canPaste={!!clipboardRef.current}
          isMultiSelect={selectedIds.length > 1}
          isGroup={isGroupSelected}
          onClose={() => setContextMenu(null)}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onCut={() => { clipboardRef.current = selectedElements; deleteElements(selectedIds); }}
          onCopy={() => { clipboardRef.current = selectedElements; }}
          onPaste={() => {
            if (!clipboardRef.current) return;
            const copies = clipboardRef.current.map((src) => ({ ...src, id: nextId(src.kind), xPct: Math.min(95, src.xPct + 4), yPct: Math.min(95, src.yPct + 4), zIndex: maxZIndex(currentPage.elements) + 1 }));
            setPageElements(selectedPageIndex, [...currentPage.elements, ...copies], true);
            setSelectedIds(copies.map((c) => c.id));
            setIsDefaultProject(false);
          }}
          onDuplicate={() => duplicateElements(selectedIds)}
          onGroup={groupSelected}
          onUngroup={ungroupSelected}
          onLayer={changeLayer}
          onLock={toggleLockSelected}
          onHide={() => selectedIds.forEach((id) => toggleVisible(id))}
          onDelete={() => deleteElements(selectedIds)}
        />
      )}

      {previewOpen && (
        <PreviewMode
          project={project}
          initialPageId={selectedPageId}
          onClose={() => setPreviewOpen(false)}
          onFixIssue={(pageId, elementId) => {
            setPreviewOpen(false);
            selectPageOnly(pageId);
            if (elementId) setSelectedIds([elementId]);
          }}
          onOpenExport={() => {
            setPreviewOpen(false);
            setExportInitialFileType('pdf-print');
            setExportOpen(true);
          }}
        />
      )}

      {exportOpen && (
        <ExportModal
          project={project}
          currentPageIndex={selectedPageIndex}
          selectedPageIds={selectedPageIds}
          initialFileType={exportInitialFileType}
          onClose={() => setExportOpen(false)}
          onReviewIssues={() => {
            setExportOpen(false);
            setPreviewOpen(true);
          }}
        />
      )}
    </div>
  );
}
