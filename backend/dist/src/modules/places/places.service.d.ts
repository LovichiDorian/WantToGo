import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlaceDto, UpdatePlaceDto, MarkVisitedDto } from './places.dto';
import { Place } from '@prisma/client';
import { GamificationService } from '../gamification/gamification.service';
export declare class PlacesService {
    private readonly prisma;
    private readonly gamificationService;
    constructor(prisma: PrismaService, gamificationService: GamificationService);
    findAll(userId: string): Promise<Place[]>;
    findOne(id: string, userId: string): Promise<Place>;
    create(userId: string, dto: CreatePlaceDto): Promise<Place & {
        xpEarned?: number;
        achievements?: {
            code: string;
            xpReward: number;
        }[];
    }>;
    update(id: string, userId: string, dto: UpdatePlaceDto): Promise<Place>;
    markVisited(id: string, userId: string, dto: MarkVisitedDto): Promise<Place & {
        xpEarned: number;
        bonusXp: number;
        achievements: {
            code: string;
            xpReward: number;
        }[];
    }>;
    undoVisited(id: string, userId: string): Promise<Place>;
    remove(id: string, userId: string): Promise<Place>;
    findByClientId(clientId: string, userId: string): Promise<Place | null>;
    getStats(userId: string): Promise<{
        totalPlaces: number;
        visitedPlaces: number;
        placesWithPhotos: number;
        visitRate: number;
    }>;
}
