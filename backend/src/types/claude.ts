// Claude API Types

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
  system?: string;
}

export interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: ClaudeContent[];
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ClaudeContent {
  type: 'text';
  text: string;
}

export interface ConversationContext {
  userId?: string;
  leagueId?: string;
  conversationHistory: ClaudeMessage[];
  metadata?: {
    leagueName?: string;
    teamName?: string;
    currentWeek?: number;
    [key: string]: any;
  };
}

export interface AnalysisRequest {
  type: 'lineup' | 'trade' | 'waiver' | 'player' | 'general';
  userMessage: string;
  context?: {
    players?: any[];
    roster?: any;
    league?: any;
    opponent?: any;
    [key: string]: any;
  };
}

export interface AnalysisResponse {
  message: string;
  recommendations?: Recommendation[];
  data?: any;
}

export interface Recommendation {
  type: 'start' | 'sit' | 'add' | 'drop' | 'trade';
  player?: string;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}