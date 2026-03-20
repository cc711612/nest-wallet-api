import { UnauthorizedException } from '@nestjs/common';
import { VerifyApiMiddleware } from './verify-api.middleware';

describe('VerifyApiMiddleware', () => {
  const authServiceMock = {
    getUserByDecodetoken: jest.fn(),
  };

  const userServiceMock = {
    findByToken: jest.fn(),
  };

  const createMiddleware = () =>
    new VerifyApiMiddleware(authServiceMock as any, userServiceMock as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject user and call next when bearer jwt is valid', async () => {
    const middleware = createMiddleware();
    const req: any = {
      headers: { authorization: 'Bearer jwt-token' },
      body: {},
      query: {},
    };
    const next = jest.fn();
    authServiceMock.getUserByDecodetoken.mockResolvedValue({ id: 1, account: 'roy' });

    await middleware.use(req, {} as any, next);

    expect(authServiceMock.getUserByDecodetoken).toHaveBeenCalledWith('jwt-token');
    expect(req.body.user).toEqual({ id: 1, account: 'roy' });
    expect(next).toHaveBeenCalled();
  });

  it('should inject user and call next when member_token is valid', async () => {
    const middleware = createMiddleware();
    const req: any = {
      headers: {},
      body: { member_token: 'member-token' },
      query: {},
    };
    const next = jest.fn();
    userServiceMock.findByToken.mockResolvedValue({ id: 2, account: 'member' });

    await middleware.use(req, {} as any, next);

    expect(userServiceMock.findByToken).toHaveBeenCalledWith('member-token');
    expect(req.body.user).toEqual({ id: 2, account: 'member' });
    expect(next).toHaveBeenCalled();
  });

  it('should throw unauthorized when token is missing', async () => {
    const middleware = createMiddleware();
    const req: any = {
      headers: {},
      body: {},
      query: {},
    };

    await expect(middleware.use(req, {} as any, jest.fn())).rejects.toThrow(UnauthorizedException);
  });

  it('should throw unauthorized when bearer jwt is invalid', async () => {
    const middleware = createMiddleware();
    const req: any = {
      headers: { authorization: 'Bearer bad-token' },
      body: {},
      query: {},
    };
    authServiceMock.getUserByDecodetoken.mockRejectedValue(new UnauthorizedException('bad token'));

    await expect(middleware.use(req, {} as any, jest.fn())).rejects.toThrow(UnauthorizedException);
  });
});
