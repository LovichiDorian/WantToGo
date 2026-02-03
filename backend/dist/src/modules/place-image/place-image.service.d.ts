import { ConfigService } from '@nestjs/config';
import { PlacesService } from '../places/places.service';
interface PlaceImageResult {
    imageUrl: string;
    source: 'unsplash' | 'ai_generated' | 'fallback';
    query?: string;
}
export declare class PlaceImageService {
    private readonly configService;
    private readonly placesService;
    private readonly logger;
    constructor(configService: ConfigService, placesService: PlacesService);
    getPlaceImage(placeId: string, userId: string): Promise<PlaceImageResult>;
    private determineStrategy;
    private callAI;
    private callMistral;
    private callGemini;
    private fetchUnsplashImage;
    private generateAiImage;
    private getFallbackImageUrl;
    private cleanPlaceNameForQuery;
    private hashCode;
    private cacheResult;
}
export {};
