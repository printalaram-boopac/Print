import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CustomDesignModal from '@/components/CustomDesignModal';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/templates', label: 'Designs' },
  { to: '/designer', label: 'Create' },
  { to: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { totalItems, setCartOpen } = useCart();
  const { firebaseUser, dbUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[150] glass-panel shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
          <img src="/logo.png" alt="Printalarm Logo" className="h-30 w-auto  rounded-md" />
          <div className="flex flex-col items-start leading-none">
            <span className="text-lg md:text-xl font-display font-bold text-luxury-accent tracking-wide transition-colors group-hover:text-luxury-gold">
              Printalarm
            </span>
            <span className="text-[8px] tracking-[0.25em] font-semibold text-luxury-gold uppercase mt-0.5">
              Shagun Couture
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-[11px] uppercase tracking-widest font-semibold transition-colors ${pathname === link.to
                  ? 'text-luxury-accent border-b-2 border-luxury-gold pb-1'
                  : 'text-[#6E5764] hover:text-luxury-accent'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-5">
          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative text-luxury-accent hover:text-luxury-gold transition-colors cursor-pointer"
            aria-label="Open Cart"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-luxury-gold text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-sm"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* Custom design request trigger */}
          <button
            onClick={() => setIsCustomOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-luxury-accent/5 text-luxury-accent text-[9px] font-bold uppercase tracking-wider rounded-full border border-luxury-accent/15 hover:bg-luxury-accent hover:text-white transition-all cursor-pointer"
          >
            ✨ Custom Design
          </button>

          {/* WhatsApp mini */}
          <a
            href="https://wa.me/919904544702"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-green-600/10 text-green-700 text-[9px] font-bold uppercase tracking-wider rounded-full border border-green-600/25 hover:bg-green-600 hover:text-white transition-all"
          >
            💬 WhatsApp
          </a>

          {/* Auth indicator */}
          {firebaseUser ? (
            <Link to="/dashboard"
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-luxury-gold text-white text-[11px] font-bold uppercase hover:scale-110 transition-transform"
              title={dbUser?.name || firebaseUser.email || 'Dashboard'}>
              {(dbUser?.name || firebaseUser.email || 'U')[0]}
            </Link>
          ) : (
            <Link to="/auth"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-luxury-accent text-white text-[9px] font-bold uppercase tracking-wider rounded-full hover:bg-luxury-accent/80 transition-all">
              Login
            </Link>
          )}

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
                  className={`block text-xs uppercase tracking-wider font-semibold py-2 ${pathname === link.to ? 'text-luxury-gold' : 'text-[#6E5764]'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setIsCustomOpen(true);
                }}
                className="w-full text-left text-xs uppercase tracking-wider font-bold py-2 text-luxury-gold cursor-pointer"
              >
                ✨ Custom Design Request
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CustomDesignModal isOpen={isCustomOpen} onClose={() => setIsCustomOpen(false)} />
    </nav>
  );
}
