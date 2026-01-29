export declare class AddFriendDto {
    shareCode: string;
}
export declare class FriendPlaceDto {
    id: string;
    name: string;
    notes?: string;
    latitude: number;
    longitude: number;
    address?: string;
    tripDate?: string;
}
export declare class FriendDto {
    shareCode: string;
    name: string;
    places: FriendPlaceDto[];
}
export declare class MyCodeDto {
    shareCode: string;
    placesCount: number;
}
