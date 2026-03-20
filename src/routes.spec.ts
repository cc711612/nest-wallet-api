import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { configureMiddlewares } from './routes';
import { MemoryLoggerMiddleware } from './middleware/memory-logger.middleware';
import { GeneralOutputMiddleware } from './middleware/general-output.middleware';
import { VerifyApiMiddleware } from './middleware/verify-api.middleware';
import { VerifyWalletMemberApiMiddleware } from './middleware/verify-wallet-member-api.middleware';

describe('configureMiddlewares', () => {
  it('should wire global, verify-api, and verify-wallet-member middleware routes', () => {
    const forRoutesCalls: Array<any[]> = [];

    const chain = {
      exclude: jest.fn().mockReturnThis(),
      forRoutes: jest.fn((...args: any[]) => {
        forRoutesCalls.push(args);
        return consumer;
      }),
    };

    const consumer = {
      apply: jest.fn().mockReturnValue(chain),
    } as unknown as MiddlewareConsumer;

    configureMiddlewares(consumer);

    expect((consumer as any).apply).toHaveBeenCalledWith(MemoryLoggerMiddleware, GeneralOutputMiddleware);
    expect((consumer as any).apply).toHaveBeenCalledWith(VerifyApiMiddleware);
    expect((consumer as any).apply).toHaveBeenCalledWith(VerifyWalletMemberApiMiddleware);

    const globalRoutes = forRoutesCalls.find((args) => args.some((item) => item?.path === '/*'));
    expect(globalRoutes).toBeDefined();

    const verifyApiRoutes = forRoutesCalls.find((args) =>
      args.some((item) => item?.path === 'api/auth/thirdParty/bind'),
    );
    expect(verifyApiRoutes).toBeDefined();
    expect(verifyApiRoutes).toEqual(
      expect.arrayContaining([
        { path: 'api/auth/thirdParty/bind', method: RequestMethod.POST },
        { path: 'api/auth/thirdParty/unBind', method: RequestMethod.POST },
        { path: 'api/wallet', method: RequestMethod.ALL },
      ]),
    );

    const walletMemberRoutes = forRoutesCalls.find((args) =>
      args.some((item) => item?.path === 'api/wallet/:wallet/detail'),
    );
    expect(walletMemberRoutes).toBeDefined();
    expect(walletMemberRoutes).toEqual(
      expect.arrayContaining([
        { path: 'api/device', method: RequestMethod.ALL },
        { path: 'api/device/*path', method: RequestMethod.ALL },
        { path: 'api/wallet/user/:wallet_users_id', method: RequestMethod.PUT },
        { path: 'api/wallet/:wallet/detail', method: RequestMethod.ALL },
        { path: 'api/wallet/:wallet/detail/*path', method: RequestMethod.ALL },
        { path: 'api/wallet/:wallet/user/:wallet_user_id', method: RequestMethod.DELETE },
      ]),
    );

    expect(chain.exclude).toHaveBeenCalledWith(
      { path: 'api/auth/login', method: RequestMethod.POST },
      { path: 'api/auth/thirdParty/checkBind', method: RequestMethod.POST },
      { path: 'api/wallet/auth/login', method: RequestMethod.POST },
      { path: 'api/wallet/auth/login/token', method: RequestMethod.POST },
      { path: 'api/wallet/auth/register', method: RequestMethod.POST },
      { path: 'api/wallet/auth/register/batch', method: RequestMethod.POST },
      { path: 'api/wallet/user', method: RequestMethod.GET },
      { path: 'api/wallet/user', method: RequestMethod.POST },
    );
  });
});
