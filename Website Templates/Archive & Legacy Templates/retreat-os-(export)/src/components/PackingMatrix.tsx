import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Retreat } from '../types';
import { Check, Info, ShieldAlert, BookOpen, PenTool } from 'lucide-react';

interface PackingMatrixProps {
  currentRetreat: Retreat;
}

interface ItemDetail {
  title: string;
  desc: string;
}

export default function PackingMatrix({ currentRetreat }: PackingMatrixProps) {
  const [activeTab, setActiveTab] = useState<'pack' | 'prepare' | 'leave'>('pack');

  // Custom premium retreat data matrix (buyer-facing, elegant, and professional)
  const matrixData: Record<string, {
    pack: ItemDetail[];
    prepare: ItemDetail[];
    leave: ItemDetail[];
    philosophicalNote: string;
  }> = {
    'soma-silence': {
      pack: [
        { title: 'Comfortable Lightweight Apparel', desc: 'Loose-fitting, breathable cotton or linen trousers and tops in neutral colors to stay cool and comfortable in warm forest environments.' },
        { title: 'Slip-On Loafers or Sandals', desc: 'Soft-soled slip-on footwear for easily moving between workspace hubs and natural stone pathways.' },
        { title: 'Insulated Beverage Flask', desc: 'To keep water or fresh organic refreshments of your choice cold and refreshing throughout daily focus blocks.' },
        { title: 'Goal Planning Notebooks', desc: 'A premium, unruled paper notebook or binder to capture your strategic ideas, milestones, and planning notes.' }
      ],
      prepare: [
        { title: 'Hydration Adjustment (3 Days Prior)', desc: 'Gradually increase fresh water intake and decrease caffeine to ease your physical transition.' },
        { title: 'Digital Hand-off Coordination', desc: 'Step down active messaging screentime and configure out-of-office email replies before dynamic arrival.' },
        { title: 'Schedule Alignment', desc: 'Establish clear, basic targets for what strategic milestones you aim to resolve during the dedicated workspace hours.' }
      ],
      leave: [
        { title: 'Continuous Work Notifications', desc: 'Laptops are encouraged for focus work, but we recommend keeping active messaging alerts and daily chats switched off.' },
        { title: 'Synthetic Scented Fragrances', desc: 'Heavy synthetic perfumes are restricted to maintain clean air quality inside shared focus and quiet spaces.' },
        { title: 'Unnecessary Clutter', desc: 'Ditch heavy stacks of printouts or unrelated folders. Focus purely on the core goals select-mapped for the week.' }
      ],
      philosophicalNote: 'Preparing for the program is a study in subtraction. Removing unnecessary administrative clutter ensures you capture maximal strategic focus during your time with us.'
    },
    'kairou-clay': {
      pack: [
        { title: 'Studio Practice Apparel', desc: 'Linen aprons, denim overalls, or breathable shirts that easily absorb natural clay splatters and mineral oxides.' },
        { title: 'Flat Studio Loafers', desc: 'Flat, easily removable shoes or slippers for smooth transitions between courtyard paths and delicate indoor tatami matting.' },
        { title: 'Sketching Journals & Pencils', desc: 'Dark drawings pencils (such as 4B or 6B) and standard drawing paper for mapping out custom ceramic patterns.' },
        { title: 'Warm Merino Wool Socks', desc: 'Machiya spaces are historically wooden structures; highly insulated organic socks keep you perfectly comfortable.' }
      ],
      prepare: [
        { title: 'Hand Care & Fingernail Trimming', desc: 'Ensure fingernails are trimmed short. Long nails risk slicing and collapsing spinning wet clay structures on the wheel.' },
        { title: 'Tactile Observation Practice', desc: 'Spend small quiet moments cataloging physical patterns, textures, and lines in your daily design surroundings.' },
        { title: 'Spinal Alignment Awareness', desc: 'Spend 5-10 minutes checking your seated posture. Make sure your trunk rests vertically and centered above your hips.' }
      ],
      leave: [
        { title: 'Heavy Jewelry & Watches', desc: 'Rings, bulky chronographs, or metal wrist straps are not allowed on the manual wheel to avoid scoring clay surfaces.' },
        { title: 'Constant Personal Recording', desc: 'Professional high-definition photo sets of your work are furnished separately. Let go of the demand to document every minute.' },
        { title: 'Intense Corporate Deadlines', desc: 'Aim to pause active client calls and project targets during workshop hours to allow your manual coordination to take hold.' }
      ],
      philosophicalNote: 'Studio pottery begins with exact physical posture. Selecting short nails, simple wrists, and aligned shoulders allows the clay to rise beautifully.'
    },
    'prana-surf': {
      pack: [
        { title: 'Organic Mineral Protection', desc: 'Sustainable, non-chemical zinc or titanium mineral block sunscreen (SPF 50+) to safeguard sensitive local marine biology.' },
        { title: 'Athletic Long-Sleeve Rashguards', desc: 'Durable, form-fitting surf shirts to protect the skin against board wax friction and direct tropical sun rays.' },
        { title: 'Performance Electrolyte Flask', desc: 'Double-wall insulated water container to maintain optimal mineral hydration under coastal sun and salt.' },
        { title: 'Post-Session Recovery Balms', desc: 'Soothing organic magnesium lotions or natural cooling ointments to unwind shoulder and back muscles after boarding.' }
      ],
      prepare: [
        { title: 'Thoracic & Lower Back Extension', desc: 'Incorporate light posture stretching (such as cobra or chest stretches) to build physical endurance for water paddling.' },
        { title: 'Optimal Hydration Intake', desc: 'Consume 2.5 to 3 liters of mineral-dense fresh water daily for 3 days before checking in to optimize cellular stamina.' },
        { title: 'Visual Tracking Drills', desc: 'Spend time focusing your eyes on distant milestones (e.g. clouds or horizons) to expand active space and speed awareness.' }
      ],
      leave: [
        { title: 'Chemical-Based Spray Sunscreens', desc: 'Strictly prohibited due to high toxicity risks to water corals. Natural mineral blocks are requested instead.' },
        { title: 'Formal Wardrobe Items', desc: 'The surf property is warm, rugged, and relaxed. Ditch heavy leather dress shoes, formal jackets, and delicate designer bags.' },
        { title: 'Aggressive Metric Dashboards', desc: 'Disconnect from daily fitness calculators, calorie trackers, and step diaries. Allow your body to align naturally to the waves.' }
      ],
      philosophicalNote: 'Surfing is a dialogue between body alignment and marine physics. Select sustainable sun protection, stand tall, and trust your personal coaching lines.'
    }
  };

  const activeData = matrixData[currentRetreat.id] || matrixData['soma-silence'];

  const getTabLabel = (tab: typeof activeTab) => {
    switch (tab) {
      case 'pack': return 'What to Pack';
      case 'prepare': return 'How to Prepare';
      case 'leave': return 'What to Leave Behind';
    }
  };

  const getTabIcon = (tab: typeof activeTab) => {
    switch (tab) {
      case 'pack': return <BookOpen size={14} className="text-ochre" />;
      case 'prepare': return <PenTool size={14} className="text-[#5A6455]" />;
      case 'leave': return <ShieldAlert size={14} className="text-[#C4A482]" />;
    }
  };

  return (
    <div className="border border-ink/10 bg-white/40 p-6 md:p-10 rounded-sm shadow-xs" id="packing-matrix">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-ink/10 mb-8">
        <div className="max-w-xl">
          <span className="text-[10px] tracking-[0.25em] text-[#5A6455] font-bold uppercase block mb-1">
            04 / PREPARATION & PACKING
          </span>
          <h2 className="font-serif text-3xl font-light tracking-tight text-ink">
            Preparation <span className="italic">Guide</span>
          </h2>
          <p className="text-xs text-ink/65 mt-2 font-sans leading-relaxed">
            Every professional program features custom guidelines. Prepare ahead by packing deliberately, aligning your schedule, and pausing daily operational demands.
          </p>
        </div>

        {/* Dynamic Directive Quote Badge */}
        <div className="bg-white/60 border border-ink/5 p-4 rounded-xs shrink-0 max-w-xs shadow-xs">
          <span className="text-[9px] font-mono tracking-widest text-[#5A6455] font-bold uppercase block mb-1.5">[ Host Note ]</span>
          <p className="text-[11px] text-[#1A1A1A] italic leading-relaxed font-sans">
            &ldquo;{activeData.philosophicalNote}&rdquo;
          </p>
        </div>
      </div>

      {/* Minimalism tabbed toggles under design tokens */}
      <div className="flex border-b border-ink/10 mb-8 overflow-x-auto pb-[1px] gap-2 lg:gap-4 scrollbar-none">
        {(['pack', 'prepare', 'leave'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-3 text-[10px] uppercase font-bold tracking-widest border transition duration-300 whitespace-nowrap cursor-pointer rounded-t-sm ${
                isActive
                  ? 'bg-[#FBF9F6] border-ink/15 border-b-transparent text-ink -mb-[1px]'
                  : 'bg-transparent border-transparent hover:border-ink/5 text-ink/50 hover:text-ink/80'
              }`}
            >
              {getTabIcon(tab)}
              <span>{getTabLabel(tab)}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents Frame */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + '_' + currentRetreat.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeData[activeTab].map((item, index) => (
            <div 
              key={index} 
              className={`p-6 border rounded-sm transition duration-300 shadow-3xs flex flex-col justify-between ${
                activeTab === 'leave'
                  ? 'border-ochre/20 bg-ochre/5 hover:border-ochre/40'
                  : activeTab === 'prepare'
                  ? 'border-[#5A6455]/20 bg-[#5A6455]/5 hover:border-[#5A6455]/40'
                  : 'border-ink/10 bg-[#FBF9F6]/50 hover:border-ink/20'
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    activeTab === 'leave' ? 'bg-[#C4A482]' : activeTab === 'prepare' ? 'bg-[#5A6455]' : 'bg-ochre'
                  }`} />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-sans">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-ink/75 leading-relaxed font-sans font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-ink/5 flex items-center justify-between text-[8px] font-mono tracking-widest text-[#5A6455] font-semibold">
                <span>PREPARATION DETAIL</span>
                <span className="font-bold">[{activeTab.toUpperCase()}_{index + 1}]</span>
              </div>
            </div>
          ))}

          {/* Prompt card warning for a complete aesthetic experience */}
          <div className="p-6 border border-dashed border-ink/15 rounded-sm flex flex-col justify-between bg-white/20">
            <div>
              <div className="flex items-center gap-2 mb-3.5 text-ochre">
                <Info size={14} />
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-sans">
                  Personal Requirements
                </h4>
              </div>
              <p className="text-xs text-ink/65 leading-relaxed font-sans">
                If you have custom dietary preferences or physical needs, please list them clearly in your application form.
              </p>
            </div>
            
            <p className="text-[9px] font-mono tracking-widest text-[#5A6455]/70 mt-5 uppercase font-bold">
              // PROGRAM PREPARATION DETAILS
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
