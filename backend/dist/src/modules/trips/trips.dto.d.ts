export declare class CreateTripDto {
    nameEn: string;
    nameFr: string;
    description?: string;
    isPublic?: boolean;
}
export declare class UpdateTripDto {
    nameEn?: string;
    nameFr?: string;
    description?: string;
    isPublic?: boolean;
}
export declare class AddTripPlaceDto {
    placeId: string;
}
export declare class AddTripMemberDto {
    shareCode: string;
    role?: 'editor' | 'member';
}
