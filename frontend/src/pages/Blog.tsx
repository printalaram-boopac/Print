import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import { BLOG_POSTS } from '@/data/blog';
import { logUserEvent } from '@/lib/analytics';

const PATH = '/blog';

export default function Blog() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.publishDate.localeCompare(a.publishDate));

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Printalarm Wedding Blog',
    itemListElement: posts.map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://printalarm.in/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <Seo
        title={`Wedding Blog | Shagun Etiquette, Trends & Guides — ${BRAND_NAME}`}
        description="Guides on Shagun amounts, wedding envelope etiquette, and Shagun cover design trends — from the Printalarm wedding blog."
        path={PATH}
        jsonLd={[itemListJsonLd]}
      />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-xs text-gray-400 space-x-1.5">
          <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-luxury-accent font-medium">Blog</span>
        </div>

        <motion.div
          className="text-center space-y-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs md:text-sm tracking-[0.2em] text-luxury-gold font-semibold uppercase">
            — Wedding Blog —
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-luxury-accent">
            Guides & <span className="text-gold-gradient">Wedding Etiquette</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Shagun amounts, gifting etiquette, and Shagun cover design trends for your wedding season.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                onClick={() => logUserEvent('CLICK_BLOG_CARD', { slug: post.slug })}
                className="group flex flex-col h-full glass-card-gold rounded-xl overflow-hidden hover:border-luxury-gold/60 transition-colors"
              >
                <div className="aspect-video w-full overflow-hidden bg-luxury-dark">
                  <img
                    src={post.coverImage}
                    alt={post.coverAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex flex-col flex-grow p-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <Calendar className="w-3 h-3" strokeWidth={2} />
                    {new Date(post.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="text-lg font-display font-semibold text-luxury-accent group-hover:text-luxury-gold transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed flex-grow">{post.excerpt}</p>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-luxury-gold">
                    Read More <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
