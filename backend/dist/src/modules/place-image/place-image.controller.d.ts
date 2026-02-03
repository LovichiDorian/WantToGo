import { PlaceImageService } from './place-image.service';
export declare class PlaceImageController {
    private readonly placeImageService;
    constructor(placeImageService: PlaceImageService);
    getPlaceImage(id: string, req: {
        user: {
            id: string;
        };
    }): Promise<{
        imageUrl: string;
        source: string;
        query?: string;
    }>;
}
