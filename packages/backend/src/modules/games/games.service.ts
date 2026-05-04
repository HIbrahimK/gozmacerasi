import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { GameCatalogItem } from './games.types';

type PrismaGameRecord = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  therapyTarget: string | null;
  minAge: number;
  maxAge: number;
  isPlayable: boolean;
  createdAt: Date;
};

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly games: GameCatalogItem[] = [
    {
      id: 'game_target_1',
      title: 'Yıldız Toplama',
      category: 'TargetingGame',
      description: 'Görsel hedef takibi ve hassasiyet çalışması.',
      therapyTarget: 'Hedef takibi',
      minAge: 4,
      maxAge: 12,
      isPlayable: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'game_puzzle_1',
      title: 'Resim Tamamlama',
      category: 'PuzzleGame',
      description: 'Parça birleştirme ile görsel algı güçlendirme.',
      therapyTarget: 'Görsel bütünleme',
      minAge: 5,
      maxAge: 13,
      isPlayable: true,
      createdAt: new Date().toISOString(),
    },
  ];

  async list(): Promise<GameCatalogItem[]> {
    try {
      const games = await this.prisma.game.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return games.map((game: PrismaGameRecord) => ({
        id: game.id,
        title: game.title,
        category: game.category,
        description: game.description ?? undefined,
        therapyTarget: game.therapyTarget ?? undefined,
        minAge: game.minAge,
        maxAge: game.maxAge,
        isPlayable: game.isPlayable,
        createdAt: game.createdAt.toISOString(),
      }));
    } catch {
      return this.games;
    }
  }

  async create(dto: CreateGameDto): Promise<GameCatalogItem> {
    try {
      const game = await this.prisma.game.create({
        data: {
          title: dto.title,
          category: dto.category,
          description: dto.description,
          therapyTarget: dto.therapyTarget,
          minAge: dto.minAge ?? 3,
          maxAge: dto.maxAge ?? 14,
          isPlayable: dto.isPlayable ?? false,
        },
      });

      return {
        id: game.id,
        title: game.title,
        category: game.category,
        description: game.description ?? undefined,
        therapyTarget: game.therapyTarget ?? undefined,
        minAge: game.minAge,
        maxAge: game.maxAge,
        isPlayable: game.isPlayable,
        createdAt: game.createdAt.toISOString(),
      };
    } catch {
      const game: GameCatalogItem = {
        id: `game_${Date.now()}`,
        title: dto.title,
        category: dto.category,
        description: dto.description,
        therapyTarget: dto.therapyTarget,
        minAge: dto.minAge ?? 3,
        maxAge: dto.maxAge ?? 14,
        isPlayable: dto.isPlayable ?? false,
        createdAt: new Date().toISOString(),
      };

      this.games.unshift(game);
      return game;
    }
  }
}
