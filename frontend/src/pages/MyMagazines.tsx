import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  BookOpen,
  Copy,
  Download,
  Eye,
  FolderOpen,
  Layers,
  Loader2,
  PencilLine,
  Trash2,
  X,
} from 'lucide-react';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import { useAuth } from '@/context/AuthContext';
import MagazineViewer from '@/features/magazine/components/preview/MagazineViewer';
import { AutoFitPage } from '@/features/magazine/components/shared/AutoFitPage';
import { useMagazineFonts } from '@/features/magazine/fonts';
import { exportMagazinePdf } from '@/features/magazine/services/exportService';
import {
  deleteMagazine,
  duplicateMagazine,
  listUserMagazines,
  loadMagazine,
  renameMagazine,
} from '@/features/magazine/services/saveService';
import { migrateDocument } from '@/features/magazine/services/templateService';
import type { MagazineDocument, SavedMagazineMeta } from '@/features/magazine/types';

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Saved magazines: open, preview, duplicate, rename, delete and export. */
export default function MyMagazines() {
  const navigate = useNavigate();
  const { firebaseUser, dbUser, loading: authLoading } = useAuth();
  useMagazineFonts();

  const [items, setItems] = useState<SavedMagazineMeta[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [covers, setCovers] = useState<Record<string, MagazineDocument>>({});
  const [preview, setPreview] = useState<{ document: MagazineDocument; index: number } | null>(null);

  const context = useMemo(
    () => ({ userId: dbUser?.id || firebaseUser?.uid || null }),
    [dbUser?.id, firebaseUser?.uid],
  );

  const refresh = useCallback(async () => {
    const list = await listUserMagazines(context);
    setItems(list);

    // Covers come from the stored documents themselves — no separate thumbnail
    // files to generate, upload or keep in sync.
    const loaded: Record<string, MagazineDocument> = {};
    await Promise.all(
      list.map(async (item) => {
        const saved = await loadMagazine(item.id, context).catch(() => null);
        if (saved) loaded[item.id] = migrateDocument(saved.document);
      }),
    );
    setCovers(loaded);
  }, [context]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  const handleDelete = async (item: SavedMagazineMeta) => {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setBusyId(item.id);
    try {
      await deleteMagazine(item.id, context);
      toast.success('Magazine deleted.');
      await refresh();
    } catch {
      toast.error('Could not delete that magazine.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDuplicate = async (item: SavedMagazineMeta) => {
    setBusyId(item.id);
    try {
      const outcome = await duplicateMagazine(item.id, context);
      if (!outcome) throw new Error('missing');
      toast.success('Copy created.');
      await refresh();
    } catch {
      toast.error('Could not duplicate that magazine.');
    } finally {
      setBusyId(null);
    }
  };

  const commitRename = async (item: SavedMagazineMeta) => {
    const title = renameValue.trim();
    setRenamingId(null);
    if (!title || title === item.title) return;
    setBusyId(item.id);
    try {
      await renameMagazine(item.id, title, context);
      await refresh();
    } catch {
      toast.error('Could not rename that magazine.');
    } finally {
      setBusyId(null);
    }
  };

  const handleExport = async (item: SavedMagazineMeta) => {
    const document_ = covers[item.id];
    if (!document_) {
      toast.error('That magazine could not be opened for export.');
      return;
    }
    setBusyId(item.id);
    try {
      await exportMagazinePdf(document_);
      toast.success('PDF ready.');
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen px-4 pb-20 pt-28">
      <Seo
        title={`My Magazines — ${BRAND_NAME}`}
        description="Open, preview, duplicate and export the magazines you have created."
        path="/my-magazines"
      />

      <div className="mx-auto max-w-7xl space-y-10">
        <motion.div
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-3">
            <p className="section-badge-plain">
              <FolderOpen className="h-3.5 w-3.5" /> Magazine Studio
            </p>
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              My <span className="text-gold-gradient">Magazines</span>
            </h1>
            <p className="max-w-xl text-sm text-gray-400">
              {context.userId
                ? 'Your saved designs. Everything stays editable — reopen any magazine and pick up where you left off.'
                : 'Your saved designs are kept on this device. Sign in to keep them with your account.'}
            </p>
          </div>

          <Link to="/magazine" className="btn-primary btn-magnetic self-start">
            <BookOpen className="h-4 w-4" /> Browse templates
          </Link>
        </motion.div>

        {items === null && (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs uppercase tracking-widest">Loading your magazines</span>
          </div>
        )}

        {items?.length === 0 && (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-gold-200/60 bg-white p-10 text-center shadow-sm">
            <BookOpen className="h-9 w-9 text-luxury-gold" />
            <div className="space-y-1">
              <h2 className="font-display text-lg font-semibold text-luxury-accent">No magazines yet</h2>
              <p className="text-sm text-gray-400">
                Pick a template and your design will appear here automatically as you work.
              </p>
            </div>
            <Link to="/magazine" className="btn-outline btn-magnetic">
              Start from a template
            </Link>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
            {items.map((item, index) => {
              const document_ = covers[item.id];
              const busy = busyId === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index, 8) * 0.04 }}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-gold-200/40 bg-white shadow-sm transition-all duration-300 hover:border-gold-300 hover:shadow-xl"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/magazine/editor/${item.id}`)}
                    className="relative block overflow-hidden bg-luxury-gray"
                    style={{ aspectRatio: '794 / 1123' }}
                    aria-label={`Open ${item.title}`}
                  >
                    {document_ ? (
                      <AutoFitPage
                        page={document_.pages[0]}
                        docWidth={document_.width}
                        docHeight={document_.height}
                      />
                    ) : (
                      <span className="absolute inset-0 animate-pulse bg-luxury-gray" />
                    )}

                    {busy && (
                      <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <Loader2 className="h-5 w-5 animate-spin text-luxury-gold" />
                      </span>
                    )}
                  </button>

                  <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                    {renamingId === item.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => void commitRename(item)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') void commitRename(item);
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        className="rounded-lg border border-luxury-gold bg-white px-2 py-1 text-sm font-semibold text-luxury-accent outline-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setRenamingId(item.id);
                          setRenameValue(item.title);
                        }}
                        title="Rename"
                        className="text-left font-display text-sm font-semibold leading-snug text-luxury-accent transition-colors hover:text-luxury-gold sm:text-base"
                      >
                        {item.title}
                      </button>
                    )}

                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {document_?.pages.length ?? item.pageCount} pages
                      </span>
                      <span>·</span>
                      <span>{formatDate(item.updatedAt)}</span>
                    </p>

                    <div className="mt-auto grid grid-cols-2 gap-1.5 pt-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/magazine/editor/${item.id}`)}
                        className="flex items-center justify-center gap-1 rounded-lg bg-luxury-accent px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-luxury-gold"
                      >
                        <PencilLine className="h-3 w-3" /> Edit
                      </button>
                      <button
                        type="button"
                        disabled={!document_}
                        onClick={() => document_ && setPreview({ document: document_, index: 0 })}
                        className="flex items-center justify-center gap-1 rounded-lg border border-gold-200/60 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-luxury-accent transition-colors hover:border-luxury-gold disabled:opacity-40"
                      >
                        <Eye className="h-3 w-3" /> View
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleDuplicate(item)}
                        className="flex items-center justify-center gap-1 rounded-lg border border-gold-200/60 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-luxury-accent transition-colors hover:border-luxury-gold disabled:opacity-40"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                      <button
                        type="button"
                        disabled={busy || !document_}
                        onClick={() => void handleExport(item)}
                        className="flex items-center justify-center gap-1 rounded-lg border border-gold-200/60 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-luxury-accent transition-colors hover:border-luxury-gold disabled:opacity-40"
                      >
                        <Download className="h-3 w-3" /> PDF
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleDelete(item)}
                        className="col-span-2 flex items-center justify-center gap-1 rounded-lg border border-red-200 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {preview && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-luxury-black/98 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-gold-200/40 px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold">Preview</p>
              <h2 className="font-display text-base font-semibold text-luxury-accent">
                {preview.document.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setPreview(null)}
              aria-label="Close preview"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-200/60 bg-white text-luxury-accent transition-colors hover:border-luxury-gold"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
            <div className="mx-auto max-w-4xl">
              <MagazineViewer
                pages={preview.document.pages}
                docWidth={preview.document.width}
                docHeight={preview.document.height}
                index={preview.index}
                onIndexChange={(index) => setPreview({ ...preview, index })}
                stageClassName="h-[62vh] min-h-[300px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
