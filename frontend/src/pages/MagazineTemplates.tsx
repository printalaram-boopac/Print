import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import MagazineLibrary from '@/features/magazine/components/library/MagazineLibrary';
import { useMagazineFonts } from '@/features/magazine/fonts';
import { TEMPLATE_INDEX } from '@/features/magazine/templates';

/** Browse, search and filter the magazine template library. */
export default function MagazineTemplates() {
  useMagazineFonts();

  return (
    <div className="min-h-screen px-4 pb-20 pt-28">
      <Seo
        title={`Magazine Templates | Free Editable Magazine Maker — ${BRAND_NAME}`}
        description={`Browse ${TEMPLATE_INDEX.length} original magazine templates — fashion, business, travel, food, photography and more. Edit every page online and export a print-ready PDF.`}
        path="/magazine"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Magazine Templates',
            description: 'Original, fully editable magazine templates with an online page editor and PDF export.',
            url: 'https://printalarm.in/magazine',
          },
        ]}
      />

      <div className="mx-auto max-w-7xl space-y-12">
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="section-badge-plain justify-center">
            <BookOpen className="h-3.5 w-3.5" /> Magazine Studio
          </p>
          <h1 className="font-display text-3xl font-bold md:text-5xl">
            Magazine <span className="text-gold-gradient">Templates</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-400 md:text-base">
            Pick a design, then change anything — text, fonts, colours, photos, pages. Every template is
            fully editable and exports as a print-ready PDF.
          </p>
        </motion.div>

        <MagazineLibrary />
      </div>
    </div>
  );
}
