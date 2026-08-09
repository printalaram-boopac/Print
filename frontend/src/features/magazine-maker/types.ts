export type PageLayoutType = 
  | 'cover'
  | 'editorial_spread'
  | 'quad_grid'
  | 'bento_showcase'
  | 'full_bleed'
  | 'back_cover';

export interface PhotoSlot {
  id: string;
  src?: string | null;
  caption?: string;
  zoom?: number; // 1 to 2
  filter?: 'normal' | 'bw' | 'sepia' | 'vintage' | 'vivid';
  aspectRatio?: string;
  colSpan?: string;
  rowSpan?: string;
  zIndex?: number;
  hidden?: boolean;
}

export interface TextOverlay {
  id: string;
  text: string;
  fontSize: number; // in px
  fontFamily: string;
  color: string;
  align: 'left' | 'center' | 'right';
  xPct: number; // 0 to 100
  yPct: number; // 0 to 100
  isHeader?: boolean;
  fontWeight?: 'normal' | 'bold' | '900';
  fontStyle?: 'normal' | 'italic';
  zIndex?: number;
  hidden?: boolean;
}

export interface MagazinePage {
  id: string;
  title: string;
  pageNumber: number;
  layout: PageLayoutType;
  slots: PhotoSlot[];
  subtitle?: string;
  editorialText?: string;
  textOverlays: TextOverlay[];
  backgroundColor?: string;
}

export interface MagazineConfig {
  title: string;
  subtitle: string;
  issueNumber: string;
  dateString: string;
  editorName: string;
  themeColor: string;
  fontFamily: string;
  pages: MagazinePage[];
}
