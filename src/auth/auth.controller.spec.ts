import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CheckBindDto } from './dto/check-bind.dto';
import { UserDto } from './dto/user.dto';

jest.mock('./auth.service');

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return result on successful login', async () => {
      const loginDto: LoginDto = { account: 'test', password: 'password' };
      const mockResult: UserDto = {
        id: 1,
        name: 'test',
        memberToken: 'mockMemberToken',
        jwt: 'mockJwt',
        wallet: { id: 1, code: 'mockCode' },
        walletUsers: [],
        devices: [],
        notifies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(authService, 'login').mockResolvedValue(Promise.resolve(mockResult));

      const result = await controller.login(loginDto);
      expect(result).toEqual(mockResult);
    });

    it('should throw UnauthorizedException on failed login', async () => {
      const loginDto: LoginDto = { account: 'test', password: 'wrongPassword' };
      jest.spyOn(authService, 'login').mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should return result on successful registration', async () => {
      const registerDto: RegisterDto = { account: 'test', name: 'Test User', password: 'password' };
      const mockResult = {
        message: 'User registered successfully',
        user: {
          account: 'test',
          name: 'Test User',
          password: 'password',
        },
      };
      jest.spyOn(authService, 'register').mockResolvedValue(mockResult);

      const result = await controller.register(registerDto);
      expect(result).toEqual(mockResult);
    });

    it('should throw an error on failed registration', async () => {
      const registerDto: RegisterDto = { account: 'test', name: 'Test User', password: 'password' };
      jest.spyOn(authService, 'register').mockRejectedValue(new Error('Registration failed'));

      await expect(controller.register(registerDto)).rejects.toThrow('Registration failed');
    });
  });
});
