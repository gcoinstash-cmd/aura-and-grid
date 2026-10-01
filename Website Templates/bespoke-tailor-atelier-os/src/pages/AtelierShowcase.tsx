import { useState } from 'react'
import {
  Scissors, Plus, X, Calendar, Clock,
  Layers, CheckCircle2, ChevronRight
} from 'lucide-react'

// ─── MOCK DATA ────────────────────────────────────────────────
interface Commission {
  id: string
  clientName: string
  garmentType: string
  fabricName: string
  fabricCode: string
  canvas: string
  status: string
  valueGBP: number
  leadWeeks: number
  cutter: string
  progress: number
  details: string
}

interface FabricSwatch {
  code: string
  mill: string
  name: string
  weight: number
  pattern: string
  priceGBP: number
  meters: number
  category: string
  colorHex: string
}

const INITIAL_COMMISSIONS: Commission[] = [
  {
    id: 'COM-089',
    clientName: 'Lord Alistair Pemberton',
    garmentType: '3-Piece Lounge Suit',
    fabricName: 'Loro Piana Super 160s',
    fabricCode: 'LP-160-001',
    canvas: 'Full Floating Canvas',
    status: 'Second Fitting',
    valueGBP: 6800,
    leadWeeks: 18,
    cutter: 'Mr. Thomas Archer',
    progress: 75,
    details: 'Peak lapels, hand-padded chest canvas, royal blue silk lining, horn buttons.',
  },
  {
    id: 'COM-090',
    clientName: 'Viktor Sokolov',
    garmentType: 'Double-Breasted Greatcoat',
    fabricName: 'Scabal Golden Bale Cashmere',
    fabricCode: 'SC-HT-009',
    canvas: 'Full Floating Canvas',
    status: 'Cloth Cut',
    valueGBP: 4200,
    leadWeeks: 22,
    cutter: 'Mr. James Thornton',
    progress: 35,
    details: 'Camel melton weave, guard coat back pleat, turnback cuffs, genuine horn buttons.',
  },
  {
    id: 'COM-091',
    clientName: 'Sebastián Ramírez',
    garmentType: 'Midnight Shawl Dinner Suit',
    fabricName: 'Dormeuil Amadeus Worsted',
    fabricCode: 'DM-AM-018',
    canvas: 'Full Floating Canvas',
    status: 'Pattern Drafted',
    valueGBP: 3800,
    leadWeeks: 16,
    cutter: 'Mr. Thomas Archer',
    progress: 20,
    details: 'Grosgrain silk lapel facings, single jetted pockets, side adjusters on trousers.',
  },
  {
    id: 'COM-092',
    clientName: 'Baroness Helena Vance',
    garmentType: 'Equestrian Hacking Jacket',
    fabricName: 'Holland & Sherry Tweed',
    fabricCode: 'HS-FR-042',
    canvas: 'Half Canvas',
    status: 'Final Basting',
    valueGBP: 3100,
    leadWeeks: 14,
    cutter: 'Mr. James Thornton',
    progress: 85,
    details: 'Slanted flap pockets with ticket pocket, deep rear vent, velvet storm collar.',
  },
]

const FABRICS: FabricSwatch[] = [
  {
    code: 'LP-160-001',
    mill: 'Loro Piana',
    name: 'Super 160s Platinum Navy',
    weight: 310,
    pattern: 'Solid Twill',
    priceGBP: 285,
    meters: 18.5,
    category: 'Wool',
    colorHex: '#1B2434',
  },
  {
    code: 'HS-FR-042',
    mill: 'Holland & Sherry',
    name: 'Fresco III High-Twist',
    weight: 280,
    pattern: 'Pinstripe Charcoal',
    priceGBP: 145,
    meters: 24.0,
    category: 'Fresco',
    colorHex: '#26292E',
  },
  {
    code: 'DM-AM-018',
    mill: 'Dormeuil',
    name: 'Amadeus 365 Merino',
    weight: 260,
    pattern: 'Midnight Plain',
    priceGBP: 195,
    meters: 12.0,
    category: 'Wool',
    colorHex: '#101726',
  },
  {
    code: 'SC-HT-009',
    mill: 'Scabal',
    name: 'Golden Bale Cashmere',
    weight: 340,
    pattern: 'Herringbone Camel',
    priceGBP: 340,
    meters: 8.5,
    category: 'Cashmere',
    colorHex: '#8C6843',
  },
  {
    code: 'VBC-WP-033',
    mill: 'Vitale Barberis',
    name: 'Perennial S130s Windowpane',
    weight: 270,
    pattern: 'Windowpane Slate',
    priceGBP: 115,
    meters: 30.0,
    category: 'Wool',
    colorHex: '#2E3846',
  },
  {
    code: 'SP-LN-005',
    mill: 'Spence Bryson',
    name: 'Irish Crisp Linen',
    weight: 380,
    pattern: 'Ecru Plain Weave',
    priceGBP: 125,
    meters: 14.2,
    category: 'Linen',
    colorHex: '#D1C7B7',
  },
]

const FITTINGS = [
  {
    id: 'FIT-101',
    client: 'Lord Alistair Pemberton',
    garment: '3-Piece Lounge Suit (LP-160-001)',
    type: 'Second Fitting (Forward Fitting)',
    datetime: 'Tomorrow at 11:30 AM',
    room: 'Salon Mayfair — Suite A',
    fitter: 'Mr. Thomas Archer',
    notes: 'Shorten left sleeve by 0.5cm; verify waist ease with vest.',
  },
  {
    id: 'FIT-102',
    client: 'Baroness Helena Vance',
    garment: 'Equestrian Hacking Jacket',
    type: 'Final Fitting & Delivery Assessment',
    datetime: 'Thursday at 2:00 PM',
    room: 'Salon Burlington — Suite B',
    fitter: 'Mr. James Thornton',
    notes: 'Confirm collar roll stance over riding breeches.',
  },
  {
    id: 'FIT-103',
    client: 'Viktor Sokolov',
    garment: 'Double-Breasted Greatcoat',
    type: 'First Fitting (Baste Fitting)',
    datetime: 'Next Monday at 10:00 AM',
    room: 'Salon Mayfair — Suite A',
    fitter: 'Mr. James Thornton',
    notes: 'Check balance of double-breasted overlap over heavy knitwear.',
  },
]

const CLIENTS = [
  {
    name: 'Lord Alistair Pemberton',
    tier: 'Royal Patron',
    activeOrders: 2,
    lifetimeSpend: '£48,500',
    chest: '101.5 cm',
    waist: '88.0 cm',
    sleeve: '64.5 cm',
    cutter: 'Mr. Thomas Archer',
  },
  {
    name: 'Viktor Sokolov',
    tier: 'Mayfair Circle',
    activeOrders: 1,
    lifetimeSpend: '£22,800',
    chest: '106.0 cm',
    waist: '92.5 cm',
    sleeve: '66.0 cm',
    cutter: 'Mr. James Thornton',
  },
  {
    name: 'Sebastián Ramírez',
    tier: 'Mayfair Circle',
    activeOrders: 1,
    lifetimeSpend: '£14,200',
    chest: '98.0 cm',
    waist: '84.0 cm',
    sleeve: '63.0 cm',
    cutter: 'Mr. Thomas Archer',
  },
  {
    name: 'Baroness Helena Vance',
    tier: 'Savile Guild',
    activeOrders: 1,
    lifetimeSpend: '£19,400',
    chest: '92.0 cm',
    waist: '74.0 cm',
    sleeve: '61.5 cm',
    cutter: 'Mr. James Thornton',
  },
]

export default function AtelierShowcase() {
  const [activeTab, setActiveTab] = useState<'commissions' | 'fabrics' | 'fittings' | 'clients'>('commissions')
  const [commissions, setCommissions] = useState<Commission[]>(INITIAL_COMMISSIONS)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Intake Sheet Form State
  const [newClient, setNewClient] = useState('')
  const [newGarment, setNewGarment] = useState('2-Piece Bespoke Suit')
  const [newFabric, setNewFabric] = useState('LP-160-001')
  const [newCanvas, setNewCanvas] = useState('Full Floating Canvas')
  const [newValue, setNewValue] = useState('4500')
  const [newLead, setNewLead] = useState('18')

  function handleCreateCommission(e: React.FormEvent) {
    e.preventDefault()
    if (!newClient.trim()) return

    const matchedFabric = FABRICS.find(f => f.code === newFabric)
    const newEntry: Commission = {
      id: `COM-0${93 + commissions.length - 4}`,
      clientName: newClient,
      garmentType: newGarment,
      fabricName: matchedFabric ? `${matchedFabric.mill} ${matchedFabric.name}` : 'Bespoke Selection',
      fabricCode: newFabric,
      canvas: newCanvas,
      status: 'Intake Registered',
      valueGBP: Number(newValue) || 4500,
      leadWeeks: Number(newLead) || 18,
      cutter: 'Mr. Thomas Archer',
      progress: 10,
      details: 'Initial measurements taken. Pattern drafting queued in cutting room.',
    }

    setCommissions([newEntry, ...commissions])
    setIsModalOpen(false)
    setNewClient('')
  }

  const filteredFabrics = selectedCategory === 'All'
    ? FABRICS
    : FABRICS.filter(f => f.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDED] flex flex-col font-sans">
      {/* ─── ATELIER TOP BRAND BAR ─────────────────────────────── */}
      <header className="border-b border-[#1C2230] bg-[#0E1117] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#C5A880] text-black flex items-center justify-center shadow-md">
              <Scissors size={18} />
            </div>
            <div>
              <span className="font-serif font-bold text-white text-xl tracking-wider block">HUNTSMAN &amp; CO.</span>
              <span className="text-[11px] text-[#C5A880] font-mono tracking-widest uppercase block">
                Savile Row • Bespoke Atelier OS
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-[#141923] p-1.5 rounded-lg border border-[#232B3E] overflow-x-auto">
            {[
              { id: 'commissions', label: 'Active Commissions' },
              { id: 'fabrics', label: 'Cloth Vault' },
              { id: 'fittings', label: 'Salon Schedule' },
              { id: 'clients', label: 'Client Dossier' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#C5A880] text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-[#1E2535]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#C5A880] hover:bg-[#B3966E] text-black text-xs font-bold font-serif py-2.5 px-4 rounded-lg transition-colors shadow"
            >
              <Plus size={14} />
              <span>Commission Intake</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── STATUS TELEMETRY BANNER ──────────────────────────── */}
      <div className="border-b border-[#1C2230] bg-[#0A0D13] py-2 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ATELIER IN SESSION
            </span>
            <span>|</span>
            <span>{commissions.length} Active Commissions</span>
            <span>•</span>
            <span>3 Fittings This Week</span>
            <span>•</span>
            <span>Lead Time: 16–20 Weeks</span>
          </div>
          <div className="text-slate-500">
            Savile Row No. 11 • Supreme Court &amp; Royal Warrant Compliant
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ──────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* TAB 1: ASYMMETRIC EDITORIAL SHOWCASE (ARCHETYPE B) */}
        {activeTab === 'commissions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: PRIMARY COMMISSIONS LIST (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">Current Commissions</h2>
                  <p className="text-sm text-slate-400 font-sans mt-0.5">
                    Individual bespoke garments in hand-drafting and fitting cycle.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#C5A880] border border-[#C5A880]/30 px-2.5 py-1 rounded">
                  {commissions.length} BESPOKE ORDERS
                </span>
              </div>

              <div className="space-y-4">
                {commissions.map(c => (
                  <article
                    key={c.id}
                    className="bg-[#0E1117] border border-[#1C2230] rounded-xl p-5 hover:border-[#C5A880]/50 transition-all shadow-md group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#C5A880]">{c.id}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs font-mono text-slate-400">{c.cutter}</span>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-white mt-1 group-hover:text-[#C5A880] transition-colors">
                          {c.clientName}
                        </h3>
                        <p className="text-sm text-slate-300 font-sans">{c.garmentType}</p>
                      </div>
                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
                        <span className="text-base font-serif font-bold text-white">
                          £{c.valueGBP.toLocaleString()}
                        </span>
                        <span className="inline-block mt-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30">
                          {c.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#141923] border border-[#1E2535] rounded-lg p-3 text-xs space-y-2 mb-4 font-sans text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Selected Cloth:</span>
                        <span className="font-mono text-white">{c.fabricName} ({c.fabricCode})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Construction:</span>
                        <span className="text-[#C5A880] font-medium">{c.canvas}</span>
                      </div>
                      <p className="text-slate-400 italic pt-1 border-t border-[#1C2230]">
                        "{c.details}"
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                        <span>Production Progress</span>
                        <span>{c.progress}% • Est. Lead {c.leadWeeks} wks</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1C2230] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C5A880] rounded-full transition-all duration-500"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: CLOTH SWATCH SELECTOR (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Cloth Vault</h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Noble mills • Certified bolt allocations
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-500">6 IN-HOUSE BOLTS</div>
              </div>

              {/* Swatch Filter Tags */}
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Wool', 'Fresco', 'Cashmere', 'Linen'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#C5A880] text-black font-bold'
                        : 'bg-[#141923] text-slate-400 hover:text-white border border-[#1E2535]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Swatch Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                {filteredFabrics.map(f => (
                  <div
                    key={f.code}
                    className="bg-[#0E1117] border border-[#1C2230] rounded-xl p-4 flex gap-4 items-center hover:border-[#C5A880]/40 transition-colors"
                  >
                    <div
                      className="w-16 h-16 rounded-lg flex-shrink-0 border border-white/10 shadow-inner flex items-center justify-center"
                      style={{ backgroundColor: f.colorHex }}
                    >
                      <Layers size={18} className="text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#C5A880] font-bold">{f.code}</span>
                        <span className="text-xs font-serif font-bold text-white">£{f.priceGBP}/m</span>
                      </div>
                      <h4 className="text-sm font-serif font-bold text-white truncate">{f.name}</h4>
                      <p className="text-xs text-slate-400 truncate">{f.mill} • {f.pattern}</p>
                      <div className="flex items-center justify-between mt-1 text-[11px] font-mono text-slate-500">
                        <span>{f.weight} GSM</span>
                        <span>{f.meters}m Available</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Atelier Cutter Note Box */}
              <div className="bg-[#141923] border border-[#232B3E] rounded-xl p-5 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A880] font-serif font-bold text-sm">
                  <Scissors size={14} />
                  <span>The Cutter's Philosophy</span>
                </div>
                <p className="leading-relaxed text-slate-400 font-sans">
                  "Every garment is drafted individually from measurements taken directly in the salon. We cut by shears on paper block before chalking onto fine cloth, balancing balance, sleeve pitch, and natural waist suppression."
                </p>
                <div className="text-[11px] font-mono text-[#C5A880] pt-1">
                  — Mr. Thomas Archer, Head Cutter
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FABRICS CATALOG */}
        {activeTab === 'fabrics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white">The Savile Row Cloth Archive</h2>
              <p className="text-sm text-slate-400">
                Explore our mill-sourced inventory from Biella, Huddersfield, and Scotland.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FABRICS.map(f => (
                <div key={f.code} className="bg-[#0E1117] border border-[#1C2230] rounded-xl overflow-hidden flex flex-col">
                  <div
                    className="h-32 w-full flex items-center justify-center border-b border-white/5"
                    style={{ backgroundColor: f.colorHex }}
                  >
                    <span className="text-xs font-mono px-3 py-1 rounded bg-black/60 text-white backdrop-blur-sm">
                      {f.mill} Mill
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono text-[#C5A880]">
                        <span>{f.code}</span>
                        <span>{f.category}</span>
                      </div>
                      <h3 className="text-base font-serif font-bold text-white mt-1">{f.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{f.pattern} • {f.weight} GSM</p>
                    </div>
                    <div className="pt-3 border-t border-[#1C2230] flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">Available: {f.meters} meters</span>
                      <span className="text-base font-serif font-bold text-[#C5A880]">£{f.priceGBP}/m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SALON APPOINTMENTS */}
        {activeTab === 'fittings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white">Private Salon Appointments</h2>
              <p className="text-sm text-slate-400">
                Fitting sessions, balance adjustments, and delivery handoffs.
              </p>
            </div>
            <div className="space-y-4">
              {FITTINGS.map(fit => (
                <div key={fit.id} className="bg-[#0E1117] border border-[#1C2230] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#C5A880] font-bold">{fit.id}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-mono text-slate-400">{fit.room}</span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-white">{fit.client}</h3>
                    <p className="text-sm text-slate-300 font-sans">{fit.garment}</p>
                    <p className="text-xs text-slate-400 italic">Notes: {fit.notes}</p>
                  </div>
                  <div className="text-left md:text-right space-y-1">
                    <div className="flex items-center md:justify-end gap-1.5 text-xs text-[#C5A880] font-mono">
                      <Calendar size={13} />
                      <span>{fit.datetime}</span>
                    </div>
                    <div className="flex items-center md:justify-end gap-1.5 text-xs text-slate-400 font-mono">
                      <Clock size={13} />
                      <span>Fitter: {fit.fitter}</span>
                    </div>
                    <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {fit.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CLIENT DOSSIER */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white">Private Client Dossier</h2>
              <p className="text-sm text-slate-400">
                Certified measurements, anatomical preferences, and commission heritage.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CLIENTS.map(cl => (
                <div key={cl.name} className="bg-[#0E1117] border border-[#1C2230] rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider">{cl.tier}</span>
                      <h3 className="text-lg font-serif font-bold text-white mt-0.5">{cl.name}</h3>
                      <p className="text-xs text-slate-400">Assigned Cutter: {cl.cutter}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 font-mono">LIFETIME COMMISSIONS</div>
                      <div className="text-base font-serif font-bold text-[#C5A880]">{cl.lifetimeSpend}</div>
                    </div>
                  </div>

                  <div className="bg-[#141923] border border-[#1E2535] rounded-lg p-3 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div>
                      <div className="text-slate-500 text-[10px]">CHEST</div>
                      <div className="text-white font-bold mt-0.5">{cl.chest}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">WAIST</div>
                      <div className="text-white font-bold mt-0.5">{cl.waist}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">SLEEVE</div>
                      <div className="text-white font-bold mt-0.5">{cl.sleeve}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-[#1C2230]">
                    <span>{cl.activeOrders} Active Order(s)</span>
                    <button className="text-[#C5A880] hover:underline flex items-center gap-1 font-mono text-xs">
                      <span>View Full Spec</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ─── SLIDE-OVER MODAL: COMMISSION INTAKE SHEET ────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#0E1117] border border-[#1C2230] rounded-2xl p-6 shadow-2xl z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1C2230] pb-4">
              <div className="flex items-center gap-2 text-[#C5A880]">
                <Scissors size={18} />
                <h3 className="font-serif font-bold text-lg text-white">New Bespoke Commission Intake</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCommission} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Client Full Name</label>
                <input
                  type="text"
                  required
                  value={newClient}
                  onChange={e => setNewClient(e.target.value)}
                  placeholder="e.g. Lord Julian Sterling"
                  className="w-full bg-[#141923] border border-[#232B3E] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Garment Type</label>
                  <select
                    value={newGarment}
                    onChange={e => setNewGarment(e.target.value)}
                    className="w-full bg-[#141923] border border-[#232B3E] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="2-Piece Bespoke Suit">2-Piece Bespoke Suit</option>
                    <option value="3-Piece Lounge Suit">3-Piece Lounge Suit</option>
                    <option value="Double-Breasted Blazer">Double-Breasted Blazer</option>
                    <option value="Dinner Suit (Tuxedo)">Dinner Suit (Tuxedo)</option>
                    <option value="Chesterfield Overcoat">Chesterfield Overcoat</option>
                    <option value="Odd Trousers (Twin)">Odd Trousers (Twin)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Selected Cloth Bolt</label>
                  <select
                    value={newFabric}
                    onChange={e => setNewFabric(e.target.value)}
                    className="w-full bg-[#141923] border border-[#232B3E] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  >
                    {FABRICS.map(f => (
                      <option key={f.code} value={f.code}>
                        {f.code} — {f.mill} ({f.pattern})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Internal Canvas</label>
                  <select
                    value={newCanvas}
                    onChange={e => setNewCanvas(e.target.value)}
                    className="w-full bg-[#141923] border border-[#232B3E] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="Full Floating Canvas">Full Floating Horsehair Canvas</option>
                    <option value="Half Canvas">Half Canvas (Lightweight)</option>
                    <option value="Unstructured Soft">Unstructured Soft Tailoring</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Lead Time (Weeks)</label>
                  <input
                    type="number"
                    value={newLead}
                    onChange={e => setNewLead(e.target.value)}
                    className="w-full bg-[#141923] border border-[#232B3E] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Commission Price (£ GBP)</label>
                <input
                  type="number"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="w-full bg-[#141923] border border-[#232B3E] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#C5A880] hover:bg-[#B3966E] text-black font-serif font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={15} />
                  <span>Register Intake &amp; Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-[#141923] hover:bg-[#1E2535] text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
