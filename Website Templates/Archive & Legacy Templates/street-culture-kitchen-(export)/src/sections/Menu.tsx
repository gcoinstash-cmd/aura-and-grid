import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { menuData, MenuItem } from "../data/menuData";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Flame, Star, Coffee, Sparkles, X, Plus, Info, ShoppingBag, ExternalLink, ShieldCheck, Check } from "lucide-react";
import { usePlatter, ADD_ONS } from "../context/PlatterContext";

interface ItemSpecs {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string[];
}

const ITEM_SPECS_MAP: Record<string, ItemSpecs> = {
  "taco-01": {
    calories: "320 kcal",
    protein: "22g",
    carbs: "18g",
    fat: "14g",
    ingredients: ["A5 Wagyu Brisket", "Charcoal-infused corn tortilla", "Wild scallion cream", "Micro-greens", "White-truffle oil"]
  },
  "SEC // TACO-02": {
    calories: "340 kcal",
    protein: "24g",
    carbs: "22g",
    fat: "14g",
    ingredients: ["Citrus-marinated pork al pastor", "Seared carne asada strips", "Caramelized pineapple chunks", "Salsa verde", "Fresh micro-cilantro foliage", "Double-layered corn tortillas"]
  },
  "taco-03": {
    calories: "240 kcal",
    protein: "6g",
    carbs: "24g",
    fat: "12g",
    ingredients: ["Muddled avocado", "Fire-seared sweetcorn", "Pickled watermelon rinds", "Sweet hot-honey reduction", "Hemp flour tortilla"]
  },
  "burrito-01": {
    calories: "780 kcal",
    protein: "38g",
    carbs: "65g",
    fat: "28g",
    ingredients: ["24-hour beef brisket", "Triple cheese weld", "Gold cilantro rice", "Smokey refried beans", "Jumbo flour skin"]
  },
  "sides-01": {
    calories: "450 kcal",
    protein: "8g",
    carbs: "48g",
    fat: "24g",
    ingredients: ["Idaho russet potatoes", "Smoked truffle dust", "Cotija cheese crumbles", "Chili-lime crema", "Dynamic herbs"]
  },
  "drinks-01": {
    calories: "110 kcal",
    protein: "0g",
    carbs: "26g",
    fat: "0g",
    ingredients: ["Matcha nectar", "Fresh squeezed lime", "Wild cactus honey syrup", "Carbonated mineral water", "Activated botanicals"]
  }
};

export const Menu: React.FC = () => {
  const { addToPlatter, setIsPlatterOpen } = usePlatter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPOSBridge, setShowPOSBridge] = useState(false);
  const [dietaryOnly, setDietaryOnly] = useState(false);

  // Filter Categories matching our dataset
  const CATEGORIES = [
    { id: "all", name: "ALL" },
    { id: "Tacos", name: "TACOS" },
    { id: "Burritos", name: "BURRITOS" },
    { id: "Sides", name: "SIDES" },
    { id: "Drinks", name: "DRINKS" }
  ];

  const isDietaryItem = (item: MenuItem) => {
    return item.tags.some(tag => {
      const t = tag.toLowerCase();
      return t.includes("vegan") || t.includes("gluten-free");
    });
  };

  const baseFilteredItems = activeCategory === "all"
    ? menuData
    : menuData.filter((item) => item.category.toLowerCase() === activeCategory.toLowerCase());

  const filteredItems = dietaryOnly
    ? baseFilteredItems.filter(isDietaryItem)
    : baseFilteredItems;

  const handleOpenItem = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedAddOns([]);
  };

  const handleAddToOrder = (itemName: string, customAddonsCount = 0) => {
    const suffix = customAddonsCount > 0 ? ` (WITH ${customAddonsCount} ADD-ONS)` : "";
    setToastMessage(`SUCCESSFULLY ADDED ${itemName.toUpperCase()}${suffix} TO VIRTUAL PLATTER!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handlePOSRedirect = (platform: string) => {
    // =========================================================================
    // DEVELOPER HOOKUP // INSERT YOUR POS LINK HERE / ONLINE ORDERING LINK
    // =========================================================================
    // Replace the default fallback below with your store's specific production links:
    // - Toast POS: "https://www.toasttab.com/your-brand-slug/v3"
    // - Square: "https://your-brand-checkout.square.site"
    // - DoorDash: "https://www.doordash.com/store/your-brand-id"
    // =========================================================================
    setToastMessage(`REDIRECTING TO SECURE ${platform.toUpperCase()} CHECKOUT ROUTE...`);
    setTimeout(() => {
      setToastMessage(null);
      setShowPOSBridge(false);
      window.open("https://toasttab.com", "_blank", "noopener,noreferrer");
    }, 1200);
  };

  // Stagger animation variables for containers & items
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const gridItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const tabContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const tabItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  // Dynamic formula calculations for selected item modal
  const itemSpecs = selectedItem ? ITEM_SPECS_MAP[selectedItem.id] || {
    calories: "250 kcal",
    protein: "12g",
    carbs: "20g",
    fat: "10g",
    ingredients: ["Fresh hand-pressed corn tortilla", "Local farm herbs", "Sea salt blend"]
  } : null;

  const currentAddOnsTotal = ADD_ONS
    .filter(ao => selectedAddOns.includes(ao.id))
    .reduce((total, ao) => total + ao.price, 0);

  const finalComputedPrice = selectedItem ? selectedItem.price + currentAddOnsTotal : 0;

  return (
    <section id="menu" className="py-24 bg-[#0B0B0C] border-b border-brand-border px-6 relative">
      <div className="absolute top-0 left-[20%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs text-brand-accent uppercase tracking-widest font-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-accent animate-spin [animation-duration:6s]" /> THE FLAVOR INDEX // 100% CULT
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
              THE FLAVOR GRID <span className="text-brand-muted/70 font-sans normal-case font-normal text-xs sm:text-sm tracking-normal">(Our Menu)</span>
            </h2>
          </div>
          
          <p className="max-w-md text-sm text-brand-muted font-sans leading-relaxed text-left md:text-right">
            Browse our catalog of designed culinary items. Select any card below to inspect ingredients telemetry, custom add-ons, and compile a temporary platter.
          </p>
        </div>

        {/* Filter Toolbar: Categories Tabs + Premium Dietary Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-brand-border/40 pb-6">
          <motion.div 
            variants={tabContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none font-mono"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  variants={tabItemVariants}
                  id={`cat_tab_${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-3 text-xs font-black tracking-widest uppercase transition-all duration-200 cursor-pointer border select-none rounded-sm ${
                    isActive
                      ? "bg-brand-accent text-black border-brand-accent hover:opacity-90 font-black glow-accent"
                      : "bg-brand-card text-brand-muted border-brand-border hover:border-brand-text/30 hover:text-white"
                  }`}
                >
                  {cat.name}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Premium Dietary Selector Technical Toggle */}
          <div className="flex items-center">
            <button
              id="dietary-toggle"
              onClick={() => setDietaryOnly(!dietaryOnly)}
              className={`group flex items-center gap-3 px-4 py-3 border font-mono text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer select-none rounded-sm ${
                dietaryOnly
                  ? "bg-brand-accent/10 border-brand-accent text-brand-accent glow-accent"
                  : "bg-brand-card border-brand-border text-brand-muted hover:border-brand-text/40 hover:text-white"
              }`}
            >
              <span className="uppercase text-[11px] font-black tracking-widest flex items-center gap-2">
                DIETARY MATRIX // VEGAN & GF
                <span className="relative flex h-2 w-2">
                  {dietaryOnly ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#475569]"></span>
                  )}
                </span>
              </span>

              {/* Technical switch toggle pill visual */}
              <div className="relative w-9 h-5 bg-[#0e0e10] border border-brand-border rounded-full flex items-center p-0.5 transition-colors duration-300">
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`w-3.5 h-3.5 rounded-full ${
                    dietaryOnly ? "bg-brand-accent" : "bg-[#475569] group-hover:bg-[#64748b]"
                  }`}
                  style={{
                    marginLeft: dietaryOnly ? "auto" : "0",
                    marginRight: dietaryOnly ? "0" : "auto"
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Live Filter Counter */}
        <div className="flex justify-between items-center text-xs font-mono text-brand-muted">
          <span>SHOWING {filteredItems.length} OF {menuData.length} CUSTOMIZABLE SEGMENTS</span>
          <span className="text-brand-accent uppercase">● system_radar matched</span>
        </div>

        {/* Staggered Menu Items Grid triggered upon activeCategory switch */}
        <motion.div 
          layout
          variants={gridContainerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                variants={gridItemVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="h-full flex flex-col"
              >
                <Card 
                  className="h-full flex flex-col justify-between group cursor-pointer"
                  delayIndex={index}
                >
                  <div className="space-y-4" onClick={() => handleOpenItem(item)}>
                    
                    {/* Visual Card Image Cover */}
                    <div className="relative aspect-[4/3] bg-brand-bg border border-brand-border/40 overflow-hidden rounded-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        loading="lazy"
                      />
                      
                      {/* Badge Tags on Card */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        {item.tags.map((tag, tagIdx) => {
                          const isSpecial = tag.toLowerCase().includes("spicy") || tag.toLowerCase().includes("chef");
                          return (
                            <span
                              key={tagIdx}
                              className={`backdrop-blur-md text-[9px] font-mono font-bold px-2.5 py-1 border uppercase rounded-sm ${
                                isSpecial 
                                  ? "bg-brand-orange/90 text-white border-brand-orange/60" 
                                  : "bg-black/85 text-brand-accent border-brand-border/80"
                              }`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>

                      {/* Live aesthetic sector code */}
                      <div className="absolute bottom-3 right-3 bg-black/80 text-brand-muted text-[8px] font-mono py-0.5 px-2 border border-brand-border rounded-sm">
                        SEC // {item.id.toUpperCase()}
                      </div>
                    </div>

                    {/* Food Metadata Title Row */}
                    <div className="space-y-1 text-left">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-display text-lg font-black text-white group-hover:text-brand-accent transition-colors duration-200 uppercase leading-[1.1]">
                          {item.name}
                        </h3>
                        <span className="font-mono text-sm font-extrabold text-brand-accent flex-shrink-0">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Food Editorial Description */}
                    <p className="text-xs text-brand-muted font-sans leading-relaxed text-left line-clamp-2">
                      {item.description}
                    </p>

                  </div>

                  {/* Immediate Action Row */}
                  <div className="pt-5 mt-5 border-t border-brand-border/60 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenItem(item)}
                      className="flex-1 py-2.5 h-10 gap-1.5 text-[10px]"
                    >
                      <Info className="w-3.5 h-3.5" /> DETAIL RAW
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToPlatter(item, [], 1);
                        handleAddToOrder(item.name);
                        setIsPlatterOpen(true);
                      }}
                      className="flex-1 py-2.5 h-10 gap-1 text-[10px] bg-brand-accent border-brand-accent hover:bg-[#8E8E93]"
                    >
                      <Plus className="w-3.5 h-3.5 text-black" /> SECURE BITE
                    </Button>
                  </div>

                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Brand Prominent "Order Online" POS Platform Bridge Bottom Panel */}
        <div className="pt-8 border-t border-brand-border flex flex-col items-center text-center space-y-6">
          <div className="max-w-xl space-y-2">
            <span className="font-mono text-[10px] text-brand-orange tracking-widest uppercase font-bold block">
              // POS INTEROPERABILITY BRIDGE <span className="text-brand-muted/80 font-sans normal-case font-normal text-[9px] tracking-normal">(Online Ordering)</span>
            </span>
            <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">
              SKIP THE WAIT. LOCK YOUR MEAL.
            </h3>
            <p className="text-xs text-brand-muted font-sans leading-relaxed">
              Our culinary platform bridges directly into active point-of-sale systems. Secure your pickup stop instantly through encrypted order routers.
            </p>
          </div>

          <Button
            variant="orange"
            size="lg"
            onClick={() => setShowPOSBridge(true)}
            className="h-14 px-10 tracking-widest text-xs flex items-center gap-2 select-none"
          >
            <ShoppingBag className="w-4 h-4 text-white" /> ORDER ONLINE NOW (POS BRIDGE)
          </Button>

          <div className="flex justify-center items-center gap-4 text-brand-muted font-mono text-[9px] uppercase">
            <span>✓ toast compatibility</span>
            <span>✓ square checkout</span>
            <span>✓ doordash priority</span>
          </div>
        </div>

      </div>

      {/* Item Inspection MODAL and Backdrop overlay */}
      <AnimatePresence>
        {selectedItem && itemSpecs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl bg-brand-card border border-brand-border p-6 sm:p-8 overflow-hidden rounded-sm my-8 z-10"
            >
              {/* Corner decor brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-accent" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-accent" />
              
              <button
                id="close_item_modal_button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-1.5 bg-brand-bg/50 hover:bg-brand-border text-brand-muted hover:text-white transition-colors duration-200 border border-brand-border rounded-full select-none cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Modal Left Column: Image placeholder, Calorie/Macro telemetry table */}
                <div className="md:col-span-5 space-y-6">
                  <div className="relative aspect-square w-full bg-brand-bg border border-brand-border rounded-sm overflow-hidden">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-black/90 font-mono text-[9px] text-brand-accent px-2 py-0.5 border border-brand-border rounded-sm">
                      ID // {selectedItem.id.toUpperCase()}-SECTOR
                    </div>
                  </div>

                  {/* Micro nutritional table specs */}
                  <div className="space-y-2 p-4 bg-brand-bg/50 border border-brand-border/60 rounded-sm">
                    <span className="block font-mono text-[9px] text-brand-orange uppercase font-bold tracking-widest text-left">
                      // MACRO/CALORIC TELEMETRY
                    </span>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div className="flex justify-between py-1 border-b border-brand-border/40 text-left">
                        <span className="text-brand-muted">Calories:</span>
                        <span className="text-white font-bold">{itemSpecs.calories}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-brand-border/40 text-left">
                        <span className="text-brand-muted">Protein:</span>
                        <span className="text-white font-bold">{itemSpecs.protein}</span>
                      </div>
                      <div className="flex justify-between py-1 text-left">
                        <span className="text-brand-muted">Carbs:</span>
                        <span className="text-white font-bold">{itemSpecs.carbs}</span>
                      </div>
                      <div className="flex justify-between py-1 text-left">
                        <span className="text-brand-muted">Fats:</span>
                        <span className="text-white font-bold">{itemSpecs.fat}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Right Column: Description, Ingredients spec breakdown, Interactive Add-Ons list, Real-time calculator */}
                <div className="md:col-span-7 space-y-6 text-left">
                  <div className="space-y-1">
                    <span className="inline-block font-mono text-[10px] text-brand-orange tracking-widest uppercase font-bold">
                      // CATEGORY: {selectedItem.category.toUpperCase().replace("-", " ")}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase leading-none tracking-tight">
                      {selectedItem.name}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-text/90 font-sans leading-relaxed">
                    {selectedItem.description}
                  </p>

                  {/* Ingredients breakdown */}
                  <div className="space-y-2">
                    <span className="block font-mono text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                      SPECIFICATIONS / INGREDIENTS LIST:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {itemSpecs.ingredients.map((ing, idx) => (
                        <span key={idx} className="bg-brand-bg text-[9px] font-mono text-brand-muted border border-brand-border py-1 px-2.5 uppercase rounded-sm">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Add-Ons checklist */}
                  <div className="space-y-3 pt-3 border-t border-brand-border/60">
                    <span className="block font-mono text-[9px] text-brand-orange uppercase font-bold tracking-widest">
                      // PLATTER CUSTOMIZATION ADD-ONS
                    </span>
                    <div className="space-y-2">
                      {ADD_ONS.map((addon) => {
                        const isChecked = selectedAddOns.includes(addon.id);
                        return (
                          <div 
                            key={addon.id} 
                            onClick={() => {
                              if (isChecked) {
                                setSelectedAddOns(selectedAddOns.filter(id => id !== addon.id));
                              } else {
                                setSelectedAddOns([...selectedAddOns, addon.id]);
                              }
                            }}
                            className={`flex items-center justify-between p-3 rounded-sm border transition-all duration-200 select-none cursor-pointer ${
                              isChecked 
                                ? "bg-brand-accent/10 border-brand-accent/50 text-white" 
                                : "bg-brand-bg border-brand-border hover:border-brand-text/30 text-brand-muted"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 border flex items-center justify-center rounded-sm transition-colors ${
                                isChecked ? "bg-brand-accent border-brand-accent text-black" : "border-brand-border"
                              }`}>
                                {isChecked && <Check className="w-3 h-3 stroke-[4]" />}
                              </div>
                              <span className="font-mono text-xs font-bold uppercase">{addon.name}</span>
                            </div>
                            <span className="font-mono text-xs text-brand-accent font-black">+${addon.price.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Real-time Dynamic Sum Counter and actions */}
                  <div className="pt-4 border-t border-brand-border/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-brand-muted uppercase font-bold">TOTAL PRICE FORMULA:</span>
                      
                      <div className="flex items-center gap-2">
                        {selectedAddOns.length > 0 && (
                          <span className="text-[10px] font-mono text-brand-muted tracking-tight">
                            (${selectedItem.price.toFixed(2)} BASE + ${currentAddOnsTotal.toFixed(2)} ADDONS) = 
                          </span>
                        )}
                        <span className="font-display text-2xl font-black text-brand-accent transition-all duration-300">
                          ${finalComputedPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        className="flex-1 h-12 text-xs flex items-center justify-center gap-2"
                        onClick={() => {
                          addToPlatter(selectedItem, selectedAddOns, 1);
                          handleAddToOrder(selectedItem.name, selectedAddOns.length);
                          setSelectedItem(null);
                          setIsPlatterOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 text-black" /> CONFIRM TO PLATTER
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-12 text-xs px-5 font-mono"
                        onClick={() => setSelectedItem(null)}
                      >
                        BACK
                      </Button>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive POS Platform Bridge Modal Dialog */}
      <AnimatePresence>
        {showPOSBridge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPOSBridge(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35 }}
              className="relative w-full max-w-lg bg-brand-card border border-brand-border p-6 sm:p-8 rounded-sm select-none"
            >
              <div className="space-y-6 text-left">
                
                {/* Header info */}
                <div className="flex justify-between items-center pb-3 border-b border-brand-border">
                  <span className="font-mono text-xs text-brand-accent tracking-widest uppercase font-bold">POS TRANSFER CORE <span className="text-brand-muted/70 font-sans normal-case font-normal text-[10px] tracking-normal">(Online Checkout)</span></span>
                  <button 
                    onClick={() => setShowPOSBridge(false)}
                    className="text-brand-muted hover:text-white cursor-pointer select-none"
                    aria-label="Close transfer core"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                    SELECT POS GATEWAY
                  </h3>
                  <p className="text-xs text-brand-muted font-sans leading-relaxed">
                    Choose your priority checkout routing system. This simulation transfers checkout metadata into production-ready endpoints nicely.
                  </p>
                </div>

                {/* Platforms Option List */}
                <div className="space-y-3">
                  <button
                    onClick={() => handlePOSRedirect("Toast POS")}
                    className="w-full flex items-center justify-between p-4 bg-brand-bg hover:bg-brand-card-hover border border-brand-border hover:border-brand-accent transition-all duration-200 cursor-pointer text-left"
                  >
                    <div className="space-y-1">
                      <span className="block font-display text-sm font-black text-white uppercase">ROUTE 01 // TOAST PLATFORM</span>
                      <span className="block text-[10px] font-mono text-brand-muted">Recommended for direct pickup counters</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-brand-accent" />
                  </button>

                  <button
                    onClick={() => handlePOSRedirect("Square Reader")}
                    className="w-full flex items-center justify-between p-4 bg-brand-bg hover:bg-brand-card-hover border border-brand-border hover:border-brand-accent transition-all duration-200 cursor-pointer text-left"
                  >
                    <div className="space-y-1">
                      <span className="block font-display text-sm font-black text-white uppercase">ROUTE 02 // SQUARE ONLINE</span>
                      <span className="block text-[10px] font-mono text-brand-muted">Optimal for secure digital wallets & cards</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-brand-accent" />
                  </button>

                  <button
                    onClick={() => handlePOSRedirect("DoorDash")}
                    className="w-full flex items-center justify-between p-4 bg-brand-bg hover:bg-brand-card-hover border border-brand-border hover:border-brand-accent transition-all duration-200 cursor-pointer text-left"
                  >
                    <div className="space-y-1">
                      <span className="block font-display text-sm font-black text-white uppercase">ROUTE 03 // DOORDASH MARKET</span>
                      <span className="block text-[10px] font-mono text-brand-muted">For immediate courier drops</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-brand-accent" />
                  </button>
                </div>

                <div className="p-3 bg-brand-accent/5 border border-brand-accent/10 flex items-center gap-2 text-[10px] font-mono text-brand-muted">
                  <ShieldCheck className="w-4 h-4 text-brand-accent flex-shrink-0" />
                  <span>Verified 256-bit secure checkout handshake protocols</span>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* High-fidelity immediate toast feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            id="toast_container_order"
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-brand-accent text-black font-mono text-xs font-bold tracking-widest px-6 py-4 border border-brand-accent glow-accent uppercase whitespace-nowrap rounded-sm"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
