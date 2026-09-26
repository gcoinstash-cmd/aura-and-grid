/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Bell, Menu, X, Sparkles, Sliders, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, NotificationAlert } from '../types';

interface HeaderProps {
  cart: CartItem[];
  setCartOpen: (open: boolean) => void;
  points: number;
  notifications: NotificationAlert[];
  toggleNotificationAlert: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNotifications: () => void;
}

export default function Header({
  cart,
  setCartOpen,
  points,
  notifications,
  toggleNotificationAlert,
  activeTab,
  setActiveTab,
  onOpenNotifications
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  
  const totalCartItems = cart.reduce((count, item) => count + item.quantity, 0);
  const activeNotifs = notifications.filter(n => n.isActive);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'THE COLLECTION', id: 'collection' },
    { label: 'OUR PHILOSOPHY', id: 'philosophy' },
    { label: 'THE ALLIANCE', id: 'alliance' },
    { label: 'THE TASTING BAR', id: 'tasting-bar' },
    { label: 'REVIEWS', id: 'reviews' },
    { label: 'LOCATION', id: 'location' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#080808]/85 backdrop-blur-xl border-b border-[#262626]/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Editorial Brand Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-8 h-8 rounded-full border border-[#C5A880] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#C5A880]/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
              <span className="font-serif font-semibold text-xs text-[#C5A880] tracking-widest mt-0.5">O</span>
            </div>
            <div>
              <span className="font-serif text-lg md:text-xl font-medium tracking-[0.2em] text-[#F5F5F3]">OBSIDIAN</span>
              <span className="hidden sm:inline-block font-mono text-[8px] tracking-[0.3em] text-[#C5A880] ml-3 uppercase">LA ARTS DISTRICT</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-sans text-[11px] font-medium tracking-[0.2em] transition-all duration-300 relative py-2 ${
                  activeTab === item.id ? 'text-[#C5A880]' : 'text-[#A3A3A3] hover:text-[#F5F5F3]'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C5A880]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Action Widgets */}
          <div className="flex items-center space-x-4 md:space-x-6">
            
            {/* Loyalty Score Widget */}
            <div className="hidden md:flex items-center space-x-1.5 bg-[#121212] border border-[#262626] rounded-full px-3 py-1 hover:border-[#C5A880]/40 transition-colors duration-300">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880] animate-pulse" />
              <span className="font-mono text-[10px] text-[#A3A3A3] tracking-[0.1em]">
                LOYALTY: <span className="text-[#F5F5F3] font-medium">{points} pts</span>
              </span>
            </div>

            {/* Alarm Configuration / Alerts */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                }}
                className="p-2 border border-transparent rounded-full hover:bg-[#121212] hover:border-[#262626] text-[#A3A3A3] hover:text-[#F5F5F3] transition-all duration-300 relative"
                aria-label="Personalized push notification alerts"
              >
                <Bell className="w-4 h-4" />
                {activeNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C5A880] ring-4 ring-[#080808]" />
                )}
              </button>

              {/* Premium Alerts Config Dropdown */}
              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ type: 'spring', duration: 0.4 }}
                    className="absolute right-0 mt-3 w-80 md:w-96 bg-[#121212] border border-[#262626] rounded-xl shadow-2xl overflow-hidden p-5"
                  >
                    <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Sliders className="w-4 h-4 text-[#C5A880]" />
                        <h4 className="font-serif text-sm font-medium tracking-wide text-[#F5F5F3]">ALERT CONFIGURATOR</h4>
                      </div>
                      <button 
                        onClick={onOpenNotifications} 
                        className="font-mono text-[9px] text-[#C5A880] tracking-widest hover:underline uppercase"
                      >
                        Settings
                      </button>
                    </div>

                    <div className="space-y-3 max-h-56 overflow-y-auto no-scrollbar">
                      {notifications.length === 0 ? (
                        <p className="text-center font-sans text-xs text-[#A3A3A3] py-4">No active notifications configured.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => toggleNotificationAlert(notif.id)}
                            className={`flex items-start justify-between p-2.5 rounded-lg border cursor-pointer transition-all duration-300 ${
                              notif.isActive
                                ? 'bg-[#C5A880]/5 border-[#C5A880]/30 hover:border-[#C5A880]/50'
                                : 'bg-transparent border-[#262626] opacity-60 hover:opacity-100'
                            }`}
                          >
                            <div className="flex-1 pr-3">
                              <div className="flex items-center space-x-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  notif.type === 'omakase' ? 'bg-[#C5A880]' : notif.type === 'seasonal' ? 'bg-orange-400' : 'bg-blue-400'
                                }`} />
                                <h5 className="font-sans text-xs font-semibold text-[#F5F5F3] tracking-wide">{notif.title}</h5>
                              </div>
                              <p className="font-sans text-[11px] text-[#A3A3A3] mt-1 leading-relaxed">{notif.description}</p>
                              <span className="font-mono text-[9px] text-[#A3A3A3]/50 block mt-1.5">{notif.timestamp}</span>
                            </div>
                            <div className="flex-shrink-0 mt-0.5">
                              <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                                notif.isActive ? 'bg-[#C5A880] border-[#C5A880] text-[#080808]' : 'border-[#262626]'
                              }`}>
                                {notif.isActive && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="border-t border-[#262626] pt-3.5 mt-3 flex justify-between items-center bg-[#121212]">
                      <span className="font-mono text-[9px] text-[#A3A3A3] tracking-wider">PERSONALIZED FOR YOU</span>
                      <button
                        onClick={() => setNotifDropdownOpen(false)}
                        className="font-mono text-[10px] text-[#F5F5F3] hover:text-[#C5A880] tracking-widest uppercase transition-colors"
                      >
                        Dismiss
                    </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bag Widget button */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 border border-transparent rounded-full hover:bg-[#121212] hover:border-[#262626] text-[#A3A3A3] hover:text-[#F5F5F3] transition-all duration-300 relative flex items-center"
              aria-label="Open Cart Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C5A880] text-[#080808] font-mono text-[8px] font-bold flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Icon */}
            <button
              id="mobile-drawer-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#A3A3A3] hover:text-[#F5F5F3] transition-colors cursor-pointer relative z-50"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Menu Slide - Moved Outside and styled with full-screen context */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="lg:hidden fixed inset-0 z-45 bg-[#080808] pt-24 px-6 pb-6 flex flex-col justify-between"
          >
            <div className="flex flex-col space-y-5 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left font-serif text-2xl font-medium tracking-widest py-2 border-b border-[#262626]/20 pb-3 transition-colors ${
                    activeTab === item.id ? 'text-[#C5A880]' : 'text-[#A3A3A3] hover:text-[#F5F5F3]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="border-t border-[#262626]/40 pt-6 flex flex-col space-y-4 mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                <span className="font-mono text-xs text-[#A3A3A3] tracking-wider">LOYALTY STATUS: {points} POINTS</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCartOpen(true);
                }}
                className="font-mono text-xs bg-[#C5A880] text-[#080808] py-3 rounded-lg font-bold tracking-widest uppercase flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>OPEN BAG ({totalCartItems})</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}