export interface GameSessionSummary {
  id: string;
  childId: string;
  gameId: string;
  durationMinutes: number;
  accuracy: number;
  reactionTimeMs: number;
  createdAt: string;
}
