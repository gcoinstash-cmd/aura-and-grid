import React from "react";
import { jazzSoulContent, speakeasyContent } from "./data";
import { VenueContent } from "./types";
import LiveTemplatePreview from "./components/LiveTemplatePreview";

export default function App() {
  // Read theme and concept from search params to allow testing multiple niches cleanly/stealthily
  // This keeps the site 100% customizable and sellable on Gumroad while having a perfectly clean client-ready front UI.
  const searchParams = new URLSearchParams(window.location.search);
  const selectedConcept = searchParams.get("concept") === "speakeasy" ? "speakeasy" : "jazz";
  const selectedTheme = (searchParams.get("theme") || "theme-gold-noir") as "theme-neon-velvet" | "theme-gold-noir" | "theme-emerald-dark";

  const activeContent: VenueContent = selectedConcept === "jazz" ? jazzSoulContent : speakeasyContent;

  return (
    <div className="min-h-screen bg-theme-main text-theme-body antialiased selection:bg-theme-brand selection:text-theme-main">
      <LiveTemplatePreview 
        activeContent={activeContent}
        activeTheme={selectedTheme}
      />
    </div>
  );
}
