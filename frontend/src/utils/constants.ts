/**
 * Fantasy football positions
 */
export const POSITIONS = {
  QB: 'Quarterback',
  RB: 'Running Back',
  WR: 'Wide Receiver',
  TE: 'Tight End',
  K: 'Kicker',
  DEF: 'Defense/Special Teams',
  FLEX: 'Flex (RB/WR/TE)',
  SUPER_FLEX: 'Super Flex (QB/RB/WR/TE)',
  BN: 'Bench',
  IR: 'Injured Reserve',
};

/**
 * Standard roster positions
 */
export const STANDARD_ROSTER_POSITIONS = [
  'QB',
  'RB',
  'RB',
  'WR',
  'WR',
  'TE',
  'FLEX',
  'K',
  'DEF',
  'BN',
  'BN',
  'BN',
  'BN',
  'BN',
  'BN',
];

/**
 * Player status types
 */
export const PLAYER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  INJURED_RESERVE: 'Injured Reserve',
  NON_FOOTBALL_INJURY: 'Non-Football Injury',
  PHYSICALLY_UNABLE: 'Physically Unable to Perform',
  SUSPENDED: 'Suspended',
  PRACTICE_SQUAD: 'Practice Squad',
};

/**
 * Injury status types
 */
export const INJURY_STATUS = {
  OUT: 'Out',
  DOUBTFUL: 'Doubtful',
  QUESTIONABLE: 'Questionable',
  PROBABLE: 'Probable',
  HEALTHY: 'Healthy',
};

/**
 * League status types
 */
export const LEAGUE_STATUS = {
  PRE_DRAFT: 'pre_draft',
  DRAFTING: 'drafting',
  IN_SEASON: 'in_season',
  COMPLETE: 'complete',
};

/**
 * Season types
 */
export const SEASON_TYPES = {
  PRE: 'pre',
  REGULAR: 'regular',
  POST: 'post',
};

/**
 * Recommendation types
 */
export const RECOMMENDATION_TYPES = {
  START: 'start',
  SIT: 'sit',
  ADD: 'add',
  DROP: 'drop',
  TRADE: 'trade',
};

/**
 * Current season (update annually)
 */
export const CURRENT_SEASON = '2024';

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  GRAPHQL: import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql',
};

/**
 * Position colors for UI
 */
export const POSITION_COLORS: Record<string, string> = {
  QB: 'bg-red-100 text-red-800',
  RB: 'bg-green-100 text-green-800',
  WR: 'bg-blue-100 text-blue-800',
  TE: 'bg-yellow-100 text-yellow-800',
  K: 'bg-purple-100 text-purple-800',
  DEF: 'bg-gray-100 text-gray-800',
};