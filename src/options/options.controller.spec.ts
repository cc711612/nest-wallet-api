import { Test, TestingModule } from '@nestjs/testing';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';
import { CategoryService } from '../category/category.service';

describe('OptionsController', () => {
  let controller: OptionsController;
  const optionsServiceMock = {
    exchangeRate: jest.fn(),
  };
  const categoryServiceMock = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionsController],
      providers: [
        {
          provide: OptionsService,
          useValue: optionsServiceMock,
        },
        {
          provide: CategoryService,
          useValue: categoryServiceMock,
        },
      ],
    }).compile();

    controller = module.get<OptionsController>(OptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return exchange rate payload', () => {
    optionsServiceMock.exchangeRate.mockReturnValue({
      option: ['TWD'],
      rates: { TWD: 1 },
      updated_at: '2026-03-14',
    });

    const result = controller.exchangeRate('TWD');

    expect(optionsServiceMock.exchangeRate).toHaveBeenCalledWith('TWD');
    expect(result).toEqual({
      option: ['TWD'],
      rates: { TWD: 1 },
      updated_at: '2026-03-14',
    });
  });

  it('should map category fields to wallet-v2 shape', async () => {
    categoryServiceMock.findAll.mockResolvedValue([
      { id: 1, parentId: null, walletId: null, name: '餐飲', icon: null },
    ]);

    const result = await controller.category();

    expect(result).toEqual([
      { id: 1, parent_id: null, wallet_id: null, name: '餐飲', icon: null },
    ]);
  });
});
