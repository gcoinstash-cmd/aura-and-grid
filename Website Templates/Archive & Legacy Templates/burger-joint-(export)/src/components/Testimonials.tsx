import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Marcus Vance',
    label: 'Yelp Elite',
    quote: 'The Classic Noir redefined what a luxury burger can be. The Wagyu patty was impossibly tender, but it’s that smoky, black truffle aioli on the soft charcoal bun that has me booking weekly tables.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sophia Rossi',
    label: 'Local Guide',
    quote: 'As a true Chicago diner purist, I was skeptical. But the combination of retro street vibe with elite, Michelin-star level meat prep is absolute genius. Those Inferno Crisp Fries are food of the gods.',
    rating: 5,
  },
  {
    id: 3,
    name: 'David K.',
    label: 'Regular Customer',
    quote: 'An absolute masterpiece. It feels like a high-end vintage speakeasy, but instead of secret cocktails, they’re serving the finest handcrafted burger on the continent. Worth every single mile of the drive.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="pt-14 pb-12 relative bg-brand-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center md:text-left mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-primary font-sans font-bold tracking-[0.2em] uppercase text-xs">
              Connoisseur Reviews
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-2 uppercase">
              HEARD ON <span className="text-white/30 italic">THE STREETS</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group glass p-8 rounded-[32px] border border-white/5 hover:border-brand-primary/20 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 relative"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute right-8 top-8 text-white/5 group-hover:text-brand-primary/5 transition-colors duration-300">
                <Quote size={40} className="stroke-[1.5]" />
              </div>

              <div>
                {/* 5 Stars Rating */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-brand-primary text-brand-primary animate-pulse"
                      style={{ animationDelay: `${i * 150}ms`, animationDuration: '4s' }}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 italic font-medium">
                  "{review.quote}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="border-t border-white/5 pt-5 mt-auto flex items-center justify-between">
                <div>
                  <h4 className="font-display text-lg font-bold tracking-tight text-white uppercase group-hover:text-brand-primary transition-colors duration-300">
                    {review.name}
                  </h4>
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-brand-primary/80">
                    {review.label}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
