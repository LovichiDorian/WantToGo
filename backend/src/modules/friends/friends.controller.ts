import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendDto, MyCodeDto, AddFriendDto, FriendshipDto } from './friends.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser {
  user: { id: string; email: string };
}

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  /**
   * Get my share code (authenticated)
   */
  @UseGuards(JwtAuthGuard)
  @Get('my-code')
  async getMyCode(@Request() req: RequestWithUser): Promise<MyCodeDto> {
    return this.friendsService.getMyCode(req.user.id);
  }

  /**
   * Get all my friends (authenticated)
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getFriends(@Request() req: RequestWithUser): Promise<FriendshipDto[]> {
    return this.friendsService.getFriends(req.user.id);
  }

  /**
   * Add a friend by their share code (authenticated)
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async addFriend(
    @Request() req: RequestWithUser,
    @Body() addFriendDto: AddFriendDto,
  ): Promise<FriendshipDto> {
    return this.friendsService.addFriend(req.user.id, addFriendDto.shareCode);
  }

  /**
   * Delete a friend (authenticated)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteFriend(
    @Request() req: RequestWithUser,
    @Param('id') friendshipId: string,
  ): Promise<{ success: boolean }> {
    await this.friendsService.deleteFriend(req.user.id, friendshipId);
    return { success: true };
  }

  /**
   * Get friend's places by their share code (public endpoint for preview)
   */
  @Get('places/:shareCode')
  async getFriendPlaces(
    @Param('shareCode') shareCode: string,
  ): Promise<FriendDto> {
    return this.friendsService.getFriendPlaces(shareCode);
  }
}
