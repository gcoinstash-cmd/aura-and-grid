import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, ChefHat, Check, Trash2, ShieldCheck, Mail, Database } from 'lucide-react';
import { CateringInquirySubmission } from '../types';

export default function CateringInquiry() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    groupSize: 12,
    neighborhood: 'View Park',
    cateringScope: 'Full On-Site Kitchen Takeover' as const,
    notes: '',
  });

  const [inquiries, setInquiries] = useState<CateringInquirySubmission[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [successSent, setSuccessSent] = useState(false);
  const [showAdminLogs, setShowAdminLogs] = useState(false);

  // Load any existing test submissions from localStorage
  useEffect(() => {
    const cached = localStorage.getItem('aura_catering_inquiries');
    if (cached) {
      try {
        setInquiries(JSON.parse(cached));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.eventDate) {
      alert('Kindly fill in all the primary parameters.');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      const newSubmission: CateringInquirySubmission = {
        id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        eventDate: formData.eventDate,
        groupSize: formData.groupSize,
        neighborhood: formData.neighborhood,
        cateringScope: formData.cateringScope,
        customRequestNotes: formData.notes,
        createdTime: new Date().toLocaleDateString(),
      };

      const updated = [newSubmission, ...inquiries];
      setInquiries(updated);
      localStorage.setItem('aura_catering_inquiries', JSON.stringify(updated));

      setIsSending(false);
      setSuccessSent(true);

      // Reset form variables
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        groupSize: 12,
        neighborhood: 'View Park',
        cateringScope: 'Full On-Site Kitchen Takeover',
        notes: '',
      });
    }, 1200);
  };

  const clearInquiry = (id: string) => {
    const filtered = inquiries.filter((inq) => inq.id !== id);
    setInquiries(filtered);
    localStorage.setItem('aura_catering_inquiries', JSON.stringify(filtered));
  };

  return (
    <div id="private-catering-section" className="space-y-12">
      
      {/* Dynamic Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column Text */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal border border-white/10">
            <ChefHat className="w-3.5 h-3.5 text-terracotta" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-gold font-bold">Private Communes</span>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl text-white font-medium tracking-tight">
            Curate An Exclusive Dynamic Experience
          </h2>
          <div className="w-12 h-px bg-terracotta mt-2" />
          <p className="text-sm text-stone-400 font-sans font-light leading-relaxed">
            Bring the high-octane luxury and culinary theater of Aura to your estate, loft, or country club. We handle full kitchen takeovers, table dressings, and vinyl acoustics designed exclusively to feed your legacy.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex gap-3 text-xs">
              <div className="w-5 h-5 rounded-full bg-stone-900 border border-gold/40 flex items-center justify-center font-mono text-[10px] text-gold font-bold flex-shrink-0">
                1
              </div>
              <p className="text-stone-300">
                <strong className="text-white">Bespoke Curation Menu:</strong> Tailor foodways, course sequences, and physical fire pit requirements.
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="w-5 h-5 rounded-full bg-stone-900 border border-gold/40 flex items-center justify-center font-mono text-[10px] text-gold font-bold flex-shrink-0">
                2
              </div>
              <p className="text-stone-300">
                <strong className="text-white">Audiophile Sync:</strong> Customized vinyl programs suited to your crowd profile.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Form Box */}
        <div className="lg:col-span-7 bg-charcoal border border-white/10 rounded-2xl p-6 relative">
          
          <AnimatePresence mode="wait">
            {!successSent ? (
              <motion.form 
                key="catering-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleFormSubmit} 
                className="space-y-4"
              >
                
                <h3 className="font-serif text-xl font-medium text-stone-200 mb-2 border-b border-white/5 pb-2">
                  Request Dining Handtakeover
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label htmlFor="inquiry_name" className="text-[10px] font-mono uppercase text-stone-400">Full Name</label>
                    <input
                      id="inquiry_name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Coleman Baldwin"
                      className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold placeholder-stone-700"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="inquiry_email" className="text-[10px] font-mono uppercase text-stone-400">Email Address</label>
                    <input
                      id="inquiry_email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="e.g., coleman@viewpark.com"
                      className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold placeholder-stone-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label htmlFor="inquiry_phone" className="text-[10px] font-mono uppercase text-stone-400">Phone</label>
                    <input
                      id="inquiry_phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="e.g., (323) 555-1970"
                      className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold placeholder-stone-700"
                    />
                  </div>

                  {/* Event Date */}
                  <div className="space-y-1">
                    <label htmlFor="inquiry_date" className="text-[10px] font-mono uppercase text-stone-400">Preferred Date</label>
                    <input
                      id="inquiry_date"
                      type="date"
                      required
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange('eventDate', e.target.value)}
                      className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-gold"
                    />
                  </div>

                  {/* Group Size */}
                  <div className="space-y-1">
                    <label htmlFor="inquiry_group" className="text-[10px] font-mono uppercase text-stone-400">Target Group Size</label>
                    <input
                      id="inquiry_group"
                      type="number"
                      min="8"
                      max="150"
                      required
                      value={formData.groupSize}
                      onChange={(e) => handleInputChange('groupSize', Number(e.target.value))}
                      className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Target Neighborhood */}
                  <div className="space-y-1">
                    <label htmlFor="inquiry_neighborhood" className="text-[10px] font-mono uppercase text-stone-400">South LA Neighborhood Focus</label>
                    <select
                      id="inquiry_neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-stone-400 focus:outline-none focus:border-gold cursor-pointer"
                    >
                      <option value="View Park">View Park / Windsor Hills</option>
                      <option value="Baldwin Hills">Baldwin Hills Estates</option>
                      <option value="Leimert Park">Leimert Park Parlors</option>
                      <option value="Ladera Heights">Ladera Heights Mansions</option>
                      <option value="Other Los Angeles Area">Other Premium Area</option>
                    </select>
                  </div>

                  {/* Scope scheme */}
                  <div className="space-y-1">
                    <label htmlFor="inquiry_scope" className="text-[10px] font-mono uppercase text-stone-400">Inquiry Scope Scheme</label>
                    <select
                      id="inquiry_scope"
                      value={formData.cateringScope}
                      onChange={(e) => handleInputChange('cateringScope', e.target.value)}
                      className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-stone-400 focus:outline-none focus:border-gold cursor-pointer"
                    >
                      <option value="Full On-Site Kitchen Takeover">Full On-Site Kitchen Takeover</option>
                      <option value="Bespoke Curated Drop-off">Bespoke Curated Drop-off</option>
                      <option value="Vinyl Sound & Food Sync">Vinyl Sound & Food Sync (Acoustic Match)</option>
                    </select>
                  </div>
                </div>

                {/* notes */}
                <div className="space-y-1">
                  <label htmlFor="inquiry_notes" className="text-[10px] font-mono uppercase text-stone-400">Special Alchemy Requests (Optional)</label>
                  <textarea
                    id="inquiry_notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Describe culinary theme restrictions, preferred vinyl genres, or landscape requirements..."
                    className="w-full h-24 bg-stone-950 border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-gold placeholder-stone-700 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 cursor-pointer bg-terracotta hover:bg-terracotta-hover text-white font-mono text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-terracotta/10"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting Inquiry Dossier...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Custom Dossier</span>
                    </>
                  )}
                </button>

              </motion.form>
            ) : (
              <motion.div
                key="catering-thankyou"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold text-gold mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3px]" />
                </div>
                <h4 className="font-serif text-2xl text-stone-100 font-medium">Catering Inquiry Received</h4>
                <p className="text-xs text-stone-400 max-w-sm mx-auto font-sans">
                  The executive culinary council will review your parameters of event date and community profile. Expect custom proposals in your digital inbox inside 24 hours.
                </p>
                <button
                  onClick={() => setSuccessSent(false)}
                  className="px-4 py-2 border border-white/10 text-stone-300 hover:text-white rounded-lg text-xs font-mono tracking-widest uppercase transition-all cursor-pointer"
                >
                  Submit Another Scope
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ADMIN LEAD PREVIEW PANEL (Unbelievably good value for templates!) */}
      <div className="border border-white/5 rounded-xl bg-stone-950/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-stone-500" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400 font-bold">Buyer Template Utility</span>
          </div>
          <button
            onClick={() => setShowAdminLogs(!showAdminLogs)}
            className="font-mono text-[8.5px] uppercase underline text-gold hover:text-gold-hover focus:outline-none cursor-pointer"
          >
            {showAdminLogs ? 'Conceal Back-Office CRM Panel' : 'Audition Simulated Back-Office CRM Panel (Leads Captured)'}
          </button>
        </div>

        <AnimatePresence>
          {showAdminLogs && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="p-3 bg-stone-900 border border-gold/20 rounded-lg flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0" />
                  <p className="text-[10px] text-stone-300 font-sans leading-normal">
                    <strong className="text-white block font-medium">Back-Office Dynamic capture demonstration</strong>
                    Any catering submission dispatched inside this template is cached in your client browser's memory. This panel lets you audition how capturing premium client lists works out-of-the-box.
                  </p>
                </div>

                {inquiries.length > 0 ? (
                  <div className="space-y-2">
                    {inquiries.map((inq) => (
                      <div 
                        key={inq.id} 
                        className="bg-stone-950 rounded-lg p-3 border border-white/5 flex items-start justify-between gap-4 font-mono text-[10px]"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{inq.customerName}</span>
                            <span className="text-stone-500">•</span>
                            <span className="text-gold">{inq.id}</span>
                            <span className="text-stone-500">•</span>
                            <span className="text-stone-400">{inq.neighborhood}</span>
                          </div>
                          
                          <div className="text-[9px] text-stone-400 space-y-0.5">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-stone-500" />
                              <span className="truncate">{inq.customerEmail} | {inq.customerPhone}</span>
                            </div>
                            <div>Date Focus: <span className="text-white">{inq.eventDate}</span> | Size: <span className="text-white">{inq.groupSize} Boarders</span></div>
                            <div>Scope: <span className="text-terracotta font-semibold">{inq.cateringScope}</span></div>
                            {inq.customRequestNotes && (
                              <div className="text-gray-500 italic mt-1 bg-stone-900/60 p-1.5 rounded border border-white/5">
                                "{inq.customRequestNotes}"
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => clearInquiry(inq.id)}
                          className="text-stone-500 hover:text-rose-500 transition-colors p-1"
                          title="Erase captured lead"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-stone-950/60 border border-dashed border-white/5 rounded-lg">
                    <p className="text-[10px] text-stone-500 font-mono">No lead profiles captured yet. Submit the catering request above to view.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
