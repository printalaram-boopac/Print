import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload, X, MessageCircle, Sparkles, Loader2, FileDown, Wand2,
  Heart, Cake, Users, Gem, Plane, Award, Baby, Gift, HeartHandshake, PartyPopper, PawPrint, GraduationCap,
  Leaf, Images, ScrollText, Square, Flower2, Moon, TreeDeciduous, BookOpen, Type,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import { logUserEvent } from '@/lib/analytics';
import { generateAiCoverImage } from '@/lib/huggingface';

const PAGE_COUNT = 8;
const PATH = '/photo-zine-maker';

// Example prompts by topic, matched to the reference photobook styles
// (romantic couple album, birthday scrapbook, family memory book, etc.)
// Icons (not emoji) so every option renders consistently on-brand in gold, regardless of OS/browser.
const TOPIC_PROMPTS: { icon: LucideIcon; label: string; prompt: string }[] = [
  { icon: Heart, label: 'Romance', prompt: 'romantic couple photo album cover, soft pink and gold florals, elegant script typography, dreamy bokeh lights, "My Forever" style magazine cover' },
  { icon: Cake, label: 'Birthday', prompt: 'birthday celebration scrapbook background, colorful balloons and confetti, pastel pink and blue, festive bunting flags, party decoration' },
  { icon: Users, label: 'Family', prompt: 'soft pastel family memory book background, floral corner borders, gentle watercolor texture, warm and cozy, heart doodles' },
  { icon: Gem, label: 'Wedding', prompt: 'royal wedding mandap gold background, ornate floral patterns, regal maroon and gold, elegant Indian wedding motif' },
  { icon: Plane, label: 'Travel', prompt: 'travel memories photo album background, vintage postcard style, world map texture, warm sunset colors, passport stamp motifs' },
  { icon: Award, label: 'Milestone', prompt: 'achievement and milestone celebration background, gold confetti, elegant certificate-style border, celebratory ribbons' },
  { icon: Baby, label: 'Baby', prompt: 'soft baby shower scrapbook background, pastel blue and pink clouds, cute star and moon doodles, gentle watercolor texture, tender newborn keepsake style' },
  { icon: Gift, label: 'Anniversary', prompt: 'elegant anniversary celebration background, deep burgundy and gold, ornate rose gold frame, romantic candlelight glow, timeless love theme' },
  { icon: HeartHandshake, label: 'Friendship', prompt: 'warm friendship memory book background, sunny yellow and coral tones, hand-drawn doodles of hearts and stars, playful cheerful scrapbook style' },
  { icon: PartyPopper, label: 'Festival', prompt: 'festive holiday celebration background, warm string lights and fairy lights, deep green and gold ornaments, cozy winter festival theme' },
  { icon: PawPrint, label: 'Pet', prompt: 'cute pet memory book background, playful paw print motifs, soft pastel tones, hand-drawn bone and paw doodles, cheerful and warm' },
  { icon: GraduationCap, label: 'Graduation', prompt: 'graduation celebration background, navy and gold color scheme, elegant certificate border, confetti and academic cap motifs, proud achievement theme' },
];

// Frame styles matched to the premium hardcover-book reference pages
// (gold foil florals, chapter-page botanical sprigs, scrapbook accents, etc.)
const FRAME_PROMPTS: { icon: LucideIcon; label: string; prompt: string }[] = [
  { icon: Sparkles, label: 'Gold Foil Luxury', prompt: 'ivory background, delicate gold foil floral corner accents, thin gold divider lines, soft watercolor wash, premium editorial book cover backdrop, elegant minimalist luxury aesthetic' },
  { icon: Leaf, label: 'Botanical Chapter', prompt: 'cream background, hand-drawn gold botanical line-art sprigs and leaves in corner, thin elegant gold border, faint watercolor stain texture, premium chapter-page backdrop' },
  { icon: Images, label: 'Polaroid Scrapbook', prompt: 'soft cream background with delicate paper grain texture, subtle golden dot accents, warm bokeh lights, vintage scrapbook aesthetic, gentle pastel tones' },
  { icon: ScrollText, label: 'Elegant Letter Page', prompt: 'plain ivory paper texture background, subtle golden vertical divider line, delicate corner floral sprig, warm minimalist premium aesthetic, soft natural lighting' },
  { icon: Square, label: 'Modern Minimal', prompt: 'clean white background, thin black hairline border, minimal geometric corner accent, plenty of negative space, modern editorial magazine layout, understated elegant aesthetic' },
  { icon: Flower2, label: 'Watercolor Floral', prompt: 'soft watercolor wash background in blush pink and sage green, delicate painted floral clusters in corners, dreamy hand-painted texture, romantic feminine aesthetic' },
  { icon: BookOpen, label: 'Vintage Parchment', prompt: 'aged parchment paper texture background, sepia tones, ornate vintage scroll border, antique typewriter-era aesthetic, nostalgic timeworn charm' },
  { icon: Gem, label: 'Art Deco Glam', prompt: 'deep navy background, bold gold art-deco geometric border, symmetrical fan and line patterns, glamorous 1920s-inspired luxury aesthetic' },
  { icon: Moon, label: 'Dreamy Pastel', prompt: 'soft gradient pastel background in lavender and peach, dreamy cloud-like texture, delicate star and sparkle accents, whimsical gentle aesthetic' },
  { icon: TreeDeciduous, label: 'Rustic Kraft', prompt: 'kraft brown paper texture background, hand-drawn twine and leaf doodles, rustic handmade scrapbook aesthetic, warm earthy tones' },
];

const FONTS = [
  { label: 'Archivo Black', family: "'Archivo Black', sans-serif" },
  { label: 'Barlow Condensed', family: "'Barlow Condensed', sans-serif" },
  { label: 'Bitter', family: "'Bitter', serif" },
  { label: 'Caveat', family: "'Caveat', cursive" },
  { label: 'Courier Prime', family: "'Courier Prime', monospace" },
  { label: 'Cutive', family: "'Cutive', serif" },
  { label: 'Jost', family: "'Jost', sans-serif" },
  { label: 'Oswald', family: "'Oswald', sans-serif" },
  { label: 'Playfair Display', family: "'Playfair Display', serif" },
  { label: 'Special Elite', family: "'Special Elite', monospace" },
];

const SIZES = [{ key: 'S' }, { key: 'M' }, { key: 'L' }] as const;

type SizeKey = (typeof SIZES)[number]['key'];

// Quick-preset starting font sizes (in canvas px, against the 800px-wide
// reference canvas) — the resize handle then adjusts fontSizePx continuously
// from there, so these are just a starting point, not a hard tier.
const DEFAULT_TEXT_SIZE_PX: Record<SizeKey, number> = { S: 20, M: 28, L: 40 };

// Instagram-Story-style draggable, resizable text stickers and photos —
// freely positioned per page via xPct/yPct (percentage of the page tile, so
// it works at any preview size and maps directly onto the fixed-size canvas
// used for export).
type ColorMode = 'solid' | 'gradient';
interface StickerItem {
  id: string;
  content: string;
  xPct: number; // center, 0-100
  yPct: number; // center, 0-100
  fontSizePx: number; // continuous — against the 800px-wide reference canvas
  font: string;
  colorMode: ColorMode;
  color: string; // hex — used when colorMode === 'solid'
  gradientFrom: string; // hex — used when colorMode === 'gradient'
  gradientTo: string; // hex — used when colorMode === 'gradient'
}

interface PhotoItem {
  id: string;
  src: string; // data URL
  xPct: number; // center, 0-100
  yPct: number; // center, 0-100
  widthPct: number; // of page width, 0-100
  heightPct: number; // of page height, 0-100
}

const GRADIENT_PRESETS = [
  { label: 'Gold Shine', from: '#FFD700', to: '#B8860B' },
  { label: 'Sunset', from: '#FF512F', to: '#F09819' },
  { label: 'Ocean', from: '#2193B0', to: '#6DD5ED' },
  { label: 'Berry', from: '#DA22FF', to: '#9733EE' },
  { label: 'Rose', from: '#F857A6', to: '#FF5858' },
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const FOLD_STEPS = [
  'Cut the borders of the printed sheet.',
  'Fold the paper in half longways, following the line. Unfold it.',
  'Fold the paper in half sideways, following the lines. Fold it again in half sideways.',
  'Unfold everything. You should see 8 rectangles.',
  'Fold the paper sideways again. Cut ONLY the center fold halfway (dashed line).',
  'Unfold slightly, then push the two sides inward to form a small book. Fold it flat — now you have your mini magazine!',
  'Enjoy your printed photos, cover to cover.',
];

interface ZinePage {
  background: string | null; // AI-generated background, if any
  photos: PhotoItem[]; // user's uploaded photo(s) — freely positioned & resized, no upper limit
  stickers: StickerItem[]; // freely-positioned, resizable text stickers for this page
}

const EMPTY_PAGES: ZinePage[] = Array.from({ length: PAGE_COUNT }, () => ({ background: null, photos: [], stickers: [] }));

function pageHasContent(page: ZinePage): boolean {
  return !!page.background || page.photos.length > 0 || page.stickers.length > 0;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image.'));
    img.src = src;
  });
}

// Draws `img` into the (x, y, w, h) box using cover-fit (crop to fill, like CSS object-fit: cover).
function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx: number, sy: number, sw: number, sh: number;
  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

// Draws a white-bordered, drop-shadowed photo frame at (x, y, w, h) — the
// shared "polaroid" look used for every photo slot in the collage.
function drawFramedPhoto(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, pad = 10) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - pad, y - pad, w + pad * 2, h + pad * 2);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  drawImageCover(ctx, img, x, y, w, h);
  ctx.restore();
}

// Rasterizes a whole page — background, freely-positioned photos, and
// freely-positioned text stickers — into one flattened image for export.
// Canvas fillText renders any Google Font as real pixels, sidestepping
// pdf-lib's inability to embed custom fonts as vector text; drawing the
// user's exact on-screen photo placement/size keeps the PDF a true match of
// the live drag-and-resize preview.
async function renderFinalPageCanvas(page: ZinePage): Promise<string | null> {
  if (!pageHasContent(page)) return null;
  await (document as any).fonts?.ready;

  const W = 800;
  const H = 1067;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  if (page.background) {
    const bgImg = await loadImage(page.background);
    drawImageCover(ctx, bgImg, 0, 0, W, H);
  } else {
    ctx.fillStyle = '#FAF7F2'; // neutral cream page background when there's no AI-generated backdrop
    ctx.fillRect(0, 0, W, H);
  }

  for (const p of page.photos) {
    const img = await loadImage(p.src);
    const w = (p.widthPct / 100) * W;
    const h = (p.heightPct / 100) * H;
    const x = (p.xPct / 100) * W - w / 2;
    const y = (p.yPct / 100) * H - h / 2;
    drawFramedPhoto(ctx, img, x, y, w, h);
  }

  for (const s of page.stickers) {
    const x = (s.xPct / 100) * W;
    const y = (s.yPct / 100) * H;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const family = FONTS.find((f) => f.label === s.font)?.family || FONTS[0].family;
    ctx.font = `700 ${s.fontSizePx}px ${family}`;

    if (s.colorMode === 'gradient') {
      const textWidth = ctx.measureText(s.content).width;
      const grad = ctx.createLinearGradient(x - textWidth / 2, y, x + textWidth / 2, y);
      grad.addColorStop(0, s.gradientFrom);
      grad.addColorStop(1, s.gradientTo);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = s.color;
    }

    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 6;
    ctx.fillText(s.content, x, y);
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

// A pointer-drag/resize target — kept in a ref (not state) so pointermove
// doesn't churn re-renders and so start values are read once, not on every
// render (which would drift as the item's own position/size changes mid-drag).
interface DragState {
  kind: 'photo' | 'sticker';
  pageIndex: number;
  id: string;
  mode: 'move' | 'resize';
  startClientX: number;
  startClientY: number;
  startXPct: number;
  startYPct: number;
  startWidthPct?: number;
  startHeightPct?: number;
  startFontSizePx?: number;
}

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
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAiCover, setIsGeneratingAiCover] = useState(false);
  const [aiTargetPage, setAiTargetPage] = useState(0);
  const [stickerTargetPage, setStickerTargetPage] = useState(0);
  const [newText, setNewText] = useState('');
  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const pageTileRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dragStateRef = useRef<DragState | null>(null);

  const uploadedCount = pages.filter(pageHasContent).length;

  const handleFileSelect = async (index: number, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      toast.warn('Please choose image files.');
      return;
    }

    const existing = pages[index]?.photos || [];
    const srcs = await Promise.all(files.map(readAsDataUrl));
    const newPhotos: PhotoItem[] = srcs.map((src, i) => {
      // Stagger newly-added photos diagonally so a multi-select doesn't stack
      // them exactly on top of each other, making each one easy to grab.
      const step = (existing.length + i) % 3;
      const offset = step * 8 - 8;
      return { id: makeId(), src, xPct: 50 + offset, yPct: 50 + offset, widthPct: 55, heightPct: 40 };
    });
    setPages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], photos: [...existing, ...newPhotos] };
      return next;
    });
  };

  const handleRemovePage = (index: number) => {
    setPages((prev) => {
      const next = [...prev];
      next[index] = { background: null, photos: [], stickers: [] };
      return next;
    });
    if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = '';
  };

  const removePhoto = (pageIndex: number, photoId: string) => {
    setPages((prev) => {
      const next = [...prev];
      next[pageIndex] = { ...next[pageIndex], photos: next[pageIndex].photos.filter((p) => p.id !== photoId) };
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

  const removeSticker = (pageIndex: number, stickerId: string) => {
    setPages((prev) => {
      const next = [...prev];
      next[pageIndex] = { ...next[pageIndex], stickers: next[pageIndex].stickers.filter((s) => s.id !== stickerId) };
      return next;
    });
  };

  // Shared drag/resize plumbing for both photos and text stickers. `mode`
  // decides what a move updates: xPct/yPct for 'move', widthPct/heightPct (photos)
  // or fontSizePx (stickers) for 'resize'.
  const beginDrag = (e: React.PointerEvent, kind: 'photo' | 'sticker', pageIndex: number, id: string, mode: 'move' | 'resize') => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const item = kind === 'photo' ? pages[pageIndex].photos.find((p) => p.id === id) : pages[pageIndex].stickers.find((s) => s.id === id);
    if (!item) return;
    dragStateRef.current = {
      kind,
      pageIndex,
      id,
      mode,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startXPct: item.xPct,
      startYPct: item.yPct,
      startWidthPct: kind === 'photo' ? (item as PhotoItem).widthPct : undefined,
      startHeightPct: kind === 'photo' ? (item as PhotoItem).heightPct : undefined,
      startFontSizePx: kind === 'sticker' ? (item as StickerItem).fontSizePx : undefined,
    };
  };

  const handleDragMove = (e: React.PointerEvent, pageIndex: number) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pageIndex !== pageIndex) return;
    e.stopPropagation();
    const tile = pageTileRefs.current[pageIndex];
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    const dxPct = ((e.clientX - drag.startClientX) / rect.width) * 100;
    const dyPct = ((e.clientY - drag.startClientY) / rect.height) * 100;

    setPages((prev) => {
      const next = [...prev];
      const page = next[pageIndex];
      if (drag.kind === 'photo') {
        next[pageIndex] = {
          ...page,
          photos: page.photos.map((p) => {
            if (p.id !== drag.id) return p;
            if (drag.mode === 'move') {
              return { ...p, xPct: clamp(drag.startXPct + dxPct, 0, 100), yPct: clamp(drag.startYPct + dyPct, 0, 100) };
            }
            return {
              ...p,
              widthPct: clamp((drag.startWidthPct ?? 40) + dxPct, 10, 95),
              heightPct: clamp((drag.startHeightPct ?? 30) + dyPct, 8, 95),
            };
          }),
        };
      } else {
        next[pageIndex] = {
          ...page,
          stickers: page.stickers.map((s) => {
            if (s.id !== drag.id) return s;
            if (drag.mode === 'move') {
              return { ...s, xPct: clamp(drag.startXPct + dxPct, 0, 100), yPct: clamp(drag.startYPct + dyPct, 0, 100) };
            }
            return { ...s, fontSizePx: clamp((drag.startFontSizePx ?? 28) + dxPct * 8, 12, 140) };
          }),
        };
      }
      return next;
    });
  };

  const handleDragEnd = (e: React.PointerEvent) => {
    e.stopPropagation();
    dragStateRef.current = null;
  };

  const handleGenerateAiCover = async () => {
    if (!aiPrompt.trim()) {
      toast.warn('Describe a style or theme for your AI cover first.');
      return;
    }

    logUserEvent('CLICK_GENERATE_AI_COVER', { prompt: aiPrompt, targetPage: aiTargetPage + 1 });
    setIsGeneratingAiCover(true);
    try {
      const background = await generateAiCoverImage(aiPrompt.trim());
      setPages((prev) => {
        const next = [...prev];
        next[aiTargetPage] = { ...next[aiTargetPage], background };
        return next;
      });
      toast.success(`AI background generated on Page ${aiTargetPage + 1}!`);
    } catch (err: any) {
      console.error('Failed to generate AI cover:', err);
      toast.error(err?.message || 'Could not generate the AI cover. Please try again.');
    } finally {
      setIsGeneratingAiCover(false);
    }
  };

  const generatePdf = async (): Promise<Uint8Array> => {
    const { PDFDocument } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const PAGE_W = 420;
    const PAGE_H = 560;

    for (const page of pages) {
      const finalImageSrc = await renderFinalPageCanvas(page);
      if (!finalImageSrc) continue;
      const pdfPage = pdfDoc.addPage([PAGE_W, PAGE_H]);

      try {
        const imgBytes = await fetch(finalImageSrc).then((r) => r.arrayBuffer());
        const img = await pdfDoc.embedJpg(imgBytes);

        const imgRatio = img.width / img.height;
        const pageRatio = PAGE_W / PAGE_H;
        const drawWidth = imgRatio > pageRatio ? PAGE_H * imgRatio : PAGE_W;
        const drawHeight = imgRatio > pageRatio ? PAGE_H : PAGE_W / imgRatio;

        pdfPage.drawImage(img, {
          x: (PAGE_W - drawWidth) / 2,
          y: (PAGE_H - drawHeight) / 2,
          width: drawWidth,
          height: drawHeight,
        });
      } catch {
        // Unsupported image format — leave the page blank rather than failing the whole PDF.
      }
    }

    return pdfDoc.save();
  };

  const buildPdfFileName = () => 'mini-magazine.pdf';

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    if (uploadedCount === 0) {
      toast.warn('Upload at least one photo before downloading.');
      return;
    }

    logUserEvent('CLICK_MINI_MAGAZINE_DOWNLOAD', { uploadedCount, font, size });
    setIsDownloading(true);
    try {
      const pdfBytes = await generatePdf();
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
      toast.warn('Upload at least one photo before sending.');
      return;
    }

    logUserEvent('CLICK_MINI_MAGAZINE_WHATSAPP_SEND', { uploadedCount, font, size });
    setIsSendingWhatsApp(true);
    try {
      const pdfBytes = await generatePdf();
      const fileName = buildPdfFileName();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const file = new File([blob], fileName, { type: 'application/pdf' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mini Magazine',
          text: `My Mini Magazine (${uploadedCount} of ${PAGE_COUNT} pages) for printing — Printalarm`,
        });
        toast.success('Choose WhatsApp in the share menu to send your PDF for printing!');
      } else {
        downloadBlob(blob, fileName);

        const msg = [
          `*New Mini Magazine Order - Printalarm*`,
          ``,
          `*Font:* ${font} (${size})`,
          `*Pages:* ${uploadedCount} of ${PAGE_COUNT} filled`,
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

  const ToggleButton = ({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: React.ReactNode; label: string }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
        active ? 'bg-luxury-gold border-luxury-gold text-luxury-accent' : 'bg-luxury-dark border-gold-200/40 text-gray-400 hover:border-luxury-gold/60'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <Seo
        title={`Mini Magazine Maker | Turn Your Photos into a Photo Zine — ${BRAND_NAME}`}
        description="Create your own mini magazine — upload up to 8 photos, choose a font, alignment and overlay, and order your personalized printed photo zine on WhatsApp."
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
            Turn up to 8 of your favorite photos into a personalized mini photo magazine — a printed keepsake booklet made your way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
          {/* Photo pages grid */}
          <div className="glass-card-gold rounded-xl p-5 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display font-semibold text-luxury-accent">Pages ({uploadedCount}/{PAGE_COUNT} uploaded)</h2>
            </div>

            {/* AI Cover Generator */}
            <div className="rounded-xl border border-luxury-gold/40 p-4 space-y-3" style={{ background: 'linear-gradient(135deg, #1a1410, #3D1E30 70%)' }}>
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-luxury-gold" strokeWidth={2} />
                <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold">AI Background Generator</h3>
              </div>
              <p className="text-[11px] text-gray-400">Describe a style or theme and generate an AI background for any page — not just the cover.</p>
              {/* Target page selector */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Apply to page</p>
                <div className="flex flex-wrap gap-1.5">
                  {pages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAiTargetPage(i)}
                      className={`w-7 h-7 rounded-md border text-[11px] font-bold transition-colors cursor-pointer ${
                        aiTargetPage === i
                          ? 'bg-luxury-gold border-luxury-gold text-luxury-accent'
                          : 'bg-luxury-dark border-gold-200/40 text-gray-400 hover:border-luxury-gold/60'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. romantic floral gold pattern, elegant"
                  className="flex-1 bg-luxury-dark border border-gold-200/40 rounded-lg px-3 py-2.5 text-xs text-luxury-accent placeholder:text-gray-500 focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={handleGenerateAiCover}
                  disabled={isGeneratingAiCover}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-luxury-gold text-luxury-accent text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isGeneratingAiCover ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" strokeWidth={2} /> Generate for Page {aiTargetPage + 1}
                    </>
                  )}
                </button>
              </div>

              {/* Topic quick prompts */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Or pick a topic</p>
                <div className="flex flex-wrap gap-1.5">
                  {TOPIC_PROMPTS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => {
                        setAiPrompt(t.prompt);
                        logUserEvent('CLICK_TOPIC_PROMPT', { topic: t.label });
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-gold-200/40 bg-luxury-dark text-[11px] text-gray-300 hover:border-luxury-gold hover:text-luxury-gold transition-colors cursor-pointer"
                    >
                      <t.icon className="w-3.5 h-3.5 text-luxury-gold flex-shrink-0" strokeWidth={2} /> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame style quick prompts */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Or choose a frame style</p>
                <div className="flex flex-wrap gap-1.5">
                  {FRAME_PROMPTS.map((f) => (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => {
                        setAiPrompt(f.prompt);
                        logUserEvent('CLICK_FRAME_PROMPT', { frame: f.label });
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-gold-200/40 bg-luxury-dark text-[11px] text-gray-300 hover:border-luxury-gold hover:text-luxury-gold transition-colors cursor-pointer"
                    >
                      <f.icon className="w-3.5 h-3.5 text-luxury-gold flex-shrink-0" strokeWidth={2} /> {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Text Stickers */}
            <div className="rounded-xl border border-luxury-gold/40 p-4 space-y-3" style={{ background: 'linear-gradient(135deg, #1a1410, #3D1E30 70%)' }}>
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-luxury-gold" strokeWidth={2} />
                <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold">Add Text</h3>
              </div>
              <p className="text-[11px] text-gray-400">Add any text to any page, then drag it anywhere — just like Instagram Stories.</p>

              {/* Target page selector */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">On page</p>
                <div className="flex flex-wrap gap-1.5">
                  {pages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setStickerTargetPage(i)}
                      className={`w-7 h-7 rounded-md border text-[11px] font-bold transition-colors cursor-pointer ${
                        stickerTargetPage === i
                          ? 'bg-luxury-gold border-luxury-gold text-luxury-accent'
                          : 'bg-luxury-dark border-gold-200/40 text-gray-400 hover:border-luxury-gold/60'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTextSticker()}
                  placeholder="Type any text..."
                  className="flex-1 bg-luxury-dark border border-gold-200/40 rounded-lg px-3 py-2.5 text-xs text-luxury-accent placeholder:text-gray-500 focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={addTextSticker}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-luxury-gold text-luxury-accent text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  <Type className="w-3.5 h-3.5" strokeWidth={2} /> Add Text
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {pages.map((page, i) => (
                <div key={i} className="space-y-1.5">
                  <input
                    ref={(el) => { fileInputRefs.current[i] = el; }}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      handleFileSelect(i, e.target.files);
                      e.target.value = '';
                    }}
                  />
                  <button
                    ref={(el) => { pageTileRefs.current[i] = el; }}
                    type="button"
                    onClick={() => fileInputRefs.current[i]?.click()}
                    className="relative w-full aspect-[3/4] rounded-lg border-2 border-dashed border-gold-200 hover:border-luxury-gold transition-colors overflow-hidden bg-[#FAF7F2] flex items-center justify-center cursor-pointer group"
                    style={{ containerType: 'inline-size' } as React.CSSProperties}
                  >
                    {/* Background layer */}
                    {page.background && (
                      <img src={page.background} alt={`Page ${i + 1} background`} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
                    )}

                    {!pageHasContent(page) && (
                      <div className="flex flex-col items-center gap-1.5 text-gray-400 pointer-events-none">
                        <Upload className="w-5 h-5" strokeWidth={2} />
                        <span className="text-[10px] font-medium">Upload</span>
                        <span className="text-[8px] text-gray-500">add as many as you like</span>
                      </div>
                    )}

                    {pageHasContent(page) && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePage(i);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-30"
                        aria-label={`Clear page ${i + 1}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {page.photos.length > 1 && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-black/70 text-white text-[9px] font-bold z-10">
                        {page.photos.length} photos
                      </span>
                    )}
                    {page.photos.length > 0 && (
                      <span className="absolute bottom-1.5 left-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        Tap empty space to add more
                      </span>
                    )}

                    {/* Draggable + resizable photos — on every page */}
                    {page.photos.map((p) => (
                      <div
                        key={p.id}
                        onPointerDown={(e) => beginDrag(e, 'photo', i, p.id, 'move')}
                        onPointerMove={(e) => handleDragMove(e, i)}
                        onPointerUp={handleDragEnd}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-move z-20"
                        style={{ left: `${p.xPct}%`, top: `${p.yPct}%`, width: `${p.widthPct}%`, height: `${p.heightPct}%`, touchAction: 'none' }}
                      >
                        <img
                          src={p.src}
                          alt=""
                          className="w-full h-full object-cover rounded-[2px] border-2 border-white shadow-lg pointer-events-none"
                          draggable={false}
                        />
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(i, p.id);
                          }}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove photo"
                        >
                          <X className="w-2.5 h-2.5" />
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onPointerDown={(e) => beginDrag(e, 'photo', i, p.id, 'resize')}
                          className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full bg-luxury-gold border border-white opacity-0 group-hover:opacity-100 transition-opacity cursor-nwse-resize"
                          style={{ touchAction: 'none' }}
                          aria-label="Resize photo"
                        />
                      </div>
                    ))}

                    {/* Draggable + resizable text stickers — on every page */}
                    {page.stickers.map((s) => (
                      <div
                        key={s.id}
                        onPointerDown={(e) => beginDrag(e, 'sticker', i, s.id, 'move')}
                        onPointerMove={(e) => handleDragMove(e, i)}
                        onPointerUp={handleDragEnd}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap cursor-move z-30 font-bold"
                        style={{
                          left: `${s.xPct}%`,
                          top: `${s.yPct}%`,
                          fontSize: `${(s.fontSizePx / 800) * 100}cqw`,
                          touchAction: 'none',
                          fontFamily: FONTS.find((f) => f.label === s.font)?.family,
                          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                          ...(s.colorMode === 'gradient'
                            ? {
                                backgroundImage: `linear-gradient(90deg, ${s.gradientFrom}, ${s.gradientTo})`,
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                              }
                            : { color: s.color }),
                        }}
                      >
                        {s.content}
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSticker(i, s.id);
                          }}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove sticker"
                        >
                          <X className="w-2.5 h-2.5" />
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onPointerDown={(e) => beginDrag(e, 'sticker', i, s.id, 'resize')}
                          className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-luxury-gold border border-white opacity-0 group-hover:opacity-100 transition-opacity cursor-nwse-resize"
                          style={{ touchAction: 'none' }}
                          aria-label="Resize text"
                        />
                      </div>
                    ))}
                  </button>
                  <p className="text-[10px] text-center text-gray-500 font-medium">
                    Page {i + 1}{i === 0 ? ' (Cover)' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Details + customization form */}
          <div className="glass-card-gold rounded-xl p-6 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-1">
              <h2 className="text-sm font-display font-semibold text-luxury-accent">Text Style</h2>
              <p className="text-[11px] text-gray-500">Applies to the next text you add above — drag it into place on the page.</p>
            </div>

            {/* Font */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Font</h3>
              <div className="flex flex-wrap gap-2">
                {FONTS.map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => setFont(f.label)}
                    style={{ fontFamily: f.family }}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      font === f.label ? 'bg-luxury-gold border-luxury-gold text-luxury-accent font-bold' : 'bg-luxury-dark border-gold-200/40 text-gray-300 hover:border-luxury-gold/60'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Size</h3>
              <div className="flex gap-1.5">
                {SIZES.map((s) => (
                  <ToggleButton key={s.key} active={size === s.key} onClick={() => setSize(s.key)} label={`Size ${s.key}`}>
                    <span className="text-xs font-bold">{s.key}</span>
                  </ToggleButton>
                ))}
              </div>
            </div>

            {/* Color: solid / gradient / custom */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Color</h3>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setColorMode('solid')}
                  aria-pressed={colorMode === 'solid'}
                  className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                    colorMode === 'solid' ? 'bg-luxury-gold border-luxury-gold text-luxury-accent' : 'bg-luxury-dark border-gold-200/40 text-gray-400 hover:border-luxury-gold/60'
                  }`}
                >
                  Solid
                </button>
                <button
                  type="button"
                  onClick={() => setColorMode('gradient')}
                  aria-pressed={colorMode === 'gradient'}
                  className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                    colorMode === 'gradient' ? 'bg-luxury-gold border-luxury-gold text-luxury-accent' : 'bg-luxury-dark border-gold-200/40 text-gray-400 hover:border-luxury-gold/60'
                  }`}
                >
                  Gradient
                </button>
              </div>

              {colorMode === 'solid' ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-gold-200/40 cursor-pointer p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[6px] [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-[6px] [&::-moz-color-swatch]:border-none"
                    aria-label="Custom text color"
                  />
                  {['#ffffff', '#000000', '#D4AF37', '#FF5A5F', '#22C55E', '#3B82F6'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTextColor(c)}
                      className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform ${textColor === c ? 'border-luxury-gold scale-110' : 'border-gold-200/40'}`}
                      style={{ backgroundColor: c }}
                      aria-label={`Set color ${c}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {GRADIENT_PRESETS.map((g) => (
                      <button
                        key={g.label}
                        type="button"
                        onClick={() => {
                          setGradientFrom(g.from);
                          setGradientTo(g.to);
                        }}
                        className={`w-8 h-8 rounded-lg border-2 cursor-pointer transition-transform ${
                          gradientFrom === g.from && gradientTo === g.to ? 'border-luxury-gold scale-110' : 'border-gold-200/40'
                        }`}
                        style={{ backgroundImage: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                        aria-label={g.label}
                        title={g.label}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gradientFrom}
                      onChange={(e) => setGradientFrom(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-gold-200/40 cursor-pointer p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[6px] [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-[6px] [&::-moz-color-swatch]:border-none"
                      aria-label="Gradient start color"
                    />
                    <span className="text-gray-500 text-xs">to</span>
                    <input
                      type="color"
                      value={gradientTo}
                      onChange={(e) => setGradientTo(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-gold-200/40 cursor-pointer p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[6px] [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-[6px] [&::-moz-color-swatch]:border-none"
                      aria-label="Gradient end color"
                    />
                  </div>
                </div>
              )}

              {/* Live preview */}
              <div
                className="text-xl font-bold px-1"
                style={
                  colorMode === 'gradient'
                    ? {
                        backgroundImage: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }
                    : { color: textColor }
                }
              >
                Aa Preview
              </div>
            </div>

            <div className="border-t border-gold-200 pt-4 space-y-3">
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
        </div>

        {/* Fold instructions */}
        <div className="glass-card-gold rounded-xl p-6 md:p-10 space-y-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-luxury-accent">
            Instructions: How to Fold Your Mini Magazine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {FOLD_STEPS.map((step, i) => (
              <div key={i} className="space-y-1.5">
                <h3 className="text-sm font-display font-semibold text-luxury-gold">Step {i + 1}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
