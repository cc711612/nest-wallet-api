import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { WalletUserService } from '../wallet/wallet-user.service';
import { UserService } from '../user/user.service';

interface CustomRequest extends Request {
  body: Record<string, any>;
}

@Injectable()
export class VerifyWalletMemberApiMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly walletUserService: WalletUserService,
    private readonly userService: UserService,
  ) {}

  async use(req: CustomRequest, _res: Response, next: NextFunction) {
    if (!req.body) {
      req.body = {};
    }

    const walletId = Number(req.params?.wallet ?? 1);
    const bearerToken = this.getBearerToken(req);
    if (bearerToken !== '') {
      try {
        const user = await this.authService.getUserByDecodetoken(bearerToken);
        if (!user) {
          throw new UnauthorizedException('請重新登入');
        }
        const walletUsers = await this.walletUserService.listByUserId(Number(user.id));

        if (walletUsers.length === 0) {
          throw new UnauthorizedException('請重新登入');
        }

        req.body.user = user;
        req.body.wallet_user = this.toWalletUserMap(walletUsers);
        return next();
      } catch (_error) {
        throw new UnauthorizedException('請重新登入');
      }
    }

    const memberToken = this.getMemberToken(req);
    if (memberToken === '') {
      throw new UnauthorizedException('請帶入 member_token');
    }

    const walletUser = await this.walletUserService.findByTokenAndWallet(memberToken, walletId);
    if (!walletUser) {
      throw new UnauthorizedException('請重新登入');
    }

    const user = await this.userService.findOne(walletUser.userId);
    req.body.user = user ?? { id: walletUser.userId };
    req.body.member_token = memberToken;
    req.body.wallet_user = {
      [walletId]: {
        id: walletUser.id,
        wallet_id: walletUser.walletId,
        user_id: walletUser.userId,
        name: walletUser.name ?? '',
        is_admin: walletUser.isAdmin,
      },
    };

    return next();
  }

  private toWalletUserMap(walletUsers: Array<{ id: number; walletId: number; userId: number; name?: string; isAdmin: boolean }>) {
    return walletUsers.reduce<Record<number, Record<string, any>>>((acc, item) => {
      acc[item.walletId] = {
        id: item.id,
        wallet_id: item.walletId,
        user_id: item.userId,
        name: item.name ?? '',
        is_admin: item.isAdmin,
      };
      return acc;
    }, {});
  }

  private getBearerToken(req: Request): string {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return '';
    }
    const [type, token] = authHeader.split(' ');
    if (type?.toLowerCase() !== 'bearer' || !token) {
      return '';
    }
    return token;
  }

  private getMemberToken(req: Request): string {
    const bodyToken = (req.body?.member_token ?? '') as string;
    if (bodyToken) {
      return String(bodyToken);
    }
    const queryToken = (req.query?.member_token ?? '') as string;
    return String(queryToken || '');
  }
}
