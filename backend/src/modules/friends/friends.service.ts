import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FriendDto, MyCodeDto, FriendPlaceDto, FriendshipDto } from './friends.dto';

// Couleurs disponibles pour les amis
const FRIEND_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f43f5e', // rose
  '#6366f1', // indigo
];

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user's share code
   */
  async getMyCode(userId: string): Promise<MyCodeDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { places: { where: { deletedAt: null } } },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      shareCode: user.shareCode,
      placesCount: user.places.length,
    };
  }

  /**
   * Get friend's places by their share code (public endpoint)
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
   * Add a friend by their share code
   */
  async addFriend(userId: string, friendCode: string): Promise<FriendshipDto> {
    // Check if trying to add self
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    if (currentUser.shareCode === friendCode) {
      throw new BadRequestException('You cannot add yourself as a friend');
    }

    // Check if friend exists
    const friendUser = await this.prisma.user.findUnique({
      where: { shareCode: friendCode },
      include: {
        places: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!friendUser) {
      throw new NotFoundException('Friend not found with this code');
    }

    // Check if already friends
    const existingFriendship = await this.prisma.friendship.findUnique({
      where: {
        userId_friendCode: {
          userId,
          friendCode,
        },
      },
    });

    if (existingFriendship) {
      throw new ConflictException('You have already added this friend');
    }

    // Get next color
    const friendCount = await this.prisma.friendship.count({
      where: { userId },
    });
    const color = FRIEND_COLORS[friendCount % FRIEND_COLORS.length];

    // Create friendship
    const friendship = await this.prisma.friendship.create({
      data: {
        userId,
        friendCode,
        friendName: friendUser.name || 'Anonymous',
        color,
      },
    });

    // Return friendship with places
    const places: FriendPlaceDto[] = friendUser.places.map((place) => ({
      id: place.id,
      name: place.name,
      notes: place.notes || undefined,
      latitude: place.latitude,
      longitude: place.longitude,
      address: place.address || undefined,
      tripDate: place.tripDate?.toISOString(),
    }));

    return {
      id: friendship.id,
      friendCode: friendship.friendCode,
      friendName: friendship.friendName,
      color: friendship.color,
      places,
      createdAt: friendship.createdAt.toISOString(),
    };
  }

  /**
   * Get all friends for a user
   */
  async getFriends(userId: string): Promise<FriendshipDto[]> {
    const friendships = await this.prisma.friendship.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Get all friend places in parallel
    const friendsWithPlaces = await Promise.all(
      friendships.map(async (friendship) => {
        const friendUser = await this.prisma.user.findUnique({
          where: { shareCode: friendship.friendCode },
          include: {
            places: {
              where: { deletedAt: null },
              orderBy: { createdAt: 'desc' },
            },
          },
        });

        const places: FriendPlaceDto[] = friendUser
          ? friendUser.places.map((place) => ({
              id: place.id,
              name: place.name,
              notes: place.notes || undefined,
              latitude: place.latitude,
              longitude: place.longitude,
              address: place.address || undefined,
              tripDate: place.tripDate?.toISOString(),
            }))
          : [];

        // Update friend name if changed
        if (friendUser && friendUser.name && friendUser.name !== friendship.friendName) {
          await this.prisma.friendship.update({
            where: { id: friendship.id },
            data: { friendName: friendUser.name },
          });
        }

        return {
          id: friendship.id,
          friendCode: friendship.friendCode,
          friendName: friendUser?.name || friendship.friendName,
          color: friendship.color,
          places,
          createdAt: friendship.createdAt.toISOString(),
        };
      })
    );

    return friendsWithPlaces;
  }

  /**
   * Delete a friendship
   */
  async deleteFriend(userId: string, friendshipId: string): Promise<void> {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        id: friendshipId,
        userId,
      },
    });

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    await this.prisma.friendship.delete({
      where: { id: friendshipId },
    });
  }

  /**
   * Update user name
   */
  async updateMyName(userId: string, name: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });
  }
}
