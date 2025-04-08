import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { WalletUserService } from './wallet-user.service';
import { CreateWalletUserDto } from './dto/create-wallet-user.dto';
import { UpdateWalletUserDto } from './dto/update-wallet-user.dto';
import { WalletGateway } from './wallet.gateway';

@Controller('wallet-users')
export class WalletUserController {
  constructor(
    private readonly walletUserService: WalletUserService,
    private readonly walletGateway: WalletGateway,
  ) {}

  @Post()
  create(@Body() createWalletUserDto: CreateWalletUserDto) {
    const newWalletUser = this.walletUserService.create(createWalletUserDto);
    this.walletGateway.emitWalletDetailAdded(newWalletUser);
    return newWalletUser;
  }

  @Get()
  findAll(@Req() request: Request) {
    // 取得 client ip
    const clientIp = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    // 取得 client port
    const clientPort = request.headers['x-forwarded-port'] || request.connection.remotePort;
    // 取得 client user agent
    const clientUserAgent = request.headers['user-agent'];
    // 取得 client referer
    const clientReferer = request.headers['referer'];
    // 取得 client host
    const clientHost = request.headers['host'];
    this.walletGateway.emitWalletUserIndex({
      clientIp,
      clientPort,
      clientUserAgent,
      clientReferer,
      clientHost,
    });
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