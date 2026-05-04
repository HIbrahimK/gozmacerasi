// Game Engine - PixiJS-based game framework
export const GAME_ENGINE_VERSION = '0.1.0';

export interface GameConfig {
  width: number;
  height: number;
  backgroundColor?: number;
}

export class BaseGame {
  constructor(protected config: GameConfig) {}
}
