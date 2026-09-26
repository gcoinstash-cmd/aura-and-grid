import React, { useState, useTransition } from "react";

export default function Reserve() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "2",
    time: "5:30 pm",
    date: new Date().toISOString().split("T")[0],
    dietary: "",
    consent: false
  });

  const times = ["5:30 pm", "8:15 pm"];
  const guestOptions = ["1 guest", "2 guests", "3 guests", "4 guests"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setInputs((prev) => ({ ...prev, [name]: checked }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.name || !inputs.email || !inputs.phone) {
      alert("please provide your name, email and phone to request seating.");
      return;
    }
    
    startTransition(() => {
      // Simulate real-time API latency
      setTimeout(() => {
        setFormSubmitted(true);
      }, 1000);
    });
  };

  return (
    <section 
      id="order" 
      className="py-32 px-6 max-w-7xl mx-auto border-t border-muted-charcoal scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Reservation instructions column */}
        <div className="lg:col-span-5">
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-raw-silk/40 block mb-3">
            reservation request
          </span>
          <h2 className="title-section mb-8">
            request seating
          </h2>
          
          <div className="space-y-6 text-xs text-raw-silk/70 lowercase tracking-wide font-sans leading-relaxed">
            <p>
              due to our extremely limited capacity of 16 seats per seating, we accept requests up to thirty days in advance.
            </p>
            <p>
              each reservation contains a curated 12-course menu starting promptly at the chosen seating slot. private buyouts or custom dietary requests require 7 days notice.
            </p>
            <p className="border-l border-muted-charcoal pl-4 text-raw-silk/50 italic">
              * our courses feature raw shellfish, sea urchin, and gluten. we are regrettably unable to accommodate menus with severe soy or fish-stock allergies.
            </p>
          </div>

          <div className="mt-12 p-6 border border-muted-charcoal/70 bg-sumi-ink flex items-center justify-between">
            <span className="text-[10px] tracking-[0.2em] uppercase text-raw-silk/50 font-mono">service charge</span>
            <span className="font-sans text-xs tracking-wider">included / hospitality-included model</span>
          </div>
        </div>

        {/* Form panel column */}
        <div className="lg:col-span-7">
          {formSubmitted ? (
            <div 
              className="border border-muted-charcoal p-8 md:p-12 bg-sumi-ink flex flex-col justify-center animate-zen-fade ml-4 mr-14 md:ml-8 md:mr-24 shadow-2xl relative"
              id="reservation-receipt"
            >
              {/* Top Archival Ticket Stub Header */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-muted-charcoal via-raw-silk/40 to-muted-charcoal" />

              <div className="flex justify-between items-baseline mb-8 border-b border-muted-charcoal pb-4">
                <span className="font-mono text-[9px] tracking-[0.3em] text-raw-silk/40 uppercase">allocation voucher</span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-raw-silk/50 uppercase">no. {(Math.random() * 100000).toFixed(0)}</span>
              </div>

              <div className="space-y-6 text-xs font-sans text-raw-silk/80 lowercase">
                <h3 className="text-xl font-serif text-raw-silk tracking-[0.05em] mb-4">
                  seating requested successfully
                </h3>

                <p className="leading-relaxed text-raw-silk/60 mb-6 font-sans">
                  thank you for your request. this serves as your digital archival voucher receipt. we will verify counts with seafood purveyors and contact you shortly.
                </p>

                {/* Asymmetric Framed Ticket Details Block */}
                <div className="border border-muted-charcoal p-6 space-y-4 font-mono select-none relative bg-muted-charcoal/5">
                  <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[7px] h-[14px] bg-sumi-ink border-r border-t border-b border-muted-charcoal rounded-r-full" />
                  <div className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-[7px] h-[14px] bg-sumi-ink border-l border-t border-b border-muted-charcoal rounded-l-full" />
                  
                  <div className="flex justify-between border-b border-dashed border-muted-charcoal/60 pb-3">
                    <span className="text-raw-silk/40 text-[9px] tracking-widest uppercase">patron name</span>
                    <span className="font-sans text-xs text-raw-silk">{inputs.name}</span>
                  </div>

                  <div className="flex justify-between border-b border-dashed border-muted-charcoal/60 pb-3">
                    <span className="text-raw-silk/40 text-[9px] tracking-widest uppercase">allocated date</span>
                    <span className="text-xs text-raw-silk">{inputs.date}</span>
                  </div>

                  <div className="flex justify-between border-b border-dashed border-muted-charcoal/60 pb-3">
                    <span className="text-raw-silk/40 text-[9px] tracking-widest uppercase">seating slot</span>
                    <span className="text-xs text-raw-silk">{inputs.time}</span>
                  </div>

                  <div className="flex justify-between border-b border-dashed border-muted-charcoal/60 pb-3">
                    <span className="text-raw-silk/40 text-[9px] tracking-widest uppercase">total covers</span>
                    <span className="text-xs text-raw-silk">{inputs.guests} seats</span>
                  </div>

                  <div className="flex justify-between pt-1">
                    <span className="text-raw-silk/40 text-[9px] tracking-widest uppercase">status</span>
                    <span className="text-xs text-raw-silk/60 uppercase tracking-widest">pending verification</span>
                  </div>
                </div>
              </div>

              {/* Ticket Footer / Tear line */}
              <div className="mt-8 pt-6 border-t border-muted-charcoal/80 text-center">
                <span className="block text-[8px] font-mono tracking-[0.4em] text-raw-silk/30 uppercase mb-6">
                  [omakase & counter / gion district]
                </span>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="w-full text-center hover:bg-raw-silk hover:text-sumi-ink bg-transparent text-raw-silk border border-raw-silk py-3 text-[10px] tracking-widest font-mono uppercase transition-all duration-500"
                  style={{ borderRadius: "0px" }}
                >
                  request another slot
                </button>
              </div>
            </div>
          ) : (
            <form 
              onSubmit={handleSubmit} 
              className="space-y-8"
              id="reserve-seating-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full name */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="name-input" className="text-[10px] uppercase tracking-[0.3em] text-raw-silk/40 block font-mono">
                    full name / patron
                  </label>
                  <input
                    type="text"
                    id="name-input"
                    name="name"
                    required
                    placeholder="Honored Guest Name"
                    value={inputs.name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-muted-charcoal focus:border-raw-silk focus:ring-0 text-raw-silk text-xs px-0 py-3 placeholder:text-raw-silk/25 tracking-wider focus:outline-none transition-colors duration-500"
                  />
                </div>

                {/* Email address */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email-input" className="text-[10px] uppercase tracking-[0.3em] text-raw-silk/40 block font-mono">
                    email address
                  </label>
                  <input
                    type="email"
                    id="email-input"
                    name="email"
                    required
                    placeholder="patron@example.com"
                    value={inputs.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-muted-charcoal focus:border-raw-silk focus:ring-0 text-raw-silk text-xs px-0 py-3 placeholder:text-raw-silk/25 tracking-wider font-mono focus:outline-none transition-colors duration-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact phone */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="phone-input" className="text-[10px] uppercase tracking-[0.3em] text-raw-silk/40 block font-mono">
                    contact phone
                  </label>
                  <input
                    type="tel"
                    id="phone-input"
                    name="phone"
                    required
                    placeholder="+1 (555) 0192"
                    value={inputs.phone}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-muted-charcoal focus:border-raw-silk focus:ring-0 text-raw-silk text-xs px-0 py-3 placeholder:text-raw-silk/25 tracking-wider font-mono focus:outline-none transition-colors duration-500"
                  />
                </div>

                {/* Requested Date */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="date-input" className="text-[10px] uppercase tracking-[0.3em] text-raw-silk/40 block font-mono">
                    calendar date
                  </label>
                  <input
                    type="date"
                    id="date-input"
                    name="date"
                    required
                    value={inputs.date}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-muted-charcoal focus:border-raw-silk focus:ring-0 text-raw-silk text-xs px-0 py-3 font-mono focus:outline-none transition-colors duration-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Covers Count */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="guests-select" className="text-[10px] uppercase tracking-[0.3em] text-raw-silk/40 block font-mono">
                    covers count
                  </label>
                  <select
                    id="guests-select"
                    name="guests"
                    value={inputs.guests}
                    onChange={handleInputChange}
                    className="w-full bg-sumi-ink border-t-0 border-l-0 border-r-0 border-b border-muted-charcoal focus:border-raw-silk focus:ring-0 text-raw-silk text-xs px-0 py-3 tracking-wider appearance-none cursor-pointer focus:outline-none transition-colors duration-500"
                    style={{ borderRadius: "0px" }}
                  >
                    {guestOptions.map((opt) => (
                      <option key={opt} value={opt[0]} className="bg-sumi-ink text-raw-silk">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seating Times */}
                <div className="flex flex-col space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-raw-silk/40 block font-mono">
                    seating slot
                  </span>
                  <div className="flex gap-4">
                    {times.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setInputs((prev) => ({ ...prev, time: t }))}
                        className={`flex-1 text-center py-3 text-xs tracking-widest font-serif border lowercase transition-colors duration-500 ${
                          inputs.time === t
                            ? "bg-raw-silk text-sumi-ink border-raw-silk"
                            : "border-muted-charcoal text-raw-silk/60 hover:text-raw-silk hover:border-raw-silk/60 bg-transparent"
                        }`}
                        style={{ borderRadius: "0px" }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Special dietary remarks */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="dietary-input" className="text-[10px] uppercase tracking-[0.3em] text-raw-silk/40 block font-mono">
                  Dietary Nuances & Requests
                </label>
                <textarea
                  id="dietary-input"
                  name="dietary"
                  rows={3}
                  placeholder="list severe seafood, soy, or gluten dietary warnings if any..."
                  value={inputs.dietary}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-muted-charcoal focus:border-raw-silk focus:ring-0 text-raw-silk text-xs px-0 py-3 placeholder:text-raw-silk/25 tracking-wider resize-none focus:outline-none transition-colors duration-500"
                  style={{ borderRadius: "0px" }}
                />
              </div>

              {/* Compliance Consent */}
              <div className="flex items-start space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  name="consent"
                  required
                  checked={inputs.consent}
                  onChange={handleInputChange}
                  className="w-4 h-4 mt-0.5 border border-muted-charcoal bg-transparent text-raw-silk focus:ring-0 cursor-pointer appearance-none checked:bg-raw-silk checked:border-raw-silk"
                  style={{ borderRadius: "0px" }}
                />
                <label htmlFor="consent-checkbox" className="text-[11px] leading-relaxed text-raw-silk/50 cursor-pointer select-none">
                  i acknowledge that seatings start precisely on time. cancellations within 72 hours are subject to a standard ingredients purveyance forfeiture fine.
                </label>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full relative flex items-center justify-center bg-transparent border border-raw-silk text-raw-silk hover:bg-raw-silk hover:text-sumi-ink transition-all duration-500 py-4 text-xs tracking-[0.25em] font-serif uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-raw-silk/40 disabled:border-muted-charcoal"
                style={{ borderRadius: "0px" }}
              >
                <span className={`transition-opacity duration-300 ${isPending ? "opacity-0" : "opacity-100"}`}>
                  [transmit seating request]
                </span>
                {isPending && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-spin w-4 h-4 border border-muted-charcoal border-t-raw-silk rounded-full" />
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
