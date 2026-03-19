import { Test, TestingModule } from '@nestjs/testing';
import { ApiWalletAuthController } from './api-wallet-auth.controller';
import { ApiWalletAuthService } from './api-wallet-auth.service';

describe('ApiWalletAuthController', () => {
  let controller: ApiWalletAuthController;
  const serviceMock = {
    login: jest.fn(),
    tokenLogin: jest.fn(),
    register: jest.fn(),
    registerBatch: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiWalletAuthController],
      providers: [
        {
          provide: ApiWalletAuthService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ApiWalletAuthController>(ApiWalletAuthController);
  });

  it('should call login service', async () => {
    serviceMock.login.mockResolvedValue({ id: 190 });
    const result = await controller.login({ code: 'zfTMK6Dh', name: 'Roy' });
    expect(serviceMock.login).toHaveBeenCalledWith('zfTMK6Dh', 'Roy');
    expect(result).toEqual({ id: 190 });
  });

  it('should call token login service', async () => {
    serviceMock.tokenLogin.mockResolvedValue({ id: 190 });
    const result = await controller.token({ code: 'zfTMK6Dh', member_token: 'token' });
    expect(serviceMock.tokenLogin).toHaveBeenCalledWith('zfTMK6Dh', 'token');
    expect(result).toEqual({ id: 190 });
  });

  it('should call register service', async () => {
    serviceMock.register.mockResolvedValue({ id: 600 });
    const result = await controller.register({ code: 'zfTMK6Dh', name: 'new-user' });
    expect(serviceMock.register).toHaveBeenCalledWith('zfTMK6Dh', 'new-user');
    expect(result).toEqual({ id: 600 });
  });

  it('should call register batch service', async () => {
    serviceMock.registerBatch.mockResolvedValue({});
    const result = await controller.registerBatch({ code: 'zfTMK6Dh', name: ['a', 'b'] });
    expect(serviceMock.registerBatch).toHaveBeenCalledWith('zfTMK6Dh', ['a', 'b']);
    expect(result).toEqual({});
  });
});
