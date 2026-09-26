import React from 'react';

// Generates incredibly polished geometric compositions to represent architectural photography and CAD drawings

export const StoneMonolithPhoto: React.FC = () => (
  <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sky Gradient */}
    <defs>
      <linearGradient id="swissSky" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D9E2EC" />
        <stop offset="60%" stopColor="#F0F4F8" />
        <stop offset="100%" stopColor="#FAF2EB" />
      </linearGradient>
      <linearGradient id="concreteGrad" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#B2BECE" />
        <stop offset="50%" stopColor="#9AACB8" />
        <stop offset="100%" stopColor="#7E8D9E" />
      </linearGradient>
      <linearGradient id="lakeShadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1E293B" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Sky */}
    <rect width="800" height="500" fill="url(#swissSky)" />

    {/* Distant Mountains (Swiss Alps) */}
    <path d="M 0 350 L 150 220 L 320 280 L 510 140 L 680 260 L 800 180 L 800 380 L 0 380 Z" fill="#C4CBD4" opacity="0.75" />
    <path d="M 120 350 L 300 200 L 450 250 L 600 110 L 780 230 L 800 210 L 800 380 L 120 380 Z" fill="#9FB3C8" opacity="0.5" />

    {/* Lake Lugano */}
    <path d="M 0 380 C 250 375, 450 385, 800 380 L 800 500 L 0 500 Z" fill="#486581" />
    <path d="M 0 380 C 300 390, 500 370, 800 380 L 800 420 L 0 420 Z" fill="url(#lakeShadow)" />

    {/* Earth Slope / Ground */}
    <path d="M 0 500 L 350 420 L 800 480 L 800 500 Z" fill="#4B5666" />

    {/* Structural Concrete Monolith Building */}
    {/* Cantilever Upper Slab */}
    <polygon points="120,400 680,360 680,210 120,240" fill="url(#concreteGrad)" stroke="#627D98" strokeWidth="1.5" />
    
    {/* Glass Facade Recess */}
    <polygon points="150,390 650,352 650,225 150,252" fill="#102A43" opacity="0.9" />
    
    {/* Glass Mullions Details */}
    <line x1="250" y1="244" x2="250" y2="382" stroke="#486581" strokeWidth="1" />
    <line x1="350" y1="236" x2="350" y2="374" stroke="#486581" strokeWidth="1" />
    <line x1="450" y1="228" x2="450" y2="366" stroke="#486581" strokeWidth="1" />
    <line x1="550" y1="220" x2="550" y2="359" stroke="#486581" strokeWidth="1" />

    {/* Inner Room Glow (Warm accent) */}
    <polygon points="350,290 550,270 550,359 350,374" fill="#FCE5CD" opacity="0.35" />

    {/* Hard shadow under cantilever */}
    <polygon points="120,400 680,360 800,500 0,500" fill="#243343" opacity="0.35" />

    {/* Decorative Cedar Accent Pillar on Left */}
    <rect x="180" y="248" width="12" height="138" fill="#84593B" opacity="0.9" />
    <rect x="200" y="246" width="12" height="136" fill="#84593B" opacity="0.9" />

    {/* Landscape Pine trees */}
    <path d="M 720 420 L 735 340 L 750 420 Z" fill="#334E68" />
    <path d="M 710 440 L 722 360 L 734 440 Z" fill="#243E56" />
    <path d="M 80 470 L 95 380 L 110 470 Z" fill="#243E56" />

    {/* Horizon haze/gradient */}
    <rect x="0" y="375" width="800" height="8" fill="#FFFFFF" opacity="0.15" />
  </svg>
);

export const StoneMonolithBlueprint: React.FC = () => (
  <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="500" fill="#0A2540" />
    {/* Grid Lines */}
    <g opacity="0.18" stroke="#38BDF8" strokeWidth="0.5">
      <line x1="0" y1="50" x2="800" y2="50" />
      <line x1="0" y1="100" x2="800" y2="100" />
      <line x1="0" y1="150" x2="800" y2="150" />
      <line x1="0" y1="200" x2="800" y2="200" />
      <line x1="0" y1="250" x2="800" y2="250" />
      <line x1="0" y1="300" x2="800" y2="300" />
      <line x1="0" y1="350" x2="800" y2="350" />
      <line x1="0" y1="400" x2="800" y2="400" />
      <line x1="0" y1="450" x2="800" y2="450" />

      <line x1="80" y1="0" x2="80" y2="500" />
      <line x1="160" y1="0" x2="160" y2="500" />
      <line x1="240" y1="0" x2="240" y2="500" />
      <line x1="320" y1="0" x2="320" y2="500" />
      <line x1="400" y1="0" x2="400" y2="500" />
      <line x1="480" y1="0" x2="480" y2="500" />
      <line x1="560" y1="0" x2="560" y2="500" />
      <line x1="640" y1="0" x2="640" y2="500" />
      <line x1="720" y1="0" x2="720" y2="500" />
    </g>

    {/* Technical blueprint lines */}
    <g stroke="#38BDF8" strokeWidth="1" opacity="0.85">
      {/* Site Mountain Slope Line */}
      <path d="M 50 450 L 320 380 L 480 320 L 750 150" strokeDasharray="4 4" stroke="#00D2FF" strokeWidth="1.5" />

      {/* Concrete Section Cut */}
      <polygon points="150,380 650,380 650,220 150,220" stroke="#00D2FF" strokeWidth="2" />
      {/* Slab thicknesses */}
      <line x1="150" y1="240" x2="650" y2="240" />
      <line x1="150" y1="360" x2="650" y2="360" />
      
      {/* Vertical Foundation Anchors */}
      <polygon points="180,380 220,380 200,450" />
      <polygon points="580,380 620,380 600,450" />

      {/* Interior glass and dividers */}
      <line x1="200" y1="240" x2="200" y2="360" />
      <line x1="350" y1="240" x2="350" y2="360" strokeDasharray="3 2" />
      <line x1="500" y1="240" x2="500" y2="360" />

      {/* Dimension Lines (Technical Arrows and Labels) */}
      <g stroke="#F472B6" strokeWidth="1">
        {/* Width Arrow */}
        <line x1="150" y1="180" x2="650" y2="180" />
        <line x1="150" y1="170" x2="150" y2="190" />
        <line x1="650" y1="170" x2="650" y2="190" />
        
        {/* Height Arrow */}
        <line x1="100" y1="220" x2="100" y2="380" />
        <line x1="90" y1="220" x2="110" y2="220" />
        <line x1="90" y1="380" x2="110" y2="380" />
      </g>
    </g>

    {/* Text annotations in CAD font styling */}
    <g fill="#38BDF8" fontFamily="monospace" fontSize="9" opacity="0.9">
      <text x="150" y="165" fill="#F472B6">W = 32.00m (UNINTERRUPTED SPAN)</text>
      <text x="35" y="300" fill="#F472B6" transform="rotate(-90 35 300)">H = 4.20m</text>
      
      <text x="210" y="440">EARTH REMEDIATION EMBEDMENT</text>
      <text x="160" y="270">GRID A-1 (ENTRY CORE)</text>
      <text x="365" y="270">GRID A-2 (LIVING CHAMBER)</text>
      <text x="515" y="270">GRID A-3 (THERMAL THERMAE)</text>
      <text x="160" y="350">SLAB DEPTH = 400mm (CAST CONCRETE)</text>
      
      {/* Title block */}
      <rect x="520" y="410" width="250" height="70" fill="#031525" stroke="#38BDF8" strokeWidth="1.5" />
      <text x="530" y="425" fontSize="10" fontWeight="bold">PERSPECTIVE STUDIO ARCHITECTS</text>
      <text x="530" y="440">PROJECT: THE STONE MONOLITH</text>
      <text x="530" y="455">FILENAME: LUGANO_SEC_AA.DWG</text>
      <text x="530" y="470" fill="#38BDF8">SCALE: 1:125 | DATE: 2026.06</text>
    </g>
  </svg>
);

export const KomorebiPhoto: React.FC = () => (
  <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="forestSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#DFEAD9" />
        <stop offset="100%" stopColor="#FAF8F0" />
      </linearGradient>
      <linearGradient id="shouSugi" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2D2D30" />
        <stop offset="100%" stopColor="#1E1E1F" />
      </linearGradient>
    </defs>

    {/* Background Sky */}
    <rect width="800" height="500" fill="url(#forestSky)" />

    {/* Bamboo Silhouettes in background */}
    <g opacity="0.15" fill="#4A6141">
      <rect x="80" y="0" width="6" height="500" />
      <rect x="90" y="0" width="4" height="500" />
      <rect x="220" y="0" width="8" height="500" />
      <rect x="430" y="0" width="10" height="500" />
      <rect x="610" y="0" width="5" height="500" />
      <rect x="710" y="0" width="7" height="500" />
    </g>

    {/* Forest Ground Slope */}
    <path d="M 0 460 C 200 440, 600 480, 800 440 L 800 500 L 0 500 Z" fill="#606C38" />

    {/* Floating timber support columns (touching ground at few points) */}
    <rect x="240" y="360" width="12" height="100" fill="url(#shouSugi)" stroke="#111" />
    <rect x="360" y="350" width="12" height="110" fill="url(#shouSugi)" stroke="#111" />
    <rect x="480" y="350" width="12" height="110" fill="url(#shouSugi)" stroke="#111" />
    <rect x="600" y="360" width="12" height="100" fill="url(#shouSugi)" stroke="#111" />

    {/* Base Deck Platform */}
    <polygon points="180,360 660,360 680,375 160,375" fill="#5C4D3C" stroke="#222" />
    
    {/* Upper Timber Framed Structure */}
    {/* Shou Sugi Ban heavy outer framework */}
    <rect x="220" y="190" width="400" height="170" fill="none" stroke="url(#shouSugi)" strokeWidth="6" />
    
    {/* Interior Washi paper sliding screen panels (Golden warm diffusion) */}
    <rect x="235" y="200" width="110" height="150" fill="#FCF8EB" stroke="#A88B60" strokeWidth="2" opacity="0.9" />
    <rect x="355" y="200" width="110" height="150" fill="#FCF8EB" stroke="#A88B60" strokeWidth="2" opacity="0.9" />
    <rect x="475" y="200" width="110" height="150" fill="#FFFFFC" stroke="#A88B60" strokeWidth="2" opacity="0.6" />

    {/* Screen geometric grids */}
    <line x1="290" y1="200" x2="290" y2="350" stroke="#D1B894" strokeWidth="0.8" />
    <line x1="235" y1="250" x2="345" y2="250" stroke="#D1B894" strokeWidth="0.8" />
    <line x1="235" y1="300" x2="345" y2="300" stroke="#D1B894" strokeWidth="0.8" />

    <line x1="410" y1="200" x2="410" y2="350" stroke="#D1B894" strokeWidth="0.8" />
    <line x1="355" y1="250" x2="465" y2="250" stroke="#D1B894" strokeWidth="0.8" />
    <line x1="355" y1="300" x2="465" y2="300" stroke="#D1B894" strokeWidth="0.8" />

    {/* Tensile lightweight cable bracing */}
    <line x1="220" y1="190" x2="620" y2="360" stroke="#666" strokeWidth="0.7" />
    <line x1="620" y1="190" x2="220" y2="360" stroke="#666" strokeWidth="0.7" />

    {/* Sunset Flare light leakage behind paper */}
    <circle cx="360" cy="270" r="45" fill="#FFEAA7" opacity="0.4" filter="blur(8px)" />

    {/* Fine Cypress Roof Planks (Staggered Louvers) */}
    <g fill="url(#shouSugi)">
      <polygon points="170,195 240,185 240,190 170,200" />
      <polygon points="230,195 300,185 300,190 230,200" />
      <polygon points="290,195 360,185 360,190 290,200" />
      <polygon points="350,195 420,185 420,190 350,200" />
      <polygon points="410,195 480,185 480,190 410,200" />
      <polygon points="470,195 540,185 540,190 470,200" />
      <polygon points="530,195 600,185 600,190 530,200" />
      <polygon points="590,195 660,185 660,190 590,200" />
    </g>

    {/* Floating Zen maple branch framing right view */}
    <path d="M 800 150 C 740 180, 680 140, 600 200" stroke="#2D2013" strokeWidth="3" />
    <path d="M 600 200 C 580 205, 540 190, 520 205" stroke="#2D2013" strokeWidth="1.5" />
    {/* Leaves */}
    <path d="M 520 205 Q 515 200 510 205 Q 515 210 520 205 Z" fill="#9E2A2B" />
    <path d="M 540 195 Q 535 185 530 195 Q 535 205 540 195 Z" fill="#9E2A2B" />
    <path d="M 600 200 Q 590 190 580 200 Q 590 210 600 200 Z" fill="#BE5A38" />
  </svg>
);

export const KomorebiBlueprint: React.FC = () => (
  <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="500" fill="#082A2E" />
    {/* Grid Lines */}
    <g opacity="0.15" stroke="#38BDF8" strokeWidth="0.5">
      <line x1="0" y1="40" x2="800" y2="40" />
      <line x1="0" y1="120" x2="800" y2="120" />
      <line x1="0" y1="200" x2="800" y2="200" />
      <line x1="0" y1="280" x2="800" y2="280" />
      <line x1="0" y1="360" x2="800" y2="360" />
      <line x1="0" y1="440" x2="800" y2="440" />
      <line x1="100" y1="0" x2="100" y2="500" />
      <line x1="220" y1="0" x2="220" y2="500" />
      <line x1="340" y1="0" x2="340" y2="500" />
      <line x1="460" y1="0" x2="460" y2="500" />
      <line x1="580" y1="0" x2="580" y2="500" />
      <line x1="700" y1="0" x2="700" y2="500" />
    </g>

    {/* Plan View Drawing (Top Down) */}
    <g stroke="#2DD4BF" strokeWidth="1.2">
      {/* Outer deck border */}
      <rect x="180" y="100" width="440" height="280" strokeWidth="1.5" />
      
      {/* Column indicators (cross circles) */}
      <g stroke="#34D399" strokeWidth="1">
        <circle cx="220" cy="140" r="8" />
        <line x1="210" y1="140" x2="230" y2="140" />
        <line x1="220" y1="130" x2="220" y2="150" />

        <circle cx="400" cy="140" r="8" />
        <line x1="390" y1="140" x2="410" y2="140" />
        <line x1="400" y1="130" x2="400" y2="150" />

        <circle cx="580" cy="140" r="8" />
        <line x1="570" y1="140" x2="590" y2="140" />
        <line x1="580" y1="130" x2="580" y2="150" />

        <circle cx="220" cy="340" r="8" />
        <line x1="210" y1="340" x2="230" y2="340" />
        <line x1="220" y1="330" x2="220" y2="350" />

        <circle cx="400" cy="340" r="8" />
        <line x1="390" y1="340" x2="410" y2="340" />
        <line x1="400" y1="330" x2="400" y2="350" />

        <circle cx="580" cy="340" r="8" />
        <line x1="570" y1="340" x2="590" y2="340" />
        <line x1="580" y1="330" x2="580" y2="350" />
      </g>

      {/* Internal Sliding walls (Double lines) */}
      <rect x="230" y="150" width="112" height="6" fill="none" />
      <rect x="348" y="150" width="112" height="6" fill="none" />
      <rect x="466" y="150" width="112" height="6" fill="none" />

      {/* Tatami mats arrangements */}
      <g stroke="#94A3B8" strokeWidth="0.8" opacity="0.8">
        <rect x="230" y="170" width="110" height="55" />
        <rect x="230" y="225" width="110" height="55" />
        <rect x="340" y="170" width="55" height="110" />
        <rect x="395" y="170" width="55" height="110" />
        <rect x="450" y="170" width="110" height="55" />
        <rect x="450" y="225" width="110" height="55" />
      </g>

      {/* Contemplation Deck Plank hatch lines */}
      <line x1="180" y1="120" x2="620" y2="120" stroke="#475569" strokeWidth="0.5" />
      <line x1="180" y1="360" x2="620" y2="360" stroke="#475569" strokeWidth="0.5" />
    </g>

    {/* Technical Labels */}
    <g fill="#2DD4BF" fontFamily="monospace" fontSize="9" opacity="0.9">
      <text x="210" y="90">A = COLUMN DIST: 3.60m</text>
      <text x="430" y="90">B = COLUMN DIST: 3.60m</text>
      <text x="235" y="200" fill="#34D399" fontSize="8">TATAMI-A (TEA WELL)</text>
      <text x="455" y="200" fill="#34D399" fontSize="8">TATAMI-B (GALLERY)</text>
      <text x="350" y="320">CYPRESS FLUSH DECK BOARD PREVIEW</text>
      <text x="120" y="380" transform="rotate(-90 120 380)">SPAN LENGTH = 12.00m</text>

      {/* CAD Border Block */}
      <rect x="480" y="400" width="300" height="85" fill="#041618" stroke="#2DD4BF" strokeWidth="1" />
      <text x="490" y="415" fontSize="10" fontWeight="bold">PERSPECTIVE - TOKYO/KYOTO TEAM</text>
      <text x="490" y="430">PROJECT: KOMOREBI TIMBER PAVILION</text>
      <text x="490" y="445">SHEET: LEVEL 01 GROUND FLOOR PLAN</text>
      <text x="490" y="460">GRID MODULE CRANING: CNC INTERLOCK 0.3mm tol</text>
      <text x="490" y="475" fill="#34D399">SCALE: 1:50 | CODE: KYO-T-04</text>
    </g>
  </svg>
);

export const AscentPhoto: React.FC = () => (
  <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="osloSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#DFE7F0" />
        <stop offset="100%" stopColor="#ECECEC" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#osloSky)" />
    
    {/* Historic Red Brick arches forming back framework */}
    <path d="M 0 500 L 0 350 L 140 280 L 280 350 L 280 500 Z" fill="#9C443C" stroke="#7A322B" strokeWidth="2" />
    <path d="M 280 500 L 280 350 L 420 280 L 560 350 L 560 500 Z" fill="#9C443C" stroke="#7A322B" strokeWidth="2" />
    <path d="M 560 500 L 560 350 L 700 280 L 800 330 L 800 500 Z" fill="#8B3C35" opacity="0.9" />

    {/* Arch cutouts in historical brick */}
    <path d="M 30 500 C 30 400, 110 400, 110 500 Z" fill="#EAEAEA" />
    <path d="M 310 500 C 310 400, 390 400, 390 500 Z" fill="#EAEAEA" />

    {/* Modern Intersecting Timber (CLT) Columns */}
    {/* Thick vertical structural columns */}
    <rect x="180" y="100" width="25" height="400" fill="#CBB38E" stroke="#A38860" strokeWidth="2" />
    <rect x="500" y="100" width="25" height="400" fill="#CBB38E" stroke="#A38860" strokeWidth="2" />

    {/* Timber horizontal grid beams */}
    <rect x="0" y="150" width="800" height="20" fill="#CBB38E" opacity="0.9" stroke="#A38860" strokeWidth="1" />
    <rect x="0" y="300" width="800" height="20" fill="#CBB38E" opacity="0.9" stroke="#A38860" strokeWidth="1" />

    {/* Elegant Hanging Skylight / Glass Roof frames */}
    <rect x="250" y="50" width="300" height="100" fill="#DCEEF2" opacity="0.4" stroke="#475569" strokeWidth="1.5" />
    <line x1="300" y1="50" x2="300" y2="150" stroke="#475569" />
    <line x1="350" y1="50" x2="350" y2="150" stroke="#475569" />
    <line x1="400" y1="50" x2="400" y2="150" stroke="#475569" />
    <line x1="450" y1="50" x2="450" y2="150" stroke="#475569" />
    <line x1="500" y1="50" x2="500" y2="150" stroke="#475569" />

    {/* Floating desk & micro architects silhouette in the atrium */}
    <rect x="350" y="380" width="100" height="8" fill="#1C1C1C" />
    <rect x="370" y="340" width="2" height="40" fill="#1C1C1C" />
    <rect x="420" y="340" width="2" height="40" fill="#1C1C1C" />
    {/* Warm desk lamp glow */}
    <circle cx="395" cy="350" r="15" fill="#FDE047" opacity="0.3" filter="blur(6px)" />
  </svg>
);

export const AscentBlueprint: React.FC = () => (
  <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="500" fill="#1A1F2C" />
    <g opacity="0.12" stroke="#818CF8" strokeWidth="0.5">
      <circle cx="400" cy="250" r="100" />
      <circle cx="400" cy="250" r="200" />
      <line x1="0" y1="250" x2="800" y2="250" />
      <line x1="400" y1="0" x2="400" y2="500" />
    </g>

    {/* Elevation section lines */}
    <g stroke="#818CF8" strokeWidth="1.2">
      {/* Existing brick wall profile on left */}
      <rect x="40" y="240" width="120" height="260" strokeWidth="2" stroke="#FF4D4D" />
      <path d="M 40 240 C 40 180, 160 180, 160 240" stroke="#FF4D4D" />

      {/* CLT Timber insertion system in Cyan */}
      <g stroke="#38BDF8" strokeWidth="1.5">
        {/* Core pillar */}
        <rect x="380" y="60" width="40" height="440" />
        {/* Floor joists */}
        <line x1="160" y1="180" x2="640" y2="180" />
        <line x1="160" y1="320" x2="640" y2="320" />
        
        {/* Cross bracing tension system */}
        <line x1="160" y1="180" x2="380" y2="320" strokeDasharray="3 3"/>
        <line x1="380" y1="180" x2="160" y2="320" strokeDasharray="3 3"/>
        <line x1="420" y1="180" x2="640" y2="320" strokeDasharray="3 3"/>
        <line x1="640" y1="180" x2="420" y2="320" strokeDasharray="3 3"/>
      </g>
    </g>

    {/* Technical labels */}
    <g fill="#818CF8" fontFamily="monospace" fontSize="9">
      <text x="50" y="120" fill="#FF4D4D">EXISTING BRICK PIER (UNALTERED RESTORED)</text>
      <text x="430" y="80">NEW GLULAM PRIMARY TENSION COLUMN</text>
      <text x="430" y="170">FLOOR ASSEMBLY: 120mm CLT PANEL</text>
      <text x="430" y="310">HVAC DUCT WORK INTEGRATION SLOT</text>
      
      {/* CAD Block */}
      <rect x="480" y="410" width="300" height="70" fill="#0C0F17" stroke="#818CF8" />
      <text x="490" y="425" fontSize="10" fontWeight="bold">STUDIO PERSPECTIVE - NORDIC BRANCH</text>
      <text x="490" y="438">CLIENT: OSLO HAVN DEVELOPMENTS</text>
      <text x="490" y="451">DWG: CHIMNEY_PASSIVE_AIRFLOW_DETAIL</text>
      <text x="490" y="465" fill="#38BDF8">SYSTEM: STACK VENTILATION SIMULATOR</text>
    </g>
  </svg>
);

export const DunePhoto: React.FC = () => (
  <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="desertSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#DFAD86" />
        <stop offset="60%" stopColor="#F7DFD0" />
        <stop offset="100%" stopColor="#F9ECE0" />
      </linearGradient>
      <linearGradient id="duneRammed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C48E66" />
        <stop offset="40%" stopColor="#AC764F" />
        <stop offset="100%" stopColor="#7E4A28" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#desertSky)" />

    {/* Scenic Sand Dunes */}
    <path d="M 0 350 C 300 280, 500 420, 800 300 L 800 500 L 0 500 Z" fill="#E9C19F" />
    <path d="M 0 410 C 200 370, 400 450, 800 390 L 800 500 L 0 500 Z" fill="#DEAC83" />

    {/* Rammed Earth Curved Portal Cabins */}
    {/* Cabin Left */}
    <path d="M 150 430 Q 150 250, 300 250 Q 450 250, 450 430 Z" fill="url(#duneRammed)" stroke="#663311" strokeWidth="1" />
    
    {/* Sunken Court Glass recess */}
    <path d="M 180 430 Q 180 280, 300 280 Q 420 280, 420 430 Z" fill="#1C1815" />
    
    {/* Brass structural sun trellis */}
    <line x1="300" y1="250" x2="300" y2="430" stroke="#CCAA66" strokeWidth="1.5" />
    <line x1="240" y1="265" x2="240" y2="430" stroke="#CCAA66" strokeWidth="1.2" />
    <line x1="360" y1="265" x2="360" y2="430" stroke="#CCAA66" strokeWidth="1.2" />

    <circle cx="300" cy="340" r="22" fill="#EBDCA3" opacity="0.35" filter="blur(6px)" />
  </svg>
);

export const DuneBlueprint: React.FC = () => (
  <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="500" fill="#3D291F" />
    {/* Clay Grid Lines */}
    <g opacity="0.1" stroke="#FDBA74" strokeWidth="0.5">
      <line x1="0" y1="50" x2="800" y2="50" />
      <line x1="0" y1="150" x2="800" y2="150" />
      <line x1="0" y1="250" x2="800" y2="250" />
      <line x1="300" y1="0" x2="300" y2="500" />
      <line x1="500" y1="0" x2="500" y2="500" />
    </g>

    {/* Ground profile and curve detailing */}
    <g stroke="#FDBA74" strokeWidth="1.5" opacity="0.8">
      {/* Arch drawing elevations */}
      <path d="M 200 420 Q 200 220, 350 220 Q 500 220, 500 420" />
      <path d="M 230 420 Q 230 250, 350 250 Q 470 250, 470 420" strokeDasharray="3 3" />

      {/* Earth layering lines */}
      <line x1="200" y1="270" x2="230" y2="270" />
      <line x1="470" y1="270" x2="500" y2="270" />
      <line x1="200" y1="320" x2="230" y2="320" />
      <line x1="470" y1="320" x2="500" y2="320" />
      <line x1="200" y1="370" x2="230" y2="370" />
      <line x1="470" y1="370" x2="500" y2="370" />

      {/* Wind catcher outlet arrow diagram */}
      <path d="M 350 180 L 350 240 L 330 230 M 350 240 L 370 230" stroke="#FF8A00" strokeWidth="2" />
    </g>

    <g fill="#FDBA74" fontFamily="monospace" fontSize="9">
      <text x="370" y="190" fill="#FF8A00">THERMAL WINDFALL CHAMBER VENT</text>
      <text x="120" y="240">RAMMED EARTH COMPOSITE ENVELOPE: 600mm THK</text>
      <text x="250" y="445">SUNKEN POOL BASE ELEVATION -1.50m LEVEL</text>
      
      {/* CAD block */}
      <rect x="450" y="415" width="330" height="70" fill="#1C130D" stroke="#FDBA74" />
      <text x="460" y="430" fontSize="10" fontWeight="bold">Atelier Zero + Perspective AlUla Group</text>
      <text x="460" y="445">PROJECT: THE DUNE SANCTUARY RESORT</text>
      <text x="460" y="460">FILE: SAND_STABILIZATION_WIND_FLOW.DWG</text>
    </g>
  </svg>
);

export const RelicPhoto: React.FC = () => (
  <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="relicGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#534032" />
        <stop offset="100%" stopColor="#2E1B10" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="#FBF9F4" />

    {/* Ancient masonry ruins (Rustic sienna stones) */}
    <rect x="0" y="0" width="800" height="500" fill="#F0ECE4" />

    {/* Arched ruins */}
    <path d="M 50 500 L 50 220 C 50 100, 250 100, 250 220 L 250 500 Z" fill="#E6DFC6" stroke="#C6BBA3" strokeWidth="4" />
    <path d="M 550 500 L 550 220 C 550 100, 750 100, 750 220 L 750 500 Z" fill="#E6DFC6" stroke="#C6BBA3" strokeWidth="4" />

    <path d="M 100 500 T 100 240 C 100 160, 200 160, 200 240 Z" fill="#ECE7D8" />
    <path d="M 600 500 T 600 240 C 600 160, 700 160, 700 240 Z" fill="#ECE7D8" />

    {/* Modern Corten Steel Insertion Portal */}
    <rect x="230" y="150" width="340" height="350" fill="url(#relicGold)" stroke="#894B2E" strokeWidth="4" />
    
    {/* Large Structural Crystal Glass Opening (Highlight of intervention) */}
    <rect x="250" y="170" width="300" height="330" fill="#E1F3F5" opacity="0.75" stroke="#FFFFFF" strokeWidth="1.5" />

    {/* Corten floating stairs */}
    <rect x="270" y="440" width="80" height="6" fill="#894B2E" />
    <rect x="290" y="400" width="80" height="6" fill="#894B2E" />
    <rect x="310" y="360" width="80" height="6" fill="#894B2E" />
    <rect x="330" y="320" width="80" height="6" fill="#894B2E" />

    {/* Beam of light from ceiling hole */}
    <polygon points="350,0 450,0 520,500 380,500" fill="#FFFED4" opacity="0.3" filter="blur(6px)" />
  </svg>
);

export const RelicBlueprint: React.FC = () => (
  <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="500" fill="#1C1815" />
    {/* CAD lines */}
    <g stroke="#C2410C" strokeWidth="1.5">
      {/* Historical Vault profile in Red/Orange outline */}
      <path d="M 100 500 L 100 250 C 100 120, 400 120, 400 250" strokeWidth="2.5" />
      <path d="M 700 500 L 700 250 C 700 120, 400 120, 400 250" strokeWidth="2.5" />

      {/* New metallic insertion core in Cyan */}
      <g stroke="#38BDF8" strokeWidth="2">
        <rect x="240" y="180" width="320" height="320" />
        <rect x="260" y="200" width="280" height="300" strokeDasharray="3 3" />
      </g>
    </g>

    <g fill="#FFFFFF" fontFamily="monospace" fontSize="9" opacity="0.8">
      <text x="110" y="100" fill="#C2410C">14th CENTURY MASONRY STABILIZATION SLEEVE</text>
      <text x="260" y="235" fill="#38BDF8">SUSPENDED COR-TEN PLATFORM DET. B</text>
      <text x="260" y="350" fill="#38BDF8">60mm HEAVY HIGH-EFFICIENCY FLOAT GLASS</text>

      <rect x="460" y="415" width="310" height="70" fill="#0C0D10" stroke="#38BDF8" />
      <text x="470" y="430" fontSize="10" fontWeight="bold">B. Moretti Restauro & Perspective Siena</text>
      <text x="470" y="445">PROJECT: RELIC & VOID PRIVATE VAULT</text>
      <text x="470" y="460">SYSTEM: INDEPENDENT ANCHOR COR-TEN INTERIOR</text>
    </g>
  </svg>
);

interface RenderAisGraphicProps {
  type: string;
  blueprint: boolean;
}

export const RenderAisGraphic: React.FC<RenderAisGraphicProps> = ({ type, blueprint }) => {
  const isUrl = type && (type.startsWith('http://') || type.startsWith('https://'));

  if (blueprint) {
    if (isUrl) {
      if (type.includes('stone-monolith') || type.includes('Lugano') || type.includes('lugano') || type.includes('600585154526-990dced4db0d') || type.includes('600607687920-4e2a09cf159d')) {
        return <StoneMonolithBlueprint />;
      }
      if (type.includes('komorebi') || type.includes('Kyoto') || type.includes('493976040374-85c8e12f0c0e') || type.includes('508333706533-1ab43ecb1606')) {
        return <KomorebiBlueprint />;
      }
      if (type.includes('ascent') || type.includes('Oslo') || type.includes('486406146926-c627a92ad1ab') || type.includes('582268611958-ebfd161ef9cf')) {
        return <AscentBlueprint />;
      }
      if (type.includes('dune') || type.includes('AlUla') || type.includes('533105079780-92b9be482077') || type.includes('540555700478-4be289fbecef')) {
        return <DuneBlueprint />;
      }
      if (type.includes('relic') || type.includes('Siena') || type.includes('479839672679-a46483c0e7c8') || type.includes('507652313519-d4e9174996dd')) {
        return <RelicBlueprint />;
      }
      return <StoneMonolithBlueprint />;
    }

    switch (type) {
      case 'stone-monolith-render':
      case 'stone-monolith-blueprint':
        return <StoneMonolithBlueprint />;
      case 'komorebi-render':
      case 'komorebi-blueprint':
        return <KomorebiBlueprint />;
      case 'ascent-render':
      case 'ascent-blueprint':
        return <AscentBlueprint />;
      case 'dune-render':
      case 'dune-blueprint':
        return <DuneBlueprint />;
      case 'relic-render':
      case 'relic-blueprint':
        return <RelicBlueprint />;
      default:
        return <StoneMonolithBlueprint />;
    }
  } else {
    if (isUrl) {
      return (
        <img
          src={type}
          alt="Architectural Study"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-100 hover:scale-[1.03] transition-transform duration-[800ms] ease-out select-none"
        />
      );
    }

    switch (type) {
      case 'stone-monolith-render':
      case 'stone-monolith-blueprint':
        return <StoneMonolithPhoto />;
      case 'komorebi-render':
      case 'komorebi-blueprint':
        return <KomorebiPhoto />;
      case 'ascent-render':
      case 'ascent-blueprint':
        return <AscentPhoto />;
      case 'dune-render':
      case 'dune-blueprint':
        return <DunePhoto />;
      case 'relic-render':
      case 'relic-blueprint':
        return <RelicPhoto />;
      default:
        return <StoneMonolithPhoto />;
    }
  }
};
