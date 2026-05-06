import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface StoryChapter {
  chapterId: number;
  title: string;
  description: string;
  unlockCondition: string;
  xpReward: number;
}

export interface StoryDef {
  storyId: string;
  title: string;
  icon: string;
  chapters: StoryChapter[];
}

export interface StoryProgress {
  storyId: string;
  title: string;
  icon: string;
  chapters: ChapterStatus[];
}

export interface ChapterStatus {
  chapterId: number;
  title: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  unlockedDate: string | null;
  completionDate: string | null;
  xpEarned: number;
}

const STORY_DEFINITIONS: StoryDef[] = [
  {
    storyId: 'space_journey',
    title: 'Uzay Yolculuğu',
    icon: '🚀',
    chapters: [
      {
        chapterId: 1,
        title: 'Uzay İstasyonuna Giriş',
        description: 'Uzay istasyonuna hoş geldin! İlk görevini tamamla.',
        unlockCondition: 'day_1',
        xpReward: 20,
      },
      {
        chapterId: 2,
        title: 'Gezegenleri Keşfet',
        description: 'Gizemli gezegenleri keşfet ve hazineleri topla.',
        unlockCondition: 'quests_completed >= 5',
        xpReward: 30,
      },
      {
        chapterId: 3,
        title: 'Yıldız Sistemi Kurtarma',
        description: 'Yıldız sistemini kurtarmak için son görev!',
        unlockCondition: 'focus_score > 70 AND day >= 7',
        xpReward: 50,
      },
    ],
  },
  {
    storyId: 'treasure_hunt',
    title: 'Hazine Arama',
    icon: '🗺️',
    chapters: [
      {
        chapterId: 1,
        title: 'Harita Parçalarını Topla',
        description: 'Hazine haritasının parçalarını bul.',
        unlockCondition: 'day_1',
        xpReward: 20,
      },
      {
        chapterId: 2,
        title: 'Tehlikeli Labirent',
        description: 'Labirentten geç ve ipuçlarını takip et.',
        unlockCondition: 'quests_completed >= 5 AND focus_score > 65',
        xpReward: 30,
      },
      {
        chapterId: 3,
        title: 'Hazineyi Bul',
        description: 'Son hazineyi bul ve macerayı tamamla!',
        unlockCondition: 'weekly_avg > 72',
        xpReward: 50,
      },
    ],
  },
  {
    storyId: 'school_hero',
    title: 'Okul Kahramanı',
    icon: '🏫',
    chapters: [
      {
        chapterId: 1,
        title: 'Yeni Okula Hoş Geldin',
        description: 'Yeni okulunda ilk günün!',
        unlockCondition: 'day_1',
        xpReward: 20,
      },
      {
        chapterId: 2,
        title: 'Sınıf Arkadaşları ile Oyun',
        description: 'Arkadaşlarınla oyun oyna ve onları tanı.',
        unlockCondition: 'quests_completed >= 10',
        xpReward: 30,
      },
      {
        chapterId: 3,
        title: 'Sınıf Lideri Olma',
        description: '7 gün üst üste oynayarak sınıf lideri ol!',
        unlockCondition: 'streak >= 7',
        xpReward: 50,
      },
    ],
  },
];

@Injectable()
export class StoryService {
  constructor(private readonly prisma: PrismaService) {}

  getStoryDefinitions(): StoryDef[] {
    return STORY_DEFINITIONS;
  }

  async getStoryProgress(childId: string): Promise<StoryProgress[]> {
    const progressRecords = await this.prisma.storyProgression.findMany({
      where: { childId },
    });

    const progressMap = new Map(
      progressRecords.map(
        (p: {
          storyId: string;
          chapterId: number;
          unlockedDate: Date | null;
          completionDate: Date | null;
          xpEarned: number;
        }) => [`${p.storyId}_${p.chapterId}`, p],
      ),
    );

    const totalXp = await this.prisma.dailyQuest.aggregate({
      where: { childId },
      _sum: { xpEarned: true },
    });

    const streak = await this.prisma.streak.findUnique({ where: { childId } });

    const child = await this.prisma.child.findUnique({ where: { id: childId } });
    const daysSinceCreation = child
      ? Math.floor((Date.now() - child.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const totalQuests = await this.prisma.dailyQuest.count({ where: { childId } });

    return STORY_DEFINITIONS.map((story) => {
      const chapters: ChapterStatus[] = story.chapters.map((chapter) => {
        const key = `${story.storyId}_${chapter.chapterId}`;
        const existing = progressMap.get(key);
        const unlocked = this.evaluateCondition(
          chapter.unlockCondition,
          daysSinceCreation,
          totalXp._sum.xpEarned ?? 0,
          totalQuests,
          streak?.currentStreak ?? 0,
          75,
        );

        return {
          chapterId: chapter.chapterId,
          title: chapter.title,
          description: chapter.description,
          unlocked: unlocked || !!existing,
          completed: !!existing?.completionDate,
          unlockedDate: existing?.unlockedDate?.toISOString() ?? null,
          completionDate: existing?.completionDate?.toISOString() ?? null,
          xpEarned: existing?.xpEarned ?? 0,
        };
      });

      return {
        storyId: story.storyId,
        title: story.title,
        icon: story.icon,
        chapters,
      };
    });
  }

  async unlockChapter(childId: string, storyId: string, chapterId: number) {
    const existing = await this.prisma.storyProgression.findUnique({
      where: {
        childId_storyId_chapterId: { childId, storyId, chapterId },
      },
    });

    if (existing) return existing;

    return this.prisma.storyProgression.create({
      data: {
        childId,
        storyId,
        chapterId,
        unlockedDate: new Date(),
        xpEarned: 0,
      },
    });
  }

  async completeChapter(childId: string, storyId: string, chapterId: number) {
    const story = STORY_DEFINITIONS.find((s) => s.storyId === storyId);
    const chapter = story?.chapters.find((c) => c.chapterId === chapterId);
    const xpReward = chapter?.xpReward ?? 20;

    return this.prisma.storyProgression.update({
      where: {
        childId_storyId_chapterId: { childId, storyId, chapterId },
      },
      data: {
        completionDate: new Date(),
        xpEarned: xpReward,
      },
    });
  }

  private evaluateCondition(
    condition: string,
    daysSinceCreation: number,
    totalXp: number,
    totalQuests: number,
    currentStreak: number,
    avgFocusScore: number,
  ): boolean {
    if (condition === 'day_1') return true;

    if (condition.includes('quests_completed')) {
      const match = condition.match(/quests_completed\s*>=\s*(\d+)/);
      if (match) return totalQuests >= parseInt(match[1], 10);
    }

    if (condition.includes('focus_score')) {
      const match = condition.match(/focus_score\s*>\s*(\d+)/);
      if (match) return avgFocusScore > parseInt(match[1], 10);
    }

    if (condition.includes('streak')) {
      const match = condition.match(/streak\s*>=\s*(\d+)/);
      if (match) return currentStreak >= parseInt(match[1], 10);
    }

    if (condition.includes('day')) {
      const match = condition.match(/day\s*>=\s*(\d+)/);
      if (match) return daysSinceCreation >= parseInt(match[1], 10);
    }

    if (condition.includes('weekly_avg')) {
      const match = condition.match(/weekly_avg\s*>\s*(\d+)/);
      if (match) return avgFocusScore > parseInt(match[1], 10);
    }

    if (condition.includes(' AND ')) {
      const parts = condition.split(' AND ');
      return parts.every((part) =>
        this.evaluateCondition(part.trim(), daysSinceCreation, totalXp, totalQuests, currentStreak, avgFocusScore),
      );
    }

    return false;
  }
}
