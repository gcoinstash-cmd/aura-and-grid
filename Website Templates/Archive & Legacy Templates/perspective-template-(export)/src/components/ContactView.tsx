import React, { useState } from 'react';
import { Send, MapPin, Compass, ShieldCheck } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    typology: 'Residential',
    brief: '',
    budget: '$250k - $500k'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-16 py-6" id="contact-inquiry-view">
      
      {/* 1 & 2. Understated contact prompt & commission availability */}
      <div className="relative border border-stone-base bg-white p-8 lg:p-12 space-y-6">
        <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-20" />
        <div className="max-w-3xl relative z-10 space-y-4">
          <span className="text-xs uppercase font-mono tracking-widest text-[#8A7A5B] font-semibold">GET IN TOUCH</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-graphite-dark">Initiate Commission</h1>
          <p className="text-sm md:text-base text-gray-500 font-sans font-light leading-relaxed">
            Our office accepts a limited volume of residential, cultural, and conservation commissions each year. We prioritize projects that appreciate material integrity, contextual response, and clean geometry.
          </p>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="contact-split-flow">
        
        {/* Left Side: Physical details and availability markers */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="border border-stone-base bg-white p-6 space-y-6">
            <h3 className="text-xs uppercase font-mono tracking-widest text-bronze-dark font-bold border-b border-stone-light pb-2">
              Physical Offices
            </h3>
            
            <div className="space-y-6 text-xs text-graphite-light font-sans font-light">
              <div className="space-y-2">
                <span className="font-mono font-semibold block text-graphite-dark flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-bronze-light" />
                  <span>Siena, Italy (Heritage & Masonry Research)</span>
                </span>
                <p className="text-gray-400 pl-5 leading-normal">
                  Vicolo del Sasso, 14, Cortile Medievale <br />
                  Coordinates: 43.3183° N, 11.3314° E <br />
                  siena@perspective-studios.com
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-mono font-semibold block text-graphite-dark flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-bronze-light" />
                  <span>Zürich, Switzerland (Alpine Engineering & CLT Hub)</span>
                </span>
                <p className="text-gray-400 pl-5 leading-normal">
                  Sihlquai 125, Werkstattgebäude C <br />
                  Coordinates: 47.3769° N, 8.5417° E <br />
                  zurich@perspective-studios.com
                </p>
              </div>
            </div>
          </div>

          <div className="border border-stone-base bg-stone-light p-6 space-y-4 font-sans">
            <h3 className="text-xs uppercase font-mono tracking-widest text-graphite-dark font-semibold flex items-center gap-2">
              <Compass className="w-4 h-4 text-bronze-light animate-spin-slow" />
              <span>Commission Status: ACTIVE</span>
            </h3>
            <p className="text-xs text-graphite-light font-light leading-relaxed">
              We are currently accepting preliminary briefs for late 2026/early 2027 ground break schedules. Our technical architects typically issue detailed site grading feasibility models within 14 working days of brief acceptance.
            </p>
          </div>

        </div>

        {/* Right Side: Reactive Brief Form */}
        <div className="lg:col-span-7">
          <div className="border border-stone-base bg-white p-8 relative">
            <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-10" />

            {submitted ? (
              /* Success visual state */
              <div className="text-center py-12 space-y-6 relative z-10" id="submission-success-response">
                <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-300">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl text-graphite-dark">Brief Transmitted Successfully</h3>
                  <span className="block font-mono text-xs text-emerald-600 tracking-widest font-semibold uppercase">SUBMISSION RECEIVED</span>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed pt-2">
                    We have received your brief. Our team will review the details and contact you to discuss feasibility and alignment.
                  </p>
                </div>
                <button
                  id="btn-reset-form"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', location: '', typology: 'Residential', brief: '', budget: '$250k - $500k' });
                  }}
                  className="px-6 py-2.5 border border-stone-base text-xs font-mono uppercase tracking-widest hover:bg-stone-light transition-all rounded-sm"
                >
                  Configure New Inquiry
                </button>
              </div>
            ) : (
              /* Reactive Intake Form fields */
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10" id="inquiry-form">
                <h3 className="text-sm uppercase font-mono tracking-wider font-semibold text-graphite-dark border-b border-stone-light pb-3">
                  Digital Intake Form
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label id="lbl-name" className="block font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                      Client Full Name *
                    </label>
                    <input
                      id="input-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Victoria Sterling"
                      className="w-full px-4 py-2.5 border border-stone-base bg-stone-light/20 text-xs font-sans text-graphite-dark placeholder-gray-300 focus:outline-hidden focus:border-bronze-light transition-colors"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label id="lbl-email" className="block font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                      Intake Email Address *
                    </label>
                    <input
                      id="input-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., sterling@holdings.com"
                      className="w-full px-4 py-2.5 border border-stone-base bg-stone-light/20 text-xs font-sans text-graphite-dark placeholder-gray-300 focus:outline-hidden focus:border-bronze-light transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location field */}
                  <div className="space-y-2">
                    <label id="lbl-location" className="block font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                      Project Site / Coordinates
                    </label>
                    <input
                      id="input-location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Lake Como, Italy"
                      className="w-full px-4 py-2.5 border border-stone-base bg-stone-light/20 text-xs font-sans text-graphite-dark placeholder-gray-300 focus:outline-hidden focus:border-bronze-light transition-colors"
                    />
                  </div>

                  {/* Typology Select */}
                  <div className="space-y-2">
                    <label id="lbl-typology" className="block font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                      Architectural Typology
                    </label>
                    <select
                      id="input-typology"
                      value={formData.typology}
                      onChange={(e) => setFormData({ ...formData, typology: e.target.value })}
                      className="w-full px-4 py-2.5 border border-stone-base bg-stone-light/20 text-xs font-sans text-graphite-dark focus:outline-hidden focus:border-bronze-light transition-colors"
                    >
                      <option>Residential</option>
                      <option>Commercial Atelier</option>
                      <option>Cultural Pavilion</option>
                      <option>Historical Restoration</option>
                    </select>
                  </div>
                </div>

                {/* Estimation Budget slider */}
                <div className="space-y-2">
                  <label id="lbl-budget" className="block font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                    Target Development Investment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['$250k - $500k', '$500k - $1.5M', '$1.5M+'].map((b) => (
                      <button
                        key={b}
                        id={`budget-btn-${b.replace(/[^0-9kM]/g, '')}`}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget: b })}
                        className={`py-2 text-[10px] font-mono border uppercase tracking-wider transition-all ${
                          formData.budget === b
                            ? 'border-graphite-dark bg-graphite-dark text-white'
                            : 'border-stone-base hover:bg-stone-light text-graphite-light'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Descriptive space / brief narrative */}
                <div className="space-y-2">
                  <label id="lbl-brief" className="block font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                    Project Brief & Structural Intent (Max 200 words)
                  </label>
                  <textarea
                    id="input-brief"
                    rows={4}
                    value={formData.brief}
                    onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                    placeholder="Describe the site characteristics, desired materials, and spatial goals..."
                    className="w-full px-4 py-2.5 border border-stone-base bg-stone-light/20 text-xs font-sans text-graphite-dark placeholder-gray-300 focus:outline-hidden focus:border-bronze-light transition-colors resize-none"
                  />
                </div>

                {/* Submission core action */}
                <button
                  id="inquiry-submit-btn"
                  type="submit"
                  className="w-full py-3 bg-graphite-dark text-white hover:bg-bronze-dark transition-colors font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-3 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
