import { IsString, IsNotEmpty, Length } from 'class-validator';

export class AddFriendDto {
  @IsString()
  @IsNotEmpty()
  @Length(36, 36)
  shareCode: string;
}

export class FriendPlaceDto {
  id: string;
  name: string;
  notes?: string;
  latitude: number;
  longitude: number;
  address?: string;
  tripDate?: string;
}

export class FriendDto {
  shareCode: string;
  name: string;
  places: FriendPlaceDto[];
}

export class MyCodeDto {
  shareCode: string;
  placesCount: number;
}
