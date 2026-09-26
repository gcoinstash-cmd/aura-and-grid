import React, { useState } from "react";
import { Product } from "../types";
import { PRODUCTS } from "../data";
import { Eye, Shield, HardHat, Info, Check, Mail, User } from "lucide-react";
import { motion } from "motion/react";

interface ProductMatrixProps {
  onAddToCart: (product: Product, size: number) => void;
  onOpenFittingPortal: () => void;
}

export default function ProductMatrix({ onAddToCart, onOpenFittingPortal }: ProductMatrixProps) {
  // Store selected sizes for each product (mapping productId to selected size)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  
  // Track active detail modal/tab if the user requests full specs on-demand
  const [activeSpecProduct, setActiveSpecProduct] = useState<Product | null>(null);

  // Waitlist States
  const [waitlistProduct, setWaitlistProduct] = useState<Product | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleSizeSelect = (productId: string, size: number) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistName) return;
    setWaitlistSubmitted(true);
  };

  const closeWaitlist = () => {
    setWaitlistProduct(null);
    setWaitlistEmail("");
    setWaitlistName("");
    setWaitlistSubmitted(false);
  };

  const handleAddClick = (product: Product) => {
    if (product.status === "sold_out") {
      setWaitlistProduct(product);
      return;
    }
    const size = selectedSizes[product.id];
    if (!size) {
      // Auto-select first size if nothing selected to keep a seamless frictionless check
      const defaultSize = product.sizes[0];
      handleSizeSelect(product.id, defaultSize);
      onAddToCart(product, defaultSize);
    } else {
      onAddToCart(product, size);
    }
  };

  return (
    <section
      className="py-24 bg-bg-primary border-t border-bg-tertiary relative"
      id="atelier-lookbook-matrix"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header and Pacing Segment */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-[0.3em] text-accent block uppercase">
              STUDIO PORTFOLIO / COLLECTION 01
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-[#FFFFFF] tracking-tight">
              The Broken-Grid Lookbook
            </h2>
          </div>
          <p className="max-w-md text-text-secondary text-sm font-sans font-light leading-relaxed">
            Asymmetrical placement mirrors the unique, uneven textures of raw full-grain leather hides. 
            Select an archetype below to configure your specification.
          </p>
        </div>

        {/* Broken-Grid Layout with luxurious whitespace */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12 items-start" id="lookbook-grid">
          
          {PRODUCTS.map((product, idx) => {
            const isEven = idx % 2 === 0;
            const sizeSelected = selectedSizes[product.id];
            
            // Generate asymmetrical column spans for that magazine feeling
            const gridClasses = isEven 
              ? "md:col-span-7 md:pr-12" 
              : "md:col-span-5 md:mt-24";
            
            return (
              <motion.div
                key={product.id}
                className={`${gridClasses} transition-luxury group flex flex-col`}
                id={`lookbook-item-${product.id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                
                {/* Limited Batch scarcity banner above image */}
                {product.status === "limited" && (
                  <div className="mb-3 font-mono text-[10px] tracking-widest text-accent uppercase flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>[ LIMITED BATCH: {product.inventoryCount} PAIRS REMAINING ]</span>
                  </div>
                )}
                {product.status === "sold_out" && (
                  <div className="mb-3 font-mono text-[10px] tracking-widest text-text-secondary/70 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/40" />
                    <span>[ CURRENT BATCH FULLY SIGNED ]</span>
                  </div>
                )}
                {product.status !== "limited" && product.status !== "sold_out" && (
                  <div className="mb-3 font-mono text-[10px] tracking-widest text-[#FFFFFF]/30 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                    <span>[ REGULAR BATCH CURATION ]</span>
                  </div>
                )}

                {/* Image & Interactive Hover Slide-Up Container */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-bg-secondary border border-bg-tertiary">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Decorative Subtle Dark Shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />

                  {/* Top-Right Category Stamp */}
                  <div className="absolute top-4 right-4 z-10 bg-bg-primary/90 border border-bg-tertiary px-3 py-1 font-mono text-[9px] tracking-widest text-accent uppercase">
                    {product.category}
                  </div>

                  {/* Slide-Up Dashboard Sheet */}
                  <div className="absolute bottom-0 left-0 right-0 bg-bg-secondary/95 border-t border-bg-tertiary p-4 sm:p-6 backdrop-blur-md translate-y-[88%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-25">
                    <div className="flex flex-col min-[380px]:flex-row justify-between items-start mb-3 sm:mb-4 gap-2">
                      <div>
                        <span className="block text-[8px] sm:text-[9px] font-mono tracking-widest text-accent uppercase">
                          Source: {product.origin}
                        </span>
                        <h4 className="font-display text-sm sm:text-base font-semibold text-text-primary mt-0.5">
                          {product.leatherType}
                        </h4>
                      </div>
                      <button 
                        onClick={() => setActiveSpecProduct(product)}
                        className="text-text-secondary hover:text-accent transition-colors p-1 self-end min-[380px]:self-start"
                        title="View Full Sourcing Specs"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sizing Matrix Selection */}
                    <div className="space-y-2 sm:space-y-3 pb-3 sm:pb-4 border-b border-bg-tertiary">
                      <div className="flex flex-col sm:flex-row justify-between text-[9px] sm:text-[10px] font-mono tracking-wider text-text-secondary gap-1">
                        <span>SELECT COUTIER SIZE (UK/US)</span>
                        <span className="text-accent underline cursor-pointer hover:text-text-primary self-start sm:self-auto" onClick={onOpenFittingPortal}>
                          View Sizing Architect
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 max-h-16 sm:max-h-20 overflow-y-auto">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(product.id, size)}
                            className={`min-w-8 h-7 sm:min-w-10 sm:h-8 text-[10px] sm:text-[11px] font-mono border flex items-center justify-center transition-luxury cursor-pointer ${
                              sizeSelected === size
                                ? "bg-accent border-accent text-[#0A0A0A] font-semibold"
                                : "bg-bg-primary border-bg-tertiary text-text-secondary hover:border-accent hover:text-[#FFFFFF]"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Main Pricing / Secure Preorder Action */}
                    <div className="pt-3 sm:pt-4 flex flex-col min-[380px]:flex-row gap-3 min-[380px]:items-center justify-between">
                      <div>
                        <span className="block text-[7px] sm:text-[8px] font-mono text-text-secondary uppercase">VAT & Shipping Included</span>
                        <span className="text-sm sm:text-md font-mono text-accent font-semibold">${product.price} USD</span>
                      </div>
                      
                      <button
                        onClick={() => handleAddClick(product)}
                        className={`w-full min-[380px]:w-auto transition-luxury px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 ${
                          product.status === "sold_out"
                            ? "bg-bg-tertiary border border-bg-tertiary text-text-primary hover:bg-accent hover:text-[#0A0A0A]"
                            : "bg-text-primary text-bg-primary hover:bg-accent hover:text-[#0A0A0A]"
                        }`}
                      >
                        <span>{product.status === "sold_out" ? "[ JOIN RESERVATION WAITLIST ]" : "[ SECURE PAIR ]"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editorial Details beneath the frame */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-6">
                  <div className="space-y-1 flex-1">
                    <span className="font-mono text-[10px] text-accent tracking-widest block font-medium">
                      ARCHETYPE {product.id.split("-")[1]}
                    </span>
                    <h3 className="font-display font-medium text-xl text-text-primary group-hover:text-accent transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-text-secondary text-xs font-sans max-w-sm mt-1 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  
                  {/* Subtle Corner Detail */}
                  <div className="text-left sm:text-right shrink-0">
                    <span className="font-mono text-xs text-text-secondary block">
                      ${product.price}
                    </span>
                    <span className={`text-[8px] font-mono ${product.status === "sold_out" ? "text-text-secondary" : "text-accent/50"}`}>
                      {product.status === "sold_out" ? "Sold Out" : product.status === "limited" ? "Limited" : "In Stock"}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}

        </div>

      </div>

      {/* Sourcing Specs Modal Layer */}
      {activeSpecProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/95 backdrop-blur-md">
          <div className="w-full max-w-xl bg-bg-secondary border border-bg-tertiary p-8 relative">
            <button
              onClick={() => setActiveSpecProduct(null)}
              className="absolute top-6 right-6 text-text-secondary hover:text-[#FFFFFF] font-mono text-xs cursor-pointer"
            >
              [ CLOSE ]
            </button>
            
            <div className="space-y-6">
              <div>
                <span className="text-accent text-[9px] font-mono tracking-widest block uppercase">
                  Sourcing Passport: {activeSpecProduct.category}
                </span>
                <h3 className="font-display text-2xl text-text-primary mt-1">
                  {activeSpecProduct.name} Specifications
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-6 border-y border-bg-tertiary py-6 my-2">
                <div>
                  <span className="block text-[9px] font-mono text-accent uppercase">Leather Tannery Location</span>
                  <span className="text-sm font-sans font-medium text-text-primary">{activeSpecProduct.origin}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-mono text-accent uppercase">Hide Sourcing Variant</span>
                  <span className="text-sm font-sans font-medium text-text-primary">{activeSpecProduct.leatherType}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-mono tracking-widest text-[#FFFFFF] uppercase">
                  ANATOMICAL MATERIALS PROFILE
                </h4>
                <div className="space-y-2.5">
                  {activeSpecProduct.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-mono py-1 border-b border-bg-tertiary/40">
                      <span className="text-text-secondary font-light">{spec.label}</span>
                      <span className="text-accent font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-bg-primary p-4 border border-bg-tertiary flex items-start space-x-3">
                <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Every product incorporates a premium <strong className="text-accent font-medium">closed-channel Goodyear stitching using waxed Irish linen strands</strong>, backed by <strong className="text-accent font-medium">fiddleback oak-bark-tanned outsoles from Joh. Rendenbach</strong>. This masterpiece design creates a physiological posture unique to your foot's skeleton.
                </p>
              </div>

              <div className="text-right">
                <button
                  onClick={() => {
                    if (activeSpecProduct.status === "sold_out") {
                      setWaitlistProduct(activeSpecProduct);
                      setActiveSpecProduct(null);
                      return;
                    }
                    const defaultSize = activeSpecProduct.sizes[0];
                    const selectedSize = selectedSizes[activeSpecProduct.id] || defaultSize;
                    onAddToCart(activeSpecProduct, selectedSize);
                    setActiveSpecProduct(null);
                  }}
                  className="bg-accent text-bg-primary font-mono text-xs font-semibold py-3 px-6 rounded-none hover:bg-[#FFFFFF] transition-luxury"
                >
                  {activeSpecProduct.status === "sold_out" ? "[ JOIN RESERVATION WAITLIST ]" : `SECURE PAIR — $${activeSpecProduct.price}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal Layer */}
      {waitlistProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/95 backdrop-blur-md">
          <div className="w-full max-w-md bg-bg-secondary border border-bg-tertiary p-8 relative">
            <button
              onClick={closeWaitlist}
              className="absolute top-6 right-6 text-text-secondary hover:text-[#FFFFFF] font-mono text-xs cursor-pointer"
            >
              [ CLOSE ]
            </button>

            {!waitlistSubmitted ? (
              <form onSubmit={handleWaitlistSubmit} className="space-y-6">
                <div>
                  <span className="text-accent text-[9px] font-mono tracking-widest block uppercase animate-pulse">
                    BATCH OVER-SUBSCRIBED
                  </span>
                  <h3 className="font-display text-xl text-text-primary mt-1">
                    Join the Reservation Waitlist
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    "{waitlistProduct.name}" is currently sold out. Enter your details below to secure priority queuing for the next wood-bark pit curation release.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-text-secondary block">YOUR NAME</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary/50" />
                      <input
                        type="text"
                        required
                        value={waitlistName}
                        onChange={(e) => setWaitlistName(e.target.value)}
                        placeholder="e.g., Lord Alistair Vance"
                        className="w-full bg-bg-primary border border-bg-tertiary text-text-primary placeholder-text-secondary/35 text-xs font-mono py-2.5 pl-10 pr-4 outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-text-secondary block">SECURE EMAIL ADDRESS</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary/50" />
                      <input
                        type="email"
                        required
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        placeholder="vance@heritage-lineage.com"
                        className="w-full bg-bg-primary border border-bg-tertiary text-text-primary placeholder-text-secondary/35 text-xs font-mono py-2.5 pl-10 pr-4 outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent text-[#0A0A0A] hover:bg-[#FFFFFF] transition-luxury py-3 text-xs font-mono font-semibold uppercase tracking-widest"
                >
                  [ ENROL IN PRIORITY QUEUE ]
                </button>
              </form>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center text-accent">
                    <Check className="w-6 h-6 shrink-0 animate-scale" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest block">
                    QUEUE REGISTRATION RECORDED
                  </span>
                  <h3 className="font-display text-2xl text-text-primary">
                    Position #037 Secured
                  </h3>
                  <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
                    Thank you, <span className="text-text-primary font-medium">{waitlistName}</span>. A priority reservation passport has been dispatched to <span className="text-text-primary font-medium">{waitlistEmail}</span>.
                  </p>
                </div>

                <div className="border-t border-bg-tertiary pt-6 mt-2">
                  <p className="text-[10px] font-mono text-accent/70 uppercase">
                    ESTIMATED RE-STOCK DISPATCH: JULY 2026
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeWaitlist}
                  className="w-full bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/25 text-[#FFFFFF] transition-colors py-2.5 text-xs font-mono uppercase tracking-widest"
                >
                  Acknowledge & Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
