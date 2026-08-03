import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import { logUserEvent } from '@/lib/analytics';
import { generateMagazineText } from '@/lib/huggingface';
import {
  PAGE_COUNT, PATH, FONTS, GRADIENT_PRESETS, DEFAULT_TEXT_SIZE_PX,
} from '@/features/magazine-maker/constants';
import type { ColorMode, PhotoItem, SizeKey, StickerItem, ZinePage } from '@/features/magazine-maker/types';
import { STORY_TEMPLATES, DEFAULT_CHAPTER_COPY, type ChapterCopy } from '@/features/magazine-maker/storyTemplates';
import { EMPTY_PAGES, applySlots, makeId, pageHasContent, readAsDataUrl } from '@/features/magazine-maker/utils';
import { useDragAndResize } from '@/features/magazine-maker/useDragAndResize';
import { usePasteAndDrop } from '@/features/magazine-maker/usePasteAndDrop';
import { generateMagazinePdf, buildPdfFileName, downloadBlob } from '@/features/magazine-maker/pdfExport';
import { MagazineSetupPanel } from '@/features/magazine-maker/components/MagazineSetupPanel';
import { AddTextPanel } from '@/features/magazine-maker/components/AddTextPanel';
import { StoryPageTile } from '@/features/magazine-maker/components/StoryPageTile';
import { ExportPanel } from '@/features/magazine-maker/components/ExportPanel';
import { FoldInstructions } from '@/features/magazine-maker/components/FoldInstructions';

export default function PhotoZineMaker() {
  const [pages, setPages] = useState<ZinePage[]>(EMPTY_PAGES);
  const [font, setFont] = useState(FONTS[0].label);
  const [size, setSize] = useState<SizeKey>('M');
  const [colorMode, setColorMode] = useState<ColorMode>('solid');
  const [textColor, setTextColor] = useState('#ffffff');
  const [gradientFrom, setGradientFrom] = useState(GRADIENT_PRESETS[0].from);
  const [gradientTo, setGradientTo] = useState(GRADIENT_PRESETS[0].to);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [relationshipName, setRelationshipName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chapterCopy, setChapterCopy] = useState<ChapterCopy[]>(DEFAULT_CHAPTER_COPY);
  const [stickerTargetPage, setStickerTargetPage] = useState(0);
  const [newText, setNewText] = useState('');
  const [pasteTargetPage, setPasteTargetPage] = useState(0);
  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const pageCaptureRefs = useRef<Array<HTMLDivElement | null>>([]);

  const { pageTileRefs, beginDrag, handleDragMove, handleDragEnd } = useDragAndResize(pages, setPages);

  const uploadedCount = pages.filter(pageHasContent).length;

  const handleFileSelect = async (index: number, fileList: FileList | File[] | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      toast.warn('Please choose image files.');
      return;
    }

    const existing = pages[index]?.photos || [];
    const capacity = STORY_TEMPLATES[index].slots.length;
    const capped = files.slice(0, Math.max(0, capacity - existing.length));
    if (capped.length === 0) {
      toast.warn(`This page only has ${capacity} photo spot${capacity === 1 ? '' : 's'} — it's already full.`);
      return;
    }
    if (capped.length < files.length) {
      toast.warn(`This page only has ${capacity} photo spot${capacity === 1 ? '' : 's'} — added the first ${capped.length}.`);
    }

    const srcs = await Promise.all(capped.map(readAsDataUrl));
    const newPhotos: PhotoItem[] = srcs.map((src) => ({ id: makeId(), src, xPct: 50, yPct: 50, widthPct: 50, heightPct: 40 }));
    setPages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], photos: applySlots([...existing, ...newPhotos], STORY_TEMPLATES[index].slots) };
      return next;
    });
  };

  const { dragOverPage, setDragOverPage, handlePageDragOver, handlePageDrop } = usePasteAndDrop(pasteTargetPage, handleFileSelect);

  const removePhoto = (pageIndex: number, photoId: string) => {
    setPages((prev) => {
      const next = [...prev];
      const remaining = next[pageIndex].photos.filter((p) => p.id !== photoId);
      next[pageIndex] = { ...next[pageIndex], photos: applySlots(remaining, STORY_TEMPLATES[pageIndex].slots) };
      return next;
    });
  };

  const removeSticker = (pageIndex: number, stickerId: string) => {
    setPages((prev) => {
      const next = [...prev];
      next[pageIndex] = { ...next[pageIndex], stickers: next[pageIndex].stickers.filter((s) => s.id !== stickerId) };
      return next;
    });
  };

  const addTextSticker = () => {
    if (!newText.trim()) {
      toast.warn('Type some text first.');
      return;
    }
    const sticker: StickerItem = {
      id: makeId(),
      content: newText.trim(),
      xPct: 50,
      yPct: 50,
      fontSizePx: DEFAULT_TEXT_SIZE_PX[size],
      font,
      colorMode,
      color: textColor,
      gradientFrom,
      gradientTo,
    };
    setPages((prev) => {
      const next = [...prev];
      next[stickerTargetPage] = { ...next[stickerTargetPage], stickers: [...next[stickerTargetPage].stickers, sticker] };
      return next;
    });
    setNewText('');
    logUserEvent('ADD_TEXT_STICKER', { page: stickerTargetPage + 1 });
  };

  // Optional personalization pass: the magazine already ships with good
  // default copy (zero AI calls needed), this just swaps in AI-written quotes
  // themed around the chosen topic, keeping the fixed titles/layout as-is.
  const handleGenerateMagazineContent = async () => {
    if (!selectedTopic) {
      toast.info('Pick a theme above to personalize the quotes with AI — your magazine already looks great with its built-in copy otherwise.');
      return;
    }

    setIsGenerating(true);
    logUserEvent('CLICK_GENERATE_MAGAZINE_CONTENT', { topic: selectedTopic, hasName: !!relationshipName.trim() });
    try {
      const content = await generateMagazineText(selectedTopic, DEFAULT_CHAPTER_COPY.length);
      setChapterCopy(DEFAULT_CHAPTER_COPY.map((def, i) => ({ ...def, quote: content[i]?.quote || def.quote })));
      toast.success('Your magazine quotes have been personalized!');
    } catch (err) {
      console.error('Failed to personalize magazine content:', err);
      toast.error('Could not personalize with AI right now — your magazine still looks great with its default copy.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (uploadedCount === 0) {
      toast.warn('Add at least one photo before downloading.');
      return;
    }

    logUserEvent('CLICK_MINI_MAGAZINE_DOWNLOAD', { uploadedCount });
    setIsDownloading(true);
    try {
      const pdfBytes = await generateMagazinePdf(pageCaptureRefs.current);
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      downloadBlob(blob, buildPdfFileName());
      toast.success('Your mini magazine PDF has been downloaded!');
    } catch (err) {
      console.error('Failed to generate mini magazine PDF:', err);
      toast.error('Something went wrong generating your PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Shares the actual PDF file straight into WhatsApp via the native share sheet
  // (supported on most mobile browsers). Desktop/unsupported browsers fall back
  // to downloading the PDF and opening a WhatsApp chat with instructions to attach it.
  const handleSendWhatsApp = async () => {
    if (uploadedCount === 0) {
      toast.warn('Add at least one photo before sending.');
      return;
    }

    logUserEvent('CLICK_MINI_MAGAZINE_WHATSAPP_SEND', { uploadedCount });
    setIsSendingWhatsApp(true);
    try {
      const pdfBytes = await generateMagazinePdf(pageCaptureRefs.current);
      const fileName = buildPdfFileName();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const file = new File([blob], fileName, { type: 'application/pdf' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mini Magazine',
          text: `My Mini Magazine (${PAGE_COUNT} pages) for printing — Printalarm`,
        });
        toast.success('Choose WhatsApp in the share menu to send your PDF for printing!');
      } else {
        downloadBlob(blob, fileName);

        const msg = [
          `*New Mini Magazine Order - Printalarm*`,
          ``,
          `*Pages:* ${PAGE_COUNT}`,
          ``,
          `I've downloaded my mini magazine PDF (${fileName}) — attaching it to this chat now.`,
          ``,
          `Please confirm pricing and print timeline.`,
          `Thank you!`,
        ].join('\n');

        window.open(`https://wa.me/919904544702?text=${encodeURIComponent(msg)}`, '_blank');
        toast.success('PDF downloaded — attach it in the WhatsApp chat that just opened.');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // user closed the native share sheet
      console.error('Failed to share mini magazine PDF:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Mini Magazine',
    description: 'A personalized printable mini photo magazine, made from up to 8 of your own photos.',
    brand: { '@type': 'Brand', name: BRAND_NAME },
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <Seo
        title={`Mini Magazine Maker | Turn Your Photos into a Photo Zine — ${BRAND_NAME}`}
        description="Create your own mini magazine — a ready-designed photobook with your photos dropped straight into place, ready to print or send on WhatsApp."
        path={PATH}
        jsonLd={[jsonLd]}
      />

      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-xs text-gray-400 space-x-1.5">
          <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-luxury-accent font-medium">Mini Magazine Maker</span>
        </div>

        <motion.div
          className="text-center space-y-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs md:text-sm tracking-[0.2em] text-luxury-gold font-semibold uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2} /> New — Mini Magazine
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-luxury-accent">
            Create Your <span className="text-gold-gradient">Mini Magazine</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            A ready-designed {PAGE_COUNT}-page photobook — titles, quotes and decorations already done. You just add your photos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
          {/* Photo pages grid */}
          <div className="glass-card-gold rounded-xl p-5 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display font-semibold text-luxury-accent">Pages ({uploadedCount}/{PAGE_COUNT} started)</h2>
            </div>

            <MagazineSetupPanel
              relationshipName={relationshipName}
              setRelationshipName={setRelationshipName}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
              isGenerating={isGenerating}
              handleGenerateMagazineContent={handleGenerateMagazineContent}
            />

            <AddTextPanel
              pages={pages}
              stickerTargetPage={stickerTargetPage}
              setStickerTargetPage={setStickerTargetPage}
              newText={newText}
              setNewText={setNewText}
              addTextSticker={addTextSticker}
              font={font}
              setFont={setFont}
              size={size}
              setSize={setSize}
              colorMode={colorMode}
              setColorMode={setColorMode}
              textColor={textColor}
              setTextColor={setTextColor}
              gradientFrom={gradientFrom}
              setGradientFrom={setGradientFrom}
              gradientTo={gradientTo}
              setGradientTo={setGradientTo}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pages.map((page, i) => {
                const template = STORY_TEMPLATES[i];
                const chapterIndex = i - 2; // pages 0-1 are covers, 2-5 are the four chapters
                return (
                  <StoryPageTile
                    key={i}
                    template={template}
                    page={page}
                    index={i}
                    relationshipName={relationshipName}
                    chapterCopy={chapterIndex >= 0 ? chapterCopy[chapterIndex] : undefined}
                    captureRef={(el) => {
                      pageTileRefs.current[i] = el;
                      pageCaptureRefs.current[i] = el;
                    }}
                    fileInputRef={(el) => { fileInputRefs.current[i] = el; }}
                    setPasteTargetPage={setPasteTargetPage}
                    handleFileSelect={handleFileSelect}
                    handlePageDragOver={handlePageDragOver}
                    setDragOverPage={setDragOverPage}
                    handlePageDrop={handlePageDrop}
                    dragOverPage={dragOverPage}
                    beginDrag={beginDrag}
                    handleDragMove={handleDragMove}
                    handleDragEnd={handleDragEnd}
                    removePhoto={removePhoto}
                    removeSticker={removeSticker}
                  />
                );
              })}
            </div>
          </div>

          {/* Details + customization form */}
          <ExportPanel
            uploadedCount={uploadedCount}
            isDownloading={isDownloading}
            isSendingWhatsApp={isSendingWhatsApp}
            handleDownloadPdf={handleDownloadPdf}
            handleSendWhatsApp={handleSendWhatsApp}
          />
        </div>

        <FoldInstructions />
      </div>
    </div>
  );
}
