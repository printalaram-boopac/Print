import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog';
import { logUserEvent } from '@/lib/analytics';

const LATEST_POSTS = [...BLOG_POSTS].sort((a, b) => b.publishDate.localeCompare(a.publishDate)).slice(0, 3);

export default function BlogPreview() {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-badge-underline">— Wedding Blog —</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            Guides & <span className="text-gold-gradient">Wedding Etiquette</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Shagun amounts, gifting etiquette, and design trends to help you get it just right
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LATEST_POSTS.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                onClick={() => logUserEvent('CLICK_BLOG_PREVIEW_CARD', { slug: post.slug })}
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
                  <h3 className="text-base font-display font-semibold text-luxury-accent group-hover:text-luxury-gold transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-grow">{post.excerpt}</p>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-luxury-gold">
                    Read More <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center pt-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/blog" onClick={() => logUserEvent('CLICK_BLOG_PREVIEW_READ_ALL')} className="btn-glass btn-glass-gold">
            Read All Guides <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
