import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';

export interface QuestDef {
  questId: string;
  questType: string;
  questName: string;
  xpReward: number;
  target: number;
}

export interface QuestStatus {
  questId: string;
  questType: string;
  questName: string;
  xpReward: number;
  completed: boolean;
  progress: number;
  completedAt: string | null;
}

const QUEST_DEFINITIONS: QuestDef[] = [
  { questId: 'morning_challenge', questType: 'morning_challenge', questName: 'Morning Challenge', xpReward: 10, target: 1 },
  { questId: 'focus_master', questType: 'focus_master', questName: 'Focus Master (Score > 70)', xpReward: 15, target: 1 },
  { questId: 'speed_runner', questType: 'speed_runner', questName: 'Speed Runner (RT < 800ms)', xpReward: 20, target: 1 },
  { questId: 'accuracy_expert', questType: 'accuracy_expert', questName: 'Accuracy Expert (> 80%)', xpReward: 15, target: 1 },
  { questId: 'play_3_games', questType: 'play_games', questName: '3 Farklı Oyun Oyna', xpReward: 20, target: 3 },
  { questId: 'story_unlock', questType: 'story_unlock', questName: 'Hikaye Bölümü Aç', xpReward: 50, target: 1 },
];

@Injectable()
export class QuestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  getAvailableQuests(): QuestDef[] {
    return QUEST_DEFINITIONS;
  }

  async getDailyQuests(childId: string): Promise<QuestStatus[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = await this.prisma.dailyQuest.findMany({
      where: {
        childId,
        completionDate: { gte: today },
      },
    });

    const completedMap = new Map(
      completedToday.map((q: { questId: string; completedAt: Date | null; xpEarned: number }) => [
        q.questId,
        { completedAt: q.completedAt, xpEarned: q.xpEarned },
      ]),
    );

    return QUEST_DEFINITIONS.map((def) => {
      const completed = completedMap.get(def.questId);
      return {
        questId: def.questId,
        questType: def.questType,
        questName: def.questName,
        xpReward: def.xpReward,
        completed: !!completed,
        progress: completed ? 1 : 0,
        completedAt: completed?.completedAt?.toISOString() ?? null,
      };
    });
  }

  async completeQuest(childId: string, questId: string): Promise<{ xpEarned: number }> {
    const def = QUEST_DEFINITIONS.find((q) => q.questId === questId);
    if (!def) throw new Error('Quest not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.dailyQuest.findFirst({
      where: {
        childId,
        questId,
        completionDate: { gte: today },
      },
    });

    if (existing) {
      return { xpEarned: existing.xpEarned };
    }

    const quest = await this.prisma.dailyQuest.create({
      data: {
        childId,
        questId: def.questId,
        questType: def.questType,
        questName: def.questName,
        completionDate: today,
        xpEarned: def.xpReward,
        completedAt: new Date(),
      },
    });

    // ✅ Capture quest_completed event
    this.analyticsService.captureEvent('quest_completed', childId, {
      questId: def.questId,
      questType: def.questType,
      questName: def.questName,
      xpEarned: def.xpReward,
      completedAt: quest.completedAt?.toISOString(),
    });

    return { xpEarned: quest.xpEarned };
  }

  async getTotalXp(childId: string): Promise<number> {
    const result = await this.prisma.dailyQuest.aggregate({
      where: { childId },
      _sum: { xpEarned: true },
    });

    return result._sum.xpEarned ?? 0;
  }
}

