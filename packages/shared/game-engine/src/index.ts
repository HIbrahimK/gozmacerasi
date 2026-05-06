export const GAME_ENGINE_VERSION = '0.3.0';

export { BaseGame } from './core/base-game';
export type { GameConfig, SessionResult } from './core/base-game';

export { AnaglyphRenderer, DEFAULT_CALIBRATION } from './core/anaglyph';
export type { CalibrationProfile } from './core/anaglyph';

export { InputTracker } from './core/input-tracker';
export type { InputEvent, TrackingMetrics } from './core/input-tracker';

export { AdaptiveEngine } from './core/adaptive';
export type { AdaptiveState, SessionPerformance, DifficultyConfig } from './core/adaptive';

export { ScoringEngine } from './core/scoring';
export type { FocusScoreResult, VisionScoreResult } from './core/scoring';

export { TargetingGame } from './templates/targeting-game';
export type { Target } from './templates/targeting-game';

export { PuzzleGame } from './templates/puzzle-game';
export type { PuzzlePiece } from './templates/puzzle-game';

export { MotionGame } from './templates/motion-game';
export type { MovableEntity } from './templates/motion-game';

export { MemoryGame } from './templates/memory-game';
export type { MemoryCard } from './templates/memory-game';
