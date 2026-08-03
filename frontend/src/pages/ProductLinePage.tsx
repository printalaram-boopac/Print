import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { TEMPLATES, getTemplateSlug } from '@/data/templates';
import { ProductLine } from '@/data/productLines';
import TemplateCard from '@/components/TemplateCard';
import Seo from '@/components/Seo';
import { logUserEvent } from '@/lib/analytics';

interface ProductLinePageProps {
  line: ProductLine;
}

export default function ProductLinePage({ line }: ProductLinePageProps) {
  const designs = TEMPLATES.filter((t) => t.coverType === line.coverType);
  const path = `/${line.slug}`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://printalarm.in/' },
      { '@type': 'ListItem', position: 2, name: line.navLabel, item: `https://printalarm.in${path}` },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: line.navLabel,
    itemListElement: designs.slice(0, 20).map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://printalarm.in/design/${getTemplateSlug(t)}`,
      name: t.title,
    })),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: line.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <Seo
        title={line.seoTitle}
        description={line.seoDescription}
        path={path}
        jsonLd={[breadcrumbJsonLd, itemListJsonLd, faqJsonLd]}
      />

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 space-x-1.5">
          <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-luxury-accent font-medium">{line.navLabel}</span>
        </div>

        {/* Hero */}
        <motion.div
          className="text-center space-y-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs md:text-sm tracking-[0.2em] text-luxury-gold font-semibold uppercase">
            {line.sizeSpec}
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-luxury-accent">
            {line.h1}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">{line.tagline}</p>
          <p className="text-sm font-semibold text-luxury-accent leading-relaxed pt-2">{line.quotableFact}</p>
          <p className="text-sm text-gray-400 leading-relaxed pt-2">{line.description}</p>
          <p className="text-xs text-luxury-gold font-semibold uppercase tracking-wide pt-1">
            Best for: <span className="text-gray-400 normal-case font-normal">{line.bestFor}</span>
          </p>
        </motion.div>

        {/* Pricing tiers */}
        <div className="glass-card-gold rounded-xl p-6 md:p-8 max-w-2xl mx-auto space-y-5">
          <h2 className="text-xl md:text-2xl font-display font-semibold text-luxury-accent text-center">
            Pricing
          </h2>
          <div className="divide-y divide-gold-200/30">
            {line.pricingTiers.map((tier) => (
              <div key={tier.qty} className="flex items-center justify-between py-3.5 gap-4">
                <div>
                  <p className="text-sm font-semibold text-luxury-accent">{tier.qty}</p>
                  {tier.note && <p className="text-xs text-gray-500 mt-0.5">{tier.note}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gold-gradient">{tier.unitPrice}</p>
                  {tier.total && <p className="text-xs text-gray-500">{tier.total}</p>}
                </div>
              </div>
            ))}
          </div>
          <ul className="space-y-2 pt-2 border-t border-gold-200/30">
            {['Premium 210 GSM art card, HD waterproof printing', 'Custom names, blessing text & photo upload', 'Pan-India delivery in 3-5 business days'].map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs text-gray-400">
                <Check className="w-3.5 h-3.5 text-luxury-gold flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Designs grid */}
        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-luxury-accent">
            {line.navLabel} <span className="text-gold-gradient">Designs</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {designs.map((design, i) => (
              <TemplateCard key={design.id} template={design} index={i} showWhatsApp />
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-luxury-accent">
            Frequently Asked Questions
          </h2>
          <div className="glass-panel rounded-xl p-6 md:p-8 divide-y divide-gold-200/20">
            {line.faqs.map((faq) => (
              <div key={faq.q} className="py-4 first:pt-0 last:pb-0">
                <p className="text-sm font-semibold text-luxury-accent">{faq.q}</p>
                <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/templates" onClick={() => logUserEvent('CLICK_PRODUCT_LINE_EXPLORE_ALL', { line: line.slug })} className="btn-glass btn-glass-gold">
            Explore All 100+ Designs <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
