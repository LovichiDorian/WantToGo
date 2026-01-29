import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlaceDto, UpdatePlaceDto } from './places.dto';
import { Place } from '@prisma/client';

@Injectable()
export class PlacesService {
  constructor(private readonly prisma: PrismaService) {}

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
  async create(userId: string, dto: CreatePlaceDto): Promise<Place> {
    return this.prisma.place.create({
      data: {
        userId,
        name: dto.name,
        notes: dto.notes,
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
        tripDate: dto.tripDate ? new Date(dto.tripDate) : null,
        clientId: dto.clientId,
      },
      include: {
        photos: true,
      },
    });
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
        ...(dto.tripDate !== undefined && { tripDate: dto.tripDate ? new Date(dto.tripDate) : null }),
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
}
