import {
  Sparkles, Star,
  Heart, Cake, Users, Gem, Plane, Award, Baby, Gift, HeartHandshake, PartyPopper, PawPrint, GraduationCap,
  Leaf, Images, ScrollText, Square, Flower2, Moon, TreeDeciduous, BookOpen,
  LayoutPanelLeft, Grid2x2, Layers,
  type LucideIcon,
} from 'lucide-react';
import type { SizeKey } from './types';

export const PAGE_COUNT = 6;
export const PATH = '/photo-zine-maker';

// Example prompts by topic, matched to the reference photobook styles
// (romantic couple album, birthday scrapbook, family memory book, etc.)
// Icons (not emoji) so every option renders consistently on-brand in gold, regardless of OS/browser.
export const TOPIC_PROMPTS: { icon: LucideIcon; label: string; prompt: string }[] = [
  { icon: Heart, label: 'Couple', prompt: 'luxury romance theme, delicate hearts, soft rose petals, minimal floral line art, blush pink and champagne gold palette, elegant editorial love-story aesthetic' },
  { icon: Cake, label: 'Birthday', prompt: 'birthday theme, gold and cream palette, minimal confetti and balloon illustrations, small cake icon accents, rounded soft frames, minimal festive doodles' },
  { icon: Users, label: 'Family', prompt: 'family theme, warm beige palette, minimal botanical leaf illustrations, editorial coffee-table-book styling, soft cozy warmth' },
  { icon: Gem, label: 'Wedding', prompt: 'luxury wedding invitation theme, floral gold foil accents, delicate leaf illustrations, elegant ring motifs, regal champagne and gold palette' },
  { icon: Plane, label: 'Travel', prompt: 'travel adventure journal theme, minimal passport stamp illustrations, map line-art accents, small ticket and airplane icon motifs, polaroid-style corner accents, warm sunset palette' },
  { icon: Award, label: 'Milestone', prompt: 'achievement and milestone celebration theme, gold confetti accents, elegant certificate-style border, celebratory ribbon motifs, navy and gold palette' },
  { icon: Baby, label: 'Baby', prompt: 'baby theme, pastel blue and pastel pink palette, minimal cloud, star and moon illustrations, gentle teddy-bear line-art accents, tender newborn keepsake style' },
  { icon: Gift, label: 'Anniversary', prompt: 'anniversary theme, gold foil accents, champagne palette, luxury flower illustrations, elegant refined editorial spacing, timeless romantic glow' },
  { icon: HeartHandshake, label: 'Friendship', prompt: 'friendship scrapbook theme, minimal polaroid and washi-tape illustrations, handwritten-note style accents, playful yet minimal doodles, warm sunny palette' },
  { icon: PartyPopper, label: 'Festival', prompt: 'Indian festival theme, minimal diya lamp and rangoli-inspired gold pattern accents, warm fairy-light glow, deep green and gold palette, cozy festive elegance' },
  { icon: PawPrint, label: 'Pet', prompt: 'pet memory theme, playful minimal paw-print motifs, soft pastel palette, gentle bone and paw line-art accents, cheerful warm styling' },
  { icon: GraduationCap, label: 'Graduation', prompt: 'graduation theme, navy and gold palette, minimal academic cap and certificate illustrations, small book icon accents, proud achievement editorial styling' },
];

// Frame styles matched to the premium hardcover-book reference pages
// (gold foil florals, chapter-page botanical sprigs, scrapbook accents, etc.)
export const FRAME_PROMPTS: { icon: LucideIcon; label: string; prompt: string }[] = [
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
  { icon: Star, label: 'Gen Z Aesthetic', prompt: 'clean ivory background, minimal Pinterest-style aesthetic layout, thin gold hairline dividers, tiny hand-drawn heart and star doodles in the corner, soft neutral tones, generous white space, trendy modern minimalist yet warm and attractive scrapbook vibe' },
];

// Topic and frame style are independent picks that combine into one prompt
// (e.g. "Wedding" + "Gold Foil Luxury"), rather than one overwriting the other.
export function combineTopicAndFrame(topicLabel: string | null, frameLabel: string | null): string {
  const topic = TOPIC_PROMPTS.find((t) => t.label === topicLabel)?.prompt;
  const frame = FRAME_PROMPTS.find((f) => f.label === frameLabel)?.prompt;
  return [topic, frame].filter(Boolean).join(', ');
}

// Auto-picks a matching frame style per topic, so Auto-Design doesn't require
// the user to also manually choose a frame — just the topic.
export const TOPIC_TO_FRAME: Record<string, string> = {
  Couple: 'Watercolor Floral',
  Birthday: 'Gen Z Aesthetic',
  Family: 'Botanical Chapter',
  Wedding: 'Gold Foil Luxury',
  Travel: 'Vintage Parchment',
  Milestone: 'Art Deco Glam',
  Baby: 'Dreamy Pastel',
  Anniversary: 'Gold Foil Luxury',
  Friendship: 'Watercolor Floral',
  Festival: 'Rustic Kraft',
  Pet: 'Gen Z Aesthetic',
  Graduation: 'Art Deco Glam',
};

export const FONTS = [
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

export const SIZES = [{ key: 'S' }, { key: 'M' }, { key: 'L' }] as const;

// Quick-preset starting font sizes (in canvas px, against the 800px-wide
// reference canvas) — the resize handle then adjusts fontSizePx continuously
// from there, so these are just a starting point, not a hard tier.
export const DEFAULT_TEXT_SIZE_PX: Record<SizeKey, number> = { S: 20, M: 28, L: 40 };

export const GRADIENT_PRESETS = [
  { label: 'Gold Shine', from: '#FFD700', to: '#B8860B' },
  { label: 'Sunset', from: '#FF512F', to: '#F09819' },
  { label: 'Ocean', from: '#2193B0', to: '#6DD5ED' },
  { label: 'Berry', from: '#DA22FF', to: '#9733EE' },
  { label: 'Rose', from: '#F857A6', to: '#FF5858' },
];

// Preset multi-photo grid arrangements — an alternative to placing every
// photo by hand. Each slot is a percentage-based (xPct/yPct/widthPct/heightPct)
// box, the same coordinate system PhotoItem already uses, so applying a layout
// is just re-assigning those numbers; the result stays fully draggable/resizable
// afterward like any other photo.
export interface LayoutSlot {
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
}

export interface PhotoLayout {
  key: string;
  label: string;
  icon: LucideIcon;
  slots: LayoutSlot[];
}

export const PHOTO_LAYOUTS: PhotoLayout[] = [
  {
    key: 'single',
    label: 'Single',
    icon: Square,
    slots: [{ xPct: 50, yPct: 50, widthPct: 80, heightPct: 65 }],
  },
  {
    key: 'big-plus-two',
    label: 'Big + 2',
    icon: LayoutPanelLeft,
    slots: [
      { xPct: 32, yPct: 50, widthPct: 55, heightPct: 65 },
      { xPct: 76, yPct: 27, widthPct: 40, heightPct: 28 },
      { xPct: 76, yPct: 65, widthPct: 40, heightPct: 28 },
    ],
  },
  {
    key: 'grid-2x2',
    label: 'Grid',
    icon: Grid2x2,
    slots: [
      { xPct: 27, yPct: 27, widthPct: 45, heightPct: 40 },
      { xPct: 73, yPct: 27, widthPct: 45, heightPct: 40 },
      { xPct: 27, yPct: 70, widthPct: 45, heightPct: 40 },
      { xPct: 73, yPct: 70, widthPct: 45, heightPct: 40 },
    ],
  },
  {
    key: 'stack-3',
    label: 'Stack',
    icon: Layers,
    slots: [
      { xPct: 50, yPct: 20, widthPct: 65, heightPct: 28 },
      { xPct: 50, yPct: 50, widthPct: 65, heightPct: 28 },
      { xPct: 50, yPct: 80, widthPct: 65, heightPct: 28 },
    ],
  },
];

export function getPhotoLayout(key: string | null): PhotoLayout | undefined {
  return PHOTO_LAYOUTS.find((l) => l.key === key);
}

export const FOLD_STEPS = [
  'Cut the borders of the printed sheet.',
  'Fold the paper in half longways, following the line. Unfold it.',
  'Fold the paper in half sideways, following the lines. Fold it again in half sideways.',
  'Unfold everything. You should see 8 rectangles.',
  'Fold the paper sideways again. Cut ONLY the center fold halfway (dashed line).',
  'Unfold slightly, then push the two sides inward to form a small book. Fold it flat — now you have your mini magazine!',
  'Enjoy your printed photos, cover to cover.',
];
