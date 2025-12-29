// Sleeper API Response Types

export interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string | null;
}

export interface SleeperLeague {
  league_id: string;
  name: string;
  avatar: string | null;
  season: string;
  season_type: string;
  sport: string;
  status: 'pre_draft' | 'drafting' | 'in_season' | 'complete';
  total_rosters: number;
  settings: LeagueSettings;
  scoring_settings: ScoringSettings;
  roster_positions: string[];
  previous_league_id?: string;
  draft_id?: string;
}

export interface LeagueSettings {
  wins?: number;
  losses?: number;
  ties?: number;
  playoff_teams?: number;
  playoff_week_start?: number;
  // Add more settings as needed
  [key: string]: any;
}

export interface ScoringSettings {
  pass_td?: number;
  pass_yd?: number;
  rec?: number;
  rec_yd?: number;
  rush_yd?: number;
  rush_td?: number;
  // Add more scoring settings as needed
  [key: string]: any;
}

export interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  league_id: string;
  players: string[];
  starters: string[];
  reserve: string[] | null;
  taxi: string[] | null;
  settings: RosterSettings;
}

export interface RosterSettings {
  wins: number;
  losses: number;
  ties: number;
  fpts: number;
  fpts_decimal: number;
  fpts_against: number;
  fpts_against_decimal: number;
  total_moves?: number;
  waiver_position?: number;
  waiver_budget_used?: number;
}

export interface SleeperLeagueUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string | null;
  metadata?: {
    team_name?: string;
    [key: string]: any;
  };
  is_owner?: boolean;
}

export interface SleeperMatchup {
  roster_id: number;
  matchup_id: number;
  starters: string[];
  players: string[];
  points: number;
  custom_points: number | null;
}

export interface SleeperPlayer {
  player_id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  team: string | null;
  position: string;
  number: number | null;
  status: string;
  injury_status: string | null;
  depth_chart_position: number | null;
  fantasy_positions: string[];
  age: number | null;
  height: string | null;
  weight: string | null;
  college: string | null;
  years_exp: number | null;
  espn_id: string | null;
  yahoo_id: string | null;
  fantasy_data_id: number | null;
  stats_id: string | null;
  search_rank: number | null;
  [key: string]: any;
}

export interface SleeperNFLState {
  week: number;
  season_type: 'pre' | 'regular' | 'post';
  season_start_date: string;
  season: string;
  previous_season: string;
  leg: number;
  league_season: string;
  league_create_season: string;
  display_week: number;
}

export interface SleeperTransaction {
  type: 'trade' | 'waiver' | 'free_agent';
  transaction_id: string;
  status: 'complete' | 'pending';
  status_updated: number;
  roster_ids: number[];
  creator: string;
  created: number;
  leg: number;
  adds: { [playerId: string]: number } | null;
  drops: { [playerId: string]: number } | null;
  draft_picks: TradedPick[];
  settings: { waiver_bid?: number } | null;
  metadata: any;
  consenter_ids: number[];
  waiver_budget: WaiverBudgetTransaction[];
}

export interface TradedPick {
  season: string;
  round: number;
  roster_id: number;
  previous_owner_id: number;
  owner_id: number;
}

export interface WaiverBudgetTransaction {
  sender: number;
  receiver: number;
  amount: number;
}