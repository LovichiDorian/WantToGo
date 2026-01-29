export declare enum SyncActionType {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}
export declare enum SyncEntityType {
    PLACE = "place",
    PHOTO = "photo"
}
export declare class SyncActionDto {
    actionType: SyncActionType;
    entityType: SyncEntityType;
    clientId: string;
    serverId?: string;
    payload?: Record<string, unknown>;
    timestamp: string;
}
export declare class BulkSyncRequestDto {
    actions: SyncActionDto[];
    lastSyncedAt?: string;
}
export interface IdMapping {
    clientId: string;
    serverId: string;
}
export interface SyncConflict {
    clientId: string;
    serverVersion: Record<string, unknown>;
    resolution: 'server_wins' | 'client_wins';
}
export interface BulkSyncResponse {
    success: boolean;
    idMappings: IdMapping[];
    updatedPlaces: Record<string, unknown>[];
    conflicts: SyncConflict[];
    syncedAt: string;
}
