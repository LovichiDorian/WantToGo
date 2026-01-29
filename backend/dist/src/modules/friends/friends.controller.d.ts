import { FriendsService } from './friends.service';
import { FriendDto, MyCodeDto, AddFriendDto, FriendshipDto } from './friends.dto';
interface RequestWithUser {
    user: {
        id: string;
        email: string;
    };
}
export declare class FriendsController {
    private readonly friendsService;
    constructor(friendsService: FriendsService);
    getMyCode(req: RequestWithUser): Promise<MyCodeDto>;
    getFriends(req: RequestWithUser): Promise<FriendshipDto[]>;
    addFriend(req: RequestWithUser, addFriendDto: AddFriendDto): Promise<FriendshipDto>;
    deleteFriend(req: RequestWithUser, friendshipId: string): Promise<{
        success: boolean;
    }>;
    getFriendPlaces(shareCode: string): Promise<FriendDto>;
}
export {};
