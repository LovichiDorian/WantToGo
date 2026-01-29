import { IsString, IsEnum, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export enum SyncActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum SyncEntityType {
  PLACE = 'place',
  PHOTO = 'photo',
}

export class SyncActionDto {
  @IsEnum(SyncActionType)
  actionType: SyncActionType;

  @IsEnum(SyncEntityType)
  entityType: SyncEntityType;

  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  serverId?: string;

  @IsOptional()
  payload?: Record<string, unknown>;

  @IsDateString()
  timestamp: string;
}

export class BulkSyncRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncActionDto)
  actions: SyncActionDto[];

  @IsOptional()
  @IsDateString()
  lastSyncedAt?: string;
}

export interface IdMapping {
  clientId: string;
  serverId: string;
}

export interface SyncConflict {
  clientId: string;
  serverVersion: Record<string, unknown>;
  resolution: 'server_wins' | 'client_wins';
}

export interface BulkSyncResponse {
  success: boolean;
  idMappings: IdMapping[];
  updatedPlaces: Record<string, unknown>[];
  conflicts: SyncConflict[];
  syncedAt: string;
}
