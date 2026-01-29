import { getDB } from './index';
import type { Friend, FriendPlace } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Predefined colors for friends (distinct, easy to see on map)
const FRIEND_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6366f1', // indigo
];

/**
 * Get all friends from IndexedDB
 */
export async function getAllFriends(): Promise<Friend[]> {
  const db = await getDB();
  const friends = await db.getAll('friends');
  return friends.sort((a, b) => 
    new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );
}

/**
 * Get a single friend by ID
 */
export async function getFriend(id: string): Promise<Friend | undefined> {
  const db = await getDB();
  return db.get('friends', id);
}

/**
 * Add a new friend with their places
 */
export async function addFriend(name: string, places: FriendPlace[], shareCode?: string): Promise<Friend> {
  const db = await getDB();
  const existingFriends = await db.getAll('friends');
  
  // Pick a color that's not already used, or cycle through
  const usedColors = existingFriends.map(f => f.color);
  const availableColors = FRIEND_COLORS.filter(c => !usedColors.includes(c));
  const color = availableColors.length > 0 
    ? availableColors[0] 
    : FRIEND_COLORS[existingFriends.length % FRIEND_COLORS.length];

  const friend: Friend = {
    id: shareCode || uuidv4(), // Use shareCode as ID if provided
    name,
    color,
    places: places.map(p => ({
      ...p,
      id: p.id || uuidv4(),
    })),
    addedAt: new Date().toISOString(),
  };

  await db.put('friends', friend);
  return friend;
}

/**
 * Update a friend's information
 */
export async function updateFriend(id: string, updates: Partial<Friend>): Promise<void> {
  const db = await getDB();
  const friend = await db.get('friends', id);
  
  if (friend) {
    await db.put('friends', { ...friend, ...updates });
  }
}

/**
 * Delete a friend
 */
export async function deleteFriend(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('friends', id);
}

/**
 * Get next available color for a new friend
 */
export async function getNextFriendColor(): Promise<string> {
  const db = await getDB();
  const friends = await db.getAll('friends');
  const usedColors = friends.map(f => f.color);
  const availableColors = FRIEND_COLORS.filter(c => !usedColors.includes(c));
  return availableColors.length > 0 
    ? availableColors[0] 
    : FRIEND_COLORS[friends.length % FRIEND_COLORS.length];
}
