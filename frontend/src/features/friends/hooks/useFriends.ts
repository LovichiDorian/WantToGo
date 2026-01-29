import { useState, useEffect, useCallback } from 'react';
import type { Friend } from '@/lib/types';
import * as friendsDB from '@/lib/db/friends';
import * as friendsAPI from '@/lib/api/friends';
import { useOnlineStatus } from '@/features/offline/hooks/useOnlineStatus';
import { useAuth } from '@/features/auth/AuthContext';

interface UseFriendsReturn {
  friends: Friend[];
  isLoading: boolean;
  addFriendByCode: (shareCode: string) => Promise<Friend>;
  deleteFriend: (id: string) => Promise<void>;
  refreshFriends: () => Promise<void>;
}

/**
 * Hook to manage friends and their places
 * Synchronizes with server when online, uses IndexedDB as cache
 */
export function useFriends(): UseFriendsReturn {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isOnline = useOnlineStatus();
  const { isAuthenticated } = useAuth();

  // Load friends from server or IndexedDB
  const loadFriends = useCallback(async () => {
    try {
      if (isOnline && isAuthenticated) {
        // Fetch from server
        const serverFriends = await friendsAPI.getFriends();
        
        // Convert to local Friend format and save to IndexedDB
        const localFriends: Friend[] = serverFriends.map((sf) => ({
          id: sf.id, // Use server friendship ID
          name: sf.friendName,
          color: sf.color,
          places: sf.places,
          shareCode: sf.friendCode,
          addedAt: new Date(sf.createdAt),
        }));
        
        // Sync with IndexedDB
        await friendsDB.syncFriends(localFriends);
        setFriends(localFriends);
      } else {
        // Load from IndexedDB when offline
        const dbFriends = await friendsDB.getAllFriends();
        setFriends(dbFriends);
      }
    } catch (err) {
      console.error('Failed to load friends:', err);
      // Fallback to IndexedDB
      try {
        const dbFriends = await friendsDB.getAllFriends();
        setFriends(dbFriends);
      } catch {
        console.error('Failed to load friends from IndexedDB');
      }
    }
  }, [isOnline, isAuthenticated]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadFriends();
      setIsLoading(false);
    };
    init();
  }, [loadFriends]);

  // Add a friend by their share code
  const addFriendByCode = useCallback(
    async (shareCode: string): Promise<Friend> => {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add friends');
      }

      // Add friend via API
      const serverFriend = await friendsAPI.addFriend(shareCode);
      
      // Convert to local format
      const newFriend: Friend = {
        id: serverFriend.id,
        name: serverFriend.friendName,
        color: serverFriend.color,
        places: serverFriend.places,
        shareCode: serverFriend.friendCode,
        addedAt: new Date(serverFriend.createdAt),
      };
      
      // Save to IndexedDB
      await friendsDB.saveFriend(newFriend);
      
      setFriends((prev) => [newFriend, ...prev]);
      return newFriend;
    },
    [isAuthenticated]
  );

  // Delete a friend
  const deleteFriend = useCallback(
    async (id: string): Promise<void> => {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove friends');
      }

      // Delete via API
      await friendsAPI.deleteFriend(id);
      
      // Delete from IndexedDB
      await friendsDB.deleteFriend(id);
      
      setFriends((prev) => prev.filter((f) => f.id !== id));
    },
    [isAuthenticated]
  );

  // Refresh friends from server
  const refreshFriends = useCallback(async () => {
    setIsLoading(true);
    await loadFriends();
    setIsLoading(false);
  }, [loadFriends]);

  return {
    friends,
    isLoading,
    addFriendByCode,
    deleteFriend,
    refreshFriends,
  };
}
