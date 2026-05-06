import { AnaglyphRenderer, CalibrationProfile, DEFAULT_CALIBRATION } from '../core/anaglyph';
import { InputTracker, TrackingMetrics } from '../core/input-tracker';
import { AdaptiveEngine, AdaptiveState, SessionPerformance } from '../core/adaptive';
import { ScoringEngine, FocusScoreResult, VisionScoreResult } from '../core/scoring';

export interface GameConfig {
  width: number;
  height: number;
  backgroundColor?: number;
  childId: string;
  gameId: string;
  calibration?: CalibrationProfile;
}

export interface SessionResult {
  childId: string;
  gameId: string;
  duration: number;
  finalScore: number;
  accuracy: number;
  reactionTimeMs: number;
  focusScore: FocusScoreResult;
  visionScore: VisionScoreResult;
  adaptiveState: AdaptiveState;
  trackingMetrics: TrackingMetrics;
}

export abstract class BaseGame {
  protected config: GameConfig;
  protected canvas: HTMLCanvasElement | null = null;
  protected anaglyph: AnaglyphRenderer | null = null;
  protected inputTracker: InputTracker;
  protected adaptiveEngine: AdaptiveEngine;
  protected scoringEngine: ScoringEngine;
  protected isRunning: boolean = false;
  protected score: number = 0;
  protected startTime: number = 0;
  protected currentDifficulty: number = 1;

  constructor(config: GameConfig) {
    this.config = config;
    this.inputTracker = new InputTracker();
    this.adaptiveEngine = new AdaptiveEngine();
    this.scoringEngine = new ScoringEngine();
    this.currentDifficulty = this.adaptiveEngine.getState().difficulty;
  }

  abstract getCategory(): string;
  abstract getTherapyTarget(): string;
  abstract render(ctx: CanvasRenderingContext2D): void;
  abstract handleInput(x: number, y: number, type: 'click' | 'move'): void;
  abstract getGameState(): Record<string, unknown>;

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.anaglyph = new AnaglyphRenderer(
      canvas,
      this.config.calibration ?? DEFAULT_CALIBRATION,
    );

    canvas.addEventListener('click', this.onClick);
    canvas.addEventListener('mousemove', this.onMove);
  }

  start(): void {
    this.isRunning = true;
    this.startTime = Date.now();
    this.inputTracker.reset();
    this.gameLoop();
  }

  stop(): SessionResult {
    this.isRunning = false;

    if (this.canvas) {
      this.canvas.removeEventListener('click', this.onClick);
      this.canvas.removeEventListener('mousemove', this.onMove);
    }

    const metrics = this.inputTracker.getMetrics();
    const performance: SessionPerformance = {
      accuracy: metrics.accuracy,
      avgReactionTimeMs: metrics.avgReactionTimeMs,
      motorSmoothness: metrics.motorSmoothness,
      dominantEyeBias: metrics.dominantEyeBias,
    };

    const adaptiveState = this.adaptiveEngine.adjust(performance);

    const focusScore = this.scoringEngine.calculateFocusScore(
      metrics.accuracy,
      metrics.avgReactionTimeMs,
      metrics.reactionTimes,
    );

    const visionScore = this.scoringEngine.calculateVisionScore(
      metrics.accuracy,
      0,
      adaptiveState.difficulty,
      1 - Math.abs(metrics.dominantEyeBias),
    );

    return {
      childId: this.config.childId,
      gameId: this.config.gameId,
      duration: Math.round((Date.now() - this.startTime) / 1000),
      finalScore: this.score,
      accuracy: Math.round(metrics.accuracy),
      reactionTimeMs: metrics.avgReactionTimeMs,
      focusScore,
      visionScore,
      adaptiveState,
      trackingMetrics: metrics,
    };
  }

  setCalibration(profile: CalibrationProfile): void {
    this.anaglyph?.updateProfile(profile);
  }

  setDifficulty(difficulty: number): void {
    this.currentDifficulty = difficulty;
    this.adaptiveEngine.setDifficulty(difficulty);
  }

  getScore(): number {
    return this.score;
  }

  protected addScore(points: number): void {
    this.score += points;
  }

  protected gameLoop(): void {
    if (!this.isRunning || !this.canvas) return;

    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.render(ctx);
    }

    requestAnimationFrame(() => this.gameLoop());
  }

  private onClick = (e: MouseEvent): void => {
    if (!this.isRunning) return;
    const rect = this.canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.inputTracker.logClick(x, y);
    this.handleInput(x, y, 'click');
  };

  private onMove = (e: MouseEvent): void => {
    if (!this.isRunning) return;
    const rect = this.canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.inputTracker.logMove(x, y);
    this.handleInput(x, y, 'move');
  };
}
