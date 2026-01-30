import { PlacesService } from './places.service';
import { CreatePlaceDto, UpdatePlaceDto } from './places.dto';
interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
    };
}
export declare class PlacesController {
    private readonly placesService;
    constructor(placesService: PlacesService);
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
        tripDate: Date | null;
        deletedAt: Date | null;
        userId: string;
    }[]>;
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
        tripDate: Date | null;
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
        tripDate: Date | null;
        deletedAt: Date | null;
        userId: string;
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
        tripDate: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    remove(id: string, req: RequestWithUser): Promise<void>;
}
export {};
