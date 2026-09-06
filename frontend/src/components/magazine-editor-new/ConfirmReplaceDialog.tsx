interface ConfirmReplaceDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmReplaceDialog({ onCancel, onConfirm }: ConfirmReplaceDialogProps) {
  return (
    <div className="fixed inset-0 z-[400] bg-black/60 flex items-center justify-center p-6" data-lenis-prevent onClick={onCancel}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[16px] font-semibold text-[#1C2024]">Replace current design?</h3>
        <p className="mt-2 text-[13px] text-[#6F7478] leading-relaxed">
          Applying this template will replace your current pages.
        </p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] transition-colors cursor-pointer"
          >
            Replace design
          </button>
        </div>
      </div>
    </div>
  );
}
