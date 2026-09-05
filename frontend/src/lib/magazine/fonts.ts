export interface FontDef {
  key: string;
  label: string;
  family: string;
}

export const FONTS: FontDef[] = [
  { key: 'serif', label: 'Elegant Serif', family: '"Playfair Display", serif' },
  { key: 'display', label: 'Bold Display', family: '"Archivo Black", sans-serif' },
  { key: 'typewriter', label: 'Typewriter', family: '"Special Elite", monospace' },
  { key: 'vintage', label: 'Vintage Serif', family: '"Cutive", serif' },
  { key: 'hand', label: 'Handwritten', family: '"Caveat", cursive' },
  { key: 'marker', label: 'Marker', family: '"Permanent Marker", cursive' },
  { key: 'pixel', label: 'Pixel', family: '"Press Start 2P", monospace' },
  { key: 'condensed', label: 'Condensed', family: '"Oswald", sans-serif' },
];

export function fontFamilyFor(key: string): string {
  return FONTS.find((f) => f.key === key)?.family || 'sans-serif';
}
