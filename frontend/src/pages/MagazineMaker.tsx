import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import MagazineEditorInner from './MagazineEditorInner';
import { buildDefaultProject } from '@/lib/magazine-editor-new/templateData';
import { projectStorage } from '@/lib/magazine-editor-new/storage/LocalProjectStorageAdapter';
import { rehydrateProjectAssets } from '@/lib/magazine-editor-new/storage/rehydrate';
import { readRecoverySnapshot, clearRecoverySnapshot } from '@/lib/magazine-editor-new/storage/recovery';
import type { StoredProject } from '@/lib/magazine-editor-new/storage/types';
import type { EditorProject } from '@/lib/magazine-editor-new/types';
import RecoveryPrompt from '@/components/magazine-editor-new/RecoveryPrompt';

type LoadState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; storedProject: StoredProject; document: EditorProject }
  | { kind: 'recovery-check'; storedProject: StoredProject; document: EditorProject; recoveryDocument: EditorProject; recoverySavedAt: string };

function EditorLoadingSkeleton() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#F5F5F3]">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#B8895A] border-t-transparent" />
    </div>
  );
}

function EditorErrorState({ message, onRetry, onBack }: { message: string; onRetry: () => void; onBack: () => void }) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#F5F5F3]">
      <div className="flex flex-col items-center gap-3 text-center max-w-sm px-6">
        <AlertTriangle className="w-7 h-7 text-[#6F7478]" strokeWidth={1.75} />
        <p className="text-[14px] font-medium text-[#1C2024]">{message}</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onRetry} className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-white transition-colors cursor-pointer">Try again</button>
          <button type="button" onClick={onBack} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] transition-colors cursor-pointer">Return to My Designs</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Entry point for a single magazine project (Step 11). Handles: creating a
 * new project and redirecting to its stable `/magazine-maker/new/:projectId`
 * URL, loading + migrating + rehydrating an existing one, offering recovery
 * when a newer local snapshot exists, and a safe error state if the saved
 * document can't be opened. The actual editor (all of Steps 1–10) is
 * `MagazineEditorInner`, which only ever sees a fully-resolved document.
 */
export default function MagazineMaker() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<LoadState>({ kind: 'loading' });
  const [retryToken, setRetryToken] = useState(0);
  const createdUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    createdUrlsRef.current = [];
    setState({ kind: 'loading' });

    async function run() {
      try {
        if (!projectId) {
          const created = await projectStorage.createProject(buildDefaultProject());
          if (!cancelled) navigate(`/magazine-maker/${created.id}`, { replace: true });
          return;
        }

        const stored = await projectStorage.loadProject(projectId);
        if (!stored) {
          if (!cancelled) setState({ kind: 'error', message: "We couldn't find this design." });
          return;
        }

        const { document, createdUrls } = await rehydrateProjectAssets(stored.document);
        createdUrlsRef.current = createdUrls;

        const recovery = await readRecoverySnapshot(projectId);
        const recoveryIsNewer = recovery && new Date(recovery.savedAt).getTime() > new Date(stored.updatedAt).getTime() + 2000;
        if (recoveryIsNewer && recovery) {
          const rehydratedRecovery = await rehydrateProjectAssets(recovery.document);
          createdUrlsRef.current = [...createdUrlsRef.current, ...rehydratedRecovery.createdUrls];
          if (!cancelled) {
            setState({
              kind: 'recovery-check', storedProject: stored, document,
              recoveryDocument: rehydratedRecovery.document, recoverySavedAt: recovery.savedAt,
            });
          }
          return;
        }

        if (!cancelled) setState({ kind: 'ready', storedProject: stored, document });
      } catch (e) {
        if (!cancelled) setState({ kind: 'error', message: e instanceof Error ? e.message : "We couldn't open this design." });
      }
    }
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, retryToken]);

  // Revoke every rehydrated object URL when the project changes or unmounts.
  useEffect(() => () => { createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u)); }, []);

  if (state.kind === 'loading') return <EditorLoadingSkeleton />;

  if (state.kind === 'error') {
    return (
      <EditorErrorState
        message={state.message}
        onRetry={() => setRetryToken((t) => t + 1)}
        onBack={() => navigate('/magazine-maker/my-designs')}
      />
    );
  }

  if (state.kind === 'recovery-check') {
    const { storedProject, document, recoveryDocument, recoverySavedAt } = state;
    return (
      <>
        <EditorLoadingSkeleton />
        <RecoveryPrompt
          savedAt={recoverySavedAt}
          onRestore={async () => {
            const saved = await projectStorage.saveProject(storedProject.id, recoveryDocument);
            await clearRecoverySnapshot(storedProject.id);
            setState({ kind: 'ready', storedProject: saved, document: recoveryDocument });
          }}
          onDiscard={async () => {
            await clearRecoverySnapshot(storedProject.id);
            setState({ kind: 'ready', storedProject, document });
          }}
        />
      </>
    );
  }

  return (
    <MagazineEditorInner
      key={state.storedProject.id}
      storedProject={state.storedProject}
      initialDocument={state.document}
      onProjectRenamed={(name) => { projectStorage.renameProject(state.storedProject.id, name).catch(() => {}); }}
    />
  );
}
