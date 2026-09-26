import { useEffect } from "react";
import { MenuItemType } from "../types";

interface ItemModalProps {
  item: MenuItemType | null;
  onClose: () => void;
}

export default function ItemModal({ item, onClose }: ItemModalProps) {
  // Graceful Escape key bind for elite accessibility
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const pairing = item.pairing;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-sumi-ink/90 backdrop-blur-md transition-opacity duration-500"
      id="item-detail-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative max-w-3xl w-full bg-sumi-ink border border-muted-charcoal p-8 lg:p-12 max-h-[90vh] overflow-y-auto"
        id="item-detail-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-xs uppercase tracking-[0.25em] text-raw-silk/50 hover:text-raw-silk bg-transparent border-none p-2 select-none"
          id="close-modal-btn"
          aria-label="Close modal dialog"
        >
          close / ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start mt-4">
          {/* Left: Image Container */}
          <div className="md:col-span-5">
            <div className="relative aspect-[3/4] border border-muted-charcoal overflow-hidden bg-sumi-ink">
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-[1.08] brightness-[0.92]"
              />
            </div>
          </div>

          {/* Right: Detailed text & Sake Pairing */}
          <div className="md:col-span-7 flex flex-col h-full justify-between">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-raw-silk/40 block mb-2">
                origin: {item.curation}
              </span>
              <h3 className="text-2xl font-serif text-raw-silk leading-tight lowercase tracking-[0.08em] mb-1">
                {item.name}
              </h3>
              <span className="text-xs tracking-[0.25em] font-sans text-raw-silk/40 block mb-6 uppercase">
                {item.japaneseName}
              </span>

              <p className="font-sans text-xs text-raw-silk/75 leading-relaxed lowercase mb-8 tracking-wide">
                {item.description}
              </p>
            </div>

            {/* Custom Premium Sommelier Sake Pairing Block */}
            <div className="border-t border-muted-charcoal pt-6 mt-4">
              <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-raw-silk/40 block mb-3">
                sommelier recommendation
              </span>
              <div className="p-4 bg-muted-charcoal/10 border border-muted-charcoal">
                <span className="font-serif italic lowercase text-raw-silk text-sm block mb-1 tracking-wider">
                  {pairing.name}
                </span>
                <span className="text-[9px] font-mono tracking-[0.2em] text-raw-silk/50 block mb-3 uppercase">
                  {pairing.temp}
                </span>
                <p className="text-[11px] font-sans text-raw-silk/60 leading-relaxed lowercase tracking-wide">
                  {pairing.notes}
                </p>
              </div>
            </div>

            {/* Micro footer detail */}
            <div className="flex justify-between items-baseline mt-8 text-xs font-sans text-raw-silk/40 lowercase tracking-wider">
              <span>single reservation inclusion</span>
              <span>course price: ${item.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
