import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, TruckLocation, CateringLead, NewsletterSubscriber } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase-client';

interface AppContextType {
  menuItems: MenuItem[];
  truckLocation: TruckLocation;
  cateringLeads: CateringLead[];
  newsletterSubscribers: NewsletterSubscriber[];
  loading: boolean;
  isSupabaseMode: boolean;
  addCateringLead: (lead: Omit<CateringLead, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateTruckLocation: (location: Omit<TruckLocation, 'id' | 'updatedAt'>) => Promise<boolean>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<boolean>;
  updateMenuItem: (item: MenuItem) => Promise<boolean>;
  deleteMenuItem: (id: string) => Promise<boolean>;
  updateLeadStatus: (id: string, status: CateringLead['status']) => Promise<boolean>;
  addNewsletterSubscriber: (email: string, name?: string) => Promise<boolean>;
  deleteNewsletterSubscriber: (id: string) => Promise<boolean>;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Chipotle Birria de Res',
    category: 'Tacos',
    description: '12-hour slow-braised beef brisket folded in heirloom blue corn tortilla, melted Oaxacan cheese, cilantro, pickled red onion, served with warm consommé dip.',
    price: 6.50,
    ingredients: ['Beef Brisket', 'Oaxacan Cheese', 'Consommé', 'Blue Corn Tortilla', 'Cilantro', 'Pickled Onions'],
    spicyLevel: 1,
    tags: ['Chef Special', 'Award Winner', 'Slow-Cooked'],
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'menu-2',
    name: 'Smoked Jackfruit Carnitas',
    category: 'Tacos',
    description: 'Hickory-smoked green jackfruit shredded and hand-crisped, charred fresh pineapple salsa, cilantro stem emulsion, micro-greens.',
    price: 5.50,
    ingredients: ['Green Jackfruit', 'Charred Pineapple', 'Cilantro Emulsion', 'Avocado', 'Micro-greens'],
    spicyLevel: 0,
    tags: ['Vegan', 'Gluten-Free', 'House Smoked'],
    imageUrl: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'menu-3',
    name: 'Agave-Lime Charcoal Shrimp',
    category: 'Tacos',
    description: 'Mesquite-grilled jumbo prawns glazed with organic agave-lime syrup, crunchy purple cabbage slaw, smoked chipotle crema, flour tortilla.',
    price: 7.00,
    ingredients: ['Jumbo Prawns', 'Agave Lime Glaze', 'Purple Cabbage Slaw', 'Chipotle Crema'],
    spicyLevel: 2,
    tags: ['Spicy', 'Seafood', 'Grilled'],
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'menu-4',
    name: 'Truffle Elote Street Corn',
    category: 'Sides',
    description: 'Charred organic sweet yellow corn off the cob, rich white truffle garlic aioli, cotija cheese crumbles, smoked chipotle powder, fresh lime zest.',
    price: 8.50,
    ingredients: ['Sweet Corn', 'Truffle Aioli', 'Cotija Cheese', 'Lime Zest', 'Chipotle Dust'],
    spicyLevel: 1,
    tags: ['Gluten-Free', 'Vegetarian', 'Local Favorite'],
    imageUrl: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'menu-5',
    name: 'Hibiscus Agave Agua Fresca',
    category: 'Drinks',
    description: 'Cold-brewed organic hibiscus blossoms infused with fresh garden mint leaves and sweetened with natural organic blue agave nectar.',
    price: 4.50,
    ingredients: ['Hibiscus Flowers', 'Mint Leaves', 'Organic Agave', 'Filtered Water'],
    spicyLevel: 0,
    tags: ['Vegan', 'Organic', 'Refresher'],
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    available: true,
  },
  {
    id: 'menu-6',
    name: 'Mesquite Smoked Pork Belly',
    category: 'Specials',
    description: 'Double-smoked crisped pork belly, raw agave nectar drizzle, salsa verde, pickled radish crowns, toasted sesame seeds.',
    price: 8.00,
    ingredients: ['Pork Belly', 'Agave Drizzle', 'Salsa Verde', 'Pickled Radish', 'Sesame Seeds'],
    spicyLevel: 1,
    tags: ['Chef Special', 'Limited Release'],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=600',
    available: true,
  }
];

const DEFAULT_LOCATION: TruckLocation = {
  id: 'loc-current',
  spotName: 'Arts District Co-Op',
  address: '828 E 3rd St, Los Angeles, CA 90013',
  hours: '6:00 PM - Late (11:30 PM)',
  status: 'Live',
  latitude: 34.0452,
  longitude: -118.2356,
  updatedAt: new Date().toISOString(),
};

const DEFAULT_LEADS: CateringLead[] = [
  {
    id: 'lead-1',
    name: 'Alexander Sterling',
    email: 'alex@sterling-events.com',
    phone: '213-555-0192',
    date: '2026-07-15',
    guestCount: 150,
    budgetRange: '5k_10k',
    details: 'Corporate launch event for our design studio. Need premium setups, craft cocktails, and full menu service.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    phone: '310-555-4819',
    date: '2026-08-01',
    guestCount: 85,
    budgetRange: '2k_5k',
    details: 'Intimate outdoor backyard wedding party. Prefer gluten-free and vegan alternatives featured heavily in menu.',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'marcus.vance@gmail.com',
    name: 'Marcus Vance',
    subscribedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'Active',
    source: 'Footer VIP Club'
  },
  {
    id: 'sub-2',
    email: 'clara.jones@designhouse.co',
    name: 'Clara Jones',
    subscribedAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    status: 'Active',
    source: 'Footer VIP Club'
  },
  {
    id: 'sub-3',
    email: 'hannah.g@malibuluxe.com',
    name: 'Hannah Greenfield',
    subscribedAt: new Date(Date.now() - 3600000 * 240).toISOString(),
    status: 'Active',
    source: 'Footer VIP Club'
  }
];


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [truckLocation, setTruckLocation] = useState<TruckLocation>(DEFAULT_LOCATION);
  const [cateringLeads, setCateringLeads] = useState<CateringLead[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (isSupabaseConfigured && supabase) {
        try {
          // 1. Fetch Location
          const { data: locData, error: locError } = await supabase
            .from('truck_locations')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1);

          if (!locError && locData && locData.length > 0) {
            const dbLoc = locData[0];
            setTruckLocation({
              id: dbLoc.id,
              spotName: dbLoc.spot_name,
              address: dbLoc.address,
              hours: dbLoc.hours,
              status: dbLoc.status as TruckLocation['status'],
              latitude: dbLoc.latitude,
              longitude: dbLoc.longitude,
              updatedAt: dbLoc.updated_at,
            });
          } else {
            console.warn('Could not load truck location from Supabase, using default', locError);
          }

          // 2. Fetch Menu Items
          const { data: menuData, error: menuError } = await supabase
            .from('menu_items')
            .select('*')
            .order('name');

          if (!menuError && menuData) {
            setMenuItems(
              menuData.map((item: any) => ({
                id: item.id,
                name: item.name,
                category: item.category,
                description: item.description,
                price: parseFloat(item.price),
                ingredients: item.ingredients || [],
                spicyLevel: item.spicy_level as MenuItem['spicyLevel'],
                tags: item.tags || [],
                imageUrl: item.image_url,
                available: item.available,
              }))
            );
          } else {
            setMenuItems(DEFAULT_MENU_ITEMS);
          }

          // 3. Fetch Catering Leads
          const { data: leadData, error: leadError } = await supabase
            .from('catering_leads')
            .select('*')
            .order('created_at', { ascending: false });

          if (!leadError && leadData) {
            setCateringLeads(
              leadData.map((item: any) => ({
                id: item.id,
                name: item.name,
                email: item.email,
                phone: item.phone,
                date: item.date,
                guestCount: item.guest_count,
                budgetRange: item.budget_range,
                details: item.details,
                status: item.status,
                createdAt: item.created_at,
              }))
            );
          }
        } catch (err) {
          console.error('Supabase query failed, falling back to local storage', err);
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Realtime subscription setup
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Realtime channel for truck location changes
    const locationSubscription = supabase
      .channel('public:truck_locations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'truck_locations' },
        (payload) => {
          console.log('Realtime location update received:', payload);
          if (payload.new) {
            const dbLoc = payload.new as any;
            setTruckLocation({
              id: dbLoc.id,
              spotName: dbLoc.spot_name,
              address: dbLoc.address,
              hours: dbLoc.hours,
              status: dbLoc.status as TruckLocation['status'],
              latitude: dbLoc.latitude,
              longitude: dbLoc.longitude,
              updatedAt: dbLoc.updated_at,
            });
          }
        }
      )
      .subscribe();

    // Realtime channel for menu items changes
    const menuSubscription = supabase
      .channel('public:menu_items')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        async () => {
          // Re-fetch all menu items to keep in sync
          const { data } = await supabase.from('menu_items').select('*').order('name');
          if (data) {
            setMenuItems(
              data.map((item: any) => ({
                id: item.id,
                name: item.name,
                category: item.category,
                description: item.description,
                price: parseFloat(item.price),
                ingredients: item.ingredients || [],
                spicyLevel: item.spicy_level as MenuItem['spicyLevel'],
                tags: item.tags || [],
                imageUrl: item.image_url,
                available: item.available,
              }))
            );
          }
        }
      )
      .subscribe();

    // Realtime channel for catering leads
    const leadsSubscription = supabase
      .channel('public:catering_leads')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'catering_leads' },
        async () => {
          const { data } = await supabase
            .from('catering_leads')
            .select('*')
            .order('created_at', { ascending: false });
          if (data) {
            setCateringLeads(
              data.map((item: any) => ({
                id: item.id,
                name: item.name,
                email: item.email,
                phone: item.phone,
                date: item.date,
                guestCount: item.guest_count,
                budgetRange: item.budget_range,
                details: item.details,
                status: item.status,
                createdAt: item.created_at,
              }))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(locationSubscription);
      supabase.removeChannel(menuSubscription);
      supabase.removeChannel(leadsSubscription);
    };
  }, []);

  const loadFromLocalStorage = () => {
    const savedMenu = localStorage.getItem('taco_menu_items');
    const savedLoc = localStorage.getItem('taco_truck_location');
    const savedLeads = localStorage.getItem('taco_catering_leads');
    const savedSubs = localStorage.getItem('taco_newsletter_subscribers');

    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    } else {
      setMenuItems(DEFAULT_MENU_ITEMS);
      localStorage.setItem('taco_menu_items', JSON.stringify(DEFAULT_MENU_ITEMS));
    }

    if (savedLoc) {
      setTruckLocation(JSON.parse(savedLoc));
    } else {
      setTruckLocation(DEFAULT_LOCATION);
      localStorage.setItem('taco_truck_location', JSON.stringify(DEFAULT_LOCATION));
    }

    if (savedLeads) {
      setCateringLeads(JSON.parse(savedLeads));
    } else {
      setCateringLeads(DEFAULT_LEADS);
      localStorage.setItem('taco_catering_leads', JSON.stringify(DEFAULT_LEADS));
    }

    if (savedSubs) {
      setNewsletterSubscribers(JSON.parse(savedSubs));
    } else {
      setNewsletterSubscribers(DEFAULT_SUBSCRIBERS);
      localStorage.setItem('taco_newsletter_subscribers', JSON.stringify(DEFAULT_SUBSCRIBERS));
    }
  };

  const resetToDefaults = () => {
    localStorage.removeItem('taco_menu_items');
    localStorage.removeItem('taco_truck_location');
    localStorage.removeItem('taco_catering_leads');
    localStorage.removeItem('taco_newsletter_subscribers');
    loadFromLocalStorage();
  };

  // 1. Submit catering lead
  const addCateringLead = async (lead: Omit<CateringLead, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    const newLead: CateringLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('catering_leads').insert({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          date: lead.date,
          guest_count: lead.guestCount,
          budget_range: lead.budgetRange,
          details: lead.details,
          status: 'New',
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase insert failed, falling back to local state', err);
      }
    }

    // Local fallback
    const updated = [newLead, ...cateringLeads];
    setCateringLeads(updated);
    localStorage.setItem('taco_catering_leads', JSON.stringify(updated));
    return true;
  };

  // 2. Update truck location (admin)
  const updateTruckLocation = async (location: Omit<TruckLocation, 'id' | 'updatedAt'>): Promise<boolean> => {
    const updatedLoc: TruckLocation = {
      ...location,
      id: truckLocation.id || 'loc-current',
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        // Find existing row or update
        const { error } = await supabase
          .from('truck_locations')
          .update({
            spot_name: location.spotName,
            address: location.address,
            hours: location.hours,
            status: location.status,
            latitude: location.latitude,
            longitude: location.longitude,
            updated_at: updatedLoc.updatedAt,
          })
          .eq('id', updatedLoc.id);

        if (error) {
          // Try inserting if update fails/targets non-existent ID
          const { error: insError } = await supabase.from('truck_locations').insert({
            spot_name: location.spotName,
            address: location.address,
            hours: location.hours,
            status: location.status,
            latitude: location.latitude,
            longitude: location.longitude,
          });
          if (insError) throw insError;
        }
        return true;
      } catch (err) {
        console.error('Supabase location update failed, falling back to local state', err);
      }
    }

    // Local fallback
    setTruckLocation(updatedLoc);
    localStorage.setItem('taco_truck_location', JSON.stringify(updatedLoc));
    return true;
  };

  // 3. Add menu item (admin)
  const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<boolean> => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('menu_items').insert({
          name: item.name,
          category: item.category,
          description: item.description,
          price: item.price,
          ingredients: item.ingredients,
          spicy_level: item.spicyLevel,
          tags: item.tags,
          image_url: item.imageUrl,
          available: item.available,
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase menu insert failed, falling back to local state', err);
      }
    }

    // Local fallback
    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    localStorage.setItem('taco_menu_items', JSON.stringify(updated));
    return true;
  };

  // 4. Update menu item (admin)
  const updateMenuItem = async (item: MenuItem): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('menu_items')
          .update({
            name: item.name,
            category: item.category,
            description: item.description,
            price: item.price,
            ingredients: item.ingredients,
            spicy_level: item.spicyLevel,
            tags: item.tags,
            image_url: item.imageUrl,
            available: item.available,
          })
          .eq('id', item.id);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase menu update failed, falling back to local state', err);
      }
    }

    // Local fallback
    const updated = menuItems.map((m) => (m.id === item.id ? item : m));
    setMenuItems(updated);
    localStorage.setItem('taco_menu_items', JSON.stringify(updated));
    return true;
  };

  // 5. Delete menu item (admin)
  const deleteMenuItem = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('menu_items').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase menu delete failed, falling back to local state', err);
      }
    }

    // Local fallback
    const updated = menuItems.filter((m) => m.id !== id);
    setMenuItems(updated);
    localStorage.setItem('taco_menu_items', JSON.stringify(updated));
    return true;
  };

  // 6. Update lead status (admin)
  const updateLeadStatus = async (id: string, status: CateringLead['status']): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('catering_leads')
          .update({ status })
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase lead update failed, falling back to local state', err);
      }
    }

    // Local fallback
    const updated = cateringLeads.map((l) => (l.id === id ? { ...l, status } : l));
    setCateringLeads(updated);
    localStorage.setItem('taco_catering_leads', JSON.stringify(updated));
    return true;
  };

  // 7. Add newsletter subscriber
  const addNewsletterSubscriber = async (email: string, name?: string): Promise<boolean> => {
    const exists = newsletterSubscribers.some((sub) => sub.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      // Toggle to active if it was unsubscribed, or just keep as-is
      const updated = newsletterSubscribers.map((sub) => 
        sub.email.toLowerCase() === email.toLowerCase() ? { ...sub, status: 'Active' as const } : sub
      );
      setNewsletterSubscribers(updated);
      localStorage.setItem('taco_newsletter_subscribers', JSON.stringify(updated));
      return true;
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email,
      name: name || undefined,
      subscribedAt: new Date().toISOString(),
      status: 'Active',
      source: 'Footer VIP Club'
    };

    const updated = [newSub, ...newsletterSubscribers];
    setNewsletterSubscribers(updated);
    localStorage.setItem('taco_newsletter_subscribers', JSON.stringify(updated));
    return true;
  };

  // 8. Delete newsletter subscriber
  const deleteNewsletterSubscriber = async (id: string): Promise<boolean> => {
    const updated = newsletterSubscribers.filter((sub) => sub.id !== id);
    setNewsletterSubscribers(updated);
    localStorage.setItem('taco_newsletter_subscribers', JSON.stringify(updated));
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        menuItems,
        truckLocation,
        cateringLeads,
        newsletterSubscribers,
        loading,
        isSupabaseMode: isSupabaseConfigured,
        addCateringLead,
        updateTruckLocation,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateLeadStatus,
        addNewsletterSubscriber,
        deleteNewsletterSubscriber,
        resetToDefaults,
      }}
    >

      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
