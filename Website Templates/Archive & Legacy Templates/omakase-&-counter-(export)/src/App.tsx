import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Concept from "./components/Concept";
import Menu from "./components/Menu";
import Reserve from "./components/Reserve";
import Footer from "./components/Footer";
import ItemModal from "./components/ItemModal";
import { MenuItemType } from "./types";

export default function App() {
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

  const scrollToReserve = () => {
    const reserveSection = document.getElementById("order");
    if (reserveSection) {
      reserveSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-sumi-ink text-raw-silk min-h-screen relative selection:bg-raw-silk selection:text-sumi-ink">
      {/* Absolute luxury frame corners (very thin minimalist decorative border lines in margins) */}
      <div className="fixed inset-0 z-40 pointer-events-none border border-muted-charcoal/30 m-4 md:m-8" />

      {/* Global Header Navigation */}
      <Header onReserveClick={scrollToReserve} />

      {/* Top ambient luxury lighting glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[500px] bg-gradient-to-b from-raw-silk/5 to-transparent blur-[120px] pointer-events-none z-0" />

      <main className="relative z-10">
        {/* Zen Hero Section */}
        <Hero onReserveClick={scrollToReserve} />

        {/* Philosophy & Concept Section */}
        <Concept />

        {/* Structured Course Grid Section */}
        <Menu onSelectItem={setSelectedItem} />

        {/* Interactive Reservation Seating Form */}
        <Reserve />
      </main>

      {/* Footer Timing/Location Details */}
      <Footer />

      {/* Sommelier Pairing & In-Depth Details Modal */}
      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
