import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import config from './config';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';
import SleeperService from './services/SleeperService';
import ClaudeService from './services/ClaudeService';
import AnalysisService from './services/AnalysisService';
import { logger } from './utils/logger';
import { GraphQLContext } from './types/graphql';

async function startServer() {
  const app = express();

  // Initialize services
  const sleeperService = new SleeperService(config.sleeperCacheTTL);
  const claudeService = new ClaudeService();
  const analysisService = new AnalysisService(sleeperService, claudeService);

  // Create Apollo Server
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: config.allowedOrigins,
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({
        dataSources: {
          sleeperService,
          claudeService,
          analysisService,
        },
      }),
    })
  );

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Start server
  app.listen(config.port, () => {
    logger.info(`🚀 Server ready at http://localhost:${config.port}/graphql`);
    logger.info(`📊 Health check available at http://localhost:${config.port}/health`);
    logger.info(`🏈 Fantasy Football AI Agent is running!`);
  });
}

// Start the server
startServer().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});