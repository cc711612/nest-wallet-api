import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('wallet')
  createWallet(@Body() createWalletDto: any): string {
    // Logic to create a wallet will be implemented here
    return 'Wallet created';
  }
}