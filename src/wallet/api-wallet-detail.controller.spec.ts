import { Test, TestingModule } from '@nestjs/testing';
import { ApiWalletDetailController } from './api-wallet-detail.controller';
import { ApiWalletDetailService } from './api-wallet-detail.service';

describe('ApiWalletDetailController', () => {
  let controller: ApiWalletDetailController;
  const apiWalletDetailServiceMock = {
    index: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiWalletDetailController],
      providers: [
        {
          provide: ApiWalletDetailService,
          useValue: apiWalletDetailServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ApiWalletDetailController>(ApiWalletDetailController);
  });

  it('should call service index with wallet id and user id', async () => {
    apiWalletDetailServiceMock.index.mockResolvedValue({ wallet: { id: 66 } });

    const result = await controller.index('66', { id: 1 } as any);

    expect(apiWalletDetailServiceMock.index).toHaveBeenCalledWith(66, 1);
    expect(result).toEqual({ wallet: { id: 66 } });
  });
});
