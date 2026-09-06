import type { ElementLibraryItem, TemplateElement, ElementCategory } from './types';

let nextIdCounter = 0;
function id(prefix: string): string {
  nextIdCounter += 1;
  return `${prefix}-${Date.now()}-${nextIdCounter}`;
}

export function encSvg(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

function baseGraphic(
  name: string,
  category: ElementCategory,
  svgDataUri: string,
  tags: string[],
  widthPct = 25,
  heightPct = 25,
  extraOpts: Partial<TemplateElement> = {},
): ElementLibraryItem {
  return {
    id: id(`canva-${category.toLowerCase().replace(/\s+/g, '-')}`),
    name,
    category,
    type: 'image',
    tags: [...tags, category.toLowerCase(), 'canva'],
    isPremium: false,
    create: () => [
      {
        id: id('el-canva-graphic'),
        kind: 'image',
        imgSrc: svgDataUri,
        originalSrc: svgDataUri,
        xPct: 50,
        yPct: 50,
        widthPct,
        heightPct,
        fit: 'fit',
        cropZoom: 1,
        cropXPct: 50,
        cropYPct: 50,
        opacity: 100,
        zIndex: 2,
        ...extraOpts,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 1. MAGIC RECOMMENDATIONS (Direct from Canva Session)
// Exactly matching Canva Magic Recommendations Panel & Element Library
// ---------------------------------------------------------------------------
export const MAGIC_RECOMMENDATION_ITEMS: ElementLibraryItem[] = [
  /**
   * #1. 13e4669c9a.gif
   * Canva ID: 13e4669c9a.gif | Format: 13e4669c9a.gif (684.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/13e4669c9a.gif.gif
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "13e4669c9a.gif",
    'Magic Recommendations',
    '/elements/magic_recommendations/13e4669c9a.gif.gif',
    ["13e4669c9agif", "canva", "graphic", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #2. 475b2a2d34.gif
   * Canva ID: 475b2a2d34.gif | Format: 475b2a2d34.gif (765.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/475b2a2d34.gif.gif
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "475b2a2d34.gif",
    'Magic Recommendations',
    '/elements/magic_recommendations/475b2a2d34.gif.gif',
    ["475b2a2d34gif", "canva", "graphic", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #3. 732adac813.gif
   * Canva ID: 732adac813.gif | Format: 732adac813.gif (240.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/732adac813.gif.gif
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "732adac813.gif",
    'Magic Recommendations',
    '/elements/magic_recommendations/732adac813.gif.gif',
    ["732adac813gif", "canva", "graphic", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #4. 7veeszc0k2.gif
   * Canva ID: 7veeszc0k2.gif | Format: 7veeszc0k2.gif (3.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/7veeszc0k2.gif.gif
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "7veeszc0k2.gif",
    'Magic Recommendations',
    '/elements/magic_recommendations/7veeszc0k2.gif.gif',
    ["7veeszc0k2gif", "canva", "graphic", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #5. Abstract Black Oval Shape
   * Canva ID: MAHBY_v_nT8 | Format: MAHBY_v_nT8.png (1287.7 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAHBY_v_nT8.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Abstract Black Oval Shape",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAHBY_v_nT8.png',
    ["abstract", "black", "canva", "magic", "oval", "photo", "recommendation", "shape"],
    25, 25
  ),
  /**
   * #6. Abstract Gradient Background
   * Canva ID: MAHBY_ZFzrQ | Format: MAHBY_ZFzrQ.png (644.8 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAHBY_ZFzrQ.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Abstract Gradient Background",
    'Gradients',
    '/elements/magic_recommendations/MAHBY_ZFzrQ.png',
    ["abstract", "background", "canva", "gradient", "magic", "photo", "recommendation"],
    40, 40
  ),
  /**
   * #7. Abstract Gradient Background
   * Canva ID: MAHBY2dnpHI | Format: MAHBY2dnpHI.png (1086.6 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAHBY2dnpHI.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Abstract Gradient Background",
    'Gradients',
    '/elements/magic_recommendations/MAHBY2dnpHI.png',
    ["abstract", "background", "canva", "gradient", "magic", "photo", "recommendation"],
    40, 40
  ),
  /**
   * #8. Abstract Orange-Red Gradient Background
   * Canva ID: MAG72gDCDP4 | Format: MAG72gDCDP4.png (2586.2 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAG72gDCDP4.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Abstract Orange-Red Gradient Background",
    'Gradients',
    '/elements/magic_recommendations/MAG72gDCDP4.png',
    ["abstract", "background", "canva", "gradient", "magic", "orange", "photo", "recommendation", "red"],
    40, 40
  ),
  /**
   * #9. Add File Icon
   * Canva ID: MAEPTQSTrRo | Format: MAEPTQSTrRo.svg (1.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEPTQSTrRo.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Add File Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEPTQSTrRo.svg',
    ["add", "canva", "file", "graphic", "icon", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #10. arrow
   * Canva ID: MAFBsJfZY7I | Format: MAFBsJfZY7I.png (1.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFBsJfZY7I.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "arrow",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFBsJfZY7I.png',
    ["arrow", "canva", "graphic", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #11. Arrow Dash
   * Canva ID: MAFzYd7-wAQ | Format: MAFzYd7-wAQ.png (2.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFzYd7-wAQ.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Arrow Dash",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFzYd7-wAQ.png',
    ["arrow", "canva", "dash", "graphic", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #12. Arrow sign y2k element
   * Canva ID: MAGiOp9LAhg | Format: MAGiOp9LAhg.png (4.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGiOp9LAhg.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Arrow sign y2k element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGiOp9LAhg.png',
    ["arrow", "canva", "element", "graphic", "magic", "recommendation", "sign", "y2k"],
    20, 20
  ),
  /**
   * #13. arrow turn left icon
   * Canva ID: MAEwMlZmRiM | Format: MAEwMlZmRiM.svg (0.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEwMlZmRiM.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "arrow turn left icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEwMlZmRiM.svg',
    ["arrow", "canva", "graphic", "icon", "left", "magic", "recommendation", "turn"],
    20, 20
  ),
  /**
   * #14. Arrow, Down arrow creative icon design
   * Canva ID: MAGin0QmZFs | Format: MAGin0QmZFs.png (1.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGin0QmZFs.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Arrow, Down arrow creative icon design",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGin0QmZFs.png',
    ["arrow", "canva", "creative", "design", "down", "graphic", "icon", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #15. Basic Icon Outline Style Black Color
   * Canva ID: MAFdsUrAYUg | Format: MAFdsUrAYUg.png (4.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFdsUrAYUg.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Basic Icon Outline Style Black Color",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFdsUrAYUg.png',
    ["basic", "black", "canva", "color", "graphic", "icon", "magic", "outline", "recommendation", "style"],
    20, 20
  ),
  /**
   * #16. basic line icon
   * Canva ID: MAE9d-xLCsU | Format: MAE9d-xLCsU.png (1.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAE9d-xLCsU.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "basic line icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAE9d-xLCsU.png',
    ["basic", "canva", "graphic", "icon", "line", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #17. Billboard Line Icon
   * Canva ID: MAFEPdluCgw | Format: s3-1.svg (1.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFEPdluCgw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Billboard Line Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFEPdluCgw.svg',
    ["billboard", "canva", "graphic", "icon", "line", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #18. Black Basic Arrow Going Left
   * Canva ID: MADgjUwYUUc | Format: MADgjUwYUUc.svg (0.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADgjUwYUUc.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Black Basic Arrow Going Left",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADgjUwYUUc.svg',
    ["arrow", "basic", "black", "canva", "going", "graphic", "left", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #19. Black Basic Arrow Right
   * Canva ID: MADgjVqX00o | Format: MADgjVqX00o.svg (0.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADgjVqX00o.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Black Basic Arrow Right",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADgjVqX00o.svg',
    ["arrow", "basic", "black", "canva", "graphic", "magic", "recommendation", "right"],
    20, 20
  ),
  /**
   * #20. Black Cat with a Collar
   * Canva ID: MADmd7OpUc8 | Format: MADmd7OpUc8.svg (2.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmd7OpUc8.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Black Cat with a Collar",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmd7OpUc8.svg',
    ["black", "canva", "cat", "collar", "graphic", "magic", "recommendation", "with"],
    25, 25
  ),
  /**
   * #21. Black Paper
   * Canva ID: MADjv_pEVJI | Format: s3.png (1.5 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MADjv_pEVJI.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Black Paper",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADjv_pEVJI.png',
    ["black", "canva", "magic", "paper", "photo", "recommendation"],
    25, 25
  ),
  /**
   * #22. Blessed Flashes on a Magic 8 Ball
   * Canva ID: MADmd8-uAyM | Format: MADmd8-uAyM.svg (22.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmd8-uAyM.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Blessed Flashes on a Magic 8 Ball",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmd8-uAyM.svg',
    ["ball", "blessed", "canva", "flashes", "graphic", "magic", "on", "recommendation"],
    25, 25
  ),
  /**
   * #23. Block Lady Illustration
   * Canva ID: MADmdh174Hc | Format: s3-1.svg (11.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmdh174Hc.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Block Lady Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmdh174Hc.svg',
    ["block", "canva", "graphic", "illustration", "lady", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #24. Block Lady Illustration
   * Canva ID: MADmdsnRqZw | Format: s3-1.svg (15.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmdsnRqZw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Block Lady Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmdsnRqZw.svg',
    ["block", "canva", "graphic", "illustration", "lady", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #25. Block Lady Illustration
   * Canva ID: MADmdgnsUT4 | Format: s3-1.svg (10.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmdgnsUT4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Block Lady Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmdgnsUT4.svg',
    ["block", "canva", "graphic", "illustration", "lady", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #26. Block Lady Illustration
   * Canva ID: MADmdhRhk70 | Format: s3-1.svg (21.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmdhRhk70.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Block Lady Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmdhRhk70.svg',
    ["block", "canva", "graphic", "illustration", "lady", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #27. Block Lady Illustration
   * Canva ID: MADmdru-u1Q | Format: s3-1.svg (9.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmdru-u1Q.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Block Lady Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmdru-u1Q.svg',
    ["block", "canva", "graphic", "illustration", "lady", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #28. Block Lady Illustration
   * Canva ID: MADmdpis7Lw | Format: s3-1.svg (10.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmdpis7Lw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Block Lady Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmdpis7Lw.svg',
    ["block", "canva", "graphic", "illustration", "lady", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #29. Blood Red Ink Splatter Watercolor Art
   * Canva ID: MAHSCRoS6Ek | Format: MAHSCRoS6Ek.png (2223.2 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAHSCRoS6Ek.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Blood Red Ink Splatter Watercolor Art",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAHSCRoS6Ek.png',
    ["art", "blood", "canva", "ink", "magic", "photo", "recommendation", "red", "splatter", "watercolor"],
    25, 25
  ),
  /**
   * #30. blue
   * Canva ID: MAE1PHxDpKw | Format: MAE1PHxDpKw.png (23.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAE1PHxDpKw.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "blue",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAE1PHxDpKw.png',
    ["blue", "canva", "graphic", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #31. blue
   * Canva ID: MAE1NmJp3Ug | Format: MAE1NmJp3Ug.png (33.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAE1NmJp3Ug.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "blue",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAE1NmJp3Ug.png',
    ["blue", "canva", "graphic", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #32. Blue and Purple Leaves
   * Canva ID: MADo-2LnGpM | Format: thumbnail.png (4.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADo-2LnGpM.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Blue and Purple Leaves",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADo-2LnGpM.png',
    ["and", "blue", "canva", "graphic", "leaves", "magic", "purple", "recommendation"],
    25, 25
  ),
  /**
   * #33. Blue and Red Leaves
   * Canva ID: MADo-9RFgzQ | Format: thumbnail.png (7.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADo-9RFgzQ.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Blue and Red Leaves",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADo-9RFgzQ.png',
    ["and", "blue", "canva", "graphic", "leaves", "magic", "recommendation", "red"],
    25, 25
  ),
  /**
   * #34. Blue and Yellow Orange
   * Canva ID: MADtw7DyF9U | Format: s3-1.svg (5.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADtw7DyF9U.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Blue and Yellow Orange",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADtw7DyF9U.svg',
    ["and", "blue", "canva", "graphic", "magic", "orange", "recommendation", "yellow"],
    25, 25
  ),
  /**
   * #35. Blue Leaves with Red Dots and Stem
   * Canva ID: MADo-xt_lXo | Format: thumbnail.png (6.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADo-xt_lXo.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Blue Leaves with Red Dots and Stem",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADo-xt_lXo.png',
    ["and", "blue", "canva", "dots", "graphic", "leaves", "magic", "recommendation", "red", "stem", "with"],
    25, 25
  ),
  /**
   * #36. Bold Schematic Polygonal Congrats Sticker
   * Canva ID: MAFV8Y2ph-M | Format: MAFV8Y2ph-M.svg (10.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFV8Y2ph-M.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Schematic Polygonal Congrats Sticker",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFV8Y2ph-M.svg',
    ["bold", "canva", "congrats", "graphic", "magic", "polygonal", "recommendation", "schematic", "sticker"],
    25, 25
  ),
  /**
   * #37. Bold Schematic Polygonal Handshake Sticker
   * Canva ID: MAFV8THxPvg | Format: MAFV8THxPvg.svg (5.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFV8THxPvg.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Schematic Polygonal Handshake Sticker",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFV8THxPvg.svg',
    ["bold", "canva", "graphic", "handshake", "magic", "polygonal", "recommendation", "schematic", "sticker"],
    25, 25
  ),
  /**
   * #38. Bold Schematic Polygonal Party Popper Sticker
   * Canva ID: MAFV8RodPWw | Format: MAFV8RodPWw.svg (4.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFV8RodPWw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Schematic Polygonal Party Popper Sticker",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFV8RodPWw.svg',
    ["bold", "canva", "graphic", "magic", "party", "polygonal", "popper", "recommendation", "schematic", "sticker"],
    25, 25
  ),
  /**
   * #39. Bold Schematic Polygonal Period
   * Canva ID: MAFV8TCnGLQ | Format: MAFV8TCnGLQ.svg (0.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFV8TCnGLQ.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Schematic Polygonal Period",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFV8TCnGLQ.svg',
    ["bold", "canva", "graphic", "magic", "period", "polygonal", "recommendation", "schematic"],
    25, 25
  ),
  /**
   * #40. Bold Schematic Polygonal Presentation Sticker
   * Canva ID: MAFV8Y6B9Lc | Format: MAFV8Y6B9Lc.svg (9.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFV8Y6B9Lc.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Schematic Polygonal Presentation Sticker",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFV8Y6B9Lc.svg',
    ["bold", "canva", "graphic", "magic", "polygonal", "presentation", "recommendation", "schematic", "sticker"],
    25, 25
  ),
  /**
   * #41. Bold Schematic Polygonal Welcome to the Team Sticker
   * Canva ID: MAFV8QOzit0 | Format: MAFV8QOzit0.svg (13.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFV8QOzit0.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Schematic Polygonal Welcome to the Team Sticker",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFV8QOzit0.svg',
    ["bold", "canva", "graphic", "magic", "polygonal", "recommendation", "schematic", "sticker", "team", "the", "to", "welcome"],
    25, 25
  ),
  /**
   * #42. Bold Schematic Polygonal WFH Sticker
   * Canva ID: MAFV8cwRjuY | Format: MAFV8cwRjuY.svg (3.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFV8cwRjuY.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Schematic Polygonal WFH Sticker",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFV8cwRjuY.svg',
    ["bold", "canva", "graphic", "magic", "polygonal", "recommendation", "schematic", "sticker", "wfh"],
    25, 25
  ),
  /**
   * #43. Bold Vector Palms
   * Canva ID: MADyt5N-zW0 | Format: MADyt5N-zW0.svg (67.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADyt5N-zW0.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Vector Palms",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADyt5N-zW0.svg',
    ["bold", "canva", "graphic", "magic", "palms", "recommendation", "vector"],
    25, 25
  ),
  /**
   * #44. Bold Vector Palms
   * Canva ID: MADytx0Bh74 | Format: MADytx0Bh74.svg (18.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADytx0Bh74.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Vector Palms",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADytx0Bh74.svg',
    ["bold", "canva", "graphic", "magic", "palms", "recommendation", "vector"],
    25, 25
  ),
  /**
   * #45. Bold Vector Palms
   * Canva ID: MADyt3wZV1s | Format: MADyt3wZV1s.svg (17.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADyt3wZV1s.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Vector Palms",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADyt3wZV1s.svg',
    ["bold", "canva", "graphic", "magic", "palms", "recommendation", "vector"],
    25, 25
  ),
  /**
   * #46. Bold Vector Palms
   * Canva ID: MADyt36uK-o | Format: MADyt36uK-o.svg (58.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADyt36uK-o.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Vector Palms",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADyt36uK-o.svg',
    ["bold", "canva", "graphic", "magic", "palms", "recommendation", "vector"],
    25, 25
  ),
  /**
   * #47. Bold Vector Palms
   * Canva ID: MADytywg24A | Format: MADytywg24A.svg (107.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADytywg24A.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Vector Palms",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADytywg24A.svg',
    ["bold", "canva", "graphic", "magic", "palms", "recommendation", "vector"],
    25, 25
  ),
  /**
   * #48. Bold Vector Palms
   * Canva ID: MADyt7WBHfk | Format: MADyt7WBHfk.svg (22.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADyt7WBHfk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Bold Vector Palms",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADyt7WBHfk.svg',
    ["bold", "canva", "graphic", "magic", "palms", "recommendation", "vector"],
    25, 25
  ),
  /**
   * #49. Borneo Elephant Illustration
   * Canva ID: MAEOTULaou4 | Format: MAEOTULaou4.svg (64.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEOTULaou4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Borneo Elephant Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEOTULaou4.svg',
    ["borneo", "canva", "elephant", "graphic", "illustration", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #50. Buildable Instagram UI Add Outlined Icon
   * Canva ID: MAEujxEWUis | Format: MAEujxEWUis.svg (1.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEujxEWUis.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Add Outlined Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEujxEWUis.svg',
    ["add", "buildable", "canva", "graphic", "icon", "instagram", "magic", "outlined", "recommendation", "ui"],
    20, 20
  ),
  /**
   * #51. Buildable Instagram UI Arrow Down Icon
   * Canva ID: MAEuj-i5XM4 | Format: MAEuj-i5XM4.svg (0.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj-i5XM4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Arrow Down Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj-i5XM4.svg',
    ["arrow", "buildable", "canva", "down", "graphic", "icon", "instagram", "magic", "recommendation", "ui"],
    20, 20
  ),
  /**
   * #52. Buildable Instagram UI Download Icon
   * Canva ID: MAEuj7deb7I | Format: MAEuj7deb7I.svg (2.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj7deb7I.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Download Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj7deb7I.svg',
    ["buildable", "canva", "download", "graphic", "icon", "instagram", "magic", "recommendation", "ui"],
    20, 20
  ),
  /**
   * #53. Buildable Instagram UI Feed Icon
   * Canva ID: MAEuj8d8ZiA | Format: MAEuj8d8ZiA.svg (1.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj8d8ZiA.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Feed Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj8d8ZiA.svg',
    ["buildable", "canva", "feed", "graphic", "icon", "instagram", "magic", "recommendation", "ui"],
    20, 20
  ),
  /**
   * #54. Buildable Instagram UI Filled Person Icon
   * Canva ID: MAEuj_OEQ9I | Format: s3-1.svg (0.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj_OEQ9I.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Filled Person Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj_OEQ9I.svg',
    ["buildable", "canva", "filled", "graphic", "icon", "instagram", "magic", "person", "recommendation", "ui"],
    20, 20
  ),
  /**
   * #55. Buildable Instagram UI Filled Profile Icon
   * Canva ID: MAEuj5ZkY4E | Format: s3-1.svg (1.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj5ZkY4E.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Filled Profile Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj5ZkY4E.svg',
    ["buildable", "canva", "filled", "graphic", "icon", "instagram", "magic", "profile", "recommendation", "ui"],
    20, 20
  ),
  /**
   * #56. Buildable Instagram UI Filled Reels Icon
   * Canva ID: MAEuj8xKnCI | Format: MAEuj8xKnCI.svg (1.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj8xKnCI.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Filled Reels Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj8xKnCI.svg',
    ["buildable", "canva", "filled", "graphic", "icon", "instagram", "magic", "recommendation", "reels", "ui"],
    20, 20
  ),
  /**
   * #57. Buildable Instagram UI Outlined Bookmark Save Icon
   * Canva ID: MAEuj4ulauw | Format: MAEuj4ulauw.svg (1.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj4ulauw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Outlined Bookmark Save Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj4ulauw.svg',
    ["bookmark", "buildable", "canva", "graphic", "icon", "instagram", "magic", "outlined", "recommendation", "save", "ui"],
    20, 20
  ),
  /**
   * #58. Buildable Instagram UI Outlined Follow Icon
   * Canva ID: MAEuj7GVhn4 | Format: MAEuj7GVhn4.svg (1.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj7GVhn4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Outlined Follow Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj7GVhn4.svg',
    ["buildable", "canva", "follow", "graphic", "icon", "instagram", "magic", "outlined", "recommendation", "ui"],
    20, 20
  ),
  /**
   * #59. Buildable Instagram UI Outlined Home Icon
   * Canva ID: MAEuj4sMH0s | Format: MAEuj4sMH0s.svg (1.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj4sMH0s.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Outlined Home Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj4sMH0s.svg',
    ["buildable", "canva", "graphic", "home", "icon", "instagram", "magic", "outlined", "recommendation", "ui"],
    20, 20
  ),
  /**
   * #60. Buildable Instagram UI Outlined Reels Icon
   * Canva ID: MAEuj4KPqLU | Format: MAEuj4KPqLU.svg (2.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj4KPqLU.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Outlined Reels Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj4KPqLU.svg',
    ["buildable", "canva", "graphic", "icon", "instagram", "magic", "outlined", "recommendation", "reels", "ui"],
    20, 20
  ),
  /**
   * #61. Buildable Instagram UI Outlined Search Icon
   * Canva ID: MAEuj6SppTo | Format: MAEuj6SppTo.svg (1.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj6SppTo.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Outlined Search Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj6SppTo.svg',
    ["buildable", "canva", "graphic", "icon", "instagram", "magic", "outlined", "recommendation", "search", "ui"],
    20, 20
  ),
  /**
   * #62. Buildable Instagram UI Outlined Tagged Person Icon
   * Canva ID: MAEujwmRYwo | Format: MAEujwmRYwo.svg (2.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEujwmRYwo.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Outlined Tagged Person Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEujwmRYwo.svg',
    ["buildable", "canva", "graphic", "icon", "instagram", "magic", "outlined", "person", "recommendation", "tagged", "ui"],
    20, 20
  ),
  /**
   * #63. Buildable Instagram UI Plus Icon
   * Canva ID: MAEuj_mQnvo | Format: MAEuj_mQnvo.svg (0.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj_mQnvo.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Plus Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj_mQnvo.svg',
    ["buildable", "canva", "graphic", "icon", "instagram", "magic", "plus", "recommendation", "ui"],
    20, 20
  ),
  /**
   * #64. Buildable Instagram UI Thick Fill Outlined Search Icon
   * Canva ID: MAEuj0Nm4e8 | Format: MAEuj0Nm4e8.svg (1.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj0Nm4e8.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Thick Fill Outlined Search Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj0Nm4e8.svg',
    ["buildable", "canva", "fill", "graphic", "icon", "instagram", "magic", "outlined", "recommendation", "search", "thick", "ui"],
    20, 20
  ),
  /**
   * #65. Buildable Instagram UI Three Bar Lines Icon
   * Canva ID: MAEuj4H4Pwo | Format: MAEuj4H4Pwo.svg (0.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj4H4Pwo.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Three Bar Lines Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj4H4Pwo.svg',
    ["bar", "buildable", "canva", "graphic", "icon", "instagram", "lines", "magic", "recommendation", "three", "ui"],
    20, 20
  ),
  /**
   * #66. Buildable Instagram UI Three Dots Icon
   * Canva ID: MAEuj7P0OSg | Format: MAEuj7P0OSg.svg (0.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEuj7P0OSg.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI Three Dots Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEuj7P0OSg.svg',
    ["buildable", "canva", "dots", "graphic", "icon", "instagram", "magic", "recommendation", "three", "ui"],
    20, 20
  ),
  /**
   * #67. Buildable Instagram UI X Icon
   * Canva ID: MAEujxMJXz0 | Format: MAEujxMJXz0.svg (1.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEujxMJXz0.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Instagram UI X Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEujxMJXz0.svg',
    ["buildable", "canva", "graphic", "icon", "instagram", "magic", "recommendation", "ui"],
    20, 20
  ),
  /**
   * #68. Buildable Twitter UI Retweet Icon
   * Canva ID: MAEvNubA7b4 | Format: MAEvNubA7b4.svg (1.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEvNubA7b4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Buildable Twitter UI Retweet Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEvNubA7b4.svg',
    ["buildable", "canva", "graphic", "icon", "magic", "recommendation", "retweet", "twitter", "ui"],
    20, 20
  ),
  /**
   * #69. carousel slideshow icon
   * Canva ID: MAFAy_2DUng | Format: MAFAy_2DUng.svg (0.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFAy_2DUng.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "carousel slideshow icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFAy_2DUng.svg',
    ["canva", "carousel", "graphic", "icon", "magic", "recommendation", "slideshow"],
    20, 20
  ),
  /**
   * #70. Cartoon Country Morocco Sticker
   * Canva ID: MAEF6SZ33jw | Format: s3-1.svg (31.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEF6SZ33jw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Cartoon Country Morocco Sticker",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEF6SZ33jw.svg',
    ["canva", "cartoon", "country", "graphic", "magic", "morocco", "recommendation", "sticker"],
    25, 25
  ),
  /**
   * #71. Chevron Down Vector Icon
   * Canva ID: MAG8W_rdHRo | Format: MAG8W_rdHRo.png (5.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAG8W_rdHRo.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Chevron Down Vector Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAG8W_rdHRo.png',
    ["canva", "chevron", "down", "graphic", "icon", "magic", "recommendation", "vector"],
    20, 20
  ),
  /**
   * #72. Chevron Up Vector Icon
   * Canva ID: MAHS3GL3LWo | Format: MAHS3GL3LWo.png (2.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAHS3GL3LWo.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Chevron Up Vector Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAHS3GL3LWo.png',
    ["canva", "chevron", "graphic", "icon", "magic", "recommendation", "up", "vector"],
    20, 20
  ),
  /**
   * #73. Chinese Egg Tart
   * Canva ID: MAD9b0cCMu4 | Format: s3-1.svg (561.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAD9b0cCMu4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Chinese Egg Tart",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAD9b0cCMu4.svg',
    ["canva", "chinese", "egg", "graphic", "magic", "recommendation", "tart"],
    25, 25
  ),
  /**
   * #74. cog gear settings icon
   * Canva ID: MAEtwGYmsTg | Format: MAEtwGYmsTg.svg (2.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEtwGYmsTg.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "cog gear settings icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEtwGYmsTg.svg',
    ["canva", "cog", "gear", "graphic", "icon", "magic", "recommendation", "settings"],
    20, 20
  ),
  /**
   * #75. Collapse Content Minimize Icon
   * Canva ID: MAGifHMZa5k | Format: MAGifHMZa5k.png (0.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGifHMZa5k.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Collapse Content Minimize Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGifHMZa5k.png',
    ["canva", "collapse", "content", "graphic", "icon", "magic", "minimize", "recommendation"],
    20, 20
  ),
  /**
   * #76. Corner Frames with Two Down Arrow heads
   * Canva ID: MAEGEHgvZkI | Format: MAEGEHgvZkI.png (16.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEGEHgvZkI.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Corner Frames with Two Down Arrow heads",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEGEHgvZkI.png',
    ["arrow", "canva", "corner", "down", "frames", "graphic", "heads", "magic", "recommendation", "two", "with"],
    20, 20
  ),
  /**
   * #77. Crafted Illustrative Lined Chili Pepper
   * Canva ID: MAFf9hkqh0g | Format: s3-1.svg (90.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFf9hkqh0g.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Crafted Illustrative Lined Chili Pepper",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFf9hkqh0g.svg',
    ["canva", "chili", "crafted", "graphic", "illustrative", "lined", "magic", "pepper", "recommendation"],
    25, 25
  ),
  /**
   * #78. Crown icon
   * Canva ID: MAFlDV5nZUs | Format: MAFlDV5nZUs.svg (1.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFlDV5nZUs.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Crown icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFlDV5nZUs.svg',
    ["canva", "crown", "graphic", "icon", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #79. Cute Blobfish Watercolor Illustration
   * Canva ID: MAHSIjcLQ7g | Format: MAHSIjcLQ7g.png (2553.6 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAHSIjcLQ7g.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Cute Blobfish Watercolor Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAHSIjcLQ7g.png',
    ["blobfish", "canva", "cute", "illustration", "magic", "photo", "recommendation", "watercolor"],
    25, 25
  ),
  /**
   * #80. Cute Handdrawn Gracias Typography in Speech Bubble
   * Canva ID: MAE1r4Q3vn4 | Format: s3-1.svg (9.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAE1r4Q3vn4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Cute Handdrawn Gracias Typography in Speech Bubble",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAE1r4Q3vn4.svg',
    ["bubble", "canva", "cute", "gracias", "graphic", "handdrawn", "in", "magic", "recommendation", "speech", "typography"],
    25, 25
  ),
  /**
   * #81. Discord Logo
   * Canva ID: MAGzZ0J4AMg | Format: MAGzZ0J4AMg.svg (2.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzZ0J4AMg.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Discord Logo",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzZ0J4AMg.svg',
    ["canva", "discord", "graphic", "logo", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #82. Discord Logo
   * Canva ID: MAGzZ0yqbBM | Format: MAGzZ0yqbBM.svg (3.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzZ0yqbBM.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Discord Logo",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzZ0yqbBM.svg',
    ["canva", "discord", "graphic", "logo", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #83. Doodle Brushstroke SMB Daily Income
   * Canva ID: MAGSML6NKlw | Format: s3-1.svg (357.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGSML6NKlw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Doodle Brushstroke SMB Daily Income",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGSML6NKlw.svg',
    ["brushstroke", "canva", "daily", "doodle", "graphic", "income", "magic", "recommendation", "smb"],
    25, 25
  ),
  /**
   * #84. Dopamine Brights Cutout Scanned Scribbled Paper
   * Canva ID: MAFU5dbyn2U | Format: MAFU5dbyn2U.png (752.6 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAFU5dbyn2U.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Dopamine Brights Cutout Scanned Scribbled Paper",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFU5dbyn2U.png',
    ["brights", "canva", "cutout", "dopamine", "magic", "paper", "photo", "recommendation", "scanned", "scribbled"],
    40, 40
  ),
  /**
   * #85. Dopamine Brights Cutout Scanned Scribbled Paper
   * Canva ID: MAFU5UW8SUk | Format: MAFU5UW8SUk.png (583.1 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAFU5UW8SUk.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Dopamine Brights Cutout Scanned Scribbled Paper",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFU5UW8SUk.png',
    ["brights", "canva", "cutout", "dopamine", "magic", "paper", "photo", "recommendation", "scanned", "scribbled"],
    40, 40
  ),
  /**
   * #86. Down Arrow
   * Canva ID: MAF-qU5dlrk | Format: MAF-qU5dlrk.png (3.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAF-qU5dlrk.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Down Arrow",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAF-qU5dlrk.png',
    ["arrow", "canva", "down", "graphic", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #87. Down Arrow Icon
   * Canva ID: MAFsiQjNoD0 | Format: MAFsiQjNoD0.svg (0.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFsiQjNoD0.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Down Arrow Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFsiQjNoD0.svg',
    ["arrow", "canva", "down", "graphic", "icon", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #88. Down Left Arrow Icon
   * Canva ID: MAF-qU9N7j4 | Format: MAF-qU9N7j4.png (3.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAF-qU9N7j4.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Down Left Arrow Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAF-qU9N7j4.png',
    ["arrow", "canva", "down", "graphic", "icon", "left", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #89. expand
   * Canva ID: MAF-eOX_YJQ | Format: MAF-eOX_YJQ.png (2.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAF-eOX_YJQ.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "expand",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAF-eOX_YJQ.png',
    ["canva", "expand", "graphic", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #90. Experimental Grainy Gradient Decorative Square
   * Canva ID: MAFqZxyjtW4 | Format: s3-1.svg (998.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFqZxyjtW4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Experimental Grainy Gradient Decorative Square",
    'Gradients',
    '/elements/magic_recommendations/MAFqZxyjtW4.svg',
    ["canva", "decorative", "experimental", "gradient", "grainy", "graphic", "magic", "recommendation", "square"],
    25, 25
  ),
  /**
   * #91. Eye Against Circular Pattern
   * Canva ID: MADmd4KyIRw | Format: MADmd4KyIRw.svg (25.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmd4KyIRw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Eye Against Circular Pattern",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmd4KyIRw.svg',
    ["against", "canva", "circular", "eye", "graphic", "magic", "pattern", "recommendation"],
    25, 25
  ),
  /**
   * #92. Flat Line Frame
   * Canva ID: MADhBE3MQ5Y | Format: MADhBE3MQ5Y.svg (38.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBE3MQ5Y.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Flat Line Frame",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBE3MQ5Y.svg',
    ["canva", "flat", "frame", "graphic", "line", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #93. Flat Line Frame
   * Canva ID: MADhBJJj-Ys | Format: MADhBJJj-Ys.svg (54.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBJJj-Ys.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Flat Line Frame",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBJJj-Ys.svg',
    ["canva", "flat", "frame", "graphic", "line", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #94. Flat Line Frame
   * Canva ID: MADhBNgwrXw | Format: MADhBNgwrXw.svg (17.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBNgwrXw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Flat Line Frame",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBNgwrXw.svg',
    ["canva", "flat", "frame", "graphic", "line", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #95. Flat Line Frame
   * Canva ID: MADhBAMa1LY | Format: MADhBAMa1LY.svg (4.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBAMa1LY.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Flat Line Frame",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBAMa1LY.svg',
    ["canva", "flat", "frame", "graphic", "line", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #96. Flat Line Frame
   * Canva ID: MADhBHyW3Dw | Format: MADhBHyW3Dw.svg (25.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBHyW3Dw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Flat Line Frame",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBHyW3Dw.svg',
    ["canva", "flat", "frame", "graphic", "line", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #97. Flat Line Frame
   * Canva ID: MADhBJpsy1w | Format: MADhBJpsy1w.svg (50.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBJpsy1w.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Flat Line Frame",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBJpsy1w.svg',
    ["canva", "flat", "frame", "graphic", "line", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #98. Flat Outlined Kangaroo
   * Canva ID: MAFrfK2YuF4 | Format: s3.png (35.3 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAFrfK2YuF4.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Flat Outlined Kangaroo",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFrfK2YuF4.png',
    ["canva", "flat", "kangaroo", "magic", "outlined", "photo", "recommendation"],
    25, 25
  ),
  /**
   * #99. Floral Teacup
   * Canva ID: MAD1uP6A08U | Format: MAD1uP6A08U.svg (154.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAD1uP6A08U.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Floral Teacup",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAD1uP6A08U.svg',
    ["canva", "floral", "graphic", "magic", "recommendation", "teacup"],
    25, 25
  ),
  /**
   * #100. Floral Teacup
   * Canva ID: MAD1uP1LS44 | Format: MAD1uP1LS44.svg (58.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAD1uP1LS44.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Floral Teacup",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAD1uP1LS44.svg',
    ["canva", "floral", "graphic", "magic", "recommendation", "teacup"],
    25, 25
  ),
  /**
   * #101. flower crayon texture wedding ornament
   * Canva ID: MAFG98GldSk | Format: MAFG98GldSk.svg (26.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFG98GldSk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "flower crayon texture wedding ornament",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFG98GldSk.svg',
    ["canva", "crayon", "flower", "graphic", "magic", "ornament", "recommendation", "texture", "wedding"],
    25, 25
  ),
  /**
   * #102. Funky Jaguar
   * Canva ID: MAEMgaQr7ps | Format: MAEMgaQr7ps.svg (181.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEMgaQr7ps.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Funky Jaguar",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEMgaQr7ps.svg',
    ["canva", "funky", "graphic", "jaguar", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #103. Funky Sloth
   * Canva ID: MAEMgdEN5eI | Format: MAEMgdEN5eI.svg (12.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEMgdEN5eI.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Funky Sloth",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEMgdEN5eI.svg',
    ["canva", "funky", "graphic", "magic", "recommendation", "sloth"],
    25, 25
  ),
  /**
   * #104. Funky Yacara Caiman
   * Canva ID: MAEMgWiyFLc | Format: MAEMgWiyFLc.svg (63.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEMgWiyFLc.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Funky Yacara Caiman",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEMgWiyFLc.svg',
    ["caiman", "canva", "funky", "graphic", "magic", "recommendation", "yacara"],
    25, 25
  ),
  /**
   * #105. gbmqontijz.gif
   * Canva ID: gbmqontijz.gif | Format: gbmqontijz.gif (44.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/gbmqontijz.gif.gif
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "gbmqontijz.gif",
    'Magic Recommendations',
    '/elements/magic_recommendations/gbmqontijz.gif.gif',
    ["canva", "gbmqontijzgif", "graphic", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #106. Gear Icon
   * Canva ID: MAFcf371OSg | Format: s3-1.svg (1.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFcf371OSg.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Gear Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFcf371OSg.svg',
    ["canva", "gear", "graphic", "icon", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #107. Gear Outline Icon
   * Canva ID: MAEtntDHA8E | Format: s3-1.svg (2.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEtntDHA8E.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Gear Outline Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEtntDHA8E.svg',
    ["canva", "gear", "graphic", "icon", "magic", "outline", "recommendation"],
    20, 20
  ),
  /**
   * #108. Girl Power Group Circle
   * Canva ID: MADxcHEti0Q | Format: s3-1.svg (19.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcHEti0Q.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Girl Power Group Circle",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcHEti0Q.svg',
    ["canva", "circle", "girl", "graphic", "group", "magic", "power", "recommendation"],
    25, 25
  ),
  /**
   * #109. Girl Power Group Fist up
   * Canva ID: MADxcKqn_kE | Format: s3-1.svg (23.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcKqn_kE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Girl Power Group Fist up",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcKqn_kE.svg',
    ["canva", "fist", "girl", "graphic", "group", "magic", "power", "recommendation", "up"],
    25, 25
  ),
  /**
   * #110. Girl Power Group Foundation
   * Canva ID: MADxcEf1u1c | Format: s3-1.svg (23.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcEf1u1c.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Girl Power Group Foundation",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcEf1u1c.svg',
    ["canva", "foundation", "girl", "graphic", "group", "magic", "power", "recommendation"],
    25, 25
  ),
  /**
   * #111. Girl Power Group Hug
   * Canva ID: MADxcM3jOmk | Format: s3-1.svg (22.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcM3jOmk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Girl Power Group Hug",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcM3jOmk.svg',
    ["canva", "girl", "graphic", "group", "hug", "magic", "power", "recommendation"],
    25, 25
  ),
  /**
   * #112. Girl Power Group I
   * Canva ID: MADxcIN3Bkk | Format: s3-1.svg (32.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcIN3Bkk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Girl Power Group I",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcIN3Bkk.svg',
    ["canva", "girl", "graphic", "group", "magic", "power", "recommendation"],
    25, 25
  ),
  /**
   * #113. Girl Power Group Parade Disability
   * Canva ID: MADxcGL2a0o | Format: s3-1.svg (58.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcGL2a0o.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Girl Power Group Parade Disability",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcGL2a0o.svg',
    ["canva", "disability", "girl", "graphic", "group", "magic", "parade", "power", "recommendation"],
    25, 25
  ),
  /**
   * #114. Glowy Gradient Abstract Brush Stroke Blob
   * Canva ID: MAEn_enGb_Q | Format: MAEn_enGb_Q.png (718.4 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEn_enGb_Q.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Glowy Gradient Abstract Brush Stroke Blob",
    'Gradients',
    '/elements/magic_recommendations/MAEn_enGb_Q.png',
    ["abstract", "blob", "brush", "canva", "glowy", "gradient", "magic", "photo", "recommendation", "stroke"],
    25, 25
  ),
  /**
   * #115. gqo_zjtpwn.gif
   * Canva ID: gqo_zjtpwn.gif | Format: gqo_zjtpwn.gif (16.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/gqo_zjtpwn.gif.gif
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "gqo_zjtpwn.gif",
    'Magic Recommendations',
    '/elements/magic_recommendations/gqo_zjtpwn.gif.gif',
    ["canva", "gqo", "graphic", "magic", "recommendation", "zjtpwngif"],
    25, 25
  ),
  /**
   * #116. Gradient Holographic Portrait Orientation Frame
   * Canva ID: MAC-SHA256 | Format: 230w-mSK42Mv8K5Q.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5GDSPLNH%2F20260906%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260906T081537Z&X-Amz-Expires=275787&X-Amz-Signature=306de3bd6122f3251c149edc773d032f136bfc8f2a46b0cb4b36cc66b490bb53&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Wed%2C%2009%20Sep%202026%2012%3A52%3A04%20GMT (43.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAC-SHA256.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Gradient Holographic Portrait Orientation Frame",
    'Gradients',
    '/elements/magic_recommendations/MAC-SHA256.png',
    ["canva", "frame", "gradient", "graphic", "holographic", "magic", "orientation", "portrait", "recommendation"],
    25, 25
  ),
  /**
   * #117. Gradient Overlay Cutout
   * Canva ID: MAFczfoa3TA | Format: MAFczfoa3TA.svg (1.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFczfoa3TA.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Gradient Overlay Cutout",
    'Gradients',
    '/elements/magic_recommendations/MAFczfoa3TA.svg',
    ["canva", "cutout", "gradient", "graphic", "magic", "overlay", "recommendation"],
    40, 40
  ),
  /**
   * #118. Gradient that fades to transparency
   * Canva ID: MADWDzB46Dw | Format: MADWDzB46Dw.svg (0.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADWDzB46Dw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Gradient that fades to transparency",
    'Gradients',
    '/elements/magic_recommendations/MADWDzB46Dw.svg',
    ["canva", "fades", "gradient", "graphic", "magic", "recommendation", "that", "to", "transparency"],
    25, 25
  ),
  /**
   * #119. Green Palm Leaf
   * Canva ID: MADrhnJK5dk | Format: s3-1.svg (571.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADrhnJK5dk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Green Palm Leaf",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADrhnJK5dk.svg',
    ["canva", "graphic", "green", "leaf", "magic", "palm", "recommendation"],
    25, 25
  ),
  /**
   * #120. Green Patterned Leaf with Pink Stems
   * Canva ID: MADo-yrP9Ko | Format: thumbnail.png (4.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADo-yrP9Ko.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Green Patterned Leaf with Pink Stems",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADo-yrP9Ko.png',
    ["canva", "graphic", "green", "leaf", "magic", "patterned", "pink", "recommendation", "stems", "with"],
    25, 25
  ),
  /**
   * #121. Grey Shape Illustration
   * Canva ID: MADvz7hD3m4 | Format: MADvz7hD3m4.svg (0.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADvz7hD3m4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Grey Shape Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADvz7hD3m4.svg',
    ["canva", "graphic", "grey", "illustration", "magic", "recommendation", "shape"],
    25, 25
  ),
  /**
   * #122. Growth icon. Profit growing icon. Growing graph symbol.
   * Canva ID: MAFEJS7X1IM | Format: MAFEJS7X1IM.svg (0.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFEJS7X1IM.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Growth icon. Profit growing icon. Growing graph symbol.",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFEJS7X1IM.svg',
    ["canva", "graph", "graphic", "growing", "growth", "icon", "magic", "profit", "recommendation", "symbol"],
    20, 20
  ),
  /**
   * #123. Hamburger Menu Icon
   * Canva ID: MAFcf2_fm_4 | Format: MAFcf2_fm_4.png (0.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFcf2_fm_4.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Hamburger Menu Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFcf2_fm_4.png',
    ["canva", "graphic", "hamburger", "icon", "magic", "menu", "recommendation"],
    20, 20
  ),
  /**
   * #124. Hand Drawn Clock Icon
   * Canva ID: MAGzHgpw3YA | Format: MAGzHgpw3YA.svg (4.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzHgpw3YA.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Hand Drawn Clock Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzHgpw3YA.svg',
    ["canva", "clock", "drawn", "graphic", "hand", "icon", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #125. Hand Drawn Download Icon
   * Canva ID: MAGzHhpqZhI | Format: MAGzHhpqZhI.svg (4.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzHhpqZhI.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Hand Drawn Download Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzHhpqZhI.svg',
    ["canva", "download", "drawn", "graphic", "hand", "icon", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #126. Hand Drawn Globe Icon
   * Canva ID: MAGzHjCzetU | Format: MAGzHjCzetU.svg (4.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzHjCzetU.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Hand Drawn Globe Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzHjCzetU.svg',
    ["canva", "drawn", "globe", "graphic", "hand", "icon", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #127. Hand Drawn Megaphone Icon
   * Canva ID: MAGzHj4P_ww | Format: MAGzHj4P_ww.svg (5.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzHj4P_ww.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Hand Drawn Megaphone Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzHj4P_ww.svg',
    ["canva", "drawn", "graphic", "hand", "icon", "magic", "megaphone", "recommendation"],
    20, 20
  ),
  /**
   * #128. Hand Drawn Shield Icon
   * Canva ID: MAGzHj9coJE | Format: MAGzHj9coJE.svg (5.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzHj9coJE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Hand Drawn Shield Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzHj9coJE.svg',
    ["canva", "drawn", "graphic", "hand", "icon", "magic", "recommendation", "shield"],
    20, 20
  ),
  /**
   * #129. Hand Drawn Team Icon
   * Canva ID: MAGzHi3_SgQ | Format: MAGzHi3_SgQ.svg (15.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzHi3_SgQ.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Hand Drawn Team Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzHi3_SgQ.svg',
    ["canva", "drawn", "graphic", "hand", "icon", "magic", "recommendation", "team"],
    20, 20
  ),
  /**
   * #130. Hand Holding a Magic Ball
   * Canva ID: MADmdzHIkU4 | Format: MADmdzHIkU4.svg (15.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmdzHIkU4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Hand Holding a Magic Ball",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmdzHIkU4.svg',
    ["ball", "canva", "graphic", "hand", "holding", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #131. Hollow icon in rectangle
   * Canva ID: MAFf2Na0W9c | Format: MAFf2Na0W9c.png (2.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFf2Na0W9c.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Hollow icon in rectangle",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFf2Na0W9c.png',
    ["canva", "graphic", "hollow", "icon", "in", "magic", "recommendation", "rectangle"],
    20, 20
  ),
  /**
   * #132. Hormonal Lud Illustration
   * Canva ID: MAETq59CY9k | Format: s3-1.svg (238.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAETq59CY9k.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Hormonal Lud Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAETq59CY9k.svg',
    ["canva", "graphic", "hormonal", "illustration", "lud", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #133. icon
   * Canva ID: MAE9cevT9Cg | Format: MAE9cevT9Cg.png (1.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAE9cevT9Cg.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAE9cevT9Cg.png',
    ["canva", "graphic", "icon", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #134. icon
   * Canva ID: MAE9cTz3pUo | Format: MAE9cTz3pUo.png (1.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAE9cTz3pUo.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAE9cTz3pUo.png',
    ["canva", "graphic", "icon", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #135. Illustration of a two-way road sign
   * Canva ID: MAGaYagaA6A | Format: MAGaYagaA6A.png (10.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGaYagaA6A.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Illustration of a two-way road sign",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGaYagaA6A.png',
    ["canva", "graphic", "illustration", "magic", "of", "recommendation", "road", "sign", "two", "way"],
    25, 25
  ),
  /**
   * #136. Inky Map Marker
   * Canva ID: MAFue4Iu0Xc | Format: MAFue4Iu0Xc.svg (20.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFue4Iu0Xc.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Inky Map Marker",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFue4Iu0Xc.svg',
    ["canva", "graphic", "inky", "magic", "map", "marker", "recommendation"],
    25, 25
  ),
  /**
   * #137. Instagram Icon
   * Canva ID: MAGzNm0Q87E | Format: s3-1.svg (849.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzNm0Q87E.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Instagram Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzNm0Q87E.svg',
    ["canva", "graphic", "icon", "instagram", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #138. Krishna Janmashtami. Illustration of a Flute with Peacock Feathers
   * Canva ID: MAHTxdf77f4 | Format: MAHTxdf77f4.svg (38.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAHTxdf77f4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Krishna Janmashtami. Illustration of a Flute with Peacock Feathers",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAHTxdf77f4.svg',
    ["canva", "feathers", "flute", "graphic", "illustration", "janmashtami", "krishna", "magic", "of", "peacock", "recommendation", "with"],
    25, 25
  ),
  /**
   * #139. Letters Witty Valentines Quotes
   * Canva ID: MADw-KSJmU4 | Format: MADw-KSJmU4.svg (15.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADw-KSJmU4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Letters Witty Valentines Quotes",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADw-KSJmU4.svg',
    ["canva", "graphic", "letters", "magic", "quotes", "recommendation", "valentines", "witty"],
    25, 25
  ),
  /**
   * #140. Line Female Half Body
   * Canva ID: MADnJgNZQ4g | Format: thumbnail.png (4.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnJgNZQ4g.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Line Female Half Body",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnJgNZQ4g.png',
    ["body", "canva", "female", "graphic", "half", "line", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #141. Line Female Half Body
   * Canva ID: MADnJrUhjmg | Format: thumbnail.png (3.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnJrUhjmg.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Line Female Half Body",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnJrUhjmg.png',
    ["body", "canva", "female", "graphic", "half", "line", "magic", "recommendation"],
    25, 25
  ),
  /**
   * #142. Line Male Half Body
   * Canva ID: MADnJoUHByM | Format: thumbnail.png (4.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnJoUHByM.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Line Male Half Body",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnJoUHByM.png',
    ["body", "canva", "graphic", "half", "line", "magic", "male", "recommendation"],
    25, 25
  ),
  /**
   * #143. Line Male Half Body
   * Canva ID: MADnJjGHiao | Format: thumbnail.png (4.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnJjGHiao.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Line Male Half Body",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnJjGHiao.png',
    ["body", "canva", "graphic", "half", "line", "magic", "male", "recommendation"],
    25, 25
  ),
  /**
   * #144. Line Male Half Body
   * Canva ID: MADnJizr4-U | Format: thumbnail.png (3.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnJizr4-U.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Line Male Half Body",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnJizr4-U.png',
    ["body", "canva", "graphic", "half", "line", "magic", "male", "recommendation"],
    25, 25
  ),
  /**
   * #145. Line Male Half Body
   * Canva ID: MADnJq-Z0Hg | Format: thumbnail.png (3.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnJq-Z0Hg.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Line Male Half Body",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnJq-Z0Hg.png',
    ["body", "canva", "graphic", "half", "line", "magic", "male", "recommendation"],
    25, 25
  ),
  /**
   * #146. Lined Wireframe 360 Icon
   * Canva ID: MAEeCjPSOoc | Format: MAEeCjPSOoc.svg (2.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEeCjPSOoc.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lined Wireframe 360 Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEeCjPSOoc.svg',
    ["360", "canva", "graphic", "icon", "lined", "magic", "recommendation", "wireframe"],
    20, 20
  ),
  /**
   * #147. Lined Wireframe Add Icon
   * Canva ID: MAEeCm_NigY | Format: MAEeCm_NigY.svg (0.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEeCm_NigY.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lined Wireframe Add Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEeCm_NigY.svg',
    ["add", "canva", "graphic", "icon", "lined", "magic", "recommendation", "wireframe"],
    20, 20
  ),
  /**
   * #148. Lined Wireframe Checked Circle Icon
   * Canva ID: MAEeCr07kaE | Format: MAEeCr07kaE.svg (0.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEeCr07kaE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lined Wireframe Checked Circle Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEeCr07kaE.svg',
    ["canva", "checked", "circle", "graphic", "icon", "lined", "magic", "recommendation", "wireframe"],
    20, 20
  ),
  /**
   * #149. Lined Wireframe Dropdown Icon
   * Canva ID: MAEeCjGksIE | Format: MAEeCjGksIE.svg (0.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEeCjGksIE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lined Wireframe Dropdown Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEeCjGksIE.svg',
    ["canva", "dropdown", "graphic", "icon", "lined", "magic", "recommendation", "wireframe"],
    20, 20
  ),
  /**
   * #150. Lined Wireframe Expand Less Icon
   * Canva ID: MAEeCmCDBgw | Format: MAEeCmCDBgw.svg (0.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEeCmCDBgw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lined Wireframe Expand Less Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEeCmCDBgw.svg',
    ["canva", "expand", "graphic", "icon", "less", "lined", "magic", "recommendation", "wireframe"],
    20, 20
  ),
  /**
   * #151. Lined Wireframe Expand More Icon
   * Canva ID: MAEeCgdHFUE | Format: MAEeCgdHFUE.svg (0.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEeCgdHFUE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lined Wireframe Expand More Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEeCgdHFUE.svg',
    ["canva", "expand", "graphic", "icon", "lined", "magic", "more", "recommendation", "wireframe"],
    20, 20
  ),
  /**
   * #152. Lined Wireframe Left Chevron Icon
   * Canva ID: MAEeCq4dIx0 | Format: MAEeCq4dIx0.svg (0.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEeCq4dIx0.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lined Wireframe Left Chevron Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEeCq4dIx0.svg',
    ["canva", "chevron", "graphic", "icon", "left", "lined", "magic", "recommendation", "wireframe"],
    20, 20
  ),
  /**
   * #153. Lined Wireframe Link Icon
   * Canva ID: MAEeCk1PpmA | Format: MAEeCk1PpmA.svg (0.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEeCk1PpmA.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lined Wireframe Link Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEeCk1PpmA.svg',
    ["canva", "graphic", "icon", "lined", "link", "magic", "recommendation", "wireframe"],
    20, 20
  ),
  /**
   * #154. Lined Wireframe Location
   * Canva ID: MAEeCjGpzf4 | Format: MAEeCjGpzf4.svg (0.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEeCjGpzf4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lined Wireframe Location",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEeCjGpzf4.svg',
    ["canva", "graphic", "lined", "location", "magic", "recommendation", "wireframe"],
    25, 25
  ),
  /**
   * #155. Lined Wireframe Photo Icon
   * Canva ID: MAEeCiZRAeI | Format: MAEeCiZRAeI.svg (1.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEeCiZRAeI.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lined Wireframe Photo Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEeCiZRAeI.svg',
    ["canva", "graphic", "icon", "lined", "magic", "photo", "recommendation", "wireframe"],
    20, 20
  ),
  /**
   * #156. Lined Wireframe Right Chevron Icon
   * Canva ID: MAEeCrv6X0g | Format: MAEeCrv6X0g.svg (0.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEeCrv6X0g.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lined Wireframe Right Chevron Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEeCrv6X0g.svg',
    ["canva", "chevron", "graphic", "icon", "lined", "magic", "recommendation", "right", "wireframe"],
    20, 20
  ),
  /**
   * #157. Linkedin Icon
   * Canva ID: MAGzNjrUoLY | Format: s3-1.svg (1.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzNjrUoLY.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Linkedin Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzNjrUoLY.svg',
    ["canva", "graphic", "icon", "linkedin", "magic", "recommendation"],
    20, 20
  ),
  /**
   * #158. Loading Vector Icon Design Illustration
   * Canva ID: MAEw5Mrhr9Q | Format: MAEw5Mrhr9Q.svg (3.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEw5Mrhr9Q.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Loading Vector Icon Design Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEw5Mrhr9Q.svg',
    ["canva", "design", "graphic", "icon", "illustration", "loading", "magic", "recommendation", "vector"],
    20, 20
  ),
  /**
   * #159. Loaf Witty Valentines Quotes
   * Canva ID: MADw-MdqwJ8 | Format: MADw-MdqwJ8.svg (30.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADw-MdqwJ8.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Loaf Witty Valentines Quotes",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADw-MdqwJ8.svg',
    ["canva", "graphic", "loaf", "magic", "quotes", "recommendation", "valentines", "witty"],
    25, 25
  ),
  /**
   * #160. Loose Lined Quirky Kitchen Mittens
   * Canva ID: MAFbvsadMfU | Format: MAFbvsadMfU.svg (11.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFbvsadMfU.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Loose Lined Quirky Kitchen Mittens",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFbvsadMfU.svg',
    ["canva", "graphic", "kitchen", "lined", "loose", "magic", "mittens", "quirky", "recommendation"],
    25, 25
  ),
  /**
   * #161. Loose Playful Handdrawn Cake Roll
   * Canva ID: MAFcYv7S9dE | Format: MAFcYv7S9dE.svg (19.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFcYv7S9dE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Loose Playful Handdrawn Cake Roll",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFcYv7S9dE.svg',
    ["cake", "canva", "graphic", "handdrawn", "loose", "magic", "playful", "recommendation", "roll"],
    25, 25
  ),
  /**
   * #162. Loose Playful Handdrawn Donut
   * Canva ID: MAFcYtI_5L8 | Format: MAFcYtI_5L8.svg (8.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFcYtI_5L8.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Loose Playful Handdrawn Donut",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFcYtI_5L8.svg',
    ["canva", "donut", "graphic", "handdrawn", "loose", "magic", "playful", "recommendation"],
    25, 25
  ),
  /**
   * #163. Loose Playful Handdrawn Ice Cream Cone
   * Canva ID: MAFcYqm-iSM | Format: MAFcYqm-iSM.svg (14.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFcYqm-iSM.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Loose Playful Handdrawn Ice Cream Cone",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFcYqm-iSM.svg',
    ["canva", "cone", "cream", "graphic", "handdrawn", "ice", "loose", "magic", "playful", "recommendation"],
    25, 25
  ),
  /**
   * #164. Loose Playful Handdrawn Pancakes
   * Canva ID: MAFcYvzCPos | Format: MAFcYvzCPos.svg (12.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFcYvzCPos.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Loose Playful Handdrawn Pancakes",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFcYvzCPos.svg',
    ["canva", "graphic", "handdrawn", "loose", "magic", "pancakes", "playful", "recommendation"],
    25, 25
  ),
  /**
   * #165. Lucky Number Two
   * Canva ID: MACZMrIj9R0 | Format: MACZMrIj9R0.svg (1.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MACZMrIj9R0.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Lucky Number Two",
    'Magic Recommendations',
    '/elements/magic_recommendations/MACZMrIj9R0.svg',
    ["canva", "graphic", "lucky", "magic", "number", "recommendation", "two"],
    25, 25
  ),
  /**
   * #166. Magnifier Outline Icon
   * Canva ID: MAEgJresBTg | Format: MAEgJresBTg.svg (0.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEgJresBTg.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Magnifier Outline Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEgJresBTg.svg',
    ["canva", "graphic", "icon", "magic", "magnifier", "outline", "recommendation"],
    20, 20
  ),
  /**
   * #167. Magnifying Glass Icon
   * Canva ID: MAEVaN3mI0Q | Format: MAEVaN3mI0Q.svg (1.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEVaN3mI0Q.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Magnifying Glass Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEVaN3mI0Q.svg',
    ["canva", "glass", "graphic", "icon", "magic", "magnifying", "recommendation"],
    20, 20
  ),
  /**
   * #168. Magnifying Glass Icon
   * Canva ID: MAETCKpz2bs | Format: MAETCKpz2bs.svg (0.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAETCKpz2bs.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Magnifying Glass Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAETCKpz2bs.svg',
    ["canva", "glass", "graphic", "icon", "magic", "magnifying", "recommendation"],
    20, 20
  ),
  /**
   * #169. Medium Logo
   * Canva ID: MAGzZ-kwssw | Format: MAGzZ-kwssw.svg (5.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzZ-kwssw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Medium Logo",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzZ-kwssw.svg',
    ["canva", "graphic", "logo", "magic", "medium", "recommendation"],
    25, 25
  ),
  /**
   * #170. Melon Witty Valentines Quotes
   * Canva ID: MADw-BEtgz8 | Format: MADw-BEtgz8.svg (160.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADw-BEtgz8.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Melon Witty Valentines Quotes",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADw-BEtgz8.svg',
    ["canva", "graphic", "magic", "melon", "quotes", "recommendation", "valentines", "witty"],
    25, 25
  ),
  /**
   * #171. Metallic gold Y balloon
   * Canva ID: MAEBcrueJAc | Format: MAEBcrueJAc.png (78.3 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEBcrueJAc.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Metallic gold Y balloon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEBcrueJAc.png',
    ["balloon", "canva", "gold", "magic", "metallic", "photo", "recommendation"],
    25, 25
  ),
  /**
   * #172. Metallic silver I balloon
   * Canva ID: MAEBcmsObAw | Format: MAEBcmsObAw.png (33.3 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEBcmsObAw.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Metallic silver I balloon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEBcmsObAw.png',
    ["balloon", "canva", "magic", "metallic", "photo", "recommendation", "silver"],
    25, 25
  ),
  /**
   * #173. Metallic Silver Six Balloon
   * Canva ID: MAEBcjdgHQ4 | Format: MAEBcjdgHQ4.png (94.1 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEBcjdgHQ4.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Metallic Silver Six Balloon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEBcjdgHQ4.png',
    ["balloon", "canva", "magic", "metallic", "photo", "recommendation", "silver", "six"],
    25, 25
  ),
  /**
   * #174. Metallic Silver Three Balloon
   * Canva ID: MAEBchaiKHU | Format: MAEBchaiKHU.png (119.5 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEBchaiKHU.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Metallic Silver Three Balloon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEBchaiKHU.png',
    ["balloon", "canva", "magic", "metallic", "photo", "recommendation", "silver", "three"],
    25, 25
  ),
  /**
   * #175. Metallic Silver Y Balloon
   * Canva ID: MAEBcoppbpU | Format: MAEBcoppbpU.png (89.8 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEBcoppbpU.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Metallic Silver Y Balloon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEBcoppbpU.png',
    ["balloon", "canva", "magic", "metallic", "photo", "recommendation", "silver"],
    25, 25
  ),
  /**
   * #176. Metallic Silver Zero Balloon
   * Canva ID: MAEBcjkSOOg | Format: MAEBcjkSOOg.png (95.5 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEBcjkSOOg.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Metallic Silver Zero Balloon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEBcjkSOOg.png',
    ["balloon", "canva", "magic", "metallic", "photo", "recommendation", "silver", "zero"],
    25, 25
  ),
  /**
   * #177. Minimal Modern Contour Buildable Quarter Circle
   * Canva ID: MAFZYijaAaI | Format: s3-1.svg (0.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFZYijaAaI.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Minimal Modern Contour Buildable Quarter Circle",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFZYijaAaI.svg',
    ["buildable", "canva", "circle", "contour", "graphic", "magic", "minimal", "modern", "quarter", "recommendation"],
    25, 25
  ),
  /**
   * #178. Minimalist Geometric Arrow Line Aesthetic Symbol
   * Canva ID: MAGLkrz9OBI | Format: MAGLkrz9OBI.png (0.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGLkrz9OBI.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Minimalist Geometric Arrow Line Aesthetic Symbol",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGLkrz9OBI.png',
    ["aesthetic", "arrow", "canva", "geometric", "graphic", "line", "magic", "minimalist", "recommendation", "symbol"],
    20, 20
  ),
  /**
   * #179. Minimalist Geometric Arrow Right Down Line Aesthetic Symbol
   * Canva ID: MAGLksinZEw | Format: MAGLksinZEw.png (0.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGLksinZEw.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Minimalist Geometric Arrow Right Down Line Aesthetic Symbol",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGLksinZEw.png',
    ["aesthetic", "arrow", "canva", "down", "geometric", "graphic", "line", "magic", "minimalist", "recommendation", "right", "symbol"],
    20, 20
  ),
  /**
   * #180. Minimalist Geometric Arrow Right Up Line Aesthetic Symbol
   * Canva ID: MAGLkjdOqbg | Format: MAGLkjdOqbg.png (0.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGLkjdOqbg.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Minimalist Geometric Arrow Right Up Line Aesthetic Symbol",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGLkjdOqbg.png',
    ["aesthetic", "arrow", "canva", "geometric", "graphic", "line", "magic", "minimalist", "recommendation", "right", "symbol", "up"],
    20, 20
  ),
  /**
   * #181. Money Bag Illustration
   * Canva ID: MAFEPZGGSsA | Format: s3-1.svg (2.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFEPZGGSsA.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Money Bag Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFEPZGGSsA.svg',
    ["bag", "canva", "graphic", "illustration", "magic", "money", "recommendation"],
    25, 25
  ),
  /**
   * #182. monogram letter L logo
   * Canva ID: MAFpIpv0bYI | Format: MAFpIpv0bYI.png (1.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFpIpv0bYI.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "monogram letter L logo",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFpIpv0bYI.png',
    ["canva", "graphic", "letter", "logo", "magic", "monogram", "recommendation"],
    25, 25
  ),
  /**
   * #183. Monoline Cogwheel Icon
   * Canva ID: MAFCVzDXpf4 | Format: s3-1.svg (3.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFCVzDXpf4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Monoline Cogwheel Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFCVzDXpf4.svg',
    ["canva", "cogwheel", "graphic", "icon", "magic", "monoline", "recommendation"],
    20, 20
  ),
  /**
   * #184. Moody Painterly Plant
   * Canva ID: MAFdtoqVU7s | Format: MAFdtoqVU7s.png (501.3 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAFdtoqVU7s.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Moody Painterly Plant",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFdtoqVU7s.png',
    ["canva", "magic", "moody", "painterly", "photo", "plant", "recommendation"],
    25, 25
  ),
  /**
   * #185. Mouse Cursor Icon
   * Canva ID: MAEe18Da6Us | Format: MAEe18Da6Us.svg (0.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEe18Da6Us.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Mouse Cursor Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEe18Da6Us.svg',
    ["canva", "cursor", "graphic", "icon", "magic", "mouse", "recommendation"],
    20, 20
  ),
  /**
   * #186. Next Arrow Icon
   * Canva ID: MAFcfoi-zk0 | Format: MAFcfoi-zk0.svg (0.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFcfoi-zk0.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Next Arrow Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFcfoi-zk0.svg',
    ["arrow", "canva", "graphic", "icon", "magic", "next", "recommendation"],
    20, 20
  ),
  /**
   * #187. Notification Bell Icon
   * Canva ID: MAEtnlDJdNA | Format: MAEtnlDJdNA.svg (1.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEtnlDJdNA.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Notification Bell Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEtnlDJdNA.svg',
    ["bell", "canva", "graphic", "icon", "magic", "notification", "recommendation"],
    20, 20
  ),
  /**
   * #188. omhp0hgbfv.gif
   * Canva ID: omhp0hgbfv.gif | Format: omhp0hgbfv.gif (106.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/omhp0hgbfv.gif.gif
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "omhp0hgbfv.gif",
    'Magic Recommendations',
    '/elements/magic_recommendations/omhp0hgbfv.gif.gif',
    ["canva", "graphic", "magic", "omhp0hgbfvgif", "recommendation"],
    25, 25
  ),
  /**
   * #189. Orange
   * Canva ID: MADtw4PZALA | Format: s.svg (2.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADtw4PZALA.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Orange",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADtw4PZALA.svg',
    ["canva", "graphic", "magic", "orange", "recommendation"],
    25, 25
  ),
  /**
   * #190. Orange Bowl Illustration
   * Canva ID: MADvz5-KjUk | Format: MADvz5-KjUk.svg (1.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADvz5-KjUk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Orange Bowl Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADvz5-KjUk.svg',
    ["bowl", "canva", "graphic", "illustration", "magic", "orange", "recommendation"],
    25, 25
  ),
  /**
   * #191. Orange Vase Line
   * Canva ID: MADvzxzksKo | Format: MADvzxzksKo.svg (1.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADvzxzksKo.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Orange Vase Line",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADvzxzksKo.svg',
    ["canva", "graphic", "line", "magic", "orange", "recommendation", "vase"],
    25, 25
  ),
  /**
   * #192. Organic Floral Element
   * Canva ID: MADhBOGhYsc | Format: MADhBOGhYsc.svg (25.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBOGhYsc.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Floral Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBOGhYsc.svg',
    ["canva", "element", "floral", "graphic", "magic", "organic", "recommendation"],
    25, 25
  ),
  /**
   * #193. Organic Floral Element
   * Canva ID: MADhBCxWbjw | Format: MADhBCxWbjw.svg (12.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBCxWbjw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Floral Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBCxWbjw.svg',
    ["canva", "element", "floral", "graphic", "magic", "organic", "recommendation"],
    25, 25
  ),
  /**
   * #194. Organic Floral Element
   * Canva ID: MADhBNbMKps | Format: MADhBNbMKps.svg (28.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBNbMKps.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Floral Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBNbMKps.svg',
    ["canva", "element", "floral", "graphic", "magic", "organic", "recommendation"],
    25, 25
  ),
  /**
   * #195. Organic Floral Element
   * Canva ID: MADhBKDwZ2w | Format: MADhBKDwZ2w.svg (42.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBKDwZ2w.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Floral Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBKDwZ2w.svg',
    ["canva", "element", "floral", "graphic", "magic", "organic", "recommendation"],
    25, 25
  ),
  /**
   * #196. Organic Floral Element
   * Canva ID: MADhBMOgdPs | Format: MADhBMOgdPs.svg (20.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBMOgdPs.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Floral Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBMOgdPs.svg',
    ["canva", "element", "floral", "graphic", "magic", "organic", "recommendation"],
    25, 25
  ),
  /**
   * #197. Organic Floral Element
   * Canva ID: MADhBENGzMw | Format: MADhBENGzMw.svg (16.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADhBENGzMw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Floral Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADhBENGzMw.svg',
    ["canva", "element", "floral", "graphic", "magic", "organic", "recommendation"],
    25, 25
  ),
  /**
   * #198. Organic Handdrawn Wind
   * Canva ID: MAFrqyWhQLQ | Format: s3-1.svg (2.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFrqyWhQLQ.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Handdrawn Wind",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFrqyWhQLQ.svg',
    ["canva", "graphic", "handdrawn", "magic", "organic", "recommendation", "wind"],
    25, 25
  ),
  /**
   * #199. Organic Rainbow
   * Canva ID: MADxcA3ACHg | Format: MADxcA3ACHg.svg (6.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcA3ACHg.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Rainbow",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcA3ACHg.svg',
    ["canva", "graphic", "magic", "organic", "rainbow", "recommendation"],
    25, 25
  ),
  /**
   * #200. Organic Rainbow
   * Canva ID: MADxcO4mAGg | Format: MADxcO4mAGg.svg (17.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcO4mAGg.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Rainbow",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcO4mAGg.svg',
    ["canva", "graphic", "magic", "organic", "rainbow", "recommendation"],
    25, 25
  ),
  /**
   * #201. Organic Rainbow
   * Canva ID: MADxcOpKSdQ | Format: MADxcOpKSdQ.svg (19.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcOpKSdQ.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Rainbow",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcOpKSdQ.svg',
    ["canva", "graphic", "magic", "organic", "rainbow", "recommendation"],
    25, 25
  ),
  /**
   * #202. Organic Rainbow with Dots
   * Canva ID: MADxcMzL-1Q | Format: s3-1.svg (16.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcMzL-1Q.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Rainbow with Dots",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcMzL-1Q.svg',
    ["canva", "dots", "graphic", "magic", "organic", "rainbow", "recommendation", "with"],
    25, 25
  ),
  /**
   * #203. Organic Rainbow with Pattern
   * Canva ID: MADxcE0Jq0M | Format: s3-1.svg (11.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcE0Jq0M.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Rainbow with Pattern",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcE0Jq0M.svg',
    ["canva", "graphic", "magic", "organic", "pattern", "rainbow", "recommendation", "with"],
    25, 25
  ),
  /**
   * #204. Organic Rainbow with Text
   * Canva ID: MADxcBCDbbE | Format: s3-1.svg (23.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcBCDbbE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Organic Rainbow with Text",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcBCDbbE.svg',
    ["canva", "graphic", "magic", "organic", "rainbow", "recommendation", "text", "with"],
    25, 25
  ),
  /**
   * #205. Pastel Orange Palm Leaf
   * Canva ID: MADrhugFGRI | Format: thumbnail.png (6.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADrhugFGRI.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pastel Orange Palm Leaf",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADrhugFGRI.png',
    ["canva", "graphic", "leaf", "magic", "orange", "palm", "pastel", "recommendation"],
    25, 25
  ),
  /**
   * #206. Pastel Pink Palm Leaf
   * Canva ID: MADrhtXB1Ys | Format: thumbnail.png (3.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADrhtXB1Ys.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pastel Pink Palm Leaf",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADrhtXB1Ys.png',
    ["canva", "graphic", "leaf", "magic", "palm", "pastel", "pink", "recommendation"],
    25, 25
  ),
  /**
   * #207. Pastel Purple Palm Leaf
   * Canva ID: MADrhkjehqA | Format: thumbnail.png (5.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADrhkjehqA.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pastel Purple Palm Leaf",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADrhkjehqA.png',
    ["canva", "graphic", "leaf", "magic", "palm", "pastel", "purple", "recommendation"],
    25, 25
  ),
  /**
   * #208. Pastel Yelow Palm Leaf
   * Canva ID: MADrhqqW_vE | Format: thumbnail.png (2.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADrhqqW_vE.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pastel Yelow Palm Leaf",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADrhqqW_vE.png',
    ["canva", "graphic", "leaf", "magic", "palm", "pastel", "recommendation", "yelow"],
    25, 25
  ),
  /**
   * #209. Pencil Graphic of a Fire with Woods
   * Canva ID: MADxcA5HLyE | Format: MADxcA5HLyE.svg (736.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcA5HLyE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pencil Graphic of a Fire with Woods",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcA5HLyE.svg',
    ["canva", "fire", "graphic", "magic", "of", "pencil", "recommendation", "with", "woods"],
    25, 25
  ),
  /**
   * #210. Pencil Graphic of a Leaf
   * Canva ID: MADxcKpHmU8 | Format: MADxcKpHmU8.svg (2157.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcKpHmU8.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pencil Graphic of a Leaf",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcKpHmU8.svg',
    ["canva", "graphic", "leaf", "magic", "of", "pencil", "recommendation"],
    25, 25
  ),
  /**
   * #211. Pencil Graphic of a Location Map
   * Canva ID: MADxcJtGGco | Format: MADxcJtGGco.svg (1955.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcJtGGco.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pencil Graphic of a Location Map",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcJtGGco.svg',
    ["canva", "graphic", "location", "magic", "map", "of", "pencil", "recommendation"],
    25, 25
  ),
  /**
   * #212. Pencil Graphic of a Wooden Direction Signages
   * Canva ID: MADxcKL62F4 | Format: MADxcKL62F4.svg (1972.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcKL62F4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pencil Graphic of a Wooden Direction Signages",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcKL62F4.svg',
    ["canva", "direction", "graphic", "magic", "of", "pencil", "recommendation", "signages", "wooden"],
    25, 25
  ),
  /**
   * #213. Pencil Graphic of Half Moon and Stars
   * Canva ID: MADxcMX5FK8 | Format: MADxcMX5FK8.svg (2147.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcMX5FK8.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pencil Graphic of Half Moon and Stars",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcMX5FK8.svg',
    ["and", "canva", "graphic", "half", "magic", "moon", "of", "pencil", "recommendation", "stars"],
    25, 25
  ),
  /**
   * #214. Pencil Graphic of Orange Mountains
   * Canva ID: MADxcHv1e9E | Format: MADxcHv1e9E.svg (4232.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADxcHv1e9E.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pencil Graphic of Orange Mountains",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADxcHv1e9E.svg',
    ["canva", "graphic", "magic", "mountains", "of", "orange", "pencil", "recommendation"],
    25, 25
  ),
  /**
   * #215. Pencil Line Icon
   * Canva ID: MAEVaLY6vdQ | Format: MAEVaLY6vdQ.svg (1.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEVaLY6vdQ.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pencil Line Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEVaLY6vdQ.svg',
    ["canva", "graphic", "icon", "line", "magic", "pencil", "recommendation"],
    20, 20
  ),
  /**
   * #216. phone
   * Canva ID: MAEyDTMIW8s | Format: MAEyDTMIW8s.svg (1.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEyDTMIW8s.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "phone",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEyDTMIW8s.svg',
    ["canva", "graphic", "magic", "phone", "recommendation"],
    25, 25
  ),
  /**
   * #217. Pin Icon
   * Canva ID: MAFcecGSb8c | Format: MAFcecGSb8c.svg (1.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFcecGSb8c.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pin Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFcecGSb8c.svg',
    ["canva", "graphic", "icon", "magic", "pin", "recommendation"],
    20, 20
  ),
  /**
   * #218. Pinapple Slice
   * Canva ID: MADtw8s1lj4 | Format: s3-1.svg (5.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADtw8s1lj4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pinapple Slice",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADtw8s1lj4.svg',
    ["canva", "graphic", "magic", "pinapple", "recommendation", "slice"],
    25, 25
  ),
  /**
   * #219. Pink and Blue Patterned Leaves
   * Canva ID: MADmdw1qPy8 | Format: MADmdw1qPy8.svg (39.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmdw1qPy8.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pink and Blue Patterned Leaves",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmdw1qPy8.svg',
    ["and", "blue", "canva", "graphic", "leaves", "magic", "patterned", "pink", "recommendation"],
    25, 25
  ),
  /**
   * #220. Pink and Orange Circle Illustration
   * Canva ID: MADvz2gra3A | Format: MADvz2gra3A.svg (0.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADvz2gra3A.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pink and Orange Circle Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADvz2gra3A.svg',
    ["and", "canva", "circle", "graphic", "illustration", "magic", "orange", "pink", "recommendation"],
    25, 25
  ),
  /**
   * #221. Pink Pastel Palm Leaf
   * Canva ID: MADrhhQOCzc | Format: thumbnail.png (2.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADrhhQOCzc.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pink Pastel Palm Leaf",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADrhhQOCzc.png',
    ["canva", "graphic", "leaf", "magic", "palm", "pastel", "pink", "recommendation"],
    25, 25
  ),
  /**
   * #222. Pink, Yellow and Blue Leaves
   * Canva ID: MADo-23NjMI | Format: thumbnail.png (4.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADo-23NjMI.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Pink, Yellow and Blue Leaves",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADo-23NjMI.png',
    ["and", "blue", "canva", "graphic", "leaves", "magic", "pink", "recommendation", "yellow"],
    25, 25
  ),
  /**
   * #223. Playful Professional Number 2
   * Canva ID: MAFolUX-hWs | Format: s3-1.svg (28.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFolUX-hWs.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Playful Professional Number 2",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFolUX-hWs.svg',
    ["canva", "graphic", "magic", "number", "playful", "professional", "recommendation"],
    25, 25
  ),
  /**
   * #224. Red and Cream Pitcher Illustration
   * Canva ID: MADvz1SroRM | Format: MADvz1SroRM.svg (0.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADvz1SroRM.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Red and Cream Pitcher Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADvz1SroRM.svg',
    ["and", "canva", "cream", "graphic", "illustration", "magic", "pitcher", "recommendation", "red"],
    25, 25
  ),
  /**
   * #225. Red Leaf Illustration
   * Canva ID: MADvz6raSuw | Format: MADvz6raSuw.svg (2.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADvz6raSuw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Red Leaf Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADvz6raSuw.svg',
    ["canva", "graphic", "illustration", "leaf", "magic", "recommendation", "red"],
    25, 25
  ),
  /**
   * #226. Refresh Arrow Icon
   * Canva ID: MAEhQGfZYDk | Format: MAEhQGfZYDk.svg (1.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEhQGfZYDk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Refresh Arrow Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEhQGfZYDk.svg',
    ["arrow", "canva", "graphic", "icon", "magic", "recommendation", "refresh"],
    20, 20
  ),
  /**
   * #227. Refresh Icon
   * Canva ID: MAFcfIXIEqE | Format: MAFcfIXIEqE.svg (0.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFcfIXIEqE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Refresh Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFcfIXIEqE.svg',
    ["canva", "graphic", "icon", "magic", "recommendation", "refresh"],
    20, 20
  ),
  /**
   * #228. Resize, Expand, Contract icon design
   * Canva ID: MAGYgg8QbG4 | Format: MAGYgg8QbG4.png (1.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGYgg8QbG4.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Resize, Expand, Contract icon design",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGYgg8QbG4.png',
    ["canva", "contract", "design", "expand", "graphic", "icon", "magic", "recommendation", "resize"],
    20, 20
  ),
  /**
   * #229. Reverse Arrows Icon
   * Canva ID: MAEhQDy7oMk | Format: MAEhQDy7oMk.svg (0.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEhQDy7oMk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Reverse Arrows Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEhQDy7oMk.svg',
    ["arrows", "canva", "graphic", "icon", "magic", "recommendation", "reverse"],
    20, 20
  ),
  /**
   * #230. Rough Brushstroke Physics Equation
   * Canva ID: MAGSeIsdwzk | Format: s3-1.svg (191.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGSeIsdwzk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Rough Brushstroke Physics Equation",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGSeIsdwzk.svg',
    ["brushstroke", "canva", "equation", "graphic", "magic", "physics", "recommendation", "rough"],
    25, 25
  ),
  /**
   * #231. Rough Brushstroke Wave Pattern
   * Canva ID: MAGSeO8k9tU | Format: s3-1.svg (102.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGSeO8k9tU.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Rough Brushstroke Wave Pattern",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGSeO8k9tU.svg',
    ["brushstroke", "canva", "graphic", "magic", "pattern", "recommendation", "rough", "wave"],
    25, 25
  ),
  /**
   * #232. Rustic Meat Illustration
   * Canva ID: MADnuFBFSTU | Format: thumbnail.png (6.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuFBFSTU.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Rustic Meat Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuFBFSTU.png',
    ["canva", "graphic", "illustration", "magic", "meat", "recommendation", "rustic"],
    25, 25
  ),
  /**
   * #233. Rustic Meat Illustration
   * Canva ID: MADnuA4NCTc | Format: thumbnail.png (4.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuA4NCTc.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Rustic Meat Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuA4NCTc.png',
    ["canva", "graphic", "illustration", "magic", "meat", "recommendation", "rustic"],
    25, 25
  ),
  /**
   * #234. Rustic Meat Illustration
   * Canva ID: MADnuNLVN0g | Format: thumbnail.png (5.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuNLVN0g.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Rustic Meat Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuNLVN0g.png',
    ["canva", "graphic", "illustration", "magic", "meat", "recommendation", "rustic"],
    25, 25
  ),
  /**
   * #235. Rustic Meat Illustration
   * Canva ID: MADnuIbtvcg | Format: thumbnail.png (5.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuIbtvcg.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Rustic Meat Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuIbtvcg.png',
    ["canva", "graphic", "illustration", "magic", "meat", "recommendation", "rustic"],
    25, 25
  ),
  /**
   * #236. Rustic Meat Illustration
   * Canva ID: MADnuAQWB6Y | Format: thumbnail.png (9.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuAQWB6Y.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Rustic Meat Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuAQWB6Y.png',
    ["canva", "graphic", "illustration", "magic", "meat", "recommendation", "rustic"],
    25, 25
  ),
  /**
   * #237. Rustic Meat Illustration
   * Canva ID: MADnuG45Zxg | Format: thumbnail.png (8.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuG45Zxg.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Rustic Meat Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuG45Zxg.png',
    ["canva", "graphic", "illustration", "magic", "meat", "recommendation", "rustic"],
    25, 25
  ),
  /**
   * #238. Scribbled Flower Shapes Violet and Green Paper Cut-out
   * Canva ID: MAEnOp590wY | Format: MAEnOp590wY.png (199.6 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEnOp590wY.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Scribbled Flower Shapes Violet and Green Paper Cut-out",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEnOp590wY.png',
    ["and", "canva", "cut", "flower", "green", "magic", "out", "paper", "photo", "recommendation", "scribbled", "shapes", "violet"],
    25, 25
  ),
  /**
   * #239. Scribbled Green and White Round Paper Cut-out
   * Canva ID: MAEnOgocj6c | Format: MAEnOgocj6c.png (372.1 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEnOgocj6c.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Scribbled Green and White Round Paper Cut-out",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEnOgocj6c.png',
    ["and", "canva", "cut", "green", "magic", "out", "paper", "photo", "recommendation", "round", "scribbled", "white"],
    25, 25
  ),
  /**
   * #240. Scribbled Muted Teal and Yellow Rectangular Paper Cut-out
   * Canva ID: MAEnOpRf38o | Format: MAEnOpRf38o.png (151.0 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEnOpRf38o.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Scribbled Muted Teal and Yellow Rectangular Paper Cut-out",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEnOpRf38o.png',
    ["and", "canva", "cut", "magic", "muted", "out", "paper", "photo", "recommendation", "rectangular", "scribbled", "teal", "yellow"],
    25, 25
  ),
  /**
   * #241. Scribbled Pink and Yellow Flower Paper Cut-out
   * Canva ID: MAEnOsyiNKg | Format: MAEnOsyiNKg.png (322.2 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEnOsyiNKg.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Scribbled Pink and Yellow Flower Paper Cut-out",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEnOsyiNKg.png',
    ["and", "canva", "cut", "flower", "magic", "out", "paper", "photo", "pink", "recommendation", "scribbled", "yellow"],
    25, 25
  ),
  /**
   * #242. Scribbled Round Cream and Rose Beige Paper Cut-out
   * Canva ID: MAEnOvQhSlE | Format: MAEnOvQhSlE.png (382.3 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEnOvQhSlE.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Scribbled Round Cream and Rose Beige Paper Cut-out",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEnOvQhSlE.png',
    ["and", "beige", "canva", "cream", "cut", "magic", "out", "paper", "photo", "recommendation", "rose", "round", "scribbled"],
    25, 25
  ),
  /**
   * #243. Scroll Down Arrow Vector Icon
   * Canva ID: MAG81fUqu0U | Format: MAG81fUqu0U.png (8.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAG81fUqu0U.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Scroll Down Arrow Vector Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAG81fUqu0U.png',
    ["arrow", "canva", "down", "graphic", "icon", "magic", "recommendation", "scroll", "vector"],
    20, 20
  ),
  /**
   * #244. Scroll Up Arrow Vector Icon
   * Canva ID: MAHBERdrNNE | Format: MAHBERdrNNE.png (8.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAHBERdrNNE.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Scroll Up Arrow Vector Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAHBERdrNNE.png',
    ["arrow", "canva", "graphic", "icon", "magic", "recommendation", "scroll", "up", "vector"],
    20, 20
  ),
  /**
   * #245. Send Message Outline Icon
   * Canva ID: MAFkr1Y1ASo | Format: MAFkr1Y1ASo.svg (0.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFkr1Y1ASo.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Send Message Outline Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFkr1Y1ASo.svg',
    ["canva", "graphic", "icon", "magic", "message", "outline", "recommendation", "send"],
    20, 20
  ),
  /**
   * #246. Setting Outline Icon
   * Canva ID: MAEj5eC1Y58 | Format: MAEj5eC1Y58.svg (4.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEj5eC1Y58.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Setting Outline Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEj5eC1Y58.svg',
    ["canva", "graphic", "icon", "magic", "outline", "recommendation", "setting"],
    20, 20
  ),
  /**
   * #247. Shiny Silky Crumpled Texture
   * Canva ID: MAEDJgXMqWM | Format: MAEDJgXMqWM.jpg (1248.4 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEDJgXMqWM.jpg
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Shiny Silky Crumpled Texture",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEDJgXMqWM.jpg',
    ["canva", "crumpled", "magic", "photo", "recommendation", "shiny", "silky", "texture"],
    25, 25
  ),
  /**
   * #248. Simple Vibrant Textured Minimalist Brussel Sprouts
   * Canva ID: MAFZ2luwJmM | Format: MAFZ2luwJmM.svg (217.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFZ2luwJmM.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Simple Vibrant Textured Minimalist Brussel Sprouts",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFZ2luwJmM.svg',
    ["brussel", "canva", "graphic", "magic", "minimalist", "recommendation", "simple", "sprouts", "textured", "vibrant"],
    25, 25
  ),
  /**
   * #249. Simple Vibrant Textured Minimalist Cauliflower
   * Canva ID: MAFZ2sPlavA | Format: MAFZ2sPlavA.svg (178.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFZ2sPlavA.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Simple Vibrant Textured Minimalist Cauliflower",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFZ2sPlavA.svg',
    ["canva", "cauliflower", "graphic", "magic", "minimalist", "recommendation", "simple", "textured", "vibrant"],
    25, 25
  ),
  /**
   * #250. Single Eye Icon
   * Canva ID: MAEVaGcJmRo | Format: MAEVaGcJmRo.svg (1.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEVaGcJmRo.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Single Eye Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEVaGcJmRo.svg',
    ["canva", "eye", "graphic", "icon", "magic", "recommendation", "single"],
    20, 20
  ),
  /**
   * #251. Sketchy Beige Rose Element
   * Canva ID: MADwe5XwguE | Format: MADwe5XwguE.svg (33.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADwe5XwguE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Sketchy Beige Rose Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADwe5XwguE.svg',
    ["beige", "canva", "element", "graphic", "magic", "recommendation", "rose", "sketchy"],
    25, 25
  ),
  /**
   * #252. Sketchy Gumamela Flower Element
   * Canva ID: MADwe5BeW2E | Format: MADwe5BeW2E.svg (133.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADwe5BeW2E.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Sketchy Gumamela Flower Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADwe5BeW2E.svg',
    ["canva", "element", "flower", "graphic", "gumamela", "magic", "recommendation", "sketchy"],
    25, 25
  ),
  /**
   * #253. Sketchy Veiny Petal Flower Element
   * Canva ID: MADwez2z8FE | Format: MADwez2z8FE.svg (218.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADwez2z8FE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Sketchy Veiny Petal Flower Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADwez2z8FE.svg',
    ["canva", "element", "flower", "graphic", "magic", "petal", "recommendation", "sketchy", "veiny"],
    25, 25
  ),
  /**
   * #254. Sketchy Violet Malva Flower Element
   * Canva ID: MADwe7k23gA | Format: MADwe7k23gA.svg (152.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADwe7k23gA.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Sketchy Violet Malva Flower Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADwe7k23gA.svg',
    ["canva", "element", "flower", "graphic", "magic", "malva", "recommendation", "sketchy", "violet"],
    25, 25
  ),
  /**
   * #255. Sketchy Warm Flower Element
   * Canva ID: MADwe9BW5sk | Format: MADwe9BW5sk.svg (243.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADwe9BW5sk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Sketchy Warm Flower Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADwe9BW5sk.svg',
    ["canva", "element", "flower", "graphic", "magic", "recommendation", "sketchy", "warm"],
    25, 25
  ),
  /**
   * #256. Sktrawberry Blue
   * Canva ID: MADtw27yUjA | Format: s3-1.svg (6.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADtw27yUjA.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Sktrawberry Blue",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADtw27yUjA.svg',
    ["blue", "canva", "graphic", "magic", "recommendation", "sktrawberry"],
    25, 25
  ),
  /**
   * #257. Star Sign Aquarius
   * Canva ID: MADw-Hn-0jk | Format: MADw-Hn-0jk.svg (41.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADw-Hn-0jk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Star Sign Aquarius",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADw-Hn-0jk.svg',
    ["aquarius", "canva", "graphic", "magic", "recommendation", "sign", "star"],
    25, 25
  ),
  /**
   * #258. Star Sign Aries
   * Canva ID: MADw-OHaVNk | Format: MADw-OHaVNk.svg (40.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADw-OHaVNk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Star Sign Aries",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADw-OHaVNk.svg',
    ["aries", "canva", "graphic", "magic", "recommendation", "sign", "star"],
    25, 25
  ),
  /**
   * #259. Star Sign Aries
   * Canva ID: MADw-I0sGZ0 | Format: MADw-I0sGZ0.svg (121.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADw-I0sGZ0.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Star Sign Aries",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADw-I0sGZ0.svg',
    ["aries", "canva", "graphic", "magic", "recommendation", "sign", "star"],
    25, 25
  ),
  /**
   * #260. Star Sign Scorpio
   * Canva ID: MADw-HRh_zs | Format: MADw-HRh_zs.svg (83.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADw-HRh_zs.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Star Sign Scorpio",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADw-HRh_zs.svg',
    ["canva", "graphic", "magic", "recommendation", "scorpio", "sign", "star"],
    25, 25
  ),
  /**
   * #261. Star Sign Taurus
   * Canva ID: MADw-LlbJHc | Format: MADw-LlbJHc.svg (71.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADw-LlbJHc.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Star Sign Taurus",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADw-LlbJHc.svg',
    ["canva", "graphic", "magic", "recommendation", "sign", "star", "taurus"],
    25, 25
  ),
  /**
   * #262. Star Sign Virgo
   * Canva ID: MADw-I8a1eY | Format: MADw-I8a1eY.svg (65.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADw-I8a1eY.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Star Sign Virgo",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADw-I8a1eY.svg',
    ["canva", "graphic", "magic", "recommendation", "sign", "star", "virgo"],
    25, 25
  ),
  /**
   * #263. Stethoscope
   * Canva ID: MADzxx6cTDo | Format: s3-1.svg (12.8 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADzxx6cTDo.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Stethoscope",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADzxx6cTDo.svg',
    ["canva", "graphic", "magic", "recommendation", "stethoscope"],
    25, 25
  ),
  /**
   * #264. Sumatran Tiger Illustration
   * Canva ID: MAEOTcAnPp8 | Format: MAEOTcAnPp8.svg (172.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEOTcAnPp8.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Sumatran Tiger Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEOTcAnPp8.svg',
    ["canva", "graphic", "illustration", "magic", "recommendation", "sumatran", "tiger"],
    25, 25
  ),
  /**
   * #265. Sunda Clouded Leopard Illustration
   * Canva ID: MAEOTUTms-8 | Format: MAEOTUTms-8.svg (150.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEOTUTms-8.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Sunda Clouded Leopard Illustration",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEOTUTms-8.svg',
    ["canva", "clouded", "graphic", "illustration", "leopard", "magic", "recommendation", "sunda"],
    25, 25
  ),
  /**
   * #266. Telegram Logo
   * Canva ID: MAGzZ-S4TP0 | Format: MAGzZ-S4TP0.svg (1.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzZ-S4TP0.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Telegram Logo",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzZ-S4TP0.svg',
    ["canva", "graphic", "logo", "magic", "recommendation", "telegram"],
    25, 25
  ),
  /**
   * #267. Textured Geometric Indigenous Witchetty Grubs
   * Canva ID: MAFoTxdVmmU | Format: s3-1.svg (1118.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAFoTxdVmmU.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Textured Geometric Indigenous Witchetty Grubs",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAFoTxdVmmU.svg',
    ["canva", "geometric", "graphic", "grubs", "indigenous", "magic", "recommendation", "textured", "witchetty"],
    25, 25
  ),
  /**
   * #268. Textured Handdrawn Mental Health Consultation
   * Canva ID: MAEqD6V2vgg | Format: s.png (125.0 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAEqD6V2vgg.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Textured Handdrawn Mental Health Consultation",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEqD6V2vgg.png',
    ["canva", "consultation", "handdrawn", "health", "magic", "mental", "photo", "recommendation", "textured"],
    25, 25
  ),
  /**
   * #269. this
   * Canva ID: MAEFiJ4N9fw | Format: MAEFiJ4N9fw.svg (0.7 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEFiJ4N9fw.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "this",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEFiJ4N9fw.svg',
    ["canva", "graphic", "magic", "recommendation", "this"],
    25, 25
  ),
  /**
   * #270. Travel Element Action Camera
   * Canva ID: MADnuKenQmw | Format: thumbnail.png (9.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuKenQmw.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Travel Element Action Camera",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuKenQmw.png',
    ["action", "camera", "canva", "element", "graphic", "magic", "recommendation", "travel"],
    25, 25
  ),
  /**
   * #271. Travel Element Airplane
   * Canva ID: MADnuMZS8Fs | Format: MADnuMZS8Fs.svg (230.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuMZS8Fs.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Travel Element Airplane",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuMZS8Fs.svg',
    ["airplane", "canva", "element", "graphic", "magic", "recommendation", "travel"],
    25, 25
  ),
  /**
   * #272. Travel Element Backpack
   * Canva ID: MADnuJwkT6Y | Format: thumbnail.png (9.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuJwkT6Y.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Travel Element Backpack",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuJwkT6Y.png',
    ["backpack", "canva", "element", "graphic", "magic", "recommendation", "travel"],
    25, 25
  ),
  /**
   * #273. Travel Element Binoculars
   * Canva ID: MADnuF_wpno | Format: thumbnail.png (5.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuF_wpno.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Travel Element Binoculars",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuF_wpno.png',
    ["binoculars", "canva", "element", "graphic", "magic", "recommendation", "travel"],
    25, 25
  ),
  /**
   * #274. Travel Element Polaroid
   * Canva ID: MADnuE67xj8 | Format: thumbnail.png (7.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuE67xj8.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Travel Element Polaroid",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuE67xj8.png',
    ["canva", "element", "graphic", "magic", "polaroid", "recommendation", "travel"],
    25, 25
  ),
  /**
   * #275. Travel Element Watch
   * Canva ID: MADnuGzawIA | Format: thumbnail.png (7.2 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADnuGzawIA.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Travel Element Watch",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADnuGzawIA.png',
    ["canva", "element", "graphic", "magic", "recommendation", "travel", "watch"],
    25, 25
  ),
  /**
   * #276. triangle down icon
   * Canva ID: MAE6u2Kr_H0 | Format: MAE6u2Kr_H0.png (1.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAE6u2Kr_H0.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "triangle down icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAE6u2Kr_H0.png',
    ["canva", "down", "graphic", "icon", "magic", "recommendation", "triangle"],
    20, 20
  ),
  /**
   * #277. Tumblr Logo
   * Canva ID: MAGzZ-s7njM | Format: MAGzZ-s7njM.svg (1.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzZ-s7njM.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Tumblr Logo",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzZ-s7njM.svg',
    ["canva", "graphic", "logo", "magic", "recommendation", "tumblr"],
    25, 25
  ),
  /**
   * #278. Tumblr Logo
   * Canva ID: MAGzZ0fS5Xk | Format: MAGzZ0fS5Xk.svg (1.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzZ0fS5Xk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Tumblr Logo",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzZ0fS5Xk.svg',
    ["canva", "graphic", "logo", "magic", "recommendation", "tumblr"],
    25, 25
  ),
  /**
   * #279. Two Arrows Pointing Down
   * Canva ID: MAEGCWxtGtg | Format: MAEGCWxtGtg.png (16.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEGCWxtGtg.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Two Arrows Pointing Down",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEGCWxtGtg.png',
    ["arrows", "canva", "down", "graphic", "magic", "pointing", "recommendation", "two"],
    20, 20
  ),
  /**
   * #280. Untitled media
   * Canva ID: MAE8_hpnFhU | Format: MAE8_hpnFhU.png (251.3 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAE8_hpnFhU.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Untitled media",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAE8_hpnFhU.png',
    ["canva", "magic", "media", "photo", "recommendation", "untitled"],
    25, 25
  ),
  /**
   * #281. User Interface Icon With Circle
   * Canva ID: MAGUryfWRZ8 | Format: MAGUryfWRZ8.png (3.1 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGUryfWRZ8.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "User Interface Icon With Circle",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGUryfWRZ8.png',
    ["canva", "circle", "graphic", "icon", "interface", "magic", "recommendation", "user", "with"],
    20, 20
  ),
  /**
   * #282. VADhwQDxd-I
   * Canva ID: VADhwQDxd-I | Format: VADhwQDxd-I.gif (106.0 KB) | Kind: Animated
   * Asset Path: /elements/magic_recommendations/VADhwQDxd-I.gif
   * Usage: Animated asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "VADhwQDxd-I",
    'Magic Recommendations',
    '/elements/magic_recommendations/VADhwQDxd-I.gif',
    ["animated", "canva", "magic", "recommendation", "vadhwqdxd"],
    25, 25
  ),
  /**
   * #283. VADhwYE-9Uk
   * Canva ID: VADhwYE-9Uk | Format: VADhwYE-9Uk.gif (16.7 KB) | Kind: Animated
   * Asset Path: /elements/magic_recommendations/VADhwYE-9Uk.gif
   * Usage: Animated asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "VADhwYE-9Uk",
    'Magic Recommendations',
    '/elements/magic_recommendations/VADhwYE-9Uk.gif',
    ["9uk", "animated", "canva", "magic", "recommendation", "vadhwye"],
    25, 25
  ),
  /**
   * #284. VADls6hiOak
   * Canva ID: VADls6hiOak | Format: VADls6hiOak.gif (3.2 KB) | Kind: Animated
   * Asset Path: /elements/magic_recommendations/VADls6hiOak.gif
   * Usage: Animated asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "VADls6hiOak",
    'Magic Recommendations',
    '/elements/magic_recommendations/VADls6hiOak.gif',
    ["animated", "canva", "magic", "recommendation", "vadls6hioak"],
    25, 25
  ),
  /**
   * #285. VADn8byslko
   * Canva ID: VADn8byslko | Format: VADn8byslko.gif (44.8 KB) | Kind: Animated
   * Asset Path: /elements/magic_recommendations/VADn8byslko.gif
   * Usage: Animated asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "VADn8byslko",
    'Magic Recommendations',
    '/elements/magic_recommendations/VADn8byslko.gif',
    ["animated", "canva", "magic", "recommendation", "vadn8byslko"],
    25, 25
  ),
  /**
   * #286. VAFBm2qH9y8
   * Canva ID: VAFBm2qH9y8 | Format: VAFBm2qH9y8.gif (240.0 KB) | Kind: Animated
   * Asset Path: /elements/magic_recommendations/VAFBm2qH9y8.gif
   * Usage: Animated asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "VAFBm2qH9y8",
    'Magic Recommendations',
    '/elements/magic_recommendations/VAFBm2qH9y8.gif',
    ["animated", "canva", "magic", "recommendation", "vafbm2qh9y8"],
    25, 25
  ),
  /**
   * #287. VAFq2oWNYcE
   * Canva ID: VAFq2oWNYcE | Format: VAFq2oWNYcE.gif (765.8 KB) | Kind: Animated
   * Asset Path: /elements/magic_recommendations/VAFq2oWNYcE.gif
   * Usage: Animated asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "VAFq2oWNYcE",
    'Magic Recommendations',
    '/elements/magic_recommendations/VAFq2oWNYcE.gif',
    ["animated", "canva", "magic", "recommendation", "vafq2ownyce"],
    25, 25
  ),
  /**
   * #288. VAFVjoSc9P8
   * Canva ID: VAFVjoSc9P8 | Format: VAFVjoSc9P8.gif (684.4 KB) | Kind: Animated
   * Asset Path: /elements/magic_recommendations/VAFVjoSc9P8.gif
   * Usage: Animated asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "VAFVjoSc9P8",
    'Magic Recommendations',
    '/elements/magic_recommendations/VAFVjoSc9P8.gif',
    ["animated", "canva", "magic", "recommendation", "vafvjosc9p8"],
    25, 25
  ),
  /**
   * #289. Vector Icon of a Share Button
   * Canva ID: MAEF-dkwOxo | Format: MAEF-dkwOxo.png (40.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEF-dkwOxo.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Vector Icon of a Share Button",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEF-dkwOxo.png',
    ["button", "canva", "graphic", "icon", "magic", "of", "recommendation", "share", "vector"],
    20, 20
  ),
  /**
   * #290. Vector Icon of a Share Symbol
   * Canva ID: MAEF-YTiDsI | Format: MAEF-YTiDsI.png (44.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEF-YTiDsI.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Vector Icon of a Share Symbol",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEF-YTiDsI.png',
    ["canva", "graphic", "icon", "magic", "of", "recommendation", "share", "symbol", "vector"],
    20, 20
  ),
  /**
   * #291. Verified Blue Checkmark
   * Canva ID: MAF1lIpMCWY | Format: MAF1lIpMCWY.png (13.8 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAF1lIpMCWY.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Verified Blue Checkmark",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAF1lIpMCWY.png',
    ["blue", "canva", "checkmark", "magic", "photo", "recommendation", "verified"],
    25, 25
  ),
  /**
   * #292. Vibrant Sketchy Floral Element
   * Canva ID: MADwez6xp6Q | Format: MADwez6xp6Q.svg (112.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADwez6xp6Q.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Vibrant Sketchy Floral Element",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADwez6xp6Q.svg',
    ["canva", "element", "floral", "graphic", "magic", "recommendation", "sketchy", "vibrant"],
    25, 25
  ),
  /**
   * #293. Video File Icon
   * Canva ID: MAEjDAuyytM | Format: MAEjDAuyytM.svg (1.3 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAEjDAuyytM.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Video File Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAEjDAuyytM.svg',
    ["canva", "file", "graphic", "icon", "magic", "recommendation", "video"],
    20, 20
  ),
  /**
   * #294. Volcano and Lava Witty Valentines Quotes
   * Canva ID: MADw-OZ1jcs | Format: MADw-OZ1jcs.svg (17.9 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADw-OZ1jcs.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Volcano and Lava Witty Valentines Quotes",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADw-OZ1jcs.svg',
    ["and", "canva", "graphic", "lava", "magic", "quotes", "recommendation", "valentines", "volcano", "witty"],
    25, 25
  ),
  /**
   * #295. Watercolor Italian Food Olive OIl
   * Canva ID: MAD_TjW96m0 | Format: s.png (683.1 KB) | Kind: Photo
   * Asset Path: /elements/magic_recommendations/MAD_TjW96m0.png
   * Usage: Photo asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Watercolor Italian Food Olive OIl",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAD_TjW96m0.png',
    ["canva", "food", "italian", "magic", "oil", "olive", "photo", "recommendation", "watercolor"],
    25, 25
  ),
  /**
   * #296. Watermelon Alternative Colors
   * Canva ID: MADtw_4UFLI | Format: s3-1.svg (7.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADtw_4UFLI.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Watermelon Alternative Colors",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADtw_4UFLI.svg',
    ["alternative", "canva", "colors", "graphic", "magic", "recommendation", "watermelon"],
    25, 25
  ),
  /**
   * #297. Whatsapp Icon
   * Canva ID: MAGzNuuUd6Q | Format: s3-1.svg (1.6 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGzNuuUd6Q.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Whatsapp Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGzNuuUd6Q.svg',
    ["canva", "graphic", "icon", "magic", "recommendation", "whatsapp"],
    20, 20
  ),
  /**
   * #298. Working Woman Nurse
   * Canva ID: MADuajfxHzk | Format: s3-1.svg (78.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADuajfxHzk.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Working Woman Nurse",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADuajfxHzk.svg',
    ["canva", "graphic", "magic", "nurse", "recommendation", "woman", "working"],
    25, 25
  ),
  /**
   * #299. Wrench Icon
   * Canva ID: MAGmSVZfmQ4 | Format: s3-1.svg (4.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MAGmSVZfmQ4.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Wrench Icon",
    'Magic Recommendations',
    '/elements/magic_recommendations/MAGmSVZfmQ4.svg',
    ["canva", "graphic", "icon", "magic", "recommendation", "wrench"],
    20, 20
  ),
  /**
   * #300. Yellow and Pink Leaves
   * Canva ID: MADo-4U39tQ | Format: thumbnail.png (6.0 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADo-4U39tQ.png
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Yellow and Pink Leaves",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADo-4U39tQ.png',
    ["and", "canva", "graphic", "leaves", "magic", "pink", "recommendation", "yellow"],
    25, 25
  ),
  /**
   * #301. Yellow Patterned Leaf around Green Leaves
   * Canva ID: MADmd79R2sE | Format: MADmd79R2sE.svg (22.5 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADmd79R2sE.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Yellow Patterned Leaf around Green Leaves",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADmd79R2sE.svg',
    ["around", "canva", "graphic", "green", "leaf", "leaves", "magic", "patterned", "recommendation", "yellow"],
    25, 25
  ),
  /**
   * #302. Yellow Pear
   * Canva ID: MADtw8PPQks | Format: s.svg (4.4 KB) | Kind: Graphic
   * Asset Path: /elements/magic_recommendations/MADtw8PPQks.svg
   * Usage: Graphic asset for magazine layouts, covers, editorial illustrations, and decor.
   */
  baseGraphic(
    "Yellow Pear",
    'Magic Recommendations',
    '/elements/magic_recommendations/MADtw8PPQks.svg',
    ["canva", "graphic", "magic", "pear", "recommendation", "yellow"],
    25, 25
  ),
];

// ---------------------------------------------------------------------------
// 2. FEATURED GRAPHICS (Screenshot 1)
// ---------------------------------------------------------------------------
export const FEATURED_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'Blobfish Mascot',
    'Featured',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100">
      <path d="M25 60 C10 40 40 15 75 18 C115 15 135 45 125 70 C115 88 40 88 25 60 Z" fill="#FBCFE8" stroke="#F472B6" stroke-width="2"/>
      <circle cx="50" cy="40" r="4" fill="#831843"/>
      <circle cx="95" cy="40" r="4" fill="#831843"/>
      <path d="M60 42 C55 35 85 35 80 42 C92 58 85 70 70 70 C55 70 48 58 60 42 Z" fill="#F472B6" opacity="0.8"/>
      <path d="M52 75 Q70 66 88 75" stroke="#831843" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M15 55 C5 50 5 65 15 62 Z" fill="#F472B6"/>
    </svg>`),
    ['blobfish', 'fish', 'creature', 'funny', 'sea', 'featured'],
    28, 20
  ),
  baseGraphic(
    'Peacock Flute & Feather',
    'Featured',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80">
      <rect x="20" y="38" width="120" height="8" rx="4" fill="#D97706" stroke="#92400E" stroke-width="1.5"/>
      <circle cx="50" cy="42" r="2" fill="#451A03"/>
      <circle cx="65" cy="42" r="2" fill="#451A03"/>
      <circle cx="80" cy="42" r="2" fill="#451A03"/>
      <circle cx="95" cy="42" r="2" fill="#451A03"/>
      <circle cx="110" cy="42" r="2" fill="#451A03"/>
      <path d="M110 38 C115 15 135 15 130 38 C125 15 105 15 110 38 Z" fill="#059669"/>
      <circle cx="120" cy="24" r="5" fill="#2563EB"/>
      <circle cx="120" cy="24" r="2.5" fill="#FBBF24"/>
      <path d="M100 38 C105 20 120 20 115 38 Z" fill="#0D9488"/>
      <path d="M30 46 Q25 65 35 75 M35 46 Q40 65 30 75" stroke="#B45309" stroke-width="2" fill="none"/>
    </svg>`),
    ['flute', 'peacock', 'feather', 'music', 'krishna', 'instrument'],
    32, 16
  ),
  baseGraphic(
    'Crimson Paint Splatter',
    'Featured',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <path d="M60 45 C45 35 30 48 38 65 C25 72 32 90 50 85 C55 98 75 98 80 85 C95 88 100 70 90 60 C102 45 85 30 72 42 Z" fill="#991B1B"/>
      <circle cx="25" cy="35" r="5" fill="#991B1B"/>
      <circle cx="95" cy="30" r="4" fill="#991B1B"/>
      <circle cx="105" cy="78" r="6" fill="#991B1B"/>
      <circle cx="18" cy="80" r="3.5" fill="#991B1B"/>
      <circle cx="58" cy="18" r="5.5" fill="#991B1B"/>
      <circle cx="70" cy="106" r="4" fill="#991B1B"/>
      <path d="M75 85 L98 108" stroke="#991B1B" stroke-width="3" stroke-linecap="round"/>
      <path d="M38 65 L15 52" stroke="#991B1B" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M72 42 L88 20" stroke="#991B1B" stroke-width="3" stroke-linecap="round"/>
    </svg>`),
    ['paint', 'splatter', 'blood', 'ink', 'art', 'grunge'],
    25, 25
  ),
  baseGraphic(
    '3D Location Pin Marker',
    'Featured',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
      <path d="M50 10 C30 10 15 26 15 46 C15 72 46 105 50 110 C54 105 85 72 85 46 C85 26 70 10 50 10 Z" fill="none" stroke="#4B5563" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="50" cy="46" r="16" fill="none" stroke="#6B7280" stroke-width="5"/>
      <path d="M50 16 C34 16 22 29 22 46 C22 68 47 96 50 100" stroke="#9CA3AF" stroke-width="2.5" fill="none"/>
    </svg>`),
    ['map', 'pin', 'marker', 'location', 'travel', 'gps'],
    22, 26
  ),
];

// ---------------------------------------------------------------------------
// 3. GRADIENTS (Canva Session Authentic Gradients & Assets)
// ---------------------------------------------------------------------------
export const GRADIENT_ITEMS: ElementLibraryItem[] = [
  /**
   * Canva Gradient #1: Abstract Gradient Background
   * Canva ID: MAHBY_ZFzrQ | Format: MAHBY_ZFzrQ.png (644.8 KB)
   * Path: /elements/magic_recommendations/MAHBY_ZFzrQ.png
   */
  baseGraphic(
    "Abstract Gradient Background",
    'Gradients',
    '/elements/magic_recommendations/MAHBY_ZFzrQ.png',
    ["abstract", "background", "canva", "gradient", "overlay"],
    40, 40
  ),
  /**
   * Canva Gradient #2: Abstract Gradient Background
   * Canva ID: MAHBY2dnpHI | Format: MAHBY2dnpHI.png (1086.6 KB)
   * Path: /elements/magic_recommendations/MAHBY2dnpHI.png
   */
  baseGraphic(
    "Abstract Gradient Background",
    'Gradients',
    '/elements/magic_recommendations/MAHBY2dnpHI.png',
    ["abstract", "background", "canva", "gradient", "overlay"],
    40, 40
  ),
  /**
   * Canva Gradient #3: Gradient Overlay Cutout
   * Canva ID: MAFczfoa3TA | Format: MAFczfoa3TA.svg (1.3 KB)
   * Path: /elements/magic_recommendations/MAFczfoa3TA.svg
   */
  baseGraphic(
    "Gradient Overlay Cutout",
    'Gradients',
    '/elements/magic_recommendations/MAFczfoa3TA.svg',
    ["background", "canva", "cutout", "gradient", "overlay"],
    40, 40
  ),
  /**
   * Canva Gradient #4: Abstract Orange-Red Gradient Background
   * Canva ID: MAG72gDCDP4 | Format: MAG72gDCDP4.png (2586.2 KB)
   * Path: /elements/magic_recommendations/MAG72gDCDP4.png
   */
  baseGraphic(
    "Abstract Orange-Red Gradient Background",
    'Gradients',
    '/elements/magic_recommendations/MAG72gDCDP4.png',
    ["abstract", "background", "canva", "gradient", "orange", "overlay", "red"],
    40, 40
  ),
  /**
   * Canva Gradient #5: Gradient that fades to transparency
   * Canva ID: MADWDzB46Dw | Format: MADWDzB46Dw.svg (0.6 KB)
   * Path: /elements/magic_recommendations/MADWDzB46Dw.svg
   */
  baseGraphic(
    "Gradient that fades to transparency",
    'Gradients',
    '/elements/magic_recommendations/MADWDzB46Dw.svg',
    ["background", "canva", "fades", "gradient", "overlay", "that", "to", "transparency"],
    40, 40
  ),
  /**
   * Canva Gradient #6: Abstract Black Oval Shape
   * Canva ID: MAHBY_v_nT8 | Format: MAHBY_v_nT8.png (1287.7 KB)
   * Path: /elements/magic_recommendations/MAHBY_v_nT8.png
   */
  baseGraphic(
    "Abstract Black Oval Shape",
    'Gradients',
    '/elements/magic_recommendations/MAHBY_v_nT8.png',
    ["abstract", "background", "black", "canva", "gradient", "oval", "overlay", "shape"],
    40, 40
  ),
  /**
   * Canva Gradient #7: Experimental Grainy Gradient Decorative Square
   * Canva ID: MAFqZxyjtW4 | Format: s3-1.svg (998.1 KB)
   * Path: /elements/magic_recommendations/MAFqZxyjtW4.svg
   */
  baseGraphic(
    "Experimental Grainy Gradient Decorative Square",
    'Gradients',
    '/elements/magic_recommendations/MAFqZxyjtW4.svg',
    ["background", "canva", "decorative", "experimental", "gradient", "grainy", "overlay", "square"],
    40, 40
  ),
  /**
   * Canva Gradient #8: Gradient Holographic Portrait Orientation Frame
   * Canva ID: MAC-SHA256 | Format: 230w-mSK42Mv8K5Q.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5GDSPLNH%2F20260906%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260906T081537Z&X-Amz-Expires=275787&X-Amz-Signature=306de3bd6122f3251c149edc773d032f136bfc8f2a46b0cb4b36cc66b490bb53&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Wed%2C%2009%20Sep%202026%2012%3A52%3A04%20GMT (43.0 KB)
   * Path: /elements/magic_recommendations/MAC-SHA256.png
   */
  baseGraphic(
    "Gradient Holographic Portrait Orientation Frame",
    'Gradients',
    '/elements/magic_recommendations/MAC-SHA256.png',
    ["background", "canva", "frame", "gradient", "holographic", "orientation", "overlay", "portrait"],
    40, 40
  ),

  baseGraphic(
    'Black & White Linear Gradient',
    'Gradients',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="gBW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="8" fill="url(#gBW)"/>
    </svg>`),
    ['gradient', 'black', 'white', 'fade', 'monochrome', 'contrast'],
    35, 35
  ),

  baseGraphic(
    'Dark Corner Vignette Gradient',
    'Gradients',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="gVig" cx="70%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#E5E7EB"/>
          <stop offset="100%" stop-color="#111827"/>
        </radialGradient>
      </defs>
      <rect width="120" height="120" rx="8" fill="url(#gVig)"/>
    </svg>`),
    ['gradient', 'vignette', 'radial', 'shadow', 'dark', 'atmospheric'],
    35, 35
  ),

  baseGraphic(
    'Azure Horizon Sky Gradient',
    'Gradients',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="45%" stop-color="#E0F2FE"/>
          <stop offset="55%" stop-color="#0284C7"/>
          <stop offset="100%" stop-color="#FFFFFF"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="8" fill="url(#gSky)"/>
    </svg>`),
    ['gradient', 'sky', 'blue', 'horizon', 'fresh', 'ocean'],
    35, 35
  ),

  baseGraphic(
    'Warm Peach Watercolor Sunset',
    'Gradients',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="gPeach" cx="80%" cy="60%" r="70%">
          <stop offset="0%" stop-color="#F97316"/>
          <stop offset="50%" stop-color="#FDBA74" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.1"/>
        </radialGradient>
      </defs>
      <rect width="120" height="120" rx="8" fill="#FFF7ED"/>
      <rect width="120" height="120" rx="8" fill="url(#gPeach)"/>
    </svg>`),
    ['gradient', 'peach', 'sunset', 'warm', 'watercolor', 'orange'],
    35, 35
  ),

  baseGraphic(
    'Purple to Coral Mesh Gradient',
    'Gradients',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="gMesh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#8B3DFF"/>
          <stop offset="50%" stop-color="#FF5263"/>
          <stop offset="100%" stop-color="#FF9600"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="8" fill="url(#gMesh)"/>
    </svg>`),
    ['gradient', 'mesh', 'purple', 'coral', 'canva', 'vibrant'],
    35, 35
  ),
];

// ---------------------------------------------------------------------------
// 4. ANIMATIONS (Screenshot 2)
// ---------------------------------------------------------------------------
export const ANIMATION_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'Pointing Hand Gesture',
    'Animations',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <path d="M55 20 C55 12 45 12 45 20 L45 65 L40 65 C35 65 30 70 32 75 L45 105 C48 112 55 115 65 115 L82 115 C92 115 98 108 98 98 L98 75 C98 68 92 65 85 65 L80 65 L80 55 C80 50 72 50 72 55 L72 65 L65 65 L65 45 C65 40 55 40 55 45 Z" fill="#F43F5E" fill-opacity="0.1" stroke="#F43F5E" stroke-width="3" stroke-linejoin="round"/>
      <path d="M45 45 L45 65" stroke="#10B981" stroke-width="3"/>
      <path d="M72 75 L72 90" stroke="#8B3DFF" stroke-width="2.5"/>
    </svg>`),
    ['pointing', 'hand', 'gesture', 'click', 'interactive', 'animated'],
    25, 25
  ),
  baseGraphic(
    'Celebration Confetti Burst',
    'Animations',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <polygon points="60,20 65,30 55,30" fill="#3B82F6"/>
      <polygon points="30,40 38,48 30,52" fill="#EC4899"/>
      <polygon points="85,35 95,42 85,50" fill="#10B981"/>
      <polygon points="45,65 55,70 48,80" fill="#F59E0B"/>
      <polygon points="75,70 85,75 80,85" fill="#8B3DFF"/>
      <circle cx="20" cy="30" r="3" fill="#6366F1"/>
      <circle cx="100" cy="25" r="3.5" fill="#EF4444"/>
      <circle cx="40" cy="90" r="4" fill="#06B6D4"/>
      <circle cx="80" cy="100" r="3" fill="#F97316"/>
      <circle cx="60" cy="50" r="3.5" fill="#84CC16"/>
      <line x1="25" y1="70" x2="35" y2="78" stroke="#F43F5E" stroke-width="3" stroke-linecap="round"/>
      <line x1="90" y1="60" x2="102" y2="65" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"/>
    </svg>`),
    ['confetti', 'party', 'celebrate', 'sparkle', 'festival', 'animated'],
    28, 28
  ),
  baseGraphic(
    'Flying Jet Airplane',
    'Animations',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 90">
      <path d="M15 50 C30 45 70 42 110 45 C125 46 135 52 130 58 C125 64 110 65 95 65 L40 65 C25 65 10 58 15 50 Z" fill="#EF4444" stroke="#B91C1C" stroke-width="2"/>
      <path d="M60 44 L75 15 L90 15 L82 44 Z" fill="#DC2626" stroke="#B91C1C" stroke-width="2"/>
      <path d="M65 65 L55 85 L70 85 L80 65 Z" fill="#DC2626" stroke="#B91C1C" stroke-width="2"/>
      <path d="M115 45 L125 25 L135 25 L130 46 Z" fill="#B91C1C"/>
      <circle cx="50" cy="55" r="3" fill="#FFFFFF"/>
      <circle cx="65" cy="55" r="3" fill="#FFFFFF"/>
      <circle cx="80" cy="55" r="3" fill="#FFFFFF"/>
      <circle cx="95" cy="55" r="3" fill="#FFFFFF"/>
    </svg>`),
    ['airplane', 'plane', 'flight', 'travel', 'trip', 'animated'],
    32, 20
  ),
  baseGraphic(
    'Shining Sparkle Star',
    'Animations',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 5 Q50 50 5 50 Q50 50 50 95 Q50 50 95 50 Q50 50 50 5 Z" fill="#FDE047" stroke="#EAB308" stroke-width="2"/>
      <circle cx="50" cy="50" r="12" fill="#FEF08A"/>
      <line x1="20" y1="20" x2="30" y2="30" stroke="#FACC15" stroke-width="3" stroke-linecap="round"/>
      <line x1="80" y1="20" x2="70" y2="30" stroke="#FACC15" stroke-width="3" stroke-linecap="round"/>
      <line x1="20" y1="80" x2="30" y2="70" stroke="#FACC15" stroke-width="3" stroke-linecap="round"/>
      <line x1="80" y1="80" x2="70" y2="70" stroke="#FACC15" stroke-width="3" stroke-linecap="round"/>
    </svg>`),
    ['sparkle', 'shine', 'star', 'magic', 'glow', 'animated'],
    24, 24
  ),
];

// ---------------------------------------------------------------------------
// 5. SOCIAL MEDIA (Screenshot 2)
// ---------------------------------------------------------------------------
export const SOCIAL_MEDIA_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'Telegram',
    'Social Media',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#229ED9"/>
      <path d="M22 48 L76 26 C79 25 82 27 81 30 L72 74 C71 78 67 79 64 77 L48 65 L41 72 C40 73 38 73 38 72 L39 60 L68 34 C69 33 68 32 67 33 L31 56 L20 52 C17 51 17 49 22 48 Z" fill="#FFFFFF"/>
    </svg>`),
    ['telegram', 'social', 'messaging', 'app', 'icon'],
    20, 20
  ),
  baseGraphic(
    'Medium',
    'Social Media',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80">
      <text x="10" y="55" font-family="Georgia, serif" font-weight="900" font-size="46" fill="#111827">Medium</text>
    </svg>`),
    ['medium', 'blog', 'article', 'social', 'publishing'],
    32, 16
  ),
  baseGraphic(
    'Tumblr',
    'Social Media',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#001935"/>
      <path d="M58 82 C46 82 42 74 42 64 L42 45 L32 45 L32 36 C42 34 44 24 45 18 L55 18 L55 34 L68 34 L68 45 L55 45 L55 62 C55 67 58 69 63 69 C66 69 68 68 70 67 L70 79 C67 81 62 82 58 82 Z" fill="#FFFFFF"/>
    </svg>`),
    ['tumblr', 'social', 'blog', 'network', 'icon'],
    20, 20
  ),
  baseGraphic(
    'Discord',
    'Social Media',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#5865F2"/>
      <path d="M68 28 C63 26 57 24 51 24 C50 24 49 24 49 24 C43 24 37 26 32 28 C22 43 20 57 21 72 C27 77 34 80 40 82 C42 79 43 76 45 73 C39 71 37 68 36 65 C37 65 37 66 38 66 C46 70 54 70 62 66 C63 66 63 65 64 65 C63 68 61 71 55 73 C57 76 58 79 60 82 C66 80 73 77 79 72 C80 55 76 41 68 28 Z M38 60 C34 60 31 57 31 53 C31 49 34 46 38 46 C42 46 45 49 45 53 C45 57 42 60 38 60 Z M62 60 C58 60 55 57 55 53 C55 49 58 46 62 46 C66 46 69 49 69 53 C69 57 66 60 62 60 Z" fill="#FFFFFF"/>
    </svg>`),
    ['discord', 'gaming', 'chat', 'community', 'icon'],
    20, 20
  ),
  baseGraphic(
    'Instagram',
    'Social Media',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="gInsta" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFD600"/>
          <stop offset="50%" stop-color="#FF0069"/>
          <stop offset="100%" stop-color="#7638FA"/>
        </linearGradient>
      </defs>
      <rect width="96" height="96" x="2" y="2" rx="24" fill="url(#gInsta)"/>
      <rect width="60" height="60" x="20" y="20" rx="16" fill="none" stroke="#FFFFFF" stroke-width="6"/>
      <circle cx="50" cy="50" r="14" fill="none" stroke="#FFFFFF" stroke-width="6"/>
      <circle cx="67" cy="33" r="3.5" fill="#FFFFFF"/>
    </svg>`),
    ['instagram', 'social', 'photo', 'story', 'camera'],
    20, 20
  ),
  baseGraphic(
    'YouTube',
    'Social Media',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
      <rect width="110" height="80" x="5" y="5" rx="22" fill="#FF0000"/>
      <polygon points="50,30 80,45 50,60" fill="#FFFFFF"/>
    </svg>`),
    ['youtube', 'video', 'stream', 'play', 'media'],
    24, 18
  ),
  baseGraphic(
    'X (Twitter)',
    'Social Media',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#000000"/>
      <path d="M28 25 L45 49 L27 75 L36 75 L49 56 L61 75 L73 75 L55 49 L71 25 L62 25 L51 42 L40 25 Z M33 28 L39 28 L67 72 L61 72 Z" fill="#FFFFFF"/>
    </svg>`),
    ['x', 'twitter', 'tweet', 'social', 'news'],
    20, 20
  ),
  baseGraphic(
    'TikTok',
    'Social Media',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#010101"/>
      <path d="M52 20 L52 62 C52 70 46 76 38 76 C30 76 24 70 24 62 C24 54 30 48 38 48 C40 48 41 48 43 49 L43 38 C41 38 39 38 38 38 C25 38 14 49 14 62 C14 75 25 86 38 86 C51 86 62 75 62 62 L62 42 C68 46 75 48 83 48 L83 38 C75 38 67 33 63 26 L62 20 Z" fill="#25F4EE"/>
      <path d="M56 22 L56 64 C56 72 50 78 42 78 C34 78 28 72 28 64 C28 56 34 50 42 50 C44 50 45 50 47 51 L47 40 C45 40 43 40 42 40 C29 40 18 51 18 64 C18 77 29 88 42 88 C55 88 66 77 66 64 L66 44 C72 48 79 50 87 50 L87 40 C79 40 71 35 67 28 L66 22 Z" fill="#FE2C55" opacity="0.8"/>
      <path d="M54 21 L54 63 C54 71 48 77 40 77 C32 77 26 71 26 63 C26 55 32 49 40 49 C42 49 43 49 45 50 L45 39 C43 39 41 39 40 39 C27 39 16 50 16 63 C16 76 27 87 40 87 C53 87 64 76 64 63 L64 43 C70 47 77 49 85 49 L85 39 C77 39 69 34 65 27 L64 21 Z" fill="#FFFFFF"/>
    </svg>`),
    ['tiktok', 'video', 'short', 'viral', 'music', 'social'],
    20, 20
  ),
];

// ---------------------------------------------------------------------------
// 6. HANDDRAWN DOODLES (Screenshot 3)
// ---------------------------------------------------------------------------
export const HANDDRAWN_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'Handdrawn Download Tray Arrow',
    'Handdrawn',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M42 12 C44 10 54 10 56 12 L54 48 L68 45 C73 44 75 48 70 53 L54 72 C50 76 46 76 42 72 L26 53 C22 48 24 44 29 45 L42 48 Z" fill="#1C2024" stroke="#1C2024" stroke-width="2" stroke-linejoin="round"/>
      <path d="M12 68 L12 85 C12 89 16 92 20 92 L78 92 C82 92 86 89 86 85 L86 68" fill="none" stroke="#1C2024" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`),
    ['download', 'arrow', 'tray', 'handdrawn', 'sketch', 'doodle'],
    22, 22
  ),
  baseGraphic(
    'Handdrawn Business Team Avatar',
    'Handdrawn',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110">
      <!-- Leader Center with Bun -->
      <circle cx="70" cy="20" r="10" fill="#1C2024"/>
      <ellipse cx="70" cy="38" rx="16" ry="18" fill="none" stroke="#1C2024" stroke-width="4"/>
      <path d="M55 35 C55 24 85 24 85 35 C85 45 78 45 70 45 C62 45 55 45 55 35 Z" fill="#1C2024"/>
      <path d="M48 68 C48 55 60 52 70 52 C80 52 92 55 92 68 L96 102 L44 102 Z" fill="none" stroke="#1C2024" stroke-width="4"/>
      <path d="M60 54 L70 78 L80 54" fill="none" stroke="#1C2024" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Team Member Left -->
      <circle cx="28" cy="42" r="11" fill="none" stroke="#1C2024" stroke-width="3.5"/>
      <path d="M18 40 C18 30 38 30 38 40 Z" fill="#1C2024"/>
      <path d="M10 80 C10 65 20 62 28 62 C36 62 46 65 46 80 L46 102 L10 102 Z" fill="none" stroke="#1C2024" stroke-width="3.5"/>

      <!-- Team Member Right -->
      <circle cx="112" cy="42" r="11" fill="none" stroke="#1C2024" stroke-width="3.5"/>
      <path d="M102 40 C102 30 122 30 122 40 Z" fill="#1C2024"/>
      <path d="M94 80 C94 65 104 62 112 62 C120 62 130 65 130 80 L130 102 L94 102 Z" fill="none" stroke="#1C2024" stroke-width="3.5"/>
    </svg>`),
    ['team', 'leader', 'business', 'people', 'handdrawn', 'colleagues', 'sketch'],
    30, 24
  ),
  baseGraphic(
    'Handdrawn Sketch Star',
    'Handdrawn',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 10 L62 38 L92 38 L68 56 L77 86 L50 68 L23 86 L32 56 L8 38 L38 38 Z" fill="none" stroke="#1C2024" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>`),
    ['star', 'sketch', 'doodle', 'rating', 'handdrawn'],
    22, 22
  ),
  baseGraphic(
    'Handdrawn Idea Lightbulb',
    'Handdrawn',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110">
      <path d="M50 15 C32 15 25 30 25 45 C25 58 35 68 38 78 L62 78 C65 68 75 58 75 45 C75 30 68 15 50 15 Z" fill="none" stroke="#1C2024" stroke-width="4.5"/>
      <line x1="42" y1="86" x2="58" y2="86" stroke="#1C2024" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="45" y1="94" x2="55" y2="94" stroke="#1C2024" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M50 45 L50 65 M44 55 L56 55" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="50" y1="5" x2="50" y2="0" stroke="#1C2024" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="18" y1="20" x2="10" y2="15" stroke="#1C2024" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="82" y1="20" x2="90" y2="15" stroke="#1C2024" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`),
    ['lightbulb', 'idea', 'innovation', 'handdrawn', 'think'],
    22, 25
  ),
  baseGraphic(
    'Handdrawn Direction Arrow',
    'Handdrawn',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70">
      <path d="M15 45 C35 25 70 20 95 38" fill="none" stroke="#1C2024" stroke-width="5" stroke-linecap="round"/>
      <path d="M80 25 L98 38 L82 52" fill="none" stroke="#1C2024" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`),
    ['arrow', 'pointer', 'swoosh', 'handdrawn', 'direction'],
    26, 16
  ),
];

// ---------------------------------------------------------------------------
// 7. THE 8 CURATED COLLECTIONS (Screenshots 4 & 5)
// ---------------------------------------------------------------------------

// Collection 1: Colourful Team Badges (40 graphics)
export const TEAM_BADGE_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'Congrats Rainbow Arch',
    'Team Badges',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 80">
      <path d="M20 70 A50 50 0 0 1 120 70" stroke="#EC4899" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M32 70 A38 38 0 0 1 108 70" stroke="#F472B6" stroke-width="8" fill="none" stroke-linecap="round"/>
      <text x="70" y="44" font-family="sans-serif" font-weight="900" font-size="13" fill="#831843" text-anchor="middle" letter-spacing="1">CONGRATS</text>
    </svg>`),
    ['congrats', 'rainbow', 'badge', 'team', 'award'],
    28, 16
  ),
  baseGraphic(
    'Welcome to the Team Badge',
    'Team Badges',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70">
      <rect x="5" y="10" width="150" height="50" rx="25" fill="#FDF2F8" stroke="#DB2777" stroke-width="3"/>
      <text x="80" y="34" font-family="sans-serif" font-weight="900" font-size="11" fill="#BE185D" text-anchor="middle">WELCOME TO</text>
      <text x="80" y="48" font-family="sans-serif" font-weight="900" font-size="11" fill="#BE185D" text-anchor="middle">THE TEAM</text>
    </svg>`),
    ['welcome', 'team', 'badge', 'onboarding', 'pink'],
    32, 14
  ),
  baseGraphic(
    'Presentation Badge',
    'Team Badges',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 60">
      <rect x="5" y="8" width="140" height="44" rx="22" fill="#10B981"/>
      <text x="75" y="36" font-family="sans-serif" font-weight="900" font-size="13" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">PRESENTATION</text>
    </svg>`),
    ['presentation', 'meeting', 'badge', 'green', 'corporate'],
    30, 12
  ),
  baseGraphic(
    'Party Popper Cone',
    'Team Badges',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <polygon points="50,90 20,35 80,35" fill="#2563EB" stroke="#1D4ED8" stroke-width="2"/>
      <path d="M20 35 Q50 20 80 35" fill="#3B82F6"/>
      <circle cx="35" cy="18" r="4" fill="#F59E0B"/>
      <circle cx="55" cy="10" r="5" fill="#EC4899"/>
      <circle cx="70" cy="20" r="3.5" fill="#10B981"/>
    </svg>`),
    ['party', 'popper', 'celebrate', 'blue', 'cone'],
    20, 20
  ),
  baseGraphic(
    'Handshake Partnership',
    'Team Badges',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
      <path d="M20 35 L45 55 L58 45 L42 28 Z" fill="#2563EB"/>
      <path d="M100 35 L75 55 L62 45 L78 28 Z" fill="#1D4ED8"/>
      <path d="M45 55 C52 62 68 62 75 55 L65 42 L55 42 Z" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2"/>
    </svg>`),
    ['handshake', 'partnership', 'teamwork', 'deal', 'agreement'],
    24, 18
  ),
  baseGraphic(
    'WFH Work From Home Badge',
    'Team Badges',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="#FFFBEB" stroke="#D97706" stroke-width="4"/>
      <path d="M30 52 L50 34 L70 52 L65 52 L65 72 L35 72 L35 52 Z" fill="#F59E0B"/>
      <text x="50" y="84" font-family="sans-serif" font-weight="900" font-size="12" fill="#B45309" text-anchor="middle">WFH</text>
    </svg>`),
    ['wfh', 'home', 'remote', 'work', 'orange', 'badge'],
    20, 20
  ),
];

// Collection 2: Bold Foliage (93 graphics)
export const BOLD_FOLIAGE_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'Indigo Fan Palm Leaves',
    'Bold Foliage',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100">
      <path d="M60 85 L20 40 C35 30 45 40 60 85 Z" fill="#1E3A8A"/>
      <path d="M60 85 L35 25 C50 20 55 35 60 85 Z" fill="#2563EB"/>
      <path d="M60 85 L60 15 C68 25 68 45 60 85 Z" fill="#3B82F6"/>
      <path d="M60 85 L85 25 C70 20 65 35 60 85 Z" fill="#2563EB"/>
      <path d="M60 85 L100 40 C85 30 75 40 60 85 Z" fill="#1E3A8A"/>
    </svg>`),
    ['foliage', 'palm', 'indigo', 'botanical', 'leaves'],
    25, 22
  ),
  baseGraphic(
    'Pink Heart Monstera Leaf',
    'Bold Foliage',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110">
      <path d="M50 100 C20 70 10 40 25 20 C40 5 50 25 50 25 C50 25 60 5 75 20 C90 40 80 70 50 100 Z" fill="#FB7185"/>
      <path d="M35 45 C20 48 25 55 38 52 Z" fill="#FFF1F2"/>
      <path d="M65 45 C80 48 75 55 62 52 Z" fill="#FFF1F2"/>
      <path d="M38 65 C28 70 32 75 42 70 Z" fill="#FFF1F2"/>
      <path d="M62 65 C72 70 68 75 58 70 Z" fill="#FFF1F2"/>
    </svg>`),
    ['monstera', 'pink', 'heart', 'tropical', 'leaf'],
    22, 24
  ),
  baseGraphic(
    'Purple Bamboo Fronds',
    'Bold Foliage',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 100">
      <path d="M55 90 C30 70 10 45 15 25 C25 25 40 50 55 90 Z" fill="#4C1D95"/>
      <path d="M55 90 C45 60 40 30 55 10 C65 20 62 55 55 90 Z" fill="#6D28D9"/>
      <path d="M55 90 C70 70 95 45 90 25 C80 25 65 50 55 90 Z" fill="#4C1D95"/>
    </svg>`),
    ['bamboo', 'purple', 'fronds', 'foliage', 'botanical'],
    24, 22
  ),
  baseGraphic(
    'Blue Midnight Pine',
    'Bold Foliage',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
      <line x1="40" y1="115" x2="40" y2="15" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>
      <path d="M40 70 L20 85 M40 60 L18 72 M40 50 L22 58 M40 40 L25 45" stroke="#0F172A" stroke-width="3" stroke-linecap="round"/>
      <path d="M40 70 L60 85 M40 60 L62 72 M40 50 L58 58 M40 40 L55 45" stroke="#0F172A" stroke-width="3" stroke-linecap="round"/>
    </svg>`),
    ['pine', 'tree', 'botanical', 'evergreen', 'blue'],
    18, 26
  ),
  baseGraphic(
    'Rose Pink Fern Leaf',
    'Bold Foliage',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 120">
      <line x1="45" y1="115" x2="45" y2="10" stroke="#BE123C" stroke-width="3"/>
      <path d="M45 25 C30 20 30 30 45 35 Z" fill="#F43F5E"/>
      <path d="M45 25 C60 20 60 30 45 35 Z" fill="#F43F5E"/>
      <path d="M45 45 C25 40 25 52 45 57 Z" fill="#FB7185"/>
      <path d="M45 45 C65 40 65 52 45 57 Z" fill="#FB7185"/>
      <path d="M45 68 C20 62 20 76 45 82 Z" fill="#FDA4AF"/>
      <path d="M45 68 C70 62 70 76 45 82 Z" fill="#FDA4AF"/>
    </svg>`),
    ['fern', 'pink', 'botanical', 'foliage', 'garden'],
    20, 26
  ),
  baseGraphic(
    'Navy Eucalyptus Sprig',
    'Bold Foliage',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
      <line x1="40" y1="115" x2="40" y2="10" stroke="#0F172A" stroke-width="3"/>
      <circle cx="30" cy="30" r="10" fill="#1E293B"/>
      <circle cx="50" cy="45" r="11" fill="#334155"/>
      <circle cx="30" cy="62" r="12" fill="#1E293B"/>
      <circle cx="50" cy="80" r="12" fill="#334155"/>
      <circle cx="40" cy="18" r="8" fill="#1E293B"/>
    </svg>`),
    ['eucalyptus', 'navy', 'sprig', 'leaves', 'botany'],
    18, 26
  ),
];

// Collection 3: Zodiac Symbols (58 graphics)
export const ZODIAC_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'Aquarius Water Bearer',
    'Zodiac Symbols',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110">
      <path d="M40 25 C30 25 25 35 30 50 L40 75 C45 82 55 82 60 75 L70 50 C75 35 70 25 60 25 Z" fill="#60A5FA" stroke="#1D4ED8" stroke-width="3"/>
      <path d="M25 40 C10 45 10 65 25 70" fill="none" stroke="#1D4ED8" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 78 Q45 95 35 105 M55 78 Q60 95 68 105" stroke="#3B82F6" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    </svg>`),
    ['aquarius', 'zodiac', 'water', 'astrology', 'horoscope'],
    22, 24
  ),
  baseGraphic(
    'Capricorn Mountain Goat',
    'Zodiac Symbols',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110">
      <rect x="10" y="20" width="80" height="70" rx="12" fill="#FEF08A"/>
      <path d="M45 40 C45 20 20 15 20 35 M55 40 C55 20 80 15 80 35" stroke="#D97706" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M40 50 C40 35 60 35 60 50 L65 75 C65 85 55 90 50 90 C45 90 35 85 35 75 Z" fill="#2563EB"/>
      <circle cx="44" cy="55" r="2" fill="#FFFFFF"/>
      <circle cx="56" cy="55" r="2" fill="#FFFFFF"/>
    </svg>`),
    ['capricorn', 'zodiac', 'goat', 'astrology', 'horoscope'],
    22, 24
  ),
  baseGraphic(
    'Scorpio Golden Scorpion',
    'Zodiac Symbols',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110">
      <rect x="15" y="15" width="70" height="80" rx="10" fill="#FEF9C3"/>
      <ellipse cx="50" cy="65" rx="14" ry="18" fill="#CA8A04"/>
      <path d="M50 50 C50 30 75 25 70 40 C68 45 60 42 65 38" stroke="#A16207" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M40 60 L22 45 M38 68 L18 62 M40 76 L20 78" stroke="#CA8A04" stroke-width="3" stroke-linecap="round"/>
      <path d="M60 60 L78 45 M62 68 L82 62 M60 76 L80 78" stroke="#CA8A04" stroke-width="3" stroke-linecap="round"/>
    </svg>`),
    ['scorpio', 'zodiac', 'scorpion', 'astrology', 'horoscope'],
    22, 24
  ),
  baseGraphic(
    'Taurus Celestial Bull',
    'Zodiac Symbols',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110">
      <circle cx="50" cy="55" r="40" fill="#FEF08A"/>
      <path d="M30 45 C15 20 40 15 45 35 M70 45 C85 20 60 15 55 35" stroke="#D97706" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M35 48 C35 38 65 38 65 48 L65 72 C65 80 58 84 50 84 C42 84 35 80 35 72 Z" fill="#059669"/>
      <circle cx="43" cy="55" r="2.5" fill="#FFFFFF"/>
      <circle cx="57" cy="55" r="2.5" fill="#FFFFFF"/>
    </svg>`),
    ['taurus', 'zodiac', 'bull', 'astrology', 'horoscope'],
    22, 24
  ),
  baseGraphic(
    'Virgo Celestial Maiden',
    'Zodiac Symbols',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110">
      <circle cx="50" cy="55" r="40" fill="#FCE7F3"/>
      <circle cx="50" cy="48" r="16" fill="#FBCFE8"/>
      <path d="M34 45 C30 30 70 30 66 45 C75 55 85 70 80 85 C65 78 50 85 45 80 C35 78 25 65 34 45 Z" fill="#312E81"/>
    </svg>`),
    ['virgo', 'zodiac', 'maiden', 'astrology', 'horoscope'],
    22, 24
  ),
  baseGraphic(
    'Aries Golden Horned Ram',
    'Zodiac Symbols',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110">
      <circle cx="50" cy="55" r="40" fill="#FEF9C3"/>
      <path d="M48 45 C40 25 15 28 20 45 C25 55 35 50 35 45" stroke="#D97706" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M52 45 C60 25 85 28 80 45 C75 55 65 50 65 45" stroke="#D97706" stroke-width="5" fill="none" stroke-linecap="round"/>
      <polygon points="50,42 40,78 60,78" fill="#DC2626"/>
    </svg>`),
    ['aries', 'zodiac', 'ram', 'astrology', 'horoscope'],
    22, 24
  ),
];

// Collection 4: Simple Drawn Objects (68 graphics)
export const DRAWN_OBJECT_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'Minimalist Milk Bottle Outline',
    'Simple Drawn Objects',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 110">
      <path d="M22 10 L38 10 L38 22 C45 30 48 38 48 50 L48 95 C48 100 44 104 38 104 L22 104 C16 104 12 100 12 95 L12 50 C12 38 15 30 22 22 Z" fill="none" stroke="#D97706" stroke-width="2.5"/>
    </svg>`),
    ['bottle', 'milk', 'minimalist', 'contour', 'drawn'],
    14, 25
  ),
  baseGraphic(
    'Ceramic Bowl Contour',
    'Simple Drawn Objects',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 60">
      <path d="M10 20 C15 50 95 50 100 20 Z" fill="none" stroke="#D97706" stroke-width="2.5"/>
      <ellipse cx="55" cy="20" rx="45" ry="8" fill="none" stroke="#D97706" stroke-width="2.5"/>
    </svg>`),
    ['bowl', 'ceramic', 'kitchen', 'minimalist', 'contour'],
    25, 14
  ),
  baseGraphic(
    'Terracotta Peach Sun Disc',
    'Simple Drawn Objects',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r="38" fill="#FCA5A5"/>
      <path d="M45 7 A38 38 0 0 1 83 45 Z" fill="#F97316"/>
    </svg>`),
    ['disc', 'sun', 'peach', 'terracotta', 'abstract', 'minimal'],
    20, 20
  ),
  baseGraphic(
    'Red Ceramic Pitcher Jug',
    'Simple Drawn Objects',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 110">
      <path d="M28 20 L58 20 L62 95 C62 100 58 102 50 102 L30 102 C22 102 18 100 18 95 L22 35 Z" fill="#DC2626"/>
      <path d="M60 30 C75 35 75 70 60 75" fill="none" stroke="#DC2626" stroke-width="6" stroke-linecap="round"/>
      <line x1="26" y1="20" x2="16" y2="28" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>
    </svg>`),
    ['pitcher', 'jug', 'vase', 'ceramic', 'red', 'drawn'],
    18, 25
  ),
  baseGraphic(
    'Slate Blue Geometric Trapezoid',
    'Simple Drawn Objects',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
      <polygon points="30,15 85,35 75,85 10,85" fill="#94A3B8"/>
    </svg>`),
    ['trapezoid', 'polygon', 'geometry', 'slate', 'modernist'],
    20, 20
  ),
  baseGraphic(
    'Coral Palm Leaf Branch',
    'Simple Drawn Objects',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 120">
      <line x1="15" y1="110" x2="60" y2="15" stroke="#E11D48" stroke-width="3.5"/>
      <path d="M25 85 L10 75 M32 70 L15 60 M40 55 L22 45 M48 40 L30 30" stroke="#E11D48" stroke-width="5" stroke-linecap="round"/>
      <path d="M30 95 L45 85 M38 80 L52 70 M45 65 L60 55 M52 50 L68 40" stroke="#E11D48" stroke-width="5" stroke-linecap="round"/>
    </svg>`),
    ['coral', 'branch', 'fern', 'foliage', 'drawn'],
    16, 26
  ),
];

// Collection 5: Camping Rustic Drawings (50 graphics)
export const CAMPING_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'Rustic Wooden Signpost',
    'Camping Rustic',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 120">
      <rect x="40" y="10" width="10" height="105" fill="#78350F" rx="2"/>
      <polygon points="15,25 70,25 80,35 70,45 15,45" fill="#D97706"/>
      <polygon points="75,55 20,55 10,65 20,75 75,75" fill="#B45309"/>
    </svg>`),
    ['signpost', 'trail', 'wood', 'camping', 'rustic', 'direction'],
    20, 26
  ),
  baseGraphic(
    'Campfire Burning Logs',
    'Camping Rustic',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line x1="20" y1="85" x2="80" y2="70" stroke="#451A03" stroke-width="8" stroke-linecap="round"/>
      <line x1="20" y1="70" x2="80" y2="85" stroke="#78350F" stroke-width="8" stroke-linecap="round"/>
      <path d="M50 20 C35 45 40 65 50 75 C60 65 65 45 50 20 Z" fill="#EA580C"/>
      <path d="M50 40 C42 55 45 65 50 72 C55 65 58 55 50 40 Z" fill="#FBBF24"/>
    </svg>`),
    ['campfire', 'fire', 'logs', 'camping', 'outdoor', 'rustic'],
    22, 22
  ),
  baseGraphic(
    'Folded Adventure Map',
    'Camping Rustic',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90">
      <polygon points="15,20 40,10 40,80 15,90" fill="#F59E0B"/>
      <polygon points="40,10 65,20 65,90 40,80" fill="#D97706"/>
      <polygon points="65,20 90,10 90,80 65,90" fill="#FBBF24"/>
      <path d="M25 45 Q40 50 50 40 Q65 30 75 50" stroke="#78350F" stroke-width="2.5" stroke-dasharray="3,3" fill="none"/>
    </svg>`),
    ['map', 'adventure', 'travel', 'folded', 'camping', 'guide'],
    24, 20
  ),
  baseGraphic(
    'Crescent Moon with Sparkle Stars',
    'Camping Rustic',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
      <path d="M60 20 C35 25 30 65 60 78 C30 78 20 45 45 15 C52 15 58 18 60 20 Z" fill="#451A03"/>
      <polygon points="70,18 73,25 80,25 74,30 76,38 70,32 64,38 66,30 60,25 67,25" fill="#F59E0B"/>
      <circle cx="25" cy="25" r="2.5" fill="#F59E0B"/>
      <circle cx="75" cy="65" r="2.5" fill="#F59E0B"/>
    </svg>`),
    ['moon', 'night', 'stars', 'camping', 'sky', 'rustic'],
    20, 20
  ),
  baseGraphic(
    'Golden Autumn Maple Leaf',
    'Camping Rustic',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 15 L58 35 L75 30 L68 48 L88 55 L70 68 L75 85 L55 78 L50 95 L45 78 L25 85 L30 68 L12 55 L32 48 L25 30 L42 35 Z" fill="#D97706"/>
      <line x1="50" y1="95" x2="50" y2="35" stroke="#78350F" stroke-width="2.5"/>
    </svg>`),
    ['maple', 'leaf', 'autumn', 'camping', 'nature', 'gold'],
    22, 22
  ),
  baseGraphic(
    'Geometric Mountain Peaks',
    'Camping Rustic',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">
      <polygon points="50,15 15,75 85,75" fill="#D97706"/>
      <polygon points="85,30 60,75 110,75" fill="#B45309"/>
      <polygon points="50,15 38,36 50,32 62,36" fill="#FEF3C7"/>
      <polygon points="85,30 76,46 85,42 94,46" fill="#FEF3C7"/>
    </svg>`),
    ['mountains', 'peaks', 'alps', 'camping', 'summit', 'hiking'],
    26, 18
  ),
];

// Collection 6: Sketchy Flowers (73 graphics)
export const SKETCHY_FLOWER_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'Vibrant Orange Botanical Tulip',
    'Sketchy Flowers',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
      <line x1="40" y1="115" x2="40" y2="45" stroke="#4D7C0F" stroke-width="4"/>
      <path d="M40 70 C20 60 20 90 40 85" fill="#65A30D"/>
      <path d="M25 45 C15 20 40 10 40 45 C40 10 65 20 55 45 C65 25 50 15 40 25 C30 15 15 25 25 45 Z" fill="#F97316"/>
    </svg>`),
    ['tulip', 'flower', 'orange', 'botanical', 'spring', 'flora'],
    18, 26
  ),
  baseGraphic(
    'Sketchy Rose Blossom',
    'Sketchy Flowers',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="32" fill="#F472B6" opacity="0.8"/>
      <path d="M40 38 Q50 25 62 35 Q70 48 60 62 Q45 70 35 58 Q30 45 42 42 Q55 42 55 52 Q52 58 46 56" fill="none" stroke="#BE185D" stroke-width="3" stroke-linecap="round"/>
      <path d="M30 70 Q15 85 28 92 Q42 85 30 70 Z" fill="#84CC16"/>
      <path d="M70 70 Q85 85 72 92 Q58 85 70 70 Z" fill="#84CC16"/>
    </svg>`),
    ['rose', 'sketch', 'flower', 'pink', 'garden', 'bloom'],
    22, 22
  ),
  baseGraphic(
    'Magenta Carnation Bloom',
    'Sketchy Flowers',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 20 L55 35 L68 25 L65 40 L80 38 L72 50 L85 58 L70 65 L78 78 L62 75 L62 90 L50 80 L38 90 L38 75 L22 78 L30 65 L15 58 L28 50 L20 38 L35 40 L32 25 L45 35 Z" fill="#DB2777"/>
      <circle cx="50" cy="55" r="16" fill="#9D174D"/>
    </svg>`),
    ['carnation', 'flower', 'magenta', 'petal', 'flora'],
    22, 22
  ),
  baseGraphic(
    'Peach Magnolia Blossom',
    'Sketchy Flowers',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 110">
      <line x1="45" y1="105" x2="45" y2="55" stroke="#78350F" stroke-width="4"/>
      <path d="M45 55 C20 40 25 20 45 10 C65 20 70 40 45 55 Z" fill="#FB923C"/>
      <path d="M30 50 C10 40 15 25 30 20" fill="#FED7AA"/>
      <path d="M60 50 C80 40 75 25 60 20" fill="#FED7AA"/>
    </svg>`),
    ['magnolia', 'flower', 'peach', 'botanical', 'spring'],
    20, 24
  ),
  baseGraphic(
    'Dried Protea Botanical',
    'Sketchy Flowers',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 110">
      <line x1="45" y1="105" x2="45" y2="40" stroke="#78350F" stroke-width="4"/>
      <path d="M45 40 L25 15 M45 40 L35 10 M45 40 L45 8 M45 40 L55 10 M45 40 L65 15" stroke="#B45309" stroke-width="4" stroke-linecap="round"/>
      <polygon points="30,45 60,45 55,75 35,75" fill="#D97706"/>
    </svg>`),
    ['protea', 'dried', 'flower', 'botanical', 'rustic'],
    20, 24
  ),
  baseGraphic(
    'Pink Wild Tiger Lily',
    'Sketchy Flowers',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110">
      <line x1="50" y1="105" x2="50" y2="50" stroke="#4D7C0F" stroke-width="4"/>
      <path d="M50 50 C25 30 15 10 35 15 C45 25 50 40 50 50 Z" fill="#EC4899"/>
      <path d="M50 50 C75 30 85 10 65 15 C55 25 50 40 50 50 Z" fill="#EC4899"/>
      <path d="M50 50 C40 25 50 5 55 5 C60 15 55 35 50 50 Z" fill="#F472B6"/>
      <line x1="50" y1="50" x2="38" y2="25" stroke="#831843" stroke-width="2"/>
      <line x1="50" y1="50" x2="62" y2="25" stroke="#831843" stroke-width="2"/>
    </svg>`),
    ['lily', 'flower', 'pink', 'tigerlily', 'flora'],
    22, 24
  ),
];

// Collection 7: Handdrawn Animals (150 graphics)
export const HANDDRAWN_ANIMAL_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'Golden Spotted Cheetah',
    'Handdrawn Animals',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80">
      <path d="M25 35 C25 25 35 25 45 30 L95 32 C115 32 135 45 135 60 L130 75 L120 75 L120 55 L95 55 L92 75 L82 75 L85 55 L45 55 L42 75 L32 75 L35 48 L20 48 Z" fill="#F59E0B"/>
      <circle cx="140" cy="35" r="10" fill="#F59E0B"/>
      <circle cx="142" cy="33" r="2" fill="#000000"/>
      <circle cx="60" cy="40" r="2" fill="#78350F"/>
      <circle cx="75" cy="45" r="2" fill="#78350F"/>
      <circle cx="90" cy="40" r="2" fill="#78350F"/>
      <circle cx="105" cy="45" r="2" fill="#78350F"/>
      <path d="M25 40 C15 45 10 30 5 40" stroke="#F59E0B" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>`),
    ['cheetah', 'leopard', 'cat', 'safari', 'animal', 'handdrawn'],
    32, 16
  ),
  baseGraphic(
    'Sky Blue Gentle Elephant',
    'Handdrawn Animals',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100">
      <path d="M30 45 C30 25 70 20 95 35 L95 50 C110 50 115 70 110 85 L102 85 C105 72 100 62 92 65 L92 90 L80 90 L80 65 L55 65 L55 90 L42 90 L45 55 L30 55 Z" fill="#60A5FA"/>
      <circle cx="75" cy="42" r="12" fill="#3B82F6"/>
      <circle cx="85" cy="40" r="2" fill="#000000"/>
    </svg>`),
    ['elephant', 'safari', 'blue', 'animal', 'gentle', 'handdrawn'],
    28, 20
  ),
  baseGraphic(
    'Resting Striped Tiger',
    'Handdrawn Animals',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 80">
      <path d="M25 50 C25 35 45 35 70 38 C95 38 115 45 125 55 L125 70 L25 70 Z" fill="#EA580C"/>
      <circle cx="120" cy="42" r="12" fill="#EA580C"/>
      <circle cx="124" cy="40" r="2" fill="#000000"/>
      <path d="M50 40 L52 55 M65 40 L67 55 M80 40 L82 55 M95 42 L97 55" stroke="#451A03" stroke-width="3" stroke-linecap="round"/>
    </svg>`),
    ['tiger', 'wildcat', 'stripes', 'animal', 'resting', 'handdrawn'],
    28, 16
  ),
  baseGraphic(
    'Textured Teal Crocodile',
    'Handdrawn Animals',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60">
      <path d="M15 35 L40 25 L80 25 L120 30 L150 25 L145 42 L120 42 L80 45 L40 45 Z" fill="#14B8A6"/>
      <circle cx="130" cy="28" r="2.5" fill="#000000"/>
      <polygon points="50,22 55,25 60,22 65,25 70,22" fill="#0F766E"/>
      <polygon points="80,22 85,25 90,22 95,25 100,22" fill="#0F766E"/>
    </svg>`),
    ['crocodile', 'alligator', 'teal', 'reptile', 'animal', 'handdrawn'],
    32, 12
  ),
  baseGraphic(
    'Smiling Sloth on Branch',
    'Handdrawn Animals',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100">
      <line x1="10" y1="20" x2="110" y2="60" stroke="#78350F" stroke-width="7" stroke-linecap="round"/>
      <path d="M45 40 C45 65 75 65 75 40 Z" fill="#F97316"/>
      <circle cx="50" cy="65" r="14" fill="#FED7AA"/>
      <circle cx="46" cy="63" r="2" fill="#000000"/>
      <circle cx="54" cy="63" r="2" fill="#000000"/>
      <path d="M47 70 Q50 74 53 70" stroke="#000000" stroke-width="1.5" fill="none"/>
    </svg>`),
    ['sloth', 'branch', 'cute', 'smiling', 'animal', 'handdrawn'],
    24, 20
  ),
  baseGraphic(
    'Violet Spotted Snow Leopard',
    'Handdrawn Animals',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 80">
      <path d="M30 45 C30 30 50 30 75 32 L110 35 C125 38 135 50 130 65 L125 75 L115 75 L115 55 L85 55 L85 75 L75 75 L75 55 L45 55 L42 75 L32 75 Z" fill="#DDD6FE"/>
      <circle cx="130" cy="40" r="10" fill="#DDD6FE"/>
      <circle cx="132" cy="38" r="2" fill="#4C1D95"/>
      <circle cx="65" cy="42" r="2.5" fill="#7C3AED"/>
      <circle cx="85" cy="42" r="2.5" fill="#7C3AED"/>
      <circle cx="100" cy="45" r="2.5" fill="#7C3AED"/>
    </svg>`),
    ['snowleopard', 'leopard', 'violet', 'cat', 'animal', 'handdrawn'],
    30, 16
  ),
];

// Collection 8: Handdrawn Love (128 graphics)
export const HANDDRAWN_LOVE_ITEMS: ElementLibraryItem[] = [
  baseGraphic(
    'One in a Melon Watermelon',
    'Handdrawn Love',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90">
      <path d="M15 35 A50 50 0 0 0 115 35 Z" fill="#15803D"/>
      <path d="M22 35 A42 42 0 0 0 108 35 Z" fill="#F43F5E"/>
      <circle cx="45" cy="45" r="2" fill="#000000"/>
      <circle cx="65" cy="52" r="2" fill="#000000"/>
      <circle cx="85" cy="45" r="2" fill="#000000"/>
      <text x="65" y="22" font-family="sans-serif" font-weight="900" font-size="9" fill="#BE123C" text-anchor="middle">YOU ARE ONE IN A MELON!</text>
    </svg>`),
    ['watermelon', 'melon', 'love', 'pun', 'sweet', 'handdrawn'],
    28, 20
  ),
  baseGraphic(
    'Companion Legs Doodle',
    'Handdrawn Love',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="25" y="15" width="20" height="25" rx="6" fill="#FCE7F3"/>
      <rect x="55" y="15" width="20" height="25" rx="6" fill="#FCE7F3"/>
      <line x1="30" y1="40" x2="30" y2="85" stroke="#F472B6" stroke-width="4" stroke-linecap="round"/>
      <line x1="40" y1="40" x2="40" y2="85" stroke="#F472B6" stroke-width="4" stroke-linecap="round"/>
      <line x1="60" y1="40" x2="60" y2="85" stroke="#F472B6" stroke-width="4" stroke-linecap="round"/>
      <line x1="70" y1="40" x2="70" y2="85" stroke="#F472B6" stroke-width="4" stroke-linecap="round"/>
    </svg>`),
    ['legs', 'love', 'together', 'friends', 'companion', 'handdrawn'],
    20, 20
  ),
  baseGraphic(
    'I Loaf You Toast Slices',
    'Handdrawn Love',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 90">
      <rect x="20" y="28" width="38" height="42" rx="10" fill="#FDE68A" stroke="#D97706" stroke-width="2"/>
      <circle cx="32" cy="45" r="2" fill="#000000"/>
      <circle cx="44" cy="45" r="2" fill="#000000"/>
      <path d="M36 52 Q38 56 40 52" stroke="#000000" stroke-width="1.5" fill="none"/>

      <rect x="72" y="28" width="38" height="42" rx="10" fill="#FDE68A" stroke="#D97706" stroke-width="2"/>
      <circle cx="84" cy="45" r="2" fill="#000000"/>
      <circle cx="96" cy="45" r="2" fill="#000000"/>
      <path d="M88 52 Q90 56 92 52" stroke="#000000" stroke-width="1.5" fill="none"/>

      <text x="65" y="18" font-family="sans-serif" font-weight="900" font-size="10" fill="#B45309" text-anchor="middle">I LOAF YOU</text>
    </svg>`),
    ['toast', 'bread', 'loaf', 'love', 'couple', 'pun'],
    28, 20
  ),
  baseGraphic(
    'I Lava You Smiling Volcano',
    'Handdrawn Love',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <polygon points="50,35 20,85 80,85" fill="#EAB308"/>
      <circle cx="44" cy="65" r="2" fill="#000000"/>
      <circle cx="56" cy="65" r="2" fill="#000000"/>
      <path d="M47 72 Q50 76 53 72" stroke="#000000" stroke-width="1.5" fill="none"/>
      <path d="M50 30 C50 18 45 10 50 5 C55 10 50 18 50 30 Z" fill="#EF4444"/>
      <circle cx="50" cy="12" r="3" fill="#F43F5E"/>
      <text x="50" y="96" font-family="sans-serif" font-weight="900" font-size="9" fill="#854D0E" text-anchor="middle">I LAVA YOU</text>
    </svg>`),
    ['volcano', 'lava', 'love', 'cute', 'pun', 'handdrawn'],
    22, 22
  ),
  baseGraphic(
    'Vintage Floral Tea Cup',
    'Handdrawn Love',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 90">
      <path d="M25 35 C25 65 75 65 75 35 Z" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
      <path d="M75 40 C90 42 90 55 75 58" fill="none" stroke="#D97706" stroke-width="3"/>
      <ellipse cx="50" cy="72" rx="35" ry="6" fill="#FDE68A" stroke="#D97706" stroke-width="2"/>
      <circle cx="50" cy="48" r="4" fill="#3B82F6"/>
    </svg>`),
    ['teacup', 'tea', 'coffee', 'vintage', 'floral', 'love'],
    24, 20
  ),
  baseGraphic(
    'Botanical Flower Espresso Mug',
    'Handdrawn Love',
    encSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90">
      <rect x="25" y="25" width="45" height="45" rx="6" fill="#FDF2F8" stroke="#DB2777" stroke-width="2"/>
      <path d="M70 32 C82 35 82 55 70 58" fill="none" stroke="#DB2777" stroke-width="3"/>
      <circle cx="47" cy="47" r="6" fill="#E11D48"/>
      <circle cx="47" cy="47" r="2.5" fill="#FEF08A"/>
    </svg>`),
    ['mug', 'espresso', 'flower', 'coffee', 'botanical', 'love'],
    22, 20
  ),
];

// ---------------------------------------------------------------------------
// 8. COLLECTION METADATA (For the 2x4 Grid matching Screenshots 4 & 5)
// ---------------------------------------------------------------------------
export interface CanvaCollectionMeta {
  id: string;
  title: string;
  itemCount: number;
  category: ElementCategory;
  items: ElementLibraryItem[];
  previewSvgIcons: string[];
}

export const CANVA_COLLECTIONS: CanvaCollectionMeta[] = [
  {
    id: 'col-team-badges',
    title: 'Colourful Team Badges',
    itemCount: 40,
    category: 'Team Badges',
    items: TEAM_BADGE_ITEMS,
    previewSvgIcons: TEAM_BADGE_ITEMS.map((item) => item.create()[0].imgSrc || ''),
  },
  {
    id: 'col-bold-foliage',
    title: 'Bold Foliage',
    itemCount: 93,
    category: 'Bold Foliage',
    items: BOLD_FOLIAGE_ITEMS,
    previewSvgIcons: BOLD_FOLIAGE_ITEMS.map((item) => item.create()[0].imgSrc || ''),
  },
  {
    id: 'col-zodiac-symbols',
    title: 'Zodiac Symbols',
    itemCount: 58,
    category: 'Zodiac Symbols',
    items: ZODIAC_ITEMS,
    previewSvgIcons: ZODIAC_ITEMS.map((item) => item.create()[0].imgSrc || ''),
  },
  {
    id: 'col-simple-drawn-objects',
    title: 'Simple Drawn Objects',
    itemCount: 68,
    category: 'Simple Drawn Objects',
    items: DRAWN_OBJECT_ITEMS,
    previewSvgIcons: DRAWN_OBJECT_ITEMS.map((item) => item.create()[0].imgSrc || ''),
  },
  {
    id: 'col-camping-rustic',
    title: 'Camping Rustic Drawings',
    itemCount: 50,
    category: 'Camping Rustic',
    items: CAMPING_ITEMS,
    previewSvgIcons: CAMPING_ITEMS.map((item) => item.create()[0].imgSrc || ''),
  },
  {
    id: 'col-sketchy-flowers',
    title: 'Sketchy Flowers',
    itemCount: 73,
    category: 'Sketchy Flowers',
    items: SKETCHY_FLOWER_ITEMS,
    previewSvgIcons: SKETCHY_FLOWER_ITEMS.map((item) => item.create()[0].imgSrc || ''),
  },
  {
    id: 'col-handdrawn-animals',
    title: 'Handdrawn Animals',
    itemCount: 150,
    category: 'Handdrawn Animals',
    items: HANDDRAWN_ANIMAL_ITEMS,
    previewSvgIcons: HANDDRAWN_ANIMAL_ITEMS.map((item) => item.create()[0].imgSrc || ''),
  },
  {
    id: 'col-handdrawn-love',
    title: 'Handdrawn Love',
    itemCount: 128,
    category: 'Handdrawn Love',
    items: HANDDRAWN_LOVE_ITEMS,
    previewSvgIcons: HANDDRAWN_LOVE_ITEMS.map((item) => item.create()[0].imgSrc || ''),
  },
];

// All combined Canva graphics for searching and filtering
export const ALL_CANVA_GRAPHIC_ITEMS: ElementLibraryItem[] = [
  ...MAGIC_RECOMMENDATION_ITEMS,
  ...FEATURED_ITEMS,
  ...GRADIENT_ITEMS,
  ...ANIMATION_ITEMS,
  ...SOCIAL_MEDIA_ITEMS,
  ...HANDDRAWN_ITEMS,
  ...TEAM_BADGE_ITEMS,
  ...BOLD_FOLIAGE_ITEMS,
  ...ZODIAC_ITEMS,
  ...DRAWN_OBJECT_ITEMS,
  ...CAMPING_ITEMS,
  ...SKETCHY_FLOWER_ITEMS,
  ...HANDDRAWN_ANIMAL_ITEMS,
  ...HANDDRAWN_LOVE_ITEMS,
];
