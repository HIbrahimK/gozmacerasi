import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CalibrationData {
  name: string;
  type: string;
  bg: number[];
  left: number[];
  right: number[];
}

@Injectable()
export class CalibrationService {
  constructor(private readonly prisma: PrismaService) {}

  async getPresets() {
    return this.prisma.calibrationPreset.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUserCalibrations(userId: string) {
    return this.prisma.userCalibration.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      include: { preset: true },
    });
  }

  async getActiveUserCalibration(userId: string) {
    return this.prisma.userCalibration.findFirst({
      where: { userId, isActive: true },
    });
  }

  async saveUserCalibration(userId: string, data: CalibrationData) {
    // If it's the first one, make it active
    const existing = await this.prisma.userCalibration.count({ where: { userId } });
    
    return this.prisma.userCalibration.create({
      data: {
        userId,
        name: data.name,
        type: data.type,
        bg: data.bg,
        left: data.left,
        right: data.right,
        isActive: existing === 0,
      },
    });
  }

  async setActiveUserCalibration(userId: string, id: string) {
    // Unset all others
    await this.prisma.userCalibration.updateMany({
      where: { userId, id: { not: id } },
      data: { isActive: false },
    });

    // Set active
    return this.prisma.userCalibration.update({
      where: { id, userId },
      data: { isActive: true },
    });
  }

  async deleteUserCalibration(userId: string, id: string) {
    const cal = await this.prisma.userCalibration.findUnique({ where: { id } });
    if (!cal || cal.userId !== userId) throw new Error('Not found or unauthorized');

    await this.prisma.userCalibration.delete({ where: { id } });

    // If we deleted the active one, activate another one if exists
    if (cal.isActive) {
      const firstAvailable = await this.prisma.userCalibration.findFirst({ where: { userId } });
      if (firstAvailable) {
        await this.setActiveUserCalibration(userId, firstAvailable.id);
      }
    }
    return { success: true };
  }
}
