import { Link } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { asset } from '@/lib/asset';
import { logUserEvent } from '@/lib/analytics';

const SOCIAL_LINKS = [
  { href: 'https://www.instagram.com/printalarm5/', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.facebook.com/profile.php?id=61591651010384&sk=directory_intro', icon: Facebook, label: 'Facebook' },
  { href: 'https://www.youtube.com/@Printalarm', icon: Youtube, label: 'YouTube' },
];

const EXPLORE_LINKS = [
  { to: '/shagun-money-covers', label: 'Shagun Money Covers' },
  { to: '/pocket-money-covers', label: 'Pocket Money Covers' },
  { to: '/photo-zine-maker', label: 'Photo Zine Studio' },
  { to: '/magazine-maker', label: 'Magazine Maker' },
  { to: '/how-to-choose-a-shagun-cover', label: 'How to Choose a Shagun Cover' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About Us' },
];

const POLICY_LINKS = [
  { to: '/return-exchange', label: 'Return & Exchange' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-conditions', label: 'Terms & Conditions' },
  { to: '/shipping-policy', label: 'Shipping Policy' },
];

export default function Footer() {
  const lenis = useLenis();

  const scrollToTop = () => {
    logUserEvent('CLICK_FOOTER_LOGO');
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="border-t border-gold-200 pt-16 pb-8 px-4 bg-luxury-accent text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2.5 cursor-pointer">
              <img src={asset('logo.png')} alt="Printalarm Logo" className="h-10 w-10 object-contain rounded-xl" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-lg md:text-xl font-display font-bold text-white tracking-wide">Printalarm</span>
                <span className="text-[8px] tracking-[0.25em] font-semibold text-luxury-gold uppercase mt-0.5">
                  Shagun Couture
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 text-center md:text-left max-w-xs">
              Hand-crafted wedding money covers personalized for your most sacred celebrations.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  onClick={() => logUserEvent('CLICK_FOOTER_SOCIAL', { platform: social.label })}
                  className="w-9 h-9 rounded-full border border-luxury-gold/40 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-luxury-accent transition-colors cursor-pointer"
                >
                  <social.icon className="w-4 h-4" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h4 className="text-xs text-luxury-gold uppercase tracking-widest font-semibold">Explore</h4>
            <div className="flex flex-col gap-3">
              {EXPLORE_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => logUserEvent('CLICK_FOOTER_LINK', { label: link.label, to: link.to })}
                  className="text-sm text-gray-300 hover:text-luxury-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-3">
            <h4 className="text-xs text-luxury-gold uppercase tracking-widest font-semibold">Policies</h4>
            <div className="flex flex-col gap-3">
              {POLICY_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => logUserEvent('CLICK_FOOTER_POLICY_LINK', { label: link.label, to: link.to })}
                  className="text-sm text-gray-300 hover:text-luxury-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Get In Touch */}
          <div className="space-y-3">
            <h4 className="text-xs text-luxury-gold uppercase tracking-widest font-semibold">Get In Touch</h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+919904551144"
                onClick={() => logUserEvent('CLICK_FOOTER_PHONE')}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-luxury-gold transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-luxury-gold" strokeWidth={2} /> +91 99045 51144
              </a>
              <a
                href="mailto:support@printalarm.in"
                onClick={() => logUserEvent('CLICK_FOOTER_EMAIL')}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-luxury-gold transition-colors cursor-pointer"
              >
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
