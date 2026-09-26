import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import CurationMenu from './components/CurationMenu';
import EditorialGallery from './components/EditorialGallery';
import BookingModal from './components/BookingModal';
import PlatformBlueprint from './components/PlatformBlueprint';
import Footer from './components/Footer';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);

  const handleOpenBooking = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedServiceId(undefined);
  };

  return (
    <div className="min-h-screen bg-[#0a0a00] text-[#f7f4eb] selection:bg-[#E6C587] selection:text-[#0A0A0A]">
      
      {/* Floating Header */}
      <Header
        onBookOpen={() => handleOpenBooking()}
        onBlueprintOpen={() => setIsBlueprintOpen(true)}
      />

      {/* Main Structural Editorial Block Stack */}
      <main>
        {/* Hero Section */}
        <Hero onBookOpen={() => handleOpenBooking()} />

        {/* Philosophy / Zen Intro */}
        <Philosophy />

        {/* Asymmetrical Curation Menu */}
        <CurationMenu onBookOpen={handleOpenBooking} />

        {/* Masonry Editorial Gallery Section */}
        <EditorialGallery />
      </main>

      {/* Spacious Footer */}
      <Footer
        onBlueprintOpen={() => setIsBlueprintOpen(true)}
        onBookOpen={() => handleOpenBooking()}
      />

      {/* Booking flyout drawer */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        selectedServiceId={selectedServiceId}
      />

      {/* Tech specification blueprint modal overlay */}
      <PlatformBlueprint
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
      />
    </div>
  );
}
