import { apiRequest } from './client';
import { getStoredToken } from './auth';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: string;
  provider: 'mistral' | 'gemini';
}

export interface PlaceSuggestion {
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

/**
 * Send a chat message to the assistant
 */
export async function sendMessage(
  messages: Message[],
  language: 'fr' | 'en' = 'fr'
): Promise<ChatResponse> {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  return apiRequest<ChatResponse>('/assistant/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ messages, language }),
  });
}

/**
 * Parse place suggestion from assistant response
 */
export function parsePlaceSuggestion(content: string): PlaceSuggestion | null {
  try {
    // Look for JSON at the end of the response
    const jsonMatch = content.match(/\{"addPlace":\s*\{[^}]+\}\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.addPlace) {
        return parsed.addPlace;
      }
    }
  } catch {
    // No valid JSON found
  }
  return null;
}

/**
 * Remove place suggestion JSON from content for display
 */
export function cleanContent(content: string): string {
  return content.replace(/\{"addPlace":\s*\{[^}]+\}\}/g, '').trim();
}
