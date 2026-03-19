import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { DEVICE_REPOSITORY } from './domain/repositories/device.repository';
import { WalletUserService } from '../wallet/wallet-user.service';

describe('DeviceService', () => {
  let service: DeviceService;

  const deviceRepositoryMock = {
    findByUserId: jest.fn(),
    findByWalletUserId: jest.fn(),
    findIdByTokenAndOwner: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };
  const walletUserServiceMock = {
    findByWalletAndUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: DEVICE_REPOSITORY,
          useValue: deviceRepositoryMock,
        },
        {
          provide: WalletUserService,
          useValue: walletUserServiceMock,
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
  });

  it('should wrap repository result as devices object', async () => {
    walletUserServiceMock.findByWalletAndUser.mockResolvedValue({ id: 190 });
    deviceRepositoryMock.findByWalletUserId.mockResolvedValue([
      {
        id: 1,
        userId: 1,
        walletUserId: 2,
        platform: 'ios',
        deviceName: 'iPhone',
        deviceType: 'mobile',
        fcmToken: 'abc',
        expiredAt: new Date('2099-01-01T00:00:00Z'),
      },
    ]);

    const result = await service.findDevicesByUserId(1);

    expect(walletUserServiceMock.findByWalletAndUser).toHaveBeenCalledWith(1, 1);
    expect(deviceRepositoryMock.findByWalletUserId).toHaveBeenCalledWith(190);
    expect(result).toEqual({
      devices: [
        {
          id: 1,
          userId: 1,
          walletUserId: 2,
          platform: 'ios',
          deviceName: 'iPhone',
          deviceType: 'mobile',
          fcmToken: 'abc',
          expiredAt: new Date('2099-01-01T00:00:00.000Z'),
        },
      ],
    });
  });

  it('should update existing device when token-owner match found', async () => {
    deviceRepositoryMock.findIdByTokenAndOwner.mockResolvedValue(99);

    const result = await service.store({
      wallet_user_id: 190,
      user_id: 1,
      platform: 'ios',
      device_name: 'iPhone',
      device_type: 'mobile',
      fcm_token: 'abc',
      expired_at: '2099-01-01T00:00:00.000Z',
    });

    expect(deviceRepositoryMock.findIdByTokenAndOwner).toHaveBeenCalledWith('abc', 190, 1);
    expect(deviceRepositoryMock.update).toHaveBeenCalled();
    expect(deviceRepositoryMock.create).not.toHaveBeenCalled();
    expect(result).toEqual({});
  });

  it('should create device when token-owner match not found', async () => {
    deviceRepositoryMock.findIdByTokenAndOwner.mockResolvedValue(null);

    await service.store({
      wallet_user_id: 190,
      user_id: 1,
      platform: 'ios',
      device_name: 'iPhone',
      device_type: 'mobile',
      fcm_token: 'abc',
    });

    expect(deviceRepositoryMock.create).toHaveBeenCalled();
    expect(deviceRepositoryMock.update).not.toHaveBeenCalled();
  });
});
