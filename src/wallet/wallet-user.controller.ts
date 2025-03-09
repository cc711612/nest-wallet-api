import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WalletUserService } from './wallet-user.service';
import { CreateWalletUserDto } from './dto/create-wallet-user.dto';
import { UpdateWalletUserDto } from './dto/update-wallet-user.dto';

@Controller('wallet-users')
export class WalletUserController {
  constructor(private readonly walletUserService: WalletUserService) {}

  @Post()
  create(@Body() createWalletUserDto: CreateWalletUserDto) {
    return this.walletUserService.create(createWalletUserDto);
  }

  @Get()
  findAll() {
    return this.walletUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletUserService.findOne(+id);
  }

  @Get('wallet/:walletId/user/:userId')
  findByWalletAndUser(
    @Param('walletId') walletId: string,
    @Param('userId') userId: string,
  ) {
    return this.walletUserService.findByWalletAndUser(+walletId, +userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletUserDto: UpdateWalletUserDto) {
    return this.walletUserService.update(+id, updateWalletUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletUserService.softDelete(+id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.walletUserService.restore(+id);
  }
} 