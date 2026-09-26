import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Check, ShieldCheck, X, Sparkles, Sliders } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

interface MerchItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  releaseNo: string;
  specs: string[];
  techSpecs: Record<string, string>;
  status: "available" | "limited" | "sold_out";
}

const MERCH_ITEMS: MerchItem[] = [
  {
    id: "gear-01",
    name: "Vandal Heavyweight Hoodie",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600",
    category: "APPAREL",
    releaseNo: "DROP-01//VNDL",
    specs: ["450GSM Organic heavy-knit cotton", "High-density plastisol back graphics", "Cropped modern relaxed boxy silhouette"],
    techSpecs: {
      "MATERIAL": "100% ORGANIC COTTON",
      "THREAD COUNT": "450 GSM WEIGHT",
      "PRINT CORNER": "HIGH-DENSITY PLASTISOL",
      "ORIGIN": "PORTUGAL FACTORY"
    },
    status: "limited"
  },
  {
    id: "gear-02",
    name: "Cyber Chili Extract v2",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600",
    category: "EDIBLES",
    releaseNo: "DROP-02//HEAT",
    specs: ["Aqueous scorpion pepper emulsion", "Yuzu & cold-macerated vinegar base", "50ml amber micro-dropper bottle"],
    techSpecs: {
      "HEAT LEVEL": "1.2M SHU ESTIMATED",
      "DISPATCH": "BATCH #04 [100 COPIES]",
      "BASE FLAVOR": "YUZU CITRUS RIND",
      "ORIGIN": "LOCAL BIO-LABS"
    },
    status: "limited"
  },
  {
    id: "gear-03",
    name: "Sector 9 Turntable Slipmat",
    price: 24.00,
    image: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%25' height='100%25'%3E%3Crect width='400' height='400' fill='%23121214'/%3E%3Ccircle cx='200' cy='200' r='180' fill='%231A1A1E' stroke='%23CCFF00' stroke-width='4'/%3E%3Ccircle cx='200' cy='200' r='160' fill='none' stroke='%2328282C' stroke-width='8'/%3E%3Ccircle cx='200' cy='200' r='140' fill='none' stroke='%23222226' stroke-width='6'/%3E%3Ccircle cx='200' cy='200' r='120' fill='none' stroke='%232E2E34' stroke-width='2' stroke-dasharray='10 5'/%3E%3Ccircle cx='200' cy='200' r='100' fill='none' stroke='%23222226' stroke-width='10'/%3E%3Ccircle cx='200' cy='200' r='80' fill='none' stroke='%2338383F' stroke-width='2'/%3E%3Ccircle cx='200' cy='200' r='60' fill='%23CCFF00'/%3E%3Ccircle cx='200' cy='200' r='48' fill='none' stroke='black' stroke-width='2' stroke-dasharray='6 3'/%3E%3Ccircle cx='200' cy='200' r='30' fill='black'/%3E%3Ccircle cx='200' cy='200' r='8' fill='%23121214' stroke='%23CCFF00' stroke-width='2'/%3E%3Ctext x='200' y='170' font-family='monospace' font-size='8' font-weight='900' fill='black' text-anchor='middle'%3ESECTOR 9%3C/text%3E%3Ctext x='200' y='238' font-family='monospace' font-size='7' font-weight='900' fill='black' text-anchor='middle'%3ESLIPMAT V1%3C/text%3E%3C/svg%3E",
    category: "EQUIPMENT",
    releaseNo: "DROP-03//AUDIO",
    specs: ["Antistatic premium acoustic felt", "Heavy sub-bass vibration dampening", "Dual-channel high-vis ink splatters"],
    techSpecs: {
      "COMPATIBILITY": "12-INCH TURNTABLES",
      "DAMPENING": "SUB-BASS LEVEL OPTIMAL",
      "STATIC COEF": "SHIELD CONSTANT < 0.05",
      "GRAPHIC ID": "STREET VECTOR V1"
    },
    status: "available"
  }
];

export const MerchDrops: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MerchItem | null>(null);
  const [shippingSize, setShippingSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePreOrder = (item: MerchItem) => {
    setSelectedItem(item);
    setShippingSize(item.category === "APPAREL" ? "L" : "N/A");
    setQuantity(1);
  };

  const submitPreOrder = () => {
    if (!selectedItem) return;
    
    // Simulate securing the transaction
    const sizeSuffix = shippingSize !== "N/A" ? ` (SIZE ${shippingSize})` : "";
    setToastMessage(`SUCCESS: PRE-ORDER SECURED FOR ${selectedItem.name.toUpperCase()}${sizeSuffix}!`);
    setSelectedItem(null);

    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <section id="merch" className="py-24 bg-[#080809] border-b border-brand-border px-6 relative">
      <div className="absolute top-1/2 left-0 w-[30%] h-[30%] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs text-brand-orange uppercase tracking-widest font-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" /> LIMITED GEAR INVENTORY // SEASON 01
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
              PHYSICAL GEAR // DROPS
            </h2>
          </div>
          
          <p className="max-w-md text-sm text-brand-muted font-sans leading-relaxed text-left md:text-right">
            Premium crafted apparel and utility equipment designed to reinforce the street culinary cult. Engineered to order in micro-runs.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {MERCH_ITEMS.map((item, idx) => (
            <Card key={item.id} className="h-full flex flex-col justify-between" delayIndex={idx}>
              <div className="space-y-6 text-left">
                
                {/* Visual Image container */}
                <div className="relative aspect-[4/3] bg-brand-bg border border-brand-border/60 overflow-hidden rounded-sm group select-none">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-103 transition-all duration-500 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Category Tag overlay */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-black/90 text-brand-accent text-[9px] font-mono px-2.5 py-1 uppercase tracking-widest border border-brand-border rounded-sm">
                      {item.category}
                    </span>
                    <span className="bg-brand-orange text-white text-[9px] font-mono px-2 py-1 uppercase tracking-widest font-bold rounded-sm">
                      {item.releaseNo}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/85 text-[10px] font-mono font-bold text-white px-2 py-0.5 border border-brand-border rounded-sm">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                {/* Info and Titles */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-brand-muted tracking-widest uppercase block">// CATALOG ITEM // SEC-0{idx+1}</span>
                  <h3 className="font-display text-xl font-extrabold text-white uppercase">
                    {item.name}
                  </h3>
                </div>

                {/* Tech Specs block */}
                <div className="p-4 bg-brand-bg/60 border border-brand-border/40 rounded-sm space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-brand-border/50 pb-2">
                    <Sliders className="w-3.5 h-3.5 text-brand-orange" />
                    <span className="font-mono text-[9px] text-[#8E8E93] tracking-widest uppercase font-bold">SYSTEM TECH SHEET</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    {Object.entries(item.techSpecs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-brand-muted uppercase">{key}:</span>
                        <span className="text-white font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bullet details */}
                <ul className="space-y-1.5 pl-1.5 border-l-2 border-brand-orange/40 text-xs text-brand-muted">
                  {item.specs.map((spec, sIdx) => (
                    <li key={sIdx} className="text-left font-sans">
                      {spec}
                    </li>
                  ))}
                </ul>

              </div>

              {/* Action row */}
              <div className="pt-6 border-t border-brand-border/40 mt-6 flex">
                <Button
                  variant="orange"
                  className="w-full text-xs py-3 h-11 tracking-wider uppercase font-black"
                  onClick={() => handlePreOrder(item)}
                >
                  PRE-ORDER DROP
                </Button>
              </div>

            </Card>
          ))}
        </div>

      </div>

      {/* Interactive Modal Booking */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/92 backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-brand-card border border-brand-border p-6 sm:p-8 rounded-sm select-none z-10"
            >
              {/* Corner tech lines */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-orange" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-orange" />

              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-1.5 bg-brand-bg/50 hover:bg-brand-border text-brand-muted hover:text-white transition-colors border border-brand-border rounded-full cursor-pointer select-none"
                aria-label="Close Pre-order modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6 text-left">
                
                {/* Header */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-brand-orange tracking-widest uppercase font-black block">
                    // UNDERGROUND DISTRIBUTION CHANNELS
                  </span>
                  <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                    SECURE DROP UNIT
                  </h3>
                </div>

                <div className="flex gap-4 items-center p-4 bg-brand-bg/80 border border-brand-border/60 rounded-sm">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-16 h-16 object-cover border border-brand-border rounded-sm grayscale"
                  />
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-brand-accent uppercase">{selectedItem.releaseNo}</span>
                    <h4 className="font-display text-sm font-black text-white uppercase leading-tight">{selectedItem.name}</h4>
                    <span className="block font-mono text-xs text-brand-orange font-bold">${selectedItem.price.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Apparel size selection dynamic overlay state */}
                {selectedItem.category === "APPAREL" && (
                  <div className="space-y-2">
                    <span className="block font-mono text-[9px] text-[#8E8E93] tracking-widest uppercase font-bold">SELECT COMFORT FIT:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {["S", "M", "L", "XL"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setShippingSize(size)}
                          className={`py-2 text-xs font-mono font-bold uppercase transition-all duration-200 border cursor-pointer select-none ${
                            shippingSize === size
                              ? "bg-brand-orange text-white border-brand-orange font-black glow-orange"
                              : "bg-brand-bg text-[#8E8E93] border-brand-border hover:border-brand-muted hover:text-white"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity selector */}
                <div className="flex items-center justify-between py-3 border-y border-brand-border/60">
                  <span className="font-mono text-[10px] text-brand-muted uppercase font-bold">QUANTITY MODULE:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-brand-bg hover:bg-brand-border text-white border border-brand-border transition-colors font-mono cursor-pointer select-none"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-black text-white w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(5, quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center bg-brand-bg hover:bg-brand-border text-white border border-brand-border transition-colors font-mono cursor-pointer select-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Interactive Dynamic Sum Estimation */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-brand-muted uppercase font-bold">COMMITMENT TOTAL:</span>
                  <span className="font-display text-2xl font-black text-brand-accent">
                    ${(selectedItem.price * quantity).toFixed(2)}
                  </span>
                </div>

                {/* Action controls */}
                <div className="space-y-3">
                  <Button
                    variant="orange"
                    className="w-full py-4 h-12 text-xs flex items-center justify-center gap-2 tracking-widest font-bold"
                    onClick={submitPreOrder}
                  >
                    <ShoppingBag className="w-4 h-4 text-white" /> COMMIT CONTRACT NOW
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] text-brand-muted font-mono uppercase text-center w-full">
                    <ShieldCheck className="w-4 h-4 text-brand-orange flex-shrink-0" />
                    <span>Allocated run security verified. Batch shipments arrive within 14 Earth days.</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            id="toast_container_merch"
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-brand-orange text-white font-mono text-xs font-bold tracking-widest px-6 py-4 border border-brand-orange glow-orange uppercase whitespace-nowrap rounded-sm"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
