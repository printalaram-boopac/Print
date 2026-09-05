export type PageType = 'cover' | 'connection' | 'celebration' | 'letter' | 'milestone' | 'closing';

export type NarrativeBeat = 'invitation' | 'connection' | 'peak' | 'reflection' | 'milestone' | 'closing';

export type TextRole = 'chapterLabel' | 'title' | 'quote' | 'caption';

export interface PhotoElement {
  kind: 'photo';
  id: string;
  imgSrc: string | null;
  img: HTMLImageElement | null;
  xPct: number; // center x, 0-100
  yPct: number; // center y, 0-100
  widthPct: number; // 0-100 of page width
  heightPct: number; // 0-100 of page height
  rounded: number; // 0-20, % of min(w,h)
  isFullBleed: boolean;
  rotationDeg: number;
}

export interface TextElement {
  kind: 'text';
  id: string;
  role: TextRole;
  text: string;
  xPct: number;
  yPct: number;
  align: 'left' | 'center' | 'right';
  color: string;
  font: string;
  fontSizePct: number; // font size as a percentage of page height
  rotationDeg: number;
}

export type PageElement = PhotoElement | TextElement;

export interface MagazinePage {
  index: number;
  pageType: PageType;
  narrativeBeat: NarrativeBeat;
  photos: PhotoElement[];
  texts: TextElement[];
  bgColor: string;
}

export interface MagazineProject {
  recipientName: string;
  relationshipTerm: string;
  occasion: string;
  themeColor: string;
  pages: MagazinePage[];
}
