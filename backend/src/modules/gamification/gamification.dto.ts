import { IsIn, IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateLanguageDto {
  @IsString()
  @IsIn(['fr', 'en'])
  language: 'fr' | 'en';
}

export class AwardXpDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class PlaceVisitedDto {
  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsBoolean()
  @IsOptional()
  isNearby?: boolean;
}
