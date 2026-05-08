/**
 * Anaglyph 3D Color System
 * 
 * Controls per-eye color channels for anaglyph 3D glasses.
 * Red lens blocks red light → red objects invisible to left eye
 * Blue/Cyan lens blocks blue light → blue objects invisible to right eye
 */

export interface EyeColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface AnaglyphCalibration {
  id: string;
  name: string;
  /** Color channel for LEFT eye objects (seen through RIGHT eye / blue lens) */
  leftEye: EyeColor;
  /** Color channel for RIGHT eye objects (seen through LEFT eye / red lens) */
  rightEye: EyeColor;
  /** How much color bleeds through the "wrong" lens (0=perfect filter, 1=no filter) */
  bleed: number;
  /** Overall intensity multiplier */
  intensity: number;
  /** Background darkness (0=black, 255=white) */
  backgroundLevel: number;
}

// ── Presets ──────────────────────────────────────────────

export const PRESET_RED_BLUE_STANDARD: AnaglyphCalibration = {
  id: 'red-blue-standard',
  name: 'Kırmızı-Mavi (Standart)',
  leftEye: { r: 220, g: 0, b: 0 },
  rightEye: { r: 0, g: 0, b: 220 },
  bleed: 0.05,
  intensity: 1.0,
  backgroundLevel: 10,
};

export const PRESET_RED_BLUE_LIGHT: AnaglyphCalibration = {
  id: 'red-blue-light',
  name: 'Kırmızı-Mavi (Açık Tonlu)',
  leftEye: { r: 200, g: 30, b: 30 },
  rightEye: { r: 30, g: 30, b: 200 },
  bleed: 0.15,
  intensity: 0.85,
  backgroundLevel: 15,
};

export const PRESET_RED_CYAN: AnaglyphCalibration = {
  id: 'red-cyan',
  name: 'Kırmızı-Cyan',
  leftEye: { r: 220, g: 0, b: 0 },
  rightEye: { r: 0, g: 200, b: 200 },
  bleed: 0.05,
  intensity: 1.0,
  backgroundLevel: 10,
};

export const PRESET_RED_GREEN: AnaglyphCalibration = {
  id: 'red-green',
  name: 'Kırmızı-Yeşil',
  leftEye: { r: 220, g: 0, b: 0 },
  rightEye: { r: 0, g: 220, b: 0 },
  bleed: 0.05,
  intensity: 1.0,
  backgroundLevel: 10,
};

export const ALL_PRESETS: AnaglyphCalibration[] = [
  PRESET_RED_BLUE_STANDARD,
  PRESET_RED_BLUE_LIGHT,
  PRESET_RED_CYAN,
  PRESET_RED_GREEN,
];

// ── Storage ─────────────────────────────────────────────

const STORAGE_KEY = 'gozmacerasi_calibration';

export function saveCalibration(cal: AnaglyphCalibration): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cal));
  }
}

export function loadCalibration(): AnaglyphCalibration {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as AnaglyphCalibration;
    } catch { /* ignore */ }
  }
  return PRESET_RED_BLUE_STANDARD;
}

// ── Color Helpers ───────────────────────────────────────

/** Returns an RGB string for objects that should be visible ONLY to the LEFT eye */
export function getLeftEyeColor(cal: AnaglyphCalibration): string {
  const { r, g, b } = cal.leftEye;
  const i = cal.intensity;
  return `rgb(${Math.round(r * i)}, ${Math.round(g * i)}, ${Math.round(b * i)})`;
}

/** Returns an RGB string for objects that should be visible ONLY to the RIGHT eye */
export function getRightEyeColor(cal: AnaglyphCalibration): string {
  const { r, g, b } = cal.rightEye;
  const i = cal.intensity;
  return `rgb(${Math.round(r * i)}, ${Math.round(g * i)}, ${Math.round(b * i)})`;
}

/** Returns a neutral dark background color */
export function getBackgroundColor(cal: AnaglyphCalibration): string {
  const v = cal.backgroundLevel;
  return `rgb(${v}, ${v}, ${v})`;
}

/** Apply bleed: mix a small amount of the "wrong" channel into the color */
export function applyBleed(color: EyeColor, bleed: number): EyeColor {
  const avg = (color.r + color.g + color.b) / 3;
  return {
    r: Math.round(color.r + avg * bleed * (color.r === 0 ? 1 : 0)),
    g: Math.round(color.g + avg * bleed * (color.g === 0 ? 1 : 0)),
    b: Math.round(color.b + avg * bleed * (color.b === 0 ? 1 : 0)),
  };
}

/** Get CSS color string for left-eye objects with bleed applied */
export function getLeftEyeColorWithBleed(cal: AnaglyphCalibration): string {
  const c = applyBleed(cal.leftEye, cal.bleed);
  const i = cal.intensity;
  return `rgb(${Math.round(c.r * i)}, ${Math.round(c.g * i)}, ${Math.round(c.b * i)})`;
}

/** Get CSS color string for right-eye objects with bleed applied */
export function getRightEyeColorWithBleed(cal: AnaglyphCalibration): string {
  const c = applyBleed(cal.rightEye, cal.bleed);
  const i = cal.intensity;
  return `rgb(${Math.round(c.r * i)}, ${Math.round(c.g * i)}, ${Math.round(c.b * i)})`;
}

/** Get a color visible to both eyes (white/neutral) */
export function getBothEyesColor(): string {
  return 'rgb(200, 200, 200)';
}
