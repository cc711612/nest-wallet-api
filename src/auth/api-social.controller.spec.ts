import { Test, TestingModule } from '@nestjs/testing';
import { ApiSocialController } from './api-social.controller';
import { SocialService } from './social.service';
import { AuthService } from './auth.service';

describe('ApiSocialController', () => {
  let controller: ApiSocialController;

  const socialServiceMock = {
    checkBind: jest.fn(),
    consumeBindTokenUserId: jest.fn(),
    bind: jest.fn(),
    unBind: jest.fn(),
  };

  const authServiceMock = {
    thirdPartyLoginByUserId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiSocialController],
      providers: [
        { provide: SocialService, useValue: socialServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    controller = module.get<ApiSocialController>(ApiSocialController);
  });

  it('should return action/token when social not bound', async () => {
    socialServiceMock.checkBind.mockResolvedValue({ action: 'not bind', token: 'tok' });

    const result = await controller.checkBind({ socialType: 9, socialTypeValue: 'line-id' });

    expect(result).toEqual({ action: 'not bind', token: 'tok' });
  });

  it('should return login payload when social bound', async () => {
    socialServiceMock.checkBind.mockResolvedValue({ action: 'bind', token: 'tok' });
    socialServiceMock.consumeBindTokenUserId.mockReturnValue(1);
    authServiceMock.thirdPartyLoginByUserId.mockResolvedValue({
      id: 1,
      name: 'roy',
      memberToken: 'member-token',
      jwt: 'jwt-token',
      wallet: { id: 66, code: 'zfTMK6Dh' },
      walletUsers: [],
      devices: [],
      notifies: [],
    });

    const result = await controller.checkBind({ socialType: 9, socialTypeValue: 'line-id' });

    expect(result).toEqual({
      id: 1,
      name: 'roy',
      member_token: 'member-token',
      jwt: 'jwt-token',
      wallet: { id: 66, code: 'zfTMK6Dh' },
      walletUsers: [],
      devices: [],
      notifies: [],
      action: 'bind',
    });
  });
});
