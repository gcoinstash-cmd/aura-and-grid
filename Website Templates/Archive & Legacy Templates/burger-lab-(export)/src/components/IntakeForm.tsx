/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Calendar, MapPin, DollarSign, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeConfig } from '../types';

interface IntakeFormProps {
  currentTheme: ThemeConfig;
  accentColor: string;
}

export default function IntakeForm({ currentTheme, accentColor }: IntakeFormProps) {
  const [formData, setFormData] = useState({
    brandName: '',
    email: '',
    package: 'custom-web',
    locations: 'single',
    timeframe: '30-days',
    aspirations: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName || !formData.email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className={`p-6 rounded-lg border ${currentTheme.borderColor} ${currentTheme.cardBg} transition-all duration-300 min-h-[450px] flex flex-col justify-center overflow-hidden`}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form 
            key="consultation-form"
            onSubmit={handleSubmit} 
            className="space-y-4" 
            id="consultation-form"
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Bespoke Design Inquiry
              </span>
            </div>

            <p className="text-sm font-sans mb-3 text-zinc-500">
              Inquire about a tailored, responsive custom website. Our typical design and launch timeframe is two to three weeks.
            </p>

            <div className="space-y-3">
              {/* Brand Name */}
              <div className="relative pt-4">
                <input
                  type="text"
                  required
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder=" "
                  className={`peer w-full text-xs py-2 bg-transparent border-b border-zinc-500/30 focus:border-zinc-300 focus:outline-none transition-colors duration-300 ${currentTheme.textColor}`}
                  id="form-brandName"
                />
                <label
                  htmlFor="form-brandName"
                  className="absolute left-0 top-6 text-[10px] font-mono uppercase tracking-wider text-zinc-500 transition-all duration-300 ease-in-out pointer-events-none origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4.5 peer-focus:scale-85 peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:-translate-y-4.5 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-neutral-400"
                >
                  Restaurant / Brand Name *
                </label>
              </div>

              {/* Email */}
              <div className="relative pt-4">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder=" "
                  className={`peer w-full text-xs py-2 bg-transparent border-b border-zinc-500/30 focus:border-zinc-300 focus:outline-none transition-colors duration-300 ${currentTheme.textColor}`}
                  id="form-email"
                />
                <label
                  htmlFor="form-email"
                  className="absolute left-0 top-6 text-[10px] font-mono uppercase tracking-wider text-zinc-500 transition-all duration-300 ease-in-out pointer-events-none origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4.5 peer-focus:scale-85 peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:-translate-y-4.5 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-neutral-400"
                >
                  Contact Email Address *
                </label>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Package Select */}
                <div className="relative pt-4">
                  <label className="absolute left-0 top-1.5 text-[9px] font-mono uppercase tracking-wider text-zinc-500">
                    Proposed Scope
                  </label>
                  <div className="relative">
                    <select
                      value={formData.package}
                      onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                      className={`w-full text-xs py-2 bg-transparent border-b border-zinc-500/30 focus:border-zinc-300 focus:outline-none appearance-none transition-colors duration-300 ${currentTheme.textColor}`}
                    >
                      <option value="custom-web" className="bg-zinc-950 text-white">Web Build ($3.5k–$4.5k)</option>
                      <option value="full-scope" className="bg-zinc-950 text-white">Identity & SEO ($4.5k–$6.5k)</option>
                      <option value="enterprise" className="bg-zinc-950 text-white">Multi-Unit Enterprise (Quote)</option>
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <line x1="6" y1="9" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" />
                        <line x1="12" y1="15" x2="18" y2="9" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Location Select */}
                <div className="relative pt-4">
                  <label className="absolute left-0 top-1.5 text-[9px] font-mono uppercase tracking-wider text-zinc-500">
                    Unit Footprint
                  </label>
                  <div className="relative">
                    <select
                      value={formData.locations}
                      onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                      className={`w-full text-xs py-2 bg-transparent border-b border-zinc-500/30 focus:border-zinc-300 focus:outline-none appearance-none transition-colors duration-300 ${currentTheme.textColor}`}
                    >
                      <option value="single" className="bg-zinc-950 text-white">Single Location</option>
                      <option value="multi" className="bg-zinc-950 text-white">2 - 5 locations</option>
                      <option value="ghost" className="bg-zinc-950 text-white">Ghost Kitchen Network</option>
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <line x1="6" y1="9" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" />
                        <line x1="12" y1="15" x2="18" y2="9" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Launch Timeframe */}
              <div className="relative pt-4">
                <label className="absolute left-0 top-1.5 text-[9px] font-mono uppercase tracking-wider text-zinc-500">
                  Goal Launch Target
                </label>
                <div className="relative">
                  <select
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    className={`w-full text-xs py-2 bg-transparent border-b border-zinc-500/30 focus:border-zinc-300 focus:outline-none appearance-none transition-colors duration-300 ${currentTheme.textColor}`}
                  >
                    <option value="asap" className="bg-zinc-950 text-white">ASAP (Extremely urgent)</option>
                    <option value="30-days" className="bg-zinc-950 text-white">Under 30 Days</option>
                    <option value="60-days" className="bg-zinc-950 text-white">Under 60 Days</option>
                    <option value="future" className="bg-zinc-950 text-white">Looking ahead in 2026</option>
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <line x1="6" y1="9" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" />
                      <line x1="12" y1="15" x2="18" y2="9" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Aspirations */}
              <div className="relative pt-4">
                <textarea
                  rows={2}
                  value={formData.aspirations}
                  onChange={(e) => setFormData({ ...formData, aspirations: e.target.value })}
                  placeholder=" "
                  className={`peer w-full text-xs py-2 bg-transparent border-b border-zinc-500/30 focus:border-zinc-300 focus:outline-none transition-colors duration-300 resize-none ${currentTheme.textColor}`}
                  id="form-aspirations"
                />
                <label
                  htmlFor="form-aspirations"
                  className="absolute left-0 top-6 text-[10px] font-mono uppercase tracking-wider text-zinc-500 transition-all duration-300 ease-in-out pointer-events-none origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4.5 peer-focus:scale-85 peer-focus:text-neutral-400 peer-[:not(:placeholder-shown)]:-translate-y-4.5 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-neutral-400"
                >
                  Brand Vision & Aspirations (Optional)
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-2 hover:opacity-90 font-bold`}
              style={{ backgroundColor: accentColor, color: '#000000' }}
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  sending inquiry...
                </span>
              ) : (
                <>
                  Send Design Inquiry
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div 
            key="consultation-success"
            className="py-6 text-center space-y-4" 
            id="consultation-success"
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2" style={{ backgroundColor: `${accentColor}15` }}>
              <CheckCircle className="w-6 h-6" style={{ color: accentColor }} />
            </div>
            <h4 className="text-sm font-mono uppercase tracking-widest font-bold text-emerald-400">Inquiry Transmitted ✓</h4>
            <p className="text-xs opacity-80 max-w-sm mx-auto leading-relaxed">
              Details received for <strong className="font-mono">{formData.brandName}</strong>. Our creative design partner will review your requested scope and unit footprint, then reach out to you within 4 hours.
            </p>
            <div className="p-3 rounded border text-left text-[11px] font-mono space-y-1 opacity-90 mx-auto max-w-sm" style={{ borderColor: `${accentColor}40` }}>
              <div className="flex justify-between"><span>TICKET ID:</span> <span className="font-bold text-white">AG-2026-{(Math.random() * 10000).toFixed(0)}</span></div>
              <div className="flex justify-between"><span>CONTACT:</span> <span className="text-white">{formData.email}</span></div>
              <div className="flex justify-between"><span>TIER BASE:</span> <span className="text-white">{formData.package === 'custom-web' ? '$3,500' : formData.package === 'full-scope' ? '$4,500' : 'Custom'}</span></div>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs underline cursor-pointer hover:opacity-100 font-mono block mx-auto mt-2"
              style={{ color: accentColor }}
            >
              Submit another inquiry request
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
