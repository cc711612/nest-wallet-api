import { Body, Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { FindAllWalletsDto } from './dto/find-all-wallets.dto';
import { DecodedUserDto } from '../auth/dto/decoded-user.dto';
import { wrappedOk, wrappedUnauthorized } from '../common/swagger/wrapped-response';

interface WalletListCompatQuery {
  page?: number | string;
  perPage?: number | string;
  page_count?: number | string;
  status?: 1 | 0 | string;
}

@ApiTags('api-wallet')
@ApiBearerAuth('bearer')
@Controller('api/wallet')
export class ApiWalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: '取得帳本列表' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, type: Number, example: 15 })
  @ApiQuery({ name: 'page_count', required: false, type: Number, example: 15 })
  @ApiQuery({ name: 'status', required: false, enum: [0, 1], example: 1 })
  @ApiOkResponse(
    wrappedOk('帳本列表', {
      paginate: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 1,
      },
      wallets: [
        {
          id: 66,
          title: '生活帳本',
          code: 'zfTMK6Dh',
          status: 1,
          unit: 'TWD',
          mode: 'multi',
          properties: { unitConfigurable: false, decimalPlaces: 0 },
          user: { id: 1, name: 'Roy' },
          updated_at: '2026-03-14T00:00:00.000Z',
          created_at: '2026-03-14T00:00:00.000Z',
        },
      ],
    }),
  )
  @ApiUnauthorizedResponse(wrappedUnauthorized())
  async index(@Query() query: WalletListCompatQuery, @Body('user') decodedUserDto: DecodedUserDto) {
    const list = await this.walletService.findAll(this.toFindAllWalletsDto(query), decodedUserDto.id);

    return {
      paginate: {
        current_page: list.pagination.currentPage,
        last_page: list.pagination.lastPage,
        per_page: list.pagination.perPage,
        total: list.pagination.total,
      },
      wallets: list.wallets.map((wallet) => ({
        id: wallet.id,
        title: wallet.title,
        code: wallet.code,
        status: wallet.status,
        unit: wallet.unit,
        mode: wallet.mode,
        properties: wallet.properties,
        user: wallet.users,
        updated_at: wallet.updatedAt,
        created_at: wallet.createdAt,
      })),
    };
  }

  private toFindAllWalletsDto(query: WalletListCompatQuery): FindAllWalletsDto {
    const page = this.toInt(query.page);
    const perPage = this.toInt(query.perPage ?? query.page_count);
    const statusRaw = this.toInt(query.status);
    const status = statusRaw === 0 || statusRaw === 1 ? (statusRaw as 1 | 0) : undefined;

    return {
      page,
      perPage,
      status,
    };
  }

  private toInt(value: number | string | undefined): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
}
