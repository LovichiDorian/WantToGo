import { PlacesService } from './places.service';
import { CreatePlaceDto, UpdatePlaceDto, MarkVisitedDto } from './places.dto';
import { PlaceImageService } from '../place-image/place-image.service';
interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
    };
}
export declare class PlacesController {
    private readonly placesService;
    private readonly placeImageService;
    constructor(placesService: PlacesService, placeImageService: PlaceImageService);
    findAll(req: RequestWithUser): Promise<{
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
    }[]>;
    getStats(req: RequestWithUser): Promise<{
        totalPlaces: number;
        visitedPlaces: number;
        placesWithPhotos: number;
        visitRate: number;
    }>;
    getPlaceImage(id: string, req: RequestWithUser): Promise<{
        imageUrl: string;
        source: string;
        query?: string;
    }>;
    findOne(id: string, req: RequestWithUser): Promise<{
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
    }>;
    create(dto: CreatePlaceDto, req: RequestWithUser): Promise<{
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
    } & {
        xpEarned?: number;
        achievements?: {
            code: string;
            xpReward: number;
        }[];
    }>;
    update(id: string, dto: UpdatePlaceDto, req: RequestWithUser): Promise<{
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
    }>;
    markVisited(id: string, dto: MarkVisitedDto, req: RequestWithUser): Promise<{
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
    } & {
        xpEarned: number;
        bonusXp: number;
        achievements: {
            code: string;
            xpReward: number;
        }[];
    }>;
    undoVisited(id: string, req: RequestWithUser): Promise<{
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
    }>;
    remove(id: string, req: RequestWithUser): Promise<void>;
}
export {};
