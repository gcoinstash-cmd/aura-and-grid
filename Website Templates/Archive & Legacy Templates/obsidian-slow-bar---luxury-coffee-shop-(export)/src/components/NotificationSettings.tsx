/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sliders, ToggleLeft, ToggleRight, Check, Award, Flame, Sparkles } from 'lucide-react';
import { NotificationAlert } from '../types';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationAlert[];
  onToggleAlert: (id: string) => void;
  onTriggerMockArrival: (title: string, desc: string, type: 'omakase' | 'seasonal' | 'alliance') => void;
}

export default function NotificationSettings({
  isOpen,
  onClose,
  notifications,
  onToggleAlert,
  onTriggerMockArrival
}: NotificationSettingsProps) {
  const [pushGranted, setPushGranted] = useState(false);
  const [seasonalAlerts, setSeasonalAlerts] = useState(true);
  const [omakaseAlerts, setOmakaseAlerts] = useState(true);
  const [allianceAlerts, setAllianceAlerts] = useState(false);

  const handleGrantPermission = () => {
    setPushGranted(true);
    // Auto trigger a beautiful mock notification welcoming the subscriber
    onTriggerMockArrival(
      'Aroma Server Node Synced',
      'You are registered for premium Arts District notification feeds. Prepare for micro-lot drops.',
      'alliance'
    );
  };

  const handleFireMockRelease = (type: 'gesha' | 'omakase' | 'degas') => {
    if (type === 'gesha') {
      onTriggerMockArrival(
        '🚨 SECURED DROP: Panama Geisha',
        'Carbonic Maceration micro-batch #4 is officially degassing. 6 bags left on the rack.',
        'seasonal'
      );
    } else if (type === 'omakase') {
      onTriggerMockArrival(
        '🎟️ WEEKEND OMAKASE SLOW-BAR',
        'Head sensory director added 4 extra seats to Saturday noon cupping flight.',
        'omakase'
      );
    } else {
      onTriggerMockArrival(
        'Alliance Roasting Dispatched',
        'Vintage C&C Cast Iron drum initiated. Alliance single origins packed.',
        'alliance'
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 pointer-events-auto"
            onClick={onClose}
          />

          {/* Modal popup element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-4 top-[15%] md:left-1/2 md:right-auto md:w-full md:max-w-md md:-translate-x-1/2 bg-[#0C0C0C] border border-[#262626] p-6 shadow-2xl z-50 overflow-hidden text-left"
          >
            {/* Elegant grain overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C5A880]/5 to-transparent pointer-events-none" />

            <div className="space-y-6">
              
              {/* Header block */}
              <div className="border-b border-[#262626] pb-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#C5A880] animate-pulse" />
                  <span className="font-serif text-sm tracking-wider text-[#F5F5F3] uppercase">PERSONALIZED ALERTS</span>
                </div>

                <button
                  onClick={onClose}
                  className="font-mono text-[9px] text-[#A3A3A3] hover:text-[#C5A880] uppercase tracking-wider"
                >
                  X
                </button>
              </div>

              <p className="font-sans text-xs text-[#A3A3A3] font-light leading-relaxed">
                Configure personalized telemetry signals to stay locked into our micro-lot roasts. Receive tactile notifications directly across your physical or workspace browsers.
              </p>

              {/* Native grant simulator click */}
              <div className="bg-[#121212] border border-[#262626] p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-mono text-[9.5px] text-[#F5F5F3] block tracking-wide">BROWSER PUSH CHANNELS</span>
                  <span className="font-sans text-[10px] text-zinc-500 block">
                    {pushGranted ? 'Encrypted Connection Active' : 'Encrypted Connection Off'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGrantPermission}
                  className={`px-4 py-1.5 font-mono text-[9.5px] tracking-wider uppercase transition-colors rounded-none ${
                    pushGranted
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#C5A880] text-[#080808] hover:bg-neutral-100 font-medium cursor-pointer'
                  }`}
                >
                  {pushGranted ? '✔ SYNCED' : 'GRANT SYNC'}
                </button>
              </div>

              {/* Specific Toggle Channels */}
              <div className="space-y-4 pt-1">
                <span className="font-mono text-[8.5px] text-[#C5A880] tracking-widest uppercase block">DESIRED BROADCAST CHANNELS</span>
                
                <div className="space-y-2.5">
                  
                  {/* Channel 1 */}
                  <div className="flex items-center justify-between p-2.5 bg-[#121212]/30 border border-[#262626]/60">
                    <div className="space-y-0.5">
                      <span className="font-sans text-xs text-[#F5F5F3] font-semibold flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        <span>Seasonal Specialty Drops</span>
                      </span>
                      <span className="font-sans text-[10px] text-[#A3A3A3]/70 block">Ethiopian or Panama limited arrivals notifications.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSeasonalAlerts(!seasonalAlerts)}
                      className="text-[#C5A880] hover:text-[#F5F5F3]"
                    >
                      {seasonalAlerts ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-zinc-600" />}
                    </button>
                  </div>

                  {/* Channel 2 */}
                  <div className="flex items-center justify-between p-2.5 bg-[#121212]/30 border border-[#262626]/60">
                    <div className="space-y-0.5">
                      <span className="font-sans text-xs text-[#F5F5F3] font-semibold flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                        <span>Weekend Omakase Slots</span>
                      </span>
                      <span className="font-sans text-[10px] text-[#A3A3A3]/70 block">Alert when seats open up around our 8-stool bar counter.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOmakaseAlerts(!omakaseAlerts)}
                      className="text-[#C5A880] hover:text-[#F5F5F3]"
                    >
                      {omakaseAlerts ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-zinc-600" />}
                    </button>
                  </div>

                  {/* Channel 3 */}
                  <div className="flex items-center justify-between p-2.5 bg-[#121212]/30 border border-[#262626]/60">
                    <div className="space-y-0.5">
                      <span className="font-sans text-xs text-[#F5F5F3] font-semibold flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span>Alliance Roasting Dispatch</span>
                      </span>
                      <span className="font-sans text-[10px] text-[#A3A3A3]/70 block">Notify when vintage casting drums kick off roasting.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllianceAlerts(!allianceAlerts)}
                      className="text-[#C5A880] hover:text-[#F5F5F3]"
                    >
                      {allianceAlerts ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-zinc-600" />}
                    </button>
                  </div>

                </div>
              </div>

              {/* Conversion simulation panel triggers */}
              {pushGranted && (
                <div className="border-t border-[#262626] pt-4.5 space-y-3.5">
                  <span className="font-mono text-[8.5px] text-[#C5A880] tracking-widest uppercase block">SIMULATE REAL-TIME ROBOT CALLS</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleFireMockRelease('gesha')}
                      className="border border-neutral-800 hover:border-neutral-500 font-mono text-[8px] tracking-widest text-[#A3A3A3] hover:text-[#F5F5F3] py-2 uppercase transition-all cursor-pointer text-center"
                    >
                      Dry Gesha Roast
                    </button>
                    <button
                      onClick={() => handleFireMockRelease('omakase')}
                      className="border border-neutral-800 hover:border-neutral-500 font-mono text-[8px] tracking-widest text-[#A3A3A3] hover:text-[#F5F5F3] py-2 uppercase transition-all cursor-pointer text-center"
                    >
                      Omakase Seat Drop
                    </button>
                    <button
                      onClick={() => handleFireMockRelease('degas')}
                      className="border border-neutral-800 hover:border-neutral-500 font-mono text-[8px] tracking-widest text-[#A3A3A3] hover:text-[#F5F5F3] py-2 uppercase transition-all cursor-pointer text-center"
                    >
                      Degassing Core
                    </button>
                  </div>
                </div>
              )}

              {/* Dismiss button */}
              <div className="pt-2 border-t border-[#262626]/60">
                <button
                  onClick={onClose}
                  className="w-full bg-transparent hover:bg-[#121212] border border-[#262626] font-mono text-[10px] tracking-widest uppercase text-center py-3 text-[#A3A3A3] hover:text-[#F5F5F3] transition-colors"
                >
                  DISMISS AND LOCK TELEMETRY
                </button>
              </div>

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
