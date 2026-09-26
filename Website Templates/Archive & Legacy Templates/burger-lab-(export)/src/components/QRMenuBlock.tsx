import React, { useState } from 'react';
import { Download, Check, Sparkles, FileText } from 'lucide-react';
import { ThemeId, BrandAngleConfig } from '../types';

interface QRMenuBlockProps {
  currentTheme: {
    id: ThemeId;
    name: string;
    bgColor: string;
    textColor: string;
    textColorMuted: string;
    cardBg: string;
    borderColor: string;
    gridLineColor: string;
  };
  accentColor: string;
  currentBrandAngle: BrandAngleConfig;
}

export const QRMenuBlock: React.FC<QRMenuBlockProps> = ({
  currentTheme,
  accentColor,
  currentBrandAngle,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedStock, setSelectedStock] = useState<'craft' | 'matte' | 'lucid'>('craft');

  const copyLinkToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const simulateDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDownloading(false);
            alert(`SUCCESS: Printed QR tent template compiled for ${currentBrandAngle.name} on ${selectedStock.toUpperCase()} cardstock!`);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const brandLettermark = () => {
    switch (currentBrandAngle.id) {
      case 'burger-lab': return 'BL';
      case 'smash-theory': return 'ST';
      case 'field-notes': return 'FN';
      case 'char-grid': return 'CG';
      default: return 'QR';
    }
  };

  // Generate a procedural SVG QR Code pattern colored dynamically by accentColor
  const renderDynamicQRCode = () => {
    return (
      <svg
        viewBox="0 0 100 100"
        className="w-40 h-40 transition-colors duration-300 relative z-10"
        style={{ color: currentTheme.id === 'light' ? '#09090b' : accentColor }}
        fill="currentColor"
        id="qr-svg-graphic"
      >
        {/* Alignment Marks */}
        {/* Top-Left */}
        <path d="M 0 0 L 25 0 L 25 25 L 0 25 Z" />
        <path d="M 5 5 L 20 5 L 20 20 L 5 20 Z" fill={currentTheme.id === 'light' ? '#ffffff' : '#090911'} />
        <path d="M 8 8 L 17 8 L 17 17 L 8 17 Z" />

        {/* Top-Right */}
        <path d="M 75 0 L 100 0 L 100 25 L 75 25 Z" />
        <path d="M 80 5 L 95 5 L 95 20 L 80 20 Z" fill={currentTheme.id === 'light' ? '#ffffff' : '#090911'} />
        <path d="M 83 8 L 92 8 L 92 17 L 83 17 Z" />

        {/* Bottom-Left */}
        <path d="M 0 75 L 25 75 L 25 100 L 0 100 Z" />
        <path d="M 5 80 L 20 80 L 20 95 L 5 95 Z" fill={currentTheme.id === 'light' ? '#ffffff' : '#090911'} />
        <path d="M 8 83 L 17 83 L 17 92 L 8 92 Z" />

        {/* Bottom-Right Small Alignment Square */}
        <path d="M 75 75 L 85 75 L 85 85 L 75 85 Z" />
        <path d="M 78 78 L 82 78 L 82 82 L 78 82 Z" fill={currentTheme.id === 'light' ? '#ffffff' : '#090911'} />

        {/* Procedural Data Dots Grid */}
        <rect x="35" y="5" width="5" height="5" />
        <rect x="45" y="0" width="5" height="10" />
        <rect x="55" y="10" width="10" height="5" />
        <rect x="65" y="5" width="5" height="5" />
        
        <rect x="0" y="35" width="10" height="5" />
        <rect x="15" y="45" width="5" height="15" />
        <rect x="30" y="30" width="5" height="5" />
        <rect x="40" y="40" width="15" height="5" />
        
        <rect x="75" y="35" width="15" height="5" />
        <rect x="85" y="45" width="5" height="10" />
        <rect x="90" y="60" width="10" height="5" />

        <rect x="35" y="65" width="5" height="10" />
        <rect x="45" y="75" width="10" height="5" />
        <rect x="55" y="85" width="5" height="15" />
        <rect x="65" y="90" width="10" height="5" />
        <rect x="35" y="85" width="10" height="5" />

        {/* Center Target Box containing Monogram branding */}
        <rect x="35" y="35" width="30" height="30" fill={currentTheme.id === 'light' ? '#ffffff' : '#090911'} rx="4" />
        <rect x="38" y="38" width="24" height="24" fill="none" strokeWidth="2" stroke="currentColor" rx="2" />
        
        {/* Monogram Text */}
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="12"
          fontWeight="900"
          fontFamily="monospace"
          fill="currentColor"
          className="tracking-tighter select-none font-bold"
        >
          {brandLettermark()}
        </text>
      </svg>
    );
  };

  return (
    <section className={`border-b ${currentTheme.borderColor} ${currentTheme.gridLineColor} py-16 md:py-24 relative`} id="tableside-qr-integration">
      
      {/* Decorative Grid Line Design */}
      <div className="absolute inset-x-0 top-0 h-full w-full grid grid-cols-4 md:grid-cols-6 divide-x opacity-25 pointer-events-none" style={{ borderColor: currentTheme.gridLineColor.split(' ')[1] }}>
        <div></div><div></div><div></div><div></div><div></div><div></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Left Side Info - Brand value statement */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-widest opacity-60 uppercase block">
              05 / contactless table integration
            </span>
            <h3 className="text-3xl sm:text-4xl font-grotesk tracking-tight font-black uppercase leading-tight">
              Instant Tableside QR Menu Engine
            </h3>
            <div className="h-1 w-20" style={{ backgroundColor: accentColor }}></div>
          </div>

          <p className="text-xs md:text-sm leading-relaxed opacity-85">
            Diners simply scan the contactless cards to instantly inspect detailed ingredient metrics, caloric calculators, visual flavor models, and to customize dynamic food builds on their mobile device without requiring any app install.
          </p>

          <p className={`text-xs leading-relaxed ${currentTheme.textColorMuted}`}>
            This responsive design syncs dynamically, reflecting color adjustments and layout settings as you customize options inside the dashboard.
          </p>

          {/* Sourcing credentials checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
              <span>SVG Vector Layout</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
              <span>Procedurally Synced Colors</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
              <span>Responsive Web Interface</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
              <span>Offline Ready Tent Cards</span>
            </div>
          </div>

          {/* Interactive Controller buttons */}
          <div className="space-y-4 pt-4 border-t border-dashed border-neutral-300/10">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest opacity-60 block">1. Select Card Stock Finish</label>
              <div className="flex gap-2">
                {(['craft', 'matte', 'lucid'] as const).map((stock) => (
                  <button
                    key={stock}
                    onClick={() => setSelectedStock(stock)}
                    className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider rounded border transition-all cursor-pointer ${
                      selectedStock === stock
                        ? 'font-bold'
                        : `hover:bg-neutral-500/5 ${currentTheme.borderColor} opacity-60`
                    }`}
                    style={{
                      backgroundColor: selectedStock === stock ? accentColor : 'transparent',
                      color: selectedStock === stock ? '#000000' : 'inherit',
                      borderColor: selectedStock === stock ? accentColor : undefined
                    }}
                  >
                    {stock === 'craft' && 'Recycled Kraft Stock'}
                    {stock === 'matte' && 'Weatherproof Matte'}
                    {stock === 'lucid' && 'Acrylic Lucid Sheet'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={simulateDownload}
                disabled={isDownloading}
                className="px-5 py-3 bg-zinc-950 text-white hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 font-mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                id="render-print-qr-button"
              >
                {isDownloading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-t-transparent border-[#E1FF01] rounded-full animate-spin" />
                    <span>Compiling PDF {downloadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#E1FF01]" />
                    <span>Download Print Mockup</span>
                  </>
                )}
              </button>

              <button
                onClick={copyLinkToClipboard}
                className="px-5 py-3 hover:bg-neutral-500/10 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer border"
                style={{ borderColor: currentTheme.borderColor.split(' ')[1] }}
                id="copy-tableside-url-button"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tableside URL Copied!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 opacity-60" />
                    <span>Copy Tableside Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Right Side - Visual Tabletop Tent Mockup Card */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          
          <div className="relative group max-w-sm w-full">
            {/* Elegant 3D spatial shadows/borders imitating printed card standing on raw table */}
            <div className="absolute inset-0 bg-neutral-900/10 rounded-xl blur-xl group-hover:scale-105 transition-transform duration-500" />
            
            {/* Card Body mockup design depending on selected cardStock */}
            <div 
              className={`relative border p-8 shadow-2xl flex flex-col items-center justify-between text-center min-h-[440px] transition-all duration-500 border-zinc-200 ${
                selectedStock === 'craft' 
                  ? 'bg-[#EADECA] text-zinc-900 font-serif border-[#CBB89D]' 
                  : selectedStock === 'matte'
                    ? 'bg-zinc-50 text-zinc-900 border-zinc-300'
                    : 'bg-zinc-950/90 text-zinc-100 border-zinc-800 backdrop-blur-md'
              }`}
            >
              
              {/* Outer Alignment crosshair corners for printed piece simulation */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-current opacity-30" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-current opacity-30" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-current opacity-30" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-current opacity-30" />

              {/* Top segment header */}
              <div className="space-y-1.5 pt-4">
                <span className="block font-mono text-[9px] uppercase tracking-[0.25em] font-extrabold opacity-60">
                  Contactless Table Guest Menu
                </span>
                <h4 className="text-xl font-black font-grotesk tracking-tight uppercase leading-none">
                  {currentBrandAngle.name}
                </h4>
                <div className="h-[1.5px] w-12 bg-current mx-auto opacity-30"></div>
              </div>

              {/* Dynamic QR Layout graphics */}
              <div className="my-6 p-4 border border-dashed border-current/20 bg-white/40 backdrop-blur-xs flex items-center justify-center max-w-[200px] aspect-square rounded-lg shadow-sm">
                {renderDynamicQRCode()}
              </div>

              {/* Instruction detail segment */}
              <div className="space-y-4 pb-4">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] tracking-widest font-black uppercase">
                    SCAN TO START ORDERING
                  </p>
                  <p className="text-[10px] font-sans leading-normal opacity-75 max-w-[250px] mx-auto">
                    Scan with your mobile camera to view composition stats & request custom builds.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono uppercase bg-current/5 border border-current/10 py-1.5 px-3">
                  <Sparkles className="w-3 h-3" />
                  <span>TABLE NO. 14 • ACTIVE SESSION</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
