// Shared Utilities
export const UTILS_VERSION = '0.1.0';

// Scoring utilities
export function calculateFocusScore(accuracy: number, reactionTime: number): number {
  const accuracyWeight = 0.6;
  const speedWeight = 0.4;
  return Math.round((accuracy * accuracyWeight + (100 - Math.min(reactionTime / 100, 100)) * speedWeight) * 100) / 100;
}

export function calculateVisionScore(centerAccuracy: number, peripheralAccuracy: number): number {
  return Math.round(((centerAccuracy * 0.6 + peripheralAccuracy * 0.4) * 100)) / 100;
}

// Date utilities
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

export function getWeekEnd(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 6;
  return new Date(d.setDate(diff));
}
