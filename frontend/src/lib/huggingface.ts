// Calls Hugging Face's Inference API directly from the browser (no backend
// required). API keys are bundled into the public build at build time —
// this is a deliberate tradeoff the user chose over running a backend.
// NOTE: black-forest-labs/FLUX.1-schnell (Apache 2.0, commercially safe) would
// be the better model for this, but it returns HTTP 410 "deprecated" on the
// hf-inference provider as of this writing — not available via this free
// endpoint. Reverted to SD3-medium, which is confirmed working here.
const HF_MODEL = 'stabilityai/stable-diffusion-3-medium-diffusers';
const HF_ENDPOINT = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

// Supports multiple tokens (VITE_HUGGINGFACE_API_KEYS, comma/newline-separated)
// so that when one token gets rate-limited, the next request automatically
// rotates to another token instead of failing outright. Falls back to the
// single VITE_HUGGINGFACE_API_KEY for backwards compatibility.
function getApiKeys(): string[] {
  const multi = (import.meta.env.VITE_HUGGINGFACE_API_KEYS as string | undefined) || '';
  const single = (import.meta.env.VITE_HUGGINGFACE_API_KEY as string | undefined) || '';
  const keys = [...multi.split(/[,\n]/), single].map((k) => k.trim()).filter(Boolean);
  return Array.from(new Set(keys));
}

// Round-robins the starting token across calls (rather than always starting
// from key 0) so repeated generations spread load across all configured
// tokens instead of hammering the first one until it's exhausted.
let rotationOffset = 0;

// Shared premium-quality baseline appended to every background request —
// modeled on a real premium-photobook design brief (pure ivory background,
// gold botanical line art, minimal Swiss-editorial spacing) so every topic
// gets the same high-end look instead of a plain gradient/pattern fill.
const PREMIUM_QUALITY_SUFFIX =
  'premium luxury hardcover photobook background art, pure white or ivory background with subtle warm texture, ' +
  'large clean negative space, minimal Swiss editorial design, soft gold botanical line illustrations, ' +
  'delicate gold leaf sprig corner accents, fine gold divider lines, tiny outlined gold heart accents, ' +
  'soft ivory watercolor brush-stroke framing along the edges, soft beige watercolor brush texture, ' +
  'no text, no lettering, no words, no watermark, no logo, ' +
  'no people, no faces, no portraits, no human figures, no photographs of people, no photographs of objects, ' +
  'leave the center of the composition empty and uncluttered — decorative border and corner elements only, ' +
  'no bright colors, no cartoon style, no heavy decoration, no stickers, no childish elements, ' +
  'no gradients, no glossy effects, no fake AI look, no collage clutter, ' +
  'ultra realistic, print-ready quality, professional editorial photography, 8k, sharp focus';

export async function generateAiCoverImage(prompt: string): Promise<string> {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error('AI cover generation is not configured.');
  }

  const styledPrompt = `${prompt.trim()}, ${PREMIUM_QUALITY_SUFFIX}`;
  const startIndex = rotationOffset % keys.length;
  rotationOffset++;

  let lastErrorMessage = 'AI image generation failed. Please try again.';

  for (let i = 0; i < keys.length; i++) {
    const apiKey = keys[(startIndex + i) % keys.length];
    try {
      const res = await fetch(HF_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: styledPrompt }),
      });

      if (!res.ok) {
        if (res.status === 503) lastErrorMessage = 'The AI model is warming up — please try again in about 20 seconds.';
        // 429 (rate limited) / 401 / 403 (token exhausted or invalid) — try the next token.
        continue;
      }

      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read generated image.'));
        reader.readAsDataURL(blob);
      });
    } catch {
      // Network error on this token — try the next one.
      continue;
    }
  }

  throw new Error(lastErrorMessage);
}

// Premium hand-written chapter titles/quotes as a safety net — used whenever
// the text model is unavailable, rate-limited, or returns something that
// doesn't parse, so "auto-design" never comes back empty.
const FALLBACK_PAGE_CONTENT: MagazinePageContent[] = [
  { chapterLabel: 'CHAPTER 01', title: 'Every Memory Has a Story', quote: 'Some moments become memories, and those memories become our treasure forever.' },
  { chapterLabel: 'CHAPTER 02', title: "Moments We'll Never Forget", quote: 'Happiness is spending time with people who feel like home.' },
  { chapterLabel: 'CHAPTER 03', title: 'Written With Love', quote: 'No matter where life takes us, you will always have a special place in my heart.' },
  { chapterLabel: 'CHAPTER 04', title: 'Our Best Days Together', quote: 'Good times plus the right people equals amazing memories.' },
  { chapterLabel: 'CHAPTER 05', title: 'Little Moments, Big Love', quote: 'It is the little things that turn into the biggest memories.' },
  { chapterLabel: 'CHAPTER 06', title: 'A Story Worth Keeping', quote: 'Some people bring a smile so bright, they light up every memory.' },
  { chapterLabel: 'CHAPTER 07', title: 'Made of Golden Days', quote: 'Every picture holds a thousand words of love.' },
  { chapterLabel: 'THANK YOU', title: 'Made With Love, Just for You', quote: 'Families are connected by love, not distance.' },
];

export interface MagazinePageContent {
  chapterLabel: string;
  title: string;
  quote: string;
}

const HF_TEXT_MODEL = 'mistralai/Mistral-7B-Instruct-v0.3';
const HF_TEXT_ENDPOINT = `https://router.huggingface.co/hf-inference/models/${HF_TEXT_MODEL}`;

// Asks an instruction-tuned open model (hosted on Hugging Face) to write the
// chapter titles/quotes for every page of the magazine, themed around
// whatever the user picked (e.g. "Wedding", "Friendship"). Falls back to a
// curated premium set if the model is unavailable or the response doesn't
// parse as valid JSON, so the feature always produces something usable.
export async function generateMagazineText(theme: string, pageCount: number): Promise<MagazinePageContent[]> {
  const fallback = () => Array.from({ length: pageCount }, (_, i) => FALLBACK_PAGE_CONTENT[i % FALLBACK_PAGE_CONTENT.length]);
  const keys = getApiKeys();
  if (keys.length === 0) return fallback();

  const prompt = `[INST] You are a premium photobook designer writing the text content for a personalized mini photo magazine themed around "${theme}". Write exactly ${pageCount} pages. Each page needs: a short chapter label (e.g. "CHAPTER 01", or "THANK YOU" for the last page), a short elegant title (4-6 words, like a magazine chapter heading), and a one-sentence heartfelt quote. Respond with ONLY a JSON array of ${pageCount} objects, each with keys "chapterLabel", "title", "quote". No other text before or after the JSON. [/INST]`;

  const startIndex = rotationOffset % keys.length;
  rotationOffset++;

  for (let i = 0; i < keys.length; i++) {
    const apiKey = keys[(startIndex + i) % keys.length];
    try {
      const res = await fetch(HF_TEXT_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 1000, temperature: 0.85, return_full_text: false },
        }),
      });
      if (!res.ok) continue;

      const data = await res.json();
      const text: string | undefined = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
      const match = text?.match(/\[[\s\S]*\]/);
      if (!match) continue;

      const parsed = JSON.parse(match[0]);
      if (!Array.isArray(parsed) || parsed.length === 0) continue;

      return Array.from({ length: pageCount }, (_, idx) => {
        const p = parsed[idx % parsed.length] || {};
        const fb = FALLBACK_PAGE_CONTENT[idx % FALLBACK_PAGE_CONTENT.length];
        return {
          chapterLabel: p.chapterLabel || fb.chapterLabel,
          title: p.title || fb.title,
          quote: p.quote || fb.quote,
        };
      });
    } catch {
      continue;
    }
  }

  return fallback();
}
