import { motion, useScroll, useTransform } from 'motion/react';
import { 
  Play, 
  Sparkles, 
  BookOpen, 
  Palette, 
  Youtube, 
  ArrowRight, 
  Mail, 
  Instagram, 
  Twitter,
  ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-obsidian/80 backdrop-blur-md py-6' : 'bg-transparent py-10'}`}>
      <div className="max-w-[1440px] mx-auto px-10 flex justify-between items-end">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-1 font-semibold">Digital Animation Studio</span>
          <div className="font-display font-bold text-xl tracking-tighter">
            AFRODIGITAL<span className="text-electric-teal">.</span>MOTION
          </div>
        </motion.div>
        
        <div className="hidden md:flex gap-12 items-center">
          <ul className="flex gap-10 text-[11px] uppercase tracking-widest opacity-60 pb-1">
            {['Portfolio', 'Services', 'About'].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="hover:text-electric-teal transition-colors">
                  {item}
                </a>
              </li>
            ))}
            <li><a href="#contact" className="text-sunny-yellow hover:opacity-80 transition-opacity">Work with us</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-10 pt-32 pb-20">
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 right-[10%] w-[600px] h-[600px] bg-electric-teal/5 rounded-full blur-[180px]"
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="relative"
        >
          <div className="w-24 h-[1px] bg-gradient-to-r from-electric-teal to-transparent mb-12"></div>
          
          <h1 className="text-7xl md:text-9xl font-display font-light tracking-tight leading-[0.9] mb-12">
            Animating <span className="italic font-serif text-white">Financial</span> <br />
            Futures <br />
            <span className="text-3xl md:text-5xl opacity-40 tracking-normal font-sans block mt-6">
              For the next generation.
            </span>
          </h1>

          <div className="flex flex-col md:flex-row gap-12 md:items-center mt-16 max-w-4xl">
            <div className="h-[1px] w-16 bg-white/20 hidden md:block"></div>
            <p className="text-lg text-white/50 max-w-lg font-light leading-relaxed">
              We transform complex personal finance into vibrant, kid-friendly digital stories that stick. Pairing minimalist motion with maximum educational impact.
            </p>
            
            <div className="flex gap-8 items-center pt-6 md:pt-0">
               <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: ["0 0 0px rgba(0, 245, 255, 0)", "0 0 20px rgba(0, 245, 255, 0.3)", "0 0 0px rgba(0, 245, 255, 0)"] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="px-10 py-5 bg-electric-teal text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-sunny-yellow transition-colors duration-500"
              >
                Watch Reel
              </motion.button>
              <a href="#portfolio" className="text-[11px] uppercase tracking-widest font-bold border-b border-white/20 pb-2 hover:border-electric-teal transition-all">Explore Works</a>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-10 text-white/20 flex flex-col items-center gap-4"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] rotate-90 origin-left translate-x-2 whitespace-nowrap mb-8">Scroll Down</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 to-transparent"></div>
      </motion.div>
    </section>
  );
};

const Portfolio = () => {
  const projects = [
    { title: "The 'Savings' Monster", category: "01. Shorts", color: "text-electric-teal", size: "col-span-1 row-span-1", img: "https://picsum.photos/seed/finance1/800/800" },
    { title: "Investing 101 for Teens", category: "02. Reel", color: "text-sunny-yellow", size: "col-span-1 row-span-1", img: "https://picsum.photos/seed/biz/800/800" },
    { title: "Penny & The Digital Wallet", category: "03. Series", color: "text-electric-teal", size: "col-span-2 row-span-1", img: "https://picsum.photos/seed/wallet/1200/600" },
  ];

  return (
    <section id="portfolio" className="py-40 px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
          <div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-electric-teal font-bold mb-4 block underline underline-offset-8">Our Showcase</span>
            <h2 className="text-5xl md:text-6xl font-display font-light italic">PROJECTS <span className="font-sans not-italic text-white/20">/03</span></h2>
          </div>
          <p className="text-white/40 max-w-sm text-sm uppercase tracking-widest font-light leading-loose">
            High-fidelity storytelling meets educational precision. Every frame is a lesson learned.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`${p.size} glass-card relative group aspect-[16/10] overflow-hidden`}
            >
              <div className="absolute inset-0 bg-obsidian z-0">
                <img 
                  src={p.img} 
                  alt={p.title} 
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:rotate-1 opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-70"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
              
              <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${p.color}`}>
                  {p.category}
                </span>
                
                <div>
                  <h3 className="text-3xl font-display font-medium tracking-tight mb-6">{p.title}</h3>
                  <div className="flex items-center gap-4 group/btn cursor-pointer">
                    <div className="w-12 h-[1px] bg-white/20 group-hover/btn:w-20 group-hover/btn:bg-electric-teal transition-all duration-500" />
                    <span className="text-[10px] uppercase tracking-widest opacity-40 group-hover/btn:opacity-100">Watch Story</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const items = [
    { 
      title: "Character Design", 
      desc: "Creating diverse, relatable avatars for financial brands.", 
      num: "01" 
    },
    { 
      title: "YouTube Shorts", 
      desc: "Optimized bite-sized content for social platforms.", 
      num: "02" 
    },
    { 
      title: "Literacy Curriculum", 
      desc: "Full course production for financial literacy.", 
      num: "03" 
    },
  ];

  return (
    <section id="services" className="py-40 px-10 bg-deep-charcoal border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sunny-yellow/5 rounded-full blur-[150px]" />
      
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 relative z-10">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-electric-teal mb-16">OUR EXPERTISE</h4>
          <div className="space-y-12">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex justify-between items-start border-b border-white/5 pb-8 group hover:border-electric-teal hover:-translate-y-1 transition-all duration-500 cursor-default"
              >
                <div>
                  <h3 className="text-lg font-display font-medium mb-3 group-hover:text-electric-teal transition-colors">{item.title}</h3>
                  <p className="text-xs text-white/40 max-w-sm uppercase tracking-wider">{item.desc}</p>
                </div>
                <span className="text-[11px] font-serif opacity-30 italic">{item.num}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
          <h2 className="text-5xl md:text-7xl font-display font-light leading-tight mb-12">
            Minimalist <span className="italic font-serif">Motion</span> for <br />
            Maximum <span className="text-sunny-yellow">Value.</span>
          </h2>
          <p className="text-xl text-white/50 mb-16 font-light max-w-xl leading-relaxed">
            We pair elite aesthetic standards with pedagogical depth. We don't just animate; we educate through high-fidelity visual storytelling.
          </p>
          <div className="flex gap-12">
             <div className="flex flex-col">
                <span className="text-4xl font-display font-bold text-electric-teal mb-2">12M+</span>
                <span className="text-[9px] uppercase tracking-[0.3em] opacity-40">Views Generated</span>
             </div>
             <div className="flex flex-col">
                <span className="text-4xl font-display font-bold text-sunny-yellow mb-2">0.3s</span>
                <span className="text-[9px] uppercase tracking-[0.3em] opacity-40">Avg Hook Time</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-40 px-10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
          <h2 className="text-6xl md:text-8xl font-display font-light italic mb-12 leading-[0.9]">
            START A <br />
            <span className="text-white">PROJECT.</span>
          </h2>
          <div className="space-y-8 mt-20">
            <div className="flex gap-6 items-center group cursor-pointer">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-electric-teal group-hover:border-electric-teal transition-all duration-500">
                <Mail size={18} className="group-hover:text-black transition-colors" />
              </div>
              <span className="text-sm uppercase tracking-[0.2em] font-medium group-hover:translate-x-2 transition-transform duration-500">hello@afrodigital.motion</span>
            </div>
            <div className="flex gap-6 items-center group cursor-pointer">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-sunny-yellow group-hover:border-sunny-yellow transition-all duration-500">
                <ArrowRight size={18} className="group-hover:text-black transition-colors" />
              </div>
              <span className="text-sm uppercase tracking-[0.2em] font-medium group-hover:translate-x-2 transition-transform duration-500">Lagos Head Office, 22 Studio Dr.</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-charcoal to-obsidian border border-white/5 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sunny-yellow/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-sunny-yellow mb-12 block">Inquiry Form</h4>
          
          <form className="space-y-10 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div className="border-b border-white/10 py-4 focus-within:border-electric-teal transition-colors">
              <input 
                type="text" 
                placeholder="STUDIO OR NAME"
                className="w-full bg-transparent outline-none text-xs uppercase tracking-[0.3em] placeholder:opacity-20"
              />
            </div>
            <div className="border-b border-white/10 py-4 focus-within:border-electric-teal transition-colors">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS"
                className="w-full bg-transparent outline-none text-xs uppercase tracking-[0.3em] placeholder:opacity-20"
              />
            </div>
            <div className="border-b border-white/10 py-4 focus-within:border-electric-teal transition-colors">
              <textarea 
                rows={3}
                placeholder="PROJECT BRIEF"
                className="w-full bg-transparent outline-none text-xs uppercase tracking-[0.3em] placeholder:opacity-20 resize-none pt-4"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-electric-teal text-black font-bold py-8 rounded-2xl text-[11px] uppercase tracking-[0.4em] hover:bg-white transition-colors duration-500 mt-12"
            >
              Send Inquiry
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 px-10 border-t border-white/5 mt-20">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
        <div className="flex flex-col items-center md:items-start">
          <div className="font-display font-bold text-3xl tracking-tighter mb-4">
            AFRODIGITAL<span className="text-electric-teal">.</span>MOTION
          </div>
          <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-medium leading-loose">© 2024 AFRODIGITAL MOTION LTD. ALL RIGHTS RESERVED.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex gap-10 items-center opacity-30 hover:opacity-100 transition-opacity">
            <a href="#" className="hover:text-electric-teal transition-colors"><Instagram size={18} /></a>
            <a href="#" className="hover:text-electric-teal transition-colors"><Twitter size={18} /></a>
            <a href="#" className="hover:text-electric-teal transition-colors"><Youtube size={18} /></a>
          </div>
          
          <div className="flex gap-12 border-l border-white/5 pl-12">
            <div className="text-right md:text-left">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-2">Location</p>
              <p className="text-xs font-medium tracking-widest">Lagos / Remote</p>
            </div>
             <div className="text-right md:text-left hidden sm:block">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-2">Social</p>
              <p className="text-xs font-medium tracking-widest text-electric-teal">@afromotion.st</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-20 flex flex-wrap gap-x-12 gap-y-4 justify-center md:justify-start text-[9px] uppercase tracking-[0.3em] font-bold opacity-10">
        <span>Privacy Policy</span>
        <span>Cookie Rights</span>
        <span>Global Sourcing</span>
        <span>Studio Terms</span>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="relative selection:bg-electric-teal selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <Portfolio />
        <Services />
        <Contact />
      </main>
      <Footer />
      
      {/* Global Grainy Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
