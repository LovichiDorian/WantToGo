import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FriendDto, MyCodeDto, FriendPlaceDto } from './friends.dto';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get or create user by device ID and return their share code
   */
  async getMyCode(deviceId: string): Promise<MyCodeDto> {
    // Find or create user by deviceId (stored as email for simplicity)
    let user = await this.prisma.user.findUnique({
      where: { email: deviceId },
      include: { places: { where: { deletedAt: null } } },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: deviceId,
          name: 'User',
        },
        include: { places: { where: { deletedAt: null } } },
      });
    }

    return {
      shareCode: user.shareCode,
      placesCount: user.places.length,
    };
  }

  /**
   * Get friend's places by their share code
   */
  async getFriendPlaces(shareCode: string): Promise<FriendDto> {
    const user = await this.prisma.user.findUnique({
      where: { shareCode },
      include: {
        places: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Friend not found with this code');
    }

    const places: FriendPlaceDto[] = user.places.map((place) => ({
      id: place.id,
      name: place.name,
      notes: place.notes || undefined,
      latitude: place.latitude,
      longitude: place.longitude,
      address: place.address || undefined,
      tripDate: place.tripDate?.toISOString(),
    }));

    return {
      shareCode: user.shareCode,
      name: user.name || 'Anonymous',
      places,
    };
  }

  /**
   * Update user name
   */
  async updateMyName(deviceId: string, name: string): Promise<void> {
    await this.prisma.user.update({
      where: { email: deviceId },
      data: { name },
    });
  }
}
