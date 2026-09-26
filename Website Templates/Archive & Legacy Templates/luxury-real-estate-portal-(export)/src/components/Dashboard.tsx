/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Property, Inquiry, UserRole, UserProfile } from '../types';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  TrendingUp,
  LayoutDashboard,
  UserCheck,
  FolderDot,
  Plus,
  Compass,
  DollarSign,
  Briefcase,
  Layers,
  Inbox,
  Sparkles,
  Link2,
  CalendarCheck
} from 'lucide-react';

interface DashboardProps {
  properties: Property[];
  inquiries: Inquiry[];
  activeUserProfile: UserProfile | null;
  activeUserId: string;
  activeUserRole: UserRole;
  isFirebaseConnected: boolean;
  onSwitchRole: (role: UserRole) => void;
  onCreateProperty: (prop: Partial<Property>) => Promise<void>;
  onUpdateInquiryStatus: (id: string, status: 'new' | 'in_progress' | 'contacted' | 'closed') => Promise<void>;
  onConnectGoogleAuth: () => void;
  onSignOut: () => void;
  appointmentsCount: number;
  maintenanceRequestsCount: number;
}

export function Dashboard({
  properties,
  inquiries,
  activeUserProfile,
  activeUserId,
  activeUserRole,
  isFirebaseConnected,
  onSwitchRole,
  onCreateProperty,
  onUpdateInquiryStatus,
  onConnectGoogleAuth,
  onSignOut,
  appointmentsCount,
  maintenanceRequestsCount
}: DashboardProps) {
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Property Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sqft, setSqft] = useState('');
  const [image, setImage] = useState('');
  const [amenitiesText, setAmenitiesText] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');

  // Local Toast Helper
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAIGenerate = async () => {
    if (!title && !location) {
      triggerToast("Please provide at least a Title or Location first.");
      return;
    }
    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/gemini/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          location,
          price,
          bedrooms,
          bathrooms,
          sqft,
          userPrompt: aiCustomPrompt
        })
      });
      const data = await response.json();
      if (data.success) {
        setDescription(data.description || '');
        if (data.suggestedAmenities && Array.isArray(data.suggestedAmenities)) {
          setAmenitiesText(data.suggestedAmenities.join(", "));
        }
        triggerToast("AI copy and structural specifications populated!");
      } else {
        triggerToast(data.error || "Failed to generate luxury asset parameters.");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Unable to connect to Obsidian AI Copywriting services.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Math Metrics
  const calculatedTotalAUM = properties.reduce((accum, curr) => accum + curr.price, 0);
  const activeInquiriesCount = inquiries.filter(i => i.status !== 'closed').length;

  const handlePropertySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !price || !location) return;

    try {
      const amenitiesList = amenitiesText
        ? amenitiesText.split(',').map(a => a.trim()).filter(Boolean)
        : ['Smart Glazing', 'Concrete Facade'];

      const imageArray = image
        ? [image]
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'];

      await onCreateProperty({
        title,
        description: description || "No detailed description provided yet.",
        price: Number(price),
        location,
        bedrooms: Number(bedrooms) || 3,
        bathrooms: Number(bathrooms) || 2.5,
        sqft: Number(sqft) || 3500,
        images: imageArray,
        status: 'available',
        amenities: amenitiesList,
        brokerId: activeUserId,
      });

      triggerToast("Bespoke architectural property appended successfully!");
      setShowAddProperty(false);
      
      // Clear fields
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setBedrooms('');
      setBathrooms('');
      setSqft('');
      setImage('');
      setAmenitiesText('');
    } catch (err) {
      triggerToast("Unable to write listing. Ensure Firebase authentication is configured.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="dashboard-system-root">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#161411] border border-gold-500/30 text-[#E5D3B3] text-xs font-mono tracking-wider px-5 py-3 rounded-md shadow-2xl flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Developer Sandbox & Identity Panel */}
      <section className="bg-[#0A0A0A] border border-neutral-900 rounded-lg p-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#E5D3B3] bg-[#221C14] px-2.5 py-1 rounded-sm border border-gold-500/10">
                Live Storefront Demo Box
              </span>
              <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono uppercase px-2 py-0.5 rounded-sm border ${
                isFirebaseConnected 
                  ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
                  : 'bg-amber-950/20 border-amber-900/30 text-amber-500'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {isFirebaseConnected ? 'Firebase Active' : 'Offline Mode'}
              </span>
            </div>
            <h3 className="font-display text-lg font-light text-white mt-2">
              Corporate Sandbox Personas
            </h3>
            <p className="text-xs text-neutral-500 font-sans mt-1 max-w-xl leading-relaxed">
              Tweak roles in the sandbox to evaluate how the database rules filter views. Select Broker to create listings and process client inquires, or Client to schedule showings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Persona Switcher Buttons */}
            <div className="flex items-center gap-1.5 bg-[#050505] border border-neutral-800 p-1 rounded-md">
              <button
                onClick={() => onSwitchRole('client')}
                className={`px-3 py-1.5 rounded text-[10px] uppercase font-mono tracking-wider transition-all duration-300 ${
                  activeUserRole === 'client'
                    ? 'bg-[#1C1812] text-[#E5D3B3] border border-gold-500/20'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
                id="sandbox-client-btn"
              >
                Resident User
              </button>
              <button
                onClick={() => onSwitchRole('broker')}
                className={`px-3 py-1.5 rounded text-[10px] uppercase font-mono tracking-wider transition-all duration-300 ${
                  activeUserRole === 'broker'
                    ? 'bg-[#1C1812] text-[#E5D3B3] border border-gold-500/20'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
                id="sandbox-broker-btn"
              >
                Elite Broker
              </button>
            </div>

            {/* Live Database Authentication trigger */}
            {!auth.currentUser ? (
              <button
                onClick={onConnectGoogleAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#15130F] hover:bg-[#201C15] text-gold-400 hover:text-gold-200 border border-gold-500/20 rounded-md text-[10px] font-mono uppercase tracking-wider transition-colors duration-200"
                id="connect-google-auth-btn"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Connect Firebase</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-neutral-950 px-3.5 py-1.5 border border-neutral-800 rounded-md">
                <span className="font-mono text-[9px] text-neutral-400 capitalize truncate max-w-44">
                  👤 {activeUserProfile?.name || auth.currentUser.email}
                </span>
                <button
                  onClick={onSignOut}
                  className="font-mono text-[9px] text-neutral-500 hover:text-red-400 uppercase tracking-widest pl-2 border-l border-neutral-800"
                  id="google-user-signout"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Micro Asset-Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" id="metrics-panel">
        
        <div className="bg-[#080808] border border-neutral-900 rounded-md p-6 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest">
              Total Managed Assets
            </span>
            <DollarSign className="w-4 h-4 text-gold-400" />
          </div>
          <span className="font-display text-2xl font-light text-white block">
            {(calculatedTotalAUM / 1000000).toFixed(2)}M USD
          </span>
          <div className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider block">
            Across {properties.length} Custom Sites
          </div>
        </div>

        <div className="bg-[#080808] border border-neutral-900 rounded-md p-6 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest">
              Consultation Load
            </span>
            <CalendarCheck className="w-4 h-4 text-gold-400" />
          </div>
          <span className="font-display text-2xl font-light text-white block">
            {appointmentsCount} Meetings
          </span>
          <div className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider block">
            Active Scheduling Queues
          </div>
        </div>

        <div className="bg-[#080808] border border-neutral-900 rounded-md p-6 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest">
              Open Leases / Inquiries
            </span>
            <Inbox className="w-4 h-4 text-gold-400" />
          </div>
          <span className="font-display text-2xl font-light text-white block">
            {activeInquiriesCount} Leads
          </span>
          <div className="font-mono text-[9px] text-[#E5D3B3] uppercase tracking-wider font-semibold block">
            {inquiries.length - activeInquiriesCount} Closed Deals
          </div>
        </div>

        <div className="bg-[#080808] border border-neutral-900 rounded-md p-6 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest">
              Site Dispatches Filed
            </span>
            <Layers className="w-4 h-4 text-gold-400" />
          </div>
          <span className="font-display text-2xl font-light text-white block">
            {maintenanceRequestsCount} Tickets
          </span>
          <div className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider block">
            Geothermal / Tech Repairs
          </div>
        </div>

      </section>

      {/* 3. Operational Inbound Leads & System Tools */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Properties control, add property admin tools */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header for property registry status */}
          <div className="bg-[#080808] border border-neutral-900 rounded-lg p-6">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-6">
              <div className="text-left">
                <h4 className="font-display text-base font-medium text-white">Estates Registry Directory</h4>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">Physical land plots currently tracked in database.</p>
              </div>
              
              {activeUserRole === 'broker' && (
                <button
                  onClick={() => setShowAddProperty(!showAddProperty)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#15130F] hover:bg-[#221E14] text-[#E5D3B3] text-xs font-mono uppercase tracking-widest border border-gold-500/20 rounded-md transition-all duration-300"
                  id="top-toggle-add-property"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Asset</span>
                </button>
              )}
            </div>

            {/* Animated Inline Form */}
            {showAddProperty && activeUserRole === 'broker' && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-[#050505] border border-neutral-900 rounded-md p-5 mb-8 space-y-4 text-left"
                onSubmit={handlePropertySubmit}
                id="add-property-form"
              >
                <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                  <span className="font-mono text-[10px] text-gold-400 uppercase tracking-widest">
                    Register New Luxury Asset
                  </span>
                  <button type="button" onClick={() => setShowAddProperty(false)} className="text-neutral-500 hover:text-white">
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Estate Title</label>
                    <input
                      type="text"
                      placeholder="The Onyx Pavilion"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 text-xs text-neutral-300 py-1.5 px-3 rounded-md focus:outline-none focus:border-gold-500/30"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Price in USD</label>
                    <input
                      type="number"
                      placeholder="e.g. 5200000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 text-xs text-neutral-300 py-1.5 px-3 rounded-md focus:outline-none focus:border-gold-500/30"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Geographic Location</label>
                    <input
                      type="text"
                      placeholder="Sedona, Arizona"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 text-xs text-neutral-300 py-1.5 px-3 rounded-md focus:outline-none focus:border-gold-500/30"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">High-res Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 text-xs text-neutral-300 py-1.5 px-3 rounded-md focus:outline-none focus:border-gold-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Bedrooms</label>
                    <input
                      type="number"
                      value={bedrooms}
                      placeholder="4"
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 text-xs text-neutral-300 py-1.5 px-3 rounded-md focus:outline-none focus:border-gold-500/30"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Bathrooms</label>
                    <input
                      type="number"
                      step="0.5"
                      value={bathrooms}
                      placeholder="3.5"
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 text-xs text-neutral-300 py-1.5 px-3 rounded-md focus:outline-none focus:border-gold-500/30"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Square Footage</label>
                    <input
                      type="number"
                      value={sqft}
                      placeholder="5400"
                      onChange={(e) => setSqft(e.target.value)}
                      className="bg-[#0D0D0D] border border-neutral-800 text-xs text-neutral-300 py-1.5 px-3 rounded-md focus:outline-none focus:border-gold-500/30"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Exclusive Amenities</label>
                  <input
                    type="text"
                    placeholder="Private Onsen, Heliport Pad, Vault Room, Biometric Access"
                    value={amenitiesText}
                    onChange={(e) => setAmenitiesText(e.target.value)}
                    className="bg-[#0D0D0D] border border-neutral-800 text-xs text-neutral-300 py-2 px-3 rounded-md focus:outline-none focus:border-gold-500/30"
                  />
                  <span className="text-[10px] text-neutral-600 block mt-0.5">Separate with commas. Empty defaults to elite architectural indicators.</span>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Architectural Write-up</label>
                  <textarea
                    placeholder="Brutalist concrete monolithic structures..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="bg-[#0D0D0D] border border-neutral-800 text-xs text-neutral-300 py-1.5 px-3 rounded-md focus:outline-none focus:border-gold-500/30"
                  />
                </div>

                {/* Elite Gemini AI Architect Copywriter */}
                <div className="bg-[#120F0B] border border-gold-500/20 rounded-md p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                    <span className="font-mono text-[9px] text-[#E5D3B3] uppercase tracking-widest font-semibold flex-1">
                      Gemini Portfolio Copywriter & Pricing Intelligence
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                    Auto-synthesizes high-end, brutalist architectural descriptions and selects 5 exclusive amenities using Gemini models. Fill in the Title, Price, or Location above first.
                  </p>
                  
                  <div className="flex flex-col md:flex-row gap-2 items-end">
                    <div className="flex-1 flex flex-col space-y-1 w-full">
                      <label className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Custom Style Tone (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. glass pavilion, raw granite slab, desert modernist"
                        value={aiCustomPrompt}
                        onChange={(e) => setAiCustomPrompt(e.target.value)}
                        className="bg-[#050505] border border-neutral-900 text-[10px] text-neutral-300 py-1 px-2.5 rounded-sm focus:outline-none focus:border-gold-500/35"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAIGenerate}
                      disabled={isGeneratingAI}
                      className="px-4 py-1.5 bg-[#251E14] hover:bg-[#32281A] text-[#E5D3B3] text-[10px] font-mono uppercase tracking-wider rounded-md border border-gold-500/20 disabled:opacity-50 transition-all shrink-0 cursor-pointer w-full md:w-auto"
                    >
                      {isGeneratingAI ? "AUTO-GENERATING..." : "OPTIMIZE COPY WITH AI"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 bg-gold-400 hover:bg-gold-500 text-black font-display font-medium text-xs uppercase tracking-widest rounded-md transition-colors"
                >
                  Write to Firestore Database
                </button>
              </motion.form>
            )}

            {/* Tiny list representation of land assets */}
            <div className="divide-y divide-neutral-900 border border-neutral-900 rounded-sm overflow-hidden">
              {properties.map((p) => (
                <div key={p.id} className="flex justify-between items-center p-3.5 bg-[#050505]/40 hover:bg-[#090909] text-left transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-8 object-cover rounded-sm grayscale border border-neutral-900"
                    />
                    <div>
                      <span className="font-display text-sm font-normal text-white">{p.title}</span>
                      <span className="font-sans text-[11px] text-neutral-500 block mt-0.5 leading-none">
                        📍 {p.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0">
                    <span className="font-mono text-sm text-[#E5D3B3] leading-none">
                      ${(p.price / 1000000).toFixed(2)}M
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-600 mt-1 leading-none">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Inquiries/Inbound Leads (Confidential CRM) */}
        <div className="lg:col-span-4 bg-[#080808] border border-neutral-900 rounded-lg p-6 space-y-6">
          <div className="text-left">
            <h4 className="font-display text-base font-medium text-white flex items-center gap-2">
              <Inbox className="w-4 h-4 text-gold-400" /> Confid-CRM (Leads Panel)
            </h4>
            <p className="text-xs text-neutral-500 font-sans mt-0.5">
              Secure buyer interest logs.
            </p>
          </div>

          <div className="space-y-4">
            {inquiries.length > 0 ? (
              inquiries.map((inq) => {
                const targetProp = properties.find(p => p.id === inq.propertyId);
                return (
                  <div key={inq.id} className="bg-[#050505]/85 border border-neutral-900 p-4 rounded-md space-y-3 hover:border-neutral-800 transition-colors text-left">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="font-display font-medium text-xs text-[#E5D3B3] block">
                          {inq.senderName}
                        </span>
                        <span className="font-mono text-[9px] text-neutral-500 block mt-0.5">
                          {inq.senderEmail}
                        </span>
                      </div>
                      <span className={`font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                        inq.status === 'new' ? 'bg-red-950/20 border-red-900/30 text-red-400' :
                        inq.status === 'in_progress' ? 'bg-amber-950/20 border-amber-900/40 text-amber-500' :
                        'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                      }`}>
                        {inq.status}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-neutral-900/60 pb-1">
                      <span className="font-mono text-[8px] uppercase text-neutral-600 block tracking-wider leading-none">
                        Topic Asset:
                      </span>
                      <span className="text-[11px] font-sans text-neutral-300 font-normal leading-normal mt-1 block">
                        {targetProp?.title || 'Exclusive Plot Link'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 italic bg-neutral-950 p-2.5 rounded-sm border border-neutral-950 leading-relaxed font-light">
                      "{inq.message}"
                    </p>

                    {/* Broker Status Update */}
                    {activeUserRole === 'broker' && (
                      <div className="flex justify-between items-center items-end pt-1">
                        <span className="text-[9px] text-neutral-600 uppercase font-mono tracking-widest">
                          CRM Status
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => onUpdateInquiryStatus(inq.id, 'in_progress')}
                            className="text-[9px] font-mono px-2 py-1 bg-neutral-900 text-neutral-400 hover:text-white rounded-sm border border-neutral-800"
                          >
                            Engage
                          </button>
                          <button
                            onClick={() => onUpdateInquiryStatus(inq.id, 'closed')}
                            className="text-[9px] font-mono px-2 py-1 bg-emerald-950/20 text-emerald-400 rounded-sm border border-emerald-950"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 border border-dashed border-neutral-900 bg-[#050505] rounded-md text-neutral-500 text-xs">
                No database leads gathered yet. Perform a client inquiry to see dynamic records.
              </div>
            )}
          </div>
        </div>

      </section>

    </div>
  );
}
