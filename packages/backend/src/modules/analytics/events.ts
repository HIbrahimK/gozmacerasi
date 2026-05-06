/**
 * PostHog Event Schema
 */

export interface PostHogEvent {
  event: string;
  distinctId: string;
  properties: Record<string, any>;
}

// Event: game_started
export interface GameStartedEvent extends PostHogEvent {
  event: 'game_started';
  properties: {
    gameId: string;
    gameName: string;
    gameType: string;
    childId: string;
    difficulty: number;
    contrast: number;
    timestamp: string;
  };
}

// Event: game_ended
export interface GameEndedEvent extends PostHogEvent {
  event: 'game_ended';
  properties: {
    gameId: string;
    gameName: string;
    childId: string;
    focusScore: number;
    visionScore: number;
    durationSeconds: number;
    accuracy: number;
    reactionTimeMs: number;
    inputMetrics: {
      total_inputs: number;
      correct_inputs: number;
      missed_inputs: number;
    };
    timestamp: string;
  };
}

// Event: quest_completed
export interface QuestCompletedEvent extends PostHogEvent {
  event: 'quest_completed';
  properties: {
    questId: string;
    questType: string;
    questName: string;
    childId: string;
    xpEarned: number;
    completedAt: string;
    timestamp: string;
  };
}

// Event: story_unlocked
export interface StoryUnlockedEvent extends PostHogEvent {
  event: 'story_unlocked';
  properties: {
    storyId: string;
    storyTitle: string;
    chapterId: number;
    chapterTitle: string;
    childId: string;
    xpEarned: number;
    unlockedAt: string;
    timestamp: string;
  };
}

// Event: streak_updated
export interface StreakUpdatedEvent extends PostHogEvent {
  event: 'streak_updated';
  properties: {
    childId: string;
    currentStreak: number;
    bestStreak: number;
    bonusMultiplier: number;
    rewardMilestone?: number; // e.g., 7, 14, 30
    timestamp: string;
  };
}

// Event: input_metrics_recorded
export interface InputMetricsRecordedEvent extends PostHogEvent {
  event: 'input_metrics_recorded';
  properties: {
    gameId: string;
    childId: string;
    totalInputs: number;
    correctInputs: number;
    accuracy: number;
    avgReactionTimeMs: number;
    maxReactionTimeMs: number;
    minReactionTimeMs: number;
    timestamp: string;
  };
}

export type PostHogEventTypes =
  | GameStartedEvent
  | GameEndedEvent
  | QuestCompletedEvent
  | StoryUnlockedEvent
  | StreakUpdatedEvent
  | InputMetricsRecordedEvent;
