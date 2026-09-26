export interface MenuItem {
  id: string;
  name: string;
  chineseName: string;
  description: string;
  price: string;
  prepTimeSeconds: number;
  calories: number;
  spicyLevel: number;
  imageUrl: string;
}

export type VehicleClass = 'HYPERCAR' | 'SUPERCAR' | 'EV' | 'SPORT_TOURER';
export type BoostPreset = 'STANDARD' | 'UMAMI' | 'SUPERCHARGED';

export interface DriveThruConfig {
  vehicleClass: VehicleClass;
  boostPreset: BoostPreset;
  lanePriority: boolean;
  wokTemperature: number; // in Celsius, slider from 250 to 350
}

export interface MetricState {
  pipelineVolume: number; // 0 to 100%
  avgWokTimeSeconds: number; // e.g., 225s
  liveWaitMinutes: number; // e.g. 4.2
  apexSpeedMatures: number; // simulated
}
