import { AnaglyphCalibrationV2, DEFAULT_CALIBRATION_V2 } from '@gozmacerasi/game-engine';

export const PRESET_RED_BLUE_STANDARD: AnaglyphCalibrationV2 = DEFAULT_CALIBRATION_V2;

export const PRESET_RED_CYAN: AnaglyphCalibrationV2 = {
  id: 'red-cyan',
  name: 'Kırmızı-Camgöbeği',
  type: 'rc',
  leftEye: [255, 0, 0],
  rightEye: [0, 255, 255],
  bg: [255, 255, 255],
};

export const PRESET_RED_GREEN: AnaglyphCalibrationV2 = {
  id: 'red-green',
  name: 'Kırmızı-Yeşil',
  type: 'rg',
  leftEye: [255, 0, 0],
  rightEye: [0, 255, 0],
  bg: [255, 255, 255],
};

export const ALL_PRESETS: AnaglyphCalibrationV2[] = [
  PRESET_RED_BLUE_STANDARD,
  PRESET_RED_CYAN,
  PRESET_RED_GREEN,
];

// ── Storage ─────────────────────────────────────────────

const STORAGE_KEY = 'gozmacerasi_calibration_v2';

export function saveCalibration(cal: AnaglyphCalibrationV2): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cal));
  }
}

export function loadCalibration(): AnaglyphCalibrationV2 {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as AnaglyphCalibrationV2;
    } catch { /* ignore */ }
  }
  return PRESET_RED_CYAN; // Default to RC which is most common
}

// ── Color Helpers ───────────────────────────────────────

export function getLeftEyeColor(cal: AnaglyphCalibrationV2): string {
  const [r, g, b] = cal.leftEye;
  return `rgb(${r}, ${g}, ${b})`;
}

export function getRightEyeColor(cal: AnaglyphCalibrationV2): string {
  const [r, g, b] = cal.rightEye;
  return `rgb(${r}, ${g}, ${b})`;
}

export function getBackgroundColor(cal: AnaglyphCalibrationV2): string {
  const [r, g, b] = cal.bg;
  return `rgb(${r}, ${g}, ${b})`;
}

export function getLeftEyeColorWithBleed(cal: AnaglyphCalibrationV2): string {
  return getLeftEyeColor(cal);
}

export function getRightEyeColorWithBleed(cal: AnaglyphCalibrationV2): string {
  return getRightEyeColor(cal);
}

export function getBothEyesColor(): string {
  return 'rgb(0, 0, 0)'; 
}

export type { AnaglyphCalibrationV2 as AnaglyphCalibration };
