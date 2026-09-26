import React, { MouseEvent } from 'react';
import { Sprout, Instagram, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const handleScrollTop = (e: MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-brand-forest text-brand-cream border-t-2 border-brand-gold pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer layout: Brand & Two Navigation Lists */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-brand-cream/10">
          
          {/* Brand block (5 Cols) */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-forest flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-black tracking-tight leading-none uppercase">
                  Little Roots
                </span>
                <span className="text-[9px] font-bold tracking-widest text-brand-gold uppercase leading-none mt-1">
                  Learning Center — LA
                </span>
              </div>
            </div>

            <p className="font-serif text-xl italic font-semibold max-w-sm text-brand-sand">
              “Growing the Next Generation of Greatness.”
            </p>

            <p className="text-xs text-brand-cream/80 max-w-sm font-sans leading-relaxed">
              We provide highly premium, culturally affirming childcare for Los Angeles’ entrepreneurial families. Building intellectual leaders from day one.
            </p>

            <div className="flex items-center gap-3.5 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-brand-cream/10 hover:bg-brand-gold hover:text-brand-forest transition flex items-center justify-center"
                aria-label="Instagram link"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <span className="text-xs font-semibold text-brand-gold tracking-widest uppercase">
                @LittleRootsLA
              </span>
            </div>
          </div>

          {/* Quick links navigation list (3 Cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-brand-gold uppercase pb-2 border-b border-brand-cream/10">
              The Institution
            </h4>
            <ul className="space-y-3 text-xs font-medium text-brand-cream/80">
              <li>
                <a href="#philosophy" onClick={(e) => handleLinkClick(e, 'philosophy')} className="hover:text-brand-gold transition">
                  Our Philosophy
                </a>
              </li>
              <li>
                <a href="#programs" onClick={(e) => handleLinkClick(e, 'programs')} className="hover:text-brand-gold transition">
                  Academic Programs
                </a>
              </li>
              <li>
                <a href="#environment" onClick={(e) => handleLinkClick(e, 'environment')} className="hover:text-brand-gold transition">
                  Classroom Sanctuary
                </a>
              </li>
              <li>
                <a href="#teachers" onClick={(e) => handleLinkClick(e, 'teachers')} className="hover:text-brand-gold transition">
                  Pioneering Faculty
                </a>
              </li>
            </ul>
          </div>

          {/* Core details \& legal links list (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-brand-gold uppercase pb-2 border-b border-brand-cream/10">
              Inquiries & Contact
            </h4>
            <ul className="space-y-3.5 text-xs text-brand-cream/90">
              <li className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>3415 W. 43rd Street, Los Angeles, CA 90008</span>
              </li>
              <li className="flex gap-2 items-start">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>(323) 555-0190</span>
              </li>
              <li className="flex gap-2 items-start">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>hello@littlerootsla.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Base Copyright & Back to Top details */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-cream/60 gap-4">
          <div className="flex items-center gap-1.5 flex-wrap justify-center font-sans tracking-wide">
            <span>&copy; {new Date().getFullYear()} Little Roots LLC.</span>
            <span>All rights reserved.</span>
            <span className="hidden sm:inline text-brand-gold">•</span>
            <a href="#privacy" className="hover:text-brand-gold">Admissions and Privacy Policy</a>
            <span className="hidden sm:inline text-brand-gold">•</span>
            <span className="text-brand-gold uppercase tracking-widest font-bold text-[9px]">LIC #193802941</span>
          </div>

          {/* Simple scroll back up button */}
          <a
            href="#hero"
            onClick={handleScrollTop}
            className="inline-flex items-center gap-1.5 text-brand-gold hover:text-brand-cream transition uppercase tracking-widest font-bold text-[10px]"
          >
            Back to Top <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </footer>
  );
}
