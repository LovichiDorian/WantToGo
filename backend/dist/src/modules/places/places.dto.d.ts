export declare class CreatePlaceDto {
    name: string;
    notes?: string;
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    country?: string;
    tripDate?: string;
    clientId?: string;
}
export declare class UpdatePlaceDto {
    name?: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    city?: string;
    country?: string;
    tripDate?: string;
}
export declare class MarkVisitedDto {
    isNearby?: boolean;
    userLatitude?: number;
    userLongitude?: number;
}
