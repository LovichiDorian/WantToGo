# WantToGo 🗺️

A modern, offline-first Progressive Web App (PWA) for saving places you want to visit. Capture GPS locations, add notes and photos, and view all your saved places on an interactive map.

![WantToGo](https://img.shields.io/badge/PWA-Ready-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-19.x-blue)
![NestJS](https://img.shields.io/badge/NestJS-11.x-red)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [PWA Features](#-pwa-features)

## ✨ Features

### Core Features
- 📍 **Place Management**: Create, edit, and delete places with name, notes, GPS coordinates, and photos
- 🗺️ **Interactive Map**: View all saved places on a Leaflet-powered OpenStreetMap
- 📸 **Photo Capture**: Take photos with camera or upload from gallery
- 📱 **Installable PWA**: Install on any device like a native app
- 🌐 **Bilingual**: Full support for English and French

### Offline-First Architecture
- 💾 **IndexedDB Storage**: All data stored locally for instant access
- 🔄 **Background Sync**: Automatic synchronization when online
- 📶 **Offline Indicator**: Clear visual feedback when offline
- 🔀 **Sync Queue**: Pending changes tracked and synced automatically

### Progressive Web App
- ⚡ **Service Worker**: Advanced caching strategies for fast loading
- 📲 **Install Prompt**: Custom installation experience
- 🔔 **Update Notifications**: Seamless app updates
- 🎨 **Theme Support**: Light, dark, and system themes

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Map**: Leaflet + React-Leaflet
- **State**: React hooks + IndexedDB (idb library)
- **i18n**: react-i18next
- **Router**: React Router 7

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Validation**: class-validator

### PWA
- **Service Worker**: Custom with caching strategies
- **Storage**: IndexedDB for offline data
- **Sync**: Background Sync API

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend PWA                         │
├─────────────────────────────────────────────────────────────┤
│  React App ──► IndexedDB ──► Sync Queue ──► Service Worker  │
│       │              │              │              │         │
│       ▼              ▼              ▼              ▼         │
│   UI State      Local Data    Pending Ops     Caching       │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Background Sync / Online
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend API                           │
├─────────────────────────────────────────────────────────────┤
│  NestJS ──► Prisma ──► PostgreSQL                           │
│      │          │           │                                │
│      ▼          ▼           ▼                                │
│  REST API    ORM Layer   Database                           │
└─────────────────────────────────────────────────────────────┘
```

### Sync Flow
1. User creates/updates/deletes a place
2. Change saved to IndexedDB immediately (optimistic UI)
3. Change added to sync queue
4. When online, Background Sync triggers
5. Server processes bulk sync request
6. ID mappings returned for new items
7. Local state reconciled with server

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LovichiDorian/WantToGo.git
   cd WantToGo
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## 💻 Development

### Backend Commands
```bash
# Start development server with hot reload
npm run start:dev

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Build for production
npm run build

# Run tests
npm run test
```

### Frontend Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/wanttogo?schema=public"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001/api
```

## 🌍 Deployment

### Frontend (Nginx)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Nginx configuration** (`/etc/nginx/sites-available/wanttogo`)
   ```nginx
   server {
       listen 80;
       server_name wanttogo.dorianlovichi.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name wanttogo.dorianlovichi.com;

       ssl_certificate /etc/letsencrypt/live/wanttogo.dorianlovichi.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/wanttogo.dorianlovichi.com/privkey.pem;

       root /var/www/wanttogo/frontend/dist;
       index index.html;

       # PWA: Service Worker must be at root
       location /sw.js {
           add_header Cache-Control "no-cache";
           add_header Service-Worker-Allowed "/";
           try_files $uri =404;
       }

       # PWA: Manifest
       location /manifest.json {
           add_header Cache-Control "no-cache";
           try_files $uri =404;
       }

       # Static assets - long cache
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # SPA fallback
       location / {
           try_files $uri $uri/ /index.html;
           # Important: Don't cache index.html
           add_header Cache-Control "no-cache";
       }
   }
   ```

### Backend (Nginx Reverse Proxy)

```nginx
server {
    listen 80;
    server_name api.wanttogo.dorianlovichi.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.wanttogo.dorianlovichi.com;

    ssl_certificate /etc/letsencrypt/live/api.wanttogo.dorianlovichi.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.wanttogo.dorianlovichi.com/privkey.pem;

    # API proxy
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploaded files
    location /uploads/ {
        alias /var/www/wanttogo/backend/uploads/;
        expires 1d;
        add_header Cache-Control "public";
    }
}
```

### Production Backend with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Build backend
cd backend
npm run build

# Start with PM2
pm2 start dist/main.js --name wanttogo-api

# Save PM2 config
pm2 save
pm2 startup
```

## 📚 API Reference

### Places

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/places` | List all places |
| GET | `/api/places/:id` | Get a place |
| POST | `/api/places` | Create a place |
| PUT | `/api/places/:id` | Update a place |
| DELETE | `/api/places/:id` | Delete a place |

### Sync

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sync/bulk` | Process bulk sync |
| GET | `/api/sync/changes?since=` | Get changes since timestamp |

### Photos

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/places/:id/photos` | Upload photo |
| DELETE | `/api/places/:id/photos/:photoId` | Delete photo |

### Request/Response Examples

**Create Place**
```json
POST /api/places
{
  "name": "Eiffel Tower",
  "latitude": 48.8584,
  "longitude": 2.2945,
  "address": "Champ de Mars, Paris",
  "notes": "Visit at sunset!",
  "tripDate": "2026-06-15"
}
```

**Bulk Sync**
```json
POST /api/sync/bulk
{
  "actions": [
    {
      "actionType": "create",
      "entityType": "place",
      "clientId": "temp-123",
      "payload": { "name": "...", "latitude": 48.8, "longitude": 2.3 },
      "timestamp": "2026-01-29T12:00:00Z"
    }
  ],
  "lastSyncedAt": "2026-01-28T00:00:00Z"
}
```

## 📱 PWA Features

### Service Worker Caching Strategies

| Resource | Strategy | Cache Name |
|----------|----------|------------|
| App Shell | Cache First | wanttogo-shell-v1 |
| Static Assets | Cache First | wanttogo-static-v1 |
| API Requests | Network First | wanttogo-api-v1 |
| Map Tiles | Cache First | wanttogo-tiles-v1 |

### Background Sync

The app uses the Background Sync API to queue offline operations:

1. User performs action while offline
2. Action added to IndexedDB sync queue
3. Service Worker registers sync event
4. When online, sync event fires
5. All queued actions sent to server

### Install Experience

- Custom install button in header
- Detects if already installed
- Works on iOS, Android, and Desktop

## 🔒 Security Considerations

- HTTPS required for PWA features
- CORS configured for frontend origin
- Input validation with class-validator
- SQL injection protection via Prisma
- Photo uploads validated and size-limited

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

---

Built with ❤️ by Dorian Lovichi
