import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Wrench, 
  ShieldCheck, 
  FileLock2, 
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  Search, 
  Download, 
  Sparkles,
  QrCode,
  Calendar,
  X,
  CreditCard as CardIcon,
  Check,
  Building,
  Activity,
  User,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { PaymentRecord, MaintenanceRequest, GuestPass, DocumentItem, AmenityDetail } from '../types';
import { INITIAL_PAYMENTS, INITIAL_REQUESTS, INITIAL_GUEST_PASSES, DOCUMENTS_LIST, ESTATE_AMENITIES } from '../data';

interface QuickActionsProps {
  onAddRequest?: (req: MaintenanceRequest) => void;
  requests: MaintenanceRequest[];
  payments: PaymentRecord[];
  onAddPayment?: (pay: PaymentRecord) => void;
  guestPasses: GuestPass[];
  onAddGuestPass?: (pass: GuestPass) => void;
}

export default function QuickActions({
  requests,
  onAddRequest,
  payments,
  onAddPayment,
  guestPasses,
  onAddGuestPass,
}: QuickActionsProps) {
  // Navigation for active sub-workspaces
  const [activePanel, setActivePanel] = useState<'payment' | 'request' | 'owner' | 'documents' | null>(null);

  // Helper to determine if a guest pass is expiring soon relative to simulated/real time
  const getExpiresSoonStatus = (pass: GuestPass) => {
    const now = new Date();
    // Fallback to simulated current date of May 23, 2026 if the system clock represents pre-2026
    const baseDate = now.getFullYear() < 2026 
      ? new Date('2026-05-23T11:21:30Z') 
      : now;
      
    const start = new Date(`${pass.date}T00:00:00`); 
    if (isNaN(start.getTime())) return null;

    let durationHours = 24;
    const durLower = pass.duration.toLowerCase();
    if (durLower.includes('3 day')) {
      durationHours = 72;
    } else if (durLower.includes('7 day')) {
      durationHours = 168;
    }

    const expirationTime = start.getTime() + durationHours * 60 * 60 * 1000;
    const msRemaining = expirationTime - baseDate.getTime();
    const hoursRemaining = msRemaining / (1000 * 60 * 60);

    // Consider "Expires Soon" if it has less than 13 hours (for 24h passes) or 24 hours (for multi-day passes) remaining
    const isEndingSoon = hoursRemaining > -2 && (
      (durationHours === 24 && hoursRemaining <= 13) ||
      (durationHours > 24 && hoursRemaining <= 24)
    );

    if (isEndingSoon) {
      if (hoursRemaining <= 0) {
        return {
          text: `Expires In Minutes`,
          isUrgent: true
        };
      }
      return {
        text: `Expires Soon (${Math.ceil(hoursRemaining)}h remaining)`,
        isUrgent: hoursRemaining <= 6
      };
    }
    return null;
  };

  // Search details
  const [docSearch, setDocSearch] = useState('');
  const [activeDocCategory, setActiveDocCategory] = useState<string>('All');

  // Input states for 'Submit a Request'
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDesc, setRequestDesc] = useState('');
  const [requestCategory, setRequestCategory] = useState<MaintenanceRequest['category']>('Maintenance');
  const [requestPriority, setRequestPriority] = useState<MaintenanceRequest['priority']>('Routine');

  // Input states for 'Make a Payment'
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(payments.find(p => p.status === 'Pending') || null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Input states for 'Guest Registration'
  const [guestName, setGuestName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [passDuration, setPassDuration] = useState('24 Hours');
  const [newlyCreatedPass, setNewlyCreatedPass] = useState<GuestPass | null>(null);

  // Document downloading animation tracker
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);

  // Handle new request submission
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTitle.trim() || !requestDesc.trim()) return;

    const newRequest: MaintenanceRequest = {
      id: `req-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: requestTitle,
      description: requestDesc,
      category: requestCategory,
      priority: requestPriority,
      status: 'Submitted',
    };

    if (onAddRequest) {
      onAddRequest(newRequest);
    }
    
    // Clear form and highlight success
    setRequestTitle('');
    setRequestDesc('');
    
    // Temporary visual toast style transition inside the panel
    const submitBtn = document.getElementById('submit-btn-check');
    if (submitBtn) {
      submitBtn.innerHTML = '✔ Request Logged Successfully';
      setTimeout(() => {
        if (submitBtn) submitBtn.innerHTML = 'Submit Architectural & Service Filing';
      }, 3000);
    }
  };

  // Handle payment processing
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const billingAmount = selectedPayment ? selectedPayment.amount : parseFloat(customAmount);
    if (!billingAmount || billingAmount <= 0) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      
      const newPayment: PaymentRecord = {
        id: `pay-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: billingAmount,
        category: selectedPayment ? selectedPayment.category : 'Amenity Fee',
        status: 'Paid',
        paymentMethod: 'Direct Debit (Checking *8912)',
      };

      if (onAddPayment) {
        onAddPayment(newPayment);
      }

      // If we paid a specific pending bill, update its visual model too
      if (selectedPayment && selectedPayment.id) {
        // Handled reactively by the parent container passing down filtered pending payments
      }
    }, 2000);
  };

  // Handle registering guest pass
  const handleRegisterGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !vehiclePlate.trim()) return;

    const code = `VY-${Math.floor(100 + Math.random() * 900)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}`;
    const newPass: GuestPass = {
      id: `pass-${Date.now()}`,
      guestName,
      vehiclePlate: vehiclePlate.toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      duration: passDuration,
      passCode: code,
    };

    if (onAddGuestPass) {
      onAddGuestPass(newPass);
    }
    setNewlyCreatedPass(newPass);
    setGuestName('');
    setVehiclePlate('');
  };

  // Document download simulator
  const handleDownloadDoc = (docId: string) => {
    setDownloadingDocId(docId);
    setTimeout(() => {
      setDownloadingDocId(null);
    }, 1500);
  };

  // Filtering documents
  const filteredDocs = DOCUMENTS_LIST.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(docSearch.toLowerCase()) ||
                          doc.category.toLowerCase().includes(docSearch.toLowerCase());
    const matchesCategory = activeDocCategory === 'All' || doc.category === activeDocCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* 2. Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-medium text-[#121212] tracking-wide">
            Quick Actions Registry
          </h3>
          <span className="font-sans text-[10px] tracking-widest uppercase text-stone-400 font-semibold">
            Active Security Encryption
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Make a Payment */}
          <button
            id="action-payment"
            onClick={() => {
              setActivePanel(activePanel === 'payment' ? null : 'payment');
              setPaymentSuccess(false);
            }}
            className={`group relative flex flex-col justify-between p-6 text-left rounded-lg transition-all duration-300 border w-full min-h-[165px] h-full ${
              activePanel === 'payment'
                ? 'border-[#4A1521] bg-[#4A1521]/5 shadow-sm'
                : 'border-[#EBE8E0] bg-white hover:border-[#4A1521]/60 hover:shadow-xs'
            }`}
          >
            <div className={`p-3 rounded-md w-fit transition-colors mb-6 ${
              activePanel === 'payment' ? 'bg-[#4A1521] text-white' : 'bg-[#FAF9F6] text-[#4A1521] group-hover:bg-[#4A1521]/10'
            }`}>
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-stone-400 font-medium">Financial Gateway</p>
              <h4 className="font-serif text-base font-medium text-[#121212] group-hover:text-[#4A1521] transition-colors mt-0.5 flex items-center justify-between">
                <span>Make a Payment</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#4A1521]" />
              </h4>
            </div>
          </button>

          {/* Card 2: Submit a Request */}
          <button
            id="action-request"
            onClick={() => setActivePanel(activePanel === 'request' ? null : 'request')}
            className={`group relative flex flex-col justify-between p-6 text-left rounded-lg transition-all duration-300 border w-full min-h-[165px] h-full ${
              activePanel === 'request'
                ? 'border-[#4A1521] bg-[#4A1521]/5 shadow-sm'
                : 'border-[#EBE8E0] bg-white hover:border-[#4A1521]/60 hover:shadow-xs'
            }`}
          >
            <div className={`p-3 rounded-md w-fit transition-colors mb-6 ${
              activePanel === 'request' ? 'bg-[#4A1521] text-white' : 'bg-[#FAF9F6] text-[#4A1521] group-hover:bg-[#4A1521]/10'
            }`}>
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-stone-400 font-medium">Service Lodge</p>
              <h4 className="font-serif text-base font-medium text-[#121212] group-hover:text-[#4A1521] transition-colors mt-0.5 flex items-center justify-between">
                <span>Submit a Request</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#4A1521]" />
              </h4>
            </div>
          </button>

          {/* Card 3: Owner Dashboard */}
          <button
            id="action-owner"
            onClick={() => setActivePanel(activePanel === 'owner' ? null : 'owner')}
            className={`group relative flex flex-col justify-between p-6 text-left rounded-lg transition-all duration-300 border w-full min-h-[165px] h-full ${
              activePanel === 'owner'
                ? 'border-[#4A1521] bg-[#4A1521]/5 shadow-sm'
                : 'border-[#EBE8E0] bg-white hover:border-[#4A1521]/60 hover:shadow-xs'
            }`}
          >
            <div className={`p-3 rounded-md w-fit transition-colors mb-6 ${
              activePanel === 'owner' ? 'bg-[#4A1521] text-white' : 'bg-[#FAF9F6] text-[#4A1521] group-hover:bg-[#4A1521]/10'
            }`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-stone-400 font-medium">Smart Locker & Gate</p>
              <h4 className="font-serif text-base font-medium text-[#121212] group-hover:text-[#4A1521] transition-colors mt-0.5 flex items-center justify-between">
                <span>Owner Dashboard</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#4A1521]" />
              </h4>
            </div>
          </button>

          {/* Card 4: Documents & Forms */}
          <button
            id="action-documents"
            onClick={() => setActivePanel(activePanel === 'documents' ? null : 'documents')}
            className={`group relative flex flex-col justify-between p-6 text-left rounded-lg transition-all duration-300 border w-full min-h-[165px] h-full ${
              activePanel === 'documents'
                ? 'border-[#4A1521] bg-[#4A1521]/5 shadow-sm'
                : 'border-[#EBE8E0] bg-white hover:border-[#4A1521]/60 hover:shadow-xs'
            }`}
          >
            <div className={`p-3 rounded-md w-fit transition-colors mb-6 ${
              activePanel === 'documents' ? 'bg-[#4A1521] text-white' : 'bg-[#FAF9F6] text-[#4A1521] group-hover:bg-[#4A1521]/10'
            }`}>
              <FileLock2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-wider text-stone-400 font-medium">Bylaws & Audits</p>
              <h4 className="font-serif text-base font-medium text-[#121212] group-hover:text-[#4A1521] transition-colors mt-0.5 flex items-center justify-between">
                <span>Documents & Forms</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#4A1521]" />
              </h4>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Interactive Active Workspace Workspace Container with dynamic tabs */}
      <AnimatePresence mode="wait">
        {activePanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden bg-[#FAF9F6] border border-[#EBE8E0] rounded-lg p-6 md:p-8"
          >
            {/* Header of Active Panel */}
            <div className="flex items-center justify-between border-b border-[#EBE8E0] pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="h-2 w-2 rounded-full bg-[#4A1521]" />
                <h3 className="font-serif text-xl font-medium text-[#121212] tracking-wide">
                  {activePanel === 'payment' && 'Secure Resident Accounts Terminal'}
                  {activePanel === 'request' && 'Palmdale Crest Architectural & HOA Filing'}
                  {activePanel === 'owner' && 'Amenity Reservation & Gate Management'}
                  {activePanel === 'documents' && 'Archived Files & Document Vault'}
                </h3>
              </div>
              <button
                onClick={() => setActivePanel(null)}
                className="flex items-center space-x-1.5 p-1 text-xs text-stone-500 hover:text-stone-900 transition-colors"
                title="Minimize Panel"
              >
                <span className="font-sans font-medium">Minimize Workspace</span>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* PANEL CONTENT 1: MAKE A PAYMENT */}
            {activePanel === 'payment' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                {/* Left: General Ledger Statements */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-base text-stone-900 font-medium mb-1">Pending Assessments Due</h4>
                    <p className="text-stone-500 text-xs leading-relaxed">
                      Select an outstanding statement below or input a custom reserve allocation. AutoPay is active for recurring schedules.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {payments.filter(p => p.status === 'Pending').length === 0 ? (
                      <div className="p-4 bg-[#EBE8E0]/30 border border-[#EBE8E0] rounded flex items-center justify-between text-stone-700 text-xs italic">
                        <span>All core balances cleared. Today you have $0.00 due.</span>
                        <Check className="h-4 w-4 text-emerald-600 font-bold" />
                      </div>
                    ) : (
                      payments.filter(p => p.status === 'Pending').map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedPayment(p);
                            setCustomAmount('');
                          }}
                          className={`p-4 rounded border transition-all cursor-pointer flex items-center justify-between ${
                            selectedPayment?.id === p.id 
                              ? 'border-[#4A1521] bg-white shadow-xs' 
                              : 'border-[#EBE8E0] bg-[#FAF9F6] hover:bg-white'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-stone-800">{p.category}</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">Assessment Date: {p.date}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-sm font-bold text-[#4A1521]">${p.amount.toFixed(2)}</span>
                            <span className="block text-[9px] uppercase tracking-wider text-[#AF9E81] mt-0.5 font-medium">Pending Release</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Payment History Log */}
                  <div className="space-y-2 pt-2">
                    <h5 className="font-sans text-xs font-semibold uppercase tracking-wider text-stone-400">Past Verified Clearings</h5>
                    <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1">
                      {payments.filter(p => p.status === 'Paid').map((h) => (
                        <div key={h.id} className="flex justify-between items-center text-xs py-2 border-b border-[#EBE8E0]/60">
                          <div>
                            <p className="font-medium text-stone-800">{h.category}</p>
                            <p className="text-[9px] text-stone-400">{h.paymentMethod} • {h.date}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-stone-800">${h.amount.toFixed(2)}</span>
                            <span className="block text-[8px] font-medium text-emerald-700 uppercase bg-emerald-50 px-1 border border-emerald-200 rounded mt-0.5 w-fit ml-auto">SUCCESS</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Payment Authorization form */}
                <div className="bg-white p-6 rounded-lg border border-[#EBE8E0] shadow-2xs self-start">
                  {paymentSuccess ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-8 space-y-4"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Check className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-stone-900">Transfer Securely Settled</h4>
                        <p className="text-stone-500 text-xs mt-1">
                          A copy of transaction authorization hash has been dispatched to your resident email and logged to secure archives.
                        </p>
                      </div>
                      <div className="p-3 bg-stone-50 rounded border border-stone-200">
                        <span className="font-mono text-[9px] text-stone-400 break-all">txn_palmdale_crest_shh_4920409210_sec</span>
                      </div>
                      <button
                        onClick={() => {
                          setPaymentSuccess(false);
                          setSelectedPayment(null);
                        }}
                        className="text-xs text-[#4A1521] underline hover:text-stone-900 transition-colors font-semibold"
                      >
                        Return to Billing
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleProcessPayment} className="space-y-4">
                      <div>
                        <h4 className="font-serif text-sm text-stone-900 font-semibold mb-1">Financial Settlement Details</h4>
                        <p className="text-stone-400 text-[11px]">Authorize bank debit instantly via high-speed clearing.</p>
                      </div>

                      {/* Display Selected Amount */}
                      <div className="bg-[#FAF9F6] p-4 rounded border border-[#EBE8E0] text-center">
                        <p className="text-[10px] uppercase tracking-wider text-stone-400">Total Authorized Amount</p>
                        <p className="font-mono text-3xl font-bold text-[#4A1521] mt-1">
                          ${selectedPayment ? selectedPayment.amount.toFixed(2) : (parseFloat(customAmount) || 0).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-stone-500 mt-1">
                          {selectedPayment ? `Payment for: ${selectedPayment.category}` : "Custom Reservoir Offering"}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {/* Custom amount toggle if no payment selected */}
                        {!selectedPayment && (
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Custom Settlement Amount ($)</label>
                            <input
                              type="number"
                              required
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              placeholder="e.g. 500"
                              className="w-full text-xs p-2.5 rounded border border-[#EBE8E0] bg-white focus:outline-hidden focus:border-[#4A1521] text-stone-800"
                            />
                          </div>
                        )}

                        {selectedPayment && (
                          <button
                            type="button"
                            onClick={() => setSelectedPayment(null)}
                            className="text-[10px] text-stone-500 hover:text-[#4A1521] underline font-medium"
                          >
                            Or input a custom payment instead
                          </button>
                        )}

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Payer Verification Details</label>
                          <div className="p-3 bg-stone-50 rounded border border-[#EBE8E0] text-xs">
                            <p className="text-stone-700 font-medium">Verified Account: Checking *8912</p>
                            <p className="text-stone-400 mt-0.5 text-[10px]">Evelyn Vance • Routing ending in *1014</p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="w-full bg-[#4A1521] hover:bg-[#5C1D24] text-white font-serif py-3 rounded text-xs transition-colors flex items-center justify-center space-x-2 disabled:bg-stone-300 shadow-xs"
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Routing through Automated Clearing House...</span>
                          </>
                        ) : (
                          <span>Submit Electronic Payment Block</span>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* PANEL CONTENT 2: SUBMIT A REQUEST */}
            {activePanel === 'request' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                {/* Left: Filing info & guidelines */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-base text-stone-900 font-medium mb-1">HOA Services Overview</h4>
                    <p className="text-stone-500 text-xs leading-relaxed">
                      Submit general service reports, irrigation modifications, and landscape design changes under the Architectural Code review.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded border border-[#EBE8E0] space-y-3 shadow-3xs">
                    <div className="flex items-start space-x-2 text-xs">
                      <Clock className="h-4 w-4 text-[#AF9E81] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-800">Review Timeline SLA</p>
                        <p className="text-stone-400 text-[10px] mt-0.5">Architectural modifications are audited within 7 days. Urgent leaks are triaged within 2 hours.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 text-xs">
                      <ShieldCheck className="h-4 w-4 text-[#4A1521] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-800">Approved Contractor Access</p>
                        <p className="text-stone-400 text-[10px] mt-0.5">Licensed community contractors will undergo automatic background validation prior to arriving at your townhouse.</p>
                      </div>
                    </div>
                  </div>

                  {/* Active submitted list */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Current Filed Log</h5>
                    <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                      {requests.map((r) => (
                        <div key={r.id} className="p-3 bg-white hover:bg-stone-50 rounded border border-[#EBE8E0] text-xs flex justify-between items-center transition-all">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-stone-800">{r.title}</span>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-semibold ${
                                r.priority === 'Emergency' ? 'bg-red-50 text-red-700 border border-red-200' :
                                r.priority === 'Urgent' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-stone-100 text-stone-600 border border-stone-200'
                              }`}>
                                {r.priority}
                              </span>
                            </div>
                            <p className="text-[9px] text-stone-400 mt-1">Category: {r.category} • Date filed: {r.date}</p>
                          </div>
                          <div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                              r.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                              r.status === 'In Progress' ? 'bg-[#4A1521]/10 text-[#4A1521] border border-[#4A1521]/20' :
                              'bg-stone-100 text-stone-600 border border-stone-200'
                            }`}>
                              {r.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Submission Form */}
                <form onSubmit={handleSubmitRequest} className="space-y-4 bg-white p-6 rounded-lg border border-[#EBE8E0] shadow-2xs">
                  <div>
                    <h4 className="font-serif text-sm text-stone-900 font-semibold mb-1">New Service Application</h4>
                    <p className="text-stone-400 text-[11px]">Describe details accurately for direct dispatch validation.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Subject Title</label>
                      <input
                        type="text"
                        required
                        value={requestTitle}
                        onChange={(e) => setRequestTitle(e.target.value)}
                        placeholder="e.g. Broken drip line or Terrace repaving"
                        className="w-full text-xs p-2.5 rounded border border-[#EBE8E0] bg-[#FAF9F6] focus:outline-hidden focus:border-[#4A1521] text-stone-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Assigned Division</label>
                        <select
                          value={requestCategory}
                          onChange={(e) => setRequestCategory(e.target.value as MaintenanceRequest['category'])}
                          className="w-full text-xs p-2 border border-[#EBE8E0] bg-[#FAF9F6] focus:outline-hidden focus:border-[#4A1521] text-stone-800"
                        >
                          <option value="Maintenance">Maintenance</option>
                          <option value="Landscaping">Landscaping</option>
                          <option value="Architectural Review">Architectural Review</option>
                          <option value="Security">Security</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Priority Triage</label>
                        <select
                          value={requestPriority}
                          onChange={(e) => setRequestPriority(e.target.value as MaintenanceRequest['priority'])}
                          className="w-full text-xs p-2 border border-[#EBE8E0] bg-[#FAF9F6] focus:outline-hidden focus:border-[#4A1521] text-stone-800"
                        >
                          <option value="Routine">Routine (Low)</option>
                          <option value="Urgent">Urgent (Medium)</option>
                          <option value="Emergency">Emergency (High)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Filing Description</label>
                      <textarea
                        required
                        rows={3}
                        value={requestDesc}
                        onChange={(e) => setRequestDesc(e.target.value)}
                        placeholder="Provide deep structural descriptions here..."
                        className="w-full text-xs p-2.5 rounded border border-[#EBE8E0] bg-[#FAF9F6] focus:outline-hidden focus:border-[#4A1521] text-stone-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="submit-btn-check"
                    className="w-full bg-[#4A1521] hover:bg-[#5C1D24] text-white font-serif py-3 rounded text-xs transition-colors flex items-center justify-center space-x-2"
                  >
                    Submit Architectural & Service Filing
                  </button>
                </form>
              </div>
            )}

            {/* PANEL CONTENT 3: OWNER DASHBOARD */}
            {activePanel === 'owner' && (
              <div className="space-y-8 font-sans">
                {/* Upper: Amenities statuses */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded border border-[#EBE8E0] shadow-3xs space-y-3">
                    <h4 className="font-serif text-sm font-semibold text-stone-900 border-b border-stone-100 pb-2 flex items-center justify-between">
                      <span>Reserve HOA Amenities</span>
                      <Building className="h-4 w-4 text-[#AF9E81]" />
                    </h4>
                    <p className="text-stone-500 text-xs leading-relaxed">
                      Book a private slot in the executive clubhouse workspace lounge, swimming pool private cabanas, or sports tennis & pickleball courts.
                    </p>
                    <div className="pt-2">
                      <span className="text-[10px] uppercase tracking-wider bg-amber-50 text-[#4A1521] border border-[#4A1521]/10 px-2.5 py-1 rounded font-semibold block w-fit">
                        Resident Privilege: Active
                      </span>
                    </div>
                  </div>

                  {/* Smart Gate Management */}
                  <div className="bg-white p-5 rounded border border-[#EBE8E0] shadow-3xs space-y-3 col-span-1 md:col-span-2">
                    <h4 className="font-serif text-sm font-semibold text-stone-900 border-b border-stone-100 pb-2">
                      Gate Security & Guest Passes
                    </h4>
                    <p className="text-stone-500 text-xs">
                      Generate high-security encrypted access QR codes allowing temporary vehicle transit clearance through community gates.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <span className="text-stone-400 text-[10px] uppercase font-semibold">Smart Lockers Assigned</span>
                        <p className="text-stone-800 text-xs font-medium">Locker Box #42 (Parcel cleared at 10:14 AM)</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-stone-400 text-[10px] uppercase font-semibold">HOA Parking Stall</span>
                        <p className="text-stone-800 text-xs font-medium">Bay 42-B (Covered - Automated EV Charger connected)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lower: Visitor Pass Gen & Active Passes List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#EBE8E0]/60">
                  {/* Left: New Pass Generator */}
                  <div className="space-y-4">
                    <h4 className="font-serif text-base font-semibold text-stone-900">Configure Guest Gate Pass</h4>
                    
                    <form onSubmit={handleRegisterGuest} className="space-y-3 bg-white p-5 rounded-lg border border-[#EBE8E0] shadow-2xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Guest Full Name</label>
                          <input
                            type="text"
                            required
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="e.g. Richard Vance"
                            className="w-full text-xs p-2 border border-[#EBE8E0] bg-[#FAF9F6] focus:outline-hidden focus:border-[#4A1521] text-stone-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Vehicle License Plate</label>
                          <input
                            type="text"
                            required
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                            placeholder="e.g. 7XLA92"
                            className="w-full text-xs p-2 border border-[#EBE8E0] bg-[#FAF9F6] focus:outline-hidden focus:border-[#4A1521] text-stone-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Duration Cycle</label>
                          <select
                            value={passDuration}
                            onChange={(e) => setPassDuration(e.target.value)}
                            className="w-full text-xs p-2 border border-[#EBE8E0] bg-[#FAF9F6] focus:outline-hidden focus:border-[#4A1521] text-stone-800"
                          >
                            <option value="24 Hours">24 Hours</option>
                            <option value="3 Days">3 Days</option>
                            <option value="7 Days">7 Days</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full bg-[#4A1521] hover:bg-[#5C1D24] text-white font-serif py-2 rounded text-xs transition-colors flex items-center justify-center space-x-1"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Create Pass</span>
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* QR Code preview of newly guest pass */}
                    {newlyCreatedPass && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-4 border border-[#4A1521]/20 rounded-lg flex items-center justify-between shadow-2xs"
                      >
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest text-[#AF9E81] font-bold">Pass Authorized</p>
                          <p className="text-xs font-bold text-stone-800">{newlyCreatedPass.guestName}</p>
                          <p className="text-[10px] text-stone-500">Plate: {newlyCreatedPass.vehiclePlate} • Valid: {newlyCreatedPass.duration}</p>
                          <p className="font-mono text-xs font-bold text-[#4A1521]">{newlyCreatedPass.passCode}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center border-l border-stone-200 pl-4">
                          <QrCode className="h-10 w-10 text-[#4A1521] mb-1" />
                          <span className="text-[7px] text-stone-400 font-mono">VY-GATE-DECRYPT</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right: Active Guest Passes History */}
                  <div className="space-y-4">
                    <h4 className="font-serif text-base font-semibold text-stone-900">Active Access Passes</h4>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {guestPasses.map((p) => {
                        const expiry = getExpiresSoonStatus(p);
                        return (
                          <div key={p.id} className={`p-3 bg-white rounded border text-xs flex items-center justify-between transition-all ${
                            expiry ? 'border-[#4A1521]/30 bg-[#4A1521]/2' : 'border-[#EBE8E0]'
                          }`}>
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-stone-800">{p.guestName}</span>
                                {expiry && (
                                  <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-xs uppercase tracking-wider border ${
                                    expiry.isUrgent 
                                      ? 'bg-[#4A1521] text-white border-[#4A1521]' 
                                      : 'bg-[#4A1521]/10 text-[#4A1521] border-[#4A1521]/20'
                                  }`}>
                                    {expiry.text}
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] text-stone-400 uppercase tracking-wider block">
                                Plate: <strong className="text-stone-700 font-mono font-bold">{p.vehiclePlate}</strong> • Cycle: {p.duration}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-xs font-bold bg-[#FAF9F6] border border-[#EBE8E0] px-2 py-1 text-[#4A1521] rounded">
                                {p.passCode}
                              </span>
                              <span className="text-[8px] text-stone-400 uppercase tracking-widest block mt-1.5 font-bold">ACTIVE SCANNER READY</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL CONTENT 4: DOCUMENTS & FORMS */}
            {activePanel === 'documents' && (
              <div className="space-y-6 font-sans">
                {/* Search / Filters tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Bylaws & Rules', 'Financial Reports', 'Meeting Minutes', 'Forms & Surveys'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveDocCategory(category)}
                        className={`text-xs px-3 py-1.5 transition-all ${
                          activeDocCategory === category
                            ? 'bg-[#4A1521] text-white rounded-sm'
                            : 'bg-white hover:bg-[#FAF9F6] text-stone-600 border border-[#EBE8E0] rounded-sm'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Search bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Keyword search..."
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      className="text-xs pl-9 pr-4 py-2 rounded border border-[#EBE8E0] bg-white w-full md:w-[220px] focus:outline-hidden focus:border-[#4A1521] text-stone-800"
                    />
                  </div>
                </div>

                {/* Documents Table */}
                <div className="bg-white border border-[#EBE8E0] rounded overflow-hidden shadow-3xs">
                  <div className="grid grid-cols-12 bg-[#FAF9F6] py-3 px-4 border-b border-[#EBE8E0] text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                    <div className="col-span-6 md:col-span-7">Document Name</div>
                    <div className="col-span-3 md:col-span-2">Archive Group</div>
                    <div className="col-span-3 md:col-span-3 text-right">Size / Retrieve</div>
                  </div>

                  <div className="divide-y divide-[#EBE8E0]/60">
                    {filteredDocs.length === 0 ? (
                      <div className="p-8 text-center text-stone-400 text-xs italic">
                        No matched record detected in vault archives. Try clearing keyword filters.
                      </div>
                    ) : (
                      filteredDocs.map((doc) => (
                        <div key={doc.id} className="grid grid-cols-12 py-3.5 px-4 text-xs items-center hover:bg-[#FAF9F6]/50 transition-colors">
                          <div className="col-span-6 md:col-span-7 pr-3">
                            <p className="font-semibold text-stone-800 leading-tight">{doc.title}</p>
                            <p className="text-[9px] text-stone-400 mt-0.5">Approved Archive Date: {doc.lastUpdated}</p>
                          </div>
                          <div className="col-span-3 md:col-span-2">
                            <span className="text-[9px] text-stone-600 bg-stone-100 border border-stone-200/60 px-2 py-0.5 rounded uppercase font-semibold">
                              {doc.category}
                            </span>
                          </div>
                          <div className="col-span-3 md:col-span-3 text-right flex items-center justify-end space-x-3">
                            <span className="font-mono text-[10px] text-stone-400 hidden sm:inline">{doc.fileSize}</span>
                            <button
                              onClick={() => handleDownloadDoc(doc.id)}
                              disabled={downloadingDocId !== null}
                              className="text-xs text-[#4A1521] hover:text-[#5C1D24] hover:underline font-semibold flex items-center space-x-1 disabled:text-stone-400 cursor-pointer"
                            >
                              {downloadingDocId === doc.id ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  <span className="text-[10px]">Pulling...</span>
                                </>
                              ) : (
                                <>
                                  <Download className="h-3.5 w-3.5" />
                                  <span className="hidden md:inline">Fetch PDF</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-stone-400 italic">
                  <span>Vault status as of today: All signatures logged on-chain. SHA-256 compliant.</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
