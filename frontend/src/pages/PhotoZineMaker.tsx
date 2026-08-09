import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Download, Images, ArrowLeft, Plus, Eye, Edit3, Sparkles, Undo2, Redo2, LayoutTemplate } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MagazineConfig, MagazinePage, PageLayoutType, PhotoSlot } from '../features/magazine-maker/types';
import { INITIAL_MAGAZINE_PAGES, createDefaultPage } from '../features/magazine-maker/templates';
import { A4MagazineCanvas } from '../features/magazine-maker/components/A4MagazineCanvas';
import { PageEditorPanel } from '../features/magazine-maker/components/PageEditorPanel';
import { CanvaTopToolbar, SelectedTextInfo } from '../features/magazine-maker/components/CanvaTopToolbar';
import { CanvaPageStrip } from '../features/magazine-maker/components/CanvaPageStrip';
import { LayerSidebar } from '../features/magazine-maker/components/LayerSidebar';
import { CanvaTemplateModal } from '../features/magazine-maker/components/CanvaTemplateModal';
import { CanvaTemplateGallery } from '../features/magazine-maker/components/CanvaTemplateGallery';
import { CanvaLeftNavDock } from '../features/magazine-maker/components/CanvaLeftNavDock';
import { generateA4MagazinePDF } from '../features/magazine-maker/utils/pdfExport';

export default function PhotoZineMaker() {
  const [activeTab, setActiveTab] = useState<'editor' | 'templates' | 'preview'>('editor');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [selectedTextInfo, setSelectedTextInfo] = useState<SelectedTextInfo | null>(null);
  const [showLayersPanel, setShowLayersPanel] = useState<boolean>(true);
  const [isCanvaModalOpen, setIsCanvaModalOpen] = useState<boolean>(false);

  const [config, setConfig] = useState<MagazineConfig>({
    title: 'SUMMER MEMORIES',
    subtitle: 'A4 PHOTO COLLECTION',
    issueNumber: 'VOL. 01',
    dateString: 'AUGUST 2026',
    editorName: 'CREATOR STUDIO',
    themeColor: '#D4AF37',
    fontFamily: "'Playfair Display', serif",
    pages: INITIAL_MAGAZINE_PAGES,
  });

  // Undo / Redo history stacks
  const [past, setPast] = useState<MagazineConfig[]>([]);
  const [future, setFuture] = useState<MagazineConfig[]>([]);

  // Array of refs for each A4 page DOM node (for PDF export)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State updater that records history for undo/redo
  const updateConfig = (updater: MagazineConfig | ((prev: MagazineConfig) => MagazineConfig)) => {
    setConfig((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next === prev) return prev;
      setPast((p) => [...p.slice(-30), prev]); // store up to 30 previous states
      setFuture([]); // clear redo stack on new modification
      return next;
    });
  };

  const handleUndo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setPast(newPast);
    setFuture((f) => [config, ...f]);
    setConfig(previous);
    toast.info('Undo change', { autoClose: 1000 });
  }, [past, config]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setFuture(newFuture);
    setPast((p) => [...p, config]);
    setConfig(next);
    toast.info('Redo change', { autoClose: 1000 });
  }, [future, config]);

  // Global Keyboard Shortcuts for Undo (Ctrl/Cmd+Z) and Redo (Ctrl/Cmd+Y or Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleCreateNewBlank = () => {
    const blankConfig: MagazineConfig = {
      title: 'MY NEW MAGAZINE',
      subtitle: 'VOL. 01 • STUDIO CREATION',
      issueNumber: 'VOL. 01',
      dateString: '2026 EDITION',
      editorName: 'PRINTALARM STUDIO',
      themeColor: '#D4AF37',
      fontFamily: "'Playfair Display', serif",
      pages: [
        createDefaultPage(1, 'cover'),
        createDefaultPage(2, 'editorial_spread'),
        createDefaultPage(3, 'back_cover'),
      ],
    };
    setConfig(blankConfig);
    setPast([]);
    setFuture([]);
    setActivePageIndex(0);
    setActiveTab('editor');
    toast.success('Created new blank mini-magazine project!');
  };

  const handleUpdateConfig = (updated: Partial<MagazineConfig>) => {
    updateConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdatePage = (pageIndex: number, updated: Partial<MagazinePage>) => {
    updateConfig((prev) => {
      const nextPages = [...prev.pages];
      if (nextPages[pageIndex]) {
        if (updated.layout && updated.layout !== nextPages[pageIndex].layout) {
          const freshPage = createDefaultPage(nextPages[pageIndex].pageNumber, updated.layout);
          const existingPhotos = nextPages[pageIndex].slots.map((s) => s.src).filter(Boolean) as string[];
          let photoIdx = 0;
          freshPage.slots = freshPage.slots.map((slot) => {
            const src = existingPhotos[photoIdx] || null;
            if (src) photoIdx++;
            return { ...slot, src };
          });
          nextPages[pageIndex] = { ...freshPage, ...updated };
        } else {
          nextPages[pageIndex] = { ...nextPages[pageIndex], ...updated };
        }
      }
      return { ...prev, pages: nextPages };
    });
  };

  const handleUpdateSelection = (updated: Partial<SelectedTextInfo>) => {
    if (!selectedTextInfo) return;

    const nextInfo = { ...selectedTextInfo, ...updated };
    setSelectedTextInfo(nextInfo);

    const activePage = config.pages[activePageIndex];
    if (!activePage) return;

    if (nextInfo.type === 'config_title') {
      handleUpdateConfig({
        title: updated.text !== undefined ? updated.text : config.title,
        fontFamily: updated.fontFamily !== undefined ? updated.fontFamily : config.fontFamily,
      });
    } else if (nextInfo.type === 'config_subtitle') {
      handleUpdateConfig({
        subtitle: updated.text !== undefined ? updated.text : config.subtitle,
      });
    } else if (nextInfo.type === 'editorial') {
      handleUpdatePage(activePageIndex, {
        editorialText: updated.text !== undefined ? updated.text : activePage.editorialText,
      });
    } else if (nextInfo.type === 'page_title') {
      handleUpdatePage(activePageIndex, {
        title: updated.text !== undefined ? updated.text : activePage.title,
      });
    } else if (nextInfo.type === 'overlay' && nextInfo.overlay) {
      const updatedOverlays = activePage.textOverlays.map((ov) => {
        if (ov.id === nextInfo.overlay?.id) {
          return {
            ...ov,
            text: updated.text !== undefined ? updated.text : ov.text,
            fontSize: updated.fontSize !== undefined ? updated.fontSize : ov.fontSize,
            fontFamily: updated.fontFamily !== undefined ? updated.fontFamily : ov.fontFamily,
            color: updated.color !== undefined ? updated.color : ov.color,
            align: updated.align !== undefined ? updated.align : ov.align,
            fontWeight: updated.fontWeight !== undefined ? updated.fontWeight : ov.fontWeight,
            fontStyle: updated.fontStyle !== undefined ? updated.fontStyle : ov.fontStyle,
          };
        }
        return ov;
      });
      handleUpdatePage(activePageIndex, { textOverlays: updatedOverlays });
    }
  };

  const handleAddTextOverlay = (type: 'title' | 'subtitle' | 'body' | 'quote') => {
    const activePage = config.pages[activePageIndex];
    if (!activePage) return;

    const overlayId = `overlay-${Date.now()}`;
    let newOverlay: any;

    if (type === 'title') {
      newOverlay = {
        id: overlayId,
        text: 'HEADING TITLE',
        fontSize: 28,
        fontFamily: "'Playfair Display', serif",
        color: '#111827',
        align: 'center',
        xPct: 50,
        yPct: 50,
        fontWeight: 'bold',
      };
    } else if (type === 'subtitle') {
      newOverlay = {
        id: overlayId,
        text: 'SUBHEADING TEXT',
        fontSize: 18,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#B45309',
        align: 'center',
        xPct: 50,
        yPct: 55,
        fontWeight: 'bold',
      };
    } else if (type === 'quote') {
      newOverlay = {
        id: overlayId,
        text: '“A photograph is a memory held forever in time.”',
        fontSize: 16,
        fontFamily: "'Playfair Display', serif",
        color: '#3D1E30',
        align: 'center',
        xPct: 50,
        yPct: 60,
        fontStyle: 'italic',
      };
    } else {
      newOverlay = {
        id: overlayId,
        text: 'Click to type paragraph text here...',
        fontSize: 14,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#374151',
        align: 'left',
        xPct: 50,
        yPct: 65,
      };
    }

    const updatedOverlays = [...(activePage.textOverlays || []), newOverlay];
    handleUpdatePage(activePageIndex, { textOverlays: updatedOverlays });
    setSelectedTextInfo({
      id: overlayId,
      type: 'overlay',
      text: newOverlay.text,
      fontSize: newOverlay.fontSize,
      fontFamily: newOverlay.fontFamily,
      color: newOverlay.color,
      align: newOverlay.align,
      fontWeight: newOverlay.fontWeight,
      fontStyle: newOverlay.fontStyle,
      overlay: newOverlay,
    });
    toast.success('Added text block! Drag to move anywhere on canvas.');
  };

  const handleDeleteOverlay = (overlayId: string) => {
    const activePage = config.pages[activePageIndex];
    if (!activePage) return;
    const updatedOverlays = activePage.textOverlays.filter((ov) => ov.id !== overlayId);
    handleUpdatePage(activePageIndex, { textOverlays: updatedOverlays });
    setSelectedTextInfo(null);
    toast.info('Deleted text element.');
  };

  const handleBringSelectedToFront = () => {
    if (!selectedTextInfo) return;
    const activePage = config.pages[activePageIndex];
    if (!activePage) return;

    const allZ = [
      ...activePage.slots.map((s, idx) => s.zIndex ?? 10 + idx),
      ...activePage.textOverlays.map((o, idx) => o.zIndex ?? 30 + idx),
    ];
    const maxZ = Math.max(...allZ, 30);

    if (selectedTextInfo.type === 'overlay' && selectedTextInfo.overlay) {
      const updatedOverlays = activePage.textOverlays.map((ov) =>
        ov.id === selectedTextInfo.overlay?.id ? { ...ov, zIndex: maxZ + 5 } : ov
      );
      handleUpdatePage(activePageIndex, { textOverlays: updatedOverlays });
      toast.success('Brought element to front');
    } else if (selectedTextInfo.type === 'slot' && selectedTextInfo.slot) {
      const updatedSlots = activePage.slots.map((s) =>
        s.id === selectedTextInfo.slot?.id ? { ...s, zIndex: maxZ + 5 } : s
      );
      handleUpdatePage(activePageIndex, { slots: updatedSlots });
      toast.success('Brought photo slot to front');
    }
  };

  const handleSendSelectedToBack = () => {
    if (!selectedTextInfo) return;
    const activePage = config.pages[activePageIndex];
    if (!activePage) return;

    const allZ = [
      ...activePage.slots.map((s, idx) => s.zIndex ?? 10 + idx),
      ...activePage.textOverlays.map((o, idx) => o.zIndex ?? 30 + idx),
    ];
    const minZ = Math.min(...allZ, 1);

    if (selectedTextInfo.type === 'overlay' && selectedTextInfo.overlay) {
      const updatedOverlays = activePage.textOverlays.map((ov) =>
        ov.id === selectedTextInfo.overlay?.id ? { ...ov, zIndex: Math.max(1, minZ - 5) } : ov
      );
      handleUpdatePage(activePageIndex, { textOverlays: updatedOverlays });
      toast.success('Sent element to back');
    } else if (selectedTextInfo.type === 'slot' && selectedTextInfo.slot) {
      const updatedSlots = activePage.slots.map((s) =>
        s.id === selectedTextInfo.slot?.id ? { ...s, zIndex: Math.max(1, minZ - 5) } : s
      );
      handleUpdatePage(activePageIndex, { slots: updatedSlots });
      toast.success('Sent photo slot to back');
    }
  };

  const handleUpdateSlotFilter = (slotId: string, filter: PhotoSlot['filter']) => {
    const activePage = config.pages[activePageIndex];
    if (!activePage) return;
    const slots = activePage.slots.map((s) => (s.id === slotId ? { ...s, filter } : s));
    handleUpdatePage(activePageIndex, { slots });
  };

  const handleUpdateSlotCaption = (slotId: string, caption: string) => {
    const activePage = config.pages[activePageIndex];
    if (!activePage) return;
    const slots = activePage.slots.map((s) => (s.id === slotId ? { ...s, caption } : s));
    handleUpdatePage(activePageIndex, { slots });
  };

  const handleSlotPhotoChanged = (pageIndex: number, slotId: string, imageSrc: string | null) => {
    updateConfig((prev) => {
      const nextPages = [...prev.pages];
      if (nextPages[pageIndex]) {
        const slots = nextPages[pageIndex].slots.map((s) => (s.id === slotId ? { ...s, src: imageSrc } : s));
        nextPages[pageIndex] = { ...nextPages[pageIndex], slots };
      }
      return { ...prev, pages: nextPages };
    });
  };

  const handleSlotZoomChanged = (pageIndex: number, slotId: string, zoom: number) => {
    updateConfig((prev) => {
      const nextPages = [...prev.pages];
      if (nextPages[pageIndex]) {
        const slots = nextPages[pageIndex].slots.map((s) => (s.id === slotId ? { ...s, zoom } : s));
        nextPages[pageIndex] = { ...nextPages[pageIndex], slots };
      }
      return { ...prev, pages: nextPages };
    });
  };

  const handleAddPage = (layoutType: PageLayoutType = 'editorial_spread') => {
    updateConfig((prev) => {
      const newPageNum = prev.pages.length + 1;
      const newPage = createDefaultPage(newPageNum, layoutType);
      toast.success(`Added A4 Page ${newPageNum}`);
      return { ...prev, pages: [...prev.pages, newPage] };
    });
    setActivePageIndex(config.pages.length);
  };

  const handleDuplicatePage = (pageIndex: number) => {
    const targetPage = config.pages[pageIndex];
    if (!targetPage) return;

    const newId = `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duplicated: MagazinePage = {
      ...targetPage,
      id: newId,
      pageNumber: pageIndex + 2,
      slots: targetPage.slots.map((s, idx) => ({ ...s, id: `${newId}-slot-${idx + 1}` })),
      textOverlays: targetPage.textOverlays.map((ov) => ({
        ...ov,
        id: `overlay-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      })),
    };

    updateConfig((prev) => {
      const nextPages = [...prev.pages];
      nextPages.splice(pageIndex + 1, 0, duplicated);
      const reindexed = nextPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
      return { ...prev, pages: reindexed };
    });
    setActivePageIndex(pageIndex + 1);
    toast.success(`Duplicated Page ${targetPage.pageNumber}`);
  };

  const handleReorderPage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= config.pages.length) return;
    updateConfig((prev) => {
      const nextPages = [...prev.pages];
      const [moved] = nextPages.splice(fromIndex, 1);
      nextPages.splice(toIndex, 0, moved);
      const reindexed = nextPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
      return { ...prev, pages: reindexed };
    });
    setActivePageIndex(toIndex);
  };

  const handleDeletePage = (pageIndex: number) => {
    if (config.pages.length <= 1) {
      toast.warn('Magazine must have at least 1 page.');
      return;
    }
    updateConfig((prev) => {
      const nextPages = prev.pages.filter((_, idx) => idx !== pageIndex);
      const reindexed = nextPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
      toast.info('Page deleted');
      return { ...prev, pages: reindexed };
    });
    setActivePageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleBulkPhotoUpload = async (input: React.ChangeEvent<HTMLInputElement> | FileList) => {
    let files: FileList | null = null;
    if ('target' in input) {
      files = input.target.files;
    } else {
      files = input;
    }
    if (!files) return;
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      toast.warn('Please select valid image files.');
      return;
    }

    const readPromises = fileArray.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (res) => resolve(res.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    try {
      const imageUrls = await Promise.all(readPromises);
      let imgIndex = 0;

      updateConfig((prev) => {
        const nextPages = prev.pages.map((page) => {
          const nextSlots = page.slots.map((slot) => {
            if (!slot.src && imgIndex < imageUrls.length) {
              const src = imageUrls[imgIndex];
              imgIndex++;
              return { ...slot, src };
            }
            return slot;
          });
          return { ...page, slots: nextSlots };
        });

        const extraPages: MagazinePage[] = [];
        while (imgIndex < imageUrls.length) {
          const pageNum = nextPages.length + extraPages.length + 1;
          const newPage = createDefaultPage(pageNum, 'quad_grid');
          newPage.slots = newPage.slots.map((slot) => {
            if (imgIndex < imageUrls.length) {
              const src = imageUrls[imgIndex];
              imgIndex++;
              return { ...slot, src };
            }
            return slot;
          });
          extraPages.push(newPage);
        }

        toast.success(`Successfully loaded ${fileArray.length} photos into magazine!`);
        return { ...prev, pages: [...nextPages, ...extraPages] };
      });
    } catch (err) {
      console.error('Bulk upload failed:', err);
      toast.error('Failed to process image files.');
    }
  };

  const handleGeneratePdf = async () => {
    setIsExportingPdf(true);
    toast.info('Rendering high-resolution A4 PDF document...');
    try {
      await generateA4MagazinePDF(pageRefs.current, config.title || 'Photo-Magazine');
      toast.success('A4 Magazine PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Could not generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const totalPhotosUploaded = config.pages.reduce(
    (count, page) => count + page.slots.filter((s) => Boolean(s.src)).length,
    0
  );

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-accent font-sans pb-16">
      {/* Top Navigation Header */}
      <div className="sticky top-0 z-40 bg-white/90 border-b border-luxury-gold/30 backdrop-blur-md px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-lg bg-luxury-black hover:bg-luxury-gray text-luxury-accent hover:text-luxury-gold border border-luxury-gold/20 transition-colors"
              title="Return Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Images className="w-4.5 h-4.5 text-luxury-gold" />
                <h1 className="text-sm md:text-base font-display font-bold text-luxury-accent tracking-wide uppercase">
                  Mini Magazine Studio
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold font-mono font-bold">
                  CANVA A4 MAKER
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                Create new mini-magazines, edit multi-page templates, and export print-ready A4 PDFs
              </p>
            </div>
          </div>

          {/* View Tab Switcher & Actions */}
          <div className="flex items-center gap-2">
            {/* Create New Blank Button */}
            <button
              type="button"
              onClick={handleCreateNewBlank}
              className="px-3 py-1.5 rounded-lg bg-black text-luxury-gold hover:bg-zinc-900 border border-luxury-gold/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-luxury-gold" />
              <span>Create New</span>
            </button>

            {/* Undo / Redo */}
            <div className="hidden sm:flex items-center p-1 rounded-lg bg-white border border-luxury-gold/30 shadow-xs">
              <button
                type="button"
                onClick={handleUndo}
                disabled={past.length === 0}
                className="p-1.5 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-luxury-gold/20 text-luxury-accent cursor-pointer"
                title="Undo (Ctrl+Z / Cmd+Z)"
              >
                <Undo2 className="w-4 h-4 text-luxury-gold" />
              </button>
              <div className="w-[1px] h-4 bg-luxury-gold/30 my-auto" />
              <button
                type="button"
                onClick={handleRedo}
                disabled={future.length === 0}
                className="p-1.5 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-luxury-gold/20 text-luxury-accent cursor-pointer"
                title="Redo (Ctrl+Y / Cmd+Shift+Z)"
              >
                <Redo2 className="w-4 h-4 text-luxury-gold" />
              </button>
            </div>

            {/* View Tabs */}
            <div className="flex items-center p-1 rounded-lg bg-white border border-luxury-gold/30 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'editor'
                    ? 'bg-luxury-accent text-white shadow-xs'
                    : 'text-gray-600 hover:text-luxury-accent'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Studio Editor
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'templates'
                    ? 'bg-luxury-accent text-white shadow-xs'
                    : 'text-gray-600 hover:text-luxury-accent'
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" /> Templates
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-luxury-accent text-white shadow-xs'
                    : 'text-gray-600 hover:text-luxury-accent'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> All Pages
              </button>
            </div>

            <button
              type="button"
              onClick={handleGeneratePdf}
              disabled={isExportingPdf}
              className="px-4 py-2 rounded-lg bg-luxury-gold hover:bg-gold-300 text-luxury-accent font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Download</span> A4 PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {activeTab === 'templates' ? (
          /* Canva Templates Library View */
          <CanvaTemplateGallery
            onSelectTemplate={(newConfig) => {
              setConfig(newConfig);
              setActivePageIndex(0);
              setActiveTab('editor');
              toast.success('Loaded magazine template into Studio Editor!');
            }}
            onCreateNewBlank={handleCreateNewBlank}
          />
        ) : activeTab === 'editor' ? (
          /* Canva Studio Editor View with Left Nav Dock & Canvas */
          <div className="space-y-6">
            {/* Canva Top Formatting Toolbar */}
            <CanvaTopToolbar
              selection={selectedTextInfo}
              onUpdateSelection={handleUpdateSelection}
              onAddTextOverlay={handleAddTextOverlay}
              onDeleteOverlay={handleDeleteOverlay}
              onUpdateSlotFilter={handleUpdateSlotFilter}
              onUpdateSlotCaption={handleUpdateSlotCaption}
              onClearSelection={() => setSelectedTextInfo(null)}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={past.length > 0}
              canRedo={future.length > 0}
              onToggleLayers={() => setShowLayersPanel((prev) => !prev)}
              showLayersPanel={showLayersPanel}
              onBringToFront={handleBringSelectedToFront}
              onSendToBack={handleSendSelectedToBack}
              onOpenCanvaTemplates={() => setActiveTab('templates')}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Canva Dock + Canvas */}
              <div className="lg:col-span-8 flex flex-col sm:flex-row gap-4 items-start">
                {/* Canva Left Rail Dock */}
                <div className="w-full sm:w-auto shrink-0 min-h-[600px] rounded-2xl overflow-hidden shadow-lg border border-zinc-800">
                  <CanvaLeftNavDock
                    config={config}
                    activePageIndex={activePageIndex}
                    setActivePageIndex={setActivePageIndex}
                    onOpenTemplates={() => setActiveTab('templates')}
                    onCreateNewBlank={handleCreateNewBlank}
                    onAddTextOverlay={handleAddTextOverlay}
                    onBulkPhotoUpload={handleBulkPhotoUpload}
                    onAddPage={handleAddPage}
                    onDuplicatePage={handleDuplicatePage}
                    onDeletePage={handleDeletePage}
                    onReorderPage={handleReorderPage}
                    onUpdatePageLayout={(pageIdx, layout) =>
                      handleUpdatePage(pageIdx, { layout })
                    }
                  />
                </div>

                {/* Live Canvas Area */}
                <div className="flex-1 w-full space-y-4">
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-luxury-gold/30 text-xs font-mono shadow-xs">
                    <span className="text-luxury-accent font-medium flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                      Interactive A4 Page {activePageIndex + 1} of {config.pages.length}
                    </span>
                    <span className="text-luxury-gold font-bold">
                      {totalPhotosUploaded} Photos Uploaded
                    </span>
                  </div>

                  {/* Exact A4 Aspect Canvas */}
                  {config.pages[activePageIndex] && (
                    <A4MagazineCanvas
                      page={config.pages[activePageIndex]}
                      config={config}
                      pageRef={(el) => {
                        pageRefs.current[activePageIndex] = el;
                      }}
                      onSlotPhotoChanged={(slotId, src) =>
                        handleSlotPhotoChanged(activePageIndex, slotId, src)
                      }
                      onSlotZoomChanged={(slotId, zoom) =>
                        handleSlotZoomChanged(activePageIndex, slotId, zoom)
                      }
                      onUpdateConfig={handleUpdateConfig}
                      onUpdatePage={(updated) => handleUpdatePage(activePageIndex, updated)}
                      selectedTextInfo={selectedTextInfo}
                      onSelectTextInfo={setSelectedTextInfo}
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Layer Sidebar & Editor Control Inspector */}
              <div className="lg:col-span-4 space-y-6">
                {showLayersPanel && config.pages[activePageIndex] && (
                  <LayerSidebar
                    page={config.pages[activePageIndex]}
                    pageIndex={activePageIndex}
                    selectedTextInfo={selectedTextInfo}
                    onSelectTextInfo={setSelectedTextInfo}
                    onUpdatePage={(pageIdx, updated) => handleUpdatePage(pageIdx, updated)}
                    onClose={() => setShowLayersPanel(false)}
                  />
                )}

                <PageEditorPanel
                  config={config}
                  activePageIndex={activePageIndex}
                  setActivePageIndex={setActivePageIndex}
                  onUpdateConfig={handleUpdateConfig}
                  onUpdatePage={handleUpdatePage}
                  onSlotZoomChanged={(slotId, zoom) =>
                    handleSlotZoomChanged(activePageIndex, slotId, zoom)
                  }
                  onAddPage={handleAddPage}
                  onDeletePage={handleDeletePage}
                  onBulkPhotoUpload={handleBulkPhotoUpload}
                  onGeneratePdf={handleGeneratePdf}
                  isExportingPdf={isExportingPdf}
                  onAddTextOverlay={handleAddTextOverlay}
                  onDeleteOverlay={handleDeleteOverlay}
                  selectedTextInfo={selectedTextInfo}
                  onSelectTextInfo={setSelectedTextInfo}
                />
              </div>
            </div>

            {/* Bottom Canva Filmstrip Page Strip */}
            <CanvaPageStrip
              config={config}
              activePageIndex={activePageIndex}
              setActivePageIndex={setActivePageIndex}
              onAddPage={handleAddPage}
              onDuplicatePage={handleDuplicatePage}
              onDeletePage={handleDeletePage}
              onReorderPage={handleReorderPage}
            />
          </div>
        ) : (
          /* Multi-Page Overview Grid View */
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-luxury-gold/20">
              <div>
                <h2 className="text-lg font-display font-bold text-luxury-accent uppercase tracking-wider">
                  Full Magazine Overview ({config.pages.length} A4 Pages)
                </h2>
                <p className="text-xs text-gray-500">
                  Review all A4 magazine pages before downloading your high-res PDF.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCreateNewBlank}
                  className="px-3 py-2 rounded bg-black text-luxury-gold text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-zinc-900 border border-luxury-gold/30"
                >
                  <Plus className="w-3.5 h-3.5" /> Create New Zine
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPage()}
                  className="px-3 py-2 rounded bg-luxury-accent text-white text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-gray-800 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Page
                </button>
                <button
                  type="button"
                  onClick={handleGeneratePdf}
                  disabled={isExportingPdf}
                  className="px-4 py-2 rounded bg-luxury-gold text-luxury-accent text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-gold-300 transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" /> Export A4 PDF
                </button>
              </div>
            </div>

            {/* Grid of A4 Pages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {config.pages.map((page, idx) => (
                <div key={page.id} className="space-y-2 group">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-600 px-1">
                    <span>Page {page.pageNumber}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePageIndex(idx);
                        setActiveTab('editor');
                      }}
                      className="text-luxury-gold hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Page
                    </button>
                  </div>

                  <div className="transition-transform group-hover:scale-[1.02]">
                    <A4MagazineCanvas
                      page={page}
                      config={config}
                      pageRef={(el) => {
                        pageRefs.current[idx] = el;
                      }}
                      onSlotPhotoChanged={(slotId, src) => handleSlotPhotoChanged(idx, slotId, src)}
                      onSlotZoomChanged={(slotId, zoom) => handleSlotZoomChanged(idx, slotId, zoom)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Canva Template Presets & Embed Modal */}
      <CanvaTemplateModal
        isOpen={isCanvaModalOpen}
        onClose={() => setIsCanvaModalOpen(false)}
        onApplyTheme={(newConfig) => {
          setConfig(newConfig);
          toast.success('Applied Canva magazine template theme!');
        }}
      />
    </div>
  );
}
