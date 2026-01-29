import { PrismaService } from '../../prisma/prisma.service';
import { Photo } from '@prisma/client';
interface CreatePhotoDto {
    filename: string;
    mimeType: string;
    size: number;
}
export declare class PhotosService {
    private readonly prisma;
    private readonly uploadsPath;
    constructor(prisma: PrismaService);
    create(userId: string, placeId: string, dto: CreatePhotoDto): Promise<Photo>;
    findByPlace(placeId: string): Promise<Photo[]>;
    remove(userId: string, placeId: string, photoId: string): Promise<void>;
}
export {};
