/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, Sparkles, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, OrderTrackState } from '../types';

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (cartId: string, newQty: number) => void;
  onRemove: (cartId: string) => void;
  loyaltyPoints: number;
  onRedeemPoints: (pointsRequested: number) => number; // Returns actual cash discount computed
  onCheckoutComplete: (pointsEarned: number, orderState: OrderTrackState) => void;
}

export default function BagDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemove,
  loyaltyPoints,
  onRedeemPoints,
  onCheckoutComplete
}: BagDrawerProps) {
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [redeemedDiscount, setRedeemedDiscount] = useState<number>(0);
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'shipping'>('pickup');
  const [address, setAddress] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple'>('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedState, setGeneratedState] = useState<OrderTrackState | null>(null);

  // Subtotal calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const pointsEarnedOnOrder = Math.floor(subtotal) * (fulfillmentType === 'pickup' ? 2 : 1); // Double points on pickup
  
  // Tax & Total calculation
  const calculatedDiscount = redeemedDiscount;
  const taxableAmount = Math.max(0, subtotal - calculatedDiscount);
  const tax = parseFloat((taxableAmount * 0.095).toFixed(2)); // LA Sales Tax 9.5%
  const shippingFee = fulfillmentType === 'shipping' ? 8.00 : 0;
  const finalTotal = parseFloat((taxableAmount + tax + shippingFee).toFixed(2));

  const handleApplyPoints = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedVal = Math.min(Math.max(0, pointsToRedeem), loyaltyPoints);
    setPointsToRedeem(sanitizedVal);
    
    // 100 points = $5.00
    const discountCash = parseFloat(((sanitizedVal / 100) * 5).toFixed(2));
    
    // Check if discount is more than subtotal
    if (discountCash > subtotal) {
      alert(`Applied discount cannot exceed subtotal. Try redeeming fewer points.`);
      return;
    }
    
    setRedeemedDiscount(discountCash);
  };

  const handleApplyMaxPoints = () => {
    // 100 points = $5.00
    // Maximum possible score discount
    const maxPossPoints = Math.min(loyaltyPoints, Math.floor(subtotal / 5) * 100);
    setPointsToRedeem(maxPossPoints);
    const discountCash = parseFloat(((maxPossPoints / 100) * 5).toFixed(2));
    setRedeemedDiscount(discountCash);
  };

  const handleMockCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      const trackingCode = `OBSDN-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderData: OrderTrackState = {
        orderId: trackingCode,
        status: fulfillmentType === 'pickup' ? 'preparing' : 'brewing',
        estimatedTime: fulfillmentType === 'pickup' ? '15 Minutes' : '2-3 Business Days',
        items: cart.map(item => `${item.quantity} x ${item.name} (${item.grind})`),
        pickupCode: `SLOW-${Math.floor(10 + Math.random() * 89)}`
      };

      setGeneratedState(orderData);
      
      // Dispatch state update callback
      onCheckoutComplete(pointsEarnedOnOrder - pointsToRedeem, orderData);
    }, 2000);
  };

  const clearAndClose = () => {
    setIsSuccess(false);
    setShowCheckout(false);
    setPointsToRedeem(0);
    setRedeemedDiscount(0);
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pointer-events-auto"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0C0C0C] border-l border-[#262626] shadow-2xl z-50 flex flex-col h-full overflow-hidden"
          >
            
            {/* Header section */}
            <div className="p-6 border-b border-[#262626] flex justify-between items-center bg-[#121212]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C5A880] animate-pulse" />
                <h3 className="font-serif text-lg tracking-wider text-[#F5F5F3]">YOUR BAG</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 px-3 text-[#A3A3A3] hover:text-[#C5A880] font-mono text-[10px] tracking-widest uppercase flex items-center space-x-1 cursor-pointer"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main content layer */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar space-y-6">
              
              {isSuccess ? (
                /* Cinematic Order Success Screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                >
                  <CheckCircle className="w-16 h-16 text-[#C5A880] stroke-[1.5]" />
                  
                  <div className="space-y-2">
                    <h4 className="font-serif text-2xl font-light text-[#F5F5F3]">Order Secured.</h4>
                    <p className="font-sans text-xs text-[#A3A3A3] max-w-sm leading-relaxed">
                      Your transaction has been finalized through our encrypted workspace. Your artisanal roasting queue has begun.
                    </p>
                  </div>

                  {generatedState?.status === 'preparing' ? (
                    <div className="bg-[#121212] border border-[#262626] p-4.5 rounded-none w-full text-left space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-neutral-800 pb-2">
                        <span className="text-[#A3A3A3]">PICKUP CODE:</span>
                        <span className="text-[#C5A880] font-bold">{generatedState.pickupCode}</span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400">
                        ESTIMATED PICKUP TIME: <span className="text-[#F5F5F3] font-bold">{generatedState.estimatedTime}</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 font-sans leading-relaxed">
                        Please head over to the physical slow bar in the Los Angeles Arts District once the tracker status updates to 'ready'.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#121212] border border-[#262626] p-4.5 rounded-none w-full text-left">
                      <span className="font-mono text-[9px] text-zinc-500 block">ESTIMATED COURIER SHIPPED DELIVERY:</span>
                      <span className="font-serif text-sm text-[#F5F5F3] block mt-1">2 - 3 Business Days</span>
                    </div>
                  )}

                  <div className="w-full space-y-3 font-mono text-xs border-t border-[#262626] pt-5 text-left">
                    <div className="flex justify-between text-neutral-400">
                      <span>Order tracking token:</span>
                      <span className="text-[#F5F5F3] font-medium">{generatedState?.orderId}</span>
                    </div>
                    <div className="flex justify-between text-[#C5A880]">
                      <span>Loyalty score change:</span>
                      <span>
                        {pointsToRedeem > 0 ? `-${pointsToRedeem} Spent` : `+${pointsEarnedOnOrder} Earned`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={clearAndClose}
                    className="w-full bg-[#C5A880] text-[#080808] font-mono text-[10px] font-semibold tracking-widest py-4 uppercase cursor-pointer"
                  >
                    CONTINUE OBSERVING
                  </button>
                </motion.div>
                
              ) : showCheckout ? (
                /* Payment Checkout Screen */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="w-4 h-4 text-[#C5A880]" />
                    <span className="font-serif text-sm tracking-widest text-[#F5F5F3] uppercase">ENCRYPTED GATEWAY</span>
                  </div>

                  {/* Toggle secure payments */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`py-3 text-[10px] font-mono tracking-widest uppercase border ${
                        paymentMethod === 'card'
                          ? 'border-[#C5A880] text-[#C5A880] bg-[#C5A880]/5'
                          : 'border-[#262626] text-[#A3A3A3] hover:border-neutral-700'
                      }`}
                    >
                      Credit Card
                    </button>
                    <button
                      onClick={() => setPaymentMethod('apple')}
                      className={`py-3 text-[10px] font-mono tracking-widest uppercase border flex items-center justify-center space-x-1.5 ${
                        paymentMethod === 'apple'
                          ? 'border-[#C5A880] text-[#C5A880] bg-[#C5A880]/5'
                          : 'border-[#262626] text-[#A3A3A3] hover:border-neutral-700'
                      }`}
                    >
                      <span> PAY</span>
                    </button>
                  </div>

                  {paymentMethod === 'apple' ? (
                    <div className="border border-dashed border-[#262626] p-6 text-center space-y-3 bg-[#121212]/30">
                      <p className="font-mono text-[11px] text-[#A3A3A3]">Apple Pay Secure Token Ready</p>
                      <button
                        onClick={handleMockCheckout}
                        disabled={isProcessing}
                        className="bg-[#C5A880] text-[#080808] font-mono text-[11px] font-bold tracking-[0.2em] w-full py-4 uppercase cursor-pointer"
                      >
                        {isProcessing ? 'CONFIRMING VIA TOUCH ID...' : 'PAY $0.00 WITH  PAY'.replace('$0.00', `$${finalTotal}`)}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleMockCheckout} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          placeholder="SORELLA KISSA"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full bg-[#121212] border border-[#262626] font-mono text-xs focus:text-[#F5F5F3] text-[#A3A3A3] p-3 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">Card Number</label>
                        <input
                          type="text"
                          required
                          pattern="\d{16}"
                          maxLength={16}
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-[#121212] border border-[#262626] font-mono text-xs focus:text-[#F5F5F3] text-[#A3A3A3] p-3 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">Expiry Date</label>
                          <input
                            type="text"
                            required
                            placeholder="MM / YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-[#121212] border border-[#262626] font-mono text-xs focus:text-[#F5F5F3] text-[#A3A3A3] p-3 focus:outline-none focus:border-[#C5A880] text-center"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">CVV</label>
                          <input
                            type="text"
                            required
                            pattern="\d{3}"
                            maxLength={3}
                            placeholder="***"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-[#121212] border border-[#262626] font-mono text-xs focus:text-[#F5F5F3] text-[#A3A3A3] p-3 focus:outline-none focus:border-[#C5A880] text-center"
                          />
                        </div>
                      </div>

                      {/* Summary details before trigger */}
                      <div className="bg-[#121212] border border-[#262626]/60 p-4 space-y-2 font-sans text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#A3A3A3]">Fulfillment:</span>
                          <span className="text-[#F5F5F3] capitalize">{fulfillmentType}</span>
                        </div>
                        <div className="flex justify-between border-t border-neutral-800/40 pt-2 font-semibold">
                          <span className="text-[#A3A3A3]">Amount to Charge:</span>
                          <span className="text-[#C5A880] font-mono">${finalTotal}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-[#C5A880] text-[#080808] font-mono text-[10px] font-bold tracking-[0.2em] py-4 uppercase flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <span>COMMUNICATING WITH NODE SECURE...</span>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>AUTHORIZE DIGITAL PAYMENT</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full border border-[#262626] hover:border-[#C5A880]/30 font-mono text-[9px] text-[#A3A3A3] hover:text-[#F5F5F3] py-2.5 uppercase tracking-widest transition-colors"
                  >
                    Adjust Basket / Return
                  </button>
                </motion.div>
                
              ) : cart.length === 0 ? (
                /* Empty bag slide */
                <div className="py-24 text-center space-y-4">
                  <span className="font-serif text-lg text-neutral-500 italic">"The cup is empty."</span>
                  <p className="font-sans text-xs text-[#A3A3A3] max-w-xs mx-auto leading-relaxed">
                    Choose from our curated collection list to initiate your roasting profile and earn exclusive LA slow-bar loyalty rewards.
                  </p>
                  <button
                    onClick={onClose}
                    className="border border-[#C5A880]/40 text-[#C5A880] font-mono text-[9.5px] tracking-widest px-6 py-2.5 uppercase hover:bg-[#C5A880]/5"
                  >
                    RETURN TO THE SHOWCASE
                  </button>
                </div>
              ) : (
                /* Selected coffee list */
                <div className="space-y-6">
                  
                  {/* Fulfillment Type */}
                  <div className="space-y-2 border-b border-[#262626] pb-4.5">
                    <span className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase">Fulfillment Method</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFulfillmentType('pickup')}
                        className={`flex flex-col items-center p-3 border font-mono text-[10px] tracking-widest transition-all text-center ${
                          fulfillmentType === 'pickup'
                            ? 'border-[#C5A880] text-[#C5A880] bg-[#C5A880]/5'
                            : 'border-[#262626] text-[#A3A3A3] hover:border-neutral-700'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 mb-1 text-[#C5A880]" />
                        <span>SLOW-BAR PICKUP</span>
                        <span className="text-[7.5px] text-[#A3A3A3] mt-1">2X LOYALTY PTS</span>
                      </button>

                      <button
                        onClick={() => setFulfillmentType('shipping')}
                        className={`flex flex-col items-center p-3 border font-mono text-[10px] tracking-widest transition-all text-center ${
                          fulfillmentType === 'shipping'
                            ? 'border-[#C5A880] text-[#C5A880] bg-[#C5A880]/5'
                            : 'border-[#262626] text-[#A3A3A3] hover:border-neutral-700'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5 mb-1" />
                        <span>COURIER MAIL</span>
                        <span className="text-[7.5px] text-[#A3A3A3] mt-1">$8.00 FEE</span>
                      </button>
                    </div>
                  </div>

                  {/* Coffee Item Array list */}
                  <div className="space-y-4 max-h-72 overflow-y-auto no-scrollbar scroll-smooth">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 border border-[#262626] p-3.5 bg-[#121212]"
                      >
                        <div className="flex-1 space-y-1 text-left">
                          <h5 className="font-serif text-sm font-medium text-[#F5F5F3]">{item.name}</h5>
                          <span className="font-mono text-[9px] text-[#C5A880] block uppercase tracking-wider">{item.grind} grind</span>
                          
                          {/* Qty edit controllers */}
                          <div className="flex items-center space-x-2.5 pt-1.5">
                            <button
                              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                              className="w-5 h-5 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 hover:border-neutral-600 text-[#A3A3A3]"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="font-mono text-xs text-[#F5F5F3]">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                              className="w-5 h-5 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 hover:border-neutral-600 text-[#A3A3A3]"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <span className="font-mono text-xs text-[#F5F5F3] font-semibold block">${item.price * item.quantity}</span>
                          <button
                            onClick={() => onRemove(item.id)}
                            className="text-neutral-600 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Loyalty Point Redemption Panel */}
                  <div className="bg-[#121212] border border-[#262626] p-4.5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#A3A3A3]">
                      <span>POINTS BALANCE:</span>
                      <span className="text-[#C5A880] font-bold">{loyaltyPoints} pts</span>
                    </div>

                    {loyaltyPoints >= 50 ? (
                      <div className="space-y-2">
                        <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                          Redeem in sets of 100 points to deduct <span className="text-[#C5A880] font-medium">$5.00</span> from your cart subtotal.
                        </p>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="50"
                            step="50"
                            max={loyaltyPoints}
                            value={pointsToRedeem}
                            onChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
                            className="bg-[#080808] border border-[#262626] font-mono text-xs py-1.5 px-3 focus:outline-none focus:border-[#C5A880] text-[#F5F5F3] w-24"
                          />
                          <button
                            onClick={handleApplyPoints}
                            className="border border-[#C5A880]/45 hover:bg-[#C5A880] hover:text-[#080808] text-[#C5A880] font-mono text-[9px] tracking-widest px-4 py-2 transition-colors uppercase cursor-pointer"
                          >
                            APPLY
                          </button>
                          <button
                            onClick={handleApplyMaxPoints}
                            className="border border-neutral-800 hover:border-neutral-600 font-mono text-[9px] text-[#A3A3A3] px-3 py-2 uppercase"
                          >
                            MAX
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="font-mono text-[9px] text-[#A3A3A3]/50 italic">
                        Earn {50 - loyaltyPoints} more points to unlock redeemable checkout rewards.
                      </span>
                    )}

                    {redeemedDiscount > 0 && (
                      <div className="flex justify-between items-center bg-[#080808] border border-[#C5A880]/10 px-3 py-1.5">
                        <span className="font-mono text-[9px] text-[#C5A880]">APPLIED REWARD DISCOUNT:</span>
                        <span className="font-mono text-xs text-[#C5A880] font-bold">-${redeemedDiscount}</span>
                      </div>
                    )}
                  </div>

                  {/* Summary math calculations */}
                  <div className="border-t border-[#262626] pt-4.5 space-y-2.5 font-sans text-xs text-[#A3A3A3]">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-mono text-neutral-300 font-medium">${subtotal}</span>
                    </div>

                    {redeemedDiscount > 0 && (
                      <div className="flex justify-between text-[#C5A880]">
                        <span>Loyalty Discount:</span>
                        <span className="font-mono">-${redeemedDiscount}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Est. LA Sales Tax (9.5%):</span>
                      <img src="" alt="" className="hidden" />
                      <span className="font-mono text-neutral-300">${tax}</span>
                    </div>

                    {fulfillmentType === 'shipping' && (
                      <div className="flex justify-between">
                        <span>Courier Shipping:</span>
                        <span className="font-mono text-neutral-300">$8.00</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#F5F5F3] font-serif text-sm font-semibold border-t border-[#262626] pt-3.5">
                      <span>Total:</span>
                      <span className="font-mono text-[#C5A880]">${finalTotal}</span>
                    </div>

                    <div className="flex justify-between items-center font-mono text-[9px] bg-[#121212] px-3 py-2 text-neutral-400">
                      <span>ESTIMATED LOYALTY REWARDS:</span>
                      <span className="text-[#C5A880] font-semibold">+{pointsEarnedOnOrder} pts</span>
                    </div>
                  </div>

                  {fulfillmentType === 'pickup' && (
                    <div className="flex items-center space-x-2 bg-[#121212] border border-[#C5A880]/15 p-3 rounded-none text-left">
                      <MapPin className="w-4.5 h-4.5 text-[#C5A880]" />
                      <div className="space-y-0.5">
                        <span className="font-mono text-[9px] text-[#F5F5F3] block">PICKUP DESK</span>
                        <span className="font-sans text-[10px] text-zinc-500 block leading-relaxed">
                          Secured for counter collections at 824 E 3rd St, LA Arts District.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Complete form triggers */}
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-[#C5A880] text-[#080808] font-mono text-[11px] font-bold tracking-[0.25em] py-4.5 uppercase hover:bg-neutral-100 hover:text-[#080808] transition-all transform active:scale-98 cursor-pointer"
                  >
                    PROCEED TO GATEWAY
                  </button>

                </div>
              )}

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
