export interface League {
  id: string;
  name: string;
  season: string;
  status: string;
  sport: string;
  totalRosters: number;
  rosterPositions: string[];
  settings?: LeagueSettings;
  scoringSettings?: ScoringSettings;
}

export interface LeagueSettings {
  wins?: number;
  losses?: number;
  ties?: number;
  playoffTeams?: number;
  playoffWeekStart?: number;
}

export interface ScoringSettings {
  passTd?: number;
  passYd?: number;
  rec?: number;
  recYd?: number;
  rushYd?: number;
  rushTd?: number;
}

export interface Roster {
  id: number;
  ownerId: string;
  leagueId: string;
  players: string[];
  starters: string[];
  reserve: string[] | null;
  wins: number;
  losses: number;
  ties: number;
  points: number;
  pointsAgainst: number;
}

export interface LeagueUser {
  userId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  teamName: string | null;
  isOwner: boolean;
}

export interface Matchup {
  rosterId: number;
  matchupId: number;
  starters: string[];
  players: string[];
  points: number;
}

export interface NFLState {
  week: number;
  seasonType: string;
  season: string;
  previousSeason: string;
  leagueSeason: string;
  displayWeek: number;
}