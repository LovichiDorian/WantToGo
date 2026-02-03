import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlacesService } from '../places/places.service';

interface ImageStrategy {
  strategy: 'unsplash' | 'ai_fallback';
  unsplash_query?: string;
  ai_prompt?: string;
}

interface PlaceImageResult {
  imageUrl: string;
  source: 'unsplash' | 'ai_generated' | 'fallback';
  query?: string;
}

// In-memory cache for image URLs (TTL: 1 hour)
const imageCache = new Map<string, { result: PlaceImageResult; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

@Injectable()
export class PlaceImageService {
  private readonly logger = new Logger(PlaceImageService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly placesService: PlacesService,
  ) {}

  /**
   * Get an image for a place by ID
   */
  async getPlaceImage(placeId: string, userId: string): Promise<PlaceImageResult> {
    // Check cache first
    const cached = imageCache.get(placeId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      this.logger.debug(`Cache hit for place ${placeId}`);
      return cached.result;
    }

    // Get place details (includes photos relation)
    const place = await this.placesService.findOne(placeId, userId) as {
      name: string;
      address: string | null;
      notes: string | null;
      photos?: { filename: string }[];
    };

    // If place has photos, use the first one
    if (place.photos && place.photos.length > 0) {
      const result: PlaceImageResult = {
        imageUrl: place.photos[0].filename,
        source: 'fallback',
      };
      this.cacheResult(placeId, result);
      return result;
    }

    // Use AI to determine the best strategy
    const strategy = await this.determineStrategy(place.name, place.address, place.notes);
    this.logger.log(`Strategy for "${place.name}": ${strategy.strategy}`);

    if (strategy.strategy === 'unsplash' && strategy.unsplash_query) {
      const imageUrl = await this.fetchUnsplashImage(strategy.unsplash_query);
      if (imageUrl) {
        const result: PlaceImageResult = {
          imageUrl,
          source: 'unsplash',
          query: strategy.unsplash_query,
        };
        this.cacheResult(placeId, result);
        return result;
      }
    }

    // AI fallback (generate image) - for now, use a fallback URL
    if (strategy.strategy === 'ai_fallback' && strategy.ai_prompt) {
      const imageUrl = await this.generateAiImage(strategy.ai_prompt);
      if (imageUrl) {
        const result: PlaceImageResult = {
          imageUrl,
          source: 'ai_generated',
        };
        this.cacheResult(placeId, result);
        return result;
      }
    }

    // Ultimate fallback: use Unsplash Source (no API key needed)
    const fallbackUrl = this.getFallbackImageUrl(place.name);
    const result: PlaceImageResult = {
      imageUrl: fallbackUrl,
      source: 'fallback',
    };
    this.cacheResult(placeId, result);
    return result;
  }

  /**
   * Use AI to determine the best image strategy
   */
  private async determineStrategy(
    name: string,
    address?: string | null,
    notes?: string | null,
  ): Promise<ImageStrategy> {
    const systemPrompt = `Tu es un assistant qui aide à trouver des images pour des lieux de voyage.
Analyse le lieu donné et détermine la meilleure stratégie pour trouver une image pertinente.

RÈGLES:
1. Pour les lieux touristiques connus (monuments, villes célèbres, sites naturels), utilise "unsplash"
2. Pour les lieux très spécifiques, locaux ou peu connus, utilise "ai_fallback"
3. La query Unsplash doit être en anglais, simple et efficace (2-4 mots max)

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après:
{
  "strategy": "unsplash" | "ai_fallback",
  "unsplash_query": "query for unsplash if strategy is unsplash",
  "ai_prompt": "detailed prompt for image generation if strategy is ai_fallback"
}`;

    const userMessage = `Lieu: ${name}${address ? `\nAdresse: ${address}` : ''}${notes ? `\nNotes: ${notes}` : ''}`;

    try {
      const response = await this.callAI(systemPrompt, userMessage);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as ImageStrategy;
      }
    } catch (error) {
      this.logger.warn('Failed to get AI strategy, using default', error);
    }

    // Default: try Unsplash with place name
    return {
      strategy: 'unsplash',
      unsplash_query: this.cleanPlaceNameForQuery(name),
    };
  }

  /**
   * Call AI (Mistral first, then Gemini as fallback)
   */
  private async callAI(systemPrompt: string, userMessage: string): Promise<string> {
    // Try Mistral first
    try {
      return await this.callMistral(systemPrompt, userMessage);
    } catch (error) {
      this.logger.warn('Mistral failed, trying Gemini', error);
    }

    // Fallback to Gemini
    return await this.callGemini(systemPrompt, userMessage);
  }

  private async callMistral(systemPrompt: string, userMessage: string): Promise<string> {
    const apiKey = this.configService.get<string>('MISTRAL_API_KEY');
    if (!apiKey) {
      throw new Error('Mistral API key not configured');
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 256,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callGemini(systemPrompt: string, userMessage: string): Promise<string> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${userMessage}` }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 256,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  /**
   * Fetch image from Unsplash API
   */
  private async fetchUnsplashImage(query: string): Promise<string | null> {
    const accessKey = this.configService.get<string>('UNSPLASH_ACCESS_KEY');
    
    if (!accessKey) {
      this.logger.warn('Unsplash API key not configured, using fallback');
      return null;
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        },
      );

      if (!response.ok) {
        this.logger.warn(`Unsplash API error: ${response.status}`);
        return null;
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Use regular size for good quality without being too large
        return data.results[0].urls.regular;
      }

      return null;
    } catch (error) {
      this.logger.error('Failed to fetch from Unsplash', error);
      return null;
    }
  }

  /**
   * Generate image using AI (Gemini Imagen)
   * Note: This is a placeholder - Gemini image generation requires specific API access
   */
  private async generateAiImage(prompt: string): Promise<string | null> {
    // For now, return null to fall back to Unsplash Source
    // In the future, integrate with Gemini Imagen or similar service
    this.logger.debug(`AI image generation requested for: ${prompt}`);
    return null;
  }

  /**
   * Fallback - returns empty to let frontend use local fallback image
   */
  private getFallbackImageUrl(_placeName: string): string {
    // Return a generic travel image URL or let the frontend handle fallback
    // Using a reliable static image service
    return '/assets/fallback-city.jpg';
  }

  /**
   * Clean place name for search query
   */
  private cleanPlaceNameForQuery(name: string): string {
    // Remove common suffixes and clean up
    return name
      .replace(/\b(restaurant|hotel|café|bar|shop|store|museum|park)\b/gi, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 3)
      .join(' ');
  }

  /**
   * Simple hash function for consistent random images
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Cache the result
   */
  private cacheResult(placeId: string, result: PlaceImageResult): void {
    imageCache.set(placeId, { result, timestamp: Date.now() });
  }
}
