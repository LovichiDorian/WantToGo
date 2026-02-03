"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PlaceImageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceImageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const places_service_1 = require("../places/places.service");
const imageCache = new Map();
const CACHE_TTL = 60 * 60 * 1000;
let PlaceImageService = PlaceImageService_1 = class PlaceImageService {
    configService;
    placesService;
    logger = new common_1.Logger(PlaceImageService_1.name);
    constructor(configService, placesService) {
        this.configService = configService;
        this.placesService = placesService;
    }
    async getPlaceImage(placeId, userId) {
        const cached = imageCache.get(placeId);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            this.logger.debug(`Cache hit for place ${placeId}`);
            return cached.result;
        }
        const place = await this.placesService.findOne(placeId, userId);
        if (place.photos && place.photos.length > 0) {
            const result = {
                imageUrl: place.photos[0].filename,
                source: 'fallback',
            };
            this.cacheResult(placeId, result);
            return result;
        }
        const strategy = await this.determineStrategy(place.name, place.address, place.notes);
        this.logger.log(`Strategy for "${place.name}": ${strategy.strategy}`);
        if (strategy.strategy === 'unsplash' && strategy.unsplash_query) {
            const imageUrl = await this.fetchUnsplashImage(strategy.unsplash_query);
            if (imageUrl) {
                const result = {
                    imageUrl,
                    source: 'unsplash',
                    query: strategy.unsplash_query,
                };
                this.cacheResult(placeId, result);
                return result;
            }
        }
        if (strategy.strategy === 'ai_fallback' && strategy.ai_prompt) {
            const imageUrl = await this.generateAiImage(strategy.ai_prompt);
            if (imageUrl) {
                const result = {
                    imageUrl,
                    source: 'ai_generated',
                };
                this.cacheResult(placeId, result);
                return result;
            }
        }
        const fallbackUrl = this.getFallbackImageUrl(place.name);
        const result = {
            imageUrl: fallbackUrl,
            source: 'fallback',
        };
        this.cacheResult(placeId, result);
        return result;
    }
    async determineStrategy(name, address, notes) {
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
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch (error) {
            this.logger.warn('Failed to get AI strategy, using default', error);
        }
        return {
            strategy: 'unsplash',
            unsplash_query: this.cleanPlaceNameForQuery(name),
        };
    }
    async callAI(systemPrompt, userMessage) {
        try {
            return await this.callMistral(systemPrompt, userMessage);
        }
        catch (error) {
            this.logger.warn('Mistral failed, trying Gemini', error);
        }
        return await this.callGemini(systemPrompt, userMessage);
    }
    async callMistral(systemPrompt, userMessage) {
        const apiKey = this.configService.get('MISTRAL_API_KEY');
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
    async callGemini(systemPrompt, userMessage) {
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('Gemini API key not configured');
        }
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
        });
        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
    async fetchUnsplashImage(query) {
        const accessKey = this.configService.get('UNSPLASH_ACCESS_KEY');
        if (!accessKey) {
            this.logger.warn('Unsplash API key not configured, using fallback');
            return null;
        }
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
                headers: {
                    Authorization: `Client-ID ${accessKey}`,
                },
            });
            if (!response.ok) {
                this.logger.warn(`Unsplash API error: ${response.status}`);
                return null;
            }
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].urls.regular;
            }
            return null;
        }
        catch (error) {
            this.logger.error('Failed to fetch from Unsplash', error);
            return null;
        }
    }
    async generateAiImage(prompt) {
        this.logger.debug(`AI image generation requested for: ${prompt}`);
        return null;
    }
    getFallbackImageUrl(_placeName) {
        return '/assets/fallback-city.jpg';
    }
    cleanPlaceNameForQuery(name) {
        return name
            .replace(/\b(restaurant|hotel|café|bar|shop|store|museum|park)\b/gi, '')
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .slice(0, 3)
            .join(' ');
    }
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
    cacheResult(placeId, result) {
        imageCache.set(placeId, { result, timestamp: Date.now() });
    }
};
exports.PlaceImageService = PlaceImageService;
exports.PlaceImageService = PlaceImageService = PlaceImageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        places_service_1.PlacesService])
], PlaceImageService);
//# sourceMappingURL=place-image.service.js.map