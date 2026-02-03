/**
 * Fallback image utilities for places
 * The real images come from the backend API (Unsplash)
 * These are only used as fallbacks when API fails or place is not synced
 */

import fallbackCityImg from '@/assets/fallback-city.jpg';

/**
 * Get a fallback image URL for a place
 * Returns the local fallback image
 * @param _placeName - ignored, kept for compatibility
 */
export function getPlaceImageUrl(_placeName?: string): string {
  return fallbackCityImg;
}

/**
 * Get a thumbnail image URL (fallback for list views)
 * @param _placeName - ignored, kept for compatibility
 */
export function getPlaceThumbnailUrl(_placeName?: string): string {
  return fallbackCityImg;
}

/**
 * Get a hero image URL (fallback for detail views)
 * @param _placeName - ignored, kept for compatibility
 */
export function getPlaceHeroUrl(_placeName?: string): string {
  return fallbackCityImg;
}
