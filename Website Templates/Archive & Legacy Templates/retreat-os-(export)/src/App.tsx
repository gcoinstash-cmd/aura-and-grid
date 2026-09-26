import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RETREAT_DATA } from './data';
import { Retreat, RetreatApplication } from './types';

// Importing Custom Visual Components
import Header from './components/Header';
import Portfolio from './components/Portfolio';
import AboutHost from './components/AboutHost';
import RetreatDetail from './components/RetreatDetail';
import ApplicationPortal from './components/ApplicationPortal';
import HostPreview from './components/HostPreview';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('portfolio');
  const [selectedRetreat, setSelectedRetreat] = useState<Retreat>(RETREAT_DATA[0]);
  const [selectedLodgingId, setSelectedLodgingId] = useState<string>(RETREAT_DATA[0].accommodations[0].id);
  const [applications, setApplications] = useState<RetreatApplication[]>([]);
  const [isHostDashboardOpen, setIsHostDashboardOpen] = useState(false);

  // Load submissions from localStorage on initial build
  useEffect(() => {
    try {
      const stored = localStorage.getItem('retreat_os_intakes');
      if (stored) {
        setApplications(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse stored local application data', e);
    }
  }, []);

  const handleSelectRetreat = (retreat: Retreat) => {
    setSelectedRetreat(retreat);
    // Pre-select first lodging option for that retreat
    if (retreat.accommodations && retreat.accommodations.length > 0) {
      setSelectedLodgingId(retreat.accommodations[0].id);
    }
  };

  const handleSelectLodging = (tierId: string) => {
    setSelectedLodgingId(tierId);
  };

  const handleAddApplication = (newApp: RetreatApplication) => {
    const updated = [newApp, ...applications];
    setApplications(updated);
    try {
      localStorage.setItem('retreat_os_intakes', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save application to localStorage', err);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: 'pending' | 'reviewed' | 'accepted') => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    localStorage.setItem('retreat_os_intakes', JSON.stringify(updated));
  };

  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter(app => app.id !== id);
    setApplications(updated);
    localStorage.setItem('retreat_os_intakes', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setApplications([]);
    localStorage.removeItem('retreat_os_intakes');
  };

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'portfolio':
        return (
          <Portfolio
            retreats={RETREAT_DATA}
            onSelectRetreat={handleSelectRetreat}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'details':
        return (
          <RetreatDetail
            currentRetreat={selectedRetreat}
            allRetreats={RETREAT_DATA}
            onSelectRetreat={handleSelectRetreat}
            onSelectLodging={handleSelectLodging}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'host':
        return (
          <AboutHost
            currentRetreat={selectedRetreat}
            allRetreats={RETREAT_DATA}
            onSelectRetreat={handleSelectRetreat}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'apply':
        return (
          <ApplicationPortal
            retreats={RETREAT_DATA}
            selectedRetreat={selectedRetreat}
            selectedLodgingId={selectedLodgingId}
            onSelectRetreat={handleSelectRetreat}
            onSelectLodging={handleSelectLodging}
            onAddApplication={handleAddApplication}
            setCurrentTab={setCurrentTab}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-alabaster text-ink font-sans selection:bg-ochre/30 flex flex-col justify-between transition-colors duration-300">
      <div>
        {/* Editorial Top Navigation Header */}
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          appCount={applications.length}
          openHostDashboard={() => setIsHostDashboardOpen(true)}
        />

        {/* Dynamic page contents wrapped in smooth motion fades */}
        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab + '_' + selectedRetreat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {renderCurrentTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Premium print-inspired layout frame footer */}
      <footer className="border-t border-ink/10 bg-white/40 py-12 px-6 mt-16 pb-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 text-center">
          
          {/* Expanded Buyer-Facing Feature Specifications Sheet */}
          <div className="w-full bg-[#FBF9F6] border border-ink/10 rounded-sm shadow-3xs p-8 text-left my-8">
            <div className="border-b border-ink/10 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#5A6455] font-bold uppercase block mb-1">
                  // COMMERCIAL DESIGN SYSTEM BUILD
                </span>
                <h3 className="font-serif text-2xl font-light text-ink">
                  Retreat OS <span className="italic">Template Specifications</span>
                </h3>
              </div>
              <div className="text-[10px] font-mono text-ochre font-bold uppercase bg-[#C4A482]/5 border border-[#C4A482]/25 px-3 py-1 bg-white/50">
                Setup & Support Included
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold text-[#5A6455] block">// CORE FEATURE 01</span>
                <h4 className="font-serif text-lg font-light text-ink">Dynamic Room & Capacity Metrics</h4>
                <p className="text-xs text-ink/70 leading-relaxed font-sans">
                  Prevents double-occupancy overcrowding. Built-in real-time reservation tickers link instantly to intake logic, mapping true room capacities dynamically to avoid manual overbooking.
                </p>
              </div>

              <div className="space-y-3 border-t md:border-t-0 md:border-l border-ink/10 pt-6 md:pt-0 md:pl-8">
                <span className="text-[10px] font-mono font-bold text-[#C4A482] block">// CORE FEATURE 02</span>
                <h4 className="font-serif text-lg font-light text-ink">Centralized Local Data Hub</h4>
                <p className="text-xs text-ink/70 leading-relaxed font-sans">
                  Change text in one single structural file to immediately update times, prices, image sources, list amenities, and packing schedules across the entire public application seamlessly.
                </p>
              </div>

              <div className="space-y-3 border-t md:border-t-0 md:border-l border-ink/10 pt-6 md:pt-0 md:pl-8">
                <span className="text-[10px] font-mono font-bold text-[#5A6455] block">// CORE FEATURE 03</span>
                <h4 className="font-serif text-lg font-light text-ink">Fluid Interactive Architecture</h4>
                <p className="text-xs text-ink/70 leading-relaxed font-sans">
                  Modern micro-animations powered by <code>motion</code>, elegant responsive cards, grayscale-to-color hover imagery, and fluid mobile transitions engineered like a premium printed layout.
                </p>
              </div>
            </div>

            {/* Subtle Setup & Support Note */}
            <div className="mt-8 pt-6 border-t border-ink/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px]">
              <div className="text-ink/60 font-sans tracking-wide">
                <span className="font-bold text-ink">Setup & Support Guarantee:</span> High-fidelity documentation, editable variables, and direct deployment guides included with purchase.
              </div>
              <div className="text-[#5A6455] font-mono font-bold text-right self-stretch sm:self-auto">
                [ COMPILED WORKSPACE STABLE V1.4.2 ]
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:text-left pt-2">
            {/* Logo stamp */}
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wider text-ink">
                RETREAT <span className="font-light italic text-ochre">OS</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-[#5A6455] font-semibold mt-1">
                Architecture for high-end gatherings
              </span>
            </div>

            <div className="text-[10px] uppercase font-sans tracking-[0.2em] text-ink/40 space-y-1">
              <p>© 2026 Retreat OS Retreat Details. All rights reserved.</p>
              <p>Designed for premium wellness and movement educators.</p>
            </div>

            {/* Subtly integrate facilitation inspector for host checkups */}
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-wider">
              <button
                onClick={() => setIsHostDashboardOpen(true)}
                className="text-[#5A6455] hover:text-ink font-bold bg-[#5A6455]/5 hover:bg-[#5A6455]/10 border border-[#5A6455]/25 px-3 py-1.5 transition cursor-pointer"
              >
                [ OPEN HOST DASHBOARD Preview ]
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Host Preview / Demo application inspector drawer */}
      <HostPreview
        applications={applications}
        onUpdateStatus={handleUpdateStatus}
        onDeleteApplication={handleDeleteApplication}
        onClearAll={handleClearAll}
        isOpen={isHostDashboardOpen}
        onClose={() => setIsHostDashboardOpen(false)}
      />
    </div>
  );
}
