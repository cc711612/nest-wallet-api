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
    .exclude(
      { path: 'api/wallet/auth/login', method: RequestMethod.POST },
      { path: 'api/wallet/auth/login/token', method: RequestMethod.POST },
      { path: 'api/wallet/auth/register', method: RequestMethod.POST },
      { path: 'api/wallet/auth/register/batch', method: RequestMethod.POST },
      { path: 'api/wallet/user', method: RequestMethod.GET },
      { path: 'api/wallet/user', method: RequestMethod.POST },
    )
    .forRoutes(
      { path: 'api/auth/thirdParty/bind', method: RequestMethod.POST },
      { path: 'api/auth/thirdParty/unBind', method: RequestMethod.POST },
      { path: 'api/wallet', method: RequestMethod.ALL },
      { path: 'api/wallet/*path', method: RequestMethod.ALL },
      { path: 'api/device', method: RequestMethod.ALL },
      { path: 'api/device/*path', method: RequestMethod.ALL },
    );
}
