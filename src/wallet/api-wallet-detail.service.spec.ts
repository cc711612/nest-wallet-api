import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApiWalletDetailService } from './api-wallet-detail.service';
import { Wallet } from './entities/wallet.entity';
import { WalletDetails } from './entities/wallet-details.entity';
import { WalletUser } from './entities/wallet-user.entity';

describe('ApiWalletDetailService', () => {
  let service: ApiWalletDetailService;

  const walletRepositoryMock = { findOne: jest.fn() };
  const walletDetailsRepositoryMock = { find: jest.fn() };
  const walletUserRepositoryMock = { find: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiWalletDetailService,
        { provide: getRepositoryToken(Wallet), useValue: walletRepositoryMock },
        { provide: getRepositoryToken(WalletDetails), useValue: walletDetailsRepositoryMock },
        { provide: getRepositoryToken(WalletUser), useValue: walletUserRepositoryMock },
      ],
    }).compile();

    service = module.get<ApiWalletDetailService>(ApiWalletDetailService);
  });

  it('should return wallet detail aggregate result', async () => {
    walletRepositoryMock.findOne.mockResolvedValue({
      id: 66,
      code: 'zfTMK6Dh',
      title: '澎湖',
      status: 1,
      unit: 'TWD',
      properties: {},
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
    });
    walletDetailsRepositoryMock.find.mockResolvedValue([]);
    walletUserRepositoryMock.find.mockResolvedValue([]);

    const result = await service.index(66, 1);

    expect(result.wallet.id).toBe(66);
    expect(result.wallet.details).toEqual([]);
    expect(result.wallet.total).toEqual({ income: 0, expenses: 0 });
  });
});
