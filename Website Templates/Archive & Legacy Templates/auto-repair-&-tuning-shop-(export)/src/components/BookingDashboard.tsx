import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES } from '../data';
import { VehicleType, ServiceItem, BookingRecord, TicketStatus } from '../types';
import { 
  Car, Trash, Calendar, Clock, Contact, Check, 
  ChevronRight, ChevronLeft, ShieldCheck, HelpCircle, 
  Sparkles, DollarSign, Cpu, Settings, BadgeAlert, Send, Copy
} from 'lucide-react';

interface BookingDashboardProps {
  onAddBooking: (newBooking: BookingRecord) => void;
  selectedServiceId: string | null;
  clearSelectedService: () => void;
  onNavigate: (sectionId: string) => void;
  services?: ServiceItem[];
}

const VEHICLE_TYPES = [
  { id: 'sports' as VehicleType, label: 'Sports / Exotic', icon: Cpu, desc: '911, M3, GT-R, exotics, aero-tunes' },
  { id: 'sedan' as VehicleType, label: 'Luxury Sedan', icon: Car, desc: 'C-Class, Model S, executive cruisers' },
  { id: 'suv' as VehicleType, label: 'Premium SUV', icon: Sparkles, desc: 'Cayenne, Urus, luxury utility lines' },
  { id: 'truck' as VehicleType, label: 'Offroad / Truck', icon: Settings, desc: 'Raptor, RAM TRX, performance builds' }
];

const SUB_MODELS: Record<VehicleType, { make: string; model: string }[]> = {
  sports: [
    { make: 'Porsche', model: '911 GT3 RS' },
    { make: 'BMW', model: 'M3 Competition' },
    { make: 'Chevrolet', model: 'Corvette C8 Z06' },
    { make: 'Audi', model: 'R8 V10 Performance' },
    { make: 'Nissan', model: 'GT-R Nismo' },
    { make: 'Acura', model: 'NSX Type S' }
  ],
  sedan: [
    { make: 'Tesla', model: 'Model S Plaid' },
    { make: 'BMW', model: 'M5 Competition' },
    { make: 'Audi', model: 'RS6 Avant' },
    { make: 'Mercedes-Benz', model: 'E63 AMG S' },
    { make: 'Porsche', model: 'Panamera Turbo S' }
  ],
  suv: [
    { make: 'Porsche', model: 'Cayenne Turbo GT' },
    { make: 'Lamborghini', model: 'Urus Performante' },
    { make: 'Land Rover', model: 'Range Rover SV' },
    { make: 'Tesla', model: 'Model X Plaid' },
    { make: 'Mercedes-Benz', model: 'AMG G 63' }
  ],
  truck: [
    { make: 'Ford', model: 'F-150 Raptor R' },
    { make: 'RAM', model: '1500 TRX' },
    { make: 'Rivian', model: 'R1T Launch Edition' },
    { make: 'GMC', model: 'Hummer EV Edition 1' },
    { make: 'Toyota', model: 'Tundra TRD Pro' }
  ]
};

const TIME_SLOTS = [
  '08:30 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'
];

export default function BookingDashboard({ onAddBooking, selectedServiceId, clearSelectedService, onNavigate, services }: BookingDashboardProps) {
  // Wizard state: 1: Vehicle, 2: Service, 3: DateTime, 4: Contact, 5: Confirmed
  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState<VehicleType>('sports');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  
  const [selectedService, setSelectedService] = useState<ServiceItem>((services || SERVICES)[1]); // Default to ECU mapping
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  const [generatedTicket, setGeneratedTicket] = useState<BookingRecord | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync selectedService when services change (preset switch)
  useEffect(() => {
    const activeList = services || SERVICES;
    const match = activeList.find(s => s.id === selectedService?.id);
    if (match) {
      setSelectedService(match);
    } else {
      const defaultSrv = activeList.find(s => s.category === 'tuning') || activeList[1] || activeList[0];
      if (defaultSrv) {
        setSelectedService(defaultSrv);
      }
    }
  }, [services]);

  // If a service was pre-selected from the Home grids
  useEffect(() => {
    if (selectedServiceId) {
      const match = (services || SERVICES).find(s => s.id === selectedServiceId);
      if (match) {
        setSelectedService(match);
        setStep(2); // Jump straight to service confirm and proceed
      }
    }
  }, [selectedServiceId, services]);

  // Set default date (tomorrow)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
    setSelectedTime(TIME_SLOTS[1]);
  }, []);

  const handleNextStep = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return vehicleMake.trim().length > 0 && vehicleModel.trim().length > 0;
      case 2:
        return selectedService !== null;
      case 3:
        return selectedDate !== '' && selectedTime !== '';
      case 4:
        return customerName.trim().length > 2 && 
               customerEmail.includes('@') && 
               customerPhone.trim().length > 7;
      default:
        return false;
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid()) return;

    // Generate random Ticket ID matching mechanical style: "APEX-XXXX"
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefixMap: Record<VehicleType, string> = {
      sports: 'TRACK',
      sedan: 'STREET',
      suv: 'APEX',
      truck: 'HAUL'
    };
    const ticketId = `${prefixMap[vehicleType]}-${randomNum}`;

    const newRecord: BookingRecord = {
      id: `booking-${Date.now()}`,
      ticketId,
      customerName,
      email: customerEmail,
      phone: customerPhone,
      vehicleType,
      vehicleMake,
      vehicleModel,
      serviceId: selectedService.id,
      selectedDate,
      selectedTime,
      notes: customerNotes,
      priceEstimate: selectedService.estimatePrice,
      status: 'inspection' // Initial status
    };

    // Save to memory
    onAddBooking(newRecord);
    setGeneratedTicket(newRecord);
    setStep(5); // Go to receipt/confirmation view
    clearSelectedService();
  };

  const handleCopyTicketId = () => {
    if (!generatedTicket) return;
    navigator.clipboard.writeText(generatedTicket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetBooking = () => {
    setStep(1);
    setVehicleMake('');
    setVehicleModel('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerNotes('');
    setGeneratedTicket(null);
  };

  return (
    <section id="booking" className="relative py-20 bg-neutral-950 border-t border-neutral-900 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Visual Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-orange bg-accent-orange/5 px-3 py-1 rounded-full uppercase">
            <span>[ SYSTEM PORTAL ]</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Interactive Calibration Scheduler
          </h2>
          <p className="text-zinc-500 font-sans text-sm font-light">
            Configure your mechanical specifications, select diagnostic tuning parameters, select a designated scheduling block, and generate your live trackable Ticket ID.
          </p>
        </div>

        {/* Outer Split Wizard Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: Step Form (8 cols on large screens) */}
          <div className="lg:col-span-8 bg-[#101115] rounded-2xl border border-neutral-900 overflow-hidden shadow-2xl relative">
            
            {/* Form Progress Header */}
            {step < 5 && (
              <div className="border-b border-neutral-900 bg-neutral-950/80 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        step === num 
                          ? 'bg-accent-orange text-black font-semibold' 
                          : step > num 
                          ? 'bg-neutral-800 text-accent-orange border border-accent-orange/30' 
                          : 'bg-neutral-900 text-zinc-600 border border-neutral-900'
                      }`}>
                        {step > num ? <Check className="h-4 w-4" /> : num}
                      </div>
                      {num < 4 && (
                        <div className={`w-8 h-[2px] ml-2 ${step > num ? 'bg-accent-orange/30' : 'bg-neutral-900'}`} />
                      )}
                    </div>
                  ))}
                </div>
                
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest hidden sm:inline">
                  Step {step} of 4: {
                    step === 1 ? 'Select Vehicle' :
                    step === 2 ? 'Calibrate Service' :
                    step === 3 ? 'Schedule Window' :
                    'Customer Signature'
                  }
                </span>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-6">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: VEHICLE SETUP */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                        Enter Vehicle Matrix Specifications
                      </h3>
                      <p className="text-xs text-zinc-400 font-light">
                        Select the base chassis type and input your vehicle make and model. This allows our hardware mechanics to allocate proper lifts.
                      </p>
                    </div>

                    {/* Highly Visual Grid of Vehicle Categories with SVG Silhouettes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {VEHICLE_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = vehicleType === type.id;
                        
                        // Render SVG Silhouettes matching the active theme color accent
                        const renderSilhouette = () => {
                          const strokeColor = isSelected ? 'var(--color-accent-orange)' : '#27272a'; // neutral-800
                          switch (type.id) {
                            case 'sports':
                              return (
                                <svg viewBox="0 0 240 80" className="w-full h-14 mt-2 transition-all duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path 
                                    d="M10 50 C25 48, 30 40, 45 40 C60 40, 70 42, 80 43 C90 32, 110 20, 145 22 C175 24, 195 35, 205 45 C215 45, 222 43, 228 41 C232 40, 235 44, 233 48 C227 60, 218 58, 208 58 C198 58, 192 56, 185 56 C178 56, 172 58, 168 58" 
                                    stroke={strokeColor} 
                                    strokeWidth="1.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                  />
                                  <path d="M10 50 C12 50, 15 54, 20 54 L38 54 C40 45, 65 45, 67 54 L165 54 C167 45, 192 45, 194 54 L210 54 C215 54, 220 50, 225 50" stroke={strokeColor} strokeWidth="1.5" />
                                  <circle cx="52.5" cy="54" r="10" stroke={strokeColor} strokeWidth="1.5" fill="black" />
                                  <circle cx="52.5" cy="54" r="5" stroke={strokeColor} strokeWidth="1" />
                                  <circle cx="180.5" cy="54" r="10" stroke={strokeColor} strokeWidth="1.5" fill="black" />
                                  <circle cx="180.5" cy="54" r="5" stroke={strokeColor} strokeWidth="1" />
                                  <path d="M98 32 C110 25, 135 25, 150 28 C160 30, 168 37, 173 45 L91 45 C93 40, 95 35, 98 32 Z" stroke={strokeColor} strokeWidth="1" strokeLinejoin="round" />
                                  <path d="M125 30 L125 48 M125 48 C125 52, 140 52, 145 52" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
                                </svg>
                              );
                            case 'sedan':
                              return (
                                <svg viewBox="0 0 240 80" className="w-full h-14 mt-2 transition-all duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path 
                                    d="M10 50 C20 49, 28 42, 42 42 C56 42, 65 43, 72 44 C82 30, 98 22, 130 22 C165 22, 188 23, 198 38 C204 38, 218 39, 225 41 C229 42, 233 46, 231 50 C226 58, 215 58, 205 58 L35 58" 
                                    stroke={strokeColor} 
                                    strokeWidth="1.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                  />
                                  <path d="M10 50 C12 50, 15 54, 20 54 L38 54 C40 45, 65 45, 67 54 L165 54 C167 45, 192 45, 194 54 L210 54" stroke={strokeColor} strokeWidth="1.5" />
                                  <circle cx="52.5" cy="54" r="10.5" stroke={strokeColor} strokeWidth="1.5" fill="black" />
                                  <circle cx="52.5" cy="54" r="5" stroke={strokeColor} strokeWidth="1" />
                                  <circle cx="180.5" cy="54" r="10.5" stroke={strokeColor} strokeWidth="1.5" fill="black" />
                                  <circle cx="180.5" cy="54" r="5" stroke={strokeColor} strokeWidth="1" />
                                  <path d="M85 38 C92 28, 115 26, 135 26 C155 26, 175 28, 182 38" stroke={strokeColor} strokeWidth="1" opacity="0.6" />
                                  <path d="M132 26 L132 42" stroke={strokeColor} strokeWidth="1" opacity="0.4" />
                                </svg>
                              );
                            case 'suv':
                              return (
                                <svg viewBox="0 0 240 80" className="w-full h-14 mt-2 transition-all duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path 
                                    d="M10 54 C22 52, 28 43, 40 43 L72 43 C78 28, 92 24, 158 24 C175 24, 190 26, 198 33 C204 35, 212 37, 218 39 C225 41, 229 44, 228 48 C226 56, 218 56, 208 56" 
                                    stroke={strokeColor} 
                                    strokeWidth="1.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                  />
                                  <path d="M10 54 C12 54, 15 56, 20 56 L35 56 C38 45, 65 45, 68 56 L165 56 C168 45, 195 45, 198 56 L208 56" stroke={strokeColor} strokeWidth="1.5" />
                                  <circle cx="51.5" cy="56" r="12" stroke={strokeColor} strokeWidth="1.5" fill="black" />
                                  <circle cx="51.5" cy="56" r="6" stroke={strokeColor} strokeWidth="1" />
                                  <circle cx="181.5" cy="56" r="12" stroke={strokeColor} strokeWidth="1.5" fill="black" />
                                  <circle cx="181.5" cy="56" r="6" stroke={strokeColor} strokeWidth="1" />
                                  <path d="M78 40 C82 30, 95 28, 130 28 C155 28, 175 29, 185 36 M130 28 L130 43" stroke={strokeColor} strokeWidth="1" strokeLinejoin="round" opacity="0.6" />
                                </svg>
                              );
                            case 'truck':
                              return (
                                <svg viewBox="0 0 240 80" className="w-full h-14 mt-2 transition-all duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path 
                                    d="M10 54 C15 52, 22 45, 35 45 L70 45 C75 32, 85 28, 135 28 C145 28, 152 35, 152 45 L205 45 C215 45, 222 43, 225 43 C229 42, 230 46, 229 50 C226 56, 218 56, 208 56" 
                                    stroke={strokeColor} 
                                    strokeWidth="1.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                  />
                                  <path d="M10 54 C12 54, 15 56, 20 56 L32 56 C35 44, 65 44, 68 56 L165 56 C168 44, 198 44, 201 56 L208 56" stroke={strokeColor} strokeWidth="1.5" />
                                  <circle cx="50" cy="56" r="13" stroke={strokeColor} strokeWidth="1.5" fill="black" />
                                  <circle cx="50" cy="56" r="7" stroke={strokeColor} strokeWidth="1" />
                                  <circle cx="182.5" cy="56" r="13" stroke={strokeColor} strokeWidth="1.5" fill="black" />
                                  <circle cx="182.5" cy="56" r="7" stroke={strokeColor} strokeWidth="1" />
                                  <path d="M80 41 C84 32, 95 31, 125 31 L144 31 L144 45 M115 31 L115 45" stroke={strokeColor} strokeWidth="1" strokeLinejoin="round" opacity="0.6" />
                                </svg>
                              );
                            default:
                              return null;
                          }
                        };

                        return (
                          <div
                            key={type.id}
                            onClick={() => setVehicleType(type.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected 
                                ? 'border-accent-orange bg-accent-orange/5 text-white' 
                                : 'border-neutral-800 bg-neutral-900/40 text-zinc-400 hover:border-neutral-700 hover:text-zinc-200'
                            }`}
                          >
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-accent-orange text-black' : 'bg-neutral-900 text-zinc-400'}`}>
                                  <Icon className="h-4.5 w-4.5" />
                                </div>
                                <span className="font-display font-bold text-sm uppercase tracking-wide">{type.label}</span>
                              </div>
                              <p className="text-[11px] font-sans text-zinc-500 leading-normal">{type.desc}</p>
                            </div>
                            
                            {/* SVG Silhouette placeholder */}
                            <div className="mt-4 flex justify-center items-center">
                              {renderSilhouette()}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dynamic High-Ticket Model dropdown / chip grid */}
                    <AnimatePresence mode="wait">
                      {vehicleType && (
                        <motion.div
                          key={`sub-models-${vehicleType}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-5 border border-neutral-800 bg-neutral-900/40 rounded-xl space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-accent-orange" />
                              Select High-Ticket Archetype Model
                            </span>
                            <span className="text-[10px] uppercase text-zinc-500 font-sans hidden sm:inline">
                              Instantly configures parameters
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {SUB_MODELS[vehicleType]?.map((item, index) => {
                              const isSelectedModel = vehicleMake === item.make && vehicleModel === item.model;
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setVehicleMake(item.make);
                                    setVehicleModel(item.model);
                                  }}
                                  className={`p-2.5 rounded-lg border text-xs text-left transition-all relative ${
                                    isSelectedModel
                                      ? 'border-accent-orange bg-accent-orange/10 text-white font-medium'
                                      : 'border-neutral-800 bg-neutral-950 text-zinc-400 hover:border-neutral-700 hover:text-white'
                                  }`}
                                >
                                  <span className="block text-[9px] text-zinc-500 font-mono uppercase leading-none mb-1">{item.make}</span>
                                  <span className="block truncate font-display text-[10.5px] uppercase tracking-wide">{item.model}</span>
                                  {isSelectedModel && (
                                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-orange" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Make and Model inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <label className="block text-xs font-mono uppercase text-zinc-500" htmlFor="vehicle-make">
                          Chassis Make (Brand) *
                        </label>
                        <input
                          id="vehicle-make"
                          type="text"
                          required
                          value={vehicleMake}
                          onChange={(e) => setVehicleMake(e.target.value)}
                          placeholder="e.g., Porsche, BMW, Audi"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange placeholder-zinc-600 transition-all font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono uppercase text-zinc-500" htmlFor="vehicle-model">
                          Exact Model Designation *
                        </label>
                        <input
                          id="vehicle-model"
                          type="text"
                          required
                          value={vehicleModel}
                          onChange={(e) => setVehicleModel(e.target.value)}
                          placeholder="e.g., 911 GT3 RS, M2 Comp, RS6"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange placeholder-zinc-600 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: SERVICE CONFIGURATION */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                        Configure Specialty Calibration Service
                      </h3>
                      <p className="text-xs text-zinc-400 font-light">
                        Select your necessary mechanical specialty tune or maintenance package. Values represent precision base diagnostics.
                      </p>
                    </div>

                    {/* Services Option Selection list */}
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {(services || SERVICES).map((srv) => {
                        const isSelected = selectedService?.id === srv.id;
                        return (
                          <div
                            key={srv.id}
                            onClick={() => setSelectedService(srv)}
                            className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                              isSelected 
                                ? 'border-accent-orange bg-accent-orange/5' 
                                : 'border-neutral-800 bg-neutral-900/20 hover:border-neutral-700'
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-accent-orange text-black' : 'bg-neutral-800 text-zinc-400'}`}>
                                {isSelected ? <Check className="h-4.5 w-4.5" /> : <Settings className="h-4.5 w-4.5" />}
                              </div>
                              <div className="space-y-1">
                                <span className={`block font-display text-sm font-bold uppercase tracking-wide ${isSelected ? 'text-accent-orange' : 'text-white'}`}>
                                  {srv.name}
                                </span>
                                <span className="block text-[11px] text-zinc-400 line-clamp-1 font-sans">{srv.description}</span>
                                {srv.helperText && (
                                  <span className="block text-xs text-slate-400 mt-1 font-sans italic">
                                    {srv.helperText}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right font-mono text-xs pl-4 shrink-0">
                              <span className="block font-bold text-white">${srv.estimatePrice}</span>
                              <span className="block text-[10px] text-zinc-500 uppercase">{srv.duration}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: SCHEDULE WINDOW */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                        Access Calibration Bay Timeslots
                      </h3>
                      <p className="text-xs text-zinc-400 font-light">
                        Locate an open mechanical schedule block in our high-end service queue. Dates represents our live bay synchronization.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Calendar Date Selection */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono uppercase text-zinc-500" htmlFor="booking-date">
                          Designate Date *
                        </label>
                        <div className="relative">
                          <input
                            id="booking-date"
                            type="date"
                            required
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange font-mono"
                          />
                        </div>
                        <span className="block text-[10px] text-zinc-500 font-mono">
                          Note: Sunday scheduling closed for track safety audits.
                        </span>
                      </div>

                      {/* Time Slots grid picker */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono uppercase text-zinc-500">
                          Designate Shift block *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {TIME_SLOTS.map((slot) => {
                            const isSelected = selectedTime === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedTime(slot)}
                                className={`px-2 py-2.5 rounded-lg border text-xs font-mono transition-all uppercase cursor-pointer ${
                                  isSelected 
                                    ? 'border-accent-orange bg-accent-orange/10 text-accent-orange' 
                                    : 'border-neutral-800 bg-neutral-900/40 text-zinc-400 hover:border-neutral-700 hover:text-white'
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: CONTACT / INSTRUCTIONS SIGNATURE */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                        Customer Signature & Direct Contact
                      </h3>
                      <p className="text-xs text-zinc-400 font-light">
                        Provide diagnostic delivery contact instructions. We do not distribute credentials; updates are fully local and trackable.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-mono uppercase text-zinc-500" htmlFor="customer-name">
                          Owner Full Name *
                        </label>
                        <input
                          id="customer-name"
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g., Alexander Thorne"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-mono uppercase text-zinc-500" htmlFor="customer-email">
                          Contact Email Address *
                        </label>
                        <input
                          id="customer-email"
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="alex@apextelemetry.net"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange font-mono"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-xs font-mono uppercase text-zinc-500" htmlFor="customer-phone">
                          Phone Signal Terminal (Updates via SMS) *
                        </label>
                        <input
                          id="customer-phone"
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="(310) 555-0142"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange font-mono"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-xs font-mono uppercase text-zinc-500" htmlFor="customer-notes">
                          Hardware Alterations or Mechanical Notes (Optional)
                        </label>
                        <textarea
                          id="customer-notes"
                          rows={3}
                          value={customerNotes}
                          onChange={(e) => setCustomerNotes(e.target.value)}
                          placeholder="e.g., Exhaust model numbers, suspension trim expectations"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-orange placeholder-zinc-600 transition-all font-sans"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: SUCCESS & RECEIPT SUMMARY TRACK */}
                {step === 5 && generatedTicket && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8 text-center py-6"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <ShieldCheck className="h-8 w-8 animate-bounce" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <h3 className="font-display text-2xl font-black uppercase text-white tracking-wide">
                        Hardware Manifest Approved!
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        Your vehicle session is locked inside our bay directory. Capture the custom dynamic diagnostics code below to verify your vehicle repair progress at any point.
                      </p>
                    </div>

                    {/* Highly aesthetic digital service summary and work order invoice layout */}
                    <div className="max-w-md mx-auto border-2 border-dashed border-neutral-800 rounded-2xl bg-neutral-950 p-6 space-y-6 text-left relative overflow-hidden">
                      {/* Grid background visual overlay decoration */}
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                      
                      {/* Ticket heading barcode status */}
                      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">RECEIPT BARCODE ID</span>
                          <span className="block font-mono text-xs font-bold text-white tracking-widest uppercase">APEX//DYNAMICS//CALIBRATE</span>
                        </div>
                        <div className="self-end text-right">
                          <span className="inline-flex rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                            Secured
                          </span>
                        </div>
                      </div>

                      {/* Ticket Fields specs */}
                      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                        <div>
                          <span className="block text-[10px] text-zinc-500 uppercase">Active Ticket ID</span>
                          <span className="block font-bold text-accent-orange text-sm font-display tracking-wider">
                            {generatedTicket.ticketId}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[10px] text-zinc-500 uppercase">Terminal Name</span>
                          <span className="block font-semibold text-zinc-200 truncate">{generatedTicket.customerName}</span>
                        </div>

                        <div>
                          <span className="block text-[10px] text-zinc-500 uppercase">Locked Chassis</span>
                          <span className="block font-semibold text-zinc-200 capitalize">
                            {generatedTicket.vehicleMake} {generatedTicket.vehicleModel}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[10px] text-zinc-500 uppercase">Calibration Base</span>
                          <span className="block font-semibold text-zinc-200 truncate">{selectedService.name}</span>
                        </div>

                        <div className="col-span-2 pt-2 border-t border-neutral-900 flex justify-between items-center bg-neutral-900/40 p-3 rounded-lg border border-neutral-900">
                          <div>
                            <span className="block text-[10px] text-zinc-500 uppercase">Appointmt Window</span>
                            <span className="block text-[11px] font-bold text-white">
                              {generatedTicket.selectedDate} @ {generatedTicket.selectedTime}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[10px] text-zinc-400 uppercase">Est Total</span>
                            <span className="block text-sm font-bold text-accent-orange font-display">from ${generatedTicket.priceEstimate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Copy Action Row */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleCopyTicketId}
                          className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 px-4 py-3 text-center text-xs font-mono font-semibold text-zinc-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Copy className="h-4 w-4 text-accent-orange" />
                          <span>{copied ? 'Copied to Clipboard!' : 'Copy Ticket Code'}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 font-sans max-w-sm mx-auto leading-relaxed text-center">
                      ℹ️ Automated Workflow: This module dynamically generates a crisp digital work order that you and your client can instantly reference.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-sm mx-auto">
                      <button
                        type="button"
                        onClick={() => onNavigate('tracker')}
                        className="w-full rounded-lg bg-accent-orange px-6 py-3.5 text-center font-display text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
                      >
                        Enter Tracker Console
                      </button>
                      <button
                        type="button"
                        onClick={handleResetBooking}
                        className="w-full text-zinc-500 hover:text-white transition-colors py-2 text-xs font-mono uppercase tracking-wider"
                      >
                        Schedule Another Vehicle
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step Navigation Controls Footer */}
              {step < 5 && (
                <div className="pt-6 border-t border-neutral-900 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={step === 1}
                    className={`flex items-center space-x-2 text-xs font-mono uppercase tracking-wider transition-colors py-2 px-3 rounded-lg border ${
                      step === 1 
                        ? 'border-transparent text-zinc-700 cursor-not-allowed' 
                        : 'border-neutral-800 text-zinc-400 hover:text-white hover:border-neutral-700 cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!isStepValid()}
                      className={`flex items-center justify-center space-x-2 rounded-lg py-3 px-6 text-xs font-mono uppercase tracking-wider font-bold transition-all ${
                        isStepValid()
                          ? 'bg-accent-orange hover:brightness-110 text-black cursor-pointer'
                          : 'bg-neutral-900 text-zinc-600 border border-neutral-900 cursor-not-allowed'
                      }`}
                    >
                      <span>Next Block</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!isStepValid()}
                      className={`flex items-center justify-center space-x-2 rounded-lg py-3 px-8 text-xs font-mono uppercase tracking-widest font-bold tracking-wider transition-all cursor-pointer ${
                        isStepValid()
                          ? 'bg-gradient-to-r from-accent-orange to-amber-500 text-black hover:brightness-110 shadow-lg shadow-accent-orange/15'
                          : 'bg-neutral-900 text-zinc-400 border border-neutral-800 cursor-not-allowed'
                      }`}
                    >
                      <Send className="h-4 w-4" />
                      <span>Transmit Manifest</span>
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT AREA: Interactive Setup Receipt Overview (4 cols on large screens) */}
          <div className="lg:col-span-4 bg-[#0F1014] rounded-2xl border border-neutral-900 p-6 space-y-6 relative sticky top-28 shadow-xl">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white border-b border-neutral-900 pb-3">
              Technical Order Specs
            </h3>

            {/* Config Specs overview */}
            <div className="space-y-4 font-mono text-xs">
              
              {/* Spec Type */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">01/ Vehicle Structure</span>
                <div className="flex items-center space-x-2 text-white">
                  <Car className="h-4 w-4 text-accent-orange shrink-0" />
                  <span className="font-medium capitalize text-zinc-300">
                    {vehicleMake.trim() !== '' || vehicleModel.trim() !== '' 
                      ? `${vehicleMake} ${vehicleModel}` 
                      : 'No Vehicle Configured'}
                  </span>
                </div>
                {vehicleType && (
                  <span className="block text-[10px] text-zinc-500 italic uppercase">
                    Class Priority: {vehicleType} Spec
                  </span>
                )}
              </div>

              {/* Service Spec */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">02/ Calibration Class</span>
                <div className="flex items-center space-x-2 text-white">
                  <Settings className="h-4 w-4 text-accent-orange shrink-0" />
                  <span className="font-medium text-zinc-300">
                    {selectedService ? selectedService.name : 'None Selected'}
                  </span>
                </div>
              </div>

              {/* Estimated Periodicity */}
              {selectedService && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-900/60 font-mono text-zinc-400 text-[11px]">
                  <div>
                    <span className="block text-[9px] text-zinc-600 uppercase">Service Time</span>
                    <span className="font-medium text-zinc-300">{selectedService.duration}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-600 uppercase">Category Code</span>
                    <span className="font-medium text-zinc-300 uppercase">{selectedService.category}</span>
                  </div>
                </div>
              )}

              {/* Date Block */}
              <div className="space-y-1 pt-2 border-t border-neutral-900/60">
                <span className="text-[10px] text-zinc-500 uppercase">03/ Time Sync Block</span>
                <div className="flex items-center justify-between text-zinc-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-accent-orange shrink-0" />
                    <span>{selectedDate ? selectedDate : 'YYYY-MM-DD'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-neutral-950 p-1.5 rounded-md border border-neutral-900">
                    <Clock className="h-3 w-3 text-accent-orange" />
                    <span>{selectedTime ? selectedTime : '00:00 AM'}</span>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown summary */}
              <div className="pt-4 border-t-2 border-dashed border-neutral-900 text-zinc-400 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>Pre-Analysis Diagnostic</span>
                  <span className="text-white font-semibold">Included</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Estimated Base Fee</span>
                  <span className="text-white font-semibold">${selectedService ? selectedService.estimatePrice : 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Bay Clean-room Allocation</span>
                  <span className="text-emerald-400 font-mono">FREE</span>
                </div>

                <div className="pt-3 border-t border-neutral-900 flex justify-between items-end">
                  <div className="font-display">
                    <span className="block text-[10px] text-zinc-500 uppercase font-mono">DUE UPON RETRIEVAL</span>
                    <span className="text-xl font-bold text-white font-display">
                      ${selectedService ? selectedService.estimatePrice : 0}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase pb-1 leading-none tracking-tight">TAXES INCLUDED</span>
                </div>
              </div>
            </div>

            {/* Quality Pledge box */}
            <div className="rounded-xl border border-neutral-900 bg-neutral-950/60 p-4 space-y-2 text-[11px] text-zinc-500 font-sans">
              <div className="flex items-center space-x-2 text-zinc-300 font-mono text-[10px] uppercase font-bold">
                <ShieldCheck className="h-4 w-4 text-accent-orange" />
                <span>Certified APEX Integrity</span>
              </div>
              <p className="leading-relaxed font-light">
                All ECU alterations are dyno-validated. Standard fluid upgrades utilize premium endurance lubricants (Motul, LiquidMoly, or Porsche Genuine). Full telemetry records stored under your local ID.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
