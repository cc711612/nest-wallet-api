import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MemoryLoggerMiddleware } from './middleware/memory-logger.middleware';
import { JwtAuthMiddleware } from './middleware/jwt-auth.middleware';
import { GeneralOutputMiddleware } from './middleware/general-output.middleware';

export function configureMiddlewares(consumer: MiddlewareConsumer) {
  consumer
    .apply(MemoryLoggerMiddleware, GeneralOutputMiddleware)
    .forRoutes(
      { path: '/*', method: RequestMethod.ALL },
    );
  // for wallet controller
  consumer
    .apply(JwtAuthMiddleware)
    .forRoutes(
      { path: 'wallets', method: RequestMethod.ALL },
      { path: 'wallets/*', method: RequestMethod.ALL },
    );
}