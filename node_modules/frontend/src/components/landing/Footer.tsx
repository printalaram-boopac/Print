import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gold-200 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="text-2xl font-display font-bold text-gold-gradient">PrintAlarm</Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              India's personalized Shagun cover & wedding stationery studio. Crafted with love.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/printalarm" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-luxury-gold transition-colors text-sm">Instagram</a>
              <a href="https://wa.me/919904544702" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-luxury-gold transition-colors text-sm">WhatsApp</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs text-luxury-gold uppercase tracking-widest font-semibold">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/templates" className="text-xs text-gray-500 hover:text-luxury-accent transition-colors">All Designs</Link>
              <Link to="/designer" className="text-xs text-gray-500 hover:text-luxury-accent transition-colors">Design Your Cover</Link>
              <Link to="/dashboard" className="text-xs text-gray-500 hover:text-luxury-accent transition-colors">Track Order</Link>
              <Link to="/auth" className="text-xs text-gray-500 hover:text-luxury-accent transition-colors">Login / Register</Link>
            </div>
          </div>

          {/* Occasions */}
          <div className="space-y-3">
            <h4 className="text-xs text-luxury-gold uppercase tracking-widest font-semibold">Occasions</h4>
            <div className="flex flex-col gap-2">
              {['Wedding Covers', 'Birthday Covers', 'Baby Shower', 'Festival Shagun', 'Corporate Gifts'].map((item) => (
                <Link key={item} to="/templates" className="text-xs text-gray-500 hover:text-luxury-accent transition-colors">{item}</Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-xs text-luxury-gold uppercase tracking-widest font-semibold">Support</h4>
            <div className="flex flex-col gap-2">
              <a href="https://wa.me/919904544702" className="text-xs text-gray-500 hover:text-luxury-accent transition-colors">WhatsApp Support</a>
              <a href="tel:+919904544702" className="text-xs text-gray-500 hover:text-luxury-accent transition-colors">Call Us</a>
              <Link to="/" className="text-xs text-gray-500 hover:text-luxury-accent transition-colors">FAQs</Link>
              <Link to="/" className="text-xs text-gray-500 hover:text-luxury-accent transition-colors">Shipping Policy</Link>
              <Link to="/" className="text-xs text-gray-500 hover:text-luxury-accent transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>

        {/* Secure badges */}
        <div className="gold-divider mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-600">© 2026 PrintAlarm. All rights reserved. Made with ❤️ in India</p>
          <div className="flex items-center gap-4 text-[10px] text-gray-600">
            <span>🔒 Secure Payments</span>
            <span>🛡️ 100% Safe</span>
            <span>📦 PAN India Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
