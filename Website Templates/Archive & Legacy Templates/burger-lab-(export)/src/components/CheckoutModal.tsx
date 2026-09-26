/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, Lock, Gift, Star, FileText, Smartphone, Laptop, CheckCircle2 } from 'lucide-react';
import { ThemeConfig } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandAngleName: string;
  price: number;
  currentTheme: ThemeConfig;
  accentColor: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  brandAngleName,
  price,
  currentTheme,
  accentColor
}: CheckoutModalProps) {
  const [email, setEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity duration-300">
      {/* Modal Card */}
      <div
        className={`relative w-full max-w-2xl rounded-lg border overflow-hidden shadow-2xl transition-all duration-300 flex flex-col md:flex-row ${currentTheme.cardBg} ${currentTheme.borderColor} ${currentTheme.textColor}`}
        id="gumroad-checkout-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-800/10 cursor-pointer text-current z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <>
            {/* Left Column: Product Details Summary */}
            <div className="p-6 md:w-5/12 border-b md:border-b-0 md:border-r border-neutral-300/20 flex flex-col justify-between bg-black/10">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest uppercase mb-4" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                  AURA & GRID TEMPLATE
                </span>
                
                <h3 className="text-lg font-grotesk tracking-tight font-bold mb-1">
                  Burger Lab Website
                </h3>
                <p className="text-xs opacity-75 font-sans mb-4">
                  Sleek, design-forward landing template in <strong className="font-semibold">{brandAngleName}</strong> edition presets.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <Check className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    <span>Bone-White & Dark layers</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <Check className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    <span>Single-Minute preset toggle</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <Check className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    <span>Responsive React codebase</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <Check className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    <span>Setup README manual (.zip)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-300/10">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-mono">Template Pack</span>
                  <span className="text-xl font-bold font-grotesk" style={{ color: accentColor }}>
                    ${price.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-1.5 items-center text-[10px] opacity-75">
                  <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                  <span>5.0 rating (3 real reviews)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Gumroad Payment Fields */}
            <form onSubmit={handlePurchase} className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                <div className="flex gap-2 items-center mb-1">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">
                    Secure Gumroad Checkout
                  </span>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider mb-1 opacity-70">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., hospitality_owner@gmail.com"
                    className={`w-full text-xs p-2.5 rounded bg-transparent border ${currentTheme.borderColor} focus:outline-none focus:ring-1`}
                    style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                  />
                </div>

                {/* Card Name */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider mb-1 opacity-70">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g., Maddox Voss"
                    className={`w-full text-xs p-2.5 rounded bg-transparent border ${currentTheme.borderColor} focus:outline-none focus:ring-1`}
                    style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                  />
                </div>

                {/* Card details */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider mb-1 opacity-70">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    className={`w-full text-xs p-2.5 rounded bg-transparent border ${currentTheme.borderColor} focus:outline-none focus:ring-1`}
                    style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                  />
                </div>

                {/* CVC and Expiry */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider mb-1 opacity-70">
                      Expiration (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="12 / 28"
                      className="w-full text-xs p-2.5 rounded bg-transparent border focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider mb-1 opacity-70">
                      Security Code (CVC) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="849"
                      className="w-full text-xs p-2.5 rounded bg-transparent border focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full p-3 rounded font-mono font-bold text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 leading-none"
                  style={{ backgroundColor: accentColor, color: '#000000' }}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      processing receipt...
                    </span>
                  ) : (
                    <>
                      Confirm & Pay ${price}
                    </>
                  )}
                </button>
                <div className="flex justify-center items-center gap-1.5 text-[9px] font-mono opacity-60 text-center mt-3">
                  <Lock className="w-3 h-3" />
                  <span>SSL Encrypted Delivery • Instant ZIP Download</span>
                </div>
              </div>
            </form>
          </>
        ) : (
          /* Receipt / Download Screen */
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-5 w-full bg-black/15">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full" style={{ backgroundColor: `${accentColor}15` }}>
              <CheckCircle2 className="w-8 h-8" style={{ color: accentColor }} />
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-xl font-grotesk font-bold tracking-tight">Order Confirmed! Receipt Transmitted.</h3>
              <p className="text-xs opacity-80 font-sans">
                A verification copy has been sent to <strong className="font-semibold">{email || 'you@hospitality.com'}</strong>. Your premium asset is prepped and compressed.
              </p>
            </div>

            {/* Simulated file download grid */}
            <div className="p-4 w-full max-w-md rounded border text-left font-mono text-xs divide-y divide-neutral-300/10 bg-black/20" style={{ borderColor: `${accentColor}40` }}>
              <div className="pb-2.5 flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span className="block font-bold text-[11px]">aura_burger_lab_react.zip</span>
                    <span className="block text-[9px] opacity-70">React + Vite standard production base</span>
                  </div>
                </div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Mock Downloader triggered! Inside are all directories (src/, package.json, index.css) configured for direct deployment.");
                  }}
                  className="px-2.5 py-1.5 rounded text-[10px] bg-neutral-800 hover:bg-neutral-700 font-bold border border-neutral-700"
                >
                  Download (1.4 MB)
                </a>
              </div>

              <div className="pt-2.5 pb-2.5 flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span className="block font-bold text-[11px]">manual_setup_guide.pdf</span>
                    <span className="block text-[9px] opacity-70">Colors, typography, dynamic route swap manual</span>
                  </div>
                </div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Mock manual download complete!");
                  }}
                  className="px-2.5 py-1.5 rounded text-[10px] bg-neutral-800 hover:bg-neutral-700 font-bold border border-neutral-700"
                >
                  Download (420 KB)
                </a>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-mono opacity-70">
                GUMROAD RECEIPT ID: <strong className="font-bold">GR-TEMPLATE-{(Math.random() * 500000).toFixed(0)}</strong>
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                  setCardNumber('');
                  setCardName('');
                  setCvc('');
                  onClose();
                }}
                className="px-4 py-2 border rounded text-xs font-mono tracking-wider hover:bg-neutral-100/10 cursor-pointer text-current"
              >
                Return to Live Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
