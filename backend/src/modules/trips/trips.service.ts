import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { CreateTripDto, UpdateTripDto, AddTripPlaceDto, AddTripMemberDto } from './trips.dto';

const FREE_TRIP_LIMIT = 3;

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => GamificationService))
    private gamificationService: GamificationService,
  ) {}

  /**
   * Create a new trip
   */
  async createTrip(userId: string, dto: CreateTripDto) {
    // Check trip limit for free users
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { userId },
    });

    const isPremium = subscription?.status === 'premium' || subscription?.status === 'lifetime';

    if (!isPremium) {
      const tripCount = await this.prisma.trip.count({
        where: { creatorId: userId },
      });

      if (tripCount >= FREE_TRIP_LIMIT) {
        throw new ForbiddenException('Free users can only create up to 3 trips. Upgrade to Premium for unlimited trips.');
      }
    }

    const trip = await this.prisma.trip.create({
      data: {
        nameEn: dto.nameEn,
        nameFr: dto.nameFr,
        description: dto.description,
        creatorId: userId,
        isPublic: dto.isPublic ?? false,
        members: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                shareCode: true,
              },
            },
          },
        },
        places: {
          include: {
            place: true,
          },
        },
      },
    });

    // Award XP and check achievements for first trip
    await this.gamificationService.checkAchievements(userId);

    return trip;
  }

  /**
   * Get all trips for a user
   */
  async getUserTrips(userId: string) {
    const trips = await this.prisma.trip.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                shareCode: true,
              },
            },
          },
        },
        _count: {
          select: {
            places: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Get trip limit info
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { userId },
    });

    const isPremium = subscription?.status === 'premium' || subscription?.status === 'lifetime';
    const ownedTrips = trips.filter(t => t.creatorId === userId).length;

    return {
      trips,
      limits: {
        current: ownedTrips,
        max: isPremium ? null : FREE_TRIP_LIMIT,
        isPremium,
      },
    };
  }

  /**
   * Get a single trip by ID
   */
  async getTripById(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                shareCode: true,
                level: true,
              },
            },
          },
        },
        places: {
          include: {
            place: {
              include: {
                photos: true,
              },
            },
          },
          orderBy: { addedAt: 'desc' },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Check access
    const isMember = trip.members.some(m => m.userId === userId);
    if (!trip.isPublic && !isMember) {
      throw new ForbiddenException('You do not have access to this trip');
    }

    return {
      ...trip,
      userRole: trip.members.find(m => m.userId === userId)?.role || null,
    };
  }

  /**
   * Update a trip
   */
  async updateTrip(tripId: string, userId: string, dto: UpdateTripDto) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { members: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const userMember = trip.members.find(m => m.userId === userId);
    if (!userMember || (userMember.role !== 'owner' && userMember.role !== 'editor')) {
      throw new ForbiddenException('You do not have permission to edit this trip');
    }

    return this.prisma.trip.update({
      where: { id: tripId },
      data: {
        ...(dto.nameEn && { nameEn: dto.nameEn }),
        ...(dto.nameFr && { nameFr: dto.nameFr }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                shareCode: true,
              },
            },
          },
        },
        places: {
          include: {
            place: true,
          },
        },
      },
    });
  }

  /**
   * Delete a trip
   */
  async deleteTrip(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.creatorId !== userId) {
      throw new ForbiddenException('Only the trip creator can delete it');
    }

    await this.prisma.trip.delete({
      where: { id: tripId },
    });

    return { success: true };
  }

  /**
   * Add a place to a trip
   */
  async addPlaceToTrip(tripId: string, userId: string, dto: AddTripPlaceDto) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { members: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const userMember = trip.members.find(m => m.userId === userId);
    if (!userMember) {
      throw new ForbiddenException('You are not a member of this trip');
    }

    // Check if place exists
    const place = await this.prisma.place.findUnique({
      where: { id: dto.placeId },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    // Check if already added
    const existing = await this.prisma.tripPlace.findUnique({
      where: {
        tripId_placeId: {
          tripId,
          placeId: dto.placeId,
        },
      },
    });

    if (existing) {
      throw new ForbiddenException('This place is already in the trip');
    }

    return this.prisma.tripPlace.create({
      data: {
        tripId,
        placeId: dto.placeId,
        addedBy: userId,
      },
      include: {
        place: true,
      },
    });
  }

  /**
   * Remove a place from a trip
   */
  async removePlaceFromTrip(tripId: string, placeId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { members: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const userMember = trip.members.find(m => m.userId === userId);
    if (!userMember || userMember.role === 'member') {
      throw new ForbiddenException('You do not have permission to remove places from this trip');
    }

    await this.prisma.tripPlace.delete({
      where: {
        tripId_placeId: {
          tripId,
          placeId,
        },
      },
    });

    return { success: true };
  }

  /**
   * Add a member to a trip
   */
  async addMemberToTrip(tripId: string, userId: string, dto: AddTripMemberDto) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { members: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const userMember = trip.members.find(m => m.userId === userId);
    if (!userMember || (userMember.role !== 'owner' && userMember.role !== 'editor')) {
      throw new ForbiddenException('You do not have permission to add members');
    }

    // Find user by share code
    const newMember = await this.prisma.user.findUnique({
      where: { shareCode: dto.shareCode },
    });

    if (!newMember) {
      throw new NotFoundException('User not found with this share code');
    }

    // Check if already a member
    const existing = trip.members.find(m => m.userId === newMember.id);
    if (existing) {
      throw new ForbiddenException('This user is already a member of the trip');
    }

    return this.prisma.tripMember.create({
      data: {
        tripId,
        userId: newMember.id,
        role: dto.role || 'member',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            shareCode: true,
          },
        },
      },
    });
  }

  /**
   * Remove a member from a trip
   */
  async removeMemberFromTrip(tripId: string, memberId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { members: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const userMember = trip.members.find(m => m.userId === userId);
    if (!userMember || userMember.role !== 'owner') {
      throw new ForbiddenException('Only the trip owner can remove members');
    }

    if (memberId === userId) {
      throw new ForbiddenException('You cannot remove yourself. Delete the trip instead.');
    }

    await this.prisma.tripMember.delete({
      where: {
        tripId_userId: {
          tripId,
          userId: memberId,
        },
      },
    });

    return { success: true };
  }

  /**
   * Leave a trip
   */
  async leaveTrip(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { members: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.creatorId === userId) {
      throw new ForbiddenException('Trip owner cannot leave. Delete the trip instead.');
    }

    const membership = trip.members.find(m => m.userId === userId);
    if (!membership) {
      throw new NotFoundException('You are not a member of this trip');
    }

    await this.prisma.tripMember.delete({
      where: { id: membership.id },
    });

    return { success: true };
  }
}
