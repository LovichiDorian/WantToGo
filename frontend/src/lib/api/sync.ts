import { apiRequest } from './client';
import type { BulkSyncRequest, BulkSyncResponse, Place } from '../types';

/**
 * Send bulk sync request to the server
 */
export async function bulkSync(request: BulkSyncRequest): Promise<BulkSyncResponse> {
  return apiRequest<BulkSyncResponse>('/sync/bulk', {
    method: 'POST',
    body: JSON.stringify(request),
    timeout: 30000, // Longer timeout for sync operations
  });
}

/**
 * Get changes since a given timestamp
 */
export async function getChangesSince(since?: string): Promise<Place[]> {
  const query = since ? `?since=${encodeURIComponent(since)}` : '';
  return apiRequest<Place[]>(`/sync/changes${query}`);
}
