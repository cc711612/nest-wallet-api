// Import necessary modules and dependencies for testing
import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FindAllWalletsDto } from './dto/find-all-wallets.dto';
import { DecodedUserDto } from '../auth/dto/decoded-user.dto';

describe('WalletController', () => {
  let controller: WalletController;
  let service: WalletService;

  // Set up the testing module and mock dependencies before each test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: WalletService,
          useValue: {
            create: jest.fn(), // Mock the create method
            findAll: jest.fn(), // Mock the findAll method
            findOne: jest.fn(), // Mock the findOne method
            update: jest.fn(), // Mock the update method
            remove: jest.fn(), // Mock the remove method
            findUsersByWalletCode: jest.fn(), // Mock the findUsersByWalletCode method
          },
        },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
    service = module.get<WalletService>(WalletService);
  });

  // Test to ensure the controller is defined
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    // Test the create method of the controller
    it('should call service.create with correct parameters', async () => {
      const dto: CreateWalletDto = {
        title: 'Test Wallet',
        userId: 1,
        code: 'test-code',
        unit: 'TWD',
        unitConfigurable: false,
        decimalPlaces: 0,
        status: 1,
      };
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    // Test the findAll method of the controller
    it('should call service.findAll with correct parameters', async () => {
      const query: FindAllWalletsDto = { page: 1, perPage: 10 };
      const user: DecodedUserDto = { id: 1, name: 'Test User' };
      await controller.findAll(query, user);
      expect(service.findAll).toHaveBeenCalledWith(query, user.id);
    });
  });

  describe('findOne', () => {
    // Test the findOne method of the controller
    it('should call service.findOne with correct parameters', async () => {
      const id = '1';
      const user: DecodedUserDto = { id: 1, name: 'Test User' };
      await controller.findOne(id, user);
      expect(service.findOne).toHaveBeenCalledWith(Number(id), user.id);
    });
  });

  describe('update', () => {
    // Test the update method of the controller
    it('should call service.update with correct parameters', async () => {
      const id = '1';
      const dto: CreateWalletDto = {
        title: 'Updated Wallet',
        userId: 1,
        code: 'updated-code',
        unit: 'USD',
        unitConfigurable: true,
        decimalPlaces: 2,
        status: 1,
      };
      await controller.update(id, dto);
      expect(service.update).toHaveBeenCalledWith(Number(id), dto);
    });
  });

  describe('remove', () => {
    // Test the remove method of the controller
    it('should call service.remove with correct parameters', async () => {
      const id = '1';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(Number(id));
    });
  });

  describe('findUsersByWalletCode', () => {
    it('should call service.findUsersByWalletCode with correct parameters', async () => {
      const code = 'test-code';
      const result = {
        wallet: {
          users: [
            {
              id: 522,
              name: 'Juni',
              userId: 58,
              isAdmin: true,
              notifyEnable: true,
            },
            {
              id: 523,
              name: 'Roy',
              userId: 1,
              isAdmin: false,
              notifyEnable: true,
            },
          ],
        },
      };

      jest.spyOn(service, 'findUsersByWalletCode').mockResolvedValue(result);

      const response = await controller.findUsersByWalletCode(code);
      expect(service.findUsersByWalletCode).toHaveBeenCalledWith(code);
      expect(response).toEqual(result);
    });
  });
});