import { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logUserEvent } from '@/lib/analytics';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const scrollToSection = (sectionId: string) => {
    setMobileOpen(false);
    if (pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-[150] h-[74px] bg-[#FFFDF9] border-b border-[#E7D9CE] transition-all"
      >
        <div className="w-[92%] max-w-[1180px] mx-auto h-full flex items-center justify-between gap-7">
          {/* Logo with PA badge matching reference design */}
          <Link
            to="/"
            onClick={() => logUserEvent('CLICK_NAV_LOGO')}
            className="flex items-center gap-2.5 mr-auto cursor-pointer group"
          >
            <div className="w-[38px] h-[38px] rounded-lg bg-[#571126] text-white flex items-center justify-center font-display text-[20px] font-bold shadow-xs">
              PA
            </div>
            <div className="flex flex-col text-left leading-none">
              <strong className="text-[1.12rem] font-display font-bold text-[#35151C] leading-tight">
                PrintAlarm
              </strong>
              <small className="text-[0.62rem] text-[#6C5B59] tracking-wider mt-0.5 font-medium">
                Print Your Memories
              </small>
            </div>
          </Link>

          {/* Center Links matching reference design */}
          <div className="hidden lg:flex items-center gap-6 text-[0.86rem] font-semibold text-[#35151C]">
            <a
              href="#frames"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('frames');
              }}
              className="hover:text-[#BD8D4B] transition-colors cursor-pointer"
            >
              Frames
            </a>

            <Link
              to="/magazine-maker"
              className="hover:text-[#BD8D4B] transition-colors cursor-pointer"
            >
              Magazines
            </Link>

            <Link
              to="/photo-zine-maker"
              className="hover:text-[#BD8D4B] transition-colors cursor-pointer"
            >
              Photo Zines
            </Link>

            <Link
              to="/templates"
              className="hover:text-[#BD8D4B] transition-colors cursor-pointer"
            >
              Cards & Lifafas
            </Link>

            <a
              href="#inspiration"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('inspiration');
              }}
              className="hover:text-[#BD8D4B] transition-colors cursor-pointer"
            >
              Inspiration
            </a>

            <a
              href="#how"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how');
              }}
              className="hover:text-[#BD8D4B] transition-colors cursor-pointer"
            >
              How It Works
            </a>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Start Creating Pill Button */}
            <Link
              to="/templates"
              onClick={() => logUserEvent('CLICK_NAV_START_CREATING')}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 bg-[#571126] text-white text-[0.85rem] font-bold tracking-wide hover:-translate-y-0.5 transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              Start Creating
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#35151C] hover:bg-gray-100 rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#FFFDF9] border-b border-[#E7D9CE] px-6 py-4 flex flex-col gap-3 shadow-xl">
            <a
              href="#frames"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('frames');
              }}
              className="py-1 font-semibold text-sm text-[#35151C]"
            >
              Frames
            </a>
            <Link
              to="/magazine-maker"
              onClick={() => setMobileOpen(false)}
              className="py-1 font-semibold text-sm text-[#35151C]"
            >
              Magazines
            </Link>
            <Link
              to="/photo-zine-maker"
              onClick={() => setMobileOpen(false)}
              className="py-1 font-semibold text-sm text-[#35151C]"
            >
              Photo Zines
            </Link>
            <Link
              to="/templates"
              onClick={() => setMobileOpen(false)}
              className="py-1 font-semibold text-sm text-[#35151C]"
            >
              Cards & Lifafas
            </Link>
            <a
              href="#inspiration"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('inspiration');
              }}
              className="py-1 font-semibold text-sm text-[#35151C]"
            >
              Inspiration
            </a>
            <a
              href="#how"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how');
              }}
              className="py-1 font-semibold text-sm text-[#35151C]"
            >
              How It Works
            </a>
            <hr className="border-[#E7D9CE]/60 my-1" />
            <Link
              to={firebaseUser ? '/dashboard' : '/auth'}
              onClick={() => setMobileOpen(false)}
              className="py-1 font-semibold text-sm text-[#571126]"
            >
              {firebaseUser ? 'My Account & Orders' : 'Sign In / Register'}
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
