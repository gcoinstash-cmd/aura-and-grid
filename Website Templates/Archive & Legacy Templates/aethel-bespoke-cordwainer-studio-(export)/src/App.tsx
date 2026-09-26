/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductMatrix from "./components/ProductMatrix";
import Anatomy from "./components/Anatomy";
import SizingPortal from "./components/SizingPortal";
import EnterpriseUpsell from "./components/EnterpriseUpsell";
import CartDrawer from "./components/CartDrawer";
import { CartItem, Product } from "./types";
import { X, Check } from "lucide-react";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<{ id: string; message: string } | null>(null);

  // Trigger a luxury, eye-safe toast action that slides up elegantly
  const triggerToast = (message: string) => {
    const toastId = Math.random().toString(36).substr(2, 9);
    setActiveToast({ id: toastId, message });
    setTimeout(() => {
      setActiveToast((curr) => (curr?.id === toastId ? null : curr));
    }, 4000);
  };

  const handleAddToCart = (product: Product, size: number) => {
    // Unique ID generation combining product ID and size selection parameter
    const cartItemId = `${product.id}-${size}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            product,
            size,
            quantity: 1,
          },
        ];
      }
    });

    triggerToast(`[ Secure Alloc ] A pair of ${product.name} (Size: ${size}) added to your pipeline.`);
    
    // Smooth high-conversion UX choice: Open the mini-cart automatically after a brief pause
    setTimeout(() => {
      setIsCartOpen(true);
    }, 450);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveItem = (id: string) => {
    const item = cart.find((i) => i.id === id);
    setCart((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      triggerToast(`[ Deallocated ] Removed ${item.product.name} from pipeline.`);
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Luxury Scroll Coordinates Action Toggles
  const handleScrollToSegment = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="bg-bg-primary text-text-primary min-h-screen relative font-sans">
      
      {/* Centered Premium Navigation Segment */}
      <Navbar
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onSizingClick={() => handleScrollToSegment("sizing-architect-portal")}
        onAtelierClick={() => handleScrollToSegment("atelier-lookbook-matrix")}
      />

      {/* Cinematic Split Hero Segment */}
      <Hero onEnterAtelier={() => handleScrollToSegment("atelier-lookbook-matrix")} />

      {/* Symmetrical Broken-Grid Lookbook Storefront */}
      <ProductMatrix 
        onAddToCart={handleAddToCart} 
        onOpenFittingPortal={() => handleScrollToSegment("sizing-architect-portal")}
      />

      {/* Anatomy Interaction Schematic Section */}
      <Anatomy />

      {/* High-Ticket Sizing Core Panel Builder */}
      <SizingPortal />

      {/* High-Contrast Technical Enterprise Upsell Banner & Footer */}
      <EnterpriseUpsell />

      {/* Glide-in Mini-Cart Sidebar Drawer Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Elegant Luxury Toast system */}
      {activeToast && (
        <div 
          className="fixed bottom-6 left-6 z-50 bg-[#121212] border border-accent/30 p-4 shadow-2xl flex items-center justify-between space-x-4 max-w-sm animate-fadeIn"
          style={{ transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
            <p className="text-[11px] font-mono tracking-wider text-text-primary uppercase leading-tight">
              {activeToast.message}
            </p>
          </div>
          <button 
            onClick={() => setActiveToast(null)}
            className="text-text-secondary hover:text-text-primary cursor-pointer p-0.5"
            aria-label="Dismiss Note"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
