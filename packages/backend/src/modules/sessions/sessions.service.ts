import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { DashboardMetrics, GameSessionSummary, WeeklyTrendPoint } from './sessions.types';

type PrismaGameSessionRecord = {
  id: string;
  childId: string;
  gameId: string;
  duration: number;
  accuracy: { toNumber: () => number } | null;
  reactionTime: number | null;
  startedAt: Date;
};

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  private readonly sessions: GameSessionSummary[] = [
    {
      id: 'session_demo_1',
      childId: 'child_demo_1',
      gameId: 'game_target_1',
      durationMinutes: 12,
      accuracy: 82,
      reactionTimeMs: 740,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'session_demo_2',
      childId: 'child_demo_1',
      gameId: 'game_puzzle_1',
      durationMinutes: 9,
      accuracy: 88,
      reactionTimeMs: 690,
      createdAt: new Date().toISOString(),
    },
  ];

  async list(): Promise<GameSessionSummary[]> {
    try {
      const sessions = await this.prisma.gameSession.findMany({
        orderBy: { startedAt: 'desc' },
      });

      return sessions.map((session: PrismaGameSessionRecord) => ({
        id: session.id,
        childId: session.childId,
        gameId: session.gameId,
        durationMinutes: Math.max(1, Math.ceil(session.duration / 60)),
        accuracy: session.accuracy ? Number(session.accuracy) : 0,
        reactionTimeMs: session.reactionTime ?? 0,
        createdAt: session.startedAt.toISOString(),
      }));
    } catch {
      return this.sessions;
    }
  }

  async create(dto: CreateSessionDto): Promise<GameSessionSummary> {
    try {
      const session = await this.prisma.gameSession.create({
        data: {
          childId: dto.childId,
          gameId: dto.gameId,
          duration: (dto.durationMinutes ?? 10) * 60,
          accuracy: dto.accuracy ? dto.accuracy / 100 : 0.8,
          reactionTime: dto.reactionTimeMs ?? 700,
        },
      });

      // ✅ Capture game_started event
      this.analyticsService.captureEvent('game_started', dto.childId, {
        gameId: dto.gameId,
        gameName: dto.gameName || 'Unknown Game',
        gameType: dto.gameType || 'general',
        difficulty: dto.difficulty || 1,
        contrast: dto.contrast || 100,
        startedAt: session.startedAt?.toISOString(),
      });

      return {
        id: session.id,
        childId: session.childId,
        gameId: session.gameId,
        durationMinutes: Math.max(1, Math.ceil(session.duration / 60)),
        accuracy: session.accuracy ? Number(session.accuracy) : 0,
        reactionTimeMs: session.reactionTime ?? 0,
        createdAt: session.startedAt.toISOString(),
      };
    } catch {
      const session: GameSessionSummary = {
        id: `session_${Date.now()}`,
        childId: dto.childId,
        gameId: dto.gameId,
        durationMinutes: dto.durationMinutes ?? 10,
        accuracy: dto.accuracy ?? 80,
        reactionTimeMs: dto.reactionTimeMs ?? 700,
        createdAt: new Date().toISOString(),
      };

      this.sessions.unshift(session);
      return session;
    }
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const [childrenCount, sessionsCount, gamesCount, sessions] = await Promise.all([
        this.prisma.child.count(),
        this.prisma.gameSession.count(),
        this.prisma.game.count({ where: { isPlayable: true } }),
        this.prisma.gameSession.findMany({
          orderBy: { startedAt: 'desc' },
          take: 200,
        }),
      ]);

      return this.buildMetricsFromRecords({
        totalChildren: childrenCount,
        totalSessions: sessionsCount,
        activeGames: gamesCount,
        sessionRecords: sessions.map((session: PrismaGameSessionRecord) => ({
          createdAt: session.startedAt,
          accuracy: session.accuracy ? Number(session.accuracy) * 100 : 0,
          reactionTimeMs: session.reactionTime ?? 0,
        })),
      });
    } catch {
      return this.buildMetricsFromRecords({
        totalChildren: 1,
        totalSessions: this.sessions.length,
        activeGames: 2,
        sessionRecords: this.sessions.map((session) => ({
          createdAt: new Date(session.createdAt),
          accuracy: session.accuracy,
          reactionTimeMs: session.reactionTimeMs,
        })),
      });
    }
  }

  private buildMetricsFromRecords(input: {
    totalChildren: number;
    totalSessions: number;
    activeGames: number;
    sessionRecords: Array<{ createdAt: Date; accuracy: number; reactionTimeMs: number }>;
  }): DashboardMetrics {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = input.sessionRecords.filter((session) => session.createdAt >= today).length;
    const accuracyValues = input.sessionRecords.map((session) => session.accuracy).filter((value) => value > 0);
    const reactionValues = input.sessionRecords
      .map((session) => session.reactionTimeMs)
      .filter((value) => value > 0);

    const avgAccuracy = accuracyValues.length
      ? Math.round((accuracyValues.reduce((sum, value) => sum + value, 0) / accuracyValues.length) * 100) / 100
      : 0;
    const avgReactionTimeMs = reactionValues.length
      ? Math.round(reactionValues.reduce((sum, value) => sum + value, 0) / reactionValues.length)
      : 0;

    return {
      totalChildren: input.totalChildren,
      totalSessions: input.totalSessions,
      todaySessions,
      activeGames: input.activeGames,
      avgAccuracy,
      avgReactionTimeMs,
      weeklyTrend: this.buildWeeklyTrend(input.sessionRecords),
    };
  }

  private buildWeeklyTrend(
    sessionRecords: Array<{ createdAt: Date; accuracy: number; reactionTimeMs: number }>,
  ): WeeklyTrendPoint[] {
    const weekDays = ['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz'];
    const points: WeeklyTrendPoint[] = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(dayStart.getDate() - offset);

      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const recordsForDay = sessionRecords.filter(
        (session) => session.createdAt >= dayStart && session.createdAt < dayEnd,
      );

      const avgAccuracy = recordsForDay.length
        ? Math.round(
            (recordsForDay.reduce((sum, session) => sum + session.accuracy, 0) / recordsForDay.length) * 100,
          ) / 100
        : 0;

      points.push({
        day: weekDays[dayStart.getDay() === 0 ? 6 : dayStart.getDay() - 1],
        sessions: recordsForDay.length,
        avgAccuracy,
      });
    }

    return points;
  }
}
