import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("PLEASE ENTER YOUR EMAIL");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("INVALID EMAIL FORMAT");
      return;
    }
    
    // Simulate API call
    console.log("Newsletter signup:", email);
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="py-16 md:py-20 px-6 md:px-12 bg-white text-charcoal overflow-hidden border-t border-charcoal/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-black text-[clamp(2.5rem,8vw,5rem)] md:text-7xl tracking-tighter uppercase leading-[0.85] mb-6">
            Join the <br />
            <span className="text-neon-red">Inner Circle</span>
          </h2>
          <p className="text-charcoal/60 text-lg max-w-md">
            Be the first to hear about our secret pop-up menus, late-night DJ sets, and exclusive tasting events.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neon-blue/10 border border-neon-blue/20 p-8 flex flex-col items-center text-center gap-4"
            >
              <CheckCircle2 size={48} className="text-neon-blue" />
              <div>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight">YOU'RE IN</h3>
                <p className="text-charcoal/60 font-bold text-xs tracking-widest mt-2 uppercase">Welcome to the Lotus circle.</p>
              </div>
              <button 
                onClick={() => setStatus("idle")}
                className="mt-4 text-[10px] font-black tracking-[0.2em] uppercase border-b border-charcoal/20 hover:border-neon-red transition-colors"
              >
                BACK TO SIGNUP
              </button>
            </motion.div>
          ) : (
            <>
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
                <div className="flex-1 relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="YOUR EMAIL ADDRESS" 
                    className={`w-full bg-charcoal/5 border-2 px-6 py-4 font-display font-bold text-xs tracking-widest focus:border-neon-blue outline-none transition-colors ${
                      error ? "border-neon-red" : "border-charcoal/10"
                    }`}
                  />
                  <AnimatePresence>
                    {error && (
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-6 left-0 text-[10px] font-black text-neon-red tracking-widest"
                      >
                        {error}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <button className="bg-charcoal text-white px-10 py-4 font-display font-black text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-neon-red transition-all group shrink-0">
                  JOIN <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
              <p className="mt-4 text-[10px] text-charcoal/40 font-bold tracking-widest uppercase">
                * We respect your privacy. No spam, just spice.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
