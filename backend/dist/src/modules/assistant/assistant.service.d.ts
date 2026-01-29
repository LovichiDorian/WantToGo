import { ConfigService } from '@nestjs/config';
interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
export declare class AssistantService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    chat(messages: Message[], language?: 'fr' | 'en'): Promise<{
        content: string;
        provider: string;
    }>;
    private callMistral;
    private callGemini;
}
export {};
