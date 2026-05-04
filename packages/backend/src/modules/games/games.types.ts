export interface GameCatalogItem {
  id: string;
  title: string;
  category: 'TargetingGame' | 'PuzzleGame' | 'MotionGame' | 'MemoryGame' | string;
  description?: string;
  therapyTarget?: string;
  minAge: number;
  maxAge: number;
  isPlayable: boolean;
  createdAt: string;
}
