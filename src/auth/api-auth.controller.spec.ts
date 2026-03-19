import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ApiAuthController } from './api-auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('ApiAuthController', () => {
  let controller: ApiAuthController;
  const authServiceMock = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiAuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ApiAuthController>(ApiAuthController);
  });

  it('should return login result', async () => {
    const dto: LoginDto = { account: 'roy', password: 'aq850916' };
    authServiceMock.login.mockResolvedValue({
      id: 1,
      name: 'roy',
      memberToken: 'member-token',
      jwt: 'jwt-token',
      wallet: { id: 66, code: 'zfTMK6Dh' },
      walletUsers: [
        {
          id: 190,
          walletId: 66,
          userId: 1,
          name: 'roy',
          token: 'member-token',
          isAdmin: true,
          notifyEnable: true,
          createdAt: '2023-04-28 10:23:00',
          updatedAt: '2026-03-02 11:50:54',
          deletedAt: null,
        },
      ],
      devices: [],
      notifies: [
        {
          id: 190,
          name: 'roy',
          walletId: 66,
          notifyEnable: true,
          wallets: { id: 66, code: 'zfTMK6Dh' },
        },
      ],
    });

    const result = await controller.login(dto);

    expect(authServiceMock.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      id: 1,
      name: 'roy',
      member_token: 'member-token',
      jwt: 'jwt-token',
      wallet: { id: 66, code: 'zfTMK6Dh' },
      walletUsers: [
        {
          id: 190,
          wallet_id: 66,
          user_id: 1,
          name: 'roy',
          token: 'member-token',
          is_admin: true,
          notify_enable: true,
          agent: '',
          ip: '',
          created_at: '2023-04-28 10:23:00',
          updated_at: '2026-03-02 11:50:54',
          deleted_at: null,
        },
      ],
      devices: [],
      notifies: [
        {
          id: 190,
          name: 'roy',
          wallet_id: 66,
          notify_enable: true,
          wallets: { id: 66, code: 'zfTMK6Dh' },
        },
      ],
    });
  });

  it('should throw unauthorized when auth service returns empty result', async () => {
    authServiceMock.login.mockResolvedValue(undefined);

    await expect(controller.login({ account: 'roy', password: 'bad' })).rejects.toThrow(UnauthorizedException);
  });
});
