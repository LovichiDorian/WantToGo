import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  nameFr: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateTripDto {
  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsString()
  @IsOptional()
  nameFr?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class AddTripPlaceDto {
  @IsString()
  @IsNotEmpty()
  placeId: string;
}

export class AddTripMemberDto {
  @IsString()
  @IsNotEmpty()
  shareCode: string;

  @IsString()
  @IsOptional()
  @IsIn(['editor', 'member'])
  role?: 'editor' | 'member';
}
