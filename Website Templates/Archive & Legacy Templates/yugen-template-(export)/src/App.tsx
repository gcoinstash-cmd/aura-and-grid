/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Compositions from './components/Compositions';
import BookingForm from './components/BookingForm';
import Atmosphere from './components/Atmosphere';
import Footer from './components/Footer';

export default function App() {
  
  // Custom Smooth Scroll Coordinators
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 selection:bg-[#C5A880]/30 selection:text-[#C5A880] relative overflow-x-hidden">
      
      {/* Absolute Atmospheric Base Grain Overlay */}
      <div className="absolute inset-0 grain-overlay pointer-events-none z-10" />

      {/* Floating Glassmorphic Nav Bar */}
      <Navbar 
        onBookClick={() => scrollToSection('booking-section')}
        onMenuClick={() => scrollToSection('compositions-section')}
        onPhilosophyClick={() => scrollToSection('booking-section')} // scroll to top/intro
        onAtmosphereClick={() => scrollToSection('atmosphere-section')}
      />

      {/* Hero Visual Intro Block */}
      <main>
        <Hero 
          onReserveClick={() => scrollToSection('booking-section')}
          onExploreClick={() => scrollToSection('compositions-section')}
        />

        {/* Section 1 // The Mindset / Philosophy */}
        <Philosophy />

        {/* Section 2 // Curated Nigiri Compositions Menu */}
        <Compositions />

        {/* Section 3 // Material Craft & Sensory Atmosphere */}
        <Atmosphere />

        {/* Section 4 // Interactive Booking Engine and Private Custom Buyout Consultation Portal */}
        <BookingForm />
      </main>

      {/* Architectural Minimal Footer */}
      <Footer />
      
    </div>
  );
}
