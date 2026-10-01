import { useState, useMemo } from 'react'
import {
  Landmark, Building2, Calculator, FileText, CheckCircle2,
  ArrowRight, ArrowLeft, RefreshCw, Download, DollarSign,
  TrendingUp, Percent, ShieldCheck, AlertCircle
} from 'lucide-react'

export default function DebtEstimator() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  // Step 1: Deal Profile State
  const [propertyType, setPropertyType] = useState('multifamily')
  const [loanPurpose, setLoanPurpose] = useState('acquisition')
  const [propertyAddress, setPropertyAddress] = useState('450 North Michigan Avenue, Chicago, IL')
  const [borrowerEntity, setBorrowerEntity] = useState('Apex Meridian Capital LLC')
  const [entityType, setEntityType] = useState('LLC')

  // Step 2: Financials State
  const [purchasePrice, setPurchasePrice] = useState<number>(12500000)
  const [grossRevenue, setGrossRevenue] = useState<number>(1450000)
  const [vacancyRate, setVacancyRate] = useState<number>(5.0)
  const [operatingExpenses, setOperatingExpenses] = useState<number>(480000)

  // Step 3: Loan Sizing State
  const [loanAmount, setLoanAmount] = useState<number>(8500000)
  const [interestRate, setInterestRate] = useState<number>(5.85)
  const [loanTermYears, setLoanTermYears] = useState<number>(10)
  const [amortizationYears, setAmortizationYears] = useState<number>(30)
  const [rateType, setRateType] = useState<'fixed' | 'floating'>('fixed')
  const [ioPeriodMonths, setIoPeriodMonths] = useState<number>(24)

  // ─── FINANCIAL CALCULATIONS ──────────────────────────────────
  const calculations = useMemo(() => {
    const effectiveGrossIncome = grossRevenue * (1 - vacancyRate / 100)
    const noi = effectiveGrossIncome - operatingExpenses
    const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0
    const ltv = purchasePrice > 0 ? (loanAmount / purchasePrice) * 100 : 0

    // Monthly payment calculation (standard amortization formula)
    const monthlyRate = interestRate / 100 / 12
    const totalPayments = amortizationYears * 12
    let monthlyPayment = 0

    if (monthlyRate > 0 && totalPayments > 0 && loanAmount > 0) {
      monthlyPayment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1)
    }

    const annualDebtService = monthlyPayment * 12
    const dscr = annualDebtService > 0 ? noi / annualDebtService : 0
    const debtYield = loanAmount > 0 ? (noi / loanAmount) * 100 : 0
    const breakEvenOccupancy = grossRevenue > 0
      ? ((operatingExpenses + annualDebtService) / grossRevenue) * 100
      : 0
    const originationFee = loanAmount * 0.01

    return {
      effectiveGrossIncome,
      noi,
      capRate,
      ltv,
      monthlyPayment,
      annualDebtService,
      dscr,
      debtYield,
      breakEvenOccupancy,
      originationFee,
    }
  }, [grossRevenue, vacancyRate, operatingExpenses, purchasePrice, loanAmount, interestRate, amortizationYears])

  const steps = [
    { title: 'Deal Profile', icon: Building2, subtitle: 'Sponsor & Asset Details' },
    { title: 'Property Financials', icon: Calculator, subtitle: 'NOI & Underwritten Yield' },
    { title: 'Loan Sizing', icon: DollarSign, subtitle: 'DSCR & Payment Waterfall' },
    { title: 'Term Sheet', icon: FileText, subtitle: 'Institutional Summary' },
  ]

  function handleReset() {
    setCurrentStep(0)
    setIsSubmitted(false)
    setPurchasePrice(12500000)
    setGrossRevenue(1450000)
    setVacancyRate(5.0)
    setOperatingExpenses(480000)
    setLoanAmount(8500000)
    setInterestRate(5.85)
  }

  return (
    <div className="min-h-screen bg-[#080A0E] text-[#F1F5F9] flex flex-col font-sans">
      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <header className="border-b border-[#1C2638] bg-[#0E131F] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#00D4FF] text-black flex items-center justify-center shadow-md">
              <Landmark size={18} />
            </div>
            <div>
              <span className="font-serif font-bold text-white text-xl tracking-wide block">CAPITAL FLOW OS</span>
              <span className="text-[11px] text-[#00D4FF] font-mono tracking-widest uppercase block">
                Commercial Debt Sizing &amp; Term Sheet Wizard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-[#141B2D] border border-[#223048] px-3 py-1.5 rounded-lg text-slate-300">
              Benchmark: Bloomberg Term / Carta Debt
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white px-2 py-1 rounded transition-colors"
            >
              <RefreshCw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── STEP PROGRESSION BAR ───────────────────────────────── */}
      <div className="border-b border-[#1C2638] bg-[#0A0D14] py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-2 relative">
            {steps.map((st, idx) => {
              const Icon = st.icon
              const isActive = currentStep === idx
              const isDone = currentStep > idx
              return (
                <button
                  key={st.title}
                  onClick={() => setCurrentStep(idx)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-[#0E131F] border-[#00D4FF] shadow-lg shadow-[#00D4FF]/10'
                      : isDone
                      ? 'bg-[#0C1019] border-emerald-900/60 text-slate-300'
                      : 'bg-[#090C12] border-[#1C2638] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isActive
                          ? 'bg-[#00D4FF] text-black'
                          : isDone
                          ? 'bg-emerald-500 text-black'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={13} /> : idx + 1}
                    </div>
                    <Icon size={14} className={isActive ? 'text-[#00D4FF]' : isDone ? 'text-emerald-400' : 'text-slate-500'} />
                  </div>
                  <div className={`text-xs font-serif font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {st.title}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate font-sans">{st.subtitle}</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ──────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: STEP CONTENT (7 COLS) */}
          <div className="lg:col-span-7 bg-[#0E131F] border border-[#1C2638] rounded-2xl p-6 shadow-xl space-y-6">

            {/* ─── STEP 0: DEAL PROFILE ──────────────────────────── */}
            {currentStep === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Stage 1: Sponsor &amp; Asset Profile</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Define borrowing entity, legal ownership structure, and property category.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Borrower / Sponsor Entity Name</label>
                    <input
                      type="text"
                      value={borrowerEntity}
                      onChange={e => setBorrowerEntity(e.target.value)}
                      className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Entity Classification</label>
                      <select
                        value={entityType}
                        onChange={e => setEntityType(e.target.value)}
                        className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white focus:outline-none focus:border-[#00D4FF]"
                      >
                        <option value="LLC">Special Purpose LLC</option>
                        <option value="Corporation">C-Corporation</option>
                        <option value="REIT">Private / Public REIT</option>
                        <option value="Limited_Partnership">Limited Partnership (LP)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Commercial Property Type</label>
                      <select
                        value={propertyType}
                        onChange={e => setPropertyType(e.target.value)}
                        className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white focus:outline-none focus:border-[#00D4FF]"
                      >
                        <option value="multifamily">Multifamily (5+ Units)</option>
                        <option value="office">Class A Office Tower</option>
                        <option value="industrial">Industrial Logistics Center</option>
                        <option value="retail">Anchored Grocery Retail</option>
                        <option value="mixed_use">Urban Mixed-Use</option>
                        <option value="hotel">Hospitality / Boutique Hotel</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Property Street Address &amp; Market</label>
                    <input
                      type="text"
                      value={propertyAddress}
                      onChange={e => setPropertyAddress(e.target.value)}
                      className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Loan Transaction Purpose</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'acquisition', label: 'Acquisition' },
                        { id: 'refinance', label: 'Cash-Out Refi' },
                        { id: 'bridge', label: 'Bridge / Mezz' },
                      ].map(pur => (
                        <button
                          key={pur.id}
                          type="button"
                          onClick={() => setLoanPurpose(pur.id)}
                          className={`py-2.5 px-3 rounded-lg border text-center font-medium transition-colors ${
                            loanPurpose === pur.id
                              ? 'bg-[#00D4FF]/15 border-[#00D4FF] text-[#00D4FF] font-bold'
                              : 'bg-[#141B2D] border-[#223048] text-slate-400 hover:text-white'
                          }`}
                        >
                          {pur.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 1: PROPERTY FINANCIALS ───────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Stage 2: Cash Flow &amp; NOI Modeling</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Input trailing-12 revenues, standard vacancy reserve, and operating expenses.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Purchase Price / Appraised Valuation ($ USD)
                    </label>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={e => setPurchasePrice(Number(e.target.value) || 0)}
                      className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Gross Potential Rent ($ Annual)</label>
                      <input
                        type="number"
                        value={grossRevenue}
                        onChange={e => setGrossRevenue(Number(e.target.value) || 0)}
                        className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Underwritten Vacancy (%)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={vacancyRate}
                        onChange={e => setVacancyRate(Number(e.target.value) || 0)}
                        className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Annual Operating Expenses ($ USD)</label>
                    <input
                      type="number"
                      value={operatingExpenses}
                      onChange={e => setOperatingExpenses(Number(e.target.value) || 0)}
                      className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  {/* Calculated NOI preview block */}
                  <div className="bg-[#141B2D] border border-[#223048] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Effective Gross Income (EGI):</span>
                      <span className="font-mono text-white">
                        ${Math.round(calculations.effectiveGrossIncome).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Operating Expense Ratio:</span>
                      <span className="font-mono text-slate-300">
                        {grossRevenue > 0 ? ((operatingExpenses / grossRevenue) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#1C2638] flex justify-between items-center">
                      <span className="font-serif font-bold text-white text-sm">Underwritten NOI:</span>
                      <span className="font-mono font-bold text-[#00D4FF] text-base">
                        ${Math.round(calculations.noi).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 2: LOAN SIZING ───────────────────────────── */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Stage 3: Debt Sizing &amp; Amortization</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Adjust debt parameters to test DSCR tolerance and debt yield limits.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 font-medium mb-1">
                      <span>Requested Facility Amount ($ USD)</span>
                      <span className="font-mono text-[#00D4FF] font-bold">
                        ${loanAmount.toLocaleString()} ({calculations.ltv.toFixed(1)}% LTV)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1000000}
                      max={purchasePrice > 0 ? purchasePrice * 0.85 : 20000000}
                      step={100000}
                      value={loanAmount}
                      onChange={e => setLoanAmount(Number(e.target.value))}
                      className="w-full h-2 bg-[#141B2D] rounded-lg appearance-none cursor-pointer accent-[#00D4FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Coupon Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={interestRate}
                        onChange={e => setInterestRate(Number(e.target.value) || 0)}
                        className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Amortization Period</label>
                      <select
                        value={amortizationYears}
                        onChange={e => setAmortizationYears(Number(e.target.value))}
                        className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white focus:outline-none focus:border-[#00D4FF]"
                      >
                        <option value={30}>30 Years Standard</option>
                        <option value={25}>25 Years Commercial</option>
                        <option value={20}>20 Years Accelerated</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Loan Term Maturity</label>
                      <select
                        value={loanTermYears}
                        onChange={e => setLoanTermYears(Number(e.target.value))}
                        className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white focus:outline-none focus:border-[#00D4FF]"
                      >
                        <option value={5}>5 Years (Bank / Bridge)</option>
                        <option value={7}>7 Years (Life Co)</option>
                        <option value={10}>10 Years (Agency / CMBS)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Interest-Only Period</label>
                      <select
                        value={ioPeriodMonths}
                        onChange={e => setIoPeriodMonths(Number(e.target.value))}
                        className="w-full bg-[#141B2D] border border-[#223048] rounded-lg px-3 py-3 text-white focus:outline-none focus:border-[#00D4FF]"
                      >
                        <option value={0}>Zero IO (Amortizing Day 1)</option>
                        <option value={12}>12 Months IO</option>
                        <option value={24}>24 Months IO</option>
                        <option value={36}>36 Months IO</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-slate-300 font-medium">Rate Structure:</span>
                    <button
                      type="button"
                      onClick={() => setRateType('fixed')}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-xs ${
                        rateType === 'fixed'
                          ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF] font-bold'
                          : 'bg-[#141B2D] border-[#223048] text-slate-400'
                      }`}
                    >
                      Fixed Rate
                    </button>
                    <button
                      type="button"
                      onClick={() => setRateType('floating')}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-xs ${
                        rateType === 'floating'
                          ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF] font-bold'
                          : 'bg-[#141B2D] border-[#223048] text-slate-400'
                      }`}
                    >
                      Floating (SOFR + Spread)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 3: TERM SHEET SUMMARY ────────────────────── */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Stage 4: Term Sheet Generation</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Audit summary before submitting to institutional capital desk.
                  </p>
                </div>

                <div className="bg-[#141B2D] border border-[#223048] rounded-xl p-5 space-y-4 text-xs font-sans">
                  <div className="flex justify-between items-center pb-3 border-b border-[#1C2638]">
                    <div>
                      <span className="text-[10px] font-mono text-[#00D4FF] uppercase tracking-wider block">FACILITY</span>
                      <span className="font-serif font-bold text-lg text-white">
                        ${loanAmount.toLocaleString()} USD
                      </span>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      INDICATIVE PASS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">BORROWER</span>
                      <span className="font-medium text-white">{borrowerEntity}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">ASSET</span>
                      <span className="font-medium text-white">{propertyAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">INTEREST RATE</span>
                      <span className="font-mono text-white">{interestRate}% {rateType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">LOAN TERM / AMORT</span>
                      <span className="font-mono text-white">{loanTermYears} Yr Term / {amortizationYears} Yr Amort</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#1C2638] text-center font-mono">
                    <div className="bg-[#0E131F] p-2.5 rounded-lg border border-[#223048]">
                      <span className="text-slate-500 text-[10px] block">DSCR</span>
                      <span className={`text-sm font-bold block ${
                        calculations.dscr >= 1.25 ? 'text-emerald-400' : calculations.dscr >= 1.0 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {calculations.dscr.toFixed(2)}x
                      </span>
                    </div>
                    <div className="bg-[#0E131F] p-2.5 rounded-lg border border-[#223048]">
                      <span className="text-slate-500 text-[10px] block">DEBT YIELD</span>
                      <span className="text-sm font-bold text-[#00D4FF] block">
                        {calculations.debtYield.toFixed(2)}%
                      </span>
                    </div>
                    <div className="bg-[#0E131F] p-2.5 rounded-lg border border-[#223048]">
                      <span className="text-slate-500 text-[10px] block">EST. MONTHLY</span>
                      <span className="text-sm font-bold text-white block">
                        ${Math.round(calculations.monthlyPayment).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {isSubmitted ? (
                  <div className="bg-emerald-950/40 border border-emerald-800 rounded-xl p-5 text-center space-y-2">
                    <ShieldCheck size={28} className="text-emerald-400 mx-auto" />
                    <h3 className="font-serif font-bold text-white text-base">Facility Application Staged</h3>
                    <p className="text-xs text-slate-300">
                      Underwriting package #UW-2026-088 transmitted to credit committee review queue.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSubmitted(true)}
                    className="w-full bg-[#00D4FF] hover:bg-[#00B4DB] text-black font-serif font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-[#00D4FF]/20 flex items-center justify-center gap-2 text-sm"
                  >
                    <FileText size={16} />
                    <span>Submit to Institutional Credit Committee</span>
                  </button>
                )}
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-4 border-t border-[#1C2638] flex justify-between items-center">
              <button
                type="button"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Previous Step</span>
              </button>

              {currentStep < 3 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#00D4FF] text-black hover:bg-[#00B4DB] transition-colors font-serif"
                >
                  <span>Continue to {steps[currentStep + 1].title}</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: REAL-TIME UNDERWRITING WATERFALL (5 COLS) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0E131F] border border-[#1C2638] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#1C2638] pb-3">
                <span className="font-serif font-bold text-white text-base">Credit Metrics Live Tally</span>
                <span className="text-[10px] font-mono text-[#00D4FF] uppercase tracking-wider">RLS ENGINE ACTIVE</span>
              </div>

              {/* DSCR Badge */}
              <div className="bg-[#141B2D] border border-[#223048] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Debt Service Coverage (DSCR)</span>
                  <span className={`text-2xl font-serif font-bold ${
                    calculations.dscr >= 1.25 ? 'text-emerald-400' : calculations.dscr >= 1.0 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {calculations.dscr.toFixed(2)}x
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {calculations.dscr >= 1.25 ? '✓ Compliant with 1.25x Bank Floor' : '⚠ Below standard 1.25x covenant'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-full ${
                  calculations.dscr >= 1.25 ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                }`}>
                  {calculations.dscr >= 1.25 ? <ShieldCheck size={22} /> : <AlertCircle size={22} />}
                </div>
              </div>

              {/* Key Ratios */}
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center p-2.5 bg-[#141B2D]/60 rounded-lg">
                  <span className="text-slate-400">Loan to Value (LTV):</span>
                  <span className={`font-bold ${calculations.ltv <= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {calculations.ltv.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-[#141B2D]/60 rounded-lg">
                  <span className="text-slate-400">Debt Yield:</span>
                  <span className={`font-bold ${calculations.debtYield >= 9 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {calculations.debtYield.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-[#141B2D]/60 rounded-lg">
                  <span className="text-slate-400">Cap Rate at Purchase:</span>
                  <span className="font-bold text-white">
                    {calculations.capRate.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-[#141B2D]/60 rounded-lg">
                  <span className="text-slate-400">Break-Even Occupancy:</span>
                  <span className="font-bold text-white">
                    {calculations.breakEvenOccupancy.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-[#141B2D]/60 rounded-lg">
                  <span className="text-slate-400">Annual Debt Service:</span>
                  <span className="font-bold text-white">
                    ${Math.round(calculations.annualDebtService).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-[#141B2D]/60 rounded-lg">
                  <span className="text-slate-400">Estimated Origination Fee (1%):</span>
                  <span className="font-bold text-[#00D4FF]">
                    ${Math.round(calculations.originationFee).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Benchmark Card */}
            <div className="bg-[#141B2D] border border-[#223048] rounded-xl p-4 text-xs space-y-1.5">
              <span className="text-[#00D4FF] font-serif font-bold text-sm block">Institutional Credit Floor</span>
              <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
                Underwriting models are calibrated against Freddie Mac Multifamily and Fannie Mae DUS standards: 1.25x minimum DSCR, 65% LTV maximum, 9.0% minimum debt yield.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
