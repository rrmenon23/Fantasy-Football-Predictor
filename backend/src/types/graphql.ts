// GraphQL Schema Types (for TypeScript usage)

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
  searchRank: number | null;
}

export interface League {
  id: string;
  name: string;
  season: string;
  status: string;
  totalRosters: number;
  sport: string;
  rosterPositions: string[];
}

export interface Roster {
  id: number;
  ownerId: string;
  leagueId: string;
  players: string[];
  starters: string[];
  wins: number;
  losses: number;
  ties: number;
  points: number;
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

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  message: Message;
  recommendations: Recommendation[] | null;
}

export interface Recommendation {
  type: string;
  player: string | null;
  reason: string;
  confidence: string;
}

// GraphQL Context Type
export interface GraphQLContext {
  // Add any context properties needed for resolvers
  dataSources?: {
    sleeperService: any;
    claudeService: any;
    analysisService: any;
  };
}