import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface MessageDto {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequestDto {
  messages: MessageDto[];
  language?: 'fr' | 'en';
}

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @UseGuards(JwtAuthGuard)
  @Post('chat')
  async chat(@Body() body: ChatRequestDto) {
    const { messages, language = 'fr' } = body;
    return this.assistantService.chat(messages, language);
  }
}
