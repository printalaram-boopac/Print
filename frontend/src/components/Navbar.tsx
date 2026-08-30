import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Home, LayoutGrid, HelpCircle, ChevronDown, Inbox, Layers, Compass, BookOpen, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CustomDesignModal from '@/components/CustomDesignModal';
import { asset } from '@/lib/asset';
import { logUserEvent } from '@/lib/analytics';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/templates', label: 'Designs', icon: LayoutGrid },
  // { to: '/designer', label: '3D Studio', icon: Palette }, // Hidden for now
];

const EXPLORE_LINKS = [
  { to: '/shagun-money-covers', label: 'Shagun Money Covers', icon: Inbox },
  { to: '/pocket-money-covers', label: 'Pocket Money Covers', icon: Layers },
  { to: '/how-to-choose-a-shagun-cover', label: 'How to Choose a Shagun Cover', icon: Compass },
  { to: '/blog', label: 'Blog', icon: BookOpen },
  { to: '/about', label: 'About Us', icon: Info },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { firebaseUser, dbUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exploreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [exploreOpen]);

  const scrollToFaq = () => {
    setMobileOpen(false);
    if (pathname === '/') {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[150] glass-panel shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold rounded-lg p-1">
          <img src={asset('logo.png')} alt="Printalarm Logo" className="h-11 w-11 object-contain" />
          <div className="flex flex-col items-start leading-none">
            <span className="text-lg md:text-xl font-display font-bold text-luxury-accent tracking-wide transition-colors group-hover:text-luxury-gold">
              Printalarm
            </span>
            <span className="text-[8px] tracking-[0.25em] font-semibold text-luxury-gold uppercase mt-0.5">
              Shagun Couture
            </span>
          </div>
        </Link>

        {/* Desktop nav + right actions */}
        <div className="hidden md:flex items-center gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] uppercase tracking-widest font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold ${
                pathname === link.to
                  ? 'bg-luxury-accent text-white border-luxury-accent shadow-sm'
                  : 'bg-luxury-accent/5 text-[#6E5764] border-luxury-accent/15 hover:text-luxury-accent hover:border-luxury-accent/40'
              }`}
            >
              <link.icon className="w-3 h-3" strokeWidth={2} /> {link.label}
            </Link>
          ))}

          {/* Explore dropdown */}
          <div className="relative" ref={exploreRef}>
            <button
              type="button"
              onClick={() => setExploreOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] uppercase tracking-widest font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold ${
                exploreOpen
                  ? 'bg-luxury-accent text-white border-luxury-accent shadow-sm'
                  : 'bg-luxury-accent/5 text-[#6E5764] border-luxury-accent/15 hover:text-luxury-accent hover:border-luxury-accent/40'
              }`}
              aria-expanded={exploreOpen}
            >
              Explore <ChevronDown className={`w-3 h-3 transition-transform ${exploreOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
            </button>

            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gold-200/50 overflow-hidden py-2"
                >
                  {EXPLORE_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setExploreOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#6E5764] hover:bg-amber-50 hover:text-luxury-gold transition-colors cursor-pointer"
                    >
                      <link.icon className="w-4 h-4 text-luxury-gold flex-shrink-0" strokeWidth={2} /> {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={scrollToFaq}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] uppercase tracking-widest font-semibold transition-all bg-luxury-accent/5 text-[#6E5764] border-luxury-accent/15 hover:text-luxury-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold"
          >
            <HelpCircle className="w-3 h-3" strokeWidth={2} /> FAQ
          </button>

          <button
            type="button"
            onClick={() => {
              logUserEvent('CLICK_NAV_CUSTOM_REQUEST');
              setIsCustomOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-luxury-accent text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-300/60 hover:bg-luxury-gold hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-luxury-gold group-hover:text-white" strokeWidth={2} /> Custom Design
          </button>

          {/* WhatsApp mini */}
          <a
            href="https://wa.me/919904544702"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logUserEvent('CLICK_NAVBAR_WHATSAPP')}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600/10 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-600/25 hover:bg-green-600 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
          >
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={2} /> WhatsApp
          </a>

          {/* Auth indicator */}
          {firebaseUser && (
            <Link
              to="/dashboard"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-luxury-gold text-white text-[11px] font-bold uppercase hover:scale-110 transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold"
              title={dbUser?.name || firebaseUser.email || 'Dashboard'}
            >
              {(dbUser?.name || firebaseUser.email || 'U')[0]}
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-luxury-accent hover:text-luxury-gold p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold cursor-pointer"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gold-200/50 bg-white/95 overflow-hidden shadow-lg"
          >
            <div className="p-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 text-xs uppercase tracking-wider font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                    pathname === link.to ? 'bg-luxury-gold/10 text-luxury-gold' : 'text-[#6E5764] hover:text-luxury-gold hover:bg-gray-50'
                  }`}
                >
                  <link.icon className="w-4 h-4" strokeWidth={2} /> {link.label}
                </Link>
              ))}

              {/* Explore section */}
              <button
                type="button"
                onClick={() => setMobileExploreOpen((v) => !v)}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold py-2 px-3 rounded-lg text-[#6E5764] hover:bg-gray-50 cursor-pointer"
                aria-expanded={mobileExploreOpen}
              >
                <span>Explore</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileExploreOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
              </button>
              <AnimatePresence>
                {mobileExploreOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-2 space-y-1"
                  >
                    {EXPLORE_LINKS.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileExploreOpen(false);
                        }}
                        className={`flex items-center gap-2 text-xs uppercase tracking-wider font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                          pathname === link.to ? 'bg-luxury-gold/10 text-luxury-gold' : 'text-[#6E5764] hover:text-luxury-gold hover:bg-gray-50'
                        }`}
                      >
                        <link.icon className="w-4 h-4" strokeWidth={2} /> {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={scrollToFaq}
                className="w-full flex items-center gap-2 text-left text-xs uppercase tracking-wider font-semibold py-2 px-3 rounded-lg text-[#6E5764] hover:bg-gray-50 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" strokeWidth={2} /> FAQ
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  logUserEvent('CLICK_MOBILE_CUSTOM_REQUEST');
                  setIsCustomOpen(true);
                }}
                className="w-full flex items-center gap-2 text-left text-xs uppercase tracking-wider font-bold py-2.5 px-3 rounded-lg text-luxury-gold bg-amber-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" strokeWidth={2} /> Custom Design Request
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CustomDesignModal isOpen={isCustomOpen} onClose={() => setIsCustomOpen(false)} />
    </nav>
  );
}
