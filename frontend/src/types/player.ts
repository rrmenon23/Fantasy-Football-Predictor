export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  team: string | null;
  position: string;
  status: string;
  injuryStatus: string | null;
  fantasyPositions: string[];
  age: number | null;
  height: string | null;
  weight: string | null;
  college: string | null;
  yearsExperience: number | null;
  number: number | null;
  searchRank: number | null;
}

export interface TrendingPlayer {
  playerId: string;
  count: number;
  player: Player | null;
}

export interface PlayerSearchResult {
  players: Player[];
  total: number;
}