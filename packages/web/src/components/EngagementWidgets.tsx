'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type QuestStatus = {
  questId: string;
  questName: string;
  xpReward: number;
  completed: boolean;
  progress: number;
};

type StreakInfo = {
  currentStreak: number;
  bestStreak: number;
  bonusMultiplier: number;
  daysUntilNextReward: number;
};

type StoryProgress = {
  storyId: string;
  title: string;
  icon: string;
  chapters: Array<{
    chapterId: number;
    title: string;
    unlocked: boolean;
    completed: boolean;
    xpEarned: number;
  }>;
};

export default function EngagementWidgets({ childId }: { childId: string }) {
  const [quests, setQuests] = useState<QuestStatus[]>([]);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [stories, setStories] = useState<StoryProgress[]>([]);

  useEffect(() => {
    if (!childId) return;

    Promise.all([
      apiGet<QuestStatus[]>(`/quests/${childId}`),
      apiGet<StreakInfo>(`/streaks/${childId}`),
      apiGet<StoryProgress[]>(`/stories/${childId}`),
    ])
      .then(([q, s, st]) => {
        setQuests(q);
        setStreak(s);
        setStories(st);
      })
      .catch(() => {});
  }, [childId]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-amber-300">🔥 Streak</h3>
          {streak && (
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-300">{streak.currentStreak} gün</p>
              <p className="text-xs text-slate-400">En iyi: {streak.bestStreak} gün</p>
            </div>
          )}
        </div>
        {streak && (
          <div className="mt-4">
            <div className="flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-3 flex-1 rounded-full ${
                    i < streak.currentStreak ? 'bg-amber-400' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>Bonus: ×{streak.bonusMultiplier}</span>
              {streak.daysUntilNextReward > 0 && (
                <span>{streak.daysUntilNextReward} gün kaldı</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
        <h3 className="text-lg font-semibold text-emerald-300">🎯 Günlük Görevler</h3>
        <div className="mt-4 space-y-3">
          {quests.map((quest) => (
            <div
              key={quest.questId}
              className={`flex items-center justify-between rounded-xl border p-3 ${
                quest.completed
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : 'border-white/10 bg-slate-950/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    quest.completed
                      ? 'bg-emerald-500 text-white'
                      : 'border border-slate-600 bg-slate-900 text-slate-400'
                  }`}
                >
                  {quest.completed ? '✓' : ''}
                </div>
                <span
                  className={`text-sm ${
                    quest.completed ? 'text-emerald-300 line-through' : 'text-white'
                  }`}
                >
                  {quest.questName}
                </span>
              </div>
              <span className="text-xs text-amber-300">+{quest.xpReward} XP</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-6">
        <h3 className="text-lg font-semibold text-purple-300">📖 Hikayeler</h3>
        <div className="mt-4 space-y-4">
          {stories.map((story) => (
            <div key={story.storyId} className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{story.icon}</span>
                <p className="font-medium text-white">{story.title}</p>
              </div>
              <div className="mt-3 space-y-2">
                {story.chapters.map((ch) => (
                  <div key={ch.chapterId} className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                        ch.completed
                          ? 'bg-purple-500 text-white'
                          : ch.unlocked
                          ? 'border border-purple-400 bg-purple-400/20 text-purple-300'
                          : 'border border-slate-600 bg-slate-900 text-slate-500'
                      }`}
                    >
                      {ch.completed ? '✓' : ch.unlocked ? ch.chapterId : '🔒'}
                    </div>
                    <span
                      className={`text-sm ${
                        ch.completed
                          ? 'text-purple-300 line-through'
                          : ch.unlocked
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {ch.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
