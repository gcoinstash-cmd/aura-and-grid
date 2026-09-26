import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Truck, DollarSign, Calendar, MapPin, ClipboardCheck } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

export const EventLogisticsFAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: 'travel-radius',
      question: 'What is your operational travel radius for private catering events?',
      answer: 'Our main culinary studio is based in Downtown Los Angeles. We regularly service locations within a primary 45-mile radius, including Santa Monica, Beverly Hills, Malibu, Pasadena, and parts of Orange County. For destinations beyond 45 miles, we are happy to travel for a bespoke long-distance transport fee.',
      category: 'Travel & Location',
      icon: <Truck className="w-4 h-4 text-agave-400" />
    },
    {
      id: 'service-fees',
      question: 'How are travel surcharges and on-site service fees calculated?',
      answer: 'Events inside our primary 45-mile radius do not incur additional travel fees. Locations beyond this range are subject to a transparent surcharge of $3.50 per mile (round-trip) past the initial boundary. A standard 18% culinary & administrative service charge is applied to all commissions to cover back-of-house logistics, site cleanup, and living wages for our professional team.',
      category: 'Fees & Pricing',
      icon: <DollarSign className="w-4 h-4 text-chipotle-400" />
    },
    {
      id: 'minimum-budgets',
      question: 'Do you require a minimum spend or guest count for catering bookings?',
      answer: 'Yes, because each private commission involves custom menu curation and transporting our custom wood-fired street grills, we maintain a minimum booking budget. Weekday commissions (Monday-Thursday) require a $1,200 food & beverage minimum, while peak weekend commissions (Friday-Sunday) require an $1,850 minimum.',
      category: 'Fees & Pricing',
      icon: <Calendar className="w-4 h-4 text-agave-400" />
    },
    {
      id: 'setup-requirements',
      question: 'What are the physical site and power requirements for the catering truck?',
      answer: 'We operate a fully self-contained culinary mobile setup. We require a level parking area of approximately 24 feet in length and 10 feet in width with at least 12 feet of overhead clearance. We run on our own ultra-quiet generators, so no external electrical hookups are required. Hosts are responsible for securing necessary street parking permits or HOA permissions.',
      category: 'Site Logistics',
      icon: <MapPin className="w-4 h-4 text-chipotle-400" />
    },
    {
      id: 'customization-options',
      question: 'Can we request customized menu profiles or custom branded packaging?',
      answer: 'Absolutely. Every commission includes a personalized menu consultation where we tailor recipes for allergen profiles, specific protein requests, or theme pairings. We also offer high-editorial customizations, including customized paper wraps, printed wood menus, and custom-infused botanical mocktails matching your event color palette.',
      category: 'Customization',
      icon: <ClipboardCheck className="w-4 h-4 text-agave-400" />
    }
  ];

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div id="event-logistics-faq" className="mt-16 pt-16 border-t border-zinc-900 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] text-agave-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Catering Logistics
          </span>
          <h3 className="font-display font-medium text-3xl text-white mt-1">Event Logistics FAQ.</h3>
          <p className="text-zinc-500 text-xs mt-1 max-w-lg">
            Essential information regarding travel radius boundaries, transport surcharges, site logistics, and budget guidelines for our private gastronomy commissions.
          </p>
        </div>
        <div className="bg-charcoal/50 border border-zinc-850 px-4 py-2 rounded-xl text-[11px] text-zinc-400 max-w-xs leading-normal">
          <span className="text-white font-semibold">Need more help?</span> Fill out the catering estimation wizard above and our team will follow up within 24 hours.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Decorative Left Promo Column */}
        <div className="md:col-span-4 bg-charcoal border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-agave-950/20 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">COMMITMENT TO RIGOR</span>
            <h4 className="font-display text-lg text-white leading-snug">
              Uncompromising transport, pristine execution.
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              We travel complete with active wood-charcoal hearths, temperature-controlled ingredient cells, and raw slate plating layouts. Every mile traveled ensures restaurant-grade street gastronomy.
            </p>
          </div>
          <div className="border-t border-zinc-850 pt-4 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-mono">Service Standard</span>
            <span className="text-agave-400 font-mono font-semibold">5-Star Editorial</span>
          </div>
        </div>

        {/* Accordion Column */}
        <div className="md:col-span-8 space-y-3">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id}
                className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-agave-500/30 bg-charcoal/80 shadow-md shadow-black/20' 
                    : 'border-zinc-850 bg-charcoal/30 hover:border-zinc-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      isOpen ? 'bg-agave-950/50 border border-agave-500/30 text-agave-400' : 'bg-zinc-900 text-zinc-500'
                    }`}>
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block font-bold">
                        {item.category}
                      </span>
                      <h4 className={`text-sm font-semibold transition-colors mt-0.5 ${
                        isOpen ? 'text-white' : 'text-zinc-300'
                      }`}>
                        {item.question}
                      </h4>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`p-1 rounded-full flex-shrink-0 mt-1 ${
                      isOpen ? 'text-agave-400' : 'text-zinc-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pt-1 pl-14 text-xs text-zinc-400 leading-relaxed border-t border-zinc-850/40 mt-1">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
