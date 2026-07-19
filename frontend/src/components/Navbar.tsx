import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Home, LayoutGrid, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CustomDesignModal from '@/components/CustomDesignModal';
import { asset } from '@/lib/asset';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/templates', label: 'Designs', icon: LayoutGrid },
  // { to: '/designer', label: 'Create' }, // Hidden for now
  // { to: '/dashboard', label: 'Dashboard' }, // Hidden for now
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { firebaseUser, dbUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

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
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
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

        {/* Desktop nav + right actions — single row, uniform spacing */}
        <div className="hidden md:flex items-center gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] uppercase tracking-widest font-semibold transition-all cursor-pointer ${pathname === link.to
                  ? 'bg-luxury-accent/5 text-luxury-accent border-luxury-accent/30'
                  : 'bg-luxury-accent/5 text-[#6E5764] border-luxury-accent/15 hover:text-luxury-accent'
                }`}
            >
              <link.icon className="w-3 h-3" strokeWidth={2} /> {link.label}
            </Link>
          ))}
          <button
            onClick={scrollToFaq}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] uppercase tracking-widest font-semibold transition-all bg-luxury-accent/5 text-[#6E5764] border-luxury-accent/15 hover:text-luxury-accent cursor-pointer"
          >
            <HelpCircle className="w-3 h-3" strokeWidth={2} /> FAQ
          </button>

          {/* Cart and Custom Design buttons hidden for now
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-1.5 px-4 py-2 bg-luxury-accent/5 text-luxury-accent text-[9px] font-bold uppercase tracking-wider rounded-full border border-luxury-accent/15 hover:bg-luxury-accent hover:text-white transition-all cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingCart className="w-3 h-3" strokeWidth={2} /> Cart
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-luxury-gold text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-sm"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          <button
            onClick={() => setIsCustomOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-luxury-accent/5 text-luxury-accent text-[9px] font-bold uppercase tracking-wider rounded-full border border-luxury-accent/15 hover:bg-luxury-accent hover:text-white transition-all cursor-pointer"
          >
            <Sparkles className="w-3 h-3" strokeWidth={2} /> Custom Design
          </button>
          */}

          {/* WhatsApp mini */}
          <a
            href="https://wa.me/919904544702"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600/10 text-green-700 text-[9px] font-bold uppercase tracking-wider rounded-full border border-green-600/25 hover:bg-green-600 hover:text-white transition-all cursor-pointer"
          >
            <MessageCircle className="w-3 h-3" strokeWidth={2} /> WhatsApp
          </a>

          {/* Auth indicator */}
          {firebaseUser ? (
            <Link to="/dashboard"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-luxury-gold text-white text-[11px] font-bold uppercase hover:scale-110 transition-transform cursor-pointer"
              title={dbUser?.name || firebaseUser.email || 'Dashboard'}>
              {(dbUser?.name || firebaseUser.email || 'U')[0]}
            </Link>
          ) : (
            // Login button hidden for now
            // <Link to="/auth"
            //   className="flex items-center gap-1.5 px-4 py-2 bg-luxury-accent text-white text-[9px] font-bold uppercase tracking-wider rounded-full hover:bg-luxury-accent/80 transition-all">
            //   Login
            // </Link>
            null
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-luxury-accent hover:text-luxury-gold cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            className="md:hidden border-t border-gold-200/50 bg-white/95 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold py-2 transition-colors cursor-pointer ${pathname === link.to ? 'text-luxury-gold' : 'text-[#6E5764] hover:text-luxury-gold'
                    }`}
                >
                  <link.icon className="w-3.5 h-3.5" strokeWidth={2} /> {link.label}
                </Link>
              ))}
              <button
                onClick={scrollToFaq}
                className="w-full flex items-center gap-1.5 text-left text-xs uppercase tracking-wider font-semibold py-2 text-[#6E5764] cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" strokeWidth={2} /> FAQ
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setIsCustomOpen(true);
                }}
                className="w-full flex items-center gap-1.5 text-left text-xs uppercase tracking-wider font-bold py-2 text-luxury-gold cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2} /> Custom Design Request
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CustomDesignModal isOpen={isCustomOpen} onClose={() => setIsCustomOpen(false)} />
    </nav>
  );
}
