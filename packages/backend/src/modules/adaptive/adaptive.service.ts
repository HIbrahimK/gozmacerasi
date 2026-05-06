import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AdaptiveResult {
  difficultyBefore: number;
  difficultyAfter: number;
  accuracyScore: number;
  reactionTimeMs: number;
  motorSmoothness: number | null;
  dominantEyeBias: number | null;
  ruleApplied: string;
}

@Injectable()
export class AdaptiveService {
  constructor(private readonly prisma: PrismaService) {}

  async adjustDifficulty(
    gameSessionId: string,
    accuracy: number,
    reactionTimeMs: number,
    motorSmoothness?: number,
    dominantEyeBias?: number,
  ): Promise<AdaptiveResult> {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: gameSessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    const difficultyBefore = session.difficulty;
    let difficultyAfter = difficultyBefore;
    let ruleApplied = 'no_change';

    if (accuracy < 60) {
      difficultyAfter = Math.max(1, difficultyBefore - 1);
      ruleApplied = 'accuracy_low_decrease';
    } else if (accuracy > 85) {
      difficultyAfter = Math.min(10, difficultyBefore + 1);
      ruleApplied = 'accuracy_high_increase';
    }

    if (reactionTimeMs > 2000 && accuracy > 70) {
      ruleApplied = ruleApplied === 'no_change' ? 'slow_but_accurate' : ruleApplied + '+slow_adjust';
    }

    if (dominantEyeBias !== undefined && Math.abs(dominantEyeBias) > 0.3) {
      ruleApplied = ruleApplied === 'no_change' ? 'eye_bias_detected' : ruleApplied + '+eye_bias';
    }

    await this.prisma.gameSession.update({
      where: { id: gameSessionId },
      data: { difficulty: difficultyAfter },
    });

    const adaptiveSession = await this.prisma.adaptiveSession.create({
      data: {
        gameSessionId,
        difficultyBefore,
        difficultyAfter,
        accuracyScore: accuracy,
        reactionTimeMs,
        motorSmoothness: motorSmoothness ?? null,
        dominantEyeBias: dominantEyeBias ?? null,
        adaptiveRuleApplied: ruleApplied,
      },
    });

    return {
      difficultyBefore: adaptiveSession.difficultyBefore,
      difficultyAfter: adaptiveSession.difficultyAfter,
      accuracyScore: Number(adaptiveSession.accuracyScore),
      reactionTimeMs: adaptiveSession.reactionTimeMs,
      motorSmoothness: adaptiveSession.motorSmoothness
        ? Number(adaptiveSession.motorSmoothness)
        : null,
      dominantEyeBias: adaptiveSession.dominantEyeBias
        ? Number(adaptiveSession.dominantEyeBias)
        : null,
      ruleApplied: adaptiveSession.adaptiveRuleApplied ?? 'unknown',
    };
  }

  async getAdaptiveHistory(childId: string, gameId?: string) {
    const where: Record<string, unknown> = {
      gameSession: { childId },
    };

    if (gameId) {
      (where.gameSession as Record<string, unknown>).gameId = gameId;
    }

    const sessions = await this.prisma.adaptiveSession.findMany({
      where,
      include: { gameSession: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return sessions.map(
      (s: {
        id: string;
        gameSession: { gameId: string; childId: string };
        difficultyBefore: number;
        difficultyAfter: number;
        accuracyScore: { toNumber: () => number };
        reactionTimeMs: number;
        adaptiveRuleApplied: string | null;
        createdAt: Date;
      }) => ({
        id: s.id,
        gameId: s.gameSession.gameId,
        difficultyBefore: s.difficultyBefore,
        difficultyAfter: s.difficultyAfter,
        accuracyScore: Number(s.accuracyScore),
        reactionTimeMs: s.reactionTimeMs,
        ruleApplied: s.adaptiveRuleApplied ?? 'unknown',
        createdAt: s.createdAt.toISOString(),
      }),
    );
  }

  async getLastDifficulty(childId: string, gameId: string): Promise<number> {
    const lastSession = await this.prisma.gameSession.findFirst({
      where: { childId, gameId },
      orderBy: { startedAt: 'desc' },
    });

    return lastSession?.difficulty ?? 1;
  }
}
