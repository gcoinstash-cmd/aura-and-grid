import { motion } from 'motion/react';
import { Star, Flame, Award, Heart, ShoppingBag } from 'lucide-react';

const MENU_ITEMS = [
  {
    id: 1,
    name: 'The Classic Noir',
    price: '$14',
    desc: 'Wagyu beef blend, aged cheddar, charcoal brioche, truffle aioli, pickled shallots.',
    tag: 'Signature',
    icon: Star,
    color: 'bg-amber-500/10 text-amber-500',
    img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    name: 'Inferno Crisp Fries',
    price: '$8',
    desc: 'Double-fried Kennebec potatoes, hot honey glaze, habanero dust, sea salt.',
    tag: 'Spicy',
    icon: Flame,
    color: 'bg-red-500/10 text-red-500',
    img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 3,
    name: 'Velvet Gold Shake',
    price: '$10',
    desc: 'Madagascar vanilla bean, honey honeycomb crunch, edible gold leaf, fresh cream.',
    tag: 'Premium',
    icon: Award,
    color: 'bg-yellow-500/10 text-yellow-500',
    img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: 'The Smokehouse King',
    price: '$16',
    desc: 'Double patty, house-smoked bacon, bourbon BBQ sauce, onion hay, Swiss cheese.',
    tag: 'Best Seller',
    icon: Heart,
    color: 'bg-blue-500/10 text-blue-500',
    img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=600'
  }
];

export default function Menu() {
  return (
    <section id="menu" className="pt-20 pb-12 bg-brand-surface/50 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-left">
          <div className="max-w-2xl text-left">
            <h2 className="text-brand-primary font-sans font-bold tracking-[0.2em] uppercase text-sm mb-4">The Collection</h2>
            <h3 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">CRAFTED FOR THE <br/> <span className="text-white/40 uppercase">TRUE AFICIONADO.</span></h3>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-brand-dark transition-all">All</button>
            <button className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-brand-primary text-white/50 hover:text-brand-primary transition-all">Burgers</button>
            <button className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-brand-primary text-white/50 hover:text-brand-primary transition-all">Sides</button>
            <button className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-brand-primary text-white/50 hover:text-brand-primary transition-all">Drinks</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {MENU_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group glass p-2 rounded-[32px] hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-500 text-left flex flex-col h-full"
            >
              <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[24px] overflow-hidden mb-6 shrink-0">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 backdrop-blur-md bg-black/40 border border-white/10 ${item.color.split(' ')[1]}`}>
                    <item.icon size={12} />
                    {item.tag}
                  </span>
                </div>
              </div>
              <div className="px-4 pb-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h4 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tighter leading-tight group-hover:text-brand-primary transition-colors">{item.name}</h4>
                  <span className="font-display font-black text-lg sm:text-xl text-brand-primary shrink-0">{item.price}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium flex-1">
                  {item.desc}
                </p>
                <button className="w-full py-3 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest group-hover:bg-brand-primary group-hover:text-brand-dark bg-white/5 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0">
                  <ShoppingBag size={14} /> ADD TO BASKET
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 glass p-8 md:p-12 rounded-[40px] flex flex-col md:flex-row items-center gap-12 overflow-hidden relative text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] pointer-events-none" />
          <div className="md:w-1/3 text-left">
             <div className="w-20 h-1 bg-brand-primary mb-6" />
             <h4 className="font-display text-4xl font-bold leading-tight uppercase mb-4 tracking-tighter">Full Menu Available <br/> For Shipping.</h4>
             <p className="text-gray-400 font-medium text-sm mb-8">We ship our raw frozen patties and house-made brioche buns nationwide. Grill the legend at home.</p>
             <button className="px-8 py-4 bg-white text-brand-dark rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">Shop National</button>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
             <div className="h-48 rounded-2xl bg-white/5 flex items-center justify-center p-8 border border-white/5 hover:border-brand-primary/30 transition-all cursor-default text-center">
                <div className="text-center">
                   <span className="block text-3xl font-display font-black mb-1">2.5M+</span>
                   <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold">Burgers Served</span>
                </div>
             </div>
             <div className="h-48 rounded-2xl bg-white/5 flex items-center justify-center p-8 border border-white/5 hover:border-brand-primary/30 transition-all cursor-default text-center">
                <div className="text-center">
                   <span className="block text-3xl font-display font-black mb-1">4.9/5</span>
                   <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold">Critic Reviews</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
