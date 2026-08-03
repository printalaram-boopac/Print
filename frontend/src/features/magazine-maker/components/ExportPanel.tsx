import { FileDown, Loader2, MessageCircle } from 'lucide-react';

interface ExportPanelProps {
  uploadedCount: number;
  isDownloading: boolean;
  isSendingWhatsApp: boolean;
  handleDownloadPdf: () => void;
  handleSendWhatsApp: () => void;
}

export function ExportPanel({ uploadedCount, isDownloading, isSendingWhatsApp, handleDownloadPdf, handleSendWhatsApp }: ExportPanelProps) {
  return (
    <div className="glass-card-gold rounded-xl p-6 space-y-6 lg:sticky lg:top-28">
      <div className="space-y-3">
        <p className="text-xs text-gray-500 flex items-start gap-1.5">
          <FileDown className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" strokeWidth={2} />
          Generates a print-ready PDF of your {uploadedCount || ''} page{uploadedCount === 1 ? '' : 's'} — download it, or send it straight to WhatsApp for printing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading || isSendingWhatsApp}
            className="w-full btn-glass btn-glass-gold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> Generating PDF...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" strokeWidth={2} /> Download PDF
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            disabled={isDownloading || isSendingWhatsApp}
            className="w-full btn-primary gold-glow cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSendingWhatsApp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> Preparing PDF...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" strokeWidth={2} /> Send PDF via WhatsApp for Printing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
