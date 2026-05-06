import { BaseGame, GameConfig } from '../core/base-game';

export interface MovableEntity {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  type: 'target' | 'obstacle';
}

export class MotionGame extends BaseGame {
  protected entities: MovableEntity[] = [];
  protected nextEntityId: number = 0;
  protected spawnTimer: number = 0;
  protected playerX: number = 0;
  protected playerY: number = 0;
  protected playerSize: number = 40;
  protected gameDuration: number = 60;
  protected elapsed: number = 0;
  protected caught: number = 0;
  protected missed: number = 0;

  constructor(config: GameConfig) {
    super(config);
  }

  getCategory(): string {
    return 'MotionGame';
  }

  getTherapyTarget(): string {
    return 'Pursuit hareketi, takip becerisi';
  }

  getGameState(): Record<string, unknown> {
    return {
      entities: this.entities,
      playerX: this.playerX,
      playerY: this.playerY,
      caught: this.caught,
      missed: this.missed,
      score: this.score,
    };
  }

  init(canvas: HTMLCanvasElement): void {
    super.init(canvas);
    this.playerX = canvas.width / 2;
    this.playerY = canvas.height / 2;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const now = Date.now();
    this.elapsed = (now - this.startTime) / 1000;

    if (this.elapsed >= this.gameDuration) {
      this.stop();
      return;
    }

    this.updateEntities();
    this.checkCollisions();

    if (now - this.spawnTimer > 2000) {
      this.spawnEntity();
      this.spawnTimer = now;
    }

    this.renderBackground(ctx);
    this.renderEntities(ctx);
    this.renderPlayer(ctx);
    this.renderHUD(ctx);
  }

  handleInput(x: number, y: number, type: 'click' | 'move'): void {
    if (type === 'move') {
      this.playerX = x;
      this.playerY = y;
    }
  }

  protected spawnEntity(): void {
    if (!this.canvas) return;

    const canvas = this.canvas;
    const side = Math.floor(Math.random() * 4);
    let x: number, y: number, speedX: number, speedY: number;

    const speed = 1 + Math.random() * 2;

    switch (side) {
      case 0:
        x = 0;
        y = Math.random() * canvas.height;
        speedX = speed;
        speedY = (Math.random() - 0.5) * speed;
        break;
      case 1:
        x = canvas.width;
        y = Math.random() * canvas.height;
        speedX = -speed;
        speedY = (Math.random() - 0.5) * speed;
        break;
      case 2:
        x = Math.random() * canvas.width;
        y = 0;
        speedX = (Math.random() - 0.5) * speed;
        speedY = speed;
        break;
      default:
        x = Math.random() * canvas.width;
        y = canvas.height;
        speedX = (Math.random() - 0.5) * speed;
        speedY = -speed;
        break;
    }

    const isTarget = Math.random() > 0.3;

    this.entities.push({
      id: this.nextEntityId++,
      x,
      y,
      size: isTarget ? 30 : 45,
      color: isTarget ? '#4ECDC4' : '#FF6B6B',
      speedX,
      speedY,
      type: isTarget ? 'target' : 'obstacle',
    });
  }

  protected updateEntities(): void {
    if (!this.canvas) return;

    const canvas = this.canvas;

    this.entities = this.entities.filter((e) => {
      e.x += e.speedX;
      e.y += e.speedY;

      return e.x > -50 && e.x < canvas.width + 50 && e.y > -50 && e.y < canvas.height + 50;
    });
  }

  protected checkCollisions(): void {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const entity = this.entities[i];
      const dx = this.playerX - entity.x;
      const dy = this.playerY - entity.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < (this.playerSize + entity.size) / 2) {
        if (entity.type === 'target') {
          this.caught++;
          this.addScore(15);
          this.inputTracker.logHit(entity.x);
        } else {
          this.missed++;
          this.score = Math.max(0, this.score - 5);
          this.inputTracker.logMiss(entity.x);
        }
        this.entities.splice(i, 1);
      }
    }
  }

  protected renderBackground(ctx: CanvasRenderingContext2D): void {
    const canvas = this.canvas!;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  protected renderEntities(ctx: CanvasRenderingContext2D): void {
    for (const entity of this.entities) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(entity.x, entity.y, entity.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = entity.color;
      ctx.fill();

      if (entity.type === 'target') {
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, entity.size / 2 + 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(78, 205, 196, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.5)';
        ctx.lineWidth = 3;
        const half = entity.size / 3;
        ctx.beginPath();
        ctx.moveTo(entity.x - half, entity.y - half);
        ctx.lineTo(entity.x + half, entity.y + half);
        ctx.moveTo(entity.x + half, entity.y - half);
        ctx.lineTo(entity.x - half, entity.y + half);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  protected renderPlayer(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.playerX, this.playerY, this.playerSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.strokeStyle = '#45B7D1';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  protected renderHUD(ctx: CanvasRenderingContext2D): void {
    const canvas = this.canvas!;
    const remaining = Math.max(0, this.gameDuration - this.elapsed);

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(`Skor: ${this.score}`, 16, 30);

    ctx.textAlign = 'center';
    ctx.fillText(`Yakalanan: ${this.caught}`, canvas.width / 2, 30);

    ctx.textAlign = 'right';
    ctx.fillText(`${Math.ceil(remaining)}s`, canvas.width - 16, 30);
  }
}
