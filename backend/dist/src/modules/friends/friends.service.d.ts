import { PrismaService } from '../../prisma/prisma.service';
import { FriendDto, MyCodeDto, FriendshipDto } from './friends.dto';
export declare class FriendsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyCode(userId: string): Promise<MyCodeDto>;
    getFriendPlaces(shareCode: string): Promise<FriendDto>;
    addFriend(userId: string, friendCode: string): Promise<FriendshipDto>;
    getFriends(userId: string): Promise<FriendshipDto[]>;
    deleteFriend(userId: string, friendshipId: string): Promise<void>;
    updateMyName(userId: string, name: string): Promise<void>;
}
