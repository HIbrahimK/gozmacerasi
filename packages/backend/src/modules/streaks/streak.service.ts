import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  lastPlayDate: string | null;
  bonusMultiplier: number;
  daysUntilNextReward: number;
}

type StreakRecord = {
  id: string;
  childId: string;
  currentStreak: number;
  bestStreak: number;
  lastPlayDate: Date | null;
  bonusMultiplier: { toNumber: () => number };
};

@Injectable()
export class StreakService {
  constructor(private readonly prisma: PrismaService) {}

  async getStreak(childId: string): Promise<StreakInfo> {
    let streak = await this.prisma.streak.findUnique({
      where: { childId },
    });

    if (!streak) {
      streak = await this.prisma.streak.create({
        data: { childId, currentStreak: 0, bestStreak: 0, bonusMultiplier: 1.0 },
      });
    }

    const s = streak as unknown as StreakRecord;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPlay = s.lastPlayDate ? new Date(s.lastPlayDate) : null;
    let currentStreak = s.currentStreak;
    let bonusMultiplier = s.bonusMultiplier.toNumber();

    if (lastPlay) {
      lastPlay.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - lastPlay.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        await this.prisma.streak.update({
          where: { childId },
          data: { currentStreak: 0, bonusMultiplier: 1.0 },
        });
        currentStreak = 0;
        bonusMultiplier = 1.0;
      }
    }

    return {
      currentStreak,
      bestStreak: s.bestStreak,
      lastPlayDate: s.lastPlayDate?.toISOString() ?? null,
      bonusMultiplier,
      daysUntilNextReward: currentStreak < 7 ? 7 - currentStreak : 0,
    };
  }

  async recordPlay(childId: string): Promise<StreakInfo> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = await this.prisma.streak.findUnique({
      where: { childId },
    });

    if (!streak) {
      streak = await this.prisma.streak.create({
        data: { childId, currentStreak: 0, bestStreak: 0, bonusMultiplier: 1.0 },
      });
    }

    const s = streak as unknown as StreakRecord;
    let currentStreak = s.currentStreak;
    let bestStreak = s.bestStreak;

    const lastPlay = s.lastPlayDate ? new Date(s.lastPlayDate) : null;

    if (lastPlay) {
      lastPlay.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - lastPlay.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return this.buildResult(s);
      }

      if (diffDays > 1) {
        currentStreak = 1;
      } else {
        currentStreak = s.currentStreak + 1;
      }
    } else {
      currentStreak = 1;
    }

    bestStreak = Math.max(bestStreak, currentStreak);
    const bonusMultiplier = currentStreak >= 4 ? 1.5 : 1.1;

    await this.prisma.streak.update({
      where: { childId },
      data: {
        currentStreak,
        bestStreak,
        bonusMultiplier,
        lastPlayDate: today,
      },
    });

    return {
      currentStreak,
      bestStreak,
      lastPlayDate: today.toISOString(),
      bonusMultiplier,
      daysUntilNextReward: currentStreak < 7 ? 7 - currentStreak : 0,
    };
  }

  private buildResult(s: StreakRecord): StreakInfo {
    return {
      currentStreak: s.currentStreak,
      bestStreak: s.bestStreak,
      lastPlayDate: s.lastPlayDate?.toISOString() ?? null,
      bonusMultiplier: s.bonusMultiplier.toNumber(),
      daysUntilNextReward: s.currentStreak < 7 ? 7 - s.currentStreak : 0,
    };
  }
}
