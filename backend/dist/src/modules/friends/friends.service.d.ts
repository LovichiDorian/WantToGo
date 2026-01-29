import { PrismaService } from '../../prisma/prisma.service';
import { FriendDto, MyCodeDto } from './friends.dto';
export declare class FriendsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyCode(deviceId: string): Promise<MyCodeDto>;
    getFriendPlaces(shareCode: string): Promise<FriendDto>;
    updateMyName(deviceId: string, name: string): Promise<void>;
}
