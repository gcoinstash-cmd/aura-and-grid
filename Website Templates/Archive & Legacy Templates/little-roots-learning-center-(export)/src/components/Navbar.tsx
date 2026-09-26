import { useState, useEffect } from 'react';
import { Menu, X, Sprout } from 'lucide-react';

interface NavbarProps {
  onOpenTourModal: () => void;
  onOpenWaitlistModal: () => void;
}

export default function Navbar({ onOpenTourModal, onOpenWaitlistModal }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      
      const sections = ['hero', 'philosophy', 'programs', 'environment', 'teachers', 'testimonials', 'tuition', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Philosophy', href: '#philosophy', id: 'philosophy' },
    { label: 'Programs', href: '#programs', id: 'programs' },
    { label: 'The Environment', href: '#environment', id: 'environment' },
    { label: 'Teachers', href: '#teachers', id: 'teachers' },
    { label: 'Tuition & Waitlist', href: '#tuition', id: 'tuition' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const id = href.substring(1);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <header
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-cream/95 backdrop-blur-md border-b border-brand-sand shadow-sm py-3'
            : 'bg-brand-cream/80 backdrop-blur-sm py-4 border-b border-brand-sand/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo and Typography */}
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-full bg-brand-forest flex items-center justify-center text-brand-gold transition duration-300 group-hover:scale-105">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-brand-forest leading-none uppercase">
                  Little Roots
                </span>
                <span className="text-[10px] font-sans font-semibold tracking-widest text-brand-terracotta uppercase leading-none mt-1">
                  Learning Center — LA
                </span>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.href);
                  }}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
                    activeTab === item.id
                      ? 'text-brand-terracotta font-semibold'
                      : 'text-brand-charcoal/80 hover:text-brand-forest'
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold rounded-full" />
                  )}
                </a>
              ))}
            </nav>

            {/* Sticky Action Button */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenTourModal}
                className="text-xs font-semibold tracking-wider text-brand-forest hover:text-brand-terracotta transition py-2 px-3 uppercase"
              >
                Book Tour
              </button>
              <button
                type="button"
                onClick={onOpenWaitlistModal}
                className="bg-brand-forest hover:bg-brand-moss text-brand-cream text-xs font-bold tracking-widest py-3 px-5 rounded-full transition-all duration-300 transform active:scale-95 shadow-md shadow-brand-forest/10 uppercase"
              >
                Enroll Now
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="lg:hidden w-10 h-10 flex items-center justify-center text-brand-forest bg-brand-sand/50 active:bg-brand-sand rounded-full transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (One-handed navigation bottom layout elements style) */}
      <div
        className={`fixed inset-0 z-30 transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-brand-cream p-6 shadow-2xl flex flex-col justify-between">
          <div className="mt-20">
            <div className="text-[11px] font-bold tracking-widest text-brand-terracotta uppercase border-b border-brand-sand pb-2 mb-6">
              Menu Sections
            </div>
            <nav className="flex flex-col gap-5">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.href);
                  }}
                  className={`text-base font-medium tracking-wide block py-2 ${
                    activeTab === item.id
                      ? 'text-brand-terracotta font-bold pl-2 border-l-2 border-brand-gold'
                      : 'text-brand-charcoal/90 hover:text-brand-forest pl-0 border-l-0'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile CTAs within reach */}
          <div className="flex flex-col gap-3 pb-8">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenTourModal();
              }}
              className="w-full bg-brand-sand hover:bg-brand-sand/80 text-brand-forest text-xs font-bold tracking-widest py-3 rounded-full uppercase transition text-center"
            >
              Schedule a Tour
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenWaitlistModal();
              }}
              className="w-full bg-brand-forest hover:bg-brand-moss text-brand-cream text-xs font-bold tracking-widest py-3.5 rounded-full uppercase transition text-center shadow-lg"
            >
              Apply to Waitlist
            </button>
            <div className="text-center text-[10px] text-brand-charcoal/50 mt-4 leading-relaxed">
              Serving Baldwin Hills, Leimert Park, Ladera Heights, & View Park.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
