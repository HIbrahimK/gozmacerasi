export interface CalibrationProfile {
  id: string;
  glassType: 'clip' | 'normal' | 'themed';
  glassColor: 'red-blue' | 'red-green';
  intensity: number;
  brightness: number;
  contrast: number;
}

export const DEFAULT_CALIBRATION: CalibrationProfile = {
  id: 'default',
  glassType: 'normal',
  glassColor: 'red-blue',
  intensity: 70,
  brightness: 100,
  contrast: 100,
};

export class AnaglyphRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private profile: CalibrationProfile;

  constructor(canvas: HTMLCanvasElement, profile: CalibrationProfile = DEFAULT_CALIBRATION) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.profile = profile;
  }

  updateProfile(profile: CalibrationProfile): void {
    this.profile = profile;
  }

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
        const leftG = leftImageData.data[i + 1];
        const leftB = leftImageData.data[i + 2];

        const rightR = rightImageData.data[i];
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
