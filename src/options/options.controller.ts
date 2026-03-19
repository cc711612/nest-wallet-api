import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../category/category.service';
import { wrappedBadRequest, wrappedOk } from '../common/swagger/wrapped-response';
import { OptionsService } from './options.service';

@ApiTags('api-option')
@Controller('api/option')
export class OptionsController {
  constructor(
    private readonly optionsService: OptionsService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('exchangeRate')
  @ApiOperation({ summary: '取得指定幣別匯率資訊' })
  @ApiQuery({ name: 'unit', required: false, type: String, example: 'TWD' })
  @ApiOkResponse(
    wrappedOk('取得匯率成功', {
      option: ['TWD', 'USD', 'JPY'],
      rates: { TWD: 1, USD: 0.031, JPY: 4.8 },
      updated_at: '2026-03-14',
    }),
  )
  @ApiBadRequestResponse(wrappedBadRequest('unit not found'))
  exchangeRate(@Query('unit') unit?: string) {
    return this.optionsService.exchangeRate(unit);
  }

  @Get('category')
  @ApiOperation({ summary: '取得分類清單' })
  @ApiOkResponse(
    wrappedOk('取得分類成功', [
      {
        id: 1,
        parent_id: null,
        wallet_id: null,
        name: '餐飲',
        icon: 'food',
      },
    ]),
  )
  async category() {
    const categories = await this.categoryService.findAll();
    return categories.map((item) => ({
      id: item.id,
      parent_id: item.parentId ?? null,
      wallet_id: item.walletId ?? null,
      name: item.name,
      icon: item.icon ?? null,
    }));
  }
}
