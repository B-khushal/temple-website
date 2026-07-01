import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Youtube, Instagram, Mail, Phone, MapPin, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DivineIntro } from '../ui/DivineIntro';
import { useAuth } from '../../lib/api';
import { useVisibility } from '../../lib/VisibilityContext';

export function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isSectionVisible } = useVisibility();

  // Control if the intro overlay should play
  const [showIntro, setShowIntro] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('intro') === 'true') {
      return true;
    }
    const played = sessionStorage.getItem('durgaIntroPlayed');
    return !played;
  });

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Dynamically checked navigation links
  const allNavLinks = [
    { name: 'Home', path: '/', visible: true },
    { name: 'About Temple', path: '/about', visible: isSectionVisible('about_enabled') },
    { name: 'History', path: '/history', visible: isSectionVisible('temple_history_enabled') },
    { name: 'Committee', path: '/committee', visible: isSectionVisible('committee_enabled') },
    { name: 'Events', path: '/events', visible: isSectionVisible('events_enabled') },
    { name: 'Donations', path: '/donate', visible: isSectionVisible('donations_enabled') },
    { name: 'Gallery', path: '/gallery', visible: isSectionVisible('gallery_enabled') },
    { name: 'Contact', path: '/contact', visible: isSectionVisible('contact_enabled') },
  ];

  const navLinks = allNavLinks.filter(link => link.visible);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Return ONLY the intro overlay while active to prevent DOM clutter and header leakage
  if (showIntro) {
    return <DivineIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#3E2723] font-serif animate-[revealUp_1.5s_cubic-bezier(0.16,1,0.3,1)_both]">
      {/* Main Navbar */}
      <header className="h-20 flex items-center justify-between px-3 sm:px-6 md:px-8 border-b-2 bg-[#9B2226]/95 backdrop-blur-md border-[#CFB53B] z-50 sticky top-0 shadow-md">
        <Link to="/" className="flex items-center gap-2 sm:gap-4 max-w-[75%] sm:max-w-none">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'conic-gradient(#FF8C00, #F9A825, #FF8C00)', border: '2px solid #CFB53B' }}>
            <span className="text-white font-bold text-lg sm:text-2xl">ॐ</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base md:text-xl font-bold uppercase tracking-widest text-white leading-none mb-1 truncate">Sri Durga Mata Temple</h1>
            <h2 className="text-[10px] sm:text-xs font-bold text-[#F9A825] leading-none mb-1 truncate hidden sm:block">శ్రీ శ్రీ శ్రీ దుర్గామాత నల్లపోచమ్మ దేవాలయం.</h2>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-orange-200 tracking-[0.15em] sm:tracking-[0.2em] uppercase font-sans truncate">Spiritual Heritage & Management</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex gap-4 text-[10px] uppercase tracking-widest font-sans font-bold text-white/90 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "hover:text-white transition-colors duration-200 relative py-1",
                location.pathname === link.path ? "text-[#F9A825] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#F9A825]" : "text-white/80 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/admin" className="ml-4 pl-4 border-l border-white/20 hover:text-white text-[#F9A825] transition-colors duration-200">Portal</Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="xl:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-orange-200 p-2 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 animate-[spin_0.2s_ease-out]" /> : <Menu className="w-6 h-6 animate-[fadeIn_0.2s_ease-out]" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div 
        className={cn(
          "fixed inset-0 z-40 xl:hidden transition-all duration-300 ease-in-out pointer-events-none",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
        )}
      >
        {/* Backdrop overlay */}
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        />

        {/* Sliding Menu Panel */}
        <div 
          className={cn(
            "absolute top-0 right-0 h-full w-[280px] max-w-[85vw] bg-[#FFF9F0] border-l border-[#EEDCC1] shadow-2xl p-6 flex flex-col transition-transform duration-300 ease-out font-sans",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header in drawer */}
          <div className="flex justify-between items-center pb-4 border-b border-[#EEDCC1] mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">ॐ</span>
              <span className="font-serif font-bold text-sm text-[#9B2226] tracking-wider uppercase">Menu Navigation</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-gray-400 hover:text-[#9B2226] p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200",
                    isActive 
                      ? "bg-[#9B2226] text-white shadow-md shadow-[#9B2226]/10" 
                      : "text-[#3E2723] hover:bg-[#F7F1E5] hover:text-[#9B2226]"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Portal Login Link directly in the list for mobile display */}
            <div className="pt-4 border-t border-[#EEDCC1]/40 mt-4">
              {user ? (
                <div className="space-y-2">
                  <Link 
                    to="/admin" 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#9B2226] hover:bg-[#7a181b] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                  <button 
                    onClick={async () => {
                      await logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer border-0"
                  >
                    <LogOut className="w-4 h-4" /> Log Out Portal
                  </button>
                </div>
              ) : (
                <Link 
                  to="/admin" 
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#9B2226] hover:bg-[#7a181b] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Portal Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white border-[#EEDCC1] py-12 px-4 sm:px-6 md:px-12 font-sans">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Multi-Column Grid */}
          {isSectionVisible('footer_sections_enabled') && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Column 1: Info and Socials */}
              <div className="md:col-span-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#9B2226] font-serif italic tracking-wide">
                    SRI DURGA MATA TEMPLE
                  </h3>
                  <h4 className="text-xs font-bold text-gray-700 font-sans tracking-wide">
                    శ్రీ శ్రీ శ్రీ దుర్గామాత నల్లపోచమ్మ దేవాలయం, బాపూనగర్.
                  </h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
                    Bapu Nagar, Hyderabad, Telangana, India.
                  </p>
                </div>

                {/* Social Media Link Icons */}
                {isSectionVisible('social_links_enabled') && (
                  <div className="flex gap-3 pt-2">
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-8 h-8 rounded-full bg-[#F7F1E5] flex items-center justify-center text-[#9B2226] hover:bg-[#9B2226] hover:text-white transition-all duration-300 hover:scale-105"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a 
                      href="https://youtube.com" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-8 h-8 rounded-full bg-[#F7F1E5] flex items-center justify-center text-[#9B2226] hover:bg-[#9B2226] hover:text-white transition-all duration-300 hover:scale-105"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-8 h-8 rounded-full bg-[#F7F1E5] flex items-center justify-center text-[#9B2226] hover:bg-[#9B2226] hover:text-white transition-all duration-300 hover:scale-105"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Column 2: Quick Links */}
              {isSectionVisible('quick_links_enabled') && (
                <div className="md:col-span-3 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  <button 
                    onClick={() => toggleSection('links')}
                    className="w-full md:pointer-events-none flex justify-between items-center text-left focus:outline-none"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#9B2226]">Quick Links</h4>
                    <div className="md:hidden text-gray-500">
                      {openSection === 'links' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <div 
                    className={cn(
                      "mt-3 md:block space-y-2 text-xs",
                      openSection === 'links' ? "block" : "hidden"
                    )}
                  >
                    {navLinks.map((link) => (
                      <Link 
                        key={link.name} 
                        to={link.path} 
                        className="block text-gray-600 hover:text-[#9B2226] py-1 transition-colors font-medium"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Column 3: Contact & Timings */}
              {isSectionVisible('contact_enabled') && (
                <div className="md:col-span-5 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  <button 
                    onClick={() => toggleSection('contact')}
                    className="w-full md:pointer-events-none flex justify-between items-center text-left focus:outline-none"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#9B2226]">Office Details & Hours</h4>
                    <div className="md:hidden text-gray-500">
                      {openSection === 'contact' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <div 
                    className={cn(
                      "mt-3 md:block space-y-3 text-xs text-gray-600 font-medium",
                      openSection === 'contact' ? "block" : "hidden"
                    )}
                  >
                    <div className="flex gap-2.5 items-start">
                      <MapPin className="w-4 h-4 text-[#9B2226] flex-shrink-0 mt-0.5" />
                      <span>Bapu Nagar, Hyderabad, Telangana, India.</span>
                    </div>
                    {isSectionVisible('phone_numbers_enabled') && (
                      <div className="flex gap-2.5 items-start">
                        <Phone className="w-4 h-4 text-[#9B2226] flex-shrink-0 mt-0.5" />
                        <a href="tel:+919999999999" className="hover:text-[#9B2226]">+91 99999 99999</a>
                      </div>
                    )}
                    {isSectionVisible('email_addresses_enabled') && (
                      <div className="flex gap-2.5 items-start">
                        <Mail className="w-4 h-4 text-[#9B2226] flex-shrink-0 mt-0.5" />
                        <a href="mailto:info@sridurgamatatemple.org" className="hover:text-[#9B2226]">info@sridurgamatatemple.org</a>
                      </div>
                    )}
                    <div className="pt-1 border-t border-dashed border-[#EEDCC1] mt-2">
                      <span className="font-bold text-[#3E2723] block mb-0.5">Darshan Timings:</span>
                      <span>Daily: 8:00 AM – 12:00 PM & 5:00 PM – 8:30 PM</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Large Map Embed Block */}
          {isSectionVisible('map_enabled') && (
            <div className="w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-lg border border-[#EEDCC1] bg-gray-50">
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
          )}

          {/* Copyright and Counter footer row */}
          {isSectionVisible('copyright_enabled') && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest">
              <div>
                &copy; {new Date().getFullYear()} Temple Management Board. All Rights Reserved.
              </div>
              
              {/* Visitor Counter */}
              {isSectionVisible('visitor_counter_enabled') && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FDFBF7] border border-[#EEDCC1] rounded-lg text-gray-500 font-sans font-bold select-none shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CFB53B]"></span>
                  <span>VISITS:</span>
                  <span className="font-mono text-gray-700 tracking-wider">148,205</span>
                </div>
              )}
            </div>
          )}
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      {isSectionVisible('whatsapp_button_enabled') && (
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-xl transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.054L2 22l5.077-1.33a9.923 9.923 0 004.931 1.33h.004c5.505 0 9.989-4.478 9.99-9.984A9.972 9.972 0 0012.012 2zm5.82 14.195c-.32.9-1.845 1.63-2.535 1.717-.678.087-1.554.125-2.525-.19a11.83 11.83 0 01-5.12-3.195 12.062 12.062 0 01-2.18-3.79c-.383-.873-.082-1.348.225-1.684.07-.076.143-.17.215-.264.072-.093.096-.16.144-.264.048-.103.024-.195-.012-.29-.036-.093-.32-772-.44-1.054-.117-.276-.24-.239-.328-.243-.084-.004-.18-.004-.276-.004s-.252.036-.384.18c-.132.144-.504.492-.504 1.2s.516 1.392.588 1.488c.072.096 1.016 1.553 2.462 2.18.344.15.612.24.821.306.347.11.662.095.912.058.278-.04.852-.349 1.016-.763.164-.413.164-.768.115-.845-.049-.077-.18-.124-.38-.224z" />
          </svg>
        </a>
      )}

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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
export default PublicLayout;
