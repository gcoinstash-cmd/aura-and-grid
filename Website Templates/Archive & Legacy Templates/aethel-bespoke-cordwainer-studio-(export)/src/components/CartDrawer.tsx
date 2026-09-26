import React, { useState } from "react";
import { CartItem } from "../types";
import { X, Trash2, ShieldCheck, Lock, ShoppingBag, ArrowRight } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "verifying" | "success">("idle");
  const [transactionCode, setTransactionCode] = useState<string>("");

  const subtotal = cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

  const handleCheckoutInit = () => {
    if (cart.length === 0) return;
    setCheckoutStep("verifying");
    
    // Simulate high-ticket safe payment processor linkage
    setTimeout(() => {
      const hex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
      setTransactionCode(`AETH-PROV-${hex}-2026`);
      setCheckoutStep("success");
    }, 1800);
  };

  const handleDismissSuccess = () => {
    onClearCart();
    setCheckoutStep("idle");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden font-sans"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
      id="aethel-cart-overlay"
    >
      {/* Dark overlay background with absolute backdrop-blur */}
      <div 
        className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm transition-opacity" 
        onClick={checkoutStep === "verifying" ? undefined : onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-bg-secondary border-l border-bg-tertiary flex flex-col justify-between shadow-2xl relative">
          
          {/* Header segment */}
          <div className="px-6 py-6 border-b border-bg-tertiary flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-accent" />
              <h2 className="text-sm font-mono tracking-widest text-[#FFFFFF] uppercase" id="slide-over-title">
                ATELIER CART ({cart.reduce((total, item) => total + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={checkoutStep === "verifying"}
              className="text-text-secondary hover:text-[#FFFFFF] p-2 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Body Container */}
          <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar">
            {checkoutStep === "idle" && (
              <>
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-3xl text-bg-tertiary font-display">∅</span>
                    <div>
                      <p className="text-text-secondary text-xs font-mono uppercase tracking-widest">
                        Your Atelier Cart Is Free of Selections
                      </p>
                      <p className="text-[11px] text-text-secondary/60 max-w-xs mx-auto mt-2 font-light">
                        Explore our single-operation Goodyear welt lookbook to allocate a premium pair of cordwainer boots.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-xs font-mono text-accent underline mt-4 hover:text-[#FFFFFF]"
                    >
                      Browse Lookbook 01
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex space-x-4 bg-bg-primary border border-bg-tertiary p-4 relative"
                      >
                        {/* Micro-thumbnail with luxury framing */}
                        <div className="w-20 aspect-[4/5] bg-bg-secondary shrink-0 overflow-hidden border border-bg-tertiary">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Text and quantities */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-display text-sm font-semibold text-text-primary">
                                {item.product.name}
                              </h3>
                              <span className="text-xs font-mono text-accent">
                                ${item.product.price * item.quantity}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-accent/80 block uppercase mt-0.5">
                              Size Selected: {item.size}
                            </span>
                            <span className="text-[9px] font-mono text-[#8E8E93] block uppercase mt-0.5">
                              Origin: {item.product.origin}
                            </span>
                          </div>

                          {/* Adjustment metrics */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-1 border border-bg-tertiary bg-bg-secondary px-1">
                              <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="px-2 py-1 text-xs text-text-secondary hover:text-accent font-mono cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-mono text-text-primary">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="px-2 py-1 text-xs text-text-secondary hover:text-accent font-mono cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-text-secondary hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                              title="Remove pair"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Simulated Safe Payment Gateway loading state */}
            {checkoutStep === "verifying" && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 border-t-2 border-r-2 border-accent rounded-full animate-spin" />
                <div className="space-y-2">
                  <h3 className="font-display text-lg text-text-primary">CALIBRATING PRE-ORDER PASS</h3>
                  <p className="text-[11px] font-mono text-accent uppercase tracking-widest">
                    Linking with Secure SSL Cryptography...
                  </p>
                  <p className="text-text-secondary text-xs font-sans max-w-xs leading-relaxed font-light mt-1">
                    Please prepare. Aethel ensures that high-ticket transaction parameters are backed up via distributed tokenization logs.
                  </p>
                </div>
              </div>
            )}

            {/* Preorder reservation success state */}
            {checkoutStep === "success" && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
                <div className="w-12 h-12 bg-accent/20 rounded-full border border-accent/40 flex items-center justify-center text-accent">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display text-xl text-[#FFFFFF]">Pre-Order Allocation Secured!</h3>
                  <p className="text-[11px] font-mono text-accent uppercase">
                    Invoice Code: {transactionCode}
                  </p>
                  <p className="text-text-secondary text-xs font-sans font-light leading-relaxed max-w-xs mx-auto">
                    We have successfully captured your luxury booking details. An billing agent will dispatched a payment portal invoice directly to your registration inbox.
                  </p>
                </div>

                {/* Symmetrical Invoice Ticket box */}
                <div className="w-full bg-bg-primary border border-bg-tertiary p-5 text-left font-mono text-[10px] text-text-secondary space-y-3">
                  <span className="text-[#FFFFFF] text-xs font-medium block border-b border-bg-tertiary pb-2 uppercase">
                    Aethel Dispatch Note Ledger
                  </span>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>SECURE RESERVATIONS</span>
                      <span className="text-accent uppercase">Allocated</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ALLOCATION VAT STATUS</span>
                      <span>Cleared — 0% Import Tariff</span>
                    </div>
                    <div className="flex justify-between font-bold text-accent">
                      <span>TOTAL SECURED COMP BALANCE</span>
                      <span>${subtotal} USD</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDismissSuccess}
                  className="bg-accent text-[#0A0A0A] text-xs font-semibold font-mono py-3.5 px-8 hover:bg-text-primary transition-colors cursor-pointer"
                >
                  DISMISS INVOICE STATE
                </button>
              </div>
            )}
          </div>

          {/* Bottom Footer segment inside the sidebar */}
          {cart.length > 0 && checkoutStep === "idle" && (
            <div className="border-t border-bg-tertiary p-6 bg-bg-primary space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#8E8E93] uppercase">PRE-ORDER SUBTOTAL</span>
                  <span className="text-accent font-semibold">${subtotal} USD</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-text-secondary/70">
                  <span>ATELIER DISPATCH</span>
                  <span className="uppercase text-accent">Free Worldwide Insured Premium Express</span>
                </div>
              </div>

              {/* Secure transaction lock tag */}
              <div className="flex items-center space-x-2 text-[10px] font-mono text-[#8E8E93]/80 bg-bg-secondary p-3 border border-bg-tertiary">
                <Lock className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>
                  High-ticket 256-Bit SSL tokenization secures this transaction checkout window.
                </span>
              </div>

              <button
                onClick={handleCheckoutInit}
                className="w-full bg-accent hover:bg-text-primary text-bg-primary font-mono text-xs font-bold py-4 rounded-none transition-luxury flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>[ PROTOCOL PRE-CHECKOUT ]</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
