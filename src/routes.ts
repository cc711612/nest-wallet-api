import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MemoryLoggerMiddleware } from './middleware/memory-logger.middleware';
import { GeneralOutputMiddleware } from './middleware/general-output.middleware';
import { VerifyApiMiddleware } from './middleware/verify-api.middleware';
import { VerifyWalletMemberApiMiddleware } from './middleware/verify-wallet-member-api.middleware';

export function configureMiddlewares(consumer: MiddlewareConsumer) {
  consumer
    .apply(MemoryLoggerMiddleware, GeneralOutputMiddleware)
    .forRoutes(
      { path: '/*', method: RequestMethod.ALL },
    );
  // VerifyApi (similar to wallet-v2 VerifyApi)
  consumer
    .apply(VerifyApiMiddleware)
    .exclude(
      { path: 'api/auth/login', method: RequestMethod.POST },
      { path: 'api/auth/thirdParty/checkBind', method: RequestMethod.POST },
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
    );

  // VerifyWalletMemberApi (similar to wallet-v2 VerifyWalletMemberApi)
  consumer
    .apply(VerifyWalletMemberApiMiddleware)
    .forRoutes(
      { path: 'api/device', method: RequestMethod.ALL },
      { path: 'api/device/*path', method: RequestMethod.ALL },
      { path: 'api/wallet/user/:wallet_users_id', method: RequestMethod.PUT },
      { path: 'api/wallet/:wallet/detail', method: RequestMethod.ALL },
      { path: 'api/wallet/:wallet/detail/*path', method: RequestMethod.ALL },
      { path: 'api/wallet/:wallet/user/:wallet_user_id', method: RequestMethod.DELETE },
    );
}
