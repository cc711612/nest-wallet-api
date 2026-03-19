import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { WALLET_REPOSITORY } from './domain/repositories/wallet.repository';
import { FindAllWalletsDto } from './dto/find-all-wallets.dto';

describe('WalletService', () => {
  let service: WalletService;

  const walletRepositoryMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findUsersByWalletCode: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: WALLET_REPOSITORY,
          useValue: walletRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delegate findAll to wallet repository', async () => {
    const query: FindAllWalletsDto = { page: 1, perPage: 15 };
    const expected = {
      pagination: { total: 0, perPage: 15, currentPage: 1, lastPage: 0 },
      wallets: [],
    };
    walletRepositoryMock.findAll.mockResolvedValue(expected);

    const result = await service.findAll(query, 1);

    expect(walletRepositoryMock.findAll).toHaveBeenCalledWith(query, 1);
    expect(result).toEqual(expected);
  });

  it('should return deleted true after remove', async () => {
    walletRepositoryMock.remove.mockResolvedValue(undefined);

    const result = await service.remove(1);

    expect(walletRepositoryMock.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual({ deleted: true });
  });
});
