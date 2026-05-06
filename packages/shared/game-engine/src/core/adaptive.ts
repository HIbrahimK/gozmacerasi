export interface AdaptiveState {
  difficulty: number;
  contrast: number;
  speedFactor: number;
}

export interface SessionPerformance {
  accuracy: number;
  avgReactionTimeMs: number;
  motorSmoothness: number;
  dominantEyeBias: number;
}

export class AdaptiveEngine {
  private state: AdaptiveState;
  private minDifficulty: number;
  private maxDifficulty: number;

  constructor(minDifficulty = 1, maxDifficulty = 10) {
    this.state = {
      difficulty: 1,
      contrast: 1.0,
      speedFactor: 1.0,
    };
    this.minDifficulty = minDifficulty;
    this.maxDifficulty = maxDifficulty;
  }

  getState(): AdaptiveState {
    return { ...this.state };
  }

  adjust(performance: SessionPerformance): AdaptiveState {
    const { accuracy, avgReactionTimeMs, motorSmoothness, dominantEyeBias } = performance;

    if (accuracy < 60) {
      this.state.difficulty = Math.max(this.minDifficulty, this.state.difficulty - 1);
      this.state.contrast = Math.min(1.5, this.state.contrast + 0.1);
    } else if (accuracy > 85) {
      this.state.difficulty = Math.min(this.maxDifficulty, this.state.difficulty + 1);
    }

    if (avgReactionTimeMs > 2000 && accuracy > 70) {
      this.state.speedFactor = Math.min(2.0, this.state.speedFactor + 0.1);
    } else if (avgReactionTimeMs < 500) {
      this.state.speedFactor = Math.max(0.5, this.state.speedFactor - 0.05);
    }

    if (Math.abs(dominantEyeBias) > 0.3) {
      this.state.contrast = Math.min(1.5, this.state.contrast + 0.05);
    }

    if (motorSmoothness < 0.5) {
      this.state.speedFactor = Math.max(0.5, this.state.speedFactor - 0.1);
    }

    return this.getState();
  }

  setDifficulty(difficulty: number): void {
    this.state.difficulty = Math.max(this.minDifficulty, Math.min(this.maxDifficulty, difficulty));
  }

  reset(): void {
    this.state = {
      difficulty: 1,
      contrast: 1.0,
      speedFactor: 1.0,
    };
  }

  getDifficultyConfig(difficulty: number): DifficultyConfig {
    const configs: DifficultyConfig[] = [
      { targetCount: 3, targetSize: 120, spawnIntervalMs: 3000, targetLifetimeMs: 5000, speed: 0.5 },
      { targetCount: 4, targetSize: 100, spawnIntervalMs: 2500, targetLifetimeMs: 4500, speed: 0.6 },
      { targetCount: 5, targetSize: 90, spawnIntervalMs: 2000, targetLifetimeMs: 4000, speed: 0.7 },
      { targetCount: 6, targetSize: 80, spawnIntervalMs: 1800, targetLifetimeMs: 3500, speed: 0.8 },
      { targetCount: 7, targetSize: 70, spawnIntervalMs: 1500, targetLifetimeMs: 3000, speed: 0.9 },
      { targetCount: 8, targetSize: 65, spawnIntervalMs: 1300, targetLifetimeMs: 2800, speed: 1.0 },
      { targetCount: 9, targetSize: 60, spawnIntervalMs: 1100, targetLifetimeMs: 2500, speed: 1.1 },
      { targetCount: 10, targetSize: 55, spawnIntervalMs: 1000, targetLifetimeMs: 2200, speed: 1.2 },
      { targetCount: 12, targetSize: 50, spawnIntervalMs: 900, targetLifetimeMs: 2000, speed: 1.3 },
      { targetCount: 15, targetSize: 45, spawnIntervalMs: 800, targetLifetimeMs: 1800, speed: 1.5 },
    ];

    const index = Math.max(0, Math.min(configs.length - 1, difficulty - 1));
    return configs[index];
  }
}

export interface DifficultyConfig {
  targetCount: number;
  targetSize: number;
  spawnIntervalMs: number;
  targetLifetimeMs: number;
  speed: number;
}
