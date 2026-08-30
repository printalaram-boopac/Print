import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import {
  Download, BookOpen, Scissors, X, RefreshCw, Trash2, Upload, SlidersHorizontal, Printer,
  ChevronRight, Layers, Type, Shuffle, Lock, HelpCircle, Sparkles, ImagePlus,
} from 'lucide-react';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import { logUserEvent } from '@/lib/analytics';

const HOW_IT_WORKS_STEPS = [
  { icon: Upload, title: '1. Upload Your Photos', body: 'Add one image per panel. The front and back cover can also carry a custom title or name.' },
  { icon: SlidersHorizontal, title: '2. Arrange & Customize', body: 'Drag pages 2–7 to reorder them. Choose image fit, borders, rounded corners, and the zine background.' },
  { icon: Printer, title: '3. Print & Fold', body: 'Export a high-resolution PDF, print it in landscape on A4, and follow the folding guide to assemble it.' },
];

/** Original line-art illustrations for the assembly steps (no third-party photos/icons). */
function PrintIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="12" y="22" width="40" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="18" y="10" width="28" height="14" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="18" y="40" width="28" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
      <line x1="22" y1="46" x2="42" y2="46" stroke="currentColor" strokeWidth="1.5" />
      <line x1="22" y1="51" x2="42" y2="51" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="45" cy="28" r="1.6" fill="currentColor" />
    </svg>
  );
}

function TrimIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="10" y="12" width="30" height="40" rx="1" stroke="currentColor" strokeWidth="2" />
      <line x1="16" y1="12" x2="16" y2="52" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M46 18 L38 26 M46 34 L38 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="47.5" cy="16.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="47.5" cy="35.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function FoldIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M12 20 L30 14 L30 46 L12 52 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M52 20 L34 14 L34 46 L52 52 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="32" y1="12" x2="32" y2="48" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M24 33 L20 33 M24 33 L21.5 30.5 M24 33 L21.5 35.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 33 L44 33 M40 33 L42.5 30.5 M40 33 L42.5 35.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FinishedIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M32 16 C26 12 18 12 14 14 L14 48 C18 46 26 46 32 50 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 16 C38 12 46 12 50 14 L50 48 C46 46 38 46 32 50 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="32" y1="18" x2="32" y2="49" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 22 L26 22 M20 27 L26 27" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M38 22 L44 22 M38 27 L44 27" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

const ASSEMBLE_STEPS = [
  { icon: PrintIllustration, title: 'Step 1', body: 'Print the exported PDF on A4 paper in landscape orientation, at 100% scale.' },
  { icon: TrimIllustration, title: 'Step 2', body: "Trim the printed margins. Home printers can't print edge-to-edge, so trimming keeps the panels aligned once folded." },
  { icon: FoldIllustration, title: 'Step 3', body: 'Fold the sheet in half widthwise, then cut along the fold from the folded edge to the centre — about one panel wide. Unfold, fold lengthwise, and push the ends toward the middle so the cut opens into a cross.' },
  { icon: FinishedIllustration, title: 'Finished', body: 'Fold all eight panels the same direction. Your zine is ready — cover on top, back cover behind.' },
];

const FEATURES = [
  { icon: Layers, title: 'One-Sheet, 8 Pages', body: 'A single A4 sheet becomes an 8-page booklet after one fold and one cut — no stapling, no binding.' },
  { icon: Shuffle, title: 'Drag to Reorder', body: 'Pages 2–7 can be dragged into any order. The cover and back cover stay fixed to keep the structure intact.' },
  { icon: Type, title: 'Cover Typography', body: 'Add a title or name to the cover and back cover in eight expressive fonts, with adjustable size, colour, and position.' },
  { icon: Lock, title: 'Private & Offline', body: 'Every photo is processed in your browser. Nothing is uploaded — the PDF is generated entirely on your device.' },
];

const ZINE_FAQS = [
  { q: 'Is the Photo Zine Studio free to use?', a: 'Yes — it is completely free, with no watermark, no account, and no limit on how many zines you create.' },
  { q: 'Do my photos leave my device?', a: 'No. Every photo is drawn and composed locally in your browser, and the exported PDF is generated on your device — nothing is uploaded to Printalarm or anywhere else.' },
  { q: 'What paper size does the zine use?', a: 'The export is a landscape A4 sheet (297 × 210 mm). This single sheet folds and cuts into an 8-page booklet.' },
  { q: 'Can I reorder the pages?', a: 'Yes — drag pages 2 through 7 in the grid to reorder them. The front and back cover stay fixed at the start and end.' },
  { q: 'Can I add text to the cover?', a: 'Yes — add a title or name to the front and back cover, and choose from eight fonts with adjustable size, colour, and position.' },
  { q: 'How do I assemble the printed zine?', a: 'Download the PDF and print it in landscape on A4. Then use "Download Guide" for a step-by-step fold-and-cut walkthrough.' },
];

type Fit = 'fill' | 'original';
type Layout = 'full' | 'instax-top' | 'instax-bottom';

interface Slot {
  imgSrc: string | null;
  img: HTMLImageElement | null;
  fit: Fit;
  layout: Layout;
  borderSize: number; // % of min(cell dimension)
  rounded: number; // % of min(image dimension)
  blackBorder: boolean;
  text: string;
  font: string;
  fontSize: number; // design units, scaled relative to cell height
  textColor: string;
  posX: number; // 0-100
  posY: number; // 0-100
}

const FONTS: { key: string; label: string; family: string }[] = [
  { key: 'serif', label: 'Elegant Serif', family: '"Playfair Display", serif' },
  { key: 'display', label: 'Bold Display', family: '"Archivo Black", sans-serif' },
  { key: 'typewriter', label: 'Typewriter', family: '"Special Elite", monospace' },
  { key: 'vintage', label: 'Vintage Serif', family: '"Cutive", serif' },
  { key: 'hand', label: 'Handwritten', family: '"Caveat", cursive' },
  { key: 'marker', label: 'Marker', family: '"Permanent Marker", cursive' },
  { key: 'pixel', label: 'Pixel', family: '"Press Start 2P", monospace' },
  { key: 'condensed', label: 'Condensed', family: '"Oswald", sans-serif' },
];

const BG_SWATCHES = ['#FFFFFF', '#141210', '#F5D8E4', '#C7D9EE', '#D4AF37'];
const SLOT_LABELS = ['Front', '2', '3', '4', '5', '6', '7', 'Back'];

function newSlot(): Slot {
  return {
    imgSrc: null,
    img: null,
    fit: 'fill',
    layout: 'full',
    borderSize: 2,
    rounded: 8,
    blackBorder: false,
    text: '',
    font: 'typewriter',
    fontSize: 16,
    textColor: '#FFFFFF',
    posX: 50,
    posY: 50,
  };
}

function fontFamilyFor(key: string): string {
  return FONTS.find((f) => f.key === key)?.family || 'sans-serif';
}

function drawSlotToCanvas(ctx: CanvasRenderingContext2D, w: number, h: number, slot: Slot, bgColor: string) {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  const pad = (slot.borderSize / 100) * Math.min(w, h);
  let ix = pad;
  let iy = pad;
  let iw = w - 2 * pad;
  let ih = h - 2 * pad;

  if (slot.layout !== 'full') {
    const capH = ih * 0.18;
    if (slot.layout === 'instax-top') {
      iy += capH;
      ih -= capH;
    } else {
      ih -= capH;
    }
  }

  const radius = Math.max(0, (slot.rounded / 100) * Math.min(iw, ih));

  ctx.save();
  ctx.beginPath();
  // @ts-ignore - roundRect is available in all evergreen browsers
  ctx.roundRect(ix, iy, iw, ih, radius);
  ctx.clip();

  if (slot.img) {
    const ir = slot.img.width / slot.img.height;
    const cr = iw / ih;
    if (slot.fit === 'fill') {
      let sw: number, sh: number, sx: number, sy: number;
      if (ir > cr) {
        sh = slot.img.height;
        sw = sh * cr;
        sx = (slot.img.width - sw) / 2;
        sy = 0;
      } else {
        sw = slot.img.width;
        sh = sw / cr;
        sx = 0;
        sy = (slot.img.height - sh) / 2;
      }
      ctx.drawImage(slot.img, sx, sy, sw, sh, ix, iy, iw, ih);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(ix, iy, iw, ih);
      let dw: number, dh: number;
      if (ir > cr) {
        dw = iw;
        dh = dw / ir;
      } else {
        dh = ih;
        dw = dh * ir;
      }
      const dx = ix + (iw - dw) / 2;
      const dy = iy + (ih - dh) / 2;
      ctx.drawImage(slot.img, dx, dy, dw, dh);
    }
  } else {
    ctx.fillStyle = '#F3EAE1';
    ctx.fillRect(ix, iy, iw, ih);
  }
  ctx.restore();

  if (slot.blackBorder) {
    ctx.save();
    ctx.lineWidth = Math.max(1, Math.min(iw, ih) * 0.012);
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    // @ts-ignore
    ctx.roundRect(ix, iy, iw, ih, radius);
    ctx.stroke();
    ctx.restore();
  }

  if (slot.text.trim()) {
    ctx.save();
    const px = (slot.fontSize / 300) * h;
    ctx.font = `${px}px ${fontFamilyFor(slot.font)}`;
    ctx.fillStyle = slot.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(slot.text, w * (slot.posX / 100), h * (slot.posY / 100));
    ctx.restore();
  }
}

async function composeSheet(slots: Slot[], bgColor: string, showCutLines: boolean, dpi = 150): Promise<HTMLCanvasElement> {
  const DPI = dpi;
  const W = Math.round(11.69 * DPI);
  const H = Math.round(8.27 * DPI);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H);

  const cellW = W / 4;
  const cellH = H / 2;
  const layout = [
    { slotIdx: 4, col: 0, row: 0, rot: true },
    { slotIdx: 3, col: 1, row: 0, rot: true },
    { slotIdx: 2, col: 2, row: 0, rot: false },
    { slotIdx: 1, col: 3, row: 0, rot: false },
    { slotIdx: 5, col: 0, row: 1, rot: false },
    { slotIdx: 6, col: 1, row: 1, rot: false },
    { slotIdx: 7, col: 2, row: 1, rot: false },
    { slotIdx: 0, col: 3, row: 1, rot: false },
  ];

  for (const cell of layout) {
    const slot = slots[cell.slotIdx];
    const cx = cell.col * cellW;
    const cy = cell.row * cellH;
    ctx.save();
    if (cell.rot) {
      ctx.translate(cx + cellW / 2, cy + cellH / 2);
      ctx.rotate(Math.PI);
      ctx.translate(-cellW / 2, -cellH / 2);
    } else {
      ctx.translate(cx, cy);
    }
    drawSlotToCanvas(ctx, cellW, cellH, slot, bgColor);
    ctx.restore();
  }

  if (showCutLines) {
    ctx.save();
    ctx.strokeStyle = '#C5A059';
    ctx.setLineDash([12, 10]);
    ctx.lineWidth = 3;
    const midY = H / 2;
    ctx.beginPath();
    ctx.moveTo(W * 0.25, midY);
    ctx.lineTo(W * 0.75, midY);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#C5A059';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✂ CUT HERE', W / 2, midY - 14);
    ctx.restore();

    // Page-number labels hugging the cut line, as an assembly aid.
    ctx.save();
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const pad = 30;
    layout.forEach((cell) => {
      const label = `P.${cell.slotIdx + 1}`;
      const lx = cell.col * cellW + cellW / 2;
      const ly = cell.row === 0 ? midY - pad : midY + pad;
      const textW = ctx.measureText(label).width;
      const boxW = textW + 20;
      const boxH = 28;
      ctx.fillStyle = 'rgba(20,16,12,0.85)';
      ctx.beginPath();
      // @ts-ignore - roundRect is available in all evergreen browsers
      ctx.roundRect(lx - boxW / 2, ly - boxH / 2, boxW, boxH, 4);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, lx, ly + 1);
    });
    ctx.restore();
  }

  return canvas;
}

export default function PhotoZineMaker() {
  const [slots, setSlots] = useState<Slot[]>(() => Array.from({ length: 8 }, newSlot));
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [showCutLines, setShowCutLines] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const [sheetPreviewUrl, setSheetPreviewUrl] = useState<string | null>(null);
  const fileInputs = useRef<(HTMLInputElement | null)[]>([]);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    slots.forEach((slot, i) => {
      const canvas = canvasRefs.current[i];
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      drawSlotToCanvas(ctx, canvas.width, canvas.height, slot, bgColor);
    });
  }, [slots, bgColor]);

  useEffect(() => {
    let cancelled = false;
    composeSheet(slots, bgColor, showCutLines, 200).then((canvas) => {
      if (!cancelled) setSheetPreviewUrl(canvas.toDataURL('image/png'));
    }).catch((err) => console.error('Zine sheet preview failed:', err));
    return () => { cancelled = true; };
  }, [slots, bgColor, showCutLines]);

  const updateSlot = (index: number, patch: Partial<Slot>) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const handleFile = (index: number, file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      updateSlot(index, { imgSrc: url, img });
      setActiveIndex(index);
      logUserEvent('ZINE_PAGE_IMAGE_UPLOADED', { pageIndex: index });
    };
    img.src = url;
  };

  const handleSlotClick = (index: number) => {
    if (slots[index].imgSrc) {
      setActiveIndex(index);
    } else {
      fileInputs.current[index]?.click();
    }
  };

  const removeImage = (index: number) => {
    updateSlot(index, { imgSrc: null, img: null });
    setActiveIndex(null);
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    if (dragIndex < 1 || dragIndex > 6 || targetIndex < 1 || targetIndex > 6) return;
    setSlots((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
  };

  const handleDownloadZine = async () => {
    setExporting(true);
    logUserEvent('CLICK_DOWNLOAD_ZINE_PDF');
    try {
      // Cut lines are an on-screen guide only — never print them onto the exported sheet.
      const canvas = await composeSheet(slots, bgColor, false);
      const dataUrl = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
      pdf.save('printalarm-photo-zine.pdf');
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadGuide = () => {
    logUserEvent('CLICK_DOWNLOAD_ZINE_GUIDE');
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    pdf.setFillColor(20, 16, 12);
    pdf.rect(0, 0, 210, 38, 'F');
    pdf.setTextColor(212, 175, 55);
    pdf.setFontSize(20);
    pdf.text(`${BRAND_NAME} Photo Zine — Assembly Guide`, 15, 23);

    pdf.setTextColor(40, 40, 40);
    let y = 55;
    const steps: [string, string][] = [
      ['1. Print', 'Print the exported PDF on A4 paper in landscape orientation, at 100% scale — do not use "fit to page".'],
      ['2. Trim the edges', "Most home printers leave a thin white margin. Trim it off so the eight panels line up exactly once folded."],
      ['3. Fold & cut', 'Fold the sheet in half widthwise. Cut along that fold from the folded edge to the centre of the sheet — about one panel wide.'],
      ['4. Open & fold again', 'Unfold completely, then fold the sheet in half lengthwise. Push both ends toward the middle — the cut opens into a cross shape.'],
      ['5. Flatten', 'Fold all eight panels in the same direction into a small booklet. Your cover sits on top, back cover behind.'],
    ];
    steps.forEach(([heading, body]) => {
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.text(heading, 15, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      const lines = pdf.splitTextToSize(body, 180);
      pdf.text(lines, 15, y + 7);
      y += 7 + lines.length * 6 + 8;
    });
    pdf.save('printalarm-photo-zine-guide.pdf');
  };

  const active = activeIndex !== null ? slots[activeIndex] : null;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-luxury-black text-luxury-accent">
      <Seo
        title={`Photo Zine Studio — Free 8-Page Zine Maker | ${BRAND_NAME}`}
        description="Turn 8 of your photos into a printable, fold-and-cut zine on a single A4 sheet. Free, private, and entirely in your browser."
        path="/photo-zine-maker"
      />

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-display font-bold">
            Photo Zine <span className="text-gold-gradient">Studio</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Upload 8 photos, arrange them, and export a print-ready A4 sheet that folds into an
            8-page zine — right in your browser. Nothing is uploaded anywhere.
          </p>
        </div>

        {/* Toolbar */}
        <div className="glass-card-gold rounded-xl p-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadZine}
              disabled={exporting}
              className="btn-primary gold-glow cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              {exporting ? 'Preparing…' : 'Download Zine (PDF)'}
            </button>
            <button
              onClick={handleDownloadGuide}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gold-200/40 text-sm font-semibold text-luxury-accent hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" strokeWidth={2} /> Download Guide
            </button>
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gold-200/40 text-sm font-semibold text-luxury-accent cursor-pointer select-none">
              <Scissors className="w-4 h-4" strokeWidth={2} /> Show cut lines
              <input
                type="checkbox"
                checked={showCutLines}
                onChange={(e) => setShowCutLines(e.target.checked)}
                className="w-4 h-4 accent-luxury-gold cursor-pointer"
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Background</span>
            {BG_SWATCHES.map((c) => (
              <button
                key={c}
                onClick={() => setBgColor(c)}
                className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                  bgColor === c ? 'border-luxury-gold scale-110' : 'border-gold-200/30'
                }`}
                style={{ background: c }}
                aria-label={`Background ${c}`}
              />
            ))}
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-24 bg-luxury-dark border border-gold-200/40 rounded-lg px-2 py-1 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-display font-semibold">Build your zine</h2>
          <p className="text-xs text-gray-500">
            Click a thumbnail to upload or adjust it. Drag pages 2–7 to reorder them.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {slots.map((slot, i) => {
              const isMiddle = i >= 1 && i <= 6;
              return (
                <div
                  key={i}
                  draggable={isMiddle}
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => isMiddle && e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                  onClick={() => handleSlotClick(i)}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                    activeIndex === i ? 'border-luxury-gold shadow-lg shadow-amber-500/20' : 'border-gold-200/30 hover:border-gold-200/60'
                  }`}
                  style={{ aspectRatio: '0.707' }}
                >
                  <span className="absolute top-2 left-2 z-10 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1">
                    {isMiddle && <span className="opacity-60">⠿</span>}
                    {SLOT_LABELS[i]}
                  </span>
                  <canvas
                    ref={(el) => { canvasRefs.current[i] = el; }}
                    width={440}
                    height={622}
                    className="w-full h-full block"
                  />
                  {!slot.imgSrc && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <ImagePlus className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                    </div>
                  )}
                  <input
                    ref={(el) => { fileInputs.current[i] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(i, e.target.files?.[0])}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Live sheet preview */}
        <div className="space-y-3">
          <h2 className="text-lg font-display font-semibold">The Printed A4 Sheet</h2>
          <p className="text-xs text-gray-500">
            The order and orientation of pages are set automatically. Once you fold and cut along
            the centre line, your zine assembles perfectly — pages sit upside-down on purpose;
            that's the fold.
          </p>
          <div className="glass-card-gold rounded-xl p-3 overflow-hidden">
            {sheetPreviewUrl && (
              <img src={sheetPreviewUrl} alt="Printed A4 sheet preview" className="w-full h-auto rounded-lg" />
            )}
          </div>
        </div>

        <div className="gold-divider" />

        {/* From Screen to Paper */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              From Screen to <span className="text-gold-gradient">Paper</span>
            </h2>
            <p className="text-sm text-gray-400">
              A self-published photo booklet, folded by hand from a single printed sheet — no
              binding, no stapling, no glue.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.title} className="glass-card-gold rounded-xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-luxury-gold" strokeWidth={2} />
                </div>
                <h3 className="text-sm font-display font-semibold text-luxury-accent">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assemble Your Zine */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center">
            Assemble Your <span className="text-gold-gradient">Zine</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ASSEMBLE_STEPS.map((step, i) => (
              <div key={step.title} className="glass-card-gold rounded-xl p-5 space-y-3 relative">
                <span className="absolute top-4 right-4 text-2xl font-display font-bold text-luxury-gold/20">
                  {i + 1}
                </span>
                <div className="w-16 h-16 rounded-xl bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center">
                  <step.icon className="w-10 h-10 text-luxury-gold" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="gold-divider" />

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 glass-card-gold rounded-xl p-5">
              <div className="w-10 h-10 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-luxury-gold" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-display font-semibold text-luxury-accent">{f.title}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="gold-divider" />

        {/* FAQ */}
        <div className="max-w-2xl mx-auto w-full space-y-6">
          <div className="text-center space-y-2">
            <span className="section-badge-underline"><HelpCircle className="w-3.5 h-3.5" strokeWidth={2} /> Common Questions</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Frequently Asked <span className="text-gold-gradient">Questions</span>
            </h2>
          </div>
          <div className="glass-panel rounded-xl p-6 md:p-8">
            {ZINE_FAQS.map((faq) => (
              <ZineFaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        <div className="gold-divider" />

        {/* Cross-sell */}
        <div className="glass-card-gold rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="text-xs text-luxury-gold uppercase tracking-widest font-semibold mb-1 flex items-center gap-1.5 justify-center md:justify-start">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2} /> Pair it with your order
            </p>
            <h3 className="text-lg font-display font-bold text-luxury-accent">
              Printed your zine? Personalize a Shagun cover to match.
            </h3>
          </div>
          <Link
            to="/templates"
            className="btn-primary gold-glow cursor-pointer flex items-center gap-2 flex-shrink-0"
          >
            Browse Designs <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Edit modal */}
      {active && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="bg-luxury-black border border-gold-200/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-luxury-accent">
                {SLOT_LABELS[activeIndex] === 'Front' || SLOT_LABELS[activeIndex] === 'Back'
                  ? `Cover (${SLOT_LABELS[activeIndex]})`
                  : `Page ${SLOT_LABELS[activeIndex]}`}
              </h3>
              <button onClick={() => setActiveIndex(null)} className="text-gray-400 hover:text-luxury-gold cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-xl overflow-hidden border border-gold-200/30 mx-auto" style={{ aspectRatio: '0.707', maxWidth: 260 }}>
                <canvas
                  ref={(el) => {
                    if (el && activeIndex !== null) {
                      const ctx = el.getContext('2d');
                      if (ctx) drawSlotToCanvas(ctx, el.width, el.height, slots[activeIndex], bgColor);
                    }
                  }}
                  width={520}
                  height={735}
                  className="w-full h-full block"
                />
                {!active.imgSrc && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <ImagePlus className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {(['fill', 'original'] as Fit[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => updateSlot(activeIndex, { fit: f })}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide cursor-pointer transition-colors ${
                        active.fit === f ? 'bg-luxury-gold text-white' : 'bg-luxury-dark text-gray-400 border border-gold-200/30'
                      }`}
                    >
                      {f === 'fill' ? 'Fill' : 'Original'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                  <label className="space-y-1 block">
                    <span className="flex justify-between">Border Size <span>{active.borderSize}</span></span>
                    <input type="range" min={0} max={20} value={active.borderSize} onChange={(e) => updateSlot(activeIndex, { borderSize: Number(e.target.value) })} className="w-full accent-luxury-gold" />
                  </label>
                  <label className="space-y-1 block">
                    <span className="flex justify-between">Rounded <span>{active.rounded}</span></span>
                    <input type="range" min={0} max={20} value={active.rounded} onChange={(e) => updateSlot(activeIndex, { rounded: Number(e.target.value) })} className="w-full accent-luxury-gold" />
                  </label>
                </div>

                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <input type="checkbox" checked={active.blackBorder} onChange={(e) => updateSlot(activeIndex, { blackBorder: e.target.checked })} className="w-4 h-4 accent-luxury-gold cursor-pointer" />
                  Add black border
                </label>

                <div className="space-y-1">
                  <span className="text-xs text-gray-400">Image Layout</span>
                  <div className="grid grid-cols-3 gap-2">
                    {([['full', 'Full'], ['instax-top', 'Instax Top'], ['instax-bottom', 'Instax Bottom']] as [Layout, string][]).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => updateSlot(activeIndex, { layout: val })}
                        className={`px-2 py-2 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                          active.layout === val ? 'bg-luxury-gold text-white' : 'bg-luxury-dark text-gray-400 border border-gold-200/30'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gold-200/20 pt-3 space-y-3">
                  <span className="text-xs font-bold text-luxury-gold uppercase tracking-wider">Text (Optional)</span>
                  <input
                    type="text"
                    value={active.text}
                    onChange={(e) => updateSlot(activeIndex, { text: e.target.value })}
                    placeholder="Add a title or name"
                    className="w-full bg-luxury-dark border border-gold-200/40 rounded-lg px-3 py-2 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold"
                  />
                  <label className="space-y-1 block text-xs text-gray-400">
                    <span className="flex justify-between">Font Size <span>{active.fontSize}</span></span>
                    <input type="range" min={8} max={40} value={active.fontSize} onChange={(e) => updateSlot(activeIndex, { fontSize: Number(e.target.value) })} className="w-full accent-luxury-gold" />
                  </label>
                  <select
                    value={active.font}
                    onChange={(e) => updateSlot(activeIndex, { font: e.target.value })}
                    className="w-full bg-luxury-dark border border-gold-200/40 rounded-lg px-3 py-2 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold"
                  >
                    {FONTS.map((f) => (
                      <option key={f.key} value={f.key}>{f.label}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                    <label className="space-y-1 block">
                      <span className="flex justify-between">Position X <span>{active.posX}%</span></span>
                      <input type="range" min={0} max={100} value={active.posX} onChange={(e) => updateSlot(activeIndex, { posX: Number(e.target.value) })} className="w-full accent-luxury-gold" />
                    </label>
                    <label className="space-y-1 block">
                      <span className="flex justify-between">Position Y <span>{active.posY}%</span></span>
                      <input type="range" min={0} max={100} value={active.posY} onChange={(e) => updateSlot(activeIndex, { posY: Number(e.target.value) })} className="w-full accent-luxury-gold" />
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Text Color</span>
                    {['#FFFFFF', '#000000'].map((c) => (
                      <button
                        key={c}
                        onClick={() => updateSlot(activeIndex, { textColor: c })}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer ${active.textColor === c ? 'border-luxury-gold' : 'border-gold-200/30'}`}
                        style={{ background: c }}
                      />
                    ))}
                    <input
                      type="text"
                      value={active.textColor}
                      onChange={(e) => updateSlot(activeIndex, { textColor: e.target.value })}
                      className="w-24 bg-luxury-dark border border-gold-200/40 rounded-lg px-2 py-1 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => fileInputs.current[activeIndex]?.click()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-gold-200/40 text-sm font-semibold text-luxury-accent hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" strokeWidth={2} /> Replace
                  </button>
                  <button
                    onClick={() => removeImage(activeIndex)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2} /> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ZineFaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between text-left gap-4 group cursor-pointer"
      >
        <span className="text-sm md:text-base font-medium text-luxury-accent group-hover:text-luxury-gold transition-colors">
          {q}
        </span>
        <span
          className="text-luxury-gold flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </span>
      </button>
      <div className={`faq-answer ${open ? 'open' : ''}`}>
        <p className="text-sm text-gray-400 pb-5 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}
