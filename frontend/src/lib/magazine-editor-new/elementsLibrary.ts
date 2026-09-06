import type {
  ElementLibraryItem, TemplateElement, ShapeType, FrameShape, LineStyle,
} from './types';
import { CANVA_MEDIA } from './templates/luxuryFashionCanvaPack';
import { ALL_CANVA_GRAPHIC_ITEMS } from './canvaCollectionsLibrary';

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

const ACCENT = '#B8895A';
const INK = '#1C2024';

function baseShape(shapeType: ShapeType, opts: Partial<TemplateElement> = {}): TemplateElement {
  const isHeart = shapeType === 'heart';
  const isWide = shapeType === 'banner' || shapeType === 'pill' || shapeType === 'callout' || shapeType === 'speech-bubble';
  const isTall = shapeType === 'arch' || shapeType === 'bookmark';
  const defaultHeight = isHeart ? 18.5 : isWide ? 15 : isTall ? 26 : 21;
  return {
    id: nextId('shape'), kind: 'shape', shapeType,
    xPct: 50, yPct: 50, widthPct: 30, heightPct: defaultHeight,
    rotationDeg: 0, opacity: 100, fill: ACCENT, borderColor: INK, borderWidth: 0, borderStyle: 'solid',
    borderRadius: shapeType === 'rounded-rectangle' ? 12 : 0, zIndex: 0, locked: false,
    ...opts,
  };
}

function baseLine(lineStyle: LineStyle, opts: Partial<TemplateElement> = {}): TemplateElement {
  return {
    id: nextId('line'), kind: 'line',
    xPct: 50, yPct: 50, widthPct: 40, heightPct: 2,
    rotationDeg: 0, opacity: 100, borderColor: INK, strokeWidth: 2, lineStyle,
    arrowStart: false, arrowEnd: false, zIndex: 0, locked: false,
    ...opts,
  };
}

function baseIcon(iconName: string, opts: Partial<TemplateElement> = {}): TemplateElement {
  return {
    id: nextId('icon'), kind: 'icon', iconName, iconColor: INK,
    xPct: 50, yPct: 50, widthPct: 10, heightPct: 10,
    rotationDeg: 0, opacity: 100, flipX: false, flipY: false, zIndex: 0, locked: false,
    ...opts,
  };
}

function baseFrame(frameShape: FrameShape, opts: Partial<TemplateElement> = {}): TemplateElement {
  return {
    id: nextId('frame'), kind: 'image', frameShape,
    imgSrc: null, originalSrc: null,
    xPct: 50, yPct: 50, widthPct: 40, heightPct: frameShape === 'circle' || frameShape === 'oval' ? 30 : 45,
    rotationDeg: 0, opacity: 100, flipX: false, flipY: false,
    borderRadius: frameShape === 'rounded' ? 8 : 0, borderWidth: 0, borderColor: INK,
    cropXPct: 50, cropYPct: 50, cropZoom: 1, fit: 'fill', zIndex: 0, locked: false,
    ...opts,
  };
}

function baseBadgeText(content: string, opts: Partial<TemplateElement> = {}): TemplateElement {
  return {
    id: nextId('text'), kind: 'text', role: 'caption', content,
    xPct: 50, yPct: 50, widthPct: 30, heightPct: 6,
    rotationDeg: 0, opacity: 100, borderColor: '#FFFFFF', badgeColor: INK, borderRadius: 20,
    zIndex: 0, locked: false,
    ...opts,
  };
}

// --- Shapes with diverse Canva modern colors ---
const SHAPES: ElementLibraryItem[] = ([
  ['square', 'Square', '#00C4CC'],
  ['rounded-rectangle', 'Rounded Rectangle', '#8B3DFF'],
  ['rectangle', 'Rectangle', '#7D2AE8'],
  ['circle', 'Circle', '#FF5263'],
  ['triangle', 'Triangle Up', '#00C853'],
  ['triangle-down', 'Triangle Down', '#00C853'],
  ['diamond', 'Diamond', '#008BE3'],
  ['pentagon', 'Pentagon', '#7D2AE8'],
  ['hexagon', 'Hexagon', '#00C4CC'],
  ['octagon', 'Octagon', '#7D2AE8'],
  ['chamfered-rectangle', 'Chamfered Rectangle', '#FF9600'],
  ['star-4', '4-Point Star', '#FF5263'],
  ['star', '5-Point Star', '#FFD13B'],
  ['star-6', '6-Point Star', '#8B3DFF'],
  ['star-8', '8-Point Star', '#00C4CC'],
  ['star-10', '10-Point Star', '#FF9600'],
  ['star-12', '12-Point Burst', '#FFD13B'],
  ['burst-16', '16-Point Burst', '#FF5263'],
  ['burst-24', '24-Point Burst', '#7D2AE8'],
  ['burst-32', '32-Point Burst', '#008BE3'],
  ['arrow-right', 'Arrow Right', '#8B3DFF'],
  ['arrow-left', 'Arrow Left', '#8B3DFF'],
  ['arrow-up', 'Arrow Up', '#00C4CC'],
  ['arrow-down', 'Arrow Down', '#00C4CC'],
  ['arrow-bidirectional-h', 'Horizontal Arrow', '#008BE3'],
  ['arrow-bidirectional-v', 'Vertical Arrow', '#008BE3'],
  ['arrow-pentagon', 'Pentagon Arrow', '#FF9600'],
  ['chevron-arrow', 'Chevron Arrow', '#00C853'],
  ['banner', 'Ribbon Banner', '#8B3DFF'],
  ['pointed-hexagon', 'Pointed Hexagon', '#00C4CC'],
  ['pill', 'Pill Shape', '#00C4CC'],
  ['callout', 'Callout Bubble', '#FF9600'],
  ['speech-bubble', 'Speech Bubble', '#7D2AE8'],
  ['heart', 'Heart', '#FF5263'],
  ['cross', 'Cross Plus', '#00C4CC'],
  ['cloud', 'Cloud', '#008BE3'],
  ['shield', 'Shield', '#008BE3'],
  ['bookmark', 'Bookmark', '#FF5263'],
  ['ellipse', 'Ellipse', '#FF9600'],
  ['polygon', 'Polygon', '#7D2AE8'],
  ['trapezoid', 'Trapezoid', '#FF9600'],
  ['parallelogram', 'Parallelogram', '#00C853'],
  ['tag', 'Price Tag Shape', '#FF5263'],
  ['flower', 'Flower Petals', '#8B3DFF'],
  ['badge', 'Star Badge', '#FFD13B'],
  ['blob', 'Organic Blob', '#00C853'],
  ['arch', 'Arch', '#008BE3'],
] as [ShapeType, string, string][]).map(([type, name, color]) => ({
  id: `shape-${type}`, name, category: 'Shapes' as const, type: 'shape' as const,
  tags: [type, 'shape', name.toLowerCase()], isPremium: false,
  create: () => [baseShape(type, { fill: color })],
}));

// --- Lines ---
const LINES: ElementLibraryItem[] = [
  { id: 'line-straight', name: 'Straight Line', category: 'Lines', type: 'line', tags: ['line', 'straight', 'divider'], isPremium: false, create: () => [baseLine('solid')] },
  { id: 'line-thin', name: 'Thin Divider', category: 'Lines', type: 'line', tags: ['line', 'divider', 'thin'], isPremium: false, create: () => [baseLine('solid', { strokeWidth: 1 })] },
  { id: 'line-thick', name: 'Thick Divider', category: 'Lines', type: 'line', tags: ['line', 'divider', 'thick'], isPremium: false, create: () => [baseLine('solid', { strokeWidth: 5 })] },
  { id: 'line-dashed', name: 'Dashed Line', category: 'Lines', type: 'line', tags: ['line', 'dashed'], isPremium: false, create: () => [baseLine('dashed')] },
  { id: 'line-dotted', name: 'Dotted Line', category: 'Lines', type: 'line', tags: ['line', 'dotted'], isPremium: false, create: () => [baseLine('dotted')] },
  { id: 'line-arrow', name: 'Arrow Line', category: 'Lines', type: 'line', tags: ['line', 'arrow'], isPremium: false, create: () => [baseLine('solid', { arrowEnd: true })] },
  { id: 'line-double-arrow', name: 'Double Arrow', category: 'Lines', type: 'line', tags: ['line', 'arrow', 'double'], isPremium: false, create: () => [baseLine('solid', { arrowStart: true, arrowEnd: true })] },
  { id: 'line-purple', name: 'Purple Accent Line', category: 'Lines', type: 'line', tags: ['line', 'purple', 'color'], isPremium: false, create: () => [baseLine('solid', { borderColor: '#8B3DFF', strokeWidth: 3 })] },
  { id: 'line-coral', name: 'Coral Divider', category: 'Lines', type: 'line', tags: ['line', 'coral', 'color'], isPremium: false, create: () => [baseLine('solid', { borderColor: '#FF5263', strokeWidth: 2 })] },
  { id: 'line-cyan-dashed', name: 'Cyan Dashed', category: 'Lines', type: 'line', tags: ['line', 'cyan', 'dashed'], isPremium: false, create: () => [baseLine('dashed', { borderColor: '#00C4CC', strokeWidth: 2 })] },
];

// --- Frames ---
const FRAMES: ElementLibraryItem[] = ([
  ['rect', 'Rectangle Frame'],
  ['rounded', 'Rounded Frame'],
  ['circle', 'Circle Frame'],
  ['oval', 'Oval Frame'],
  ['arch', 'Arch Frame'],
  ['polaroid', 'Polaroid Frame'],
  ['heart', 'Heart Photo Frame'],
  ['star', 'Star Photo Frame'],
  ['diamond', 'Diamond Photo Frame'],
  ['badge', 'Badge Photo Frame'],
] as [FrameShape, string][]).map(([shape, name]) => ({
  id: `frame-${shape}`, name, category: 'Frames' as const, type: 'image' as const,
  tags: ['frame', 'photo', 'image', shape], isPremium: false,
  create: () => [baseFrame(shape)],
}));
FRAMES.push(
  { id: 'frame-portrait', name: 'Portrait Frame', category: 'Frames', type: 'image', tags: ['frame', 'photo', 'portrait'], isPremium: false, create: () => [baseFrame('rect', { widthPct: 32, heightPct: 48 })] },
  { id: 'frame-landscape', name: 'Landscape Frame', category: 'Frames', type: 'image', tags: ['frame', 'photo', 'landscape'], isPremium: false, create: () => [baseFrame('rect', { widthPct: 55, heightPct: 32 })] },
  { id: 'frame-square-bordered', name: 'Framed Square Photo', category: 'Frames', type: 'image', tags: ['frame', 'square', 'border'], isPremium: false, create: () => [baseFrame('rect', { widthPct: 35, heightPct: 35, borderWidth: 4, borderColor: '#8B3DFF' })] },
  { id: 'frame-magazine-cutout', name: 'Magazine Cutout', category: 'Frames', type: 'image', tags: ['frame', 'photo', 'editorial'], isPremium: false, create: () => [baseFrame('rounded', { borderRadius: 2, rotationDeg: -2 })] },
  { id: 'frame-tilted-polaroid', name: 'Tilted Polaroid', category: 'Frames', type: 'image', tags: ['frame', 'polaroid', 'tilt'], isPremium: false, create: () => [baseFrame('polaroid', { rotationDeg: 3, widthPct: 36, heightPct: 44 })] },
);

// --- Grids ---
const GRIDS: ElementLibraryItem[] = [
  { id: 'grid-2col', name: '2 Equal Columns', category: 'Grids', type: 'image', tags: ['grid', 'columns', 'layout'], isPremium: false, create: () => [baseFrame('rect', { xPct: 26, yPct: 50, widthPct: 46, heightPct: 90 }), baseFrame('rect', { xPct: 74, yPct: 50, widthPct: 46, heightPct: 90 })] },
  { id: 'grid-3col', name: '3 Equal Columns', category: 'Grids', type: 'image', tags: ['grid', 'columns', 'layout'], isPremium: false, create: () => [baseFrame('rect', { xPct: 18, yPct: 50, widthPct: 29, heightPct: 90 }), baseFrame('rect', { xPct: 50, yPct: 50, widthPct: 29, heightPct: 90 }), baseFrame('rect', { xPct: 82, yPct: 50, widthPct: 29, heightPct: 90 })] },
  { id: 'grid-2row', name: '2 Rows', category: 'Grids', type: 'image', tags: ['grid', 'rows', 'layout'], isPremium: false, create: () => [baseFrame('rect', { xPct: 50, yPct: 26, widthPct: 90, heightPct: 46 }), baseFrame('rect', { xPct: 50, yPct: 74, widthPct: 90, heightPct: 46 })] },
  { id: 'grid-3row', name: '3 Horizontal Rows', category: 'Grids', type: 'image', tags: ['grid', 'rows', 'three'], isPremium: false, create: () => [
    baseFrame('rect', { xPct: 50, yPct: 18, widthPct: 90, heightPct: 28 }),
    baseFrame('rect', { xPct: 50, yPct: 50, widthPct: 90, heightPct: 28 }),
    baseFrame('rect', { xPct: 50, yPct: 82, widthPct: 90, heightPct: 28 }),
  ] },
  { id: 'grid-2x2', name: '2x2 Grid', category: 'Grids', type: 'image', tags: ['grid', '2x2', 'layout'], isPremium: false, create: () => [
    baseFrame('rect', { xPct: 26, yPct: 26, widthPct: 46, heightPct: 46 }),
    baseFrame('rect', { xPct: 74, yPct: 26, widthPct: 46, heightPct: 46 }),
    baseFrame('rect', { xPct: 26, yPct: 74, widthPct: 46, heightPct: 46 }),
    baseFrame('rect', { xPct: 74, yPct: 74, widthPct: 46, heightPct: 46 }),
  ] },
  { id: 'grid-3x2', name: '3x2 Grid', category: 'Grids', type: 'image', tags: ['grid', '3x2', 'layout'], isPremium: false, create: () => [
    baseFrame('rect', { xPct: 18, yPct: 26, widthPct: 29, heightPct: 46 }),
    baseFrame('rect', { xPct: 50, yPct: 26, widthPct: 29, heightPct: 46 }),
    baseFrame('rect', { xPct: 82, yPct: 26, widthPct: 29, heightPct: 46 }),
    baseFrame('rect', { xPct: 18, yPct: 74, widthPct: 29, heightPct: 46 }),
    baseFrame('rect', { xPct: 50, yPct: 74, widthPct: 29, heightPct: 46 }),
    baseFrame('rect', { xPct: 82, yPct: 74, widthPct: 29, heightPct: 46 }),
  ] },
  { id: 'grid-hero-2thumb', name: 'Hero + 2 Thumbnails', category: 'Grids', type: 'image', tags: ['grid', 'hero', 'layout'], isPremium: false, create: () => [
    baseFrame('rect', { xPct: 50, yPct: 32, widthPct: 90, heightPct: 55 }),
    baseFrame('rect', { xPct: 26, yPct: 78, widthPct: 44, heightPct: 30 }),
    baseFrame('rect', { xPct: 74, yPct: 78, widthPct: 44, heightPct: 30 }),
  ] },
  { id: 'grid-large-small', name: 'Large + Small', category: 'Grids', type: 'image', tags: ['grid', 'layout'], isPremium: false, create: () => [
    baseFrame('rect', { xPct: 32, yPct: 50, widthPct: 58, heightPct: 90 }),
    baseFrame('rect', { xPct: 78, yPct: 50, widthPct: 34, heightPct: 90 }),
  ] },
  { id: 'grid-editorial-asymmetric', name: 'Editorial Asymmetric', category: 'Grids', type: 'image', tags: ['grid', 'editorial', 'layout'], isPremium: false, create: () => [
    baseFrame('rect', { xPct: 30, yPct: 30, widthPct: 50, heightPct: 50 }),
    baseFrame('rect', { xPct: 76, yPct: 20, widthPct: 36, heightPct: 28 }),
    baseFrame('rect', { xPct: 76, yPct: 60, widthPct: 36, heightPct: 44 }),
  ] },
  { id: 'grid-contact-sheet', name: 'Contact Sheet', category: 'Grids', type: 'image', tags: ['grid', 'contact sheet', 'layout'], isPremium: false, create: () => [1, 2, 3, 4, 5, 6].map((i) => {
    const col = (i - 1) % 3, row = Math.floor((i - 1) / 3);
    return baseFrame('rect', { xPct: 18 + col * 32, yPct: 30 + row * 42, widthPct: 27, heightPct: 34 });
  }) },
  { id: 'grid-canva-listicle-stack', name: 'Listicle 3-Photo Stack', category: 'Grids', type: 'image', tags: ['grid', 'listicle', 'canva', 'stack', 'fashion'], isPremium: false, create: () => [
    baseFrame('rounded', { xPct: 50, yPct: 20, widthPct: 80, heightPct: 24, borderRadius: 6 }),
    baseFrame('rounded', { xPct: 50, yPct: 50, widthPct: 80, heightPct: 24, borderRadius: 6 }),
    baseFrame('rounded', { xPct: 50, yPct: 80, widthPct: 80, heightPct: 24, borderRadius: 6 }),
  ] },
  { id: 'grid-canva-editorial-split', name: 'Editorial 2-Photo Split', category: 'Grids', type: 'image', tags: ['grid', 'editorial', 'split', 'duo', 'fashion'], isPremium: false, create: () => [
    baseFrame('rounded', { xPct: 28, yPct: 50, widthPct: 42, heightPct: 65, borderRadius: 6 }),
    baseFrame('rounded', { xPct: 72, yPct: 50, widthPct: 42, heightPct: 65, borderRadius: 6 }),
  ] },
  { id: 'grid-canva-article-trio', name: 'Triple Photo Article Grid', category: 'Grids', type: 'image', tags: ['grid', 'trio', 'fashion', 'editorial'], isPremium: false, create: () => [
    baseFrame('rounded', { xPct: 22, yPct: 50, widthPct: 32, heightPct: 50, borderRadius: 6 }),
    baseFrame('rounded', { xPct: 56, yPct: 50, widthPct: 32, heightPct: 50, borderRadius: 6 }),
    baseFrame('rounded', { xPct: 86, yPct: 50, widthPct: 24, heightPct: 50, borderRadius: 6 }),
  ] },
];

// --- Icons (all 62 modern Lucide icons — 100% free) ---
const ICONS: ElementLibraryItem[] = ([
  'Heart', 'Star', 'Sparkles', 'Flame', 'Award', 'Zap', 'Gift', 'Shield',
  'ShoppingBag', 'Tag', 'Coffee', 'Music', 'Camera', 'Compass', 'Leaf',
  'Sun', 'Moon', 'Smile', 'ThumbsUp', 'MessageCircle', 'Send', 'Eye',
  'Clock', 'Bookmark', 'Feather', 'Scissors', 'Bell', 'MapPin', 'Calendar',
  'Quote', 'ArrowRight', 'Check', 'Phone', 'Mail', 'Globe', 'Instagram',
  'Facebook', 'Linkedin', 'Link', 'Crown', 'PartyPopper', 'Rocket', 'Lightbulb',
  'BadgeCheck', 'Palette', 'Gem', 'Glasses', 'Umbrella', 'Ticket', 'Footprints',
  'Anchor', 'Key', 'Plane', 'Wand2', 'Rainbow', 'Flower2', 'Cherry', 'Shirt',
  'Watch', 'Wifi', 'Play', 'Volume2',
] as const).map((iconName) => ({
  id: `icon-${iconName}`, name: iconName.replace(/([A-Z])/g, ' $1').trim(), category: 'Icons' as const, type: 'icon' as const,
  tags: [iconName.toLowerCase(), 'icon', 'graphic'], isPremium: false,
  create: () => [baseIcon(iconName, { iconColor: '#8B3DFF' })],
}));

// --- Stickers (colorful expressive Canva style stickers) ---
const STICKERS: ElementLibraryItem[] = [
  { id: 'stk-sparkle-star', name: 'Magic Sparkle', category: 'Stickers', type: 'icon', tags: ['magic', 'sparkle', 'sticker'], isPremium: false, create: () => [baseIcon('Sparkles', { iconColor: '#FFD13B', widthPct: 16, heightPct: 16 })] },
  { id: 'stk-crown-gold', name: 'Golden Crown', category: 'Stickers', type: 'icon', tags: ['crown', 'gold', 'royalty', 'sticker'], isPremium: false, create: () => [baseIcon('Crown', { iconColor: '#FFD13B', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-fire-flame', name: 'Hot Fire', category: 'Stickers', type: 'icon', tags: ['fire', 'flame', 'hot', 'lit'], isPremium: false, create: () => [baseIcon('Flame', { iconColor: '#FF5263', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-rocket-launch', name: 'Rocket Ship', category: 'Stickers', type: 'icon', tags: ['rocket', 'launch', 'space', 'boost'], isPremium: false, create: () => [baseIcon('Rocket', { iconColor: '#008BE3', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-party-popper', name: 'Party Popper', category: 'Stickers', type: 'icon', tags: ['party', 'celebration', 'confetti'], isPremium: false, create: () => [baseIcon('PartyPopper', { iconColor: '#FF9600', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-gem-diamond', name: 'Luxury Diamond', category: 'Stickers', type: 'icon', tags: ['diamond', 'gem', 'luxury', 'shine'], isPremium: false, create: () => [baseIcon('Gem', { iconColor: '#00C4CC', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-verified-badge', name: 'Verified Check', category: 'Stickers', type: 'icon', tags: ['verified', 'check', 'approved', 'blue'], isPremium: false, create: () => [baseIcon('BadgeCheck', { iconColor: '#008BE3', widthPct: 16, heightPct: 16 })] },
  { id: 'stk-lightbulb-idea', name: 'Bright Idea', category: 'Stickers', type: 'icon', tags: ['idea', 'lightbulb', 'inspire', 'bright'], isPremium: false, create: () => [baseIcon('Lightbulb', { iconColor: '#FFD13B', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-wand-magic', name: 'Magic Wand', category: 'Stickers', type: 'icon', tags: ['magic', 'wand', 'sparkle'], isPremium: false, create: () => [baseIcon('Wand2', { iconColor: '#8B3DFF', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-rainbow-vibe', name: 'Rainbow Colors', category: 'Stickers', type: 'icon', tags: ['rainbow', 'color', 'pride', 'vibe'], isPremium: false, create: () => [baseIcon('Rainbow', { iconColor: '#FF5263', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-flower-bloom', name: 'Flower Blossom', category: 'Stickers', type: 'icon', tags: ['flower', 'blossom', 'spring', 'nature'], isPremium: false, create: () => [baseIcon('Flower2', { iconColor: '#FF5263', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-cherry-sweet', name: 'Sweet Cherries', category: 'Stickers', type: 'icon', tags: ['cherry', 'sweet', 'fruit', 'red'], isPremium: false, create: () => [baseIcon('Cherry', { iconColor: '#FF5263', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-sunglasses-cool', name: 'Cool Sunglasses', category: 'Stickers', type: 'icon', tags: ['glasses', 'cool', 'summer', 'fashion'], isPremium: false, create: () => [baseIcon('Glasses', { iconColor: '#1C2024', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-coffee-cup', name: 'Coffee Vibe', category: 'Stickers', type: 'icon', tags: ['coffee', 'cup', 'morning', 'cafe'], isPremium: false, create: () => [baseIcon('Coffee', { iconColor: '#FF9600', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-music-note', name: 'Groovy Music', category: 'Stickers', type: 'icon', tags: ['music', 'sound', 'song', 'tune'], isPremium: false, create: () => [baseIcon('Music', { iconColor: '#7D2AE8', widthPct: 18, heightPct: 18 })] },
  { id: 'stk-zap-energy', name: 'Electric Zap', category: 'Stickers', type: 'icon', tags: ['zap', 'bolt', 'electric', 'power'], isPremium: false, create: () => [baseIcon('Zap', { iconColor: '#FFD13B', widthPct: 18, heightPct: 18 })] },
];

// --- Decorative ---
const DECORATIVE: ElementLibraryItem[] = [
  { id: 'deco-brush-stroke', name: 'Brush Stroke', category: 'Decorative', type: 'shape', tags: ['brush', 'stroke', 'paint'], isPremium: false, create: () => [baseShape('blob', { widthPct: 35, heightPct: 8, fill: '#8B3DFF', opacity: 70 })] },
  { id: 'deco-underline', name: 'Underline', category: 'Decorative', type: 'line', tags: ['underline', 'accent'], isPremium: false, create: () => [baseLine('solid', { widthPct: 25, strokeWidth: 3, borderColor: '#8B3DFF' })] },
  { id: 'deco-hand-circle', name: 'Hand-drawn Circle', category: 'Decorative', type: 'shape', tags: ['circle', 'hand-drawn', 'accent'], isPremium: false, create: () => [baseShape('circle', { fill: 'none', borderColor: '#FF5263', borderWidth: 2, widthPct: 20, heightPct: 20 })] },
  { id: 'deco-sparkle', name: 'Sparkle Accent', category: 'Decorative', type: 'icon', tags: ['sparkle', 'accent', 'glow'], isPremium: false, create: () => [baseIcon('Sparkles', { iconColor: '#FFD13B' })] },
  { id: 'deco-flame', name: 'Hot Flame Icon', category: 'Decorative', type: 'icon', tags: ['flame', 'fire', 'hot'], isPremium: false, create: () => [baseIcon('Flame', { iconColor: '#FF5263' })] },
  { id: 'deco-award', name: 'Award Medal', category: 'Decorative', type: 'icon', tags: ['award', 'winner', 'gold'], isPremium: false, create: () => [baseIcon('Award', { iconColor: '#FFD13B' })] },
  { id: 'deco-botanical', name: 'Botanical Leaf Art', category: 'Decorative', type: 'icon', tags: ['botanical', 'leaf', 'nature'], isPremium: false, create: () => [baseIcon('Leaf', { iconColor: '#00C853', widthPct: 15, heightPct: 15 })] },
  { id: 'deco-tape-strip', name: 'Tape Strip', category: 'Decorative', type: 'shape', tags: ['tape', 'scrapbook'], isPremium: false, create: () => [baseShape('rectangle', { widthPct: 20, heightPct: 6, fill: '#FFF3C4', opacity: 85, rotationDeg: -4 })] },
  { id: 'deco-torn-paper', name: 'Torn Paper Edge', category: 'Decorative', type: 'shape', tags: ['torn', 'paper', 'texture'], isPremium: false, create: () => [baseShape('polygon', { widthPct: 40, heightPct: 10, fill: '#FFFFFF' })] },
  { id: 'deco-quote-marks', name: 'Big Quote Mark', category: 'Decorative', type: 'text', tags: ['quote', 'editorial'], isPremium: false, create: () => [{ id: nextId('text'), kind: 'text', role: 'headline', content: '“', xPct: 50, yPct: 50, widthPct: 20, heightPct: 15, opacity: 100, borderColor: '#8B3DFF', zIndex: 0, locked: false }] },
  { id: 'deco-corner-accent', name: 'Corner Accent', category: 'Decorative', type: 'shape', tags: ['corner', 'accent'], isPremium: false, create: () => [baseShape('triangle', { widthPct: 12, heightPct: 12, fill: '#7D2AE8' })] },
  { id: 'deco-dot-pattern', name: 'Editorial Dot Pattern', category: 'Decorative', type: 'shape', tags: ['dot', 'pattern'], isPremium: false, create: () => [baseShape('rectangle', { widthPct: 25, heightPct: 15, fill: 'dots' })] },
  { id: 'deco-scribble', name: 'Minimalist Scribble', category: 'Decorative', type: 'line', tags: ['scribble', 'accent'], isPremium: false, create: () => [baseLine('solid', { widthPct: 18, strokeWidth: 2, borderColor: '#FF5263', rotationDeg: -8 })] },
  { id: 'deco-label-tag', name: 'Label Tag', category: 'Decorative', type: 'text', tags: ['label', 'tag'], isPremium: false, create: () => [baseBadgeText('LABEL', { badgeColor: '#00C4CC' })] },
  { id: 'deco-stars-trio', name: 'Triple Stars Deco', category: 'Decorative', type: 'shape', tags: ['stars', 'magic'], isPremium: false, create: () => [baseShape('star', { fill: '#FFD13B', widthPct: 15, heightPct: 15 })] },
];

// --- Magazine (editorial labels/badges — 100% free) ---
const MAGAZINE: ElementLibraryItem[] = [
  { id: 'mag-issue-number', name: 'Issue Number Label', category: 'Magazine', type: 'text', tags: ['issue', 'label', 'magazine'], isPremium: false, create: () => [baseBadgeText('ISSUE 01')] },
  { id: 'mag-volume', name: 'Volume Label', category: 'Magazine', type: 'text', tags: ['volume', 'label'], isPremium: false, create: () => [baseBadgeText('VOL. I')] },
  { id: 'mag-barcode', name: 'Barcode Placeholder', category: 'Magazine', type: 'shape', tags: ['barcode', 'print'], isPremium: false, create: () => [baseShape('rectangle', { widthPct: 18, heightPct: 8, fill: 'barcode' })] },
  { id: 'mag-price-badge', name: 'Price Badge', category: 'Magazine', type: 'text', tags: ['price', 'badge'], isPremium: false, create: () => [baseBadgeText('₹299')] },
  { id: 'mag-category-tag', name: 'Category Tag', category: 'Magazine', type: 'text', tags: ['category', 'tag'], isPremium: false, create: () => [baseBadgeText('LIFESTYLE')] },
  { id: 'mag-section-label', name: 'Section Label', category: 'Magazine', type: 'text', tags: ['section', 'label'], isPremium: false, create: () => [baseBadgeText('FEATURES')] },
  { id: 'mag-page-number', name: 'Page Number Style', category: 'Magazine', type: 'text', tags: ['page', 'number'], isPremium: false, create: () => [{ id: nextId('text'), kind: 'text', role: 'caption', content: '01', xPct: 50, yPct: 50, widthPct: 10, heightPct: 6, opacity: 100, borderColor: INK, zIndex: 0, locked: false }] },
  { id: 'mag-pull-quote', name: 'Pull Quote Bar', category: 'Magazine', type: 'shape', tags: ['quote', 'decoration'], isPremium: false, create: () => [baseShape('rectangle', { widthPct: 3, heightPct: 20, fill: '#8B3DFF' })] },
  { id: 'mag-divider', name: 'Divider', category: 'Magazine', type: 'line', tags: ['divider'], isPremium: false, create: () => [baseLine('solid', { widthPct: 30, strokeWidth: 1 })] },
  { id: 'mag-caption-label', name: 'Caption Label', category: 'Magazine', type: 'text', tags: ['caption', 'label'], isPremium: false, create: () => [{ id: nextId('text'), kind: 'text', role: 'caption', content: 'Photography by PrintAlarm', xPct: 50, yPct: 50, widthPct: 40, heightPct: 5, opacity: 100, borderColor: '#6F7478', zIndex: 0, locked: false }] },
  { id: 'mag-cover-badge', name: 'New Cover Badge', category: 'Magazine', type: 'text', tags: ['cover', 'badge', 'new'], isPremium: false, create: () => [baseBadgeText('NEW', { badgeColor: '#FF5263' })] },
  { id: 'mag-date-label', name: 'Date Label', category: 'Magazine', type: 'text', tags: ['date', 'label'], isPremium: false, create: () => [baseBadgeText('SEPTEMBER 2026', { badgeColor: '#1C2024' })] },
  { id: 'mag-photo-credit', name: 'Photo Credit Line', category: 'Magazine', type: 'text', tags: ['credit', 'photo'], isPremium: false, create: () => [{ id: nextId('text'), kind: 'text', role: 'caption', content: '© PrintAlarm Studio', xPct: 50, yPct: 50, widthPct: 30, heightPct: 5, opacity: 80, borderColor: '#6F7478', zIndex: 0, locked: false }] },
  { id: 'mag-inside-marker', name: '"Inside" Marker', category: 'Magazine', type: 'text', tags: ['inside', 'marker'], isPremium: false, create: () => [baseBadgeText('INSIDE', { badgeColor: '#7D2AE8' })] },
  { id: 'mag-exclusive-badge', name: '"Exclusive" Badge', category: 'Magazine', type: 'text', tags: ['exclusive', 'badge'], isPremium: false, create: () => [baseBadgeText('EXCLUSIVE', { badgeColor: '#FF9600' })] },
  { id: 'mag-limited-badge', name: '"Limited Edition" Badge', category: 'Magazine', type: 'text', tags: ['limited', 'edition', 'badge'], isPremium: false, create: () => [baseBadgeText('LIMITED EDITION', { badgeColor: '#8B3DFF' })] },
  { id: 'mag-trending-badge', name: '"Trending" Badge', category: 'Magazine', type: 'text', tags: ['trending', 'badge'], isPremium: false, create: () => [baseBadgeText('TRENDING', { badgeColor: '#FF5263' })] },
  { id: 'mag-special-issue', name: '"Special Issue" Ribbon', category: 'Magazine', type: 'text', tags: ['special', 'issue', 'badge'], isPremium: false, create: () => [baseBadgeText('SPECIAL ISSUE', { badgeColor: '#00C4CC' })] },
  { id: 'mag-feature-label', name: 'Feature Label', category: 'Magazine', type: 'text', tags: ['feature', 'label'], isPremium: false, create: () => [baseBadgeText('FEATURE', { badgeColor: '#00C853' })] },
  { id: 'mag-bestseller-badge', name: 'Bestseller Badge', category: 'Magazine', type: 'text', tags: ['bestseller', 'badge', 'top'], isPremium: false, create: () => [baseBadgeText('BESTSELLER', { badgeColor: '#FFD13B' })] },
  { id: 'mag-staff-pick', name: 'Staff Pick Label', category: 'Magazine', type: 'text', tags: ['staff', 'pick', 'favorite'], isPremium: false, create: () => [baseBadgeText('STAFF PICK', { badgeColor: '#7D2AE8' })] },
  { id: 'mag-free-gift', name: 'Free Gift Marker', category: 'Magazine', type: 'text', tags: ['free', 'gift', 'bonus'], isPremium: false, create: () => [baseBadgeText('FREE GIFT INSIDE', { badgeColor: '#FF5263' })] },
  { id: 'mag-editor-choice', name: "Editor's Choice", category: 'Magazine', type: 'text', tags: ['editor', 'choice', 'best'], isPremium: false, create: () => [baseBadgeText("EDITOR'S CHOICE", { badgeColor: '#008BE3' })] },
  { id: 'mag-must-read', name: 'Must Read Banner', category: 'Magazine', type: 'text', tags: ['must', 'read', 'hot'], isPremium: false, create: () => [baseBadgeText('MUST READ', { badgeColor: '#FF5263' })] },
  { id: 'mag-summer-special', name: 'Summer Special', category: 'Magazine', type: 'text', tags: ['summer', 'special', 'season'], isPremium: false, create: () => [baseBadgeText('SUMMER SPECIAL', { badgeColor: '#FF9600' })] },
  { id: 'mag-interview-badge', name: 'Interview Feature', category: 'Magazine', type: 'text', tags: ['interview', 'q&a', 'talk'], isPremium: false, create: () => [baseBadgeText('EXCLUSIVE INTERVIEW', { badgeColor: '#7D2AE8' })] },
  { id: 'mag-top-10', name: 'Top 10 Badge', category: 'Magazine', type: 'text', tags: ['top10', 'rank', 'best'], isPremium: false, create: () => [baseBadgeText('TOP 10', { badgeColor: '#FFD13B' })] },
  // --- Canva Scraped Editorial Elements (100% free) ---
  { id: 'mag-canva-issue-ribbon', name: 'Canva Issue Ribbon', category: 'Magazine', type: 'text', tags: ['canva', 'issue', 'ribbon', 'summer'], isPremium: false, create: () => [baseBadgeText('SUMMER JUNE • ISSUE 08', { badgeColor: '#1C1C1E' })] },
  { id: 'mag-canva-barcode', name: 'Vertical Editorial Barcode', category: 'Magazine', type: 'shape', tags: ['barcode', 'vertical', 'canva', 'print'], isPremium: false, create: () => [
    baseShape('rectangle', { widthPct: 18, heightPct: 9, fill: 'barcode' }),
    { id: nextId('text'), kind: 'text', role: 'caption', content: '9 771234 567003', xPct: 50, yPct: 56, widthPct: 20, heightPct: 4, fontKey: 'condensed', opacity: 90, zIndex: 1, locked: false },
  ] },
  { id: 'mag-canva-quote-box', name: 'Boxed Editorial Pull Quote', category: 'Magazine', type: 'text', tags: ['quote', 'pullquote', 'editorial', 'canva'], isPremium: false, create: () => [
    baseShape('rectangle', { widthPct: 80, heightPct: 14, fill: '#FFFFFF', borderColor: '#1C1C1E', borderWidth: 1 }),
    { id: nextId('text'), kind: 'text', role: 'headline', content: '“The most modern wardrobe is one that gives every piece a longer life.”', xPct: 50, yPct: 50, widthPct: 76, heightPct: 12, fontKey: 'serif', zIndex: 1, locked: false },
  ] },
  { id: 'mag-canva-editor-signoff', name: 'Editor-in-Chief Signoff', category: 'Magazine', type: 'text', tags: ['editor', 'signoff', 'masthead', 'canva'], isPremium: false, create: () => [
    { id: nextId('text'), kind: 'text', role: 'subheading', content: 'Carly Ferris', xPct: 50, yPct: 42, widthPct: 40, heightPct: 5, fontKey: 'serif', zIndex: 1, locked: false },
    { id: nextId('text'), kind: 'text', role: 'caption', content: 'Editor-in-Chief • Summer June', xPct: 50, yPct: 52, widthPct: 40, heightPct: 4, fontKey: 'condensed', opacity: 80, zIndex: 1, locked: false },
  ] },
  { id: 'mag-canva-toc-entry', name: 'TOC Index Row', category: 'Magazine', type: 'text', tags: ['toc', 'index', 'canva', 'contents'], isPremium: false, create: () => [
    { id: nextId('text'), kind: 'text', role: 'headline', content: '06', xPct: 20, yPct: 50, widthPct: 15, heightPct: 8, fontKey: 'serif', zIndex: 1, locked: false },
    { id: nextId('text'), kind: 'text', role: 'subheading', content: 'The Future of Fashion is Here', xPct: 60, yPct: 46, widthPct: 60, heightPct: 5, fontKey: 'serif', zIndex: 1, locked: false },
    { id: nextId('text'), kind: 'text', role: 'caption', content: 'Makers and studios shifting toward circular craftsmanship.', xPct: 60, yPct: 55, widthPct: 60, heightPct: 4, fontKey: 'condensed', opacity: 75, zIndex: 1, locked: false },
  ] },
  { id: 'mag-canva-reader-letter', name: 'Reader Letter Card', category: 'Magazine', type: 'text', tags: ['reader', 'letter', 'feedback', 'canva'], isPremium: false, create: () => [
    baseShape('rectangle', { widthPct: 80, heightPct: 22, fill: '#FFFFFF', borderRadius: 6, borderColor: '#E5E5EA', borderWidth: 1 }),
    { id: nextId('text'), kind: 'text', role: 'body', content: '“The maker profiles were a reminder that every garment carries many decisions and many hands.”', xPct: 50, yPct: 44, widthPct: 74, heightPct: 10, fontKey: 'serif', zIndex: 1, locked: false },
    { id: nextId('text'), kind: 'text', role: 'caption', content: '— Bridget C, Venston Bay  •  love, Carly', xPct: 50, yPct: 56, widthPct: 74, heightPct: 4, fontKey: 'condensed', opacity: 75, zIndex: 1, locked: false },
  ] },
  { id: 'mag-canva-workflow-step', name: 'Production Step Badge', category: 'Magazine', type: 'text', tags: ['workflow', 'step', 'production', 'canva'], isPremium: false, create: () => [
    baseBadgeText('STEP 01', { badgeColor: '#1C1C1E', widthPct: 16, heightPct: 4 }),
    { id: nextId('text'), kind: 'text', role: 'subheading', content: 'Planning • Moodboard • Story List • Layout', xPct: 58, yPct: 50, widthPct: 60, heightPct: 5, fontKey: 'serif', zIndex: 1, locked: false },
  ] },
  { id: 'mag-canva-subscription-perks', name: 'Subscription Perks Checklist', category: 'Magazine', type: 'text', tags: ['subscription', 'perks', 'checklist', 'canva'], isPremium: false, create: () => [
    baseShape('rectangle', { widthPct: 80, heightPct: 24, fill: '#F8F8F8', borderRadius: 6, borderColor: '#1C1C1E', borderWidth: 1 }),
    { id: nextId('text'), kind: 'text', role: 'subheading', content: 'Subscribe to Summer June', xPct: 50, yPct: 40, widthPct: 74, heightPct: 5, fontKey: 'serif', zIndex: 1, locked: false },
    { id: nextId('text'), kind: 'text', role: 'body', content: '✓ Free home delivery worldwide\n✓ Get your copy before everyone else\n✓ Exclusive digital archive access', xPct: 50, yPct: 52, widthPct: 74, heightPct: 10, fontKey: 'condensed', zIndex: 1, locked: false },
  ] },
  ...(['01', '02', '03', '04', '05', '06', '09', '11', '14', '16', '18'] as const).map((num) => ({
    id: `mag-canva-num-${num}`,
    name: `Number Badge ${num}`,
    category: 'Magazine' as const,
    type: 'text' as const,
    tags: ['number', 'badge', num, 'canva', 'listicle'],
    isPremium: false,
    create: () => [baseBadgeText(num, { badgeColor: '#1C1C1E', widthPct: 10, heightPct: 4 })],
  })),
];

// --- Gradients (14 vibrant modern Canva gradient elements — 100% free) ---
const GRADIENTS: ElementLibraryItem[] = [
  { id: 'grad-canva-purple-cyan', name: 'Canva Purple-Cyan', category: 'Gradients', type: 'shape', tags: ['gradient', 'purple', 'cyan', 'canva'], isPremium: false, create: () => [baseShape('rounded-rectangle', { fill: 'linear-gradient(135deg, #7D2AE8, #00C4CC)', borderRadius: 16 })] },
  { id: 'grad-sunset', name: 'Sunset Coral', category: 'Gradients', type: 'shape', tags: ['gradient', 'sunset', 'coral', 'orange'], isPremium: false, create: () => [baseShape('rounded-rectangle', { fill: 'linear-gradient(135deg, #FF5263, #FF9600)', borderRadius: 16 })] },
  { id: 'grad-neon', name: 'Neon Fuchsia', category: 'Gradients', type: 'shape', tags: ['gradient', 'neon', 'fuchsia', 'pink'], isPremium: false, create: () => [baseShape('rounded-rectangle', { fill: 'linear-gradient(135deg, #8B3DFF, #FF5263)', borderRadius: 16 })] },
  { id: 'grad-ocean', name: 'Ocean Breeze', category: 'Gradients', type: 'shape', tags: ['gradient', 'ocean', 'blue', 'teal'], isPremium: false, create: () => [baseShape('rounded-rectangle', { fill: 'linear-gradient(135deg, #008BE3, #00C4CC)', borderRadius: 16 })] },
  { id: 'grad-emerald', name: 'Lush Emerald', category: 'Gradients', type: 'shape', tags: ['gradient', 'green', 'emerald'], isPremium: false, create: () => [baseShape('rounded-rectangle', { fill: 'linear-gradient(135deg, #00C853, #008BE3)', borderRadius: 16 })] },
  { id: 'grad-gold', name: 'Luxury Gold', category: 'Gradients', type: 'shape', tags: ['gradient', 'gold', 'luxury'], isPremium: false, create: () => [baseShape('rounded-rectangle', { fill: 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728)', borderRadius: 16 })] },
  { id: 'grad-cyber', name: 'Cyber Midnight', category: 'Gradients', type: 'shape', tags: ['gradient', 'dark', 'cyber'], isPremium: false, create: () => [baseShape('rounded-rectangle', { fill: 'linear-gradient(135deg, #1C2024, #7D2AE8)', borderRadius: 16 })] },
  { id: 'grad-circle-sun', name: 'Sunburst Circle', category: 'Gradients', type: 'shape', tags: ['gradient', 'circle', 'sun'], isPremium: false, create: () => [baseShape('circle', { fill: 'linear-gradient(135deg, #FFD13B, #FF5263)' })] },
  { id: 'grad-circle-lavender', name: 'Lavender Dream Circle', category: 'Gradients', type: 'shape', tags: ['gradient', 'circle', 'lavender'], isPremium: false, create: () => [baseShape('circle', { fill: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' })] },
  { id: 'grad-peach-pill', name: 'Peach Velvet Pill', category: 'Gradients', type: 'shape', tags: ['gradient', 'pill', 'peach'], isPremium: false, create: () => [baseShape('pill', { fill: 'linear-gradient(135deg, #FFA07A, #FF6347)' })] },
  { id: 'grad-aurora-blob', name: 'Aurora Borealis Blob', category: 'Gradients', type: 'shape', tags: ['gradient', 'blob', 'aurora'], isPremium: false, create: () => [baseShape('blob', { fill: 'linear-gradient(135deg, #00C853, #00C4CC, #7D2AE8)' })] },
  { id: 'grad-metallic-silver', name: 'Metallic Silver', category: 'Gradients', type: 'shape', tags: ['gradient', 'silver', 'chrome'], isPremium: false, create: () => [baseShape('rounded-rectangle', { fill: 'linear-gradient(135deg, #E0E0E0, #F5F5F5, #9E9E9E)', borderRadius: 16 })] },
  { id: 'grad-rose-gold', name: 'Rose Gold Shimmer', category: 'Gradients', type: 'shape', tags: ['gradient', 'rose', 'gold'], isPremium: false, create: () => [baseShape('rounded-rectangle', { fill: 'linear-gradient(135deg, #B76E79, #FFD1DC, #C98A90)', borderRadius: 16 })] },
  { id: 'grad-deep-space', name: 'Deep Space Cosmic', category: 'Gradients', type: 'shape', tags: ['gradient', 'space', 'cosmic'], isPremium: false, create: () => [baseShape('circle', { fill: 'linear-gradient(135deg, #0D1B2A, #415A77, #778DA9)' })] },
];

// --- Canva Luxury Editorial Elements (scraped directly from Canva — 100% free) ---
const CANVA_LUXURY_ELEMENTS: ElementLibraryItem[] = [
  // Editorial Typography
  {
    id: 'canva-txt-masthead-summer-june',
    name: 'Summer June Masthead',
    category: 'Canva Luxury',
    type: 'text',
    tags: ['canva', 'masthead', 'title', 'summer', 'june', 'luxury'],
    isPremium: false,
    create: () => [
      {
        id: nextId('text'), kind: 'text', role: 'headline', content: 'SUMMER JUNE',
        xPct: 50, yPct: 50, widthPct: 80, heightPct: 12,
        fontKey: 'serif', fontSize: 36, letterSpacing: '0.15em', fontWeight: 700, color: '#1C1C1E',
        zIndex: 2, locked: false,
      },
    ],
  },
  {
    id: 'canva-txt-future-fashion',
    name: 'Future of Fashion Headline',
    category: 'Canva Luxury',
    type: 'text',
    tags: ['canva', 'headline', 'fashion', 'future', 'editorial'],
    isPremium: false,
    create: () => [
      {
        id: nextId('text'), kind: 'text', role: 'headline', content: 'The Future of Fashion is Here',
        xPct: 50, yPct: 50, widthPct: 85, heightPct: 12,
        fontKey: 'serif', fontSize: 26, color: '#1C1C1E', textAlign: 'left',
        zIndex: 2, locked: false,
      },
    ],
  },
  {
    id: 'canva-txt-thoughtful-future',
    name: 'Thoughtful Future Subtitle',
    category: 'Canva Luxury',
    type: 'text',
    tags: ['canva', 'subtitle', 'tagline', 'editorial'],
    isPremium: false,
    create: () => [
      {
        id: nextId('text'), kind: 'text', role: 'body', content: 'Designers, makers and wardrobes moving fashion toward a more thoughtful future.',
        xPct: 50, yPct: 50, widthPct: 80, heightPct: 8,
        fontKey: 'condensed', fontSize: 13, color: '#555555', textAlign: 'left',
        zIndex: 2, locked: false,
      },
    ],
  },
  {
    id: 'canva-txt-influencing-trends',
    name: 'Influencing Trends Headline',
    category: 'Canva Luxury',
    type: 'text',
    tags: ['canva', 'headline', 'trends', 'editorial'],
    isPremium: false,
    create: () => [
      {
        id: nextId('text'), kind: 'text', role: 'headline', content: 'Influencing the New Trends',
        xPct: 50, yPct: 50, widthPct: 80, heightPct: 8,
        fontKey: 'serif', fontSize: 22, color: '#1C1C1E',
        zIndex: 2, locked: false,
      },
    ],
  },
  {
    id: 'canva-txt-fast-fashion',
    name: 'Stop Fast Fashion Headline',
    category: 'Canva Luxury',
    type: 'text',
    tags: ['canva', 'headline', 'fast fashion'],
    isPremium: false,
    create: () => [
      {
        id: nextId('text'), kind: 'text', role: 'headline', content: 'Putting a Stop to Fast Fashion',
        xPct: 50, yPct: 50, widthPct: 80, heightPct: 8,
        fontKey: 'serif', fontSize: 22, color: '#1C1C1E',
        zIndex: 2, locked: false,
      },
    ],
  },
  {
    id: 'canva-txt-passion-fashion',
    name: 'Passion for Fashion Title',
    category: 'Canva Luxury',
    type: 'text',
    tags: ['canva', 'passion', 'fashion', 'title'],
    isPremium: false,
    create: () => [
      {
        id: nextId('text'), kind: 'text', role: 'headline', content: 'Passion for Fashion',
        xPct: 50, yPct: 50, widthPct: 80, heightPct: 10,
        fontKey: 'serif', fontSize: 28, color: '#1C1C1E',
        zIndex: 2, locked: false,
      },
    ],
  },
  {
    id: 'canva-txt-5ways-wardrobe',
    name: '5 Ways Wardrobe Title',
    category: 'Canva Luxury',
    type: 'text',
    tags: ['canva', 'listicle', 'wardrobe', '5ways'],
    isPremium: false,
    create: () => [
      {
        id: nextId('text'), kind: 'text', role: 'headline', content: '5 Ways to Update Your Wardrobe',
        xPct: 50, yPct: 50, widthPct: 80, heightPct: 8,
        fontKey: 'serif', fontSize: 22, color: '#1C1C1E',
        zIndex: 2, locked: false,
      },
    ],
  },
  {
    id: 'canva-txt-you-are-wear',
    name: 'You Are What You Wear Headline',
    category: 'Canva Luxury',
    type: 'text',
    tags: ['canva', 'headline', 'wear', 'identity'],
    isPremium: false,
    create: () => [
      {
        id: nextId('text'), kind: 'text', role: 'headline', content: 'You Are What You Wear',
        xPct: 50, yPct: 50, widthPct: 80, heightPct: 8,
        fontKey: 'serif', fontSize: 22, color: '#1C1C1E',
        zIndex: 2, locked: false,
      },
    ],
  },
  // Signature Quotes
  {
    id: 'canva-quote-longer-life',
    name: 'Longer Life Pull Quote',
    category: 'Canva Luxury',
    type: 'text',
    tags: ['canva', 'quote', 'pullquote', 'editorial'],
    isPremium: false,
    create: () => [
      baseShape('rectangle', { widthPct: 86, heightPct: 12, fill: '#1C1C1E' }),
      {
        id: nextId('text'), kind: 'text', role: 'subheading', content: '“The most modern wardrobe is one that gives every piece a longer life.”',
        xPct: 50, yPct: 50, widthPct: 80, heightPct: 10,
        fontKey: 'serif', fontSize: 14, color: '#FFFFFF', textAlign: 'center',
        zIndex: 2, locked: false,
      },
    ],
  },
  {
    id: 'canva-quote-innovation',
    name: 'Innovation Pull Quote',
    category: 'Canva Luxury',
    type: 'text',
    tags: ['canva', 'quote', 'innovation', 'editorial'],
    isPremium: false,
    create: () => [
      baseShape('rectangle', { widthPct: 86, heightPct: 14, fill: '#FFFFFF', borderColor: '#1C1C1E', borderWidth: 1 }),
      {
        id: nextId('text'), kind: 'text', role: 'subheading', content: '“Innovation matters most when it makes good design easier to keep, repair and reuse.”',
        xPct: 50, yPct: 50, widthPct: 80, heightPct: 10,
        fontKey: 'serif', fontSize: 14, color: '#1C1C1E', textAlign: 'center',
        zIndex: 2, locked: false,
      },
    ],
  },
  // Barcode & Date Ribbons
  {
    id: 'canva-barcode-vert',
    name: 'Canva Vertical Barcode',
    category: 'Canva Luxury',
    type: 'shape',
    tags: ['canva', 'barcode', 'vertical', 'print'],
    isPremium: false,
    create: () => [
      baseShape('rectangle', { widthPct: 18, heightPct: 9, fill: 'barcode' }),
      { id: nextId('text'), kind: 'text', role: 'caption', content: '9 771234 567003', xPct: 50, yPct: 56, widthPct: 22, heightPct: 3, fontKey: 'condensed', fontSize: 10, color: '#1C1C1E', opacity: 90, zIndex: 1, locked: false },
    ],
  },
  {
    id: 'canva-issue-date-ribbon',
    name: 'Issue 08 Date Ribbon',
    category: 'Canva Luxury',
    type: 'text',
    tags: ['canva', 'date', 'ribbon', 'issue'],
    isPremium: false,
    create: () => [baseBadgeText('ISSUE 08  •  JULY 2035', { badgeColor: '#1C1C1E', widthPct: 24, heightPct: 4 })],
  },
  // All 11 Number Badges
  ...(['01', '02', '03', '04', '05', '06', '09', '11', '14', '16', '18'] as const).map((num) => ({
    id: `canva-badge-${num}`,
    name: `Canva Number Badge ${num}`,
    category: 'Canva Luxury' as const,
    type: 'text' as const,
    tags: ['canva', 'number', 'badge', num],
    isPremium: false,
    create: () => [baseBadgeText(num, { badgeColor: '#1C1C1E', widthPct: 10, heightPct: 4 })],
  })),
  // High Resolution Public Media from the Canva Project
  {
    id: 'canva-photo-cover',
    name: 'Canva Cover Portrait',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'photo', 'cover', 'fashion', 'pearls'],
    isPremium: false,
    create: () => [baseFrame('rect', { imgSrc: CANVA_MEDIA.coverHero, originalSrc: CANVA_MEDIA.coverHero, widthPct: 45, heightPct: 60 })],
  },
  {
    id: 'canva-photo-editor',
    name: 'Canva Contributor Portrait',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'photo', 'contributor', 'fashion'],
    isPremium: false,
    create: () => [baseFrame('rect', { imgSrc: CANVA_MEDIA.editorialBox, originalSrc: CANVA_MEDIA.editorialBox, widthPct: 45, heightPct: 45 })],
  },
  {
    id: 'canva-photo-editor-letter',
    name: 'Canva Editor-in-Chief',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'photo', 'editor', 'blazer'],
    isPremium: false,
    create: () => [baseFrame('rect', { imgSrc: CANVA_MEDIA.editorLetter, originalSrc: CANVA_MEDIA.editorLetter, widthPct: 40, heightPct: 40 })],
  },
  {
    id: 'canva-photo-hangers',
    name: 'Canva Wardrobe Hangers',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'photo', 'hangers', 'wardrobe'],
    isPremium: false,
    create: () => [baseFrame('rect', { imgSrc: CANVA_MEDIA.hangers, originalSrc: CANVA_MEDIA.hangers, widthPct: 45, heightPct: 40 })],
  },
  {
    id: 'canva-photo-blazer-loafers',
    name: 'Canva Blazer & Loafers',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'photo', 'blazer', 'loafers'],
    isPremium: false,
    create: () => [baseFrame('rect', { imgSrc: CANVA_MEDIA.blazerLoafers, originalSrc: CANVA_MEDIA.blazerLoafers, widthPct: 45, heightPct: 50 })],
  },
  {
    id: 'canva-photo-grey-hoodie',
    name: 'Canva Grey Hoodie Jacket',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'photo', 'hoodie', 'fashion'],
    isPremium: false,
    create: () => [baseFrame('rect', { imgSrc: CANVA_MEDIA.greyHoodie, originalSrc: CANVA_MEDIA.greyHoodie, widthPct: 45, heightPct: 45 })],
  },
  {
    id: 'canva-photo-runway-shirt',
    name: 'Canva Runway Model',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'photo', 'runway', 'model'],
    isPremium: false,
    create: () => [baseFrame('rect', { imgSrc: CANVA_MEDIA.adSpreadWhiteShirt, originalSrc: CANVA_MEDIA.adSpreadWhiteShirt, widthPct: 45, heightPct: 60 })],
  },
  {
    id: 'canva-photo-crop-top',
    name: 'Canva Blazer Crop Top',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'photo', 'crop top', 'blazer'],
    isPremium: false,
    create: () => [baseFrame('rect', { imgSrc: CANVA_MEDIA.blackBlazerCropTop, originalSrc: CANVA_MEDIA.blackBlazerCropTop, widthPct: 45, heightPct: 45 })],
  },
  {
    id: 'canva-photo-passion-hero',
    name: 'Canva Passion Hero Model',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'photo', 'passion', 'hero'],
    isPremium: false,
    create: () => [baseFrame('rect', { imgSrc: CANVA_MEDIA.passionHero, originalSrc: CANVA_MEDIA.passionHero, widthPct: 45, heightPct: 60 })],
  },
  {
    id: 'canva-photo-back-cover',
    name: 'Canva Back Cover Hero',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'photo', 'back cover', 'white shirt'],
    isPremium: false,
    create: () => [baseFrame('rect', { imgSrc: CANVA_MEDIA.backCoverHero, originalSrc: CANVA_MEDIA.backCoverHero, widthPct: 45, heightPct: 60 })],
  },
  // Grids
  {
    id: 'canva-grid-listicle-3stack',
    name: '3-Photo Listicle Stack',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'grid', 'listicle', 'stack'],
    isPremium: false,
    create: () => [
      baseFrame('rounded', { xPct: 50, yPct: 20, widthPct: 80, heightPct: 24, borderRadius: 6 }),
      baseFrame('rounded', { xPct: 50, yPct: 50, widthPct: 80, heightPct: 24, borderRadius: 6 }),
      baseFrame('rounded', { xPct: 50, yPct: 80, widthPct: 80, heightPct: 24, borderRadius: 6 }),
    ],
  },
  {
    id: 'canva-grid-dual-split',
    name: 'Editorial 2-Photo Split',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'grid', 'editorial', 'split'],
    isPremium: false,
    create: () => [
      baseFrame('rounded', { xPct: 28, yPct: 50, widthPct: 42, heightPct: 65, borderRadius: 6 }),
      baseFrame('rounded', { xPct: 72, yPct: 50, widthPct: 42, heightPct: 65, borderRadius: 6 }),
    ],
  },
  {
    id: 'canva-grid-triple-article',
    name: 'Triple Photo Article Grid',
    category: 'Canva Luxury',
    type: 'image',
    tags: ['canva', 'grid', 'triple', 'article'],
    isPremium: false,
    create: () => [
      baseFrame('rounded', { xPct: 22, yPct: 50, widthPct: 32, heightPct: 50, borderRadius: 6 }),
      baseFrame('rounded', { xPct: 56, yPct: 50, widthPct: 32, heightPct: 50, borderRadius: 6 }),
      baseFrame('rounded', { xPct: 86, yPct: 50, widthPct: 24, heightPct: 50, borderRadius: 6 }),
    ],
  },
];

export const ELEMENT_LIBRARY: ElementLibraryItem[] = [
  ...ALL_CANVA_GRAPHIC_ITEMS,
  ...CANVA_LUXURY_ELEMENTS,
  ...SHAPES, ...LINES, ...FRAMES, ...GRIDS, ...ICONS, ...STICKERS, ...DECORATIVE, ...MAGAZINE, ...GRADIENTS,
];

export const ELEMENT_CATEGORIES: { key: ElementLibraryItem['category']; label: string }[] = [
  { key: 'Canva Luxury', label: 'Canva Luxury' },
  { key: 'Magic Recommendations', label: 'Magic' },
  { key: 'Featured', label: 'Featured' },
  { key: 'Gradients', label: 'Gradients' },
  { key: 'Animations', label: 'Animations' },
  { key: 'Social Media', label: 'Social Media' },
  { key: 'Handdrawn', label: 'Handdrawn' },
  { key: 'Team Badges', label: 'Team Badges' },
  { key: 'Bold Foliage', label: 'Bold Foliage' },
  { key: 'Zodiac Symbols', label: 'Zodiac' },
  { key: 'Simple Drawn Objects', label: 'Drawn Objects' },
  { key: 'Camping Rustic', label: 'Camping' },
  { key: 'Sketchy Flowers', label: 'Flowers' },
  { key: 'Handdrawn Animals', label: 'Animals' },
  { key: 'Handdrawn Love', label: 'Love' },
  { key: 'Shapes', label: 'Shapes' },
  { key: 'Stickers', label: 'Stickers' },
  { key: 'Lines', label: 'Lines' },
  { key: 'Frames', label: 'Frames' },
  { key: 'Grids', label: 'Grids' },
  { key: 'Icons', label: 'Icons' },
  { key: 'Decorative', label: 'Decorative' },
  { key: 'Magazine', label: 'Magazine' },
];
