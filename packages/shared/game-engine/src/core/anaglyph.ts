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
  type?: string; // e.g. 'rc', 'rb', 'rg'
  leftEye: [number, number, number];
  rightEye: [number, number, number];
  bg: [number, number, number];
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
  type: 'rb',
  leftEye: [255, 0, 0],
  rightEye: [0, 0, 255],
  bg: [255, 255, 255],
};

/**
 * Apply bleed effect to an eye color
 * @deprecated Not used with precise RGB calibration
 */
function applyBleed(color: [number, number, number], bleed: number): [number, number, number] {
  return color;
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
   */
  getLeftEyeColor(alpha: number = 1): string {
    const [r, g, b] = this.profileV2.leftEye;
    if (alpha >= 1) return `rgb(${r}, ${g}, ${b})`;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Get CSS color string for objects visible ONLY to the RIGHT eye.
   */
  getRightEyeColor(alpha: number = 1): string {
    const [r, g, b] = this.profileV2.rightEye;
    if (alpha >= 1) return `rgb(${r}, ${g}, ${b})`;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Get background color from calibration profile
   */
  getBackgroundColor(): string {
    const [r, g, b] = this.profileV2.bg;
    return `rgb(${r}, ${g}, ${b})`;
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
