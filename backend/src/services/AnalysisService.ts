import SleeperService from './SleeperService';
import ClaudeService from './ClaudeService';
import { logger } from '../utils/logger';
import { AnalysisRequest, AnalysisResponse } from '../types/claude';

class AnalysisService {
  private sleeperService: SleeperService;
  private claudeService: ClaudeService;

  constructor(sleeperService: SleeperService, claudeService: ClaudeService) {
    this.sleeperService = sleeperService;
    this.claudeService = claudeService;
  }

  async processUserQuery(
    message: string,
    leagueId?: string,
    userId?: string,
    conversationHistory?: any[]
  ): Promise<AnalysisResponse> {
    logger.info('Processing user query', { message, leagueId, userId });

    // Determine query type
    const queryType = this.determineQueryType(message);

    // Gather relevant context based on query type
    const context = await this.gatherContext(queryType, message, leagueId, userId);

    // Create analysis request
    const request: AnalysisRequest = {
      type: queryType,
      userMessage: message,
      context: context,
    };

    // Route to appropriate analysis method
    switch (queryType) {
      case 'lineup':
        return this.claudeService.analyzeLineup(request);
      case 'trade':
        return this.claudeService.evaluateTrade(request);
      case 'waiver':
        return this.claudeService.analyzeWaiverWire(request);
      case 'player':
        return this.analyzePlayerQuery(message);
      default:
        return this.claudeService.sendMessage(message, {
          conversationHistory: conversationHistory || [],
          leagueId,
          userId,
        });
    }
  }

  private determineQueryType(message: string): 'lineup' | 'trade' | 'waiver' | 'player' | 'general' {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('lineup') || lowerMessage.includes('start') || lowerMessage.includes('sit')) {
      return 'lineup';
    }
    if (lowerMessage.includes('trade') || lowerMessage.includes('swap')) {
      return 'trade';
    }
    if (lowerMessage.includes('waiver') || lowerMessage.includes('add') || lowerMessage.includes('drop') || lowerMessage.includes('pick up')) {
      return 'waiver';
    }
    if (lowerMessage.includes('player') || lowerMessage.includes('analyze')) {
      return 'player';
    }

    return 'general';
  }

  private async gatherContext(
    queryType: string,
    message: string,
    leagueId?: string,
    userId?: string
  ): Promise<any> {
    const context: any = {};

    try {
      // Get NFL state for current week
      const nflState = await this.sleeperService.getNFLState();
      context.currentWeek = nflState.week;
      context.season = nflState.season;

      // If league context is available, fetch league data
      if (leagueId) {
        context.league = await this.sleeperService.getLeague(leagueId);
        
        // Get rosters
        const rosters = await this.sleeperService.getLeagueRosters(leagueId);
        
        // Find user's roster if userId is provided
        if (userId) {
          const userRoster = rosters.find(r => r.owner_id === userId);
          if (userRoster) {
            context.roster = userRoster;
            
            // Get player details for roster
            const playerPromises = userRoster.players.map(playerId => 
              this.sleeperService.getPlayer(playerId)
            );
            const players = await Promise.all(playerPromises);
            context.players = players.filter(p => p !== null);
          }
        }

        // Get current week matchups if relevant
        if (queryType === 'lineup') {
          try {
            const matchups = await this.sleeperService.getMatchups(leagueId, nflState.week);
            context.matchups = matchups;
          } catch (error) {
            logger.warn('Could not fetch matchups', { error });
          }
        }
      }

      // Extract player names from message and fetch their data
      const playerNames = this.extractPlayerNames(message);
      if (playerNames.length > 0) {
        const playerDataPromises = playerNames.map(name =>
          this.sleeperService.searchPlayers(name, 1)
        );
        const playerResults = await Promise.all(playerDataPromises);
        context.mentionedPlayers = playerResults.flat().filter(p => p);
      }

    } catch (error: any) {
      logger.error('Error gathering context', { error: error.message });
      // Continue with partial context
    }

    return context;
  }

  private extractPlayerNames(message: string): string[] {
    // Simple extraction - look for capitalized words that might be names
    // This could be enhanced with NLP or a player name database
    const words = message.split(/\s+/);
    const potentialNames: string[] = [];
    
    for (let i = 0; i < words.length - 1; i++) {
      const word = words[i];
      const nextWord = words[i + 1];
      
      // Look for patterns like "FirstName LastName"
      if (word[0] === word[0].toUpperCase() && nextWord[0] === nextWord[0].toUpperCase()) {
        potentialNames.push(`${word} ${nextWord}`);
      }
    }
    
    return potentialNames;
  }

  private async analyzePlayerQuery(message: string): Promise<AnalysisResponse> {
    // Extract player name from query
    const playerNames = this.extractPlayerNames(message);
    
    if (playerNames.length === 0) {
      return this.claudeService.sendMessage(message);
    }

    // Search for the first player mentioned
    const searchResults = await this.sleeperService.searchPlayers(playerNames[0], 1);
    
    if (searchResults.length === 0) {
      return {
        message: `I couldn't find information about "${playerNames[0]}". Please check the spelling or try a different player.`,
        recommendations: null,
      };
    }

    const player = searchResults[0];
    return this.claudeService.analyzePlayer(player.player_id, player);
  }

  async optimizeLineup(
    leagueId: string,
    userId: string,
    week?: number
  ): Promise<AnalysisResponse> {
    logger.info('Optimizing lineup', { leagueId, userId, week });

    const nflState = await this.sleeperService.getNFLState();
    const targetWeek = week || nflState.week;

    // Get user's roster
    const rosters = await this.sleeperService.getLeagueRosters(leagueId);
    const userRoster = rosters.find(r => r.owner_id === userId);

    if (!userRoster) {
      throw new Error('User roster not found');
    }

    // Get player details
    const playerPromises = userRoster.players.map(playerId =>
      this.sleeperService.getPlayer(playerId)
    );
    const players = await Promise.all(playerPromises);

    // Get league settings
    const league = await this.sleeperService.getLeague(leagueId);

    // Build optimization request
    const message = `Please analyze my roster and recommend the optimal lineup for week ${targetWeek}.

Roster Positions Required: ${league.roster_positions.join(', ')}

Available Players:
${players.filter(p => p).map(p => `- ${p!.full_name || p!.first_name + ' ' + p!.last_name} (${p!.position}, ${p!.team || 'FA'}) - Status: ${p!.status}`).join('\n')}

Current Starters:
${userRoster.starters.map(id => {
  const p = players.find(pl => pl?.player_id === id);
  return p ? `- ${p.full_name || p.first_name + ' ' + p.last_name}` : `- ${id}`;
}).join('\n')}

Please provide:
1. Recommended starters for each position
2. Reasoning for any changes from current lineup
3. Confidence level for each recommendation
4. Any injury or matchup concerns`;

    return this.claudeService.sendMessage(message);
  }

  async getWaiverRecommendations(
    leagueId: string,
    userId: string,
    limit: number = 10
  ): Promise<AnalysisResponse> {
    logger.info('Getting waiver recommendations', { leagueId, userId });

    // Get trending adds
    const trending = await this.sleeperService.getTrendingPlayers('add', 24, limit);

    // Get player details for trending players
    const trendingPlayerPromises = trending.map(t =>
      this.sleeperService.getPlayer(t.player_id)
    );
    const trendingPlayers = await Promise.all(trendingPlayerPromises);

    // Get user's current roster
    const rosters = await this.sleeperService.getLeagueRosters(leagueId);
    const userRoster = rosters.find(r => r.owner_id === userId);

    if (!userRoster) {
      throw new Error('User roster not found');
    }

    const rosterPlayerPromises = userRoster.players.map(playerId =>
      this.sleeperService.getPlayer(playerId)
    );
    const rosterPlayers = await Promise.all(rosterPlayerPromises);

    const message = `Based on recent waiver activity, here are the trending players:

${trendingPlayers.filter(p => p).map((p, i) => 
  `${i + 1}. ${p!.full_name || p!.first_name + ' ' + p!.last_name} (${p!.position}, ${p!.team || 'FA'}) - ${trending[i].count} adds in last 24h`
).join('\n')}

My Current Roster:
${rosterPlayers.filter(p => p).map(p => 
  `- ${p!.full_name || p!.first_name + ' ' + p!.last_name} (${p!.position}, ${p!.team || 'FA'})`
).join('\n')}

Please recommend:
1. Which trending players I should prioritize
2. Who from my roster I could drop
3. Why these moves would benefit my team
4. Priority order with confidence levels`;

    return this.claudeService.sendMessage(message);
  }
}

export default AnalysisService;