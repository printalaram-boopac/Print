import type { LibraryPhoto, PhotoCategory } from './types';

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  'Featured', 'Travel', 'Lifestyle', 'Wedding', 'Fashion', 'Food', 'Business', 'Nature', 'People',
];

// Real photographic stock imagery (Lorem Picsum — seeded so results are stable
// and never repeat within a category) stands in for a licensed photo library
// until PrintAlarm has one wired up. Not curated per-category (Picsum has no
// tagging), but every image is a genuine photo, not a placeholder block.
function seededPhotos(category: PhotoCategory, seeds: string[]): LibraryPhoto[] {
  return seeds.map((seed, i) => ({
    id: `${category.toLowerCase()}-${i}`,
    category,
    url: `https://picsum.photos/seed/${seed}/600/800`,
    width: 600,
    height: 800,
  }));
}

export const PHOTO_LIBRARY: LibraryPhoto[] = [
  ...seededPhotos('Featured', ['pa-feat-1', 'pa-feat-2', 'pa-feat-3', 'pa-feat-4']),
  ...seededPhotos('Travel', ['pa-travel-1', 'pa-travel-2', 'pa-travel-3', 'pa-travel-4']),
  ...seededPhotos('Lifestyle', ['pa-life-1', 'pa-life-2', 'pa-life-3', 'pa-life-4']),
  ...seededPhotos('Wedding', ['pa-wed-1', 'pa-wed-2', 'pa-wed-3', 'pa-wed-4']),
  ...seededPhotos('Fashion', ['pa-fash-1', 'pa-fash-2', 'pa-fash-3', 'pa-fash-4']),
  ...seededPhotos('Food', ['pa-food-1', 'pa-food-2', 'pa-food-3', 'pa-food-4']),
  ...seededPhotos('Business', ['pa-biz-1', 'pa-biz-2', 'pa-biz-3', 'pa-biz-4']),
  ...seededPhotos('Nature', ['pa-nat-1', 'pa-nat-2', 'pa-nat-3', 'pa-nat-4']),
  ...seededPhotos('People', ['pa-ppl-1', 'pa-ppl-2', 'pa-ppl-3', 'pa-ppl-4']),
];
