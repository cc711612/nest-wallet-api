import { Test, TestingModule } from '@nestjs/testing';
import { ApiDeviceController } from './api-device.controller';
import { DeviceService } from './device.service';

describe('ApiDeviceController', () => {
  let controller: ApiDeviceController;
  const deviceServiceMock = {
    findDevicesByUserId: jest.fn(),
    store: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiDeviceController],
      providers: [
        {
          provide: DeviceService,
          useValue: deviceServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ApiDeviceController>(ApiDeviceController);
  });

  it('should return devices by user id', async () => {
    deviceServiceMock.findDevicesByUserId.mockResolvedValue({
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

    const result = await controller.index({ id: 1 } as any);

    expect(deviceServiceMock.findDevicesByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      devices: [
        {
          id: 1,
          platform: 'ios',
          device_name: 'iPhone',
          device_type: 'mobile',
          fcm_token: 'abc',
          expired_at: '2099-01-01 00:00:00',
        },
      ],
    });
  });

  it('should store device with user id fallback', async () => {
    deviceServiceMock.store.mockResolvedValue({});

    const result = await controller.store(
      {
        wallet_user_id: 190,
        platform: 'ios',
        device_name: 'iPhone',
        device_type: 'mobile',
        fcm_token: 'abc',
      } as any,
      { id: 1 } as any,
    );

    expect(deviceServiceMock.store).toHaveBeenCalledWith({
      wallet_user_id: 190,
      user_id: 1,
      platform: 'ios',
      device_name: 'iPhone',
      device_type: 'mobile',
      fcm_token: 'abc',
    });
    expect(result).toEqual({});
  });
});
