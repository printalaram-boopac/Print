interface RecoveryPromptProps {
  savedAt: string;
  onRestore: () => void;
  onDiscard: () => void;
}

/** Step 11 §25–28 — offered only when a recovery snapshot is genuinely newer
 * than the last confirmed save (a crash/closed-tab scenario), never on a
 * normal clean open. */
export default function RecoveryPrompt({ savedAt, onRestore, onDiscard }: RecoveryPromptProps) {
  return (
    <div className="fixed inset-0 z-[600] bg-black/60 flex items-center justify-center p-6" data-lenis-prevent>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-[16px] font-semibold text-[#1C2024]">We found unsaved changes</h3>
        <p className="mt-2 text-[13px] text-[#6F7478] leading-relaxed">
          From your last session, {new Date(savedAt).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' })}. Would you like to restore them?
        </p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onDiscard}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={onRestore}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] transition-colors cursor-pointer"
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  );
}
