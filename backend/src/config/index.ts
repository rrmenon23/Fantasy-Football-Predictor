import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  claudeApiKey: string;
  claudeModel: string;
  claudeMaxTokens: number;
  logLevel: string;
  sleeperCacheTTL: number;
  playerCacheTTL: number;
  allowedOrigins: string[];
}

const config: Config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  claudeApiKey: process.env.CLAUDE_API_KEY || '',
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
  claudeMaxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '4096', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  sleeperCacheTTL: parseInt(process.env.SLEEPER_CACHE_TTL || '3600', 10),
  playerCacheTTL: parseInt(process.env.PLAYER_CACHE_TTL || '86400', 10),
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
};

// Validate required configuration
if (!config.claudeApiKey) {
  throw new Error('CLAUDE_API_KEY environment variable is required');
}

export default config;