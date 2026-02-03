export declare class UpdateLanguageDto {
    language: 'fr' | 'en';
}
export declare class AwardXpDto {
    amount: number;
    source: string;
    metadata?: Record<string, unknown>;
}
export declare class PlaceVisitedDto {
    placeId: string;
    isNearby?: boolean;
}
