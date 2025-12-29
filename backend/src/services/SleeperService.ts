import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';
import { ExternalAPIError } from '../utils/errorHandler';
import {
  SleeperUser,
  SleeperLeague,
  SleeperRoster,
  SleeperLeagueUser,
  SleeperMatchup,
  SleeperPlayer,
  SleeperNFLState,
  SleeperTransaction,
  TradedPick,
} from '../types/sleeper';

class SleeperService {
  private api: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTTL: number;

  constructor(cacheTTL: number = 3600) {
    this.api = axios.create({
      baseURL: 'https://api.sleeper.app/v1',
      timeout: 10000,
    });
    this.cache = new Map();
    this.cacheTTL = cacheTTL * 1000; // Convert to milliseconds
  }

  private getCacheKey(endpoint: string): string {
    return endpoint;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      logger.debug(`Cache hit for ${key}`);
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async request<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint);

    if (useCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) return cached;
    }

    try {
      logger.debug(`Fetching from Sleeper API: ${endpoint}`);
      const response = await this.api.get<T>(endpoint);
      
      if (useCache) {
        this.setCache(cacheKey, response.data);
      }
      
      return response.data;
    } catch (error: any) {
      logger.error(`Sleeper API error: ${endpoint}`, { error: error.message });
      throw new ExternalAPIError(
        `Failed to fetch data from Sleeper API: ${error.message}`,
        'Sleeper'
      );
    }
  }

  async getUser(username: string): Promise<SleeperUser> {
    return this.request<SleeperUser>(`/user/${username}`);
  }

  async getUserById(userId: string): Promise<SleeperUser> {
    return this.request<SleeperUser>(`/user/${userId}`);
  }

  async getUserLeagues(userId: string, sport: string = 'nfl', season: string): Promise<SleeperLeague[]> {
    return this.request<SleeperLeague[]>(`/user/${userId}/leagues/${sport}/${season}`);
  }

  async getLeague(leagueId: string): Promise<SleeperLeague> {
    return this.request<SleeperLeague>(`/league/${leagueId}`);
  }

  async getLeagueRosters(leagueId: string): Promise<SleeperRoster[]> {
    return this.request<SleeperRoster[]>(`/league/${leagueId}/rosters`, false); // Don't cache rosters
  }

  async getLeagueUsers(leagueId: string): Promise<SleeperLeagueUser[]> {
    return this.request<SleeperLeagueUser[]>(`/league/${leagueId}/users`);
  }

  async getMatchups(leagueId: string, week: number): Promise<SleeperMatchup[]> {
    return this.request<SleeperMatchup[]>(`/league/${leagueId}/matchups/${week}`, false);
  }

  async getTransactions(leagueId: string, week: number): Promise<SleeperTransaction[]> {
    return this.request<SleeperTransaction[]>(`/league/${leagueId}/transactions/${week}`, false);
  }

  async getTradedPicks(leagueId: string): Promise<TradedPick[]> {
    return this.request<TradedPick[]>(`/league/${leagueId}/traded_picks`);
  }

  async getAllPlayers(): Promise<{ [playerId: string]: SleeperPlayer }> {
    // Cache players for 24 hours since they don't change often
    const cacheKey = 'all_players';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
      return cached.data;
    }

    const players = await this.request<{ [playerId: string]: SleeperPlayer }>('/players/nfl');
    this.cache.set(cacheKey, { data: players, timestamp: Date.now() });
    return players;
  }

  async getPlayer(playerId: string): Promise<SleeperPlayer | null> {
    const allPlayers = await this.getAllPlayers();
    return allPlayers[playerId] || null;
  }

  async searchPlayers(query: string, limit: number = 10): Promise<SleeperPlayer[]> {
    const allPlayers = await this.getAllPlayers();
    const searchQuery = query.toLowerCase();
    
    const results = Object.values(allPlayers)
      .filter(player => {
        const fullName = `${player.first_name} ${player.last_name}`.toLowerCase();
        return fullName.includes(searchQuery) || 
               player.last_name.toLowerCase().includes(searchQuery);
      })
      .sort((a, b) => (b.search_rank || 0) - (a.search_rank || 0))
      .slice(0, limit);

    return results;
  }

  async getTrendingPlayers(type: 'add' | 'drop', lookbackHours: number = 24, limit: number = 25): Promise<Array<{ player_id: string; count: number }>> {
    return this.request<Array<{ player_id: string; count: number }>>(
      `/players/nfl/trending/${type}?lookback_hours=${lookbackHours}&limit=${limit}`,
      false
    );
  }

  async getNFLState(): Promise<SleeperNFLState> {
    return this.request<SleeperNFLState>('/state/nfl', false);
  }

  clearCache(): void {
    this.cache.clear();
    logger.info('Sleeper service cache cleared');
  }
}

export default SleeperService;