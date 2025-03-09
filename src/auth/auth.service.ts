import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { WalletUserService } from '../wallet/wallet-user.service';
import { UserTransformer } from './user.transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly walletUserService: WalletUserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { account, password } = loginDto;
    const user = await this.userService.findByAccount(account);
    if (!user) {
      throw new UnauthorizedException('用戶不存在');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('密碼有誤');
    }
    const token = this.generateToken(user);
    const userWithWallet = await this.userService.findUserWithWallet(user.id);
    if (!userWithWallet) {
      throw new UnauthorizedException('用戶錢包不存在');
    }
    userWithWallet.jwt = token;
    userWithWallet.notifies = await this.walletUserService.getWalletUsers(user.id);
    return UserTransformer.transform(userWithWallet);
  }

  async thirdPartyLogin(loginDto: LoginDto) {
    // Implement third-party login logic here
    // For example, you might validate the third-party token and then find or create a user in your system
    const { account, password } = loginDto;
    const user = await this.userService.findByAccount(account);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    // Validate third-party token (this is just a placeholder, implement your own logic)
    // const isValidToken = token === 'valid-token';
    // if (!isValidToken) {
    //   throw new UnauthorizedException('Invalid third-party token');
    // }
    const jwt = this.generateToken(user);
    user.jwt = jwt;
    return UserTransformer.transform(user);
  }

  async checkBind(checkBindDto: any) {
    // Implement check bind logic here
    // For example, you might check if a user is bound to a specific service
    const { account, service } = checkBindDto;
    const user = await this.userService.findByAccount(account);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    // Check if user is bound to the service (this is just a placeholder, implement your own logic)
    const isBound = service === 'bound-service';
    return { isBound };
  }

  private generateToken(user: any) {
    const payload = {
      iss: process.env.APP_URL,
      aud: process.env.APP_URL,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
      user: {
        id: user.id,
        account: user.account,
        name: user.name,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    };
    const secretKey = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.sign(payload, { secret: secretKey, algorithm: 'HS256' });
  }

  async register(registerDto: RegisterDto) {
    try {
      const { account, name, password } = registerDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      return {
        message: 'User registered successfully',
        user: {
          account,
          name,
          password: hashedPassword,
        },
      };
    } catch (error: any) {
      throw new Error(error?.message || 'Registration failed');
    }
  }
}