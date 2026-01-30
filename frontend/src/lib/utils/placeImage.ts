/**
 * Generate a tourist-style image URL for a place using Unsplash Source
 * This is free and doesn't require an API key
 */

// Cache for image URLs to avoid regenerating
const imageCache = new Map<string, string>();

/**
 * Get a consistent image URL for a place based on its name
 * Uses Unsplash Source for free, high-quality travel photos
 */
export function getPlaceImageUrl(
  placeName: string,
  options: {
    width?: number;
    height?: number;
  } = {}
): string {
  const { width = 800, height = 600 } = options;
  
  // Create a cache key
  const cacheKey = `${placeName}-${width}x${height}`;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }
  
  // Clean and prepare search terms
  const searchTerms = cleanPlaceName(placeName);
  
  // Use Unsplash Source API (free, no API key needed)
  // Adding a unique sig based on place name ensures consistent images for the same place
  const sig = hashCode(placeName);
  const url = `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(searchTerms)}&sig=${sig}`;
  
  imageCache.set(cacheKey, url);
  return url;
}

/**
 * Get a thumbnail image URL (smaller size for list views)
 */
export function getPlaceThumbnailUrl(placeName: string): string {
  return getPlaceImageUrl(placeName, { width: 400, height: 300 });
}

/**
 * Get a hero image URL (larger size for detail views)
 */
export function getPlaceHeroUrl(placeName: string): string {
  return getPlaceImageUrl(placeName, { width: 1200, height: 800 });
}

/**
 * Clean place name to create better search terms
 */
function cleanPlaceName(name: string): string {
  // Remove common words that don't help with image search
  const stopWords = ['le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'the', 'a', 'an', 'of', 'in'];
  
  const words = name
    .toLowerCase()
    .replace(/[^a-zA-ZÀ-ÿ\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  // Add "travel" or "tourism" to get better results
  const searchTerms = [...words, 'travel', 'landmark'].slice(0, 4).join(',');
  
  return searchTerms || 'travel,destination';
}

/**
 * Simple hash function to generate consistent numbers from strings
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
