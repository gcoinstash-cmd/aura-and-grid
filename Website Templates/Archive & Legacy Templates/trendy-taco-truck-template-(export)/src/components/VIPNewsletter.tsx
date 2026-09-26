import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Mail, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Bell } from 'lucide-react';

export const VIPNewsletter: React.FC = () => {
  const { addNewsletterSubscriber } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Simulate high-end network response
      await new Promise((resolve) => setTimeout(resolve, 800));
      await addNewsletterSubscriber(email, name);
      setIsSubmitted(true);
      setEmail('');
      setName('');
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="vip-newsletter-form" className="relative w-full rounded-3xl overflow-hidden border border-zinc-850 bg-charcoal/40 backdrop-blur-xl p-8 sm:p-12">
      {/* Editorial subtle grid pattern inside card */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-zinc-900)_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Pitch text (Left 5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agave-950/40 border border-agave-500/20 text-agave-400 text-[10px] font-mono font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            VIP Club Dispatch
          </div>
          
          <div className="space-y-2">
            <h4 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight leading-none">
              Receive the dispatch.
            </h4>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Join our private registry to receive real-time SMS &amp; email alerts for sudden street truck locations, unlisted menu tastings, and seasonal gastronomy events across Southern California.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-zinc-850/60">
            <div className="flex items-center gap-2.5 text-xs text-zinc-500">
              <MapPin className="w-4 h-4 text-agave-500/70" />
              <span>Priority access to secret beach &amp; estate pop-ups</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-500">
              <Bell className="w-4 h-4 text-chipotle-400/70" />
              <span>Zero spam. Only hand-crafted weekly schedules</span>
            </div>
          </div>
        </div>

        {/* Input Form Column (Right 7 Columns) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="subscription-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="newsletter-name" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">
                      YOUR NAME (OPTIONAL)
                    </label>
                    <input
                      id="newsletter-name"
                      type="text"
                      placeholder="e.g. Alexander"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-zinc-950/70 border border-zinc-850 hover:border-zinc-700 focus:border-agave-500 text-sm text-white rounded-xl py-3 px-4 outline-none transition-all placeholder-zinc-600 font-sans"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="newsletter-email" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">
                      EMAIL ADDRESS *
                    </label>
                    <div className="relative">
                      <input
                        id="newsletter-email"
                        type="email"
                        required
                        placeholder="e.g. alex@studio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-zinc-950/70 border border-zinc-850 hover:border-zinc-700 focus:border-agave-500 text-sm text-white rounded-xl py-3 px-4 pl-10 outline-none transition-all placeholder-zinc-600 font-sans"
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <p className="text-xs text-chipotle-400 font-mono">
                    {errorMessage}
                  </p>
                )}

                {/* Submit action button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Your data is encrypted. Opt-out in 1 click.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-zinc-200 disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-sans font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer group"
                  >
                    {isSubmitting ? 'Registering...' : 'Request Invitation'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-zinc-950/40 border border-agave-500/20 p-6 sm:p-8 rounded-2xl flex flex-col items-center text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-agave-950/60 border border-agave-500/30 flex items-center justify-center text-agave-400">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                </div>
                
                <div className="space-y-1.5">
                  <h5 className="font-display font-medium text-lg text-white">Registry request received.</h5>
                  <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                    Welcome to the Agave &amp; Mesa private dispatch list. We have registered your subscription and will transmit upcoming weekend truck coordinates and early reservation menus soon.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-[10px] font-mono text-zinc-500 hover:text-white underline tracking-widest uppercase transition-colors"
                >
                  Register another email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
