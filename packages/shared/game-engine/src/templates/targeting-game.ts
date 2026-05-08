import { BaseGame, GameConfig } from '../core/base-game';
import { DifficultyConfig } from '../core/adaptive';

export interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  /** Which eye should see this target: 'left' | 'right' | 'both' */
  eye: 'left' | 'right' | 'both';
  spawnedAt: number;
  hit: boolean;
  lifetime: number;
}

export class TargetingGame extends BaseGame {
  protected targets: Target[] = [];
  protected nextTargetId: number = 0;
  protected spawnTimer: number = 0;
  protected difficultyConfig: DifficultyConfig;
  protected maxTargets: number;
  protected gameDuration: number = 60;
  protected elapsed: number = 0;

  constructor(config: GameConfig) {
    super(config);
    this.difficultyConfig = this.adaptiveEngine.getDifficultyConfig(this.currentDifficulty);
    this.maxTargets = this.difficultyConfig.targetCount;
  }

  getCategory(): string {
    return 'TargetingGame';
  }

  getTherapyTarget(): string {
    return 'El-göz koordinasyonu, binoküler füzyon';
  }

  getGameState(): Record<string, unknown> {
    return {
      targets: this.targets.filter((t) => !t.hit),
      score: this.score,
      elapsed: this.elapsed,
      remaining: this.gameDuration - this.elapsed,
    };
  }

  render(ctx: CanvasRenderingContext2D): void {
    const now = Date.now();
    this.elapsed = (now - this.startTime) / 1000;

    if (this.elapsed >= this.gameDuration) {
      this.stop();
      return;
    }

    // Remove expired/hit targets
    this.targets = this.targets.filter(
      (t) => !t.hit && now - t.spawnedAt < t.lifetime,
    );

    // Spawn new targets
    if (
      this.targets.length < this.maxTargets &&
      now - this.spawnTimer > this.difficultyConfig.spawnIntervalMs
    ) {
      this.spawnTarget();
      this.spawnTimer = now;
    }

    this.renderBackground(ctx);
    this.renderTargets(ctx);
    this.renderHUD(ctx);
  }

  handleInput(x: number, y: number, type: 'click' | 'move'): void {
    if (type !== 'click') return;

    for (const target of this.targets) {
      if (target.hit) continue;

      const dx = x - target.x;
      const dy = y - target.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= target.size / 2) {
        target.hit = true;
        this.addScore(10);
        this.inputTracker.logHit(target.spawnedAt);
        return;
      }
    }

    this.inputTracker.logMiss(Date.now());
  }

  protected spawnTarget(): void {
    const canvas = this.canvas;
    if (!canvas) return;

    const size = this.difficultyConfig.targetSize;
    const margin = size + 10;

    // Alternate between left and right eye targets for binocular therapy
    const eyeSide: 'left' | 'right' = this.nextTargetId % 2 === 0 ? 'left' : 'right';

    // Get color from anaglyph renderer if available
    let color: string;
    if (this.anaglyph) {
      color = eyeSide === 'left'
        ? this.anaglyph.getLeftEyeColor()
        : this.anaglyph.getRightEyeColor();
    } else {
      color = eyeSide === 'left' ? 'rgb(220, 0, 0)' : 'rgb(0, 0, 220)';
    }

    this.targets.push({
      id: this.nextTargetId++,
      x: margin + Math.random() * (canvas.width - 2 * margin),
      y: margin + 48 + Math.random() * (canvas.height - 2 * margin - 48),
      size,
      color,
      eye: eyeSide,
      spawnedAt: Date.now(),
      hit: false,
      lifetime: this.difficultyConfig.targetLifetimeMs,
    });
  }

  protected renderBackground(ctx: CanvasRenderingContext2D): void {
    const canvas = this.canvas!;

    // Use calibrated background color if anaglyph is available
    if (this.anaglyph) {
      ctx.fillStyle = this.anaglyph.getBackgroundColor();
    } else {
      ctx.fillStyle = '#0a0a1a';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  protected renderTargets(ctx: CanvasRenderingContext2D): void {
    const now = Date.now();

    for (const target of this.targets) {
      if (target.hit) continue;

      const age = now - target.spawnedAt;
      const lifeRatio = 1 - age / target.lifetime;

      if (lifeRatio <= 0) continue;

      const currentSize = target.size * (0.5 + 0.5 * lifeRatio);
      const alpha = lifeRatio;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Glow effect
      const gradient = ctx.createRadialGradient(
        target.x, target.y, currentSize * 0.2,
        target.x, target.y, currentSize,
      );
      gradient.addColorStop(0, target.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(
        target.x - currentSize, target.y - currentSize,
        currentSize * 2, currentSize * 2,
      );

      // Main circle
      ctx.beginPath();
      ctx.arc(target.x, target.y, currentSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = target.color;
      ctx.fill();

      // Inner ring
      ctx.beginPath();
      ctx.arc(target.x, target.y, currentSize / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Eye indicator (small dot)
      ctx.beginPath();
      ctx.arc(target.x, target.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fill();

      ctx.restore();
    }
  }

  protected renderHUD(ctx: CanvasRenderingContext2D): void {
    const canvas = this.canvas!;
    const remaining = Math.max(0, this.gameDuration - this.elapsed);

    // HUD background
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(`Skor: ${this.score}`, 16, 30);

    ctx.textAlign = 'center';
    ctx.fillText(`Süre: ${Math.ceil(remaining)}s`, canvas.width / 2, 30);

    ctx.textAlign = 'right';
    ctx.fillText(`Zorluk: ${this.currentDifficulty}`, canvas.width - 16, 30);

    // Legend
    if (this.anaglyph) {
      const legendY = canvas.height - 16;
      ctx.globalAlpha = 0.5;
      ctx.font = '11px Inter, system-ui';
      ctx.textAlign = 'center';

      ctx.fillStyle = this.anaglyph.getLeftEyeColor();
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 65, legendY - 3, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.textAlign = 'left';
      ctx.fillText('Sol Göz', canvas.width / 2 - 55, legendY);

      ctx.fillStyle = this.anaglyph.getRightEyeColor();
      ctx.beginPath();
      ctx.arc(canvas.width / 2 + 25, legendY - 3, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('Sağ Göz', canvas.width / 2 + 35, legendY);

      ctx.globalAlpha = 1;
    }
  }

  protected getRandomColor(): string {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
