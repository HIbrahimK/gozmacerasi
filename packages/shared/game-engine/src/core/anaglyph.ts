export interface CalibrationProfile {
  id: string;
  glassType: 'clip' | 'normal' | 'themed';
  glassColor: 'red-blue' | 'red-green';
  intensity: number;
  brightness: number;
  contrast: number;
}

export interface EyeColor {
  r: number;
  g: number;
  b: number;
}

export interface AnaglyphCalibrationV2 {
  id: string;
  name: string;
  leftEye: EyeColor;
  rightEye: EyeColor;
  bleed: number;
  intensity: number;
  backgroundLevel: number;
}

export const DEFAULT_CALIBRATION: CalibrationProfile = {
  id: 'default',
  glassType: 'normal',
  glassColor: 'red-blue',
  intensity: 70,
  brightness: 100,
  contrast: 100,
};

export const DEFAULT_CALIBRATION_V2: AnaglyphCalibrationV2 = {
  id: 'red-blue-standard',
  name: 'Kırmızı-Mavi (Standart)',
  leftEye: { r: 220, g: 0, b: 0 },
  rightEye: { r: 0, g: 0, b: 220 },
  bleed: 0.05,
  intensity: 1.0,
  backgroundLevel: 10,
};

/**
 * Apply bleed effect to an eye color
 */
function applyBleed(color: EyeColor, bleed: number): EyeColor {
  const avg = (color.r + color.g + color.b) / 3;
  return {
    r: Math.round(color.r + avg * bleed * (color.r === 0 ? 1 : 0)),
    g: Math.round(color.g + avg * bleed * (color.g === 0 ? 1 : 0)),
    b: Math.round(color.b + avg * bleed * (color.b === 0 ? 1 : 0)),
  };
}

export class AnaglyphRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private profile: CalibrationProfile;
  private profileV2: AnaglyphCalibrationV2;

  constructor(
    canvas: HTMLCanvasElement,
    profile: CalibrationProfile = DEFAULT_CALIBRATION,
    profileV2?: AnaglyphCalibrationV2,
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.profile = profile;
    this.profileV2 = profileV2 ?? DEFAULT_CALIBRATION_V2;
  }

  updateProfile(profile: CalibrationProfile): void {
    this.profile = profile;
  }

  updateProfileV2(profile: AnaglyphCalibrationV2): void {
    this.profileV2 = profile;
  }

  getProfileV2(): AnaglyphCalibrationV2 {
    return this.profileV2;
  }

  // ── Per-eye drawing methods ──────────────────────────

  /**
   * Get CSS color string for objects visible ONLY to the LEFT eye.
   * Through the red lens, red objects disappear → left eye object is red-tinted.
   */
  getLeftEyeColor(alpha: number = 1): string {
    const c = applyBleed(this.profileV2.leftEye, this.profileV2.bleed);
    const i = this.profileV2.intensity;
    if (alpha >= 1) {
      return `rgb(${Math.round(c.r * i)}, ${Math.round(c.g * i)}, ${Math.round(c.b * i)})`;
    }
    return `rgba(${Math.round(c.r * i)}, ${Math.round(c.g * i)}, ${Math.round(c.b * i)}, ${alpha})`;
  }

  /**
   * Get CSS color string for objects visible ONLY to the RIGHT eye.
   * Through the blue lens, blue objects disappear → right eye object is blue-tinted.
   */
  getRightEyeColor(alpha: number = 1): string {
    const c = applyBleed(this.profileV2.rightEye, this.profileV2.bleed);
    const i = this.profileV2.intensity;
    if (alpha >= 1) {
      return `rgb(${Math.round(c.r * i)}, ${Math.round(c.g * i)}, ${Math.round(c.b * i)})`;
    }
    return `rgba(${Math.round(c.r * i)}, ${Math.round(c.g * i)}, ${Math.round(c.b * i)}, ${alpha})`;
  }

  /**
   * Get background color from calibration profile
   */
  getBackgroundColor(): string {
    const v = this.profileV2.backgroundLevel;
    return `rgb(${v}, ${v}, ${v})`;
  }

  /**
   * Draw objects in the left-eye-only color.
   * These objects will be invisible to the left eye (red lens blocks them)
   * and visible to the right eye.
   */
  drawForLeftEye(
    drawFn: (ctx: CanvasRenderingContext2D, color: string) => void,
  ): void {
    drawFn(this.ctx, this.getLeftEyeColor());
  }

  /**
   * Draw objects in the right-eye-only color.
   * These objects will be invisible to the right eye (blue lens blocks them)
   * and visible to the left eye.
   */
  drawForRightEye(
    drawFn: (ctx: CanvasRenderingContext2D, color: string) => void,
  ): void {
    drawFn(this.ctx, this.getRightEyeColor());
  }

  /**
   * Draw shared objects in neutral color (visible to both eyes).
   */
  drawForBothEyes(
    drawFn: (ctx: CanvasRenderingContext2D) => void,
  ): void {
    drawFn(this.ctx);
  }

  // ── Legacy methods (still available) ──────────────────

  renderAnaglyph(
    leftImageData: ImageData,
    rightImageData: ImageData,
  ): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const output = this.ctx.createImageData(width, height);

    const intensityFactor = this.profile.intensity / 100;
    const brightnessFactor = this.profile.brightness / 100;
    const contrastFactor = this.profile.contrast / 100;

    const isRedBlue = this.profile.glassColor === 'red-blue';

    for (let i = 0; i < output.data.length; i += 4) {
      const pixelIndex = i / 4;
      const x = pixelIndex % width;

      if (x < leftImageData.width && x < rightImageData.width) {
        const leftR = leftImageData.data[i];
        const rightG = rightImageData.data[i + 1];
        const rightB = rightImageData.data[i + 2];

        if (isRedBlue) {
          output.data[i] = this.applyFilters(leftR * intensityFactor, brightnessFactor, contrastFactor);
          output.data[i + 1] = this.applyFilters(0, brightnessFactor, contrastFactor);
          output.data[i + 2] = this.applyFilters(
            ((rightG + rightB) / 2) * intensityFactor,
            brightnessFactor,
            contrastFactor,
          );
        } else {
          output.data[i] = this.applyFilters(leftR * intensityFactor, brightnessFactor, contrastFactor);
          output.data[i + 1] = this.applyFilters(
            ((rightG + rightB) / 2) * intensityFactor,
            brightnessFactor,
            contrastFactor,
          );
          output.data[i + 2] = this.applyFilters(0, brightnessFactor, contrastFactor);
        }

        output.data[i + 3] = 255;
      }
    }

    this.ctx.putImageData(output, 0, 0);
  }

  renderStereoscopic(
    drawLeft: (ctx: CanvasRenderingContext2D) => void,
    drawRight: (ctx: CanvasRenderingContext2D) => void,
  ): void {
    const width = this.canvas.width;
    const height = this.canvas.height;

    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext('2d')!;

    offCtx.clearRect(0, 0, width, height);
    drawLeft(offCtx);
    const leftData = offCtx.getImageData(0, 0, width, height);

    offCtx.clearRect(0, 0, width, height);
    drawRight(offCtx);
    const rightData = offCtx.getImageData(0, 0, width, height);

    this.renderAnaglyph(leftData, rightData);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private applyFilters(value: number, brightness: number, contrast: number): number {
    let result = value * brightness;
    result = ((result / 255 - 0.5) * contrast + 0.5) * 255;
    return Math.max(0, Math.min(255, Math.round(result)));
  }
}
