import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WalletUserService } from './wallet-user.service';
import { ApiUpdateWalletUserDto } from './dto/api-update-wallet-user.dto';
import { wrappedOk, wrappedUnauthorized } from '../common/swagger/wrapped-response';

@ApiTags('api-wallet-member')
@ApiBearerAuth('bearer')
@Controller('api/wallet')
export class ApiWalletMemberController {
  constructor(private readonly walletUserService: WalletUserService) {}

  @Put('user/:wallet_users_id')
  @ApiOperation({ summary: '更新帳本成員資訊' })
  @ApiParam({ name: 'wallet_users_id', type: String, example: '190' })
  @ApiBody({ type: ApiUpdateWalletUserDto })
  @ApiOkResponse(
    wrappedOk('更新成功', {
      wallet_user_id: 190,
      name: 'Roy',
      notify_enable: true,
    }),
  )
  @ApiUnauthorizedResponse(wrappedUnauthorized())
  async update(
    @Param('wallet_users_id') walletUsersId: string,
    @Body() body: ApiUpdateWalletUserDto,
  ) {
    const updated = await this.walletUserService.updateCompat(Number(walletUsersId), {
      name: body.name,
      notifyEnable: body.notify_enable,
    });

    return {
      wallet_user_id: updated.id,
      name: updated.name,
      notify_enable: updated.notifyEnable,
    };
  }

  @Delete(':wallet/user/:wallet_user_id')
  @ApiOperation({ summary: '刪除帳本成員（soft delete）' })
  @ApiParam({ name: 'wallet', type: String, example: '66' })
  @ApiParam({ name: 'wallet_user_id', type: String, example: '190' })
  @ApiOkResponse(
    wrappedOk('刪除成功', {
      wallet_id: 66,
      wallet_user_id: 190,
      deleted: true,
    }),
  )
  @ApiUnauthorizedResponse(wrappedUnauthorized())
  async destroy(@Param('wallet') walletId: string, @Param('wallet_user_id') walletUserId: string) {
    await this.walletUserService.softDeleteCompat(Number(walletUserId));

    return {
      wallet_id: Number(walletId),
      wallet_user_id: Number(walletUserId),
      deleted: true,
    };
  }
}
