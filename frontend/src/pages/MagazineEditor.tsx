import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import EditorWorkspace from '@/features/magazine/components/editor/EditorWorkspace';
import { useMagazineFonts } from '@/features/magazine/fonts';
import { loadMagazine } from '@/features/magazine/services/saveService';
import {
  createBlankDocument,
  createDocumentFromTemplate,
  migrateDocument,
} from '@/features/magazine/services/templateService';
import { loadTemplate } from '@/features/magazine/templates';
import type { MagazineDocument } from '@/features/magazine/types';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; document: MagazineDocument; isNew: boolean }
  | { status: 'missing' };

/**
 * Resolves what the editor should open — a fresh copy of a template, a blank
 * magazine, or a previously saved design — and only then mounts the workspace.
 */
export default function MagazineEditor() {
  const { designId = 'new' } = useParams();
  const [searchParams] = useSearchParams();
  const templateSlug = searchParams.get('template');
  const { firebaseUser, dbUser, loading: authLoading } = useAuth();
  useMagazineFonts();

  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    const run = async () => {
      if (designId === 'new') {
        if (templateSlug) {
          const template = await loadTemplate(templateSlug);
          if (cancelled) return;
          if (template) {
            setState({ status: 'ready', document: createDocumentFromTemplate(template), isNew: true });
            return;
          }
        }
        setState({ status: 'ready', document: createBlankDocument(), isNew: true });
        return;
      }

      const saved = await loadMagazine(designId, {
        userId: dbUser?.id || firebaseUser?.uid || null,
      });
      if (cancelled) return;
      if (saved) setState({ status: 'ready', document: migrateDocument(saved.document), isNew: false });
      else setState({ status: 'missing' });
    };

    // Wait for auth to settle so a signed-in user's designs are looked up in
    // the right place rather than under the guest scope.
    if (!authLoading) void run();

    return () => {
      cancelled = true;
    };
  }, [authLoading, dbUser?.id, designId, firebaseUser?.uid, templateSlug]);

  if (state.status === 'loading') {
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center gap-3 bg-luxury-black">
        <Loader2 className="h-6 w-6 animate-spin text-luxury-gold" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
          Opening the editor
        </p>
      </div>
    );
  }

  if (state.status === 'missing') {
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center gap-4 bg-luxury-black px-6 text-center">
        <AlertTriangle className="h-10 w-10 text-luxury-gold" />
        <h1 className="font-display text-2xl font-bold text-luxury-accent">This magazine could not be found</h1>
        <p className="max-w-sm text-sm text-gray-400">
          It may have been deleted, or saved on a different device or account.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/my-magazines" className="btn-outline btn-magnetic">
            My magazines
          </Link>
          <Link to="/magazine" className="btn-primary btn-magnetic">
            Browse templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EditorWorkspace
      key={state.document.id}
      initialDocument={state.document}
      isNew={state.isNew}
    />
  );
}
