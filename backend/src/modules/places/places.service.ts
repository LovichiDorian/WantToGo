import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlaceDto, UpdatePlaceDto, MarkVisitedDto } from './places.dto';
import { Place } from '@prisma/client';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class PlacesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => GamificationService))
    private readonly gamificationService: GamificationService,
  ) {}

  /**
   * Get all places for a user (excluding soft-deleted ones)
   */
  async findAll(userId: string): Promise<Place[]> {
    return this.prisma.place.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        photos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get a single place by ID
   */
  async findOne(id: string, userId: string): Promise<Place> {
    const place = await this.prisma.place.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        photos: true,
      },
    });

    if (!place) {
      throw new NotFoundException(`Place with ID ${id} not found`);
    }

    return place;
  }

  /**
   * Create a new place
   */
  async create(userId: string, dto: CreatePlaceDto): Promise<Place & { xpEarned?: number; achievements?: { code: string; xpReward: number }[] }> {
    const place = await this.prisma.place.create({
      data: {
        userId,
        name: dto.name,
        notes: dto.notes,
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
        city: dto.city,
        country: dto.country,
        tripDate: dto.tripDate ? new Date(dto.tripDate) : null,
        clientId: dto.clientId,
      },
      include: {
        photos: true,
      },
    });

    // Award XP for adding a place
    const achievements = await this.gamificationService.onPlaceAdded(userId, place.id, place.name);

    return {
      ...place,
      xpEarned: 50, // XP_REWARDS.PLACE_ADDED
      achievements: achievements.unlocked,
    };
  }

  /**
   * Update an existing place
   */
  async update(id: string, userId: string, dto: UpdatePlaceDto): Promise<Place> {
    // Verify the place exists and belongs to user
    await this.findOne(id, userId);

    return this.prisma.place.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.country !== undefined && { country: dto.country }),
        ...(dto.tripDate !== undefined && { tripDate: dto.tripDate ? new Date(dto.tripDate) : null }),
      },
      include: {
        photos: true,
      },
    });
  }

  /**
   * Mark a place as visited
   */
  async markVisited(id: string, userId: string, dto: MarkVisitedDto): Promise<Place & { xpEarned: number; bonusXp: number; achievements: { code: string; xpReward: number }[] }> {
    const place = await this.findOne(id, userId);

    if (place.isVisited) {
      throw new Error('Place is already marked as visited');
    }

    const updatedPlace = await this.prisma.place.update({
      where: { id },
      data: {
        isVisited: true,
        visitedAt: new Date(),
        visitedWithGeoloc: dto.isNearby || false,
      },
      include: {
        photos: true,
      },
    });

    // Award XP for visiting a place
    const achievements = await this.gamificationService.onPlaceVisited(
      userId,
      place.id,
      place.name,
      dto.isNearby || false,
    );

    const baseXp = 200; // XP_REWARDS.PLACE_VISITED
    const bonusXp = dto.isNearby ? 300 : 0; // XP_REWARDS.PLACE_VISITED_GEOLOC

    return {
      ...updatedPlace,
      xpEarned: baseXp + bonusXp,
      bonusXp,
      achievements: achievements.unlocked,
    };
  }

  /**
   * Undo mark visited (within 24 hours)
   */
  async undoVisited(id: string, userId: string): Promise<Place> {
    const place = await this.findOne(id, userId);

    if (!place.isVisited || !place.visitedAt) {
      throw new Error('Place is not marked as visited');
    }

    // Check if within 24 hours
    const hoursSinceVisit = (Date.now() - new Date(place.visitedAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceVisit > 24) {
      throw new Error('Cannot undo visit after 24 hours');
    }

    // Note: In a production app, we would also revert the XP
    // For now, we just update the place status
    return this.prisma.place.update({
      where: { id },
      data: {
        isVisited: false,
        visitedAt: null,
        visitedWithGeoloc: false,
      },
      include: {
        photos: true,
      },
    });
  }

  /**
   * Soft delete a place (sets deletedAt timestamp)
   */
  async remove(id: string, userId: string): Promise<Place> {
    // Verify the place exists and belongs to user
    await this.findOne(id, userId);

    return this.prisma.place.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Find place by client ID (for sync reconciliation)
   */
  async findByClientId(clientId: string, userId: string): Promise<Place | null> {
    return this.prisma.place.findFirst({
      where: {
        clientId,
        userId,
      },
      include: {
        photos: true,
      },
    });
  }

  /**
   * Get place statistics for a user
   */
  async getStats(userId: string) {
    const [totalPlaces, visitedPlaces, placesWithPhotos] = await Promise.all([
      this.prisma.place.count({
        where: { userId, deletedAt: null },
      }),
      this.prisma.place.count({
        where: { userId, deletedAt: null, isVisited: true },
      }),
      this.prisma.place.count({
        where: {
          userId,
          deletedAt: null,
          photos: { some: {} },
        },
      }),
    ]);

    return {
      totalPlaces,
      visitedPlaces,
      placesWithPhotos,
      visitRate: totalPlaces > 0 ? Math.round((visitedPlaces / totalPlaces) * 100) : 0,
    };
  }
}
