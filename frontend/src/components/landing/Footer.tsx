import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { asset } from '@/lib/asset';

export default function Footer() {
  return (
    <footer className="border-t border-gold-200 pt-16 pb-8 px-4 bg-luxury-accent text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={asset('logo.png')} alt="Printalarm Logo" className="h-10 w-auto rounded-md" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-lg font-display font-bold text-white tracking-wide">Printalarm</span>
                <span className="text-[8px] tracking-[0.25em] font-semibold text-luxury-gold uppercase mt-0.5">
                  Shagun Couture
                </span>
              </div>
            </Link>
          </div>

          {/* Policies */}
          <div className="space-y-3">
            <h4 className="text-xs text-luxury-gold uppercase tracking-widest font-semibold">Policies</h4>
            <div className="flex flex-col gap-3">
              <Link to="/return-exchange" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">Return & Exchange</Link>
              <Link to="/privacy-policy" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">Terms & Conditions</Link>
              <Link to="/shipping-policy" className="text-sm text-gray-300 hover:text-luxury-gold transition-colors">Shipping Policy</Link>
            </div>
          </div>

          {/* Get In Touch */}
          <div className="space-y-3">
            <h4 className="text-xs text-luxury-gold uppercase tracking-widest font-semibold">Get In Touch</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+919904551144" className="flex items-center gap-2 text-sm text-gray-300 hover:text-luxury-gold transition-colors cursor-pointer">
                <Phone className="w-4 h-4 text-luxury-gold" strokeWidth={2} /> +91 99045 51144
              </a>
              <a href="mailto:support@printalarm.in" className="flex items-center gap-2 text-sm text-gray-300 hover:text-luxury-gold transition-colors cursor-pointer">
                <Mail className="w-4 h-4 text-luxury-gold" strokeWidth={2} /> support@printalarm.in
              </a>
              <span className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-luxury-gold" strokeWidth={2} /> Surat, Gujarat, India
              </span>
            </div>
          </div>
        </div>

        <div className="gold-divider mb-6" />
        <p className="text-[11px] text-gray-400 text-center">© 2026 Printalarm • Crafted with love for Indian weddings</p>
      </div>
    </footer>
  );
}
