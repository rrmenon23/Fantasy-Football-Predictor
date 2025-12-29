import { GraphQLError } from 'graphql';
import { logger } from './logger';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'INTERNAL_SERVER_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ExternalAPIError extends AppError {
  constructor(message: string, public service: string) {
    super(message, 'EXTERNAL_API_ERROR', 502);
    this.name = 'ExternalAPIError';
  }
}

export function handleError(error: unknown): GraphQLError {
  logger.error('Error occurred', { error });

  if (error instanceof AppError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: error.code,
        statusCode: error.statusCode,
      },
    });
  }

  if (error instanceof Error) {
    return new GraphQLError(error.message, {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }

  return new GraphQLError('An unexpected error occurred', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}