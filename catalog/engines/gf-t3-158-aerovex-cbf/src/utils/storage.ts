import { CBFConfig } from '../types/telemetry';

const STORAGE_KEY_CONFIG = 'aerovex_cbf_config_v1';
const STORAGE_KEY_APA_SIGNED = 'aerovex_apa_signature_v1';

export const DEFAULT_CONFIG: CBFConfig = {
  alpha: 1.8,
  rSafe: 28,
  nodeCount: 64,
  simSpeed: 1.0,
  formation: 'cross_flow',
  showHalos: true,
  showDeflections: true,
  showIntruders: true,
  showTrails: true,
};

export function loadSavedConfig(): CBFConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {
    // fallback
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(cfg: CBFConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(cfg));
  } catch {
    // ignore
  }
}

export interface APASignatureData {
  signed: boolean;
  signerName: string;
  signerTitle: string;
  signerEntity: string;
  timestamp: string;
  wireEscrowConfirmed: boolean;
}

export function loadAPASignature(): APASignatureData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APA_SIGNED);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {
    signed: false,
    signerName: '',
    signerTitle: '',
    signerEntity: '',
    timestamp: '',
    wireEscrowConfirmed: false,
  };
}

export function saveAPASignature(data: APASignatureData): void {
  try {
    localStorage.setItem(STORAGE_KEY_APA_SIGNED, JSON.stringify(data));
  } catch {
    // ignore
  }
}
