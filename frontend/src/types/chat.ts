export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface Recommendation {
  type: 'start' | 'sit' | 'add' | 'drop' | 'trade';
  player: string | null;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ChatResponse {
  message: string;
  recommendations?: Recommendation[];
  timestamp: string;
}

export interface ConversationHistory {
  messages: Message[];
  leagueId?: string;
  userId?: string;
}