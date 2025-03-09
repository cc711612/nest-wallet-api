import { Controller, Post, Body, HttpStatus, HttpCode, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CheckBindDto } from './dto/check-bind.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用戶登入' })
  @ApiResponse({ status: 200, description: '登入成功' })
  @ApiResponse({ status: 401, description: '登入失敗' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    if (result === undefined) {
      throw new UnauthorizedException('密碼有誤');
    }
    return result;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '用戶註冊' })
  @ApiResponse({ status: 201, description: '註冊成功' })
  @ApiResponse({ status: 400, description: '註冊失敗' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('thirdParty/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '第三方登入' })
  @ApiResponse({ status: 200, description: '第三方登入成功' })
  @ApiResponse({ status: 401, description: '第三方登入失敗' })
  async thirdPartyLogin(@Body() loginDto: LoginDto) {
    return await this.authService.thirdPartyLogin(loginDto);
  }

  @Post('thirdParty/checkBind')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '檢查第三方帳號綁定狀態' })
  @ApiResponse({ status: 200, description: '檢查成功' })
  @ApiResponse({ status: 400, description: '檢查失敗' })
  async checkBind(@Body() checkBindDto: CheckBindDto) {
    return await this.authService.checkBind(checkBindDto);
  }
}
