import { IsString, IsNumber, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  tripDate?: string;

  @IsOptional()
  @IsString()
  clientId?: string;
}

export class UpdatePlaceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  tripDate?: string;
}

export class MarkVisitedDto {
  @IsOptional()
  @IsBoolean()
  isNearby?: boolean;

  @IsOptional()
  @IsNumber()
  userLatitude?: number;

  @IsOptional()
  @IsNumber()
  userLongitude?: number;
}
