import React from "react";
import { ArrowUp } from "lucide-react";
import { SITE_COPY } from "../data";

/**
 * Footer Component
 * Consolidates layout navigation, quick links, contact paths, and company details.
 * Kept aligned with the main navigation and structured globally from site copy datasets.
 */
export default function Footer() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="app-footer"
      className="bg-[#040404] text-neutral-400 py-16 md:py-24 border-t border-neutral-900 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-900">
          
          {/* Brand/Monolith Column */}
          <div className="md:col-span-4 space-y-6">
            <a
              href="#"
              onClick={scrollToTop}
              className="font-display font-medium text-xl tracking-[0.25em] text-white hover:text-brand-gold transition-colors block"
            >
              {SITE_COPY.global.brandName}
            </a>
            <p className="font-light text-xs md:text-sm text-neutral-500 max-w-sm leading-relaxed">
              {SITE_COPY.clientWall.headline && "We shape clean, enduring public positioning for leaders, founders, and high-growth companies."}
            </p>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-neutral-600 uppercase tracking-widest font-light">
              <span>{SITE_COPY.global.foundedLabel}</span>
            </div>
          </div>

          {/* Quick links navigation */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a3a3a3] font-medium">
              {SITE_COPY.global.navLabel}
            </h4>
            <ul className="space-y-2 text-xs md:text-sm font-light">
              <li>
                <a href="#thesis" className="hover:text-white transition-colors duration-200">
                  Thesis
                </a>
              </li>
              <li>
                <a href="#brands" className="hover:text-white transition-colors duration-200">
                  Clients
                </a>
              </li>
              <li>
                <a href="#wins" className="hover:text-white transition-colors duration-200">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors duration-200">
                  Services
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors duration-200">
                  Process
                </a>
              </li>
            </ul>
          </div>

          {/* Direct channels / socials */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a3a3a3] font-medium">
              {SITE_COPY.global.contactLabel}
            </h4>
            <ul className="space-y-2 text-xs md:text-sm font-light">
              <li>
                <span className="text-neutral-500 mr-2">{SITE_COPY.global.advisoryLabel}</span>
                <a href={`mailto:${SITE_COPY.global.advisoryEmail}`} className="hover:text-white transition-colors duration-200">
                  {SITE_COPY.global.advisoryEmail}
                </a>
              </li>
              <li>
                <span className="text-neutral-500 mr-2">{SITE_COPY.global.inquiriesLabel}</span>
                <a href={`mailto:${SITE_COPY.global.inquiriesEmail}`} className="hover:text-white transition-colors duration-200">
                  {SITE_COPY.global.inquiriesEmail}
                </a>
              </li>
            </ul>
          </div>

          {/* Location details */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a3a3a3] font-medium">
              {SITE_COPY.global.locationsLabel}
            </h4>
            <p className="text-xs font-light text-neutral-500 leading-relaxed">
              {SITE_COPY.global.locationsTextLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

        </div>

        {/* Global info and scroll-to-top layout */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-[10px] font-mono text-neutral-600 text-center sm:text-left uppercase tracking-[0.15em]">
            <span>
              &copy; {currentYear} {SITE_COPY.global.brandName}
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              PRIVACY POLICY
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              TERMS OF SERVICE
            </span>
          </div>

          <a
            href="#"
            onClick={scrollToTop}
            className="flex items-center space-x-2 bg-[#0c0c0c] border border-neutral-900 py-2.5 px-4 font-mono text-[10px] uppercase tracking-widest text-[#a3a3a3] hover:text-white hover:border-neutral-700 transition-all duration-300"
          >
            <span>Top of Page</span>
            <ArrowUp className="w-3.5 h-3.5 text-neutral-500" />
          </a>
        </div>

      </div>
    </footer>
  );
}
