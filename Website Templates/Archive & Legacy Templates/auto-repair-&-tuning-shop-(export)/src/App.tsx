import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRESEEDED_BOOKINGS } from './data';
import { BookingRecord, TicketStatus, ServiceItem, PackageTier } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesGrid from './components/ServicesGrid';
import BookingDashboard from './components/BookingDashboard';
import ServiceTracker from './components/ServiceTracker';
import PricingMatrix from './components/PricingMatrix';
import ProofSection from './components/ProofSection';
import LeadCapture from './components/LeadCapture';
import { 
  Settings2, Sliders, Smartphone, Check, Cpu, Sparkles, 
  MapPin, Phone, Clock, Mail, ShieldCheck, Heart, ExternalLink 
} from 'lucide-react';

const PRESETS: Record<string, {
  accent: string;
  accentLabel: string;
  shopName: string;
  heroTitle: string;
  heroSubtext: string;
  tagline: string;
  phone: string;
  services: ServiceItem[];
  packages: PackageTier[];
}> = {
  apex: {
    accent: '#FF5F1F',
    accentLabel: 'Cyberpunk Tokyo Orange',
    shopName: 'Apex Dynamics',
    heroTitle: '',
    heroSubtext: 'We provide custom race-prep diagnostics, Stage 1/2 ECU remapping, fluid engineering, and high-gloss 9H ceramic detailing. Built for owners who demand peak automotive performance and precision care.',
    tagline: 'Hyper-Precision Garage & Tuning Lab',
    phone: '(310) 555-0142',
    services: [
      {
        id: 'fluid-service',
        name: 'Precision Fluid & Safety Audit',
        category: 'maintenance',
        estimatePrice: 165,
        duration: '1 Hour',
        description: 'High-grade endurance engine oil change, premium high-pressure oil filter replacement, safety system multi-point analysis, and complete synthetic fluid stabilization.',
        icon: 'Droplet'
      },
      {
        id: 'ecu-tuning',
        name: 'Stage 1/2 ECU Calibration & Dyno',
        category: 'tuning',
        estimatePrice: 799,
        duration: '3.5 Hours',
        description: 'Custom fuel-map dyno optimization, ignition timing correction, throttle response amplification, speed governor deletion, and certified torque delivery plots.',
        icon: 'Cpu',
        helperText: '(Software optimization to increase horse-power and fuel efficiency safely).'
      },
      {
        id: 'telemetry-diag',
        name: 'OEM-Level Telemetry & Diagnostics',
        category: 'diagnostics',
        estimatePrice: 185,
        duration: '1.5 Hours',
        description: 'Bespoke diagnostic sweeps using official scan tools. Live sensor sweep capture, telemetry analytics logging, fault clearing, and CAN-bus system reset.',
        icon: 'Activity',
        helperText: '(Complete digital health check using factory scan tools to clear error dashboard lights).'
      },
      {
        id: 'paint-ceramic',
        name: '9H Multi-Coat Paint Correction & Ceramic',
        category: 'detailing',
        estimatePrice: 650,
        duration: '6 Hours',
        description: 'Three-stage orbital paint correction to eliminate swirl marks, followed by triple-layer 9H ultra-hydrophobic ceramic glass coating and thermal curing loops.',
        icon: 'Sparkles'
      },
      {
        id: 'chassis-balance',
        name: 'Chassis Tuning & Corner Balancing',
        category: 'tuning',
        estimatePrice: 420,
        duration: '2.5 Hours',
        description: 'Precision adjustable coilover height calibration, individual corner weight distribution balancing, bump-steer trim evaluation, and aggressive performance alignment.',
        icon: 'Sliders',
        helperText: '(Suspension and alignment tuning for perfect steering precision and even tire wear).'
      },
      {
        id: 'track-prep',
        name: 'Track-Day Preparation Package',
        category: 'diagnostics',
        estimatePrice: 280,
        duration: '2 Hours',
        description: 'Track-temperature brake fluid flush (Motul RBF660), thermal tire pressure tuning, component stress audit, caliper torque validation, and telemetry diagnostics check.',
        icon: 'Gauge'
      }
    ],
    packages: [
      {
        id: 'pkg-street',
        name: 'Street Standard',
        price: '$249',
        description: 'Complete mechanical assurance for daily drivers seeking reliable, high-end care.',
        features: [
          'Comprehensive telemetry scan',
          'Synthetic engine oil & premium filter',
          'All vehicle fluids top-off',
          '35-point mechanical stress test',
          'Electronic brake system check'
        ]
      },
      {
        id: 'pkg-apex',
        name: 'Apex Performance',
        price: '$899',
        description: 'Our signature tuning and setup loop for performance enthusiasts and grand tourers.',
        features: [
          'Everything in Street Standard',
          'Stage 1 Custom ECU Mapping',
          '2x Dynamic Chassis Dyno sweeps',
          'Intake & combustion diagnostic',
          'Dyno graph log report package',
          '12-month software map warranty'
        ],
        isPopular: true
      },
      {
        id: 'pkg-track',
        name: 'Track Enthusiast',
        price: '$1599',
        description: 'Raw performance optimization designed for competition track days and premium sports cars.',
        features: [
          'Everything in Apex Performance',
          'Precision Corner Balancing setup',
          'High-temp racing brake fluid flush',
          'Adjustable damper alignment sweep',
          'Track telemetry dashboard config',
          '1-on-1 dynamic review with lead tech'
        ]
      }
    ]
  },
  ev: {
    accent: '#00E5FF',
    accentLabel: 'Electric Cyan',
    shopName: 'EcoEV Labs',
    heroTitle: 'HYPER-PRECISION EV CALIBRATION & BATTERY AUDITS',
    heroSubtext: 'We provide thermal management tuning, solid-state battery diagnostics, regenerative braking calibration, and high-voltage power-train optimization for the electric age.',
    tagline: 'High-Voltage Electric Calibrations Lab',
    phone: '(800) 555-EV99',
    services: [
      {
        id: 'fluid-service',
        name: 'High-Voltage Thermal Audit & Flush',
        category: 'maintenance',
        estimatePrice: 310,
        duration: '2 Hours',
        description: 'De-ionized coolant replacement, micro-channel chiller inspection, high-voltage isolator checks, and electronic temperature regulator analytics.',
        icon: 'Droplet',
        helperText: '(Software diagnostics and coolant servicing to maintain battery health and high charge speeds).'
      },
      {
        id: 'ecu-tuning',
        name: 'Bespoke Thermal Management Optimization',
        category: 'tuning',
        estimatePrice: 850,
        duration: '4 Hours',
        description: 'Advanced thermal profile mapping, active chassis coolant valve reprogramming, and continuous cabin cooling battery sync configs.',
        icon: 'Cpu',
        helperText: '(Software optimization to increase power output and range efficiency safely).'
      },
      {
        id: 'telemetry-diag',
        name: 'Solid-State Battery Cell Audit & Balance',
        category: 'diagnostics',
        estimatePrice: 260,
        duration: '2 Hours',
        description: 'Deep telemetry diagnostic sweep of battery management system (BMS), cell capacity leveling, and micro-ohm resistance sweep using factory audit tools.',
        icon: 'Activity',
        helperText: '(Complete digital health check using factory scan tools to clear error dashboard lights).'
      },
      {
        id: 'paint-ceramic',
        name: '9H Aero Paint Correction & Ceramic Coating',
        category: 'detailing',
        estimatePrice: 680,
        duration: '6 Hours',
        description: 'Three-stage paint defect correction and high-gloss drag-reducing 9H ultra-hydrophobic ceramic glass coating for optimal efficiency.',
        icon: 'Sparkles'
      },
      {
        id: 'chassis-balance',
        name: 'Regenerative Braking Calibration',
        category: 'tuning',
        estimatePrice: 420,
        duration: '2.5 Hours',
        description: 'Fine-tune friction-to-regen transitions, deceleration force maps, energy recuperation curves, and brake pedal resistance simulator settings.',
        icon: 'Sliders',
        helperText: '(Suspension, steering, and regenerative brake balance to gain peak driving range).'
      },
      {
        id: 'track-prep',
        name: 'High-Voltage Power Train Sweeps',
        category: 'diagnostics',
        estimatePrice: 450,
        duration: '3 Hours',
        description: 'Dual/triple motor encoder fine-tuning, torque vectoring optimization, high-voltage isolator diagnostics, and inverter efficiency plots.',
        icon: 'Gauge'
      }
    ],
    packages: [
      {
        id: 'pkg-street',
        name: 'EV Essential Care',
        price: '$299',
        description: 'Full telemetry scan of battery modules, safety isolation, and energy diagnostics.',
        features: [
          'Full telemetry scan of battery modules',
          'Regenerative braking coefficient check',
          'High-voltage safety isolating gloves test',
          '25-point premium EV hardware stress test',
          'Cabin micron-level air filtration check'
        ]
      },
      {
        id: 'pkg-apex',
        name: 'EcoEV Calibration Pro',
        price: '$999',
        description: 'Our signature tuning and thermal optimization package for grand tourers.',
        features: [
          'Everything in EV Essential Care',
          'Custom battery thermal management profile calibration',
          '2x Battery charging profile curves optimization',
          'Torque vectoring encoder alignment',
          'Solid-state telemetry health reports',
          '12-month electric map warranty'
        ],
        isPopular: true
      },
      {
        id: 'pkg-track',
        name: 'Grid Master Performance',
        price: '$1799',
        description: 'Raw performance setups designed for high speed and continuous track load loops.',
        features: [
          'Everything in EcoEV Calibration Pro',
          'Precision chassis brake-to-regen setup',
          'High-voltage inverter temperature balancing',
          'Active aerodynamic damper calibration',
          'Track regen telemetry layout setup',
          '1-on-1 performance review with lead EV tech'
        ]
      }
    ]
  },
  fleet: {
    accent: '#FFC107',
    accentLabel: 'Construction Yellow',
    shopName: 'Fleet Iron',
    heroTitle: 'COMMERCIAL FLEET & DIESEL MAINTENANCE',
    heroSubtext: 'Zero unscheduled downtime. We provide heavy-duty truck diagnostics, diesel particulate emission audits, Class-8 chassis corner-weighing, and fleet level software parameter resets.',
    tagline: 'Heavy-Duty Commercial Fleet Garage',
    phone: '(800) 555-RIGS',
    services: [
      {
        id: 'fluid-service',
        name: 'Heavy-Duty Fluid & Diesel Safety Audit',
        category: 'maintenance',
        estimatePrice: 295,
        duration: '2 Hours',
        description: 'Full diesel engine synthetic lubricity treatment, dual water separator filter replacements, transmission gear oil levels check, and DEF fluid audits.',
        icon: 'Droplet',
        helperText: '(High-grade fluid servicing to maximize heavy engine service life and reliability).'
      },
      {
        id: 'ecu-tuning',
        name: 'Stage 1 Heavy Fleet Remaps & Tuning',
        category: 'tuning',
        estimatePrice: 950,
        duration: '5 Hours',
        description: 'High-integrity diesel injection mapping, exhaust gas temperature (EGT) optimization, torque delivery limit management, and software engine governor calibration.',
        icon: 'Cpu',
        helperText: '(Software optimization to increase horse-power and fuel efficiency safely).'
      },
      {
        id: 'telemetry-diag',
        name: 'Class-8 CAN-bus Telemetry & System Diagnostics',
        category: 'diagnostics',
        estimatePrice: 320,
        duration: '2.5 Hours',
        description: 'Full vehicle controller diagnostic sweeps using official medium/heavy truck scan tools. Live sensor sweep capture, telemetry logging, and clearing active fault codes.',
        icon: 'Activity',
        helperText: '(Complete digital health check using factory scan tools to clear error dashboard lights).'
      },
      {
        id: 'paint-ceramic',
        name: 'Heavy Equipment Shell Paint & Ceramic Shielding',
        category: 'detailing',
        estimatePrice: 1200,
        duration: '12 Hours',
        description: 'Industrial dual-action cabin paint correction, chrome polish, and industrial 9H ceramic shield coating to resist harsh worksite chemistry.',
        icon: 'Sparkles'
      },
      {
        id: 'chassis-balance',
        name: 'Axle Corner Weighing & Leaf Spring Alignment',
        category: 'tuning',
        estimatePrice: 550,
        duration: '4 Hours',
        description: 'Individual heavy-duty axle corner scaling, multi-leaf spring suspension leveling, helper airbag pressure checks, and performance commercial alignment.',
        icon: 'Sliders',
        helperText: '(Suspension and alignment tuning for perfect steering precision and even tire wear).'
      },
      {
        id: 'track-prep',
        name: 'Heavy-Duty Rig Fleet Day Preparation Package',
        category: 'diagnostics',
        estimatePrice: 380,
        duration: '3 Hours',
        description: 'Commercial annual safety compliance checks, brake chamber stroke adjustments, line pressure telemetry, and absolute stress testing.',
        icon: 'Gauge'
      }
    ],
    packages: [
      {
        id: 'pkg-street',
        name: 'Commercial Safety Run',
        price: '$399',
        description: 'Class-8 CAN-bus diagnostic sweep, DEF checks, and fluid stress safety checks.',
        features: [
          'Class-8 CAN-bus diagnostic sweep',
          'DEF dosing system spray check',
          'Compressed air line pressure audits',
          '45-point heavy industrial chassis check',
          'Wheel-hub temperature monitoring checks'
        ]
      },
      {
        id: 'pkg-apex',
        name: 'Fleet Efficiency Pro',
        price: '$1199',
        description: 'Our standard fleet operational performance map for fuel and wear savings.',
        features: [
          'Everything in Commercial Safety Run',
          'Stage 1 Heavy Fleet Fuel Efficiency Tuning',
          'EGT & particulate system sensor calibration',
          'Governor and throttle slope customization',
          'Historical telemetry logging setup',
          '24-month commercial map warranty'
        ],
        isPopular: true
      },
      {
        id: 'pkg-track',
        name: 'Heavy-Duty Ironclad',
        price: '$2299',
        description: 'Bespoke major maintenance and compliance setup for intensive service fleets.',
        features: [
          'Everything in Fleet Efficiency Pro',
          'Industrial multi-axle leaf spring scales calibration',
          'Cooling system pressure stress audits',
          'Air-bag dynamic leveling optimization',
          'Federal compliance ready stamp validation',
          '1-on-1 review with commercial diesel master'
        ]
      }
    ]
  }
};

export default function App() {
  const [bookings, setBookings] = useState<BookingRecord[]>(PRESEEDED_BOOKINGS);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  // Active Preset state
  const [activePreset, setActivePreset] = useState<'apex' | 'ev' | 'fleet'>('apex');

  // Multi-theme dynamic custom accent states for Reselling Agency Owners
  const [primaryAccent, setPrimaryAccent] = useState('#FF5F1F'); // Default Neon Orange
  const [accentLabel, setAccentLabel] = useState('Cyberpunk Tokyo Orange');
  const [isResellerPanelOpen, setIsResellerPanelOpen] = useState(false);
  const [shopName, setShopName] = useState('Apex Dynamics');
  const [customPhone, setCustomPhone] = useState('(310) 555-0142');

  const handlePresetChange = (presetKey: 'apex' | 'ev' | 'fleet') => {
    setActivePreset(presetKey);
    const p = PRESETS[presetKey];
    setPrimaryAccent(p.accent);
    setAccentLabel(p.accentLabel);
    setShopName(p.shopName);
    setCustomPhone(p.phone);
  };

  const colorPresets = [
    { value: '#FF5F1F', label: 'Tokyo Orange', rgb: '255, 95, 31' },
    { value: '#DFFF00', label: 'Acid Green', rgb: '223, 255, 0' },
    { value: '#E42217', label: 'Guards Red', rgb: '228, 34, 23' },
    { value: '#00E5FF', label: 'Neon Cyan', rgb: '0, 229, 255' }
  ];

  const handleUpdateStatus = (ticketId: string, newStatus: TicketStatus) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.ticketId === ticketId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  const handleAddBooking = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleSelectServiceFromHome = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    handleNavigate('booking');
  };

  const handleSelectPackageService = (serviceId: string, _price: number) => {
    setSelectedServiceId(serviceId);
    handleNavigate('booking');
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#0A0B0E] text-slate-100 selection:bg-accent-orange selection:text-black font-sans relative"
      style={{ 
        '--color-accent-orange': primaryAccent,
      } as React.CSSProperties}
    >
      {/* 
        AGENCY RESELLER DEMO OVERLAY 
        Provides instant customization proof to boost sales pitch value!
      */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsResellerPanelOpen(!isResellerPanelOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-accent-orange shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open Reseller Live Customizer"
        >
          <Settings2 className="h-5.5 w-5.5 group-hover:rotate-45 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-orange"></span>
          </span>
        </button>

        <AnimatePresence>
          {isResellerPanelOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="absolute bottom-16 left-0 w-80 bg-[#121319] border border-neutral-800 rounded-xl p-5 shadow-2xl space-y-4 font-sans text-xs"
            >
              <div className="border-b border-neutral-900 pb-3">
                <div className="flex items-center space-x-2 text-accent-orange">
                  <Sliders className="h-4 w-4" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Agency Reseller Sandbox</span>
                </div>
                <h4 className="font-display font-medium text-white text-sm mt-1 uppercase">Instant color and branding switcher</h4>
                <p className="mt-2 text-[11px] text-zinc-400 font-sans leading-relaxed">
                  💡 Reseller Tip: This premium dark aesthetic and advanced telemetry tracking are optimally engineered to target high-ticket automotive niches—such as exotic detailing studios, ECU remapping labs, EV calibration centers, and performance tuning garages.
                </p>
              </div>

              {/* Archetype Preset Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">0. Shop Niche Preset</label>
                <select
                  value={activePreset}
                  onChange={(e) => handlePresetChange(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-900 rounded px-2.5 py-2 text-zinc-200 text-xs font-mono focus:outline-none focus:border-accent-orange cursor-pointer"
                >
                  <option value="apex">Apex Performance (Tuning & Sports)</option>
                  <option value="ev">EcoEV Labs (Electric / Eco Labs)</option>
                  <option value="fleet">Fleet Iron (Fleet & Heavy Duty)</option>
                </select>
                <span className="block text-[8px] text-zinc-500 font-sans leading-normal">
                  *Selecting a Preset swaps hero titles, customized pricing structures, and services lists instantly.
                </span>
              </div>

              {/* Dynamic Theme Colors presets */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">1. Color Identity</span>
                <div className="grid grid-cols-4 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => {
                        setPrimaryAccent(preset.value);
                        setAccentLabel(preset.label);
                      }}
                      className="h-8 rounded-md border flex items-center justify-center relative cursor-pointer"
                      style={{ 
                        backgroundColor: preset.value + '10', 
                        borderColor: primaryAccent === preset.value ? preset.value : '#252836' 
                      }}
                      title={preset.label}
                    >
                      <div className="h-4.5 w-4.5 rounded-full" style={{ backgroundColor: preset.value }} />
                      {primaryAccent === preset.value && (
                        <Check className="absolute h-3 w-3 text-black stroke-[3px]" />
                      )}
                    </button>
                  ))}
                </div>
                <span className="block text-[10px] text-zinc-400 font-mono italic">
                  Active Palette: <span className="text-accent-orange font-bold font-sans uppercase">{accentLabel}</span>
                </span>
              </div>

              {/* Dynamic Shop Name Overrides */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-900/40">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">2. Shop Name (Branding)</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g., Apex Dynamics"
                  className="w-full bg-neutral-950 border border-neutral-900 rounded px-2.5 py-1.5 text-zinc-200 text-xs font-mono focus:outline-none focus:border-accent-orange"
                />
              </div>

              {/* Dynamic Phone Override */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">3. Dedicated Phone Tag</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="e.g., (310) 555-0142"
                  className="w-full bg-neutral-950 border border-neutral-900 rounded px-2.5 py-1.5 text-zinc-200 text-xs font-mono focus:outline-none focus:border-accent-orange"
                />
              </div>

              <div className="rounded-lg bg-neutral-950 p-3 text-[10px] text-zinc-500 space-y-1 leading-normal border border-neutral-900 font-sans">
                <p className="text-zinc-400 uppercase font-bold text-[9px] font-mono">Reselling Value Proposition:</p>
                <p className="font-light">Demonstrate customization capabilities to local mechanic buyers live. Change colors and labels in seconds with no code rebuild.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Primary Header Section */}
      <Navbar 
        onNavigate={handleNavigate}
        activeSection={activeSection}
        shopName={shopName}
      />

      {/* Main Single Page Sections Container */}
      <main className="relative">
        <Hero 
          onNavigate={handleNavigate}
          baysAvailable={bookings.filter(b => b.status !== 'ready').length < 5 ? 5 - bookings.filter(b => b.status !== 'ready').length : 2}
          heroTitle={PRESETS[activePreset].heroTitle || undefined}
          heroSubtext={PRESETS[activePreset].heroSubtext}
          tagline={PRESETS[activePreset].tagline}
        />
        
        <ServicesGrid 
          onSelectService={handleSelectServiceFromHome}
          services={PRESETS[activePreset].services}
        />
        
        <BookingDashboard 
          onAddBooking={handleAddBooking}
          selectedServiceId={selectedServiceId}
          clearSelectedService={() => setSelectedServiceId(null)}
          onNavigate={handleNavigate}
          services={PRESETS[activePreset].services}
        />
        
        <ServiceTracker 
          bookings={bookings}
          onUpdateStatus={handleUpdateStatus}
        />
        
        <PricingMatrix 
          onSelectPackageService={handleSelectPackageService}
          packages={PRESETS[activePreset].packages}
        />
        
        <ProofSection />
      </main>

      {/* Lead Capture Magnet Module */}
      <LeadCapture />

      {/* Footer Area */}
      <footer className="bg-neutral-950 border-t border-neutral-900 text-zinc-400 font-sans text-xs pt-16 pb-8 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-neutral-900">
            {/* Left Big Info column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-2 font-display text-lg font-bold tracking-wider text-white">
                <span className="relative flex h-8 w-8 items-center justify-center rounded bg-accent-orange/10 border border-accent-orange/30 text-accent-orange">
                  <Cpu className="h-4.5 w-4.5" />
                </span>
                <span>{shopName.toUpperCase()}</span>
              </div>
              <p className="font-light max-w-md leading-relaxed text-zinc-500 text-[11px]">
                High-performance exotics tuning, dyno ECU diagnostic calibration, 3-stage orbital paint correction, coilovers balancing alignment, and track preparation audits. Built for automotive purists.
              </p>
              
              <div className="space-y-2 pt-2 text-[11px] font-mono text-zinc-500">
                <p className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-accent-orange shrink-0" />
                  <span>4108 Apex Runway, Culver City, CA 90232</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-accent-orange shrink-0" />
                  <span>{customPhone}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-accent-orange shrink-0" />
                  <span>calibration@{shopName.toLowerCase().replace(/\s+/g, '')}.net</span>
                </p>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-4">
              <h5 className="font-display text-xs font-bold uppercase tracking-wider text-white">Garage Navigation</h5>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-medium">
                <button onClick={() => handleNavigate('services')} className="text-zinc-500 hover:text-accent-orange text-left uppercase transition-colors cursor-pointer">Capabilities</button>
                <button onClick={() => handleNavigate('booking')} className="text-zinc-500 hover:text-accent-orange text-left uppercase transition-colors cursor-pointer">Scheduler</button>
                <button onClick={() => handleNavigate('tracker')} className="text-zinc-500 hover:text-accent-orange text-left uppercase transition-colors cursor-pointer">Telemetry</button>
                <button onClick={() => handleNavigate('pricing')} className="text-zinc-500 hover:text-accent-orange text-left uppercase transition-colors cursor-pointer">Matrices</button>
                <button onClick={() => handleNavigate('reviews')} className="text-zinc-500 hover:text-accent-orange text-left uppercase transition-colors cursor-pointer">Reviews</button>
              </div>
            </div>

            {/* Terminal Schedule status */}
            <div className="md:col-span-4 space-y-4">
              <h5 className="font-display text-xs font-bold uppercase tracking-wider text-white">Operations telemetry</h5>
              <div className="space-y-3 font-mono text-[11px] text-zinc-500 leading-normal">
                <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                  <span>MONDAY - FRIDAY</span>
                  <span className="text-zinc-300">08:30 AM - 06:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                  <span>SATURDAY (SHIFT-A)</span>
                  <span className="text-zinc-300">09:00 AM - 04:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>SUNDAY TRACK SERVICE</span>
                  <span className="text-accent-orange font-bold uppercase">OUT OF STATION</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom attribution copyright row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-600">
            <div className="flex items-center space-x-1.5">
              <span>© {new Date().getFullYear()} {shopName}. All diagnostic rights registered.</span>
              <span className="hidden sm:inline">|</span>
              <span className="text-accent-orange flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>OEM Verified Integration</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 select-none text-[10px]">
              <span>Assembled with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>for Agency Resellers</span>
              <ExternalLink className="h-3 w-3 text-zinc-500" />
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
