export interface Cycle {
  id: number;
  startedAt: string;
  endedAt: string | null;
  isActive: boolean;
}

export interface Session {
  id: number;
  cycleId: number;
  dayNumber: number;
  sessionDate: string;
  letters: string[];
  gHit: boolean;
  createdAt: string;
}