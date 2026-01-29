import { PlacesService } from './places.service';
import { CreatePlaceDto, UpdatePlaceDto } from './places.dto';
export declare class PlacesController {
    private readonly placesService;
    constructor(placesService: PlacesService);
    findAll(): Promise<{
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
    findOne(id: string): Promise<{
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
    create(dto: CreatePlaceDto): Promise<{
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
    update(id: string, dto: UpdatePlaceDto): Promise<{
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
    remove(id: string): Promise<void>;
}
