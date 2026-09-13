import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, ArrowRight } from 'lucide-react';
import { asset } from '@/lib/asset';

export default function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing to PrintAlarm updates!');
  };

  return (
    <footer className="bg-[#38101D] text-white pt-16 pb-8 px-4 sm:px-6 border-t border-[#571126]">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-start">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1 shadow-sm">
                <img
                  src={asset('logo.png')}
                  alt="PrintAlarm Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-display font-bold text-white tracking-wide">
                  PrintAlarm
                </span>
                <span className="text-[9px] font-medium text-[#E6CCD2] tracking-wider">
                  Print Your Memories
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61591651010384&sk=directory_intro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/printalarm5/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@Printalarm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Create */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Create
            </h4>
            <ul className="space-y-2 text-xs text-[#F0DCE1]">
              <li>
                <a href="#frames" className="hover:text-white transition-colors">
                  Photo Frames
                </a>
              </li>
              <li>
                <Link to="/magazine-maker" className="hover:text-white transition-colors">
                  Magazines
                </Link>
              </li>
              <li>
                <Link to="/photo-zine-maker" className="hover:text-white transition-colors">
                  Photo Zines
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-white transition-colors">
                  Cards & Lifafas
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Discover */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Discover
            </h4>
            <ul className="space-y-2 text-xs text-[#F0DCE1]">
              <li>
                <Link to="/templates" className="hover:text-white transition-colors">
                  Trending Creations
                </Link>
              </li>
              <li>
                <a href="#inspiration" className="hover:text-white transition-colors">
                  Inspiration
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About PrintAlarm
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Help
            </h4>
            <ul className="space-y-2 text-xs text-[#F0DCE1]">
              <li>
                <a href="#how" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919904544702"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/return-exchange" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Stay in Touch */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Stay in Touch
            </h4>
            <form onSubmit={handleSubscribe} className="flex bg-white rounded-full p-1 overflow-hidden shadow-sm">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-grow px-3 py-1.5 text-xs text-[#2D1527] outline-none placeholder:text-gray-400 min-w-0"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="w-8 h-8 rounded-full bg-[#38101D] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#571126] transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright & Legal Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DEC5CB]">
          <span>© 2026 PrintAlarm. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link to="/terms-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
