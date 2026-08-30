import { ImagePlus, Info, Upload } from 'lucide-react';
import { PanelSection } from '../controls';

interface ImagesPanelProps {
  /** Photos uploaded in this session, most recent first. */
  uploads: string[];
  onPickFiles: () => void;
  /** Places an uploaded photo into the selected frame, or a new frame. */
  onUseImage: (src: string) => void;
  /** True when a frame is selected, so the label can say what will happen. */
  hasSelectedFrame: boolean;
}

/** Uploads: bring photos in, then drop them into frames. */
export default function ImagesPanel({ uploads, onPickFiles, onUseImage, hasSelectedFrame }: ImagesPanelProps) {
  return (
    <div className="space-y-6 p-4">
      <PanelSection title="Your photos">
        <button
          type="button"
          onClick={onPickFiles}
          className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-gold-300 bg-amber-50/40 px-4 py-6 text-center transition-colors hover:border-luxury-gold hover:bg-amber-50"
        >
          <Upload className="h-5 w-5 text-luxury-gold" />
          <span className="text-xs font-semibold text-luxury-accent">Upload photos</span>
          <span className="text-[10px] text-gray-400">JPG, PNG, WebP or AVIF</span>
        </button>

        {uploads.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {uploads.map((src, i) => (
              <button
                key={`${src.slice(-24)}-${i}`}
                type="button"
                onClick={() => onUseImage(src)}
                title={hasSelectedFrame ? 'Put this photo in the selected frame' : 'Add this photo to the page'}
                className="group relative aspect-square overflow-hidden rounded-lg border border-gold-200/50 bg-luxury-gray transition-all hover:border-luxury-gold"
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-luxury-accent/70 opacity-0 transition-opacity group-hover:opacity-100">
                  <ImagePlus className="h-4 w-4 text-white" />
                </span>
              </button>
            ))}
          </div>
        )}
      </PanelSection>

      <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-gray-400">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        {hasSelectedFrame
          ? 'A frame is selected — tapping a photo replaces the photo inside it.'
          : 'Select a frame on the page first to fill it, or tap a photo to add it as a new frame.'}
      </p>
    </div>
  );
}
