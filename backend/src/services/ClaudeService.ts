import Anthropic from '@anthropic-ai/sdk';
import config from '../config';
import { logger } from '../utils/logger';
import { ExternalAPIError } from '../utils/errorHandler';
import { ClaudeMessage, ConversationContext, AnalysisRequest, AnalysisResponse } from '../types/claude';

class ClaudeService {
  private client: Anthropic;
  private model: string;
  private maxTokens: number;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.claudeApiKey,
    });
    this.model = config.claudeModel;
    this.maxTokens = config.claudeMaxTokens;
  }

  private buildSystemPrompt(): string {
    return `You are an expert fantasy football AI assistant. Your role is to help users make informed decisions about their fantasy football teams.

Your capabilities include:
- Analyzing player performance and matchups
- Providing lineup optimization recommendations
- Evaluating trade proposals for fairness and value
- Identifying waiver wire opportunities
- Offering strategic advice for roster management

When providing recommendations:
1. Be specific and actionable
2. Explain your reasoning clearly
3. Consider matchups, trends, and context
4. Acknowledge uncertainty when appropriate
5. Provide confidence levels (high/medium/low) for your suggestions

Format your responses in a conversational, helpful tone. When making recommendations, structure them clearly with bullet points or numbered lists.`;
  }

  async sendMessage(
    userMessage: string,
    context?: ConversationContext
  ): Promise<AnalysisResponse> {
    try {
      const messages: ClaudeMessage[] = [
        ...(context?.conversationHistory || []),
        { role: 'user', content: userMessage }
      ];

      logger.info('Sending message to Claude API', { 
        messageCount: messages.length,
        userId: context?.userId 
      });

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        system: this.buildSystemPrompt(),
        messages: messages,
      });

      const assistantMessage = response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');

      logger.info('Received response from Claude API', {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      });

      return {
        message: assistantMessage,
        recommendations: this.extractRecommendations(assistantMessage),
      };
    } catch (error: any) {
      logger.error('Claude API error', { error: error.message });
      throw new ExternalAPIError(
        `Failed to get response from Claude: ${error.message}`,
        'Claude'
      );
    }
  }

  async analyzeLineup(request: AnalysisRequest): Promise<AnalysisResponse> {
    const { userMessage, context } = request;
    
    let enhancedMessage = userMessage;
    
    if (context?.roster && context?.players) {
      enhancedMessage += `\n\nCurrent Roster Context:\n`;
      enhancedMessage += `Players: ${JSON.stringify(context.players, null, 2)}\n`;
      enhancedMessage += `Starters: ${JSON.stringify(context.roster.starters, null, 2)}\n`;
    }

    if (context?.opponent) {
      enhancedMessage += `\nOpponent Info:\n${JSON.stringify(context.opponent, null, 2)}`;
    }

    return this.sendMessage(enhancedMessage);
  }

  async evaluateTrade(request: AnalysisRequest): Promise<AnalysisResponse> {
    const { userMessage, context } = request;
    
    let enhancedMessage = `Please evaluate this trade:\n${userMessage}\n\n`;
    
    if (context?.players) {
      enhancedMessage += `Player Details:\n${JSON.stringify(context.players, null, 2)}\n`;
    }

    if (context?.roster) {
      enhancedMessage += `My Current Roster:\n${JSON.stringify(context.roster, null, 2)}\n`;
    }

    enhancedMessage += `\nProvide an analysis of:
1. Trade fairness and value
2. How it impacts my team composition
3. Strengths and weaknesses of each side
4. Overall recommendation with confidence level`;

    return this.sendMessage(enhancedMessage);
  }

  async analyzeWaiverWire(request: AnalysisRequest): Promise<AnalysisResponse> {
    const { userMessage, context } = request;
    
    let enhancedMessage = userMessage;
    
    if (context?.players) {
      enhancedMessage += `\n\nAvailable Players:\n${JSON.stringify(context.players, null, 2)}\n`;
    }

    if (context?.roster) {
      enhancedMessage += `My Roster:\n${JSON.stringify(context.roster, null, 2)}\n`;
    }

    enhancedMessage += `\nProvide recommendations for:
1. Which players to prioritize adding
2. Who to drop (if needed)
3. Reasoning for each suggestion
4. Priority order with confidence levels`;

    return this.sendMessage(enhancedMessage);
  }

  async analyzePlayer(_playerId: string, playerData: any): Promise<AnalysisResponse> {
    const message = `Please provide a detailed analysis of this player:\n\n${JSON.stringify(playerData, null, 2)}\n\nInclude:
1. Current performance assessment
2. Upcoming matchup analysis
3. Season outlook
4. Recommendation (start/sit, add/drop value)`;

    return this.sendMessage(message);
  }

  private extractRecommendations(message: string): any[] | undefined {
    const recommendations: any[] = [];
    
    const startSitPattern = /(?:start|sit):\s*([^\n]+)/gi;
    const matches = message.matchAll(startSitPattern);
    
    for (const match of matches) {
      const action = match[0].toLowerCase().includes('start') ? 'start' : 'sit';
      recommendations.push({
        type: action,
        player: match[1].trim(),
        reason: 'Based on matchup analysis',
        confidence: 'medium',
      });
    }
    
    return recommendations.length > 0 ? recommendations : undefined;
  }
}

export default ClaudeService;