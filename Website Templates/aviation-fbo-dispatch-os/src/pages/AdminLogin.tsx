import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [passkey, setPasskey] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const CORRECT_PASSKEY = 'aviationfbo2026'

  function handleAutoFill() {
    setPasskey(CORRECT_PASSKEY)
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (passkey === CORRECT_PASSKEY) {
      navigate('/')
    } else {
      setError('Invalid passkey. Try the demo auto-fill below.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0C12] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Plane size={20} className="text-white" />
          </div>
          <div className="text-left">
            <div className="font-bold text-white text-lg font-mono tracking-wider">FBO DISPATCH OS</div>
            <div className="text-xs text-slate-500 font-mono">AVIATION RAMP COMMAND</div>
          </div>
        </div>

        <div className="bg-[#0C0F18] border border-[#1E2A3A] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
          <p className="text-slate-400 text-sm mb-8">Enter your FBO operator passkey to access the ramp command console.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">Passkey</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={passkey}
                onChange={e => { setPasskey(e.target.value); setError('') }}
                placeholder="Enter operator passkey"
                className="w-full bg-[#111826] border border-[#1E2A3A] text-white rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-blue-600 font-mono placeholder-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-[38px] text-slate-500 hover:text-slate-300"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-950/30 border border-red-800/40 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Access Ramp Console
            </button>
          </form>

          {/* 1-Click Demo Gate (Law 3) */}
          <div className="mt-6 pt-6 border-t border-[#1E2A3A]">
            <div className="text-xs text-slate-600 text-center mb-3 font-mono uppercase tracking-wider">Demo Access</div>
            <button
              onClick={handleAutoFill}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-lg transition-colors border border-slate-700 text-sm"
            >
              🔑 Auto-fill Demo Passkey: <span className="font-mono text-blue-400">aviationfbo2026</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-600 font-mono">
          Ghost Factory™ Level 3 Blueprint — Aviation FBO & Ramp Dispatch OS
        </div>
      </div>
    </div>
  )
}
