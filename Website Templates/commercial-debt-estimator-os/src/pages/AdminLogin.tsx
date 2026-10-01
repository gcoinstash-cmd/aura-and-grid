import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Landmark, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [passkey, setPasskey] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const CORRECT_PASSKEY = 'debtestimator2026'

  function handleAutoFill() {
    setPasskey(CORRECT_PASSKEY)
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (passkey === CORRECT_PASSKEY) {
      navigate('/')
    } else {
      setError('Invalid capital markets underwriting passkey. Click auto-fill below.')
    }
  }

  return (
    <div className="min-h-screen bg-[#080A0E] flex items-center justify-center p-6 text-[#F1F5F9]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#00D4FF] text-black rounded-lg flex items-center justify-center shadow-lg font-bold">
            <Landmark size={20} />
          </div>
          <div className="text-left">
            <div className="font-serif font-bold text-white text-xl tracking-wide">CAPITAL MARKETS OS</div>
            <div className="text-xs text-[#00D4FF] font-mono tracking-widest uppercase">Debt Sizing &amp; Term Engine</div>
          </div>
        </div>

        <div className="bg-[#0E131F] border border-[#1C2638] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Underwriter Access</h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Enter credit officer credentials to unlock institutional DSCR sizing matrices, debt yield waterfalls, and lender syndication term sheets.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label className="block text-xs font-bold text-[#00D4FF] uppercase tracking-wider mb-2 font-mono">
                Institutional Passkey
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={passkey}
                onChange={e => { setPasskey(e.target.value); setError('') }}
                placeholder="Enter underwriting passkey"
                className="w-full bg-[#141B2D] border border-[#223048] text-white rounded-lg px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-[#00D4FF] font-mono placeholder-slate-600 transition-colors"
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
              className="w-full bg-[#00D4FF] hover:bg-[#00B4DB] text-black font-bold py-3.5 px-4 rounded-lg transition-colors font-serif tracking-wide shadow-md"
            >
              Access Credit Console
            </button>
          </form>

          {/* 1-Click Demo Gate */}
          <div className="mt-8 pt-6 border-t border-[#1C2638]">
            <div className="text-xs text-slate-500 text-center mb-3 font-mono uppercase tracking-wider">
              Institutional Demo Gate
            </div>
            <button
              onClick={handleAutoFill}
              className="w-full bg-[#141B2D] hover:bg-[#1A253D] text-slate-300 font-bold py-3 px-4 rounded-lg transition-colors border border-[#223048] text-sm"
            >
              🔑 Auto-fill Demo Passkey: <span className="font-mono text-[#00D4FF]">debtestimator2026</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500 font-mono">
          Ghost Factory™ Level 3 Blueprint — Commercial Debt Estimator OS
        </div>
      </div>
    </div>
  )
}
