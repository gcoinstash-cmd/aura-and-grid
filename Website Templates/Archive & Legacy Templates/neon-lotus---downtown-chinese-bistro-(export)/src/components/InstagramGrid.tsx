import { motion } from "motion/react";
import { Instagram, Heart, MessageCircle } from "lucide-react";

const INSTA_POSTS = [
  {
    id: "insta1",
    imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80",
    caption: "Wok Hei in its truest form. High energy, pure heat. 🔥 #neonlotusla",
    likes: "1,420",
    comments: "56"
  },
  {
    id: "insta2",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
    caption: "The wrapper is thin, the broth is hot, the pork is perfect. #SiuMai",
    likes: "980",
    comments: "34"
  },
  {
    id: "insta3",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
    caption: "La mian hand-pulled to order. Slurping is encouraged. 🥢",
    likes: "2,110",
    comments: "82"
  },
  {
    id: "insta4",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop",
    caption: "Crispy skin, tender texture. An absolute classic. #BaoDown",
    likes: "1,530",
    comments: "47"
  },
  {
    id: "insta5",
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80",
    caption: "Spicy Mapo Tofu that sings with Szechuan peppercorn. 🌶️",
    likes: "740",
    comments: "19"
  },
  {
    id: "insta6",
    imageUrl: "https://images.unsplash.com/photo-1626082896492-766af4eb6501?w=800&auto=format&fit=crop&q=80",
    caption: "Steamed, stuffed, pillowy soft. Signature baos everyday. 🥟",
    likes: "3,115",
    comments: "128"
  }
];

export default function InstagramGrid() {
  return (
    <section className="py-16 md:py-20 px-6 md:px-12 bg-charcoal border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="font-display text-xs font-bold tracking-[0.4em] text-neon-pink block mb-2">
              VISUAL FEED
            </span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-black text-2xl md:text-5xl lg:text-5xl tracking-tighter uppercase text-white leading-tight"
            >
              FOLLOW THE CHAOS <span className="text-neon-blue font-light italic text-glow-blue">@neonlotusla</span>
            </motion.h2>
          </div>
          
          <a 
            href="https://instagram.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-display text-[10px] font-bold tracking-widest hover:text-neon-red transition-colors text-bone/80 hover:text-white uppercase shrink-0 pt-2 border-b border-transparent hover:border-neon-red duration-300"
          >
            OPEN FEED <Instagram size={14} />
          </a>
        </div>

        {/* 6-Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {INSTA_POSTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group relative aspect-square overflow-hidden bg-black/40 border border-white/5 cursor-pointer"
            >
              <img 
                src={post.imageUrl} 
                alt={post.caption}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-700 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay with details */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10 text-left">
                <div className="flex gap-4 mb-3 text-white">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <Heart size={14} className="text-neon-red fill-current" /> {post.likes}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <MessageCircle size={14} className="text-neon-blue" /> {post.comments}
                  </div>
                </div>
                <p className="text-[10px] text-bone/60 leading-relaxed font-medium line-clamp-2">
                  {post.caption}
                </p>
              </div>

              {/* Decorative Glow on Hover */}
              <div className="absolute inset-0 border border-white/0 group-hover:border-neon-blue/25 transition-all pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
