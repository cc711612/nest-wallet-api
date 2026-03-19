import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { WalletUserService } from '../wallet/wallet-user.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            findByAccount: jest.fn(),
          },
        },
        {
          provide: WalletUserService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const envMap: Record<string, string> = {
                JWT_SECRET: 'nest-secret',
              };
              return envMap[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should verify token with shared JWT_SECRET', async () => {
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      const envMap: Record<string, string> = {
        JWT_SECRET: 'shared-secret',
      };
      return envMap[key];
    });
    jest.spyOn(jwtService, 'verify').mockImplementationOnce(() => ({ user: { account: 'roy' } }));

    const decoded = await service.decodeToken('jwt-token');

    expect(jwtService.verify).toHaveBeenCalledWith('jwt-token', {
      secret: 'shared-secret',
      algorithms: ['HS256'],
    });
    expect(decoded).toEqual({ user: { account: 'roy' } });
  });

  it('should resolve user by account when token user id is encrypted', async () => {
    jest.spyOn(service, 'decodeToken').mockResolvedValue({ user: { id: 'encrypted', account: 'roy' } });
    jest.spyOn(userService, 'findByAccount').mockResolvedValue({ id: 1, account: 'roy' } as any);

    const user = await service.getUserByDecodetoken('jwt-token');

    expect(userService.findByAccount).toHaveBeenCalledWith('roy');
    expect(user).toEqual({ id: 1, account: 'roy' });
  });

  it('should throw UnauthorizedException when token has no resolvable user', async () => {
    jest.spyOn(service, 'decodeToken').mockResolvedValue({ user: {} });

    await expect(service.getUserByDecodetoken('jwt-token')).rejects.toThrow(UnauthorizedException);
  });
});
