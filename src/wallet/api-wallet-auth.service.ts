import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Wallet } from './entities/wallet.entity';
import { WalletUser } from './entities/wallet-user.entity';
import { Device } from '../device/entities/device.entity';

@Injectable()
export class ApiWalletAuthService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletUser)
    private readonly walletUserRepository: Repository<WalletUser>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(code: string, name: string) {
    const wallet = await this.findWalletByCodeOrThrow(code);
    const walletUser = await this.walletUserRepository.findOne({
      where: { walletId: wallet.id, name, deletedAt: IsNull() },
    });

    if (!walletUser) {
      throw new BadRequestException('此用戶不存在');
    }
    if (walletUser.isAdmin) {
      throw new UnauthorizedException('管理者不得使用此方式登入');
    }

    const memberToken = randomBytes(32).toString('hex');
    await this.walletUserRepository.update(walletUser.id, { token: memberToken });

    const refreshed = await this.walletUserRepository.findOne({ where: { id: walletUser.id } });
    const effective = refreshed ?? walletUser;

    return {
      id: effective.id,
      name: effective.name,
      wallet_id: wallet.id,
      member_token: memberToken,
      jwt: this.makeWalletUserJwt(effective),
      wallet: {
        id: wallet.id,
        code: wallet.code,
      },
      devices: await this.listDevicesByWalletUserId(effective.id),
      notifies: [this.makeNotify(effective, wallet)],
    };
  }

  async tokenLogin(code: string, memberToken: string) {
    const wallet = await this.findWalletByCodeOrThrow(code);
    const walletUser = await this.walletUserRepository.findOne({
      where: { walletId: wallet.id, token: memberToken, deletedAt: IsNull() },
    });

    if (!walletUser) {
      throw new BadRequestException('此token不存在');
    }
    if (walletUser.isAdmin) {
      throw new UnauthorizedException('管理者不得使用此方式登入');
    }

    return {
      id: walletUser.id,
      name: walletUser.name,
      wallet_id: wallet.id,
      member_token: walletUser.token,
      wallet: {
        id: wallet.id,
        code: wallet.code,
      },
    };
  }

  async register(code: string, name: string) {
    const wallet = await this.findWalletByCodeOrThrow(code);

    const exists = await this.walletUserRepository.exists({
      where: { walletId: wallet.id, name, deletedAt: IsNull() },
    });
    if (exists) {
      throw new BadRequestException('名稱已存在');
    }

    const memberToken = randomBytes(32).toString('hex');
    const created = await this.walletUserRepository.save(
      this.walletUserRepository.create({
        walletId: wallet.id,
        name,
        token: memberToken,
        isAdmin: false,
        notifyEnable: false,
      }),
    );

    return {
      id: created.id,
      name: created.name,
      member_token: created.token,
      jwt: null,
      wallet: {
        id: wallet.id,
        code: wallet.code,
      },
      walletUsers: [],
      devices: [],
      notifies: [],
    };
  }

  async registerBatch(code: string, names: string[]) {
    const wallet = await this.findWalletByCodeOrThrow(code);
    const uniqueNames = Array.from(new Set(names.filter((name) => name.trim() !== '')));

    if (uniqueNames.length === 0) {
      return {};
    }

    const rows = uniqueNames.map((name) =>
      this.walletUserRepository.create({
        walletId: wallet.id,
        name,
        token: randomBytes(32).toString('hex'),
        isAdmin: false,
        notifyEnable: false,
      }),
    );

    await this.walletUserRepository.save(rows);

    return {};
  }

  private async findWalletByCodeOrThrow(code: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { code, deletedAt: IsNull() } });
    if (!wallet) {
      throw new BadRequestException('此帳簿不存在');
    }
    return wallet;
  }

  private async listDevicesByWalletUserId(walletUserId: number) {
    const devices = await this.deviceRepository.find({
      where: {
        walletUserId,
        expiredAt: MoreThan(new Date()),
        deletedAt: IsNull(),
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    return devices.map((device) => ({
      id: device.id,
      user_id: device.userId,
      wallet_user_id: device.walletUserId,
      platform: device.platform,
      device_name: device.deviceName,
      device_type: device.deviceType,
      fcm_token: device.fcmToken,
      expired_at: device.expiredAt,
    }));
  }

  private makeNotify(walletUser: WalletUser, wallet: Wallet) {
    return {
      id: walletUser.id,
      name: walletUser.name,
      wallet_id: walletUser.walletId,
      notify_enable: walletUser.notifyEnable,
      wallets: {
        id: wallet.id,
        code: wallet.code,
      },
    };
  }

  private makeWalletUserJwt(walletUser: WalletUser): string {
    const payload = {
      iss: this.configService.get<string>('APP_URL') || process.env.APP_URL,
      aud: 'https://easysplit.usongrat.tw',
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
      wallet_user: {
        id: walletUser.id,
        name: walletUser.name,
        created_at: walletUser.createdAt,
        updated_at: walletUser.updatedAt,
      },
    };
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.sign(payload, { secret, algorithm: 'HS256', expiresIn: '1y' });
  }
}
