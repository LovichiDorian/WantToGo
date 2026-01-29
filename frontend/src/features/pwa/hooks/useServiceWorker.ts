import { useState, useEffect, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

type ServiceWorkerState = 'pending' | 'installed' | 'activated' | 'error';

interface UseServiceWorkerReturn {
  isActive: boolean;
  isUpdateAvailable: boolean;
  state: ServiceWorkerState;
  updateServiceWorker: () => void;
}

// Intervalle de vérification des mises à jour (toutes les 60 secondes)
const UPDATE_CHECK_INTERVAL = 60 * 1000;

/**
 * Hook to manage Service Worker lifecycle and updates using vite-plugin-pwa
 * Mode autoUpdate: les mises à jour sont appliquées automatiquement
 */
export function useServiceWorker(): UseServiceWorkerReturn {
  const [state, setState] = useState<ServiceWorkerState>('pending');

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW({
    // Vérifie les mises à jour périodiquement
    onRegisteredSW(swUrl, registration) {
      console.log('[App] Service Worker registered:', swUrl);
      if (registration) {
        setState('installed');
        
        // Vérifie les mises à jour périodiquement
        setInterval(() => {
          console.log('[App] Checking for SW updates...');
          registration.update();
        }, UPDATE_CHECK_INTERVAL);
      }
    },
    onRegisterError(error) {
      console.error('[App] Service Worker registration failed:', error);
      setState('error');
    },
    onNeedRefresh() {
      console.log('[App] New version available, reloading...');
      // En mode autoUpdate, on recharge automatiquement
      updateServiceWorker(true);
    },
    onOfflineReady() {
      console.log('[App] Service worker installed, app ready for offline use');
      setState('activated');
    },
  });

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setState('error');
      return;
    }

    // Listen for controller change (update applied)
    let refreshing = false;
    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true;
        console.log('[App] New SW controller, reloading page...');
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    // Listen for messages from SW
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_REQUESTED') {
        window.dispatchEvent(new CustomEvent('sw-sync-requested'));
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleUpdate = useCallback(() => {
    updateServiceWorker(true);
    setNeedRefresh(false);
  }, [updateServiceWorker, setNeedRefresh]);

  return {
    isActive: offlineReady || state === 'activated',
    isUpdateAvailable: needRefresh,
    state,
    updateServiceWorker: handleUpdate,
  };
}
