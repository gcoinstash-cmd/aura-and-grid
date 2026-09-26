/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, Info, Check, ShieldCheck, HelpCircle, Bell, X, Compass, Award } from 'lucide-react';

// Core imports
import { CoffeeBean, CartItem, NotificationAlert, OrderTrackState, Review } from './types';
import { COFFEE_BEANS, INITIAL_REVIEWS, NOTIFICATION_ALERTS } from './data';

// Component imports
import Header from './components/Header';
import Hero from './components/Hero';
import Collection from './components/Collection';
import BagDrawer from './components/BagDrawer';
import ResidencyStories from './components/ResidencyStories';
import RoastersAlliance from './components/RoastersAlliance';
import TastingRoomBar from './components/TastingRoomBar';
import TastingMap from './components/TastingMap';
import ReviewsList from './components/ReviewsList';
import NotificationSettings from './components/NotificationSettings';

// Mock Browser Toast item interface
interface ToastNotif {
  id: string;
  title: string;
  desc: string;
  type: 'omakase' | 'seasonal' | 'alliance';
}

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(250); // Set to 250 for instant test redeems
  
  // Custom states that expand on data.ts
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(NOTIFICATION_ALERTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [currentOrder, setCurrentOrder] = useState<OrderTrackState | null>(null);
  
  // Overlay details of specific roast
  const [detailedCoffee, setDetailedCoffee] = useState<CoffeeBean | null>(null);

  // Active in-app mock push alerts toast queue
  const [activeToasts, setActiveToasts] = useState<ToastNotif[]>([]);

  // Triggering visual browser push alert toast
  const handleTriggerToast = (title: string, desc: string, type: 'omakase' | 'seasonal' | 'alliance') => {
    const freshToast: ToastNotif = {
      id: `toast-${Date.now()}`,
      title,
      desc,
      type
    };

    setActiveToasts(prev => [freshToast, ...prev]);

    // Automatically purge toast after 6 seconds
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== freshToast.id));
    }, 6000);
  };

  const handleAddToBag = (coffee: CoffeeBean, grind: string) => {
    const cartId = `${coffee.id}-${grind}`;
    setCart(prev => {
      const existing = prev.find(item => item.id === cartId);
      if (existing) {
        return prev.map(item => item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: cartId,
        coffeeId: coffee.id,
        name: coffee.name,
        price: coffee.price,
        grind,
        quantity: 1
      }];
    });

    // Provide a beautiful little toast notification feedback
    handleTriggerToast(
      'Cart Allocation Secured',
      `Locked 250g of ${coffee.name} (${grind}) into your shopping bag.`,
      'seasonal'
    );
  };

  const handleUpdateQty = (cartId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartId ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (cartId: string) => {
    const targetItem = cart.find(item => item.id === cartId);
    setCart(prev => prev.filter(item => item.id !== cartId));
    if (targetItem) {
      handleTriggerToast(
        'Item purge',
        `Purged target bags of ${targetItem.name} from checkout bag.`,
        'alliance'
      );
    }
  };

  // Redeem logic
  const handleRedeemPoints = (pointsRequested: number) => {
    const allowableRedeem = Math.min(loyaltyPoints, pointsRequested);
    // Calculation: 100 points = $5.00
    const calculatedCash = parseFloat(((allowableRedeem / 100) * 5).toFixed(2));
    return calculatedCash;
  };

  const handleCheckoutComplete = (adjustedPointsBalance: number, orderData: OrderTrackState) => {
    setCart([]); // Clear cart
    setLoyaltyPoints(adjustedPointsBalance);
    setCurrentOrder(orderData); // Place order state in queue tracker
    
    // Jump user focus directly to map coordinates to inspect live brew updates
    setTimeout(() => {
      const element = document.getElementById('location');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveTab('location');
      }
    }, 500);

    handleTriggerToast(
      'Transaction Finalized',
      `Allocated Order tracking reference: ${orderData.orderId}. Head over to LA Counter map desk.`,
      'seasonal'
    );
  };

  const handleToggleAlertChannel = (id: string) => {
    setNotifications(prev => prev.map(notif => {
      if (notif.id === id) {
        return { ...notif, isActive: !notif.isActive };
      }
      return notif;
    }));
  };

  const handleAddReview = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
    // Award loyalty metric for verified feedback
    setLoyaltyPoints(p => p + 50);
    handleTriggerToast(
      'Feedback Logged Score',
      'Awarded 50 Loyalty points for leaving verified single origin review.',
      'alliance'
    );
  };

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(id);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#F5F5F3] font-sans overflow-x-hidden grain">
      
      {/* Master Header */}
      <Header
        cart={cart}
        setCartOpen={setCartOpen}
        points={loyaltyPoints}
        notifications={notifications}
        toggleNotificationAlert={handleToggleAlertChannel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setSettingsOpen(true)}
      />

      {/* Main Sections */}
      <main className="relative">
        <Hero onCtaclick={() => handleScrollToSection('collection')} />
        <Collection
          onAddToBag={handleAddToBag}
          onSelectCoffee={setDetailedCoffee}
        />
        <ResidencyStories />
        <RoastersAlliance
          loyaltyPoints={loyaltyPoints}
          onUpdateLoyaltyPoints={setLoyaltyPoints}
        />
        <TastingRoomBar
          loyaltyPoints={loyaltyPoints}
          onUpdateLoyaltyPoints={setLoyaltyPoints}
        />
        <TastingMap
          currentActiveOrder={currentOrder}
          onClearOrder={() => setCurrentOrder(null)}
        />
        <ReviewsList
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      </main>

      {/* FOOTER */}
      <footer className="bg-[#040404] border-t border-[#262626]/40 py-16 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-4">
            <span className="font-serif text-lg font-bold tracking-[0.2em] text-[#F5F5F3]">OBSIDIAN</span>
            <p className="font-sans text-xs text-[#A3A3A3] font-light leading-relaxed">
              Quiet geometric architecture honoring single-origin botany. Sourced globally, hand-allocated in the Los Angeles Arts District.
            </p>
            <span className="font-mono text-[9px] text-[#C5A880]/70 block tracking-widest">
              © 2026 OBSIDIAN LABS. ALL PRIVILEGES RESERVED.
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <span className="text-[#C5A880] tracking-widest block uppercase font-medium">EXPLORATION</span>
            <ul className="space-y-2 text-[#A3A3A3]">
              <li><button onClick={() => handleScrollToSection('collection')} className="hover:text-white uppercase">The coffees</button></li>
              <li><button onClick={() => handleScrollToSection('philosophy')} className="hover:text-white uppercase">Philosophy</button></li>
              <li><button onClick={() => handleScrollToSection('alliance')} className="hover:text-white uppercase">The subscription</button></li>
              <li><button onClick={() => handleScrollToSection('tasting-bar')} className="hover:text-white uppercase">Private Bar Seats</button></li>
            </ul>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <span className="text-[#C5A880] tracking-widest block uppercase font-medium">FLAGSHIPS</span>
            <ul className="space-y-2 text-[#A3A3A3] leading-relaxed">
              <li>824 E 3rd St, Arts District, LA</li>
              <li>112 N Santa Fe Avenue, Los Angeles</li>
              <li>Secret Cellar Outpost, Tokyo Ginza</li>
            </ul>
          </div>

          <div className="space-y-3.5 text-xs text-left">
            <span className="font-mono text-[#C5A880] tracking-widest block uppercase font-medium">SENSORY TELEMETRY</span>
            <p className="font-sans text-[11px] text-[#A3A3A3] font-light leading-relaxed">
              Enlist in our browser alerts feed to secure real-time micro-lot degassing slots prior to physical bar release.
            </p>
            <button
              onClick={() => setSettingsOpen(true)}
              className="border border-[#C5A880]/30 hover:border-[#C5A880] text-[#C5A880] font-mono text-[9px] tracking-widest px-4 py-2 uppercase transition-all flex items-center space-x-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>CONFIGURE BROWSER TRANSITS</span>
            </button>
          </div>

        </div>
      </footer>

      {/* Add-to-Bag Shopping Drawer */}
      <BagDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveItem}
        loyaltyPoints={loyaltyPoints}
        onRedeemPoints={handleRedeemPoints}
        onCheckoutComplete={handleCheckoutComplete}
      />

      {/* Push Notifications Configuration Modal Dialog */}
      <NotificationSettings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        notifications={notifications}
        onToggleAlert={handleToggleAlertChannel}
        onTriggerMockArrival={handleTriggerToast}
      />

      {/* FLOATING REAL-TIME PUSH ALERTS TOASTER STACK (Bottom-Right corner) */}
      <div className="fixed bottom-6 right-6 z-[9999] space-y-3 max-w-sm w-full px-4">
        <AnimatePresence>
          {activeToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 350 }}
              className="bg-[#0C0C0C]/95 backdrop-blur-md border border-[#C5A880] p-4 flex items-start space-x-3.5 shadow-2xl relative"
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  toast.type === 'omakase' ? 'bg-[#C5A880]/15 text-[#C5A880]' : toast.type === 'seasonal' ? 'bg-orange-950/40 text-orange-400' : 'bg-blue-950/40 text-blue-400'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 text-left">
                <div className="flex justify-between items-center">
                  <h6 className="font-serif text-sm font-semibold text-[#F5F5F3]">{toast.title}</h6>
                  <span className="font-mono text-[8px] text-[#C5A880] uppercase">MOCK PUSH ALERT</span>
                </div>
                <p className="font-sans text-[11px] text-[#A3A3A3] mt-1.5 leading-relaxed font-light">{toast.desc}</p>
              </div>

              <button
                onClick={() => {
                  setActiveToasts(prev => prev.filter(t => t.id !== toast.id));
                }}
                className="text-zinc-600 hover:text-white transition-colors flex-shrink-0 text-xs font-mono ml-2 uppercase"
              >
                X
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* DETAILED TERROIR OVERLAY DIALOG MODAL */}
      <AnimatePresence>
        {detailedCoffee && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailedCoffee(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[10%] md:left-1/2 md:right-auto md:w-full md:max-w-2xl md:-translate-x-1/2 bg-[#0C0C0C] border border-[#262626] p-6 md:p-8 shadow-2xl z-[999] overflow-y-auto max-h-[80vh] no-scrollbar text-left font-sans"
            >
              
              {/* Overlay header */}
              <div className="flex justify-between items-start border-b border-[#262626] pb-4.5 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[9px] text-[#C5A880] tracking-widest uppercase">{detailedCoffee.subName}</span>
                    <span className="font-mono text-[8px] bg-[#C5A880]/15 text-[#C5A880] px-1.5 py-0.5">{detailedCoffee.score} PTS SCORE</span>
                  </div>
                  <h3 className="font-serif text-3xl font-light text-[#F5F5F3]">{detailedCoffee.name}</h3>
                </div>

                <button
                  onClick={() => setDetailedCoffee(null)}
                  className="font-mono text-[10px] text-[#A3A3A3] hover:text-[#C5A880] uppercase tracking-widest cursor-pointer px-2"
                >
                  Close X
                </button>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Photo section */}
                <div className="space-y-4">
                  <div className="aspect-[4/5] border border-[#262626] overflow-hidden bg-neutral-900 shadow-xl relative">
                    <img
                      src={detailedCoffee.imageUrl}
                      alt={detailedCoffee.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter saturate-[0.8] brightness-[0.75]"
                    />
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#A3A3A3]">
                    <span>Origin: <span className="text-white">{detailedCoffee.origin}</span></span>
                    <span>Roast: <span className="text-[#C5A880] capitalize font-semibold">{detailedCoffee.roastLevel}</span></span>
                  </div>
                </div>

                {/* Terroir & genetics data sheets */}
                <div className="space-y-6 text-xs text-[#A3A3A3] font-light leading-relaxed flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="font-mono text-[9px] text-[#C5A880] tracking-widest block uppercase">GENETIC & HARVEST SPECS</span>
                    
                    <p className="font-sans text-[13px] text-zinc-300">
                      {detailedCoffee.description}
                    </p>

                    <div className="bg-[#121212] border border-[#262626] p-4.5 space-y-2.5 font-mono text-[11px]">
                      <div className="flex justify-between border-b border-[#262626]/40 pb-1.5">
                        <span>FARM ELEVATION:</span>
                        <span className="text-[#F5F5F3]">{detailedCoffee.elevation}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#262626]/40 pb-1.5">
                        <span>BOTANICAL TREATMENT:</span>
                        <span className="text-[#F5F5F3]">{detailedCoffee.processType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>RESERVE RATING:</span>
                        <span className="text-[#C5A880] font-bold">{detailedCoffee.score} / 100 PTS</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="font-mono text-[8.5px] text-[#C5A880] tracking-widest block uppercase">Tasting notes palette</span>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {detailedCoffee.tastingNotes.map(n => (
                          <span key={n} className="font-mono text-[10px] text-zinc-300 bg-[#181818] border border-neutral-700/30 px-3 py-1">
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#262626] flex items-center justify-between">
                    <div className="flex items-baseline space-x-1">
                      <span className="font-serif text-2xl text-[#F5F5F3] font-semibold">${detailedCoffee.price}</span>
                      <span className="font-mono text-[10px] text-zinc-500">/ 250g bag</span>
                    </div>

                    <button
                      onClick={() => {
                        handleAddToBag(detailedCoffee, 'Whole Bean');
                        setDetailedCoffee(null);
                      }}
                      className="bg-[#C5A880] text-[#080808] hover:bg-neutral-100 font-mono text-[10px] font-bold tracking-widest px-6 py-3.5 uppercase transition-colors"
                    >
                      SECURE BAG LOT
                    </button>
                  </div>

                </div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
