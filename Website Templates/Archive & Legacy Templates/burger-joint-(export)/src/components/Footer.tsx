export default function Footer() {
  return (
    <footer className="py-20 bg-brand-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-2 text-left">
          <a href="#" className="font-display text-4xl font-bold tracking-tighter block mb-8">
            BURGER <span className="text-white/20 tracking-widest font-light">JOINT.</span>
          </a>
          <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
            Revolutionizing the modern diner experience through premium ingredients, 
            minimalist design, and a dedication to the craft.
          </p>
        </div>

        <div className="text-left">
           <h5 className="font-sans font-black text-xs tracking-widest uppercase mb-8">Navigation</h5>
           <ul className="space-y-4 font-medium text-gray-400">
              <li><a href="#home" className="hover:text-brand-primary transition-colors">Home</a></li>
              <li><a href="#menu" className="hover:text-brand-primary transition-colors">The Menu</a></li>
              <li><a href="#about" className="hover:text-brand-primary transition-colors">Our Story</a></li>
              <li><a href="#contact" className="hover:text-brand-primary transition-colors">Reservations</a></li>
           </ul>
        </div>

        <div>
           <h5 className="font-sans font-black text-xs tracking-widest uppercase mb-8">Social</h5>
           <ul className="space-y-4 font-medium text-gray-400">
              <li><a href="#" className="hover:text-brand-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">TikTok</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Behance</a></li>
           </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/20">
        <p>&copy; 2024 BURGER JOINT • ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
           <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
           <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
