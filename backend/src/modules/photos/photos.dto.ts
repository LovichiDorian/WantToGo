import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  filename: string;

  @IsString()
  mimeType: string;

  @IsNumber()
  size: number;
}
