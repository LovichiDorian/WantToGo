import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'manifest.json'],
      manifest: false, // We use our own manifest.json in public/
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Force le nouveau SW à prendre le contrôle immédiatement
        skipWaiting: true,
        clientsClaim: true,
        // Nettoie les anciens caches au démarrage
        cleanupOutdatedCaches: true,
        // Précache navigations
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          // Tuiles de carte OpenStreetMap - Cache First (30 jours)
          {
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wanttogo-tiles-v2',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Google Fonts CSS - Stale While Revalidate
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          // Google Fonts Files - Cache First (1 an)
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // API calls - Network First avec fallback cache
          {
            urlPattern: /\/api\/(places|friends|auth\/me).*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'wanttogo-api-data-v2',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
              backgroundSync: {
                name: 'wanttogo-api-queue',
                options: {
                  maxRetentionTime: 24 * 60, // 24 hours in minutes
                },
              },
            },
          },
          // API mutations (POST, PUT, DELETE) - Network Only avec Background Sync
          {
            urlPattern: /\/api\/(places|friends|sync).*/i,
            method: 'POST',
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'wanttogo-post-queue',
                options: {
                  maxRetentionTime: 24 * 60,
                },
              },
            },
          },
          {
            urlPattern: /\/api\/(places|friends).*/i,
            method: 'PUT',
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'wanttogo-put-queue',
                options: {
                  maxRetentionTime: 24 * 60,
                },
              },
            },
          },
          {
            urlPattern: /\/api\/(places|friends).*/i,
            method: 'DELETE',
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'wanttogo-delete-queue',
                options: {
                  maxRetentionTime: 24 * 60,
                },
              },
            },
          },
          // Images uploadées - Cache First
          {
            urlPattern: /\/uploads\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wanttogo-uploads-v1',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Make env vars available at build time
    // Use relative /api path for production (nginx proxy), or localhost for dev
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || '/api'),
  },
  build: {
    // Ensure service worker is properly built
    target: 'esnext',
    // Enable source maps for debugging
    sourcemap: true,
  },
  worker: {
    format: 'es',
  },
  server: {
    // Proxy API requests in development
    proxy: {
      '/api': {
        target: 'http://localhost:3010',
        changeOrigin: true,
      },
    },
  },
})
