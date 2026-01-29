import { FriendsService } from './friends.service';
import { FriendDto, MyCodeDto } from './friends.dto';
export declare class FriendsController {
    private readonly friendsService;
    constructor(friendsService: FriendsService);
    getMyCode(deviceId: string): Promise<MyCodeDto>;
    getFriendPlaces(shareCode: string): Promise<FriendDto>;
    updateMyName(deviceId: string, name: string): Promise<{
        success: boolean;
    }>;
}
