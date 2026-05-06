import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CalibrationData {
  childId: string;
  glassType: string;
  glassColor: string;
  intensity: number;
  brightness: number;
  contrast: number;
}

export interface CalibrationProfile {
  id: string;
  childId: string;
  glassType: string;
  glassColor: string;
  intensity: number;
  brightness: number;
  contrast: number;
  createdAt: string;
}

@Injectable()
export class CalibrationService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(childId: string): Promise<CalibrationProfile | null> {
    const child = await this.prisma.child.findUnique({
      where: { id: childId },
    });

    if (!child) return null;

    return {
      id: `cal_${childId}`,
      childId,
      glassType: 'normal',
      glassColor: 'red-blue',
      intensity: 70,
      brightness: 100,
      contrast: 100,
      createdAt: child.createdAt.toISOString(),
    };
  }

  async saveProfile(data: CalibrationData): Promise<CalibrationProfile> {
    await this.prisma.child.update({
      where: { id: data.childId },
      data: {
        dailyLimit: { set: 30 },
      },
    });

    return {
      id: `cal_${data.childId}`,
      childId: data.childId,
      glassType: data.glassType,
      glassColor: data.glassColor,
      intensity: data.intensity,
      brightness: data.brightness,
      contrast: data.contrast,
      createdAt: new Date().toISOString(),
    };
  }

  async getPresets() {
    return [
      {
        id: 'preset_red_blue',
        name: 'Kırmızı-Mavi Standart',
        glassColor: 'red-blue',
        intensity: 70,
        brightness: 100,
        contrast: 100,
      },
      {
        id: 'preset_red_green',
        name: 'Kırmızı-Yeşil Standart',
        glassColor: 'red-green',
        intensity: 70,
        brightness: 100,
        contrast: 100,
      },
      {
        id: 'preset_high_contrast',
        name: 'Yüksek Kontrast',
        glassColor: 'red-blue',
        intensity: 90,
        brightness: 110,
        contrast: 120,
      },
      {
        id: 'preset_gentle',
        name: 'Yumuşak',
        glassColor: 'red-blue',
        intensity: 50,
        brightness: 90,
        contrast: 90,
      },
    ];
  }
}
