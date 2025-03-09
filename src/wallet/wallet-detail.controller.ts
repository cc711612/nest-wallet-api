import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { WalletDetailService } from '../wallet/wallet-detail.service';

@Controller('wallet-details')
export class WalletDetailController {
  constructor(private readonly walletDetailService: WalletDetailService) {}

  @Get()
  findAll() {
    return this.walletDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletDetailService.findOne(id);
  }

  @Post()
  create(@Body() createWalletDetailDto: any) {
    return this.walletDetailService.create(createWalletDetailDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateWalletDetailDto: any) {
    return this.walletDetailService.update(id, updateWalletDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletDetailService.remove(id);
  }
} 