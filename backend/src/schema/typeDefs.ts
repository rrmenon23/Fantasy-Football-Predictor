import gql from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    # User queries
    getUser(username: String!): User
    getUserById(userId: String!): User

    # League queries
    getUserLeagues(userId: String!, sport: String, season: String!): [League!]!
    getLeague(leagueId: String!): League
    getLeagueRosters(leagueId: String!): [Roster!]!
    getLeagueUsers(leagueId: String!): [LeagueUser!]!
    getMatchups(leagueId: String!, week: Int!): [Matchup!]!

    # Player queries
    getPlayer(playerId: String!): Player
    searchPlayers(query: String!, limit: Int): [Player!]!
    getTrendingPlayers(type: TrendingType!, lookbackHours: Int, limit: Int): [TrendingPlayer!]!
    
    # NFL state
    getNFLState: NFLState!
  }

  type Mutation {
    # Chat mutations
    sendMessage(
      message: String!
      leagueId: String
      userId: String
      conversationHistory: [MessageInput!]
    ): ChatResponse!

    # Analysis mutations
    optimizeLineup(leagueId: String!, userId: String!, week: Int): ChatResponse!
    getWaiverRecommendations(leagueId: String!, userId: String!, limit: Int): ChatResponse!
    evaluateTrade(message: String!, leagueId: String, userId: String): ChatResponse!
  }

  # Types
  type User {
    userId: String!
    username: String!
    displayName: String!
    avatar: String
  }

  type League {
    id: String!
    name: String!
    season: String!
    status: String!
    sport: String!
    totalRosters: Int!
    rosterPositions: [String!]!
    settings: LeagueSettings
    scoringSettings: ScoringSettings
  }

  type LeagueSettings {
    wins: Int
    losses: Int
    ties: Int
    playoffTeams: Int
    playoffWeekStart: Int
  }

  type ScoringSettings {
    passTd: Float
    passYd: Float
    rec: Float
    recYd: Float
    rushYd: Float
    rushTd: Float
  }

  type Roster {
    id: Int!
    ownerId: String!
    leagueId: String!
    players: [String!]!
    starters: [String!]!
    reserve: [String!]
    wins: Int!
    losses: Int!
    ties: Int!
    points: Float!
    pointsAgainst: Float!
  }

  type LeagueUser {
    userId: String!
    username: String!
    displayName: String!
    avatar: String
    teamName: String
    isOwner: Boolean!
  }

  type Matchup {
    rosterId: Int!
    matchupId: Int!
    starters: [String!]!
    players: [String!]!
    points: Float!
  }

  type Player {
    id: String!
    firstName: String!
    lastName: String!
    fullName: String
    team: String
    position: String!
    status: String!
    injuryStatus: String
    fantasyPositions: [String!]!
    age: Int
    height: String
    weight: String
    college: String
    yearsExperience: Int
    number: Int
    searchRank: Int
  }

  type TrendingPlayer {
    playerId: String!
    count: Int!
    player: Player
  }

  type NFLState {
    week: Int!
    seasonType: String!
    season: String!
    previousSeason: String!
    leagueSeason: String!
    displayWeek: Int!
  }

  type Message {
    role: MessageRole!
    content: String!
    timestamp: String!
  }

  type ChatResponse {
    message: String!
    recommendations: [Recommendation!]
    timestamp: String!
  }

  type Recommendation {
    type: RecommendationType!
    player: String
    reason: String!
    confidence: ConfidenceLevel!
  }

  # Enums
  enum MessageRole {
    user
    assistant
  }

  enum RecommendationType {
    start
    sit
    add
    drop
    trade
  }

  enum ConfidenceLevel {
    high
    medium
    low
  }

  enum TrendingType {
    add
    drop
  }

  # Inputs
  input MessageInput {
    role: MessageRole!
    content: String!
  }
`;