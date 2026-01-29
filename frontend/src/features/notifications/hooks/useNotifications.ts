import { useState, useEffect, useCallback } from 'react';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface UseNotificationsReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => void;
  showSyncNotification: (count: number) => void;
  showPlaceAddedNotification: (placeName: string) => void;
  showFriendAddedNotification: (friendName: string) => void;
}

/**
 * Hook to manage local notifications
 */
export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const isSupported = 'Notification' in window;

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch {
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== 'granted') return;

      // Use service worker notification if available (better for PWA)
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            ...options,
          });
        });
      } else {
        // Fallback to regular notification
        new Notification(title, {
          icon: '/icons/icon-192x192.png',
          ...options,
        });
      }
    },
    [isSupported, permission]
  );

  const showSyncNotification = useCallback(
    (count: number) => {
      showNotification('Synchronisation terminée', {
        body: `${count} modification(s) synchronisée(s) avec succès`,
        tag: 'sync-complete',
      });
    },
    [showNotification]
  );

  const showPlaceAddedNotification = useCallback(
    (placeName: string) => {
      showNotification('Lieu ajouté', {
        body: `"${placeName}" a été ajouté à votre carte`,
        tag: 'place-added',
      });
    },
    [showNotification]
  );

  const showFriendAddedNotification = useCallback(
    (friendName: string) => {
      showNotification('Ami ajouté', {
        body: `${friendName} est maintenant votre ami`,
        tag: 'friend-added',
      });
    },
    [showNotification]
  );

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    showSyncNotification,
    showPlaceAddedNotification,
    showFriendAddedNotification,
  };
}
