# 🚀 WantToGo 2.0 - Deployment Guide

## Quick Deploy (2 minutes!)

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Set environment variables in Vercel dashboard:
# VITE_API_URL=https://your-backend-url/api
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

### Docker (Self-hosted)
```bash
# Frontend
docker build -t wanttogo-frontend ./frontend
docker run -p 3000:80 wanttogo-frontend

# Backend
docker build -t wanttogo-backend ./backend
docker run -p 3010:3010 -e DATABASE_URL="..." wanttogo-backend
```

---

## 📋 Prerequisites

### Frontend
- Node.js 20+
- npm or pnpm

### Backend
- Node.js 20+
- PostgreSQL 15+
- Redis (optional, for caching)

---

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=/api                    # API endpoint (use /api for same-domain)
```

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/wanttogo"

# Auth
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRATION="7d"

# Optional: AI Assistant
OPENAI_API_KEY="sk-..."

# Optional: Booking.com Affiliate
BOOKING_AFFILIATE_ID="..."

# Optional: Stripe (Premium)
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## 🗄️ Database Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed gamification data (achievements, etc.)
npx prisma db seed
```

---

## 🏗️ Build Commands

### Frontend
```bash
cd frontend
npm install
npm run build     # Creates optimized build in /dist
npm run preview   # Preview production build locally
```

### Backend
```bash
cd backend
npm install
npm run build     # Compiles TypeScript to /dist
npm run start:prod
```

---

## 🌐 Nginx Configuration

### Frontend (SPA + PWA)
```nginx
server {
    listen 80;
    server_name wanttogo.app;
    root /var/www/wanttogo/frontend/dist;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Service worker - no cache
    location = /sw.js {
        add_header Cache-Control "no-cache";
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API to backend
    location /api {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📱 PWA Requirements

1. **HTTPS Required** - PWA features require secure context
2. **Icons** - Ensure all icon sizes exist in `/public/icons/`
3. **Manifest** - Customize `/public/manifest.json` with your branding

### Generate PWA Icons
```bash
# Using sharp-cli
npx sharp-cli resize icon-1024.png -o icons/icon-512x512.png -w 512 -h 512
npx sharp-cli resize icon-1024.png -o icons/icon-192x192.png -w 192 -h 192
# ... etc for all sizes
```

---

## 🎮 Gamification Seeds

The `seed-gamification.sql` contains all achievements and XP configurations:

```bash
cd backend
psql $DATABASE_URL < prisma/seed-gamification.sql
```

---

## 📊 Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 95+ |
| Lighthouse PWA | 100 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Bundle Size (gzipped) | < 150kb |

---

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] JWT secret is strong (32+ chars)
- [ ] Rate limiting on API
- [ ] Input validation on all endpoints
- [ ] XSS protection headers
- [ ] CSRF tokens for mutations

---

## 🐛 Troubleshooting

### PWA not installing?
1. Check HTTPS is enabled
2. Verify manifest.json is valid
3. Check service worker registration in console
4. Icons must be PNG and correct sizes

### Offline not working?
1. Clear site data and reload
2. Check service worker in DevTools > Application
3. Verify workbox configuration in vite.config.ts

### XP not syncing?
1. Check network tab for API errors
2. Verify JWT token is valid
3. Check backend logs for errors

---

## 🚀 CI/CD Example (GitHub Actions)

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install & Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

---

## 📞 Support

- **Documentation**: [docs.wanttogo.app](https://docs.wanttogo.app)
- **Discord**: [discord.gg/wanttogo](https://discord.gg/wanttogo)
- **Email**: support@wanttogo.app

---

Built with ❤️ using React 19, Vite, Tailwind CSS 4, and Framer Motion
