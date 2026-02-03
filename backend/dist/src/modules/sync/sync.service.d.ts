import { PrismaService } from '../../prisma/prisma.service';
import { PlacesService } from '../places/places.service';
import { BulkSyncRequestDto, BulkSyncResponse } from './sync.dto';
export declare class SyncService {
    private readonly prisma;
    private readonly placesService;
    private readonly logger;
    constructor(prisma: PrismaService, placesService: PlacesService);
    processBulkSync(userId: string, dto: BulkSyncRequestDto): Promise<BulkSyncResponse>;
    private processPlaceAction;
    getChangesSince(userId: string, since: Date): Promise<({
        photos: {
            id: string;
            createdAt: Date;
            placeId: string;
            filename: string;
            mimeType: string;
            size: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string | null;
        notes: string | null;
        latitude: number;
        longitude: number;
        address: string | null;
        city: string | null;
        country: string | null;
        tripDate: Date | null;
        isVisited: boolean;
        visitedAt: Date | null;
        visitedWithGeoloc: boolean;
        deletedAt: Date | null;
        userId: string;
    })[]>;
}
