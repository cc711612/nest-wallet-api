import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

interface CustomRequest extends Request {
  user?: any;
}

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    try {
      const user = await this.authService.getUserByDecodetoken(token);
      if (!req.body) {
        req.body = {};
      }
      req.body.user = user; // 將 user 資訊附加到 req.body 中
      next();
    } catch (err) {
      console.log('err', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}