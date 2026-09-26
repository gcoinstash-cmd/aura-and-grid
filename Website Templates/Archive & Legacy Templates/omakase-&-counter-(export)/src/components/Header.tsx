import { useState } from "react";

interface HeaderProps {
  onReserveClick: () => void;
}

export default function Header({ onReserveClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "home", href: "#home" },
    { label: "concept", href: "#about" },
    { label: "the counter", href: "#menu" },
    { label: "inquire", href: "#order", onClick: onReserveClick },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-muted-charcoal bg-sumi-ink/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Typographic Logo Left */}
        <a 
          href="#home" 
          id="logo-brand"
          className="font-serif text-lg tracking-[0.2em] text-raw-silk lowercase transition-opacity hover:opacity-80"
        >
          omakase & counter
        </a>

        {/* Text-based Nav Menu Right (Desktop) */}
        <nav className="hidden md:flex items-center space-x-12" id="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.onClick) {
                  e.preventDefault();
                  link.onClick();
                }
              }}
              className="text-xs uppercase tracking-[0.25em] text-raw-silk/60 hover:text-raw-silk hover:opacity-100 transition-all duration-300 ease-out"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu toggle (minimal typographic approach without default button borders) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-xs tracking-[0.2em] uppercase text-raw-silk/70 hover:text-raw-silk focus:outline-none border-none p-0 bg-transparent"
          aria-label="Toggle navigation menu"
          id="nav-toggle"
        >
          {mobileMenuOpen ? "close" : "menu"}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="absolute top-20 left-0 w-full bg-sumi-ink border-b border-muted-charcoal flex flex-col p-8 space-y-6 md:hidden animate-zen-fade"
          id="mobile-nav-panel"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (link.onClick) {
                  e.preventDefault();
                  link.onClick();
                }
              }}
              className="text-sm uppercase tracking-[0.25em] text-raw-silk/60 hover:text-raw-silk transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
