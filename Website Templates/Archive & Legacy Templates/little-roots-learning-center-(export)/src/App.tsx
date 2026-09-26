import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Programs from './components/Programs';
import Environment from './components/Environment';
import Teachers from './components/Teachers';
import Testimonials from './components/Testimonials';
import Tuition from './components/Tuition';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WaitlistModal from './components/WaitlistModal';
import { Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [selectedWaitlistProgramId, setSelectedWaitlistProgramId] = useState<string | undefined>(undefined);

  const handleOpenWaitlist = (programId?: string) => {
    setSelectedWaitlistProgramId(programId);
    setIsWaitlistOpen(true);
  };

  const handleCloseWaitlist = () => {
    setIsWaitlistOpen(false);
    setSelectedWaitlistProgramId(undefined);
  };

  // Scroll smooth and focus the date/parent picker on the tour request form
  const handleScrollToTour = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const topOffset = contactSection.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth',
      });
      
      // Auto-focus name field after travel animation
      setTimeout(() => {
        const nameInput = document.querySelector('input[placeholder*="Nia Sterling"]') as HTMLInputElement;
        if (nameInput) {
          nameInput.focus();
        }
      }, 800);
    }
  };

  const handleScrollToPrograms = () => {
    const programsSection = document.getElementById('programs');
    if (programsSection) {
      const topOffset = programsSection.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-brand-charcoal selection:bg-brand-gold selection:text-brand-forest">
      
      {/* Sticky Premium Navbar */}
      <Navbar
        onOpenTourModal={handleScrollToTour}
        onOpenWaitlistModal={() => handleOpenWaitlist()}
      />

      {/* Main Sections flow matching standard LA boutique landing requirements */}
      <main>
        
        {/* HERO SECTION */}
        <Hero
          onOpenTourModal={handleScrollToTour}
          onScrollViewToPrograms={handleScrollToPrograms}
        />

        {/* Dynamic Culturally affirming Affirmation Strip */}
        <div className="bg-brand-forest text-brand-cream py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-gold/5 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-brand-gold fill-brand-gold shrink-0 animate-pulse" />
              <p className="text-xs font-bold tracking-wider uppercase font-serif">
                “Building our future lords, entrepreneurs, and global champions.”
              </p>
            </div>
            <div className="flex gap-6 text-[11px] font-bold text-brand-gold uppercase tracking-widest font-sans">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-brand-cream" /> Standard Licenced Care
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 shrink-0 text-brand-cream" /> Organic Diet Included
              </span>
            </div>
          </div>
        </div>

        {/* PHILOSOPHY STRIP */}
        <Philosophy />

        {/* PROGRAMS SECTION */}
        <Programs onOpenWaitlistModal={handleOpenWaitlist} />

        {/* THE ENVIRONMENT SECTION */}
        <Environment />

        {/* MEET THE TEACHERS */}
        <Teachers />

        {/* PARENT TESTIMONIALS CAROUSEL */}
        <Testimonials />

        {/* TUITION & ENROLLMENT SECTION */}
        <Tuition onOpenWaitlistModal={handleOpenWaitlist} />

        {/* LEIMERT PARK BOUTIQUE REASSURANCES SPREAD */}
        <section className="py-16 md:py-20 bg-brand-forest text-brand-cream relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/10 rounded-br-full pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
              Family & Legacy Legacy
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold max-w-3xl mx-auto leading-tight mb-6">
              Empowering South Los Angeles Families with World-Class Academic Soils
            </h2>
            <p className="text-sm text-brand-sand max-w-2xl mx-auto leading-relaxed mb-8">
              We stand for Baldwin Hills, Leimert Park, Windsor Hills, and Crenshaw. Our mission goes beyond daily childcare — we are crafting the next generation of greatness, offering beautiful, organic physical and cultural settings that prepare kids to step into any space in the world with absolute confidence, resilience, and curiosity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                type="button"
                onClick={handleScrollToTour}
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-forest font-bold text-xs tracking-widest py-3.5 px-8 rounded-full uppercase transition duration-200 shadow"
              >
                Schedule Private Walkthrough
              </button>
              <button
                type="button"
                onClick={() => handleOpenWaitlist()}
                className="border border-brand-cream hover:bg-white/10 text-white font-bold text-xs tracking-widest py-3.5 px-8 rounded-full uppercase transition duration-200"
              >
                Apply for Priority Pool
              </button>
            </div>
          </div>
        </section>

        {/* VISIT US / CONTACT DETAILS & DETAILED BOOKING FORM */}
        <Contact />

      </main>

      {/* FOOTER SECTION */}
      <Footer />

      {/* COMPLIMENTARY WAITLIST MODAL FOR ADMISSIONS SPREAD */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        programId={selectedWaitlistProgramId}
        onClose={handleCloseWaitlist}
      />

    </div>
  );
}
