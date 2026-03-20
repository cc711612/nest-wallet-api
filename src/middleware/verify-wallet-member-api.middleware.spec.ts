import { UnauthorizedException } from '@nestjs/common';
import { VerifyWalletMemberApiMiddleware } from './verify-wallet-member-api.middleware';

describe('VerifyWalletMemberApiMiddleware', () => {
  const authServiceMock = {
    getUserByDecodetoken: jest.fn(),
  };

  const walletUserServiceMock = {
    listByUserId: jest.fn(),
    findByTokenAndWallet: jest.fn(),
  };

  const userServiceMock = {
    findOne: jest.fn(),
  };

  const createMiddleware = () =>
    new VerifyWalletMemberApiMiddleware(authServiceMock as any, walletUserServiceMock as any, userServiceMock as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject wallet_user map and call next when bearer jwt is valid', async () => {
    const middleware = createMiddleware();
    const req: any = {
      headers: { authorization: 'Bearer jwt-token' },
      body: {},
      query: {},
      params: { wallet: '144' },
    };
    const next = jest.fn();

    authServiceMock.getUserByDecodetoken.mockResolvedValue({ id: 1, account: 'roy' });
    walletUserServiceMock.listByUserId.mockResolvedValue([
      { id: 530, walletId: 144, userId: 58, name: 'Juni', isAdmin: true },
      { id: 531, walletId: 144, userId: 1, name: 'Roy', isAdmin: false },
    ]);

    await middleware.use(req, {} as any, next);

    expect(req.body.user).toEqual({ id: 1, account: 'roy' });
    expect(req.body.wallet_user[144]).toEqual({
      id: 531,
      wallet_id: 144,
      user_id: 1,
      name: 'Roy',
      is_admin: false,
    });
    expect(next).toHaveBeenCalled();
  });

  it('should inject wallet_user by member_token and call next', async () => {
    const middleware = createMiddleware();
    const req: any = {
      headers: {},
      body: { member_token: 'member-token' },
      query: {},
      params: { wallet: '144' },
    };
    const next = jest.fn();

    walletUserServiceMock.findByTokenAndWallet.mockResolvedValue({
      id: 530,
      walletId: 144,
      userId: 58,
      name: 'Juni',
      isAdmin: true,
    });
    userServiceMock.findOne.mockResolvedValue({ id: 58, account: 'juni' });

    await middleware.use(req, {} as any, next);

    expect(walletUserServiceMock.findByTokenAndWallet).toHaveBeenCalledWith('member-token', 144);
    expect(req.body.wallet_user[144]).toEqual({
      id: 530,
      wallet_id: 144,
      user_id: 58,
      name: 'Juni',
      is_admin: true,
    });
    expect(next).toHaveBeenCalled();
  });

  it('should throw unauthorized when member_token is missing', async () => {
    const middleware = createMiddleware();
    const req: any = {
      headers: {},
      body: {},
      query: {},
      params: { wallet: '144' },
    };

    await expect(middleware.use(req, {} as any, jest.fn())).rejects.toThrow(UnauthorizedException);
  });

  it('should throw unauthorized when bearer has no wallet users', async () => {
    const middleware = createMiddleware();
    const req: any = {
      headers: { authorization: 'Bearer jwt-token' },
      body: {},
      query: {},
      params: { wallet: '144' },
    };

    authServiceMock.getUserByDecodetoken.mockResolvedValue({ id: 1 });
    walletUserServiceMock.listByUserId.mockResolvedValue([]);

    await expect(middleware.use(req, {} as any, jest.fn())).rejects.toThrow(UnauthorizedException);
  });
});
