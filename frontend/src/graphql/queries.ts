import { gql } from '@apollo/client';

// User queries
export const GET_USER = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      userId
      username
      displayName
      avatar
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      userId
      username
      displayName
      avatar
    }
  }
`;

// League queries
export const GET_USER_LEAGUES = gql`
  query GetUserLeagues($userId: String!, $sport: String, $season: String!) {
    getUserLeagues(userId: $userId, sport: $sport, season: $season) {
      id
      name
      season
      status
      sport
      totalRosters
      rosterPositions
    }
  }
`;

export const GET_LEAGUE = gql`
  query GetLeague($leagueId: String!) {
    getLeague(leagueId: $leagueId) {
      id
      name
      season
      status
      sport
      totalRosters
      rosterPositions
      settings {
        wins
        losses
        ties
        playoffTeams
        playoffWeekStart
      }
      scoringSettings {
        passTd
        passYd
        rec
        recYd
        rushYd
        rushTd
      }
    }
  }
`;

export const GET_LEAGUE_ROSTERS = gql`
  query GetLeagueRosters($leagueId: String!) {
    getLeagueRosters(leagueId: $leagueId) {
      id
      ownerId
      leagueId
      players
      starters
      reserve
      wins
      losses
      ties
      points
      pointsAgainst
    }
  }
`;

export const GET_LEAGUE_USERS = gql`
  query GetLeagueUsers($leagueId: String!) {
    getLeagueUsers(leagueId: $leagueId) {
      userId
      username
      displayName
      avatar
      teamName
      isOwner
    }
  }
`;

export const GET_MATCHUPS = gql`
  query GetMatchups($leagueId: String!, $week: Int!) {
    getMatchups(leagueId: $leagueId, week: $week) {
      rosterId
      matchupId
      starters
      players
      points
    }
  }
`;

// Player queries
export const GET_PLAYER = gql`
  query GetPlayer($playerId: String!) {
    getPlayer(playerId: $playerId) {
      id
      firstName
      lastName
      fullName
      team
      position
      status
      injuryStatus
      fantasyPositions
      age
      height
      weight
      college
      yearsExperience
      number
      searchRank
    }
  }
`;

export const SEARCH_PLAYERS = gql`
  query SearchPlayers($query: String!, $limit: Int) {
    searchPlayers(query: $query, limit: $limit) {
      id
      firstName
      lastName
      fullName
      team
      position
      status
      injuryStatus
      fantasyPositions
      age
      searchRank
    }
  }
`;

export const GET_TRENDING_PLAYERS = gql`
  query GetTrendingPlayers($type: TrendingType!, $lookbackHours: Int, $limit: Int) {
    getTrendingPlayers(type: $type, lookbackHours: $lookbackHours, limit: $limit) {
      playerId
      count
      player {
        id
        fullName
        team
        position
        status
        injuryStatus
      }
    }
  }
`;

// NFL state
export const GET_NFL_STATE = gql`
  query GetNFLState {
    getNFLState {
      week
      seasonType
      season
      previousSeason
      leagueSeason
      displayWeek
    }
  }
`;