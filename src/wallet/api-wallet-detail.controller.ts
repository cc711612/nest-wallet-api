import { Body, Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DecodedUserDto } from '../auth/dto/decoded-user.dto';
import { ApiWalletDetailService } from './api-wallet-detail.service';
import { wrappedOk, wrappedUnauthorized } from '../common/swagger/wrapped-response';

@ApiTags('api-wallet-detail')
@ApiBearerAuth('bearer')
@Controller('api/wallet/:wallet/detail')
export class ApiWalletDetailController {
  constructor(private readonly apiWalletDetailService: ApiWalletDetailService) {}

  @Get()
  @ApiOperation({ summary: '取得帳本明細資料' })
  @ApiParam({ name: 'wallet', type: String, example: '66', description: '帳本 ID' })
  @ApiOkResponse(
    wrappedOk('帳本明細', {
      wallet: {
        id: 66,
        title: '生活帳本',
        users: [],
        category: [],
        exchange_rates: [],
      },
    }),
  )
  @ApiUnauthorizedResponse(wrappedUnauthorized())
  @ApiNotFoundResponse({ description: '帳本不存在或無權限' })
  index(@Param('wallet') wallet: string, @Body('user') user: DecodedUserDto) {
    return this.apiWalletDetailService.index(Number(wallet), user.id);
  }
}
