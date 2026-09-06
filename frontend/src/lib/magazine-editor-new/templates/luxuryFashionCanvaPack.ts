import type { MagazineTemplate, PageNumberSettings, TemplateDimensions, TemplateElement, TemplatePage } from '../types';

const A4: TemplateDimensions = { widthMm: 210, heightMm: 297, orientation: 'portrait' };

const PAGE_NUMBERS_DEFAULT: PageNumberSettings = {
  enabled: true,
  startAtPageIndex: 1,
  startNumber: 2,
  position: 'bottom-center',
  hideOnCover: true,
  hideOnBackCover: true,
  fontKey: 'condensed',
  fontSize: 9,
  color: '#8A8A8E',
};

let eidCounter = 0;
function eid(prefix: string): string {
  eidCounter += 1;
  return `${prefix}-${Date.now()}-${eidCounter}`;
}

export function txt(
  content: string,
  xPct: number,
  yPct: number,
  widthPct: number,
  heightPct: number,
  opts: Partial<TemplateElement> = {},
): TemplateElement {
  const role = opts.role ?? (opts.fontSize && opts.fontSize >= 24 ? 'headline' : opts.fontSize && opts.fontSize >= 16 ? 'subheading' : 'body');
  return {
    id: eid('el-txt'),
    kind: 'text',
    role,
    content,
    xPct,
    yPct,
    widthPct,
    heightPct,
    fontKey: opts.fontKey ?? (role === 'headline' ? 'serif' : 'condensed'),
    opacity: 100,
    zIndex: 2,
    ...opts,
  };
}

export function img(
  src: string,
  xPct: number,
  yPct: number,
  widthPct: number,
  heightPct: number,
  opts: Partial<TemplateElement> = {},
): TemplateElement {
  return {
    id: eid('el-img'),
    kind: 'image',
    xPct,
    yPct,
    widthPct,
    heightPct,
    content: src,
    opacity: 100,
    zIndex: 1,
    ...opts,
  };
}

export function shp(
  shapeType: TemplateElement['shapeType'],
  xPct: number,
  yPct: number,
  widthPct: number,
  heightPct: number,
  fill = '#1C1C1E',
  opts: Partial<TemplateElement> = {},
): TemplateElement {
  return {
    id: eid('el-shp'),
    kind: 'shape',
    shapeType,
    xPct,
    yPct,
    widthPct,
    heightPct,
    fill,
    opacity: 100,
    zIndex: 1,
    ...opts,
  };
}

export function ln(
  xPct: number,
  yPct: number,
  widthPct: number,
  color = '#1C1C1E',
  opts: Partial<TemplateElement> = {},
): TemplateElement {
  return {
    id: eid('el-ln'),
    kind: 'line',
    xPct,
    yPct,
    widthPct,
    heightPct: 0.4,
    lineStyle: 'solid',
    strokeWidth: 1,
    borderColor: color,
    opacity: 100,
    zIndex: 2,
    ...opts,
  };
}

// ---------------------------------------------------------------------------
// Scraped Canva Public Media URLs
// ---------------------------------------------------------------------------
export const CANVA_MEDIA = {
  coverHero: 'https://media-public.canva.com/K3o0Y/MAEo79K3o0Y/1/s3.jpg',
  editorialBox: 'https://media-public.canva.com/rHIxM/MAEo70rHIxM/1/s3.jpg',
  editorLetter: 'https://media-public.canva.com/w9boU/MAEo70w9boU/1/s.jpg',
  article1Hero: 'https://media-public.canva.com/XzK1U/MAEo7-XzK1U/1/s3.jpg',
  article1Spread: 'https://media-public.canva.com/9WzhI/MAEo7w9WzhI/1/s3.jpg',
  hangers: 'https://media-public.canva.com/09GpY/MAEo7x09GpY/1/s2.jpg',
  casualBrown: 'https://media-public.canva.com/JdVQ0/MAEo7wJdVQ0/1/s2.jpg',
  greyDressShirt: 'https://media-public.canva.com/4Rbpc/MAEo704Rbpc/1/s3.jpg',
  blazerLoafers: 'https://media-public.canva.com/l9YRE/MAEo72l9YRE/1/s2.jpg',
  hoodieShirt: 'https://media-public.canva.com/PKGwY/MAEo7yPKGwY/1/s2.jpg',
  greyHoodie: 'https://media-public.canva.com/UITOA/MAEo7xUITOA/1/s3.jpg',
  adSpreadWhiteShirt: 'https://media-public.canva.com/EmwXY/MAEo78EmwXY/1/s3.jpg',
  greyHoodieThumb: 'https://media-public.canva.com/ODffg/MAEo73ODffg/1/s.jpg',
  blackBlazerCropTop: 'https://media-public.canva.com/5A3YA/MAEo725A3YA/1/s.jpg',
  holdingShirt: 'https://media-public.canva.com/m1ip8/MAEo7zm1ip8/1/s.jpg',
  casualBrownThumb: 'https://media-public.canva.com/wcfcY/MAEo73wcfcY/1/s.jpg',
  greyDressShirt2: 'https://media-public.canva.com/U7mRw/MAEo77U7mRw/1/s3.jpg',
  greyHoodie2: 'https://media-public.canva.com/hRPlo/MAEo7_hRPlo/1/s2.jpg',
  blazerSlacks: 'https://media-public.canva.com/FcMQE/MAEo77FcMQE/1/s2.jpg',
  casualShorts: 'https://media-public.canva.com/AGaKU/MAEo74AGaKU/1/s2.jpg',
  passionHero: 'https://media-public.canva.com/5A3YA/MAEo725A3YA/1/s2.jpg',
  blazerClose: 'https://media-public.canva.com/ibxtA/MAEo74ibxtA/1/s2.jpg',
  slacksLoafers: 'https://media-public.canva.com/inVdo/MAEo71inVdo/1/s2.jpg',
  fashionSpreadFull: 'https://media-public.canva.com/vhiMk/MAEo7zvhiMk/1/s3.jpg',
  editorialModel: 'https://media-public.canva.com/oP19E/MAEo70oP19E/1/s.jpg',
  subscriptionModel: 'https://media-public.canva.com/W6B4E/MAEo70W6B4E/1/s2.jpg',
  adModelShorts: 'https://media-public.canva.com/XzK1U/MAEo7-XzK1U/1/s3.jpg',
  backCoverHero: 'https://media-public.canva.com/hmyEM/MAEo72hmyEM/1/s3.jpg',
};

// Page 1: Cover
export function buildCanvaPage1(): TemplatePage {
  return {
    id: eid('page-canva-1'),
    kind: 'cover',
    name: 'Cover',
    background: { type: 'solid', color: '#0F1012' },
    elements: [
      img('https://media-public.canva.com/K3o0Y/MAEo79K3o0Y/1/s3.jpg', 49.8, 56.12, 108.83, 114.37, { borderRadius: 4, zIndex: 1 }),
      shp('rectangle', 12.04, 12.27, 2.66, 8.67, 'barcode', { zIndex: 3 }),
      txt('Influencing the New Trends', 72.8, 16.17, 42.65, 2.06, {
        role: 'subheading',
        fontSize: 19.9998,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('Putting a Stop to Fast Fashion', 72.8, 22.28, 42.65, 2.06, {
        role: 'subheading',
        fontSize: 19.9998,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('Passion for Fashion', 72.8, 19.29, 42.65, 2.06, {
        role: 'subheading',
        fontSize: 19.9998,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('5 Ways to Update Your Wardrobe', 72.8, 25.39, 42.65, 2.06, {
        role: 'subheading',
        fontSize: 19.9998,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('You Are What You Wear', 72.8, 28.38, 42.65, 2.06, {
        role: 'subheading',
        fontSize: 19.9998,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('01', 9.46, 16.17, 7.16, 2.06, {
        role: 'caption',
        fontSize: 19.9998,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('03', 9.46, 22.28, 7.16, 2.06, {
        role: 'caption',
        fontSize: 19.9998,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('02', 9.46, 19.29, 7.16, 2.06, {
        role: 'caption',
        fontSize: 19.9998,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('04', 9.46, 25.39, 7.16, 2.06, {
        role: 'caption',
        fontSize: 19.9998,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('05', 9.46, 28.38, 7.16, 2.06, {
        role: 'caption',
        fontSize: 19.9998,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('Designers, makers and wardrobes moving fashion toward a more thoughtful future.', 72.8, 90.12, 42.65, 2.88, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('The Future of Fashion is Here', 27.23, 90.9, 42.65, 1.32, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('July 2035', 80.39, 9.07, 27.45, 1.32, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('Issue 08', 19.61, 9.07, 27.45, 1.32, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('J', 32.97, 75.56, 20.86, 23.75, {
        role: 'headline',
        fontSize: 228.421,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('S', 29.89, 63.09, 53.16, 27.03, {
        role: 'headline',
        fontSize: 260,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('ummer', 57.6, 62.37, 73.04, 15.9, {
        role: 'headline',
        fontSize: 153.355,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('une', 67.91, 75.36, 52.41, 15.9, {
        role: 'headline',
        fontSize: 153.355,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
    ],
  };
}

// Page 2: Editorial Box
export function buildCanvaPage2(): TemplatePage {
  return {
    id: eid('page-canva-2'),
    kind: 'editorial-intro',
    name: 'Editorial Box',
    background: { type: 'solid', color: '#F8F8F8' },
    elements: [
      img('https://media-public.canva.com/rHIxM/MAEo70rHIxM/1/s3.jpg', 27.89, 49.92, 58.71, 93.97, { borderRadius: 4, zIndex: 1 }),
      txt('www.reallygreatsite.com', 25.05, 78.98, 27.45, 1.3, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('hello@reallygreatsite', 25.05, 81.56, 27.45, 1.3, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('@reallygreatsite', 25.05, 84.25, 27.45, 1.3, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Editor-in-Chief', 80.56, 12.21, 27.45, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Phyllis Schwaiger', 80.56, 57.16, 27.45, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Aaron Loeb', 80.56, 65.38, 27.45, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Noah Schumacher', 80.56, 73.64, 27.45, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Jackson Davis', 80.56, 81.89, 27.45, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Carly Ferris', 80.56, 14.5, 27.79, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Place a short biography of this magazine\\u0027s contributor here.', 80.56, 60.67, 27.45, 2.79, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Place a short biography of this magazine\\u0027s contributor here.', 80.56, 68.88, 27.45, 2.79, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Place a short biography of this magazine\\u0027s contributor here.', 80.56, 77.13, 27.45, 2.79, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Place a short biography of this magazine\\u0027s contributor here.', 80.56, 85.38, 27.45, 2.79, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Managing Editor', 80.56, 18.18, 27.34, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Wendy Salinas', 80.56, 20.43, 27.34, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Content Director', 80.56, 24.28, 27.45, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Theodore Lewitz', 80.56, 26.57, 27.22, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Art Director', 80.56, 30.32, 27.45, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Jackson Davis', 80.56, 32.62, 27.33, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Photographers', 80.56, 36.46, 27.45, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Francois Mercer, Jin Ae Soo', 80.56, 38.75, 27.45, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Contributing Writers', 80.56, 42.61, 27.45, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Contributors', 80.56, 51.17, 27.45, 1.65, {
        role: 'body',
        fontSize: 15.9999,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Maria Aguado, Margarita Perez', 80.56, 44.9, 27.45, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('J', 18.13, 20.18, 8.53, 9.71, {
        role: 'headline',
        fontSize: 228.421,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('S', 16.88, 15.08, 21.74, 11.06, {
        role: 'headline',
        fontSize: 260,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('ummer', 28.2, 14.78, 29.87, 6.5, {
        role: 'headline',
        fontSize: 153.355,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('une', 32.42, 20.1, 21.43, 6.5, {
        role: 'headline',
        fontSize: 153.355,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
    ],
  };
}

// Page 3: What’s Inside
export function buildCanvaPage3(): TemplatePage {
  return {
    id: eid('page-canva-3'),
    kind: 'toc',
    name: 'What’s Inside',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      txt('N', 36.55, 37.91, 42.06, 23.46, {
        role: 'headline',
        fontSize: 226.32,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('w hat\\u0027s', 50, 22.12, 70.64, 13.81, {
        role: 'headline',
        fontSize: 133.31,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('I', 21.91, 34.78, 23.83, 13.81, {
        role: 'headline',
        fontSize: 133.31,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('siDe', 64.92, 34.78, 41.47, 13.81, {
        role: 'headline',
        fontSize: 133.31,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('The Future of Fashion is Here', 65.19, 69.52, 57.84, 2.17, {
        role: 'subheading',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Putting a Stop to Fast Fashion', 65.19, 76.29, 57.84, 2.17, {
        role: 'subheading',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Influencing the New Trends', 65.19, 72.97, 57.84, 2.17, {
        role: 'subheading',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('5 Ways to Update Your Wardrobe', 65.19, 79.72, 57.84, 2.17, {
        role: 'subheading',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('You Are What You Wear', 65.19, 83.05, 57.84, 2.17, {
        role: 'subheading',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Passion for Fashion', 65.19, 86.34, 57.84, 2.17, {
        role: 'subheading',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('06', 12, 69.48, 12.25, 2.17, {
        role: 'caption',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('11', 12, 76.25, 12.25, 2.17, {
        role: 'caption',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('09', 12, 72.93, 12.25, 2.17, {
        role: 'caption',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('14', 12, 79.68, 12.25, 2.17, {
        role: 'caption',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('16', 12, 83, 12.25, 2.17, {
        role: 'caption',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('18', 12, 86.34, 12.25, 2.17, {
        role: 'caption',
        fontSize: 21.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 4: Reader Letters
export function buildCanvaPage4(): TemplatePage {
  return {
    id: eid('page-canva-4'),
    kind: 'editorial-intro',
    name: 'Reader Letters',
    background: { type: 'solid', color: '#F8F8F8' },
    elements: [
      txt('der', 79.36, 79.89, 20.75, 5.03, {
        role: 'headline',
        fontSize: 69.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Letters', 81.63, 84.92, 25.28, 5.03, {
        role: 'headline',
        fontSize: 69.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('a', 62.77, 81.33, 13.9, 10.16, {
        role: 'headline',
        fontSize: 139.594,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Re', 55.38, 79.89, 7.82, 5.03, {
        role: 'headline',
        fontSize: 69.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('"Your feature on responsible materials helped me rethink how I shop. I have started checking fibre content, choosing fewer pieces and repairing favourites instead of replacing them. The change feels practical, not restrictive."', 27.2, 16.8, 42.65, 6.02, {
        role: 'body',
        fontSize: 13.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('Thank you for sharing how the story changed your habits. Small, repeatable choices are exactly where a more responsible wardrobe begins.', 27.2, 35.71, 42.65, 4.46, {
        role: 'body',
        fontSize: 13.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('We appreciate your thoughtful note and your support for the designers featured in this issue. Their work proves that creativity and care can grow together.', 72.8, 35.71, 42.65, 4.46, {
        role: 'body',
        fontSize: 13.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('"The maker profiles were a reminder that every garment carries many decisions and many hands. I loved seeing the craft, time and skill behind pieces that are designed to last."', 72.8, 16.02, 42.65, 4.46, {
        role: 'body',
        fontSize: 13.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('- Caden SB, Santa Solana', 27.2, 29.43, 42.65, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('love, Carly', 27.2, 39.74, 42.65, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('love, Carly', 72.8, 39.74, 42.65, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('- Bridget C, Venston Bay', 72.8, 29.43, 42.65, 1.35, {
        role: 'body',
        fontSize: 13.3333,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('4', 6.89, 90.67, 2.02, 1.43, {
        role: 'body',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
    ],
  };
}

// Page 5: Letter from the Editor
export function buildCanvaPage5(): TemplatePage {
  return {
    id: eid('page-canva-5'),
    kind: 'editorial-intro',
    name: 'Letter from the Editor',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/w9boU/MAEo70w9boU/1/s.jpg', 9.13, 9.16, 23.57, 25.01, { borderRadius: 4, zIndex: 1 }),
      txt('H', 21.44, 23.5, 31.12, 14.56, {
        role: 'headline',
        fontSize: 140,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('ey,', 46.19, 23.38, 45.59, 7.17, {
        role: 'headline',
        fontSize: 69.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Dear Readers', 54.91, 30.78, 66.93, 7.17, {
        role: 'headline',
        fontSize: 69.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('An editor\\u0027s letter is a message written for a variety of purposes, from friendly to formal. They can help the reader understand the content and creative direction of a certain issue, they can give the reader and idea of what they can find in the magazine, or they can explain the issue\\u0027s theme and how it can resonate with them.', 72.8, 55.52, 42.65, 32.53, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('Editor-in-Chief', 66.66, 86.52, 30.39, 1.48, {
        role: 'body',
        fontSize: 14.6668,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('Carly Ferris', 67.64, 82.12, 35.29, 3.71, {
        role: 'headline',
        fontSize: 36.0051,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('5', 93.86, 90.67, 2.02, 1.43, {
        role: 'subheading',
        fontSize: 16,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
    ],
  };
}

// Page 6: Article Spread (P. 6)
export function buildCanvaPage6(): TemplatePage {
  return {
    id: eid('page-canva-6'),
    kind: 'feature-story',
    name: 'Article Spread (P. 6)',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/XzK1U/MAEo7-XzK1U/1/s3.jpg', 50, 50, 103.02, 109.34, { borderRadius: 4, zIndex: 1 }),
      txt('T', 11.83, 16.64, 11.9, 10.05, {
        role: 'headline',
        fontSize: 97.0861,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('By Margarita Perez. Photography by Francois Mercer', 21.41, 86.14, 30.39, 2.57, {
        role: 'body',
        fontSize: 12.0002,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('A short intro or kicker of the article will go here. This part acts as a bridge between the headline and the article itself.', 72.8, 85.98, 42.65, 2.9, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('FUture of', 45.72, 16.13, 36.03, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('he', 22.74, 16.13, 9.92, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Fashion is', 38.34, 21.63, 33.7, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('ere', 73.22, 21.63, 11.41, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('H', 63.7, 22.41, 19.83, 10.05, {
        role: 'headline',
        fontSize: 97.0861,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('6', 7.22, 90.67, 2.02, 1.43, {
        role: 'subheading',
        fontSize: 16,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
    ],
  };
}

// Page 7: Article Spread (P. 7)
export function buildCanvaPage7(): TemplatePage {
  return {
    id: eid('page-canva-7'),
    kind: 'feature-story',
    name: 'Article Spread (P. 7)',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/9WzhI/MAEo7w9WzhI/1/s3.jpg', 49.94, 30.32, 103.15, 55.34, { borderRadius: 4, zIndex: 1 }),
      txt('A magazine is a periodical publication, which can either be printed or published electronically. It is issued regularly, usually every week or every month, and it contains a variety of content. This can include articles, stories, photographs, and advertisements.', 72.8, 75.07, 42.65, 24.74, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('7', 93.96, 90.67, 2.02, 1.43, {
        role: 'subheading',
        fontSize: 16,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
    ],
  };
}

// Page 8: Article Spread (P. 8)
export function buildCanvaPage8(): TemplatePage {
  return {
    id: eid('page-canva-8'),
    kind: 'feature-story',
    name: 'Article Spread (P. 8)',
    background: { type: 'solid', color: '#F8F8F8' },
    elements: [
      img('https://media-public.canva.com/09GpY/MAEo7x09GpY/1/s2.jpg', 50, 50, 100, 100, { borderRadius: 4, zIndex: 1 }),
      img('https://media-public.canva.com/JdVQ0/MAEo7wJdVQ0/1/s2.jpg', 50, 50, 100, 100, { borderRadius: 4, zIndex: 1 }),
      txt('A magazine is a periodical publication, which can either be printed or published electronically. It is issued regularly, usually every week or every month, and it contains a variety of content. This can include articles, stories, photographs, and advertisements.', 27.2, 33.25, 42.65, 49.69, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('A pull quote is an impactful quote taken from the article. You can place the quote you want to highlight here.', 27.2, 84.16, 42.65, 6.55, {
        role: 'body',
        fontSize: 15.4551,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('8', 6.89, 90.67, 2.02, 1.43, {
        role: 'body',
        fontSize: 15.9999,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
    ],
  };
}

// Page 9: Article Spread (P. 9)
export function buildCanvaPage9(): TemplatePage {
  return {
    id: eid('page-canva-9'),
    kind: 'feature-story',
    name: 'Article Spread (P. 9)',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/4Rbpc/MAEo704Rbpc/1/s3.jpg', 50, 50, 100, 100, { borderRadius: 4, zIndex: 1 }),
      txt('N', 9.66, 23.48, 9.25, 7.03, {
        role: 'headline',
        fontSize: 68.303,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('I', 7.94, 22.86, 4.12, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('fluencing', 31.69, 22.86, 33.58, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('the', 54.62, 22.86, 12.25, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('ew', 65.64, 84.89, 8.73, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Trends', 82.06, 84.89, 24.11, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('By Sharlene Rose Photography by Jackson Davis', 19.61, 13.01, 27.45, 2.57, {
        role: 'body',
        fontSize: 12.0002,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('A short intro or kicker of the article will go here. This part acts as a bridge between the headline and the article itself.', 71.31, 12.8, 45.63, 2.97, {
        role: 'headline',
        fontSize: 30.3844,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('N', 56.48, 85.17, 9.59, 7.03, {
        role: 'headline',
        fontSize: 68.303,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('9', 93.83, 90.67, 2.02, 1.43, {
        role: 'body',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
    ],
  };
}

// Page 10: Article Spread (P. 10)
export function buildCanvaPage10(): TemplatePage {
  return {
    id: eid('page-canva-10'),
    kind: 'feature-story',
    name: 'Article Spread (P. 10)',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/l9YRE/MAEo72l9YRE/1/s2.jpg', 17.11, 17.62, 34.22, 36.32, { borderRadius: 4, zIndex: 1 }),
      img('https://media-public.canva.com/PKGwY/MAEo7yPKGwY/1/s2.jpg', 17.11, 17.62, 34.22, 36.32, { borderRadius: 4, zIndex: 1 }),
      txt('Fast fashion made novelty feel normal, but a growing number of designers and shoppers are choosing a slower rhythm. They are buying with clearer purpose, prioritising quality and asking how garments are made. The shift is visible in repair services, resale communities and smaller collections designed to work across seasons. Style is not disappearing; it is becoming more personal, resourceful and connected to the value of craft.', 27.2, 60.88, 42.65, 12.26, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('"The most modern wardrobe is one that gives every piece a longer life."', 27.2, 44.27, 42.65, 4.33, {
        role: 'subheading',
        fontSize: 20.0007,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('A maker finishes a hand-sewn detail in an independent studio.', 27.2, 85.98, 42.65, 2.9, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('10', 6.89, 90.67, 2.02, 1.43, {
        role: 'caption',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 11: Article Spread (P. 11)
export function buildCanvaPage11(): TemplatePage {
  return {
    id: eid('page-canva-11'),
    kind: 'feature-story',
    name: 'Article Spread (P. 11)',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/UITOA/MAEo7xUITOA/1/s3.jpg', 44.44, 34.63, 116.99, 124.08, { borderRadius: 4, zIndex: 1 }),
      txt('Putting a Stop to Fast Fashion', 35.05, 16, 57.36, 9.36, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('By Wendy Salinas Photography by Aaron Loeb', 65.44, 86.14, 26.97, 2.57, {
        role: 'body',
        fontSize: 12.0002,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('A short intro or kicker of the article will go here. This part acts as a bridge between the headline and the article itself.', 34.8, 24.52, 57.84, 2.97, {
        role: 'headline',
        fontSize: 30.3844,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('A magazine is a periodical publication, which can either be printed or published electronically. It is issued regularly, usually every week or every month, and it contains a variety of content. This can include articles, stories, photographs, and advertisements.', 27.2, 75.07, 42.65, 24.74, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Next, think of a compelling feature for your cover story. This will be what draws your audience in. Make sure that you have accompanying visual content that immediately catches the eye. Include photos, illustrations, and other graphics to match. Appeal to your audience, choose the right fonts and images, and you\\u0027ll have a magazine that people will remember for years to come.', 72.72, 68.05, 42.79, 10.7, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('11', 93.27, 90.67, 2.02, 1.43, {
        role: 'caption',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 12: Advertisement
export function buildCanvaPage12(): TemplatePage {
  return {
    id: eid('page-canva-12'),
    kind: 'full-photo',
    name: 'Advertisement',
    background: { type: 'solid', color: '#0F1012' },
    elements: [
      img('https://media-public.canva.com/EmwXY/MAEo78EmwXY/1/s3.jpg', 49.77, 55.84, 109.43, 113.82, { borderRadius: 4, zIndex: 1 }),
      txt('Advertisement', 81.94, 11.13, 24.36, 1.91, {
        role: 'body',
        fontSize: 14.6667,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
    ],
  };
}

// Page 13: Article Spread (P. 13)
export function buildCanvaPage13(): TemplatePage {
  return {
    id: eid('page-canva-13'),
    kind: 'feature-story',
    name: 'Article Spread (P. 13)',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/ODffg/MAEo73ODffg/1/s.jpg', 15.73, 15.84, 31.47, 33.4, { borderRadius: 4, zIndex: 1 }),
      txt('A magazine is a periodical publication, which can either be printed or published electronically. It is issued regularly, usually every week or every month, and it contains a variety of content. This can include articles, stories, photographs, and advertisements.', 72.77, 62.59, 42.59, 49.69, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('A pull quote is an impactful quote taken from the article. You can place the quote you want to highlight here.', 72.77, 27.23, 42.59, 6.59, {
        role: 'subheading',
        fontSize: 20.0007,
        color: '#1C1C1E',
        fontKey: 'serif',
      }),
      txt('13', 92.85, 90.67, 2.02, 1.43, {
        role: 'caption',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 14: 5 Ways to Update Your Wardrobe
export function buildCanvaPage14(): TemplatePage {
  return {
    id: eid('page-canva-14'),
    kind: 'feature-story',
    name: '5 Ways to Update Your Wardrobe',
    background: { type: 'solid', color: '#F8F8F8' },
    elements: [
      img('https://media-public.canva.com/5A3YA/MAEo725A3YA/1/s.jpg', 50, 50, 100, 100, { borderRadius: 4, zIndex: 1 }),
      img('https://media-public.canva.com/09GpY/MAEo7x09GpY/1/s.jpg', 50, 50, 100, 100, { borderRadius: 4, zIndex: 1 }),
      img('https://media-public.canva.com/m1ip8/MAEo7zm1ip8/1/s.jpg', 50, 50, 100, 100, { borderRadius: 4, zIndex: 1 }),
      txt('Ways to update', 44.8, 14.49, 60.47, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Your', 51.29, 19.69, 19.49, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('W', 62.31, 19.69, 5.62, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('rdrobe', 82.84, 19.69, 22.53, 4.68, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Wear articles differently', 19.75, 70.23, 27.15, 4.33, {
        role: 'subheading',
        fontSize: 20.0007,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Mix and match different pieces', 50, 70.23, 27.15, 4.33, {
        role: 'subheading',
        fontSize: 20.0007,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Identify gaps in your wardrobe', 80.55, 70.23, 27.15, 4.33, {
        role: 'subheading',
        fontSize: 20.0007,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('A magazine is a periodical publication, which can either be printed or published electronically. It is issued regularly, usually every week or every month, and it contains a variety of content. This can include articles, stories, photographs, and advertisements.', 19.61, 81.3, 27.45, 12.26, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('A magazine is a periodical publication, which can either be printed or published electronically. It is issued regularly, usually every week or every month, and it contains a variety of content. This can include articles, stories, photographs, and advertisements.', 50, 81.3, 27.45, 12.26, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('A magazine is a periodical publication, which can either be printed or published electronically. It is issued regularly, usually every week or every month, and it contains a variety of content. This can include articles, stories, photographs, and advertisements.', 80.39, 81.3, 27.45, 12.26, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('A', 67.28, 20.14, 7.11, 5.22, {
        role: 'headline',
        fontSize: 50.6441,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('5', 12.32, 13.8, 9.76, 14.35, {
        role: 'headline',
        fontSize: 73.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('14', 6.19, 90.67, 2.02, 1.43, {
        role: 'caption',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 15: Article Spread (P. 15)
export function buildCanvaPage15(): TemplatePage {
  return {
    id: eid('page-canva-15'),
    kind: 'feature-story',
    name: 'Article Spread (P. 15)',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/wcfcY/MAEo73wcfcY/1/s.jpg', 13.38, 6.6, 29.65, 31.47, { borderRadius: 4, zIndex: 1 }),
      img('https://media-public.canva.com/ODffg/MAEo73ODffg/1/s.jpg', 50, 50, 100, 100, { borderRadius: 4, zIndex: 1 }),
      txt('By Phyllis Schwaiger Photography by Jin Ae Soo', 20.1, 12.75, 26.76, 2.85, {
        role: 'body',
        fontSize: 12,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('A short intro or kicker of the listicle will go here. This part acts as a bridge between the headline and the items on the list.', 20.1, 19.34, 26.76, 5.91, {
        role: 'body',
        fontSize: 12,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('Invest in staples', 49.9, 69.41, 27.45, 2.1, {
        role: 'subheading',
        fontSize: 22.1373,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Have them altered', 80.34, 69.41, 27.56, 2.1, {
        role: 'subheading',
        fontSize: 22.1373,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('A magazine is a periodical publication, which can either be printed or published electronically. It is issued regularly, usually every week or every month, and it contains a variety of content. This can include articles, stories, photographs, and advertisements.', 49.9, 81.42, 27.45, 12.05, {
        role: 'body',
        fontSize: 12,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('A magazine is a periodical publication, which can either be printed or published electronically. It is issued regularly, usually every week or every month, and it contains a variety of content. This can include articles, stories, photographs, and advertisements.', 80.28, 81.42, 27.45, 12.05, {
        role: 'body',
        fontSize: 12,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('15', 93.17, 90.92, 2.02, 1.43, {
        role: 'caption',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 16: Article Spread (P. 16)
export function buildCanvaPage16(): TemplatePage {
  return {
    id: eid('page-canva-16'),
    kind: 'feature-story',
    name: 'Article Spread (P. 16)',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/U7mRw/MAEo77U7mRw/1/s3.jpg', 30.88, 46.97, 88.56, 93.93, { borderRadius: 4, zIndex: 1 }),
      txt('You are What You Wear', 27.45, 77.41, 42.16, 9.36, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('A short intro or kicker of the article will go here. This part acts as a bridge between the headline and the article itself.', 34.8, 85.94, 57.84, 2.97, {
        role: 'headline',
        fontSize: 30.3844,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('A magazine is a periodical publication, which can either be printed or published electronically. It is issued regularly, usually every week or every month, and it contains a variety of content. This can include articles, stories, photographs, and advertisements.', 80.39, 29.93, 27.45, 37.21, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('16', 6.89, 90.67, 2.02, 1.43, {
        role: 'caption',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 17: Article Spread (P. 17)
export function buildCanvaPage17(): TemplatePage {
  return {
    id: eid('page-canva-17'),
    kind: 'feature-story',
    name: 'Article Spread (P. 17)',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/hRPlo/MAEo7_hRPlo/1/s2.jpg', 50, 50, 100, 100, { borderRadius: 4, zIndex: 1 }),
      img('https://media-public.canva.com/FcMQE/MAEo77FcMQE/1/s2.jpg', 4.46, 15.61, 52.72, 55.91, { borderRadius: 4, zIndex: 1 }),
      img('https://media-public.canva.com/AGaKU/MAEo74AGaKU/1/s2.jpg', 21.32, 21.79, 42.65, 45.23, { borderRadius: 4, zIndex: 1 }),
      txt('Updating a wardrobe does not require starting over. Begin with fit: tailoring can transform what you already own. Add one versatile layer, replace worn basics thoughtfully and use colour or accessories to shift familiar combinations. Renting for special occasions and buying pre-owned can expand your options without filling the closet. The goal is a wardrobe that works harder, reflects you more clearly and makes getting dressed easier.', 27.2, 81.3, 42.65, 12.26, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('By Wendy Salinas Photography by Aaron Loeb', 80.39, 86.15, 27.45, 2.58, {
        role: 'body',
        fontSize: 12.0002,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('17', 93.03, 90.67, 2.02, 1.43, {
        role: 'caption',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 18: Passion for Fashion
export function buildCanvaPage18(): TemplatePage {
  return {
    id: eid('page-canva-18'),
    kind: 'feature-story',
    name: 'Passion for Fashion',
    background: { type: 'solid', color: '#0F1012' },
    elements: [
      img('https://media-public.canva.com/5A3YA/MAEo725A3YA/1/s2.jpg', 28.92, 30.68, 57.84, 61.35, { borderRadius: 4, zIndex: 1 }),
      txt('A', 36.17, 15.05, 12.82, 9.78, {
        role: 'headline',
        fontSize: 94.6871,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('A', 47.06, 85.62, 12.13, 9.78, {
        role: 'headline',
        fontSize: 94.6871,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('P', 26.57, 14.13, 10.99, 8.74, {
        role: 'headline',
        fontSize: 74.78,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('ssion', 61.09, 14.13, 35.65, 8.75, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('For', 20.16, 84.57, 28.56, 8.74, {
        role: 'headline',
        fontSize: 74.78,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('F', 41, 84.58, 6.9, 8.75, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Shion', 74.42, 84.58, 39.4, 8.75, {
        role: 'headline',
        fontSize: 45.3333,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('18', 6.89, 90.67, 2.02, 1.43, {
        role: 'caption',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 19: Article Spread (P. 19)
export function buildCanvaPage19(): TemplatePage {
  return {
    id: eid('page-canva-19'),
    kind: 'feature-story',
    name: 'Article Spread (P. 19)',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/ibxtA/MAEo74ibxtA/1/s2.jpg', 21.32, 19.11, 42.65, 45.26, { borderRadius: 4, zIndex: 1 }),
      img('https://media-public.canva.com/inVdo/MAEo71inVdo/1/s2.jpg', 21.32, 7.32, 42.65, 45.26, { borderRadius: 4, zIndex: 1 }),
      txt('A magazine is a periodical publication, which can either be printed or published electronically. It is issued regularly, usually every week or every month, and it contains a variety of content. This can include articles, stories, photographs, and advertisements.', 72.8, 29.93, 42.65, 37.21, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('A short intro or kicker of the listicle will go here. This part acts as a bridge between the headline and the items on the list.', 27.2, 13.55, 42.65, 4.46, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('19', 92.9, 90.67, 2.02, 1.43, {
        role: 'caption',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 20: Article Spread (P. 20)
export function buildCanvaPage20(): TemplatePage {
  return {
    id: eid('page-canva-20'),
    kind: 'full-photo',
    name: 'Article Spread (P. 20)',
    background: { type: 'solid', color: '#0F1012' },
    elements: [
      img('https://media-public.canva.com/vhiMk/MAEo7zvhiMk/1/s3.jpg', 51.47, 39.5, 102.94, 109.18, { borderRadius: 4, zIndex: 1 }),
      txt('20', 6.89, 90.67, 2.02, 1.43, {
        role: 'caption',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 21: Article Spread (P. 21)
export function buildCanvaPage21(): TemplatePage {
  return {
    id: eid('page-canva-21'),
    kind: 'feature-story',
    name: 'Article Spread (P. 21)',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      img('https://media-public.canva.com/l9YRE/MAEo72l9YRE/1/s2.jpg', 21.32, 12.02, 42.65, 45.23, { borderRadius: 4, zIndex: 1 }),
      img('https://media-public.canva.com/oP19E/MAEo70oP19E/1/s.jpg', 14.54, 15.37, 31.7, 33.62, { borderRadius: 4, zIndex: 1 }),
      txt('The future of fashion is being shaped by better systems as much as better silhouettes. New materials are reducing waste, digital sampling is limiting unnecessary prototypes and local production is shortening supply chains. None of these solutions works alone, but together they offer a more resilient model-one where design begins with the full life of a garment in mind.', 72.8, 72.73, 42.65, 10.7, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('"Innovation matters most when it makes good design easier to keep, repair and reuse."', 40.94, 53.13, 45.59, 6.26, {
        role: 'body',
        fontSize: 13.3335,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('21', 92.96, 90.67, 2.02, 1.43, {
        role: 'caption',
        fontSize: 15.9999,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
    ],
  };
}

// Page 22: Subscription Offer
export function buildCanvaPage22(): TemplatePage {
  return {
    id: eid('page-canva-22'),
    kind: 'feature-story',
    name: 'Subscription Offer',
    background: { type: 'solid', color: '#F8F8F8' },
    elements: [
      img('https://media-public.canva.com/W6B4E/MAEo70W6B4E/1/s2.jpg', 21.32, 22.63, 42.65, 45.26, { borderRadius: 4, zIndex: 1 }),
      txt('Never miss an issue!', 33.36, 81.11, 30.44, 1.34, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Check out our online edition', 80.57, 81.11, 27.08, 1.34, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Enjoy huge savings Free home delivery Get your copy before everyone else', 33.31, 85.17, 30.15, 4.46, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Catch the freshest features Updated daily Read anytime, anywhere', 80.57, 85.2, 27.08, 4.46, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Subscribe to Summer June', 27.13, 14.07, 42.51, 5.5, {
        role: 'headline',
        fontSize: 26.6665,
        color: '#1C1C1E',
        fontKey: 'serif',
      }),
      txt('www.reallygreatsite.com', 72.82, 11.99, 42.6, 1.34, {
        role: 'body',
        fontSize: 13.3335,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
    ],
  };
}

// Page 23: Advertisement
export function buildCanvaPage23(): TemplatePage {
  return {
    id: eid('page-canva-23'),
    kind: 'full-photo',
    name: 'Advertisement',
    background: { type: 'solid', color: '#0F1012' },
    elements: [
      img('https://media-public.canva.com/XzK1U/MAEo7-XzK1U/1/s3.jpg', 51.47, 54.63, 102.94, 109.25, { borderRadius: 4, zIndex: 1 }),
      txt('Advertisement', 19.61, 86.39, 27.45, 2.08, {
        role: 'subheading',
        fontSize: 20.0003,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
    ],
  };
}

// Page 24: Back Cover
export function buildCanvaPage24(): TemplatePage {
  return {
    id: eid('page-canva-24'),
    kind: 'back-cover',
    name: 'Back Cover',
    background: { type: 'solid', color: '#0F1012' },
    elements: [
      img('https://media-public.canva.com/hmyEM/MAEo72hmyEM/1/s3.jpg', 51.47, 54.59, 102.94, 109.18, { borderRadius: 4, zIndex: 1 }),
      shp('rectangle', 87.99, 90.65, 2.66, 8.67, 'barcode', { zIndex: 3 }),
      shp('rectangle', 85, 91, 16, 8, 'barcode', { zIndex: 3 }),
      txt('SUMMER JUNE  •  ISSUE 08  •  JULY 2035', 40, 91, 60, 4, { role: 'caption', fontSize: 11, color: '#FFFFFF', fontKey: 'condensed', zIndex: 3 }),
    ],
  };
}

// Page 25: Behind the Issue
export function buildCanvaPage25(): TemplatePage {
  return {
    id: eid('page-canva-25'),
    kind: 'feature-story',
    name: 'Behind the Issue',
    background: { type: 'solid', color: '#F8F8F8' },
    elements: [
      shp('rectangle', 26.13, 42.95, 1.11, 0.61, 'barcode', { zIndex: 3 }),
      shp('rectangle', 42.8, 46.2, 2.03, 1.44, 'barcode', { zIndex: 3 }),
      shp('rectangle', 31.2, 47.8, 25.24, 0.85, 'barcode', { zIndex: 3 }),
      shp('rectangle', 31.2, 52.22, 25.24, 0.85, 'barcode', { zIndex: 3 }),
      shp('rectangle', 19.69, 50.87, 2.23, 1.09, 'barcode', { zIndex: 3 }),
      shp('rectangle', 19.77, 53.94, 2.23, 1.58, 'barcode', { zIndex: 3 }),
      shp('rectangle', 43.2, 53.94, 2.09, 0.78, 'barcode', { zIndex: 3 }),
      shp('rectangle', 19.77, 49.26, 1.75, 1.23, 'barcode', { zIndex: 3 }),
      shp('rectangle', 20.13, 48.95, 1.41, 0.99, 'barcode', { zIndex: 3 }),
      shp('rectangle', 31.2, 73.88, 25.24, 0.85, 'barcode', { zIndex: 3 }),
      shp('rectangle', 39.78, 69.5, 1.06, 0.36, 'barcode', { zIndex: 3 }),
      shp('rectangle', 43.03, 69.5, 1.46, 0.88, 'barcode', { zIndex: 3 }),
      txt('Issue Production', 29.85, 42.95, 21.52, 1.59, {
        role: 'body',
        fontSize: 12,
        color: '#FFFFFF',
        fontKey: 'condensed',
      }),
      txt('R', 40.66, 69.49, 1.05, 1.17, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('01', 31.2, 36.96, 33.1, 2.68, {
        role: 'caption',
        fontSize: 20,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('Every issue begins with a clear editorial theme, a focused story list and a shared visual direction.', 68.8, 42.19, 33.1, 4.84, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Planning', 26.5, 46.2, 15.69, 1.55, {
        role: 'subheading',
        fontSize: 16.5928,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Moodboard Story list', 29.03, 50.01, 13.6, 2.97, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Layout', 27.12, 53.98, 9.78, 1.25, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('02', 31.22, 63.64, 33.06, 2.68, {
        role: 'caption',
        fontSize: 20,
        color: '#FFFFFF',
        fontKey: 'condensed',
        badgeColor: '#1C1C1E',
      }),
      txt('Editors refine the grid, test pacing and balance long reads with strong visual moments before pages move into proofing.', 68.81, 69.46, 33.08, 6.52, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Columns Spacing', 28.6, 70.66, 19.22, 3.44, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Margins Print checks', 29.47, 77.06, 20.97, 3.44, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('A consistent grid keeps headlines, body copy and imagery clear while allowing each feature to develop its own rhythm.', 50, 27.22, 66.11, 3.09, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Final proofs are reviewed for copy, colour, image quality and production accuracy.', 50.01, 93.21, 74.45, 4.16, {
        role: 'subheading',
        fontSize: 20,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('Behind the Issue', 57.24, 15.81, 63.58, 13.36, {
        role: 'headline',
        fontSize: 50.6666,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('How it comes together', 46.15, 11.07, 41.4, 6.96, {
        role: 'headline',
        fontSize: 26.6667,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
    ],
  };
}

// Page 26: Inside the Studio
export function buildCanvaPage26(): TemplatePage {
  return {
    id: eid('page-canva-26'),
    kind: 'feature-story',
    name: 'Inside the Studio',
    background: { type: 'solid', color: '#FFFFFF' },
    elements: [
      txt('Concept and commissioning', 15.04, 2.99, 26.14, 3.46, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Photography and styling', 15.04, 2.06, 26.14, 1.59, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Editing and production', 15.23, 2.06, 26.51, 1.59, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('STORY DEVELOPMENT Writers and editors shape each feature around a clear question, useful context and a distinctive point of view.', 24.45, 66.77, 21.99, 14.49, {
        role: 'body',
        fontSize: 12.4177,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('VISUAL DIRECTION Photography, illustration and typography are planned together to create a cohesive pace across the issue.', 75.56, 66.21, 21.95, 13.38, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('FINAL PRODUCTION Copy, colour and image files are checked carefully before the magazine is prepared for print and digital release.', 49.99, 66.21, 21.99, 13.38, {
        role: 'body',
        fontSize: 13.3333,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('The team reviews every spread as part of a complete reading experience, balancing clarity, energy and breathing room.', 50, 27.22, 66.11, 3.09, {
        role: 'body',
        fontSize: 12,
        color: '#1C1C1E',
        fontKey: 'condensed',
      }),
      txt('Inside the Studio', 57.24, 15.81, 63.58, 13.36, {
        role: 'headline',
        fontSize: 50.6666,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('From idea to print', 46.15, 11.07, 41.4, 6.96, {
        role: 'headline',
        fontSize: 26.6667,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
      txt('This issue was produced with care by our editorial, design and photography teams.', 50.01, 93.21, 74.45, 4.16, {
        role: 'subheading',
        fontSize: 20,
        color: '#FFFFFF',
        fontKey: 'serif',
      }),
    ],
  };
}

export function buildLuxuryFashionTemplate(): MagazineTemplate {
  return {
    id: 'luxury-fashion-summer-june',
    name: 'Summer June (Luxury Fashion & Travel)',
    category: 'Fashion',
    description: 'Black and white luxurious editorial magazine scraped directly from Canva, featuring 24 curated pages with high-fashion photography, dual spreads, listicles, and masthead.',
    tags: ['fashion', 'luxury', 'travel', 'canva', 'editorial', 'black-and-white', '24-pages'],
    palette: ['#0F1012', '#FFFFFF', '#1C1C1E', '#E5E5EA', '#8A8A8E'],
    typography: { display: 'serif', heading: 'serif', body: 'condensed', caption: 'condensed' },
    isPremium: false,
    isFeatured: true,
    isNew: true,
    accentGradient: 'linear-gradient(165deg, #2C2C2E 0%, #1C1C1E 60%, #000000 100%)',
    asset: {
      thumbnailUrl: CANVA_MEDIA.coverHero,
      originalUrl: CANVA_MEDIA.coverHero,
      printUrl: null,
      widthPx: 1240,
      heightPx: 1754,
    },
    dimensions: A4,
    pageNumbers: { ...PAGE_NUMBERS_DEFAULT },
    pages: [
      buildCanvaPage1(),
      buildCanvaPage2(),
      buildCanvaPage3(),
      buildCanvaPage4(),
      buildCanvaPage5(),
      buildCanvaPage6(),
      buildCanvaPage7(),
      buildCanvaPage8(),
      buildCanvaPage9(),
      buildCanvaPage10(),
      buildCanvaPage11(),
      buildCanvaPage12(),
      buildCanvaPage13(),
      buildCanvaPage14(),
      buildCanvaPage15(),
      buildCanvaPage16(),
      buildCanvaPage17(),
      buildCanvaPage18(),
      buildCanvaPage19(),
      buildCanvaPage20(),
      buildCanvaPage21(),
      buildCanvaPage22(),
      buildCanvaPage23(),
      buildCanvaPage24(),
      buildCanvaPage25(),
      buildCanvaPage26(),
    ],
    version: '1.0.0',
    createdAt: '2026-09-06',
    useCount: 120,
  };
}

export const CANVA_PAGE_LAYOUT_ENTRIES = [
  {
    id: 'canva-layout-p1',
    name: 'Canva Luxury Cover',
    description: 'Exact scraped Canva luxury layout for Canva Luxury Cover.',
    build: buildCanvaPage1,
  },
  {
    id: 'canva-layout-p2',
    name: 'Editorial Masthead & Team',
    description: 'Exact scraped Canva luxury layout for Editorial Masthead & Team.',
    build: buildCanvaPage2,
  },
  {
    id: 'canva-layout-p3',
    name: 'What’s Inside (Luxury TOC)',
    description: 'Exact scraped Canva luxury layout for What’s Inside (Luxury TOC).',
    build: buildCanvaPage3,
  },
  {
    id: 'canva-layout-p4',
    name: 'Reader Letters Spread',
    description: 'Exact scraped Canva luxury layout for Reader Letters Spread.',
    build: buildCanvaPage4,
  },
  {
    id: 'canva-layout-p5',
    name: 'Letter from the Editor',
    description: 'Exact scraped Canva luxury layout for Letter from the Editor.',
    build: buildCanvaPage5,
  },
  {
    id: 'canva-layout-p6',
    name: 'Canva Editorial Spread P.6',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.6.',
    build: buildCanvaPage6,
  },
  {
    id: 'canva-layout-p7',
    name: 'Canva Editorial Spread P.7',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.7.',
    build: buildCanvaPage7,
  },
  {
    id: 'canva-layout-p8',
    name: 'Canva Editorial Spread P.8',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.8.',
    build: buildCanvaPage8,
  },
  {
    id: 'canva-layout-p9',
    name: 'Canva Editorial Spread P.9',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.9.',
    build: buildCanvaPage9,
  },
  {
    id: 'canva-layout-p10',
    name: 'Canva Editorial Spread P.10',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.10.',
    build: buildCanvaPage10,
  },
  {
    id: 'canva-layout-p11',
    name: 'Canva Editorial Spread P.11',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.11.',
    build: buildCanvaPage11,
  },
  {
    id: 'canva-layout-p12',
    name: 'Full-Bleed Luxury Ad',
    description: 'Exact scraped Canva luxury layout for Full-Bleed Luxury Ad.',
    build: buildCanvaPage12,
  },
  {
    id: 'canva-layout-p13',
    name: 'Canva Editorial Spread P.13',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.13.',
    build: buildCanvaPage13,
  },
  {
    id: 'canva-layout-p14',
    name: '5 Ways Wardrobe Listicle',
    description: 'Exact scraped Canva luxury layout for 5 Ways Wardrobe Listicle.',
    build: buildCanvaPage14,
  },
  {
    id: 'canva-layout-p15',
    name: 'Canva Editorial Spread P.15',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.15.',
    build: buildCanvaPage15,
  },
  {
    id: 'canva-layout-p16',
    name: 'Canva Editorial Spread P.16',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.16.',
    build: buildCanvaPage16,
  },
  {
    id: 'canva-layout-p17',
    name: 'Canva Editorial Spread P.17',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.17.',
    build: buildCanvaPage17,
  },
  {
    id: 'canva-layout-p18',
    name: 'Passion for Fashion Showcase',
    description: 'Exact scraped Canva luxury layout for Passion for Fashion Showcase.',
    build: buildCanvaPage18,
  },
  {
    id: 'canva-layout-p19',
    name: 'Canva Editorial Spread P.19',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.19.',
    build: buildCanvaPage19,
  },
  {
    id: 'canva-layout-p20',
    name: 'Canva Editorial Spread P.20',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.20.',
    build: buildCanvaPage20,
  },
  {
    id: 'canva-layout-p21',
    name: 'Canva Editorial Spread P.21',
    description: 'Exact scraped Canva luxury layout for Canva Editorial Spread P.21.',
    build: buildCanvaPage21,
  },
  {
    id: 'canva-layout-p22',
    name: 'Magazine Subscription Offer',
    description: 'Exact scraped Canva luxury layout for Magazine Subscription Offer.',
    build: buildCanvaPage22,
  },
  {
    id: 'canva-layout-p23',
    name: 'Full-Bleed Luxury Ad',
    description: 'Exact scraped Canva luxury layout for Full-Bleed Luxury Ad.',
    build: buildCanvaPage23,
  },
  {
    id: 'canva-layout-p24',
    name: 'Luxury Back Cover with Barcode',
    description: 'Exact scraped Canva luxury layout for Luxury Back Cover with Barcode.',
    build: buildCanvaPage24,
  },
  {
    id: 'canva-layout-p25',
    name: 'Behind the Issue (Workflow)',
    description: 'Exact scraped Canva luxury layout for Behind the Issue (Workflow).',
    build: buildCanvaPage25,
  },
  {
    id: 'canva-layout-p26',
    name: 'Inside the Studio (3 Pillars)',
    description: 'Exact scraped Canva luxury layout for Inside the Studio (3 Pillars).',
    build: buildCanvaPage26,
  },
];
