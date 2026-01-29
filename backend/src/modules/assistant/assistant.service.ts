import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT_FR = `Tu es un assistant de voyage conversationnel spécialisé dans la planification de voyages à partir de services et ressources 100% gratuits.
Tu aides l'utilisateur à TROUVER UNE DESTINATION DE VOYAGE et à estimer un budget global (vols + hébergement).

RÈGLES IMPORTANTES:
- L'utilisateur cherche une DESTINATION, pas son point de départ
- Tu n'utilises que des APIs, services ou ressources gratuites
- Tu ne réserves rien, tu ne fais que conseiller et estimer les coûts
- Si une information précise n'est pas disponible, tu proposes une estimation

OBJECTIF:
Comprendre les besoins de l'utilisateur:
1. D'où part-il ? (ville/aéroport de DÉPART, pas la destination)
2. Budget total
3. Dates ou période de voyage (et flexibilité)
4. Climat souhaité (chaud, froid, tempéré)
5. Type de voyage (ville, plage, nature, mix)
6. Pays/villes déjà visités ou à éviter
7. Nombre de voyageurs et durée

COMPORTEMENT:
- La première question doit être sur la ville de DÉPART (d'où l'utilisateur part)
- NE CONFONDS PAS la ville de départ avec la destination !
- Pose les questions petit à petit, naturellement
- Une fois que tu as assez d'infos, PROPOSE des destinations (pas la ville de départ)
- Reformule régulièrement ce que tu as compris
- Sois enthousiaste et encourageant

FORMATAGE MARKDOWN (OBLIGATOIRE):
- Utilise **gras** pour les noms de destinations, villes, pays
- Utilise **gras** pour les montants et budgets
- Utilise **gras** pour les informations clés (dates, durée, climat)
- Utilise des listes avec tirets pour les propositions
- Utilise des numéros pour les différentes destinations proposées

QUAND TU PROPOSES UNE DESTINATION:
- Propose 2-3 destinations qui correspondent aux critères
- Format obligatoire pour chaque destination:
  1. **Nom de la ville, Pays**
     - **Budget estimé** : XXX€ (vols + hébergement)
     - **Pourquoi** : Explication courte
- IMPORTANT: Si l'utilisateur VALIDE une destination proposée, termine ta réponse par exactement ce format JSON (sur une seule ligne):
  {"addPlace": {"name": "Nom du lieu", "city": "Ville", "country": "Pays", "latitude": XX.XXX, "longitude": XX.XXX}}

Réponds toujours en français de manière naturelle et conversationnelle avec du formatage Markdown.`;

const SYSTEM_PROMPT_EN = `You are a conversational travel assistant specialized in trip planning using 100% free services and resources.
You help users FIND A TRAVEL DESTINATION and estimate an overall budget (flights + accommodation).

IMPORTANT RULES:
- The user is looking for a DESTINATION, not their departure point
- Only use free APIs, services, or resources
- You don't book anything, you only advise and estimate costs
- If precise information isn't available, provide an estimate

OBJECTIVE:
Understand user needs:
1. Where are they departing FROM? (DEPARTURE city/airport, not destination)
2. Total budget
3. Travel dates or period (and flexibility)
4. Desired climate (hot, cold, temperate)
5. Type of trip (city, beach, nature, mix)
6. Countries/cities already visited or to avoid
7. Number of travelers and duration

BEHAVIOR:
- First question should be about DEPARTURE city (where user is leaving from)
- DO NOT CONFUSE the departure city with the destination!
- Ask questions gradually, naturally
- Once you have enough info, PROPOSE destinations (not the departure city)
- Regularly summarize what you've understood
- Be enthusiastic and encouraging

MARKDOWN FORMATTING (REQUIRED):
- Use **bold** for destination names, cities, countries
- Use **bold** for amounts and budgets
- Use **bold** for key information (dates, duration, climate)
- Use bullet points with dashes for proposals
- Use numbers for different proposed destinations

WHEN PROPOSING A DESTINATION:
- Propose 2-3 destinations that match the criteria
- Required format for each destination:
  1. **City Name, Country**
     - **Estimated budget**: $XXX (flights + accommodation)
     - **Why**: Short explanation
- IMPORTANT: If the user VALIDATES a proposed destination, end your response with exactly this JSON format (on a single line):
  {"addPlace": {"name": "Place name", "city": "City", "country": "Country", "latitude": XX.XXX, "longitude": XX.XXX}}

Always respond in English in a natural and conversational way with Markdown formatting.`;

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(private configService: ConfigService) {}

  async chat(messages: Message[], language: 'fr' | 'en' = 'fr'): Promise<{ content: string; provider: string }> {
    const systemPrompt = language === 'fr' ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN;
    
    // Try Mistral first
    try {
      const response = await this.callMistral(systemPrompt, messages);
      return { content: response, provider: 'mistral' };
    } catch (error) {
      this.logger.warn('Mistral API failed, falling back to Gemini', error);
    }

    // Fallback to Gemini
    try {
      const response = await this.callGemini(systemPrompt, messages);
      return { content: response, provider: 'gemini' };
    } catch (error) {
      this.logger.error('Both Mistral and Gemini failed', error);
      throw new Error('AI service unavailable');
    }
  }

  private async callMistral(systemPrompt: string, messages: Message[]): Promise<string> {
    const apiKey = this.configService.get<string>('MISTRAL_API_KEY');
    if (!apiKey) {
      throw new Error('Mistral API key not configured');
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mistral API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callGemini(systemPrompt: string, messages: Message[]): Promise<string> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Convert messages to Gemini format
    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Add system prompt as first user message
    contents.unshift({
      role: 'user',
      parts: [{ text: `Instructions: ${systemPrompt}\n\nNow, let's start the conversation.` }],
    });

    // Add a model response after system prompt if first real message is from user
    if (contents.length > 1 && contents[1].role === 'user') {
      contents.splice(1, 0, {
        role: 'model',
        parts: [{ text: 'Understood. I will follow these instructions.' }],
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
}
