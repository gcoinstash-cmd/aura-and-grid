import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scissors, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [passkey, setPasskey] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const CORRECT_PASSKEY = 'bespoke2026'

  function handleAutoFill() {
    setPasskey(CORRECT_PASSKEY)
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (passkey === CORRECT_PASSKEY) {
      navigate('/')
    } else {
      setError('Invalid master atelier passkey. Click auto-fill below.')
    }
  }

  return (
    <div className="min-h-screen bg-[#08090C] flex items-center justify-center p-6 text-[#EDEDED]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#C5A880] text-black rounded-lg flex items-center justify-center shadow-lg">
            <Scissors size={20} />
          </div>
          <div className="text-left">
            <div className="font-serif font-bold text-white text-xl tracking-wide">SAVILE ROW ATELIER</div>
            <div className="text-xs text-[#C5A880] font-mono tracking-widest uppercase">Bespoke Commission Portal</div>
          </div>
        </div>

        <div className="bg-[#0E1117] border border-[#1C2230] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Master Cutter Access</h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Enter authorized master cutter credentials to review private commissions, drafting sheets, and luxury fabric allocations.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label className="block text-xs font-bold text-[#C5A880] uppercase tracking-wider mb-2 font-mono">
                Atelier Passkey
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={passkey}
                onChange={e => { setPasskey(e.target.value); setError('') }}
                placeholder="Enter atelier passkey"
                className="w-full bg-[#141923] border border-[#232B3E] text-white rounded-lg px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-[#C5A880] font-mono placeholder-slate-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-[40px] text-slate-500 hover:text-slate-300"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="text-rose-400 text-sm bg-rose-950/30 border border-rose-800/40 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#C5A880] hover:bg-[#B3966E] text-black font-bold py-3.5 px-4 rounded-lg transition-colors font-serif tracking-wide shadow-md"
            >
              Enter Master Atelier
            </button>
          </form>

          {/* 1-Click Demo Gate */}
          <div className="mt-8 pt-6 border-t border-[#1C2230]">
            <div className="text-xs text-slate-500 text-center mb-3 font-mono uppercase tracking-wider">
              Institutional Demo Gate
            </div>
            <button
              onClick={handleAutoFill}
              className="w-full bg-[#141923] hover:bg-[#1A212E] text-slate-300 font-bold py-3 px-4 rounded-lg transition-colors border border-[#232B3E] text-sm"
            >
              🔑 Auto-fill Demo Passkey: <span className="font-mono text-[#C5A880]">bespoke2026</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500 font-mono">
          Ghost Factory™ Level 3 Blueprint — Bespoke Tailor Atelier OS
        </div>
      </div>
    </div>
  )
}
