import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { extname } from 'path';
import { randomUUID } from 'crypto';

// TODO: Replace with actual user ID from auth middleware
const TEMP_USER_ID = 'default-user-id';

// Multer file interface
interface UploadedFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Controller('places/:placeId/photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  /**
   * Upload a photo for a place
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      dest: './uploads/photos',
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new BadRequestException('Only image files are allowed') as unknown as Error, false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadPhoto(
    @Param('placeId') placeId: string,
    @UploadedFile() file: UploadedFileType,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.photosService.create(TEMP_USER_ID, placeId, {
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    });
  }

  /**
   * Delete a photo
   */
  @Delete(':photoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePhoto(
    @Param('placeId') placeId: string,
    @Param('photoId') photoId: string,
  ) {
    await this.photosService.remove(TEMP_USER_ID, placeId, photoId);
  }
}
