import type { MagazineTemplate, PageNumberSettings, TemplateCategory, TemplateDimensions } from '../types';
import {
  buildBackCover, buildContents, buildCover, buildFeature, buildGallery, buildIntro, buildPhotoSpread, buildQuote,
  type PackContext, type PackFonts, type PackPalette,
} from './layoutGenerators';

interface PackRecipe {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  tags: string[];
  palette: PackPalette;
  fonts: PackFonts;
  isPremium: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  variants: { cover: 0 | 1 | 2; feature: 0 | 1 | 2; contents: 0 | 1 | 2; spread: 0 | 1 | 2 };
  copy: {
    kicker: string; subtitle: string; issueLine: string;
    sections: { num: string; title: string }[];
    introHeading: string; introBody: string;
    featureHeading: string; featureBody: string; pullQuote: string;
    spreadCaption: string;
    galleryHeading: string; galleryCaptions: [string, string];
    quote: string; attribution: string;
    closingLine: string; url: string;
  };
}

const A4: TemplateDimensions = { widthMm: 210, heightMm: 297, orientation: 'portrait' };
const PAGE_NUMBERS_DEFAULT: PageNumberSettings = {
  enabled: true, startAtPageIndex: 1, startNumber: 2, position: 'bottom-center',
  hideOnCover: true, hideOnBackCover: true, fontKey: 'condensed', fontSize: 9, color: '#6F7478',
};

const RECIPES: PackRecipe[] = [
  // --- Travel ---------------------------------------------------------
  {
    id: 'travel-coastal-escape', name: 'Coastal Escape', category: 'Travel', isPremium: false, isFeatured: true,
    description: 'Airy, warm travel editorial built for scenic photography and quiet storytelling.',
    tags: ['travel', 'editorial', 'photo-heavy', 'soft'],
    palette: { primary: '#3E6B63', secondary: '#B7CFC9', accent: '#C97D4F', light: '#F5F1EA', dark: '#20272C' },
    fonts: { display: 'serif', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 0, feature: 0, contents: 0, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM MAGAZINE', subtitle: 'PEOPLE • PLACES • STORIES', issueLine: 'ISSUE 01 — SUMMER',
      sections: [{ num: '01', title: 'Editor’s Note' }, { num: '02', title: 'Coastal Roads' }, { num: '03', title: 'Where We Stayed' }, { num: '04', title: 'Notes From the Sea' }, { num: '05', title: 'Closing Thoughts' }],
      introHeading: 'The Journey', introBody: 'A weekend of quiet roads, sea air and places worth remembering.',
      featureHeading: 'Coastal Roads', featureBody: 'We followed the coastline for three days, stopping wherever the light looked worth waiting for.', pullQuote: '“Some roads are worth taking twice.”',
      spreadCaption: 'COASTAL HIGHWAY, MILE 214',
      galleryHeading: 'NOTES FROM THE SEA', galleryCaptions: ['Low tide, early morning', 'The harbour at dusk'],
      quote: 'We travel not to escape life, but for life not to escape us.', attribution: '— Local fisherman, Coastal Escape',
      closingLine: 'Until the next horizon.', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'travel-city-journal', name: 'City Journal', category: 'Travel', isPremium: true, isNew: true,
    description: 'Bold, structured urban-travel journal with map-style labels and dense typography.',
    tags: ['travel', 'bold', 'modern', 'storytelling'],
    palette: { primary: '#2B333A', secondary: '#8A93A6', accent: '#D97B3F', light: '#EFEDE7', dark: '#14171A' },
    fonts: { display: 'display', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 1, feature: 2, contents: 1, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM MAGAZINE', subtitle: 'FIELD NOTES FROM THE CITY', issueLine: 'VOL. II',
      sections: [{ num: '01', title: 'Arrival' }, { num: '02', title: 'Street Level' }, { num: '03', title: 'After Dark' }, { num: '04', title: 'Departure' }],
      introHeading: 'City Journal', introBody: 'Every city has a rhythm. This one took four days to learn.',
      featureHeading: 'Street Level', featureBody: 'The best version of any city is the one you find on foot, without a plan.', pullQuote: '44.4°N, 26.1°E',
      spreadCaption: 'DOWNTOWN, 11:40 PM',
      galleryHeading: 'AFTER DARK', galleryCaptions: ['Neon on wet pavement', 'Last train, platform 3'],
      quote: 'Cities, like dreams, are made of desires and fears.', attribution: '— City Journal, Vol. II',
      closingLine: 'See you at street level.', url: 'PRINTALARM.IN',
    },
  },

  // --- Wedding ---------------------------------------------------------
  {
    id: 'wedding-forever', name: 'Forever', category: 'Wedding', isPremium: false, isFeatured: true,
    description: 'Elegant, refined wedding keepsake with soft neutrals and restrained decoration.',
    tags: ['wedding', 'elegant', 'minimal', 'soft'],
    palette: { primary: '#A85C5C', secondary: '#E8C3C3', accent: '#B8895A', light: '#FBF7F2', dark: '#2E2340' },
    fonts: { display: 'serif', heading: 'serif', body: 'condensed', caption: 'condensed' },
    variants: { cover: 0, feature: 0, contents: 2, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM KEEPSAKE', subtitle: 'THE WEDDING OF TWO STORIES', issueLine: 'FOREVER STARTS HERE',
      sections: [{ num: '01', title: 'Our Story' }, { num: '02', title: 'The Ceremony' }, { num: '03', title: 'Details' }, { num: '04', title: 'Family & Friends' }],
      introHeading: 'Our Story', introBody: 'Two people, one decision, and everything that followed.',
      featureHeading: 'The Ceremony', featureBody: 'Vows were exchanged just as the light turned gold over the garden.', pullQuote: '“I do, always.”',
      spreadCaption: 'THE FIRST DANCE',
      galleryHeading: 'DETAILS', galleryCaptions: ['The rings', 'The table settings'],
      quote: 'Two souls with but a single thought, two hearts that beat as one.', attribution: '— Vows, exchanged',
      closingLine: 'With love, always.', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'wedding-the-wedding-story', name: 'The Wedding Story', category: 'Wedding', isPremium: true,
    description: 'A timeline-driven wedding narrative, from morning preparations to the last dance.',
    tags: ['wedding', 'storytelling', 'elegant', 'timeline'],
    palette: { primary: '#7A4A6B', secondary: '#E8B978', accent: '#D9B8B0', light: '#F7F1E6', dark: '#2C2C2E' },
    fonts: { display: 'serif', heading: 'condensed', body: 'condensed', caption: 'hand' },
    variants: { cover: 2, feature: 1, contents: 0, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM KEEPSAKE', subtitle: 'A DAY, TOLD IN ORDER', issueLine: 'THE WEDDING STORY',
      sections: [{ num: '01', title: 'Morning' }, { num: '02', title: 'The Ceremony' }, { num: '03', title: 'The Reception' }, { num: '04', title: 'Night' }],
      introHeading: 'A Day, Told in Order', introBody: 'From the first cup of coffee to the very last song.',
      featureHeading: 'The Ceremony', featureBody: 'Every guest stood as she walked in — the room went quiet for the first time all day.', pullQuote: 'Every love story is beautiful, but ours is my favourite.',
      spreadCaption: 'THE RECEPTION, GOLDEN HOUR',
      galleryHeading: 'MOMENTS', galleryCaptions: ['The best man’s toast', 'Grandmother’s dance'],
      quote: 'Love is not about how much you say, it’s about how much you prove.', attribution: '— Toast, reception',
      closingLine: 'Thank you for being part of our story.', url: 'PRINTALARM.IN',
    },
  },

  // --- Fashion ---------------------------------------------------------
  {
    id: 'fashion-the-edit', name: 'The Edit', category: 'Fashion', isPremium: true, isFeatured: true,
    description: 'Bold editorial fashion typography, strong contrast, minimal palette.',
    tags: ['fashion', 'bold', 'editorial', 'monochrome'],
    palette: { primary: '#14171A', secondary: '#545458', accent: '#FFFFFF', light: '#EDEDED', dark: '#000000' },
    fonts: { display: 'display', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 1, feature: 2, contents: 1, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM EDITORIAL', subtitle: 'THE SEASON, EDITED', issueLine: 'ISSUE NO. 04',
      sections: [{ num: '01', title: 'The Look' }, { num: '02', title: 'On the Street' }, { num: '03', title: 'Studio' }, { num: '04', title: 'The Edit' }],
      introHeading: 'The Edit', introBody: 'Fewer pieces. Stronger silhouettes. This season, less said more.',
      featureHeading: 'Studio', featureBody: 'Shot in a single afternoon, on purpose — nothing about this season was accidental.', pullQuote: 'MONOCHROME / VOL. 04',
      spreadCaption: 'STUDIO, TAKE THREE',
      galleryHeading: 'LOOKBOOK', galleryCaptions: ['Look 12', 'Look 18'],
      quote: 'Fashion fades, style is eternal.', attribution: '— The Edit',
      closingLine: 'Next season, reconsidered.', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'fashion-modern-muse', name: 'Modern Muse', category: 'Fashion', isPremium: true,
    description: 'Asymmetric fashion layout with strong whitespace and a confident cover.',
    tags: ['fashion', 'modern', 'minimal', 'luxury'],
    palette: { primary: '#2C2C2E', secondary: '#D9C7E8', accent: '#6E4E8C', light: '#F5F5F3', dark: '#1C2024' },
    fonts: { display: 'display', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 2, feature: 0, contents: 2, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM EDITORIAL', subtitle: 'PORTRAITS OF A NEW SEASON', issueLine: 'MODERN MUSE',
      sections: [{ num: '01', title: 'Muse' }, { num: '02', title: 'Portraits' }, { num: '03', title: 'Statement' }, { num: '04', title: 'Closing Look' }],
      introHeading: 'Modern Muse', introBody: 'She doesn’t follow the season. The season follows her.',
      featureHeading: 'Portraits', featureBody: 'A study in confidence, shot against nothing but negative space.', pullQuote: '“Simplicity is the ultimate sophistication.”',
      spreadCaption: 'PORTRAIT SERIES, NO. 3',
      galleryHeading: 'STATEMENT', galleryCaptions: ['Look 04', 'Look 09'],
      quote: 'Elegance is refusal.', attribution: '— Modern Muse',
      closingLine: 'Until next season.', url: 'PRINTALARM.IN',
    },
  },

  // --- Lifestyle ---------------------------------------------------------
  {
    id: 'lifestyle-slow-living', name: 'Slow Living', category: 'Lifestyle', isPremium: false, isFeatured: true,
    description: 'Calm, contemporary lifestyle editorial about slowing down.',
    tags: ['lifestyle', 'minimal', 'soft', 'clean'],
    palette: { primary: '#5B7C9D', secondary: '#CBD9E8', accent: '#B8895A', light: '#F5F5F3', dark: '#20272C' },
    fonts: { display: 'serif', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 0, feature: 0, contents: 0, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM MAGAZINE', subtitle: 'ON LIVING SLOWLY', issueLine: 'ISSUE 07',
      sections: [{ num: '01', title: 'Mornings' }, { num: '02', title: 'At Home' }, { num: '03', title: 'Small Rituals' }, { num: '04', title: 'Evenings' }],
      introHeading: 'Slow Living', introBody: 'A quiet argument for doing less, and noticing more.',
      featureHeading: 'At Home', featureBody: 'The best mornings start with nowhere to be for at least an hour.', pullQuote: '“Slowness is a kind of luxury.”',
      spreadCaption: 'SUNDAY, 8 AM',
      galleryHeading: 'SMALL RITUALS', galleryCaptions: ['Coffee, made slowly', 'An open window'],
      quote: 'Almost everything will work again if you unplug it for a few minutes.', attribution: '— Slow Living',
      closingLine: 'Take your time.', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'lifestyle-everyday-stories', name: 'Everyday Stories', category: 'Lifestyle', isPremium: false,
    description: 'Photo-led lifestyle diary of ordinary, well-lived days.',
    tags: ['lifestyle', 'photo-heavy', 'storytelling', 'clean'],
    palette: { primary: '#7A4A6B', secondary: '#E9D6A8', accent: '#3E6B63', light: '#F7F5F1', dark: '#33383D' },
    fonts: { display: 'serif', heading: 'condensed', body: 'condensed', caption: 'hand' },
    variants: { cover: 2, feature: 1, contents: 1, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM MAGAZINE', subtitle: 'THE ORDINARY, NOTICED', issueLine: 'ISSUE 03',
      sections: [{ num: '01', title: 'Everyday' }, { num: '02', title: 'People We Love' }, { num: '03', title: 'Little Things' }, { num: '04', title: 'Today' }],
      introHeading: 'Everyday Stories', introBody: 'Nothing here is extraordinary — and that’s exactly the point.',
      featureHeading: 'People We Love', featureBody: 'The people who make an ordinary Tuesday worth photographing.', pullQuote: '“The little things are the big things.”',
      spreadCaption: 'TUESDAY, AS IT HAPPENED',
      galleryHeading: 'LITTLE THINGS', galleryCaptions: ['Breakfast, unplanned', 'A borrowed sweater'],
      quote: 'Life is a collection of small moments, not the big ones.', attribution: '— Everyday Stories',
      closingLine: 'See you tomorrow.', url: 'PRINTALARM.IN',
    },
  },

  // --- Family ---------------------------------------------------------
  {
    id: 'family-together', name: 'Together', category: 'Family', isPremium: false, isFeatured: true,
    description: 'Warm family keepsake built around memory-focused captions.',
    tags: ['family', 'warm', 'storytelling', 'soft'],
    palette: { primary: '#B8895A', secondary: '#E9D6A8', accent: '#5B7C9D', light: '#FBF7F2', dark: '#20272C' },
    fonts: { display: 'serif', heading: 'hand', body: 'condensed', caption: 'condensed' },
    variants: { cover: 0, feature: 0, contents: 0, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM KEEPSAKE', subtitle: 'US, THIS YEAR', issueLine: 'FAMILY EDITION',
      sections: [{ num: '01', title: 'This Year' }, { num: '02', title: 'At Home' }, { num: '03', title: 'Adventures' }, { num: '04', title: 'Us' }],
      introHeading: 'Together', introBody: 'A year of dinners, drives, and everything in between.',
      featureHeading: 'At Home', featureBody: 'Most of our favourite memories happened right here, on an ordinary evening.', pullQuote: '“Home is wherever we all are.”',
      spreadCaption: 'SUNDAY DINNER, ALL OF US',
      galleryHeading: 'ADVENTURES', galleryCaptions: ['The road trip', 'The backyard'],
      quote: 'Family is not an important thing. It’s everything.', attribution: '— Together',
      closingLine: 'Here’s to another year, together.', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'family-family-journal', name: 'Family Journal', category: 'Family', isPremium: true,
    description: 'A structured family journal with sections for each season of the year.',
    tags: ['family', 'clean', 'storytelling'],
    palette: { primary: '#3E6B63', secondary: '#CBD9E8', accent: '#D97B3F', light: '#F5F5F3', dark: '#2B333A' },
    fonts: { display: 'serif', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 2, feature: 0, contents: 2, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM KEEPSAKE', subtitle: 'A YEAR, KEPT SAFE', issueLine: 'THE FAMILY JOURNAL',
      sections: [{ num: '01', title: 'Spring' }, { num: '02', title: 'Summer' }, { num: '03', title: 'Autumn' }, { num: '04', title: 'Winter' }],
      introHeading: 'Family Journal', introBody: 'Four seasons, one family, and all the moments worth keeping.',
      featureHeading: 'Summer', featureBody: 'The long evenings when everyone was finally in one place at once.', pullQuote: '“Keep what matters.”',
      spreadCaption: 'SUMMER, THE WHOLE FAMILY',
      galleryHeading: 'THIS SEASON', galleryCaptions: ['The garden', 'Sunday mornings'],
      quote: 'In family life, love is the oil that eases friction.', attribution: '— Family Journal',
      closingLine: 'Until next season.', url: 'PRINTALARM.IN',
    },
  },

  // --- Birthday ---------------------------------------------------------
  {
    id: 'birthday-celebration', name: 'Celebration', category: 'Birthday', isPremium: false, isFeatured: true,
    description: 'A premium, modern birthday keepsake — celebratory without cartoon clichés.',
    tags: ['birthday', 'modern', 'colourful', 'storytelling'],
    palette: { primary: '#D97B3F', secondary: '#E8B978', accent: '#7A4A6B', light: '#FBF7F2', dark: '#20272C' },
    fonts: { display: 'display', heading: 'hand', body: 'condensed', caption: 'condensed' },
    variants: { cover: 1, feature: 0, contents: 0, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM KEEPSAKE', subtitle: 'ANOTHER YEAR, CELEBRATED', issueLine: 'THE BIG DAY',
      sections: [{ num: '01', title: 'The Countdown' }, { num: '02', title: 'The Party' }, { num: '03', title: 'Messages' }, { num: '04', title: 'The Highlights' }],
      introHeading: 'Celebration', introBody: 'One more year, and every reason to celebrate it properly.',
      featureHeading: 'The Party', featureBody: 'Candles, cake, and everyone who mattered in one room.', pullQuote: '“Make a wish.”',
      spreadCaption: 'THE MOMENT BEFORE THE CANDLES',
      galleryHeading: 'HIGHLIGHTS', galleryCaptions: ['The cake', 'The gifts'],
      quote: 'Count your life by smiles, not tears.', attribution: '— Celebration',
      closingLine: 'Here’s to another wonderful year.', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'birthday-another-year', name: 'Another Year', category: 'Birthday', isPremium: true,
    description: 'A timeline-style birthday keepsake celebrating milestones through the year.',
    tags: ['birthday', 'timeline', 'clean', 'colourful'],
    palette: { primary: '#6E4E8C', secondary: '#D9C7E8', accent: '#E8B978', light: '#F5F5F3', dark: '#2C2C2E' },
    fonts: { display: 'display', heading: 'condensed', body: 'condensed', caption: 'hand' },
    variants: { cover: 2, feature: 1, contents: 1, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM KEEPSAKE', subtitle: 'A YEAR OF MOMENTS', issueLine: 'ANOTHER YEAR',
      sections: [{ num: '01', title: 'Then' }, { num: '02', title: 'Milestones' }, { num: '03', title: 'Now' }, { num: '04', title: 'What’s Next' }],
      introHeading: 'Another Year', introBody: 'A look back at the moments that made this year worth marking.',
      featureHeading: 'Milestones', featureBody: 'This year had its share of firsts — we tried to catch most of them.', pullQuote: 'HERE’S TO GROWING, ONE YEAR AT A TIME.',
      spreadCaption: 'THE YEAR IN ONE FRAME',
      galleryHeading: 'MILESTONES', galleryCaptions: ['The first of many', 'A year well spent'],
      quote: 'Age is of no importance unless you are a cheese.', attribution: '— Another Year',
      closingLine: 'On to the next one.', url: 'PRINTALARM.IN',
    },
  },

  // --- Baby ---------------------------------------------------------
  {
    id: 'baby-little-moments', name: 'Little Moments', category: 'Baby', isPremium: false, isFeatured: true,
    description: 'A soft, gentle baby keepsake for the smallest milestones.',
    tags: ['baby', 'soft', 'minimal', 'elegant'],
    palette: { primary: '#CBD9E8', secondary: '#F7F1E6', accent: '#B8895A', light: '#FFFFFF', dark: '#33383D' },
    fonts: { display: 'hand', heading: 'serif', body: 'condensed', caption: 'hand' },
    variants: { cover: 2, feature: 0, contents: 0, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM KEEPSAKE', subtitle: 'EVERY LITTLE MOMENT', issueLine: 'FOR YOU, ALWAYS',
      sections: [{ num: '01', title: 'Hello, World' }, { num: '02', title: 'First Days' }, { num: '03', title: 'Little Things' }, { num: '04', title: 'For You' }],
      introHeading: 'Little Moments', introBody: 'Every tiny detail, kept safe before we forget how small you were.',
      featureHeading: 'First Days', featureBody: 'The quiet, sleepy days when everything was new — for both of us.', pullQuote: '“So small, so loved.”',
      spreadCaption: 'THE FIRST WEEK',
      galleryHeading: 'LITTLE THINGS', galleryCaptions: ['Tiny fingers', 'First nap'],
      quote: 'A baby fills a place in your heart you never knew was empty.', attribution: '— Little Moments',
      closingLine: 'With all our love.', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'baby-first-year', name: 'First Year', category: 'Baby', isPremium: true,
    description: 'A month-by-month first-year milestone journal, elegant and soft.',
    tags: ['baby', 'timeline', 'soft', 'storytelling'],
    palette: { primary: '#D9B8B0', secondary: '#F7F5F1', accent: '#A9B79A', light: '#FFFFFF', dark: '#2B333A' },
    fonts: { display: 'hand', heading: 'serif', body: 'condensed', caption: 'condensed' },
    variants: { cover: 0, feature: 1, contents: 2, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM KEEPSAKE', subtitle: 'TWELVE MONTHS OF YOU', issueLine: 'THE FIRST YEAR',
      sections: [{ num: '01', title: 'Month One' }, { num: '02', title: 'First Smile' }, { num: '03', title: 'First Steps' }, { num: '04', title: 'One Year' }],
      introHeading: 'First Year', introBody: 'Twelve months, a hundred firsts, and a lifetime of favourites.',
      featureHeading: 'First Steps', featureBody: 'Three wobbly steps across the living room — and then straight into our arms.', pullQuote: 'MONTH NINE: ON THE MOVE',
      spreadCaption: 'THE FIRST STEPS, CAUGHT ON CAMERA',
      galleryHeading: 'MILESTONES', galleryCaptions: ['First smile', 'First steps'],
      quote: 'Where does the time go? Right here, in these pages.', attribution: '— First Year',
      closingLine: 'Here’s to year two.', url: 'PRINTALARM.IN',
    },
  },

  // --- Food ---------------------------------------------------------
  {
    id: 'food-taste', name: 'Taste', category: 'Food', isPremium: false, isFeatured: true,
    description: 'A premium food-magazine feel with strong photography and editorial serif type.',
    tags: ['food', 'editorial', 'clean', 'photo-heavy'],
    palette: { primary: '#B8895A', secondary: '#E9D6A8', accent: '#3E6B63', light: '#FBF7F2', dark: '#20272C' },
    fonts: { display: 'serif', heading: 'condensed', body: 'condensed', caption: 'typewriter' },
    variants: { cover: 0, feature: 0, contents: 0, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM MAGAZINE', subtitle: 'RECIPES • PLACES • PEOPLE', issueLine: 'ISSUE 05',
      sections: [{ num: '01', title: 'From the Kitchen' }, { num: '02', title: 'The Chef' }, { num: '03', title: 'On the Table' }, { num: '04', title: 'Notes' }],
      introHeading: 'Taste', introBody: 'A collection of meals worth remembering, and the people behind them.',
      featureHeading: 'The Chef', featureBody: 'Twenty years in the kitchen, and still cooking like it’s the first service.', pullQuote: '“Good food is good mood.”',
      spreadCaption: 'THE PASS, SATURDAY NIGHT',
      galleryHeading: 'ON THE TABLE', galleryCaptions: ['Starter, plated', 'The last course'],
      quote: 'People who love to eat are always the best people.', attribution: '— Taste',
      closingLine: 'Until the next table.', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'food-the-kitchen-journal', name: 'The Kitchen Journal', category: 'Food', isPremium: true,
    description: 'A recipe-forward kitchen journal with a warm, documentary feel.',
    tags: ['food', 'storytelling', 'warm', 'clean'],
    palette: { primary: '#D97B3F', secondary: '#F7F1E6', accent: '#5B7C9D', light: '#FFFFFF', dark: '#2C2C2E' },
    fonts: { display: 'serif', heading: 'typewriter', body: 'condensed', caption: 'typewriter' },
    variants: { cover: 2, feature: 1, contents: 1, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM MAGAZINE', subtitle: 'NOTES FROM THE KITCHEN', issueLine: 'THE KITCHEN JOURNAL',
      sections: [{ num: '01', title: 'The Pantry' }, { num: '02', title: 'Sunday Cooking' }, { num: '03', title: 'The Table' }, { num: '04', title: 'Leftovers' }],
      introHeading: 'The Kitchen Journal', introBody: 'A running record of what we cooked, and who we cooked it for.',
      featureHeading: 'Sunday Cooking', featureBody: 'The one meal of the week that’s never rushed, and never eaten alone.', pullQuote: 'RECIPE NO. 12: SLOW AND UNHURRIED',
      spreadCaption: 'THE STOVE, SUNDAY MORNING',
      galleryHeading: 'THE TABLE', galleryCaptions: ['Bread, still warm', 'Set for six'],
      quote: 'Cooking is like love — it should be entered into with abandon.', attribution: '— The Kitchen Journal',
      closingLine: 'See you Sunday.', url: 'PRINTALARM.IN',
    },
  },

  // --- Business ---------------------------------------------------------
  {
    id: 'business-vision', name: 'Vision', category: 'Business', isPremium: true, isFeatured: true,
    description: 'A clean, design-led corporate report — structured, not spreadsheet-like.',
    tags: ['business', 'corporate', 'clean', 'modern'],
    palette: { primary: '#20272C', secondary: '#454F56', accent: '#B8895A', light: '#F5F5F3', dark: '#14171A' },
    fonts: { display: 'condensed', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 2, feature: 0, contents: 2, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM PUBLICATION', subtitle: 'WHERE WE’RE HEADED', issueLine: 'FY2026',
      sections: [{ num: '01', title: 'Our Vision' }, { num: '02', title: 'Highlights' }, { num: '03', title: 'Case Study' }, { num: '04', title: 'Our Team' }],
      introHeading: 'Vision', introBody: 'A year of building the foundation for what comes next.',
      featureHeading: 'Highlights', featureBody: 'The numbers tell part of the story — the people behind them tell the rest.', pullQuote: 'GROWTH, BY DESIGN.',
      spreadCaption: 'THE TEAM, HEADQUARTERS',
      galleryHeading: 'THE YEAR', galleryCaptions: ['Product launch', 'Team offsite'],
      quote: 'Good design is good business.', attribution: '— Vision',
      closingLine: 'Thank you for building this with us.', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'business-annual-review', name: 'Annual Review', category: 'Business', isPremium: true,
    description: 'A structured annual review with a metrics-forward feature layout.',
    tags: ['business', 'corporate', 'clean', 'minimal'],
    palette: { primary: '#454F56', secondary: '#8A93A6', accent: '#D97B3F', light: '#EFEDE7', dark: '#20272C' },
    fonts: { display: 'condensed', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 1, feature: 1, contents: 1, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM PUBLICATION', subtitle: 'THE YEAR IN REVIEW', issueLine: 'ANNUAL REVIEW',
      sections: [{ num: '01', title: 'Message' }, { num: '02', title: 'Key Metrics' }, { num: '03', title: 'Case Study' }, { num: '04', title: 'Leadership' }],
      introHeading: 'Annual Review', introBody: 'A transparent look at where we stood, and where we’re going.',
      featureHeading: 'Key Metrics', featureBody: 'Every metric here represents a decision, a team, and a bet that paid off.', pullQuote: 'UP, ACROSS EVERY MEASURE THAT MATTERED.',
      spreadCaption: 'LEADERSHIP, Q4 REVIEW',
      galleryHeading: 'THE YEAR', galleryCaptions: ['Case study site visit', 'All-hands meeting'],
      quote: 'What gets measured gets managed.', attribution: '— Annual Review',
      closingLine: 'On to next year.', url: 'PRINTALARM.IN',
    },
  },

  // --- Portfolio ---------------------------------------------------------
  {
    id: 'portfolio-selected-works', name: 'Selected Works', category: 'Portfolio', isPremium: true, isFeatured: true,
    description: 'A minimal, whitespace-driven creative portfolio for designers and architects.',
    tags: ['portfolio', 'minimal', 'clean', 'luxury'],
    palette: { primary: '#1C2024', secondary: '#6F7478', accent: '#B8895A', light: '#FFFFFF', dark: '#000000' },
    fonts: { display: 'display', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 2, feature: 0, contents: 2, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM PORTFOLIO', subtitle: 'SELECTED WORK, 2020—2026', issueLine: 'STUDIO EDITION',
      sections: [{ num: '01', title: 'About' }, { num: '02', title: 'Project One' }, { num: '03', title: 'Project Two' }, { num: '04', title: 'Contact' }],
      introHeading: 'Selected Works', introBody: 'A short collection of projects worth showing in full.',
      featureHeading: 'Project One', featureBody: 'A ground-up commission, designed and delivered over eight months.', pullQuote: 'DESIGNED WITH RESTRAINT, BUILT TO LAST.',
      spreadCaption: 'PROJECT ONE, COMPLETED VIEW',
      galleryHeading: 'PROJECT TWO', galleryCaptions: ['Detail, entrance', 'Detail, interior'],
      quote: 'Simplicity is the final achievement.', attribution: '— Selected Works',
      closingLine: 'Let’s work together.', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'portfolio-studio', name: 'Studio', category: 'Portfolio', isPremium: false,
    description: 'A photographer/creator studio portfolio with a photo-led case-study structure.',
    tags: ['portfolio', 'photo-heavy', 'clean', 'modern'],
    palette: { primary: '#33383D', secondary: '#D6D6D2', accent: '#A9B79A', light: '#F5F5F3', dark: '#14171A' },
    fonts: { display: 'display', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 1, feature: 2, contents: 0, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM PORTFOLIO', subtitle: 'WORK FROM THE STUDIO', issueLine: 'STUDIO NO. 01',
      sections: [{ num: '01', title: 'The Studio' }, { num: '02', title: 'Recent Work' }, { num: '03', title: 'Process' }, { num: '04', title: 'Get in Touch' }],
      introHeading: 'Studio', introBody: 'A small studio, a growing body of work, and a lot of good light.',
      featureHeading: 'Recent Work', featureBody: 'Shot on location over three days, edited over three weeks.', pullQuote: 'STUDIO NO. 01 — RECENT WORK',
      spreadCaption: 'ON SET, DAY TWO',
      galleryHeading: 'PROCESS', galleryCaptions: ['Contact sheet, roll 3', 'Behind the scenes'],
      quote: 'Photography is the story I fail to put into words.', attribution: '— Studio',
      closingLine: 'Available for commissions.', url: 'PRINTALARM.IN',
    },
  },

  // --- Memories ---------------------------------------------------------
  {
    id: 'memories-moments', name: 'Moments', category: 'Memories', isPremium: false, isFeatured: true,
    description: 'The original PrintAlarm keepsake style — warm, simple, and photo-led.',
    tags: ['memories', 'soft', 'storytelling', 'clean'],
    palette: { primary: '#C97D4F', secondary: '#7A4A6B', accent: '#E8B978', light: '#F5F5F3', dark: '#2E2340' },
    fonts: { display: 'serif', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 0, feature: 0, contents: 0, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM MAGAZINE', subtitle: 'PEOPLE • PLACES • STORIES', issueLine: 'ISSUE 01',
      sections: [{ num: '01', title: 'Editorial Intro' }, { num: '02', title: 'Full Photo Story' }, { num: '03', title: 'Text + Image' }, { num: '04', title: 'Feature Story' }],
      introHeading: 'The Moments Story', introBody: 'An editorial introduction, set the tone for what follows.',
      featureHeading: 'Feature', featureBody: 'A quiet moment, told in words alongside the image.', pullQuote: '“Some moments deserve to be kept.”',
      spreadCaption: 'A MOMENT WORTH KEEPING',
      galleryHeading: 'MOMENTS', galleryCaptions: ['As it happened', 'Just before'],
      quote: 'Life is made of moments, not years.', attribution: '— Moments',
      closingLine: 'PRINTALARM.IN', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'memories-our-story', name: 'Our Story', category: 'Memories', isPremium: true,
    description: 'A nostalgic, vintage-inflected keepsake for retelling a shared story.',
    tags: ['memories', 'elegant', 'storytelling', 'soft'],
    palette: { primary: '#A85C5C', secondary: '#E9D6A8', accent: '#5B7C9D', light: '#FBF7F2', dark: '#2C2C2E' },
    fonts: { display: 'vintage', heading: 'serif', body: 'condensed', caption: 'hand' },
    variants: { cover: 0, feature: 1, contents: 2, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM KEEPSAKE', subtitle: 'AS WE REMEMBER IT', issueLine: 'OUR STORY',
      sections: [{ num: '01', title: 'How It Started' }, { num: '02', title: 'Along the Way' }, { num: '03', title: 'Where We Are' }, { num: '04', title: 'To Be Continued' }],
      introHeading: 'Our Story', introBody: 'Every story worth telling starts somewhere ordinary.',
      featureHeading: 'Along the Way', featureBody: 'The years in between are usually the ones worth remembering most.', pullQuote: '“This is the part we’ll tell again and again.”',
      spreadCaption: 'SOMEWHERE ALONG THE WAY',
      galleryHeading: 'ALONG THE WAY', galleryCaptions: ['The early days', 'Somewhere in between'],
      quote: 'We are the stories we choose to tell.', attribution: '— Our Story',
      closingLine: 'To be continued.', url: 'PRINTALARM.IN',
    },
  },

  // --- Photography ---------------------------------------------------------
  {
    id: 'photography-frames', name: 'Frames', category: 'Photography', isPremium: true, isFeatured: true,
    description: 'Image-first photography annual — minimal text, wide margins, large captions.',
    tags: ['photography', 'minimal', 'photo-heavy', 'clean'],
    palette: { primary: '#14171A', secondary: '#6F7478', accent: '#FFFFFF', light: '#F5F5F3', dark: '#000000' },
    fonts: { display: 'condensed', heading: 'condensed', body: 'condensed', caption: 'condensed' },
    variants: { cover: 2, feature: 2, contents: 2, spread: 0 },
    copy: {
      kicker: 'A PRINTALARM ANNUAL', subtitle: 'A YEAR IN FRAMES', issueLine: 'ANNUAL NO. 01',
      sections: [{ num: '01', title: 'Series One' }, { num: '02', title: 'Series Two' }, { num: '03', title: 'Contact Sheet' }, { num: '04', title: 'Index' }],
      introHeading: 'Frames', introBody: 'A year of images, arranged with as few words as possible.',
      featureHeading: 'Series One', featureBody: 'Shot over twelve months, one frame at a time.', pullQuote: 'SERIES ONE, FRAME 14',
      spreadCaption: 'SERIES ONE, FRAME 22',
      galleryHeading: 'CONTACT SHEET', galleryCaptions: ['Frame 03', 'Frame 19'],
      quote: 'A photograph is a secret about a secret.', attribution: '— Frames',
      closingLine: 'Prints available on request.', url: 'PRINTALARM.IN',
    },
  },
  {
    id: 'photography-photo-essay', name: 'Photo Essay', category: 'Photography', isPremium: false,
    description: 'A single-story photo essay format with generous captions and a documentary tone.',
    tags: ['photography', 'storytelling', 'clean', 'monochrome'],
    palette: { primary: '#454F56', secondary: '#D6D6D2', accent: '#B8895A', light: '#FFFFFF', dark: '#20272C' },
    fonts: { display: 'condensed', heading: 'condensed', body: 'condensed', caption: 'typewriter' },
    variants: { cover: 1, feature: 0, contents: 1, spread: 1 },
    copy: {
      kicker: 'A PRINTALARM ESSAY', subtitle: 'A STORY, TOLD IN PICTURES', issueLine: 'PHOTO ESSAY NO. 02',
      sections: [{ num: '01', title: 'Prologue' }, { num: '02', title: 'The Story' }, { num: '03', title: 'Detail' }, { num: '04', title: 'Epilogue' }],
      introHeading: 'Photo Essay', introBody: 'This is a story told almost entirely in pictures.',
      featureHeading: 'The Story', featureBody: 'Shot over six weeks, following one subject from start to finish.', pullQuote: 'CHAPTER TWO, AS IT UNFOLDED',
      spreadCaption: 'THE STORY, MID-CHAPTER',
      galleryHeading: 'DETAIL', galleryCaptions: ['Detail, frame 1', 'Detail, frame 2'],
      quote: 'The camera is an instrument that teaches people how to see without a camera.', attribution: '— Photo Essay',
      closingLine: 'End of essay.', url: 'PRINTALARM.IN',
    },
  },
];

let idCounter = 0;
function packId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function buildPack(recipe: PackRecipe): MagazineTemplate {
  const ctx: PackContext = { name: recipe.name, category: recipe.category, palette: recipe.palette, fonts: recipe.fonts, imageSeed: recipe.id };
  const c = recipe.copy;

  const pages = [
    buildCover(ctx, recipe.variants.cover, { kicker: c.kicker, title: recipe.name, subtitle: c.subtitle, issueLine: c.issueLine }),
    buildContents(ctx, recipe.variants.contents, { heading: 'Contents', sections: c.sections }),
    buildIntro(ctx, { heading: c.introHeading, body: c.introBody }),
    buildFeature(ctx, recipe.variants.feature, { heading: c.featureHeading, body: c.featureBody, pullQuote: c.pullQuote }, 'Feature'),
    buildPhotoSpread(ctx, recipe.variants.spread, { caption: c.spreadCaption }),
    buildGallery(ctx, { heading: c.galleryHeading, captions: c.galleryCaptions }),
    buildQuote(ctx, { quote: c.quote, attribution: c.attribution }),
    buildBackCover(ctx, { closingLine: c.closingLine, url: c.url }),
  ];

  return {
    id: packId('pack'),
    name: recipe.name,
    category: recipe.category,
    accentGradient: `linear-gradient(165deg, ${recipe.palette.secondary} 0%, ${recipe.palette.primary} 60%, ${recipe.palette.dark} 100%)`,
    asset: { thumbnailUrl: null, originalUrl: null, printUrl: null, widthPx: 1240, heightPx: 1754 },
    dimensions: A4,
    pages,
    isPremium: recipe.isPremium,
    description: recipe.description,
    tags: recipe.tags,
    palette: [recipe.palette.primary, recipe.palette.secondary, recipe.palette.accent, recipe.palette.light, recipe.palette.dark],
    typography: recipe.fonts,
    isFeatured: recipe.isFeatured,
    isNew: recipe.isNew,
    version: '1.0.0',
    createdAt: recipe.isNew ? '2026-08-01' : '2026-01-01',
    useCount: 0,
    pageNumbers: { ...PAGE_NUMBERS_DEFAULT },
  };
}

export const MAGAZINE_PACKS: MagazineTemplate[] = RECIPES.map(buildPack);
