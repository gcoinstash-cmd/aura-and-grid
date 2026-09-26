import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePlatter, ADD_ONS } from "../context/PlatterContext";
import { ShoppingBag, X, Plus, Minus, Trash2, Radio, Zap, ShieldCheck, Check, Loader2 } from "lucide-react";
import { Button } from "./Button";

export const FloatingPlatter: React.FC = () => {
  const {
    cart,
    removeFromPlatter,
    updateQuantity,
    clearPlatter,
    isPlatterOpen,
    setIsPlatterOpen,
    totalPrice
  } = usePlatter();

  const [transmitting, setTransmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Math components for final checkout sheet
  const baseItemsSubtotal = cart.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0);
  const addonsSubtotal = cart.reduce((sum, ci) => {
    const sortedAddOns = [...ci.selectedAddOns];
    const addOnForUnit = ADD_ONS
      .filter((ao) => sortedAddOns.includes(ao.id))
      .reduce((sumAdd, ao) => sumAdd + ao.price, 0);
    return sum + (addOnForUnit * ci.quantity);
  }, 0);

  const handleTransmit = () => {
    if (cart.length === 0) return;
    setTransmitting(true);

    // Simulate elite cryptographically secured dish dispatch transmission
    setTimeout(() => {
      setTransmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        clearPlatter();
        setIsPlatterOpen(false);
      }, 2500);
    }, 2000);
  };

  return (
    <>
      {/* Floating Counter Button in bottom-right corner styled with sharp neon-lime #CCFF00 and premium styling */}
      <AnimatePresence>
        {!isPlatterOpen && totalItemsCount > 0 && (
          <motion.button
            id="floating_platter_trigger"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlatterOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-[#CCFF00] hover:bg-[#DFFF33] text-black p-4 shadow-[0_8px_30px_rgb(204,255,0,0.25)] border border-[#CCFF00] rounded-full flex items-center justify-center gap-3 font-mono text-xs font-black tracking-wider select-none cursor-pointer transition-colors duration-200"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-black stroke-[2.5]" />
              <span className="absolute -top-2.5 -right-2.5 bg-black text-[#CCFF00] text-[9.5px] font-black h-5 w-5 rounded-full flex items-center justify-center border border-[#CCFF00] animate-pulse">
                {totalItemsCount}
              </span>
            </div>
            <span className="hidden sm:inline">ACTIVE PLATTER</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar Overlay and Drawer */}
      <AnimatePresence>
        {isPlatterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-mono">
            
            {/* Dark back drop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!transmitting && !success) setIsPlatterOpen(false);
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute inset-y-0 right-0 max-w-md w-full bg-[#0D0D0E] border-l border-brand-border h-full flex flex-col justify-between shadow-2xl relative"
            >
              {/* Top Tech Headers */}
              <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-bg/50">
                <div className="space-y-1 text-left">
                  <span className="font-mono text-[9px] text-[#8E8E93] tracking-widest uppercase font-bold flex items-center gap-1.5 animate-pulse">
                    <Radio className="w-3.5 h-3.5 text-brand-orange" /> TELEMETRY BROADCAST ACTIVE
                  </span>
                  <h3 className="font-display text-lg font-black text-white uppercase tracking-tight">
                    ACTIVE PLATTER
                  </h3>
                </div>
                
                <button
                  id="close_platter_sidebar"
                  disabled={transmitting || success}
                  onClick={() => setIsPlatterOpen(false)}
                  className="p-1.5 bg-brand-bg/80 hover:bg-brand-border text-brand-muted hover:text-white transition-colors border border-brand-border rounded-full select-none cursor-pointer disabled:opacity-50"
                  aria-label="Close Platter"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Central loadout lists */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-none">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-16 h-16 rounded-full border border-dashed border-brand-border flex items-center justify-center text-brand-muted">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-xs font-bold text-white uppercase">// SYSTEM EMPTY</span>
                      <p className="text-[10px] text-brand-muted max-w-xs font-sans leading-relaxed">
                        No food units committed to local grid. Access Flavor Index below to secure culinary modules.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] text-brand-muted border-b border-brand-border/40 pb-2 uppercase">
                      <span>LOADOUT INDEX ({totalItemsCount} SECS)</span>
                      <span>COMPOSITION PRICE</span>
                    </div>

                    {cart.map((item) => {
                      // Resolve selected add ons labels
                      const activeAddonsList = ADD_ONS.filter((ao) =>
                        item.selectedAddOns.includes(ao.id)
                      );

                      return (
                        <div
                          key={item.id}
                          className="p-4 bg-brand-card/70 border border-brand-border rounded-sm space-y-3 hover:border-brand-accent/30 transition-colors duration-200 text-left"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-0.5">
                              <h4 className="font-display text-sm font-black text-white uppercase tracking-tight">
                                {item.menuItem.name}
                              </h4>
                              <span className="block text-[8px] font-mono text-brand-accent uppercase">
                                SECTOR // {item.menuItem.id.toUpperCase()}
                              </span>
                            </div>
                            <span className="font-mono text-xs font-bold text-brand-accent">
                              ${(item.singleItemPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          {/* Add-ons label breakdown if present */}
                          {activeAddonsList.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {activeAddonsList.map((ao) => (
                                <span
                                  key={ao.id}
                                  className="bg-brand-bg text-[8px] font-mono text-[#8E8E93] border border-brand-border/80 py-0.5 px-2 uppercase rounded-sm"
                                >
                                  + {ao.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Adjuster controls */}
                          <div className="flex justify-between items-center pt-2 border-t border-brand-border/30">
                            <div className="flex items-center gap-2">
                              <button
                                disabled={transmitting || success}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center bg-brand-bg hover:bg-brand-border text-[#E4E4E7] border border-brand-border rounded-sm transition-colors cursor-pointer select-none disabled:opacity-50"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-black text-white w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                disabled={transmitting || success}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center bg-brand-bg hover:bg-brand-border text-[#E4E4E7] border border-brand-border rounded-sm transition-colors cursor-pointer select-none disabled:opacity-50"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              disabled={transmitting || success}
                              onClick={() => removeFromPlatter(item.id)}
                              className="text-[#8E8E93] hover:text-brand-orange transition-colors duration-150 p-1 cursor-pointer select-none disabled:opacity-50"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Checkout Summations Section in Monospace sheet */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-brand-border bg-[#09090A] space-y-4">
                  {/* Ledger specifications */}
                  <div className="space-y-1.5 text-xs text-[#8E8E93]">
                    <div className="flex justify-between">
                      <span>BASE INGREDIENTS SUMLINE:</span>
                      <span className="text-white font-bold">${baseItemsSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PREMIUM ADD-ON COMPONENTS:</span>
                      <span className="text-white font-bold">${addonsSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brand-accent/80">
                      <span>TRANSMIT HANDSHAKE TAX (0%):</span>
                      <span>FREE</span>
                    </div>
                    <div className="border-t border-brand-border/40 my-2" />
                    
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="font-black text-white text-[10px] tracking-wider uppercase">// PLATTER MATRIX TOTAL:</span>
                      <span className="font-display text-2xl font-black text-[#CCFF00] tracking-tight">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Operational Transmission Buttons */}
                  <div className="space-y-2">
                    <Button
                      variant={success ? "success" : "orange"}
                      disabled={transmitting || success}
                      onClick={handleTransmit}
                      className={`w-full py-4 h-13 text-xs flex items-center justify-center gap-2 select-none font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden ${
                        success ? "bg-[#33FF66] border-[#33FF66] text-black font-black" : "bg-brand-orange border-brand-orange text-white"
                      }`}
                    >
                      {transmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                          <span>TRANSMITTING BATCH TO TRUCK DISPATCH...</span>
                        </>
                      ) : success ? (
                        <>
                          <Check className="w-4 h-4 text-black stroke-[3.5]" />
                          <span>TRANSMITTED! EN-ROUTE</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-white animate-pulse" />
                          <span>TRANSMIT ORDER TO DISPATCH</span>
                        </>
                      )}
                    </Button>
                    
                    <div className="flex items-center justify-center gap-1.5 text-[9px] text-brand-muted text-center w-full uppercase">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Encrypted direct-line telemetry dispatch</span>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
