import { Router, Request, Response } from 'express';

const router = Router();
// Hugging Face's classic api-inference.huggingface.co host is retired; requests
// now go through the router, and only a small set of models are still served
// by the free "hf-inference" provider for text-to-image (checked against
// huggingface.co/models?inference_provider=hf-inference&pipeline_tag=text-to-image).
const HF_MODEL = 'stabilityai/stable-diffusion-3-medium-diffusers';
const HF_ENDPOINT = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

/** POST /api/ai/generate-cover — generate a magazine cover background via Hugging Face text-to-image */
router.post('/generate-cover', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ status: 'error', message: 'A style/theme prompt is required.' });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ status: 'error', message: 'AI cover generation is not configured on this server.' });
    }

    const styledPrompt = `${prompt.trim()}, elegant magazine cover background art, decorative pattern, no text, no watermark, high quality, professional photography`;

    const hfRes = await fetch(HF_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: styledPrompt }),
    });

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      console.error('Hugging Face API error:', hfRes.status, errText);
      const isLoading = hfRes.status === 503;
      return res.status(502).json({
        status: 'error',
        message: isLoading
          ? 'The AI model is warming up — please try again in about 20 seconds.'
          : 'AI image generation failed. Please try again.',
      });
    }

    const contentType = hfRes.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await hfRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return res.json({ status: 'ok', image: `data:${contentType};base64,${base64}` });
  } catch (error: any) {
    console.error('AI cover generation error:', error);
    return res.status(500).json({ status: 'error', message: 'Something went wrong generating the cover.' });
  }
});

export default router;
