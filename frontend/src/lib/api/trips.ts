import { apiRequest } from './client';

export interface Trip {
  id: string;
  nameEn: string;
  nameFr: string;
  description?: string;
  coverImage?: string;
  creatorId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string | null;
    email: string;
  };
  members: TripMember[];
  places?: TripPlace[];
  _count?: {
    places: number;
  };
  userRole?: 'owner' | 'editor' | 'member' | null;
}

export interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  role: 'owner' | 'editor' | 'member';
  joinedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    shareCode: string;
    level?: number;
  };
}

export interface TripPlace {
  id: string;
  tripId: string;
  placeId: string;
  addedBy?: string;
  addedAt: string;
  place: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address?: string;
    photos?: { id: string; filename: string }[];
  };
}

export interface TripsResponse {
  trips: Trip[];
  limits: {
    current: number;
    max: number | null;
    isPremium: boolean;
  };
}

export interface CreateTripData {
  nameEn: string;
  nameFr: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateTripData {
  nameEn?: string;
  nameFr?: string;
  description?: string;
  isPublic?: boolean;
}

// Get all user trips
export async function getTrips(): Promise<TripsResponse> {
  return apiRequest<TripsResponse>('/trips');
}

// Get single trip
export async function getTrip(tripId: string): Promise<Trip> {
  return apiRequest<Trip>(`/trips/${tripId}`);
}

// Create new trip
export async function createTrip(data: CreateTripData): Promise<Trip> {
  return apiRequest<Trip>('/trips', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Update trip
export async function updateTrip(tripId: string, data: UpdateTripData): Promise<Trip> {
  return apiRequest<Trip>(`/trips/${tripId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Delete trip
export async function deleteTrip(tripId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/trips/${tripId}`, {
    method: 'DELETE',
  });
}

// Add place to trip
export async function addPlaceToTrip(tripId: string, placeId: string): Promise<TripPlace> {
  return apiRequest<TripPlace>(`/trips/${tripId}/places`, {
    method: 'POST',
    body: JSON.stringify({ placeId }),
  });
}

// Remove place from trip
export async function removePlaceFromTrip(tripId: string, placeId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/trips/${tripId}/places/${placeId}`, {
    method: 'DELETE',
  });
}

// Add member to trip
export async function addMemberToTrip(
  tripId: string, 
  shareCode: string, 
  role: 'editor' | 'member' = 'member'
): Promise<TripMember> {
  return apiRequest<TripMember>(`/trips/${tripId}/members`, {
    method: 'POST',
    body: JSON.stringify({ shareCode, role }),
  });
}

// Remove member from trip
export async function removeMemberFromTrip(tripId: string, memberId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/trips/${tripId}/members/${memberId}`, {
    method: 'DELETE',
  });
}

// Leave trip
export async function leaveTrip(tripId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/trips/${tripId}/leave`, {
    method: 'POST',
  });
}
