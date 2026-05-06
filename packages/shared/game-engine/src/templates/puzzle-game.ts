import { BaseGame, GameConfig } from '../core/base-game';

export interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  targetX: number;
  targetY: number;
  placed: boolean;
  dragging: boolean;
}

export class PuzzleGame extends BaseGame {
  protected pieces: PuzzlePiece[] = [];
  protected selectedPiece: PuzzlePiece | null = null;
  protected completedPieces: number = 0;
  protected totalPieces: number = 6;
  protected gameDuration: number = 120;
  protected elapsed: number = 0;
  protected gridSize: number = 3;

  constructor(config: GameConfig) {
    super(config);
  }

  getCategory(): string {
    return 'PuzzleGame';
  }

  getTherapyTarget(): string {
    return 'Görsel-uzamsal işleme, problem çözme';
  }

  getGameState(): Record<string, unknown> {
    return {
      pieces: this.pieces,
      completedPieces: this.completedPieces,
      totalPieces: this.totalPieces,
      score: this.score,
    };
  }

  init(canvas: HTMLCanvasElement): void {
    super.init(canvas);
    this.generatePuzzle();
  }

  render(ctx: CanvasRenderingContext2D): void {
    const now = Date.now();
    this.elapsed = (now - this.startTime) / 1000;

    if (this.elapsed >= this.gameDuration || this.completedPieces >= this.totalPieces) {
      this.stop();
      return;
    }

    this.renderBackground(ctx);
    this.renderTargetZones(ctx);
    this.renderPieces(ctx);
    this.renderHUD(ctx);
  }

  handleInput(x: number, y: number, type: 'click' | 'move'): void {
    if (type === 'click') {
      for (const piece of this.pieces) {
        if (piece.placed) continue;

        if (
          x >= piece.x &&
          x <= piece.x + piece.width &&
          y >= piece.y &&
          y <= piece.y + piece.height
        ) {
          this.selectedPiece = piece;
          piece.dragging = true;
          return;
        }
      }

      if (this.selectedPiece) {
        this.tryPlacePiece(this.selectedPiece);
        this.selectedPiece.dragging = false;
        this.selectedPiece = null;
      }
    }

    if (type === 'move' && this.selectedPiece) {
      this.selectedPiece.x = x - this.selectedPiece.width / 2;
      this.selectedPiece.y = y - this.selectedPiece.height / 2;
    }
  }

  protected generatePuzzle(): void {
    if (!this.canvas) return;

    const canvas = this.canvas;
    const pieceWidth = Math.floor((canvas.width * 0.4) / this.gridSize);
    const pieceHeight = Math.floor((canvas.height * 0.6) / this.gridSize);
    const offsetX = canvas.width * 0.55;
    const offsetY = canvas.height * 0.2;

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#82E0AA'];

    this.pieces = [];
    let id = 0;

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const piece: PuzzlePiece = {
          id: id++,
          x: 20 + Math.random() * (canvas.width * 0.35),
          y: 60 + Math.random() * (canvas.height - 120),
          width: pieceWidth - 4,
          height: pieceHeight - 4,
          color: colors[id % colors.length],
          targetX: offsetX + col * pieceWidth,
          targetY: offsetY + row * pieceHeight,
          placed: false,
          dragging: false,
        };
        this.pieces.push(piece);
      }
    }

    this.totalPieces = this.pieces.length;
  }

  protected tryPlacePiece(piece: PuzzlePiece): void {
    const threshold = 30;
    const dx = Math.abs(piece.x - piece.targetX);
    const dy = Math.abs(piece.y - piece.targetY);

    if (dx < threshold && dy < threshold) {
      piece.x = piece.targetX;
      piece.y = piece.targetY;
      piece.placed = true;
      this.completedPieces++;
      this.addScore(20);
      this.inputTracker.logHit(Date.now());
    } else {
      this.inputTracker.logMiss(Date.now());
    }
  }

  protected renderBackground(ctx: CanvasRenderingContext2D): void {
    const canvas = this.canvas!;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  protected renderTargetZones(ctx: CanvasRenderingContext2D): void {
    for (const piece of this.pieces) {
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(piece.targetX, piece.targetY, piece.width, piece.height);
      ctx.setLineDash([]);
    }
  }

  protected renderPieces(ctx: CanvasRenderingContext2D): void {
    for (const piece of this.pieces) {
      ctx.save();

      if (piece.dragging) {
        ctx.shadowColor = 'rgba(255,255,255,0.3)';
        ctx.shadowBlur = 15;
      }

      ctx.fillStyle = piece.placed ? 'rgba(255,255,255,0.1)' : piece.color;
      ctx.fillRect(piece.x, piece.y, piece.width, piece.height);

      if (!piece.placed) {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
      }

      ctx.restore();
    }
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
    ctx.fillText(`${this.completedPieces}/${this.totalPieces} parça`, canvas.width / 2, 30);

    ctx.textAlign = 'right';
    ctx.fillText(`${Math.ceil(remaining)}s`, canvas.width - 16, 30);
  }
}
