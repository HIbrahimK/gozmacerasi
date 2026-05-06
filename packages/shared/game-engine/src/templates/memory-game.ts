import { BaseGame, GameConfig } from '../core/base-game';

export interface MemoryCard {
  id: number;
  pairId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

export class MemoryGame extends BaseGame {
  protected cards: MemoryCard[] = [];
  protected firstCard: MemoryCard | null = null;
  protected secondCard: MemoryCard | null = null;
  protected matchedPairs: number = 0;
  protected totalPairs: number = 6;
  protected isProcessing: boolean = false;
  protected gameDuration: number = 120;
  protected elapsed: number = 0;
  protected moves: number = 0;

  constructor(config: GameConfig) {
    super(config);
  }

  getCategory(): string {
    return 'MemoryGame';
  }

  getTherapyTarget(): string {
    return 'Görsel hafıza, dikkat';
  }

  getGameState(): Record<string, unknown> {
    return {
      cards: this.cards,
      matchedPairs: this.matchedPairs,
      totalPairs: this.totalPairs,
      moves: this.moves,
      score: this.score,
    };
  }

  init(canvas: HTMLCanvasElement): void {
    super.init(canvas);
    this.generateCards();
  }

  render(ctx: CanvasRenderingContext2D): void {
    const now = Date.now();
    this.elapsed = (now - this.startTime) / 1000;

    if (this.elapsed >= this.gameDuration || this.matchedPairs >= this.totalPairs) {
      this.stop();
      return;
    }

    this.renderBackground(ctx);
    this.renderCards(ctx);
    this.renderHUD(ctx);
  }

  handleInput(x: number, y: number, type: 'click' | 'move'): void {
    if (type !== 'click' || this.isProcessing) return;

    for (const card of this.cards) {
      if (card.matched || card.flipped) continue;

      if (
        x >= card.x &&
        x <= card.x + card.width &&
        y >= card.y &&
        y <= card.y + card.height
      ) {
        this.flipCard(card);
        return;
      }
    }
  }

  protected generateCards(): void {
    if (!this.canvas) return;

    const canvas = this.canvas;
    const cols = 4;
    const rows = 3;
    const cardWidth = 80;
    const cardHeight = 100;
    const gap = 15;
    const startX = (canvas.width - cols * (cardWidth + gap)) / 2;
    const startY = 70;

    const symbols = ['★', '♦', '●', '▲', '■', '♥'];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

    const pairs: Array<{ symbol: string; color: string }> = [];
    for (let i = 0; i < this.totalPairs; i++) {
      pairs.push({ symbol: symbols[i % symbols.length], color: colors[i % colors.length] });
      pairs.push({ symbol: symbols[i % symbols.length], color: colors[i % colors.length] });
    }

    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    this.cards = pairs.map((pair, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      return {
        id: index,
        pairId: Math.floor(index / 2),
        x: startX + col * (cardWidth + gap),
        y: startY + row * (cardHeight + gap),
        width: cardWidth,
        height: cardHeight,
        color: pair.color,
        symbol: pair.symbol,
        flipped: false,
        matched: false,
      };
    });
  }

  protected flipCard(card: MemoryCard): void {
    card.flipped = true;
    this.inputTracker.logClick(card.x + card.width / 2, card.y + card.height / 2);

    if (!this.firstCard) {
      this.firstCard = card;
      return;
    }

    this.secondCard = card;
    this.moves++;
    this.isProcessing = true;

    if (this.firstCard.pairId === this.secondCard.pairId) {
      this.firstCard.matched = true;
      this.secondCard.matched = true;
      this.matchedPairs++;
      this.addScore(30);
      this.inputTracker.logHit(Date.now());
      this.resetSelection();
    } else {
      this.inputTracker.logMiss(Date.now());
      setTimeout(() => {
        if (this.firstCard) this.firstCard.flipped = false;
        if (this.secondCard) this.secondCard.flipped = false;
        this.resetSelection();
      }, 1000);
    }
  }

  protected resetSelection(): void {
    this.firstCard = null;
    this.secondCard = null;
    this.isProcessing = false;
  }

  protected renderBackground(ctx: CanvasRenderingContext2D): void {
    const canvas = this.canvas!;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  protected renderCards(ctx: CanvasRenderingContext2D): void {
    for (const card of this.cards) {
      ctx.save();

      if (card.matched) {
        ctx.globalAlpha = 0.3;
      }

      if (card.flipped || card.matched) {
        ctx.fillStyle = card.color;
        ctx.fillRect(card.x, card.y, card.width, card.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(card.symbol, card.x + card.width / 2, card.y + card.height / 2);
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(card.x, card.y, card.width, card.height);

        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(card.x, card.y, card.width, card.height);

        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.font = 'bold 24px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', card.x + card.width / 2, card.y + card.height / 2);
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
    ctx.fillText(`${this.matchedPairs}/${this.totalPairs} eşleşme`, canvas.width / 2, 30);

    ctx.textAlign = 'right';
    ctx.fillText(`Hamle: ${this.moves} | ${Math.ceil(remaining)}s`, canvas.width - 16, 30);
  }
}
