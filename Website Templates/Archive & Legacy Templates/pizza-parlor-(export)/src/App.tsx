import React, { useState, useEffect } from 'react';
import { initMenuFilters } from './menuFilter';
import { openMenuModal } from './menuModal';
import { submitFormToConfiguredService, WEB_AGENCY_FORM_CONFIG } from './formConfig';
import { ReservationWidget } from './ReservationWidget';
import { 
  Pizza as PizzaIcon, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Clock, 
  Sparkles, 
  MapPin, 
  CheckCircle, 
  ChevronRight, 
  RefreshCw,
  Search,
  MessageSquare
} from 'lucide-react';
import { 
  Pizza, 
  PizzaCategory, 
  CartItem, 
  CrustType, 
  SauceType, 
  CheeseType, 
  ToppingOption, 
  Reservation, 
  SeatingZone, 
  OrderStep, 
  OrderTracker 
} from './types';

/* ==========================================================================
   Static Configuration Data
   ========================================================================== */
const ARTISAN_PIZZAS: Pizza[] = [
  {
    id: 'pizza-margherita',
    name: 'Margherita Burrata',
    italianName: 'Margherita con Burrata',
    description: 'Crushed San Marzano tomatoes, fresh creamy Burrata Pugliese, hand-torn basil, crispy charred bubble crust, and a drizzle of raw Sicilian extra virgin olive oil.',
    price: 14.50,
    category: 'pizza',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80',
    ingredients: ['San Marzano Tomatoes', 'Creamy Burrata Pugliese', 'Fresh Basil Leaves', '48-hour Sourdough Crust', 'Sicilian EVOO'],
    allergens: ['Dairy', 'Gluten']
  },
  {
    id: 'pizza-diavola',
    name: 'Diavola Calabra',
    italianName: 'Diavola di Calabria',
    description: 'Fiery Calabrian salame, spicy Nduja dollops, fresh fior di latte mozzarella, crushed chili flakes, San Marzano tomato base, finished with organic local hot honey.',
    price: 16.00,
    category: 'pizza',
    isSpicy: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
    ingredients: ['Calabrian Salame', 'Spicy Nduja Salami', 'Fresh Fior di Latte', 'Hot Organic Honey', 'Crushed Chili'],
    allergens: ['Dairy', 'Gluten']
  },
  {
    id: 'pizza-formaggi',
    name: 'Four Cheese Bianca',
    italianName: 'Quattro Formaggi Cremosa',
    description: 'Creamy white velvet ricotta sauce base, sweet Gorgonzola Dolce, scamorza, aged parmigiano-reggiano shavings, and fresh rosemary sprigs on hand-stretched sourdough.',
    price: 16.50,
    category: 'pizza',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=500&q=80',
    ingredients: ['Whipped Mountain Ricotta', 'Gorgonzola Dolce', 'Scamorza', 'Aged Parmigiano-Reggiano Shavings', 'Fresh Rosemary'],
    allergens: ['Dairy', 'Gluten']
  },
  {
    id: 'pizza-funghi',
    name: 'Truffled Forest Mushroom',
    italianName: 'Funghi e Tartufo Nero',
    description: 'Roasted wild mushrooms (porcini & cremini), dynamic truffle cream base, fresh mozzarella, chopped farm garlic, aromatic thyme, and high-smoke white truffle oil.',
    price: 17.50,
    category: 'pizza',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    image: 'https://images.unsplash.com/photo-1604917869287-3ae73c77e227?auto=format&fit=crop&w=500&q=80',
    ingredients: ['Wild Porcini Mushrooms', 'Cremini Mushrooms', 'Truffle Cream Base', 'Farm Garlic', 'Fresh Thyme', 'White Truffle Oil'],
    allergens: ['Dairy', 'Gluten']
  },
  {
    id: 'pizza-prosciutto',
    name: 'Prosciutto Parma Estate',
    italianName: 'Prosciutto e Rucola fresca',
    description: 'Delicate light cheese crust baked first, topped chilled with paper-thin 24-Month Prosciutto di Parma, peppery wild arugula, shaved parmesan, and a splash of lemon vinaigrette.',
    price: 18.50,
    category: 'pizza',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=500&q=80',
    ingredients: ['24-Month Prosciutto di Parma', 'Peppery Wild Arugula', 'Shaved Parmigiano-Reggiano', 'Amalfi Lemon Vinaigrette', 'Light Sourdough Base'],
    allergens: ['Dairy', 'Gluten']
  },
  {
    id: 'pizza-orto',
    name: 'Sardinian Garden',
    italianName: 'Orto di Sardegna',
    description: 'Zesty basil oil brush, soft vegan mozzarella blocks, roasted red peppers, baby artichoke hearts, grilled zucchini strips, and sweet dark balsamic reduction drops.',
    price: 15.50,
    category: 'pizza',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=500&q=80',
    ingredients: ['Roasted Red Peppers', 'Baby Artichokes', 'Zucchini Strips', 'Vegan Mozzarella', 'Sweet Basil Oil', 'Balsamic Reduction'],
    allergens: []
  },
  {
    id: 'pasta-tartufo',
    name: 'Truffle Tagliolini',
    italianName: 'Tagliolini al Tartufo Nero',
    description: 'Hand-rolled fresh egg tagliolini tossed with fragrant black summer truffles, rich mountain butter, aged Parmigiano-Reggiano, and dynamic baby herb curls.',
    price: 19.50,
    category: 'pasta',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=500&q=80',
    ingredients: ['Fresh Egg Tagliolini', 'Black Summer Truffles', 'Mountain Butter', 'Aged Parmigiano', 'Garlic Micro-greens'],
    allergens: ['Gluten', 'Eggs', 'Dairy']
  },
  {
    id: 'pasta-ragu',
    name: 'Wild Boar Pappardelle',
    italianName: 'Pappardelle al Cinghiale',
    description: 'Wide bronze-drawn ribbon pasta paired with a rich, twelve-hour slow-simmered Tuscan wild boar ragù, organic rosemary sprigs, and aged Pecorino Romano.',
    price: 21.00,
    category: 'pasta',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
    ingredients: ['Bronze-Drawn Pappardelle', 'Slow-Simmered Tuscan Wild Boar', 'Fresh Rosemary', 'Aged Pecorino Romano'],
    allergens: ['Gluten', 'Dairy']
  },
  {
    id: 'pasta-gamberi',
    name: 'Lemon Shrimp Linguine',
    italianName: 'Linguine al Limone e Gamberi',
    description: 'Sautéed wild Mediterranean prawns over bronze-cut linguine, splash of Pinot Grigio, Amalfi lemon zest, cold-pressed olive oil, and crushed chili.',
    price: 22.50,
    category: 'pasta',
    isSpicy: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=500&q=80',
    ingredients: ['Bronze-Drawn Linguine', 'Wild Mediterranean Prawns', 'Amalfi Lemon Zest', 'Pinot Grigio Reduction', 'Chili Flakes'],
    allergens: ['Gluten', 'Shellfish']
  },
  {
    id: 'dessert-tiramisu',
    name: 'Traditional Tiramisu',
    italianName: 'Tiramisù Classico della Casa',
    description: 'Espresso-soaked ladyfinger biscuits nested in whipped sweet mascarpone cream and vintage Marsala wine, finished with organic Dutch cocoa dust.',
    price: 8.50,
    category: 'dessert',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&q=80',
    ingredients: ['Espresso Ladyfingers', 'Whipped Mascarpone Cream', 'Vintage Marsala Wine', 'Organic Cocoa Powder'],
    allergens: ['Eggs', 'Dairy', 'Gluten']
  },
  {
    id: 'dessert-cannoli',
    name: 'Sicilian Cannoli Duo',
    italianName: 'Cannoli Siciliani Artigianali',
    description: 'Crispy pastry tubes piped to order with sweet sheep milk ricotta, dark chocolate curls, candied orange peels, and crushed organic Bronte pistachios.',
    price: 9.00,
    category: 'dessert',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=80',
    ingredients: ['Crispy Pastry Shell', 'Sweet Sheep Ricotta', 'Bronte Pistachios', 'Dark Chocolate Chips', 'Candied Orange Peel'],
    allergens: ['Dairy', 'Gluten', 'Tree Nuts']
  }
];

const TOPPINGS_OPTIONS: ToppingOption[] = [
  { id: 'prosciutto', name: 'Prosciutto di Parma', italianName: 'Prosciutto di Parma', price: 3.00, type: 'meat', color: '#DF7169' },
  { id: 'salami', name: 'Spicy Calabrese Salami', italianName: 'Salame Calabrese', price: 2.50, type: 'meat', color: '#A51A12' },
  { id: 'basil', name: 'Fresh Sweet Basil Leaves', italianName: 'Basilico Fresco', price: 1.00, type: 'veggie-herb', color: '#3B753A' },
  { id: 'mushroom', name: 'Sautéed Wild Porcini', italianName: 'Funghi Porcini', price: 1.50, type: 'veggie-herb', color: '#DFDAD3' },
  { id: 'onion', name: 'Caramelized Sweet Onions', italianName: 'Cipolla Caramellata', price: 1.25, type: 'veggie-herb', color: '#84305D' },
  { id: 'olives', name: 'Sicilian Black Olives', italianName: 'Olive Nere', price: 1.25, type: 'veggie-herb', color: '#1A1A1A' },
  { id: 'truffle', name: 'White Truffle Oil Finish', italianName: 'Olio al Tartufo Bianco', price: 2.50, type: 'veggie-herb', color: '#C29E57' },
  { id: 'arugula', name: 'Fresh Peppery Arugula', italianName: 'Rucola Selvatica', price: 1.25, type: 'veggie-herb', color: '#4C823B' }
];

/* Pre-calculated scatter points to populate toppings naturally on the virtual canvas circles */
const CANVAS_COORDINATES = [
  { top: '35%', left: '46%', rotate: '15deg' },
  { top: '48%', left: '26%', rotate: '-25deg' },
  { top: '24%', left: '33%', rotate: '70deg' },
  { top: '30%', left: '68%', rotate: '-45deg' },
  { top: '65%', left: '55%', rotate: '110deg' },
  { top: '56%', left: '74%', rotate: '-90deg' },
  { top: '68%', left: '32%', rotate: '40deg' },
  { top: '51%', left: '49%', rotate: '185deg' }
];

const ORDER_STEPS_META: { step: OrderStep; title: string; italian: string; desc: string; textSound: string }[] = [
  { 
    step: 'dough', 
    title: 'Dough Fermentation & Stretching', 
    italian: 'Fermentazione e Lagna', 
    desc: 'Our dough has proofed for 48 hours. Master pizzaiolo is currently hand-stretching the sourdough base.', 
    textSound: '🪵 Soft slaps of dough on stone counters...' 
  },
  { 
    step: 'sauce', 
    title: 'Condimento Artigianale', 
    italian: 'Stesura del Pomodoro e Formaggi', 
    desc: 'Spoonfuls of San Marzano tomato puree and hand-ripped fior di latte are painted over the stretched dough.', 
    textSound: '🥄 Smooth spreading of tomato wood-scents...' 
  },
  { 
    step: 'wood-fire', 
    title: 'Baked in Wood-Fire Stove', 
    italian: 'Cottura nel Forno a Legna', 
    desc: 'Slide in! The pizza is exposed directly to hot brick walls at 485°C (900°F). Bubble crust bubbles instantly.', 
    textSound: '🔥 Crackling wood smoke and sizzling crust edges!' 
  },
  { 
    step: 'finish', 
    title: 'Garnishing & Slicing', 
    italian: 'Finitura e Taglio', 
    desc: 'Splashed with organic olive oil, hand-ripped basil, and cut cleanly with custom copper mezzaluna knives.', 
    textSound: '🔪 Whispers of steel slicing fresh crispy crust...' 
  },
  { 
    step: 'dispatched', 
    title: 'Out for Hand-Delivery', 
    italian: 'In Consegna su Vespa', 
    desc: 'Securely slipped into customized thermal heat wraps, resting comfortably on a Vespa heading your way.', 
    textSound: '🛵 Vespa engine humming on cobblestone lanes... Enjoy!' 
  }
];

export default function App() {
  /* ==========================================================================
     State Managers
     ========================================================================== */
  const [activeTab, setActiveTab] = useState<'menu' | 'builder' | 'reservations'>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderTracker, setOrderTracker] = useState<OrderTracker | null>(null);

  // Initialize vanilla JavaScript category filtering when menu tab mounts
  useEffect(() => {
    if (activeTab === 'menu') {
      const timer = setTimeout(() => {
        initMenuFilters();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);
  
  /* Custom Builder State */
  const [builderCrust, setBuilderCrust] = useState<CrustType>('neapolitan');
  const [builderSauce, setBuilderSauce] = useState<SauceType>('san-marzano');
  const [builderCheese, setBuilderCheese] = useState<CheeseType>('fior-di-latte');
  const [builderToppings, setBuilderToppings] = useState<string[]>([]);
  const [customPizzaLabel, setCustomPizzaLabel] = useState<string>('Custom Sourdough Sensation');

  /* Table Reservations state */
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('19:30');
  const [bookingZone, setBookingZone] = useState<SeatingZone>('wood-oven');
  const [bookingNotes, setBookingNotes] = useState('');
  const [showValidationErr, setShowValidationErr] = useState(false);
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  const [bookingTouched, setBookingTouched] = useState<Record<string, boolean>>({});

  /* Checkout Delivery Order Form State */
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>({});
  const [checkoutTouched, setCheckoutTouched] = useState<Record<string, boolean>>({});

  /* Loader submission states */
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);

  /* Dynamic simulation ticker for pizza wood-fire tracker */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (orderTracker && orderTracker.currentStep !== 'dispatched') {
      interval = setInterval(() => {
        setOrderTracker(prev => {
          if (!prev) return null;
          const steps: OrderStep[] = ['dough', 'sauce', 'wood-fire', 'finish', 'dispatched'];
          const currentIndex = steps.indexOf(prev.currentStep);
          if (currentIndex < steps.length - 1) {
            return {
              ...prev,
              currentStep: steps[currentIndex + 1]
            };
          }
          return prev;
        });
      }, 15000); // Progress to next phase every 15 seconds automatically
    }
    return () => clearInterval(interval);
  }, [orderTracker]);

  /* ==========================================================================
     Actions & Mutators
     ========================================================================== */
  const handleAddPizzaToCart = (pizza: Pizza) => {
    setCart(prevCart => {
      // Find standard addition (no customizations)
      const existingIndex = prevCart.findIndex(item => item.pizzaId === pizza.id && (!item.customizations || item.customizations.length === 0));
      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIndex].quantity += 1;
        return nextCart;
      } else {
        return [...prevCart, {
          id: `item-${Date.now()}-${pizza.id}`,
          pizzaId: pizza.id,
          name: pizza.name,
          italianName: pizza.italianName,
          price: pizza.price,
          quantity: 1
        }];
      }
    });
  };

  const handleAddCustomizedItemToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(existing => {
        if (existing.pizzaId !== item.pizzaId) return false;
        const currentCustoms = existing.customizations || [];
        const nextCustoms = item.customizations || [];
        if (currentCustoms.length !== nextCustoms.length) return false;
        return currentCustoms.every(v => nextCustoms.includes(v));
      });

      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIndex].quantity += item.quantity;
        return nextCart;
      } else {
        return [...prevCart, item];
      }
    });
  };

  const calculateCustomPizzaPrice = () => {
    let basePrice = 12.00; // Base sourdough pizza price
    if (builderCrust === 'gluten-free') basePrice += 3.00;
    
    if (builderCheese === 'buffalo-mozzarella') basePrice += 2.50;
    else if (builderCheese === 'gorgonzola') basePrice += 2.00;
    else if (builderCheese === 'vegan-mozz') basePrice += 1.50;

    builderToppings.forEach(topId => {
      const topOpt = TOPPINGS_OPTIONS.find(t => t.id === topId);
      if (topOpt) basePrice += topOpt.price;
    });

    return basePrice;
  };

  const handleToggleTopping = (toppingId: string) => {
    setBuilderToppings(prev => {
      if (prev.includes(toppingId)) {
        return prev.filter(id => id !== toppingId);
      } else {
        return [...prev, toppingId];
      }
    });
  };

  const handleAddCustomPizzaToCart = () => {
    const customPrice = calculateCustomPizzaPrice();
    const toppingsList = builderToppings
      .map(id => TOPPINGS_OPTIONS.find(t => t.id === id)?.name)
      .filter(Boolean) as string[];

    const toppingsSummary = `${builderCrust} crust, ${builderSauce} sauce, ${builderCheese} cheese, toppings: ${toppingsList.length ? toppingsList.join(', ') : 'none'}`;

    const cartInstance: CartItem = {
      id: `custom-${Date.now()}`,
      name: customPizzaLabel || 'Chef Pizza Lab Masterpiece',
      italianName: 'Creazione d\'Oro del Cliente',
      price: customPrice,
      quantity: 1,
      customPizza: {
        id: `pizza-${Date.now()}`,
        name: customPizzaLabel || 'Chef Pizza Lab Masterpiece',
        crust: builderCrust,
        sauce: builderSauce,
        cheese: builderCheese,
        toppings: builderToppings,
        price: customPrice
      }
    };

    setCart(prev => [...prev, cartInstance]);
    
    // Reset builder defaults after adding
    setBuilderToppings([]);
    setCustomPizzaLabel('Custom Sourdough Sensation');
    setBuilderCrust('neapolitan');
    setBuilderSauce('san-marzano');
    setBuilderCheese('fior-di-latte');
    
    // Smooth scroll back or navigate to Menu / Tab
    setActiveTab('menu');
  };

  const handleUpdateItemQty = (itemId: string, increment: boolean) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = increment ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      });
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  /* Checkout Form Real-time validation validators */
  const validateCheckoutField = (field: string, value: string) => {
    let errMsg = '';
    const nameVal = field === 'name' ? value : checkoutName;
    const phoneVal = field === 'phone' ? value : checkoutPhone;
    const emailVal = field === 'email' ? value : checkoutEmail;
    const addrVal = field === 'address' ? value : checkoutAddress;

    if (field === 'name') {
      if (!nameVal.trim()) {
        errMsg = 'Pizzaiolo needs your name to sign the wood-fired ticket.';
      } else if (nameVal.trim().length < 3) {
        errMsg = 'Please provide your full name (minimum 3 characters).';
      }
    } else if (field === 'phone') {
      const phoneRegex = /^[+]?[(]?[0-9]{2,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneVal.trim()) {
        errMsg = 'Vespa drivers require a valid phone coordinate.';
      } else if (!phoneRegex.test(phoneVal.trim()) && phoneVal.trim().length < 6) {
        errMsg = 'Invalid phone format (e.g., 555-0199 or +39...).';
      }
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal.trim()) {
        errMsg = 'An email is required for the digital invoice ticket.';
      } else if (!emailRegex.test(emailVal.trim())) {
        errMsg = 'Invalid email syntax (e.g., yourname@domain.com).';
      }
    } else if (field === 'address') {
      if (!addrVal.trim()) {
        errMsg = 'Destination street address is strictly required.';
      } else if (addrVal.trim().length < 8) {
        errMsg = 'Please detail a full address (street, number, suite, zip) for prompt routing.';
      }
    }

    setCheckoutErrors(prev => ({ ...prev, [field]: errMsg }));
  };

  const handleCheckoutChange = (field: 'name' | 'phone' | 'email' | 'address', val: string) => {
    if (field === 'name') setCheckoutName(val);
    else if (field === 'phone') setCheckoutPhone(val);
    else if (field === 'email') setCheckoutEmail(val);
    else if (field === 'address') setCheckoutAddress(val);

    // If blurred previously, validate instantly
    validateCheckoutField(field, val);
  };

  const handleCheckoutBlur = (field: 'name' | 'phone' | 'email' | 'address') => {
    setCheckoutTouched(prev => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'name') val = checkoutName;
    else if (field === 'phone') val = checkoutPhone;
    else if (field === 'email') val = checkoutEmail;
    else if (field === 'address') val = checkoutAddress;
    validateCheckoutField(field, val);
  };

  /* Table Reservations Real-time validation validators */
  const validateBookingField = (field: string, value: string) => {
    let errMsg = '';
    const nameVal = field === 'name' ? value : bookingName;
    const emailVal = field === 'email' ? value : bookingEmail;
    const dateVal = field === 'date' ? value : bookingDate;

    if (field === 'name') {
      if (!nameVal.trim()) {
        errMsg = 'Full name is required to authenticate your table.';
      } else if (nameVal.trim().length < 3) {
        errMsg = 'Name must be at least 3 characters.';
      }
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal.trim()) {
        errMsg = 'Email is required for instant confirmation voucher.';
      } else if (!emailRegex.test(emailVal.trim())) {
        errMsg = 'Please enter a valid email (e.g., customer@domain.com).';
      }
    } else if (field === 'date') {
      if (!dateVal) {
        errMsg = 'Please select your desired dining sunset date.';
      } else {
        const selected = new Date(dateVal);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selected < today) {
          errMsg = 'Selected date rests in history. Vintage is only for wines!';
        }
      }
    }

    setBookingErrors(prev => ({ ...prev, [field]: errMsg }));
  };

  const handleBookingChange = (field: 'name' | 'email' | 'date', val: string) => {
    if (field === 'name') setBookingName(val);
    else if (field === 'email') setBookingEmail(val);
    else if (field === 'date') setBookingDate(val);

    validateBookingField(field, val);
  };

  const handleBookingBlur = (field: 'name' | 'email' | 'date') => {
    setBookingTouched(prev => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'name') val = bookingName;
    else if (field === 'email') val = bookingEmail;
    else if (field === 'date') val = bookingDate;
    validateBookingField(field, val);
  };

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;

    // Set all fields to touched to trigger inline errors
    const fields: ('name' | 'phone' | 'email' | 'address')[] = ['name', 'phone', 'email', 'address'];
    setCheckoutTouched({ name: true, phone: true, email: true, address: true });

    let hasErrors = false;
    fields.forEach(f => {
      let val = '';
      if (f === 'name') val = checkoutName;
      else if (f === 'phone') val = checkoutPhone;
      else if (f === 'email') val = checkoutEmail;
      else if (f === 'address') val = checkoutAddress;

      let errMsg = '';
      if (f === 'name') {
        if (!val.trim()) errMsg = 'Pizzaiolo needs your name to sign the wood-fired ticket.';
        else if (val.trim().length < 3) errMsg = 'Please provide your full name (minimum 3 characters).';
      } else if (f === 'phone') {
        const phoneRegex = /^[+]?[(]?[0-9]{2,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!val.trim()) errMsg = 'Vespa drivers require a valid phone coordinate.';
        else if (!phoneRegex.test(val.trim()) && val.trim().length < 6) errMsg = 'Invalid phone format (e.g., 555-0199 or +39...).';
      } else if (f === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val.trim()) errMsg = 'An email is required for the digital invoice ticket.';
        else if (!emailRegex.test(val.trim())) errMsg = 'Invalid email syntax (e.g., yourname@domain.com).';
      } else if (f === 'address') {
        if (!val.trim()) errMsg = 'Destination street address is strictly required.';
        else if (val.trim().length < 8) errMsg = 'Please detail a full address (street, number, suite, zip) for prompt routing.';
      }

      if (errMsg) {
        hasErrors = true;
      }
      setCheckoutErrors(prev => ({ ...prev, [f]: errMsg }));
    });

    if (hasErrors) {
      return;
    }

    setIsSubmittingOrder(true);

    const sub = calculateSubtotal();
    const tx = sub * 0.10;
    const delFee = sub > 35.00 ? 0.00 : 3.50;
    const totalCost = sub + tx + delFee;

    const orderPayload = {
      customerName: checkoutName,
      customerPhone: checkoutPhone,
      customerEmail: checkoutEmail,
      deliveryAddress: checkoutAddress,
      cartItems: cart.map(item => ({
        name: item.name,
        customizations: item.customizations || [],
        quantity: item.quantity,
        price: item.price
      })),
      priceSummary: {
        subtotal: sub,
        tax: tx,
        deliveryFee: delFee,
        total: totalCost
      }
    };

    // Post asynchronously to configured backend/webhook/form system
    await submitFormToConfiguredService('order', orderPayload);

    const newTracker: OrderTracker = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      subtotal: sub,
      tax: tx,
      deliveryFee: delFee,
      total: totalCost,
      currentStep: 'dough',
      createdAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setOrderTracker(newTracker);
    setCart([]); // Clear cart
    setIsSubmittingOrder(false);
  };

  const handleFastTrackOrder = () => {
    if (!orderTracker) return;
    const steps: OrderStep[] = ['dough', 'sauce', 'wood-fire', 'finish', 'dispatched'];
    const currentIndex = steps.indexOf(orderTracker.currentStep);
    if (currentIndex < steps.length - 1) {
      setOrderTracker(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentStep: steps[currentIndex + 1]
        };
      });
    }
  };

  const handleResetOrder = () => {
    setOrderTracker(null);
  };

  const handleReserveTable = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger touched states on all booking validation coordinates
    const fields: ('name' | 'email' | 'date')[] = ['name', 'email', 'date'];
    setBookingTouched({ name: true, email: true, date: true });

    let hasErrors = false;
    fields.forEach(f => {
      let val = '';
      if (f === 'name') val = bookingName;
      else if (f === 'email') val = bookingEmail;
      else if (f === 'date') val = bookingDate;

      let errMsg = '';
      if (f === 'name') {
        if (!val.trim()) errMsg = 'Full name is required to authenticate your table.';
        else if (val.trim().length < 3) errMsg = 'Name must be at least 3 characters.';
      } else if (f === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val.trim()) errMsg = 'Email is required for instant confirmation voucher.';
        else if (!emailRegex.test(val.trim())) errMsg = 'Please enter a valid email (e.g., customer@domain.com).';
      } else if (f === 'date') {
        if (!val) {
          errMsg = 'Please select your desired dining sunset date.';
        } else {
          const selected = new Date(val);
          const today = new Date();
          today.setHours(0,0,0,0);
          if (selected < today) {
            errMsg = 'Selected date rests in history. Vintage is only for wines!';
          }
        }
      }

      if (errMsg) {
        hasErrors = true;
      }
      setBookingErrors(prev => ({ ...prev, [f]: errMsg }));
    });

    if (hasErrors) {
      setShowValidationErr(true);
      return;
    }
    
    setShowValidationErr(false);
    setIsSubmittingReservation(true);

    const reservationPayload = {
      hostName: bookingName,
      hostEmail: bookingEmail,
      guestsCount: bookingGuests,
      diningDate: bookingDate,
      diningTime: bookingTime,
      atmosphereZone: bookingZone,
      specialRequests: bookingNotes
    };

    // Forward to configured system integration (Formspree, Netlify Forms, etc.)
    await submitFormToConfiguredService('reservation', reservationPayload);
    
    const newReservation: Reservation = {
      id: `res-${Math.floor(10000 + Math.random() * 90000)}`,
      name: bookingName,
      email: bookingEmail,
      guests: bookingGuests,
      date: bookingDate,
      time: bookingTime,
      zone: bookingZone,
      notes: bookingNotes,
      status: 'confirmed'
    };

    setReservation(newReservation);
    setIsSubmittingReservation(false);
    
    // Clear Form Fields
    setBookingName('');
    setBookingEmail('');
    setBookingNotes('');
    setBookingTouched({});
    setBookingErrors({});
  };

  const handleCancelReservation = () => {
    setReservation(null);
  };

  /* ==========================================================================
     Artisan Menu Grid Rendering
     ========================================================================== */

  return (
    <div className="parlor">
      {/* Brand Header */}
      <div id="parlor-header" className="parlor__header-container">
        <header className="brand-header">
          <div className="brand-header__logo-block">
            <div className="brand-header__symbol">BN</div>
            <div className="brand-header__text">
              <h1 className="brand-header__title">Pizzeria Bella Nera</h1>
              <span className="brand-header__tagline">FORNO A LEGNA • MILANO EST. 1984</span>
            </div>
          </div>
          <div className="brand-header__meta">
            <div className="brand-header__stat-pill">
              <span className="brand-header__stat-dot"></span>
              <span>450°C WOOD-BURNING OVEN ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Hero Visual Banner */}
        <section className="hero-banner">
          <div className="hero-banner__text">
            <span className="hero-banner__badge">L'Arte della Pizza Napoletana</span>
            <h2 className="hero-banner__title">
              Crafted Sourdough, <span className="hero-banner__title-accent">Baked in 90 Seconds</span>
            </h2>
            <p className="hero-banner__desc">
              Experience organic, slow-fermented pizza stretching. Handcrafted using certified San Marzano tomatoes, native warm extra virgin olive oil, and creamy imported Campania buffalo milk mozzarella.
            </p>
            <div className="hero-banner__cta-row">
              <button 
                id="cta-build"
                className="hero-banner__btn hero-banner__btn--primary"
                onClick={() => setActiveTab('builder')}
              >
                Enter the Artisan Pizza Lab
              </button>
              <button 
                id="cta-reserve"
                className="hero-banner__btn hero-banner__btn--secondary"
                onClick={() => setActiveTab('reservations')}
              >
                Reserve a Table
              </button>
            </div>
          </div>
          <div className="hero-banner__visual">
            <div className="hero-banner__donut-ring">
              <div className="hero-banner__pizza-graphic">
                <div className="hero-banner__basil-leaf hero-banner__basil-leaf--1"></div>
                <div className="hero-banner__basil-leaf hero-banner__basil-leaf--2"></div>
                <div className="hero-banner__basil-leaf hero-banner__basil-leaf--3"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Selection */}
        <nav className="pizzeria-tabs" aria-label="Parlor Sections">
          <button 
            id="tab-button-menu"
            className={`pizzeria-tabs__trigger ${activeTab === 'menu' ? 'pizzeria-tabs__trigger--active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            Artisan Wood-Fired Menu
          </button>
          <button 
            id="tab-button-builder"
            className={`pizzeria-tabs__trigger ${activeTab === 'builder' ? 'pizzeria-tabs__trigger--active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            The Pizza Lab (Builder)
          </button>
          <button 
            id="tab-button-reservations"
            className={`pizzeria-tabs__trigger ${activeTab === 'reservations' ? 'pizzeria-tabs__trigger--active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            Seating &amp; Reservations
          </button>
        </nav>
      </div>

      {/* Main Structural Column & Sidebar Column */}
      <div className="parlor__container">
        <main className="parlor__main">
          {/* TAB CONTENT: ARTISAN MENU */}
          {activeTab === 'menu' && (
            <div className="artisan-menu">
              <div className="artisan-menu__filters">
                <button 
                  id="filter-all"
                  data-filter="all"
                  className="artisan-menu__filter-btn artisan-menu__filter-btn--active"
                >
                  All
                </button>
                <button 
                  id="filter-pizza"
                  data-filter="pizza"
                  className="artisan-menu__filter-btn"
                >
                  Pizza
                </button>
                <button 
                  id="filter-pasta"
                  data-filter="pasta"
                  className="artisan-menu__filter-btn"
                >
                  Pasta
                </button>
                <button 
                  id="filter-dessert"
                  data-filter="dessert"
                  className="artisan-menu__filter-btn"
                >
                  Desserts
                </button>
              </div>

              {/* Grid of Menu Items */}
              <div className="artisan-menu__grid">
                {ARTISAN_PIZZAS.map(pizza => (
                  <article 
                    key={pizza.id} 
                    id={`pizza-card-${pizza.id}`} 
                    className="pizza-card" 
                    data-category={pizza.category}
                    onClick={() => openMenuModal(pizza, handleAddCustomizedItemToCart)}
                  >
                    <div className="pizza-card__media">
                      {pizza.image ? (
                        <div className="pizza-card__img-wrapper">
                          <img 
                            className="pizza-card__image" 
                            src={pizza.image} 
                            alt={pizza.name} 
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            width="500"
                            height="300"
                          />
                        </div>
                      ) : (
                        <div className="pizza-card__graphics-fallback">
                          <PizzaIcon size={44} />
                        </div>
                      )}
                      
                      {/* Interactive Badges */}
                      <div className="pizza-card__badges">
                        {pizza.isVegan && <span className="pizza-card__badge-tag pizza-card__badge-tag--vegan">Vegan</span>}
                        {pizza.isVegetarian && !pizza.isVegan && <span className="pizza-card__badge-tag pizza-card__badge-tag--veg">Vegetarian</span>}
                        {pizza.isSpicy && <span className="pizza-card__badge-tag pizza-card__badge-tag--spicy">Spicy</span>}
                        {pizza.isGlutenFree && <span className="pizza-card__badge-tag pizza-card__badge-tag--gf">Gluten-Free Available</span>}
                      </div>
                      <span className="pizza-card__header-price">${pizza.price.toFixed(2)}</span>
                    </div>

                    <div className="pizza-card__content">
                      <div className="pizza-card__titles">
                        <h3 className="pizza-card__title">{pizza.name}</h3>
                        <span className="pizza-card__italian-name">{pizza.italianName}</span>
                      </div>
                      <p className="pizza-card__desc">{pizza.description}</p>
                      
                      <div className="pizza-card__footer">
                        <span className="pizza-card__price-tag">${pizza.price.toFixed(2)}</span>
                        <button 
                          id={`add-btn-${pizza.id}`}
                          className="pizza-card__button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddPizzaToCart(pizza);
                          }}
                        >
                          <Plus size={14} /> Add to Order
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              {/* Premium Luxury Reservation Widget Booking Desk */}
              <ReservationWidget />
            </div>
          )}

          {/* TAB CONTENT: THE PIZZA LAB BUILDER */}
          {activeTab === 'builder' && (
            <div className="builder">
              {/* Left Column: Visual Canvas Area */}
              <div className="builder__canvas-pane">
                <div className="builder__canvas-title">
                  <span className="builder__canvas-heading">Visual Wood-Platter Desk</span>
                  <span className="builder__canvas-subheading">Interactive Ingredient Canvas</span>
                </div>

                <div className="builder__platter">
                  <div className={`builder__crust builder__crust--${builderCrust}`}>
                    
                    {/* Sauce base overlay */}
                    <div className={`builder__sauce-layer builder__sauce-layer--${builderSauce}`} />

                    {/* Cheese spots depending on selected cheese */}
                    {builderCheese !== 'none' && (
                      <div className="builder__cheese-layer">
                        {/* Render standard cheese spots */}
                        <div className={`builder__cheese-spot builder__cheese-spot--${builderCheese}`} style={{ top: '20%', left: '40%' }}></div>
                        <div className={`builder__cheese-spot builder__cheese-spot--${builderCheese}`} style={{ top: '35%', left: '20%' }}></div>
                        <div className={`builder__cheese-spot builder__cheese-spot--${builderCheese}`} style={{ top: '25%', left: '60%' }}></div>
                        <div className={`builder__cheese-spot builder__cheese-spot--${builderCheese}`} style={{ top: '55%', left: '30%' }}></div>
                        <div className={`builder__cheese-spot builder__cheese-spot--${builderCheese}`} style={{ top: '45%', left: '70%' }}></div>
                        <div className={`builder__cheese-spot builder__cheese-spot--${builderCheese}`} style={{ top: '65%', left: '50%' }}></div>
                        <div className={`builder__cheese-spot builder__cheese-spot--${builderCheese}`} style={{ top: '45%', left: '45%' }}></div>
                      </div>
                    )}

                    {/* Floating Toppings layer */}
                    {builderToppings.map(toppingId => {
                      const toppingOpt = TOPPINGS_OPTIONS.find(t => t.id === toppingId);
                      if (!toppingOpt) return null;
                      return (
                        <div key={toppingId} className="builder__toppings-cluster-layer">
                          {/* Render multiple scatter spots on the pizza for each checked ingredient */}
                          {CANVAS_COORDINATES.map((styleObj, index) => (
                            <div 
                              key={index} 
                              className={`builder__topping-spot builder__topping-spot--${toppingId}`}
                              style={{ 
                                top: styleObj.top, 
                                left: styleObj.left, 
                                transform: `rotate(${styleObj.rotate})`
                              }}
                            />
                          ))}
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Inside visual canvas status badge */}
                <span className="builder__price-badge">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>Interactive Estimation: ${calculateCustomPizzaPrice().toFixed(2)}</span>
                </span>
              </div>

              {/* Right Column: Dynamic Form Controls */}
              <div className="builder__controls">
                <div className="builder__group">
                  <span className="builder__group-heading">1. Personalize Sourdough Title</span>
                  <input 
                    type="text" 
                    id="builder-label-input"
                    className="reservation-form__input"
                    value={customPizzaLabel}
                    onChange={(e) => setCustomPizzaLabel(e.target.value)}
                    placeholder="E.g., Neapolitan Sunset Deluxe"
                  />
                </div>

                <div className="builder__group">
                  <span className="builder__group-heading">2. Sourdough Crust Option</span>
                  <div className="builder__choices-grid">
                    <div 
                      id="opt-crust-neapolitan"
                      className={`builder__choice-box ${builderCrust === 'neapolitan' ? 'builder__choice-box--selected' : ''}`}
                      onClick={() => setBuilderCrust('neapolitan')}
                    >
                      <span className="builder__choice-title">Sourdough</span>
                      <span className="builder__choice-subtitle">Hand-stretched</span>
                      <span className="builder__choice-price">+$0.00</span>
                    </div>
                    <div 
                      id="opt-crust-thin"
                      className={`builder__choice-box ${builderCrust === 'thin-crispy' ? 'builder__choice-box--selected' : ''}`}
                      onClick={() => setBuilderCrust('thin-crispy')}
                    >
                      <span className="builder__choice-title">Thin &amp; Crackly</span>
                      <span className="builder__choice-subtitle">Roman Style</span>
                      <span className="builder__choice-price">+$0.00</span>
                    </div>
                    <div 
                      id="opt-crust-gf"
                      className={`builder__choice-box ${builderCrust === 'gluten-free' ? 'builder__choice-box--selected' : ''}`}
                      onClick={() => setBuilderCrust('gluten-free')}
                    >
                      <span className="builder__choice-title">Gluten-Free</span>
                      <span className="builder__choice-subtitle">Rice-Sourdough</span>
                      <span className="builder__choice-price">+$3.00</span>
                    </div>
                  </div>
                </div>

                <div className="builder__group">
                  <span className="builder__group-heading">3. Traditional Sauce Base</span>
                  <div className="builder__choices-grid">
                    <div 
                      id="opt-sauce-marzano"
                      className={`builder__choice-box ${builderSauce === 'san-marzano' ? 'builder__choice-box--selected' : ''}`}
                      onClick={() => setBuilderSauce('san-marzano')}
                    >
                      <span className="builder__choice-title">San Marzano</span>
                      <span className="builder__choice-subtitle">Authentic Plum</span>
                      <span className="builder__choice-price">+$0.00</span>
                    </div>
                    <div 
                      id="opt-sauce-bianco"
                      className={`builder__choice-box ${builderSauce === 'bianco-cream' ? 'builder__choice-box--selected' : ''}`}
                      onClick={() => setBuilderSauce('bianco-cream')}
                    >
                      <span className="builder__choice-title">Bianca</span>
                      <span className="builder__choice-subtitle">Rich Velvet</span>
                      <span className="builder__choice-price">+$0.00</span>
                    </div>
                    <div 
                      id="opt-sauce-pesto"
                      className={`builder__choice-box ${builderSauce === 'basil-pesto' ? 'builder__choice-box--selected' : ''}`}
                      onClick={() => setBuilderSauce('basil-pesto')}
                    >
                      <span className="builder__choice-title">Basil Pesto</span>
                      <span className="builder__choice-subtitle">Herbal Green</span>
                      <span className="builder__choice-price">+$0.00</span>
                    </div>
                  </div>
                </div>

                <div className="builder__group">
                  <span className="builder__group-heading">4. Fresh Italian Cheeses</span>
                  <div className="builder__choices-grid">
                    <div 
                      id="opt-cheese-fior"
                      className={`builder__choice-box ${builderCheese === 'fior-di-latte' ? 'builder__choice-box--selected' : ''}`}
                      onClick={() => setBuilderCheese('fior-di-latte')}
                    >
                      <span className="builder__choice-title">Fior di Latte</span>
                      <span className="builder__choice-subtitle">Creamy Mozz</span>
                      <span className="builder__choice-price">+$0.00</span>
                    </div>
                    <div 
                      id="opt-cheese-buffalo"
                      className={`builder__choice-box ${builderCheese === 'buffalo-mozzarella' ? 'builder__choice-box--selected' : ''}`}
                      onClick={() => setBuilderCheese('buffalo-mozzarella')}
                    >
                      <span className="builder__choice-title">Bufala Campana</span>
                      <span className="builder__choice-subtitle">Deep Milk</span>
                      <span className="builder__choice-price">+$2.50</span>
                    </div>
                    <div 
                      id="opt-cheese-gorgonzola"
                      className={`builder__choice-box ${builderCheese === 'gorgonzola' ? 'builder__choice-box--selected' : ''}`}
                      onClick={() => setBuilderCheese('gorgonzola')}
                    >
                      <span className="builder__choice-title">Gorgonzola</span>
                      <span className="builder__choice-subtitle">Dolce Blue</span>
                      <span className="builder__choice-price">+$2.00</span>
                    </div>
                    <div 
                      id="opt-cheese-vegan"
                      className={`builder__choice-box ${builderCheese === 'vegan-mozz' ? 'builder__choice-box--selected' : ''}`}
                      style={{ gridColumn: 'span 2' }}
                      onClick={() => setBuilderCheese('vegan-mozz')}
                    >
                      <span className="builder__choice-title">Vegan Mozzarella Blocks</span>
                      <span className="builder__choice-subtitle">Charming melt</span>
                      <span className="builder__choice-price">+$1.50</span>
                    </div>
                    <div 
                      id="opt-cheese-none"
                      className={`builder__choice-box ${builderCheese === 'none' ? 'builder__choice-box--selected' : ''}`}
                      onClick={() => setBuilderCheese('none')}
                    >
                      <span className="builder__choice-title">No Cheese</span>
                      <span className="builder__choice-subtitle">Rossa base</span>
                      <span className="builder__choice-price">+$0.00</span>
                    </div>
                  </div>
                </div>

                <div className="builder__group">
                  <span className="builder__group-heading">5. Artisan Toppings (Select Multiple)</span>
                  <div className="builder__choices-grid builder__choices-grid--toppings">
                    {TOPPINGS_OPTIONS.map(topping => (
                      <div 
                        key={topping.id}
                        id={`builder-topping-${topping.id}`}
                        className={`builder__topping-row ${builderToppings.includes(topping.id) ? 'builder__topping-row--active' : ''}`}
                        onClick={() => handleToggleTopping(topping.id)}
                      >
                        <div className="builder__topping-left">
                          <span className="builder__topping-indicator" style={{ backgroundColor: topping.color }} />
                          <div className="builder__topping-details">
                            <span className="builder__topping-title">{topping.name}</span>
                            <span className="builder__topping-italian">{topping.italianName}</span>
                          </div>
                        </div>
                        <span className="builder__topping-price">+${topping.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom builders submission checkout row */}
                <div className="builder__submit-card">
                  <div className="builder__price-summary">
                    <span className="builder__summary-text">Your Sourdough Total:</span>
                    <span className="builder__summary-price">${calculateCustomPizzaPrice().toFixed(2)}</span>
                  </div>
                  <button 
                    id="builder-basket-add-btn"
                    className="builder__add-btn"
                    onClick={handleAddCustomPizzaToCart}
                  >
                    <Plus size={16} /> Add Custom Creation to Order
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: SEATING RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="reservation-block">
              {!reservation ? (
                <div>
                  <h3 className="reservation-block__heading">Prenotazione Tavolo (Book a Table)</h3>
                  <p className="reservation-block__subtitle">
                    Secure an intimate slot in front of our blisteringly hot 485°C sourdough hearth wood fire ovens, or claim a cozy table in the shaded lemon citrus garden.
                  </p>

                  {/* Integration Mode Badge for Agency Developers */}
                  <div className="p-3 mb-4 rounded bg-stone-100 border border-stone-200 text-stone-700 text-xs flex gap-2 justify-between items-center font-mono">
                    <span className="text-stone-500">
                      Agency Service Mode: <strong className="text-amber-800 uppercase italic">{WEB_AGENCY_FORM_CONFIG.reservation.integrationType}</strong>
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Edit/plugin via src/formConfig.ts
                    </span>
                  </div>
                  
                  {showValidationErr && (
                    <div className="p-3 mb-4 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex gap-2 items-center font-semibold">
                      <span>Per favore completa tutti i campi richiesti prima di autenticare la prenotazione.</span>
                    </div>
                  )}

                  {/* If agency config is set to OpenTable, provide direct fast-track link */}
                  {WEB_AGENCY_FORM_CONFIG.reservation.integrationType === 'opentable' ? (
                    <div className="p-6 my-6 text-center rounded-lg border border-amber-800/10 bg-amber-50/40 shadow-sm">
                      <span className="block text-2xl mb-1">🍷</span>
                      <h4 className="font-serif font-bold text-base text-stone-800 mb-1">OpenTable Portal Redirect Router Connected</h4>
                      <p className="text-xs text-stone-600 mb-4 max-w-md mx-auto">
                        This seat booking is configured to directly handle user confirmations on OpenTable's high-speed reserve network API.
                      </p>
                      <a 
                        href={WEB_AGENCY_FORM_CONFIG.reservation.opentableUrl || "https://www.opentable.com"} 
                        target="_blank" 
                        rel="noreferrer referrer"
                        className="reservation-form__btn max-w-xs mx-auto flex items-center justify-center gap-2"
                      >
                        <Calendar size={14} /> Open Secure OpenTable Link
                      </a>
                    </div>
                  ) : (
                    <form className="space-y-6" onSubmit={handleReserveTable}>
                      {/* Host Identity Details row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="reservation-form__group">
                          <label className="reservation-form__label" htmlFor="booking-name">Host Full Name</label>
                          <input 
                            type="text" 
                            id="booking-name"
                            className={`reservation-form__input ${
                              bookingErrors.name && bookingTouched.name ? 'border-red-500 focus:border-red-500 bg-red-50/20' : ''
                            }`}
                            placeholder="Sophia Loren"
                            value={bookingName}
                            onChange={(e) => handleBookingChange('name', e.target.value)}
                            onBlur={() => handleBookingBlur('name')}
                            required
                          />
                          {bookingErrors.name && bookingTouched.name && (
                            <span className="block text-[10px] text-red-600 font-semibold mt-1">
                              {bookingErrors.name}
                            </span>
                          )}
                        </div>

                        <div className="reservation-form__group">
                          <label className="reservation-form__label" htmlFor="booking-email">Host Email Coordinate</label>
                          <input 
                            type="email" 
                            id="booking-email"
                            className={`reservation-form__input ${
                              bookingErrors.email && bookingTouched.email ? 'border-red-500 focus:border-red-500 bg-red-50/20' : ''
                            }`}
                            placeholder="sophia@bellanera.com"
                            value={bookingEmail}
                            onChange={(e) => handleBookingChange('email', e.target.value)}
                            onBlur={() => handleBookingBlur('email')}
                            required
                          />
                          {bookingErrors.email && bookingTouched.email && (
                            <span className="block text-[10px] text-red-600 font-semibold mt-1">
                              {bookingErrors.email}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tactical Party Size Selector (Clickable circle chips) */}
                      <div className="reservation-form__group-advanced">
                        <label className="reservation-form__label flex items-center gap-1.5 mb-2">
                          <Users size={14} className="text-amber-800" />
                          <span>Number of Covers (Party Size)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5, 6, 8].map((size) => {
                            const label = size === 1 ? 'Solo' : size === 2 ? 'Duo' : size === 4 ? 'Quad' : size === 8 ? '8+ Feast' : `${size} Guests`;
                            const isSelected = bookingGuests === size;
                            return (
                              <button
                                key={size}
                                type="button"
                                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all border ${
                                  isSelected 
                                    ? 'bg-amber-900 border-amber-950 text-white shadow-md' 
                                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                                }`}
                                onClick={() => setBookingGuests(size)}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Modular Interactive Calendar & Date Ribbon */}
                      <div className="reservation-form__group-advanced">
                        <label className="reservation-form__label flex items-center gap-1.5 mb-2">
                          <Calendar size={14} className="text-amber-800" />
                          <span>Select Dining Date Tag</span>
                        </label>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-3">
                          {(() => {
                            const daysList = [];
                            const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            for (let i = 0; i < 7; i++) {
                              const d = new Date();
                              d.setDate(d.getDate() + i);
                              const year = d.getFullYear();
                              const monthDigit = String(d.getMonth() + 1).padStart(2, '0');
                              const dateDigit = String(d.getDate()).padStart(2, '0');
                              const formattedRef = `${year}-${monthDigit}-${dateDigit}`;
                              
                              const isSelected = bookingDate === formattedRef;
                              daysList.push(
                                <button
                                  key={formattedRef}
                                  type="button"
                                  className={`p-2.5 rounded-lg border text-center transition-all flex flex-col justify-center items-center ${
                                    isSelected 
                                      ? 'bg-amber-900 border-amber-950 text-white shadow-md scale-[1.03]' 
                                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                                  }`}
                                  onClick={() => handleBookingChange('date', formattedRef)}
                                >
                                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">
                                    {weekdays[d.getDay()]}
                                  </span>
                                  <span className="text-base font-extrabold leading-none my-1">
                                    {d.getDate()}
                                  </span>
                                  <span className="text-[10px]">
                                    {months[d.getMonth()]}
                                  </span>
                                </button>
                              );
                            }
                            return daysList;
                          })()}
                        </div>

                        {/* Traditional backup HTML datepicker for picker flexibility */}
                        <div className="flex items-center gap-2 max-w-sm mt-1 bg-stone-50 border border-stone-200 rounded p-1.5">
                          <span className="text-[10px] text-stone-500 uppercase font-bold pl-2">Or custom:</span>
                          <input 
                            type="date" 
                            id="booking-date"
                            className="bg-transparent text-xs text-stone-800 outline-none w-full border-none focus:ring-0 cursor-pointer"
                            value={bookingDate}
                            onChange={(e) => handleBookingChange('date', e.target.value)}
                            onBlur={() => handleBookingBlur('date')}
                            required
                          />
                        </div>
                        {bookingErrors.date && bookingTouched.date && (
                          <span className="block text-[10px] text-red-600 font-semibold mt-1">
                            {bookingErrors.date}
                          </span>
                        )}
                      </div>

                      {/* Interactive Time-Slot Chips divided by service phase */}
                      <div className="reservation-form__group-advanced">
                        <label className="reservation-form__label flex items-center gap-1.5 mb-2">
                          <Clock size={14} className="text-amber-800" />
                          <span>Sunset Dining Hour Slots</span>
                        </label>
                        
                        <div className="space-y-3 p-3.5 bg-stone-50 border border-stone-200/60 rounded-lg">
                          <div>
                            <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Pomeriggio (Early Dinner)</span>
                            <div className="flex flex-wrap gap-1.5">
                              {['17:00', '17:30', '18:00'].map((time) => {
                                const isSelected = bookingTime === time;
                                const label = time === '17:00' ? '5:30 PM Early' : time;
                                return (
                                  <button
                                    key={time}
                                    type="button"
                                    className={`px-3 py-1.5 text-xs font-mono rounded transition-all border ${
                                      isSelected
                                        ? 'bg-amber-900 border-amber-950 text-white shadow-sm'
                                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                    }`}
                                    onClick={() => setBookingTime(time)}
                                  >
                                    {time}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Prime Time Sunset</span>
                            <div className="flex flex-wrap gap-1.5">
                              {['18:30', '19:00', '19:30', '20:00'].map((time) => {
                                const isSelected = bookingTime === time;
                                return (
                                  <button
                                    key={time}
                                    type="button"
                                    className={`px-3 py-1.5 text-xs font-mono rounded transition-all border ${
                                      isSelected
                                        ? 'bg-amber-900 border-amber-950 text-white shadow-sm'
                                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                    }`}
                                    onClick={() => setBookingTime(time)}
                                  >
                                    {time} {time === '19:30' ? '★ Peak' : ''}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Sera Tardi (Late Craving)</span>
                            <div className="flex flex-wrap gap-1.5">
                              {['20:45', '21:30', '22:00'].map((time) => {
                                const isSelected = bookingTime === time;
                                return (
                                  <button
                                    key={time}
                                    type="button"
                                    className={`px-3 py-1.5 text-xs font-mono rounded transition-all border ${
                                      isSelected
                                        ? 'bg-amber-900 border-amber-950 text-white shadow-sm'
                                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                    }`}
                                    onClick={() => setBookingTime(time)}
                                  >
                                    {time}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Choose Atmosphere Zone */}
                      <div className="reservation-form__group">
                        <label className="reservation-form__label flex items-center gap-1.5 mb-2">
                          <MapPin size={14} className="text-amber-800" />
                          <span>Choose Atmosphere Zone</span>
                        </label>
                        <div className="reservation-zones">
                          <div 
                            id="zone-wood-oven"
                            className={`reservation-zones__card cursor-pointer ${bookingZone === 'wood-oven' ? 'reservation-zones__card--selected' : ''}`}
                            onClick={() => setBookingZone('wood-oven')}
                          >
                            <span className="reservation-zones__title block font-serif text-xs font-bold text-stone-800">Wood Oven Hearth Counter</span>
                            <span className="reservation-zones__desc block text-[10px] text-stone-500">Intimate dynamic sights of crackling open stoves</span>
                          </div>
                          <div 
                            id="zone-garden"
                            className={`reservation-zones__card cursor-pointer ${bookingZone === 'garden-patio' ? 'reservation-zones__card--selected' : ''}`}
                            onClick={() => setBookingZone('garden-patio')}
                          >
                            <span className="reservation-zones__title block font-serif text-xs font-bold text-stone-800">Giardino Patio</span>
                            <span className="reservation-zones__desc block text-[10px] text-stone-500">Charming sweet Tuscan lights &amp; lemon trees</span>
                          </div>
                          <div 
                            id="zone-lounge"
                            className={`reservation-zones__card cursor-pointer ${bookingZone === 'sommelier-lounge' ? 'reservation-zones__card--selected' : ''}`}
                            onClick={() => setBookingZone('sommelier-lounge')}
                          >
                            <span className="reservation-zones__title block font-serif text-xs font-bold text-stone-800">Sommelier Vineria</span>
                            <span className="reservation-zones__desc block text-[10px] text-stone-500">Muted library racks with vintage wine parings</span>
                          </div>
                        </div>
                      </div>

                      {/* Notes text area */}
                      <div className="reservation-form__group reservation-form__group--full-width">
                        <label className="reservation-form__label text-xs" htmlFor="booking-notes">Special Culinary Requests</label>
                        <textarea 
                          id="booking-notes"
                          className="reservation-form__textarea text-xs h-20"
                          placeholder="E.g., Highchair requested for toddlers, gluten allergy preps needed, sweet sparkling anniversary wine pre-pour..."
                          value={bookingNotes}
                          onChange={(e) => setBookingNotes(e.target.value)}
                        />
                      </div>

                      {/* Submit Trigger Form Button */}
                      <button 
                        id="reservation-submit-btn"
                        type="submit" 
                        disabled={isSubmittingReservation}
                        className="reservation-form__btn flex items-center justify-center gap-2 w-full font-serif font-bold text-stone-100 bg-emerald-800 hover:bg-emerald-900 border-none rounded py-3 transition-all"
                      >
                        {isSubmittingReservation ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" /> Verifying Table Sunset Spot...
                          </>
                        ) : (
                          <>
                            <Calendar size={15} /> Authenticate Booking Spot
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* Elegant Old-World Printed Voucher / Ticket View */
                <div id="reservation-ticket-card" className="reservation-ticket">
                  <div className="reservation-ticket__brand">
                    <span className="reservation-ticket__pizzeria">Pizzeria Bella Nera</span>
                    <p className="reservation-ticket__italian-sub">Tavolo Conferma • Est. 1984</p>
                  </div>

                  <div className="reservation-ticket__separator" />

                  <div className="reservation-ticket__body-grid">
                    <div>
                      <span className="reservation-ticket__label">GUEST HOST</span>
                      <p className="reservation-ticket__value">{reservation.name}</p>
                    </div>
                    <div>
                      <span className="reservation-ticket__label">TICKET NUMBER</span>
                      <p className="reservation-ticket__value">{reservation.id}</p>
                    </div>
                    <div>
                      <span className="reservation-ticket__label">COVERS / PARTY</span>
                      <p className="reservation-ticket__value">{reservation.guests} Guests</p>
                    </div>
                    <div>
                      <span className="reservation-ticket__label">ATMOSPHERE AREA</span>
                      <p className="reservation-ticket__value">
                        {reservation.zone === 'wood-oven' && 'Kitchen Wood Oven Bar'}
                        {reservation.zone === 'garden-patio' && 'Giardino Lemon Patio'}
                        {reservation.zone === 'sommelier-lounge' && 'Sommelier Wine Lounge'}
                      </p>
                    </div>
                    <div>
                      <span className="reservation-ticket__label">DATE</span>
                      <p className="reservation-ticket__value">{reservation.date}</p>
                    </div>
                    <div>
                      <span className="reservation-ticket__label">DINING HOUR</span>
                      <p className="reservation-ticket__value">{reservation.time}</p>
                    </div>
                    <div className="reservation-ticket__value--full">
                      <span className="reservation-ticket__label">CULINARY GUEST NOTURES</span>
                      <p className="reservation-ticket__value text-stone-500 italic">
                        {reservation.notes || 'No special requests added. Ready for ovens!'}
                      </p>
                    </div>
                  </div>

                  <div className="reservation-ticket__seal">RICEVUTO CONFERMATO</div>

                  <button 
                    id="reservation-cancel-btn"
                    className="reservation-ticket__footer-btn"
                    onClick={handleCancelReservation}
                  >
                    Cancel Table Schedule / Book Another
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* SIDEBAR: ACTIVE CART / TRACKER FLOW */}
        <aside className="parlor__sidebar">
          {!orderTracker ? (
            /* Active Dining Order */
            <div className="pizzeria-cart">
              <div className="pizzeria-cart__heading">
                <h3 className="pizzeria-cart__title">
                  <ShoppingBag size={18} className="text-stone-800" />
                  <span>Il Carrello</span>
                </h3>
                <span className="pizzeria-cart__count-badge">
                  {cart.reduce((a, b) => a + b.quantity, 0)} Items
                </span>
              </div>

              {cart.length === 0 ? (
                <div id="cart-empty-view" className="pizzeria-cart__empty">
                  <span className="text-3xl">🍕</span>
                  <p className="pizzeria-cart__empty-title font-serif">Your cart is empty.</p>
                  <p className="pizzeria-cart__empty-desc">
                    Browse the artisan Neapolitan menu list or assemble a custom sourdough formulation in the Pizza Lab.
                  </p>
                </div>
              ) : (
                <div id="cart-list-view">
                  <div className="pizzeria-cart__list">
                    {cart.map(item => (
                      <div key={item.id} className="pizzeria-cart__item">
                        <div className="pizzeria-cart__item-details">
                          <span className="pizzeria-cart__item-name">{item.name}</span>
                          <span className="pizzeria-cart__item-italian">{item.italianName}</span>
                          
                          {item.customizations && item.customizations.length > 0 && (
                            <div className="pizzeria-cart__item-customizations text-[11px] text-amber-800 font-mono italic mt-1 leading-normal">
                              {item.customizations.map((cust, i) => (
                                <div key={i} className="flex items-center gap-1">
                                  <span className="text-amber-600">•</span>
                                  <span>{cust}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="pizzeria-cart__item-controls">
                            <button 
                              className="pizzeria-cart__qty-btn"
                              onClick={() => handleUpdateItemQty(item.id, false)}
                            >
                              <Minus size={10} />
                            </button>
                            <span className="pizzeria-cart__qty-val">{item.quantity}</span>
                            <button 
                              className="pizzeria-cart__qty-btn"
                              onClick={() => handleUpdateItemQty(item.id, true)}
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>

                        <div className="pizzeria-cart__item-right">
                          <span className="pizzeria-cart__item-price">${(item.price * item.quantity).toFixed(2)}</span>
                          <span 
                            className="pizzeria-cart__item-remove"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 size={13} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Checkout Details Form */}
                  <div className="pizzeria-cart__checkout-fields mt-4 p-3 bg-amber-50/70 border border-amber-900/10 rounded-md">
                    <span className="font-serif text-xs font-bold text-stone-800 uppercase tracking-widest block mb-2 pb-1 border-b border-amber-950/10">
                      Consegna Vespa (Vespa Delivery Dispatch)
                    </span>
                    
                    <div className="space-y-3">
                      {/* Name input */}
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wide mb-1" htmlFor="checkout-name">
                          Full Name
                        </label>
                        <input
                          id="checkout-name"
                          type="text"
                          className={`w-full text-xs px-2.5 py-2 rounded border transition-all placeholder:text-stone-400 focus:outline-none ${
                            checkoutErrors.name && checkoutTouched.name
                              ? 'border-red-500 bg-red-50/30' 
                              : 'border-stone-300 focus:border-amber-700 bg-white'
                          }`}
                          placeholder="Sophia Loren"
                          value={checkoutName}
                          onChange={(e) => handleCheckoutChange('name', e.target.value)}
                          onBlur={() => handleCheckoutBlur('name')}
                        />
                        {checkoutErrors.name && checkoutTouched.name && (
                          <span className="block text-[10px] text-red-600 font-semibold mt-1">
                            {checkoutErrors.name}
                          </span>
                        )}
                      </div>

                      {/* Phone input */}
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wide mb-1" htmlFor="checkout-phone">
                          Phone Coordinator
                        </label>
                        <input
                          id="checkout-phone"
                          type="tel"
                          className={`w-full text-xs px-2.5 py-2 rounded border transition-all placeholder:text-stone-400 focus:outline-none ${
                            checkoutErrors.phone && checkoutTouched.phone
                              ? 'border-red-500 bg-red-50/30' 
                              : 'border-stone-300 focus:border-amber-700 bg-white'
                          }`}
                          placeholder="+39 333 124 5678"
                          value={checkoutPhone}
                          onChange={(e) => handleCheckoutChange('phone', e.target.value)}
                          onBlur={() => handleCheckoutBlur('phone')}
                        />
                        {checkoutErrors.phone && checkoutTouched.phone && (
                          <span className="block text-[10px] text-red-600 font-semibold mt-1">
                            {checkoutErrors.phone}
                          </span>
                        )}
                      </div>

                      {/* Email input */}
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wide mb-1" htmlFor="checkout-email">
                          Email Receipt Coordinates
                        </label>
                        <input
                          id="checkout-email"
                          type="email"
                          className={`w-full text-xs px-2.5 py-2 rounded border transition-all placeholder:text-stone-400 focus:outline-none ${
                            checkoutErrors.email && checkoutTouched.email
                              ? 'border-red-500 bg-red-50/30' 
                              : 'border-stone-300 focus:border-amber-700 bg-white'
                          }`}
                          placeholder="sophia@bellanera.com"
                          value={checkoutEmail}
                          onChange={(e) => handleCheckoutChange('email', e.target.value)}
                          onBlur={() => handleCheckoutBlur('email')}
                        />
                        {checkoutErrors.email && checkoutTouched.email && (
                          <span className="block text-[10px] text-red-600 font-semibold mt-1">
                            {checkoutErrors.email}
                          </span>
                        )}
                      </div>

                      {/* Address input */}
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wide mb-1" htmlFor="checkout-address">
                          Vespa Delivery Address
                        </label>
                        <textarea
                          id="checkout-address"
                          className={`w-full text-xs px-2.5 py-2 rounded border transition-all placeholder:text-stone-400 focus:outline-none resize-none h-16 ${
                            checkoutErrors.address && checkoutTouched.address
                              ? 'border-red-500 bg-red-50/30' 
                              : 'border-stone-300 focus:border-amber-700 bg-white'
                          }`}
                          placeholder="Via della Moscova, 24, 20121 Milano, Italy"
                          value={checkoutAddress}
                          onChange={(e) => handleCheckoutChange('address', e.target.value)}
                          onBlur={() => handleCheckoutBlur('address')}
                        />
                        {checkoutErrors.address && checkoutTouched.address && (
                          <span className="block text-[10px] text-red-600 font-semibold mt-1">
                            {checkoutErrors.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Calculations Sheet */}
                  <div className="pizzeria-cart__summary">
                    <div className="pizzeria-cart__summary-row">
                      <span>Subtotal:</span>
                      <span className="font-mono">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="pizzeria-cart__summary-row">
                      <span>VAT / IVA (10%):</span>
                      <span className="font-mono">${(calculateSubtotal() * 0.10).toFixed(2)}</span>
                    </div>
                    <div className="pizzeria-cart__summary-row">
                      <span>Wood-Fire Delivery:</span>
                      <span className="font-mono">
                        {calculateSubtotal() > 35.00 ? 'FREE' : '$3.50'}
                      </span>
                    </div>
                    <div className="pizzeria-cart__summary-row pizzeria-cart__summary-row--total">
                      <span>Order Total:</span>
                      <span className="font-mono text-red-700 font-bold">
                        ${(calculateSubtotal() + (calculateSubtotal() * 0.10) + (calculateSubtotal() > 35.00 ? 0 : 3.50)).toFixed(2)}
                      </span>
                    </div>

                    <button 
                      id="cart-submit-order-btn"
                      className="pizzeria-cart__checkout-btn flex items-center justify-center gap-2"
                      onClick={() => handlePlaceOrder()}
                      disabled={isSubmittingOrder}
                    >
                      {isSubmittingOrder ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Inserting Order...
                        </>
                      ) : (
                        <>
                          <PizzaIcon size={16} /> Place Wood-Fired Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Live Cooking Kitchen Tracker Flow */
            <div id="kitchen-tracker-sidebar" className="kitchen-tracker">
              <div className="kitchen-tracker__heading">
                <h3 className="kitchen-tracker__title">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Wood-Fire Tracker</span>
                </h3>
                <span className="kitchen-tracker__indicator">{orderTracker.id}</span>
              </div>

              {/* Pizza chef bio details for extra premium immersion */}
              <div className="kitchen-tracker__pizzaiolo-card">
                <div className="kitchen-tracker__avatar-circle">M</div>
                <div className="kitchen-tracker__chef-details">
                  <span className="kitchen-tracker__chef-name">Pizzaiolo Mario Moretti</span>
                  <span className="kitchen-tracker__chef-sub">Associazione Verace Pizza Napoletana certified</span>
                </div>
              </div>

              {/* Step Flowchart */}
              <div className="kitchen-tracker__steps">
                {ORDER_STEPS_META.map(({ step, title, italian, desc }, idx) => {
                  const steps: OrderStep[] = ['dough', 'sauce', 'wood-fire', 'finish', 'dispatched'];
                  const stepIndex = steps.indexOf(step);
                  const activeIndex = steps.indexOf(orderTracker.currentStep);
                  
                  let stateClass = '';
                  if (stepIndex < activeIndex) stateClass = 'kitchen-tracker__step--completed';
                  else if (step === orderTracker.currentStep) stateClass = 'kitchen-tracker__step--active';

                  return (
                    <div key={step} className={`kitchen-tracker__step ${stateClass}`}>
                      <div className="kitchen-tracker__node" />
                      <div className="kitchen-tracker__content">
                        <span className="kitchen-tracker__step-title">{title}</span>
                        <span className="text-xs text-stone-400 italic mt-[-2px] mb-[2px]">{italian}</span>
                        {step === orderTracker.currentStep && (
                          <p className="kitchen-tracker__step-desc">{desc}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Immersive Sound description panel */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-600 flex gap-1 items-start">
                <MessageSquare size={14} className="text-red-700 flex-shrink-0 mt-[2px]" />
                <div>
                  <span className="font-semibold block mb-1">Ambiance feed:</span>
                  <p className="italic">
                    {ORDER_STEPS_META.find(s => s.step === orderTracker.currentStep)?.textSound}
                  </p>
                </div>
              </div>

              {/* Manual Fast track debugger and Reset Button */}
              <div className="kitchen-tracker__debug-panel">
                <span className="kitchen-tracker__debug-info">Automated timer: 15s / step</span>
                {orderTracker.currentStep !== 'dispatched' && (
                  <button 
                    id="dbg-fasttrack"
                    className="kitchen-tracker__debug-btn"
                    onClick={handleFastTrackOrder}
                  >
                    Speed Up Cook Phase &rarr;
                  </button>
                )}
              </div>

              <div className="pizzeria-cart__summary-row pizzeria-cart__summary-row--total mt-0 pt-2 pb-1 border-t-0">
                <span className="text-sm font-sans font-normal text-stone-600">Total charge:</span>
                <span className="font-mono text-stone-900 font-semibold">${orderTracker.total.toFixed(2)}</span>
              </div>

              <button 
                id="reset-order-btn"
                className="kitchen-tracker__reset-btn"
                onClick={handleResetOrder}
              >
                Assemble / Start New Pizza Order
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Elegant Italian Pizzerias Footer */}
      <footer className="pizzeria-footer">
        <div className="pizzeria-footer__left">
          <span className="pizzeria-footer__brand">Pizzeria Bella Nera</span>
          <span className="pizzeria-footer__copyright">
            © {new Date().getFullYear()} Pizzeria Bella Nera Milano S.p.A. All wood-stretching rights reserved.
          </span>
        </div>
        <div className="pizzeria-footer__right">
          <a className="pizzeria-footer__link" href="#parlor-header">Privacy Policy</a>
          <span className="text-stone-300">•</span>
          <a className="pizzeria-footer__link" href="#parlor-header">Terms of Baking</a>
          <span className="text-stone-300">•</span>
          <a className="pizzeria-footer__link" href="#parlor-header">Milano HQ</a>
        </div>
      </footer>
    </div>
  );
}
