export declare class MessageDto {
    role: 'user' | 'assistant';
    content: string;
}
export declare class ChatRequestDto {
    messages: MessageDto[];
    language?: 'fr' | 'en';
}
export declare class ChatResponseDto {
    content: string;
    provider: 'mistral' | 'gemini';
}
