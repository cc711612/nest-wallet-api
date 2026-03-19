import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { wrappedOk } from '../common/swagger/wrapped-response';

@ApiTags('api-categories')
@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: '取得分類清單' })
  @ApiOkResponse(
    wrappedOk('分類清單', [
      {
        id: 1,
        parent_id: null,
        wallet_id: null,
        name: '餐飲',
        icon: 'food',
      },
    ]),
  )
  async findAll() {
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
