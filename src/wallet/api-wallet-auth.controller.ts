import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiWalletAuthService } from './api-wallet-auth.service';
import { ApiWalletAuthLoginDto } from './dto/api-wallet-auth-login.dto';
import { ApiWalletAuthTokenLoginDto } from './dto/api-wallet-auth-token-login.dto';
import { ApiWalletAuthRegisterDto } from './dto/api-wallet-auth-register.dto';
import { ApiWalletAuthRegisterBatchDto } from './dto/api-wallet-auth-register-batch.dto';
import { wrappedBadRequest, wrappedOk, wrappedUnauthorized } from '../common/swagger/wrapped-response';

@ApiTags('api-wallet-auth')
@Controller('api/wallet/auth')
export class ApiWalletAuthController {
  constructor(private readonly apiWalletAuthService: ApiWalletAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '帳本成員登入（名稱）' })
  @ApiBody({ type: ApiWalletAuthLoginDto })
  @ApiOkResponse(
    wrappedOk('登入成功', {
      id: 554,
      name: 'codex_member_20260314',
      wallet_id: 66,
      member_token: 'token',
      jwt: 'jwt-token',
      wallet: { id: 66, code: 'zfTMK6Dh' },
      devices: [],
      notifies: [],
    }),
  )
  @ApiBadRequestResponse(wrappedBadRequest('帳本或成員不存在'))
  @ApiUnauthorizedResponse(wrappedUnauthorized('管理者不得使用此方式登入'))
  login(@Body() body: ApiWalletAuthLoginDto) {
    return this.apiWalletAuthService.login(body.code, body.name);
  }

  @Post('login/token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '帳本成員登入（member_token）' })
  @ApiBody({ type: ApiWalletAuthTokenLoginDto })
  @ApiOkResponse(
    wrappedOk('登入成功', {
      id: 554,
      name: 'codex_member_20260314',
      wallet_id: 66,
      member_token: 'token',
      wallet: { id: 66, code: 'zfTMK6Dh' },
    }),
  )
  @ApiBadRequestResponse(wrappedBadRequest('帳本或 token 不存在'))
  @ApiUnauthorizedResponse(wrappedUnauthorized('管理者不得使用此方式登入'))
  token(@Body() body: ApiWalletAuthTokenLoginDto) {
    return this.apiWalletAuthService.tokenLogin(body.code, body.member_token);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '註冊單一帳本成員' })
  @ApiBody({ type: ApiWalletAuthRegisterDto })
  @ApiOkResponse(
    wrappedOk('註冊成功', {
      id: 554,
      name: 'new-wallet-member',
      member_token: 'token',
      jwt: null,
      wallet: { id: 66, code: 'zfTMK6Dh' },
      walletUsers: [],
      devices: [],
      notifies: [],
    }),
  )
  @ApiBadRequestResponse(wrappedBadRequest('帳本不存在或名稱已存在'))
  register(@Body() body: ApiWalletAuthRegisterDto) {
    return this.apiWalletAuthService.register(body.code, body.name);
  }

  @Post('register/batch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '批次註冊帳本成員' })
  @ApiBody({ type: ApiWalletAuthRegisterBatchDto })
  @ApiOkResponse(wrappedOk('批次註冊成功', {}))
  @ApiBadRequestResponse(wrappedBadRequest('帳本不存在'))
  registerBatch(@Body() body: ApiWalletAuthRegisterBatchDto) {
    return this.apiWalletAuthService.registerBatch(body.code, body.name);
  }
}
