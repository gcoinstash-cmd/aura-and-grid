import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Car, 
  Clock, 
  ArrowRight, 
  Lock, 
  Flame, 
  Layers, 
  Cpu, 
  Printer, 
  RefreshCw,
  Fuel,
  CheckCircle,
  QrCode
} from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { playNeonChime, playWokSizzle, playHardwareThud } from '../utils/audio';
import CrossSellPanel from './CrossSellPanel';

function CheckoutItemImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className="w-10 h-10 shrink-0 overflow-hidden bg-[#0c0c0c] border border-white/10 relative group-hover:border-[#FF3366] transition-colors duration-300">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-[#111] flex items-center justify-center animate-pulse z-15">
          <svg className="w-4 h-4 text-neutral-800 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center border border-white/5 select-none text-center z-10">
          <span className="text-[6.5px] text-[#FF3366] font-mono font-bold leading-tight uppercase">// OFLINE</span>
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />
    </div>
  );
}

interface CheckoutCROProps {
  selectedItems: string[];
  syncedVehicle: { plate: string; type: string } | null;
  config: {
    vehicleClass: string;
    boostPreset: string;
    lanePriority: boolean;
    wokTemperature: number;
  };
  metrics: {
    liveWaitMinutes: number;
  };
  onClose: () => void;
  onAuthorizeComplete: (finalTotalYan: string, finalTotalUsd: string, additions: string[]) => void;
}

type CheckoutMode = 'INPUT' | 'VALIDATING' | 'RECEIPT';

export default function CheckoutCRO({
  selectedItems,
  syncedVehicle,
  config,
  metrics,
  onClose,
  onAuthorizeComplete,
}: CheckoutCROProps) {
  // Navigation internal mode
  const [mode, setMode] = useState<CheckoutMode>('INPUT');
  
  // Option state for average order value (AOV) multipliers
  const [addChiliInfusion, setAddChiliInfusion] = useState<boolean>(false);
  const [addPuerhTea, setAddPuerhTea] = useState<boolean>(false);
  
  // Progress states during validation
  const [progress, setProgress] = useState<number>(0);
  const [activeMatrixText, setActiveMatrixText] = useState<string>('INITIATING TRANSMISSION...');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Unique 8-digit terminal hash key
  const [terminalHash, setTerminalHash] = useState<string>('');

  // Live ticking countdown for the pickup window
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);

  // Cross-sell items pricing
  const CHILI_PRICE_USD = 4.00;
  const CHILI_PRICE_YEN = 28;
  const PUERH_PRICE_USD = 9.00;
  const PUERH_PRICE_YEN = 63;

  // Base dishes price calculation
  const calculateBasePriceYuan = () => {
    let sum = 0;
    selectedItems.forEach((id) => {
      const item = MENU_ITEMS.find((m) => m.id === id);
      if (item) {
        const val = parseInt(item.price.replace('¥', ''));
        sum += val;
      }
    });
    if (config.lanePriority) {
      sum += 30; // Lane Priority surcharge
    }
    return sum;
  };

  const getBasePriceUsd = () => {
    return Math.round((calculateBasePriceYuan() / 7) * 100) / 100;
  };

  // Live calculated totals
  const totalYuan = calculateBasePriceYuan() + 
    (addChiliInfusion ? CHILI_PRICE_YEN : 0) + 
    (addPuerhTea ? PUERH_PRICE_YEN : 0);

  const totalUsd = getBasePriceUsd() + 
    (addChiliInfusion ? CHILI_PRICE_USD : 0) + 
    (addPuerhTea ? PUERH_PRICE_USD : 0);

  const handleToggleChili = () => {
    if (mode !== 'INPUT') return;
    playNeonChime();
    setAddChiliInfusion(!addChiliInfusion);
  };

  const handleTogglePuerh = () => {
    if (mode !== 'INPUT') return;
    playWokSizzle();
    setAddPuerhTea(!addPuerhTea);
  };

  // Generates unique terminal hash key
  const generateTerminalHash = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'MNE-';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    result += '-';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Run the validation sequence
  const startValidationSequence = () => {
    playHardwareThud();
    setMode('VALIDATING');
    setProgress(0);
    setLogs([]);

    // Initialize 8-digit cryptographic identifier & countdown
    setTerminalHash(generateTerminalHash());
    const initialSeconds = (metrics.liveWaitMinutes > 0 ? metrics.liveWaitMinutes : 5) * 60;
    setCountdownSeconds(initialSeconds);

    const logsList = [
      'SECURE_SOCKET_ESTABLISHED_PORT_3K',
      'VALIDATING SYSTEM ENGINES & COMPLEMENTARY COMPOSITIONS',
      'READING APEX VEHICLE COEFFICIENTS',
      'INDUCTING DIGITAL HIGH-TEMPERATURE SENSORS',
      'COMMIT_TELEMETRY_TO_LANE_REWRITER',
      'SECURED_ROW_RESERVATION_QUEUE_LANE01',
      'DISPATCHING HANDSHAKE CERTIFICATION'
    ];

    let currentProgress = 0;
    let logIndex = 0;

    const interval = setInterval(() => {
      // Fast variable completion over approx 2.4 seconds
      const step = Math.floor(Math.random() * 8) + 6; // progress by 6-13%
      currentProgress = Math.min(currentProgress + step, 100);
      setProgress(currentProgress);

      // Add log entries periodically
      if (currentProgress > (logIndex + 1) * 14 && logIndex < logsList.length) {
        setLogs(prev => [...prev, `[${(currentProgress * 0.024).toFixed(2)}s] ${logsList[logIndex]}`]);
        logIndex++;
      }

      // 1. Cycling matrix readouts matching prompt specs
      if (currentProgress < 33) {
        setActiveMatrixText('VALIDATING ENGINES...');
      } else if (currentProgress < 66) {
        setActiveMatrixText('SYNCING VEHICLE MATRIX...');
      } else if (currentProgress < 95) {
        setActiveMatrixText('SECURING LANE ROW...');
      } else {
        setActiveMatrixText('GENERATING CRYPTOGRAPHIC KEY...');
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Play final solid mechanical hardware closure
        setTimeout(() => {
          playHardwareThud();
          setMode('RECEIPT');
        }, 300);
      }
    }, 120);
  };

  // Real-time ticking countdown clock for the receipt window
  useEffect(() => {
    if (mode !== 'RECEIPT') return;
    const timer = setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode]);

  // Format countdown into MM:SS
  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulated thermal-print output effect
  const handlePrintSimulation = () => {
    playNeonChime();
    alert(`--- SYSTEM DESPATCH ARCHIVE ---\nTerminal ID: ${terminalHash}\nOrder Value: ¥${totalYuan}\nVehicle: ${syncedVehicle?.plate || "MDN-TRANSIT"}\nStatus: Commited to Lane 01`);
  };

  return (
    <div 
      id="checkout-cro-container" 
      className="bg-[#0c0c0c] border border-white/5 p-6 md:p-10 text-white w-full max-w-5xl mx-auto backdrop-blur-md relative select-none"
    >
      {/* Editorial corner laser framing brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF3366]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF3366]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF3366]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF3366]" />

      <AnimatePresence mode="wait">
        
        {/* ==================== STATE 1: SELECTION AND OVERDRIVE CROSS-SELLS ==================== */}
        {mode === 'INPUT' && (
          <motion.div
            key="input-stage"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header Telemetry Branding */}
            <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#FF3366] tracking-[0.2em] font-bold">
                  <span className="w-1.5 h-1.5 bg-[#FF3366] rounded-full inline-block animate-ping mr-1" />
                  GATEWAY SYSTEM // BILLING AUTHORIZATION 04
                </div>
                <h2 className="font-display font-black text-3xl md:text-4xl tracking-tighter text-white mt-1 uppercase">
                  TERMINAL CHECKOUT PROFILE
                </h2>
              </div>
              
              <div className="flex items-center gap-2 bg-[#00FF66]/10 border border-[#00FF66]/20 py-1.5 px-3 rounded-none">
                <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
                <span className="font-mono text-[9px] text-[#00FF66] tracking-widest font-extrabold uppercase">
                  TLS ENCRYPTED BIPARTITE TUNNEL
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* LEFT COLUMN - Provisions & Logistics */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                
                <div className="bg-[#121212]/80 border border-white/5 p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono text-[10px] text-neutral-400 tracking-wider">
                        01 / SELECTED CULINARY PROVISIONS
                      </span>
                      <span className="font-mono text-[9px] text-[#FF3366] font-bold">
                        {selectedItems.length} ACTIVE
                      </span>
                    </div>

                    <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
                      {selectedItems.length === 0 ? (
                        <div className="text-center py-8 text-neutral-500 font-mono text-xs">
                          NO ACTIVE COMPOSITIONS IN CARGO
                        </div>
                      ) : (
                        selectedItems.map((id) => {
                          const item = MENU_ITEMS.find((m) => m.id === id);
                          if (!item) return null;
                          return (
                            <div 
                              key={item.id} 
                              className="group flex gap-3 items-center border-b border-white/5 pb-2.5"
                            >
                              <CheckoutItemImage 
                                src={item.imageUrl} 
                                alt={item.name} 
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-sans font-bold text-xs text-white group-hover:text-[#FF3366] transition-colors leading-normal truncate">
                                  {item.name}
                                </h4>
                                <span className="font-mono text-[9px] text-neutral-500 block">
                                  {item.chineseName || 'CHINESE SPEC'} // PREP: {item.prepTimeSeconds}s
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-mono text-xs font-black text-white block">
                                  {item.price}
                                </span>
                                <span className="font-sans text-[8.5px] text-neutral-500">
                                  (${Math.round((parseInt(item.price.replace('¥', '')) / 7) * 100) / 100})
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-3 space-y-2 font-mono text-[9px] text-neutral-400">
                    {config.lanePriority && (
                      <div className="flex justify-between items-center text-[#FF3366]">
                        <span>OVERDRIVE PRIORITY FEE</span>
                        <span>+¥30 (+$4.29)</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span>SEARING ENGINES ({config.wokTemperature}°C)</span>
                      <span className="text-[#00FF66] font-bold">LOADED</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DRIVE-THRU SHUTTLE NITRO</span>
                      <span className="text-[#00FF66] font-bold">{config.boostPreset}</span>
                    </div>
                  </div>
                </div>

                {/* Logistics Box */}
                <div className="bg-[#121212]/80 border border-white/5 p-6 space-y-4">
                  <span className="font-mono text-[9px] text-neutral-500 tracking-wider block uppercase">
                    02 / LOGISTICS SYNC STATUS
                  </span>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 p-3 border border-white/5 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-[#FF3366]">
                        <Car className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] font-bold">VEHICLE SYNC</span>
                      </div>
                      <div className="mt-1.5">
                        <span className="font-display font-bold text-sm block tracking-tight">
                          {syncedVehicle?.plate || "MDN-TRANSIT"}
                        </span>
                        <span className="font-mono text-[8.5px] text-neutral-500 uppercase block leading-none">
                          {syncedVehicle?.type || config.vehicleClass || "UNSPECIFIED"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3 border border-white/5 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-[#00FF66]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] font-bold">PICKUP WINDOW</span>
                      </div>
                      <div className="mt-1.5">
                        <span className="font-display font-black text-sm block tracking-tight text-[#00FF66]">
                          {metrics.liveWaitMinutes} MINUTES
                        </span>
                        <span className="font-mono text-[8.5px] text-neutral-500 uppercase block leading-none">
                          APEX LANE 01 DIRECT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN - Cross-selling */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-[#121212]/80 border border-white/5 p-6 md:p-8 space-y-8 relative">
                
                <div className="absolute top-[8%] right-0 w-1.5 h-16 bg-[#FF3366]" />

                {/* Flavor Cross-Sells - Crucial for CRO performance */}
                <CrossSellPanel 
                  addChiliInfusion={addChiliInfusion}
                  addPuerhTea={addPuerhTea}
                  onToggleChili={handleToggleChili}
                  onTogglePuerh={handleTogglePuerh}
                  disabled={mode !== 'INPUT'}
                />

                {/* Total Cost dynamic readout */}
                <div className="bg-[#181818] border border-white/5 p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-[1.5px] bg-[#FF3366]" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 relative z-10">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-mono tracking-widest text-[#FF3366] block font-bold uppercase">
                        LAN-01 TRANSACTION SUMMARY VALUE
                      </span>
                      <span className="font-display text-xs text-neutral-400 block uppercase font-medium">
                        TOTAL TERMINAL COST // 交易終端
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <motion.div 
                        key={totalYuan}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-mono text-3xl font-black text-white tracking-widest leading-none"
                      >
                        ¥{totalYuan}
                      </motion.div>
                      
                      <motion.div 
                        key={totalUsd}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        className="font-sans text-xs text-[#00FF66] font-bold mt-1 block"
                      >
                        Approx. ${totalUsd.toFixed(2)} USD
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 items-end justify-start pt-3 border-t border-white/5 mt-3">
                    <span className="text-[8px] font-mono text-neutral-500 mr-2">SYS_TRACK:</span>
                    <div className="h-2 w-1.5 bg-[#FF3366]/40 animate-pulse" />
                    <div className="h-3.5 w-1.5 bg-[#FF3366]/60 animate-pulse [animation-delay:0.2s]" />
                    <div className="h-1.5 w-1.5 bg-[#FF3366]/30 animate-pulse [animation-delay:0.4s]" />
                    <div className="h-2.5 w-1.5 bg-[#FF3366]/50 animate-pulse [animation-delay:0.1s]" />
                    <div className="h-4 w-1.5 bg-[#00FF66] animate-pulse [animation-delay:0.3s]" />
                    <div className="h-1 w-1.5 bg-neutral-800" />
                    <div className="h-2.5 w-1.5 bg-[#FF3366]/50" />
                  </div>
                </div>

                {/* Master Action */}
                <div className="space-y-3">
                  <button
                    id="authorize-terminal-master-buttons"
                    onClick={startValidationSequence}
                    disabled={selectedItems.length === 0}
                    className={`w-full group relative py-4 px-6 bg-gradient-to-r from-[#FF3366] to-[#E62255] cursor-pointer text-white font-display font-black text-xs md:text-sm tracking-widest text-center uppercase select-none transition-all duration-300 shadow-[0_5px_30px_rgba(255,51,102,0.2)] hover:shadow-[0_8px_45px_rgba(255,51,102,0.4)] border-none ${
                      selectedItems.length === 0 ? 'opacity-45 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="absolute inset-[3px] border border-white/0 group-hover:border-white/20 transition-all duration-300 pointer-events-none" />
                    <div className="flex items-center justify-center gap-2 relative z-10">
                      <Lock className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
                      <span>AUTHORIZE TRANSACTION & ROW RESERVATION</span>
                    </div>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full text-center py-2.5 border border-white/5 hover:border-white/20 font-mono text-[9px] text-[#FF3366] hover:text-white transition-all uppercase tracking-widest block cursor-pointer"
                  >
                    CANCEL TRANSACTION // DEPLOY FLUID REVERSION
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* ==================== STATE 2: TELEMETRY VALIDATION PROGRESS VIEW ==================== */}
        {mode === 'VALIDATING' && (
          <motion.div
            key="validation-stage"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center py-12 md:py-20 text-center space-y-8"
          >
            {/* Pulsing high tech circular background matrix */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,51,102,0.06),transparent_65%)] pointer-events-none" />
            
            <div className="relative">
              {/* Radial circle dynamic stroke path */}
              <svg className="w-44 h-44 md:w-52 md:h-52 transform -rotate-90 text-[#FF3366]/10" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#FF3366"
                  strokeWidth="4.5"
                  fill="transparent"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * progress) / 100}
                  className="transition-all duration-150 ease-out"
                  strokeLinecap="square"
                />
              </svg>
              
              {/* Live percent reader nested inside core */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest leading-none">
                  SECURE SEC
                </span>
                <span className="font-mono text-4xl md:text-5xl font-black text-white tracking-tighter mt-1 relative">
                  {progress}%
                  <span className="text-[10px] text-[#FF3366] font-bold absolute -top-1 -right-4">
                    TX
                  </span>
                </span>
                <span className="font-mono text-[9px] text-[#00FF66] tracking-wider mt-1.5 uppercase font-semibold">
                  {progress < 100 ? 'HANDSHAKING...' : 'COMPLETED'}
                </span>
              </div>
            </div>

            {/* Cycling Matrix readout container */}
            <div className="space-y-2 max-w-lg w-full relative z-15">
              <span className="font-mono text-[9px] text-[#FF3366] tracking-[0.25em] font-extrabold uppercase">
                ACTIVE PIPELINE METRIC LEVEL
              </span>
              
              {/* Cycling Matrix Readout according to prompt specs */}
              <div className="h-10 flex items-center justify-center">
                <motion.div 
                  key={activeMatrixText}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display font-black text-xl md:text-2xl text-white tracking-widest uppercase"
                >
                  {activeMatrixText}
                </motion.div>
              </div>

              {/* Progress linear sub bar backup */}
              <div className="w-72 mx-auto h-[3px] bg-white/5 overflow-hidden relative">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FF3366] to-[#00FF66] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Ticking live log stream */}
            <div className="w-full max-w-md bg-black/60 border border-white/5 p-4 text-left font-mono text-[9px] text-neutral-500 space-y-1.5 h-32 overflow-y-auto">
              <div className="text-[#FF3366] text-[8px] font-bold border-b border-white/5 pb-1">
                CRYPTOGRAPHIC LOG STREAM OVER IP_PORT_3000:
              </div>
              {logs.map((log, index) => (
                <div key={index} className="animate-fadeIn truncate text-neutral-400">
                  <span className="text-[#00FF66]">›</span> {log}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-6">SYNCHRONIZING SECURE KEY DECRYPTION CODES...</div>
              )}
            </div>

          </motion.div>
        )}

        {/* ==================== STATE 3: CRISP EDITORIAL-GRADE DISPATCH RECEIPT ==================== */}
        {mode === 'RECEIPT' && (
          <motion.div
            key="receipt-stage"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center space-y-8 relative"
          >
            {/* Glowing neon pink backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.04),transparent_60%)] pointer-events-none" />

            {/* Print Editorial Grade dispatch receipt */}
            <div className="w-full max-w-[460px] bg-white text-black p-6 md:p-8 font-mono text-xs relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-neutral-300">
              
              {/* Top thermal printer ripple tear styling */}
              <div className="absolute -top-3 left-0 right-0 h-3 bg-gradient-to-b from-transparent to-white select-none pointer-events-none overflow-hidden" 
                   style={{ maskImage: 'linear-gradient(to bottom, black, white)', WebkitMaskImage: 'linear-gradient(to bottom, black, white)' }}>
                <div className="w-full h-2 flex">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2 bg-neutral-900 shrink-0 transform rotate-45 -translate-y-1/2" />
                  ))}
                </div>
              </div>

              {/* Receipt Heading */}
              <div className="text-center border-b-2 border-dashed border-black/30 pb-4 mb-4">
                <div className="font-sans font-black text-lg tracking-tight uppercase">
                  MIDNIGHT EXPRESS // DISPATCH
                </div>
                <div className="text-[9px] text-neutral-600 mt-1 uppercase tracking-widest">
                  SECTOR CULINARY REPLICATOR LANE 01 // TOKYO
                </div>
                <div className="text-[10px] text-white bg-black font-black uppercase inline-block px-2 py-0.5 mt-2 tracking-widest">
                  DESPATCH AUTHORIZED
                </div>
              </div>

              {/* Unique Cryptographic Term Hash Key */}
              <div className="bg-black/5 p-3 text-center border border-black/10 mb-4 space-y-1">
                <span className="text-[8px] text-neutral-500 uppercase block">TERMINAL HANDSHAKE CERTIFICATE HASH</span>
                <span className="font-mono text-sm font-black text-stone-900 tracking-widest block">
                  {terminalHash}
                </span>
                <span className="text-[8px] text-[#FF3366] font-bold block uppercase tracking-wider">
                  TLS SECURE SYNC COMPLETE (100%)
                </span>
              </div>

              {/* Logistics Grid details */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-dashed border-stone-300">
                <div>
                  <span className="font-mono text-[9px] text-stone-500 uppercase block">VEHICLE CHASSIS</span>
                  <span className="font-sans font-black text-sm uppercase text-stone-900 block leading-tight mt-0.5">
                    {syncedVehicle?.plate || "MDN-TRANSIT"}
                  </span>
                  <span className="font-mono text-[9px] text-stone-500 block leading-none">
                    {syncedVehicle?.type || config.vehicleClass}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[9px] text-stone-500 uppercase block">COUNTDOWN CAP</span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[#FF3366]">
                    <Clock className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                    {/* Real-time countdown timer ticking down */}
                    <span className="font-mono font-black text-sm text-stone-900 animate-pulse">
                      {formatCountdown(countdownSeconds)}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-stone-500 uppercase block leading-none">
                    EXACT EXPIRY SECS
                  </span>
                </div>
              </div>

              {/* Selected Selections itemized list */}
              <div className="py-4 space-y-3 border-b-2 border-dashed border-stone-400">
                <span className="font-mono text-[8.5px] text-neutral-500 block uppercase tracking-wider">
                  ITEMIZED PROVISIONS CARGO
                </span>

                {selectedItems.map((id) => {
                  const item = MENU_ITEMS.find((m) => m.id === id);
                  if (!item) return null;
                  return (
                    <div key={item.id} className="flex justify-between items-baseline text-stone-900 text-[11px]">
                      <span className="font-sans font-bold uppercase truncate pr-4">
                        1x {item.name}
                      </span>
                      <span className="font-mono font-bold shrink-0">
                        {item.price}
                      </span>
                    </div>
                  );
                })}

                {/* CRO enhancements printed as real line items */}
                {addChiliInfusion && (
                  <div className="flex justify-between items-baseline text-[#FF3366] text-[11px]">
                    <span className="font-sans font-bold uppercase pr-4">
                      + CHILI CRISP INFUSION CR-03
                    </span>
                    <span className="font-mono font-bold shrink-0">
                      ¥28
                    </span>
                  </div>
                )}

                {addPuerhTea && (
                  <div className="flex justify-between items-baseline text-indigo-700 text-[11px]">
                    <span className="font-sans font-bold uppercase pr-4">
                      + VINTAGE PU-ERH TEA PAIRING
                    </span>
                    <span className="font-mono font-bold shrink-0">
                      ¥63
                    </span>
                  </div>
                )}

                {config.lanePriority && (
                  <div className="flex justify-between items-baseline text-neutral-800 text-[11px]">
                    <span className="font-sans uppercase pr-4">
                      + OVERDRIVE PRIORITY FEE
                    </span>
                    <span className="font-mono font-bold shrink-0">
                      ¥30
                    </span>
                  </div>
                )}
              </div>

              {/* Pricing Terminal aggregate totals */}
              <div className="py-4 space-y-1">
                <div className="flex justify-between items-baseline text-neutral-600 text-[10px]">
                  <span>SUBTOTAL VALUE</span>
                  <span>¥{totalYuan}</span>
                </div>
                <div className="flex justify-between items-baseline text-stone-950 font-black text-sm pt-1 border-t border-dashed border-stone-200">
                  <span>GRAND TERMINAL TOTAL</span>
                  <span className="font-mono text-base">¥{totalYuan}</span>
                </div>
                <div className="flex justify-between items-baseline text-stone-500 text-[9px]">
                  <span>APPROX. CURRENCY DUPLICITY</span>
                  <span>${totalUsd.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Barcode SVG simulation representation */}
              <div className="pt-4 border-t-2 border-dashed border-stone-300 mt-2 text-center flex flex-col items-center">
                <div className="w-11/12 h-10 flex items-center justify-center gap-[1.5px] select-none text-black">
                  {/* Generate pseudo barcode blocks */}
                  {[2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 1, 3, 2, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 3, 4, 2, 1].map((w, i) => (
                    <div 
                      key={i} 
                      className="h-9 bg-black shrink-0" 
                      style={{ width: `${w}px` }} 
                    />
                  ))}
                </div>
                <span className="font-mono text-[8px] text-neutral-600 tracking-widest mt-1 block uppercase">
                  *TX-IDENT-{terminalHash}*
                </span>
              </div>

              {/* Bottom thermal printer tear */}
              <div className="absolute -bottom-3 left-0 right-0 h-3 bg-gradient-to-t from-transparent to-white select-none pointer-events-none overflow-hidden" 
                   style={{ maskImage: 'linear-gradient(to top, black, white)', WebkitMaskImage: 'linear-gradient(to top, black, white)' }}>
                <div className="w-full h-2 flex">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2 bg-neutral-900 shrink-0 transform rotate-45 translate-y-1/2" />
                  ))}
                </div>
              </div>

            </div>

            {/* Interactive Receipts Controls */}
            <div className="flex flex-col gap-3 w-full max-w-[460px]">
              
              <button
                onClick={handlePrintSimulation}
                className="w-full py-3 bg-[#111] hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest border border-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                id="btn-print-receipt-simulate"
              >
                <Printer className="w-4 h-4 text-[#00FF66]" />
                <span>PRINT / SYSTEM DESPATCH ARCHIVE</span>
              </button>

              <button
                id="release-bay-and-commit"
                onClick={() => {
                  const additions: string[] = [];
                  if (addChiliInfusion) additions.push("CHILI CRISP INFUSION CR-03");
                  if (addPuerhTea) additions.push("VINTAGE PU-ERH TEA PAIRING");
                  onAuthorizeComplete(`¥${totalYuan}`, `$${totalUsd.toFixed(2)}`, additions);
                }}
                className="w-full py-4 text-center bg-gradient-to-r from-[#00FF66] to-[#00CC52] text-[#0d0d0d] font-display font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_5px_30px_rgba(0,255,102,0.25)] hover:shadow-[0_8px_45px_rgba(0,255,102,0.45)] cursor-pointer"
              >
                RELEASE DRIVE-THRU BAY & COMMIT ORDER
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
