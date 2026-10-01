import { useState } from 'react'
import {
  Plane, Fuel, Radio, Users, Settings, AlertTriangle,
  ChevronRight, X, Clock, MapPin, Zap, Wind
} from 'lucide-react'

// ─── MOCK DATA ────────────────────────────────────────────────
const FLIGHTS = [
  {
    id: 1, tail: 'N741GX', type: 'Gulfstream G700', operator: 'Obsidian Capital',
    origin: 'KTEB', dest: 'KBVP', ramp: 'R-01',
    status: 'on_ramp', pax: 6, vip: true,
    eta: '10:42 EST', etd: '14:30 EST', fuel: 2400, fuelStatus: 'complete',
    services: ['GPU ✓', 'Crew Car ✓', 'Catering'],
  },
  {
    id: 2, tail: 'N883PX', type: 'Global 7500', operator: 'Apex Holdings LLC',
    origin: 'KJFK', dest: 'KLAX', ramp: 'R-02',
    status: 'fueling', pax: 8, vip: true,
    eta: '11:15 EST', etd: '13:00 EST', fuel: 3800, fuelStatus: 'in_progress',
    services: ['Catering (pending)'],
  },
  {
    id: 3, tail: 'N527LJ', type: 'Citation XLS+', operator: 'Legacy Aviation Charter',
    origin: 'KPBI', dest: 'KTEB', ramp: null,
    status: 'inbound', pax: 4, vip: false,
    eta: '12:00 EST', etd: null, fuel: 900, fuelStatus: 'queued',
    services: [],
  },
  {
    id: 4, tail: 'N210RS', type: 'Phenom 300E', operator: 'RS Executive',
    origin: 'KMDW', dest: 'KTEB', ramp: null,
    status: 'scheduled', pax: 3, vip: false,
    eta: '13:30 EST', etd: null, fuel: 600, fuelStatus: 'queued',
    services: [],
  },
  {
    id: 5, tail: 'N990VL', type: 'Falcon 10X', operator: 'Vantage Luxury',
    origin: 'EGLL', dest: 'KTEB', ramp: 'H-01',
    status: 'inbound', pax: 10, vip: true,
    eta: '17:20 EST', etd: null, fuel: 4200, fuelStatus: 'queued',
    services: ['Customs Pre-cleared'],
  },
]

const RAMP_POSITIONS = [
  { code: 'R-01', name: 'Alpha VIP', status: 'occupied', tail: 'N741GX' },
  { code: 'R-02', name: 'Bravo LJ', status: 'occupied', tail: 'N883PX' },
  { code: 'R-03', name: 'Charlie Mid', status: 'available', tail: null },
  { code: 'R-04', name: 'Delta Light', status: 'available', tail: null },
  { code: 'R-05', name: 'Echo Hold', status: 'maintenance', tail: null },
  { code: 'R-06', name: 'Foxtrot ULR', status: 'reserved', tail: null },
  { code: 'H-01', name: 'Hangar 1', status: 'occupied', tail: 'N990VL*' },
  { code: 'H-02', name: 'Hangar 2', status: 'available', tail: null },
]

// ─── HELPERS ─────────────────────────────────────────────────
function statusColor(s: string) {
  switch (s) {
    case 'on_ramp': return 'text-blue-400 bg-blue-950 border-blue-700'
    case 'fueling': return 'text-amber-400 bg-amber-950 border-amber-700'
    case 'inbound': return 'text-emerald-400 bg-emerald-950 border-emerald-700'
    case 'scheduled': return 'text-slate-400 bg-slate-900 border-slate-700'
    case 'departing': return 'text-purple-400 bg-purple-950 border-purple-700'
    default: return 'text-slate-400 bg-slate-900 border-slate-700'
  }
}

function rampStatusColor(s: string) {
  switch (s) {
    case 'occupied': return 'bg-blue-900/40 border-blue-700 text-blue-300'
    case 'available': return 'bg-emerald-900/20 border-emerald-800 text-emerald-400'
    case 'maintenance': return 'bg-red-900/30 border-red-800 text-red-400'
    case 'reserved': return 'bg-amber-900/20 border-amber-800 text-amber-400'
    default: return 'bg-slate-900 border-slate-700 text-slate-400'
  }
}

// ─── DRAWER COMPONENT ─────────────────────────────────────────
function InspectionDrawer({ flight, onClose }: { flight: typeof FLIGHTS[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[480px] bg-[#0C0F18] border-l border-[#1E2A3A] flex flex-col h-full">
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2A3A]">
          <div>
            <div className="flex items-center gap-2">
              <Plane size={16} className="text-blue-400" />
              <span className="font-bold text-white text-lg font-mono">{flight.tail}</span>
              {flight.vip && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-900/60 text-amber-300 border border-amber-700 rounded uppercase tracking-wider">VIP</span>
              )}
            </div>
            <div className="text-sm text-slate-400 mt-0.5">{flight.type} — {flight.operator}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scroll-panel p-6 space-y-5">
          {/* Flight Intel */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">Flight Intelligence</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Origin', value: flight.origin },
                { label: 'Destination', value: flight.dest },
                { label: 'ETA', value: flight.eta || '—' },
                { label: 'ETD', value: flight.etd || '—' },
                { label: 'PAX', value: `${flight.pax} passengers` },
                { label: 'Ramp', value: flight.ramp || 'Unassigned' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#111826] border border-[#1E2A3A] rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide font-mono">{label}</div>
                  <div className="text-sm font-bold text-white mt-1">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fuel Order */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Fuel Dispatch</div>
            <div className="bg-[#111826] border border-amber-800/40 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Jet-A Order</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{flight.fuel.toLocaleString()} gal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Estimated Cost</span>
                <span className="text-sm font-bold text-white font-mono">${(flight.fuel * 6.95).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Dispatch Status</span>
                <span className={`text-xs font-bold px-2 py-1 rounded border font-mono ${
                  flight.fuelStatus === 'complete' ? 'text-emerald-400 bg-emerald-900/30 border-emerald-700' :
                  flight.fuelStatus === 'in_progress' ? 'text-amber-400 bg-amber-900/30 border-amber-700' :
                  'text-slate-400 bg-slate-900 border-slate-700'
                }`}>{flight.fuelStatus.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Ground Services */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Ground Services</div>
            <div className="space-y-2">
              {flight.services.length > 0 ? flight.services.map((svc, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#111826] border border-[#1E2A3A] rounded-lg px-4 py-3">
                  <Zap size={14} className="text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-slate-200">{svc}</span>
                </div>
              )) : (
                <div className="text-sm text-slate-500 italic px-1">No services requested</div>
              )}
              <button className="w-full mt-2 py-3 border border-dashed border-slate-700 text-slate-500 text-sm rounded-lg hover:border-blue-600 hover:text-blue-400 transition-colors">
                + Add Ground Service Request
              </button>
            </div>
          </div>

          {/* Assign Ramp */}
          {!flight.ramp && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Assign Ramp Position</div>
              <select className="w-full bg-[#111826] border border-[#1E2A3A] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-600">
                <option value="">— Select Position —</option>
                {RAMP_POSITIONS.filter(r => r.status === 'available').map(r => (
                  <option key={r.code} value={r.code}>{r.code} — {r.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Drawer footer */}
        <div className="px-6 py-4 border-t border-[#1E2A3A] flex gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm">
            Update Movement
          </button>
          <button onClick={onClose} className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-colors text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function RampConsole() {
  const [activeSection, setActiveSection] = useState<'triage' | 'ramp' | 'fuel' | 'services'>('triage')
  const [selectedFlight, setSelectedFlight] = useState<typeof FLIGHTS[0] | null>(null)

  const onRampCount = FLIGHTS.filter(f => f.status === 'on_ramp' || f.status === 'fueling').length
  const inboundCount = FLIGHTS.filter(f => f.status === 'inbound').length
  const fuelActive = FLIGHTS.filter(f => f.fuelStatus === 'in_progress').length
  const vipCount = FLIGHTS.filter(f => f.vip).length

  const navItems = [
    { id: 'triage', label: 'Flight Triage', icon: Radio, badge: FLIGHTS.length },
    { id: 'ramp', label: 'Ramp Matrix', icon: MapPin, badge: null },
    { id: 'fuel', label: 'Fuel Dispatch', icon: Fuel, badge: fuelActive > 0 ? fuelActive : null },
    { id: 'services', label: 'Ground Services', icon: Zap, badge: null },
  ] as const

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0C12]">
      {/* ─── LEFT UTILITY RAIL ─────────────────────────────────── */}
      <div className="w-[240px] flex-shrink-0 bg-[#0C0F18] border-r border-[#1E2A3A] flex flex-col">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-[#1E2A3A]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
              <Plane size={14} className="text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono tracking-wider">FBO DISPATCH</div>
              <div className="text-[10px] text-slate-500 font-mono">KTEB RAMP COMMAND</div>
            </div>
          </div>
        </div>

        {/* Live counters */}
        <div className="px-3 py-4 border-b border-[#1E2A3A] grid grid-cols-2 gap-2">
          {[
            { label: 'On Ramp', value: onRampCount, color: 'text-blue-400' },
            { label: 'Inbound', value: inboundCount, color: 'text-emerald-400' },
            { label: 'Fueling', value: fuelActive, color: 'text-amber-400' },
            { label: 'VIP Mvmt', value: vipCount, color: 'text-purple-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#111826] rounded-lg p-2 text-center">
              <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${
                activeSection === id
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-800/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={15} />
                <span className="text-sm font-medium">{label}</span>
              </span>
              {badge !== null && (
                <span className="text-[10px] bg-blue-700 text-white font-bold px-1.5 py-0.5 rounded-full font-mono">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Alert panel */}
        <div className="px-3 py-3 border-t border-[#1E2A3A]">
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={12} className="text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400 font-mono uppercase">Active Alert</span>
            </div>
            <div className="text-[11px] text-amber-200/80">N883PX fueling in progress — do not clear for pushback</div>
          </div>
        </div>

        {/* Settings */}
        <div className="px-3 py-3 border-t border-[#1E2A3A]">
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors">
            <Settings size={14} />
            <span>Console Settings</span>
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#1E2A3A] bg-[#0C0F18]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-green" />
              <span className="text-xs font-mono text-slate-400">RAMP LIVE</span>
            </div>
            <span className="text-slate-700">|</span>
            <span className="text-sm font-mono text-slate-400">
              {activeSection === 'triage' && 'Flight Triage Queue'}
              {activeSection === 'ramp' && 'Ramp Position Matrix'}
              {activeSection === 'fuel' && 'Fuel Dispatch Board'}
              {activeSection === 'services' && 'Ground Services Queue'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg">
              <Wind size={12} className="text-blue-400" />
              <span className="text-xs font-mono text-slate-300">WND 270° @ 12kt</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg">
              <Clock size={12} className="text-slate-400" />
              <span className="text-xs font-mono text-slate-300">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-5">

          {/* ─── FLIGHT TRIAGE ───── */}
          {activeSection === 'triage' && (
            <div className="h-full flex flex-col space-y-3">
              {/* Column headers */}
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono px-3">
                <div className="col-span-2">Tail</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Operator</div>
                <div className="col-span-1">Origin</div>
                <div className="col-span-1">Ramp</div>
                <div className="col-span-1">PAX</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Action</div>
              </div>
              <div className="flex-1 scroll-panel space-y-2">
                {FLIGHTS.map(f => (
                  <div
                    key={f.id}
                    className={`grid grid-cols-12 gap-2 items-center px-3 py-3 rounded-lg border transition-all cursor-pointer hover:border-blue-700/50 ${
                      f.vip
                        ? 'bg-amber-950/10 border-amber-900/30 hover:bg-amber-950/20'
                        : 'bg-[#0F1420] border-[#1E2A3A] hover:bg-[#111826]'
                    }`}
                    onClick={() => setSelectedFlight(f)}
                  >
                    <div className="col-span-2 flex items-center gap-1.5">
                      <span className="text-sm font-bold font-mono text-white">{f.tail}</span>
                      {f.vip && <span className="text-[9px] font-bold bg-amber-800/60 text-amber-300 px-1 rounded">VIP</span>}
                    </div>
                    <div className="col-span-2 text-xs text-slate-400">{f.type}</div>
                    <div className="col-span-2 text-xs text-slate-300">{f.operator}</div>
                    <div className="col-span-1 text-xs font-mono text-slate-400">{f.origin}</div>
                    <div className="col-span-1 text-xs font-mono text-blue-400">{f.ramp || '—'}</div>
                    <div className="col-span-1 text-xs font-mono text-slate-300">{f.pax}</div>
                    <div className="col-span-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border font-mono ${statusColor(f.status)}`}>
                        {f.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button className="p-1.5 hover:bg-blue-700/30 rounded text-blue-400 transition-colors">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── RAMP MATRIX ─────── */}
          {activeSection === 'ramp' && (
            <div className="grid grid-cols-4 gap-4 h-full content-start">
              {RAMP_POSITIONS.map(rp => (
                <div key={rp.code} className={`rounded-xl border p-4 ${rampStatusColor(rp.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono uppercase">{rp.code}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">{rp.status}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-300">{rp.name}</div>
                  {rp.tail && (
                    <div className="mt-2 text-xs font-mono font-bold text-white bg-black/30 px-2 py-1 rounded">
                      {rp.tail}
                    </div>
                  )}
                  {rp.status === 'available' && (
                    <button className="mt-3 w-full py-2 border border-dashed border-current/30 text-[11px] rounded hover:bg-white/5 transition-colors">
                      Assign Aircraft
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ─── FUEL DISPATCH ───── */}
          {activeSection === 'fuel' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider mb-4">Active Fuel Orders</div>
              {FLIGHTS.map(f => (
                <div key={f.id} className="bg-[#0F1420] border border-[#1E2A3A] rounded-lg px-4 py-4 grid grid-cols-5 gap-4 items-center">
                  <div>
                    <div className="text-sm font-bold font-mono text-white">{f.tail}</div>
                    <div className="text-xs text-slate-500">{f.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Fuel Type</div>
                    <div className="text-sm font-mono text-amber-300">Jet-A</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Quantity</div>
                    <div className="text-sm font-mono text-white">{f.fuel.toLocaleString()} gal</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Est. Cost</div>
                    <div className="text-sm font-mono font-bold text-emerald-400">${(f.fuel * 6.95).toLocaleString()}</div>
                  </div>
                  <div className="flex justify-end">
                    <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded border font-mono ${
                      f.fuelStatus === 'complete' ? 'text-emerald-400 bg-emerald-900/30 border-emerald-700' :
                      f.fuelStatus === 'in_progress' ? 'text-amber-400 bg-amber-900/30 border-amber-700' :
                      'text-slate-400 bg-slate-900/50 border-slate-700'
                    }`}>{f.fuelStatus.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-[#1E2A3A] flex justify-between text-sm font-mono">
                <span className="text-slate-500">Total Fuel Dispatched Today</span>
                <span className="text-white font-bold">
                  {FLIGHTS.filter(f => f.fuelStatus === 'complete').reduce((sum, f) => sum + f.fuel, 0).toLocaleString()} gal
                  &nbsp;/ ${(FLIGHTS.filter(f => f.fuelStatus === 'complete').reduce((sum, f) => sum + f.fuel, 0) * 6.95).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* ─── GROUND SERVICES ─── */}
          {activeSection === 'services' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-blue-400 font-mono uppercase tracking-wider mb-4">Ground Service Requests</div>
              {FLIGHTS.flatMap(f => f.services.map((svc, i) => ({ tail: f.tail, svc, key: `${f.id}-${i}` }))).map(({ tail, svc, key }) => (
                <div key={key} className="bg-[#0F1420] border border-[#1E2A3A] rounded-lg px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap size={14} className="text-blue-400" />
                    <span className="text-sm font-mono text-white">{tail}</span>
                    <span className="text-sm text-slate-300">— {svc}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border font-mono ${
                    svc.includes('✓') ? 'text-emerald-400 bg-emerald-900/30 border-emerald-700' : 'text-amber-400 bg-amber-900/30 border-amber-700'
                  }`}>{svc.includes('✓') ? 'COMPLETE' : 'PENDING'}</span>
                </div>
              ))}
              <button className="w-full mt-4 py-4 border-2 border-dashed border-slate-700 text-slate-500 rounded-lg hover:border-blue-600 hover:text-blue-400 transition-colors text-sm font-medium">
                + Log New Ground Service Request
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── INSPECTION DRAWER ──────────────────────────────────── */}
      {selectedFlight && (
        <InspectionDrawer flight={selectedFlight} onClose={() => setSelectedFlight(null)} />
      )}
    </div>
  )
}
