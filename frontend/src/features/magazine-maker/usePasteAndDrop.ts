import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Lets photos get into the magazine from anywhere — Instagram, Chrome, any
// app — without needing an API integration: copy an image elsewhere (e.g.
// right-click → Copy Image on a photo in the browser) and paste it (Ctrl+V)
// onto whichever page was last clicked. Also wires per-tile drag-and-drop.
export function usePasteAndDrop(pasteTargetPage: number, handleFileSelect: (index: number, fileList: FileList | File[] | null) => Promise<void>) {
  const [dragOverPage, setDragOverPage] = useState<number | null>(null);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageFiles = Array.from(items)
        .filter((item) => item.type.startsWith('image/'))
        .map((item) => item.getAsFile())
        .filter((f): f is File => !!f);
      if (imageFiles.length === 0) return;
      e.preventDefault();
      handleFileSelect(pasteTargetPage, imageFiles);
      toast.success(`Pasted ${imageFiles.length > 1 ? `${imageFiles.length} photos` : 'photo'} onto Page ${pasteTargetPage + 1}!`);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [pasteTargetPage, handleFileSelect]);

  const handlePageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverPage(index);
  };

  const handlePageDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverPage(null);
    handleFileSelect(index, e.dataTransfer.files);
  };

  return { dragOverPage, setDragOverPage, handlePageDragOver, handlePageDrop };
}
