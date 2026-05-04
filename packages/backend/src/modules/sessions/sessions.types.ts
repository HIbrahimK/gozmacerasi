export interface GameSessionSummary {
  id: string;
  childId: string;
  gameId: string;
  durationMinutes: number;
  accuracy: number;
  reactionTimeMs: number;
  createdAt: string;
}

export interface WeeklyTrendPoint {
  day: string;
  sessions: number;
  avgAccuracy: number;
}

export interface DashboardMetrics {
  totalChildren: number;
  totalSessions: number;
  todaySessions: number;
  activeGames: number;
  avgAccuracy: number;
  avgReactionTimeMs: number;
  weeklyTrend: WeeklyTrendPoint[];
}
