import { AssistantService } from './assistant.service';
interface MessageDto {
    role: 'user' | 'assistant';
    content: string;
}
interface ChatRequestDto {
    messages: MessageDto[];
    language?: 'fr' | 'en';
}
export declare class AssistantController {
    private readonly assistantService;
    constructor(assistantService: AssistantService);
    chat(body: ChatRequestDto): Promise<{
        content: string;
        provider: string;
    }>;
}
export {};
