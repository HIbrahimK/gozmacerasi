export interface ParentChild {
  id: string;
  name: string;
  age: number;
  diagnosis: string | null;
  baselineVA: string | null;
  stereopsisLevel: string | null;
  dailyLimit: number;
  createdAt: string;
}

export interface ParentDashboard {
  children: ParentChild[];
  totalSessions: number;
  todaySessions: number;
  weeklyTrend: ParentWeeklyPoint[];
  recentSessions: ParentSessionSummary[];
}

export interface ParentWeeklyPoint {
  day: string;
  sessions: number;
  avgAccuracy: number;
}

export interface ParentSessionSummary {
  id: string;
  childName: string;
  gameTitle: string;
  durationMinutes: number;
  accuracy: number;
  reactionTimeMs: number;
  createdAt: string;
}

export interface ChildProgress {
  child: ParentChild;
  totalSessions: number;
  avgAccuracy: number;
  avgReactionTimeMs: number;
  bestStreak: number;
  currentStreak: number;
  sessions: ParentSessionSummary[];
}
