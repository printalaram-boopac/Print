import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Award } from 'lucide-react';
import Seo from '@/components/Seo';
import { BRAND_NAME } from '@/lib/brand';
import { logUserEvent } from '@/lib/analytics';

const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND_NAME,
  url: 'https://printalarm.in/',
  foundingDate: '2023',
  foundingLocation: 'Surat, Gujarat, India',
  description: 'Custom design & print studio for personalized Shagun covers and wedding money envelopes.',
  sameAs: [
    'https://www.instagram.com/printalarm5/',
    'https://www.facebook.com/profile.php?id=61591651010384&sk=directory_intro',
    'https://www.youtube.com/@Printalarm',
  ],
};

export default function About() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <Seo
        title={`About Us | ${BRAND_NAME}`}
        description="Printalarm is a Surat, Gujarat-based print studio crafting personalized Shagun covers and wedding money envelopes, shipped pan-India since 2023."
        path="/about"
        jsonLd={[ORG_JSON_LD]}
      />

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-xs text-gray-400 space-x-1.5">
          <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-luxury-accent font-medium">About Us</span>
        </div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold text-luxury-accent">
            About <span className="text-gold-gradient">Printalarm</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Printalarm — Shagun Couture is a custom design & print studio based in Surat, Gujarat, founded in 2023
            to bring premium, personalized Shagun covers and wedding money envelopes to families across India.
            What started as a small local print shop has grown into a pan-India service, handcrafting covers for
            weddings, Griha Pravesh, Swaminarayan and Sacred Tradition ceremonies, and festive gifting.
          </p>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Every design is printed on premium 210 GSM art card with HD, waterproof ink, with optional gold foil
            stamping and matte lamination — then personalized with your names, blessing text, and photos before
            it ships. Orders can be placed directly on this site or over WhatsApp, with most orders dispatched
            within 72 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="glass-card-gold rounded-xl p-5 space-y-2 text-center">
            <Calendar className="w-5 h-5 text-luxury-gold mx-auto" strokeWidth={2} />
            <p className="text-sm font-semibold text-luxury-accent">Founded 2023</p>
            <p className="text-xs text-gray-500">Surat, Gujarat</p>
          </div>
          <div className="glass-card-gold rounded-xl p-5 space-y-2 text-center">
            <MapPin className="w-5 h-5 text-luxury-gold mx-auto" strokeWidth={2} />
            <p className="text-sm font-semibold text-luxury-accent">Pan-India Delivery</p>
            <p className="text-xs text-gray-500">3-5 business days</p>
          </div>
          <div className="glass-card-gold rounded-xl p-5 space-y-2 text-center">
            <Award className="w-5 h-5 text-luxury-gold mx-auto" strokeWidth={2} />
            <p className="text-sm font-semibold text-luxury-accent">5,000+ Orders</p>
            <p className="text-xs text-gray-500">Delivered with love</p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link to="/templates" onClick={() => logUserEvent('CLICK_ABOUT_EXPLORE')} className="btn-glass btn-glass-gold">
            Explore Our Designs
          </Link>
        </div>
      </div>
    </div>
  );
}
