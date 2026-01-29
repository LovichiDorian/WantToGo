import { useState, useEffect, useCallback } from 'react';
import type { Friend } from '@/lib/types';
import * as friendsDB from '@/lib/db/friends';
import * as friendsAPI from '@/lib/api/friends';
import { useOnlineStatus } from '@/features/offline/hooks/useOnlineStatus';

interface UseFriendsReturn {
  friends: Friend[];
  isLoading: boolean;
  addFriendByCode: (shareCode: string) => Promise<Friend>;
  deleteFriend: (id: string) => Promise<void>;
  refreshFriends: () => Promise<void>;
}

/**
 * Hook to manage friends and their places
 */
export function useFriends(): UseFriendsReturn {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isOnline = useOnlineStatus();

  // Load friends from IndexedDB
  const loadFriends = useCallback(async () => {
    try {
      const dbFriends = await friendsDB.getAllFriends();
      setFriends(dbFriends);
    } catch (err) {
      console.error('Failed to load friends:', err);
    }
  }, []);

  // Refresh friend's places from server
  const refreshFriendFromServer = useCallback(async (friend: Friend) => {
    if (!isOnline) return friend;
    try {
      const data = await friendsAPI.getFriendPlaces(friend.id); // friend.id is the shareCode
      const updatedFriend: Friend = {
        ...friend,
        name: data.name,
        places: data.places,
      };
      await friendsDB.updateFriend(friend.id, updatedFriend);
      return updatedFriend;
    } catch (err) {
      console.error('Failed to refresh friend:', err);
      return friend;
    }
  }, [isOnline]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadFriends();
      setIsLoading(false);
    };
    init();
  }, [loadFriends]);

  // Refresh all friends from server when online
  useEffect(() => {
    if (!isOnline || friends.length === 0) return;
    
    const refreshAll = async () => {
      const updated = await Promise.all(friends.map(refreshFriendFromServer));
      setFriends(updated);
    };
    
    refreshAll();
  }, [isOnline]); // Only run when online status changes

  // Add a friend by their share code
  const addFriendByCode = useCallback(
    async (shareCode: string): Promise<Friend> => {
      // Check if already added
      const existing = friends.find(f => f.id === shareCode);
      if (existing) {
        throw new Error('Friend already added');
      }

      // Fetch friend's data from server
      const data = await friendsAPI.getFriendPlaces(shareCode);
      
      // Save to local DB (use shareCode as id for future refreshes)
      const newFriend = await friendsDB.addFriend(data.name, data.places, shareCode);
      
      setFriends((prev) => [newFriend, ...prev]);
      return newFriend;
    },
    [friends]
  );

  // Delete a friend
  const deleteFriend = useCallback(
    async (id: string): Promise<void> => {
      await friendsDB.deleteFriend(id);
      setFriends((prev) => prev.filter((f) => f.id !== id));
    },
    []
  );

  // Refresh friends from server
  const refreshFriends = useCallback(async () => {
    await loadFriends();
    if (isOnline && friends.length > 0) {
      const updated = await Promise.all(friends.map(refreshFriendFromServer));
      setFriends(updated);
    }
  }, [loadFriends, isOnline, friends, refreshFriendFromServer]);

  return {
    friends,
    isLoading,
    addFriendByCode,
    deleteFriend,
    refreshFriends,
  };
}
