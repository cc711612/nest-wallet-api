import { Test, TestingModule } from '@nestjs/testing';
import { ApiWalletUserController } from './api-wallet-user.controller';
import { WalletService } from './wallet.service';

describe('ApiWalletUserController', () => {
  let controller: ApiWalletUserController;
  const walletServiceMock = {
    findUsersByWalletCode: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiWalletUserController],
      providers: [
        {
          provide: WalletService,
          useValue: walletServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ApiWalletUserController>(ApiWalletUserController);
  });

  it('should map wallet user fields to wallet-v2 format', async () => {
    walletServiceMock.findUsersByWalletCode.mockResolvedValue({
      wallet: {
        users: [
          {
            id: 190,
            name: 'roy',
            userId: 1,
            isAdmin: true,
            notifyEnable: true,
          },
        ],
      },
    });

    const result = await controller.index({ code: 'zfTMK6Dh' });

    expect(walletServiceMock.findUsersByWalletCode).toHaveBeenCalledWith('zfTMK6Dh');
    expect(result).toEqual({
      wallet: {
        users: [
          {
            id: 190,
            name: 'roy',
            user_id: 1,
            is_admin: true,
            notify_enable: true,
          },
        ],
      },
    });
  });
});
