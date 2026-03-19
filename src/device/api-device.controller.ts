import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { DecodedUserDto } from '../auth/dto/decoded-user.dto';
import { wrappedBadRequest, wrappedOk, wrappedUnauthorized } from '../common/swagger/wrapped-response';
import { ApiStoreDeviceDto } from './dto/api-store-device.dto';

@ApiTags('api-device')
@ApiBearerAuth('bearer')
@Controller('api/device')
export class ApiDeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @ApiOperation({ summary: '取得目前使用者裝置清單' })
  @ApiOkResponse(
    wrappedOk('裝置清單', {
      devices: [
        {
          id: 1,
          platform: 'ios',
          device_name: 'iPhone',
          device_type: 'mobile',
          fcm_token: 'fcm-token',
          expired_at: '2026-12-31T00:00:00.000Z',
        },
      ],
    }),
  )
  @ApiUnauthorizedResponse(wrappedUnauthorized())
  async index(@Body('user') user: DecodedUserDto) {
    const result = await this.deviceService.findDevicesByUserId(user.id);

    return {
      devices: result.devices.map((device) => ({
        id: device.id,
        platform: device.platform,
        device_name: device.deviceName,
        device_type: device.deviceType,
        fcm_token: device.fcmToken,
        expired_at: this.formatDateTime(device.expiredAt),
      })),
    };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '建立或更新裝置 token' })
  @ApiBody({ type: ApiStoreDeviceDto })
  @ApiOkResponse(wrappedOk('儲存裝置成功', {}))
  @ApiBadRequestResponse(wrappedBadRequest('參數有誤'))
  @ApiUnauthorizedResponse(wrappedUnauthorized())
  async store(@Body() body: ApiStoreDeviceDto, @Body('user') user: DecodedUserDto) {
    return this.deviceService.store({
      ...body,
      user_id: body.user_id ?? user.id,
    });
  }

  private formatDateTime(value: Date | string | undefined): string | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
