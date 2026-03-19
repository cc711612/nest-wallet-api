import { Test, TestingModule } from '@nestjs/testing';
import { ApiWalletController } from './api-wallet.controller';
import { WalletService } from './wallet.service';

describe('ApiWalletController', () => {
  let controller: ApiWalletController;
  const walletServiceMock = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiWalletController],
      providers: [
        {
          provide: WalletService,
          useValue: walletServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ApiWalletController>(ApiWalletController);
  });

  it('should map page_count to perPage on index endpoint', async () => {
    walletServiceMock.findAll.mockResolvedValue({
      pagination: { total: 1, perPage: 15, currentPage: 1, lastPage: 1 },
      wallets: [
        {
          id: 1,
          title: '測試帳本',
          code: 'abc12345',
          status: 1,
          unit: 'TWD',
          mode: 'multi',
          properties: { unitConfigurable: false, decimalPlaces: 0 },
          users: { id: 1, name: 'roy' },
          createdAt: '2026-03-14 00:00:00',
          updatedAt: '2026-03-14 00:00:00',
        },
      ],
    });

    const result = await controller.index({ page: 1, page_count: 15 }, { id: 9 } as any);

    expect(walletServiceMock.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, perPage: 15 }),
      9,
    );
    expect(result).toEqual({
      paginate: { total: 1, per_page: 15, current_page: 1, last_page: 1 },
      wallets: [
        {
          id: 1,
          title: '測試帳本',
          code: 'abc12345',
          status: 1,
          unit: 'TWD',
          mode: 'multi',
          properties: { unitConfigurable: false, decimalPlaces: 0 },
          user: { id: 1, name: 'roy' },
          created_at: '2026-03-14 00:00:00',
          updated_at: '2026-03-14 00:00:00',
        },
      ],
    });
  });
});
