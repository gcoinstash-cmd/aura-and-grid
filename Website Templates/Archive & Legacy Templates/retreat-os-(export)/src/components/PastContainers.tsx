import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';

interface PastRecord {
  season: string;
  location: string;
  title: string;
  tagline: string;
  description: string;
  metrics: { label: string; value: string }[];
  imageUrl: string;
}

export default function PastContainers() {
  const PAST_RECORDS: PastRecord[] = [
    {
      season: 'SPRING 2025',
      location: 'Ubud, Bali',
      title: 'The Valley Meadow Studio',
      tagline: 'Strategic Business Planning — 12 Cohort Members',
      description: 'An immersive gathering of designers, creative directors, and business owners. Core focus was directed toward deep business planning, posture workshops, and private workspaces alongside garden pools.',
      metrics: [
        { label: 'FOCUS STUDY HOURS', value: '8 Hours Daily' },
        { label: 'RESERVATION STATUS', value: 'Fully Booked' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600'
    },
    {
      season: 'AUTUMN 2025',
      location: 'Kyoto, Japan',
      title: 'The Basalt Stone Lodge',
      tagline: 'Tactile Design & Ceramic Craft — 8 Cohort Members',
      description: 'Centered around traditional hand-thrown porcelain and manual kick-wheel craft. Cohort members studied historic architectural proportions under Kyoto master weavers and designer craftsmen.',
      metrics: [
        { label: 'STUDIO INSTRUCTOR RATIO', value: '1:4 Small' },
        { label: 'CLIENT EVALUATION', value: '100% Verified' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600'
    },
    {
      season: 'WINTER 2025',
      location: 'Santa Teresa, Costa Rica',
      title: 'The Coastal Ocean Lodge',
      tagline: 'Athletic Conditioning & Mobility — 10 Cohort Members',
      description: 'An intensive physical conditioning and athletic mobility workshop. Coupled active surf-and-ice training with posture alignments, functional yoga, and contrast hydro-therapy pools.',
      metrics: [
        { label: 'DAILY SURF COACHING', value: '2x Sessions' },
        { label: 'GUEST COMFORT RATING', value: '99% Net' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <div className="border border-ink/10 bg-white/40 p-6 md:p-10 rounded-sm shadow-xs mt-12" id="historical-archives">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between pb-8 border-b border-ink/10 mb-10 gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#5A6455] font-bold uppercase block mb-1">
            05 / Past retreats
          </span>
          <h2 className="font-serif text-3xl font-light tracking-tight text-ink">
            Past <span className="italic">retreats</span>
          </h2>
          <p className="text-xs text-ink/65 mt-2 font-sans max-w-lg leading-relaxed">
            Browse verified seasonal programs. This archive of past retreats demonstrates the custom layout options available for highlighting previous successful cohorts.
          </p>
        </div>
        <div className="flex items-center space-x-1 font-mono text-[9px] uppercase tracking-widest text-[#5A6455] font-bold">
          <RefreshCw size={11} className="animate-spin-slow text-[#5A6455]" />
          <span>Dynamic Archive Mock</span>
        </div>
      </div>

      {/* Grid Cards of historical assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PAST_RECORDS.map((rec, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group flex flex-col justify-between h-full border border-ink/5 bg-white p-5 rounded-sm transition duration-500 hover:shadow-md"
          >
            <div>
              {/* Image box */}
              <div className="overflow-hidden aspect-video bg-[#1A1A1A] mb-4 border border-ink/10 relative">
                <img 
                  referrerPolicy="no-referrer"
                  src={rec.imageUrl} 
                  alt={rec.title}
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition duration-500 brightness-95"
                />
                <span className="absolute top-2 left-2 bg-[#FBF9F6]/95 border border-ink/10 px-2 py-0.5 text-[8px] font-mono tracking-widest font-bold text-ink">
                  {rec.season}
                </span>
              </div>

              {/* Text Info */}
              <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-ochre block mb-1">
                {rec.location}
              </span>
              <h3 className="font-serif text-xl font-light text-ink tracking-tight mb-2 group-hover:text-ochre transition duration-300">
                {rec.title}
              </h3>
              <p className="text-[10px] font-sans font-semibold text-[#5A6455] uppercase tracking-widest mb-3.5 italic">
                {rec.tagline}
              </p>
              <div className="h-[1px] bg-ink/10 w-12 mb-3.5" />
              <p className="text-xs text-ink/70 leading-relaxed font-sans mb-6">
                {rec.description}
              </p>
            </div>

            {/* Metrics specifications */}
            <div className="mt-auto pt-4 border-t border-ink/10 grid grid-cols-2 gap-4">
              {rec.metrics.map((m, idx) => (
                <div key={idx}>
                  <span className="font-mono text-[8px] text-[#5A6455] font-bold block uppercase tracking-widest">{m.label}</span>
                  <span className="font-serif text-sm font-semibold text-ink/90 block mt-0.5">{m.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
