import { PhotosService } from './photos.service';
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
export declare class PhotosController {
    private readonly photosService;
    constructor(photosService: PhotosService);
    uploadPhoto(placeId: string, file: UploadedFileType): Promise<{
        id: string;
        createdAt: Date;
        placeId: string;
        filename: string;
        mimeType: string;
        size: number;
    }>;
    deletePhoto(placeId: string, photoId: string): Promise<void>;
}
export {};
