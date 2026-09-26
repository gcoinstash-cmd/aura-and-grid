import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, CheckCircle2, ShieldCheck, Mail, Calendar, HelpCircle, User, Building, Landmark } from "lucide-react";
import { SITE_COPY } from "../data";

interface InquiryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubmissionType {
  name: string;
  company: string;
  email: string;
  description: string;
  timeline: string;
  budget: string;
}

/**
 * InquiryOverlay Component
 * Renders a full screen luxurious glassmorphic modal overlay containing
 * the advisory brief questionnaire form. Captures answers and stores submissions
 * locally while delivering sensory tactile feedback.
 */
export default function InquiryOverlay({ isOpen, onClose }: InquiryOverlayProps) {
  const [formData, setFormData] = useState<SubmissionType>({
    name: "",
    company: "",
    email: "",
    description: "",
    timeline: "immediate",
    budget: "$25,000 - $50,000",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionCode, setSubmissionCode] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) {
      alert("Please enter Name, Company, and Email to proceed.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      const randCode = "MNL-" + Math.floor(100000 + Math.random() * 900000);
      setSubmissionCode(randCode);

      // Save to localStorage
      const currentSubmissions = JSON.parse(localStorage.getItem("monolith_briefs") || "[]");
      currentSubmissions.push({
        ...formData,
        id: randCode,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("monolith_briefs", JSON.stringify(currentSubmissions));
    }, 1800);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      description: "",
      timeline: "immediate",
      budget: "$25,000 - $50,000",
    });
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="inquiry-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-[#030303]/98 backdrop-blur-lg flex items-center justify-center p-4 md:p-10"
        >
          {/* Outer Minimal Decor Framework */}
          <div className="absolute inset-0 pointer-events-none border-[12px] md:border-[24px] border-[#0a0a0a]"></div>

          <div className="relative w-full max-w-4xl bg-[#070707] border border-neutral-900 rounded-none p-6 md:p-12 z-10">
            
            {/* Close Button top-right */}
            <button
              id="close-overlay"
              onClick={onClose}
              className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors p-2 group"
              aria-label="Close form"
            >
              <X className="w-6 h-6 stroke-[1.5] group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Header Info */}
                <div className="border-b border-neutral-900 pb-6 mb-8">
                  <div className="flex items-center space-x-2 text-brand-gold mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                    <span className="font-mono text-[10px] uppercase tracking-widest font-semibold text-[#8b947c]">
                      {SITE_COPY.overlay.label}
                    </span>
                  </div>
                  
                  <h2
                    id="overlay-headline"
                    className="font-serif text-3xl md:text-4xl text-white font-medium leading-tight"
                  >
                    {SITE_COPY.overlay.headline}
                  </h2>
                  
                  <p
                    id="overlay-subcopy"
                    className="text-neutral-500 font-light text-xs md:text-sm mt-2 max-w-2xl leading-relaxed"
                  >
                    {SITE_COPY.overlay.subcopy}
                  </p>
                </div>

                {/* Form Fields - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Name field */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-neutral-500" />
                      Your Name <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="border border-neutral-900 focus:border-brand-gold bg-[#0a0a0a] text-neutral-200 outline-none p-3.5 text-sm font-light transition-colors"
                    />
                  </div>

                  {/* Company/Organization field */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <Building className="w-3 h-3 text-neutral-500" />
                      Company / Organization <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company or organization"
                      className="border border-neutral-900 focus:border-brand-gold bg-[#0a0a0a] text-neutral-200 outline-none p-3.5 text-sm font-light transition-colors"
                    />
                  </div>

                  {/* Email address field */}
                  <div className="flex flex-col space-y-2 md:col-span-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-neutral-500" />
                      Work Email Address <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@company.com"
                      className="border border-neutral-900 focus:border-brand-gold bg-[#0a0a0a] text-neutral-200 outline-none p-3.5 text-sm font-light transition-colors"
                    />
                  </div>

                  {/* Description field */}
                  <div className="flex flex-col space-y-2 md:col-span-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3 h-3 text-neutral-500" />
                      Brief Description of Strategic Needs
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Specify your objectives, upcoming milestones, narrative goals, or crisis needs..."
                      className="border border-neutral-900 focus:border-brand-gold bg-[#0a0a0a] text-neutral-200 outline-none p-3.5 text-sm font-light transition-colors resize-none"
                    />
                  </div>

                  {/* Timeline field */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      Required Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="border border-neutral-900 focus:border-brand-gold bg-[#0a0a0a] text-neutral-200 outline-none p-3.5 text-sm font-light transition-colors"
                    >
                      <option value="immediate">Immediate Launch or Initiative</option>
                      <option value="30-days">Upcoming Announcement (30-60 Days)</option>
                      <option value="90-days">Long-term Brand Strategy</option>
                      <option value="retainer">Ongoing Retainer Advisory</option>
                    </select>
                  </div>

                  {/* Budget range field */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <Landmark className="w-3 h-3 text-neutral-500" />
                      Budget Allocation Profile
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="border border-neutral-900 focus:border-brand-gold bg-[#0a0a0a] text-neutral-200 outline-none p-3.5 text-sm font-light transition-colors"
                    >
                      <option value="$25,000 - $50,000">$25,000 – $50,000 (Strategic Retainer)</option>
                      <option value="$50,000 - $100,000">$50,000 – $100,000 (Full-Scale Launch Campaign)</option>
                      <option value="$100,000+">$100,000+ (Comprehensive Brand Representation)</option>
                    </select>
                  </div>

                </div>

                {/* Submitting indicator or action CTA */}
                <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                    <span>Inquiries reviewed within one business day</span>
                  </div>

                  <button
                    id="submit-brief-btn"
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full sm:w-auto font-mono text-xs uppercase tracking-widest font-semibold bg-white hover:bg-neutral-200 text-black py-4 px-10 transition-colors flex items-center justify-center space-x-3 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-black border-t-transparent"></span>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            ) : (
              // Success cinematic layout
              <div className="text-center py-12 space-y-8 max-w-xl mx-auto">
                <div className="flex justify-center">
                  <div className="p-4 bg-brand-gold/10 border border-brand-gold/40 rounded-full">
                    <CheckCircle2 className="w-12 h-12 text-brand-gold" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-3xl text-neutral-100 font-medium">
                    {SITE_COPY.overlay.successHeadline}
                  </h3>
                  <p className="text-neutral-400 font-light text-sm mt-3 leading-relaxed">
                    {SITE_COPY.overlay.successSubcopy}
                  </p>
                </div>

                {/* Receipt Info */}
                <div className="bg-[#0a0a0a] border border-neutral-900 p-6 font-mono text-xs space-y-3 text-left">
                  <div className="flex justify-between border-b border-neutral-900 pb-2">
                    <span className="text-neutral-500 font-light">INQUIRY REF</span>
                    <span className="text-brand-gold font-semibold">{submissionCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-900 pb-2">
                    <span className="text-neutral-500 font-light">ENTITY</span>
                    <span className="text-neutral-200">{formData.company.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-light">REPRESENTATIVE</span>
                    <span className="text-neutral-200">{formData.name}</span>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    id="success-dismiss-btn"
                    onClick={handleReset}
                    className="border border-neutral-800 hover:border-neutral-500 text-neutral-300 hover:text-white font-mono text-[11px] uppercase tracking-widest py-3 px-8 transition-colors cursor-pointer"
                  >
                    Return to Site
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
