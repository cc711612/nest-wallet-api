import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { wrappedBadRequest, wrappedOk, wrappedUnauthorized } from '../common/swagger/wrapped-response';
import { SocialService } from './social.service';
import { SocialCheckBindDto } from './dto/social-check-bind.dto';
import { SocialBindDto } from './dto/social-bind.dto';
import { SocialUnBindDto } from './dto/social-unbind.dto';
import { DecodedUserDto } from './dto/decoded-user.dto';
import { toWalletV2LoginShape } from './auth-response.mapper';

@ApiTags('api-auth-social')
@Controller('api/auth/thirdParty')
export class ApiSocialController {
  constructor(
    private readonly socialService: SocialService,
    private readonly authService: AuthService,
  ) {}

  @Post('checkBind')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '檢查第三方帳號綁定狀態' })
  @ApiBody({ type: SocialCheckBindDto })
  @ApiOkResponse(
    wrappedOk('檢查綁定成功', {
      action: 'not bind',
      token: 'AbCdEf123456',
    }),
  )
  @ApiBadRequestResponse(wrappedBadRequest('登入失敗'))
  async checkBind(@Body() body: SocialCheckBindDto) {
    const result = await this.socialService.checkBind(body);
    if (result.action !== 'bind') {
      return { action: result.action, token: result.token };
    }

    const userId = this.socialService.consumeBindTokenUserId(body.socialType, result.token);
    if (userId <= 0) {
      throw new BadRequestException('登入失敗');
    }

    const login = await this.authService.thirdPartyLoginByUserId(userId, '', '');
    return {
      ...toWalletV2LoginShape(login as Record<string, any>),
      action: 'bind',
    };
  }

  @Post('bind')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: '綁定第三方帳號' })
  @ApiBody({ type: SocialBindDto })
  @ApiOkResponse(wrappedOk('綁定成功', {}))
  @ApiBadRequestResponse(wrappedBadRequest('token is invalid'))
  @ApiUnauthorizedResponse(wrappedUnauthorized())
  async bind(@Body() body: SocialBindDto, @Body('user') user: DecodedUserDto) {
    try {
      await this.socialService.bind({
        token: body.token,
        user: { id: user.id },
      });
      return {};
    } catch (error) {
      throw new BadRequestException('token is invalid');
    }
  }

  @Post('unBind')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: '解除第三方帳號綁定' })
  @ApiBody({ type: SocialUnBindDto })
  @ApiOkResponse(wrappedOk('解除綁定成功', {}))
  @ApiUnauthorizedResponse(wrappedUnauthorized())
  async unBind(@Body() body: SocialUnBindDto, @Body('user') user: DecodedUserDto) {
    await this.socialService.unBind({
      socialType: body.socialType,
      user: { id: user.id },
    });
    return {};
  }
}
