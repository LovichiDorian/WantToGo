/**
 * Web Worker for heavy computations like filtering and searching places
 * Runs in a separate thread to avoid blocking the main UI
 */

import type { Place } from '@/lib/types';

// Message types
interface SearchMessage {
  type: 'search';
  places: Place[];
  query: string;
}

interface FilterMessage {
  type: 'filter';
  places: Place[];
  filters: {
    hasTripDate?: boolean;
    syncStatus?: 'synced' | 'pending' | 'conflict';
    dateRange?: { start: string; end: string };
  };
}

interface SortMessage {
  type: 'sort';
  places: Place[];
  sortBy: 'name' | 'createdAt' | 'tripDate' | 'distance';
  order: 'asc' | 'desc';
  userLocation?: { lat: number; lng: number };
}

interface ClusterMessage {
  type: 'cluster';
  places: Place[];
  zoom: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

type WorkerMessage = SearchMessage | FilterMessage | SortMessage | ClusterMessage;

// Response types
interface SearchResult {
  type: 'search-result';
  places: Place[];
  query: string;
}

interface FilterResult {
  type: 'filter-result';
  places: Place[];
}

interface SortResult {
  type: 'sort-result';
  places: Place[];
}

interface ClusterResult {
  type: 'cluster-result';
  clusters: Array<{
    lat: number;
    lng: number;
    count: number;
    places: Place[];
  }>;
}

type WorkerResult = SearchResult | FilterResult | SortResult | ClusterResult;

// Search function with relevance scoring
function searchPlaces(places: Place[], query: string): Place[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return places;
  }

  const terms = normalizedQuery.split(/\s+/);

  const scored = places.map((place) => {
    let score = 0;
    const name = place.name.toLowerCase();
    const address = (place.address || '').toLowerCase();
    const notes = (place.notes || '').toLowerCase();

    for (const term of terms) {
      // Exact match in name = highest score
      if (name === term) score += 100;
      else if (name.startsWith(term)) score += 50;
      else if (name.includes(term)) score += 25;

      // Match in address
      if (address.includes(term)) score += 15;

      // Match in notes
      if (notes.includes(term)) score += 10;
    }

    return { place, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.place);
}

// Filter function
function filterPlaces(
  places: Place[],
  filters: FilterMessage['filters']
): Place[] {
  return places.filter((place) => {
    if (filters.hasTripDate !== undefined) {
      if (filters.hasTripDate && !place.tripDate) return false;
      if (!filters.hasTripDate && place.tripDate) return false;
    }

    if (filters.syncStatus && place.syncStatus !== filters.syncStatus) {
      return false;
    }

    if (filters.dateRange && place.tripDate) {
      const tripDate = new Date(place.tripDate).getTime();
      const start = new Date(filters.dateRange.start).getTime();
      const end = new Date(filters.dateRange.end).getTime();
      if (tripDate < start || tripDate > end) return false;
    }

    return true;
  });
}

// Calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Sort function
function sortPlaces(
  places: Place[],
  sortBy: SortMessage['sortBy'],
  order: SortMessage['order'],
  userLocation?: { lat: number; lng: number }
): Place[] {
  const sorted = [...places].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;

      case 'createdAt':
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;

      case 'tripDate':
        if (!a.tripDate && !b.tripDate) comparison = 0;
        else if (!a.tripDate) comparison = 1;
        else if (!b.tripDate) comparison = -1;
        else
          comparison =
            new Date(a.tripDate).getTime() - new Date(b.tripDate).getTime();
        break;

      case 'distance':
        if (!userLocation) {
          comparison = 0;
        } else {
          const distA = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            a.latitude,
            a.longitude
          );
          const distB = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            b.latitude,
            b.longitude
          );
          comparison = distA - distB;
        }
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

// Simple clustering for map markers
function clusterPlaces(
  places: Place[],
  zoom: number,
  bounds: ClusterMessage['bounds']
): ClusterResult['clusters'] {
  // Filter places within bounds
  const visiblePlaces = places.filter(
    (p) =>
      p.latitude >= bounds.south &&
      p.latitude <= bounds.north &&
      p.longitude >= bounds.west &&
      p.longitude <= bounds.east
  );

  // At high zoom levels, don't cluster
  if (zoom >= 14) {
    return visiblePlaces.map((p) => ({
      lat: p.latitude,
      lng: p.longitude,
      count: 1,
      places: [p],
    }));
  }

  // Simple grid-based clustering
  const gridSize = 0.1 / Math.pow(2, zoom - 10); // Adjust based on zoom
  const clusters: Map<string, { lat: number; lng: number; places: Place[] }> =
    new Map();

  for (const place of visiblePlaces) {
    const gridX = Math.floor(place.longitude / gridSize);
    const gridY = Math.floor(place.latitude / gridSize);
    const key = `${gridX}:${gridY}`;

    if (clusters.has(key)) {
      clusters.get(key)!.places.push(place);
    } else {
      clusters.set(key, {
        lat: place.latitude,
        lng: place.longitude,
        places: [place],
      });
    }
  }

  // Calculate cluster centers
  return Array.from(clusters.values()).map((cluster) => {
    const avgLat =
      cluster.places.reduce((sum, p) => sum + p.latitude, 0) /
      cluster.places.length;
    const avgLng =
      cluster.places.reduce((sum, p) => sum + p.longitude, 0) /
      cluster.places.length;

    return {
      lat: avgLat,
      lng: avgLng,
      count: cluster.places.length,
      places: cluster.places,
    };
  });
}

// Message handler
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;
  let result: WorkerResult;

  switch (message.type) {
    case 'search':
      result = {
        type: 'search-result',
        places: searchPlaces(message.places, message.query),
        query: message.query,
      };
      break;

    case 'filter':
      result = {
        type: 'filter-result',
        places: filterPlaces(message.places, message.filters),
      };
      break;

    case 'sort':
      result = {
        type: 'sort-result',
        places: sortPlaces(
          message.places,
          message.sortBy,
          message.order,
          message.userLocation
        ),
      };
      break;

    case 'cluster':
      result = {
        type: 'cluster-result',
        clusters: clusterPlaces(message.places, message.zoom, message.bounds),
      };
      break;
  }

  self.postMessage(result);
};

export {};
