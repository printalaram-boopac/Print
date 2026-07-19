import { asset } from '@/lib/asset';

export interface Template {
  id: number;
  src: string;
  title: string;
  category: string;
  price: number;
}

export const TEMPLATES: Template[] = [
  { id: 1, src: asset('card-1.jpeg'), title: 'Royal Swaminarayan Plum', category: 'Sacred Tradition', price: 15 },
  { id: 2, src: asset('card-2.jpeg'), title: 'Peacock Garden Blue', category: 'Wedding', price: 15 },
  { id: 3, src: asset('card-3.jpeg'), title: 'Moonlit Shiva Blessing', category: 'Sacred Tradition', price: 18 },
  { id: 4, src: asset('card-4.jpeg'), title: 'Golden Peacock Palace', category: 'Wedding', price: 18 },
  { id: 5, src: asset('card-5.jpeg'), title: 'Ganesha Crimson Blessing', category: 'Sacred Tradition', price: 15 },
  { id: 6, src: asset('card-6.jpeg'), title: 'Emerald Garden Bloom', category: 'Wedding', price: 15 },
  { id: 7, src: asset('card-7.jpeg'), title: 'Royal Peacock Ivory', category: 'Wedding', price: 18 },
  { id: 8, src: asset('card-8.jpeg'), title: 'Sacred Kamdhenu Green', category: 'Sacred Tradition', price: 18 },
  { id: 9, src: asset('card-9.jpeg'), title: 'Shrinathji Blue Blessing', category: 'Sacred Tradition', price: 15 },
  { id: 10, src: asset('card-10.jpeg'), title: 'Royal Peacock Blush', category: 'Wedding', price: 15 },
  { id: 11, src: asset('card-11.jpeg'), title: 'Golden Peacock Ganesha', category: 'Wedding', price: 15 },
  { id: 12, src: asset('card-12.jpeg'), title: 'Mint Temple Peacock', category: 'Wedding', price: 18 },
  { id: 13, src: asset('card-13.jpeg'), title: 'Magenta Palace Peacock', category: 'Wedding', price: 15 },
  { id: 14, src: asset('card-14.jpeg'), title: 'Lilac Lotus Pond', category: 'Wedding', price: 15 },
  { id: 15, src: asset('card-15.jpeg'), title: 'Teal Krishna Elephant', category: 'Sacred Tradition', price: 15 },
  { id: 16, src: asset('card-16.jpeg'), title: 'Rosewater Palace Garden', category: 'Wedding', price: 15 },
  { id: 17, src: asset('card-17.jpeg'), title: 'Emerald Fort Elephants', category: 'Wedding', price: 15 },
  { id: 18, src: asset('card-18.jpeg'), title: 'Blush Swan Lotus', category: 'Wedding', price: 15 },
  { id: 19, src: asset('card-19.jpeg'), title: 'Regal Elephant Procession', category: 'Wedding', price: 18 },
  { id: 20, src: asset('card-20.jpeg'), title: 'Coral Garden Willow', category: 'Wedding', price: 18 },
  { id: 21, src: asset('card-21.jpeg'), title: 'Maroon Peacock Fountain', category: 'Wedding', price: 15 },
  { id: 22, src: asset('card-22.jpeg'), title: 'Swaminarayan Saffron Bloom', category: 'Sacred Tradition', price: 15 },
];

// ─── Quantity-tiered pricing ───
export const COMPARE_AT_PRICE = 49;

export function getUnitPrice(quantity: number): number {
  if (quantity <= 50) return 13;
  if (quantity <= 100) return 12;
  return 10;
}
