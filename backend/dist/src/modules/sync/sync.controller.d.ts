import { SyncService } from './sync.service';
import { BulkSyncRequestDto, BulkSyncResponse } from './sync.dto';
interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
    };
}
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    bulkSync(dto: BulkSyncRequestDto, req: RequestWithUser): Promise<BulkSyncResponse>;
    getChanges(since: string | undefined, req: RequestWithUser): Promise<({
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
export {};
