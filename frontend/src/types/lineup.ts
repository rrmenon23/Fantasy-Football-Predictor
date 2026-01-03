export interface LineupState {
  userId: string | null;
  username: string | null;
  leagueId: string | null;
  leagueName: string | null;
  rosterId: number | null;
  starters: string[];
  bench: string[];
  week: number;
}

export interface LineupPlayer {
  id: string;
  name: string;
  position: string;
  team: string | null;
  isStarter: boolean;
  injuryStatus: string | null;
  status: string;
}