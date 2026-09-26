import React, { useState } from "react";
import { Send, CheckCircle2, Calendar, Clock, Laptop, ExternalLink, Mail, Phone, MapPin } from "lucide-react";

export default function EnterpriseUpsell() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);
  const [orgName, setOrgName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [platform, setPlatform] = useState<string>("Shopify Plus");

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !orgName.trim()) return;
    setLeadSubmitted(true);
  };

  const handleReset = () => {
    setOrgName("");
    setEmail("");
    setPlatform("Shopify Plus");
    setLeadSubmitted(false);
    setShowModal(false);
  };

  return (
    <>
      {/* 2.1 The Upsell Hook Banner */}
      <section className="bg-bg-secondary border-t border-bg-tertiary relative py-20 overflow-hidden" id="enterprise-upsell">
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="border border-accent/20 bg-bg-primary p-8 md:p-14 relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            {/* Design accents */}
            <div className="absolute top-0 left-6 w-12 h-1 bg-accent" />
            <div className="absolute bottom-4 right-6 text-[8px] font-mono text-text-secondary/45">
              SECURE SCHEDULER // AETH-CORP
            </div>

            <div className="space-y-4 max-w-2xl">
              <span className="text-[10px] font-mono tracking-[0.3em] text-accent block uppercase">
                ENTERPRISE SYNC ARCHITECTURE
              </span>
              <h3 className="font-display font-light text-3xl md:text-4xl text-[#FFFFFF] leading-tight">
                Scaling to Bespoke Orchestration?
              </h3>
              <p className="text-text-secondary text-sm font-sans font-light leading-relaxed">
                Integrate this frontend masterpiece directly into your live Shopify backend, ERP infrastructure, 
                or custom CRM systems. Book an Enterprise Custom Build starting at $3,500 to link physical cordwainer inventory 
                with digital luxury pipelines.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-4 items-stretch lg:items-center">
              <button
                onClick={() => setShowModal(true)}
                className="bg-accent text-[#0A0A0A] font-mono text-xs font-bold py-4 px-8 rounded-none border border-accent hover:bg-transparent hover:text-accent transition-luxury text-center cursor-pointer"
                id="upsell-schedule-btn"
              >
                [ Schedule Technical Consultation ]
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2.2 Dedicated Deep-Surface Footer */}
      <footer className="bg-[#0A0A0A] border-t border-bg-tertiary pt-20 pb-12 relative z-10" id="aethel-footer">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Logo stamp coordinates */}
          <div className="md:col-span-4 space-y-6">
            <span className="font-display font-medium text-2xl tracking-widest text-[#FFFFFF] block">
              A E T H E L
            </span>
            <p className="text-text-secondary text-xs font-sans font-light leading-relaxed max-w-sm">
              We preserve the historical gravity of welted handcraft. Our digital frameworks are coded with 
              the same commitment to zero-compromise calibration as our standard wholecut boots.
            </p>
            <div className="font-mono text-[9px] text-[#8E8E93] space-y-0.5">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>Atelier: Savile Row Hub, London & Munich</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="w-3.5 h-3.5 text-accent" />
                <span>concierge@aethel-cordwainer.com</span>
              </div>
            </div>
          </div>

          {/* Sitemaps */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[10px] font-mono tracking-widest text-text-primary uppercase">THE HANDS</h4>
            <ul className="space-y-2.5 text-xs text-text-secondary font-sans font-light">
              <li><a href="#anatomy-section" className="hover:text-accent transition-colors">The Last Carving</a></li>
              <li><a href="#anatomy-section" className="hover:text-accent transition-colors">Goodyear Stitching</a></li>
              <li><a href="#atelier-lookbook-matrix" className="hover:text-accent transition-colors">Charles F. Suedes</a></li>
              <li><a href="#anatomy-section" className="hover:text-accent transition-colors">Rendenbach Bark Soles</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[10px] font-mono tracking-widest text-text-primary uppercase">COMMISSIONS</h4>
            <ul className="space-y-2.5 text-xs text-text-secondary font-sans font-light">
              <li><a href="#sizing-architect-portal" className="hover:text-accent transition-colors">Request FitPass</a></li>
              <li><a href="#sizing-architect-portal" className="hover:text-accent transition-colors">Physiological Last</a></li>
              <li><a href="#atelier-lookbook-matrix" className="hover:text-accent transition-colors">Classic Oxfords</a></li>
              <li><a href="#enterprise-upsell" className="hover:text-accent transition-colors">Enterprise API Hub</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-mono tracking-widest text-text-primary uppercase">NEWSLETTER LINEAGE</h4>
            <p className="text-text-secondary text-xs font-sans font-light">
              Subscribe to recieve rare availability notices regarding limited leather hide batches and seasonal cordwainer allocations.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Secure Email Register"
                className="bg-[#121212] border border-bg-tertiary px-3.5 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-accent w-full"
              />
              <button className="bg-accent px-4 py-2 hover:bg-text-primary transition-colors cursor-pointer">
                <Send className="w-4 h-4 text-bg-primary" />
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-bg-tertiary flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-text-secondary/70 gap-4">
          <div>
            © 2026 AETHEL STUDIO. ALL HISTORICAL RIGHTS PRESERVED.
          </div>
          <div className="flex items-center space-x-6">
            <span>TERMS OF LINEAGE</span>
            <span>PRIVACY DISCLOSURE</span>
            <span className="text-accent underline flex items-center space-x-1 hover:text-[#FFFFFF] cursor-pointer">
              <span>DESIGNED FOR HIGH-TICKET ASSETS</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </footer>

      {/* Luxury Technical Consultation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/95 backdrop-blur-md">
          <div className="w-full max-w-lg bg-bg-secondary border border-accent/20 p-8 md:p-10 relative">
            <button
              onClick={handleReset}
              className="absolute top-6 right-6 text-text-secondary hover:text-[#FFFFFF] font-mono text-xs cursor-pointer"
            >
              [ CLOSE ]
            </button>

            {!leadSubmitted ? (
              <form onSubmit={handleSubmitConsultation} className="space-y-6">
                <div className="space-y-2">
                  <span className="text-accent text-[9px] font-mono tracking-widest block uppercase">
                    TECHNICAL ARCHITECT CONSULATION
                  </span>
                  <h3 className="font-display text-2xl text-text-primary font-light">
                    Schedule Integration Review
                  </h3>
                  <p className="text-text-secondary text-xs font-sans font-light leading-relaxed">
                    Reserve a direct 30-minute system alignment review. Our tech team compiles high-ticket custom schemas for Shopify Admin, Headless Commerce APIs, and enterprise inventory syncing.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-mono text-accent uppercase mb-1">
                      Organization name
                    </label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g., Harrods Retail Group"
                      className="w-full bg-bg-primary border border-bg-tertiary p-3 text-xs text-text-primary focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-accent uppercase mb-1">
                      Technical Liaison Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cto@harrodsgroup.com"
                      className="w-full bg-bg-primary border border-bg-tertiary p-3 text-xs text-text-primary focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-accent uppercase mb-1">
                      Target Backend Platform
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-bg-primary border border-bg-tertiary p-3 text-xs text-text-primary focus:border-accent focus:outline-none transition-colors"
                    >
                      <option value="Shopify Plus">Shopify Plus (API Custom Cart)</option>
                      <option value="Commercetools">Commercetools (Headless Node)</option>
                      <option value="Adobe Commerce">Adobe Commerce Cloud (Magento-based)</option>
                      <option value="Custom CRM/ERP Stack">Custom CRM / ERP Stack (Direct postgres)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-bg-primary p-3.5 border border-bg-tertiary space-y-1.5">
                  <span className="text-[8px] font-mono text-accent block uppercase">SELECT TECHNICAL REPRESENTATIVE slot</span>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-mono text-[#FFFFFF] bg-bg-tertiary px-2 py-1 flex items-center space-x-1 select-none">
                      <Calendar className="w-3 h-3 text-accent shrink-0 inline mr-1" />
                      <span>Mon, 2:00 PM GMT</span>
                    </span>
                    <span className="text-[10px] font-mono text-text-secondary bg-bg-primary border border-bg-tertiary px-2 py-1 select-none">
                      Tue, 11:00 AM GMT
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    className="bg-accent text-bg-primary font-mono text-xs font-semibold py-3.5 px-6 rounded-none hover:bg-text-primary hover:text-bg-primary transition-luxury w-full"
                  >
                    CONFIRM RESERVATION SLOT ($3,500 Base Stack)
                  </button>
                </div>
              </form>
            ) : (
              // Success confirmation modal
              <div className="text-center py-6 space-y-6">
                <CheckCircle2 className="w-12 h-12 text-accent mx-auto animate-bounce" />
                <div className="space-y-2">
                  <h3 className="font-display text-2xl text-[#FFFFFF] font-light">
                    Consultation Slotted
                  </h3>
                  <p className="text-text-secondary text-xs font-sans font-light max-w-sm mx-auto leading-relaxed">
                    A technical lead from Aethel has earmarked 30 minutes to review the integration proposal with{" "}
                    <strong className="text-accent">{orgName}</strong> on the requested calendar slot.
                  </p>
                </div>
                
                <div className="bg-bg-primary p-4 border border-bg-tertiary text-left text-xs font-mono space-y-1.5 max-w-sm mx-auto text-text-secondary">
                  <div>
                    <span className="text-[8px] text-accent block uppercase">CTO DESPATCH CONCILIATOR</span>
                    <span className="text-text-primary">{email}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-accent block uppercase">TARGET DEPLOYMENT CHANNEL</span>
                    <span className="text-text-primary">{platform} Master Integration</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-accent block uppercase">ALLOCATED TIMELINE</span>
                    <span className="text-text-primary">Next Monday, 2:00 PM GMT</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="bg-accent text-[#0A0A0A] text-xs font-mono py-2.5 px-6 rounded-none hover:bg-text-primary hover:text-bg-primary transition-luxury cursor-pointer"
                >
                  DISMISS PROPOSAL PASS
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
