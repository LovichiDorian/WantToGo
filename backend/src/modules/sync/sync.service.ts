import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlacesService } from '../places/places.service';
import {
  BulkSyncRequestDto,
  BulkSyncResponse,
  SyncActionDto,
  SyncActionType,
  SyncEntityType,
  IdMapping,
  SyncConflict,
} from './sync.dto';
import { CreatePlaceDto, UpdatePlaceDto } from '../places/places.dto';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly placesService: PlacesService,
  ) {}

  /**
   * Process a batch of sync actions from the client.
   * Uses "last write wins" strategy based on timestamps.
   */
  async processBulkSync(
    userId: string,
    dto: BulkSyncRequestDto,
  ): Promise<BulkSyncResponse> {
    const idMappings: IdMapping[] = [];
    const conflicts: SyncConflict[] = [];

    // Process each action in order
    for (const action of dto.actions) {
      try {
        if (action.entityType === SyncEntityType.PLACE) {
          const mapping = await this.processPlaceAction(userId, action, conflicts);
          if (mapping) {
            idMappings.push(mapping);
          }
        }
        // TODO: Handle photo sync actions
      } catch (error) {
        this.logger.error(`Failed to process sync action: ${JSON.stringify(action)}`, error);
      }
    }

    // Get all updated places to return to client
    const updatedPlaces = await this.placesService.findAll(userId);

    return {
      success: true,
      idMappings,
      updatedPlaces: updatedPlaces as unknown as Record<string, unknown>[],
      conflicts,
      syncedAt: new Date().toISOString(),
    };
  }

  /**
   * Process a single place sync action
   */
  private async processPlaceAction(
    userId: string,
    action: SyncActionDto,
    conflicts: SyncConflict[],
  ): Promise<IdMapping | null> {
    const payload = action.payload as Record<string, unknown> | undefined;
    const actionTimestamp = new Date(action.timestamp);

    switch (action.actionType) {
      case SyncActionType.CREATE: {
        // Check if this clientId already exists (duplicate sync)
        const existing = await this.placesService.findByClientId(action.clientId, userId);
        if (existing) {
          // Already synced, return existing mapping
          return { clientId: action.clientId, serverId: existing.id };
        }

        // Create new place
        const createDto: CreatePlaceDto = {
          name: payload?.name as string,
          notes: payload?.notes as string | undefined,
          latitude: payload?.latitude as number,
          longitude: payload?.longitude as number,
          address: payload?.address as string | undefined,
          tripDate: payload?.tripDate as string | undefined,
          clientId: action.clientId,
        };

        const newPlace = await this.placesService.create(userId, createDto);
        return { clientId: action.clientId, serverId: newPlace.id };
      }

      case SyncActionType.UPDATE: {
        if (!action.serverId) {
          // Try to find by clientId if serverId not provided
          const existing = await this.placesService.findByClientId(action.clientId, userId);
          if (!existing) {
            this.logger.warn(`Cannot update - place not found for clientId: ${action.clientId}`);
            return null;
          }
          action.serverId = existing.id;
        }

        // Check for conflicts using last-write-wins
        try {
          const serverPlace = await this.placesService.findOne(action.serverId, userId);
          
          if (serverPlace.updatedAt > actionTimestamp) {
            // Server version is newer - record conflict but use server version
            conflicts.push({
              clientId: action.clientId,
              serverVersion: serverPlace as unknown as Record<string, unknown>,
              resolution: 'server_wins',
            });
            return null;
          }

          // Client version is newer - apply update
          const updateDto: UpdatePlaceDto = {
            name: payload?.name as string | undefined,
            notes: payload?.notes as string | undefined,
            latitude: payload?.latitude as number | undefined,
            longitude: payload?.longitude as number | undefined,
            address: payload?.address as string | undefined,
            tripDate: payload?.tripDate as string | undefined,
          };

          await this.placesService.update(action.serverId, userId, updateDto);
        } catch {
          this.logger.warn(`Place not found for update: ${action.serverId}`);
        }
        return null;
      }

      case SyncActionType.DELETE: {
        if (!action.serverId) {
          // Try to find by clientId
          const existing = await this.placesService.findByClientId(action.clientId, userId);
          if (!existing) {
            return null; // Already deleted or never existed
          }
          action.serverId = existing.id;
        }

        try {
          await this.placesService.remove(action.serverId, userId);
        } catch {
          // Already deleted
        }
        return null;
      }

      default:
        return null;
    }
  }

  /**
   * Get changes since a given timestamp (for delta sync)
   */
  async getChangesSince(userId: string, since: Date) {
    return this.prisma.place.findMany({
      where: {
        userId,
        updatedAt: {
          gt: since,
        },
      },
      include: {
        photos: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });
  }
}
