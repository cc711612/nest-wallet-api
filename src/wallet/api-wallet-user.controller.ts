import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { IsNotEmpty, IsString } from 'class-validator';
import { wrappedBadRequest, wrappedOk } from '../common/swagger/wrapped-response';

class WalletUserCompatInput {
  @ApiProperty({ example: 'zfTMK6Dh', description: '帳本 code' })
  @IsString()
  @IsNotEmpty()
  code!: string;
}

@ApiTags('api-wallet-user')
@Controller('api/wallet/user')
export class ApiWalletUserController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: '透過帳本 code 取得成員列表（query）' })
  @ApiQuery({ name: 'code', required: true, type: String, example: 'zfTMK6Dh' })
  @ApiOkResponse(
    wrappedOk('帳本成員清單', {
      wallet: {
        users: [
          {
            id: 522,
            name: 'Juni',
            user_id: 58,
            is_admin: true,
            notify_enable: true,
          },
        ],
      },
    }),
  )
  @ApiBadRequestResponse(wrappedBadRequest('帳本驗證碼錯誤'))
  async index(@Query() query: WalletUserCompatInput) {
    return this.handle(query);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '透過帳本 code 取得成員列表（body）' })
  @ApiBody({ type: WalletUserCompatInput })
  @ApiOkResponse(
    wrappedOk('帳本成員清單', {
      wallet: {
        users: [
          {
            id: 523,
            name: 'Roy',
            user_id: 1,
            is_admin: false,
            notify_enable: true,
          },
        ],
      },
    }),
  )
  @ApiBadRequestResponse(wrappedBadRequest('帳本驗證碼錯誤'))
  async store(@Body() body: WalletUserCompatInput) {
    return this.handle(body);
  }

  private async handle(input: WalletUserCompatInput) {
    const result = await this.walletService.findUsersByWalletCode(input.code ?? '');

    return {
      wallet: {
        users: (result.wallet.users ?? []).map((user) => ({
          id: user.id,
          name: user.name,
          user_id: user.userId ?? null,
          is_admin: user.isAdmin,
          notify_enable: user.notifyEnable,
        })),
      },
    };
  }
}
