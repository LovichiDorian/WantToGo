import { TripsService } from './trips.service';
import { CreateTripDto, UpdateTripDto, AddTripPlaceDto, AddTripMemberDto } from './trips.dto';
export declare class TripsController {
    private readonly tripsService;
    constructor(tripsService: TripsService);
    createTrip(req: {
        user: {
            id: string;
        };
    }, dto: CreateTripDto): Promise<{
        places: ({
            place: {
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
            };
        } & {
            id: string;
            placeId: string;
            tripId: string;
            addedAt: Date;
            addedBy: string | null;
        })[];
        members: ({
            user: {
                shareCode: string;
                email: string;
                id: string;
                name: string | null;
            };
        } & {
            id: string;
            userId: string;
            role: string;
            joinedAt: Date;
            tripId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nameEn: string;
        nameFr: string;
        creatorId: string;
        description: string | null;
        isPublic: boolean;
        coverImage: string | null;
    }>;
    getUserTrips(req: {
        user: {
            id: string;
        };
    }): Promise<{
        trips: ({
            _count: {
                places: number;
            };
            creator: {
                email: string;
                id: string;
                name: string | null;
            };
            members: ({
                user: {
                    shareCode: string;
                    email: string;
                    id: string;
                    name: string | null;
                };
            } & {
                id: string;
                userId: string;
                role: string;
                joinedAt: Date;
                tripId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameEn: string;
            nameFr: string;
            creatorId: string;
            description: string | null;
            isPublic: boolean;
            coverImage: string | null;
        })[];
        limits: {
            current: number;
            max: number | null;
            isPremium: boolean;
        };
    }>;
    getTripById(tripId: string, req: {
        user: {
            id: string;
        };
    }): Promise<{
        userRole: string | null;
        places: ({
            place: {
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
            };
        } & {
            id: string;
            placeId: string;
            tripId: string;
            addedAt: Date;
            addedBy: string | null;
        })[];
        creator: {
            email: string;
            id: string;
            name: string | null;
        };
        members: ({
            user: {
                shareCode: string;
                email: string;
                id: string;
                name: string | null;
                level: number;
            };
        } & {
            id: string;
            userId: string;
            role: string;
            joinedAt: Date;
            tripId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nameEn: string;
        nameFr: string;
        creatorId: string;
        description: string | null;
        isPublic: boolean;
        coverImage: string | null;
    }>;
    updateTrip(tripId: string, req: {
        user: {
            id: string;
        };
    }, dto: UpdateTripDto): Promise<{
        places: ({
            place: {
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
            };
        } & {
            id: string;
            placeId: string;
            tripId: string;
            addedAt: Date;
            addedBy: string | null;
        })[];
        members: ({
            user: {
                shareCode: string;
                email: string;
                id: string;
                name: string | null;
            };
        } & {
            id: string;
            userId: string;
            role: string;
            joinedAt: Date;
            tripId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nameEn: string;
        nameFr: string;
        creatorId: string;
        description: string | null;
        isPublic: boolean;
        coverImage: string | null;
    }>;
    deleteTrip(tripId: string, req: {
        user: {
            id: string;
        };
    }): Promise<{
        success: boolean;
    }>;
    addPlaceToTrip(tripId: string, req: {
        user: {
            id: string;
        };
    }, dto: AddTripPlaceDto): Promise<{
        place: {
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
        };
    } & {
        id: string;
        placeId: string;
        tripId: string;
        addedAt: Date;
        addedBy: string | null;
    }>;
    removePlaceFromTrip(tripId: string, placeId: string, req: {
        user: {
            id: string;
        };
    }): Promise<{
        success: boolean;
    }>;
    addMemberToTrip(tripId: string, req: {
        user: {
            id: string;
        };
    }, dto: AddTripMemberDto): Promise<{
        user: {
            shareCode: string;
            email: string;
            id: string;
            name: string | null;
        };
    } & {
        id: string;
        userId: string;
        role: string;
        joinedAt: Date;
        tripId: string;
    }>;
    removeMemberFromTrip(tripId: string, memberId: string, req: {
        user: {
            id: string;
        };
    }): Promise<{
        success: boolean;
    }>;
    leaveTrip(tripId: string, req: {
        user: {
            id: string;
        };
    }): Promise<{
        success: boolean;
    }>;
}
