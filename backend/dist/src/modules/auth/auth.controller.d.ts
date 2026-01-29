import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    getMe(req: {
        user: {
            id: string;
        };
    }): Promise<{
        id: string;
        email: string;
        shareCode: string;
        name: string | null;
    } | null>;
}
