import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import { getBlogPostBySlug, BLOG_POSTS } from '@/data/blog';
import { logUserEvent } from '@/lib/analytics';

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const path = `/blog/${post.slug}`;
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: new URL(post.coverImage, 'https://printalarm.in').href,
    datePublished: post.publishDate,
    author: { '@type': 'Organization', name: BRAND_NAME },
    publisher: { '@type': 'Organization', name: BRAND_NAME },
    mainEntityOfPage: `https://printalarm.in${path}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://printalarm.in/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://printalarm.in/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://printalarm.in${path}` },
    ],
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <Seo
        title={`${post.title} | ${BRAND_NAME}`}
        description={post.excerpt}
        path={path}
        image={post.coverImage}
        jsonLd={[articleJsonLd, breadcrumbJsonLd]}
      />

      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-xs text-gray-400 space-x-1.5">
          <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-luxury-gold transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-luxury-accent font-medium">{post.title}</span>
        </div>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
            {new Date(post.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-luxury-accent">{post.title}</h1>
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[11px] uppercase tracking-wide font-semibold text-luxury-gold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="aspect-video w-full rounded-xl overflow-hidden glass-card-gold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <img src={post.coverImage} alt={post.coverAlt} className="w-full h-full object-cover" decoding="async" fetchPriority="high" />
        </motion.div>

        <motion.div
          className="glass-card-gold policy-content p-6 md:p-10 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {post.content.map((block, i) => {
            if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>;
            if (block.type === 'ul') return (
              <ul key={i}>
                {block.items?.map((item) => <li key={item}>{item}</li>)}
              </ul>
            );
            return <p key={i}>{block.text}</p>;
          })}
        </motion.div>

        {related.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-semibold text-luxury-accent">More Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  onClick={() => logUserEvent('CLICK_BLOG_RELATED', { slug: r.slug, fromSlug: post.slug })}
                  className="glass-card-gold rounded-xl p-4 hover:border-luxury-gold/60 transition-colors"
                >
                  <p className="text-sm font-semibold text-luxury-accent">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pt-4">
          <Link to="/templates" onClick={() => logUserEvent('CLICK_BLOGPOST_EXPLORE')} className="btn-glass btn-glass-gold">
            Explore Our Designs <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
