import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import { PRODUCT_LINES } from '@/data/productLines';
import { logUserEvent } from '@/lib/analytics';

const PATH = '/how-to-choose-a-shagun-cover';
const TITLE = `How to Choose the Perfect Shagun Cover for Your Wedding | ${BRAND_NAME}`;
const DESCRIPTION = 'Standard vs pocket Shagun covers compared — size, price, and best use case — to help you pick the right personalized money cover for your wedding or celebration.';

const ARTICLE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Choose the Perfect Shagun Cover for Your Wedding',
  description: DESCRIPTION,
  author: { '@type': 'Organization', name: BRAND_NAME },
  publisher: { '@type': 'Organization', name: BRAND_NAME },
  mainEntityOfPage: `https://printalarm.in${PATH}`,
};

const BREADCRUMB_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://printalarm.in/' },
    { '@type': 'ListItem', position: 2, name: 'How to Choose a Shagun Cover', item: `https://printalarm.in${PATH}` },
  ],
};

const TIPS = [
  { q: 'Traditional wedding or bulk gifting?', a: 'The standard Shagun money cover (6.5" x 3.5") is the classic choice — it fits every Indian currency note and is the most budget-friendly for bulk orders of 100+.' },
  { q: 'Want something more compact?', a: 'The pocket money cover (4" x 3") offers the same premium print quality in a sleeker size — ideal for smaller cash gifts or everyday blessings.' },
  { q: 'Ordering in bulk for a wedding?', a: 'Both standard and pocket covers drop to ₹10/pc at 100+ pieces, and orders of 100+ also qualify for 10 free covers.' },
];

export default function ShagunCoverGuide() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <Seo title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={[ARTICLE_JSON_LD, BREADCRUMB_JSON_LD]} />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-xs text-gray-400 space-x-1.5">
          <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-luxury-accent font-medium">How to Choose a Shagun Cover</span>
        </div>

        <motion.div
          className="text-center space-y-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold text-luxury-accent">
            How to Choose the Perfect <span className="text-gold-gradient">Shagun Cover</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Standard money cover or pocket cover? Here's a straight comparison of size, price, and
            best use case to help you pick the right personalized Shagun cover for your wedding or celebration.
          </p>
        </motion.div>

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse glass-card-gold rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="border-b border-gold-200/40 text-left">
                <th className="p-4 font-display font-semibold text-luxury-accent">Type</th>
                <th className="p-4 font-display font-semibold text-luxury-accent">Size</th>
                <th className="p-4 font-display font-semibold text-luxury-accent">Starting Price</th>
                <th className="p-4 font-display font-semibold text-luxury-accent">Best Use Case</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCT_LINES.map((line) => (
                <tr key={line.slug} className="border-b border-gold-200/20 last:border-0">
                  <td className="p-4 font-semibold text-luxury-accent whitespace-nowrap">{line.navLabel}</td>
                  <td className="p-4 text-gray-400">{line.sizeSpec}</td>
                  <td className="p-4 text-gold-gradient font-bold whitespace-nowrap">{line.pricingTiers[0].unitPrice}</td>
                  <td className="p-4 text-gray-400">
                    {line.bestFor}
                    <Link
                      to={`/${line.slug}`}
                      onClick={() => logUserEvent('CLICK_GUIDE_PRODUCT_LINK', { line: line.slug })}
                      className="block mt-1.5 text-xs text-luxury-gold hover:underline"
                    >
                      View {line.navLabel} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Decision tips */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-luxury-accent">
            Quick Decision Guide
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TIPS.map((tip) => (
              <div key={tip.q} className="glass-card-gold rounded-xl p-5 space-y-2">
                <p className="text-sm font-semibold text-luxury-accent flex items-start gap-2">
                  <Check className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  {tip.q}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed pl-6">{tip.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/templates" onClick={() => logUserEvent('CLICK_GUIDE_BROWSE_ALL')} className="btn-glass btn-glass-gold">
            Browse All Designs <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
