/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Armchair, Clock, DollarSign, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { ReservationSlot } from '../types';
import { RESERVATION_SLOTS } from '../data';

interface TastingRoomBarProps {
  loyaltyPoints: number;
  onUpdateLoyaltyPoints: (points: number) => void;
}

export default function TastingRoomBar({ loyaltyPoints, onUpdateLoyaltyPoints }: TastingRoomBarProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string>(RESERVATION_SLOTS[0].id);
  const [seatCount, setSeatCount] = useState<number>(1);
  const [selectedBarSeats, setSelectedBarSeats] = useState<number[]>([]);
  const [fullName, setFullName] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [isReserving, setIsReserving] = useState<boolean>(false);

  // Simple layout of physical Los Angeles slow-bar (8 concrete visual stool positions)
  const barStools = [
    { id: 1, label: 'Stool A-1', status: 'taken' },
    { id: 2, label: 'Stool A-2', status: 'available' },
    { id: 3, label: 'Stool A-3', status: 'available' },
    { id: 4, label: 'Stool B-1', status: 'taken' },
    { id: 5, label: 'Stool B-2', status: 'available' },
    { id: 6, label: 'Stool B-3', status: 'available' },
    { id: 7, label: 'Stool C-1', status: 'available' },
    { id: 8, label: 'Stool C-2', status: 'taken' }
  ];

  const currentSlot = RESERVATION_SLOTS.find(s => s.id === selectedSlotId) || RESERVATION_SLOTS[0];

  const handleSeatClick = (stoolId: number, status: string) => {
    if (status === 'taken') return;
    
    setSelectedBarSeats(prev => {
      // If already selected, remove
      if (prev.includes(stoolId)) {
        return prev.filter(id => id !== stoolId);
      }
      // If adding exceeds the pax guest selection, auto-rotate or ignore
      if (prev.length >= seatCount) {
        // Shift first selected out
        return [...prev.slice(1), stoolId];
      }
      return [...prev, stoolId];
    });
  };

  const handleReservationsBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailAddress) return;
    if (selectedBarSeats.length === 0) {
      alert("Please designate physical slow-bar chair allocations on the stool map coordinates below.");
      return;
    }

    setIsReserving(true);

    setTimeout(() => {
      setIsReserving(false);
      setBookingSuccess(true);
      
      // Award loyalty points for booking high-sensory sessions
      onUpdateLoyaltyPoints(loyaltyPoints + 150);
    }, 2000);
  };

  const handleResetSuccess = () => {
    setBookingSuccess(false);
    setSelectedBarSeats([]);
    setFullName('');
    setEmailAddress('');
  };

  return (
    <section id="tasting-bar" className="py-24 bg-[#080808] border-t border-[#262626]/20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Title */}
        <div className="max-w-3xl mb-16 space-y-4 text-left">
          <span className="font-mono text-[10px] text-[#C5A880] tracking-[0.4em] uppercase block">THE TASTING ROOM BAR</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F5F5F3] tracking-wide leading-tight">
            The Private Weekend <br/>
            <span className="italic">Coffee Omakase</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed">
            Reserve one of the eight concrete benches surrounding the high-pressure extraction counter. Experience coffee through an intimate, chef-led progression of rare botany.
          </p>
        </div>

        {/* Form and physical seating map layout split */}
        {bookingSuccess ? (
          /* RESERVATION SUCCESSFULLY RECORDED */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121212] border border-[#C5A880]/30 p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6"
          >
            <CheckCircle className="w-16 h-16 text-[#C5A880] mx-auto stroke-[1.5]" />
            
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-light text-[#F5F5F3]">Omakase Seat Secured</h3>
              <p className="font-sans text-xs text-[#A3A3A3] max-w-md mx-auto leading-relaxed">
                Your reservation is logged at our flagship Los Angeles concrete slow bar. A digital calendar gatekeeper token has been dispatched to <span className="text-[#F5F5F3] font-bold">{emailAddress}</span>.
              </p>
            </div>

            <div className="bg-[#080808] border border-[#262626] p-6 text-left space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-[#262626]/60 pb-2">
                <span className="text-zinc-500">Omakase Experience Slot:</span>
                <span className="text-[#F5F5F3]">{currentSlot.title}</span>
              </div>
              <div className="flex justify-between border-b border-[#262626]/60 pb-2">
                <span className="text-zinc-500">Date & Time:</span>
                <span className="text-[#C5A880]">{currentSlot.date} @ {currentSlot.time}</span>
              </div>
              <div className="flex justify-between border-b border-[#262626]/60 pb-2">
                <span className="text-zinc-500">Bar Chair Designation:</span>
                <span className="text-[#F5F5F3]">
                  {selectedBarSeats.map(id => `Stool ${id === 1 ? 'A-1' : id === 2 ? 'A-2' : id === 3 ? 'A-3' : id === 4 ? 'B-1' : id === 5 ? 'B-2' : id === 6 ? 'B-3' : id === 7 ? 'C-1' : 'C-2'}`).join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Loyalty Score Gained:</span>
                <span className="text-[#C5A880]">+150 VIP Points</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleResetSuccess}
                className="bg-[#C5A880] text-[#080808] font-mono text-[10px] font-bold tracking-[0.2em] px-8 py-3.5 uppercase cursor-pointer"
              >
                BOOK SECOND WORKSHOP
              </button>
            </div>
          </motion.div>
        ) : (
          /* CORE BOOKING INTERFACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
            
            {/* LEFT INPUTS & CURATOR (Span 6) */}
            <div className="lg:col-span-6 bg-[#0E0E0E] border border-[#262626] p-8 flex flex-col justify-between">
              <form onSubmit={handleReservationsBooking} className="space-y-6">
                
                {/* Visual choice of available courses list */}
                <div className="space-y-2.5">
                  <span className="font-mono text-[9px] text-[#C5A880] tracking-widest block uppercase">SELECT DESIRED CURRICULUM</span>
                  <div className="space-y-2.5">
                    {RESERVATION_SLOTS.map((slot) => (
                      <div
                        key={slot.id}
                        onClick={() => {
                          setSelectedSlotId(slot.id);
                          setSelectedBarSeats([]); // Reset seats to prevent mismatch
                        }}
                        className={`p-4 border text-left cursor-pointer transition-all duration-300 ${
                          selectedSlotId === slot.id
                            ? 'border-[#C5A880] bg-[#121212]'
                            : 'border-[#262626]/70 hover:border-neutral-700 bg-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="font-mono text-[8px] text-[#A3A3A3] uppercase block">{slot.type} course</span>
                            <h4 className="font-serif text-sm font-semibold text-[#F5F5F3]">{slot.title}</h4>
                            <span className="font-mono text-[10px] text-[#C5A880] block mt-1">{slot.date} • {slot.time}</span>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-mono text-xs text-[#F5F5F3] block font-bold">${slot.pricePerSeat}</span>
                            <span className="font-mono text-[8.5px] text-orange-400 block mt-0.5 uppercase">
                              {slot.availableSeats} Seats Left
                            </span>
                          </div>
                        </div>
                        <p className="font-sans text-[11px] text-[#A3A3A3] mt-2 leading-relaxed font-light">{slot.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pax choice & Contact details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">GUESTS AT BAR</label>
                    <select
                      value={seatCount}
                      onChange={(e) => {
                        setSeatCount(parseInt(e.target.value));
                        setSelectedBarSeats([]); // Reset seats layout to avoid exceeding bounds
                      }}
                      className="w-full bg-[#121212] border border-[#262626] font-mono text-xs p-2.5 text-[#F5F5F3] focus:outline-none"
                    >
                      <option value="1">1 Stool seat</option>
                      <option value="2">2 Stools (Duet)</option>
                      <option value="3">3 Stools (Private Triad)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="font-mono text-[10px] text-[#A3A3A3] tracking-widest uppercase block">EXPERIENCE DURATION</label>
                    <div className="bg-[#121212] border border-[#262626] p-2.5 font-mono text-xs text-[#F5F5F3] flex items-center justify-between">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{currentSlot.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5 text-left">
                    <label className="font-mono text-[9px] text-[#A3A3A3] tracking-[0.1em] block">FULL GUEST NAME</label>
                    <input
                      required
                      type="text"
                      placeholder="Sorella Kissa"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#121212] border border-[#262626] font-sans text-xs p-3 text-[#F5F5F3] focus:outline-none focus:border-[#C5A880] rounded-none"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="font-mono text-[9px] text-[#A3A3A3] tracking-[0.1em] block">SECURE CALENDAR EMAIL</label>
                    <input
                      required
                      type="email"
                      placeholder="sorella@kissabar.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full bg-[#121212] border border-[#262626] font-sans text-xs p-3 text-[#F5F5F3] focus:outline-none focus:border-[#C5A880] rounded-none"
                    />
                  </div>
                </div>

                {/* Secure payments complete booking */}
                <div className="pt-4 border-t border-[#262626]/60">
                  <button
                    type="submit"
                    disabled={isReserving}
                    className="w-full bg-[#C5A880] text-[#080808] font-mono text-[11px] font-bold tracking-[0.25em] py-4 uppercase hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    {isReserving ? 'COMMUNICATING CALENDAR DELEGATE...' : `SECURE MY SEATS ($${currentSlot.pricePerSeat * seatCount})`}
                  </button>
                  <span className="font-mono text-[8px] text-[#A3A3A3]/65 block text-center mt-2.5 uppercase">
                    100% Fully Refundable prior to 48 hours. Gaining 150 Loyalty points.
                  </span>
                </div>

              </form>
            </div>

            {/* RIGHT BAR INTERACTIVE SEAT MAP (Span 6) */}
            <div className="lg:col-span-6 bg-[#0E0E0E] border border-[#262626] p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="font-mono text-[9px] text-[#C5A880] tracking-widest block uppercase">TACTILE BAR CHAIR MAP</span>
                <h4 className="font-serif text-lg font-light text-[#F5F5F3] text-left">LA FLAGSHIP COFFEE STOOLS MATRIX</h4>
                <p className="font-sans text-xs text-[#A3A3A3] mt-2 leading-relaxed text-left">
                  Please design your exact seat configurations at the concrete extraction bar below. Light indicators designate availability.
                </p>
              </div>

              {/* Physical Map diagram layout */}
              <div className="my-8 py-8 border border-dashed border-[#262626] flex flex-col items-center justify-center bg-[#121212]/30 relative overflow-hidden">
                
                {/* Behind Glow */}
                <div className="absolute inset-0 bg-radial from-[#C5A880]/5 to-transparent pointer-events-none" />

                {/* Concrete Pouring counter representative block */}
                <div className="w-[85%] bg-[#1A1A1A] border-x-4 border-t border-neutral-700 h-10 flex items-center justify-center relative mb-16 shadow-xl pt-1">
                  <span className="font-mono text-[9px] text-[#C5A880] tracking-[0.2em] font-medium uppercase">[ THE EXTRACTING CONCRETE Slow-BAR COUNTER ]</span>
                  
                  {/* Water drip taps indicators */}
                  <div className="absolute top-10 flex space-x-12">
                    <span className="w-[2px] h-3 bg-neutral-600 block relative"><span className="absolute bottom-[-4px] left-[-1px] w-1 h-1 rounded-full bg-[#C5A880]" /></span>
                    <span className="w-[2px] h-3 bg-neutral-600 block relative"><span className="absolute bottom-[-4px] left-[-1px] w-1 h-1 rounded-full bg-[#C5A880]" /></span>
                    <span className="w-[2px] h-3 bg-neutral-600 block relative"><span className="absolute bottom-[-4px] left-[-1px] w-1 h-1 rounded-full bg-[#C5A880]" /></span>
                  </div>
                </div>

                {/* Stools Array Grid */}
                <div className="grid grid-cols-4 gap-6 max-w-sm w-full px-4">
                  {barStools.map((stool) => {
                    const isTaken = stool.status === 'taken';
                    const isSelected = selectedBarSeats.includes(stool.id);
                    
                    return (
                      <button
                        type="button"
                        key={stool.id}
                        disabled={isTaken}
                        onClick={() => handleSeatClick(stool.id, stool.status)}
                        className={`aspect-square p-2 border flex flex-col items-center justify-center transition-all cursor-pointer relative group ${
                          isTaken
                            ? 'border-neutral-800 bg-[#080808]/40 text-neutral-700 cursor-not-allowed opacity-40'
                            : isSelected
                            ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#C5A880] shadow-[0_0_15px_rgba(197,168,128,0.2)] scale-105'
                            : 'border-[#262626] bg-[#0E0E0E] text-[#A3A3A3] hover:border-neutral-500'
                        }`}
                      >
                        {/* Stool visual core dot indicator */}
                        <div className={`w-3.5 h-3.5 rounded-full border mb-1.5 transition-colors ${
                          isTaken ? 'bg-rose-950 border-rose-800' : isSelected ? 'bg-[#C5A880] border-[#C5A880]' : 'bg-[#080808] border-[#262626]'
                        }`} />
                        
                        <span className="font-mono text-[8px] uppercase tracking-wide">{stool.label}</span>
                        
                        {/* Interactive Hover seat status tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white font-mono text-[7px] uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-neutral-700 z-30">
                          {isTaken ? 'STOOL ENGAGED' : isSelected ? 'YOUR TARGETED STOOL' : `LOCK ${stool.label.toUpperCase()}`}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Legend indicator map details below */}
                <div className="flex items-center space-x-5 mt-10 text-[9px] font-mono text-[#A3A3A3]">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full border border-neutral-800 bg-[#080808]" />
                    <span>VACANT</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-900 border border-rose-600" />
                    <span>TAKEN</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880] border border-[#C5A880]" />
                    <span>YOUR CHOICE</span>
                  </div>
                </div>

              </div>

              {/* Booking specifications metadata instructions below map */}
              <div className="bg-[#121212] border border-[#262626] p-4 font-sans text-[11px] text-[#A3A3A3] flex items-start space-x-2.5 text-left">
                <AlertCircle className="w-4.5 h-4.5 text-[#C5A880] shrink-0 mt-0.5" />
                <p className="leading-relaxed font-light">
                  Required: Physical seat allocation designations MUST equal specified guest seat counts (currently <span className="text-[#F5F5F3] font-bold">{seatCount} guests</span>). Stool seating adjustments can be updated freely prior to finalizing digital calendar transactions.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
