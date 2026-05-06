import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ScoreInput {
  gameSessionId: string;
  accuracy: number;
  reactionTimeMs: number;
  reactionTimes: number[];
}

export interface FocusScoreResult {
  focusScore: number;
  accuracy: number;
  reactionTimeEfficiency: number;
  consistency: number;
}

export interface VisionScoreResult {
  visionScore: number;
  weeklyTrend: number;
  difficultyProgression: number;
  balance: number;
}

export interface SessionScoreData {
  focusScore: FocusScoreResult;
  visionScore: VisionScoreResult;
}

@Injectable()
export class ScoringService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateAndStore(input: ScoreInput): Promise<SessionScoreData> {
    const focusScore = this.calculateFocusScore(
      input.accuracy,
      input.reactionTimeMs,
      input.reactionTimes,
    );

    const visionScore = await this.calculateVisionScore(input.gameSessionId);

    await this.prisma.sessionScore.create({
      data: {
        gameSessionId: input.gameSessionId,
        focusScore: focusScore.focusScore,
        visionScore: visionScore.visionScore,
        accuracy: focusScore.accuracy,
        reactionTimeEfficiency: focusScore.reactionTimeEfficiency,
        consistency: focusScore.consistency,
      },
    });

    return { focusScore, visionScore };
  }

  calculateFocusScore(
    accuracy: number,
    avgReactionTimeMs: number,
    reactionTimes: number[],
  ): FocusScoreResult {
    const normalizedAccuracy = Math.min(100, accuracy);
    const reactionTimeEfficiency = Math.min(1, 500 / Math.max(1, avgReactionTimeMs)) * 100;
    const consistency = this.calculateConsistency(reactionTimes);

    const focusScore = Math.round(
      normalizedAccuracy * 0.4 + reactionTimeEfficiency * 0.4 + consistency * 0.2,
    );

    return {
      focusScore: Math.max(0, Math.min(100, focusScore)),
      accuracy: Math.round(normalizedAccuracy),
      reactionTimeEfficiency: Math.round(reactionTimeEfficiency),
      consistency: Math.round(consistency),
    };
  }

  async calculateVisionScore(gameSessionId: string): Promise<VisionScoreResult> {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: gameSessionId },
      include: { child: true },
    });

    if (!session) {
      return { visionScore: 50, weeklyTrend: 100, difficultyProgression: 5, balance: 50 };
    }

    const childId = session.childId;

    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);

    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 14);

    const [thisWeekSessions, lastWeekSessions] = await Promise.all([
      this.prisma.gameSession.findMany({
        where: { childId, startedAt: { gte: thisWeekStart } },
      }),
      this.prisma.gameSession.findMany({
        where: {
          childId,
          startedAt: { gte: lastWeekStart, lt: thisWeekStart },
        },
      }),
    ]);

    const thisWeekAvg = this.averageAccuracy(thisWeekSessions);
    const lastWeekAvg = this.averageAccuracy(lastWeekSessions);

    const weeklyTrend = lastWeekAvg > 0 ? (thisWeekAvg / lastWeekAvg) * 100 : 100;

    const allSessions = await this.prisma.gameSession.findMany({
      where: { childId },
      orderBy: { startedAt: 'asc' },
      take: 20,
    });

    const difficultyProgression = allSessions.length > 1
      ? (allSessions[allSessions.length - 1].difficulty - allSessions[0].difficulty) / allSessions.length
      : 0;

    const balance = 1 - Math.abs(0.5 - thisWeekAvg / 100);

    const visionScore = Math.round(
      Math.min(100, weeklyTrend) * 0.5 +
        Math.min(100, (difficultyProgression + 1) * 10) * 0.3 +
        Math.min(100, balance * 100) * 0.2,
    );

    await this.prisma.weeklyVisionScore.upsert({
      where: {
        childId_weekStart: {
          childId,
          weekStart: thisWeekStart,
        },
      },
      update: {
        averageVisionScore: thisWeekAvg,
        weeklyTrend,
        difficultyProgression,
        balance,
      },
      create: {
        childId,
        weekStart: thisWeekStart,
        averageVisionScore: thisWeekAvg,
        weeklyTrend,
        difficultyProgression,
        balance,
      },
    });

    return {
      visionScore: Math.max(0, Math.min(100, visionScore)),
      weeklyTrend: Math.round(weeklyTrend),
      difficultyProgression: Math.round((difficultyProgression + 1) * 10),
      balance: Math.round(balance * 100),
    };
  }

  async getScoresByChild(childId: string) {
    const sessions = await this.prisma.gameSession.findMany({
      where: { childId },
      include: { sessionScores: true },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });

    return sessions
      .filter((s: { sessionScores: unknown[] }) => s.sessionScores.length > 0)
      .map((s: {
        id: string;
        gameId: string;
        startedAt: Date;
        sessionScores: Array<{
          focusScore: { toNumber: () => number };
          visionScore: { toNumber: () => number };
          accuracy: { toNumber: () => number };
        }>;
      }) => ({
        sessionId: s.id,
        gameId: s.gameId,
        date: s.startedAt.toISOString(),
        focusScore: Number(s.sessionScores[0].focusScore),
        visionScore: Number(s.sessionScores[0].visionScore),
        accuracy: Number(s.sessionScores[0].accuracy),
      }));
  }

  async getWeeklyVisionScores(childId: string) {
    const scores = await this.prisma.weeklyVisionScore.findMany({
      where: { childId },
      orderBy: { weekStart: 'desc' },
      take: 12,
    });

    return scores.map((s: {
      weekStart: Date;
      averageVisionScore: { toNumber: () => number };
      weeklyTrend: { toNumber: () => number } | null;
      difficultyProgression: { toNumber: () => number } | null;
      balance: { toNumber: () => number } | null;
    }) => ({
      weekStart: s.weekStart.toISOString(),
      averageVisionScore: Number(s.averageVisionScore),
      weeklyTrend: s.weeklyTrend ? Number(s.weeklyTrend) : null,
      difficultyProgression: s.difficultyProgression ? Number(s.difficultyProgression) : null,
      balance: s.balance ? Number(s.balance) : null,
    }));
  }

  private calculateConsistency(reactionTimes: number[]): number {
    if (reactionTimes.length < 2) return 50;

    const mean = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    const variance =
      reactionTimes.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / reactionTimes.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = mean > 0 ? stdDev / mean : 1;

    return Math.max(0, Math.min(100, (1 - coefficientOfVariation) * 100));
  }

  private averageAccuracy(
    sessions: Array<{ accuracy: { toNumber: () => number } | null }>,
  ): number {
    const valid = sessions
      .map((s) => (s.accuracy ? s.accuracy.toNumber() * 100 : 0))
      .filter((v) => v > 0);

    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
  }
}
