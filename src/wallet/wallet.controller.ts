import { Controller, Post, Get, Put, Delete, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FindAllWalletsDto } from './dto/find-all-wallets.dto';
import { GetCodeWalletUserDto } from './dto/get-code-wallet-user.dto';
import { DecodedUserDto } from '../auth/dto/decoded-user.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }

  @Get()
  findAll(@Query() query: FindAllWalletsDto, @Body('user') decodedUserDto : DecodedUserDto) {
    return this.walletService.findAll(query, decodedUserDto.id);
  }

  @Get('users')
  findUsersByWalletCode(@Query() query: GetCodeWalletUserDto) {
    const { code } = query;
    // Add check to ensure code is a string
    if (!code) {
      throw new BadRequestException('Wallet code is required');
    }
    
    return this.walletService.findUsersByWalletCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Body('user') decodedUserDto : DecodedUserDto) {
    return this.walletService.findOne(Number(id), decodedUserDto.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() createWalletDto: CreateWalletDto) {
    return this.walletService.update(Number(id), createWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletService.remove(Number(id));
  }
}