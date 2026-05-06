export interface InputEvent {
  x: number;
  y: number;
  timestamp: number;
  type: 'click' | 'move' | 'drag';
}

export interface TrackingMetrics {
  totalClicks: number;
  correctClicks: number;
  accuracy: number;
  avgReactionTimeMs: number;
  reactionTimes: number[];
  motorSmoothness: number;
  dominantEyeBias: number;
  sessionDurationMs: number;
}

export class InputTracker {
  private events: InputEvent[] = [];
  private targetHits: Array<{ timestamp: number; hit: boolean }> = [];
  private sessionStart: number;
  private lastMoveTimestamp: number = 0;
  private velocities: number[] = [];

  constructor() {
    this.sessionStart = Date.now();
  }

  logClick(x: number, y: number): void {
    this.events.push({ x, y, timestamp: Date.now(), type: 'click' });
  }

  logMove(x: number, y: number): void {
    const now = Date.now();

    if (this.lastMoveTimestamp > 0) {
      const dt = now - this.lastMoveTimestamp;
      if (dt > 0 && this.events.length > 0) {
        const last = this.events[this.events.length - 1];
        const dx = x - last.x;
        const dy = y - last.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const velocity = distance / dt;
        this.velocities.push(velocity);
      }
    }

    this.lastMoveTimestamp = now;
    this.events.push({ x, y, timestamp: now, type: 'move' });
  }

  logHit(timestamp: number): void {
    this.targetHits.push({ timestamp, hit: true });
  }

  logMiss(timestamp: number): void {
    this.targetHits.push({ timestamp, hit: false });
  }

  getReactionTime(targetTimestamp: number): number {
    const clicks = this.events.filter((e) => e.type === 'click');
    if (clicks.length === 0) return 0;

    const lastClick = clicks[clicks.length - 1];
    return Math.max(0, lastClick.timestamp - targetTimestamp);
  }

  getMetrics(): TrackingMetrics {
    const clicks = this.events.filter((e) => e.type === 'click');
    const correctClicks = this.targetHits.filter((h) => h.hit).length;
    const totalClicks = clicks.length;

    const reactionTimes = this.targetHits
      .filter((h) => h.hit)
      .map((h) => {
        const closestClick = clicks.reduce((closest, click) => {
          const diff = Math.abs(click.timestamp - h.timestamp);
          const closestDiff = Math.abs(closest.timestamp - h.timestamp);
          return diff < closestDiff ? click : closest;
        }, clicks[0]);
        return closestClick ? Math.abs(closestClick.timestamp - h.timestamp) : 0;
      })
      .filter((t) => t > 0 && t < 5000);

    const avgReactionTimeMs = reactionTimes.length
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;

    const accuracy = totalClicks > 0 ? (correctClicks / totalClicks) * 100 : 0;

    const motorSmoothness = this.calculateSmoothness();

    const dominantEyeBias = this.calculateEyeBias();

    return {
      totalClicks,
      correctClicks,
      accuracy,
      avgReactionTimeMs: Math.round(avgReactionTimeMs),
      reactionTimes,
      motorSmoothness,
      dominantEyeBias,
      sessionDurationMs: Date.now() - this.sessionStart,
    };
  }

  getEvents(): InputEvent[] {
    return [...this.events];
  }

  reset(): void {
    this.events = [];
    this.targetHits = [];
    this.velocities = [];
    this.sessionStart = Date.now();
    this.lastMoveTimestamp = 0;
  }

  private calculateSmoothness(): number {
    if (this.velocities.length < 2) return 1;

    const mean = this.velocities.reduce((a, b) => a + b, 0) / this.velocities.length;
    const variance =
      this.velocities.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / this.velocities.length;
    const stdDev = Math.sqrt(variance);

    return mean > 0 ? Math.max(0, 1 - stdDev / mean) : 1;
  }

  private calculateEyeBias(): number {
    const moves = this.events.filter((e) => e.type === 'move');
    if (moves.length < 10) return 0;

    const centerX = moves.reduce((sum, e) => sum + e.x, 0) / moves.length;
    const canvasWidth = 800;
    const normalizedBias = (centerX - canvasWidth / 2) / (canvasWidth / 2);

    return Math.max(-1, Math.min(1, normalizedBias));
  }
}
