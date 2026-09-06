import { useRef, useState } from 'react';
import { UploadCloud, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { processUploadFile } from '@/lib/magazine-editor-new/uploadUtils';
import type { UploadedPhoto } from '@/lib/magazine-editor-new/types';

interface UploadsPanelProps {
  uploads: UploadedPhoto[];
  onAddUploads: (photos: UploadedPhoto[]) => void;
  onRemoveUpload: (id: string) => void;
  onUsePhoto: (url: string, width: number, height: number, assetId?: string) => void;
}

export default function UploadsPanel({ uploads, onAddUploads, onRemoveUpload, onUsePhoto }: UploadsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessing(true);
    const files = Array.from(fileList);
    const results = await Promise.all(files.map(processUploadFile));
    const newPhotos = results.map((r) => r.photo).filter((p): p is UploadedPhoto => !!p);
    const newErrors = results.map((r) => r.error).filter((e): e is string => !!e);
    if (newPhotos.length) onAddUploads(newPhotos);
    setErrors(newErrors);
    setIsProcessing(false);
  };

  return (
    <aside className="w-full h-full flex-1 bg-white flex flex-col min-h-0 overflow-x-hidden">
      <div className="p-4 space-y-3 border-b border-[#E7E7E4]">
        <h2 className="text-[15px] font-semibold text-[#1C2024]">Uploads</h2>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] transition-colors cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" strokeWidth={1.75} /> Upload files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
        />

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); handleFiles(e.dataTransfer.files); }}
          className={`rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 py-6 transition-colors ${
            isDraggingOver ? 'border-[#B8895A] bg-[#F5F5F3]' : 'border-[#E7E7E4]'
          }`}
        >
          <UploadCloud className={`w-5 h-5 ${isDraggingOver ? 'text-[#B8895A]' : 'text-[#6F7478]'}`} strokeWidth={1.5} />
          <span className="text-[12px] font-medium text-[#1C2024]">Drop your photos here</span>
          <span className="text-[11px] text-[#6F7478]">JPG, PNG or WEBP</span>
        </div>

        {isProcessing && <p className="text-[11px] text-[#6F7478]">Processing…</p>}
        {errors.map((err, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#B8895A]">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" strokeWidth={1.75} /> {err}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        {uploads.length === 0 ? (
          <p className="text-[12px] text-[#6F7478] text-center py-10">No uploads yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {uploads.map((u) => (
              <div key={u.id} className="group relative rounded-lg overflow-hidden border border-[#E7E7E4]" style={{ aspectRatio: '3 / 4' }}>
                <img src={u.objectUrl} alt={u.name} className="w-full h-full object-cover" />
                {u.warning && (
                  <span title={u.warning} className="absolute top-1.5 left-1.5 px-1 py-0.5 rounded bg-white/90">
                    <AlertTriangle className="w-3 h-3 text-[#B8895A]" strokeWidth={2} />
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => onUsePhoto(u.objectUrl, u.width, u.height, u.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-[#1C2024] text-[11px] font-semibold hover:bg-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" strokeWidth={2} /> Add
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveUpload(u.id)}
                    aria-label="Remove upload"
                    className="p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
