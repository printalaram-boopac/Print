import { build } from 'esbuild';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const SITE_URL = 'https://printalarm.in';

// templates.ts pulls in asset() which reads import.meta.env.BASE_URL — stub it
// so we can bundle+eval the data module outside of a Vite context.
const result = await build({
  entryPoints: [resolve(root, 'src/data/templates.ts')],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  define: { 'import.meta.env.BASE_URL': '"/"' },
  alias: { '@': resolve(root, 'src') },
});

const code = result.outputFiles[0].text;
const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const { TEMPLATES, getTemplateSlug } = mod;

const blogResult = await build({
  entryPoints: [resolve(root, 'src/data/blog.ts')],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  define: { 'import.meta.env.BASE_URL': '"/"' },
  alias: { '@': resolve(root, 'src') },
});
const blogCode = blogResult.outputFiles[0].text;
const blogMod = await import(`data:text/javascript;base64,${Buffer.from(blogCode).toString('base64')}`);
const { BLOG_POSTS } = blogMod;

const staticUrls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/shagun-money-covers', changefreq: 'daily', priority: '0.95' },
  { loc: '/acrylic-money-covers', changefreq: 'daily', priority: '0.95' },
  { loc: '/photo-zine-maker', changefreq: 'daily', priority: '0.95' },
  { loc: '/magazine-maker', changefreq: 'daily', priority: '0.95' },
  { loc: '/templates', changefreq: 'weekly', priority: '0.9' },
  { loc: '/pocket-money-covers', changefreq: 'weekly', priority: '0.9' },
  { loc: '/how-to-choose-a-shagun-cover', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.7' },
  { loc: '/designer', changefreq: 'monthly', priority: '0.7' },
  { loc: '/about', changefreq: 'monthly', priority: '0.5' },
  { loc: '/return-exchange', changefreq: 'yearly', priority: '0.3' },
  { loc: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/terms-conditions', changefreq: 'yearly', priority: '0.3' },
  { loc: '/shipping-policy', changefreq: 'yearly', priority: '0.3' },
];

const designUrls = TEMPLATES.map((t) => ({
  loc: `/design/${getTemplateSlug(t)}`,
  changefreq: 'monthly',
  priority: '0.8',
}));

const blogUrls = BLOG_POSTS.map((p) => ({
  loc: `/blog/${p.slug}`,
  changefreq: 'monthly',
  priority: '0.6',
}));

const allUrls = [...staticUrls, ...designUrls, ...blogUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
console.log(
  `sitemap.xml generated with ${allUrls.length} URLs (${designUrls.length} designs, ${blogUrls.length} blog posts).`
);
