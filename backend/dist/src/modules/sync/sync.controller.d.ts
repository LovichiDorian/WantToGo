import { SyncService } from './sync.service';
import { BulkSyncRequestDto, BulkSyncResponse } from './sync.dto';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    bulkSync(dto: BulkSyncRequestDto): Promise<BulkSyncResponse>;
    getChanges(since?: string): Promise<({
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
        tripDate: Date | null;
        deletedAt: Date | null;
        userId: string;
    })[]>;
}
