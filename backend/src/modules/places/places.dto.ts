import { IsString, IsNumber, IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsDateString()
  tripDate?: string;
}
