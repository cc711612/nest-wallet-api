import { Test, TestingModule } from '@nestjs/testing';
import { ApiWalletMemberController } from './api-wallet-member.controller';
import { WalletUserService } from './wallet-user.service';

describe('ApiWalletMemberController', () => {
  let controller: ApiWalletMemberController;
  const walletUserServiceMock = {
    updateCompat: jest.fn(),
    softDelete: jest.fn(),
    softDeleteCompat: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiWalletMemberController],
      providers: [
        {
          provide: WalletUserService,
          useValue: walletUserServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ApiWalletMemberController>(ApiWalletMemberController);
  });

  it('should map update response to wallet-v2 format', async () => {
    walletUserServiceMock.updateCompat.mockResolvedValue({
      id: 190,
      name: 'Roy',
      notifyEnable: true,
    });

    const result = await controller.update('190', { name: 'Roy', notify_enable: true });

    expect(walletUserServiceMock.updateCompat).toHaveBeenCalledWith(190, {
      name: 'Roy',
      notifyEnable: true,
    });
    expect(result).toEqual({
      wallet_user_id: 190,
      name: 'Roy',
      notify_enable: true,
    });
  });

  it('should map delete response to wallet-v2 format', async () => {
    walletUserServiceMock.softDeleteCompat.mockResolvedValue(undefined);

    const result = await controller.destroy('66', '190');

    expect(walletUserServiceMock.softDeleteCompat).toHaveBeenCalledWith(190);
    expect(result).toEqual({
      wallet_id: 66,
      wallet_user_id: 190,
      deleted: true,
    });
  });
});
