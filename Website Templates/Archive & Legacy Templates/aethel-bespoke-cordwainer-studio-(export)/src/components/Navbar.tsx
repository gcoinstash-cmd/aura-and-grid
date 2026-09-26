import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onSizingClick: () => void;
  onAtelierClick: () => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  onSizingClick,
  onAtelierClick,
}: NavbarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-bg-tertiary transition-all duration-300"
      id="aethel-navigation"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left Side Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs tracking-widest font-mono text-text-secondary">
          <button
            onClick={onAtelierClick}
            className="hover:text-accent transition-colors duration-300 cursor-pointer"
            id="nav-atelier-link"
          >
            [ ATELIER ]
          </button>
          <button
            onClick={onSizingClick}
            className="hover:text-accent transition-colors duration-300 cursor-pointer"
            id="nav-sizing-link"
          >
            [ SIZING PORTAL ]
          </button>
        </div>

        {/* Center Logo */}
        <div className="flex-1 md:flex-initial text-center md:absolute md:left-1/2 md:-translate-x-1/2">
          <span
            className="font-display font-medium text-2xl tracking-widest text-[#FFFFFF] select-none hover:text-accent transition-colors duration-500 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            id="nav-brand-logo"
          >
            A E T H E L
          </span>
          <span className="block text-[8px] font-mono tracking-[0.3em] text-accent font-light uppercase">
            BESPOKE CORDWAINER
          </span>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onSizingClick}
            className="hidden sm:inline-flex items-center space-x-2 text-xs tracking-widest text-accent font-mono border border-accent/20 hover:border-accent hover:bg-accent/5 px-4 py-2 rounded-none transition-luxury"
            id="nav-fitting-commission"
          >
            <span>COMMISSION LAST</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenCart}
            className="relative p-2.5 hover:text-accent transition-colors duration-300 flex items-center space-x-1 border border-bg-tertiary bg-bg-secondary hover:bg-bg-tertiary"
            aria-label="Toggle Shopping Cart"
            id="nav-cart-trigger"
          >
            <ShoppingBag className="w-4 h-4 text-text-primary hover:text-accent transition-colors" />
            <span className="text-xs font-mono text-[#FFFFFF] font-medium leading-none">
              ({cartCount})
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
