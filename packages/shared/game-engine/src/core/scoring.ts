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

export class ScoringEngine {
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

  calculateVisionScore(
    currentWeekAvg: number,
    previousWeekAvg: number,
    difficultyProgression: number,
    binocularBalance: number,
  ): VisionScoreResult {
    const weeklyTrend =
      previousWeekAvg > 0 ? (currentWeekAvg / previousWeekAvg) * 100 : 100;

    const visionScore = Math.round(
      Math.min(100, weeklyTrend) * 0.5 +
        Math.min(100, difficultyProgression * 10) * 0.3 +
        Math.min(100, binocularBalance * 100) * 0.2,
    );

    return {
      visionScore: Math.max(0, Math.min(100, visionScore)),
      weeklyTrend: Math.round(weeklyTrend),
      difficultyProgression: Math.round(difficultyProgression * 10),
      balance: Math.round(binocularBalance * 100),
    };
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
}
