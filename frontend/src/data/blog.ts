import { asset } from '@/lib/asset';

export interface BlogBlock {
  type: 'p' | 'h2' | 'ul';
  text?: string;
  items?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishDate: string; // ISO YYYY-MM-DD
  tags: string[];
  coverImage: string;
  coverAlt: string;
  content: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'shagun-amount-guide-by-region',
    title: 'Shagun Amount Guide: What to Gift by Region & Occasion',
    excerpt: "A practical guide to deciding how much Shagun to gift at Indian weddings, from close family to colleagues, and why the amount is almost always an odd number.",
    publishDate: '2026-06-10',
    tags: ['Shagun Etiquette', 'Wedding Guide'],
    coverImage: asset('card-2.jpeg'),
    coverAlt: 'Illustrated save-the-date style Shagun cover with peacock, parrot, and floral wreath',
    content: [
      { type: 'p', text: "One of the most common questions before any Indian wedding is: how much Shagun should I give? There's no single fixed answer — the right amount depends on your relationship with the couple, your community's customs, and the occasion — but a few widely followed conventions can help you decide with confidence." },
      { type: 'h2', text: 'The ₹1 Rule — Why Amounts Are Always Odd' },
      { type: 'p', text: "Across most Indian communities — Gujarati, Marwari, Punjabi, and South Indian traditions alike — Shagun amounts are given as an odd number, typically by adding ₹1 to a round figure: ₹101, ₹501, ₹1,001, ₹2,501, and so on. The extra rupee is considered auspicious, symbolizing continuity and growth rather than a 'closed' or final sum." },
      { type: 'h2', text: 'A Rough Guide by Relationship' },
      { type: 'ul', items: [
        'Close family (parents, siblings, grandparents): typically the largest gifts, ranging from ₹5,001 to ₹21,001 or more, depending on family means and tradition.',
        'Extended family (aunts, uncles, cousins): commonly ₹1,001 to ₹5,001.',
        'Close friends: often ₹501 to ₹2,101.',
        'Colleagues, acquaintances, and neighbors: usually ₹101 to ₹501.',
      ]},
      { type: 'p', text: "These are general ranges, not rules — what matters far more than the amount is presenting it with a personalized touch. A Shagun cover with the couple's names, a hand-picked design, and a written blessing is remembered long after the exact amount is forgotten." },
      { type: 'h2', text: 'Regional Variations Worth Knowing' },
      { type: 'p', text: "In Gujarati and Marwari business families, Shagun amounts can run higher and are sometimes recorded in a formal ledger (chithi) for reciprocal gifting at future events. In many South Indian weddings, gifts are given during specific rituals rather than at the entrance, and coconuts or fruit are often included alongside cash. Punjabi weddings frequently involve larger, more visible Shagun exchanges as part of the sagan ceremony. When in doubt, it's always appropriate to ask a family member familiar with the specific community's customs." },
      { type: 'h2', text: 'Presentation Matters as Much as the Amount' },
      { type: 'p', text: "A personalized Shagun cover — printed with the couple's names, a chosen blessing, and a design that suits the occasion — turns a cash gift into a keepsake. At Printalarm, every cover can be customized with names, a message, and a photo, so the gift feels considered no matter the amount inside." },
    ],
  },
  {
    slug: 'wedding-envelope-etiquette-indian-culture',
    title: 'Wedding Envelope Etiquette in Indian Culture: A Complete Guide',
    excerpt: 'From when to hand over the Shagun cover to what to write inside it, here is a clear guide to money-gift etiquette at Indian weddings.',
    publishDate: '2026-06-24',
    tags: ['Wedding Etiquette', 'Shagun Etiquette'],
    coverImage: asset('IMG_8490.PNG'),
    coverAlt: 'Elegant lotus and gold-arch Shagun cover styled with a decorative lantern',
    content: [
      { type: 'p', text: "Giving money as a wedding gift is deeply rooted in Indian tradition, but the etiquette around it — when to give, what to write, how to present it — is often passed down informally and can feel unclear if you're attending your first big Indian wedding season." },
      { type: 'h2', text: 'When to Present the Shagun' },
      { type: 'p', text: "Most guests present their Shagun cover at the reception or during the blessing line, handing it directly to the couple or their parents. At many ceremonies, there's a designated moment — often right after the couple takes their seats on stage — when guests queue up to greet them and offer their gift together with congratulations." },
      { type: 'h2', text: 'What to Write Inside the Cover' },
      { type: 'p', text: "A short, warm blessing is customary — you don't need an elaborate message. Common phrasings include wishing the couple a lifelong bond, prosperity, and happiness. Many families personalize this further by printing the couple's names and a chosen blessing directly on the cover itself, which adds a thoughtful, ready-made touch without requiring guests to write anything by hand." },
      { type: 'h2', text: 'Cash vs. Cheque vs. UPI' },
      { type: 'p', text: "Physical cash inside a decorated cover remains the most traditional and widely appreciated format, especially for the ceremonial handover in front of family. Bank transfers and UPI are increasingly common for guests who can't attend in person, but even then, many choose to also send a printed Shagun cover as a keepsake or follow up with one in person later." },
      { type: 'h2', text: 'One Envelope Per Family, or Per Guest?' },
      { type: 'p', text: "For immediate or extended family attending together, it's common to give one combined Shagun on behalf of the household rather than one per individual. Friends and colleagues typically give individually unless attending as a couple, in which case a joint gift is standard." },
      { type: 'h2', text: 'Making the Gift Memorable' },
      { type: 'p', text: "Because the cash amount is largely private between guest and couple, the cover itself is what's seen, kept, and remembered. Choosing a design that matches the wedding's theme or the couple's personality — and personalizing it with their names — turns a customary gift into something that stands out among dozens of plain envelopes." },
    ],
  },
  {
    slug: 'top-shagun-cover-trends-2026',
    title: 'Top Shagun Cover Trends for 2026 Weddings',
    excerpt: "What's popular in personalized Shagun cover design this wedding season — from royal peacock motifs to sacred tradition themes and photo-personalized covers.",
    publishDate: '2026-07-08',
    tags: ['Design Trends', 'Wedding Guide'],
    coverImage: asset('card-2.jpeg'),
    coverAlt: 'Royal peacock pavilion Shagun cover with sky blue jharokha motifs',
    content: [
      { type: 'p', text: "Shagun covers have moved well past plain printed envelopes. This wedding season, personalization and cultural motifs are both trending strongly — here's what's popular in 2026." },
      { type: 'h2', text: '1. Royal Peacock & Jharokha Motifs' },
      { type: 'p', text: "Regal peacock imagery paired with ornate jharokha (arched window) framing continues to be one of the most requested design families — it reads as celebratory and distinctly Indian without feeling dated." },
      { type: 'h2', text: '2. Sacred Tradition Designs' },
      { type: 'p', text: "For Swaminarayan, Ganesha, Shrinathji, and other devotional themes, families increasingly choose covers that reflect their specific tradition rather than generic floral designs — a meaningful way to tie the gift to the family's faith and values." },
      { type: 'h2', text: '3. Photo-Personalized Covers' },
      { type: 'p', text: "Uploading a couple's photo directly onto the cover — rather than relying only on a printed design — has grown significantly, especially for close family and friends who want the gift to feel one-of-a-kind." },
      { type: 'h2', text: '4. Gold Foil & Matte Finishes' },
      { type: 'p', text: "Gold foil stamping on premium 210 GSM art card, finished with matte lamination, gives covers a tactile, premium feel that stands out compared to standard glossy print — increasingly the default choice rather than an upgrade." },
      { type: 'p', text: "Whichever style you choose, the common thread across 2026's trends is personalization: covers built around a specific family, tradition, or relationship, rather than one generic design used for every guest." },
    ],
  },
  {
    slug: 'photo-zine-studio-mini-magazine-guide',
    title: 'Introducing Photo Zine Studio: Turn Your Photos Into a Mini 8-Page Zine',
    excerpt: 'Upload 8 photos, arrange them in your browser, and print a single A4 sheet that folds into a pocket-sized photo zine — no stapling, no binding, completely free.',
    publishDate: '2026-08-30',
    tags: ['Photo Zine', 'New Feature', 'DIY Guide'],
    coverImage: '/zine-assembly/step-4-finished.png',
    coverAlt: 'A stack of finished 8-page photo zines, folded from a single printed A4 sheet',
    content: [
      { type: 'p', text: "Zines have quietly become one of the most personal ways to share a set of photos — a travel trip, a portfolio, a small gift for someone. Instead of a printed 4x6 stack or a digital album nobody opens twice, a zine is a tiny booklet people actually flip through. Our new Photo Zine Studio lets you build one from your own photos in minutes, right in your browser." },
      { type: 'h2', text: 'What Is an 8-Page Zine?' },
      { type: 'p', text: "It's a printing trick that's been used by DIY publishers for decades: lay out 8 pages on a single sheet of paper in a specific order and orientation, print it, then fold and make one short cut down the center. Unfold it the right way, and the single sheet becomes an 8-page booklet — cover, six inner pages, and a back cover — with no glue, staples, or binding required." },
      { type: 'h2', text: 'How Photo Zine Studio Works' },
      { type: 'ul', items: [
        'Upload — Add one photo per panel across all 8 pages, including a front and back cover.',
        'Arrange & Customize — Drag pages 2 through 7 into any order, choose how each image fits its frame, add borders or rounded corners, and pick a background color.',
        'Add a Title — Type a name or title onto the cover and back cover in one of eight fonts, with control over size, color, and position.',
        'Print & Fold — Export a high-resolution, print-ready PDF in landscape A4, then follow the built-in fold-and-cut guide to assemble the physical zine.',
      ]},
      { type: 'h2', text: 'One Sheet, Eight Pages, Zero Waste' },
      { type: 'p', text: "Because the whole zine comes from a single A4 sheet, there's nothing to bind and nothing to throw away. Print it at home, trim the margins a home printer can't reach, fold it in half, cut along the center fold, then fold it again into a cross — and it opens into a finished booklet ready to hand someone or keep on a shelf." },
      { type: 'h2', text: 'What People Are Making With It' },
      { type: 'ul', items: [
        'A pocket-sized travel diary from a recent trip.',
        'A mini portfolio of a photoshoot, handed out instead of a link.',
        'A personal keepsake gift for a friend or partner.',
        'A tiny event favor — a wedding, a birthday, a reunion — with photos guests can take home.',
      ]},
      { type: 'h2', text: 'Private by Design' },
      { type: 'p', text: "Every photo you upload is processed and composed locally in your browser, and the exported PDF is generated entirely on your device — nothing is uploaded anywhere. Photo Zine Studio is free to use, with no watermark, no account, and no limit on how many zines you create." },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
