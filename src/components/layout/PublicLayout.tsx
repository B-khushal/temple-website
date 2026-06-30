import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DivineIntro } from '../ui/DivineIntro';

export function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Control if the intro overlay should play
  const [showIntro, setShowIntro] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('intro') === 'true') {
      return true;
    }
    const played = sessionStorage.getItem('durgaIntroPlayed');
    return !played;
  });

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Temple', path: '/about' },
    { name: 'History', path: '/history' },
    { name: 'Committee', path: '/committee' },
    { name: 'Events', path: '/events' },
    { name: 'Donations', path: '/donate' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  // Return ONLY the intro overlay while active to prevent DOM clutter and header leakage
  if (showIntro) {
    return <DivineIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#3E2723] font-serif animate-[revealUp_1.5s_cubic-bezier(0.16,1,0.3,1)_both]">
      {/* Main Navbar */}
      <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b-2 bg-[#9B2226] border-[#CFB53B] z-50 sticky top-0">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#FF8C00, #F9A825, #FF8C00)', border: '2px solid #CFB53B' }}>
            <span className="text-white font-bold text-2xl">ॐ</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold uppercase tracking-widest text-white leading-none mb-1">Sri Durga Mata Temple</h1>
            <h2 className="text-sm font-bold text-[#F9A825] leading-none mb-1">శ్రీ శ్రీ శ్రీ దుర్గామాత నల్లపోచమ్మ దేవాలయం.</h2>
            <span className="text-[10px] text-orange-200 tracking-[0.2em] uppercase font-sans">Spiritual Heritage & Management</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex gap-4 text-[10px] uppercase tracking-widest font-sans font-bold text-white/90 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "hover:text-white transition-colors",
                location.pathname === link.path && "text-[#F9A825] border-b border-[#F9A825] pb-0.5"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/admin" className="ml-4 pl-4 border-l border-white/20 hover:text-white text-[#F9A825]">Portal</Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="xl:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-orange-200"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#FFF9F0] border-b border-[#EEDCC1] px-4 pt-2 pb-4 shadow-lg absolute w-full z-40 top-20 font-sans h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-3 rounded-md text-sm font-bold uppercase tracking-widest text-[#3E2723] hover:bg-[#F7F1E5] hover:text-[#9B2226]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 px-3 border-t border-[#EEDCC1] pt-4 pb-12">
             <Link to="/admin" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[#9B2226]">Admin Login</Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white border-[#EEDCC1] py-12 px-6 md:px-12 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Info Block */}
          <div className="text-center space-y-3">
            <h3 className="text-base font-bold text-[#9B2226] font-serif italic tracking-wide">
              SRI DURGA MATA TEMPLE
            </h3>
            <h4 className="text-sm font-bold text-gray-700 font-sans tracking-wide">
              శ్రీ శ్రీ శ్రీ దుర్గామాత నల్లపోచమ్మ దేవాలయం, బాపూనగర్.
            </h4>
            <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
              Bapu Nagar, Hyderabad, Telangana, India.
            </p>
          </div>

          {/* Large Map Embed Block */}
          <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-lg border border-[#EEDCC1] bg-gray-50">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12791.892740505104!2d78.40184926986693!3d17.37242918039498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9657383c2d23%3A0xf7077772fdd642af!2sSri%20Durga%20Mata%20Nalla%20Pochamma%20Devalayamu!5e1!3m2!1sen!2sin!4v1782738093112!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="strict-origin-when-cross-origin"
              title="Sri Durga Mata Nalla Pochamma Devalayamu Map Location"
            ></iframe>
          </div>

          {/* Copyright */}
          <div className="text-center text-[10px] text-gray-400 uppercase tracking-widest pt-4 border-t border-gray-100">
            &copy; {new Date().getFullYear()} Temple Management Board. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Slide up and blur entry animation */}
      <style>{`
        @keyframes revealUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
            filter: blur(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
}
export default PublicLayout;
