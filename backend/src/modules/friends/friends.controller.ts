import {
  Controller,
  Get,
  Param,
  Headers,
  BadRequestException,
  Patch,
  Body,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendDto, MyCodeDto } from './friends.dto';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  /**
   * Get my share code (creates user if doesn't exist)
   */
  @Get('my-code')
  async getMyCode(
    @Headers('x-device-id') deviceId: string,
  ): Promise<MyCodeDto> {
    if (!deviceId) {
      throw new BadRequestException('Device ID header is required');
    }
    return this.friendsService.getMyCode(deviceId);
  }

  /**
   * Get friend's places by their share code
   */
  @Get('places/:shareCode')
  async getFriendPlaces(
    @Param('shareCode') shareCode: string,
  ): Promise<FriendDto> {
    return this.friendsService.getFriendPlaces(shareCode);
  }

  /**
   * Update my display name
   */
  @Patch('my-name')
  async updateMyName(
    @Headers('x-device-id') deviceId: string,
    @Body('name') name: string,
  ): Promise<{ success: boolean }> {
    if (!deviceId) {
      throw new BadRequestException('Device ID header is required');
    }
    await this.friendsService.updateMyName(deviceId, name);
    return { success: true };
  }
}
