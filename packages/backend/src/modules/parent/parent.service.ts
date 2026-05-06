import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChildByParentDto } from './dto/create-child.dto';
import {
  ChildProgress,
  ParentChild,
  ParentDashboard,
  ParentSessionSummary,
  ParentWeeklyPoint,
} from './parent.types';

@Injectable()
export class ParentService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(parentId: string): Promise<ParentDashboard> {
    const children = await this.prisma.child.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
    });

    const childIds = children.map((c: { id: string }) => c.id);

    const [totalSessions, sessions] = await Promise.all([
      this.prisma.gameSession.count({
        where: { childId: { in: childIds } },
      }),
      this.prisma.gameSession.findMany({
        where: { childId: { in: childIds } },
        include: { game: true },
        orderBy: { startedAt: 'desc' },
        take: 50,
      }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = sessions.filter(
      (s: { startedAt: Date }) => s.startedAt >= today,
    ).length;

    const childNameMap = new Map(children.map((c: { id: string; name: string }) => [c.id, c.name]));

    const recentSessions: ParentSessionSummary[] = sessions.slice(0, 10).map(
      (s: {
        id: string;
        childId: string;
        game: { title: string };
        duration: number;
        accuracy: { toNumber: () => number } | null;
        reactionTime: number | null;
        startedAt: Date;
      }) => ({
        id: s.id,
        childName: childNameMap.get(s.childId) ?? 'Unknown',
        gameTitle: s.game.title,
        durationMinutes: Math.max(1, Math.ceil(s.duration / 60)),
        accuracy: s.accuracy ? Math.round(s.accuracy.toNumber() * 100) : 0,
        reactionTimeMs: s.reactionTime ?? 0,
        createdAt: s.startedAt.toISOString(),
      }),
    );

    return {
      children: children.map(this.mapChild),
      totalSessions,
      todaySessions,
      weeklyTrend: this.buildWeeklyTrend(sessions),
      recentSessions,
    };
  }

  async listChildren(parentId: string): Promise<ParentChild[]> {
    const children = await this.prisma.child.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
    });

    return children.map(this.mapChild);
  }

  async createChild(parentId: string, dto: CreateChildByParentDto): Promise<ParentChild> {
    const child = await this.prisma.child.create({
      data: {
        parentId,
        name: dto.name,
        age: dto.age,
        diagnosis: dto.diagnosis,
        baselineVA: dto.baselineVA,
        stereopsisLevel: dto.stereopsisLevel,
        dailyLimit: dto.dailyLimit ?? 30,
      },
    });

    return this.mapChild(child);
  }

  async getChildProgress(parentId: string, childId: string): Promise<ChildProgress> {
    const child = await this.prisma.child.findFirst({
      where: { id: childId, parentId },
    });

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    const [sessions, streak] = await Promise.all([
      this.prisma.gameSession.findMany({
        where: { childId },
        include: { game: true },
        orderBy: { startedAt: 'desc' },
        take: 50,
      }),
      this.prisma.streak.findUnique({ where: { childId } }),
    ]);

    const accuracyValues = sessions
      .map((s: { accuracy: { toNumber: () => number } | null }) =>
        s.accuracy ? s.accuracy.toNumber() * 100 : 0,
      )
      .filter((v: number) => v > 0);

    const reactionValues = sessions
      .map((s: { reactionTime: number | null }) => s.reactionTime ?? 0)
      .filter((v: number) => v > 0);

    const avgAccuracy = accuracyValues.length
      ? Math.round(accuracyValues.reduce((a: number, b: number) => a + b, 0) / accuracyValues.length)
      : 0;

    const avgReactionTimeMs = reactionValues.length
      ? Math.round(reactionValues.reduce((a: number, b: number) => a + b, 0) / reactionValues.length)
      : 0;

    return {
      child: this.mapChild(child),
      totalSessions: sessions.length,
      avgAccuracy,
      avgReactionTimeMs,
      bestStreak: streak?.bestStreak ?? 0,
      currentStreak: streak?.currentStreak ?? 0,
      sessions: sessions.map(
        (s: {
          id: string;
          game: { title: string };
          duration: number;
          accuracy: { toNumber: () => number } | null;
          reactionTime: number | null;
          startedAt: Date;
        }) => ({
          id: s.id,
          childName: child.name,
          gameTitle: s.game.title,
          durationMinutes: Math.max(1, Math.ceil(s.duration / 60)),
          accuracy: s.accuracy ? Math.round(s.accuracy.toNumber() * 100) : 0,
          reactionTimeMs: s.reactionTime ?? 0,
          createdAt: s.startedAt.toISOString(),
        }),
      ),
    };
  }

  private mapChild(child: {
    id: string;
    name: string;
    age: number;
    diagnosis: string | null;
    baselineVA: string | null;
    stereopsisLevel: string | null;
    dailyLimit: number;
    createdAt: Date;
  }): ParentChild {
    return {
      id: child.id,
      name: child.name,
      age: child.age,
      diagnosis: child.diagnosis,
      baselineVA: child.baselineVA,
      stereopsisLevel: child.stereopsisLevel,
      dailyLimit: child.dailyLimit,
      createdAt: child.createdAt.toISOString(),
    };
  }

  private buildWeeklyTrend(
    sessions: Array<{ startedAt: Date; accuracy: { toNumber: () => number } | null }>,
  ): ParentWeeklyPoint[] {
    const weekDays = ['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz'];
    const points: ParentWeeklyPoint[] = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(dayStart.getDate() - offset);

      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const daySessions = sessions.filter(
        (s) => s.startedAt >= dayStart && s.startedAt < dayEnd,
      );

      const accuracyValues = daySessions
        .map((s) => (s.accuracy ? s.accuracy.toNumber() * 100 : 0))
        .filter((v) => v > 0);

      points.push({
        day: weekDays[dayStart.getDay() === 0 ? 6 : dayStart.getDay() - 1],
        sessions: daySessions.length,
        avgAccuracy: accuracyValues.length
          ? Math.round(
              accuracyValues.reduce((a, b) => a + b, 0) / accuracyValues.length,
            )
          : 0,
      });
    }

    return points;
  }
}
