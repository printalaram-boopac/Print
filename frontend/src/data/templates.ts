import { asset } from '@/lib/asset';

export interface Template {
  id: number;
  slug?: string;
  src: string;
  title: string;
  category: string;
  price: number;
  coverType: 'money_cover' | 'pocket_money_cover';
  images?: string[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getTemplateSlug(t: Template): string {
  return t.slug || slugify(t.title);
}

export const TEMPLATES: Template[] = [
  { id: 1, src: asset('card-1.jpeg'), title: 'Royal Swaminarayan Heritage Plum', category: 'Sacred Tradition', price: 15, coverType: 'money_cover' },
  { id: 2, src: asset('card-2.jpeg'), title: 'Royal Peacock Pavilion Sky Blue', category: 'Wedding', price: 15, coverType: 'money_cover' },
  { id: 3, src: asset('card-3.jpeg'), title: 'Eternal Adiyogi Moonlit Grace', category: 'Sacred Tradition', price: 18, coverType: 'money_cover', images: [asset('card-3.jpeg'), asset('IMG_4822.PNG')] },
  { id: 4, src: asset('card-4.jpeg'), title: 'Golden Jharokha Peacock Palace', category: 'Wedding', price: 18, coverType: 'money_cover' },
  { id: 5, src: asset('card-5.jpeg'), title: 'Divine Ganesha Crimson Blessing', category: 'Sacred Tradition', price: 15, coverType: 'money_cover' },
  { id: 6, src: asset('card-6.jpeg'), title: 'Royal Emerald Floral Arch', category: 'Wedding', price: 15, coverType: 'money_cover' },
  { id: 7, src: asset('card-7.jpeg'), title: 'Royal Elephant & Peacock Ivory', category: 'Wedding', price: 18, coverType: 'money_cover' },
  { id: 8, src: asset('file_00000000e4cc81fa9a8a14a7daf6ee37.png'), title: 'Sacred Kamdhenu & Lotus Green', category: 'Sacred Tradition', price: 18, coverType: 'money_cover', images: [asset('file_00000000e4cc81fa9a8a14a7daf6ee37.png'), asset('card-8.jpeg'), asset('0a2dec8f-ce56-4c49-9fef-3cc6616aaa0d.png')] },
  { id: 9, src: asset('card-9.jpeg'), title: 'Divine Shrinathji Lotus Sapphire', category: 'Sacred Tradition', price: 15, coverType: 'money_cover' },
  { id: 10, src: asset('card-10.jpeg'), title: 'Royal Peacock Garden Blush', category: 'Wedding', price: 15, coverType: 'money_cover' },
  { id: 11, src: asset('card-11.jpeg'), title: 'Golden Ganesha & Peacock Saffron', category: 'Wedding', price: 15, coverType: 'pocket_money_cover' },
  { id: 12, src: asset('card-12.jpeg'), title: 'Mint Temple Jharokha Peacock', category: 'Wedding', price: 18, coverType: 'money_cover' },
  { id: 13, src: asset('card-13.jpeg'), title: 'Royal Palace Garden Magenta', category: 'Wedding', price: 15, coverType: 'pocket_money_cover' },
  { id: 14, src: asset('card-14.jpeg'), title: 'Royal Lilac Lotus Bloom', category: 'Wedding', price: 15, coverType: 'money_cover' },
  { id: 15, src: asset('card-15.jpeg'), title: 'Divine Swaminarayan Bal Swaroop Teal', category: 'Sacred Tradition', price: 15, coverType: 'pocket_money_cover' },
  { id: 16, src: asset('card-16.jpeg'), title: 'Rosewater Palace Floral Garden', category: 'Wedding', price: 15, coverType: 'money_cover' },
  { id: 17, src: asset('card-17.jpeg'), title: 'Royal Amber Fort Elephants', category: 'Wedding', price: 15, coverType: 'pocket_money_cover' },
  { id: 18, src: asset('card-18.jpeg'), title: 'Royal Swan & Lotus Pink', category: 'Wedding', price: 15, coverType: 'money_cover' },
  { id: 19, src: asset('card-19.jpeg'), title: 'Grand Elephant Procession Royal Brown', category: 'Wedding', price: 18, coverType: 'pocket_money_cover' },
  { id: 20, src: asset('card-20.jpeg'), title: 'Coral Willow Garden Elegance', category: 'Wedding', price: 18, coverType: 'money_cover' },
  { id: 21, src: asset('card-21.jpeg'), title: 'Regal Peacock Fountain Maroon', category: 'Wedding', price: 15, coverType: 'pocket_money_cover' },
  { id: 22, src: asset('card-22.jpeg'), title: 'Royal Swaminarayan Saffron Grace', category: 'Sacred Tradition', price: 15, coverType: 'money_cover' },
  { id: 24, src: asset('10ff2bb0-5d2d-4969-9de5-b0bfd7279d1b.png'), title: 'Divine Ghanshyam Maharaj Maroon Grace', category: 'Sacred Tradition', price: 15, coverType: 'money_cover' },
  { id: 26, src: asset('e9460334-dd27-4cea-aee8-9f3635e025f5.png'), title: 'Royal Heritage Mataji Midnight Blue', category: 'Sacred Tradition', price: 18, coverType: 'money_cover' },
  { id: 27, src: asset('file_0000000079fc7207895636b61e3a7a76.png'), title: 'Royal Peacock Union & Jharokha', category: 'Wedding', price: 15, coverType: 'money_cover' },
  { id: 29, src: asset('card-24.jpeg'), title: 'Divine Kashtabhanjan Dev Hanumanji Blessing', category: 'Sacred Tradition', price: 15, coverType: 'money_cover', images: [asset('card-24.jpeg'), asset('file_00000000ec5c72079f182a9dbf418e71.png')] },
  { id: 31, src: asset('card-23.jpeg'), title: 'Divine Shrinathji Shubhchhak Ivory', category: 'Sacred Tradition', price: 15, coverType: 'money_cover' },
  { id: 33, src: asset('card-25.jpeg'), title: 'Divine Lord Shiva Mahadev Sapphire', category: 'Sacred Tradition', price: 15, coverType: 'money_cover' },
  { id: 34, src: asset('card-26.jpeg'), title: 'Divine Shrinathji Blessings & Photo Maroon', category: 'Sacred Tradition', price: 15, coverType: 'money_cover' },
  { id: 35, src: asset('card-27.jpeg'), title: 'Royal Heritage Teal Gold Flora Compliments', category: 'Wedding', price: 15, coverType: 'money_cover', images: [asset('card-27.jpeg'), asset('5993af1f-ac1d-4728-8cf1-28040d3a6f10.png')] },
  { id: 36, src: asset('card-28.jpg'), title: 'Royal Sky Blue Floral Peacock Shagun Cover', category: 'Wedding', price: 15, coverType: 'money_cover' },
  { id: 37, src: asset('card-29.jpg'), title: 'Royal Sapphire Sacred Kamdhenu & Palace', category: 'Sacred Tradition', price: 18, coverType: 'money_cover' },
  { id: 38, src: asset('card-30.jpg'), title: 'Divine Shree Ganesha Ivory Cream Lifafa', category: 'Sacred Tradition', price: 15, coverType: 'money_cover' },
  { id: 39, src: asset('card-31.jpg'), title: 'Royal Heritage Oasis & Floral Palace Lifafa', category: 'Wedding', price: 15, coverType: 'money_cover' },
  { id: 40, src: asset('card-32.jpg'), title: 'Royal Palace Jharokha & Peacock Lifafa', category: 'Wedding', price: 15, coverType: 'money_cover' },
];

// ─── Quantity-tiered pricing ───
export const DEFAULT_COMPARE_AT_PRICE = 25;

export function getUnitPrice(quantity: number): number {
  if (quantity <= 50) return 13;
  if (quantity <= 100) return 12;
  return 10;
}

export function findTemplateByIdOrSlug(identifier: string | number): Template | undefined {
  const strId = String(identifier).trim().toLowerCase();
  const numId = Number(identifier);

  return TEMPLATES.find((t) => {
    if (t.slug && t.slug.toLowerCase() === strId) return true;
    if (getTemplateSlug(t) === strId) return true;
    if (!isNaN(numId) && t.id === numId) return true;
    return false;
  });
}
