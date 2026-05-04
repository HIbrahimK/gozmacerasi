import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { GameSessionSummary } from './sessions.types';

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
  constructor(private readonly prisma: PrismaService) {}

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
}
