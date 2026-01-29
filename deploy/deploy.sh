#!/bin/bash
# WantToGo Production Deployment Script
# Usage: chmod +x deploy.sh && ./deploy.sh

set -e

echo "🚀 Starting WantToGo Deployment..."

# Configuration
PROJECT_DIR="/var/www/wanttogo"
REPO_URL="https://github.com/LovichiDorian/WantToGo.git"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as appropriate user
if [ "$EUID" -eq 0 ]; then
    log_error "Don't run as root. Run as the deploy user."
    exit 1
fi

# Create project directory if it doesn't exist
if [ ! -d "$PROJECT_DIR" ]; then
    log_info "Creating project directory..."
    sudo mkdir -p "$PROJECT_DIR"
    sudo chown $USER:$USER "$PROJECT_DIR"
fi

cd "$PROJECT_DIR"

# Clone or pull repository
if [ -d ".git" ]; then
    log_info "Pulling latest changes..."
    git fetch origin
    git checkout $BRANCH
    git pull origin $BRANCH
else
    log_info "Cloning repository..."
    git clone -b $BRANCH $REPO_URL .
fi

# ==================
# Backend Deployment
# ==================

log_info "Deploying Backend..."

cd "$PROJECT_DIR/backend"

# Install dependencies
log_info "Installing backend dependencies..."
npm ci --production=false

# Generate Prisma client
log_info "Generating Prisma client..."
npx prisma generate

# Run database migrations
log_info "Running database migrations..."
npx prisma migrate deploy

# Build application
log_info "Building backend..."
npm run build

# Create uploads directory
mkdir -p uploads/photos

# Restart with PM2
log_info "Restarting backend with PM2..."
if pm2 describe wanttogo-api > /dev/null 2>&1; then
    pm2 reload wanttogo-api
else
    pm2 start "$PROJECT_DIR/deploy/ecosystem.config.js" --env production
fi

# Save PM2 configuration
pm2 save

# ===================
# Frontend Deployment
# ===================

log_info "Deploying Frontend..."

cd "$PROJECT_DIR/frontend"

# Create .env for production
if [ ! -f .env ]; then
    log_info "Creating frontend .env..."
    echo "VITE_API_URL=https://api.wanttogo.dorianlovichi.com/api" > .env
fi

# Install dependencies
log_info "Installing frontend dependencies..."
npm ci

# Build application
log_info "Building frontend..."
npm run build

# ===================
# Nginx Configuration
# ===================

log_info "Configuring Nginx..."

# Copy nginx configs if they don't exist
if [ ! -f /etc/nginx/sites-available/wanttogo-frontend ]; then
    sudo cp "$PROJECT_DIR/deploy/nginx-frontend.conf" /etc/nginx/sites-available/wanttogo-frontend
    sudo ln -sf /etc/nginx/sites-available/wanttogo-frontend /etc/nginx/sites-enabled/
fi

if [ ! -f /etc/nginx/sites-available/wanttogo-api ]; then
    sudo cp "$PROJECT_DIR/deploy/nginx-backend.conf" /etc/nginx/sites-available/wanttogo-api
    sudo ln -sf /etc/nginx/sites-available/wanttogo-api /etc/nginx/sites-enabled/
fi

# Test and reload nginx
log_info "Testing Nginx configuration..."
sudo nginx -t

log_info "Reloading Nginx..."
sudo systemctl reload nginx

# ===================
# SSL Certificates
# ===================

# Check if certificates exist, if not prompt to create
if [ ! -d "/etc/letsencrypt/live/wanttogo.dorianlovichi.com" ]; then
    log_warn "SSL certificates not found. Run the following to create them:"
    echo ""
    echo "  sudo certbot --nginx -d wanttogo.dorianlovichi.com"
    echo "  sudo certbot --nginx -d api.wanttogo.dorianlovichi.com"
    echo ""
fi

# ===================
# Final Steps
# ===================

# Create log directory
sudo mkdir -p /var/log/wanttogo
sudo chown $USER:$USER /var/log/wanttogo

log_info "✅ Deployment Complete!"
echo ""
echo "Frontend: https://wanttogo.dorianlovichi.com"
echo "API:      https://api.wanttogo.dorianlovichi.com"
echo ""
echo "Useful commands:"
echo "  pm2 logs wanttogo-api     # View backend logs"
echo "  pm2 status                # Check PM2 status"
echo "  pm2 monit                 # PM2 monitoring dashboard"
