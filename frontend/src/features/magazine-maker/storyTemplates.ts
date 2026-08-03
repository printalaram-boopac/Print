import { Cake, Gem, Plane, PartyPopper, type LucideIcon } from 'lucide-react';
import type { LayoutSlot } from './constants';

// The six fixed pages of the photobook, in order. Unlike the old freeform
// mode (one AI-generated background image per page), every page here has a
// hand-designed decorative layout and pre-written copy — the same "real
// magazine" look every time, with zero AI calls required. Only the photo
// slots are left for the user to fill; everything else (titles, quotes,
// decorations) ships ready to print.
export type StorySlot = LayoutSlot & { id: string; label?: string; icon?: LucideIcon; rotateDeg?: number };

export interface StoryTemplate {
  key: string;
  kind: 'cover-thankyou' | 'cover-title' | 'chapter';
  chapterNumber?: string; // e.g. "CHAPTER 01"
  slots: StorySlot[];
}

export const STORY_TEMPLATES: StoryTemplate[] = [
  {
    key: 'cover-thankyou',
    kind: 'cover-thankyou',
    slots: [{ id: 'main', xPct: 50, yPct: 54, widthPct: 84, heightPct: 46 }],
  },
  {
    key: 'cover-title',
    kind: 'cover-title',
    slots: [{ id: 'main', xPct: 50, yPct: 66, widthPct: 86, heightPct: 50 }],
  },
  {
    key: 'chapter-1',
    kind: 'chapter',
    chapterNumber: 'CHAPTER 01',
    slots: [
      { id: 'big', xPct: 73.5, yPct: 30, widthPct: 47, heightPct: 32 },
      { id: 'small-1', xPct: 61.75, yPct: 63, widthPct: 22, heightPct: 30 },
      { id: 'small-2', xPct: 85.25, yPct: 63, widthPct: 22, heightPct: 30 },
    ],
  },
  {
    key: 'chapter-2',
    kind: 'chapter',
    chapterNumber: 'CHAPTER 02',
    slots: [
      { id: 'tl', xPct: 27, yPct: 40, widthPct: 44, heightPct: 24 },
      { id: 'tr', xPct: 73, yPct: 40, widthPct: 44, heightPct: 24 },
      { id: 'bl', xPct: 27, yPct: 66, widthPct: 44, heightPct: 24 },
      { id: 'br', xPct: 73, yPct: 66, widthPct: 44, heightPct: 24 },
    ],
  },
  {
    key: 'chapter-3',
    kind: 'chapter',
    chapterNumber: 'CHAPTER 03',
    slots: [
      { id: 'polaroid-1', xPct: 75, yPct: 22, widthPct: 40, heightPct: 20, rotateDeg: -3 },
      { id: 'polaroid-2', xPct: 75, yPct: 45, widthPct: 40, heightPct: 20, rotateDeg: 2 },
      { id: 'polaroid-3', xPct: 75, yPct: 68, widthPct: 40, heightPct: 20, rotateDeg: -2 },
      { id: 'wide', xPct: 50, yPct: 90, widthPct: 94, heightPct: 17 },
    ],
  },
  {
    key: 'chapter-4',
    kind: 'chapter',
    chapterNumber: 'CHAPTER 04',
    slots: [
      { id: 'big', xPct: 30, yPct: 46, widthPct: 52, heightPct: 60 },
      { id: 'birthday', xPct: 80, yPct: 25, widthPct: 34, heightPct: 24, label: 'Birthday', icon: Cake },
      { id: 'festival', xPct: 80, yPct: 51, widthPct: 34, heightPct: 24, label: 'Festival', icon: PartyPopper },
      { id: 'wedding', xPct: 30, yPct: 80, widthPct: 52, heightPct: 20, label: 'Wedding', icon: Gem },
      { id: 'trip', xPct: 80, yPct: 80, widthPct: 34, heightPct: 20, label: 'Trip', icon: Plane },
    ],
  },
];

export interface ChapterCopy {
  title: string;
  subtitle?: string;
  quote: string;
}

// Default copy — good enough to print with zero AI calls; "Generate My
// Magazine" can optionally personalize the quotes further via AI text.
export const DEFAULT_CHAPTER_COPY: ChapterCopy[] = [
  { title: 'Every Memory Has a Story', subtitle: 'WHEN FAMILY BECOMES YOUR BEST FRIEND.', quote: 'Some moments become memories, and those memories become our treasure forever.' },
  { title: "Moments We'll Never Forget", quote: 'Happiness is spending time with people who feel like home.' },
  { title: 'Dear {name}...', quote: 'Thank you for every laugh, every memory, every celebration, and every moment you’ve shared with me.' },
  { title: 'Our Best Days Together', subtitle: 'Some of my favorite memories with my favorite people.', quote: 'Good times + Crazy friends = Amazing memories.' },
];
