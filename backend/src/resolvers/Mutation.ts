import { GraphQLContext } from '../types/graphql';
import { handleError } from '../utils/errorHandler';
import { ClaudeMessage } from '../types/claude';

export const Mutation = {
  sendMessage: async (
    _: any,
    {
      message,
      leagueId,
      userId,
      conversationHistory,
    }: {
      message: string;
      leagueId?: string;
      userId?: string;
      conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    },
    context: GraphQLContext
  ) => {
    try {
      const history: ClaudeMessage[] = conversationHistory || [];
      
      const response = await context.dataSources!.analysisService.processUserQuery(
        message,
        leagueId,
        userId,
        history
      );

      return {
        message: response.message,
        recommendations: response.recommendations || [],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw handleError(error);
    }
  },

  optimizeLineup: async (
    _: any,
    {
      leagueId,
      userId,
      week,
    }: {
      leagueId: string;
      userId: string;
      week?: number;
    },
    context: GraphQLContext
  ) => {
    try {
      const response = await context.dataSources!.analysisService.optimizeLineup(
        leagueId,
        userId,
        week
      );

      return {
        message: response.message,
        recommendations: response.recommendations || [],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw handleError(error);
    }
  },

  getWaiverRecommendations: async (
    _: any,
    {
      leagueId,
      userId,
      limit = 10,
    }: {
      leagueId: string;
      userId: string;
      limit?: number;
    },
    context: GraphQLContext
  ) => {
    try {
      const response = await context.dataSources!.analysisService.getWaiverRecommendations(
        leagueId,
        userId,
        limit
      );

      return {
        message: response.message,
        recommendations: response.recommendations || [],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw handleError(error);
    }
  },

  evaluateTrade: async (
    _: any,
    {
      message,
      leagueId,
      userId,
    }: {
      message: string;
      leagueId?: string;
      userId?: string;
    },
    context: GraphQLContext
  ) => {
    try {
      const context_data = await context.dataSources!.analysisService.gatherContext(
        'trade',
        message,
        leagueId,
        userId
      );

      const response = await context.dataSources!.claudeService.evaluateTrade({
        type: 'trade',
        userMessage: message,
        context: context_data,
      });

      return {
        message: response.message,
        recommendations: response.recommendations || [],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw handleError(error);
    }
  },
};