import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag } from 'lucide-react';

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#story' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-4 shadow-xl' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="font-display text-2xl font-bold tracking-tighter flex items-center gap-2 group">
          <span className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-brand-dark group-hover:rotate-12 transition-transform">BJ</span>
          <span className="hidden sm:inline">BURGER JOINT</span>
        </a>

        {/* Nav Items & Shopping Bag */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-sans font-medium text-xs tracking-[0.25em] uppercase">
            {links.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-brand-primary transition-all hover:translate-y-[-1px] inline-block opacity-70 hover:opacity-100">
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2 hover:text-brand-primary transition-colors group active:scale-90" aria-label="View Cart">
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-brand-dark rounded-full flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">0</span>
            </button>
            
            <a href="#order" className="hidden sm:flex bg-brand-primary text-brand-dark px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all items-center gap-2 font-bold text-xs tracking-tight whitespace-nowrap shadow-lg shadow-amber-500/10">
              ORDER NOW
            </a>

            {/* Mobile Toggle */}
            <button className="md:hidden text-brand-primary p-2 transition-transform active:scale-90" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-[-1] md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 glass pt-8 pb-12 px-6 flex flex-col gap-6 md:hidden border-t border-white/5 shadow-2xl"
            >
              {links.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-3xl font-display font-bold hover:text-brand-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#order" 
                className="bg-brand-primary text-brand-dark px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 active:scale-95 transition-transform"
                onClick={() => setMobileMenuOpen(false)}
              >
                ORDER ONLINE
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
