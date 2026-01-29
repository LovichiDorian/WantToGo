import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Photo } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';

interface CreatePhotoDto {
  filename: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class PhotosService {
  private readonly uploadsPath = join(process.cwd(), 'uploads', 'photos');

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new photo for a place
   */
  async create(userId: string, placeId: string, dto: CreatePhotoDto): Promise<Photo> {
    // Verify the place exists and belongs to user
    const place = await this.prisma.place.findFirst({
      where: {
        id: placeId,
        userId,
        deletedAt: null,
      },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    return this.prisma.photo.create({
      data: {
        placeId,
        filename: `/uploads/photos/${dto.filename}`,
        mimeType: dto.mimeType,
        size: dto.size,
      },
    });
  }

  /**
   * Get all photos for a place
   */
  async findByPlace(placeId: string): Promise<Photo[]> {
    return this.prisma.photo.findMany({
      where: { placeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete a photo
   */
  async remove(userId: string, placeId: string, photoId: string): Promise<void> {
    // Verify the place exists and belongs to user
    const place = await this.prisma.place.findFirst({
      where: {
        id: placeId,
        userId,
      },
    });

    if (!place) {
      throw new ForbiddenException('Not authorized to delete this photo');
    }

    const photo = await this.prisma.photo.findFirst({
      where: {
        id: photoId,
        placeId,
      },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    // Delete from database
    await this.prisma.photo.delete({
      where: { id: photoId },
    });

    // Delete file from disk
    try {
      const filename = photo.filename.replace('/uploads/photos/', '');
      await unlink(join(this.uploadsPath, filename));
    } catch (error) {
      // File might not exist, log but don't throw
      console.warn(`Failed to delete photo file: ${photo.filename}`, error);
    }
  }
}
