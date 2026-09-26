import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, TruckLocation, CateringLead } from '../types';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  FolderLock, 
  Users, 
  DollarSign, 
  ClipboardList, 
  Database, 
  Menu as MenuIcon, 
  X, 
  Check, 
  Save, 
  RotateCcw, 
  Mail, 
  Phone, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    menuItems, 
    truckLocation, 
    cateringLeads, 
    newsletterSubscribers,
    deleteNewsletterSubscriber,
    isSupabaseMode, 
    updateTruckLocation, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    updateLeadStatus,
    resetToDefaults
  } = useApp();

  const [activeTab, setActiveTab] = useState<'location' | 'menu' | 'catering' | 'vip'>('location');
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [locForm, setLocForm] = useState({
    spotName: truckLocation.spotName,
    address: truckLocation.address,
    hours: truckLocation.hours,
    status: truckLocation.status,
    latitude: truckLocation.latitude,
    longitude: truckLocation.longitude,
  });

  // Sync locForm when truckLocation changes (from real-time, etc.)
  React.useEffect(() => {
    setLocForm({
      spotName: truckLocation.spotName,
      address: truckLocation.address,
      hours: truckLocation.hours,
      status: truckLocation.status,
      latitude: truckLocation.latitude,
      longitude: truckLocation.longitude,
    });
  }, [truckLocation]);

  // Menu Form states
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    category: 'Tacos',
    description: '',
    price: 6.50,
    ingredients: [],
    spicyLevel: 1,
    tags: [],
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    available: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateTruckLocation({
      ...locForm,
      latitude: parseFloat(locForm.latitude.toString()) || 34.0,
      longitude: parseFloat(locForm.longitude.toString()) || -118.0,
    });
    if (success) {
      showToast('Truck position broadcasted in real-time!');
    }
  };

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMenuItem) {
      const success = await updateMenuItem({
        ...menuForm,
        id: editingMenuItem.id,
      });
      if (success) {
        showToast('Menu item updated successfully!');
        setEditingMenuItem(null);
        setIsAddingMenu(false);
      }
    } else {
      const success = await addMenuItem(menuForm);
      if (success) {
        showToast('New menu item added successfully!');
        setIsAddingMenu(false);
      }
    }
  };

  const startEditMenu = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      ingredients: item.ingredients,
      spicyLevel: item.spicyLevel,
      tags: item.tags,
      imageUrl: item.imageUrl,
      available: item.available,
    });
    setIsAddingMenu(true);
  };

  const handleDeleteMenu = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      const success = await deleteMenuItem(id);
      if (success) {
        showToast('Item deleted from digital catalog.');
      }
    }
  };

  const handleLeadStatusChange = async (id: string, status: CateringLead['status']) => {
    const success = await updateLeadStatus(id, status);
    if (success) {
      showToast(`Lead status shifted to ${status}.`);
    }
  };

  return (
    <>
      {/* Drawer Toggle Trigger (Floating VIP Admin Control badge on bottom right) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-zinc-950 text-white border border-zinc-800 px-4 py-3 rounded-xl shadow-2xl hover:border-agave-500 hover:text-agave-400 transition-all duration-200 flex items-center gap-2 cursor-pointer font-mono text-xs font-bold uppercase tracking-wider group"
      >
        <FolderLock className="w-4 h-4 text-agave-400 group-hover:rotate-12 transition-transform" />
        Vitals Console
      </button>

      {/* Admin Panel Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-4xl bg-obsidian border-l border-zinc-850 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-850 bg-charcoal flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-agave-400">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-medium text-lg text-white">Truck Command Center</h3>
                {isSupabaseMode ? (
                  <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest text-agave-400 bg-agave-950/40 border border-agave-900/30 px-1.5 py-0.5 rounded">
                    <Database className="w-2.5 h-2.5" /> Realtime Live
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                    <Database className="w-2.5 h-2.5" /> Sandbox State
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-xs font-mono mt-0.5">Control location feeds, menu assets, and catering leads.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Reset all location data, menu items, and catering leads back to default?')) {
                  resetToDefaults();
                  showToast('Database restored to default states.');
                }
              }}
              className="p-2 border border-zinc-850 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-lg transition-all"
              title="Reset Database to Defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 border border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-850 bg-charcoal/50">
          <button
            onClick={() => { setActiveTab('location'); setIsAddingMenu(false); }}
            className={`flex-1 py-3 text-center text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'location'
                ? 'border-agave-500 text-agave-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Location Broadcast
          </button>
          <button
            onClick={() => { setActiveTab('menu'); }}
            className={`flex-1 py-3 text-center text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'menu'
                ? 'border-agave-500 text-agave-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Menu Builder ({menuItems.length})
          </button>
          <button
            onClick={() => { setActiveTab('catering'); setIsAddingMenu(false); }}
            className={`flex-1 py-3 text-center text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'catering'
                ? 'border-agave-500 text-agave-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Catering Pipeline ({cateringLeads.length})
          </button>
          <button
            onClick={() => { setActiveTab('vip'); setIsAddingMenu(false); }}
            className={`flex-1 py-3 text-center text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'vip'
                ? 'border-agave-500 text-agave-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            VIP Club ({(newsletterSubscribers || []).length})
          </button>
        </div>


        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: LOCATION BROADCASTER */}
          {activeTab === 'location' && (
            <form onSubmit={handleLocSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-1">
                <h4 className="font-display text-lg text-white font-medium">Broadcast Real-time Spot</h4>
                <p className="text-zinc-500 text-xs">Update your truck coords, active street address, and opening status instantly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Current Spot Name</label>
                  <input
                    type="text"
                    required
                    value={locForm.spotName}
                    onChange={(e) => setLocForm({ ...locForm, spotName: e.target.value })}
                    className="w-full bg-charcoal border border-zinc-800 focus:border-agave-500 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none"
                    placeholder="Arts District Co-Op"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Operational Hours</label>
                  <input
                    type="text"
                    required
                    value={locForm.hours}
                    onChange={(e) => setLocForm({ ...locForm, hours: e.target.value })}
                    className="w-full bg-charcoal border border-zinc-800 focus:border-agave-500 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none"
                    placeholder="6:00 PM - 11:30 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Street Address</label>
                <input
                  type="text"
                  required
                  value={locForm.address}
                  onChange={(e) => setLocForm({ ...locForm, address: e.target.value })}
                  className="w-full bg-charcoal border border-zinc-800 focus:border-agave-500 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none"
                  placeholder="828 E 3rd St, Los Angeles, CA 90013"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Latitude Coords</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={locForm.latitude}
                    onChange={(e) => setLocForm({ ...locForm, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-charcoal border border-zinc-800 focus:border-agave-500 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Longitude Coords</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={locForm.longitude}
                    onChange={(e) => setLocForm({ ...locForm, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-charcoal border border-zinc-800 focus:border-agave-500 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Operational Status</label>
                  <select
                    value={locForm.status}
                    onChange={(e) => setLocForm({ ...locForm, status: e.target.value as TruckLocation['status'] })}
                    className="w-full bg-charcoal border border-zinc-800 focus:border-agave-500 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none appearance-none"
                  >
                    <option value="Live">🟢 Live (Active Grid)</option>
                    <option value="Setting Up">🟡 Setting Up</option>
                    <option value="Sold Out">🔴 Sold Out (Closed Early)</option>
                    <option value="Off Duty">⚫ Off Duty</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-zinc-200 text-black font-bold rounded-xl py-3.5 px-6 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Broadcast Location Stream
              </button>
            </form>
          )}

          {/* TAB 2: MENU BUILDER */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="font-display text-lg text-white font-medium">Digital Catalog Registry</h4>
                  <p className="text-zinc-500 text-xs">Create, edit, or remove gastromy listings in real-time.</p>
                </div>
                {!isAddingMenu && (
                  <button
                    onClick={() => {
                      setEditingMenuItem(null);
                      setMenuForm({
                        name: '',
                        category: 'Tacos',
                        description: '',
                        price: 6.50,
                        ingredients: [],
                        spicyLevel: 1,
                        tags: [],
                        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
                        available: true,
                      });
                      setIsAddingMenu(true);
                    }}
                    className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-agave-500 hover:text-agave-400 px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Recipe
                  </button>
                )}
              </div>

              {isAddingMenu ? (
                <form onSubmit={handleMenuSubmit} className="bg-charcoal border border-zinc-850 p-5 rounded-2xl space-y-4 max-w-2xl mx-auto">
                  <div className="flex justify-between items-center border-b border-zinc-850 pb-3">
                    <h5 className="font-mono text-xs font-bold uppercase text-zinc-400">
                      {editingMenuItem ? 'Edit Recipe Specs' : 'Register New Culinary Design'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => setIsAddingMenu(false)}
                      className="text-zinc-500 hover:text-zinc-300 text-xs font-mono"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Recipe Name</label>
                      <input
                        type="text"
                        required
                        value={menuForm.name}
                        onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                        className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none"
                        placeholder="Chipotle Birria"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Category</label>
                      <select
                        value={menuForm.category}
                        onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value as MenuItem['category'] })}
                        className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none"
                      >
                        <option value="Tacos">Tacos</option>
                        <option value="Sides">Sides</option>
                        <option value="Drinks">Drinks</option>
                        <option value="Specials">Specials</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Price ($ USD)</label>
                      <input
                        type="number"
                        step="0.05"
                        required
                        value={menuForm.price}
                        onChange={(e) => setMenuForm({ ...menuForm, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Spicy Level (0-3)</label>
                      <select
                        value={menuForm.spicyLevel}
                        onChange={(e) => setMenuForm({ ...menuForm, spicyLevel: parseInt(e.target.value) as MenuItem['spicyLevel'] })}
                        className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none"
                      >
                        <option value="0">0 - Mild / Sweet</option>
                        <option value="1">1 - Gentle Heat</option>
                        <option value="2">2 - Heavy Punch</option>
                        <option value="3">3 - Agave Reaper</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Availability</label>
                      <select
                        value={menuForm.available ? 'true' : 'false'}
                        onChange={(e) => setMenuForm({ ...menuForm, available: e.target.value === 'true' })}
                        className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none"
                      >
                        <option value="true">In Stock / Servable</option>
                        <option value="false">Sold Out / Off Menu</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Recipe Description</label>
                    <textarea
                      required
                      value={menuForm.description}
                      onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                      className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none h-16 resize-none"
                      placeholder="Ingredients explanation, marination timelines, and sensory details."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Ingredients (Comma separated)</label>
                      <input
                        type="text"
                        value={menuForm.ingredients.join(', ')}
                        onChange={(e) => setMenuForm({ ...menuForm, ingredients: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none"
                        placeholder="Beef brisket, Consommé, Cilantro"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Tags (Comma separated)</label>
                      <input
                        type="text"
                        value={menuForm.tags.join(', ')}
                        onChange={(e) => setMenuForm({ ...menuForm, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none"
                        placeholder="Vegan, Gluten-Free, Chef Special"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Premium Styling Image URL</label>
                    <input
                      type="url"
                      required
                      value={menuForm.imageUrl}
                      onChange={(e) => setMenuForm({ ...menuForm, imageUrl: e.target.value })}
                      className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-agave-500 hover:bg-agave-600 text-black font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {editingMenuItem ? 'Save Recipe Changes' : 'Publish Recipe Asset'}
                  </button>
                </form>
              ) : null}

              {/* Menu Items List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="bg-charcoal border border-zinc-850 p-4 rounded-xl flex gap-3 justify-between items-start">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-zinc-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-semibold text-zinc-200 text-sm truncate">{item.name}</h5>
                        <span className="text-[9px] font-mono text-zinc-500 bg-zinc-950 px-1 py-0.2 rounded uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-agave-400' : 'bg-red-500'}`} />
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {item.available ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => startEditMenu(item)}
                        className="p-1.5 border border-zinc-800 text-zinc-400 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer"
                        title="Edit specifications"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(item.id)}
                        className="p-1.5 border border-zinc-800 text-zinc-500 hover:text-chipotle-400 rounded hover:bg-zinc-900 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CATERING PIPELINE */}
          {activeTab === 'catering' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="font-display text-lg text-white font-medium">High-Ticket Lead Pipeline</h4>
                <p className="text-zinc-500 text-xs">Manage submissions, budget sizes, and clients directly.</p>
              </div>

              {cateringLeads.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-zinc-850 rounded-2xl">
                  <ClipboardList className="w-10 h-10 text-zinc-700 mx-auto" />
                  <p className="text-zinc-500 text-xs font-mono mt-3">No catering commissions registered yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cateringLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      className={`border p-5 rounded-2xl bg-charcoal shadow-lg relative overflow-hidden transition-all duration-150 ${
                        lead.status === 'New' 
                          ? 'border-agave-500/40' 
                          : lead.status === 'Approved' 
                            ? 'border-emerald-500/20' 
                            : 'border-zinc-850'
                      }`}
                    >
                      {/* Top Status Belt */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-850/60 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-semibold text-white">{lead.name}</span>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider py-0.5 px-2 rounded-md ${
                            lead.budgetRange === 'over_10k' || lead.budgetRange === '5k_10k'
                              ? 'bg-amber-950/40 border border-amber-900/30 text-amber-400'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                          }`}>
                            Budget: {lead.budgetRange.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Logistics Status:</span>
                          <select
                            value={lead.status}
                            onChange={(e) => handleLeadStatusChange(lead.id, e.target.value as CateringLead['status'])}
                            className="bg-obsidian border border-zinc-800 focus:border-agave-500 rounded-lg px-2.5 py-1 text-xs text-zinc-300 outline-none"
                          >
                            <option value="New">🔵 New Lead</option>
                            <option value="Contacted">🟡 Contacted</option>
                            <option value="Approved">🟢 Approved/Locked</option>
                            <option value="Archived">⚫ Archived</option>
                          </select>
                        </div>
                      </div>

                      {/* Detail Body */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-zinc-400">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-zinc-500" />
                            <a href={`mailto:${lead.email}`} className="hover:text-agave-400 underline">{lead.email}</a>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-zinc-500" />
                            <a href={`tel:${lead.phone}`} className="hover:text-agave-400 underline">{lead.phone}</a>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Target Date: <strong className="text-zinc-200">{lead.date}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Heads: <strong className="text-zinc-200">{lead.guestCount} guest</strong></span>
                          </div>
                        </div>

                        <div className="text-[10px] font-sans text-zinc-500 leading-relaxed italic bg-obsidian p-2 rounded-xl border border-zinc-900 md:col-span-3">
                          "{lead.details}"
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VIP CLUB DISPATCH REGISTRY */}
          {activeTab === 'vip' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="font-display text-lg text-white font-medium">VIP Dispatch Subscribers</h4>
                <p className="text-zinc-500 text-xs">Manage your list of subscribed customer emails for upcoming spot broadcasts.</p>
              </div>

              {(newsletterSubscribers || []).length === 0 ? (
                <div className="py-12 text-center border border-dashed border-zinc-850 rounded-2xl">
                  <Mail className="w-10 h-10 text-zinc-700 mx-auto" />
                  <p className="text-zinc-500 text-xs font-mono mt-3">No registered VIP members yet.</p>
                </div>
              ) : (
                <div className="border border-zinc-850 rounded-2xl bg-charcoal overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-850/60 bg-obsidian text-zinc-400 font-mono text-[10px] tracking-wider uppercase">
                          <th className="p-4 font-semibold">Subscriber</th>
                          <th className="p-4 font-semibold">Subscribed Date</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold">Source</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-850/40 text-zinc-300">
                        {(newsletterSubscribers || []).map((sub) => (
                          <tr key={sub.id} className="hover:bg-zinc-900/40 transition-colors">
                            <td className="p-4">
                              <div className="font-sans font-medium text-white">{sub.name || 'Anonymous Club Member'}</div>
                              <div className="font-mono text-zinc-500 text-[11px] mt-0.5">{sub.email}</div>
                            </td>
                            <td className="p-4 font-mono text-zinc-400">
                              {new Date(sub.subscribedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                sub.status === 'Active' 
                                  ? 'bg-emerald-950/40 border border-emerald-900/30 text-emerald-400' 
                                  : 'bg-zinc-900 border border-zinc-800 text-zinc-450'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Active' ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                                {sub.status}
                              </span>
                            </td>
                            <td className="p-4 font-sans text-zinc-500 text-[11px]">
                              {sub.source || 'General Registry'}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  deleteNewsletterSubscriber(sub.id);
                                  showToast('VIP Subscriber removed.');
                                }}
                                className="px-2.5 py-1 text-[10px] font-mono font-bold bg-zinc-900/60 hover:bg-chipotle-950/40 border border-zinc-800 hover:border-chipotle-900/40 text-zinc-450 hover:text-chipotle-400 rounded-md transition-all cursor-pointer"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>


        {/* Global Toast Message inside console */}
        {toastMessage && (
          <div className="absolute bottom-6 left-6 right-6 bg-agave-400 text-black font-mono text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 shadow-2xl animate-bounce">
            <Check className="w-4 h-4 text-black stroke-[3]" />
            {toastMessage}
          </div>
        )}
      </div>
    </>
  );
};
