export type ExportFileType = 'pdf-print' | 'pdf-standard' | 'png' | 'jpeg';
export type PageSelection = 'all' | 'current' | 'selected' | 'custom';
export type ImageQualityPreset = 'standard' | 'high' | 'print';

export interface ExportOptions {
  fileType: ExportFileType;
  pageSelection: PageSelection;
  customRange: string; // e.g. "1,3,5-8" — only read when pageSelection === 'custom'
  includeBleed: boolean;
  cropMarks: boolean;
  imageQuality: ImageQualityPreset; // PNG/JPEG only
  jpegQuality: number; // 0-1, JPEG only
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  fileType: 'pdf-print',
  pageSelection: 'all',
  customRange: '',
  includeBleed: true,
  cropMarks: false,
  imageQuality: 'high',
  jpegQuality: 0.9,
};

export type ExportPhase = 'idle' | 'preflight' | 'rendering' | 'done' | 'error' | 'cancelled';

export interface ExportProgress {
  phase: ExportPhase;
  currentPage: number;
  totalPages: number;
  message: string;
  errorMessage?: string;
}
