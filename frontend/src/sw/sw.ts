/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_VERSION = 'v1';
const SHELL_CACHE = `wanttogo-shell-${CACHE_VERSION}`;
const STATIC_CACHE = `wanttogo-static-${CACHE_VERSION}`;
const API_CACHE = `wanttogo-api-${CACHE_VERSION}`;
const TILES_CACHE = `wanttogo-tiles-${CACHE_VERSION}`;

// Assets to precache during install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - precache shell assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      console.log('[SW] Precaching shell assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Delete old version caches
            return (
              name.startsWith('wanttogo-') &&
              !name.includes(CACHE_VERSION)
            );
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - apply caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Map tiles - Cache First (OpenStreetMap)
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(cacheFirst(request, TILES_CACHE));
    return;
  }

  // Static assets (JS, CSS, images) - Cache First
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff|woff2)$/) ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // HTML and other navigation - Network First with shell fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, SHELL_CACHE).catch(() => {
        return caches.match('/index.html') as Promise<Response>;
      })
    );
    return;
  }

  // Default - Network First
  event.respondWith(networkFirst(request, SHELL_CACHE));
});

// Cache First strategy
async function cacheFirst(request: Request, cacheName: string): Promise<Response> {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first fetch failed:', error);
    throw error;
  }
}

// Network First strategy
async function networkFirst(request: Request, cacheName: string): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Sync event:', event.tag);
  
  if (event.tag === 'place-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

async function performBackgroundSync(): Promise<void> {
  console.log('[SW] Performing background sync...');
  
  // Notify all clients to perform sync
  const clients = await self.clients.matchAll();
  
  for (const client of clients) {
    client.postMessage({
      type: 'SYNC_REQUESTED',
    });
  }
}

// Message handler for skip waiting and other commands
self.addEventListener('message', (event) => {
  const { type } = event.data || {};
  
  if (type === 'SKIP_WAITING') {
    console.log('[SW] Skipping waiting...');
    self.skipWaiting();
  }
});

// Push notifications (optional feature)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options: NotificationOptions = {
    body: data.body || 'You have a notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'WantToGo', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Focus existing window if available
      for (const client of clients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      return self.clients.openWindow(url);
    })
  );
});

export {};
