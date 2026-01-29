import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlaceDto, UpdatePlaceDto } from './places.dto';
import { Place } from '@prisma/client';
export declare class PlacesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<Place[]>;
    findOne(id: string, userId: string): Promise<Place>;
    create(userId: string, dto: CreatePlaceDto): Promise<Place>;
    update(id: string, userId: string, dto: UpdatePlaceDto): Promise<Place>;
    remove(id: string, userId: string): Promise<Place>;
    findByClientId(clientId: string, userId: string): Promise<Place | null>;
}
