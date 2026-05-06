export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  diagnosis: string | null;
  baselineVA: string | null;
  dailyLimit: number;
  totalSessions: number;
  avgAccuracy: number;
  lastSessionDate: string | null;
}

export interface DoctorPatientDetail extends DoctorPatient {
  sessions: DoctorSession[];
  prescriptions: DoctorPrescription[];
}

export interface DoctorSession {
  id: string;
  gameTitle: string;
  durationMinutes: number;
  accuracy: number;
  reactionTimeMs: number;
  createdAt: string;
}

export interface DoctorPrescription {
  id: string;
  childId: string;
  childName: string;
  diagnosis: string;
  targetGoals: Record<string, boolean>;
  recommendedGames: Array<{ gameId: string; reason: string }>;
  difficultyRange: string;
  dailyLimitMinutes: number;
  notes: string | null;
  status: string;
  createdDate: string;
  lastModified: string;
}

export interface CreatePrescriptionDto {
  childId: string;
  diagnosis: string;
  targetGoals: Record<string, boolean>;
  recommendedGames: Array<{ gameId: string; reason: string }>;
  difficultyRange?: string;
  dailyLimitMinutes?: number;
  notes?: string;
}
