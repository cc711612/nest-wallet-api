import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

interface CustomRequest extends Request {
  user?: any;
  body: Record<string, any>;
}

@Injectable()
export class VerifyApiMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async use(req: CustomRequest, _res: Response, next: NextFunction) {
    if (!req.body) {
      req.body = {};
    }

    const bearerToken = this.getBearerToken(req);
    if (bearerToken !== '') {
      try {
        const user = await this.authService.getUserByDecodetoken(bearerToken);
        if (!user) {
          throw new UnauthorizedException('請重新登入');
        }
        req.body.user = user;
        return next();
      } catch (_error) {
        throw new UnauthorizedException('請重新登入');
      }
    }

    const memberToken = this.getMemberToken(req);
    if (memberToken === '') {
      throw new UnauthorizedException('請帶入 member_token');
    }

    const user = await this.userService.findByToken(memberToken);
    if (!user) {
      throw new UnauthorizedException('請重新登入');
    }

    req.body.user = user;
    return next();
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
