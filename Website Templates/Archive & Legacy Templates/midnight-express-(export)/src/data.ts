import { MenuItem, VehicleClass, BoostPreset } from './types';
import { MENU_ITEMS as CONFIG_MENU_ITEMS } from './config/menuConfig';

export const MENU_ITEMS: MenuItem[] = CONFIG_MENU_ITEMS;


export const VEHICLE_CLASSES: { id: VehicleClass; name: string; multiplier: number; desc: string }[] = [
  {
    id: 'HYPERCAR',
    name: 'Apex Hypercar',
    multiplier: 0.8,
    desc: 'Max priority intake. Pre-calculated braking distance & rapid order handshake.',
  },
  {
    id: 'SUPERCAR',
    name: 'Grand Tourer',
    multiplier: 0.9,
    desc: 'Elite aerodynamic priority. Optimized thermal food container preheating.',
  },
  {
    id: 'EV',
    name: 'Silent Electric',
    multiplier: 1.0,
    desc: 'Inducted queue charging, zero emissions, acoustic shield activation.',
  },
  {
    id: 'SPORT_TOURER',
    name: 'Sport Utility Tourer',
    multiplier: 1.15,
    desc: 'Standard high-volume food container delivery with luggage rack spacing.',
  },
];

export const BOOST_PRESETS: { id: BoostPreset; name: string; addTime: number; wokBoost: number; desc: string }[] = [
  {
    id: 'STANDARD',
    name: 'Standard Induction',
    addTime: 0,
    wokBoost: 0,
    desc: 'Standard high-temperature wok searing. Balanced energy layout.',
  },
  {
    id: 'UMAMI',
    name: 'Umami Booster (Supercharged)',
    addTime: -25,
    wokBoost: 30,
    desc: 'Dual-injector organic monosodium boost. Flavour intensity increased by +40%.',
  },
  {
    id: 'SUPERCHARGED',
    name: 'Szechuan Fuel-Injection',
    addTime: -45,
    wokBoost: 60,
    desc: 'Liquid nitrogen flash cooling, double wok flame pressure, high-octane spice oil.',
  },
];

export const TELEMETRY_FEED: string[] = [
  "PIPELINE VOLUME: 82% OPTIMAL",
  "AVERAGE WOK-TO-WINDOW TIME: 3:32 MIN",
  "APEX TURBO INDUCTION ACTIVE ON LANE 01",
  "SZECHUAN INJECTION CHAMBER TEMPERATURE: 320°C",
  "CURRENT TRACK OCCUPANCY: 12 METRIC SUITES",
  "AUTOPILOT INTEGRATION STATUS: ONLINE",
  "AIR FILTRATION BARRIER AT STATIONS: 99.8% EFFICIENCY",
  "NOODLE FLASH STEAMER PRESSURE: 4.8 BAR // SECURE",
  "WOK ROTATION SPEED: 120 RPM (SYMMETRICAL VENTILATION)",
];
