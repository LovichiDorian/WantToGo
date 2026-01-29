import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AddFriendDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
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

export class FriendshipDto {
  id: string;
  friendCode: string;
  friendName: string;
  color: string;
  places: FriendPlaceDto[];
  createdAt: string;
}

export class MyCodeDto {
  shareCode: string;
  placesCount: number;
}
