import { GraphQLContext } from '../types/graphql';
import { handleError } from '../utils/errorHandler';

export const Query = {
  // User queries
  getUser: async (_: any, { username }: { username: string }, context: GraphQLContext) => {
    try {
      const user = await context.dataSources!.sleeperService.getUser(username);
      return {
        userId: user.user_id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar,
      };
    } catch (error) {
      throw handleError(error);
    }
  },

  getUserById: async (_: any, { userId }: { userId: string }, context: GraphQLContext) => {
    try {
      const user = await context.dataSources!.sleeperService.getUserById(userId);
      return {
        userId: user.user_id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar,
      };
    } catch (error) {
      throw handleError(error);
    }
  },

  // League queries
  getUserLeagues: async (
    _: any,
    { userId, sport = 'nfl', season }: { userId: string; sport?: string; season: string },
    context: GraphQLContext
  ) => {
    try {
      const leagues = await context.dataSources!.sleeperService.getUserLeagues(userId, sport, season);
      return leagues.map((league:any) => ({
        id: league.league_id,
        name: league.name,
        season: league.season,
        status: league.status,
        sport: league.sport,
        totalRosters: league.total_rosters,
        rosterPositions: league.roster_positions,
        settings: league.settings,
        scoringSettings: league.scoring_settings,
      }));
    } catch (error) {
      throw handleError(error);
    }
  },

  getLeague: async (_: any, { leagueId }: { leagueId: string }, context: GraphQLContext) => {
    try {
      const league = await context.dataSources!.sleeperService.getLeague(leagueId);
      return {
        id: league.league_id,
        name: league.name,
        season: league.season,
        status: league.status,
        sport: league.sport,
        totalRosters: league.total_rosters,
        rosterPositions: league.roster_positions,
        settings: league.settings,
        scoringSettings: league.scoring_settings,
      };
    } catch (error) {
      throw handleError(error);
    }
  },

  getLeagueRosters: async (_: any, { leagueId }: { leagueId: string }, context: GraphQLContext) => {
    try {
      const rosters = await context.dataSources!.sleeperService.getLeagueRosters(leagueId);
      return rosters.map((roster:any) => ({
        id: roster.roster_id,
        ownerId: roster.owner_id,
        leagueId: roster.league_id,
        players: roster.players,
        starters: roster.starters,
        reserve: roster.reserve,
        wins: roster.settings.wins,
        losses: roster.settings.losses,
        ties: roster.settings.ties,
        points: roster.settings.fpts + (roster.settings.fpts_decimal / 100),
        pointsAgainst: roster.settings.fpts_against + (roster.settings.fpts_against_decimal / 100),
      }));
    } catch (error) {
      throw handleError(error);
    }
  },

  getLeagueUsers: async (_: any, { leagueId }: { leagueId: string }, context: GraphQLContext) => {
    try {
      const users = await context.dataSources!.sleeperService.getLeagueUsers(leagueId);
      return users.map((user:any) => ({
        userId: user.user_id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar,
        teamName: user.metadata?.team_name || null,
        isOwner: user.is_owner || false,
      }));
    } catch (error) {
      throw handleError(error);
    }
  },

  getMatchups: async (
    _: any,
    { leagueId, week }: { leagueId: string; week: number },
    context: GraphQLContext
  ) => {
    try {
      const matchups = await context.dataSources!.sleeperService.getMatchups(leagueId, week);
      return matchups.map((matchup:any) => ({
        rosterId: matchup.roster_id,
        matchupId: matchup.matchup_id,
        starters: matchup.starters,
        players: matchup.players,
        points: matchup.points,
      }));
    } catch (error) {
      throw handleError(error);
    }
  },

  // Player queries
  getPlayer: async (_: any, { playerId }: { playerId: string }, context: GraphQLContext) => {
    try {
      const player = await context.dataSources!.sleeperService.getPlayer(playerId);
      if (!player) return null;

      return {
        id: player.player_id,
        firstName: player.first_name,
        lastName: player.last_name,
        fullName: player.full_name || `${player.first_name} ${player.last_name}`,
        team: player.team,
        position: player.position,
        status: player.status,
        injuryStatus: player.injury_status,
        fantasyPositions: player.fantasy_positions,
        age: player.age,
        height: player.height,
        weight: player.weight,
        college: player.college,
        yearsExperience: player.years_exp,
        number: player.number,
        searchRank: player.search_rank,
      };
    } catch (error) {
      throw handleError(error);
    }
  },

  searchPlayers: async (
    _: any,
    { query, limit = 10 }: { query: string; limit?: number },
    context: GraphQLContext
  ) => {
    try {
      const players = await context.dataSources!.sleeperService.searchPlayers(query, limit);
      return players.map((player:any) => ({
        id: player.player_id,
        firstName: player.first_name,
        lastName: player.last_name,
        fullName: player.full_name || `${player.first_name} ${player.last_name}`,
        team: player.team,
        position: player.position,
        status: player.status,
        injuryStatus: player.injury_status,
        fantasyPositions: player.fantasy_positions,
        age: player.age,
        height: player.height,
        weight: player.weight,
        college: player.college,
        yearsExperience: player.years_exp,
        number: player.number,
        searchRank: player.search_rank,
      }));
    } catch (error) {
      throw handleError(error);
    }
  },

  getTrendingPlayers: async (
    _: any,
    { type, lookbackHours = 24, limit = 25 }: { type: 'add' | 'drop'; lookbackHours?: number; limit?: number },
    context: GraphQLContext
  ) => {
    try {
      const trending = await context.dataSources!.sleeperService.getTrendingPlayers(
        type,
        lookbackHours,
        limit
      );
      
      // Fetch player details for each trending player
      const playersPromises = trending.map(async (t:any) => {
        const player = await context.dataSources!.sleeperService.getPlayer(t.player_id);
        return {
          playerId: t.player_id,
          count: t.count,
          player: player ? {
            id: player.player_id,
            firstName: player.first_name,
            lastName: player.last_name,
            fullName: player.full_name || `${player.first_name} ${player.last_name}`,
            team: player.team,
            position: player.position,
            status: player.status,
            injuryStatus: player.injury_status,
            fantasyPositions: player.fantasy_positions,
            age: player.age,
            height: player.height,
            weight: player.weight,
            college: player.college,
            yearsExperience: player.years_exp,
            number: player.number,
            searchRank: player.search_rank,
          } : null,
        };
      });

      return Promise.all(playersPromises);
    } catch (error) {
      throw handleError(error);
    }
  },

  // NFL state
  getNFLState: async (_: any, __: any, context: GraphQLContext) => {
    try {
      const state = await context.dataSources!.sleeperService.getNFLState();
      return {
        week: state.week,
        seasonType: state.season_type,
        season: state.season,
        previousSeason: state.previous_season,
        leagueSeason: state.league_season,
        displayWeek: state.display_week,
      };
    } catch (error) {
      throw handleError(error);
    }
  },
};