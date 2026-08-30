import type { ImageOptions, PageDraft, Palette, Typeset } from './builders';
import { bg, bgGradient, box, ellipse, img, page, rule, triangle, txt } from './builders';
import { DEFAULT_PAGE_SIZE, PAGE_MARGIN } from '../constants';

/**
 * Reusable page compositions.
 *
 * Each factory returns fully structured, individually editable elements — text
 * stays text, frames stay image slots, rules stay shapes. Templates combine
 * different layouts with their own palette, typeset and copy, which is what
 * makes twenty templates read as twenty distinct visual directions rather than
 * one layout recoloured.
 */

const W = DEFAULT_PAGE_SIZE.width; // 794
const H = DEFAULT_PAGE_SIZE.height; // 1123
const M = PAGE_MARGIN; // 56
const CW = W - M * 2; // 682 — content width

interface Base {
  p: Palette;
  t: Typeset;
}

/** Image placeholder derived from the palette, so empty frames still compose. */
const frame = (p: Palette, o: Omit<ImageOptions, 'from' | 'to'>) =>
  img({ ...o, from: p.frameFrom, to: p.frameTo });

/* ─────────────────────────── COVERS ─────────────────────────── */

export interface CoverContent {
  masthead: string;
  kicker: string;
  headline: string;
  sub?: string;
  issue: string;
  footer?: string;
}

/** Full-bleed photo cover: tinted image, masthead top, headline anchored low. */
export function coverFullBleed({ p, t, c }: Base & { c: CoverContent }): PageDraft {
  return page('Cover', bg(p.bg), [
    frame(p, { x: 0, y: 0, w: W, h: H, label: 'Cover photo', tint: p.deep, tintOpacity: 0.32 }),
    box({ x: 0, y: H - 560, w: W, h: 560, fill: p.deep, opacity: 0.55 }),
    txt({ x: M, y: 64, w: CW, h: 120, text: c.masthead, font: t.display, size: 92, weight: t.displayWeight, color: p.onAccent, ls: t.displayTracking, lh: 0.92, upper: true }),
    rule({ x: M, y: 196, w: CW, h: 2, color: p.accent }),
    txt({ x: M, y: 210, w: CW, h: 24, text: c.issue, font: t.kicker, size: 13, weight: t.kickerWeight, color: p.onAccent, ls: 4, upper: true, opacity: 0.85 }),
    txt({ x: M, y: H - 400, w: CW - 60, h: 40, text: c.kicker, font: t.kicker, size: 14, weight: t.kickerWeight, color: p.accent, ls: 4.5, upper: true }),
    txt({ x: M, y: H - 352, w: CW - 40, h: 190, text: c.headline, font: t.display, size: 62, weight: t.displayWeight, color: p.onAccent, ls: t.displayTracking, lh: 1.02 }),
    txt({ x: M, y: H - 148, w: CW - 120, h: 60, text: c.sub ?? '', font: t.body, size: 16, color: p.onAccent, lh: 1.6, opacity: 0.85 }),
    txt({ x: M, y: H - 76, w: CW, h: 22, text: c.footer ?? '', font: t.kicker, size: 11, weight: t.kickerWeight, color: p.onAccent, ls: 3, upper: true, opacity: 0.7 }),
  ]);
}

/** Photo above, solid colour block below carrying the type. */
export function coverSplit({ p, t, c }: Base & { c: CoverContent }): PageDraft {
  return page('Cover', bg(p.bg), [
    frame(p, { x: 0, y: 0, w: W, h: 690, label: 'Cover photo' }),
    box({ x: 0, y: 690, w: W, h: H - 690, fill: p.accent }),
    box({ x: M, y: 40, w: 232, h: 56, fill: p.accent }),
    txt({ x: M + 16, y: 52, w: 200, h: 32, text: c.issue, font: t.kicker, size: 12, weight: t.kickerWeight, color: p.onAccent, ls: 4, upper: true }),
    txt({ x: M, y: 742, w: CW, h: 110, text: c.masthead, font: t.display, size: 80, weight: t.displayWeight, color: p.onAccent, ls: t.displayTracking, lh: 0.95, upper: true }),
    rule({ x: M, y: 866, w: 120, h: 3, color: p.onAccent }),
    txt({ x: M, y: 894, w: CW - 80, h: 30, text: c.kicker, font: t.kicker, size: 13, weight: t.kickerWeight, color: p.onAccent, ls: 4, upper: true, opacity: 0.8 }),
    txt({ x: M, y: 930, w: CW - 60, h: 120, text: c.headline, font: t.body, size: 26, weight: 500, color: p.onAccent, lh: 1.3 }),
    txt({ x: M, y: H - 66, w: CW, h: 22, text: c.footer ?? '', font: t.kicker, size: 11, weight: t.kickerWeight, color: p.onAccent, ls: 3, upper: true, opacity: 0.7 }),
  ]);
}

/** Typography-first cover: oversized masthead, rules, single tall frame. */
export function coverTypeLed({ p, t, c }: Base & { c: CoverContent }): PageDraft {
  return page('Cover', bg(p.bg), [
    rule({ x: M, y: 128, w: CW, h: 1, color: p.line }),
    txt({ x: M, y: 88, w: CW / 2, h: 26, text: c.issue, font: t.kicker, size: 12, weight: t.kickerWeight, color: p.muted, ls: 4, upper: true }),
    txt({ x: M + CW / 2, y: 88, w: CW / 2, h: 26, text: c.kicker, font: t.kicker, size: 12, weight: t.kickerWeight, color: p.accent, ls: 4, upper: true, align: 'right' }),
    txt({ x: M, y: 168, w: CW, h: 230, text: c.masthead, font: t.display, size: 122, weight: t.displayWeight, color: p.ink, ls: t.displayTracking - 2, lh: 0.86, upper: true }),
    rule({ x: M, y: 430, w: CW, h: 4, color: p.accent }),
    txt({ x: M, y: 460, w: 300, h: 200, text: c.headline, font: t.display, size: 34, weight: t.displayWeight, color: p.ink, lh: 1.15 }),
    txt({ x: M, y: 690, w: 300, h: 120, text: c.sub ?? '', font: t.body, size: 14, color: p.muted, lh: 1.75 }),
    frame(p, { x: 388, y: 460, w: 350, h: 520, label: 'Feature photo' }),
    rule({ x: M, y: H - 108, w: CW, h: 1, color: p.line }),
    txt({ x: M, y: H - 88, w: CW, h: 24, text: c.footer ?? '', font: t.kicker, size: 11, weight: t.kickerWeight, color: p.muted, ls: 3, upper: true }),
  ]);
}

/** Centred, framed cover with a classic border and stacked type. */
export function coverFramed({ p, t, c }: Base & { c: CoverContent }): PageDraft {
  return page('Cover', bg(p.bg), [
    box({ x: 32, y: 32, w: W - 64, h: H - 64, stroke: p.accent, sw: 2 }),
    txt({ x: M, y: 84, w: CW, h: 26, text: c.issue, font: t.kicker, size: 12, weight: t.kickerWeight, color: p.muted, ls: 5, upper: true, align: 'center' }),
    txt({ x: M, y: 138, w: CW, h: 120, text: c.masthead, font: t.display, size: 76, weight: t.displayWeight, color: p.ink, ls: t.displayTracking, lh: 1, upper: true, align: 'center' }),
    rule({ x: W / 2 - 40, y: 274, w: 80, h: 2, color: p.accent }),
    txt({ x: M, y: 296, w: CW, h: 28, text: c.kicker, font: t.kicker, size: 12, weight: t.kickerWeight, color: p.accent, ls: 4.5, upper: true, align: 'center' }),
    frame(p, { x: 116, y: 350, w: W - 232, h: 470, label: 'Cover photo' }),
    txt({ x: 116, y: 856, w: W - 232, h: 96, text: c.headline, font: t.display, size: 36, weight: t.displayWeight, color: p.ink, lh: 1.25, align: 'center' }),
    txt({ x: 156, y: 966, w: W - 312, h: 70, text: c.sub ?? '', font: t.body, size: 14, color: p.muted, lh: 1.7, align: 'center' }),
    txt({ x: M, y: H - 92, w: CW, h: 22, text: c.footer ?? '', font: t.kicker, size: 10, weight: t.kickerWeight, color: p.muted, ls: 3, upper: true, align: 'center' }),
  ]);
}

/** Airy minimal cover — small type, generous whitespace, offset frame. */
export function coverMinimal({ p, t, c }: Base & { c: CoverContent }): PageDraft {
  return page('Cover', bg(p.bg), [
    txt({ x: M, y: M, w: 260, h: 24, text: c.issue, font: t.kicker, size: 11, weight: t.kickerWeight, color: p.muted, ls: 4, upper: true }),
    txt({ x: W - M - 200, y: M, w: 200, h: 24, text: c.kicker, font: t.kicker, size: 11, weight: t.kickerWeight, color: p.accent, ls: 4, upper: true, align: 'right' }),
    txt({ x: M, y: 232, w: CW, h: 120, text: c.masthead, font: t.display, size: 68, weight: t.displayWeight, color: p.ink, ls: t.displayTracking, lh: 1 }),
    txt({ x: M, y: 366, w: 420, h: 78, text: c.headline, font: t.body, size: 18, color: p.muted, lh: 1.7 }),
    box({ x: M, y: 560, w: 140, h: 140, fill: p.accent }),
    frame(p, { x: 236, y: 500, w: 502, h: 470, label: 'Cover photo' }),
    txt({ x: M, y: H - 92, w: 300, h: 24, text: c.footer ?? '', font: t.kicker, size: 10, weight: t.kickerWeight, color: p.muted, ls: 3, upper: true }),
  ]);
}

/* ─────────────────────────── CONTENTS ─────────────────────────── */

export interface ContentsEntry {
  no: string;
  title: string;
  note: string;
}

/** Numbered contents list with a tall accompanying frame. */
export function contentsList({ p, t, title, entries }: Base & { title: string; entries: ContentsEntry[] }): PageDraft {
  const rows = entries.slice(0, 6);
  return page('Contents', bg(p.bg), [
    txt({ x: M, y: M + 12, w: 400, h: 70, text: title, font: t.display, size: 46, weight: t.displayWeight, color: p.ink, ls: t.displayTracking, upper: true }),
    rule({ x: M, y: 150, w: 360, h: 2, color: p.accent }),
    frame(p, { x: 452, y: M, w: 286, h: 400, label: 'Issue photo' }),
    ...rows.flatMap((entry, i) => {
      const y = 200 + i * 132;
      return [
        txt({ x: M, y, w: 60, h: 44, text: entry.no, font: t.display, size: 30, weight: t.displayWeight, color: p.accent }),
        txt({ x: M + 74, y: y + 2, w: 300, h: 40, text: entry.title, font: t.display, size: 22, weight: t.displayWeight, color: p.ink, lh: 1.2 }),
        txt({ x: M + 74, y: y + 46, w: 300, h: 52, text: entry.note, font: t.body, size: 13, color: p.muted, lh: 1.6 }),
        rule({ x: M, y: y + 108, w: 374, h: 1, color: p.line }),
      ];
    }),
    txt({ x: 452, y: 486, w: 286, h: 200, text: 'In this issue we look at the ideas, people and places shaping the season ahead.', font: t.body, size: 14, color: p.muted, lh: 1.8 }),
    rule({ x: 452, y: 700, w: 286, h: 1, color: p.line }),
    txt({ x: 452, y: 720, w: 286, h: 24, text: 'Editor selection', font: t.kicker, size: 11, weight: t.kickerWeight, color: p.accent, ls: 3.5, upper: true }),
    txt({ x: M, y: H - 72, w: CW, h: 22, text: '02', font: t.kicker, size: 12, weight: t.kickerWeight, color: p.muted, ls: 2, align: 'right' }),
  ]);
}

/** Contents as a 2x2 image grid with numbered captions. */
export function contentsGrid({ p, t, title, entries }: Base & { title: string; entries: ContentsEntry[] }): PageDraft {
  const cells = entries.slice(0, 4);
  const cw = (CW - 24) / 2;
  const ch = 320;
  return page('Contents', bg(p.bg), [
    txt({ x: M, y: M, w: 500, h: 60, text: title, font: t.display, size: 40, weight: t.displayWeight, color: p.ink, ls: t.displayTracking, upper: true }),
    txt({ x: M, y: 122, w: 460, h: 46, text: 'Everything inside this issue, at a glance.', font: t.body, size: 15, color: p.muted, lh: 1.6 }),
    rule({ x: M, y: 192, w: CW, h: 1, color: p.line }),
    ...cells.flatMap((entry, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = M + col * (cw + 24);
      const y = 224 + row * (ch + 96);
      return [
        frame(p, { x, y, w: cw, h: ch - 84, label: entry.title }),
        txt({ x, y: y + ch - 72, w: 44, h: 30, text: entry.no, font: t.display, size: 20, weight: t.displayWeight, color: p.accent }),
        txt({ x: x + 48, y: y + ch - 70, w: cw - 48, h: 28, text: entry.title, font: t.display, size: 18, weight: t.displayWeight, color: p.ink }),
        txt({ x: x + 48, y: y + ch - 40, w: cw - 48, h: 34, text: entry.note, font: t.body, size: 12, color: p.muted, lh: 1.5 }),
      ];
    }),
    txt({ x: M, y: H - 72, w: CW, h: 22, text: '02', font: t.kicker, size: 12, weight: t.kickerWeight, color: p.muted, ls: 2, align: 'right' }),
  ]);
}

/* ─────────────────────────── EDITORIAL ─────────────────────────── */

/** Opening letter / introduction with drop cap and portrait. */
export function introLetter({
  p,
  t,
  kicker,
  title,
  dropCap,
  paragraphs,
  signature,
  quote,
}: Base & {
  kicker: string;
  title: string;
  dropCap: string;
  paragraphs: string[];
  signature: string;
  quote: string;
}): PageDraft {
  return page('Introduction', bg(p.bg), [
    txt({ x: M, y: M, w: 400, h: 24, text: kicker, font: t.kicker, size: 12, weight: t.kickerWeight, color: p.accent, ls: 4, upper: true }),
    txt({ x: M, y: 100, w: 520, h: 130, text: title, font: t.display, size: 52, weight: t.displayWeight, color: p.ink, ls: t.displayTracking, lh: 1.05 }),
    rule({ x: M, y: 258, w: 90, h: 3, color: p.accent }),
    txt({ x: M, y: 292, w: 96, h: 110, text: dropCap, font: t.display, size: 108, weight: t.displayWeight, color: p.accent, lh: 0.9 }),
    txt({ x: M + 104, y: 300, w: CW - 104, h: 96, text: paragraphs[0] ?? '', font: t.body, size: 15, color: p.ink, lh: 1.8 }),
    txt({ x: M, y: 424, w: 330, h: 250, text: paragraphs[1] ?? '', font: t.body, size: 14, color: p.muted, lh: 1.85, align: 'justify' }),
    txt({ x: M + 352, y: 424, w: 330, h: 250, text: paragraphs[2] ?? '', font: t.body, size: 14, color: p.muted, lh: 1.85, align: 'justify' }),
    frame(p, { x: M, y: 700, w: 330, h: 300, label: 'Editor portrait' }),
    box({ x: M + 352, y: 700, w: 330, h: 300, fill: p.accent, opacity: 0.08 }),
    txt({ x: M + 384, y: 740, w: 266, h: 150, text: quote, font: t.display, size: 24, weight: t.displayWeight, color: p.ink, lh: 1.4, italic: true }),
    txt({ x: M + 384, y: 906, w: 266, h: 24, text: signature, font: t.kicker, size: 11, weight: t.kickerWeight, color: p.accent, ls: 3, upper: true }),
    txt({ x: M, y: H - 72, w: CW, h: 22, text: '03', font: t.kicker, size: 12, weight: t.kickerWeight, color: p.muted, ls: 2, align: 'right' }),
  ]);
}

/** Classic feature: hero frame, headline, standfirst, two body columns. */
export function featureTwoColumn({
  p,
  t,
  kicker,
  headline,
  standfirst,
  columns,
  caption,
}: Base & { kicker: string; headline: string; standfirst: string; columns: [string, string]; caption: string }): PageDraft {
  return page('Feature', bg(p.bg), [
    frame(p, { x: 0, y: 0, w: W, h: 430, label: 'Feature photo' }),
    txt({ x: M, y: 452, w: 200, h: 24, text: kicker, font: t.kicker, size: 12, weight: t.kickerWeight, color: p.accent, ls: 4, upper: true }),
    txt({ x: M, y: 490, w: CW, h: 140, text: headline, font: t.display, size: 48, weight: t.displayWeight, color: p.ink, ls: t.displayTracking, lh: 1.08 }),
    txt({ x: M, y: 644, w: CW - 80, h: 74, text: standfirst, font: t.body, size: 18, weight: 500, color: p.muted, lh: 1.6 }),
    rule({ x: M, y: 740, w: CW, h: 1, color: p.line }),
    txt({ x: M, y: 764, w: 330, h: 250, text: columns[0], font: t.body, size: 13.5, color: p.ink, lh: 1.85, align: 'justify' }),
    txt({ x: M + 352, y: 764, w: 330, h: 250, text: columns[1], font: t.body, size: 13.5, color: p.ink, lh: 1.85, align: 'justify' }),
    txt({ x: M, y: H - 78, w: 480, h: 22, text: caption, font: t.kicker, size: 10, weight: t.kickerWeight, color: p.muted, ls: 2.5, upper: true }),
    txt({ x: W - M - 60, y: H - 78, w: 60, h: 22, text: '04', font: t.kicker, size: 12, weight: t.kickerWeight, color: p.muted, ls: 2, align: 'right' }),
  ]);
}

/** Asymmetric editorial spread — sidebar column beside a tall frame. */
export function sidebarFeature({
  p,
  t,
  kicker,
  headline,
  body,
  facts,
}: Base & { kicker: string; headline: string; body: string; facts: { label: string; value: string }[] }): PageDraft {
  const rightW = W - 340 - M;
  const halfW = (rightW - 20) / 2;
  return page('Editorial', bg(p.bg), [
    box({ x: 0, y: 0, w: 300, h: H, fill: p.accent, opacity: 0.07 }),
    txt({ x: M, y: M, w: 200, h: 24, text: kicker, font: t.kicker, size: 12, weight: t.kickerWeight, color: p.accent, ls: 4, upper: true }),
    txt({ x: M, y: 96, w: 208, h: 220, text: headline, font: t.display, size: 34, weight: t.displayWeight, color: p.ink, lh: 1.12 }),
    rule({ x: M, y: 332, w: 60, h: 2, color: p.accent }),
    txt({ x: M, y: 356, w: 208, h: 300, text: body, font: t.body, size: 13, color: p.muted, lh: 1.85 }),
    ...facts.slice(0, 3).flatMap((f, i) => {
      const y = 700 + i * 108;
      return [
        txt({ x: M, y, w: 208, h: 44, text: f.value, font: t.display, size: 30, weight: t.displayWeight, color: p.ink }),
        txt({ x: M, y: y + 48, w: 208, h: 22, text: f.label, font: t.kicker, size: 10, weight: t.kickerWeight, color: p.muted, ls: 2.5, upper: true }),
        rule({ x: M, y: y + 84, w: 208, h: 1, color: p.line }),
      ];
    }),
    frame(p, { x: 340, y: M, w: rightW, h: 640, label: 'Editorial photo' }),
    frame(p, { x: 340, y: 728, w: halfW, h: 280, label: 'Detail' }),
    frame(p, { x: 340 + halfW + 20, y: 728, w: halfW, h: 280, label: 'Detail' }),
    txt({ x: W - M - 60, y: H - 72, w: 60, h: 22, text: '05', font: t.kicker, size: 12, weight: t.kickerWeight, color: p.muted, ls: 2, align: 'right' }),
  ]);
}

/** Full-bleed image page with an overlaid caption band. */
export function imageLedFull({
  p,
  t,
  overline,
  title,
  caption,
}: Base & { overline: string; title: string; caption: string }): PageDraft {
  return page('Image page', bg(p.deep), [
    frame(p, { x: 0, y: 0, w: W, h: H, label: 'Full page photo', tint: p.deep, tintOpacity: 0.18 }),
    box({ x: 0, y: H - 250, w: W, h: 250, fill: p.deep, opacity: 0.7 }),
    txt({ x: M, y: H - 210, w: 240, h: 24, text: overline, font: t.kicker, size: 11, weight: t.kickerWeight, color: p.accent, ls: 4, upper: true }),
    txt({ x: M, y: H - 172, w: CW - 100, h: 60, text: title, font: t.display, size: 40, weight: t.displayWeight, color: p.onAccent, ls: t.displayTracking, lh: 1.1 }),
    txt({ x: M, y: H - 92, w: CW - 140, h: 46, text: caption, font: t.body, size: 13, color: p.onAccent, lh: 1.6, opacity: 0.8 }),
  ]);
}

/** Centred pull-quote page on a solid accent field. */
export function quotePage({
  p,
  t,
  quote,
  name,
  role,
}: Base & { quote: string; name: string; role: string }): PageDraft {
  return page('Quote', bg(p.accent), [
    txt({ x: 120, y: 200, w: W - 240, h: 120, text: '“', font: t.display, size: 140, weight: t.displayWeight, color: p.onAccent, align: 'center', opacity: 0.35, lh: 1 }),
    txt({ x: 110, y: 350, w: W - 220, h: 300, text: quote, font: t.display, size: 40, weight: t.displayWeight, color: p.onAccent, align: 'center', lh: 1.35 }),
    rule({ x: W / 2 - 30, y: 706, w: 60, h: 2, color: p.onAccent, opacity: 0.6 }),
    txt({ x: 160, y: 736, w: W - 320, h: 30, text: name, font: t.kicker, size: 14, weight: t.kickerWeight, color: p.onAccent, ls: 3.5, upper: true, align: 'center' }),
    txt({ x: 160, y: 774, w: W - 320, h: 26, text: role, font: t.body, size: 13, color: p.onAccent, align: 'center', opacity: 0.75 }),
    ellipse({ x: W / 2 - 60, y: 860, w: 120, h: 120, fill: p.onAccent, opacity: 0.12 }),
    frame(p, { x: W / 2 - 46, y: 874, w: 92, h: 92, radius: 46, label: 'Portrait' }),
  ]);
}

/* ─────────────────────────── GALLERY / PRODUCT ─────────────────────────── */

/** Mosaic gallery: one wide frame plus a four-up grid. */
export function galleryMosaic({
  p,
  t,
  title,
  intro,
  captions,
}: Base & { title: string; intro: string; captions: string[] }): PageDraft {
  const half = (CW - 20) / 2;
  return page('Gallery', bg(p.bg), [
    txt({ x: M, y: M, w: 400, h: 50, text: title, font: t.display, size: 36, weight: t.displayWeight, color: p.ink, ls: t.displayTracking, upper: true }),
    txt({ x: M, y: 112, w: 440, h: 44, text: intro, font: t.body, size: 13, color: p.muted, lh: 1.6 }),
    frame(p, { x: M, y: 176, w: CW, h: 330, label: captions[0] ?? 'Gallery image' }),
    txt({ x: M, y: 516, w: CW, h: 20, text: captions[0] ?? '', font: t.kicker, size: 10, weight: t.kickerWeight, color: p.muted, ls: 2.5, upper: true }),
    frame(p, { x: M, y: 556, w: half, h: 240, label: captions[1] ?? 'Gallery image' }),
    frame(p, { x: M + half + 20, y: 556, w: half, h: 240, label: captions[2] ?? 'Gallery image' }),
    txt({ x: M, y: 806, w: half, h: 20, text: captions[1] ?? '', font: t.kicker, size: 10, weight: t.kickerWeight, color: p.muted, ls: 2.5, upper: true }),
    txt({ x: M + half + 20, y: 806, w: half, h: 20, text: captions[2] ?? '', font: t.kicker, size: 10, weight: t.kickerWeight, color: p.muted, ls: 2.5, upper: true }),
    frame(p, { x: M, y: 846, w: half, h: 190, label: captions[3] ?? 'Gallery image' }),
    frame(p, { x: M + half + 20, y: 846, w: half, h: 190, label: captions[4] ?? 'Gallery image' }),
    txt({ x: W - M - 60, y: H - 62, w: 60, h: 22, text: '06', font: t.kicker, size: 12, weight: t.kickerWeight, color: p.muted, ls: 2, align: 'right' }),
  ]);
}

export interface ProductItem {
  name: string;
  price: string;
  note: string;
}

/** Catalogue page: three products with names, prices and notes. */
export function productShowcase({
  p,
  t,
  title,
  intro,
  items,
  footnote,
}: Base & { title: string; intro: string; items: ProductItem[]; footnote: string }): PageDraft {
  const cards = items.slice(0, 3);
  const cardW = (CW - 40) / 3;
  return page('Products', bg(p.bg), [
    txt({ x: M, y: M, w: 460, h: 50, text: title, font: t.display, size: 36, weight: t.displayWeight, color: p.ink, ls: t.displayTracking }),
    txt({ x: M, y: 112, w: 480, h: 44, text: intro, font: t.body, size: 13, color: p.muted, lh: 1.6 }),
    rule({ x: M, y: 178, w: CW, h: 1, color: p.line }),
    ...cards.flatMap((item, i) => {
      const x = M + i * (cardW + 20);
      return [
        box({ x, y: 210, w: cardW, h: 300, fill: p.accent, opacity: 0.06 }),
        frame(p, { x: x + 16, y: 226, w: cardW - 32, h: 268, label: item.name }),
        txt({ x, y: 528, w: cardW, h: 46, text: item.name, font: t.display, size: 19, weight: t.displayWeight, color: p.ink, lh: 1.2 }),
        txt({ x, y: 582, w: cardW, h: 26, text: item.price, font: t.kicker, size: 13, weight: t.kickerWeight, color: p.accent, ls: 2, upper: true }),
        txt({ x, y: 616, w: cardW, h: 90, text: item.note, font: t.body, size: 12, color: p.muted, lh: 1.65 }),
      ];
    }),
    rule({ x: M, y: 742, w: CW, h: 1, color: p.line }),
    frame(p, { x: M, y: 774, w: CW, h: 232, label: 'Lifestyle photo' }),
    txt({ x: M, y: H - 72, w: 460, h: 22, text: footnote, font: t.kicker, size: 10, weight: t.kickerWeight, color: p.muted, ls: 2.5, upper: true }),
    txt({ x: W - M - 60, y: H - 72, w: 60, h: 22, text: '07', font: t.kicker, size: 12, weight: t.kickerWeight, color: p.muted, ls: 2, align: 'right' }),
  ]);
}

/** Big-number statistics band with supporting copy. */
export function statsPage({
  p,
  t,
  kicker,
  title,
  intro,
  stats,
  source,
}: Base & {
  kicker: string;
  title: string;
  intro: string;
  stats: { value: string; label: string }[];
  source: string;
}): PageDraft {
  const rows = stats.slice(0, 4);
  const colW = (CW - 24) / 2;
  return page('Numbers', bg(p.bg), [
    box({ x: 0, y: 0, w: W, h: 300, fill: p.accent }),
    txt({ x: M, y: 80, w: 300, h: 24, text: kicker, font: t.kicker, size: 12, weight: t.kickerWeight, color: p.onAccent, ls: 4, upper: true, opacity: 0.85 }),
    txt({ x: M, y: 122, w: CW - 60, h: 120, text: title, font: t.display, size: 44, weight: t.displayWeight, color: p.onAccent, ls: t.displayTracking, lh: 1.1 }),
    txt({ x: M, y: 340, w: 440, h: 80, text: intro, font: t.body, size: 15, color: p.muted, lh: 1.75 }),
    ...rows.flatMap((s, i) => {
      const x = M + (i % 2) * (colW + 24);
      const y = 470 + Math.floor(i / 2) * 200;
      return [
        txt({ x, y, w: colW, h: 90, text: s.value, font: t.display, size: 64, weight: t.displayWeight, color: p.ink, ls: t.displayTracking, lh: 1 }),
        txt({ x, y: y + 100, w: colW - 30, h: 40, text: s.label, font: t.kicker, size: 11, weight: t.kickerWeight, color: p.muted, ls: 2.5, upper: true, lh: 1.5 }),
        rule({ x, y: y + 156, w: colW - 24, h: 1, color: p.line }),
      ];
    }),
    txt({ x: M, y: H - 72, w: 400, h: 22, text: source, font: t.kicker, size: 10, weight: t.kickerWeight, color: p.muted, ls: 2, upper: true }),
  ]);
}

/** Four-up profile grid for teams, contributors or featured people. */
export function profileGrid({
  p,
  t,
  title,
  intro,
  people,
}: Base & { title: string; intro: string; people: { name: string; role: string }[] }): PageDraft {
  const cells = people.slice(0, 4);
  const cw = (CW - 24) / 2;
  return page('Profiles', bg(p.bg), [
    txt({ x: M, y: M, w: 460, h: 50, text: title, font: t.display, size: 36, weight: t.displayWeight, color: p.ink, ls: t.displayTracking }),
    txt({ x: M, y: 112, w: 460, h: 44, text: intro, font: t.body, size: 13, color: p.muted, lh: 1.6 }),
    rule({ x: M, y: 176, w: CW, h: 1, color: p.line }),
    ...cells.flatMap((person, i) => {
      const x = M + (i % 2) * (cw + 24);
      const y = 210 + Math.floor(i / 2) * 424;
      return [
        frame(p, { x, y, w: cw, h: 300, label: person.name }),
        txt({ x, y: y + 320, w: cw, h: 30, text: person.name, font: t.display, size: 20, weight: t.displayWeight, color: p.ink }),
        txt({ x, y: y + 354, w: cw, h: 24, text: person.role, font: t.kicker, size: 10, weight: t.kickerWeight, color: p.accent, ls: 2.5, upper: true }),
      ];
    }),
    txt({ x: W - M - 60, y: H - 62, w: 60, h: 22, text: '08', font: t.kicker, size: 12, weight: t.kickerWeight, color: p.muted, ls: 2, align: 'right' }),
  ]);
}

/** Vertical timeline / process page. */
export function timelinePage({
  p,
  t,
  kicker,
  title,
  entries,
}: Base & { kicker: string; title: string; entries: { year: string; title: string; text: string }[] }): PageDraft {
  const rows = entries.slice(0, 4);
  return page('Timeline', bg(p.bg), [
    txt({ x: M, y: M, w: 300, h: 24, text: kicker, font: t.kicker, size: 12, weight: t.kickerWeight, color: p.accent, ls: 4, upper: true }),
    txt({ x: M, y: 96, w: 520, h: 110, text: title, font: t.display, size: 42, weight: t.displayWeight, color: p.ink, ls: t.displayTracking, lh: 1.1 }),
    rule({ x: M + 6, y: 240, w: 2, h: 700, color: p.accent, opacity: 0.35 }),
    ...rows.flatMap((entry, i) => {
      const y = 260 + i * 200;
      return [
        ellipse({ x: M, y, w: 14, h: 14, fill: p.accent }),
        txt({ x: M + 44, y: y - 6, w: 120, h: 34, text: entry.year, font: t.display, size: 24, weight: t.displayWeight, color: p.accent }),
        txt({ x: M + 44, y: y + 32, w: 400, h: 34, text: entry.title, font: t.display, size: 22, weight: t.displayWeight, color: p.ink }),
        txt({ x: M + 44, y: y + 74, w: 420, h: 80, text: entry.text, font: t.body, size: 13, color: p.muted, lh: 1.75 }),
      ];
    }),
    frame(p, { x: 540, y: 260, w: 198, h: 680, label: 'Supporting photo' }),
    txt({ x: W - M - 60, y: H - 72, w: 60, h: 22, text: '09', font: t.kicker, size: 12, weight: t.kickerWeight, color: p.muted, ls: 2, align: 'right' }),
  ]);
}

/** Closing / back cover with wordmark, contact lines and small frames. */
export function backCover({
  p,
  t,
  wordmark,
  tagline,
  lines,
  website,
}: Base & { wordmark: string; tagline: string; lines: string[]; website: string }): PageDraft {
  return page('Back cover', bgGradient(p.accent, p.deep, 165), [
    triangle({ x: W - 260, y: 0, w: 260, h: 260, fill: p.onAccent, opacity: 0.08 }),
    txt({ x: M, y: 180, w: CW, h: 120, text: wordmark, font: t.display, size: 64, weight: t.displayWeight, color: p.onAccent, ls: t.displayTracking, lh: 1, upper: true, align: 'center' }),
    rule({ x: W / 2 - 40, y: 322, w: 80, h: 2, color: p.onAccent, opacity: 0.7 }),
    txt({ x: 120, y: 352, w: W - 240, h: 60, text: tagline, font: t.body, size: 16, color: p.onAccent, lh: 1.7, align: 'center', opacity: 0.85 }),
    frame(p, { x: 180, y: 460, w: 200, h: 200, label: 'Detail', tint: p.deep, tintOpacity: 0.1 }),
    frame(p, { x: 412, y: 460, w: 200, h: 200, label: 'Detail', tint: p.deep, tintOpacity: 0.1 }),
    ...lines.slice(0, 3).map((line, i) =>
      txt({ x: 160, y: 720 + i * 36, w: W - 320, h: 28, text: line, font: t.body, size: 13, color: p.onAccent, align: 'center', opacity: 0.8 }),
    ),
    rule({ x: 160, y: 880, w: W - 320, h: 1, color: p.onAccent, opacity: 0.3 }),
    txt({ x: 160, y: 910, w: W - 320, h: 30, text: website, font: t.kicker, size: 13, weight: t.kickerWeight, color: p.onAccent, ls: 4, upper: true, align: 'center' }),
  ]);
}
