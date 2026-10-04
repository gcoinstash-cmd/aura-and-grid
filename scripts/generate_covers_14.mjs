import fs from 'node:fs';
import path from 'node:path';

const covers = [
  { id: 123, slug: "chrono-tachyon-flight-deck", name: "Chrono Tachyon Flight Deck", cat: "Hypersonic Scramjet Hypercar Telemetry & Electromagnetic Skid Flight Deck", sector: "DEEP TECH & SCADA // DENSE OPERATIONAL CONSOLE", bm: "DARPA Falcon HTV-2 & X-43A Hypersonic Scramjet Flight Console", tables: "scramjet_hypercar_vehicles, hypersonic_telemetry_snapshots, mag_skid_telemetry_logs" },
  { id: 124, slug: "valkyrie-aerospike-vmax-telemetry-deck", name: "Valkyrie Aerospike-VMax Telemetry Deck", cat: "Supersonic Aerospike Rocket Hypercar Flight Deck & Telemetry Console", sector: "DEEP TECH & SCADA // DENSE OPERATIONAL CONSOLE", bm: "Lockheed Martin X-33 Linear Aerospike & Bloodhound LSR Console", tables: "aerospike_hypercar_vehicles, propulsion_telemetry_snapshots, cryo_propellant_logs" },
  { id: 125, slug: "chronos-morph-gt-telemetry-deck", name: "Chronos Morph-GT Telemetry Deck", cat: "Morphing Aero-Composite Stealth Interceptor & Hypercar Telemetry OS", sector: "AUTOMOTIVE & MOBILITY // DENSE OPERATIONAL CONSOLE", bm: "Pagani Huayra Active Aero & NASA Shape Memory Alloy Console", tables: "morph_hypercar_vehicles, aero_surface_snapshots, actuator_thermal_logs" },
  { id: 126, slug: "pulsar-magneto-gt-telemetry-deck", name: "Pulsar Magneto-GT Telemetry Deck", cat: "Plasma Tokamak Fusion Hypercar Cockpit & MagLev Telemetry Deck", sector: "CLEAN ENERGY & SCADA // DENSE OPERATIONAL CONSOLE", bm: "ITER Magnetics SCADA & Central Solenoid Plasma Diagnostics", tables: "fusion_hypercar_vehicles, plasma_telemetry_snapshots, maglev_coil_logs" },
  { id: 127, slug: "solaris-vac-wing-rcs-telemetry-deck", name: "Solaris Vac-Wing RCS Telemetry Deck", cat: "Orbital Reaction-Control Telemetry Console & Cold-Gas RCS Flight Deck", sector: "DEEP TECH & SCADA // DENSE OPERATIONAL CONSOLE", bm: "SpaceX Dragon Cold-Gas Thruster Matrix & Gemini RCS Deck", tables: "rcs_hypercar_vehicles, thruster_telemetry_snapshots, nitrogen_gas_logs" },
  { id: 128, slug: "hydra-endurance-deck", name: "Hydra Endurance Deck", cat: "Le Mans 24H Liquid H2 Fuel-Cell Hypercar Telemetry Console", sector: "AUTOMOTIVE & MOBILITY // DENSE OPERATIONAL CONSOLE", bm: "Toyota Gazoo Racing GR010 Le Mans Telemetry & MissionH24 Console", tables: "endurance_vehicles, h2_telemetry_snapshots, supercapacitor_cycle_logs" },
  { id: 129, slug: "aeon-suction-gt-aero-console", name: "Aeon Suction-GT Aero Console", cat: "Active Ground-Effect Aerodynamics Wind-Tunnel & Vacuum Telemetry Deck", sector: "DEEP TECH & SCADA // DENSE OPERATIONAL CONSOLE", bm: "Brabham BT46B Fan Car & McMurtry Spéirling Vacuum Aero SCADA", tables: "ground_effect_vehicles, vacuum_telemetry_snapshots, turbine_fan_logs" },
  { id: 130, slug: "vortex-apex-gt-hypercar-telemetry-deck", name: "VORTEX Apex-GT Hypercar Telemetry Deck", cat: "Quad-Motor Torque Vectoring & Active Aero Hypercar Telemetry Console", sector: "AUTOMOTIVE & MOBILITY // DENSE OPERATIONAL CONSOLE", bm: "Rimac Nevera Torque Vectoring HUD & Porsche Mission X Telemetry", tables: "hypercar_vehicles, telemetry_snapshots, motor_torque_logs" },
  { id: 131, slug: "apex-ascent-space-elevator-climber-flight-deck", name: "Apex Ascent Space Elevator & Climber Flight Deck", cat: "Space Elevator Carbon Nanotube Tether & Heavy Climber Robotics Console", sector: "DEEP TECH & SCADA // DENSE OPERATIONAL CONSOLE", bm: "Obayashi Space Elevator Concept & NASA Carbon Nanotube Tether SCADA", tables: "climbers, tether_telemetry, photovoltaic_receivers, traction_drive_telemetry" },
  { id: 132, slug: "shackleton-polar-catapult-lunar-mass-driver-control", name: "Shackleton Polar Catapult Lunar Mass Driver Control", cat: "Lunar Surface Electromagnetic Mass Driver Firing & Telemetry Control Deck", sector: "DEEP TECH & SCADA // DENSE OPERATIONAL CONSOLE", bm: "NASA Lunar Surface Innovation Initiative & General Atomics EMALS Launch Deck", tables: "mass_driver_facilities, telemetry_snapshots, stator_coil_stages, payload_manifest" },
  { id: 133, slug: "oceanus-cryodrill-sub-ice-rov-command-deck", name: "Oceanus CryoDrill Sub-Ice ROV Command Deck", cat: "Deep-Submergence Sub-Ice Planetary Ocean Penetrator ROV Command Deck", sector: "DEEP TECH & SCADA // DENSE OPERATIONAL CONSOLE", bm: "WHOI Nereid Under-Ice ROV & NASA Europa CryoBot Exploration Deck", tables: "probe_units, probe_telemetry_logs, science_payload_manifest, vent_water_chemistry_logs" },
  { id: 134, slug: "sierra-orbital-valkyrie-x-flight-deck", name: "Sierra Orbital Valkyrie-X Flight Deck", cat: "Suborbital Spaceplane Aerospike Propulsion & Attitude Flight Deck", sector: "DEEP TECH & SCADA // DENSE OPERATIONAL CONSOLE", bm: "Sierra Space Dream Chaser & North American X-15 Flight Telemetry Console", tables: "spaceplanes, missions, rcs_thrusters, propulsion_telemetry_logs" },
  { id: 135, slug: "nasa-vf6-x3-100kw-hall-thruster-control", name: "NASA VF6 X3 100kW Hall Thruster Control", cat: "High-Power Electric Propulsion Vacuum Chamber SCADA & Thruster Control Deck", sector: "DEEP TECH & SCADA // DENSE OPERATIONAL CONSOLE", bm: "NASA Glenn Vacuum Facility 6 & PEPL X3 Nested-Channel Hall Effect Thruster Deck", tables: "test_campaigns, firing_telemetry_snapshots, faraday_sweeps, facility_subsystems" },
  { id: 136, slug: "tokamak-plasma-control-arc-02-operations-deck", name: "Tokamak Plasma Control ARC-02 Operations Deck", cat: "High-Field Magnetic Confinement & Burning Plasma Tokamak Operations Control Deck", sector: "CLEAN ENERGY & SCADA // DENSE OPERATIONAL CONSOLE", bm: "Commonwealth Fusion Systems SPARC SCADA & UKAEA STEP Plasma Flight Deck", tables: "tokamak_shots, magnetic_equilibrium_snapshots, divertor_target_plates" }
];

covers.forEach(c => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg-${c.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#08090A"/>
      <stop offset="50%" stop-color="#0D1017"/>
      <stop offset="100%" stop-color="#141824"/>
    </linearGradient>
    <pattern id="grid-${c.id}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#232630" stroke-width="0.75" stroke-opacity="0.45"/>
    </pattern>
  </defs>
  <rect width="1280" height="720" fill="url(#bg-${c.id})"/>
  <rect width="1280" height="720" fill="url(#grid-${c.id})"/>
  
  <!-- Decorative Technical Elements -->
  <circle cx="1060" cy="220" r="180" fill="none" stroke="#C5A880" stroke-width="1" stroke-opacity="0.12" stroke-dasharray="6 8"/>
  <circle cx="1060" cy="220" r="120" fill="none" stroke="#3B82F6" stroke-width="1" stroke-opacity="0.1"/>
  <circle cx="1060" cy="220" r="60" fill="none" stroke="#10B981" stroke-width="1" stroke-opacity="0.08"/>
  
  <!-- Header Bar -->
  <rect x="60" y="50" width="1160" height="40" fill="#14161C" rx="6" stroke="#232630" stroke-width="1"/>
  <text x="80" y="75" fill="#C5A880" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" letter-spacing="2">AURA &amp; GRID // TECHNICAL REPOSITORY</text>
  <text x="1200" y="75" text-anchor="end" fill="#F59E0B" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="bold">● TRACK 2 // FLAGSHIP TIER-1</text>
  
  <!-- Title Block -->
  <text x="60" y="150" fill="#C5A880" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="bold" letter-spacing="3">${c.sector}</text>
  <text x="60" y="225" fill="#FFFFFF" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="bold">${c.name}</text>
  <text x="60" y="270" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="17">${c.cat}</text>
  
  <!-- Specs Console Box -->
  <rect x="60" y="320" width="1160" height="260" fill="#090B0E" rx="10" stroke="#232630" stroke-width="1"/>
  <line x1="60" y1="400" x2="1220" y2="400" stroke="#232630" stroke-width="1"/>
  
  <text x="90" y="365" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="13">ARCHITECTURE</text>
  <text x="260" y="365" fill="#E5E7EB" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="bold">React 19 + TypeScript + Tailwind CSS</text>
  
  <text x="680" y="365" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="13">DATABASE ENGINE</text>
  <text x="840" y="365" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="bold">Supabase PostgreSQL + Active RLS</text>
  
  <text x="90" y="450" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="13">BENCHMARK</text>
  <text x="260" y="450" fill="#C5A880" font-family="'JetBrains Mono', monospace" font-size="14">${c.bm}</text>
  
  <text x="680" y="450" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="13">RELATIONAL TABLES</text>
  <text x="840" y="450" fill="#93C5FD" font-family="'JetBrains Mono', monospace" font-size="14">${c.tables}</text>
  
  <text x="90" y="525" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="13">PRODUCT TRUTH</text>
  <text x="260" y="525" fill="#F59E0B" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600">[SIMULATED DATA PROTOTYPE] — CONCEPT DEMONSTRATION &amp; DEPLOYABLE SOURCE</text>
  
  <!-- Footer Bar -->
  <rect x="60" y="615" width="1160" height="50" fill="#14161C" rx="8" stroke="#232630" stroke-width="1"/>
  <text x="90" y="646" fill="#C5A880" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="bold">VEHICLE #${c.id}</text>
  <text x="360" y="646" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="12">CATALOG SYNCHRONIZED WITH GHOSTFACTORYOS v1.8.0</text>
  <text x="1200" y="646" text-anchor="end" fill="#E5E7EB" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="bold">$14,500 BUYOUT ANCHOR</text>
</svg>`;

  fs.writeFileSync(path.join("assets/covers", `${c.slug}-cover.svg`), svg);
  fs.writeFileSync(path.join("site/assets/covers", `${c.slug}-cover.svg`), svg);
});
console.log("✅ 14 SVG covers generated successfully in assets/covers and site/assets/covers!");
