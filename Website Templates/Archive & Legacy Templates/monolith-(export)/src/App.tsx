import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PressFeed from "./components/PressFeed";
import AgencyThesis from "./components/AgencyThesis";
import ClientWall from "./components/ClientWall";
import FeaturedWins from "./components/FeaturedWins";
import Services from "./components/Services";
import Process from "./components/Process";
import InquirySection from "./components/InquirySection";
import InquiryOverlay from "./components/InquiryOverlay";
import Footer from "./components/Footer";

export default function App() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const handleOpenInquiry = () => {
    setIsInquiryOpen(true);
  };

  const handleCloseInquiry = () => {
    setIsInquiryOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] overflow-x-hidden antialiased selection:bg-brand-gold selection:text-black">
      {/* Decorative vertical center lines for true Awwwards luxury architectural alignment */}
      <div className="absolute inset-y-0 left-0 w-full pointer-events-none z-0">
        <div className="max-w-7xl mx-auto h-full px-6 md:px-12 relative flex justify-between">
          <div className="w-[1px] h-full bg-neutral-900/15"></div>
          <div className="hidden md:block w-[1px] h-full bg-neutral-900/10"></div>
          <div className="w-[1px] h-full bg-neutral-900/15"></div>
        </div>
      </div>

      {/* Structured Sections in precise order */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation & Header wordmark */}
        <Header onOpenInquiry={handleOpenInquiry} />

        {/* 1. Hero */}
        <Hero onOpenInquiry={handleOpenInquiry} />

        {/* 2. Press Feed Marquee */}
        <PressFeed />

        {/* 3. Agency Thesis Manifesto */}
        <AgencyThesis />

        {/* 4. Client Wall Grid */}
        <ClientWall />

        {/* 5. Featured Wins Story Blocks */}
        <FeaturedWins />

        {/* 6. Services Structural Blocks */}
        <Services />

        {/* 7. Process Step Sequence */}
        <Process />

        {/* 8. Inquiry CTA Trigger Section */}
        <InquirySection onOpenInquiry={handleOpenInquiry} />

        {/* 9. Minimal Agency Footer */}
        <Footer />

      </div>

      {/* Cinematic takeover Fullscreen overlay form */}
      <InquiryOverlay isOpen={isInquiryOpen} onClose={handleCloseInquiry} />
    </div>
  );
}
