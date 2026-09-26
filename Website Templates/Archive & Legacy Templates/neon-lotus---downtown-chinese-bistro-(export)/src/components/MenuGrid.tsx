import { motion } from "motion/react";
import { Flame, Leaf, WheatOff } from "lucide-react";

const MENU_SECTIONS = [
  {
    name: "Chef's Specials",
    items: [
      {
        title: "Truffle Lotus Siu Mai",
        description: "Hand-chopped pork and shrimp Siu Mai elevated with cold-pressed black truffle oil and crunchy lotus root.",
        category: "CHEF'S PICK",
        icons: ["SPICY"],
        image: "https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&q=80&w=800",
        id: "spec-1"
      },
      {
        title: "Midnight Garlic Prawns",
        description: "Jumbo tiger prawns flash-seared with three types of garlic and crispy chili flakes. A spicy downtown favorite.",
        category: "NEW",
        icons: ["SPICY", "GF"],
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=800",
        id: "spec-2"
      },
      {
        title: "Imperial Duck Slider",
        description: "Crispy skin Peking duck, thick-cut cucumber, and Hoisin reduction served in a toasted charcoal brioche bun.",
        category: "SIGNATURE",
        icons: [],
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800",
        id: "spec-3"
      },
      {
        title: "Crispy Sichuan Gold Ribs",
        description: "Heritage pork ribs flash-fried and tossed in salted duck egg yolk sand, crushed Sichuan peppercorns, and toasted garlic.",
        category: "SEASONAL",
        icons: ["SPICY"],
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
        id: "spec-4"
      }
    ]
  },
  {
    name: "Dim Sum & Small Plates",
    items: [
      {
        title: "Crystal Jade Dumplings",
        description: "Translucent skin with a succulent shrimp filling and hints of ginger. Hand-folded with precision.",
        category: "MANDATORY",
        icons: ["GF"],
        image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fm=webp&fit=crop&q=80&w=800",
        id: "dish-1"
      },
      {
        title: "Crispy Duck Bao",
        description: "Flash-fried bao buns stuffed with 12-hour slow-roasted duck and fermented plum sauce.",
        category: "HOUSE SPECIAL",
        icons: [],
        image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?auto=format&fm=webp&fit=crop&q=80&w=800",
        id: "dish-3"
      }
    ]
  },
  {
    name: "Main Wok Fry",
    items: [
      {
        title: "Wok Hei Beef Ho Fun",
        description: "Wide rice noodles seared with intense heat for that smokey 'Wok Hei' essence, bean sprouts, and scallions.",
        category: "CLASSIC",
        icons: ["SPICY"],
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
        id: "dish-2"
      },
      {
        title: "Maple Mustard Tofu",
        description: "Crispy organic tofu cubes tossed in a sweet-sharp maple glaze with charred snap peas.",
        category: "VEGGIE",
        icons: ["V", "GF"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
        id: "dish-4"
      }
    ]
  }
];

const DietaryIcon = ({ type }: { type: string; key?: string }) => {
  switch (type.toUpperCase()) {
    case "SPICY":
    case "CLASSIC": // Mapping some categories to representative icons
      return <Flame size={14} className="text-neon-red" title={type} />;
    case "V":
    case "VEGGIE":
      return <Leaf size={14} className="text-neon-blue" title={type} />;
    case "GF":
    case "MANDATORY":
      return <WheatOff size={14} className="text-bone/40" title={type} />;
    default: return null;
  }
};

export default function MenuGrid() {
  return (
    <section id="menu" className="py-16 md:py-20 px-6 md:px-12 bg-white text-charcoal">
      <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="font-display font-black text-[clamp(3.5rem,10vw,8rem)] tracking-tighter uppercase leading-[0.85]">
            Selected <br />
            <span className="text-neon-red">Flavors</span>
          </h2>
        </div>
        <p className="max-w-sm text-charcoal/60 font-medium">
          Ancient techniques meet downtown energy. Our wok is seasoned with generations of flavor and refined for the modern palate.
        </p>
      </div>

      {MENU_SECTIONS.map((section, sectionIdx) => (
        <div key={section.name} className={sectionIdx > 0 ? "mt-24 md:mt-32" : ""}>
          <h3 className="font-display font-bold text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] uppercase text-charcoal/40 mb-8 md:mb-12 border-b border-charcoal/10 pb-4">
            {section.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {section.items.map((dish, i) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group flex flex-col sm:flex-row gap-6 md:gap-8 items-start sm:items-center text-left"
              >
                <div className="relative w-full sm:w-48 aspect-square overflow-hidden shrink-0">
                  <img 
                    src={dish.image} 
                    alt={dish.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300 ease-in-out will-change-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-neon-red/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 items-center">
                        {/* Show category as icon if it maps, otherwise show as stylized text */}
                        {(() => {
                          const hasIcon = ["SPICY", "CLASSIC", "V", "VEGGIE", "GF", "MANDATORY"].includes(dish.category.toUpperCase());
                          if (hasIcon) return <DietaryIcon type={dish.category} />;
                          return <span className="text-[9px] font-black tracking-[0.2em] text-neon-blue uppercase">{dish.category}</span>;
                        })()}
                       
                       {/* Show dietary icons */}
                       {dish.icons.map((icon) => (
                         <DietaryIcon key={icon} type={icon} />
                       ))}
                    </div>
                  </div>
                  <h4 className="font-display font-black text-2xl uppercase mb-3 group-hover:text-neon-blue transition-colors">
                    {dish.title}
                  </h4>
                  <p className="text-sm text-charcoal/60 leading-relaxed max-w-md menu-item-description">
                    {dish.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
      
      <style>{`
        .menu-item-description {
          text-shadow: 0 0 10px rgba(0, 242, 255, 0.3);
        }
        @media (max-width: 768px) {
          .menu-item-description {
            text-shadow: none !important;
          }
        }
      `}</style>
      
      <div className="mt-20 text-center">
        <button className="bg-charcoal text-white px-12 py-5 font-display font-black text-xs tracking-widest hover:bg-neon-red transition-all">
          DOWNLOAD ENTIRE MENU (PDF)
        </button>
      </div>
    </section>
  );
}
