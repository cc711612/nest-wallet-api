import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { wrappedOk, wrappedUnauthorized } from '../common/swagger/wrapped-response';
import { toWalletV2LoginShape } from './auth-response.mapper';

@ApiTags('api-auth')
@Controller('api/auth')
export class ApiAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '相容 wallet-v2 的登入路由' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse(
    wrappedOk('登入成功', {
      id: 1,
      name: 'Roy',
      member_token: 'member-token',
      jwt: 'jwt-token',
      wallet: { id: 66, code: 'zfTMK6Dh' },
      walletUsers: [],
      devices: [],
      notifies: [],
    }),
  )
  @ApiUnauthorizedResponse(wrappedUnauthorized('密碼有誤'))
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    if (!result) {
      throw new UnauthorizedException('密碼有誤');
    }

    return toWalletV2LoginShape(result as Record<string, any>);
  }
}
